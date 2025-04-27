
import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, getDoc, serverTimestamp, where } from 'firebase/firestore';
import { toast } from 'sonner';
import { useFacturacion } from './useFacturacion';

export interface Project {
  id: string;
  nombre: string;
  descripcion?: string;
  cliente: string;
  responsable?: string;
  presupuesto?: number;
  fechaInicio?: Date;
  fechaFin?: Date;
  estado: 'activo' | 'pendiente' | 'completado' | 'cancelado';
  createdAt: any;
  updatedAt?: any;
  rentabilidad?: number;  // New field for profitability
}

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { ingresos, gastos } = useFacturacion();

  const loadProjectsData = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const projectsRef = collection(db, "projects");
      const projectsQuery = query(projectsRef, orderBy("createdAt", "desc"));
      const projectsSnap = await getDocs(projectsQuery);
      
      const projectsData: Project[] = [];
      projectsSnap.forEach((doc) => {
        const data = doc.data();
        projectsData.push({ 
          id: doc.id, 
          nombre: data.nombre || '',
          descripcion: data.descripcion || '',
          cliente: data.cliente || '',
          responsable: data.responsable || '',
          presupuesto: data.presupuesto || 0,
          fechaInicio: data.fechaInicio ? new Date(data.fechaInicio.seconds * 1000) : undefined,
          fechaFin: data.fechaFin ? new Date(data.fechaFin.seconds * 1000) : undefined,
          estado: data.estado || 'activo',
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          rentabilidad: data.rentabilidad || 0
        });
      });
      
      // Calcular la rentabilidad actual de cada proyecto basado en ingresos y gastos
      const projectsWithFinancials = projectsData.map(project => {
        // Filtrar ingresos y gastos asociados a este proyecto
        const projectIngresos = ingresos.filter(i => i.origen === project.id)
          .reduce((sum, i) => sum + i.cantidad, 0);
        
        const projectGastos = gastos.filter(g => g.tipo === project.id)
          .reduce((sum, g) => sum + g.cantidad, 0);
        
        // Calcular rentabilidad
        const balance = projectIngresos - projectGastos;
        const rentabilidad = projectIngresos > 0 
          ? (balance / projectIngresos) * 100 
          : 0;
        
        return {
          ...project,
          rentabilidad: parseFloat(rentabilidad.toFixed(2))
        };
      });
      
      setProjects(projectsWithFinancials);
    } catch (err) {
      console.error("Error cargando proyectos:", err);
      setError("Error al cargar datos de proyectos");
    } finally {
      setLoading(false);
    }
  }, [ingresos, gastos]);

  useEffect(() => {
    loadProjectsData();
  }, [loadProjectsData]);

  const getProjectById = useCallback(async (id: string): Promise<Project | null> => {
    try {
      const projectDoc = await getDoc(doc(db, "projects", id));
      
      if (projectDoc.exists()) {
        const data = projectDoc.data();
        const project = {
          id: projectDoc.id,
          nombre: data.nombre || '',
          descripcion: data.descripcion || '',
          cliente: data.cliente || '',
          responsable: data.responsable || '',
          presupuesto: data.presupuesto || 0,
          fechaInicio: data.fechaInicio ? new Date(data.fechaInicio.seconds * 1000) : undefined,
          fechaFin: data.fechaFin ? new Date(data.fechaFin.seconds * 1000) : undefined,
          estado: data.estado || 'activo',
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          rentabilidad: data.rentabilidad || 0
        };
        
        // Calcular rentabilidad actual basada en ingresos y gastos
        const projectIngresos = ingresos.filter(i => i.origen === id)
          .reduce((sum, i) => sum + i.cantidad, 0);
        
        const projectGastos = gastos.filter(g => g.tipo === id)
          .reduce((sum, g) => sum + g.cantidad, 0);
        
        const balance = projectIngresos - projectGastos;
        const rentabilidad = projectIngresos > 0
          ? (balance / projectIngresos) * 100 
          : 0;
        
        return {
          ...project,
          rentabilidad: parseFloat(rentabilidad.toFixed(2))
        };
      }
      return null;
    } catch (err) {
      console.error("Error obteniendo proyecto:", err);
      return null; // Return null instead of throwing an error
    }
  }, [ingresos, gastos]);

  const addProject = async (data: Omit<Project, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const projectData = {
        ...data,
        createdAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, "projects"), projectData);
      toast.success("Proyecto añadido correctamente");
      await loadProjectsData();
      return { id: docRef.id, ...data };
    } catch (err) {
      console.error("Error añadiendo proyecto:", err);
      toast.error("Error al añadir el proyecto");
      throw err;
    }
  };

  const updateProject = async (id: string, data: Partial<Project>) => {
    try {
      await updateDoc(doc(db, "projects", id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      toast.success("Proyecto actualizado correctamente");
      await loadProjectsData();
      return true;
    } catch (err) {
      console.error("Error actualizando proyecto:", err);
      toast.error("Error al actualizar el proyecto");
      throw err;
    }
  };

  const deleteProject = async (id: string) => {
    try {
      // Comprobar si hay ingresos o gastos asociados al proyecto
      const projectIngresos = ingresos.filter(i => i.origen === id);
      const projectGastos = gastos.filter(g => g.tipo === id);
      
      if (projectIngresos.length > 0 || projectGastos.length > 0) {
        toast.error("No se puede eliminar un proyecto con ingresos o gastos asociados");
        return false;
      }
      
      await deleteDoc(doc(db, "projects", id));
      toast.success("Proyecto eliminado correctamente");
      await loadProjectsData();
      return true;
    } catch (err) {
      console.error("Error eliminando proyecto:", err);
      toast.error("Error al eliminar el proyecto");
      return false;
    }
  };

  // Obtener financiación del proyecto
  const getProjectFinancials = useCallback((projectId: string) => {
    const projectIngresos = ingresos.filter(i => i.origen === projectId);
    const projectGastos = gastos.filter(g => g.tipo === projectId);
    
    const totalIngresos = projectIngresos.reduce((sum, i) => sum + i.cantidad, 0);
    const totalGastos = projectGastos.reduce((sum, g) => sum + g.cantidad, 0);
    const balance = totalIngresos - totalGastos;
    
    return {
      ingresos: projectIngresos,
      gastos: projectGastos,
      totalIngresos,
      totalGastos,
      balance
    };
  }, [ingresos, gastos]);

  return {
    projects,
    loading,
    error,
    loadProjectsData,
    getProjectById,
    addProject,
    updateProject,
    deleteProject,
    getProjectFinancials
  };
}

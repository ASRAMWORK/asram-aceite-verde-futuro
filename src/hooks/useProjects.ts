import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, getDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

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

  const loadProjectsData = async () => {
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
          fechaInicio: data.fechaInicio,
          fechaFin: data.fechaFin,
          estado: data.estado || 'activo',
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          rentabilidad: data.rentabilidad || 0
        });
      });
      
      setProjects(projectsData);
    } catch (err) {
      console.error("Error cargando proyectos:", err);
      setError("Error al cargar datos de proyectos");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProjectsData();
  }, []);

  const getProjectById = useCallback(async (id: string): Promise<Project | null> => {
    try {
      const projectDoc = await getDoc(doc(db, "projects", id));
      
      if (projectDoc.exists()) {
        const data = projectDoc.data();
        return {
          id: projectDoc.id,
          nombre: data.nombre || '',
          descripcion: data.descripcion || '',
          cliente: data.cliente || '',
          responsable: data.responsable || '',
          presupuesto: data.presupuesto || 0,
          fechaInicio: data.fechaInicio,
          fechaFin: data.fechaFin,
          estado: data.estado || 'activo',
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
          rentabilidad: data.rentabilidad || 0
        };
      }
      return null;
    } catch (err) {
      console.error("Error obteniendo proyecto:", err);
      throw err;
    }
  }, []);

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

  return {
    projects,
    loading,
    error,
    loadProjectsData,
    getProjectById,
    addProject,
    updateProject,
    deleteProject
  };
}

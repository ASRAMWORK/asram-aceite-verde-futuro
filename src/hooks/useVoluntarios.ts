
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import type { Voluntario } from '@/types';

export function useVoluntarios() {
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVoluntarios = async () => {
    try {
      setLoading(true);
      setError(null);
      const voluntariosRef = collection(db, "voluntarios");
      const voluntariosQuery = query(voluntariosRef, orderBy("nombre"));
      const voluntariosSnap = await getDocs(voluntariosQuery);
      
      const voluntariosData: Voluntario[] = [];
      voluntariosSnap.forEach((doc) => {
        const data = doc.data() as Record<string, any>;
        voluntariosData.push({ 
          id: doc.id, 
          nombre: data.nombre || '',
          apellidos: data.apellidos || data.apellido || '',
          email: data.email || '',
          telefono: data.telefono || '',
          direccion: data.direccion || '',
          ciudad: data.ciudad || '',
          provincia: data.provincia || '',
          codigoPostal: data.codigoPostal || '',
          pais: data.pais || '',
          activo: data.activo ?? true,
          fechaNacimiento: data.fechaNacimiento,
          diasDisponibles: data.diasDisponibles || [],
          horasDisponibles: data.horasDisponibles || '',
          disponibilidad: data.disponibilidad || data.diasDisponibles || [],
          habilidades: data.habilidades || [],
          experiencia: data.experiencia || '',
          estado: data.estado || 'activo',
          fechaAlta: data.fechaAlta || new Date(),
          horasContribuidas: data.horasContribuidas || 0
        });
      });
      
      setVoluntarios(voluntariosData);
    } catch (err) {
      console.error("Error cargando voluntarios:", err);
      setError("Error al cargar datos de Voluntarios");
    } finally {
      setLoading(false);
    }
  };

  const addVoluntario = async (nuevoVoluntario: Omit<Voluntario, "id">) => {
    try {
      // Handle the apellidos -> apellido renaming if needed
      const voluntarioData = { 
        ...nuevoVoluntario,
        // Store timestamps in Firestore but don't include in the Voluntario type
        _createdAt: serverTimestamp(),
        _updatedAt: serverTimestamp()
      };
      
      // Ensure horasDisponibles is a string
      if (Array.isArray(voluntarioData.horasDisponibles)) {
        voluntarioData.horasDisponibles = voluntarioData.horasDisponibles.join(", ");
      }

      const docRef = await addDoc(collection(db, "voluntarios"), voluntarioData);
      
      toast.success("Voluntario añadido correctamente");
      await loadVoluntarios();
      return true;
    } catch (err) {
      console.error("Error añadiendo voluntario:", err);
      toast.error("Error al añadir el voluntario");
      return false;
    }
  };

  const updateVoluntario = async (id: string, data: Partial<Voluntario>) => {
    try {
      // Handle the apellidos -> apellido renaming if needed
      const voluntarioData: any = { 
        ...data,
        _updatedAt: serverTimestamp()
      };

      // Check for fechaAlta and convert it if needed
      if (voluntarioData.fechaAlta && !(voluntarioData.fechaAlta instanceof Date)) {
        voluntarioData.fechaAlta = new Date(voluntarioData.fechaAlta);
      }

      // Ensure horasDisponibles is a string
      if (Array.isArray(voluntarioData.horasDisponibles)) {
        voluntarioData.horasDisponibles = voluntarioData.horasDisponibles.join(", ");
      }

      await updateDoc(doc(db, "voluntarios", id), voluntarioData);
      
      toast.success("Voluntario actualizado correctamente");
      await loadVoluntarios();
      return true;
    } catch (err) {
      console.error("Error actualizando voluntario:", err);
      toast.error("Error al actualizar el voluntario");
      return false;
    }
  };

  const deleteVoluntario = async (id: string) => {
    try {
      await deleteDoc(doc(db, "voluntarios", id));
      toast.success("Voluntario eliminado correctamente");
      await loadVoluntarios();
      return true;
    } catch (err) {
      console.error("Error eliminando voluntario:", err);
      toast.error("Error al eliminar el voluntario");
      return false;
    }
  };

  useEffect(() => {
    loadVoluntarios();
  }, []);

  return {
    voluntarios,
    loading,
    error,
    loadVoluntarios,
    addVoluntario,
    updateVoluntario,
    deleteVoluntario
  };
}

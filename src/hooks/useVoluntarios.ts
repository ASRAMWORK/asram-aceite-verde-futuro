import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, where, serverTimestamp } from 'firebase/firestore';
import type { Voluntario } from '@/types';
import { toast } from 'sonner';

export function useVoluntarios() {
  const [voluntarios, setVoluntarios] = useState<Voluntario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadVoluntariosData = async () => {
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
          apellidos: data.apellidos || '',
          email: data.email || '',
          telefono: data.telefono || '',
          direccion: data.direccion || '',
          codigoPostal: data.codigoPostal || '',
          diasDisponibles: data.diasDisponibles || [],
          horasDisponibles: data.horasDisponibles || '',
          habilidades: data.habilidades || [],
          experiencia: data.experiencia || '',
          activo: data.activo ?? true,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
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

  const addVoluntario = async (data: Omit<Voluntario, "id">) => {
    try {
      const docRef = await addDoc(collection(db, "voluntarios"), {
        ...data,
        createdAt: serverTimestamp()
      });
      toast.success("Voluntario añadido correctamente");
      await loadVoluntariosData();
      return true;
    } catch (err) {
      console.error("Error al añadir voluntario:", err);
      toast.error("Error al añadir voluntario");
      return false;
    }
  };

  const updateVoluntario = async (id: string, data: Partial<Voluntario>) => {
    try {
      await updateDoc(doc(db, "voluntarios", id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      toast.success("Voluntario actualizado correctamente");
      await loadVoluntariosData();
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
      await loadVoluntariosData();
      return true;
    } catch (err) {
      console.error("Error eliminando voluntario:", err);
      toast.error("Error al eliminar el voluntario");
      return false;
    }
  };

  useEffect(() => {
    loadVoluntariosData();
  }, []);

  return { 
    voluntarios, 
    loading, 
    error, 
    loadVoluntariosData,
    addVoluntario,
    updateVoluntario,
    deleteVoluntario
  };
}

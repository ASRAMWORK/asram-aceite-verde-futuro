import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import type { Reunion } from '@/types';
import { toast } from 'sonner';

export function useReuniones() {
  const [reuniones, setReuniones] = useState<Reunion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReunionesData = async () => {
    try {
      setLoading(true);
      const reunionesRef = collection(db, "reuniones");
      const reunionesSnap = await getDocs(query(reunionesRef, orderBy("fecha")));
      
      const reunionesData: Reunion[] = [];
      reunionesSnap.forEach((doc) => {
        const data = doc.data();
        reunionesData.push({
          id: doc.id,
          titulo: data.titulo || '',
          descripcion: data.descripcion || '',
          fecha: data.fecha,
          hora: data.hora || '',
          duracion: data.duracion || 60,
          ubicacion: data.ubicacion || '',
          participantes: data.participantes || [],
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        });
      });
      
      setReuniones(reunionesData);
    } catch (err) {
      console.error("Error cargando reuniones:", err);
      setError("Error al cargar datos de reuniones");
    } finally {
      setLoading(false);
    }
  };

  const addReunion = async (data: Omit<Reunion, "id">) => {
    try {
      const docRef = await addDoc(collection(db, "reuniones"), {
        ...data,
        createdAt: serverTimestamp()
      });
      toast.success("Reunión programada correctamente");
      await loadReunionesData();
      return true;
    } catch (err) {
      console.error("Error añadiendo reunion:", err);
      toast.error("Error al programar reunión");
      return false;
    }
  };

  const updateReunion = async (id: string, data: Partial<Reunion>) => {
    try {
      await updateDoc(doc(db, "reuniones", id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      toast.success("Reunión actualizada correctamente");
      await loadReunionesData();
      return true;
    } catch (err) {
      console.error("Error actualizando reunion:", err);
      toast.error("Error al actualizar reunión");
      return false;
    }
  };

  const deleteReunion = async (id: string) => {
    try {
      await deleteDoc(doc(db, "reuniones", id));
      toast.success("Reunión eliminada correctamente");
      await loadReunionesData();
      return true;
    } catch (err) {
      console.error("Error eliminando reunion:", err);
      toast.error("Error al eliminar reunión");
      return false;
    }
  };

  useEffect(() => {
    loadReunionesData();
  }, []);

  return { 
    reuniones, 
    loading, 
    error, 
    loadReunionesData,
    addReunion,
    updateReunion,
    deleteReunion
  };
}

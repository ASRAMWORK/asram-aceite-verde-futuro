
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import type { Reunion } from '@/types';
import { toast } from 'sonner';

export function useReuniones() {
  const [reuniones, setReuniones] = useState<Reunion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReuniones = async () => {
    try {
      setLoading(true);
      const reunionesRef = collection(db, "reuniones");
      const reunionesSnap = await getDocs(query(reunionesRef, orderBy("fecha", "desc")));
      
      const reunionesData: Reunion[] = [];
      reunionesSnap.forEach((doc) => {
        reunionesData.push({ id: doc.id, ...doc.data() } as Reunion);
      });
      
      setReuniones(reunionesData);
    } catch (err) {
      console.error("Error cargando reuniones:", err);
      setError("Error al cargar datos de reuniones");
    } finally {
      setLoading(false);
    }
  };

  const addReunion = async (nuevaReunion: Omit<Reunion, 'id'>) => {
    try {
      const reunionData = {
        ...nuevaReunion,
        createdAt: serverTimestamp(),
        activa: true
      };
      
      await addDoc(collection(db, "reuniones"), reunionData);
      toast.success("Reunión creada correctamente");
      await loadReuniones();
      return true;
    } catch (err) {
      console.error("Error añadiendo reunión:", err);
      toast.error("Error al crear la reunión");
      return false;
    }
  };

  const updateReunion = async (id: string, data: Partial<Reunion>) => {
    try {
      await updateDoc(doc(db, "reuniones", id), data);
      toast.success("Reunión actualizada correctamente");
      await loadReuniones();
      return true;
    } catch (err) {
      console.error("Error actualizando reunión:", err);
      toast.error("Error al actualizar la reunión");
      return false;
    }
  };
  
  const deleteReunion = async (id: string) => {
    try {
      await deleteDoc(doc(db, "reuniones", id));
      toast.success("Reunión eliminada correctamente");
      await loadReuniones();
      return true;
    } catch (err) {
      console.error("Error eliminando reunión:", err);
      toast.error("Error al eliminar la reunión");
      return false;
    }
  };

  useEffect(() => {
    loadReuniones();
  }, []);

  return {
    reuniones,
    loading,
    error,
    loadReuniones,
    addReunion,
    updateReunion,
    deleteReunion
  };
}

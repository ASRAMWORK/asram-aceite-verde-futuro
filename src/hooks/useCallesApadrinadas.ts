
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import type { CalleApadrinada } from '@/types';
import { toast } from 'sonner';

export function useCallesApadrinadas() {
  const [callesApadrinadas, setCallesApadrinadas] = useState<CalleApadrinada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCallesApadrinadasData = async () => {
    try {
      setLoading(true);
      const callesRef = collection(db, "callesApadrinadas");
      const callesSnap = await getDocs(query(callesRef, where("activo", "==", true)));
      
      const callesData: CalleApadrinada[] = [];
      callesSnap.forEach((doc) => {
        callesData.push({ id: doc.id, ...doc.data() } as CalleApadrinada);
      });
      
      setCallesApadrinadas(callesData);
    } catch (err) {
      console.error("Error cargando calles apadrinadas:", err);
      setError("Error al cargar datos de Calles Apadrinadas");
    } finally {
      setLoading(false);
    }
  };

  const addCalleApadrinada = async (nuevaCalle: Omit<CalleApadrinada, 'id'>) => {
    try {
      const calleData = {
        ...nuevaCalle,
        activo: true,
        createdAt: serverTimestamp(),
      };
      
      await addDoc(collection(db, "callesApadrinadas"), calleData);
      toast.success("Calle apadrinada añadida correctamente");
      await loadCallesApadrinadasData();
      return true;
    } catch (err) {
      console.error("Error añadiendo calle apadrinada:", err);
      toast.error("Error al añadir la calle apadrinada");
      return false;
    }
  };

  const updateCalleApadrinada = async (id: string, data: Partial<CalleApadrinada>) => {
    try {
      await updateDoc(doc(db, "callesApadrinadas", id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      toast.success("Calle apadrinada actualizada correctamente");
      await loadCallesApadrinadasData();
      return true;
    } catch (err) {
      console.error("Error actualizando calle apadrinada:", err);
      toast.error("Error al actualizar la calle apadrinada");
      return false;
    }
  };

  const deleteCalleApadrinada = async (id: string) => {
    try {
      // Soft delete - just mark as inactive
      await updateDoc(doc(db, "callesApadrinadas", id), {
        activo: false,
        updatedAt: serverTimestamp()
      });
      toast.success("Calle apadrinada eliminada correctamente");
      await loadCallesApadrinadasData();
      return true;
    } catch (err) {
      console.error("Error eliminando calle apadrinada:", err);
      toast.error("Error al eliminar la calle apadrinada");
      return false;
    }
  };

  useEffect(() => {
    loadCallesApadrinadasData();
  }, []);

  return { 
    callesApadrinadas, 
    loading, 
    error, 
    loadCallesApadrinadasData,
    addCalleApadrinada,
    updateCalleApadrinada,
    deleteCalleApadrinada
  };
}

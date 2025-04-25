
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, where, serverTimestamp } from 'firebase/firestore';
import type { Recogida } from '@/types';
import { toast } from 'sonner';

export function useRecogidas() {
  const [recogidas, setRecogidas] = useState<Recogida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecogidasData = async () => {
    try {
      setLoading(true);
      const recogidasRef = collection(db, "recogidas");
      const recogidasSnap = await getDocs(query(recogidasRef, orderBy("fecha", "desc")));
      
      const recogidasData: Recogida[] = [];
      recogidasSnap.forEach((doc) => {
        recogidasData.push({ id: doc.id, ...doc.data() } as Recogida);
      });
      
      setRecogidas(recogidasData);
    } catch (err) {
      console.error("Error cargando recogidas:", err);
      setError("Error al cargar datos de recogidas");
    } finally {
      setLoading(false);
    }
  };
  
  const addRecogida = async (nuevaRecogida: Omit<Recogida, 'id'>) => {
    try {
      const recogidaData = {
        ...nuevaRecogida,
        completada: false,
        createdAt: serverTimestamp(),
      };
      
      await addDoc(collection(db, "recogidas"), recogidaData);
      toast.success("Recogida programada correctamente");
      await loadRecogidasData();
      return true;
    } catch (err) {
      console.error("Error añadiendo recogida:", err);
      toast.error("Error al programar la recogida");
      return false;
    }
  };
  
  const updateRecogida = async (id: string, data: Partial<Recogida>) => {
    try {
      await updateDoc(doc(db, "recogidas", id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      toast.success("Recogida actualizada correctamente");
      await loadRecogidasData();
      return true;
    } catch (err) {
      console.error("Error actualizando recogida:", err);
      toast.error("Error al actualizar la recogida");
      return false;
    }
  };
  
  const completeRecogida = async (id: string, litrosRecogidos: number) => {
    try {
      await updateDoc(doc(db, "recogidas", id), {
        completada: true,
        litrosRecogidos,
        fechaCompletada: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success("Recogida completada correctamente");
      await loadRecogidasData();
      return true;
    } catch (err) {
      console.error("Error completando recogida:", err);
      toast.error("Error al completar la recogida");
      return false;
    }
  };
  
  const deleteRecogida = async (id: string) => {
    try {
      await deleteDoc(doc(db, "recogidas", id));
      toast.success("Recogida eliminada correctamente");
      await loadRecogidasData();
      return true;
    } catch (err) {
      console.error("Error eliminando recogida:", err);
      toast.error("Error al eliminar la recogida");
      return false;
    }
  };
  
  const getRecogidasByDistrito = (distrito: string) => {
    return recogidas.filter(recogida => recogida.distrito === distrito);
  };
  
  const getRecogidasByBarrio = (barrio: string) => {
    return recogidas.filter(recogida => recogida.barrio === barrio);
  };
  
  const getRecogidasByCliente = (clienteId: string) => {
    return recogidas.filter(recogida => recogida.clienteId === clienteId);
  };

  useEffect(() => {
    loadRecogidasData();
  }, []);

  return { 
    recogidas, 
    loading, 
    error, 
    loadRecogidasData,
    addRecogida,
    updateRecogida,
    completeRecogida,
    deleteRecogida,
    getRecogidasByDistrito,
    getRecogidasByBarrio,
    getRecogidasByCliente
  };
}

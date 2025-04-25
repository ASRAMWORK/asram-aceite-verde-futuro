
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import type { Ruta } from '@/types';
import { toast } from 'sonner';

export function useRutas() {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRutasData = async () => {
    try {
      setLoading(true);
      const rutasRef = collection(db, "rutas");
      const rutasSnap = await getDocs(query(rutasRef, orderBy("createdAt", "desc")));
      
      const rutasData: Ruta[] = [];
      rutasSnap.forEach((doc) => {
        rutasData.push({ id: doc.id, ...doc.data() } as Ruta);
      });
      
      setRutas(rutasData);
    } catch (err) {
      console.error("Error cargando rutas:", err);
      setError("Error al cargar datos de rutas");
    } finally {
      setLoading(false);
    }
  };

  const addRuta = async (nuevaRuta: Omit<Ruta, 'id'>) => {
    try {
      const rutaData = {
        ...nuevaRuta,
        createdAt: serverTimestamp(),
      };
      
      await addDoc(collection(db, "rutas"), rutaData);
      toast.success("Ruta creada correctamente");
      await loadRutasData();
      return true;
    } catch (err) {
      console.error("Error añadiendo ruta:", err);
      toast.error("Error al crear la ruta");
      return false;
    }
  };

  const updateRuta = async (id: string, data: Partial<Ruta>) => {
    try {
      await updateDoc(doc(db, "rutas", id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      toast.success("Ruta actualizada correctamente");
      await loadRutasData();
      return true;
    } catch (err) {
      console.error("Error actualizando ruta:", err);
      toast.error("Error al actualizar la ruta");
      return false;
    }
  };
  
  const deleteRuta = async (id: string) => {
    try {
      await deleteDoc(doc(db, "rutas", id));
      toast.success("Ruta eliminada correctamente");
      await loadRutasData();
      return true;
    } catch (err) {
      console.error("Error eliminando ruta:", err);
      toast.error("Error al eliminar la ruta");
      return false;
    }
  };
  
  // Add the completeRuta function
  const completeRuta = async (id: string, litrosTotales: number) => {
    try {
      await updateDoc(doc(db, "rutas", id), {
        completada: true,
        litrosTotales,
        updatedAt: serverTimestamp()
      });
      toast.success("Ruta completada correctamente");
      await loadRutasData();
      return true;
    } catch (err) {
      console.error("Error completando ruta:", err);
      toast.error("Error al completar la ruta");
      return false;
    }
  };
  
  const getRutasPorDistrito = (distrito: string) => {
    return rutas.filter(ruta => ruta.distrito === distrito);
  };
  
  const getRutasActivas = () => {
    return rutas.filter(ruta => !ruta.completada);
  };

  useEffect(() => {
    loadRutasData();
  }, []);

  return {
    rutas,
    loading,
    error,
    loadRutasData,
    getRutasPorDistrito,
    getRutasActivas,
    addRuta,
    updateRuta,
    deleteRuta,
    completeRuta
  };
}

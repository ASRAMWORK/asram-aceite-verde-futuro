
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, where, serverTimestamp } from 'firebase/firestore';
import type { PuntoVerde } from '@/types';
import { toast } from 'sonner';

export function usePuntosVerdes() {
  const [puntosVerdes, setPuntosVerdes] = useState<PuntoVerde[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPuntosVerdesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const puntosRef = collection(db, "puntosVerdes");
      // Modificamos la consulta para que solo ordene por un campo
      // y luego ordenaremos el resto en memoria
      const puntosSnap = await getDocs(query(puntosRef, orderBy("distrito")));
      
      const puntosData: PuntoVerde[] = [];
      puntosSnap.forEach((doc) => {
        puntosData.push({ id: doc.id, ...doc.data() } as PuntoVerde);
      });
      
      // Ordenamos en memoria por distrito y luego por barrio
      const puntosOrdenados = puntosData.sort((a, b) => {
        if (a.distrito === b.distrito) {
          return a.barrio.localeCompare(b.barrio);
        }
        return a.distrito.localeCompare(b.distrito);
      });
      
      setPuntosVerdes(puntosOrdenados);
    } catch (err) {
      console.error("Error cargando puntos verdes:", err);
      setError("Error al cargar datos de Puntos Verdes");
    } finally {
      setLoading(false);
    }
  };

  const addPuntoVerde = async (nuevoPunto: Omit<PuntoVerde, 'id'>) => {
    try {
      const puntoData = {
        ...nuevoPunto,
        litrosRecogidos: nuevoPunto.litrosRecogidos || 0,
        createdAt: serverTimestamp(),
      };
      
      await addDoc(collection(db, "puntosVerdes"), puntoData);
      toast.success("Punto verde añadido correctamente");
      await loadPuntosVerdesData();
      return true;
    } catch (err) {
      console.error("Error añadiendo punto verde:", err);
      toast.error("Error al añadir el punto verde");
      return false;
    }
  };

  const updatePuntoVerde = async (id: string, data: Partial<PuntoVerde>) => {
    try {
      await updateDoc(doc(db, "puntosVerdes", id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      toast.success("Punto verde actualizado correctamente");
      await loadPuntosVerdesData();
      return true;
    } catch (err) {
      console.error("Error actualizando punto verde:", err);
      toast.error("Error al actualizar el punto verde");
      return false;
    }
  };

  const deletePuntoVerde = async (id: string) => {
    try {
      await deleteDoc(doc(db, "puntosVerdes", id));
      toast.success("Punto verde eliminado correctamente");
      await loadPuntosVerdesData();
      return true;
    } catch (err) {
      console.error("Error eliminando punto verde:", err);
      toast.error("Error al eliminar el punto verde");
      return false;
    }
  };

  const getPuntosByDistrito = (distrito: string) => {
    return puntosVerdes.filter(punto => punto.distrito === distrito);
  };
  
  const getPuntosByBarrio = (barrio: string) => {
    return puntosVerdes.filter(punto => punto.barrio === barrio);
  };

  useEffect(() => {
    loadPuntosVerdesData();
  }, []);

  return { 
    puntosVerdes, 
    loading, 
    error, 
    loadPuntosVerdesData, 
    addPuntoVerde,
    updatePuntoVerde,
    deletePuntoVerde,
    getPuntosByDistrito,
    getPuntosByBarrio
  };
}


import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

// Tipo para las rutas
interface Ruta {
  id: string;
  fecha: Date;
  distrito: string;
  contenedoresRecogidos: number;
  notas?: string;
  estado: 'pendiente' | 'completada';
  createdAt?: any;
  updatedAt?: any;
}

export function useRutas() {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRutas = async () => {
    try {
      setLoading(true);
      const rutasRef = collection(db, "rutas");
      const rutasSnap = await getDocs(query(rutasRef, orderBy("fecha", "desc")));
      
      const rutasData: Ruta[] = [];
      rutasSnap.forEach((doc) => {
        const data = doc.data();
        rutasData.push({
          id: doc.id,
          fecha: data.fecha?.toDate() || new Date(),
          distrito: data.distrito || '',
          contenedoresRecogidos: data.contenedoresRecogidos || 0,
          notas: data.notas || '',
          estado: data.estado || 'pendiente',
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        });
      });
      
      setRutas(rutasData);
    } catch (err) {
      console.error("Error cargando rutas:", err);
      setError("Error al cargar datos de rutas");
    } finally {
      setLoading(false);
    }
  };

  const addRuta = async (nuevaRuta: Omit<Ruta, "id">) => {
    try {
      const rutaData = {
        ...nuevaRuta,
        createdAt: serverTimestamp()
      };
      
      await addDoc(collection(db, "rutas"), rutaData);
      toast.success("Ruta añadida correctamente");
      await loadRutas();
      return true;
    } catch (err) {
      console.error("Error añadiendo ruta:", err);
      toast.error("Error al añadir la ruta");
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
      await loadRutas();
      return true;
    } catch (err) {
      console.error("Error actualizando ruta:", err);
      toast.error("Error al actualizar la ruta");
      return false;
    }
  };
  
  const completarRuta = async (id: string) => {
    try {
      await updateDoc(doc(db, "rutas", id), {
        estado: 'completada',
        updatedAt: serverTimestamp()
      });
      toast.success("Retirada completada correctamente");
      await loadRutas();
      return true;
    } catch (err) {
      console.error("Error completando ruta:", err);
      toast.error("Error al completar la retirada");
      return false;
    }
  };
  
  const deleteRuta = async (id: string) => {
    try {
      await deleteDoc(doc(db, "rutas", id));
      toast.success("Ruta eliminada correctamente");
      await loadRutas();
      return true;
    } catch (err) {
      console.error("Error eliminando ruta:", err);
      toast.error("Error al eliminar la ruta");
      return false;
    }
  };

  useEffect(() => {
    loadRutas();
  }, []);

  return {
    rutas,
    loading,
    error,
    loadRutas,
    addRuta,
    updateRuta,
    completarRuta,
    deleteRuta,
  };
}

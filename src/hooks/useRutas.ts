
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, where, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

interface Ruta {
  id: string;
  nombre: string;
  distrito: string;
  barrio: string;
  descripcion?: string;
  puntoInicio: string;
  puntoFin: string;
  distancia: number;
  tiempoEstimado: number;
  activo: boolean;
  createdAt?: any;
  updatedAt?: any;
}

export function useRutas() {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRutasData = async () => {
    try {
      setLoading(true);
      const rutasRef = collection(db, "rutas");
      const rutasSnap = await getDocs(query(rutasRef, orderBy("distrito")));
      
      const rutasData: Ruta[] = [];
      rutasSnap.forEach((doc) => {
        const data = doc.data();
        rutasData.push({
          id: doc.id,
          nombre: data.nombre || '',
          distrito: data.distrito || '',
          barrio: data.barrio || '',
          descripcion: data.descripcion,
          puntoInicio: data.puntoInicio || '',
          puntoFin: data.puntoFin || '',
          distancia: data.distancia || 0,
          tiempoEstimado: data.tiempoEstimado || 0,
          activo: data.activo ?? true,
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
  
  const getRutasPorDistrito = (distrito: string) => {
    return rutas.filter(r => r.distrito === distrito);
  };

  const getRutasActivas = () => {
    return rutas.filter(r => r.activo);
  };

  const addRuta = async (data: Omit<Ruta, "id">) => {
    try {
      const rutaData = {
        ...data,
        createdAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, "rutas"), rutaData);
      toast.success("Ruta añadida correctamente");
      await loadRutasData();
      return { id: docRef.id, ...data };
    } catch (err) {
      console.error("Error añadiendo ruta:", err);
      toast.error("Error al añadir la ruta");
      throw err;
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
      // Soft delete
      await updateDoc(doc(db, "rutas", id), {
        activo: false,
        updatedAt: serverTimestamp()
      });
      toast.success("Ruta desactivada correctamente");
      await loadRutasData();
      return true;
    } catch (err) {
      console.error("Error eliminando ruta:", err);
      toast.error("Error al desactivar la ruta");
      return false;
    }
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
    deleteRuta
  };
}

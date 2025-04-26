
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, where, serverTimestamp, onSnapshot } from 'firebase/firestore';
import type { Instalacion } from '@/types';
import { toast } from 'sonner';

export function useInstalaciones() {
  const [instalaciones, setInstalaciones] = useState<Instalacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listeningForChanges, setListeningForChanges] = useState(false);

  const loadInstalacionesData = async () => {
    try {
      setLoading(true);
      setError(null);
      const instalacionesRef = collection(db, "instalaciones");
      const instalacionesSnap = await getDocs(query(
        instalacionesRef, 
        orderBy("distrito"),
        orderBy("barrio")
      ));
      
      const instalacionesData: Instalacion[] = [];
      instalacionesSnap.forEach((doc) => {
        instalacionesData.push({ id: doc.id, ...doc.data() } as Instalacion);
      });
      
      setInstalaciones(instalacionesData);
    } catch (err) {
      console.error("Error cargando instalaciones:", err);
      setError("Error al cargar datos de instalaciones");
    } finally {
      setLoading(false);
    }
  };

  const addInstalacion = async (data: Omit<Instalacion, "id">) => {
    try {
      const instalacionData = {
        ...data,
        createdAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, "instalaciones"), instalacionData);
      toast.success("Instalación añadida correctamente");
      await loadInstalacionesData();
      return { id: docRef.id, ...data };
    } catch (err) {
      console.error("Error añadiendo instalación:", err);
      toast.error("Error al añadir la instalación");
      throw err;
    }
  };

  const updateInstalacion = async (id: string, data: Partial<Instalacion>) => {
    try {
      await updateDoc(doc(db, "instalaciones", id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      toast.success("Instalación actualizada correctamente");
      await loadInstalacionesData();
      return true;
    } catch (err) {
      console.error("Error actualizando instalación:", err);
      toast.error("Error al actualizar la instalación");
      return false;
    }
  };

  const deleteInstalacion = async (id: string) => {
    try {
      await deleteDoc(doc(db, "instalaciones", id));
      toast.success("Instalación eliminada correctamente");
      await loadInstalacionesData();
      return true;
    } catch (err) {
      console.error("Error eliminando instalación:", err);
      toast.error("Error al eliminar la instalación");
      return false;
    }
  };

  const getInstalacionesByDistrito = (distrito: string) => {
    return instalaciones.filter(i => i.distrito.toLowerCase() === distrito.toLowerCase());
  };
  
  const getInstalacionesByBarrio = (barrio: string) => {
    return instalaciones.filter(i => i.barrio.toLowerCase() === barrio.toLowerCase());
  };
  
  const getDistritosUnicos = () => {
    return Array.from(new Set(instalaciones.map(i => i.distrito))).sort();
  };
  
  const getBarriosUnicos = () => {
    return Array.from(new Set(instalaciones.map(i => i.barrio))).sort();
  };
  
  // Obtener estadísticas por distrito
  const getEstadisticasByDistrito = () => {
    const estadisticas: { [distrito: string]: { 
      contenedores: number;
      porterias: number;
      viviendas: number;
      instalaciones: number;
    }} = {};
    
    instalaciones.forEach(inst => {
      if (!estadisticas[inst.distrito]) {
        estadisticas[inst.distrito] = {
          contenedores: 0,
          porterias: 0,
          viviendas: 0,
          instalaciones: 0,
        };
      }
      
      estadisticas[inst.distrito].contenedores += inst.numContenedores || 0;
      estadisticas[inst.distrito].porterias += inst.numPorteria || 0;
      estadisticas[inst.distrito].viviendas += inst.numViviendas || 0;
      estadisticas[inst.distrito].instalaciones += 1;
    });
    
    return estadisticas;
  };
  
  // Configurar escucha en tiempo real para actualizaciones
  useEffect(() => {
    if (!listeningForChanges) {
      const instalacionesRef = collection(db, "instalaciones");
      const q = query(
        instalacionesRef, 
        orderBy("distrito"),
        orderBy("barrio")
      );
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const instalacionesData: Instalacion[] = [];
        snapshot.forEach((doc) => {
          instalacionesData.push({ id: doc.id, ...doc.data() } as Instalacion);
        });
        setInstalaciones(instalacionesData);
        setLoading(false);
      }, (err) => {
        console.error("Error observing instalaciones:", err);
        setError("Error al observar cambios en instalaciones");
        setLoading(false);
      });

      setListeningForChanges(true);
      return () => unsubscribe();
    }
  }, [listeningForChanges]);

  useEffect(() => {
    loadInstalacionesData();
  }, []);

  return { 
    instalaciones, 
    loading, 
    error, 
    loadInstalacionesData,
    addInstalacion,
    updateInstalacion,
    deleteInstalacion,
    getInstalacionesByDistrito,
    getInstalacionesByBarrio,
    getDistritosUnicos,
    getBarriosUnicos,
    getEstadisticasByDistrito
  };
}

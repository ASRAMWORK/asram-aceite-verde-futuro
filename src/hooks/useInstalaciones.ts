
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, where, serverTimestamp } from 'firebase/firestore';
import type { Instalacion } from '@/types';
import { toast } from 'sonner';

export function useInstalaciones() {
  const [instalaciones, setInstalaciones] = useState<Instalacion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadInstalacionesData = async () => {
    try {
      setLoading(true);
      const instalacionesRef = collection(db, "instalaciones");
      const instalacionesSnap = await getDocs(query(instalacionesRef, orderBy("createdAt", "desc")));
      
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

  useEffect(() => {
    loadInstalacionesData();
  }, []);

  return { 
    instalaciones, 
    loading, 
    error, 
    loadInstalacionesData,
    addInstalacion
  };
}

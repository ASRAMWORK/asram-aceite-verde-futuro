
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import type { ComunidadVecinos } from '@/types';

export const useComunidades = () => {
  const [comunidades, setComunidades] = useState<ComunidadVecinos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadComunidades = async () => {
    try {
      setLoading(true);
      const comunidadesRef = collection(db, 'comunidades');
      const comunidadesSnap = await getDocs(query(comunidadesRef, orderBy('nombre')));
      
      const comunidadesData: ComunidadVecinos[] = [];
      comunidadesSnap.forEach((doc) => {
        const data = doc.data();
        comunidadesData.push({
          id: doc.id,
          ...data as ComunidadVecinos,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate()
        });
      });
      
      setComunidades(comunidadesData);
    } catch (err) {
      console.error("Error cargando comunidades:", err);
      setError("Error al cargar datos de comunidades");
    } finally {
      setLoading(false);
    }
  };

  const addComunidad = async (comunidad: Omit<ComunidadVecinos, "id">) => {
    try {
      await addDoc(collection(db, "comunidades"), {
        ...comunidad,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success("Comunidad añadida correctamente");
      await loadComunidades();
      return true;
    } catch (err) {
      console.error("Error añadiendo comunidad:", err);
      toast.error("Error al añadir la comunidad");
      return false;
    }
  };

  const updateComunidad = async (id: string, data: Partial<ComunidadVecinos>) => {
    try {
      await updateDoc(doc(db, "comunidades", id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      toast.success("Comunidad actualizada correctamente");
      await loadComunidades();
      return true;
    } catch (err) {
      console.error("Error actualizando comunidad:", err);
      toast.error("Error al actualizar la comunidad");
      return false;
    }
  };

  const deleteComunidad = async (id: string) => {
    try {
      await deleteDoc(doc(db, "comunidades", id));
      toast.success("Comunidad eliminada correctamente");
      await loadComunidades();
      return true;
    } catch (err) {
      console.error("Error eliminando comunidad:", err);
      toast.error("Error al eliminar la comunidad");
      return false;
    }
  };

  useEffect(() => {
    loadComunidades();
  }, []);

  return {
    comunidades,
    loading,
    error,
    addComunidad,
    updateComunidad,
    deleteComunidad,
    loadComunidades
  };
};

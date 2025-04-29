
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import { ComunidadVecinos } from '@/types';

export const useComunidadesVecinos = () => {
  const [comunidades, setComunidades] = useState<ComunidadVecinos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadComunidades = async () => {
    try {
      setLoading(true);
      const comunidadCollection = collection(db, 'comunidadesVecinos');
      const comunidadSnapshot = await getDocs(query(comunidadCollection, orderBy('nombre')));
      
      const comunidadesData: ComunidadVecinos[] = comunidadSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as ComunidadVecinos,
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));
      
      setComunidades(comunidadesData);
    } catch (e: any) {
      setError(e.message);
      toast.error('Error al cargar las comunidades de vecinos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComunidades();
  }, []);

  const addComunidad = async (comunidad: Omit<ComunidadVecinos, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      const comunidadCollection = collection(db, 'comunidadesVecinos');
      await addDoc(comunidadCollection, {
        ...comunidad,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success('Comunidad de vecinos añadida correctamente');
      await loadComunidades();
    } catch (e: any) {
      toast.error('Error al añadir la comunidad de vecinos');
      setError(e.message);
    }
  };

  const updateComunidad = async (id: string, updates: Partial<ComunidadVecinos>) => {
    try {
      const comunidadDoc = doc(db, 'comunidadesVecinos', id);
      await updateDoc(comunidadDoc, {
        ...updates,
        updatedAt: serverTimestamp()
      });
      toast.success('Comunidad de vecinos actualizada correctamente');
      await loadComunidades();
    } catch (e: any) {
      toast.error('Error al actualizar la comunidad de vecinos');
      setError(e.message);
    }
  };

  const deleteComunidad = async (id: string) => {
    try {
      const comunidadDoc = doc(db, 'comunidadesVecinos', id);
      await deleteDoc(comunidadDoc);
      toast.success('Comunidad de vecinos eliminada correctamente');
      await loadComunidades();
    } catch (e: any) {
      toast.error('Error al eliminar la comunidad de vecinos');
      setError(e.message);
    }
  };

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

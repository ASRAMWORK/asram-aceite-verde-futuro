
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, doc, deleteDoc, updateDoc, serverTimestamp, where } from 'firebase/firestore';
import { toast } from 'sonner';
import { ComunidadVecinos } from '@/types';
import { useUserProfile } from '@/hooks/useUserProfile';

export const useComunidadesVecinos = () => {
  const [comunidades, setComunidades] = useState<ComunidadVecinos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useUserProfile();

  const loadComunidades = async () => {
    try {
      setLoading(true);
      let comunidadesRef;
      let comunidadSnapshot;
      
      // Si el usuario es administrador de fincas, solo muestra sus comunidades
      if (profile?.role === 'admin_finca') {
        comunidadesRef = collection(db, 'comunidadesVecinos');
        comunidadSnapshot = await getDocs(
          query(
            comunidadesRef, 
            where('administradorId', '==', profile.id),
            orderBy('nombre')
          )
        );
      } else {
        // Para superadmins u otros roles, muestra todas las comunidades
        comunidadesRef = collection(db, 'comunidadesVecinos');
        comunidadSnapshot = await getDocs(query(comunidadesRef, orderBy('nombre')));
      }
      
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
  }, [profile?.id]);

  const addComunidad = async (comunidad: Omit<ComunidadVecinos, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Añade el ID del administrador actual a la comunidad si es un administrador
      const comunidadData = {
        ...comunidad,
        administradorId: profile?.id || null,
        administradorNombre: profile?.nombreAdministracion || profile?.nombre || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };

      const comunidadCollection = collection(db, 'comunidadesVecinos');
      await addDoc(comunidadCollection, comunidadData);
      toast.success('Comunidad de vecinos añadida correctamente');
      await loadComunidades();
      return true;
    } catch (e: any) {
      toast.error('Error al añadir la comunidad de vecinos');
      setError(e.message);
      return false;
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
      return true;
    } catch (e: any) {
      toast.error('Error al actualizar la comunidad de vecinos');
      setError(e.message);
      return false;
    }
  };

  const deleteComunidad = async (id: string) => {
    try {
      const comunidadDoc = doc(db, 'comunidadesVecinos', id);
      await deleteDoc(comunidadDoc);
      toast.success('Comunidad de vecinos eliminada correctamente');
      await loadComunidades();
      return true;
    } catch (e: any) {
      toast.error('Error al eliminar la comunidad de vecinos');
      setError(e.message);
      return false;
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

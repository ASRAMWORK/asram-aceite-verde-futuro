
import { useEffect, useState } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, doc, deleteDoc, updateDoc, serverTimestamp, where } from 'firebase/firestore';
import { toast } from 'sonner';
import { ComunidadVecinos } from '@/types';
import { useUserProfile } from '@/hooks/useUserProfile';

export const useComunidadesVecinos = (adminId?: string) => {
  const [comunidades, setComunidades] = useState<ComunidadVecinos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useUserProfile();
  
  // Usar el adminId proporcionado o el del perfil actual
  const efectiveAdminId = adminId || profile?.id;

  const loadComunidades = async () => {
    try {
      setLoading(true);
      setError(null);
      
      if (!efectiveAdminId) {
        console.error("No hay ID de administrador disponible para filtrar comunidades");
        setLoading(false);
        return;
      }
      
      // Modificar la consulta para evitar el error de índice
      // Primero filtramos por administradorId y luego ordenamos en memoria
      const comunidadesRef = collection(db, 'comunidadesVecinos');
      const comunidadSnapshot = await getDocs(
        query(
          comunidadesRef, 
          where('administradorId', '==', efectiveAdminId)
          // Eliminamos el orderBy para evitar requerir el índice compuesto
        )
      );
      
      let comunidadesData: ComunidadVecinos[] = comunidadSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as ComunidadVecinos,
        createdAt: doc.data().createdAt?.toDate(),
        updatedAt: doc.data().updatedAt?.toDate()
      }));
      
      // Ordenamos en memoria por nombre para evitar requerir el índice
      comunidadesData = comunidadesData.sort((a, b) => {
        return a.nombre.localeCompare(b.nombre);
      });
      
      setComunidades(comunidadesData);
    } catch (e: any) {
      console.error("Error al cargar comunidades:", e);
      setError(e.message);
      toast.error('Error al cargar las comunidades de vecinos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (efectiveAdminId) {
      loadComunidades();
    }
  }, [efectiveAdminId]);

  const addComunidad = async (comunidad: Omit<ComunidadVecinos, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      if (!efectiveAdminId) {
        toast.error('No hay un administrador identificado para asociar la comunidad');
        return false;
      }
      
      // Añade el ID del administrador actual a la comunidad
      const comunidadData = {
        ...comunidad,
        administradorId: efectiveAdminId,
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
      
      // Verificar que la comunidad pertenece a este administrador
      const comunidadesActuales = comunidades.find(c => c.id === id);
      if (!comunidadesActuales || comunidadesActuales.administradorId !== efectiveAdminId) {
        toast.error('No tienes permiso para modificar esta comunidad');
        return false;
      }
      
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
      // Verificar que la comunidad pertenece a este administrador
      const comunidadesActuales = comunidades.find(c => c.id === id);
      if (!comunidadesActuales || comunidadesActuales.administradorId !== efectiveAdminId) {
        toast.error('No tienes permiso para eliminar esta comunidad');
        return false;
      }
      
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

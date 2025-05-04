
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
      
      // Consultar en ambas colecciones: comunidadesVecinos y comunidades
      const comunidadesVecinosRef = collection(db, 'comunidadesVecinos');
      const comunidadesRef = collection(db, 'comunidades');
      
      // Consulta en comunidadesVecinos
      const comunidadVecinosSnapshot = await getDocs(
        query(
          comunidadesVecinosRef, 
          where('administradorId', '==', efectiveAdminId)
        )
      );
      
      // Consulta en comunidades
      const comunidadesSnapshot = await getDocs(
        query(
          comunidadesRef, 
          where('administradorId', '==', efectiveAdminId)
        )
      );
      
      let comunidadesData: ComunidadVecinos[] = [];
      
      // Procesar datos de comunidadesVecinos
      comunidadesData = comunidadVecinosSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as ComunidadVecinos,
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : doc.data().updatedAt
      }));
      
      // Procesar datos de comunidades
      const comunidadesAdicionales = comunidadesSnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data() as ComunidadVecinos,
        createdAt: doc.data().createdAt?.toDate ? doc.data().createdAt.toDate() : doc.data().createdAt,
        updatedAt: doc.data().updatedAt?.toDate ? doc.data().updatedAt.toDate() : doc.data().updatedAt
      }));
      
      // Combinar ambas fuentes de datos
      comunidadesData = [...comunidadesData, ...comunidadesAdicionales];
      
      // Eliminar posibles duplicados (por ID)
      const uniqueComunidades = Array.from(
        new Map(comunidadesData.map(item => [item.id, item])).values()
      );
      
      // Ordenar por nombre
      const ordenadas = uniqueComunidades.sort((a, b) => {
        return (a.nombre || '').localeCompare(b.nombre || '');
      });
      
      setComunidades(ordenadas);
      console.log("Comunidades cargadas:", ordenadas.length);
    } catch (e: any) {
      console.error("Error al cargar comunidades:", e);
      setError(e.message);
      toast.error('Error al cargar las comunidades');
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

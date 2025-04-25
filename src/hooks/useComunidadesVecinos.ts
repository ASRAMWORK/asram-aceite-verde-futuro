
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  doc, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  query, 
  where, 
  serverTimestamp, 
  onSnapshot 
} from 'firebase/firestore';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ComunidadVecinos } from '@/types';

export function useComunidadesVecinos() {
  const [comunidades, setComunidades] = useState<ComunidadVecinos[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const { user } = useAuth();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    if (!user) {
      setLoading(false);
      return;
    }

    const fetchComunidades = async () => {
      setLoading(true);
      try {
        const comunidadesCollection = collection(db, 'comunidades');
        const q = query(comunidadesCollection, where('administradorId', '==', user.uid));

        const unsubscribe = onSnapshot(q, (snapshot) => {
          const comunidadesData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as ComunidadVecinos[];
          setComunidades(comunidadesData);
          setLoading(false);
        });

        return () => unsubscribe();
      } catch (err) {
        console.error("Error al obtener las comunidades:", err);
        setError("Error al cargar las comunidades");
        setLoading(false);
      }
    };

    return fetchComunidades();
  }, [user]);

  const createComunidad = async (data: Partial<ComunidadVecinos>) => {
    setIsLoading(true);
    try {
      const newComunidad = {
        id: "",
        nombre: data.nombre,
        direccion: data.direccion,
        numViviendas: data.numViviendas || 0, // Ensure numViviendas is included
        cif: data.cif,
        codigoPostal: data.codigoPostal,
        ciudad: data.ciudad,
        distrito: data.distrito,
        barrio: data.barrio,
        totalViviendas: data.totalViviendas,
        numeroPorteria: data.numeroPorteria,
        nombreAdministracion: data.nombreAdministracion,
        correoContacto: data.correoContacto,
        administradorId: user?.uid || null,
        litrosRecogidos: 0,
        beneficiosMedioambientales: {
          co2: 0,
          agua: 0,
          energia: 0
        },
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      };
      const comunidadesCollection = collection(db, 'comunidades');
      await addDoc(comunidadesCollection, newComunidad);
      toast.success('Comunidad creada con éxito');
    } catch (error) {
      console.error("Error al crear la comunidad:", error);
      toast.error('Error al crear la comunidad');
    } finally {
      setIsLoading(false);
    }
  };

  const updateComunidad = async (id: string, data: Partial<ComunidadVecinos>) => {
    setIsLoading(true);
    try {
      const comunidadDoc = doc(db, 'comunidades', id);
      await updateDoc(comunidadDoc, {
        ...data,
        updatedAt: serverTimestamp(),
      });
      toast.success('Comunidad actualizada con éxito');
    } catch (error) {
      console.error("Error al actualizar la comunidad:", error);
      toast.error('Error al actualizar la comunidad');
    } finally {
      setIsLoading(false);
    }
  };

  const deleteComunidad = async (id: string) => {
    setIsLoading(true);
    try {
      const comunidadDoc = doc(db, 'comunidades', id);
      await deleteDoc(comunidadDoc);
      toast.success('Comunidad eliminada con éxito');
    } catch (error) {
      console.error("Error al eliminar la comunidad:", error);
      toast.error('Error al eliminar la comunidad');
    } finally {
      setIsLoading(false);
    }
  };

  const updateBeneficios = async (id: string, litrosRecogidos: number) => {
    try {
      // Calculate environmental benefits
      const co2 = litrosRecogidos * 2.3; // kg of CO2 saved
      const agua = litrosRecogidos * 1000; // liters of water saved
      const energia = litrosRecogidos * 1.5; // kWh of energy saved

      await updateDoc(doc(db, "comunidades", id), {
        litrosRecogidos,
        beneficiosMedioambientales: {
          co2,
          agua,
          energia
        }
      });
      toast.success('Beneficios actualizados con éxito');
    } catch (error) {
      console.error("Error al actualizar los beneficios:", error);
      toast.error('Error al actualizar los beneficios');
    }
  };

  return {
    comunidades,
    loading,
    error,
    createComunidad,
    updateComunidad,
    deleteComunidad,
    updateBeneficios,
    isLoading
  };
}

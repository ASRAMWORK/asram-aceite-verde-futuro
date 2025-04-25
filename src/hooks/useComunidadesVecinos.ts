
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, where, serverTimestamp, DocumentData } from 'firebase/firestore';
import type { ComunidadVecinos } from '@/types';
import { toast } from 'sonner';

export function useComunidadesVecinos(administradorId?: string) {
  const [comunidades, setComunidades] = useState<ComunidadVecinos[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadComunidadesData = async () => {
    try {
      setLoading(true);
      const comunidadesRef = collection(db, "comunidadesVecinos");
      let comunidadesQuery;
      
      // If administradorId is provided, only get communities for that administrator
      if (administradorId) {
        comunidadesQuery = query(
          comunidadesRef, 
          where("administradorId", "==", administradorId),
          orderBy("createdAt", "desc")
        );
      } else {
        comunidadesQuery = query(comunidadesRef, orderBy("createdAt", "desc"));
      }
      
      const comunidadesSnap = await getDocs(comunidadesQuery);
      
      const comunidadesData: ComunidadVecinos[] = [];
      comunidadesSnap.forEach((doc) => {
        const docData = doc.data() as DocumentData;
        comunidadesData.push({ 
          id: doc.id, 
          ...docData 
        } as ComunidadVecinos);
      });
      
      setComunidades(comunidadesData);
    } catch (err) {
      console.error("Error cargando comunidades de vecinos:", err);
      setError("Error al cargar datos de comunidades");
    } finally {
      setLoading(false);
    }
  };
  
  const addComunidad = async (data: Omit<ComunidadVecinos, 'id' | 'createdAt' | 'updatedAt'>) => {
    try {
      // Calculate environmental benefits based on liters collected (sample calculation)
      const beneficios = {
        co2Evitado: data.litrosRecogidos * 2.3, // kg of CO2 per liter
        aguaAhorrada: data.litrosRecogidos * 1000, // liters of water per liter of oil
        energiaAhorrada: data.litrosRecogidos * 1.5, // kWh per liter of oil
      };
      
      const comunidadData = {
        ...data,
        beneficiosMedioambientales: beneficios,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await addDoc(collection(db, "comunidadesVecinos"), comunidadData);
      toast.success("Comunidad de vecinos añadida correctamente");
      await loadComunidadesData();
      return true;
    } catch (err) {
      console.error("Error añadiendo comunidad:", err);
      toast.error("Error al añadir la comunidad");
      return false;
    }
  };

  const updateComunidad = async (id: string, data: Partial<ComunidadVecinos>) => {
    try {
      // If litrosRecogidos is updated, recalculate environmental benefits
      let updateData = { ...data, updatedAt: serverTimestamp() };
      
      if (data.litrosRecogidos) {
        const beneficios = {
          co2Evitado: data.litrosRecogidos * 2.3,
          aguaAhorrada: data.litrosRecogidos * 1000,
          energiaAhorrada: data.litrosRecogidos * 1.5,
        };
        
        updateData.beneficiosMedioambientales = beneficios;
      }
      
      await updateDoc(doc(db, "comunidadesVecinos", id), updateData);
      toast.success("Comunidad actualizada correctamente");
      await loadComunidadesData();
      return true;
    } catch (err) {
      console.error("Error actualizando comunidad:", err);
      toast.error("Error al actualizar la comunidad");
      return false;
    }
  };

  const deleteComunidad = async (id: string) => {
    try {
      await deleteDoc(doc(db, "comunidadesVecinos", id));
      toast.success("Comunidad eliminada correctamente");
      await loadComunidadesData();
      return true;
    } catch (err) {
      console.error("Error eliminando comunidad:", err);
      toast.error("Error al eliminar la comunidad");
      return false;
    }
  };

  useEffect(() => {
    loadComunidadesData();
  }, [administradorId]);

  return { 
    comunidades, 
    loading, 
    error, 
    loadComunidadesData,
    addComunidad,
    updateComunidad,
    deleteComunidad
  };
}

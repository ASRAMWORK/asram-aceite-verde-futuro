
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import type { AlianzaVerde } from '@/types';
import { toast } from 'sonner';

export function useAlianzaVerde() {
  const [alianzas, setAlianzas] = useState<AlianzaVerde[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadAlianzaVerdeData = async () => {
    try {
      setLoading(true);
      const alianzasRef = collection(db, "alianzaVerde");
      const alianzasSnap = await getDocs(query(alianzasRef, where("activo", "==", true)));
      
      const alianzasData: AlianzaVerde[] = [];
      alianzasSnap.forEach((doc) => {
        const data = doc.data();
        
        // Ensure certificaciones is always an array
        const certificaciones = data.certificaciones || [];
        const formattedData = {
          ...data,
          id: doc.id,
          certificaciones: Array.isArray(certificaciones) ? certificaciones : []
        };
        
        alianzasData.push(formattedData as AlianzaVerde);
      });
      
      setAlianzas(alianzasData);
    } catch (err) {
      console.error("Error cargando alianza verde:", err);
      setError("Error al cargar datos de Alianza Verde");
    } finally {
      setLoading(false);
    }
  };

  const addAlianzaVerde = async (nuevaAlianza: Partial<AlianzaVerde>) => {
    try {
      // Ensure certificaciones is an array
      const certificaciones = nuevaAlianza.certificaciones || [];
      
      const alianzaData = {
        ...nuevaAlianza,
        certificaciones: Array.isArray(certificaciones) ? certificaciones : [],
        activo: true,
        createdAt: serverTimestamp(),
      };
      
      await addDoc(collection(db, "alianzaVerde"), alianzaData);
      toast.success("Centro educativo añadido correctamente");
      await loadAlianzaVerdeData();
      return true;
    } catch (err) {
      console.error("Error añadiendo nuevo centro:", err);
      toast.error("Error al añadir centro educativo");
      return false;
    }
  };

  const updateAlianzaVerde = async (id: string, data: Partial<AlianzaVerde>) => {
    try {
      // Ensure certificaciones is an array
      const certificaciones = data.certificaciones || [];
      
      await updateDoc(doc(db, "alianzaVerde", id), {
        ...data,
        certificaciones: Array.isArray(certificaciones) ? certificaciones : [],
        updatedAt: serverTimestamp()
      });
      toast.success("Información del centro actualizada");
      await loadAlianzaVerdeData();
      return true;
    } catch (err) {
      console.error("Error actualizando centro:", err);
      toast.error("Error al actualizar información del centro");
      return false;
    }
  };

  const deleteAlianzaVerde = async (id: string) => {
    try {
      // Soft delete - just mark as inactive
      await updateDoc(doc(db, "alianzaVerde", id), {
        activo: false,
        updatedAt: serverTimestamp()
      });
      toast.success("Centro eliminado correctamente");
      await loadAlianzaVerdeData();
      return true;
    } catch (err) {
      console.error("Error eliminando centro:", err);
      toast.error("Error al eliminar centro");
      return false;
    }
  };

  useEffect(() => {
    loadAlianzaVerdeData();
  }, []);

  return { 
    alianzas, 
    loading, 
    error, 
    loadAlianzaVerdeData, 
    addAlianzaVerde,
    updateAlianzaVerde,
    deleteAlianzaVerde
  };
}

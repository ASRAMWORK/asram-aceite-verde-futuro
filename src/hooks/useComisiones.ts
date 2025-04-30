
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { toast } from 'sonner';
import { Comision } from '@/types/comercial';
import { useUserProfile } from '@/hooks/useUserProfile';

export function useComisiones() {
  const [comisiones, setComisiones] = useState<Comision[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useUserProfile();

  const loadComisionesData = async (comercialId?: string) => {
    try {
      setLoading(true);
      
      let comisionesQuery;
      
      // If comercialId is provided, filter by it
      if (comercialId) {
        comisionesQuery = query(
          collection(db, "comisiones"),
          where("comercialId", "==", comercialId),
          orderBy("fecha", "desc")
        );
      } 
      // If user is comercial, show only their comisiones
      else if (profile?.role === 'comercial') {
        comisionesQuery = query(
          collection(db, "comisiones"),
          where("comercialId", "==", profile.id),
          orderBy("fecha", "desc")
        );
      } 
      // For superadmin, show all
      else {
        comisionesQuery = query(
          collection(db, "comisiones"),
          orderBy("fecha", "desc")
        );
      }
      
      const comisionesSnap = await getDocs(comisionesQuery);
      
      const comisionesData: Comision[] = [];
      comisionesSnap.forEach((doc) => {
        const data = doc.data();
        comisionesData.push({
          id: doc.id,
          comercialId: data.comercialId,
          clienteId: data.clienteId,
          nombreCliente: data.nombreCliente,
          litrosRecogidos: data.litrosRecogidos || 0,
          importe: data.importe || 0,
          estado: data.estado || 'pendiente',
          fecha: data.fecha?.toDate() || new Date()
        });
      });
      
      setComisiones(comisionesData);
      setError(null);
    } catch (err) {
      console.error("Error cargando comisiones:", err);
      setError("Error al cargar datos de comisiones");
    } finally {
      setLoading(false);
    }
  };

  const addComision = async (comisionData: Partial<Comision>) => {
    try {
      const docRef = await addDoc(collection(db, "comisiones"), {
        ...comisionData,
        fecha: serverTimestamp(),
        estado: 'pendiente'
      });
      
      toast.success("Comisión añadida correctamente");
      await loadComisionesData();
      return docRef.id;
    } catch (err) {
      console.error("Error añadiendo comisión:", err);
      toast.error("Error al añadir comisión");
      throw err;
    }
  };

  const updateComision = async (id: string, data: Partial<Comision>) => {
    try {
      await updateDoc(doc(db, "comisiones", id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      toast.success("Comisión actualizada correctamente");
      await loadComisionesData();
    } catch (err) {
      console.error("Error actualizando comisión:", err);
      toast.error("Error al actualizar comisión");
      throw err;
    }
  };

  const marcarComisionAbonada = async (id: string) => {
    try {
      await updateDoc(doc(db, "comisiones", id), {
        estado: 'abonado',
        updatedAt: serverTimestamp()
      });
      
      toast.success("Comisión marcada como abonada");
      await loadComisionesData();
    } catch (err) {
      console.error("Error marcando comisión como abonada:", err);
      toast.error("Error al actualizar comisión");
      throw err;
    }
  };

  const getComisionesByComercialId = (comercialId: string) => {
    return comisiones.filter(comision => comision.comercialId === comercialId);
  };

  const getComisionesTotalesByComercialId = (comercialId: string) => {
    return comisiones
      .filter(comision => comision.comercialId === comercialId)
      .reduce((total, comision) => total + comision.importe, 0);
  };

  const getComisionesPendientesByComercialId = (comercialId: string) => {
    return comisiones
      .filter(comision => comision.comercialId === comercialId && comision.estado === 'pendiente')
      .reduce((total, comision) => total + comision.importe, 0);
  };

  useEffect(() => {
    loadComisionesData();
  }, [profile?.id]);

  return {
    comisiones,
    loading,
    error,
    loadComisionesData,
    addComision,
    updateComision,
    marcarComisionAbonada,
    getComisionesByComercialId,
    getComisionesTotalesByComercialId,
    getComisionesPendientesByComercialId
  };
}


import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { useUserProfile } from '../useUserProfile';
import { Recogida } from '@/types';

// Hook for loading recogida data
export function useRecogidaData(adminId?: string) {
  const [recogidas, setRecogidas] = useState<Recogida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useUserProfile();
  
  // Use the adminId provided or the one from the profile
  const effectiveAdminId = adminId || profile?.id;

  const loadRecogidasData = async () => {
    try {
      setLoading(true);
      
      if (!effectiveAdminId) {
        console.error("No hay ID de administrador disponible para filtrar recogidas");
        setLoading(false);
        return;
      }
      
      const recogidasRef = collection(db, "recogidas");
      
      // Filter by adminId
      const recogidasQuery = query(
        recogidasRef,
        where("adminId", "==", effectiveAdminId),
        orderBy("fechaRecogida", "desc")
      );
      
      const recogidasSnap = await getDocs(recogidasQuery);
      
      const recogidasData: Recogida[] = [];
      recogidasSnap.forEach((doc) => {
        const data = doc.data();
        recogidasData.push({
          id: doc.id,
          ...data as Recogida,
          fechaRecogida: data.fechaRecogida?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          fechaSolicitud: data.fechaSolicitud?.toDate() 
        });
      });
      
      setRecogidas(recogidasData);
    } catch (err) {
      console.error("Error cargando recogidas:", err);
      setError("Error al cargar los datos de recogidas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (effectiveAdminId) {
      loadRecogidasData();
    }
  }, [effectiveAdminId]);

  return {
    recogidas,
    loading,
    error,
    loadRecogidasData
  };
}

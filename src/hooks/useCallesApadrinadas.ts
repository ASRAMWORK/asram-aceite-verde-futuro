
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import type { CalleApadrinada } from '@/types';

export function useCallesApadrinadas() {
  const [callesApadrinadas, setCallesApadrinadas] = useState<CalleApadrinada[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadCallesApadrinadasData = async () => {
    try {
      setLoading(true);
      const callesRef = collection(db, "callesApadrinadas");
      const callesSnap = await getDocs(query(callesRef, where("activo", "==", true)));
      
      const callesData: CalleApadrinada[] = [];
      callesSnap.forEach((doc) => {
        callesData.push({ id: doc.id, ...doc.data() } as CalleApadrinada);
      });
      
      setCallesApadrinadas(callesData);
    } catch (err) {
      console.error("Error cargando calles apadrinadas:", err);
      setError("Error al cargar datos de Calles Apadrinadas");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCallesApadrinadasData();
  }, []);

  return { callesApadrinadas, loading, error, loadCallesApadrinadasData };
}

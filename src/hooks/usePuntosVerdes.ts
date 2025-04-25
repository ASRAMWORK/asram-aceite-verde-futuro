
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import type { PuntoVerde } from '@/types';

export function usePuntosVerdes() {
  const [puntosVerdes, setPuntosVerdes] = useState<PuntoVerde[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadPuntosVerdesData = async () => {
    try {
      setLoading(true);
      const puntosRef = collection(db, "puntosVerdes");
      const puntosSnap = await getDocs(query(puntosRef, orderBy("distrito"), orderBy("barrio")));
      
      const puntosData: PuntoVerde[] = [];
      puntosSnap.forEach((doc) => {
        puntosData.push({ id: doc.id, ...doc.data() } as PuntoVerde);
      });
      
      setPuntosVerdes(puntosData);
    } catch (err) {
      console.error("Error cargando puntos verdes:", err);
      setError("Error al cargar datos de Puntos Verdes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadPuntosVerdesData();
  }, []);

  return { puntosVerdes, loading, error, loadPuntosVerdesData };
}

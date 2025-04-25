
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where } from 'firebase/firestore';
import type { AlianzaVerde } from '@/types';

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
        alianzasData.push({ id: doc.id, ...doc.data() } as AlianzaVerde);
      });
      
      setAlianzas(alianzasData);
    } catch (err) {
      console.error("Error cargando alianza verde:", err);
      setError("Error al cargar datos de Alianza Verde");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAlianzaVerdeData();
  }, []);

  return { alianzas, loading, error, loadAlianzaVerdeData };
}

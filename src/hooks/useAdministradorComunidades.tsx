
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { ComunidadVecinos } from '@/types';
import { toast } from 'sonner';

export const useAdministradorComunidades = (adminId: string | undefined) => {
  const [comunidades, setComunidades] = useState<ComunidadVecinos[]>([]);
  const [totalViviendas, setTotalViviendas] = useState(0);
  const [totalContenedores, setTotalContenedores] = useState(0);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadComunidades = async () => {
      try {
        if (!adminId) return;
        
        setLoading(true);
        
        // Try first with "comunidades" collection
        const comunidadesQuery = query(
          collection(db, "comunidades"),
          where("administradorId", "==", adminId)
        );
        
        let querySnapshot = await getDocs(comunidadesQuery);
        let comunidadesData: ComunidadVecinos[] = [];
        let viviendasCount = 0;
        let contenedoresCount = 0;
        
        // If no results, try with "comunidadesVecinos" collection
        if (querySnapshot.empty) {
          console.log("No communities found in 'comunidades' collection, trying 'comunidadesVecinos'");
          const comunidadesVecinosQuery = query(
            collection(db, "comunidadesVecinos"),
            where("administradorId", "==", adminId)
          );
          
          querySnapshot = await getDocs(comunidadesVecinosQuery);
        }
        
        querySnapshot.forEach((doc) => {
          const data = doc.data() as Omit<ComunidadVecinos, 'id'>;
          const comunidad = {
            id: doc.id,
            ...data,
            createdAt: data.createdAt?.toDate ? data.createdAt.toDate() : new Date(),
            updatedAt: data.updatedAt?.toDate ? data.updatedAt.toDate() : new Date()
          } as ComunidadVecinos;
          
          comunidadesData.push(comunidad);
          
          // Count properties and containers
          if (comunidad.numViviendas) viviendasCount += comunidad.numViviendas;
          if (comunidad.totalViviendas) viviendasCount += comunidad.totalViviendas;
          if (comunidad.numContenedores) contenedoresCount += comunidad.numContenedores;
        });
        
        setComunidades(comunidadesData);
        setTotalViviendas(viviendasCount);
        setTotalContenedores(contenedoresCount);
        
        console.log("Communities loaded:", comunidadesData.length);
      } catch (error) {
        console.error("Error loading communities:", error);
        toast.error("Error al cargar las comunidades");
      } finally {
        setLoading(false);
      }
    };
    
    loadComunidades();
  }, [adminId]);

  return {
    comunidades,
    totalViviendas,
    totalContenedores,
    loading
  };
};

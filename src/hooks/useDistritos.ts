
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';

export function useDistritos() {
  const [distritos, setDistritos] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadDistritos = async () => {
    try {
      setLoading(true);
      // You can either get this from a collection in Firebase or from a static list
      // Option 1: From Firebase collection
      const distritosRef = collection(db, "distritos");
      const distritosSnap = await getDocs(query(distritosRef, orderBy("nombre")));
      
      const distritosData: string[] = [];
      distritosSnap.forEach((doc) => {
        const data = doc.data();
        if (data.nombre) {
          distritosData.push(data.nombre);
        }
      });
      
      // If no distritos found in database, use a static list
      if (distritosData.length === 0) {
        setDistritos([
          "Arganzuela",
          "Barajas",
          "Carabanchel",
          "Centro",
          "Chamartín",
          "Chamberí",
          "Ciudad Lineal",
          "Fuencarral-El Pardo",
          "Hortaleza",
          "Latina",
          "Moncloa-Aravaca",
          "Moratalaz",
          "Puente de Vallecas",
          "Retiro",
          "Salamanca",
          "San Blas-Canillejas",
          "Tetuán",
          "Usera",
          "Vicálvaro",
          "Villa de Vallecas",
          "Villaverde"
        ]);
      } else {
        setDistritos(distritosData);
      }
    } catch (err) {
      console.error("Error loading distritos:", err);
      setError("Error al cargar los distritos");
      
      // Fallback to static list if error
      setDistritos([
        "Arganzuela",
        "Barajas",
        "Carabanchel",
        "Centro",
        "Chamartín",
        "Chamberí",
        "Ciudad Lineal",
        "Fuencarral-El Pardo",
        "Hortaleza",
        "Latina",
        "Moncloa-Aravaca",
        "Moratalaz",
        "Puente de Vallecas",
        "Retiro",
        "Salamanca",
        "San Blas-Canillejas",
        "Tetuán",
        "Usera",
        "Vicálvaro",
        "Villa de Vallecas",
        "Villaverde"
      ]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDistritos();
  }, []);

  return { distritos, loading, error, loadDistritos };
}

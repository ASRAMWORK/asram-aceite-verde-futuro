
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, serverTimestamp, where, increment } from 'firebase/firestore';
import { toast } from 'sonner';
import type { Ruta, Recogida } from '@/types';

export function useRutas() {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRutas = async () => {
    try {
      setLoading(true);
      const rutasRef = collection(db, "rutas");
      const rutasSnap = await getDocs(query(rutasRef, orderBy("fecha", "desc")));
      
      const rutasData: Ruta[] = [];
      rutasSnap.forEach((doc) => {
        const data = doc.data();
        rutasData.push({
          id: doc.id,
          nombre: data.nombre || '',
          distrito: data.distrito || '',
          barrios: data.barrios || [],
          fecha: data.fecha?.toDate() || new Date(),
          hora: data.hora || '',
          recogedores: data.recogedores || '',
          clientes: data.clientes || [],
          puntosRecogida: data.puntosRecogida || 0,
          distanciaTotal: data.distanciaTotal || 0,
          tiempoEstimado: data.tiempoEstimado || 0,
          frecuencia: data.frecuencia || 'semanal',
          completada: data.completada || false,
          litrosTotales: data.litrosTotales || 0,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        });
      });
      
      setRutas(rutasData);
    } catch (err) {
      console.error("Error cargando rutas:", err);
      setError("Error al cargar datos de rutas");
    } finally {
      setLoading(false);
    }
  };

  const addRuta = async (nuevaRuta: Omit<Ruta, "id">) => {
    try {
      const rutaData = {
        ...nuevaRuta,
        createdAt: serverTimestamp(),
        completada: false,
        litrosTotales: 0
      };
      
      const docRef = await addDoc(collection(db, "rutas"), rutaData);
      
      if (nuevaRuta.clientes && nuevaRuta.clientes.length > 0) {
        const recogidas = nuevaRuta.clientes.map(cliente => ({
          rutaId: docRef.id,
          clienteId: cliente.id,
          nombreLugar: cliente.nombre,
          direccion: cliente.direccion,
          distrito: nuevaRuta.distrito,
          fecha: nuevaRuta.fecha,
          litrosRecogidos: 0,
          estado: 'pendiente',
          createdAt: serverTimestamp()
        }));

        for (const recogida of recogidas) {
          await addDoc(collection(db, "recogidas"), recogida);
        }
      }
      
      toast.success("Ruta añadida correctamente");
      await loadRutas();
      return true;
    } catch (err) {
      console.error("Error añadiendo ruta:", err);
      toast.error("Error al añadir la ruta");
      return false;
    }
  };

  const updateRutaRecogida = async (rutaId: string, clienteId: string, litros: number) => {
    try {
      const recogidasRef = collection(db, "recogidas");
      const q = query(recogidasRef, 
        where("rutaId", "==", rutaId),
        where("clienteId", "==", clienteId)
      );
      
      const snapshot = await getDocs(q);
      if (!snapshot.empty) {
        const recogidaDoc = snapshot.docs[0];
        await updateDoc(doc(db, "recogidas", recogidaDoc.id), {
          litrosRecogidos: litros,
          estado: 'completada',
          fechaCompletada: serverTimestamp()
        });
      }
      
      return true;
    } catch (err) {
      console.error("Error actualizando recogida:", err);
      return false;
    }
  };

  const updateRuta = async (id: string, data: Partial<Ruta>) => {
    try {
      await updateDoc(doc(db, "rutas", id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      toast.success("Ruta actualizada correctamente");
      await loadRutas();
      return true;
    } catch (err) {
      console.error("Error actualizando ruta:", err);
      toast.error("Error al actualizar la ruta");
      return false;
    }
  };
  
  const completeRuta = async (id: string, litrosTotales: number = 0) => {
    try {
      const ruta = rutas.find(r => r.id === id);
      if (!ruta) throw new Error('Ruta no encontrada');

      await updateDoc(doc(db, "rutas", id), {
        completada: true,
        litrosTotales,
        fechaCompletada: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Update district statistics
      const statsRef = doc(db, "estadisticas", ruta.distrito);
      await updateDoc(statsRef, {
        litrosTotales: increment(litrosTotales),
        rutasCompletadas: increment(1),
        updatedAt: serverTimestamp()
      });

      toast.success(`Ruta completada con éxito - ${litrosTotales}L recogidos`);
      await loadRutas();
      return true;
    } catch (err) {
      console.error("Error completando ruta:", err);
      toast.error("Error al completar la ruta");
      return false;
    }
  };
  
  const deleteRuta = async (id: string) => {
    try {
      await deleteDoc(doc(db, "rutas", id));
      toast.success("Ruta eliminada correctamente");
      await loadRutas();
      return true;
    } catch (err) {
      console.error("Error eliminando ruta:", err);
      toast.error("Error al eliminar la ruta");
      return false;
    }
  };

  useEffect(() => {
    loadRutas();
  }, []);

  return {
    rutas,
    loading,
    error,
    loadRutas,
    addRuta,
    updateRuta,
    completeRuta,
    deleteRuta,
    updateRutaRecogida
  };
}

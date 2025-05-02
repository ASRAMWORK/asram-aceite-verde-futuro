
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, getDocs, query, orderBy, addDoc, updateDoc, 
  doc, deleteDoc, serverTimestamp, where, getDoc 
} from 'firebase/firestore';
import { toast } from 'sonner';
import type { Ruta } from '@/types';
import { useRecogidas } from './useRecogidas';

export function useRutas() {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRutas = async () => {
    try {
      setLoading(true);
      const rutasRef = collection(db, "rutas");
      const rutasQuery = query(rutasRef, orderBy("createdAt", "desc"));
      const rutasSnap = await getDocs(rutasQuery);
      
      const rutasData: Ruta[] = [];
      rutasSnap.forEach((doc) => {
        const data = doc.data();
        rutasData.push({
          id: doc.id,
          nombre: data.nombre,
          distrito: data.distrito,
          barrios: data.barrios || [],
          fecha: data.fecha?.toDate(),
          hora: data.hora,
          recogedores: data.recogedores,
          clientes: data.clientes || [],
          puntosRecogida: data.puntosRecogida,
          distanciaTotal: data.distanciaTotal,
          tiempoEstimado: data.tiempoEstimado,
          frecuencia: data.frecuencia,
          completada: data.completada || false,
          litrosTotales: data.litrosTotales || 0,
          puntos: data.puntos || [],
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          tipo: data.tipo || 'distrito'
        });
      });
      
      setRutas(rutasData);
      setError(null);
    } catch (err) {
      console.error("Error cargando rutas:", err);
      setError("Error al cargar las rutas");
    } finally {
      setLoading(false);
    }
  };

  const getRutasByTipo = (tipo: 'distrito' | 'personalizada') => {
    return rutas.filter(ruta => ruta.tipo === tipo);
  };

  const addRuta = async (ruta: Omit<Ruta, "id">) => {
    try {
      await addDoc(collection(db, "rutas"), {
        ...ruta,
        puntos: ruta.puntos || [],
        completada: ruta.completada || false,
        litrosTotales: ruta.litrosTotales || 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      toast.success("Ruta creada correctamente");
      await loadRutas();
      return true;
    } catch (err) {
      console.error("Error añadiendo ruta:", err);
      toast.error("Error al crear la ruta");
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

  const updateRutaRecogida = async (rutaId: string, clienteId: string, litros: number) => {
    try {
      // First get the route document
      const rutaRef = doc(db, "rutas", rutaId);
      const rutaSnap = await getDoc(rutaRef);
      
      if (!rutaSnap.exists()) {
        toast.error("La ruta no existe");
        return false;
      }
      
      const rutaData = rutaSnap.data();
      const clientes = rutaData.clientes || [];
      
      // Update the specific client's litros
      const clientesActualizados = clientes.map((cliente: any) => 
        cliente.id === clienteId ? { ...cliente, litros } : cliente
      );
      
      // Update the route with new clients data
      await updateDoc(rutaRef, {
        clientes: clientesActualizados,
        updatedAt: serverTimestamp()
      });
      
      console.log(`Litros actualizados para cliente ${clienteId}: ${litros}`);
      toast.success("Litros registrados correctamente");
      
      // Don't reload routes here to avoid losing client input state while updating
      return true;
    } catch (err) {
      console.error("Error actualizando litros en ruta:", err);
      toast.error("Error al registrar los litros");
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

  const completeRuta = async (id: string, litrosTotales: number) => {
    try {
      console.log(`Marcando ruta ${id} como completada con ${litrosTotales} litros`);
      
      await updateDoc(doc(db, "rutas", id), {
        completada: true,
        fechaCompletada: new Date(),
        litrosTotales: litrosTotales,
        updatedAt: serverTimestamp()
      });
      
      console.log("Ruta marcada como completada exitosamente");
      toast.success(`Ruta completada con ${litrosTotales} litros recogidos`);
      
      // Reload routes after completion to update the UI
      await loadRutas();
      return true;
    } catch (err) {
      console.error("Error completando ruta:", err);
      toast.error("Error al completar la ruta");
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
    addRuta,
    updateRuta,
    updateRutaRecogida,
    deleteRuta,
    completeRuta,
    loadRutas,
    getRutasByTipo
  };
}

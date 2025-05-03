
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, getDocs, query, orderBy, addDoc, updateDoc, 
  doc, deleteDoc, serverTimestamp, where, getDoc 
} from 'firebase/firestore';
import { toast } from 'sonner';
import type { Recogida } from '@/types';

export function useRecogidas() {
  const [recogidas, setRecogidas] = useState<Recogida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecogidasData = async () => {
    try {
      setLoading(true);
      const recogidasRef = collection(db, "recogidas");
      const recogidasSnap = await getDocs(query(recogidasRef, orderBy("fechaRecogida", "desc")));
      
      const recogidasData: Recogida[] = [];
      recogidasSnap.forEach((doc) => {
        const data = doc.data();
        recogidasData.push({
          id: doc.id,
          cliente: data.cliente || '',
          direccionRecogida: data.direccionRecogida || '',
          horaRecogida: data.horaRecogida || '',
          cantidadAproximada: data.cantidadAproximada || 0,
          tipoAceite: data.tipoAceite || '',
          nombreContacto: data.nombreContacto || '',
          telefonoContacto: data.telefonoContacto || '',
          emailContacto: data.emailContacto || '',
          notasAdicionales: data.notasAdicionales || '',
          estadoRecogida: data.estadoRecogida || 'pendiente',
          fechaRecogida: data.fechaRecogida?.toDate(),
          fechaSolicitud: data.fechaSolicitud?.toDate(),
          fechaCompletada: data.fechaCompletada?.toDate(),
          litrosRecogidos: data.litrosRecogidos || 0,
          direccion: data.direccion || '',
          distrito: data.distrito || '',
          barrio: data.barrio || '',
          horaInicio: data.horaInicio || '',
          hora: data.hora || '',
          completada: data.completada || false,
          estado: data.estado || '',
          clienteId: data.clienteId || '',
          rutaId: data.rutaId || '',
          esRecogidaZona: data.esRecogidaZona || false,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          fecha: data.fecha?.toDate() || data.fechaRecogida?.toDate()
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

  const addRecogida = async (nuevaRecogida: Partial<Omit<Recogida, "id">>) => {
    try {
      // Si es una recogida de ruta, verificamos si ya existe una recogida para este cliente en esta ruta
      // para evitar duplicados cuando se completa una ruta
      if (nuevaRecogida.rutaId && nuevaRecogida.clienteId && nuevaRecogida.esRecogidaZona) {
        const existingRecogidas = recogidas.filter(r => 
          r.rutaId === nuevaRecogida.rutaId && 
          r.clienteId === nuevaRecogida.clienteId &&
          r.fecha && nuevaRecogida.fecha &&
          r.fecha.toDateString() === nuevaRecogida.fecha.toDateString()
        );
        
        // Si ya existe una recogida para este cliente en esta ruta en la misma fecha, actualizamos en lugar de crear
        if (existingRecogidas.length > 0) {
          const existingId = existingRecogidas[0].id;
          await updateDoc(doc(db, "recogidas", existingId), {
            litrosRecogidos: nuevaRecogida.litrosRecogidos,
            estadoRecogida: "completada",
            completada: true,
            fechaCompletada: nuevaRecogida.fechaCompletada || new Date(),
            updatedAt: serverTimestamp()
          });
          
          await loadRecogidasData(); // Recargar datos
          return true;
        }
      }
      
      const recogidaData = {
        ...nuevaRecogida,
        estadoRecogida: nuevaRecogida.estadoRecogida || "pendiente",
        fechaRecogida: nuevaRecogida.fechaRecogida || nuevaRecogida.fecha || new Date(),
        fecha: nuevaRecogida.fecha || nuevaRecogida.fechaRecogida || new Date(),
        completada: nuevaRecogida.completada ?? false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await addDoc(collection(db, "recogidas"), recogidaData);
      
      if (!nuevaRecogida.esRecogidaZona && !nuevaRecogida.esHistorico) {
        toast.success("Recogida programada correctamente");
      }
      
      await loadRecogidasData();
      return true;
    } catch (err) {
      console.error("Error añadiendo recogida:", err);
      toast.error("Error al programar la recogida");
      return false;
    }
  };

  const updateRecogida = async (id: string, data: Partial<Recogida>) => {
    try {
      await updateDoc(doc(db, "recogidas", id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      toast.success("Recogida actualizada correctamente");
      await loadRecogidasData();
      return true;
    } catch (err) {
      console.error("Error actualizando recogida:", err);
      toast.error("Error al actualizar la recogida");
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
      
      // Also update any recogidas associated with this client in this route
      const recogidasQuery = query(
        collection(db, "recogidas"),
        where("rutaId", "==", rutaId),
        where("clienteId", "==", clienteId)
      );
      
      const recogidasSnap = await getDocs(recogidasQuery);
      
      const updatePromises = recogidasSnap.docs.map(recogidaDoc =>
        updateDoc(doc(db, "recogidas", recogidaDoc.id), {
          litrosRecogidos: litros,
          updatedAt: serverTimestamp()
        })
      );
      
      await Promise.all(updatePromises);
      
      toast.success("Litros registrados correctamente");
      await loadRecogidasData();
      return true;
    } catch (err) {
      console.error("Error actualizando litros en ruta:", err);
      toast.error("Error al registrar los litros");
      return false;
    }
  };

  const deleteRecogida = async (id: string) => {
    try {
      await deleteDoc(doc(db, "recogidas", id));
      toast.success("Recogida eliminada correctamente");
      await loadRecogidasData();
      return true;
    } catch (err) {
      console.error("Error eliminando recogida:", err);
      toast.error("Error al eliminar la recogida");
      return false;
    }
  };

  const completarRecogida = async (id: string, litrosRecogidos: number) => {
    try {
      await updateDoc(doc(db, "recogidas", id), {
        estadoRecogida: "completada",
        completada: true,
        litrosRecogidos,
        fechaCompletada: new Date(),
        updatedAt: serverTimestamp()
      });
      
      toast.success("Recogida completada correctamente");
      await loadRecogidasData();
      return true;
    } catch (err) {
      console.error("Error completando recogida:", err);
      toast.error("Error al completar la recogida");
      return false;
    }
  };

  const completeRecogida = async (id: string, litrosRecogidos: number = 0) => {
    return completarRecogida(id, litrosRecogidos);
  };

  const completarRecogidasRuta = async (rutaId: string) => {
    try {
      const recogidasQuery = query(
        collection(db, "recogidas"),
        where("rutaId", "==", rutaId)
      );
      
      const recogidasSnap = await getDocs(recogidasQuery);
      
      const updatePromises = recogidasSnap.docs.map(recogidaDoc => {
        const recogidaData = recogidaDoc.data();
        return updateDoc(doc(db, "recogidas", recogidaDoc.id), {
          estadoRecogida: "completada",
          completada: true,
          fechaCompletada: new Date(),
          updatedAt: serverTimestamp()
        });
      });
      
      await Promise.all(updatePromises);
      
      toast.success("Todas las recogidas de la ruta completadas");
      await loadRecogidasData();
      return true;
    } catch (err) {
      console.error("Error completando recogidas de ruta:", err);
      toast.error("Error al completar las recogidas");
      return false;
    }
  };

  const getTotalLitrosRecogidos = () => {
    return recogidas.reduce((total, recogida) => {
      return total + (recogida.litrosRecogidos || 0);
    }, 0);
  };
  
  const getTotalLitrosRecogidosPorRuta = (rutaId: string) => {
    return recogidas
      .filter(recogida => recogida.rutaId === rutaId)
      .reduce((total, recogida) => {
        return total + (recogida.litrosRecogidos || 0);
      }, 0);
  };

  const getLitrosRecolectadosPorDistrito = () => {
    const litrosPorDistrito: Record<string, number> = {};
    
    recogidas.forEach((recogida) => {
      if (recogida.distrito && recogida.litrosRecogidos) {
        if (!litrosPorDistrito[recogida.distrito]) {
          litrosPorDistrito[recogida.distrito] = 0;
        }
        litrosPorDistrito[recogida.distrito] += recogida.litrosRecogidos;
      }
    });
    
    return litrosPorDistrito;
  };

  const calcularPromedioLitrosPorRecogida = () => {
    const recogidasCompletadas = recogidas.filter(r => r.estadoRecogida === "completada" || r.completada);
    if (recogidasCompletadas.length === 0) return 0;
    
    const totalLitros = recogidasCompletadas.reduce((sum, r) => sum + (r.litrosRecogidos || 0), 0);
    return totalLitros / recogidasCompletadas.length;
  };

  const calcularPromedioLitrosPorPeriodo = () => {
    // Example calculation - can be customized as needed
    const totalLitros = getTotalLitrosRecogidos();
    const diasTotales = 30; // Assuming a 30-day period
    
    return totalLitros / diasTotales;
  };

  const getRecogidasByClientId = (clienteId: string) => {
    return recogidas.filter(recogida => recogida.clienteId === clienteId);
  };

  const getRecogidasByRutaId = (rutaId: string) => {
    return recogidas.filter(recogida => recogida.rutaId === rutaId);
  };

  useEffect(() => {
    loadRecogidasData();
  }, []);

  return {
    recogidas,
    loading,
    error,
    loadRecogidasData,
    addRecogida,
    updateRecogida,
    deleteRecogida,
    completarRecogida,
    completeRecogida,
    completarRecogidasRuta,
    getRecogidasByClientId,
    getRecogidasByRutaId,
    getTotalLitrosRecogidos,
    getTotalLitrosRecogidosPorRuta,
    getLitrosRecolectadosPorDistrito,
    calcularPromedioLitrosPorRecogida,
    calcularPromedioLitrosPorPeriodo,
    updateRutaRecogida
  };
}

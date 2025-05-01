
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, 
  doc, deleteDoc, serverTimestamp, where, getDoc 
} from 'firebase/firestore';
import { toast } from 'sonner';
import type { Recogida } from '@/types';
import { useUserProfile } from '@/hooks/useUserProfile';

// Extend the Recogida type to include adminId
interface RecogidaWithAdmin extends Recogida {
  adminId?: string;
}

export function useRecogidas(adminId?: string) {
  const [recogidas, setRecogidas] = useState<RecogidaWithAdmin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useUserProfile();
  
  // Usar el adminId proporcionado o el del perfil actual
  const efectiveAdminId = adminId || profile?.id;

  // Make sure that the Recogida object doesn't include properties that aren't in the interface
  const loadRecogidasData = async () => {
    try {
      setLoading(true);
      
      if (!efectiveAdminId) {
        console.error("No hay ID de administrador disponible para filtrar recogidas");
        setLoading(false);
        return;
      }
      
      const recogidasRef = collection(db, "recogidas");
      
      // Filtrar por adminId
      const recogidasQuery = query(
        recogidasRef,
        where("adminId", "==", efectiveAdminId),
        orderBy("fechaRecogida", "desc")
      );
      
      const recogidasSnap = await getDocs(recogidasQuery);
      
      const recogidasData: RecogidaWithAdmin[] = [];
      recogidasSnap.forEach((doc) => {
        const data = doc.data();
        recogidasData.push({
          id: doc.id,
          ...data as RecogidaWithAdmin,
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

  const addRecogida = async (nuevaRecogida: Partial<Omit<RecogidaWithAdmin, "id">>) => {
    try {
      if (!efectiveAdminId) {
        toast.error('No se puede asociar la recogida a un administrador');
        return false;
      }
      
      const recogidaData = {
        ...nuevaRecogida,
        adminId: efectiveAdminId, // Asegurar que siempre se guarda con adminId
        estadoRecogida: nuevaRecogida.estadoRecogida || "pendiente",
        fechaRecogida: nuevaRecogida.fechaRecogida || nuevaRecogida.fecha || new Date(),
        fecha: nuevaRecogida.fecha || nuevaRecogida.fechaRecogida || new Date(),
        completada: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await addDoc(collection(db, "recogidas"), recogidaData);
      
      if (!nuevaRecogida.esRecogidaZona) {
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

  const updateRecogida = async (id: string, data: Partial<RecogidaWithAdmin>) => {
    try {
      // Verificar que la recogida pertenece a este administrador
      const recogida = recogidas.find(r => r.id === id);
      if (!recogida || recogida.adminId !== efectiveAdminId) {
        toast.error("No tienes permiso para actualizar esta recogida");
        return false;
      }
      
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
      // Verificar que la recogida pertenece a este administrador
      const recogida = recogidas.find(r => r.id === id);
      if (!recogida || recogida.adminId !== efectiveAdminId) {
        toast.error("No tienes permiso para eliminar esta recogida");
        return false;
      }
      
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
      // Verificar que la recogida pertenece a este administrador
      const recogida = recogidas.find(r => r.id === id);
      if (!recogida || recogida.adminId !== efectiveAdminId) {
        toast.error("No tienes permiso para completar esta recogida");
        return false;
      }
      
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
    if (efectiveAdminId) {
      loadRecogidasData();
    }
  }, [efectiveAdminId]);

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

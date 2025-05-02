
import { addDoc, collection, deleteDoc, doc, getDoc, serverTimestamp, updateDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { toast } from 'sonner';
import { useUserProfile } from '../useUserProfile';
import { useState } from 'react';

// Operations related to CRUD for recogidas
export function useRecogidaOperations(adminId?: string) {
  const [loading, setLoading] = useState(false);
  const { profile } = useUserProfile();
  
  // Use the adminId provided or the one from the profile
  const effectiveAdminId = adminId || profile?.id;

  const addRecogida = async (nuevaRecogida: any) => {
    try {
      setLoading(true);
      
      if (!effectiveAdminId) {
        toast.error('No se puede asociar la recogida a un administrador');
        return false;
      }
      
      // Normalizar datos para evitar duplicaciones
      const direccion = nuevaRecogida.direccionRecogida || nuevaRecogida.direccion || '';
      const fecha = nuevaRecogida.fechaRecogida || nuevaRecogida.fecha || new Date();
      
      const recogidaData = {
        ...nuevaRecogida,
        adminId: nuevaRecogida.adminId || effectiveAdminId, // Usar el proporcionado o el efectivo
        administradorId: nuevaRecogida.administradorId || effectiveAdminId, // Usar ambos para compatibilidad
        estadoRecogida: nuevaRecogida.estadoRecogida || "pendiente",
        fechaRecogida: fecha,
        fecha: fecha,
        direccion: direccion,
        direccionRecogida: direccion,
        completada: nuevaRecogida.completada !== undefined ? nuevaRecogida.completada : false,
        litrosRecogidos: nuevaRecogida.litrosRecogidos || 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await addDoc(collection(db, "recogidas"), recogidaData);
      
      // Solo mostrar la notificación si no es una recogida por zona o es histórica
      if (!nuevaRecogida.esRecogidaZona && !nuevaRecogida.esHistorico) {
        toast.success("Recogida programada correctamente");
      } else if (nuevaRecogida.esHistorico) {
        // Notificación específica para recolecciones históricas
        toast.success(`Recolección histórica añadida: ${nuevaRecogida.litrosRecogidos || 0} litros`);
      }
      
      return true;
    } catch (err) {
      console.error("Error añadiendo recogida:", err);
      toast.error("Error al registrar la recogida");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateRecogida = async (id: string, data: any, recogidas: any[]) => {
    try {
      setLoading(true);
      // Verify the recogida belongs to this admin
      const recogida = recogidas.find(r => r.id === id);
      if (!recogida || (recogida.adminId !== effectiveAdminId && recogida.administradorId !== effectiveAdminId)) {
        toast.error("No tienes permiso para actualizar esta recogida");
        return false;
      }
      
      // Normalizar datos antes de actualizarlos
      const updateData = { ...data };
      
      // Si hay cambio de dirección, actualizar ambos campos para consistencia
      if (data.direccion) {
        updateData.direccionRecogida = data.direccion;
      } else if (data.direccionRecogida) {
        updateData.direccion = data.direccionRecogida;
      }
      
      await updateDoc(doc(db, "recogidas", id), {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      
      toast.success("Recogida actualizada correctamente");
      return true;
    } catch (err) {
      console.error("Error actualizando recogida:", err);
      toast.error("Error al actualizar la recogida");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const deleteRecogida = async (id: string, recogidas: any[]) => {
    try {
      setLoading(true);
      // Verify the recogida belongs to this admin
      const recogida = recogidas.find(r => r.id === id);
      if (!recogida || (recogida.adminId !== effectiveAdminId && recogida.administradorId !== effectiveAdminId)) {
        toast.error("No tienes permiso para eliminar esta recogida");
        return false;
      }
      
      await deleteDoc(doc(db, "recogidas", id));
      toast.success("Recogida eliminada correctamente");
      return true;
    } catch (err) {
      console.error("Error eliminando recogida:", err);
      toast.error("Error al eliminar la recogida");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const completarRecogida = async (id: string, litrosRecogidos: number, recogidas: any[]) => {
    try {
      setLoading(true);
      // Verify the recogida belongs to this admin
      const recogida = recogidas.find(r => r.id === id);
      if (!recogida || (recogida.adminId !== effectiveAdminId && recogida.administradorId !== effectiveAdminId)) {
        toast.error("No tienes permiso para completar esta recogida");
        return false;
      }
      
      const fechaCompletada = new Date();
      
      await updateDoc(doc(db, "recogidas", id), {
        estadoRecogida: "completada",
        completada: true,
        litrosRecogidos,
        fechaCompletada,
        updatedAt: serverTimestamp()
      });
      
      toast.success("Recogida completada correctamente");
      return true;
    } catch (err) {
      console.error("Error completando recogida:", err);
      toast.error("Error al completar la recogida");
      return false;
    } finally {
      setLoading(false);
    }
  };

  const updateRutaRecogida = async (rutaId: string, clienteId: string, litros: number) => {
    try {
      setLoading(true);
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
      
      // Also update any recogidas associated with this client in this route is handled 
      // in the useRecogidas hook that calls this function
      
      toast.success("Litros registrados correctamente");
      return true;
    } catch (err) {
      console.error("Error actualizando litros en ruta:", err);
      toast.error("Error al registrar los litros");
      return false;
    } finally {
      setLoading(false);
    }
  };

  return {
    loading,
    addRecogida,
    updateRecogida,
    deleteRecogida,
    completarRecogida,
    updateRutaRecogida
  };
}

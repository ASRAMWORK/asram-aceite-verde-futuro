
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
      if (!effectiveAdminId) {
        toast.error('No se puede asociar la recogida a un administrador');
        return false;
      }
      
      const recogidaData = {
        ...nuevaRecogida,
        adminId: effectiveAdminId, // Ensure adminId is always saved
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
      return true;
    } catch (err) {
      console.error("Error añadiendo recogida:", err);
      toast.error("Error al programar la recogida");
      return false;
    }
  };

  const updateRecogida = async (id: string, data: any, recogidas: any[]) => {
    try {
      // Verify the recogida belongs to this admin
      const recogida = recogidas.find(r => r.id === id);
      if (!recogida || recogida.adminId !== effectiveAdminId) {
        toast.error("No tienes permiso para actualizar esta recogida");
        return false;
      }
      
      await updateDoc(doc(db, "recogidas", id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      toast.success("Recogida actualizada correctamente");
      return true;
    } catch (err) {
      console.error("Error actualizando recogida:", err);
      toast.error("Error al actualizar la recogida");
      return false;
    }
  };

  const deleteRecogida = async (id: string, recogidas: any[]) => {
    try {
      // Verify the recogida belongs to this admin
      const recogida = recogidas.find(r => r.id === id);
      if (!recogida || recogida.adminId !== effectiveAdminId) {
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
    }
  };

  const completarRecogida = async (id: string, litrosRecogidos: number, recogidas: any[]) => {
    try {
      // Verify the recogida belongs to this admin
      const recogida = recogidas.find(r => r.id === id);
      if (!recogida || recogida.adminId !== effectiveAdminId) {
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
      return true;
    } catch (err) {
      console.error("Error completando recogida:", err);
      toast.error("Error al completar la recogida");
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
      const updatePromises = [];
      // Note: This operation is handled in the main useRecogidas hook
      
      toast.success("Litros registrados correctamente");
      return true;
    } catch (err) {
      console.error("Error actualizando litros en ruta:", err);
      toast.error("Error al registrar los litros");
      return false;
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

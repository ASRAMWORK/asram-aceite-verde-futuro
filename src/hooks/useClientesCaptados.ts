
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  orderBy
} from 'firebase/firestore';
import { toast } from 'sonner';
import { ClienteCaptado } from '@/types/comercial';
import { useUserProfile } from '@/hooks/useUserProfile';

export function useClientesCaptados() {
  const [clientes, setClientes] = useState<ClienteCaptado[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useUserProfile();

  const loadClientesData = async (comercialId?: string) => {
    try {
      setLoading(true);
      
      let clientesQuery;
      
      // If comercialId is provided, filter by it
      if (comercialId) {
        clientesQuery = query(
          collection(db, "clientesCaptados"),
          where("comercialId", "==", comercialId),
          orderBy("fechaRegistro", "desc")
        );
      } 
      // If user is comercial, show only their clients
      else if (profile?.role === 'comercial') {
        clientesQuery = query(
          collection(db, "clientesCaptados"),
          where("comercialId", "==", profile.id),
          orderBy("fechaRegistro", "desc")
        );
      } 
      // For superadmin, show all
      else {
        clientesQuery = query(
          collection(db, "clientesCaptados"),
          orderBy("fechaRegistro", "desc")
        );
      }
      
      const clientesSnap = await getDocs(clientesQuery);
      
      const clientesData: ClienteCaptado[] = [];
      clientesSnap.forEach((doc) => {
        const data = doc.data();
        clientesData.push({
          id: doc.id,
          comercialId: data.comercialId,
          clienteId: data.clienteId,
          nombreCliente: data.nombreCliente,
          fechaRegistro: data.fechaRegistro?.toDate() || new Date(),
          planContratado: data.planContratado || 'Básico',
          estado: data.estado || 'activo',
          litrosRecogidos: data.litrosRecogidos || 0
        });
      });
      
      setClientes(clientesData);
      setError(null);
    } catch (err) {
      console.error("Error cargando clientes captados:", err);
      setError("Error al cargar datos de clientes captados");
    } finally {
      setLoading(false);
    }
  };

  const addClienteCaptado = async (clienteData: Partial<ClienteCaptado>) => {
    try {
      const docRef = await addDoc(collection(db, "clientesCaptados"), {
        ...clienteData,
        fechaRegistro: serverTimestamp()
      });
      
      toast.success("Cliente captado añadido correctamente");
      await loadClientesData();
      return docRef.id;
    } catch (err) {
      console.error("Error añadiendo cliente captado:", err);
      toast.error("Error al añadir cliente captado");
      throw err;
    }
  };

  const updateClienteCaptado = async (id: string, data: Partial<ClienteCaptado>) => {
    try {
      await updateDoc(doc(db, "clientesCaptados", id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      
      toast.success("Cliente captado actualizado correctamente");
      await loadClientesData();
    } catch (err) {
      console.error("Error actualizando cliente captado:", err);
      toast.error("Error al actualizar cliente captado");
      throw err;
    }
  };

  const getClientesByComercialId = (comercialId: string) => {
    return clientes.filter(cliente => cliente.comercialId === comercialId);
  };

  const getTotalLitrosByComercialId = (comercialId: string) => {
    return clientes
      .filter(cliente => cliente.comercialId === comercialId)
      .reduce((total, cliente) => total + cliente.litrosRecogidos, 0);
  };

  const getTotalClientesByComercialId = (comercialId: string) => {
    return clientes.filter(cliente => cliente.comercialId === comercialId).length;
  };

  useEffect(() => {
    loadClientesData();
  }, [profile?.id]);

  return {
    clientes,
    loading,
    error,
    loadClientesData,
    addClienteCaptado,
    updateClienteCaptado,
    getClientesByComercialId,
    getTotalLitrosByComercialId,
    getTotalClientesByComercialId
  };
}

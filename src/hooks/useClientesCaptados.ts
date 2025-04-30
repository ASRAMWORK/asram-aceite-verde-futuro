
import { useState, useEffect } from 'react';
import { collection, query, where, getDocs, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import { useAuth } from '@/contexts/AuthContext';
import type { ClienteCaptado } from '@/types/comercial';

export const useClientesCaptados = () => {
  const [clientesCaptados, setClientesCaptados] = useState<ClienteCaptado[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth(); // Use user instead of currentUser to match AuthContext

  const fetchClientesCaptados = async (comercialId?: string) => {
    try {
      setLoading(true);
      const clientesRef = collection(db, 'clientesCaptados');
      let clientesQuery;
      
      if (comercialId) {
        // Si se proporciona un ID específico, filtrar por ese comercial
        clientesQuery = query(clientesRef, where('comercialId', '==', comercialId));
      } else if (user) {
        // Si no se proporciona ID pero hay un usuario autenticado, filtrar por ese usuario
        clientesQuery = query(clientesRef, where('comercialId', '==', user.uid));
      } else {
        // Si no hay filtro ni usuario, obtener todos (solo para admin)
        clientesQuery = clientesRef;
      }
      
      const querySnapshot = await getDocs(clientesQuery);
      const clientes: ClienteCaptado[] = [];
      
      querySnapshot.forEach((doc) => {
        const data = doc.data() as ClienteCaptado;
        clientes.push({
          id: doc.id,
          comercialId: data.comercialId,
          clienteId: data.clienteId,
          nombreCliente: data.nombreCliente,
          fechaRegistro: data.fechaRegistro instanceof Date ? 
            data.fechaRegistro : 
            new Date(data.fechaRegistro),
          planContratado: data.planContratado,
          estado: data.estado,
          litrosRecogidos: data.litrosRecogidos,
        });
      });
      
      setClientesCaptados(clientes);
    } catch (error) {
      console.error('Error al obtener clientes captados:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchClientesCaptados();
  }, [user?.uid]);

  const addClienteCaptado = async (cliente: Omit<ClienteCaptado, 'id'>) => {
    try {
      const clienteRef = await addDoc(collection(db, 'clientesCaptados'), {
        ...cliente,
        fechaRegistro: new Date(),
        litrosRecogidos: 0,
      });
      
      const newCliente: ClienteCaptado = {
        id: clienteRef.id,
        ...cliente,
        fechaRegistro: new Date(),
        litrosRecogidos: 0,
      };
      
      setClientesCaptados((prevClientes) => [...prevClientes, newCliente]);
      return newCliente;
    } catch (error) {
      console.error('Error al añadir cliente captado:', error);
      throw error;
    }
  };

  const updateClienteCaptado = async (id: string, data: Partial<ClienteCaptado>) => {
    try {
      await updateDoc(doc(db, 'clientesCaptados', id), data);
      
      setClientesCaptados((prevClientes) => 
        prevClientes.map((cliente) => 
          cliente.id === id ? { ...cliente, ...data } : cliente
        )
      );
    } catch (error) {
      console.error('Error al actualizar cliente captado:', error);
      throw error;
    }
  };

  const deleteClienteCaptado = async (id: string) => {
    try {
      await deleteDoc(doc(db, 'clientesCaptados', id));
      setClientesCaptados((prevClientes) => 
        prevClientes.filter((cliente) => cliente.id !== id)
      );
    } catch (error) {
      console.error('Error al eliminar cliente captado:', error);
      throw error;
    }
  };
  
  // Add the missing methods that are being used in components
  const getTotalLitrosByComercialId = (comercialId: string) => {
    return clientesCaptados
      .filter(cliente => cliente.comercialId === comercialId)
      .reduce((total, cliente) => total + cliente.litrosRecogidos, 0);
  };
  
  const getTotalClientesByComercialId = (comercialId: string) => {
    return clientesCaptados.filter(cliente => cliente.comercialId === comercialId).length;
  };
  
  const getClientesByComercialId = (comercialId: string) => {
    return clientesCaptados.filter(cliente => cliente.comercialId === comercialId);
  };

  return {
    clientesCaptados,
    loading,
    fetchClientesCaptados,
    addClienteCaptado,
    updateClienteCaptado,
    deleteClienteCaptado,
    getTotalLitrosByComercialId,
    getTotalClientesByComercialId,
    getClientesByComercialId,
    // For backward compatibility with existing components
    clientes: clientesCaptados
  };
};

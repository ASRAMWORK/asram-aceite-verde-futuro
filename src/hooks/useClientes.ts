import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import type { Usuario } from '@/types';
import { toast } from 'sonner';

export function useClientes() {
  const [clientes, setClientes] = useState<Usuario[]>([]);
  const [clientesInactivos, setClientesInactivos] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingInactivos, setLoadingInactivos] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadClientesData = async () => {
    try {
      setLoading(true);
      const clientesRef = collection(db, "usuarios");
      const clientesSnap = await getDocs(query(clientesRef, where("activo", "==", true)));
      
      const clientesData: Usuario[] = [];
      clientesSnap.forEach((doc) => {
        clientesData.push({ id: doc.id, ...doc.data() } as Usuario);
      });
      
      setClientes(clientesData);
      setError(null);
    } catch (err) {
      console.error("Error cargando clientes:", err);
      setError("Error al cargar datos de clientes");
    } finally {
      setLoading(false);
    }
  };

  const loadClientesInactivos = async () => {
    try {
      setLoadingInactivos(true);
      const clientesRef = collection(db, "usuarios");
      const clientesSnap = await getDocs(query(clientesRef, where("activo", "==", false)));
      
      const clientesData: Usuario[] = [];
      clientesSnap.forEach((doc) => {
        clientesData.push({ id: doc.id, ...doc.data() } as Usuario);
      });
      
      setClientesInactivos(clientesData);
    } catch (err) {
      console.error("Error cargando clientes inactivos:", err);
    } finally {
      setLoadingInactivos(false);
    }
  };

  const addCliente = async (clienteData: Partial<Usuario>) => {
    try {
      // Ensure required fields are present
      if (!clienteData.nombre) {
        throw new Error("El nombre es requerido");
      }

      const docRef = await addDoc(collection(db, "usuarios"), {
        ...clienteData,
        activo: true,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      const newCliente: Usuario = {
        id: docRef.id,
        ...clienteData,
        activo: true
      } as Usuario;
      
      setClientes((prevClientes) => [...prevClientes, newCliente]);
      toast.success("Cliente añadido correctamente");
      return newCliente;
    } catch (err) {
      console.error("Error añadiendo cliente:", err);
      toast.error("Error al añadir cliente");
      throw err;
    }
  };

  const updateCliente = async (id: string, data: Partial<Usuario>) => {
    try {
      await updateDoc(doc(db, "usuarios", id), {
        ...data,
        updatedAt: new Date()
      });
      
      setClientes((prevClientes) => 
        prevClientes.map((cliente) => 
          cliente.id === id ? { ...cliente, ...data } : cliente
        )
      );
      
      toast.success("Cliente actualizado correctamente");
    } catch (err) {
      console.error("Error actualizando cliente:", err);
      toast.error("Error al actualizar cliente");
      throw err;
    }
  };

  const deleteCliente = async (id: string) => {
    try {
      // Borrado físico - elimina el documento completamente de la base de datos
      await deleteDoc(doc(db, "usuarios", id));
      
      setClientes((prevClientes) => 
        prevClientes.filter((cliente) => cliente.id !== id)
      );
      
      toast.success("Cliente eliminado permanentemente");
    } catch (err) {
      console.error("Error eliminando cliente:", err);
      toast.error("Error al eliminar cliente");
      throw err;
    }
  };

  const restaurarCliente = async (id: string) => {
    try {
      // Restaurar cliente - marcar como activo
      await updateDoc(doc(db, "usuarios", id), {
        activo: true,
        updatedAt: new Date()
      });
      
      // Actualizar listado de clientes inactivos
      const clienteRestaurado = clientesInactivos.find(c => c.id === id);
      setClientesInactivos(prev => prev.filter(c => c.id !== id));
      
      // Actualizar listado de clientes activos si ya está cargado
      if (clienteRestaurado) {
        const clienteActivo = { ...clienteRestaurado, activo: true };
        setClientes(prev => [...prev, clienteActivo]);
      }
      
      toast.success("Cliente restaurado correctamente");
      return true;
    } catch (err) {
      console.error("Error restaurando cliente:", err);
      toast.error("Error al restaurar cliente");
      throw err;
    }
  };

  const getDistritosUnicos = () => {
    const distritos = clientes
      .filter(cliente => cliente.distrito)
      .map(cliente => cliente.distrito as string);
    
    return [...new Set(distritos)].sort();
  };

  const getBarriosUnicos = (distrito?: string) => {
    const barrios = clientes
      .filter(cliente => !distrito || cliente.distrito === distrito)
      .filter(cliente => cliente.barrio)
      .map(cliente => cliente.barrio as string);
    
    return [...new Set(barrios)].sort();
  };

  useEffect(() => {
    loadClientesData();
  }, []);

  return { 
    clientes, 
    clientesInactivos,
    loading,
    loadingInactivos,
    error, 
    loadClientesData,
    loadClientesInactivos,
    addCliente,
    updateCliente,
    deleteCliente,
    restaurarCliente,
    getDistritosUnicos,
    getBarriosUnicos 
  };
}

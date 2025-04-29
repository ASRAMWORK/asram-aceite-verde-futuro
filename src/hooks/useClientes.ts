
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, where, addDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import type { Usuario } from '@/types';
import { toast } from 'sonner';

export function useClientes() {
  const [clientes, setClientes] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
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
      // Soft delete - just mark as inactive
      await updateDoc(doc(db, "usuarios", id), {
        activo: false,
        updatedAt: new Date()
      });
      
      setClientes((prevClientes) => 
        prevClientes.filter((cliente) => cliente.id !== id)
      );
      
      toast.success("Cliente eliminado correctamente");
    } catch (err) {
      console.error("Error eliminando cliente:", err);
      toast.error("Error al eliminar cliente");
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
    loading, 
    error, 
    loadClientesData,
    addCliente,
    updateCliente,
    deleteCliente,
    getDistritosUnicos,
    getBarriosUnicos 
  };
}

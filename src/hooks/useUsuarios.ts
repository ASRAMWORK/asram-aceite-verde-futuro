
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, addDoc, updateDoc, doc, deleteDoc, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import type { Usuario, UserRole } from '@/types';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsuariosData = async () => {
    try {
      setLoading(true);
      const usuariosRef = collection(db, "usuarios");
      const usuariosSnap = await getDocs(query(usuariosRef, orderBy("nombre")));
      
      const usuariosData: Usuario[] = [];
      usuariosSnap.forEach((doc) => {
        const data = doc.data();
        usuariosData.push({
          id: doc.id,
          ...data as Usuario,
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
          fechaRegistro: data.fechaRegistro?.toDate()
        });
      });
      
      setUsuarios(usuariosData);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      setError("Error al cargar los datos de usuarios");
    } finally {
      setLoading(false);
    }
  };

  const getUsuariosByTipo = (tipo: string) => {
    return usuarios.filter(usuario => usuario.tipo === tipo);
  };

  const getUsuariosByRole = (role: string) => {
    return usuarios.filter(usuario => usuario.role === role);
  };

  const addUsuario = async (usuario: Omit<Usuario, "id">) => {
    try {
      await addDoc(collection(db, "usuarios"), {
        ...usuario,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success("Usuario añadido correctamente");
      await loadUsuariosData();
      return true;
    } catch (err) {
      console.error("Error añadiendo usuario:", err);
      toast.error("Error al añadir el usuario");
      return false;
    }
  };

  const addCliente = async (cliente: Omit<Usuario, "id">) => {
    try {
      await addDoc(collection(db, "usuarios"), {
        ...cliente,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success("Cliente añadido correctamente");
      await loadUsuariosData();
      return true;
    } catch (err) {
      console.error("Error añadiendo cliente:", err);
      toast.error("Error al añadir el cliente");
      return false;
    }
  };

  const updateUsuario = async (id: string, data: Partial<Usuario>) => {
    try {
      await updateDoc(doc(db, "usuarios", id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      toast.success("Usuario actualizado correctamente");
      await loadUsuariosData();
      return true;
    } catch (err) {
      console.error("Error actualizando usuario:", err);
      toast.error("Error al actualizar el usuario");
      return false;
    }
  };

  const deleteUsuario = async (id: string) => {
    try {
      await deleteDoc(doc(db, "usuarios", id));
      toast.success("Usuario eliminado correctamente");
      await loadUsuariosData();
      return true;
    } catch (err) {
      console.error("Error eliminando usuario:", err);
      toast.error("Error al eliminar el usuario");
      return false;
    }
  };

  const updateUserRole = async (id: string, role: string) => {
    try {
      await updateDoc(doc(db, "usuarios", id), {
        role,
        updatedAt: serverTimestamp()
      });
      toast.success("Rol actualizado correctamente");
      await loadUsuariosData();
      return true;
    } catch (err) {
      console.error("Error actualizando rol:", err);
      toast.error("Error al actualizar el rol");
      return false;
    }
  };

  useEffect(() => {
    loadUsuariosData();
  }, []);

  return {
    usuarios,
    loading,
    error,
    loadUsuariosData,
    getUsuariosByTipo,
    getUsuariosByRole,
    updateUsuario,
    deleteUsuario,
    updateUserRole,
    addCliente,
    addUsuario
  };
}

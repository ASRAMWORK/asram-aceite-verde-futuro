
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, where, serverTimestamp } from 'firebase/firestore';
import type { Usuario } from '@/types';
import { toast } from 'sonner';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadUsuariosData = async () => {
    try {
      setLoading(true);
      const usuariosRef = collection(db, "usuarios");
      const usuariosSnap = await getDocs(query(usuariosRef, orderBy("createdAt", "desc")));
      
      const usuariosData: Usuario[] = [];
      usuariosSnap.forEach((doc) => {
        usuariosData.push({ id: doc.id, ...doc.data() } as Usuario);
      });
      
      setUsuarios(usuariosData);
    } catch (err) {
      console.error("Error cargando usuarios:", err);
      setError("Error al cargar datos de usuarios");
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
  
  const getUsuariosByDistrito = (distrito: string) => {
    return usuarios.filter(usuario => usuario.distrito === distrito);
  };
  
  const getUsuariosByBarrio = (barrio: string) => {
    return usuarios.filter(usuario => usuario.barrio === barrio);
  };

  const addUsuario = async (data: Omit<Usuario, "id">) => {
    try {
      const usuarioData = {
        ...data,
        createdAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, "usuarios"), usuarioData);
      toast.success("Usuario añadido correctamente");
      await loadUsuariosData();
      return { id: docRef.id, ...data };
    } catch (err) {
      console.error("Error añadiendo usuario:", err);
      toast.error("Error al añadir el usuario");
      throw err;
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
      // Soft delete approach
      await updateDoc(doc(db, "usuarios", id), {
        activo: false,
        updatedAt: serverTimestamp()
      });
      toast.success("Usuario desactivado correctamente");
      await loadUsuariosData();
      return true;
    } catch (err) {
      console.error("Error eliminando usuario:", err);
      toast.error("Error al desactivar el usuario");
      return false;
    }
  };

  const updateUserRole = async (id: string, role: string) => {
    try {
      await updateDoc(doc(db, "usuarios", id), {
        role,
        updatedAt: serverTimestamp()
      });
      toast.success(`Rol actualizado a ${role} correctamente`);
      await loadUsuariosData();
      return true;
    } catch (err) {
      console.error("Error actualizando rol:", err);
      toast.error("Error al actualizar el rol del usuario");
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
    getUsuariosByDistrito,
    getUsuariosByBarrio,
    addUsuario,
    updateUsuario,
    deleteUsuario,
    updateUserRole
  };
}

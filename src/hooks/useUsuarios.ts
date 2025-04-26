import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, where, serverTimestamp, onSnapshot } from 'firebase/firestore';
import type { Usuario } from '@/types';
import { toast } from 'sonner';
import { usePuntosVerdes } from '@/hooks/usePuntosVerdes';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [listeningForChanges, setListeningForChanges] = useState(false);

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
    if (!listeningForChanges) {
      const usuariosRef = collection(db, "usuarios");
      const q = query(usuariosRef, orderBy("createdAt", "desc"));
      
      const unsubscribe = onSnapshot(q, (snapshot) => {
        const usuariosData: Usuario[] = [];
        snapshot.forEach((doc) => {
          usuariosData.push({ id: doc.id, ...doc.data() } as Usuario);
        });
        setUsuarios(usuariosData);
        setLoading(false);
      }, (err) => {
        console.error("Error observing usuarios:", err);
        setError("Error al observar cambios en usuarios");
        setLoading(false);
      });

      setListeningForChanges(true);
      return () => unsubscribe();
    }
  }, [listeningForChanges]);

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

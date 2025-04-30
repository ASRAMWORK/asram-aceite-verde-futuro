
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, addDoc, updateDoc, doc, deleteDoc, where, orderBy, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import type { Usuario, UserRole } from '@/types';
import { useUserProfile } from '@/hooks/useUserProfile';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useUserProfile();

  const loadUsuariosData = async () => {
    try {
      setLoading(true);
      
      // Define la consulta base para la colección de usuarios
      let usuariosQuery;
      
      // Si el usuario logueado es admin_finca, solo carga sus propios usuarios si corresponde
      if (profile?.role === 'admin_finca') {
        usuariosQuery = query(
          collection(db, "usuarios"), 
          where("administradorId", "==", profile.id),
          orderBy("nombre")
        );
      } else {
        // Para superadmin u otros roles, carga todos los usuarios
        usuariosQuery = query(
          collection(db, "usuarios"), 
          orderBy("nombre")
        );
      }
      
      const usuariosSnap = await getDocs(usuariosQuery);
      
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

  const getPuntosVerdes = () => {
    return usuarios.filter(usuario => usuario.tipo === "punto_verde");
  };

  const getUsuariosByRole = (role: string) => {
    return usuarios.filter(usuario => usuario.role === role);
  };

  const addUsuario = async (usuario: Omit<Usuario, "id">) => {
    try {
      // Si es un admin_finca quien está creando el usuario, se asocia automáticamente
      const usuarioData = {
        ...usuario,
        administradorId: profile?.role === 'admin_finca' ? profile.id : usuario.administradorId || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await addDoc(collection(db, "usuarios"), usuarioData);
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
      // Si es un admin_finca quien está creando el cliente, se asocia automáticamente
      const clienteData = {
        ...cliente,
        administradorId: profile?.role === 'admin_finca' ? profile.id : cliente.administradorId || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await addDoc(collection(db, "usuarios"), clienteData);
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
      // Verificar que si el usuario es admin_finca, solo pueda actualizar sus propios usuarios
      if (profile?.role === 'admin_finca') {
        const usuarioDoc = doc(db, "usuarios", id);
        const usuario = await getDocs(query(collection(db, "usuarios"), where("id", "==", id), where("administradorId", "==", profile.id)));
        if (usuario.empty) {
          toast.error("No tienes permiso para actualizar este usuario");
          return false;
        }
      }
      
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
      // Verificar que si el usuario es admin_finca, solo pueda eliminar sus propios usuarios
      if (profile?.role === 'admin_finca') {
        const usuario = await getDocs(query(collection(db, "usuarios"), where("id", "==", id), where("administradorId", "==", profile.id)));
        if (usuario.empty) {
          toast.error("No tienes permiso para eliminar este usuario");
          return false;
        }
      }
      
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
  }, [profile?.id]);

  return {
    usuarios,
    loading,
    error,
    loadUsuariosData,
    getUsuariosByTipo,
    getUsuariosByRole,
    getPuntosVerdes,
    updateUsuario,
    deleteUsuario,
    updateUserRole,
    addCliente,
    addUsuario
  };
}

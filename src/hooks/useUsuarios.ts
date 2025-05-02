
import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, getDocs, query, addDoc, updateDoc, doc, deleteDoc, where, orderBy, serverTimestamp, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword } from 'firebase/auth';
import { toast } from 'sonner';
import type { Usuario, UserRole, VinculacionAuthEstado, ComunidadVecinos } from '@/types';
import { useUserProfile } from '@/hooks/useUserProfile';

export function useUsuarios() {
  const [usuarios, setUsuarios] = useState<Usuario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useUserProfile();

  // Función para cargar comunidades de un administrador
  const cargarComunidadesAdministrador = async (administradorId: string): Promise<ComunidadVecinos[]> => {
    try {
      const comunidadesQuery = query(
        collection(db, "comunidades"),
        where("administradorId", "==", administradorId)
      );
      
      const comunidadesSnap = await getDocs(comunidadesQuery);
      
      const comunidades: ComunidadVecinos[] = [];
      comunidadesSnap.forEach((doc) => {
        const data = doc.data();
        comunidades.push({
          id: doc.id,
          ...data as Omit<ComunidadVecinos, 'id'>,
          createdAt: data.createdAt?.toDate?.(),
          updatedAt: data.updatedAt?.toDate?.()
        });
      });
      
      return comunidades;
    } catch (err) {
      console.error("Error cargando comunidades del administrador:", err);
      return [];
    }
  };

  const loadUsuariosData = async () => {
    try {
      setLoading(true);
      
      // Define la consulta base para la colección de usuarios
      let usuariosQuery;
      
      // Si el usuario logueado es administrador, solo carga sus propios usuarios si corresponde
      if (profile?.role === 'administrador') {
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
      
      const usuariosPromises: Promise<Usuario>[] = [];
      
      usuariosSnap.forEach((docSnapshot) => {
        const data = docSnapshot.data() as Record<string, any>;
        
        // Si el usuario es un administrador, cargamos sus comunidades asociadas
        const usuarioPromise = async (): Promise<Usuario> => {
          const usuario = {
            id: docSnapshot.id,
            ...data,
            role: data.role || 'user', // Aseguramos que role esté definido
            createdAt: data.createdAt?.toDate?.() || new Date(),
            updatedAt: data.updatedAt?.toDate?.() || new Date(),
            fechaRegistro: data.fechaRegistro?.toDate?.() || data.createdAt?.toDate?.() || new Date()
          } as Usuario;
          
          // Si el usuario es un administrador, cargar sus comunidades
          if (usuario.role === 'administrador') {
            const comunidades = await cargarComunidadesAdministrador(usuario.id);
            usuario.comunidades = comunidades;
          }
          
          return usuario;
        };
        
        usuariosPromises.push(usuarioPromise());
      });
      
      // Esperar a que todas las promesas se resuelvan
      const usuariosData = await Promise.all(usuariosPromises);
      
      setUsuarios(usuariosData);
      console.log("Usuarios cargados:", usuariosData.length);
      console.log("Administradores:", usuariosData.filter(u => u.role === 'administrador').length);
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

  const addUsuario = async (usuario: Omit<Usuario, "id"> & { administradorId?: string, password?: string }) => {
    try {
      // Si es un administrador quien está creando el usuario, se asocia automáticamente
      const usuarioData = {
        ...usuario,
        administradorId: profile?.role === 'administrador' ? profile.id : usuario.administradorId || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      // Si se proporciona contraseña y el usuario es de tipo 'administrador', crear también en Auth
      let uid: string | undefined = undefined;
      let estadoVinculacion: VinculacionAuthEstado = 'sin_vincular';
      
      if (usuario.password && (usuario.role === 'administrador' || usuario.role === 'comercial')) {
        try {
          // Intentar crear el usuario en Firebase Auth
          const userCredential = await createUserWithEmailAndPassword(auth, usuario.email, usuario.password);
          uid = userCredential.user.uid;
          estadoVinculacion = 'completo';
          
          console.log(`Usuario ${usuario.role} creado en Auth con UID: ${uid}`);
        } catch (authError: any) {
          console.error(`Error creando usuario ${usuario.role} en Auth:`, authError);
          
          // Asignar estado según el error
          if (authError.code === 'auth/email-already-in-use') {
            estadoVinculacion = 'falla_password';
          } else {
            estadoVinculacion = 'pendiente';
          }
          
          toast.error(`No se pudo crear la cuenta de autenticación para ${usuario.email}: ${authError.message}`);
        }
      }
      
      // Añadir información de vinculación con Auth
      const usuarioFinal = {
        ...usuarioData,
        uid,
        estadoVinculacion,
        intentosVinculacion: 1,
        ultimoIntentoVinculacion: serverTimestamp()
      };
      
      // Eliminar la contraseña del objeto antes de guardar en Firestore
      delete usuarioFinal.password;
      
      // Guardar en Firestore independientemente del resultado de Auth
      const docRef = await addDoc(collection(db, "usuarios"), usuarioFinal);
      
      // Mensaje de éxito adaptado según el resultado
      if (estadoVinculacion === 'completo') {
        toast.success(`Usuario ${usuario.role} añadido correctamente con acceso al sistema`);
      } else if (usuario.role === 'administrador' || usuario.role === 'comercial') {
        toast.success(`Usuario ${usuario.role} añadido pero sin vinculación completa a la autenticación`);
      } else {
        toast.success("Usuario añadido correctamente");
      }
      
      await loadUsuariosData();
      return { success: true, usuarioId: docRef.id };
    } catch (err) {
      console.error("Error añadiendo usuario:", err);
      toast.error("Error al añadir el usuario");
      return { success: false };
    }
  };

  const addCliente = async (cliente: Omit<Usuario, "id"> & { administradorId?: string }) => {
    try {
      // Si es un administrador quien está creando el cliente, se asocia automáticamente
      const clienteData = {
        ...cliente,
        administradorId: profile?.role === 'administrador' ? profile.id : cliente.administradorId || null,
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
      // Verificar que si el usuario es administrador, solo pueda actualizar sus propios usuarios
      if (profile?.role === 'administrador') {
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
      // Verificar que si el usuario es administrador, solo pueda eliminar sus propios usuarios
      if (profile?.role === 'administrador') {
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


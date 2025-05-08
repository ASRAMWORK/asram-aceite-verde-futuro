
import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { collection, getDocs, query, addDoc, updateDoc, doc, deleteDoc, where, orderBy, serverTimestamp, getDoc } from 'firebase/firestore';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from 'firebase/auth';
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
            // Asignamos las comunidades al usuario
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
      setLoading(true);
      // Si es un administrador quien está creando el usuario, se asocia automáticamente
      const usuarioData = {
        ...usuario,
        administradorId: profile?.role === 'administrador' ? profile.id : usuario.administradorId || null,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        // Asegurarnos de que el role y el tipo sean explícitamente los proporcionados
        role: usuario.role || 'user', // Usar el rol proporcionado o 'user' como fallback
        tipo: usuario.tipo || usuario.role || 'user' // Usar el tipo proporcionado, o el rol, o 'user' como fallback
      };
      
      // Variables para manejar el estado de vinculación y el UID
      let uid: string | undefined = undefined;
      let estadoVinculacion: VinculacionAuthEstado = 'sin_vincular';
      let mensajeResultado = "";
      
      // Si se proporciona contraseña y es un administrador o comercial, intentamos crear cuenta en Auth
      if (usuario.password && (usuario.role === 'administrador' || usuario.role === 'comercial')) {
        try {
          // Paso 1: Intentar crear el usuario en Firebase Auth
          const userCredential = await createUserWithEmailAndPassword(auth, usuario.email, usuario.password);
          uid = userCredential.user.uid;
          estadoVinculacion = 'completo';
          mensajeResultado = `Usuario ${usuario.role} creado correctamente con acceso al sistema`;
          console.log(`Usuario ${usuario.role} creado en Auth con UID: ${uid}`);
        } catch (authError: any) {
          console.error(`Error creando usuario ${usuario.role} en Auth:`, authError);
          
          // Si el email ya está en uso, intentar iniciar sesión para obtener el UID
          if (authError.code === 'auth/email-already-in-use') {
            try {
              // Intento de login con las credenciales proporcionadas
              const loginResult = await signInWithEmailAndPassword(auth, usuario.email, usuario.password);
              uid = loginResult.user.uid;
              estadoVinculacion = 'completo';
              mensajeResultado = `Usuario ${usuario.role} vinculado a una cuenta existente`;
              console.log(`Vinculado a cuenta existente con UID: ${uid}`);
            } catch (loginError: any) {
              // Si la contraseña no coincide, seguimos guardando el usuario pero con estado de falla
              estadoVinculacion = 'falla_password';
              mensajeResultado = `Usuario ${usuario.role} guardado pero la contraseña no coincide con la cuenta existente`;
              console.error("Error al iniciar sesión con credenciales:", loginError);
            }
          } else {
            // Otro tipo de error de autenticación
            estadoVinculacion = 'pendiente';
            mensajeResultado = `Usuario ${usuario.role} guardado pero con vinculación pendiente: ${authError.message}`;
          }
        }
      }
      
      // Añadir información de vinculación con Auth
      const usuarioFinal = {
        ...usuarioData,
        uid,
        estadoVinculacion,
        intentosVinculacion: 1,
        ultimoIntentoVinculacion: serverTimestamp(),
        activo: estadoVinculacion === 'completo' // Automáticamente activo si la vinculación fue exitosa
      };
      
      // Eliminar la contraseña del objeto antes de guardar en Firestore
      delete usuarioFinal.password;
      
      // Guardar en Firestore independientemente del resultado de Auth
      const docRef = await addDoc(collection(db, "usuarios"), usuarioFinal);
      
      // Mostrar mensaje apropiado según el resultado
      toast.success(mensajeResultado);
      
      await loadUsuariosData();
      return { 
        success: true, 
        usuarioId: docRef.id, 
        estado: estadoVinculacion, 
        uid
      };
    } catch (err: any) {
      console.error("Error añadiendo usuario:", err);
      toast.error(`Error al añadir el usuario: ${err.message}`);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
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

  const toggleEstadoUsuario = async (id: string, activo: boolean) => {
    try {
      await updateDoc(doc(db, "usuarios", id), {
        activo,
        updatedAt: serverTimestamp()
      });
      
      toast.success(`Usuario ${activo ? 'activado' : 'desactivado'} correctamente`);
      await loadUsuariosData();
      return true;
    } catch (err) {
      console.error("Error cambiando estado del usuario:", err);
      toast.error("Error al cambiar el estado del usuario");
      return false;
    }
  };

  const deleteUsuario = async (id: string) => {
    try {
      // Soft delete
      await updateDoc(doc(db, "usuarios", id), {
        activo: false,
        updatedAt: serverTimestamp()
      });
      toast.success("Usuario desactivado correctamente");
      await loadUsuariosData();
      return true;
    } catch (err) {
      console.error("Error borrando usuario:", err);
      toast.error("Error al borrar usuario");
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
    getPuntosVerdes,
    getUsuariosByRole,
    addUsuario,
    addCliente,
    updateUsuario,
    toggleEstadoUsuario,
    deleteUsuario
  };
}

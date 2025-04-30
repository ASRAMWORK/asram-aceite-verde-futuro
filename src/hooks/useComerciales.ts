
import { useState, useEffect } from 'react';
import { db, auth } from '@/lib/firebase';
import { 
  collection, 
  getDocs, 
  query, 
  where, 
  addDoc, 
  updateDoc, 
  doc, 
  serverTimestamp,
  orderBy,
  Timestamp
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  updateEmail, 
  updatePassword 
} from 'firebase/auth';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { ComercialUser, ClienteCaptado, Comision } from '@/types/comercial';
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserRole } from '@/types';

export function useComerciales() {
  const [comerciales, setComerciales] = useState<ComercialUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useUserProfile();

  const loadComercialesData = async () => {
    try {
      setLoading(true);
      
      // Base query for comerciales
      const comercialesQuery = query(
        collection(db, "usuarios"),
        where("role", "==", "comercial"),
        orderBy("nombre")
      );
      
      const comercialesSnap = await getDocs(comercialesQuery);
      
      const comercialesData: ComercialUser[] = [];
      comercialesSnap.forEach((doc) => {
        const data = doc.data();
        comercialesData.push({
          id: doc.id,
          nombre: data.nombre || '',
          apellidos: data.apellidos || '',
          email: data.email || '',
          telefono: data.telefono || '',
          fechaRegistro: data.createdAt?.toDate() || new Date(),
          codigo: data.codigo || '',
          activo: data.activo ?? true,
          aprobado: data.aprobado ?? false,
          saldo: data.saldo || 0,
          comisionesTotales: data.comisionesTotales || 0,
          comisionesPendientes: data.comisionesPendientes || 0,
          metodoPago: data.metodoPago || null,
          datosPersonalizados: data.datosPersonalizados,
          uid: data.uid || ''
        });
      });
      
      setComerciales(comercialesData);
      setError(null);
    } catch (err) {
      console.error("Error cargando comerciales:", err);
      setError("Error al cargar datos de comerciales");
    } finally {
      setLoading(false);
    }
  };

  const getComercialById = (id: string) => {
    return comerciales.find(comercial => comercial.id === id) || null;
  };

  const addComercial = async (comercialData: Partial<ComercialUser> & { password?: string }) => {
    try {
      setLoading(true);
      const { password, ...restData } = comercialData;
      
      if (!password || !comercialData.email) {
        throw new Error("Email y contraseña son obligatorios para crear un comercial");
      }
      
      // Generate unique referral code
      const codigo = generateUniqueCode();
      
      // 1. Crear usuario en Firebase Authentication
      const userCredential = await createUserWithEmailAndPassword(
        auth, 
        comercialData.email,
        password
      );
      
      const uid = userCredential.user.uid;
      
      // 2. Guardar datos en Firestore
      const docRef = await addDoc(collection(db, "usuarios"), {
        ...restData,
        uid, // Guardar el UID de autenticación
        role: "comercial" as UserRole,
        codigo,
        activo: true,
        aprobado: false,
        saldo: 0,
        comisionesTotales: 0,
        comisionesPendientes: 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      
      toast.success("Comercial añadido correctamente");
      await loadComercialesData();
      return docRef.id;
    } catch (err: any) {
      console.error("Error añadiendo comercial:", err);
      if (err.code === 'auth/email-already-in-use') {
        toast.error("El correo electrónico ya está en uso");
      } else {
        toast.error(`Error al añadir comercial: ${err.message || 'Error desconocido'}`);
      }
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const updateComercial = async (id: string, data: Partial<ComercialUser> & { password?: string }) => {
    try {
      setLoading(true);
      const { password, ...updateData } = data;
      const currentComercial = comerciales.find(c => c.id === id);
      
      if (!currentComercial) {
        throw new Error("Comercial no encontrado");
      }
      
      // Si hay un cambio de correo o contraseña y el usuario tiene uid, actualizar en Auth
      if (currentComercial.uid && (password || (data.email && data.email !== currentComercial.email))) {
        try {
          // Necesitaríamos que el usuario esté autenticado para actualizar correo/contraseña
          // Esta implementación requiere más lógica de autenticación para funcionar completamente
          console.log("Se requiere actualizar auth, pero requiere autenticación previa del usuario");
        } catch (authError) {
          console.error("Error actualizando autenticación:", authError);
          // Continuar con actualización de datos en Firestore
        }
      }
      
      // Actualizar datos en Firestore
      await updateDoc(doc(db, "usuarios", id), {
        ...updateData,
        updatedAt: serverTimestamp()
      });
      
      toast.success("Comercial actualizado correctamente");
      await loadComercialesData();
    } catch (err) {
      console.error("Error actualizando comercial:", err);
      toast.error("Error al actualizar comercial");
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const toggleComercialStatus = async (id: string, activo: boolean) => {
    try {
      await updateDoc(doc(db, "usuarios", id), {
        activo,
        updatedAt: serverTimestamp()
      });
      
      toast.success(`Comercial ${activo ? 'activado' : 'desactivado'} correctamente`);
      await loadComercialesData();
    } catch (err) {
      console.error("Error actualizando estado de comercial:", err);
      toast.error("Error al actualizar estado del comercial");
      throw err;
    }
  };

  const aprobarComercial = async (id: string) => {
    try {
      await updateDoc(doc(db, "usuarios", id), {
        aprobado: true,
        updatedAt: serverTimestamp()
      });
      
      toast.success("Comercial aprobado correctamente");
      await loadComercialesData();
    } catch (err) {
      console.error("Error aprobando comercial:", err);
      toast.error("Error al aprobar comercial");
      throw err;
    }
  };

  const generateUniqueCode = () => {
    // Generate 8 characters unique code
    return uuidv4().substring(0, 8).toUpperCase();
  };

  // Cargar datos al montar el componente
  useEffect(() => {
    loadComercialesData();
  }, []);

  return {
    comerciales,
    loading,
    error,
    loadComercialesData,
    getComercialById,
    addComercial,
    updateComercial,
    toggleComercialStatus,
    aprobarComercial,
    generateUniqueCode
  };
}

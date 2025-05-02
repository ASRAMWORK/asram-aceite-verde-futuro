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
  getDoc,
  setDoc,
  Timestamp
} from 'firebase/firestore';
import { 
  createUserWithEmailAndPassword, 
  signInWithEmailAndPassword,
  fetchSignInMethodsForEmail
} from 'firebase/auth';
import { toast } from 'sonner';
import { v4 as uuidv4 } from 'uuid';
import { ComercialUser } from '@/types/comercial';
import { useUserProfile } from '@/hooks/useUserProfile';
import { UserRole, VinculacionAuthEstado } from '@/types';

export function useComerciales() {
  const [comerciales, setComerciales] = useState<ComercialUser[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const { profile } = useUserProfile();

  // Separate the data saving logic from authentication
  const saveComercialToFirestore = async (
    comercialData: Partial<ComercialUser>, 
    uid: string | null = null, 
    estadoVinculacion: VinculacionAuthEstado = 'completo'
  ) => {
    try {
      // Generate unique referral code if not provided
      const codigo = comercialData.codigo || generateUniqueCode();
      
      // Prepare common data to save
      const commonData = {
        ...comercialData,
        uid, // This might be null if auth failed but we're still saving to Firestore
        role: "comercial" as UserRole,
        codigo,
        activo: true,
        aprobado: comercialData.aprobado ?? true,
        saldo: comercialData.saldo || 0,
        comisionesTotales: comercialData.comisionesTotales || 0,
        comisionesPendientes: comercialData.comisionesPendientes || 0,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        email: comercialData.email,
        estadoVinculacion,
        intentosVinculacion: 1,
        ultimoIntentoVinculacion: serverTimestamp()
      };
      
      // Save in "usuarios" collection
      const docRef = await addDoc(collection(db, "usuarios"), commonData);
      
      // If we have a UID, also save in "users" collection
      if (uid) {
        await setDoc(doc(db, "users", uid), commonData);
      }
      
      return docRef.id;
    } catch (err) {
      console.error("Error guardando datos en Firestore:", err);
      throw err;
    }
  };

  // Check if email already exists in usuarios collection
  const checkEmailExistsInFirestore = async (email: string) => {
    const emailCheckQuery = query(
      collection(db, "usuarios"), 
      where("email", "==", email)
    );
    const emailCheckSnap = await getDocs(emailCheckQuery);
    return !emailCheckSnap.empty;
  };

  // Check if email already exists in Firebase Auth
  const checkEmailExistsInAuth = async (email: string) => {
    try {
      const methods = await fetchSignInMethodsForEmail(auth, email);
      return methods.length > 0;
    } catch (error) {
      console.error("Error checking if email exists in Auth:", error);
      return false;
    }
  };

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
          uid: data.uid || '',
          estadoVinculacion: data.estadoVinculacion || 'completo',
          intentosVinculacion: data.intentosVinculacion || 0,
          ultimoIntentoVinculacion: data.ultimoIntentoVinculacion?.toDate() || null
        });
      });
      
      setComerciales(comercialesData);
      setError(null);
    } catch (err) {
      console.error("Cargando comerciales:", err);
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
      
      if (!restData.email) {
        throw new Error("El email es obligatorio para crear un comercial");
      }
      
      // Check if email already exists in usuarios collection
      const emailExistsInFirestore = await checkEmailExistsInFirestore(restData.email);
      
      if (emailExistsInFirestore) {
        toast.error("El correo electrónico ya está registrado en nuestra base de datos");
        setLoading(false);
        return null;
      }
      
      // If no password provided but we need to register in Auth, generate a temporary one
      // or handle as "pendiente" status
      const finalPassword = password || "";
      
      // Try to register in Auth if password is provided
      if (finalPassword) {
        try {
          // 1. Create user in Firebase Authentication
          const userCredential = await createUserWithEmailAndPassword(
            auth, 
            restData.email,
            finalPassword
          );
          
          const uid = userCredential.user.uid;
          
          // 2. Save data in Firestore with complete status
          const docId = await saveComercialToFirestore(restData, uid, 'completo');
          
          toast.success("Comercial añadido correctamente y vinculado con Firebase Auth");
          await loadComercialesData();
          return docId;
          
        } catch (authErr: any) {
          console.error("Error en el proceso de registro:", authErr);
          
          if (authErr.code === 'auth/email-already-in-use') {
            // Auth email exists but not in our database
            
            // If password provided, try to sign in to link
            if (finalPassword) {
              try {
                // Try signing in with provided credentials
                const userCredential = await signInWithEmailAndPassword(auth, restData.email, finalPassword);
                const uid = userCredential.user.uid;
                
                // Password matched, save with complete status
                const docId = await saveComercialToFirestore(restData, uid, 'completo');
                toast.success("Comercial añadido correctamente y vinculado con cuenta existente");
                await loadComercialesData();
                return docId;
                
              } catch (signInErr) {
                console.error("Error al enlazar cuenta existente:", signInErr);
                
                // Password didn't match but we still create the record
                const docId = await saveComercialToFirestore(restData, null, 'falla_password');
                toast.warning("El correo ya existe en Firebase Auth y la contraseña no coincide. Registrado como pendiente de vinculación.");
                await loadComercialesData();
                return docId;
              }
            } else {
              // No password provided but email exists in Auth
              const docId = await saveComercialToFirestore(restData, null, 'pendiente');
              toast.warning("El correo ya existe en Firebase Auth. Registrado como pendiente de vinculación.");
              await loadComercialesData();
              return docId;
            }
          } else {
            // Other Auth error but still save to Firestore
            const docId = await saveComercialToFirestore(restData, null, 'sin_vincular');
            toast.warning(`Error al crear cuenta en Firebase Auth, pero se guardó en Firestore: ${authErr.message || 'Error desconocido'}`);
            await loadComercialesData();
            return docId;
          }
        }
      } else {
        // No password provided, just save to Firestore
        const docId = await saveComercialToFirestore(restData, null, 'sin_vincular');
        toast.info("Comercial guardado sin vincular a Firebase Auth (no se proporcionó contraseña)");
        await loadComercialesData();
        return docId;
      }
    } catch (err: any) {
      console.error("Error añadiendo comercial:", err);
      toast.error(`Error al añadir comercial: ${err.message || 'Error desconocido'}`);
      setLoading(false);
      return null;
    } finally {
      setLoading(false);
    }
  };

  // Nueva función para intentar vincular un comercial existente
  const intentarVincularComercial = async (id: string, password: string) => {
    try {
      setLoading(true);
      
      const comercial = getComercialById(id);
      if (!comercial) {
        throw new Error("Comercial no encontrado");
      }
      
      if (!comercial.email) {
        throw new Error("El comercial no tiene email registrado");
      }
      
      // Verificar primero si ya existe en Auth
      const emailExistsInAuth = await checkEmailExistsInAuth(comercial.email);
      
      if (!emailExistsInAuth) {
        // Si no existe en Auth, intentamos crear la cuenta
        try {
          const userCredential = await createUserWithEmailAndPassword(auth, comercial.email, password);
          const uid = userCredential.user.uid;
          
          // Actualizar en Firestore
          await updateDoc(doc(db, "usuarios", id), {
            uid,
            estadoVinculacion: 'completo',
            intentosVinculacion: (comercial.intentosVinculacion || 0) + 1,
            ultimoIntentoVinculacion: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          
          // Crear en users collection
          await setDoc(doc(db, "users", uid), {
            ...comercial,
            uid,
            id: comercial.id,
            estadoVinculacion: 'completo',
            intentosVinculacion: (comercial.intentosVinculacion || 0) + 1,
            ultimoIntentoVinculacion: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          
          toast.success("Comercial vinculado correctamente con nueva cuenta de Firebase Auth");
          await loadComercialesData();
          return true;
        } catch (err: any) {
          console.error("Error creando cuenta en Auth:", err);
          
          // Actualizar el intento en Firestore
          await updateDoc(doc(db, "usuarios", id), {
            estadoVinculacion: 'sin_vincular',
            intentosVinculacion: (comercial.intentosVinculacion || 0) + 1,
            ultimoIntentoVinculacion: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          
          toast.error(`Error al crear cuenta: ${err.message}`);
          await loadComercialesData();
          return false;
        }
      } else {
        // Si ya existe, intentamos iniciar sesión
        try {
          const userCredential = await signInWithEmailAndPassword(auth, comercial.email, password);
          const uid = userCredential.user.uid;
          
          // Actualizar en Firestore
          await updateDoc(doc(db, "usuarios", id), {
            uid,
            estadoVinculacion: 'completo',
            intentosVinculacion: (comercial.intentosVinculacion || 0) + 1,
            ultimoIntentoVinculacion: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          
          // Verificar y actualizar en users collection
          const userRef = doc(db, "users", uid);
          const userDoc = await getDoc(userRef);
          
          if (!userDoc.exists()) {
            await setDoc(userRef, {
              ...comercial,
              uid,
              id: comercial.id,
              estadoVinculacion: 'completo',
              intentosVinculacion: (comercial.intentosVinculacion || 0) + 1,
              ultimoIntentoVinculacion: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          } else {
            await updateDoc(userRef, {
              role: "comercial",
              estadoVinculacion: 'completo',
              intentosVinculacion: (comercial.intentosVinculacion || 0) + 1,
              ultimoIntentoVinculacion: serverTimestamp(),
              updatedAt: serverTimestamp()
            });
          }
          
          toast.success("Comercial vinculado correctamente con cuenta existente");
          await loadComercialesData();
          return true;
        } catch (err) {
          console.error("Error al iniciar sesión:", err);
          
          // Actualizar el intento en Firestore
          await updateDoc(doc(db, "usuarios", id), {
            estadoVinculacion: 'falla_password',
            intentosVinculacion: (comercial.intentosVinculacion || 0) + 1,
            ultimoIntentoVinculacion: serverTimestamp(),
            updatedAt: serverTimestamp()
          });
          
          toast.error("La contraseña no coincide con la cuenta existente");
          await loadComercialesData();
          return false;
        }
      }
    } catch (err: any) {
      console.error("Error vinculando comercial:", err);
      toast.error(`Error: ${err.message || 'Error desconocido'}`);
      return false;
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
      
      // Si el usuario tiene uid, también actualizar en la colección "users"
      if (currentComercial.uid) {
        const userRef = doc(db, "users", currentComercial.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          await updateDoc(userRef, {
            ...updateData,
            updatedAt: serverTimestamp()
          });
        }
      }
      
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
      const comercial = getComercialById(id);
      if (!comercial) {
        throw new Error("Comercial no encontrado");
      }
      
      // Update in "usuarios" collection
      await updateDoc(doc(db, "usuarios", id), {
        activo,
        updatedAt: serverTimestamp()
      });
      
      // If the user has uid, also update in "users" collection
      if (comercial.uid) {
        const userRef = doc(db, "users", comercial.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          await updateDoc(userRef, {
            activo,
            updatedAt: serverTimestamp()
          });
        }
      }
      
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
      const comercial = getComercialById(id);
      if (!comercial) {
        throw new Error("Comercial no encontrado");
      }
      
      // Update in "usuarios" collection
      await updateDoc(doc(db, "usuarios", id), {
        aprobado: true,
        updatedAt: serverTimestamp()
      });
      
      // If the user has uid, also update in "users" collection
      if (comercial.uid) {
        const userRef = doc(db, "users", comercial.uid);
        const userDoc = await getDoc(userRef);
        
        if (userDoc.exists()) {
          await updateDoc(userRef, {
            aprobado: true,
            updatedAt: serverTimestamp()
          });
        }
      }
      
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
    generateUniqueCode,
    intentarVincularComercial, // Nueva función para vincular comerciales existentes
    checkEmailExistsInAuth    // Exponer función para verificar email
  };
}

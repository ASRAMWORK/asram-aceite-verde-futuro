
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { collection, doc, getDoc, getDocs, query, setDoc, where, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";
import { toast } from "sonner";
import { v4 as uuidv4 } from "uuid";
import { UserRole } from "@/types";

export const addSpecificComerciales = async () => {
  // Function to add or update a specific comercial
  const addOrUpdateComercial = async (email: string, password: string, nombre: string, apellidos: string) => {
    try {
      // Check if already exists in usuarios collection
      const emailQuery = query(collection(db, "usuarios"), where("email", "==", email));
      const emailSnap = await getDocs(emailQuery);
      
      if (!emailSnap.empty) {
        console.log(`Comercial con email ${email} ya existe`);
        return;
      }
      
      try {
        // Try creating user first
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        const uid = userCredential.user.uid;
        
        const commonData = {
          nombre,
          apellidos,
          email,
          telefono: "",
          uid,
          role: "comercial" as UserRole,
          codigo: uuidv4().substring(0, 8).toUpperCase(),
          activo: true,
          aprobado: true,
          saldo: 0,
          comisionesTotales: 0,
          comisionesPendientes: 0,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp()
        };
        
        // Save in usuarios collection
        await addDoc(collection(db, "usuarios"), commonData);
        
        // Save in users collection
        await setDoc(doc(db, "users", uid), commonData);
        
        console.log(`Comercial ${email} creado correctamente`);
        toast.success(`Comercial ${email} creado correctamente`);
      } catch (err: any) {
        // If user exists, try to link
        if (err.code === 'auth/email-already-in-use') {
          try {
            // Sign in and update user
            await signInWithEmailAndPassword(auth, email, password);
            const currentUser = auth.currentUser;
            
            if (currentUser) {
              const uid = currentUser.uid;
              
              // Check if exists in users collection
              const userDoc = await getDoc(doc(db, "users", uid));
              
              const commonData = {
                nombre,
                apellidos,
                email,
                telefono: "",
                uid,
                role: "comercial" as UserRole,
                codigo: uuidv4().substring(0, 8).toUpperCase(),
                activo: true,
                aprobado: true,
                saldo: 0,
                comisionesTotales: 0,
                comisionesPendientes: 0,
                updatedAt: serverTimestamp()
              };
              
              if (!userDoc.exists()) {
                await setDoc(doc(db, "users", uid), {
                  ...commonData,
                  createdAt: serverTimestamp()
                });
              } else {
                await setDoc(doc(db, "users", uid), {
                  ...userDoc.data(),
                  ...commonData
                }, { merge: true });
              }
              
              // Check if exists in usuarios by uid
              const uidQuery = query(collection(db, "usuarios"), where("uid", "==", uid));
              const uidSnap = await getDocs(uidQuery);
              
              if (uidSnap.empty) {
                // Add new record in usuarios
                await addDoc(collection(db, "usuarios"), {
                  ...commonData,
                  createdAt: serverTimestamp()
                });
              }
              
              console.log(`Usuario ${email} actualizado como comercial`);
              toast.success(`Usuario ${email} actualizado como comercial`);
            }
          } catch (signInError) {
            console.error("Error enlazando cuenta existente:", signInError);
            toast.error(`Error al actualizar ${email}: La contraseña puede ser incorrecta`);
          }
        } else {
          console.error(`Error creando comercial ${email}:`, err);
          toast.error(`Error al crear ${email}: ${err.message}`);
        }
      }
    } catch (err) {
      console.error(`Error en el proceso para ${email}:`, err);
      toast.error(`Error procesando ${email}`);
    }
  };
  
  // Add the specific comerciales
  await addOrUpdateComercial("antonio.asram@gmail.com", "Hola3030", "Antonio", "Asram");
  await addOrUpdateComercial("julien0001@gmail.com", "Hola3030", "Julien", "");
  
  return true;
};

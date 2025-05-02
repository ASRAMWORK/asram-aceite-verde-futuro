
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc, setDoc, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { UserProfile, UserRole } from '@/types';

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        setProfile(null);
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const userData = docSnap.data();
          const role = userData.role as UserRole;
          
          const profileData: UserProfile = {
            id: docRef.id,
            userId: user.uid,
            email: userData.email || user.email || '',
            role: role || 'client', // Using 'client' as default role from UserRole enum
            nombre: userData.nombre || '',
            apellidos: userData.apellidos || userData.apellido || '',
            telefono: userData.telefono || '',
            direccion: userData.direccion || '',
            ciudad: userData.ciudad || '',
            provincia: userData.provincia || '',
            codigoPostal: userData.codigoPostal || '',
            pais: userData.pais || '',
            activo: userData.activo !== undefined ? userData.activo : true,
            tipo: userData.tipo || '',
            createdAt: userData.createdAt || new Date(),
            updatedAt: userData.updatedAt || new Date(),
            // Additional profile fields
            distrito: userData.distrito || '',
            barrio: userData.barrio || '',
            litrosAportados: userData.litrosAportados || 0,
            puntosVerdes: userData.puntosVerdes || 0,
            numRecogidas: userData.numRecogidas || 0,
            photoURL: userData.photoURL || user.photoURL || '',
            numViviendas: userData.numViviendas || 0,
            numContenedores: userData.numContenedores || 0,
            fechaRegistro: userData.fechaRegistro || userData.createdAt || new Date(),
            // If the type doesn't have these fields, they will be ignored when used
            ...userData
          };
          
          setProfile(profileData);
        } else {
          // Create a new profile if it doesn't exist
          const newProfile: UserProfile = {
            id: docRef.id,
            userId: user.uid,
            email: user.email || '',
            role: 'client', // Default role
            nombre: user.displayName?.split(' ')[0] || '',
            apellidos: user.displayName?.split(' ').slice(1).join(' ') || '',
            activo: true,
            createdAt: new Date(),
            updatedAt: new Date(),
            fechaRegistro: new Date(),
            litrosAportados: 0,
            puntosVerdes: 0,
            numRecogidas: 0,
            photoURL: user.photoURL || ''
          };
          
          await setDoc(docRef, newProfile);
          setProfile(newProfile);
        }
      } catch (err) {
        console.error("Error al obtener perfil:", err);
        setError("Error al cargar perfil");
      } finally {
        setLoading(false);
      }
    });
    
    return () => unsubscribe();
  }, []);

  // Function to update user profile
  const updateProfile = async (data: Partial<UserProfile>) => {
    try {
      if (!auth.currentUser) {
        throw new Error("Usuario no autenticado");
      }
      
      const docRef = doc(db, "users", auth.currentUser.uid);
      await updateDoc(docRef, {
        ...data,
        updatedAt: new Date()
      });
      
      // Update local profile state
      setProfile(prev => {
        if (!prev) return null;
        return { ...prev, ...data, updatedAt: new Date() };
      });
      
      return true;
    } catch (err) {
      console.error("Error al actualizar perfil:", err);
      throw err;
    }
  };

  return { profile, loading, error, updateProfile };
}


import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { UserProfile } from '@/types';

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
        const docRef = doc(db, "users", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          const userData = docSnap.data();
          const profileData: UserProfile = {
            id: docRef.id,
            email: userData.email || user.email || '',
            role: (userData.role as UserProfile['role']) || 'usuario',
            nombre: userData.nombre || '',
            apellido: userData.apellido || '',
            telefono: userData.telefono || '',
            direccion: userData.direccion || '',
            ciudad: userData.ciudad || '',
            provincia: userData.provincia || '',
            codigoPostal: userData.codigoPostal || '',
            pais: userData.pais || '',
            activo: userData.activo !== undefined ? userData.activo : true,
            tipo: userData.tipo || '',
            createdAt: userData.createdAt,
            updatedAt: userData.updatedAt,
            // If the type doesn't have nombreAdministracion, it will be ignored when used
            ...userData
          };
          
          setProfile(profileData);
        } else {
          setError("Perfil no encontrado");
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

  return { profile, loading, error };
}

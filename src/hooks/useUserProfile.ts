
import { useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { doc, getDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { UsuarioProfile, ComunidadProfile, RestauranteProfile, HotelProfile, AsociacionProfile, EscolarProfile } from '@/types';

export function useUserProfile() {
  const [profile, setProfile] = useState<any>(null);
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
        const docRef = doc(db, "usuarios", user.uid);
        const docSnap = await getDoc(docRef);
        
        if (docSnap.exists()) {
          setProfile({ id: docSnap.id, ...docSnap.data() });
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

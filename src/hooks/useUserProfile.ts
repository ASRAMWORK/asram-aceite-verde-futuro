
import { useState, useEffect } from 'react';
import { UserProfile } from '@/types';

export function useUserProfile() {
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        // Mock data or fetch from API/localStorage
        const mockProfile: UserProfile = {
          id: '1',
          userId: 'user123',
          nombre: 'Usuario',
          apellido: 'Demo',
          telefono: '600123456',
          direccion: 'Calle Principal 123',
          ciudad: 'Madrid',
          provincia: 'Madrid',
          codigoPostal: '28001',
          email: 'usuario@example.com',
          role: 'admin',
          litrosAportados: 25,
          puntosVerdes: 150,
          distrito: 'Centro',
          barrio: 'Sol',
          numViviendas: 50,
          numContenedores: 3,
          frecuenciaRecogida: 'Semanal',
          nombreRestaurante: 'Restaurante Demo',
          horarioApertura: '09:00 - 23:00',
          litrosEstimados: 15,
          nombreHotel: 'Hotel Demo',
          numHabitaciones: 80,
          nombreAsociacion: 'Asociación Demo',
          tipoAsociacion: 'Vecinal',
          numMiembros: 120,
          nombreCentro: 'Colegio Demo',
          numAlumnos: 500,
          tipoEscolar: 'Primaria',
          participaAlianzaVerde: true,
          nombreAdministracion: 'Admin Demo',
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        setProfile(mockProfile);
      } catch (err) {
        console.error("Error al obtener perfil:", err);
        setError("Error al cargar perfil");
      } finally {
        setLoading(false);
      }
    };
    
    fetchUserProfile();
  }, []);

  return { profile, loading, error };
}

import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ComunidadVecinos } from '@/types';
import { useToast } from '@/components/ui/use-toast';
import { useAuth } from './useAuth'; // Assuming this is the correct import

export const useComunidadesVecinos = () => {
  const [comunidades, setComunidades] = useState<ComunidadVecinos[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();
  const auth = useAuth(); // Use auth context without assuming user property

  // Load comunidades from localStorage or API
  const loadComunidadesData = async () => {
    setLoading(true);
    try {
      // Simulate API call or get from localStorage
      const storedData = localStorage.getItem('comunidades');
      if (storedData) {
        setComunidades(JSON.parse(storedData));
      }
    } catch (err) {
      setError("Error loading comunidades");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadComunidadesData();
  }, []);

  // Save to localStorage whenever comunidades changes
  useEffect(() => {
    localStorage.setItem('comunidades', JSON.stringify(comunidades));
  }, [comunidades]);

  const createComunidad = async (data: Partial<ComunidadVecinos>): Promise<ComunidadVecinos> => {
    try {
      const id = uuidv4();
      const nuevaComunidad: ComunidadVecinos = {
        id,
        nombre: data.nombre || '',
        direccion: data.direccion || '',
        ciudad: data.ciudad || '',
        provincia: data.provincia || '',
        codigoPostal: data.codigoPostal || '',
        pais: data.pais || 'España',
        numViviendas: data.numViviendas || 0,
        presidente: data.presidente || '',
        telefono: data.telefono || '',
        email: data.email || '',
        cif: data.cif || '',
        distrito: data.distrito || '',
        barrio: data.barrio || '',
        numeroPorteria: data.numeroPorteria || '',
        totalViviendas: data.totalViviendas || 0,
        nombreAdministracion: data.nombreAdministracion || '',
        correoContacto: data.correoContacto || '',
        litrosRecogidos: data.litrosRecogidos || 0,
        beneficiosMedioambientales: {
          co2: data.beneficiosMedioambientales?.co2 || 0,
          agua: data.beneficiosMedioambientales?.agua || 0,
          arboles: data.beneficiosMedioambientales?.arboles || 0,
          energia: data.beneficiosMedioambientales?.energia || 0
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };

      setComunidades(prev => [...prev, nuevaComunidad]);
      toast({
        title: "Éxito",
        description: "Comunidad creada correctamente.",
      });
      return nuevaComunidad;
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al crear la comunidad.",
      });
      throw error;
    }
  };

  const updateComunidad = async (id: string, data: Partial<ComunidadVecinos>): Promise<boolean> => {
    try {
      setComunidades(prevComunidades =>
        prevComunidades.map(comunidad =>
          comunidad.id === id ? { ...comunidad, ...data, updatedAt: new Date() } : comunidad
        )
      );
      toast({
        title: "Éxito",
        description: "Comunidad actualizada correctamente.",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar la comunidad.",
      });
      return false;
    }
  };

  const deleteComunidad = async (id: string): Promise<boolean> => {
    try {
      setComunidades(prevComunidades =>
        prevComunidades.filter(comunidad => comunidad.id !== id)
      );
      toast({
        title: "Éxito",
        description: "Comunidad eliminada correctamente.",
      });
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar la comunidad.",
      });
      return false;
    }
  };

  return {
    comunidades,
    loading,
    error,
    isLoading: loading,
    loadComunidadesData,
    createComunidad,
    updateComunidad,
    deleteComunidad
  };
};

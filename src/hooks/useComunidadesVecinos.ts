
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { ComunidadVecinos } from '@/types';
import { useToast } from '@/components/ui/use-toast';

// Create simple AuthContext type to avoid import error
interface AuthContextProps {
  isAuthenticated: boolean;
}

export const useComunidadesVecinos = () => {
  const [comunidades, setComunidades] = useState<ComunidadVecinos[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadComunidadesData();
  }, []);

  const loadComunidadesData = async () => {
    setLoading(true);
    try {
      const storedData = localStorage.getItem('comunidades');
      if (storedData) {
        setComunidades(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error loading comunidades:', error);
      setError('Error al cargar comunidades');
    } finally {
      setLoading(false);
    }
  };

  const createComunidad = async (data: Partial<ComunidadVecinos>) => {
    setIsLoading(true);
    try {
      const nuevaComunidad: ComunidadVecinos = {
        id: uuidv4(),
        nombre: data.nombre || '',
        direccion: data.direccion || '',
        ciudad: data.ciudad || 'Madrid',
        provincia: data.provincia || 'Madrid',
        codigoPostal: data.codigoPostal || '',
        numViviendas: Number(data.numViviendas || 0),
        presidente: data.presidente || '',
        telefono: data.telefono || '',
        email: data.email || '',
        cif: data.cif || '',
        distrito: data.distrito || '',
        barrio: data.barrio || '',
        numeroPorteria: data.numeroPorteria || '',
        totalViviendas: Number(data.totalViviendas || 0),
        nombreAdministracion: data.nombreAdministracion || '',
        correoContacto: data.correoContacto || '',
        litrosRecogidos: Number(data.litrosRecogidos || 0),
        beneficiosMedioambientales: {
          co2: data.beneficiosMedioambientales?.co2 || 0,
          agua: data.beneficiosMedioambientales?.agua || 0,
          arboles: data.beneficiosMedioambientales?.arboles || 0,
          energia: data.beneficiosMedioambientales?.energia || 0
        },
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setComunidades([...comunidades, nuevaComunidad]);
      localStorage.setItem('comunidades', JSON.stringify([...comunidades, nuevaComunidad]));
      
      toast({
        title: "Éxito",
        description: "Comunidad creada correctamente."
      });
      
      return nuevaComunidad;
    } catch (error) {
      console.error("Error al crear comunidad:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al crear la comunidad."
      });
      setError('Error al crear comunidad');
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const updateComunidad = async (id: string, data: Partial<ComunidadVecinos>) => {
    try {
      setComunidades(comunidades.map(comunidad => 
        comunidad.id === id ? { ...comunidad, ...data, updatedAt: new Date() } : comunidad
      ));
      
      localStorage.setItem('comunidades', JSON.stringify(comunidades));
      
      toast({
        title: "Éxito",
        description: "Comunidad actualizada correctamente."
      });
      
      return true;
    } catch (error) {
      console.error("Error al actualizar comunidad:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar la comunidad."
      });
      return false;
    }
  };

  const deleteComunidad = async (id: string) => {
    try {
      setComunidades(comunidades.filter(comunidad => comunidad.id !== id));
      localStorage.setItem('comunidades', JSON.stringify(comunidades.filter(comunidad => comunidad.id !== id)));
      
      toast({
        title: "Éxito",
        description: "Comunidad eliminada correctamente."
      });
      
      return true;
    } catch (error) {
      console.error("Error al eliminar comunidad:", error);
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar la comunidad."
      });
      return false;
    }
  };

  // Add updateBeneficios function
  const updateBeneficios = async (id: string, litros: number) => {
    try {
      // Calculate environmental benefits based on liters
      const co2Saved = litros * 2.3; // kg of CO2 saved per liter
      const waterSaved = litros * 5000; // liters of water saved
      const treesSaved = litros * 0.01; // equivalent trees saved
      const energySaved = litros * 1.5; // kWh of energy saved
      
      const comunidad = comunidades.find(c => c.id === id);
      
      if (!comunidad) {
        return false;
      }
      
      const currentBeneficios = comunidad.beneficiosMedioambientales || {
        co2: 0,
        agua: 0,
        arboles: 0,
        energia: 0
      };
      
      const updatedBeneficios = {
        co2: (currentBeneficios.co2 || 0) + co2Saved,
        agua: (currentBeneficios.agua || 0) + waterSaved,
        arboles: (currentBeneficios.arboles || 0) + treesSaved,
        energia: (currentBeneficios.energia || 0) + energySaved
      };
      
      const newLitrosRecogidos = (comunidad.litrosRecogidos || 0) + litros;
      
      return await updateComunidad(id, {
        litrosRecogidos: newLitrosRecogidos,
        beneficiosMedioambientales: updatedBeneficios
      });
    } catch (error) {
      console.error("Error al actualizar beneficios:", error);
      return false;
    }
  };

  return {
    comunidades,
    loading,
    error,
    isLoading,
    loadComunidadesData,
    createComunidad,
    updateComunidad,
    deleteComunidad,
    updateBeneficios
  };
};

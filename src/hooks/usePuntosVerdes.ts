
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PuntoVerde } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export const usePuntosVerdes = () => {
  const [puntosVerdes, setPuntosVerdes] = useState<PuntoVerde[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  useEffect(() => {
    loadPuntosVerdesData();
  }, []);

  const loadPuntosVerdesData = async () => {
    setLoading(true);
    try {
      const storedData = localStorage.getItem('puntosVerdes');
      if (storedData) {
        setPuntosVerdes(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error loading puntos verdes:', error);
      setError('Error al cargar los puntos verdes');
    } finally {
      setLoading(false);
    }
  };

  const addPuntoVerde = async (data: Partial<PuntoVerde>) => {
    const id = uuidv4();
    try {
      const nuevoPuntoVerde: PuntoVerde = {
        id,
        nombre: data.nombre || '',
        direccion: data.direccion || '',
        ciudad: data.ciudad || '',
        provincia: data.provincia || '',
        codigoPostal: data.codigoPostal || '',
        pais: data.pais || 'España',
        latitud: data.latitud || 0,
        longitud: data.longitud || 0,
        tipo: data.tipo || '',
        descripcion: data.descripcion || '',
        horario: data.horario || '',
        telefono: data.telefono || '',
        email: data.email || '',
        contacto: data.contacto || '',
        activo: data.activo !== undefined ? data.activo : true,
        litrosRecogidos: data.litrosRecogidos || 0,
        distrito: data.distrito || '',
        barrio: data.barrio || '',
        numViviendas: data.numViviendas || 0,
        numContenedores: data.numContenedores || 0,
        administradorId: data.administradorId || null,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setPuntosVerdes([...puntosVerdes, nuevoPuntoVerde]);
      localStorage.setItem('puntosVerdes', JSON.stringify([...puntosVerdes, nuevoPuntoVerde]));
      
      toast({
        title: "Éxito",
        description: "Punto Verde añadido correctamente."
      });
      
      return nuevoPuntoVerde;
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al añadir el Punto Verde."
      });
      throw error;
    }
  };

  // Add the required functions
  const updatePuntoVerde = async (id: string, data: Partial<PuntoVerde>): Promise<boolean> => {
    try {
      setPuntosVerdes(puntosVerdes.map(punto =>
        punto.id === id ? { ...punto, ...data, updatedAt: new Date() } : punto
      ));
      localStorage.setItem('puntosVerdes', JSON.stringify(puntosVerdes));
      
      toast({
        title: "Éxito",
        description: "Punto Verde actualizado correctamente."
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar el Punto Verde."
      });
      return false;
    }
  };

  const deletePuntoVerde = async (id: string): Promise<boolean> => {
    try {
      setPuntosVerdes(puntosVerdes.filter(punto => punto.id !== id));
      localStorage.setItem('puntosVerdes', JSON.stringify(puntosVerdes.filter(punto => punto.id !== id)));
      
      toast({
        title: "Éxito",
        description: "Punto Verde eliminado correctamente."
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar el Punto Verde."
      });
      return false;
    }
  };

  // Add helper functions for districts and neighborhoods
  const getDistritosUnicos = (): string[] => {
    return Array.from(new Set(puntosVerdes.map(punto => punto.distrito))).filter(Boolean) as string[];
  };

  const getBarriosUnicos = (distrito?: string): string[] => {
    if (distrito) {
      return Array.from(new Set(puntosVerdes
        .filter(punto => punto.distrito === distrito)
        .map(punto => punto.barrio)))
        .filter(Boolean) as string[];
    }
    return Array.from(new Set(puntosVerdes.map(punto => punto.barrio))).filter(Boolean) as string[];
  };

  return {
    puntosVerdes,
    loading,
    error,
    loadPuntosVerdesData,
    addPuntoVerde,
    updatePuntoVerde,
    deletePuntoVerde,
    getDistritosUnicos,
    getBarriosUnicos
  };
};

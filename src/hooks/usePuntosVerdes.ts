import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { PuntoVerde } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export const usePuntosVerdes = () => {
  const [puntosVerdes, setPuntosVerdes] = useState<PuntoVerde[]>([]);
  const [loading, setLoading] = useState(false);
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

  // TODO: Implement updatePuntoVerde and deletePuntoVerde
  // const updatePuntoVerde = async (id: string, data: Partial<PuntoVerde>) => {
  //   // Logic to update a Punto Verde
  // };

  // const deletePuntoVerde = async (id: string) => {
  //   // Logic to delete a Punto Verde
  // };

  return {
    puntosVerdes,
    loading,
    loadPuntosVerdesData,
    addPuntoVerde,
    // updatePuntoVerde,
    // deletePuntoVerde
  };
};

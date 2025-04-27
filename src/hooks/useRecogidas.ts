import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Recogida } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export const useRecogidas = () => {
  const [recogidas, setRecogidas] = useState<Recogida[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadRecogidasData = async () => {
    setLoading(true);
    try {
      const storedData = localStorage.getItem('recogidas');
      if (storedData) {
        setRecogidas(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error loading recogidas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRecogidasData();
  }, []);

  useEffect(() => {
    localStorage.setItem('recogidas', JSON.stringify(recogidas));
  }, [recogidas]);

  const addRecogida = async (data: Omit<Recogida, 'id' | 'createdAt' | 'updatedAt'>) => {
    const id = uuidv4();
    try {
      const nuevaRecogida: Recogida = {
        id,
        cliente: data.cliente || '',
        direccionRecogida: data.direccionRecogida || '',
        fechaRecogida: data.fechaRecogida || new Date(),
        horaRecogida: data.horaRecogida || '',
        cantidadAproximada: data.cantidadAproximada || 0,
        tipoAceite: data.tipoAceite || '',
        nombreContacto: data.nombreContacto || '',
        telefonoContacto: data.telefonoContacto || '',
        emailContacto: data.emailContacto || '',
        notasAdicionales: data.notasAdicionales || '',
        estadoRecogida: data.estadoRecogida || 'pendiente',
        litrosRecogidos: data.litrosRecogidos || 0,
        fecha: data.fecha || new Date(),
        distrito: data.distrito || '',
        barrio: data.barrio || '',
        hora: data.hora || '',
        horaInicio: data.horaInicio || '',
        completada: data.completada || false,
        nombreLugar: data.nombreLugar || '',
        direccion: data.direccion || '',
        estado: data.estado || 'pendiente',
        fechaSolicitud: data.fechaSolicitud || new Date(),
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setRecogidas(prev => [...prev, nuevaRecogida]);
      
      toast({
        title: "Éxito",
        description: "Recogida programada correctamente."
      });
      
      return nuevaRecogida;
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al programar la recogida."
      });
      throw error;
    }
  };

  const getRecogidasByCliente = (cliente: string): Recogida[] => {
    return recogidas.filter(recogida => recogida.cliente === cliente);
  };

  const updateRecogida = async (id: string, data: Partial<Recogida>): Promise<boolean> => {
    try {
      setRecogidas(recogidas.map(recogida =>
        recogida.id === id ? { ...recogida, ...data, updatedAt: new Date() } : recogida
      ));

      toast({
        title: "Éxito",
        description: "Recogida actualizada correctamente.",
      });

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar la recogida.",
      });
      return false;
    }
  };

  const deleteRecogida = async (id: string): Promise<boolean> => {
    try {
      setRecogidas(recogidas.filter(recogida => recogida.id !== id));

      toast({
        title: "Éxito",
        description: "Recogida eliminada correctamente.",
      });

      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar la recogida.",
      });
      return false;
    }
  };

  return {
    recogidas,
    loading,
    loadRecogidasData,
    addRecogida,
    getRecogidasByCliente,
    updateRecogida,
    deleteRecogida
  };
};


import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Ruta } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export const useRutas = () => {
  const [rutas, setRutas] = useState<Ruta[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  const loadRutasData = async () => {
    setLoading(true);
    try {
      const storedData = localStorage.getItem('rutas');
      if (storedData) {
        setRutas(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error loading rutas:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadRutasData();
  }, []);

  useEffect(() => {
    localStorage.setItem('rutas', JSON.stringify(rutas));
  }, [rutas]);

  const addRuta = async (data: Omit<Ruta, 'id'>) => {
    const id = uuidv4();
    try {
      const nuevaRuta: Ruta = {
        id,
        nombre: data.nombre || '',
        distrito: data.distrito || '',
        barrio: data.barrio || '',
        barrios: data.barrios || [],
        puntos: data.puntos || [], // Ensure puntos is included
        distancia: data.distancia || 0,
        tiempoEstimado: data.tiempoEstimado || 0,
        tipoRuta: data.tipoRuta || '',
        estado: data.estado || 'pendiente',
        fecha: data.fecha || new Date(),
        hora: data.hora || '',
        recogedores: data.recogedores || '',
        clientes: data.clientes || [],
        puntosRecogida: data.puntosRecogida || 0,
        distanciaTotal: data.distanciaTotal || 0,
        frecuencia: data.frecuencia || 'semanal',
        completada: data.completada !== undefined ? data.completada : false,
        litrosTotales: data.litrosTotales || 0,
        fechaCompletada: data.fechaCompletada || undefined,
        createdAt: data.createdAt || new Date(),
        updatedAt: data.updatedAt || new Date()
      };
      
      setRutas(prev => [...prev, nuevaRuta]);
      
      toast({
        title: "Éxito",
        description: "Ruta creada correctamente."
      });
      
      return nuevaRuta;
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al crear la ruta."
      });
      throw error;
    }
  };

  const updateRuta = async (id: string, data: Partial<Ruta>) => {
    try {
      setRutas(rutas.map(ruta => ruta.id === id ? { ...ruta, ...data, updatedAt: new Date() } : ruta));
      toast({
        title: "Éxito",
        description: "Ruta actualizada correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar la ruta.",
      });
    }
  };

  const deleteRuta = async (id: string) => {
    try {
      setRutas(rutas.filter(ruta => ruta.id !== id));
      toast({
        title: "Éxito",
        description: "Ruta eliminada correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar la ruta.",
      });
    }
  };

  // Update completeRuta to take litrosTotales as a parameter
  const completeRuta = async (id: string, litrosTotales: number = 0) => {
    try {
      setRutas(rutas.map(ruta => ruta.id === id ? { 
        ...ruta, 
        completada: true, 
        fechaCompletada: new Date(), 
        updatedAt: new Date(),
        litrosTotales: litrosTotales
      } : ruta));
      toast({
        title: "Éxito",
        description: "Ruta completada correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al completar la ruta.",
      });
    }
  };

  return {
    rutas,
    loading,
    loadRutasData,
    addRuta,
    updateRuta,
    deleteRuta,
    completeRuta
  };
};

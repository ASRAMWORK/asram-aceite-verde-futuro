
import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { Incidencia } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export const useIncidencias = () => {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadIncidenciasData();
  }, []);

  const loadIncidenciasData = async () => {
    setLoading(true);
    try {
      const storedData = localStorage.getItem('incidencias');
      if (storedData) {
        setIncidencias(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error loading incidencias:', error);
    } finally {
      setLoading(false);
    }
  };

  const addIncidencia = async (data: Omit<Incidencia, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newIncidencia: Incidencia = {
      id: uuidv4(),
      titulo: data.titulo,
      descripcion: data.descripcion,
      fecha: data.fecha,
      estado: data.estado,
      prioridad: data.prioridad,
      asignadoA: data.asignadoA,
      tipo: data.tipo,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setIncidencias(prev => [...prev, newIncidencia]);
    localStorage.setItem('incidencias', JSON.stringify([...incidencias, newIncidencia]));
    
    toast({
      title: "Incidencia añadida",
      description: "La incidencia ha sido añadida correctamente."
    });
    return newIncidencia;
  };

  const getIncidenciasByAsignado = (asignadoId: string): Incidencia[] => {
    return incidencias.filter(incidencia => incidencia.asignadoA === asignadoId);
  };

  // Add getIncidenciasPorTrabajador function
  const getIncidenciasPorTrabajador = (trabajadorId: string): Incidencia[] => {
    return incidencias.filter(incidencia => incidencia.asignadoA === trabajadorId);
  };

  const updateIncidencia = async (id: string, data: Partial<Incidencia>) => {
    setIncidencias(prev =>
      prev.map(incidencia =>
        incidencia.id === id ? { ...incidencia, ...data } : incidencia
      )
    );
    localStorage.setItem('incidencias', JSON.stringify(incidencias));
    toast({
      title: "Incidencia actualizada",
      description: "La incidencia ha sido actualizada correctamente."
    });
  };

  const deleteIncidencia = async (id: string) => {
    setIncidencias(prev => prev.filter(incidencia => incidencia.id !== id));
    localStorage.setItem('incidencias', JSON.stringify(incidencias));
    toast({
      title: "Incidencia eliminada",
      description: "La incidencia ha sido eliminada correctamente."
    });
  };

  return {
    incidencias,
    loading,
    loadIncidenciasData,
    addIncidencia,
    getIncidenciasByAsignado,
    getIncidenciasPorTrabajador,
    updateIncidencia,
    deleteIncidencia
  };
};

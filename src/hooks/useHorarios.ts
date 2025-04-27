import { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import { HorarioVoluntario } from '@/types';
import { useToast } from '@/components/ui/use-toast';

export const useHorarios = () => {
  const [horarios, setHorarios] = useState<HorarioVoluntario[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    loadHorariosData();
  }, []);

  const loadHorariosData = async () => {
    setLoading(true);
    try {
      const storedData = localStorage.getItem('horarios');
      if (storedData) {
        setHorarios(JSON.parse(storedData));
      }
    } catch (error) {
      console.error('Error loading horarios:', error);
    } finally {
      setLoading(false);
    }
  };

  const addHorario = async (data: Omit<HorarioVoluntario, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newHorario: HorarioVoluntario = {
      id: uuidv4(),
      voluntarioId: data.voluntarioId,
      dia: data.dia,
      horaInicio: data.horaInicio,
      horaFin: data.horaFin,
      actividad: data.actividad,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setHorarios(prev => [...prev, newHorario]);
    localStorage.setItem('horarios', JSON.stringify([...horarios, newHorario]));
    
    toast({
      title: "Horario añadido",
      description: "El horario ha sido añadido correctamente."
    });
    return newHorario;
  };

  const updateHorario = async (id: string, data: Partial<HorarioVoluntario>) => {
    try {
      setHorarios(horarios.map(horario => horario.id === id ? { ...horario, ...data, updatedAt: new Date() } : horario));
      localStorage.setItem('horarios', JSON.stringify(horarios));
      toast({
        title: "Horario actualizado",
        description: "El horario ha sido actualizado correctamente."
      });
    } catch (error) {
      console.error('Error updating horario:', error);
      toast({
        title: "Error",
        description: "Hubo un error al actualizar el horario."
      });
    }
  };

  const deleteHorario = async (id: string) => {
    try {
      setHorarios(horarios.filter(horario => horario.id !== id));
      localStorage.setItem('horarios', JSON.stringify(horarios));
      toast({
        title: "Horario eliminado",
        description: "El horario ha sido eliminado correctamente."
      });
    } catch (error) {
      console.error('Error deleting horario:', error);
      toast({
        title: "Error",
        description: "Hubo un error al eliminar el horario."
      });
    }
  };

  return {
    horarios,
    loading,
    addHorario,
    updateHorario,
    deleteHorario,
    loadHorariosData
  };
};

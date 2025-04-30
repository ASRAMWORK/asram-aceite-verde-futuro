
import { useState, useEffect } from 'react';
import { TallerProgramado } from '@/types';

export const useTalleresProgramados = () => {
  const [talleresProgramados, setTalleresProgramados] = useState<TallerProgramado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate fetching talleres programados
    setTalleresProgramados([]);
    setLoading(false);
  }, []);

  const addTallerProgramado = async (taller: Omit<TallerProgramado, 'id'>) => {
    // Simulate adding a taller programado
    const newTaller = {
      ...taller,
      id: `taller-${Date.now()}`,
    };
    setTalleresProgramados(prev => [...prev, newTaller]);
    return newTaller;
  };

  const updateTallerProgramado = async (id: string, data: Partial<TallerProgramado>) => {
    // Simulate updating a taller programado
    setTalleresProgramados(prev => 
      prev.map(taller => taller.id === id ? { ...taller, ...data } : taller)
    );
    return true;
  };

  const deleteTallerProgramado = async (id: string) => {
    // Simulate deleting a taller programado
    setTalleresProgramados(prev => prev.filter(taller => taller.id !== id));
    return true;
  };

  return {
    talleresProgramados,
    loading,
    addTallerProgramado,
    updateTallerProgramado,
    deleteTallerProgramado
  };
};

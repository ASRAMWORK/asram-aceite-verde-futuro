
import { useState, useEffect } from 'react';
import { TallerProgramado } from '@/types';

export const useTalleresProgramados = () => {
  const [talleresProgramados, setTalleresProgramados] = useState<TallerProgramado[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Intentar cargar talleres del localStorage
    const savedTalleres = localStorage.getItem('talleresProgramados');
    if (savedTalleres) {
      try {
        const parsedTalleres = JSON.parse(savedTalleres).map((taller: any) => ({
          ...taller,
          fecha: new Date(taller.fecha),
          createdAt: new Date(taller.createdAt),
          updatedAt: new Date(taller.updatedAt)
        }));
        setTalleresProgramados(parsedTalleres);
      } catch (error) {
        console.error("Error parsing saved talleres:", error);
        setTalleresProgramados([]);
      }
    }
    setLoading(false);
  }, []);

  // Función para guardar talleres en localStorage
  const saveTalleres = (talleres: TallerProgramado[]) => {
    localStorage.setItem('talleresProgramados', JSON.stringify(talleres));
  };

  const addTallerProgramado = async (taller: Omit<TallerProgramado, 'id'>) => {
    // Simular adding a taller programado
    const newTaller = {
      ...taller,
      id: `taller-${Date.now()}`,
    };
    const updatedTalleres = [...talleresProgramados, newTaller];
    setTalleresProgramados(updatedTalleres);
    saveTalleres(updatedTalleres);
    return newTaller;
  };

  const updateTallerProgramado = async (id: string, data: Partial<TallerProgramado>) => {
    // Actualizar un taller programado
    const updatedTalleres = talleresProgramados.map(taller => 
      taller.id === id ? { ...taller, ...data, updatedAt: new Date() } : taller
    );
    setTalleresProgramados(updatedTalleres);
    saveTalleres(updatedTalleres);
    return true;
  };

  const deleteTallerProgramado = async (id: string) => {
    // Eliminar un taller programado
    const updatedTalleres = talleresProgramados.filter(taller => taller.id !== id);
    setTalleresProgramados(updatedTalleres);
    saveTalleres(updatedTalleres);
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

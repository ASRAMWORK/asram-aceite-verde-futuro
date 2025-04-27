
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Trabajador } from "@/types";
import { useToast } from "@/components/ui/use-toast";

export const useTrabajadores = () => {
  const [trabajadores, setTrabajadores] = useState<Trabajador[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadTrabajadoresData = async () => {
    setLoading(true);
    try {
      // Load from localStorage
      const storedData = localStorage.getItem('trabajadores');
      if (storedData) {
        setTrabajadores(JSON.parse(storedData));
      }
    } catch (err) {
      setError("Error loading data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTrabajadoresData();
  }, []);

  useEffect(() => {
    // Save to localStorage when data changes
    localStorage.setItem('trabajadores', JSON.stringify(trabajadores));
  }, [trabajadores]);

  const getTrabajador = async (id: string): Promise<Trabajador | null> => {
    const trabajador = trabajadores.find(t => t.id === id);
    return trabajador || null;
  };

  const getTrabajadoresPorRol = (rol: string): Trabajador[] => {
    return trabajadores.filter(t => t.roles?.includes(rol));
  };

  const getTrabajadoresActivos = (): Trabajador[] => {
    return trabajadores.filter(t => t.activo);
  };

  const addTrabajador = async (data: Omit<Trabajador, "id">): Promise<Trabajador> => {
    try {
      const id = uuidv4();
      const nuevoTrabajador: Trabajador = {
        ...data,
        id,
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      setTrabajadores([...trabajadores, nuevoTrabajador]);
      
      toast({
        title: "Éxito",
        description: "Trabajador añadido correctamente.",
      });
      
      return nuevoTrabajador;
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al añadir el trabajador.",
      });
      throw error;
    }
  };

  const updateTrabajador = async (id: string, data: Partial<Trabajador>): Promise<boolean> => {
    try {
      setTrabajadores(trabajadores.map(t => 
        t.id === id ? { ...t, ...data, updatedAt: new Date() } : t
      ));
      
      toast({
        title: "Éxito",
        description: "Trabajador actualizado correctamente.",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar el trabajador.",
      });
      return false;
    }
  };

  const deleteTrabajador = async (id: string): Promise<boolean> => {
    try {
      setTrabajadores(trabajadores.filter(t => t.id !== id));
      
      toast({
        title: "Éxito",
        description: "Trabajador eliminado correctamente.",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar el trabajador.",
      });
      return false;
    }
  };

  return {
    trabajadores,
    loading,
    error,
    loadTrabajadoresData,
    getTrabajadoresPorRol,
    getTrabajadoresActivos,
    addTrabajador,
    updateTrabajador,
    deleteTrabajador,
    getTrabajador
  };
};

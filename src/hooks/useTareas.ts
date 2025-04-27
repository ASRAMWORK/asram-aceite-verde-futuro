
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Tarea } from "@/types";
import { useToast } from "@/components/ui/use-toast";

export const useTareas = () => {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { toast } = useToast();

  const loadTareasData = async () => {
    setLoading(true);
    try {
      // Load from localStorage
      const storedData = localStorage.getItem('tareas');
      if (storedData) {
        setTareas(JSON.parse(storedData));
      }
    } catch (err) {
      setError("Error loading data");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadTareasData();
  }, []);

  useEffect(() => {
    // Save to localStorage when data changes
    localStorage.setItem('tareas', JSON.stringify(tareas));
  }, [tareas]);

  const addTarea = async (nuevaTarea: Omit<Tarea, "id">): Promise<boolean> => {
    try {
      const tarea: Tarea = {
        ...nuevaTarea,
        id: uuidv4(),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      
      setTareas(prevTareas => [...prevTareas, tarea]);
      toast({
        title: "Éxito",
        description: "Tarea creada correctamente.",
      });
      return true;
    } catch (error) {
      console.error("Error al crear tarea:", error);
      toast({
        title: "Error",
        description: "No se pudo crear la tarea.",
      });
      return false;
    }
  };

  const updateTarea = async (id: string, data: Partial<Tarea>): Promise<boolean> => {
    try {
      setTareas(tareas.map(tarea => 
        tarea.id === id ? { ...tarea, ...data, updatedAt: new Date() } : tarea
      ));
      
      toast({
        title: "Éxito",
        description: "Tarea actualizada correctamente.",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar la tarea.",
      });
      return false;
    }
  };

  const deleteTarea = async (id: string): Promise<boolean> => {
    try {
      setTareas(tareas.filter(tarea => tarea.id !== id));
      
      toast({
        title: "Éxito",
        description: "Tarea eliminada correctamente.",
      });
      
      return true;
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar la tarea.",
      });
      return false;
    }
  };

  const getTareasByVoluntarioId = (voluntarioId: string): Tarea[] => {
    return tareas.filter(tarea => tarea.voluntarioId === voluntarioId);
  };

  return {
    tareas,
    loading,
    error,
    loadTareasData,
    addTarea,
    updateTarea,
    deleteTarea,
    getTareasByVoluntarioId
  };
};

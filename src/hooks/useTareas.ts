import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { Tarea } from '@/types';
import { toast } from 'sonner';

export function useTareas() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTareasData = async () => {
    try {
      setLoading(true);
      setError(null);
      const tareasRef = collection(db, "tareasVoluntarios");
      const tareasQuery = query(tareasRef, orderBy("fechaAsignacion", "desc"));
      const tareasSnap = await getDocs(tareasQuery);
      
      const tareasData: Tarea[] = [];
      tareasSnap.forEach((doc) => {
        const data = doc.data() as Record<string, any>;
        tareasData.push({ 
          id: doc.id, 
          titulo: data.titulo || '',
          descripcion: data.descripcion || '',
          voluntarioId: data.voluntarioId || '',
          voluntarioNombre: data.voluntarioNombre || '',
          prioridad: data.prioridad || 'media',
          fechaAsignacion: data.fechaAsignacion,
          fechaLimite: data.fechaLimite,
          fechaCompletada: data.fechaCompletada,
          completada: data.completada || false
        });
      });
      
      setTareas(tareasData);
    } catch (err) {
      console.error("Error cargando tareas:", err);
      setError("Error al cargar datos de Tareas");
    } finally {
      setLoading(false);
    }
  };

  const addTarea = async (nuevaTarea: Omit<Tarea, 'id'>) => {
    try {
      const tareaData = {
        ...nuevaTarea,
        fechaAsignacion: serverTimestamp(),
      };
      
      await addDoc(collection(db, "tareasVoluntarios"), tareaData);
      toast.success("Tarea asignada correctamente");
      await loadTareasData();
      return true;
    } catch (err) {
      console.error("Error añadiendo tarea:", err);
      toast.error("Error al asignar la tarea");
      return false;
    }
  };

  const updateTarea = async (id: string, data: Partial<Tarea>) => {
    try {
      const updateData: any = { ...data };
      
      if ('fechaCompletada' in data) {
        if (data.fechaCompletada) {
          updateData.fechaCompletada = serverTimestamp();
        }
      }
      
      await updateDoc(doc(db, "tareasVoluntarios", id), updateData);
      
      if ('completada' in data) {
        if (data.completada) {
          toast.success("Tarea completada");
        } else {
          toast.info("Tarea marcada como pendiente");
        }
      } else {
        toast.success("Tarea actualizada correctamente");
      }
      
      await loadTareasData();
      return true;
    } catch (err) {
      console.error("Error actualizando tarea:", err);
      toast.error("Error al actualizar la tarea");
      return false;
    }
  };

  const deleteTarea = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tareasVoluntarios", id));
      toast.success("Tarea eliminada correctamente");
      await loadTareasData();
      return true;
    } catch (err) {
      console.error("Error eliminando tarea:", err);
      toast.error("Error al eliminar la tarea");
      return false;
    }
  };

  const getTareasByVoluntarioId = (voluntarioId: string) => {
    return tareas.filter(tarea => tarea.voluntarioId === voluntarioId);
  };

  useEffect(() => {
    loadTareasData();
  }, []);

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
}

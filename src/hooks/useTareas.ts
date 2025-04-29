
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';
import type { Tarea } from '@/types';

export function useTareas() {
  const [tareas, setTareas] = useState<Tarea[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTareas = async () => {
    try {
      setLoading(true);
      const tareasRef = collection(db, "tareas");
      const tareasSnap = await getDocs(query(tareasRef, orderBy("fecha", "desc")));
      
      const tareasData: Tarea[] = [];
      tareasSnap.forEach((doc) => {
        const data = doc.data();
        tareasData.push({
          id: doc.id,
          titulo: data.titulo,
          descripcion: data.descripcion,
          fecha: data.fecha?.toDate(),
          estado: data.estado,
          prioridad: data.prioridad,
          asignadoA: data.asignadoA,
          voluntarioId: data.voluntarioId,
          voluntarioNombre: data.voluntarioNombre,
          completada: data.completada || false,
          fechaCompletada: data.fechaCompletada,
          fechaAsignacion: data.fechaAsignacion?.toDate(),
          fechaLimite: data.fechaLimite,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        });
      });
      
      setTareas(tareasData);
    } catch (err) {
      console.error("Error cargando tareas:", err);
      setError("Error al cargar datos de tareas");
    } finally {
      setLoading(false);
    }
  };

  const addTarea = async (nuevaTarea: Omit<Tarea, "id">) => {
    try {
      const tareaData = {
        ...nuevaTarea,
        completada: false,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      };
      
      await addDoc(collection(db, "tareas"), tareaData);
      toast.success("Tarea añadida correctamente");
      await loadTareas();
      return true;
    } catch (err) {
      console.error("Error añadiendo tarea:", err);
      toast.error("Error al añadir la tarea");
      return false;
    }
  };

  const updateTarea = async (id: string, data: Partial<Tarea>) => {
    try {
      await updateDoc(doc(db, "tareas"), {
        ...data,
        updatedAt: serverTimestamp()
      });
      toast.success("Tarea actualizada correctamente");
      await loadTareas();
      return true;
    } catch (err) {
      console.error("Error actualizando tarea:", err);
      toast.error("Error al actualizar la tarea");
      return false;
    }
  };
  
  const completeTarea = async (id: string) => {
    try {
      await updateDoc(doc(db, "tareas", id), {
        completada: true,
        fechaCompletada: new Date(),
        estado: "completada",
        updatedAt: serverTimestamp()
      });
      toast.success("Tarea completada correctamente");
      await loadTareas();
      return true;
    } catch (err) {
      console.error("Error completando tarea:", err);
      toast.error("Error al completar la tarea");
      return false;
    }
  };
  
  const deleteTarea = async (id: string) => {
    try {
      await deleteDoc(doc(db, "tareas", id));
      toast.success("Tarea eliminada correctamente");
      await loadTareas();
      return true;
    } catch (err) {
      console.error("Error eliminando tarea:", err);
      toast.error("Error al eliminar la tarea");
      return false;
    }
  };
  
  const getTareasByVoluntario = (voluntarioId: string) => {
    return tareas.filter(tarea => tarea.voluntarioId === voluntarioId);
  };

  useEffect(() => {
    loadTareas();
  }, []);

  return {
    tareas,
    loading,
    error,
    loadTareas,
    addTarea,
    updateTarea,
    completeTarea,
    deleteTarea,
    getTareasByVoluntario
  };
}

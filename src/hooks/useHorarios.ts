
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, where, serverTimestamp } from 'firebase/firestore';
import type { HorarioVoluntario } from '@/types';
import { toast } from 'sonner';

export function useHorarios() {
  const [horarios, setHorarios] = useState<HorarioVoluntario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHorariosData = async () => {
    try {
      setLoading(true);
      setError(null);
      const horariosRef = collection(db, "horariosVoluntarios");
      const horariosQuery = query(horariosRef, orderBy("dia"));
      const horariosSnap = await getDocs(horariosQuery);
      
      const horariosData: HorarioVoluntario[] = [];
      horariosSnap.forEach((doc) => {
        const data = doc.data() as Record<string, any>;
        horariosData.push({ 
          id: doc.id, 
          voluntarioId: data.voluntarioId || '',
          voluntarioNombre: data.voluntarioNombre || '',
          actividad: data.actividad || '',
          dia: data.dia || '',
          horaInicio: data.horaInicio || '',
          horaFin: data.horaFin || '',
          ubicacion: data.ubicacion || '',
          createdAt: data.createdAt,
        });
      });
      
      setHorarios(horariosData);
    } catch (err) {
      console.error("Error cargando horarios:", err);
      setError("Error al cargar datos de Horarios");
    } finally {
      setLoading(false);
    }
  };

  const addHorario = async (nuevoHorario: Omit<HorarioVoluntario, 'id'>) => {
    try {
      const horarioData = {
        ...nuevoHorario,
        createdAt: serverTimestamp(),
      };
      
      await addDoc(collection(db, "horariosVoluntarios"), horarioData);
      toast.success("Horario añadido correctamente");
      await loadHorariosData();
      return true;
    } catch (err) {
      console.error("Error añadiendo horario:", err);
      toast.error("Error al añadir el horario");
      return false;
    }
  };

  const updateHorario = async (id: string, data: Partial<HorarioVoluntario>) => {
    try {
      await updateDoc(doc(db, "horariosVoluntarios", id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      toast.success("Horario actualizado correctamente");
      await loadHorariosData();
      return true;
    } catch (err) {
      console.error("Error actualizando horario:", err);
      toast.error("Error al actualizar el horario");
      return false;
    }
  };

  const deleteHorario = async (id: string) => {
    try {
      await deleteDoc(doc(db, "horariosVoluntarios", id));
      toast.success("Horario eliminado correctamente");
      await loadHorariosData();
      return true;
    } catch (err) {
      console.error("Error eliminando horario:", err);
      toast.error("Error al eliminar el horario");
      return false;
    }
  };

  const getHorariosByVoluntarioId = (voluntarioId: string) => {
    return horarios.filter(horario => horario.voluntarioId === voluntarioId);
  };

  useEffect(() => {
    loadHorariosData();
  }, []);

  return { 
    horarios, 
    loading, 
    error, 
    loadHorariosData,
    addHorario,
    updateHorario,
    deleteHorario,
    getHorariosByVoluntarioId
  };
}

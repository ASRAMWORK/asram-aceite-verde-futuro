
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, where, serverTimestamp } from 'firebase/firestore';
import type { Turno } from '@/types';
import { toast } from 'sonner';

export function useTurnos() {
  const [turnos, setTurnos] = useState<Turno[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadTurnosData = async () => {
    try {
      setLoading(true);
      const turnosRef = collection(db, "turnos");
      const turnosSnap = await getDocs(query(turnosRef, orderBy("dia")));
      
      const turnosData: Turno[] = [];
      turnosSnap.forEach((doc) => {
        const data = doc.data();
        turnosData.push({
          id: doc.id,
          trabajadorId: data.trabajadorId || '',
          trabajadorNombre: data.trabajadorNombre || '',
          dia: data.dia || '',
          horaInicio: data.horaInicio || '',
          horaFin: data.horaFin || '',
          rutaId: data.rutaId,
          vehiculoId: data.vehiculoId,
          createdAt: data.createdAt
        });
      });
      
      setTurnos(turnosData);
    } catch (err) {
      console.error("Error cargando turnos:", err);
      setError("Error al cargar datos de turnos");
    } finally {
      setLoading(false);
    }
  };
  
  const getTurnosPorTrabajador = (trabajadorId: string) => {
    return turnos.filter(t => t.trabajadorId === trabajadorId);
  };

  const getTurnosPorDia = (dia: string) => {
    return turnos.filter(t => t.dia === dia);
  };

  const addTurno = async (data: Omit<Turno, "id">) => {
    try {
      const turnoData = {
        ...data,
        createdAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, "turnos"), turnoData);
      toast.success("Turno añadido correctamente");
      await loadTurnosData();
      return { id: docRef.id, ...data };
    } catch (err) {
      console.error("Error añadiendo turno:", err);
      toast.error("Error al añadir el turno");
      throw err;
    }
  };

  const updateTurno = async (id: string, data: Partial<Turno>) => {
    try {
      await updateDoc(doc(db, "turnos", id), {
        ...data,
      });
      toast.success("Turno actualizado correctamente");
      await loadTurnosData();
      return true;
    } catch (err) {
      console.error("Error actualizando turno:", err);
      toast.error("Error al actualizar el turno");
      return false;
    }
  };

  const deleteTurno = async (id: string) => {
    try {
      await deleteDoc(doc(db, "turnos", id));
      toast.success("Turno eliminado correctamente");
      await loadTurnosData();
      return true;
    } catch (err) {
      console.error("Error eliminando turno:", err);
      toast.error("Error al eliminar el turno");
      return false;
    }
  };

  useEffect(() => {
    loadTurnosData();
  }, []);

  return { 
    turnos, 
    loading, 
    error, 
    loadTurnosData,
    getTurnosPorTrabajador,
    getTurnosPorDia,
    addTurno,
    updateTurno,
    deleteTurno
  };
}

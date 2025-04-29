
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { HorarioVoluntario } from '@/types';

export function useHorarios() {
  const [horarios, setHorarios] = useState<HorarioVoluntario[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadHorarios = async () => {
    try {
      setLoading(true);
      const horariosRef = collection(db, "horariosVoluntarios");
      const horariosSnap = await getDocs(query(horariosRef, orderBy("dia")));
      
      const horariosData: HorarioVoluntario[] = [];
      horariosSnap.forEach((doc) => {
        horariosData.push({ id: doc.id, ...doc.data() } as HorarioVoluntario);
      });
      
      setHorarios(horariosData);
    } catch (err) {
      console.error("Error cargando horarios:", err);
      setError("Error al cargar horarios");
    } finally {
      setLoading(false);
    }
  };

  const addHorario = async (horario: Omit<HorarioVoluntario, 'id'>) => {
    try {
      const docRef = await addDoc(collection(db, "horariosVoluntarios"), horario);
      console.log("Horario añadido con ID: ", docRef.id);
      await loadHorarios();
    } catch (err) {
      console.error("Error añadiendo horario:", err);
      setError("Error al añadir horario");
    }
  };

  const updateHorario = async (id: string, data: Partial<HorarioVoluntario>) => {
    try {
      const horarioRef = doc(db, "horariosVoluntarios", id);
      await updateDoc(horarioRef, data);
      await loadHorarios();
    } catch (err) {
      console.error("Error actualizando horario:", err);
      setError("Error al actualizar horario");
    }
  };

  const deleteHorario = async (id: string) => {
    try {
      const horarioRef = doc(db, "horariosVoluntarios", id);
      await deleteDoc(horarioRef);
      await loadHorarios();
    } catch (err) {
      console.error("Error eliminando horario:", err);
      setError("Error al eliminar horario");
    }
  };

  useEffect(() => {
    loadHorarios();
  }, []);

  return {
    horarios,
    loading,
    error,
    addHorario,
    updateHorario,
    deleteHorario
  };
}

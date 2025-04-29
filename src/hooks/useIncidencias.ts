
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, doc, deleteDoc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { Incidencia } from '@/types';
import { toast } from 'sonner';

export function useIncidencias() {
  const [incidencias, setIncidencias] = useState<Incidencia[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadIncidenciasData = async () => {
    try {
      setLoading(true);
      const incidenciasRef = collection(db, "incidencias");
      const incidenciasSnap = await getDocs(query(incidenciasRef, orderBy("fecha", "desc")));
      
      const incidenciasData: Incidencia[] = [];
      incidenciasSnap.forEach((doc) => {
        const data = doc.data();
        incidenciasData.push({
          id: doc.id,
          titulo: data.titulo || '',
          descripcion: data.descripcion || '',
          fecha: data.fecha.toDate(),
          estado: data.estado || 'abierta',
          prioridad: data.prioridad || 'media',
          asignadoA: data.asignadoA || '',
          reportadoPor: data.reportadoPor || '',
          tipo: data.tipo || '',
          trabajadorId: data.trabajadorId || '',
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        });
      });
      
      setIncidencias(incidenciasData);
    } catch (err) {
      console.error("Error cargando incidencias:", err);
      setError("Error al cargar datos de incidencias");
    } finally {
      setLoading(false);
    }
  };

  const getIncidenciasPorTrabajador = (trabajadorId: string) => {
    return incidencias.filter(incidencia => incidencia.trabajadorId === trabajadorId);
  };

  const addIncidencia = async (data: Omit<Incidencia, "id" | "createdAt" | "updatedAt">) => {
    try {
      const docRef = await addDoc(collection(db, "incidencias"), {
        ...data,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp()
      });
      toast.success("Incidencia añadida correctamente");
      await loadIncidenciasData();
      return true;
    } catch (err) {
      console.error("Error añadiendo incidencia:", err);
      toast.error("Error al añadir incidencia");
      return false;
    }
  };

  const updateIncidencia = async (id: string, data: Partial<Incidencia>) => {
    try {
      await updateDoc(doc(db, "incidencias", id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      toast.success("Incidencia actualizada correctamente");
      await loadIncidenciasData();
      return true;
    } catch (err) {
      console.error("Error actualizando incidencia:", err);
      toast.error("Error al actualizar incidencia");
      return false;
    }
  };

  const deleteIncidencia = async (id: string) => {
    try {
      await deleteDoc(doc(db, "incidencias", id));
      toast.success("Incidencia eliminada correctamente");
      await loadIncidenciasData();
      return true;
    } catch (err) {
      console.error("Error eliminando incidencia:", err);
      toast.error("Error al eliminar incidencia");
      return false;
    }
  };

  useEffect(() => {
    loadIncidenciasData();
  }, []);

  return { 
    incidencias, 
    loading, 
    error, 
    loadIncidenciasData,
    getIncidenciasPorTrabajador,
    addIncidencia,
    updateIncidencia,
    deleteIncidencia
  };
}

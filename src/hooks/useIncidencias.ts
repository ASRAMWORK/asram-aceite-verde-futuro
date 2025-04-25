
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, where, serverTimestamp } from 'firebase/firestore';
import type { Incidencia } from '@/types';
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
          tipo: data.tipo || 'otra',
          descripcion: data.descripcion || '',
          trabajadorId: data.trabajadorId || '',
          trabajadorNombre: data.trabajadorNombre || '',
          fecha: data.fecha,
          estado: data.estado || 'abierta',
          prioridad: data.prioridad || 'media',
          createdAt: data.createdAt,
          resueltaEn: data.resueltaEn
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
    return incidencias.filter(i => i.trabajadorId === trabajadorId);
  };

  const getIncidenciasAbiertas = () => {
    return incidencias.filter(i => i.estado !== 'resuelta');
  };

  const addIncidencia = async (data: Omit<Incidencia, "id">) => {
    try {
      const incidenciaData = {
        ...data,
        createdAt: serverTimestamp(),
      };
      
      const docRef = await addDoc(collection(db, "incidencias"), incidenciaData);
      toast.success("Incidencia registrada correctamente");
      await loadIncidenciasData();
      return { id: docRef.id, ...data };
    } catch (err) {
      console.error("Error añadiendo incidencia:", err);
      toast.error("Error al registrar la incidencia");
      throw err;
    }
  };

  const updateIncidencia = async (id: string, data: Partial<Incidencia>) => {
    try {
      const updateData = { ...data };
      
      // Si estamos marcando como resuelta y no se ha especificado fecha de resolución
      if (data.estado === 'resuelta' && !data.resueltaEn) {
        updateData.resueltaEn = serverTimestamp();
      }
      
      await updateDoc(doc(db, "incidencias", id), updateData);
      toast.success("Incidencia actualizada correctamente");
      await loadIncidenciasData();
      return true;
    } catch (err) {
      console.error("Error actualizando incidencia:", err);
      toast.error("Error al actualizar la incidencia");
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
    getIncidenciasAbiertas,
    addIncidencia,
    updateIncidencia
  };
}


import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, serverTimestamp, where } from 'firebase/firestore';
import type { Reunion } from '@/types';
import { toast } from 'sonner';

export function useReuniones() {
  const [reuniones, setReuniones] = useState<Reunion[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadReunionesData = async () => {
    try {
      setLoading(true);
      const reunionesRef = collection(db, "reuniones");
      const reunionesSnap = await getDocs(query(reunionesRef, orderBy("fecha")));
      
      const reunionesData: Reunion[] = [];
      reunionesSnap.forEach((doc) => {
        const data = doc.data();
        
        // Convertir la fecha de Firestore a objeto Date de JavaScript
        let fecha = data.fecha;
        if (data.fecha && typeof data.fecha.toDate === 'function') {
          fecha = data.fecha.toDate();
        } else if (data.fecha && typeof data.fecha === 'string') {
          fecha = new Date(data.fecha);
        }
        
        reunionesData.push({
          id: doc.id,
          titulo: data.titulo || '',
          descripcion: data.descripcion || '',
          fecha: fecha,
          hora: data.hora || '',
          duracion: data.duracion || 60,
          ubicacion: data.ubicacion || '',
          participantes: data.participantes || [],
          // Include the additional fields from our extended interface
          tipo: data.tipo || '',
          tipoUsuario: data.tipoUsuario || '',
          nombreCentro: data.nombreCentro || '',
          responsable: data.responsable || '',
          direccion: data.direccion || '',
          telefono: data.telefono || '',
          email: data.email || '',
          completada: data.completada || false,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt
        });
      });
      
      setReuniones(reunionesData);
    } catch (err) {
      console.error("Error cargando reuniones:", err);
      setError("Error al cargar datos de reuniones");
    } finally {
      setLoading(false);
    }
  };

  const addReunion = async (data: Omit<Reunion, "id">) => {
    try {
      console.log("Datos recibidos para guardar:", data);
      
      // Asegurar que tenemos una fecha válida
      let fechaParaGuardar = data.fecha;
      
      // Si fecha es inválida o no se proporciona, usamos la fecha actual
      if (!fechaParaGuardar || isNaN(fechaParaGuardar.getTime())) {
        console.warn("Fecha inválida, usando fecha actual");
        fechaParaGuardar = new Date();
      }
      
      console.log("Fecha que se guardará:", fechaParaGuardar);
      
      const docRef = await addDoc(collection(db, "reuniones"), {
        ...data,
        fecha: fechaParaGuardar,
        completada: false,
        createdAt: serverTimestamp()
      });
      
      toast.success("Reunión programada correctamente");
      await loadReunionesData();
      return true;
    } catch (err) {
      console.error("Error añadiendo reunion:", err);
      toast.error("Error al programar reunión");
      return false;
    }
  };

  const updateReunion = async (id: string, data: Partial<Reunion>) => {
    try {
      await updateDoc(doc(db, "reuniones", id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      toast.success("Reunión actualizada correctamente");
      await loadReunionesData();
      return true;
    } catch (err) {
      console.error("Error actualizando reunion:", err);
      toast.error("Error al actualizar reunión");
      return false;
    }
  };

  const marcarCompletada = async (id: string) => {
    try {
      await updateDoc(doc(db, "reuniones", id), {
        completada: true,
        updatedAt: serverTimestamp()
      });
      toast.success("Reunión marcada como completada");
      await loadReunionesData();
      return true;
    } catch (err) {
      console.error("Error marcando reunión como completada:", err);
      toast.error("Error al marcar la reunión como completada");
      return false;
    }
  };

  const deleteReunion = async (id: string) => {
    try {
      await deleteDoc(doc(db, "reuniones", id));
      toast.success("Reunión eliminada correctamente");
      await loadReunionesData();
      return true;
    } catch (err) {
      console.error("Error eliminando reunion:", err);
      toast.error("Error al eliminar reunión");
      return false;
    }
  };

  useEffect(() => {
    loadReunionesData();
  }, []);

  return { 
    reuniones, 
    loading, 
    error, 
    loadReunionesData,
    addReunion,
    updateReunion,
    deleteReunion,
    marcarCompletada
  };
}


import { useState, useEffect, useCallback } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, where, serverTimestamp, increment } from 'firebase/firestore';
import type { Recogida } from '@/types';
import { toast } from 'sonner';
import { startOfMonth, endOfMonth, differenceInMonths, addMonths } from 'date-fns';

export function useRecogidas() {
  const [recogidas, setRecogidas] = useState<Recogida[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadRecogidasData = async () => {
    try {
      setLoading(true);
      const recogidasRef = collection(db, "recogidas");
      // Use fechaSolicitud if fecha isn't available
      const recogidasSnap = await getDocs(query(recogidasRef, orderBy("fechaSolicitud", "desc")));
      
      const recogidasData: Recogida[] = [];
      recogidasSnap.forEach((doc) => {
        const data = doc.data();
        // Ensure fecha is set if it's not present but fechaSolicitud is
        if (!data.fecha && data.fechaSolicitud) {
          data.fecha = data.fechaSolicitud;
        }
        recogidasData.push({ 
          id: doc.id, 
          ...data,
          fecha: data.fecha ? new Date(data.fecha.seconds * 1000) : null,
          fechaCompletada: data.fechaCompletada ? new Date(data.fechaCompletada.seconds * 1000) : null
        } as Recogida);
      });
      
      setRecogidas(recogidasData);
    } catch (err) {
      console.error("Error cargando recogidas:", err);
      setError("Error al cargar datos de recogidas");
    } finally {
      setLoading(false);
    }
  };
  
  const getTotalLitrosRecogidos = useCallback(() => {
    return recogidas.reduce((acc, recogida) => acc + (recogida.litrosRecogidos || 0), 0);
  }, [recogidas]);

  const getPromedioLitrosPorMes = useCallback(() => {
    // Filter only completed recogidas with dates and litros
    const completedRecogidas = recogidas.filter(r => 
      r.completada && r.fecha && r.fechaCompletada && r.litrosRecogidos
    );
    
    if (completedRecogidas.length === 0) return 0;
    
    // Group recogidas by month
    const recogidaByMonth: Record<string, {totalLitros: number, count: number}> = {};
    
    completedRecogidas.forEach(recogida => {
      if (!recogida.fecha || !recogida.litrosRecogidos) return;
      
      const date = new Date(recogida.fecha);
      const monthKey = `${date.getFullYear()}-${date.getMonth() + 1}`;
      
      if (!recogidaByMonth[monthKey]) {
        recogidaByMonth[monthKey] = {
          totalLitros: 0,
          count: 0
        };
      }
      
      recogidaByMonth[monthKey].totalLitros += recogida.litrosRecogidos;
      recogidaByMonth[monthKey].count += 1;
    });
    
    // Calculate average per month
    const totalMonths = Object.keys(recogidaByMonth).length;
    const totalLitros = Object.values(recogidaByMonth).reduce(
      (sum, { totalLitros }) => sum + totalLitros, 0
    );
    
    return totalMonths > 0 ? totalLitros / totalMonths : 0;
  }, [recogidas]);

  // Calculate average liters collected over a specific time period
  const calcularPromedioLitrosPorPeriodo = useCallback(() => {
    if (recogidas.length <= 1) return 0;
    
    // Get only completed recogidas with valid dates and litros
    const completedRecogidas = recogidas
      .filter(r => r.completada && r.fecha && r.litrosRecogidos)
      .sort((a, b) => {
        if (!a.fecha || !b.fecha) return 0;
        return a.fecha.getTime() - b.fecha.getTime();
      });
    
    if (completedRecogidas.length <= 1) return 0;
    
    // Get first and last date
    const firstDate = completedRecogidas[0].fecha;
    const lastDate = completedRecogidas[completedRecogidas.length - 1].fecha;
    
    if (!firstDate || !lastDate) return 0;
    
    // Calculate months difference (minimum 1 month even if less)
    const monthsDiff = Math.max(1, differenceInMonths(lastDate, firstDate) + 1);
    
    // Sum total litros
    const totalLitros = completedRecogidas.reduce((acc, rec) => acc + (rec.litrosRecogidos || 0), 0);
    
    // Calculate average per month
    return totalLitros / monthsDiff;
  }, [recogidas]);

  const addRecogida = async (nuevaRecogida: Partial<Omit<Recogida, 'id'>>) => {
    try {
      // Ensure all required fields are present
      const recogidaData = {
        ...nuevaRecogida,
        completada: false,
        createdAt: serverTimestamp(),
        litrosRecogidos: nuevaRecogida.litrosRecogidos || 0,  // Set default if missing
        fecha: nuevaRecogida.fecha || nuevaRecogida.fechaSolicitud || new Date(),  // Ensure fecha is set
        estado: nuevaRecogida.estado || "pendiente"
      };
      
      const docRef = await addDoc(collection(db, "recogidas"), recogidaData);
      
      // Update total litros in the user's record if clienteId exists
      if (recogidaData.clienteId && recogidaData.litrosRecogidos) {
        const userRef = doc(db, "usuarios", recogidaData.clienteId);
        await updateDoc(userRef, {
          litrosAportados: increment(recogidaData.litrosRecogidos)
        });
      }
      
      toast.success("Recogida programada correctamente");
      await loadRecogidasData();
      return true;
    } catch (err) {
      console.error("Error añadiendo recogida:", err);
      toast.error("Error al programar la recogida");
      return false;
    }
  };
  
  const updateRecogida = async (id: string, data: Partial<Recogida>) => {
    try {
      await updateDoc(doc(db, "recogidas", id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      toast.success("Recogida actualizada correctamente");
      await loadRecogidasData();
      return true;
    } catch (err) {
      console.error("Error actualizando recogida:", err);
      toast.error("Error al actualizar la recogida");
      return false;
    }
  };
  
  const completeRecogida = async (id: string, litrosRecogidos: number) => {
    try {
      const recogida = recogidas.find(r => r.id === id);
      if (!recogida) throw new Error('Recogida no encontrada');

      await updateDoc(doc(db, "recogidas", id), {
        completada: true,
        litrosRecogidos,
        fechaCompletada: serverTimestamp(),
        updatedAt: serverTimestamp()
      });

      // Update district statistics
      const statsRef = doc(db, "estadisticas", recogida.distrito || 'general');
      await updateDoc(statsRef, {
        litrosTotales: increment(litrosRecogidos),
        recogidasCompletadas: increment(1),
        updatedAt: serverTimestamp()
      });

      toast.success("Recogida completada correctamente");
      await loadRecogidasData();
      return true;
    } catch (err) {
      console.error("Error completando recogida:", err);
      toast.error("Error al completar la recogida");
      return false;
    }
  };
  
  const deleteRecogida = async (id: string) => {
    try {
      await deleteDoc(doc(db, "recogidas", id));
      toast.success("Recogida eliminada correctamente");
      await loadRecogidasData();
      return true;
    } catch (err) {
      console.error("Error eliminando recogida:", err);
      toast.error("Error al eliminar la recogida");
      return false;
    }
  };
  
  const getRecogidasByDistrito = (distrito: string) => {
    return recogidas.filter(recogida => recogida.distrito === distrito);
  };
  
  const getRecogidasByBarrio = (barrio: string) => {
    return recogidas.filter(recogida => recogida.barrio === barrio);
  };
  
  const getRecogidasByCliente = (clienteId: string) => {
    return recogidas.filter(recogida => recogida.clienteId === clienteId);
  };

  const getRecogidasByMonth = (month: number, year: number) => {
    const startDate = startOfMonth(new Date(year, month, 1));
    const endDate = endOfMonth(new Date(year, month, 1));
    
    return recogidas.filter(recogida => {
      if (!recogida.fecha) return false;
      const fecha = new Date(recogida.fecha);
      return fecha >= startDate && fecha <= endDate;
    });
  };

  useEffect(() => {
    loadRecogidasData();
  }, []);

  return {
    recogidas,
    loading,
    error,
    loadRecogidasData,
    addRecogida,
    updateRecogida,
    completeRecogida,
    deleteRecogida,
    getRecogidasByDistrito,
    getRecogidasByBarrio,
    getRecogidasByCliente,
    getRecogidasByMonth,
    getTotalLitrosRecogidos,
    getPromedioLitrosPorMes,
    calcularPromedioLitrosPorPeriodo
  };
}

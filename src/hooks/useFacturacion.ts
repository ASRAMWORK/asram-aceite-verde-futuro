
import { useState, useEffect } from 'react';
import { db } from '@/lib/firebase';
import { collection, getDocs, query, orderBy, addDoc, updateDoc, doc, deleteDoc, where, serverTimestamp } from 'firebase/firestore';
import type { Ingreso, Gasto } from '@/types';
import { toast } from 'sonner';

export function useFacturacion() {
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const loadFacturacionData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // Cargar ingresos
      const ingresosRef = collection(db, "ingresos");
      const ingresosQuery = query(ingresosRef, orderBy("fecha", "desc"));
      const ingresosSnap = await getDocs(ingresosQuery);
      
      const ingresosData: Ingreso[] = [];
      ingresosSnap.forEach((doc) => {
        const data = doc.data() as Record<string, any>;
        ingresosData.push({ 
          id: doc.id, 
          concepto: data.concepto || '',
          cantidad: data.cantidad || 0,
          tipo: data.tipo || '',
          fecha: data.fecha,
          cliente: data.cliente || '',
          origen: data.origen || '',
          numFactura: data.numFactura || '',
          notas: data.notas || '',
          createdAt: data.createdAt,
          categoria: data.categoria || data.tipo || '', // Use tipo as fallback
        });
      });
      
      setIngresos(ingresosData);
      
      // Cargar gastos
      const gastosRef = collection(db, "gastos");
      const gastosQuery = query(gastosRef, orderBy("fecha", "desc"));
      const gastosSnap = await getDocs(gastosQuery);
      
      const gastosData: Gasto[] = [];
      gastosSnap.forEach((doc) => {
        const data = doc.data() as Record<string, any>;
        gastosData.push({ 
          id: doc.id, 
          concepto: data.concepto || '',
          cantidad: data.cantidad || 0,
          tipo: data.tipo || '',
          fecha: data.fecha,
          proveedor: data.proveedor || '',
          numFactura: data.numFactura || '',
          notas: data.notas || '',
          createdAt: data.createdAt,
          categoria: data.categoria || data.tipo || '', // Use tipo as fallback
        });
      });
      
      setGastos(gastosData);
      
    } catch (err) {
      console.error("Error cargando datos de facturación:", err);
      setError("Error al cargar datos de facturación");
    } finally {
      setLoading(false);
    }
  };

  const addIngreso = async (data: Omit<Ingreso, 'id'>) => {
    try {
      // Make sure categoria is set, fallback to tipo if not provided
      const ingresoData = {
        ...data,
        categoria: data.categoria || data.tipo || '',
        createdAt: serverTimestamp()
      };
      
      await addDoc(collection(db, "ingresos"), ingresoData);
      toast.success("Ingreso registrado correctamente");
      await loadFacturacionData();
      return true;
    } catch (error) {
      console.error("Error al añadir ingreso:", error);
      toast.error("Error al registrar ingreso");
      return false;
    }
  };

  const updateIngreso = async (id: string, data: Partial<Ingreso>) => {
    try {
      await updateDoc(doc(db, "ingresos", id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      toast.success("Ingreso actualizado correctamente");
      await loadFacturacionData();
      return true;
    } catch (err) {
      console.error("Error actualizando ingreso:", err);
      toast.error("Error al actualizar el ingreso");
      return false;
    }
  };

  const deleteIngreso = async (id: string) => {
    try {
      await deleteDoc(doc(db, "ingresos", id));
      toast.success("Ingreso eliminado correctamente");
      await loadFacturacionData();
      return true;
    } catch (err) {
      console.error("Error eliminando ingreso:", err);
      toast.error("Error al eliminar el ingreso");
      return false;
    }
  };

  const addGasto = async (data: Omit<Gasto, 'id'>) => {
    try {
      // Make sure categoria is set, fallback to tipo if not provided
      const gastoData = {
        ...data,
        categoria: data.categoria || data.tipo || '',
        createdAt: serverTimestamp()
      };
      
      await addDoc(collection(db, "gastos"), gastoData);
      toast.success("Gasto registrado correctamente");
      await loadFacturacionData();
      return true;
    } catch (error) {
      console.error("Error al añadir gasto:", error);
      toast.error("Error al registrar gasto");
      return false;
    }
  };

  const updateGasto = async (id: string, data: Partial<Gasto>) => {
    try {
      await updateDoc(doc(db, "gastos", id), {
        ...data,
        updatedAt: serverTimestamp()
      });
      toast.success("Gasto actualizado correctamente");
      await loadFacturacionData();
      return true;
    } catch (err) {
      console.error("Error actualizando gasto:", err);
      toast.error("Error al actualizar el gasto");
      return false;
    }
  };

  const deleteGasto = async (id: string) => {
    try {
      await deleteDoc(doc(db, "gastos", id));
      toast.success("Gasto eliminado correctamente");
      await loadFacturacionData();
      return true;
    } catch (err) {
      console.error("Error eliminando gasto:", err);
      toast.error("Error al eliminar el gasto");
      return false;
    }
  };

  useEffect(() => {
    loadFacturacionData();
  }, []);

  return { 
    ingresos, 
    gastos,
    loading, 
    error, 
    loadFacturacionData,
    addIngreso,
    updateIngreso,
    deleteIngreso,
    addGasto,
    updateGasto,
    deleteGasto
  };
}

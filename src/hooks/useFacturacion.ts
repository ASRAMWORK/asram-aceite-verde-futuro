
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
          fecha: data.fecha?.toDate ? data.fecha.toDate() : new Date(data.fecha),
          cliente: data.cliente || '',
          origen: data.origen || '',
          numFactura: data.numFactura || '',
          notas: data.notas || '',
          createdAt: data.createdAt,
          categoria: data.categoria || data.tipo || '', // Use tipo as fallback
          estado: data.estado || 'cobrada', // Nuevo campo para estado de factura
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
          fecha: data.fecha?.toDate ? data.fecha.toDate() : new Date(data.fecha),
          proveedor: data.proveedor || '',
          numFactura: data.numFactura || '',
          notas: data.notas || '',
          createdAt: data.createdAt,
          categoria: data.categoria || data.tipo || '', // Use tipo as fallback
          estado: data.estado || 'pagada', // Nuevo campo para estado de factura
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

  const addIngreso = async (data: Partial<Omit<Ingreso, 'id'>>) => {
    try {
      // Preparamos los datos eliminando campos undefined que Firebase no puede manejar
      const ingresoData: Record<string, any> = {};
      
      // Solo incluimos campos que no sean undefined
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          ingresoData[key] = value;
        }
      });
      
      // Asegurarnos que los campos obligatorios estén presentes
      ingresoData.categoria = ingresoData.categoria || ingresoData.tipo || '';
      ingresoData.origen = ingresoData.origen || '';
      ingresoData.fecha = ingresoData.fecha || new Date();
      ingresoData.createdAt = serverTimestamp();
      ingresoData.estado = ingresoData.estado || 'cobrada';
      
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
      // Preparamos los datos eliminando campos undefined
      const updateData: Record<string, any> = {};
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          updateData[key] = value;
        }
      });
      
      updateData.updatedAt = serverTimestamp();
      
      await updateDoc(doc(db, "ingresos", id), updateData);
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

  const addGasto = async (data: Partial<Omit<Gasto, 'id'>>) => {
    try {
      // Preparamos los datos eliminando campos undefined que Firebase no puede manejar
      const gastoData: Record<string, any> = {};
      
      // Solo incluimos campos que no sean undefined
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          gastoData[key] = value;
        }
      });
      
      // Asegurar que los campos obligatorios estén presentes
      gastoData.categoria = gastoData.categoria || gastoData.tipo || '';
      gastoData.tipo = gastoData.tipo || '';
      gastoData.fecha = gastoData.fecha || new Date();
      gastoData.createdAt = serverTimestamp();
      gastoData.estado = gastoData.estado || 'pagada';
      
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
      // Preparamos los datos eliminando campos undefined
      const updateData: Record<string, any> = {};
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined) {
          updateData[key] = value;
        }
      });
      
      updateData.updatedAt = serverTimestamp();
      
      await updateDoc(doc(db, "gastos", id), updateData);
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

  // Actualizar el estado de una factura
  const updateFacturaEstado = async (id: string, tipo: 'ingreso' | 'gasto', nuevoEstado: string) => {
    try {
      const collectionName = tipo === 'ingreso' ? 'ingresos' : 'gastos';
      await updateDoc(doc(db, collectionName, id), {
        estado: nuevoEstado,
        updatedAt: serverTimestamp()
      });
      toast.success(`${tipo === 'ingreso' ? 'Ingreso' : 'Gasto'} actualizado correctamente`);
      await loadFacturacionData();
      return true;
    } catch (err) {
      console.error(`Error actualizando ${tipo}:`, err);
      toast.error(`Error al actualizar el ${tipo}`);
      return false;
    }
  };

  // Calcular información financiera
  const getFinancialSummary = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Filtrar ingresos y gastos del mes actual
    const ingresosMes = ingresos
      .filter(i => {
        const fecha = i.fecha instanceof Date ? i.fecha : new Date(i.fecha);
        return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
      })
      .reduce((sum, i) => sum + i.cantidad, 0);
    
    const gastosMes = gastos
      .filter(g => {
        const fecha = g.fecha instanceof Date ? g.fecha : new Date(g.fecha);
        return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
      })
      .reduce((sum, g) => sum + g.cantidad, 0);
    
    const balanceMes = ingresosMes - gastosMes;
    
    // Calcular meses con datos para proyección
    const monthsWithData = new Set([
      ...ingresos.map(i => {
        const fecha = i.fecha instanceof Date ? i.fecha : new Date(i.fecha);
        return `${fecha.getFullYear()}-${fecha.getMonth()}`;
      }),
      ...gastos.map(g => {
        const fecha = g.fecha instanceof Date ? g.fecha : new Date(g.fecha);
        return `${fecha.getFullYear()}-${fecha.getMonth()}`;
      })
    ]).size;
    
    // Calcular ingresos totales y promedio mensual
    const ingresosTotales = ingresos.reduce((sum, i) => sum + i.cantidad, 0);
    const gastosTotales = gastos.reduce((sum, g) => sum + g.cantidad, 0);
    
    const avgIngresosMes = monthsWithData > 0 ? ingresosTotales / monthsWithData : 0;
    const proyeccionAnual = avgIngresosMes * 12;
    
    // Calcular pendiente de cobro (facturas marcadas como pendientes)
    const pendienteCobro = ingresos
      .filter(i => i.estado === 'pendiente')
      .reduce((sum, i) => sum + i.cantidad, 0);
    
    return {
      ingresosMes,
      gastosMes,
      balanceMes,
      ingresosTotales,
      gastosTotales,
      proyeccionAnual,
      pendienteCobro,
      diasEnMes: new Date(currentYear, currentMonth + 1, 0).getDate() // Días en el mes actual
    };
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
    deleteGasto,
    updateFacturaEstado,
    getFinancialSummary
  };
}

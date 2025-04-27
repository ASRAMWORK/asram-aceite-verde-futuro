
import { useState, useEffect } from "react";
import { v4 as uuidv4 } from 'uuid';
import { Ingreso, Gasto } from "@/types";
import { useToast } from "@/components/ui/use-toast";

const useFacturacion = () => {
  const [ingresos, setIngresos] = useState<Ingreso[]>([]);
  const [gastos, setGastos] = useState<Gasto[]>([]);
  const [loading, setLoading] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    // Aquí puedes cargar los datos iniciales desde localStorage o una API
    setLoading(true);
    const storedIngresos = localStorage.getItem('ingresos');
    if (storedIngresos) {
      setIngresos(JSON.parse(storedIngresos));
    }

    const storedGastos = localStorage.getItem('gastos');
    if (storedGastos) {
      setGastos(JSON.parse(storedGastos));
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    // Guarda los datos en localStorage cada vez que cambian
    localStorage.setItem('ingresos', JSON.stringify(ingresos));
  }, [ingresos]);

  useEffect(() => {
    // Guarda los datos en localStorage cada vez que cambian
    localStorage.setItem('gastos', JSON.stringify(gastos));
  }, [gastos]);

  const addIngreso = async (data: Partial<Omit<Ingreso, "id">>) => {
    const id = uuidv4();
    try {
      const nuevoIngreso: Ingreso = {
        id,
        concepto: data.concepto || "",
        cantidad: data.cantidad || 0,
        tipo: data.tipo || "general",
        fecha: data.fecha || new Date(),
        cliente: data.cliente || "",
        origen: data.origen || "",
        numFactura: data.numFactura || "",
        notas: data.notas || "",
        iva: data.iva || 0,
        total: data.total || 0,
        metodoPago: data.metodoPago || "efectivo",
        createdAt: new Date(),
        updatedAt: new Date(),
        categoria: data.categoria || "general",
        estado: data.estado || "pendiente"
      };
      setIngresos([...ingresos, nuevoIngreso]);
      toast({
        title: "Éxito",
        description: "Ingreso añadido correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al añadir el ingreso.",
      });
    }
  };

  const updateIngreso = async (id: string, data: Partial<Ingreso>) => {
    try {
      setIngresos(ingresos.map(ingreso => ingreso.id === id ? { ...ingreso, ...data, updatedAt: new Date() } : ingreso));
      toast({
        title: "Éxito",
        description: "Ingreso actualizado correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar el ingreso.",
      });
    }
  };

  const deleteIngreso = async (id: string) => {
    try {
      setIngresos(ingresos.filter(ingreso => ingreso.id !== id));
      toast({
        title: "Éxito",
        description: "Ingreso eliminado correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar el ingreso.",
      });
    }
  };

  const addGasto = async (data: Partial<Omit<Gasto, "id">>) => {
    const id = uuidv4();
    try {
      const nuevoGasto: Gasto = {
        id,
        concepto: data.concepto || "",
        cantidad: data.cantidad || 0,
        tipo: data.tipo || "general",
        fecha: data.fecha || new Date(),
        proveedor: data.proveedor || "",
        numFactura: data.numFactura || "",
        notas: data.notas || "",
        iva: data.iva || 0,
        total: data.total || 0,
        metodoPago: data.metodoPago || "efectivo",
        createdAt: new Date(),
        updatedAt: new Date(),
        categoria: data.categoria || "general",
        estado: data.estado || "pendiente"
      };
      setGastos([...gastos, nuevoGasto]);
      toast({
        title: "Éxito",
        description: "Gasto añadido correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al añadir el gasto.",
      });
    }
  };

  const updateGasto = async (id: string, data: Partial<Gasto>) => {
    try {
      setGastos(gastos.map(gasto => gasto.id === id ? { ...gasto, ...data, updatedAt: new Date() } : gasto));
      toast({
        title: "Éxito",
        description: "Gasto actualizado correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar el gasto.",
      });
    }
  };

  const deleteGasto = async (id: string) => {
    try {
      setGastos(gastos.filter(gasto => gasto.id !== id));
      toast({
        title: "Éxito",
        description: "Gasto eliminado correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al eliminar el gasto.",
      });
    }
  };
  
  // Add missing function for FacturasPendientes component
  const updateFacturaEstado = async (id: string, tipo: 'ingreso' | 'gasto', estado: string) => {
    try {
      if (tipo === 'ingreso') {
        await updateIngreso(id, { estado });
      } else {
        await updateGasto(id, { estado });
      }
      toast({
        title: "Éxito",
        description: `${tipo === 'ingreso' ? 'Ingreso' : 'Gasto'} actualizado correctamente.`,
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar el estado.",
      });
    }
  };
  
  // Add financial summary function
  const getFinancialSummary = () => {
    const currentDate = new Date();
    const currentMonth = currentDate.getMonth();
    const currentYear = currentDate.getFullYear();
    
    // Filter items for the current month
    const ingresosMesFiltrados = ingresos.filter(item => {
      const fecha = item.fecha instanceof Date ? item.fecha : new Date(item.fecha);
      return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
    });
    
    const gastosMesFiltrados = gastos.filter(item => {
      const fecha = item.fecha instanceof Date ? item.fecha : new Date(item.fecha);
      return fecha.getMonth() === currentMonth && fecha.getFullYear() === currentYear;
    });
    
    // Calculate totals
    const ingresosMes = ingresosMesFiltrados.reduce((sum, item) => sum + item.cantidad, 0);
    const gastosMes = gastosMesFiltrados.reduce((sum, item) => sum + item.cantidad, 0);
    const balanceMes = ingresosMes - gastosMes;
    
    // Calculate pending amounts
    const pendienteCobro = ingresos
      .filter(item => item.estado === 'pendiente')
      .reduce((sum, item) => sum + item.cantidad, 0);
    
    const pendientePago = gastos
      .filter(item => item.estado === 'pendiente')
      .reduce((sum, item) => sum + item.cantidad, 0);
    
    return {
      ingresosMes,
      gastosMes,
      balanceMes,
      pendienteCobro,
      pendientePago,
      totalIngresos: ingresos.reduce((sum, item) => sum + item.cantidad, 0),
      totalGastos: gastos.reduce((sum, item) => sum + item.cantidad, 0)
    };
  };

  return {
    ingresos,
    gastos,
    loading,
    addIngreso,
    updateIngreso,
    deleteIngreso,
    addGasto,
    updateGasto,
    deleteGasto,
    updateFacturaEstado,
    getFinancialSummary
  };
};

export { useFacturacion };

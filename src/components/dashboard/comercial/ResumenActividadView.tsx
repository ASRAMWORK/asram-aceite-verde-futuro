
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useClientesCaptados } from "@/hooks/useClientesCaptados";
import { useComisiones } from "@/hooks/useComisiones";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from 'recharts';

const ResumenActividadView = () => {
  const { profile } = useUserProfile();
  const { clientes: clientesCaptados, loading: loadingClientes } = useClientesCaptados();
  const { comisiones, loading: loadingComisiones, getComisionesPendientesByComercialId } = useComisiones();
  const [chartData, setChartData] = useState<any[]>([]);
  const [mostrarDetalle, setMostrarDetalle] = useState(false);

  const clientesFiltrados = clientesCaptados.filter(c => c.comercialId === profile?.id);
  const comisionesFiltradas = comisiones.filter(c => c.comercialId === profile?.id);

  const totalLitros = clientesFiltrados.reduce((acc, cliente) => acc + cliente.litrosRecogidos, 0);
  const totalClientes = clientesFiltrados.length;
  const clientesMes = clientesFiltrados.filter(c => {
    const ahora = new Date();
    const fechaCliente = c.fechaRegistro;
    return fechaCliente.getMonth() === ahora.getMonth() && fechaCliente.getFullYear() === ahora.getFullYear();
  }).length;

  const totalComisiones = comisionesFiltradas.reduce((acc, comision) => acc + comision.importe, 0);
  const comisionesPendientes = comisionesFiltradas
    .filter(c => c.estado === 'pendiente')
    .reduce((acc, comision) => acc + comision.importe, 0);

  useEffect(() => {
    if (profile?.id && !loadingComisiones) {
      // Preparar datos para el gráfico mensual
      const últimosMeses = [] as any[];
      const ahora = new Date();
      
      // Generar datos para los últimos 6 meses
      for (let i = 5; i >= 0; i--) {
        const fecha = new Date(ahora.getFullYear(), ahora.getMonth() - i, 1);
        const mes = fecha.toLocaleString('default', { month: 'short' });
        const año = fecha.getFullYear().toString().substr(2, 2);
        const etiqueta = `${mes} ${año}`;
        
        // Filtrar comisiones para este mes
        const comisionesMes = comisionesFiltradas.filter(c => {
          const fechaComision = c.fecha;
          return fechaComision.getMonth() === fecha.getMonth() && 
                 fechaComision.getFullYear() === fecha.getFullYear();
        });
        
        // Filtrar clientes captados este mes
        const clientesMes = clientesFiltrados.filter(c => {
          const fechaCliente = c.fechaRegistro;
          return fechaCliente.getMonth() === fecha.getMonth() && 
                 fechaCliente.getFullYear() === fecha.getFullYear();
        });
        
        // Calcular totales
        const litrosMes = comisionesMes.reduce((acc, c) => acc + c.litrosRecogidos, 0);
        const comisionesMesTotal = comisionesMes.reduce((acc, c) => acc + c.importe, 0);
        const clientesCaptadosMes = clientesMes.length;
        
        últimosMeses.push({
          name: etiqueta,
          litros: litrosMes,
          comisiones: comisionesMesTotal,
          clientes: clientesCaptadosMes
        });
      }
      
      setChartData(últimosMeses);
    }
  }, [profile?.id, comisionesFiltradas, clientesFiltrados, loadingComisiones]);

  if (loadingClientes || loadingComisiones) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-asram rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Cargando datos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="md:col-span-3">
        <CardHeader className="pb-2">
          <CardTitle>Resumen de Actividad</CardTitle>
          <CardDescription>
            Visión general de tu actividad como comercial
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-8">
            <div className="bg-purple-50 p-4 rounded-lg text-center">
              <p className="text-sm text-purple-600 font-semibold">Litros Recogidos</p>
              <h3 className="text-3xl font-bold text-purple-900">{totalLitros}L</h3>
              <button 
                onClick={() => setMostrarDetalle(!mostrarDetalle)}
                className="text-xs text-purple-600 hover:underline mt-2"
              >
                {mostrarDetalle ? "Ocultar detalle" : "Ver detalle"}
              </button>
            </div>
            
            <div className="bg-cyan-50 p-4 rounded-lg text-center">
              <p className="text-sm text-cyan-600 font-semibold">Clientes Totales</p>
              <h3 className="text-3xl font-bold text-cyan-900">{totalClientes}</h3>
              <p className="text-xs text-cyan-600 mt-2">Este mes: {clientesMes}</p>
            </div>
            
            <div className="bg-emerald-50 p-4 rounded-lg text-center">
              <p className="text-sm text-emerald-600 font-semibold">Comisiones Ganadas</p>
              <h3 className="text-3xl font-bold text-emerald-900">{totalComisiones.toFixed(2)}€</h3>
            </div>
            
            <div className="bg-amber-50 p-4 rounded-lg text-center">
              <p className="text-sm text-amber-600 font-semibold">Comisiones Pendientes</p>
              <h3 className="text-3xl font-bold text-amber-900">{comisionesPendientes.toFixed(2)}€</h3>
            </div>
            
            <div className="bg-blue-50 p-4 rounded-lg text-center">
              <p className="text-sm text-blue-600 font-semibold">Tasa de Conversión</p>
              <h3 className="text-3xl font-bold text-blue-900">
                {clientesFiltrados.length > 0 
                  ? ((clientesFiltrados.filter(c => c.estado === 'activo').length / clientesFiltrados.length) * 100).toFixed(0) 
                  : 0}%
              </h3>
            </div>
          </div>
          
          {mostrarDetalle && (
            <div className="mb-8 bg-gray-50 p-4 rounded-lg">
              <h4 className="font-medium mb-3">Desglose por cliente</h4>
              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead>
                    <tr>
                      <th className="px-4 py-2 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Cliente</th>
                      <th className="px-4 py-2 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Litros Recogidos</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {clientesFiltrados.map(cliente => (
                      <tr key={cliente.id}>
                        <td className="px-4 py-2 whitespace-nowrap">{cliente.nombreCliente}</td>
                        <td className="px-4 py-2 text-right whitespace-nowrap">{cliente.litrosRecogidos}L</td>
                      </tr>
                    ))}
                  </tbody>
                  <tfoot>
                    <tr className="font-bold">
                      <td className="px-4 py-2">Total</td>
                      <td className="px-4 py-2 text-right">{totalLitros}L</td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>
          )}
          
          <div>
            <h4 className="font-medium mb-3">Rendimiento mensual</h4>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  data={chartData}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                  <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                  <Tooltip />
                  <Legend />
                  <Bar yAxisId="left" dataKey="litros" name="Litros recogidos" fill="#8884d8" />
                  <Bar yAxisId="right" dataKey="comisiones" name="Comisiones (€)" fill="#82ca9d" />
                  <Bar yAxisId="right" dataKey="clientes" name="Clientes captados" fill="#ffc658" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ResumenActividadView;

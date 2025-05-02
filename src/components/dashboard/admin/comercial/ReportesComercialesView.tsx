
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer 
} from 'recharts';
import { useComerciales } from "@/hooks/useComerciales";
import { useClientesCaptados } from "@/hooks/useClientesCaptados";
import { useComisiones } from "@/hooks/useComisiones";

const ReportesComercialesView = () => {
  const { comerciales, loading: loadingComerciales } = useComerciales();
  const { clientes, loading: loadingClientes } = useClientesCaptados();
  const { comisiones, loading: loadingComisiones } = useComisiones();
  const [periodo, setPeriodo] = useState("ultimo-mes");
  const [chartData, setChartData] = useState<any[]>([]);
  
  const loading = loadingComerciales || loadingClientes || loadingComisiones;
  
  // Calcular datos para el ranking
  const comercialesActivos = comerciales.filter(c => c.activo && c.aprobado);
  
  // Filtrar datos según el período seleccionado
  const filtrarPorPeriodo = (fecha: Date) => {
    const hoy = new Date();
    const mesActual = hoy.getMonth();
    const anioActual = hoy.getFullYear();
    
    switch (periodo) {
      case "ultimo-mes":
        // Último mes completo
        const ultimoMes = mesActual === 0 ? 11 : mesActual - 1;
        const anioUltimoMes = mesActual === 0 ? anioActual - 1 : anioActual;
        return fecha.getMonth() === ultimoMes && fecha.getFullYear() === anioUltimoMes;
      
      case "mes-actual":
        return fecha.getMonth() === mesActual && fecha.getFullYear() === anioActual;
      
      case "ultimo-trimestre":
        // Últimos 3 meses
        const tresMesesAtras = new Date();
        tresMesesAtras.setMonth(tresMesesAtras.getMonth() - 3);
        return fecha >= tresMesesAtras;
      
      case "ultimo-anio":
        // Último año
        const unAnioAtras = new Date();
        unAnioAtras.setFullYear(unAnioAtras.getFullYear() - 1);
        return fecha >= unAnioAtras;
      
      default:
        return true; // Todos los datos
    }
  };
  
  // Filtrar clientes por período
  const clientesFiltrados = clientes.filter(c => filtrarPorPeriodo(c.fechaRegistro));
  
  // Filtrar comisiones por período
  const comisionesFiltradas = comisiones.filter(c => filtrarPorPeriodo(c.fecha));
  
  // Preparar datos para el ranking de comerciales
  const rankingComerciales = comercialesActivos
    .map(comercial => {
      const clientesComercial = clientesFiltrados.filter(c => c.comercialId === comercial.id);
      const comisionesComercial = comisionesFiltradas.filter(c => c.comercialId === comercial.id);
      
      return {
        id: comercial.id,
        nombre: `${comercial.nombre} ${comercial.apellidos}`,
        email: comercial.email,
        clientesCaptados: clientesComercial.length,
        litrosRecogidos: clientesComercial.reduce((acc, c) => acc + c.litrosRecogidos, 0),
        comisionesGeneradas: comisionesComercial.reduce((acc, c) => acc + c.importe, 0),
      };
    })
    .sort((a, b) => b.comisionesGeneradas - a.comisionesGeneradas);
  
  // Efecto para generar los datos del gráfico
  useEffect(() => {
    if (!loading) {
      // Agrupar datos por comercial para visualización
      const topComerciales = rankingComerciales.slice(0, 5);
      setChartData(topComerciales.map(c => ({
        name: c.nombre.split(' ')[0], // Usar solo el primer nombre para el gráfico
        clientes: c.clientesCaptados,
        litros: c.litrosRecogidos,
        comisiones: parseFloat(c.comisionesGeneradas.toFixed(2))
      })));
    }
  }, [loading, periodo, rankingComerciales]);

  if (loading) {
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
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <div>
          <h3 className="text-xl font-semibold">Reportes de Comerciales</h3>
          <p className="text-gray-500">
            Análisis y estadísticas del rendimiento de comerciales
          </p>
        </div>
        <Select value={periodo} onValueChange={setPeriodo}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Periodo..." />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="mes-actual">Mes actual</SelectItem>
            <SelectItem value="ultimo-mes">Último mes</SelectItem>
            <SelectItem value="ultimo-trimestre">Último trimestre</SelectItem>
            <SelectItem value="ultimo-anio">Último año</SelectItem>
            <SelectItem value="todo">Todo el tiempo</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-2xl">{clientesFiltrados.length}</CardTitle>
            <CardDescription>Clientes captados</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-2xl">
              {clientesFiltrados.reduce((acc, c) => acc + c.litrosRecogidos, 0)} L
            </CardTitle>
            <CardDescription>Litros recogidos</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-2xl">
              {comisionesFiltradas.reduce((acc, c) => acc + c.importe, 0).toFixed(2)} €
            </CardTitle>
            <CardDescription>Comisiones generadas</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Top 5 Comerciales</CardTitle>
          <CardDescription>Los comerciales con mejor rendimiento en el período seleccionado</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={chartData}
                margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis yAxisId="left" orientation="left" stroke="#8884d8" />
                <YAxis yAxisId="right" orientation="right" stroke="#82ca9d" />
                <Tooltip />
                <Legend />
                <Bar yAxisId="left" dataKey="clientes" name="Clientes" fill="#8884d8" />
                <Bar yAxisId="left" dataKey="litros" name="Litros" fill="#82ca9d" />
                <Bar yAxisId="right" dataKey="comisiones" name="Comisiones (€)" fill="#ffc658" />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Ranking de Comerciales</CardTitle>
          <CardDescription>
            Clasificación por rendimiento en el período seleccionado
          </CardDescription>
        </CardHeader>
        <CardContent>
          {rankingComerciales.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Puesto</TableHead>
                  <TableHead>Comercial</TableHead>
                  <TableHead className="text-center">Clientes</TableHead>
                  <TableHead className="text-center">Litros</TableHead>
                  <TableHead className="text-right">Comisiones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rankingComerciales.map((comercial, index) => (
                  <TableRow key={comercial.id}>
                    <TableCell>
                      <Badge className={
                        index === 0 ? 'bg-yellow-500' : 
                        index === 1 ? 'bg-gray-400' : 
                        index === 2 ? 'bg-amber-700' : 'bg-slate-200'
                      }>
                        {index + 1}º
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div>
                        <p className="font-medium">{comercial.nombre}</p>
                        <p className="text-xs text-gray-500">{comercial.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">{comercial.clientesCaptados}</TableCell>
                    <TableCell className="text-center">{comercial.litrosRecogidos} L</TableCell>
                    <TableCell className="text-right font-medium">
                      {comercial.comisionesGeneradas.toFixed(2)} €
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <p className="text-gray-500">No hay datos disponibles para el período seleccionado</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default ReportesComercialesView;

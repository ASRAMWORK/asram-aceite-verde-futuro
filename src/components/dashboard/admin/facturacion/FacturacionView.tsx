import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { 
  ChartContainer, 
  ChartTooltip, 
  ChartTooltipContent 
} from "@/components/ui/chart";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  LineChart,
  Line
} from "recharts";
import { 
  Euro, 
  FileInput, 
  FileOutput, 
  Receipt, 
  Download, 
  PlusCircle, 
  ChevronDown,
  ChevronUp
} from "lucide-react";
import IngresosForm from "./IngresosForm";
import GastosForm from "./GastosForm";
import InformeFinanciero from "./InformeFinanciero";
import { useFacturacion } from "@/hooks/useFacturacion";

const FacturacionView = () => {
  const [activeTab, setActiveTab] = useState("resumen");
  const [showIngresosForm, setShowIngresosForm] = useState(false);
  const [showGastosForm, setShowGastosForm] = useState(false);
  const [showInforme, setShowInforme] = useState(false);
  const { ingresos, gastos, loading, addIngreso, addGasto, deleteIngreso, deleteGasto } = useFacturacion();

  const totalIngresos = ingresos.reduce((sum, ingreso) => sum + ingreso.cantidad, 0);
  const totalGastos = gastos.reduce((sum, gasto) => sum + gasto.cantidad, 0);
  const balance = totalIngresos - totalGastos;

  const ingresosPorTipo = procesarDatosPorTipo(ingresos);
  const gastosPorTipo = procesarDatosPorTipo(gastos);
  
  const datosMensuales = procesarDatosMensuales(ingresos, gastos);

  function procesarDatosPorTipo(datos: any[]) {
    const porTipo: Record<string, number> = {};
    
    datos.forEach(dato => {
      const tipo = dato.tipo;
      porTipo[tipo] = (porTipo[tipo] || 0) + dato.cantidad;
    });
    
    return Object.entries(porTipo).map(([tipo, cantidad]) => ({
      name: tipo,
      value: cantidad
    }));
  }
  
  function procesarDatosMensuales(ingresos: any[], gastos: any[]) {
    const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentYear = new Date().getFullYear();
    
    const mensuales = meses.map((mes, index) => ({
      name: mes,
      ingresos: 0,
      gastos: 0,
      balance: 0
    }));
    
    ingresos.forEach(ingreso => {
      if (ingreso.fecha) {
        const fecha = new Date(ingreso.fecha);
        if (fecha.getFullYear() === currentYear) {
          const mes = fecha.getMonth();
          mensuales[mes].ingresos += ingreso.cantidad;
        }
      }
    });
    
    gastos.forEach(gasto => {
      if (gasto.fecha) {
        const fecha = new Date(gasto.fecha);
        if (fecha.getFullYear() === currentYear) {
          const mes = fecha.getMonth();
          mensuales[mes].gastos += gasto.cantidad;
        }
      }
    });
    
    mensuales.forEach(mes => {
      mes.balance = mes.ingresos - mes.gastos;
    });
    
    return mensuales;
  }

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#F59E0B', '#EC4899', '#EF4444'];

  const handleIngresoSubmit = (data: any) => {
    addIngreso(data);
    setShowIngresosForm(false);
  };
  
  const handleGastoSubmit = (data: any) => {
    addGasto(data);
    setShowGastosForm(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Facturación</h2>
        <div className="flex gap-2">
          <Button 
            variant="outline" 
            onClick={() => setShowInforme(!showInforme)}
            className="flex items-center gap-1"
          >
            <Receipt className="mr-1 h-4 w-4" />
            {showInforme ? "Ocultar informe" : "Ver informe"}
            {showInforme ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
          </Button>
          <Button 
            onClick={() => setShowIngresosForm(true)} 
            className="bg-green-600 hover:bg-green-700 text-white"
          >
            <FileInput className="mr-2 h-4 w-4" /> Nuevo ingreso
          </Button>
          <Button 
            onClick={() => setShowGastosForm(true)} 
            className="bg-red-600 hover:bg-red-700 text-white"
          >
            <FileOutput className="mr-2 h-4 w-4" /> Nuevo gasto
          </Button>
        </div>
      </div>

      {showInforme && (
        <InformeFinanciero 
          ingresos={ingresos} 
          gastos={gastos} 
          onClose={() => setShowInforme(false)} 
        />
      )}

      {showIngresosForm && (
        <Card>
          <CardHeader>
            <CardTitle>Registrar nuevo ingreso</CardTitle>
            <CardDescription>Introduce los datos del nuevo ingreso</CardDescription>
          </CardHeader>
          <CardContent>
            <IngresosForm 
              onSubmit={handleIngresoSubmit}
              onCancel={() => setShowIngresosForm(false)}
            />
          </CardContent>
        </Card>
      )}

      {showGastosForm && (
        <Card>
          <CardHeader>
            <CardTitle>Registrar nuevo gasto</CardTitle>
            <CardDescription>Introduce los datos del nuevo gasto</CardDescription>
          </CardHeader>
          <CardContent>
            <GastosForm 
              onSubmit={handleGastoSubmit}
              onCancel={() => setShowGastosForm(false)}
            />
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-white to-green-50 shadow-md border-green-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-green-800">
              <FileInput className="h-5 w-5 text-green-600" />
              Ingresos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-green-900">
              {totalIngresos.toLocaleString()}€
            </div>
            <p className="text-xs text-green-700 mt-1">
              {ingresos.filter(i => {
                if (!i.fecha) return false;
                const date = new Date(i.fecha);
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                return date > oneMonthAgo;
              }).reduce((sum, i) => sum + i.cantidad, 0).toLocaleString()}€ último mes
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-white to-red-50 shadow-md border-red-100">
          <CardHeader className="pb-2">
            <CardTitle className="flex items-center gap-2 text-xl font-bold text-red-800">
              <FileOutput className="h-5 w-5 text-red-600" />
              Gastos Totales
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-4xl font-bold text-red-900">
              {totalGastos.toLocaleString()}€
            </div>
            <p className="text-xs text-red-700 mt-1">
              {gastos.filter(g => {
                if (!g.fecha) return false;
                const date = new Date(g.fecha);
                const oneMonthAgo = new Date();
                oneMonthAgo.setMonth(oneMonthAgo.getMonth() - 1);
                return date > oneMonthAgo;
              }).reduce((sum, g) => sum + g.cantidad, 0).toLocaleString()}€ último mes
            </p>
          </CardContent>
        </Card>
        
        <Card className={`bg-gradient-to-br from-white ${balance >= 0 ? 'to-blue-50 shadow-md border-blue-100' : 'to-amber-50 shadow-md border-amber-100'}`}>
          <CardHeader className="pb-2">
            <CardTitle className={`flex items-center gap-2 text-xl font-bold ${balance >= 0 ? 'text-blue-800' : 'text-amber-800'}`}>
              <Euro className={`h-5 w-5 ${balance >= 0 ? 'text-blue-600' : 'text-amber-600'}`} />
              Balance
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className={`text-4xl font-bold ${balance >= 0 ? 'text-blue-900' : 'text-amber-900'}`}>
              {balance.toLocaleString()}€
            </div>
            <p className={`text-xs ${balance >= 0 ? 'text-blue-700' : 'text-amber-700'} mt-1`}>
              {balance >= 0 ? 'Superávit' : 'Déficit'} del {Math.abs(Math.round((balance / totalIngresos) * 100))}% sobre ingresos
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="resumen">Resumen</TabsTrigger>
          <TabsTrigger value="ingresos">Ingresos</TabsTrigger>
          <TabsTrigger value="gastos">Gastos</TabsTrigger>
          <TabsTrigger value="graficos">Gráficos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="resumen">
          <Card>
            <CardHeader>
              <CardTitle>Evolución Financiera Anual</CardTitle>
              <CardDescription>Visión general de ingresos y gastos del año en curso</CardDescription>
            </CardHeader>
            <CardContent className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={datosMensuales}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => `${Number(value).toLocaleString()}€`} />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="ingresos"
                    stroke="#10B981"
                    activeDot={{ r: 8 }}
                    strokeWidth={2}
                  />
                  <Line 
                    type="monotone" 
                    dataKey="gastos" 
                    stroke="#EF4444" 
                    strokeWidth={2} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="balance" 
                    stroke="#3B82F6" 
                    strokeDasharray="5 5" 
                    strokeWidth={2} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-6">
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Ingresos</CardTitle>
                <CardDescription>Por categoría</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={ingresosPorTipo}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {ingresosPorTipo.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${Number(value).toLocaleString()}€`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Distribución de Gastos</CardTitle>
                <CardDescription>Por categoría</CardDescription>
              </CardHeader>
              <CardContent className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={gastosPorTipo}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {gastosPorTipo.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip formatter={(value) => `${Number(value).toLocaleString()}€`} />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="ingresos">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Registro de Ingresos</CardTitle>
                <CardDescription>Listado de todos los ingresos registrados</CardDescription>
              </div>
              <Button 
                onClick={() => setShowIngresosForm(true)} 
                className="bg-green-600 hover:bg-green-700 text-white"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Añadir ingreso
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center py-4">Cargando datos...</p>
              ) : ingresos.length === 0 ? (
                <p className="text-center py-4">No hay ingresos registrados</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Concepto</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Cliente/Origen</TableHead>
                      <TableHead className="text-right">Importe</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {ingresos.map((ingreso) => (
                      <TableRow key={ingreso.id}>
                        <TableCell>
                          {ingreso.fecha ? new Date(ingreso.fecha).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell className="font-medium">{ingreso.concepto}</TableCell>
                        <TableCell>{ingreso.tipo}</TableCell>
                        <TableCell>{ingreso.cliente || ingreso.origen || "-"}</TableCell>
                        <TableCell className="text-right font-medium text-green-600">
                          {ingreso.cantidad.toLocaleString()}€
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteIngreso(ingreso.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-green-50">
                      <TableCell colSpan={4} className="text-right font-medium">Total</TableCell>
                      <TableCell className="text-right font-bold text-green-700">
                        {totalIngresos.toLocaleString()}€
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="gastos">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
              <div>
                <CardTitle>Registro de Gastos</CardTitle>
                <CardDescription>Listado de todos los gastos registrados</CardDescription>
              </div>
              <Button 
                onClick={() => setShowGastosForm(true)} 
                className="bg-red-600 hover:bg-red-700 text-white"
              >
                <PlusCircle className="mr-2 h-4 w-4" /> Añadir gasto
              </Button>
            </CardHeader>
            <CardContent>
              {loading ? (
                <p className="text-center py-4">Cargando datos...</p>
              ) : gastos.length === 0 ? (
                <p className="text-center py-4">No hay gastos registrados</p>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Fecha</TableHead>
                      <TableHead>Concepto</TableHead>
                      <TableHead>Tipo</TableHead>
                      <TableHead>Proveedor</TableHead>
                      <TableHead className="text-right">Importe</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {gastos.map((gasto) => (
                      <TableRow key={gasto.id}>
                        <TableCell>
                          {gasto.fecha ? new Date(gasto.fecha).toLocaleDateString() : '-'}
                        </TableCell>
                        <TableCell className="font-medium">{gasto.concepto}</TableCell>
                        <TableCell>{gasto.tipo}</TableCell>
                        <TableCell>{gasto.proveedor || "-"}</TableCell>
                        <TableCell className="text-right font-medium text-red-600">
                          {gasto.cantidad.toLocaleString()}€
                        </TableCell>
                        <TableCell className="text-right">
                          <Button 
                            variant="ghost" 
                            size="sm" 
                            onClick={() => deleteGasto(gasto.id)}
                            className="text-red-500 hover:text-red-700"
                          >
                            Eliminar
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                    <TableRow className="bg-red-50">
                      <TableCell colSpan={4} className="text-right font-medium">Total</TableCell>
                      <TableCell className="text-right font-bold text-red-700">
                        {totalGastos.toLocaleString()}€
                      </TableCell>
                      <TableCell></TableCell>
                    </TableRow>
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="graficos">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Comparativa mensual</CardTitle>
                <CardDescription>Ingresos vs gastos por mes</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={datosMensuales}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${Number(value).toLocaleString()}€`} />
                    <Legend />
                    <Bar dataKey="ingresos" name="Ingresos" fill="#10B981" />
                    <Bar dataKey="gastos" name="Gastos" fill="#EF4444" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Balance mensual</CardTitle>
                <CardDescription>Evolución del balance a lo largo del año</CardDescription>
              </CardHeader>
              <CardContent className="h-80">
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart
                    data={datosMensuales}
                    margin={{
                      top: 20,
                      right: 30,
                      left: 20,
                      bottom: 5,
                    }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip formatter={(value) => `${Number(value).toLocaleString()}€`} />
                    <Legend />
                    <Bar dataKey="balance" name="Balance" fill="#3B82F6" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default FacturacionView;

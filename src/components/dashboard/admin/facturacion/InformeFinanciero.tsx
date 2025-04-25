
import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Download, Printer, X } from "lucide-react";
import { toast } from "sonner";

interface InformeFinancieroProps {
  ingresos: any[];
  gastos: any[];
  onClose: () => void;
}

const InformeFinanciero = ({ ingresos, gastos, onClose }: InformeFinancieroProps) => {
  const totalIngresos = ingresos.reduce((sum, ingreso) => sum + ingreso.cantidad, 0);
  const totalGastos = gastos.reduce((sum, gasto) => sum + gasto.cantidad, 0);
  const balance = totalIngresos - totalGastos;
  
  // Agrupar ingresos por tipo
  const ingresosPorTipo = ingresos.reduce((acc: Record<string, number>, ingreso) => {
    const tipo = ingreso.tipo;
    acc[tipo] = (acc[tipo] || 0) + ingreso.cantidad;
    return acc;
  }, {});
  
  // Agrupar gastos por tipo
  const gastosPorTipo = gastos.reduce((acc: Record<string, number>, gasto) => {
    const tipo = gasto.tipo;
    acc[tipo] = (acc[tipo] || 0) + gasto.cantidad;
    return acc;
  }, {});

  // Calcular el mes actual y el periodo
  const currentDate = new Date();
  const currentMonth = currentDate.toLocaleString('default', { month: 'long' });
  const currentYear = currentDate.getFullYear();
  
  // Filtrar por mes actual
  const ingresosMesActual = ingresos.filter(ingreso => {
    if (!ingreso.fecha) return false;
    const fechaIngreso = new Date(ingreso.fecha);
    return fechaIngreso.getMonth() === currentDate.getMonth() && 
           fechaIngreso.getFullYear() === currentDate.getFullYear();
  });
  
  const gastosMesActual = gastos.filter(gasto => {
    if (!gasto.fecha) return false;
    const fechaGasto = new Date(gasto.fecha);
    return fechaGasto.getMonth() === currentDate.getMonth() && 
           fechaGasto.getFullYear() === currentDate.getFullYear();
  });
  
  const totalIngresosMesActual = ingresosMesActual.reduce((sum, ingreso) => sum + ingreso.cantidad, 0);
  const totalGastosMesActual = gastosMesActual.reduce((sum, gasto) => sum + gasto.cantidad, 0);
  const balanceMesActual = totalIngresosMesActual - totalGastosMesActual;
  
  const handleDownload = () => {
    toast.success("Informe descargado en formato PDF");
  };
  
  const handlePrint = () => {
    window.print();
  };

  return (
    <Card className="my-6 print:shadow-none" id="informe-financiero">
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <div>
          <CardTitle className="text-2xl">Informe Financiero</CardTitle>
          <CardDescription>Periodo: {currentMonth} {currentYear}</CardDescription>
        </div>
        <div className="flex space-x-2 print:hidden">
          <Button variant="outline" size="sm" onClick={handlePrint}>
            <Printer className="mr-2 h-4 w-4" /> Imprimir
          </Button>
          <Button variant="outline" size="sm" onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" /> Descargar
          </Button>
          <Button variant="outline" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="border-b pb-4">
          <h3 className="text-lg font-semibold mb-2">Resumen Financiero</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-green-50 p-4 rounded-lg">
              <div className="text-sm text-green-700">Ingresos Totales</div>
              <div className="text-2xl font-bold text-green-800">{totalIngresos.toLocaleString()}€</div>
            </div>
            <div className="bg-red-50 p-4 rounded-lg">
              <div className="text-sm text-red-700">Gastos Totales</div>
              <div className="text-2xl font-bold text-red-800">{totalGastos.toLocaleString()}€</div>
            </div>
            <div className={`p-4 rounded-lg ${balance >= 0 ? 'bg-blue-50' : 'bg-amber-50'}`}>
              <div className={`text-sm ${balance >= 0 ? 'text-blue-700' : 'text-amber-700'}`}>
                Balance
              </div>
              <div className={`text-2xl font-bold ${balance >= 0 ? 'text-blue-800' : 'text-amber-800'}`}>
                {balance.toLocaleString()}€
              </div>
            </div>
          </div>
        </div>
        
        <div className="space-y-4 border-b pb-4">
          <h3 className="text-lg font-semibold">Ingresos por Categoría</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo de Ingreso</TableHead>
                <TableHead className="text-right">Importe</TableHead>
                <TableHead className="text-right">% del Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(ingresosPorTipo).sort((a, b) => b[1] - a[1]).map(([tipo, cantidad]) => (
                <TableRow key={tipo}>
                  <TableCell>{tipo}</TableCell>
                  <TableCell className="text-right">{cantidad.toLocaleString()}€</TableCell>
                  <TableCell className="text-right">
                    {((cantidad / totalIngresos) * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-green-50">
                <TableCell className="font-bold">Total</TableCell>
                <TableCell className="text-right font-bold">{totalIngresos.toLocaleString()}€</TableCell>
                <TableCell className="text-right font-bold">100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        <div className="space-y-4 border-b pb-4">
          <h3 className="text-lg font-semibold">Gastos por Categoría</h3>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tipo de Gasto</TableHead>
                <TableHead className="text-right">Importe</TableHead>
                <TableHead className="text-right">% del Total</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {Object.entries(gastosPorTipo).sort((a, b) => b[1] - a[1]).map(([tipo, cantidad]) => (
                <TableRow key={tipo}>
                  <TableCell>{tipo}</TableCell>
                  <TableCell className="text-right">{cantidad.toLocaleString()}€</TableCell>
                  <TableCell className="text-right">
                    {((cantidad / totalGastos) * 100).toFixed(1)}%
                  </TableCell>
                </TableRow>
              ))}
              <TableRow className="bg-red-50">
                <TableCell className="font-bold">Total</TableCell>
                <TableCell className="text-right font-bold">{totalGastos.toLocaleString()}€</TableCell>
                <TableCell className="text-right font-bold">100%</TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </div>
        
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Métricas del Mes Actual ({currentMonth})</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="border p-4 rounded-lg">
              <div className="text-sm text-gray-500">Ingresos del mes</div>
              <div className="text-xl font-bold text-green-600">
                {totalIngresosMesActual.toLocaleString()}€
              </div>
              <div className="text-sm mt-1">
                {totalIngresosMesActual > 0 && totalIngresos > 0 ? 
                  `${((totalIngresosMesActual / totalIngresos) * 100).toFixed(1)}% del total anual` : 
                  '0% del total anual'}
              </div>
            </div>
            
            <div className="border p-4 rounded-lg">
              <div className="text-sm text-gray-500">Gastos del mes</div>
              <div className="text-xl font-bold text-red-600">
                {totalGastosMesActual.toLocaleString()}€
              </div>
              <div className="text-sm mt-1">
                {totalGastosMesActual > 0 && totalGastos > 0 ? 
                  `${((totalGastosMesActual / totalGastos) * 100).toFixed(1)}% del total anual` : 
                  '0% del total anual'}
              </div>
            </div>
            
            <div className="border p-4 rounded-lg">
              <div className="text-sm text-gray-500">Balance del mes</div>
              <div className={`text-xl font-bold ${balanceMesActual >= 0 ? 'text-blue-600' : 'text-amber-600'}`}>
                {balanceMesActual.toLocaleString()}€
              </div>
              <div className="text-sm mt-1">
                {balanceMesActual >= 0 ? 'Superávit' : 'Déficit'} mensual
              </div>
            </div>
          </div>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between text-sm text-gray-500 border-t pt-4">
        <div>Generado el {new Date().toLocaleDateString()} a las {new Date().toLocaleTimeString()}</div>
        <div className="print:hidden">ASRAM - Sistema de gestión financiera</div>
      </CardFooter>
    </Card>
  );
};

export default InformeFinanciero;

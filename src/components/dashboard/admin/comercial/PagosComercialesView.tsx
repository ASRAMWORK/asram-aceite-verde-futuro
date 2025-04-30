
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Search, CheckCircle, Calendar, FileDown } from "lucide-react";
import { toast } from "sonner";
import { useComerciales } from "@/hooks/useComerciales";
import { useComisiones } from "@/hooks/useComisiones";

const PagosComercialesView = () => {
  const { comerciales, loading: loadingComerciales } = useComerciales();
  const { comisiones, loading: loadingComisiones, marcarComisionAbonada } = useComisiones();
  const [filtro, setFiltro] = useState("pendientes");
  const [busqueda, setBusqueda] = useState("");
  
  const loading = loadingComerciales || loadingComisiones;
  
  // Comerciales con su saldo pendiente
  const comercialesConPagos = comerciales
    .map(comercial => {
      const comisionesComercial = comisiones.filter(c => c.comercialId === comercial.id);
      const comisionesPendientes = comisionesComercial.filter(c => c.estado === 'pendiente');
      
      return {
        ...comercial,
        totalPendiente: comisionesPendientes.reduce((acc, c) => acc + c.importe, 0),
        totalPagado: comisionesComercial
          .filter(c => c.estado === 'abonado')
          .reduce((acc, c) => acc + c.importe, 0),
        comisionesPendientes: comisionesPendientes
      };
    })
    .filter(comercial => {
      // Aplicar filtro de búsqueda
      if (busqueda) {
        return comercial.nombre.toLowerCase().includes(busqueda.toLowerCase()) ||
               comercial.email.toLowerCase().includes(busqueda.toLowerCase());
      }
      return true;
    })
    .filter(comercial => {
      // Aplicar filtro de estado
      if (filtro === 'pendientes') {
        return comercial.totalPendiente > 0;
      }
      return true;
    })
    .sort((a, b) => b.totalPendiente - a.totalPendiente);
  
  // Total pendiente global
  const totalPendienteGlobal = comercialesConPagos.reduce((acc, c) => acc + c.totalPendiente, 0);
  
  // Marcar todas las comisiones de un comercial como pagadas
  const marcarComisionesPagadas = async (comercialId: string) => {
    try {
      const comisionesPendientes = comisiones
        .filter(c => c.comercialId === comercialId && c.estado === 'pendiente');
      
      if (comisionesPendientes.length === 0) {
        toast.warning("No hay comisiones pendientes para este comercial");
        return;
      }
      
      // Confirmar antes de proceder
      if (!window.confirm(`¿Confirmar pago de ${comisionesPendientes.length} comisiones por un total de ${
        comisionesPendientes.reduce((acc, c) => acc + c.importe, 0).toFixed(2)
      }€?`)) {
        return;
      }
      
      // Marcar cada comisión como abonada
      for (const comision of comisionesPendientes) {
        await marcarComisionAbonada(comision.id);
      }
      
      toast.success(`${comisionesPendientes.length} comisiones marcadas como abonadas`);
    } catch (error) {
      console.error("Error al procesar pagos:", error);
      toast.error("Error al procesar los pagos");
    }
  };
  
  // Exportar informe de pagos
  const exportarInforme = () => {
    const tipoInforme = filtro === 'pendientes' ? 'pendientes' : 'todos';
    const fecha = new Date().toISOString().split('T')[0];
    const nombreArchivo = `pagos_comerciales_${tipoInforme}_${fecha}.csv`;
    
    // Preparar datos CSV
    const headers = ["Comercial", "Email", "Pendiente (€)", "Pagado (€)", "Total (€)"];
    const rows = comercialesConPagos.map(c => [
      `${c.nombre} ${c.apellidos || ''}`.replace(/,/g, ' '),
      c.email,
      c.totalPendiente.toFixed(2),
      c.totalPagado.toFixed(2),
      (c.totalPendiente + c.totalPagado).toFixed(2)
    ]);
    
    const csvContent = [
      headers.join(","),
      ...rows.map(row => row.join(","))
    ].join("\n");
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement("a");
    link.setAttribute("href", url);
    link.setAttribute("download", nombreArchivo);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    
    toast.success(`Informe exportado como ${nombreArchivo}`);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-asram rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Cargando datos de pagos...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-2xl">{totalPendienteGlobal.toFixed(2)} €</CardTitle>
            <CardDescription>Total pendiente de pago</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-2xl">
              {comercialesConPagos.filter(c => c.totalPendiente > 0).length}
            </CardTitle>
            <CardDescription>Comerciales con saldo pendiente</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-2xl">
              {comisiones.filter(c => c.estado === 'pendiente').length}
            </CardTitle>
            <CardDescription>Comisiones pendientes</CardDescription>
          </CardHeader>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Gestión de Pagos a Comerciales</CardTitle>
              <CardDescription>
                Visualiza y gestiona los pagos pendientes a comerciales
              </CardDescription>
            </div>
            
            <div className="flex flex-col sm:flex-row gap-3">
              <Select value={filtro} onValueChange={setFiltro}>
                <SelectTrigger className="w-[150px]">
                  <SelectValue placeholder="Filtrar por..." />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pendientes">Pendientes</SelectItem>
                  <SelectItem value="todos">Todos</SelectItem>
                </SelectContent>
              </Select>
              
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
                <Input
                  placeholder="Buscar comercial..."
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="pl-10 w-full sm:w-auto"
                />
              </div>
              
              <Button variant="outline" className="flex items-center" onClick={exportarInforme}>
                <FileDown className="mr-2 h-4 w-4" />
                Exportar
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {comercialesConPagos.length > 0 ? (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Comercial</TableHead>
                  <TableHead className="text-center">Método de pago</TableHead>
                  <TableHead className="text-right">Pendiente</TableHead>
                  <TableHead className="text-right">Pagado</TableHead>
                  <TableHead className="text-right">Total</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comercialesConPagos.map((comercial) => (
                  <TableRow key={comercial.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{comercial.nombre} {comercial.apellidos}</p>
                        <p className="text-xs text-gray-500">{comercial.email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="text-center">
                      {comercial.metodoPago ? (
                        <Badge variant="outline">
                          {comercial.metodoPago.tipo === 'banco' ? 'Transferencia' :
                           comercial.metodoPago.tipo === 'paypal' ? 'PayPal' : 'Bizum'}
                        </Badge>
                      ) : (
                        <Badge variant="outline" className="bg-red-50 text-red-500">
                          No configurado
                        </Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-right font-medium">
                      {comercial.totalPendiente.toFixed(2)} €
                    </TableCell>
                    <TableCell className="text-right">
                      {comercial.totalPagado.toFixed(2)} €
                    </TableCell>
                    <TableCell className="text-right">
                      {(comercial.totalPendiente + comercial.totalPagado).toFixed(2)} €
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => marcarComisionesPagadas(comercial.id)}
                          disabled={comercial.totalPendiente <= 0}
                          className="text-green-600 hover:text-green-700"
                        >
                          <CheckCircle className="h-4 w-4 mr-1" />
                          Marcar pagado
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          ) : (
            <div className="text-center py-12">
              <Calendar className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <p className="text-lg font-medium">No hay pagos {filtro === 'pendientes' ? 'pendientes' : ''}</p>
              {busqueda && (
                <p className="text-gray-500 mt-2">Prueba con otros términos de búsqueda</p>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default PagosComercialesView;

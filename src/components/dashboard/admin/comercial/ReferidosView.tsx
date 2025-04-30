
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { useComerciales } from "@/hooks/useComerciales";
import { useClientesCaptados } from "@/hooks/useClientesCaptados";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { QrCode } from "lucide-react";

const ReferidosView = () => {
  const { comerciales, loading: loadingComerciales } = useComerciales();
  const { clientes, loading: loadingClientes } = useClientesCaptados();
  
  // Estadísticas generales
  const totalComerciales = comerciales.length;
  const comercialesActivos = comerciales.filter(c => c.activo && c.aprobado).length;
  const codigosUtilizados = new Set(clientes.map(c => c.comercialId)).size;
  
  // Códigos ordenados por uso
  const codigosByUso = comerciales
    .map(comercial => ({
      ...comercial,
      clientesCaptados: clientes.filter(c => c.comercialId === comercial.id).length,
      litrosTotales: clientes
        .filter(c => c.comercialId === comercial.id)
        .reduce((acc, c) => acc + c.litrosRecogidos, 0)
    }))
    .sort((a, b) => b.clientesCaptados - a.clientesCaptados);
  
  const loading = loadingComerciales || loadingClientes;

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-2xl">{totalComerciales}</CardTitle>
            <CardDescription>Comerciales registrados</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-2xl">{comercialesActivos}</CardTitle>
            <CardDescription>Comerciales activos</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-2xl">{clientes.length}</CardTitle>
            <CardDescription>Clientes captados</CardDescription>
          </CardHeader>
        </Card>
        
        <Card>
          <CardHeader className="py-4">
            <CardTitle className="text-2xl">{codigosUtilizados}</CardTitle>
            <CardDescription>Códigos utilizados</CardDescription>
          </CardHeader>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Códigos por Uso</CardTitle>
          <CardDescription>
            Ranking de códigos de referidos ordenados por captación de clientes
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Comercial</TableHead>
                <TableHead>Código</TableHead>
                <TableHead className="text-center">Clientes captados</TableHead>
                <TableHead className="text-center">Litros totales</TableHead>
                <TableHead>Tasa conversión</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {codigosByUso.map((comercial) => (
                <TableRow key={comercial.id}>
                  <TableCell>
                    <div>
                      <p className="font-medium">{comercial.nombre} {comercial.apellidos}</p>
                      <p className="text-sm text-gray-500">{comercial.email}</p>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center space-x-2">
                      <QrCode className="h-4 w-4" />
                      <span className="font-mono">{comercial.codigo}</span>
                    </div>
                  </TableCell>
                  <TableCell className="text-center">{comercial.clientesCaptados}</TableCell>
                  <TableCell className="text-center">{comercial.litrosTotales} L</TableCell>
                  <TableCell>
                    {/* Simulación de tasa de conversión - en producción usar datos reales */}
                    {comercial.clientesCaptados > 0 ? 
                      `${Math.round(comercial.clientesCaptados / (comercial.clientesCaptados + Math.floor(Math.random() * 10)) * 100)}%` : 
                      '0%'
                    }
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <div className={`h-2.5 w-2.5 rounded-full mr-2 ${comercial.activo && comercial.aprobado ? 'bg-green-500' : 'bg-gray-300'}`}></div>
                      {comercial.activo && comercial.aprobado ? "Activo" : "Inactivo"}
                    </div>
                  </TableCell>
                </TableRow>
              ))}

              {codigosByUso.length === 0 && (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-8">
                    No hay datos de códigos de referidos disponibles
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReferidosView;


import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useComisiones } from "@/hooks/useComisiones";
import { Comision } from "@/types/comercial";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { FileDown } from "lucide-react";

const ComisionesHistorialView = () => {
  const { profile } = useUserProfile();
  const { comisiones, loading } = useComisiones();
  const [filtroEstado, setFiltroEstado] = useState<string>('todos');

  // Filtrar por comercial y estado si aplica
  const comisionesFiltradas = comisiones
    .filter(comision => 
      comision.comercialId === profile?.id && 
      (filtroEstado === 'todos' || comision.estado === filtroEstado)
    )
    .sort((a, b) => b.fecha.getTime() - a.fecha.getTime());

  const totalComisiones = comisionesFiltradas.reduce((acc, c) => acc + c.importe, 0);
  
  // Para exportar a CSV
  const exportarCSV = () => {
    if (comisionesFiltradas.length === 0) return;
    
    const headers = ['Cliente', 'Litros', 'Importe', 'Estado', 'Fecha'];
    const csvContent = [
      headers.join(','),
      ...comisionesFiltradas.map(c => [
        c.nombreCliente.replace(/,/g, ' '),
        c.litrosRecogidos,
        c.importe.toFixed(2),
        c.estado,
        c.fecha.toLocaleDateString()
      ].join(','))
    ].join('\n');
    
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `comisiones_${new Date().toISOString().slice(0, 10)}.csv`);
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-asram rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Cargando comisiones...</p>
        </div>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <CardTitle>Historial de Comisiones</CardTitle>
            <CardDescription>
              Registro de todas tus comisiones generadas
            </CardDescription>
          </div>
          <div className="flex items-center gap-2">
            <Select
              value={filtroEstado}
              onValueChange={setFiltroEstado}
            >
              <SelectTrigger className="w-[180px]">
                <SelectValue placeholder="Filtrar por estado" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="todos">Todos los estados</SelectItem>
                <SelectItem value="pendiente">Pendientes</SelectItem>
                <SelectItem value="abonado">Abonados</SelectItem>
              </SelectContent>
            </Select>
            
            <Button variant="outline" size="icon" onClick={exportarCSV} title="Exportar a CSV">
              <FileDown className="h-4 w-4" />
            </Button>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {comisionesFiltradas.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Litros recogidos</TableHead>
                  <TableHead>Importe</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Fecha</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {comisionesFiltradas.map((comision) => (
                  <TableRow key={comision.id}>
                    <TableCell className="font-medium">{comision.nombreCliente}</TableCell>
                    <TableCell>{comision.litrosRecogidos} L</TableCell>
                    <TableCell className="font-medium">{comision.importe.toFixed(2)} €</TableCell>
                    <TableCell>
                      <Badge variant={comision.estado === 'abonado' ? 'default' : 'outline'} className={
                        comision.estado === 'abonado' ? 'bg-green-600' : 'bg-amber-600'
                      }>
                        {comision.estado === 'abonado' ? 'Abonado' : 'Pendiente'}
                      </Badge>
                    </TableCell>
                    <TableCell>{comision.fecha.toLocaleDateString()}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <tfoot>
                <tr>
                  <td colSpan={2} className="px-4 py-2 font-bold">Total</td>
                  <td className="px-4 py-2 font-bold">{totalComisiones.toFixed(2)} €</td>
                  <td colSpan={2}></td>
                </tr>
              </tfoot>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12">
            <p className="text-gray-500">No hay comisiones disponibles</p>
            {filtroEstado !== 'todos' && (
              <p className="text-sm mt-2">Prueba a cambiar los filtros</p>
            )}
          </div>
        )}
      </CardContent>
      <CardFooter>
        <p className="text-sm text-gray-500">
          Las comisiones se calculan según el volumen de aceite recogido en cada cliente captado
        </p>
      </CardFooter>
    </Card>
  );
};

export default ComisionesHistorialView;

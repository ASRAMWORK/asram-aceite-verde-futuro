
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Droplet, Edit, Trash2 } from 'lucide-react';
import formatDate from './DateFormatter';
import { Button } from '@/components/ui/button';

interface HistorialRecogidasTableProps {
  recogidasCliente: any[];
  direccionCliente?: string;
  onDeleteRecogida?: (recogidaId: string) => void;
  onEditRecogida?: (recogida: any) => void;
}

const HistorialRecogidasTable: React.FC<HistorialRecogidasTableProps> = ({ 
  recogidasCliente,
  direccionCliente,
  onDeleteRecogida,
  onEditRecogida
}) => {
  // Safety check to ensure recogidasCliente is an array
  const validRecogidas = Array.isArray(recogidasCliente) ? recogidasCliente : [];

  if (!validRecogidas.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay recogidas registradas para este cliente
      </div>
    );
  }

  // Sort recogidas by date (most recent first)
  const sortedRecogidas = [...validRecogidas].sort((a, b) => {
    const dateA = a.fechaRecogida || a.fecha || a.fechaCompletada;
    const dateB = b.fechaRecogida || b.fecha || b.fechaCompletada;
    
    if (!dateA) return 1;
    if (!dateB) return -1;
    
    // Make sure that dateA and dateB are proper Date objects before calling getTime()
    const timeA = dateA instanceof Date ? dateA.getTime() : new Date(dateA).getTime();
    const timeB = dateB instanceof Date ? dateB.getTime() : new Date(dateB).getTime();
    
    return timeB - timeA;
  });

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Dirección</TableHead>
          <TableHead>Origen</TableHead>
          <TableHead className="text-right">Litros</TableHead>
          <TableHead className="text-right">Estado</TableHead>
          <TableHead className="text-right">Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedRecogidas.map((recogida) => (
          <TableRow key={recogida.id || `recogida-${Date.now()}-${Math.random()}`}>
            <TableCell>{formatDate(recogida.fechaRecogida || recogida.fecha)}</TableCell>
            <TableCell>{recogida.direccionRecogida || recogida.direccion || direccionCliente}</TableCell>
            <TableCell>
              {recogida.rutaId ? "Ruta" : (recogida.esRecogidaZona ? "Ruta" : "Individual")}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Droplet className="h-4 w-4 text-blue-500" />
                {recogida.litrosRecogidos || 0}L
              </div>
            </TableCell>
            <TableCell className="text-right">
              <Badge 
                variant={recogida.completada || recogida.estadoRecogida === "completada" ? "default" : "outline"}
                className={recogida.completada || recogida.estadoRecogida === "completada" ? "bg-green-500 hover:bg-green-600" : ""}
              >
                {recogida.completada || recogida.estadoRecogida === "completada" ? "Completada" : "Pendiente"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex justify-end gap-2">
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-8 w-8 text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                  onClick={() => onEditRecogida && onEditRecogida(recogida)}
                  disabled={!onEditRecogida}
                >
                  <Edit className="h-4 w-4" />
                  <span className="sr-only">Editar</span>
                </Button>
                <Button 
                  variant="outline" 
                  size="icon"
                  className="h-8 w-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                  onClick={() => onDeleteRecogida && onDeleteRecogida(recogida.id)}
                  disabled={!onDeleteRecogida}
                >
                  <Trash2 className="h-4 w-4" />
                  <span className="sr-only">Eliminar</span>
                </Button>
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default HistorialRecogidasTable;

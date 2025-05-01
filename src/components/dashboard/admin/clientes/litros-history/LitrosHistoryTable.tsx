
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Droplet } from 'lucide-react';

interface LitrosHistoryTableProps {
  recogidasCliente: any[];
  formatDate: (date: Date | string | undefined | null) => string;
  totalLitros: number;
}

const LitrosHistoryTable: React.FC<LitrosHistoryTableProps> = ({ 
  recogidasCliente, 
  formatDate, 
  totalLitros 
}) => {
  // Sort recogidas by date (most recent first)
  const sortedRecogidas = [...recogidasCliente].sort((a, b) => {
    const dateA = a.fecha || a.fechaRecogida;
    const dateB = b.fecha || b.fechaRecogida;
    if (!dateA) return 1;
    if (!dateB) return -1;
    
    // Convert to timestamps for comparison if they're Date objects
    const timeA = dateA instanceof Date ? dateA.getTime() : new Date(dateA).getTime();
    const timeB = dateB instanceof Date ? dateB.getTime() : new Date(dateB).getTime();
    
    return timeB - timeA;
  });

  if (!sortedRecogidas.length) {
    return (
      <div className="text-center py-8 text-muted-foreground">
        No hay registros de recolección para este cliente
      </div>
    );
  }

  return (
    <Table>
      <TableCaption>Total de litros recogidos: {totalLitros} litros</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Dirección</TableHead>
          <TableHead>Origen</TableHead>
          <TableHead className="text-right">Litros</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedRecogidas.map((recogida) => (
          <TableRow key={recogida.id}>
            <TableCell>{formatDate(recogida.fecha || recogida.fechaRecogida)}</TableCell>
            <TableCell>{recogida.direccion || recogida.direccionRecogida || 'No especificada'}</TableCell>
            <TableCell>
              <Badge variant="outline">
                {recogida.esRecogidaZona ? "Ruta" : "Individual"}
              </Badge>
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end">
                <Droplet className="h-4 w-4 mr-1 text-blue-500" />
                {recogida.litrosRecogidos || 0} L
              </div>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LitrosHistoryTable;

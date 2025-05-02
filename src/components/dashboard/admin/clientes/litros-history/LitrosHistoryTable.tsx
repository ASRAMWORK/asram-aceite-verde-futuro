
import React from 'react';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Recogida } from '@/types';
import { CalendarIcon, Clock, MapPin } from 'lucide-react';

interface LitrosHistoryTableProps {
  recogidasCliente: Recogida[];
  formatDate: (date: any) => string;
  totalLitros: number;
}

const LitrosHistoryTable: React.FC<LitrosHistoryTableProps> = ({
  recogidasCliente,
  formatDate,
  totalLitros,
}) => {
  // Sort recogidas by date, most recent first
  const sortedRecogidas = [...recogidasCliente].sort((a, b) => {
    const dateA = a.fecha ? new Date(a.fecha).getTime() : 0;
    const dateB = b.fecha ? new Date(b.fecha).getTime() : 0;
    return dateB - dateA;
  });

  return (
    <Table>
      <TableCaption>Total acumulado: {totalLitros} litros</TableCaption>
      <TableHeader>
        <TableRow>
          <TableHead>Fecha</TableHead>
          <TableHead>Litros</TableHead>
          <TableHead>Dirección</TableHead>
          <TableHead>Tipo</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedRecogidas.length > 0 ? (
          sortedRecogidas.map((recogida) => (
            <TableRow key={recogida.id}>
              <TableCell className="flex items-center">
                <CalendarIcon className="mr-1 h-4 w-4 text-muted-foreground" />
                {formatDate(recogida.fecha || recogida.fechaRecogida)}
              </TableCell>
              <TableCell className="font-medium">
                {recogida.litrosRecogidos || 0} litros
              </TableCell>
              <TableCell className="max-w-xs truncate">
                <div className="flex items-center">
                  <MapPin className="mr-1 h-4 w-4 text-muted-foreground" />
                  <span className="truncate">
                    {recogida.direccion || recogida.direccionRecogida || 'N/A'}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <Badge variant={recogida.esHistorico ? "outline" : "secondary"}>
                  {recogida.esHistorico ? "Histórico" : "Recogida"}
                </Badge>
              </TableCell>
            </TableRow>
          ))
        ) : (
          <TableRow>
            <TableCell colSpan={4} className="text-center py-4">
              No hay registros de recogidas para este cliente
            </TableCell>
          </TableRow>
        )}
      </TableBody>
    </Table>
  );
};

export default LitrosHistoryTable;


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
import { CalendarIcon, Clock, MapPin, AlertCircle } from 'lucide-react';

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
  // Aseguramos que recogidasCliente sea un array
  const safeRecogidas = Array.isArray(recogidasCliente) ? recogidasCliente : [];
  
  // Log para depuración
  console.log('Datos recibidos en LitrosHistoryTable:', safeRecogidas);
  
  // Sort recogidas by date, most recent first
  const sortedRecogidas = [...safeRecogidas].sort((a, b) => {
    // Manejamos diferentes formatos de fecha
    const getDate = (r: Recogida) => {
      if (r.fecha instanceof Date) return r.fecha.getTime();
      if (r.fechaRecogida instanceof Date) return r.fechaRecogida.getTime();
      if (r.fechaCompletada instanceof Date) return r.fechaCompletada.getTime();
      
      // Si es un string o timestamp
      const dateStr = r.fecha || r.fechaRecogida || r.fechaCompletada;
      if (!dateStr) return 0;
      
      try {
        return new Date(dateStr).getTime();
      } catch (e) {
        return 0;
      }
    };
    
    return getDate(b) - getDate(a); // Orden descendente (más reciente primero)
  });

  if (sortedRecogidas.length === 0) {
    return (
      <div className="text-center py-8 border rounded-md bg-muted/10">
        <AlertCircle className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
        <p className="text-muted-foreground">No hay registros de recogidas para este cliente</p>
      </div>
    );
  }

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
        {sortedRecogidas.map((recogida, index) => (
          <TableRow key={recogida.id || `recogida-${index}`}>
            <TableCell className="flex items-center">
              <CalendarIcon className="mr-1 h-4 w-4 text-muted-foreground" />
              {formatDate(recogida.fecha || recogida.fechaRecogida || recogida.fechaCompletada)}
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
        ))}
      </TableBody>
    </Table>
  );
};

export default LitrosHistoryTable;

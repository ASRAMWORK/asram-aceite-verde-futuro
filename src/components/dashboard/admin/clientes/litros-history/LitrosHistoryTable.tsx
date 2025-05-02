
import React from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Droplet } from 'lucide-react';

interface LitrosHistoryTableProps {
  recogidasCliente: any[];
  formatDate: (date: any) => string;
  totalLitros: number;
}

const LitrosHistoryTable: React.FC<LitrosHistoryTableProps> = ({ 
  recogidasCliente,
  formatDate,
  totalLitros
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
        </TableRow>
      </TableHeader>
      <TableBody>
        {sortedRecogidas.map((recogida) => (
          <TableRow key={recogida.id || `recogida-${Date.now()}-${Math.random()}`}>
            <TableCell>{formatDate(recogida.fechaRecogida || recogida.fecha)}</TableCell>
            <TableCell>{recogida.direccionRecogida || recogida.direccion}</TableCell>
            <TableCell>
              {recogida.rutaId ? "Ruta" : (recogida.esHistorico ? "Manual" : "Individual")}
            </TableCell>
            <TableCell className="text-right">
              <div className="flex items-center justify-end gap-1">
                <Droplet className="h-4 w-4 text-blue-500" />
                {recogida.litrosRecogidos || 0}L
              </div>
            </TableCell>
            <TableCell className="text-right">
              {recogida.completada || recogida.estadoRecogida === "completada" ? (
                <span className="bg-green-100 text-green-800 py-1 px-2 rounded-full text-xs font-medium">
                  Completada
                </span>
              ) : (
                <span className="bg-amber-100 text-amber-800 py-1 px-2 rounded-full text-xs font-medium">
                  Pendiente
                </span>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default LitrosHistoryTable;

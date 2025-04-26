
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { MapPin, Calendar, Clock, User } from 'lucide-react';
import { Recogida } from '@/types';
import { format } from 'date-fns';

interface RecogidasListProps {
  recogidas: Recogida[];
}

const RecogidasList: React.FC<RecogidasListProps> = ({ recogidas }) => {
  const formatDate = (date: Date | string) => {
    if (!date) return "-";
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return format(dateObj, 'dd/MM/yyyy');
  };

  const getBadgeColor = (estado: string) => {
    switch (estado) {
      case 'pendiente':
        return 'bg-yellow-100 text-yellow-800';
      case 'realizada':
        return 'bg-green-100 text-green-800';
      case 'cancelada':
        return 'bg-red-100 text-red-800';
      case 'programado':
        return 'bg-blue-100 text-blue-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Dirección</TableHead>
          <TableHead>Fecha</TableHead>
          <TableHead>Hora</TableHead>
          <TableHead>Distrito</TableHead>
          <TableHead>Estado</TableHead>
          <TableHead>Acciones</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {recogidas.length === 0 ? (
          <TableRow>
            <TableCell colSpan={6} className="text-center py-8 text-gray-500">
              No hay recogidas programadas
            </TableCell>
          </TableRow>
        ) : (
          recogidas.map((recogida) => (
            <TableRow key={recogida.id}>
              <TableCell>
                <div className="flex flex-col">
                  <span className="font-medium">{recogida.nombreLugar}</span>
                  <span className="text-sm text-gray-500 flex items-center">
                    <MapPin className="h-3 w-3 mr-1" /> {recogida.direccion}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Calendar className="h-4 w-4 text-gray-500 mr-2" />
                  {formatDate(recogida.fecha)}
                </div>
              </TableCell>
              <TableCell>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 text-gray-500 mr-2" />
                  {recogida.hora || recogida.horaInicio || "-"}
                </div>
              </TableCell>
              <TableCell>
                {recogida.distrito} / {recogida.barrio}
              </TableCell>
              <TableCell>
                <Badge className={getBadgeColor(recogida.estado)}>
                  {recogida.estado.charAt(0).toUpperCase() + recogida.estado.slice(1)}
                </Badge>
              </TableCell>
              <TableCell>
                <Button variant="outline" size="sm">
                  Ver detalle
                </Button>
              </TableCell>
            </TableRow>
          ))
        )}
      </TableBody>
    </Table>
  );
};

export default RecogidasList;

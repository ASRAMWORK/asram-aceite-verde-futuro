
import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, MapPin, Check, Info } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { format } from 'date-fns';
import type { Recogida } from '@/types';

interface RecogidasListProps {
  recogidas: Recogida[];
  onComplete: (id: string) => void;
  onViewDetails: (id: string) => void;
}

const RecogidasList: React.FC<RecogidasListProps> = ({ recogidas, onComplete, onViewDetails }) => {
  return (
    <Card>
      <CardContent className="pt-6">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Cliente</TableHead>
              <TableHead>Fecha y Hora</TableHead>
              <TableHead>Dirección</TableHead>
              <TableHead>Estado</TableHead>
              <TableHead>Cantidad</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {recogidas.length === 0 ? (
              <TableRow>
                <TableCell colSpan={6} className="text-center py-8 text-muted-foreground">
                  No hay recogidas pendientes
                </TableCell>
              </TableRow>
            ) : (
              recogidas.map((recogida) => (
                <TableRow key={recogida.id}>
                  <TableCell className="font-medium">{recogida.cliente}</TableCell>
                  <TableCell>
                    <div className="flex items-center text-sm text-muted-foreground">
                      <Calendar className="mr-2 h-4 w-4" />
                      {recogida.fechaRecogida ? format(new Date(recogida.fechaRecogida), 'dd/MM/yyyy') : 'Sin fecha'}
                    </div>
                    <div className="flex items-center text-sm text-muted-foreground mt-1">
                      <Clock className="mr-2 h-4 w-4" />
                      {recogida.horaRecogida}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-start">
                      <MapPin className="mr-2 h-4 w-4 mt-0.5 text-muted-foreground" />
                      <div>
                        <div>{recogida.direccionRecogida}</div>
                        <div className="text-xs text-muted-foreground">
                          {recogida.distrito}, {recogida.barrio}
                        </div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={recogida.estadoRecogida === 'pendiente' ? 'outline' : 'default'}
                      className={recogida.estadoRecogida === 'pendiente' ? 'bg-yellow-100 text-yellow-800' : 'bg-green-100 text-green-800'}
                    >
                      {recogida.estadoRecogida === 'pendiente' ? 'Pendiente' : 'Completada'}
                    </Badge>
                  </TableCell>
                  <TableCell>{recogida.cantidadAproximada} litros</TableCell>
                  <TableCell>
                    <div className="flex space-x-2">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => onComplete(recogida.id)}
                        disabled={recogida.completada}
                      >
                        <Check className="mr-1 h-4 w-4" />
                        Completar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => onViewDetails(recogida.id)}
                      >
                        <Info className="h-4 w-4" />
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default RecogidasList;

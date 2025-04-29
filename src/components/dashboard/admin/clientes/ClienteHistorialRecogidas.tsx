
import React from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Badge } from "@/components/ui/badge";
import { useRecogidas } from '@/hooks/useRecogidas';
import { Droplet, MapPin, Calendar } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { Recogida, Usuario } from '@/types';
import RecogidaClienteButton from './RecogidaClienteButton';

interface ClienteHistorialRecogidasProps {
  clienteId: string;
  clienteNombre?: string;
  cliente?: Usuario;
}

const ClienteHistorialRecogidas: React.FC<ClienteHistorialRecogidasProps> = ({
  clienteId,
  clienteNombre,
  cliente
}) => {
  const { recogidas, loading } = useRecogidas();
  
  // Filter recogidas for this client
  const clienteRecogidas = recogidas.filter(r => r.clienteId === clienteId);
  
  // Sort by date (most recent first)
  const sortedRecogidas = [...clienteRecogidas].sort((a, b) => {
    const dateA = a.fechaRecogida ? new Date(a.fechaRecogida).getTime() : 0;
    const dateB = b.fechaRecogida ? new Date(b.fechaRecogida).getTime() : 0;
    return dateB - dateA;
  });

  // Calculate total liters collected
  const totalLitros = clienteRecogidas.reduce((sum, recogida) => 
    sum + (recogida.litrosRecogidos || 0), 0);

  const formatDate = (date: Date | undefined | null) => {
    if (!date) return "N/A";
    try {
      return format(new Date(date), "dd/MM/yyyy", { locale: es });
    } catch (error) {
      return "Fecha inválida";
    }
  };

  if (loading) {
    return (
      <Card>
        <CardContent className="pt-6">
          <div className="flex justify-center py-6">
            <p>Cargando historial de recogidas...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-3">
        <CardTitle className="text-xl flex items-center justify-between">
          <div className="flex items-center">
            <Droplet className="h-5 w-5 mr-2 text-cyan-500" />
            Historial de Recogidas 
            {clienteNombre && <span className="ml-2 font-normal text-muted-foreground">- {clienteNombre}</span>}
          </div>
          <Badge className="bg-cyan-500">{totalLitros} litros</Badge>
        </CardTitle>
        <CardDescription>
          Registro histórico de recogidas realizadas para este cliente
        </CardDescription>
      </CardHeader>
      <CardContent>
        {sortedRecogidas.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            <p>Este cliente no tiene recogidas registradas</p>
            {cliente && (
              <div className="mt-4">
                <RecogidaClienteButton cliente={cliente} />
              </div>
            )}
          </div>
        ) : (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Distrito/Barrio</TableHead>
                <TableHead className="text-right">Litros</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRecogidas.map((recogida) => (
                <TableRow key={recogida.id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-2 text-gray-400" />
                      {formatDate(recogida.fechaRecogida)}
                    </div>
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-2 text-gray-400" />
                      {recogida.direccion || recogida.direccionRecogida || "N/A"}
                    </div>
                  </TableCell>
                  <TableCell>
                    {recogida.distrito} / {recogida.barrio}
                  </TableCell>
                  <TableCell className="text-right">
                    {recogida.litrosRecogidos || 0} L
                  </TableCell>
                  <TableCell>
                    <Badge className={
                      recogida.estadoRecogida === "completada" 
                        ? "bg-green-100 text-green-800 hover:bg-green-200" 
                        : recogida.estadoRecogida === "cancelada"
                          ? "bg-red-100 text-red-800 hover:bg-red-200"
                          : "bg-amber-100 text-amber-800 hover:bg-amber-200"
                    }>
                      {recogida.estadoRecogida === "completada" 
                        ? "Completada" 
                        : recogida.estadoRecogida === "cancelada" 
                          ? "Cancelada" 
                          : "Pendiente"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </CardContent>
      <CardFooter className="flex justify-end pt-4">
        {cliente && (
          <RecogidaClienteButton cliente={cliente} />
        )}
      </CardFooter>
    </Card>
  );
};

export default ClienteHistorialRecogidas;

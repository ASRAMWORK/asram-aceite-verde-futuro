
import React, { useState, useEffect } from 'react';
import { useRecogidas } from '@/hooks/useRecogidas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Droplet } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Usuario } from '@/types';

interface ClienteHistorialRecogidasProps {
  cliente: Usuario;
}

const ClienteHistorialRecogidas: React.FC<ClienteHistorialRecogidasProps> = ({ cliente }) => {
  const { recogidas, getRecogidasByClientId } = useRecogidas();
  const [clienteRecogidas, setClienteRecogidas] = useState<any[]>([]);
  
  useEffect(() => {
    // Get recogidas for this specific client
    if (cliente && cliente.id) {
      const recogidasCliente = getRecogidasByClientId(cliente.id);
      setClienteRecogidas(recogidasCliente);
    }
  }, [cliente, recogidas]);
  
  const formatDate = (date: Date | undefined) => {
    if (!date) return "Sin fecha";
    try {
      return format(new Date(date), "dd/MM/yyyy", { locale: es });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Fecha inválida";
    }
  };
  
  // Calculate total liters
  const totalLitros = clienteRecogidas.reduce((sum, recogida) => {
    return sum + (recogida.litrosRecogidos || 0);
  }, 0);
  
  return (
    <Card className="mt-4">
      <CardHeader>
        <CardTitle>Historial de recogidas</CardTitle>
        <CardDescription>
          {clienteRecogidas.length 
            ? `Total histórico: ${totalLitros} litros en ${clienteRecogidas.length} recogidas` 
            : "Este cliente no tiene recogidas registradas"}
        </CardDescription>
      </CardHeader>
      <CardContent>
        {clienteRecogidas.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Litros</TableHead>
                <TableHead>Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clienteRecogidas.map((recogida) => (
                <TableRow key={recogida.id}>
                  <TableCell>{formatDate(recogida.fechaRecogida || recogida.fecha)}</TableCell>
                  <TableCell>{recogida.direccionRecogida || recogida.direccion || cliente.direccion}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-1">
                      <Droplet className="h-4 w-4 text-blue-500" />
                      {recogida.litrosRecogidos || 0}L
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant={recogida.completada || recogida.estadoRecogida === "completada" ? "default" : "outline"}
                           className={recogida.completada || recogida.estadoRecogida === "completada" ? "bg-green-500 hover:bg-green-600" : ""}>
                      {recogida.completada || recogida.estadoRecogida === "completada" ? "Completada" : "Pendiente"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No hay recogidas registradas para este cliente
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClienteHistorialRecogidas;

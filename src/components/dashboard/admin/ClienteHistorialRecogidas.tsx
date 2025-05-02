
import React, { useState, useEffect } from 'react';
import { useRecogidas } from '@/hooks/useRecogidas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Droplet, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { Usuario } from '@/types';

interface ClienteHistorialRecogidasProps {
  cliente: Usuario;
}

const ClienteHistorialRecogidas: React.FC<ClienteHistorialRecogidasProps> = ({ cliente }) => {
  const { recogidas, getRecogidasByClientId } = useRecogidas();
  const [clienteRecogidas, setClienteRecogidas] = useState<any[]>([]);
  const [promedioLitros30Dias, setPromedioLitros30Dias] = useState<number>(0);
  
  useEffect(() => {
    // Get recogidas for this specific client
    if (cliente && cliente.id) {
      const recogidasCliente = getRecogidasByClientId(cliente.id);
      setClienteRecogidas(recogidasCliente);
      
      // Calculate average liters per 30 days
      if (recogidasCliente.length > 0) {
        // Sort recogidas by date (oldest first)
        const sortedRecogidas = [...recogidasCliente].sort((a, b) => {
          const dateA = a.fechaRecogida || a.fecha || new Date();
          const dateB = b.fechaRecogida || b.fecha || new Date();
          return dateA.getTime() - dateB.getTime();
        });
        
        // Get first and last date
        const firstDate = sortedRecogidas[0].fechaRecogida || sortedRecogidas[0].fecha || new Date();
        const lastDate = sortedRecogidas[sortedRecogidas.length - 1].fechaRecogida || 
                        sortedRecogidas[sortedRecogidas.length - 1].fecha || new Date();
        
        // Calculate total days between first and last collection
        const totalDays = Math.max(1, Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)));
        
        // Calculate total liters
        const totalLitros = sortedRecogidas.reduce((sum, recogida) => sum + (recogida.litrosRecogidos || 0), 0);
        
        // Calculate average per 30 days
        const promedio = (totalLitros / totalDays) * 30;
        setPromedioLitros30Dias(parseFloat(promedio.toFixed(2)));
      }
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
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Historial de recogidas</CardTitle>
            <CardDescription>
              {clienteRecogidas.length 
                ? `${clienteRecogidas.length} recogidas registradas` 
                : "Este cliente no tiene recogidas registradas"}
            </CardDescription>
          </div>
          <div className="flex flex-col items-end gap-2">
            <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
              <Droplet className="h-3.5 w-3.5" />
              <span>Total: {totalLitros} litros</span>
            </Badge>
            {promedioLitros30Dias > 0 && (
              <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                <Calendar className="h-3.5 w-3.5" />
                <span>Media: {promedioLitros30Dias} L/30 días</span>
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {clienteRecogidas.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead className="text-right">Litros</TableHead>
                <TableHead className="text-right">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clienteRecogidas.map((recogida) => (
                <TableRow key={recogida.id}>
                  <TableCell>{formatDate(recogida.fechaRecogida || recogida.fecha)}</TableCell>
                  <TableCell>{recogida.direccionRecogida || recogida.direccion || cliente.direccion}</TableCell>
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


import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
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
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRecogidas } from '@/hooks/useRecogidas';
import RecogidaClienteButton from './RecogidaClienteButton';
import type { Usuario } from '@/types';

interface ClienteHistorialRecogidasProps {
  cliente: Usuario;
}

const ClienteHistorialRecogidas: React.FC<ClienteHistorialRecogidasProps> = ({ cliente }) => {
  const { recogidas, getRecogidasByClientId } = useRecogidas();
  
  // Obtener recogidas para este cliente
  const recogidasCliente = getRecogidasByClientId(cliente.id);
  
  // Format date helper
  const formatDate = (date: Date | undefined | null) => {
    if (!date) return 'N/A';
    try {
      return format(date, 'dd/MM/yyyy', { locale: es });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };
  
  const getEstadoColor = (completada: boolean) => {
    return completada ? 
      'bg-green-100 text-green-800 hover:bg-green-200' : 
      'bg-amber-100 text-amber-800 hover:bg-amber-200';
  };
  
  // Calcular total de litros recogidos
  const totalLitros = recogidasCliente.reduce((sum, r) => sum + (r.litrosRecogidos || 0), 0);
  
  // Ordenar por fecha más reciente primero
  const recogidasOrdenadas = [...recogidasCliente].sort((a, b) => {
    const fechaA = a.fecha || a.fechaRecogida;
    const fechaB = b.fecha || b.fechaRecogida;
    
    if (!fechaA && !fechaB) return 0;
    if (!fechaA) return 1;
    if (!fechaB) return -1;
    
    return fechaB.getTime() - fechaA.getTime();
  });

  return (
    <Card className="w-full">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Historial de Recogidas</CardTitle>
            <CardDescription>
              Historial de recogidas para {cliente.nombre}
            </CardDescription>
          </div>
          <RecogidaClienteButton 
            cliente={cliente} 
            variant="outline" 
          />
        </div>
      </CardHeader>
      <CardContent>
        {recogidasOrdenadas.length === 0 ? (
          <p className="text-center py-4 text-muted-foreground">No hay recogidas registradas para este cliente</p>
        ) : (
          <>
            <div className="text-sm mb-4">
              <p className="font-medium">Total de litros recogidos: <span className="font-bold">{totalLitros}</span> litros</p>
            </div>
            <Table>
              <TableCaption>Historial de recogidas de aceite</TableCaption>
              <TableHeader>
                <TableRow>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Litros</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {recogidasOrdenadas.map((recogida) => (
                  <TableRow key={recogida.id}>
                    <TableCell>{formatDate(recogida.fecha || recogida.fechaRecogida)}</TableCell>
                    <TableCell>{recogida.direccion || recogida.direccionRecogida}</TableCell>
                    <TableCell>{recogida.litrosRecogidos || 'Pendiente'}</TableCell>
                    <TableCell>
                      <Badge className={getEstadoColor(!!recogida.completada)}>
                        {recogida.completada ? 'Completada' : 'Pendiente'}
                      </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default ClienteHistorialRecogidas;
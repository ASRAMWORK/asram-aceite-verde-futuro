
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Droplet, Calendar } from 'lucide-react';
import { useRecogidas } from '@/hooks/useRecogidas';
import type { Usuario } from '@/types';
import { toast } from '@/components/ui/use-toast';
import formatDate from './litros-history/DateFormatter';
import LitrosHistoryTable from './litros-history/LitrosHistoryTable';
import AddHistoricalCollection from './litros-history/AddHistoricalCollection';
import RecogidaClienteButton from './RecogidaClienteButton';

interface ClienteHistorialRecogidasProps {
  cliente: Usuario;
}

const ClienteHistorialRecogidas: React.FC<ClienteHistorialRecogidasProps> = ({ cliente }) => {
  const { recogidas, getRecogidasByClientId, addRecogida } = useRecogidas();
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
          const dateA = new Date(a.fechaRecogida || a.fecha || 0);
          const dateB = new Date(b.fechaRecogida || b.fecha || 0);
          return dateA.getTime() - dateB.getTime();
        });
        
        // Get first and last date
        const firstDate = new Date(sortedRecogidas[0].fechaRecogida || sortedRecogidas[0].fecha || 0);
        const lastDate = new Date(sortedRecogidas[sortedRecogidas.length - 1].fechaRecogida || 
                        sortedRecogidas[sortedRecogidas.length - 1].fecha || 0);
        
        // Calculate total days between first and last collection
        const totalDays = Math.max(1, Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)));
        
        // Calculate total liters
        const totalLitros = sortedRecogidas.reduce((sum, recogida) => sum + (recogida.litrosRecogidos || 0), 0);
        
        // Calculate average per 30 days
        const promedio = (totalLitros / totalDays) * 30;
        setPromedioLitros30Dias(parseFloat(promedio.toFixed(2)));
      }
    }
  }, [cliente, recogidas, getRecogidasByClientId]);
  
  // Calculate total liters
  const totalLitros = clienteRecogidas.reduce((sum, recogida) => {
    return sum + (recogida.litrosRecogidos || 0);
  }, 0);
  
  // Handle adding a historical collection
  const handleAddHistoricalCollection = async (date: Date, litros: number) => {
    if (!cliente.id) {
      console.error("Cliente ID is missing");
      return;
    }
    
    try {
      await addRecogida({
        clienteId: cliente.id,
        fecha: date,
        fechaRecogida: date,
        litrosRecogidos: litros,
        completada: true,
        estadoRecogida: "completada",
        direccion: cliente.direccion,
        direccionRecogida: cliente.direccion,
        distrito: cliente.distrito,
        barrio: cliente.barrio,
        nombreContacto: cliente.nombre,
        telefonoContacto: cliente.telefono,
        emailContacto: cliente.email,
        fechaCompletada: date,
      });

      toast({
        title: "Recolección histórica añadida",
        description: `Se añadieron ${litros} litros al historial de ${cliente.nombre}`,
      });
    } catch (error) {
      console.error("Error adding historical collection:", error);
      toast({
        title: "Error",
        description: "No se pudo añadir la recolección histórica",
        variant: "destructive",
      });
    }
  };
  
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
          <div className="flex items-center gap-4">
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
            
            <div className="flex space-x-2">
              <AddHistoricalCollection 
                cliente={cliente} 
                onAddCollection={handleAddHistoricalCollection} 
              />
              <RecogidaClienteButton 
                cliente={cliente} 
                variant="outline" 
              />
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <LitrosHistoryTable 
          recogidasCliente={clienteRecogidas}
          formatDate={formatDate}
          totalLitros={totalLitros}
        />
      </CardContent>
    </Card>
  );
};

export default ClienteHistorialRecogidas;


import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { useRecogidas } from '@/hooks/useRecogidas';
import type { Usuario } from '@/types';
import { Droplet } from 'lucide-react';
import LitrosHistoryTable from './litros-history/LitrosHistoryTable';
import AddHistoricalCollection from './litros-history/AddHistoricalCollection';
import formatDate from './litros-history/DateFormatter';
import { toast } from 'sonner';

interface ClienteLitrosHistoryProps {
  cliente: Usuario;
}

const ClienteLitrosHistory: React.FC<ClienteLitrosHistoryProps> = ({ cliente }) => {
  const { recogidas, getRecogidasByClientId, addRecogida } = useRecogidas();
  
  // Get all the recogidas for this client
  const recogidasCliente = cliente?.id ? getRecogidasByClientId(cliente.id) : [];
  
  // Handle adding a historical collection
  const handleAddHistoricalCollection = async (date: Date, litros: number) => {
    if (!cliente.id) {
      console.error("Cliente ID is missing");
      return;
    }
    
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
      esHistorico: true // Esta bandera es importante para distinguir recogidas históricas
    });
    
    toast.success(`Recolección histórica añadida: ${litros} litros`);
  };
  
  // Calculate total liters
  const totalLitros = recogidasCliente.reduce((sum, r) => sum + (r.litrosRecogidos || 0), 0);

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Historial de litros recogidos</CardTitle>
            <CardDescription>
              Registro de todas las recolecciones realizadas para {cliente.nombre || "este cliente"}
            </CardDescription>
          </div>
          <AddHistoricalCollection 
            cliente={cliente} 
            onAddCollection={handleAddHistoricalCollection}
          />
        </div>
      </CardHeader>
      <CardContent>
        <LitrosHistoryTable 
          recogidasCliente={recogidasCliente}
          formatDate={formatDate}
          totalLitros={totalLitros}
        />
      </CardContent>
      <CardFooter className="bg-slate-50 border-t flex justify-between">
        <span className="text-sm text-muted-foreground">Los registros incluyen recogidas individuales y por ruta</span>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
          <Droplet className="h-3.5 w-3.5" />
          <span>Total: {totalLitros} litros</span>
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default ClienteLitrosHistory;

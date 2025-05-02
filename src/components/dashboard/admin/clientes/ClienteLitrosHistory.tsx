
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplet } from 'lucide-react';
import type { Usuario } from '@/types';
import { useRecogidas } from '@/hooks/useRecogidas';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import LitrosHistoryTable from './litros-history/LitrosHistoryTable';
import AddHistoricalRecogidaForm from './litros-history/AddHistoricalRecogidaForm';

interface ClienteLitrosHistoryProps {
  cliente: Usuario;
}

const ClienteLitrosHistory: React.FC<ClienteLitrosHistoryProps> = ({ cliente }) => {
  const { recogidas, addRecogida } = useRecogidas();
  
  // Get all recogidas for this client
  const recogidasCliente = recogidas.filter(
    recogida => recogida.clienteId === cliente.id || 
                recogida.cliente === cliente.nombre ||
                recogida.nombreContacto === cliente.nombre
  );
  
  // Calculate total litros
  const totalLitros = recogidasCliente.reduce((sum, recogida) => {
    return sum + (recogida.litrosRecogidos || 0);
  }, 0);

  // Format date helper function
  const formatDate = (date: any) => {
    if (!date) return "N/A";
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'dd/MM/yyyy', { locale: es });
    } catch (error) {
      return "Fecha inválida";
    }
  };

  const handleAddHistoricalCollection = async (date: Date, litros: number) => {
    await addRecogida({
      clienteId: cliente.id,
      cliente: cliente.nombre,
      nombreContacto: cliente.nombre,
      direccion: cliente.direccion,
      direccionRecogida: cliente.direccion,
      distrito: cliente.distrito,
      barrio: cliente.barrio,
      fecha: date,
      fechaRecogida: date,
      litrosRecogidos: litros,
      completada: true,
      estadoRecogida: "completada",
      fechaCompletada: date,
      esHistorico: true
    });
  };

  return (
    <Card className="w-full">
      <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
        <CardTitle className="text-xl font-bold">Historial de Aceite Recogido</CardTitle>
        <div className="flex items-center space-x-2">
          <Droplet className="w-5 h-5 text-blue-500" />
          <span className="font-bold">{totalLitros} litros en total</span>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex justify-between items-center mb-4">
          <p className="text-muted-foreground">
            Registro histórico de recogidas para este cliente
          </p>
          <AddHistoricalRecogidaForm 
            cliente={cliente} 
            onAddRecogida={handleAddHistoricalCollection} 
          />
        </div>

        <LitrosHistoryTable 
          recogidasCliente={recogidasCliente}
          formatDate={formatDate}
          totalLitros={totalLitros}
        />
      </CardContent>
    </Card>
  );
};

export default ClienteLitrosHistory;


import React, { useState, useEffect, useMemo } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { useRecogidas } from '@/hooks/useRecogidas';
import type { Usuario } from '@/types';
import { toast } from 'sonner';
import ClienteRecogidasStats from './ClienteRecogidasStats';
import HistorialRecogidasTable from './HistorialRecogidasTable';
import AddHistoricalRecogidaForm from './AddHistoricalRecogidaForm';

interface ClienteHistorialRecogidasProps {
  cliente: Usuario;
}

const ClienteHistorialRecogidas: React.FC<ClienteHistorialRecogidasProps> = ({ cliente }) => {
  const { recogidas, getRecogidasByClientId, addRecogida, loadRecogidasData } = useRecogidas();
  const [clienteRecogidas, setClienteRecogidas] = useState<any[]>([]);
  const [promedioLitros30Dias, setPromedioLitros30Dias] = useState<number>(0);
  
  // Use useMemo to prevent unnecessary calculations on every render
  const totalLitros = useMemo(() => {
    return clienteRecogidas.reduce((sum, recogida) => {
      return sum + (recogida.litrosRecogidos || 0);
    }, 0);
  }, [clienteRecogidas]);

  // Load and process client recogidas data
  useEffect(() => {
    if (cliente?.id && recogidas.length > 0) {
      // Ensure we're getting an array back
      const recogidasCliente = getRecogidasByClientId(cliente.id) || [];
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
        
        // Calculate average per 30 days
        const promedio = (totalLitros / totalDays) * 30;
        setPromedioLitros30Dias(parseFloat(promedio.toFixed(2)));
      }
    } else {
      // If no client ID or no recogidas, set empty array
      setClienteRecogidas([]);
    }
  }, [cliente?.id, recogidas, getRecogidasByClientId, totalLitros]);

  // Handle adding a historical collection
  const handleAddHistoricalCollection = async (date: Date, litros: number) => {
    if (!cliente?.id) {
      console.error("Cliente ID is missing");
      return;
    }
    
    try {
      // Usar solo los campos necesarios sin duplicaciones
      await addRecogida({
        clienteId: cliente.id,
        adminId: cliente.administradorId || cliente.adminId,
        administradorId: cliente.administradorId,
        fecha: date,
        fechaRecogida: date,
        litrosRecogidos: litros,
        completada: true,
        estadoRecogida: "completada",
        direccion: cliente.direccion, // Solo usar un campo de dirección
        nombreContacto: cliente.nombre,
        telefonoContacto: cliente.telefono,
        emailContacto: cliente.email,
        distrito: cliente.distrito,
        barrio: cliente.barrio,
        fechaCompletada: date,
        esHistorico: true // Esta bandera es importante para distinguir recogidas históricas
      });

      // Recargar datos para actualizar la UI inmediatamente
      await loadRecogidasData();
      
      toast.success(`Se añadieron ${litros} litros al historial de ${cliente.nombre}`);
    } catch (error) {
      console.error("Error adding historical collection:", error);
      toast.error("No se pudo añadir la recolección histórica");
    }
  };

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
          <div className="flex items-center gap-4">
            <ClienteRecogidasStats 
              totalLitros={totalLitros}
              promedioLitros30Dias={promedioLitros30Dias}
            />
            <AddHistoricalRecogidaForm
              cliente={cliente}
              onAddRecogida={handleAddHistoricalCollection}
            />
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <HistorialRecogidasTable 
          recogidasCliente={clienteRecogidas} 
          direccionCliente={cliente.direccion}
        />
      </CardContent>
    </Card>
  );
};

export default ClienteHistorialRecogidas;


import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Droplet } from 'lucide-react';
import type { Usuario, Recogida } from '@/types';
import { useRecogidas } from '@/hooks/useRecogidas';
import formatDate from './litros-history/DateFormatter';
import LitrosHistoryTable from './litros-history/LitrosHistoryTable';
import AddHistoricalRecogidaForm from './litros-history/AddHistoricalRecogidaForm';

interface ClienteLitrosHistoryProps {
  cliente: Usuario;
}

const ClienteLitrosHistory: React.FC<ClienteLitrosHistoryProps> = ({ cliente }) => {
  const { recogidas, addRecogida } = useRecogidas();
  const [recogidasCliente, setRecogidasCliente] = useState<Recogida[]>([]);
  const [totalLitros, setTotalLitros] = useState(0);
  
  // Filtramos las recogidas del cliente y calculamos el total de litros
  useEffect(() => {
    if (cliente && recogidas.length > 0) {
      console.log('Filtrando recogidas para cliente:', cliente);
      console.log('Total recogidas disponibles:', recogidas.length);
      
      // Implementamos un filtrado más completo para capturar todas las coincidencias posibles
      const filtradas = recogidas.filter(recogida => {
        // Coincidencia directa por ID
        const directIdMatch = recogida.clienteId === cliente.id;
        
        // Coincidencia por nombre
        const nombreMatch = recogida.cliente === cliente.nombre || 
                          recogida.nombreContacto === cliente.nombre;
        
        // Coincidencia por email (si está disponible)
        const emailMatch = cliente.email && recogida.emailContacto === cliente.email;
        
        // Coincidencia por teléfono (si está disponible)
        const telefonoMatch = cliente.telefono && recogida.telefonoContacto === cliente.telefono;
        
        // Si cualquiera de estas condiciones es verdadera, incluimos esta recogida
        return directIdMatch || nombreMatch || emailMatch || telefonoMatch;
      });
      
      console.log('Recogidas filtradas para el cliente:', filtradas.length);
      
      if (filtradas.length > 0) {
        // Si hay datos, calculamos el total de litros
        const total = filtradas.reduce((sum, recogida) => {
          const litros = recogida.litrosRecogidos || 0;
          return sum + litros;
        }, 0);
        
        setRecogidasCliente(filtradas);
        setTotalLitros(total);
      } else {
        setRecogidasCliente([]);
        setTotalLitros(0);
      }
    }
  }, [cliente, recogidas]);

  const handleAddHistoricalCollection = async (date: Date, litros: number) => {
    if (!cliente) return;
    
    // Aseguramos que guardamos todos los datos necesarios para identificar fácilmente al cliente
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
      esHistorico: true,
      // Añadimos campos adicionales que podrían ser útiles para el filtrado
      telefonoContacto: cliente.telefono,
      emailContacto: cliente.email
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

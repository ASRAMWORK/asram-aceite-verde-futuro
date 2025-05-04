
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useClientes } from '@/hooks/useClientes';
import { useRecogidas } from '@/hooks/useRecogidas';
import { useRecogidaStats } from '@/hooks/recogidas/useRecogidaStats';
import ClientesRankingTotal from './ClientesRankingTotal';
import ClientesRankingMensual from './ClientesRankingMensual';
import { Award, TrendingUp } from 'lucide-react';
import { Usuario } from '@/types';

interface ClienteConLitros extends Usuario {
  litrosRecogidos: number;
  numeroRecogidas: number;
  litrosMes: number;
  numeroRecogidasMes: number;
}

const ClientesRankingView: React.FC = () => {
  const { clientes, loading: loadingClientes } = useClientes();
  const { recogidas, loading: loadingRecogidas } = useRecogidas();
  const [clientesConLitros, setClientesConLitros] = useState<ClienteConLitros[]>([]);
  const [loadingRanking, setLoadingRanking] = useState<boolean>(true);

  useEffect(() => {
    // Una vez que tengamos tanto clientes como recogidas, calculamos el ranking
    if (!loadingClientes && !loadingRecogidas && clientes.length > 0) {
      setLoadingRanking(true);
      
      const clientesExtendidos: ClienteConLitros[] = clientes.map(cliente => {
        // Filtrar las recogidas completadas del cliente
        const recogidasCliente = recogidas.filter(r => 
          r.clienteId === cliente.id && 
          (r.estadoRecogida === 'completada' || r.completada)
        );
        
        // Calcular total de litros recogidos
        const totalLitros = recogidasCliente.reduce((suma, recogida) => 
          suma + (recogida.litrosRecogidos || 0), 0);
          
        // Calcular recogidas del mes actual
        const hoy = new Date();
        const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
        
        const recogidasMes = recogidasCliente.filter(recogida => {
          const fechaRecogida = recogida.fechaRecogida || recogida.fecha;
          return fechaRecogida && new Date(fechaRecogida) >= inicioMes;
        });
        
        // Calcular litros del mes
        const litrosMes = recogidasMes.reduce((suma, recogida) => 
          suma + (recogida.litrosRecogidos || 0), 0);
        
        return {
          ...cliente,
          litrosRecogidos: totalLitros,
          numeroRecogidas: recogidasCliente.length,
          litrosMes: litrosMes,
          numeroRecogidasMes: recogidasMes.length
        };
      });
      
      setClientesConLitros(clientesExtendidos);
      setLoadingRanking(false);
    }
  }, [clientes, recogidas, loadingClientes, loadingRecogidas]);

  return (
    <div className="container px-4 py-6 max-w-7xl">
      <div className="flex flex-col gap-4">
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="text-2xl font-bold">
              <div className="flex items-center gap-2">
                <Award className="w-8 h-8 text-asram" />
                <span>Ranking de Clientes</span>
              </div>
            </CardTitle>
            <CardDescription>
              Visualiza el ranking de clientes según la cantidad de litros de aceite reciclados
            </CardDescription>
          </CardHeader>
          
          <CardContent>
            <Tabs defaultValue="total" className="w-full">
              <TabsList className="grid w-full max-w-md grid-cols-2">
                <TabsTrigger value="total" className="flex items-center gap-2">
                  <Award className="w-4 h-4" />
                  <span>Ranking Total</span>
                </TabsTrigger>
                <TabsTrigger value="mensual" className="flex items-center gap-2">
                  <TrendingUp className="w-4 h-4" />
                  <span>Ranking Mensual</span>
                </TabsTrigger>
              </TabsList>
              
              <TabsContent value="total" className="pt-4">
                <ClientesRankingTotal 
                  clientesRanking={clientesConLitros} 
                  loading={loadingRanking} 
                />
              </TabsContent>
              
              <TabsContent value="mensual" className="pt-4">
                <ClientesRankingMensual 
                  clientesRanking={clientesConLitros} 
                  loading={loadingRanking}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ClientesRankingView;

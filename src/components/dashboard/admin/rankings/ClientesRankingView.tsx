
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, MapPin, Droplet } from "lucide-react";
import { useRecogidas } from '@/hooks/useRecogidas';
import { useClientesRanking } from '@/hooks/useClientesRanking';
import GlobalRankingTable from './GlobalRankingTable';
import DistritoRankingTables from './DistritoRankingTables';
import TipoRankingTables from './TipoRankingTables';

interface ClientesRankingViewProps {
  adminId: string;
}

const ClientesRankingView: React.FC<ClientesRankingViewProps> = ({ adminId }) => {
  // Corregido: no pasar adminId a useRecogidas() ya que no acepta argumentos
  const { recogidas } = useRecogidas();
  const { clientesRanking, distritoRankings, tipoClienteRankings } = useClientesRanking(recogidas);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold">Ranking de Clientes</h2>
        <p className="text-muted-foreground">
          Clasificación de clientes por litros de aceite reciclado
        </p>
      </div>
      
      <Tabs defaultValue="total" className="space-y-4">
        <TabsList>
          <TabsTrigger value="total" className="flex items-center gap-1">
            <Trophy className="h-4 w-4" />
            Ranking Total
          </TabsTrigger>
          <TabsTrigger value="distritos" className="flex items-center gap-1">
            <MapPin className="h-4 w-4" />
            Por Distrito
          </TabsTrigger>
          <TabsTrigger value="tipos" className="flex items-center gap-1">
            <Droplet className="h-4 w-4" />
            Por Tipo
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="total">
          <Card>
            <CardHeader>
              <CardTitle>Ranking Global</CardTitle>
              <CardDescription>
                Clientes ordenados por cantidad total de litros recolectados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <GlobalRankingTable clientes={clientesRanking} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distritos">
          <Card>
            <CardHeader>
              <CardTitle>Ranking por Distritos</CardTitle>
              <CardDescription>
                Clientes agrupados por distrito y ordenados por litros recolectados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <DistritoRankingTables distritoRankings={distritoRankings} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="tipos">
          <Card>
            <CardHeader>
              <CardTitle>Ranking por Tipo de Cliente</CardTitle>
              <CardDescription>
                Clientes agrupados por tipología y ordenados por litros recolectados
              </CardDescription>
            </CardHeader>
            <CardContent>
              <TipoRankingTables tipoClienteRankings={tipoClienteRankings} />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientesRankingView;


import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  TrophyIcon, 
  DropletIcon, 
  Map, 
  Building2, 
  UserIcon 
} from 'lucide-react';
import { useClientes } from '@/hooks/useClientes';
import { useRecogidas } from '@/hooks/useRecogidas';
import { Badge } from '@/components/ui/badge';

interface ClienteRanking {
  id: string;
  nombre: string;
  direccion?: string;
  distrito?: string;
  barrio?: string;
  litrosRecogidos: number;
  posicion: number;
}

interface AdminIdProps {
  adminId: string;
}

const ClientesRankingView: React.FC<AdminIdProps> = ({ adminId }) => {
  const { clientes } = useClientes(adminId);
  const { recogidas, getRecogidasByClientId } = useRecogidas(adminId);
  const [rankingClientes, setRankingClientes] = useState<ClienteRanking[]>([]);
  const [rankingDistritos, setRankingDistritos] = useState<{distrito: string, litros: number, posicion: number}[]>([]);

  useEffect(() => {
    if (clientes.length > 0 && recogidas.length > 0) {
      // Calculate total liters collected by each client
      const clientesConLitros: ClienteRanking[] = clientes.map(cliente => {
        const recogidasCliente = getRecogidasByClientId(cliente.id);
        const litrosRecogidos = recogidasCliente.reduce(
          (total, recogida) => total + (recogida.litrosRecogidos || 0), 0
        );
        
        return {
          id: cliente.id,
          nombre: cliente.nombre || 'Cliente sin nombre',
          direccion: cliente.direccion,
          distrito: cliente.distrito,
          barrio: cliente.barrio,
          litrosRecogidos,
          posicion: 0 // Will be set after sorting
        };
      });
      
      // Sort by liters collected (descending) and assign positions
      const clientesOrdenados = [...clientesConLitros]
        .sort((a, b) => b.litrosRecogidos - a.litrosRecogidos)
        .map((cliente, index) => ({ ...cliente, posicion: index + 1 }))
        .filter(cliente => cliente.litrosRecogidos > 0); // Only show clients with collections
      
      setRankingClientes(clientesOrdenados);
      
      // Calculate liters by district
      const litrosPorDistrito: Record<string, number> = {};
      recogidas.forEach(recogida => {
        if (recogida.distrito && recogida.litrosRecogidos) {
          litrosPorDistrito[recogida.distrito] = 
            (litrosPorDistrito[recogida.distrito] || 0) + recogida.litrosRecogidos;
        }
      });
      
      // Convert to array and sort
      const distritosOrdenados = Object.entries(litrosPorDistrito)
        .map(([distrito, litros]) => ({ distrito, litros, posicion: 0 }))
        .sort((a, b) => b.litros - a.litros)
        .map((item, index) => ({ ...item, posicion: index + 1 }));
      
      setRankingDistritos(distritosOrdenados);
    }
  }, [clientes, recogidas]);

  const getPosicionBadgeColor = (posicion: number) => {
    if (posicion === 1) return "bg-yellow-100 text-yellow-800 border-yellow-300";
    if (posicion === 2) return "bg-gray-100 text-gray-800 border-gray-300";
    if (posicion === 3) return "bg-amber-100 text-amber-800 border-amber-300";
    return "bg-slate-100 text-slate-800 border-slate-300";
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold">Ranking de Clientes</h1>
        <p className="text-muted-foreground">
          Clasificación de clientes según litros de aceite recogidos
        </p>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">
            <TrophyIcon className="h-4 w-4 mr-2" />
            Ranking General
          </TabsTrigger>
          <TabsTrigger value="distritos">
            <Map className="h-4 w-4 mr-2" />
            Por Distritos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <TrophyIcon className="h-5 w-5 mr-2 text-yellow-500" />
                Top Clientes por Litros Recogidos
              </CardTitle>
              <CardDescription>
                Ranking de clientes según el total de litros de aceite recogidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rankingClientes.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay datos de recogidas para generar el ranking
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Posición</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Ubicación</TableHead>
                      <TableHead className="text-right">Litros Totales</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rankingClientes.map((cliente) => (
                      <TableRow key={cliente.id}>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`${getPosicionBadgeColor(cliente.posicion)} w-8 h-8 flex items-center justify-center rounded-full p-0 text-sm font-bold`}
                          >
                            {cliente.posicion}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <UserIcon className="h-4 w-4 mr-2 text-gray-500" />
                            {cliente.nombre}
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-col">
                            <span className="text-sm">{cliente.distrito || 'Sin distrito'}</span>
                            <span className="text-xs text-muted-foreground">{cliente.barrio}</span>
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          <div className="flex items-center justify-end">
                            <DropletIcon className="h-4 w-4 mr-1 text-blue-500" />
                            {cliente.litrosRecogidos} L
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distritos" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Building2 className="h-5 w-5 mr-2 text-blue-500" />
                Ranking por Distritos
              </CardTitle>
              <CardDescription>
                Distritos ordenados por total de litros recogidos
              </CardDescription>
            </CardHeader>
            <CardContent>
              {rankingDistritos.length === 0 ? (
                <div className="text-center py-8 text-muted-foreground">
                  No hay datos de recogidas por distritos
                </div>
              ) : (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Posición</TableHead>
                      <TableHead>Distrito</TableHead>
                      <TableHead className="text-right">Litros Totales</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rankingDistritos.map((distrito) => (
                      <TableRow key={distrito.distrito}>
                        <TableCell>
                          <Badge 
                            variant="outline" 
                            className={`${getPosicionBadgeColor(distrito.posicion)} w-8 h-8 flex items-center justify-center rounded-full p-0 text-sm font-bold`}
                          >
                            {distrito.posicion}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">
                          <div className="flex items-center">
                            <Map className="h-4 w-4 mr-2 text-gray-500" />
                            {distrito.distrito}
                          </div>
                        </TableCell>
                        <TableCell className="text-right font-medium">
                          <div className="flex items-center justify-end">
                            <DropletIcon className="h-4 w-4 mr-1 text-blue-500" />
                            {distrito.litros} L
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientesRankingView;


import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow 
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { useRecogidas } from '@/hooks/useRecogidas';
import { useUsuarios } from '@/hooks/useUsuarios';
import { Usuario } from '@/types';
import { Droplet, MapPin, Users } from 'lucide-react';

interface ClientesRankingViewProps {
  adminId?: string;
}

const ClientesRankingView: React.FC<ClientesRankingViewProps> = ({ adminId }) => {
  const { recogidas } = useRecogidas(adminId);
  const { usuarios } = useUsuarios();
  const [clientesRanking, setClientesRanking] = useState<Array<{
    cliente: Usuario;
    litrosTotales: number;
    posicion: number;
  }>>([]);
  const [rankingPorDistritos, setRankingPorDistritos] = useState<Record<string, Array<{
    cliente: Usuario;
    litrosTotales: number;
    posicion: number;
  }>>>({});
  const [distritos, setDistritos] = useState<string[]>([]);
  
  useEffect(() => {
    // Procesamos los datos para crear el ranking
    const calcularRankings = () => {
      // Obtenemos sólo los clientes (no administradores ni otros tipos)
      const clientes = usuarios.filter(u => u.role !== 'administrador' && 
                                         u.role !== 'admin_finca' &&
                                         u.role !== 'admin');
      
      // Calculamos litros totales por cliente
      const clientesConLitros = clientes.map(cliente => {
        const recogidasCliente = recogidas.filter(r => r.clienteId === cliente.id);
        const litrosTotales = recogidasCliente.reduce((sum, recogida) => {
          return sum + (recogida.litrosRecogidos || 0);
        }, 0);
        
        return {
          cliente,
          litrosTotales,
          posicion: 0 // Se asignará después
        };
      });
      
      // Ordenamos por cantidad de litros (mayor a menor)
      const clientesOrdenados = [...clientesConLitros].sort((a, b) => 
        b.litrosTotales - a.litrosTotales
      );
      
      // Asignamos posición en el ranking
      clientesOrdenados.forEach((item, index) => {
        item.posicion = index + 1;
      });
      
      // Establecemos el ranking general
      setClientesRanking(clientesOrdenados);
      
      // Calculamos rankings por distrito
      const rankingDistritos: Record<string, typeof clientesOrdenados> = {};
      const distritosUnicos: Set<string> = new Set();
      
      clientesConLitros.forEach(item => {
        if (item.cliente.distrito) {
          distritosUnicos.add(item.cliente.distrito);
          
          if (!rankingDistritos[item.cliente.distrito]) {
            rankingDistritos[item.cliente.distrito] = [];
          }
          
          rankingDistritos[item.cliente.distrito].push(item);
        }
      });
      
      // Ordenamos cada ranking de distrito
      Object.keys(rankingDistritos).forEach(distrito => {
        rankingDistritos[distrito].sort((a, b) => b.litrosTotales - a.litrosTotales);
        
        // Asignamos posición dentro del distrito
        rankingDistritos[distrito].forEach((item, index) => {
          item.posicion = index + 1;
        });
      });
      
      setRankingPorDistritos(rankingDistritos);
      setDistritos(Array.from(distritosUnicos));
    };
    
    calcularRankings();
  }, [recogidas, usuarios]);

  return (
    <div className="space-y-8">
      <div>
        <h2 className="text-3xl font-bold mb-2">Ranking de Clientes</h2>
        <p className="text-muted-foreground">
          Clasificación de clientes según la cantidad de aceite reciclado
        </p>
      </div>
      
      <Tabs defaultValue="general">
        <TabsList>
          <TabsTrigger value="general">
            <Users className="mr-2 h-4 w-4" />
            Ranking General
          </TabsTrigger>
          <TabsTrigger value="distritos">
            <MapPin className="mr-2 h-4 w-4" />
            Por Distritos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Ranking General de Clientes</CardTitle>
              <CardDescription>
                Clientes ordenados por total de litros de aceite reciclado
              </CardDescription>
            </CardHeader>
            <CardContent>
              {clientesRanking.length > 0 ? (
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead className="w-16">Pos.</TableHead>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Dirección</TableHead>
                      <TableHead>Distrito</TableHead>
                      <TableHead className="text-right">Litros</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientesRanking.map((item) => (
                      <TableRow key={item.cliente.id}>
                        <TableCell>
                          <Badge variant={item.posicion <= 3 ? "default" : "outline"}
                                 className={item.posicion === 1 ? "bg-yellow-500" : 
                                           item.posicion === 2 ? "bg-gray-400" :
                                           item.posicion === 3 ? "bg-amber-700" : ""}>
                            {item.posicion}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-medium">{item.cliente.nombre}</TableCell>
                        <TableCell>{item.cliente.direccion}</TableCell>
                        <TableCell>{item.cliente.distrito || 'N/A'}</TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center justify-end gap-1">
                            <Droplet className="h-4 w-4 text-blue-500" />
                            <span className="font-bold">{item.litrosTotales} L</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              ) : (
                <div className="text-center py-10 text-muted-foreground">
                  No hay datos de litros recogidos para generar el ranking
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="distritos" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle>Ranking por Distritos</CardTitle>
              <CardDescription>
                Clientes ordenados por litros reciclados en cada distrito
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Tabs defaultValue={distritos.length > 0 ? distritos[0] : ""}>
                <TabsList className="mb-4 flex flex-wrap">
                  {distritos.map(distrito => (
                    <TabsTrigger key={distrito} value={distrito}>
                      {distrito}
                    </TabsTrigger>
                  ))}
                </TabsList>
                
                {distritos.map(distrito => (
                  <TabsContent key={distrito} value={distrito}>
                    {rankingPorDistritos[distrito] && rankingPorDistritos[distrito].length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead className="w-16">Pos.</TableHead>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Dirección</TableHead>
                            <TableHead>Barrio</TableHead>
                            <TableHead className="text-right">Litros</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {rankingPorDistritos[distrito].map((item) => (
                            <TableRow key={item.cliente.id}>
                              <TableCell>
                                <Badge variant={item.posicion <= 3 ? "default" : "outline"}
                                      className={item.posicion === 1 ? "bg-yellow-500" : 
                                                item.posicion === 2 ? "bg-gray-400" :
                                                item.posicion === 3 ? "bg-amber-700" : ""}>
                                  {item.posicion}
                                </Badge>
                              </TableCell>
                              <TableCell className="font-medium">{item.cliente.nombre}</TableCell>
                              <TableCell>{item.cliente.direccion}</TableCell>
                              <TableCell>{item.cliente.barrio || 'N/A'}</TableCell>
                              <TableCell className="text-right">
                                <div className="flex items-center justify-end gap-1">
                                  <Droplet className="h-4 w-4 text-blue-500" />
                                  <span className="font-bold">{item.litrosTotales} L</span>
                                </div>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="text-center py-10 text-muted-foreground">
                        No hay datos para este distrito
                      </div>
                    )}
                  </TabsContent>
                ))}
              </Tabs>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientesRankingView;

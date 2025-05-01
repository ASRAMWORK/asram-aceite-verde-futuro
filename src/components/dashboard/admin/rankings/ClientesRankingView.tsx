
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Droplet, Trophy, MapPin } from "lucide-react";
import { useRecogidas } from '@/hooks/useRecogidas';

interface ClientesRankingViewProps {
  adminId: string;
}

const ClientesRankingView: React.FC<ClientesRankingViewProps> = ({ adminId }) => {
  const { recogidas } = useRecogidas(adminId);
  const [clientesRanking, setClientesRanking] = useState<any[]>([]);
  const [distritoRankings, setDistritoRankings] = useState<{[key: string]: any[]}>({});
  const [tipoClienteRankings, setTipoClienteRankings] = useState<{[key: string]: any[]}>({});
  
  useEffect(() => {
    if (!recogidas.length) return;

    // Process recogidas data to build rankings
    const clientesMap: {[key: string]: any} = {};
    
    recogidas.forEach(recogida => {
      if (!recogida.clienteId || !recogida.litrosRecogidos) return;
      
      // Initialize client if it doesn't exist in the map
      if (!clientesMap[recogida.clienteId]) {
        clientesMap[recogida.clienteId] = {
          id: recogida.clienteId,
          nombre: recogida.nombreContacto || 'Cliente sin nombre',
          distrito: recogida.distrito || 'No especificado',
          tipo: recogida.tipoResiduo || 'No especificado', // Changed from tipoCliente to tipoResiduo
          litrosTotales: 0,
          recogidasCount: 0
        };
      }
      
      // Update client stats
      clientesMap[recogida.clienteId].litrosTotales += recogida.litrosRecogidos;
      clientesMap[recogida.clienteId].recogidasCount += 1;
    });
    
    // Convert to array and sort by total liters (descending)
    const clientesArray = Object.values(clientesMap).sort((a, b) => 
      b.litrosTotales - a.litrosTotales
    );
    
    // Assign rankings
    clientesArray.forEach((cliente, index) => {
      cliente.ranking = index + 1;
    });
    
    setClientesRanking(clientesArray);
    
    // Group by distrito
    const distritos: {[key: string]: any[]} = {};
    clientesArray.forEach(cliente => {
      const distrito = cliente.distrito;
      if (!distritos[distrito]) distritos[distrito] = [];
      distritos[distrito].push(cliente);
    });
    
    // Sort each distrito ranking
    Object.keys(distritos).forEach(distrito => {
      distritos[distrito].sort((a, b) => b.litrosTotales - a.litrosTotales);
      distritos[distrito].forEach((cliente, index) => {
        cliente.rankingDistrito = index + 1;
      });
    });
    
    setDistritoRankings(distritos);
    
    // Group by tipo cliente
    const tiposCliente: {[key: string]: any[]} = {};
    clientesArray.forEach(cliente => {
      const tipo = cliente.tipo;
      if (!tiposCliente[tipo]) tiposCliente[tipo] = [];
      tiposCliente[tipo].push(cliente);
    });
    
    // Sort each tipo cliente ranking
    Object.keys(tiposCliente).forEach(tipo => {
      tiposCliente[tipo].sort((a, b) => b.litrosTotales - a.litrosTotales);
      tiposCliente[tipo].forEach((cliente, index) => {
        cliente.rankingTipo = index + 1;
      });
    });
    
    setTipoClienteRankings(tiposCliente);
    
  }, [recogidas]);

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
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-16">Rank</TableHead>
                    <TableHead>Cliente</TableHead>
                    <TableHead>Distrito</TableHead>
                    <TableHead>Tipo</TableHead>
                    <TableHead className="text-right">Litros</TableHead>
                    <TableHead className="text-right">Recogidas</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {clientesRanking.slice(0, 50).map((cliente) => (
                    <TableRow key={cliente.id}>
                      <TableCell className="font-bold">
                        {cliente.ranking <= 3 ? (
                          <Badge className={`
                            ${cliente.ranking === 1 ? "bg-yellow-500 text-black" : 
                              cliente.ranking === 2 ? "bg-gray-300 text-black" : 
                              "bg-amber-700 text-white"}
                          `}>
                            #{cliente.ranking}
                          </Badge>
                        ) : (
                          `#${cliente.ranking}`
                        )}
                      </TableCell>
                      <TableCell>{cliente.nombre}</TableCell>
                      <TableCell>{cliente.distrito}</TableCell>
                      <TableCell>
                        <Badge variant="outline">{cliente.tipo}</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end">
                          <Droplet className="h-4 w-4 mr-1 text-blue-500" />
                          {cliente.litrosTotales.toFixed(1)} L
                        </div>
                      </TableCell>
                      <TableCell className="text-right">{cliente.recogidasCount}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
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
            <CardContent className="space-y-6">
              {Object.keys(distritoRankings).sort().map(distrito => (
                <div key={distrito} className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <MapPin className="h-4 w-4" />
                    Distrito: {distrito}
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Rank</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead className="text-right">Litros</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {distritoRankings[distrito].slice(0, 10).map((cliente) => (
                        <TableRow key={cliente.id}>
                          <TableCell className="font-bold">
                            {cliente.rankingDistrito <= 3 ? (
                              <Badge className={`
                                ${cliente.rankingDistrito === 1 ? "bg-yellow-500 text-black" : 
                                  cliente.rankingDistrito === 2 ? "bg-gray-300 text-black" : 
                                  "bg-amber-700 text-white"}
                              `}>
                                #{cliente.rankingDistrito}
                              </Badge>
                            ) : (
                              `#${cliente.rankingDistrito}`
                            )}
                          </TableCell>
                          <TableCell>{cliente.nombre}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end">
                              <Droplet className="h-4 w-4 mr-1 text-blue-500" />
                              {cliente.litrosTotales.toFixed(1)} L
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
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
            <CardContent className="space-y-6">
              {Object.keys(tipoClienteRankings).sort().map(tipo => (
                <div key={tipo} className="space-y-2">
                  <h3 className="font-semibold flex items-center gap-2">
                    <Droplet className="h-4 w-4" />
                    Tipo: {tipo}
                  </h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="w-16">Rank</TableHead>
                        <TableHead>Cliente</TableHead>
                        <TableHead>Distrito</TableHead>
                        <TableHead className="text-right">Litros</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {tipoClienteRankings[tipo].slice(0, 10).map((cliente) => (
                        <TableRow key={cliente.id}>
                          <TableCell className="font-bold">
                            {cliente.rankingTipo <= 3 ? (
                              <Badge className={`
                                ${cliente.rankingTipo === 1 ? "bg-yellow-500 text-black" : 
                                  cliente.rankingTipo === 2 ? "bg-gray-300 text-black" : 
                                  "bg-amber-700 text-white"}
                              `}>
                                #{cliente.rankingTipo}
                              </Badge>
                            ) : (
                              `#${cliente.rankingTipo}`
                            )}
                          </TableCell>
                          <TableCell>{cliente.nombre}</TableCell>
                          <TableCell>{cliente.distrito}</TableCell>
                          <TableCell className="text-right">
                            <div className="flex items-center justify-end">
                              <Droplet className="h-4 w-4 mr-1 text-blue-500" />
                              {cliente.litrosTotales.toFixed(1)} L
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ClientesRankingView;

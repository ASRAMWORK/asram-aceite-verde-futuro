import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Trophy, MapPin, Droplet, Filter, ArrowDownUp } from "lucide-react";
import { useRecogidas } from '@/hooks/useRecogidas';
import { useClientesRanking } from '@/hooks/useClientesRanking';
import GlobalRankingTable from './GlobalRankingTable';
import DistritoRankingTables from './DistritoRankingTables';
import TipoRankingTables from './TipoRankingTables';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger
} from "@/components/ui/dropdown-menu";
import { toast } from "sonner";

interface ClientesRankingViewProps {
  adminId: string;
}

const ClientesRankingView: React.FC<ClientesRankingViewProps> = ({ adminId }) => {
  const { recogidas } = useRecogidas();
  const { clientesRanking, distritoRankings, tipoClienteRankings, excludeCliente } = useClientesRanking(recogidas);
  const [sortOrder, setSortOrder] = useState<"asc" | "desc">("desc");
  const [limitCount, setLimitCount] = useState<number>(10);
  
  const totalLitros = clientesRanking.reduce((sum, cliente) => sum + cliente.litrosTotales, 0);
  const totalClientes = clientesRanking.length;
  const promedioLitros = totalClientes > 0 ? totalLitros / totalClientes : 0;

  const handleDeleteCliente = async (clienteId: string) => {
    try {
      await excludeCliente(clienteId);
      toast.success("Cliente eliminado del ranking correctamente");
    } catch (error) {
      console.error("Error eliminando cliente del ranking:", error);
      toast.error("Error al eliminar el cliente del ranking");
    }
  };

  return (
    <div className="space-y-6 animate-fade-in">
      <div className="flex flex-col md:flex-row gap-4 md:items-center justify-between">
        <div>
          <h2 className="text-3xl font-bold">Ranking de Clientes</h2>
          <p className="text-muted-foreground">
            Clasificación por litros de aceite reciclado
          </p>
        </div>
        
        <div className="flex items-center gap-2 flex-wrap">
          <Card className="bg-gradient-to-r from-yellow-50 to-amber-50 border-yellow-200">
            <CardContent className="p-3">
              <div className="flex gap-2 items-center">
                <div className="bg-yellow-100 p-2 rounded-full">
                  <Trophy className="h-4 w-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs text-yellow-700">Total Clientes</p>
                  <p className="font-bold text-yellow-900">{totalClientes}</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-blue-50 to-cyan-50 border-blue-200">
            <CardContent className="p-3">
              <div className="flex gap-2 items-center">
                <div className="bg-blue-100 p-2 rounded-full">
                  <Droplet className="h-4 w-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs text-blue-700">Total Litros</p>
                  <p className="font-bold text-blue-900">{totalLitros.toFixed(1)} L</p>
                </div>
              </div>
            </CardContent>
          </Card>
          
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-3">
              <div className="flex gap-2 items-center">
                <div className="bg-green-100 p-2 rounded-full">
                  <ArrowDownUp className="h-4 w-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs text-green-700">Promedio</p>
                  <p className="font-bold text-green-900">{promedioLitros.toFixed(1)} L/cliente</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
      
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-4">
        <Tabs defaultValue="total" className="w-full">
          <TabsList className="bg-white border">
            <TabsTrigger value="total" className="flex items-center gap-1 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              <Trophy className="h-4 w-4" />
              Ranking Total
            </TabsTrigger>
            <TabsTrigger value="distritos" className="flex items-center gap-1 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              <MapPin className="h-4 w-4" />
              Por Distrito
            </TabsTrigger>
            <TabsTrigger value="tipos" className="flex items-center gap-1 data-[state=active]:bg-amber-500 data-[state=active]:text-white">
              <Droplet className="h-4 w-4" />
              Por Tipo
            </TabsTrigger>
          </TabsList>
          
          <div className="flex justify-end gap-2 mt-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <Filter className="h-4 w-4" />
                  Mostrar {limitCount}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Límite de resultados</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={limitCount.toString()} onValueChange={(value) => setLimitCount(parseInt(value))}>
                  <DropdownMenuRadioItem value="5">Top 5</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="10">Top 10</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="20">Top 20</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="50">Top 50</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="100">Top 100</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="999">Todos</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="sm" className="flex items-center gap-1">
                  <ArrowDownUp className="h-4 w-4" />
                  {sortOrder === "desc" ? "Mayor a menor" : "Menor a mayor"}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Orden de clasificación</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuRadioGroup value={sortOrder} onValueChange={(value) => setSortOrder(value as "asc" | "desc")}>
                  <DropdownMenuRadioItem value="desc">Mayor a menor litros</DropdownMenuRadioItem>
                  <DropdownMenuRadioItem value="asc">Menor a mayor litros</DropdownMenuRadioItem>
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <TabsContent value="total" className="mt-6 animate-fade-in">
            <Card className="overflow-hidden border-amber-200">
              <CardHeader className="bg-gradient-to-r from-amber-50 to-yellow-50">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-amber-500" />
                  Ranking Global de Clientes
                </CardTitle>
                <CardDescription>
                  Clientes ordenados por cantidad total de litros recolectados
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <GlobalRankingTable 
                  clientes={clientesRanking} 
                  limit={limitCount} 
                  sortOrder={sortOrder}
                  onDeleteCliente={handleDeleteCliente}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="distritos" className="mt-6 animate-fade-in">
            <Card className="overflow-hidden border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-sky-50">
                <CardTitle className="flex items-center gap-2">
                  <MapPin className="h-5 w-5 text-blue-500" />
                  Ranking por Distritos
                </CardTitle>
                <CardDescription>
                  Clientes agrupados por distrito y ordenados por litros recolectados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <DistritoRankingTables 
                  distritoRankings={distritoRankings}
                  limit={limitCount}
                  sortOrder={sortOrder}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="tipos" className="mt-6 animate-fade-in">
            <Card className="overflow-hidden border-green-200">
              <CardHeader className="bg-gradient-to-r from-green-50 to-emerald-50">
                <CardTitle className="flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-green-500" />
                  Ranking por Tipo de Cliente
                </CardTitle>
                <CardDescription>
                  Clientes agrupados por tipología y ordenados por litros recolectados
                </CardDescription>
              </CardHeader>
              <CardContent>
                <TipoRankingTables 
                  tipoClienteRankings={tipoClienteRankings}
                  limit={limitCount}
                  sortOrder={sortOrder}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
};

export default ClientesRankingView;

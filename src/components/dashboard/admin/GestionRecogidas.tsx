
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import { Plus, TrendingUp, Route as RouteIcon } from 'lucide-react';
import { useRecogidas } from '@/hooks/useRecogidas';
import { useRutas } from '@/hooks/useRutas';
import { useClientes } from '@/hooks/useClientes';

// Import the components for individual and route pickups
import RecogidasIndividuales from './recogidas/RecogidasIndividuales';
import RecogidasPorRuta from './recogidas/RecogidasPorRuta';

const GestionRecogidas = () => {
  const [activeTab, setActiveTab] = useState('individuales');
  const { recogidas, loading: loadingRecogidas } = useRecogidas();
  const { rutas, loading: loadingRutas } = useRutas();
  const { clientes, loading: loadingClientes } = useClientes();
  
  if (loadingRecogidas || loadingRutas || loadingClientes) {
    return (
      <div className="flex items-center justify-center h-64">
        <p className="text-muted-foreground">Cargando datos...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Recogidas</h2>
          <p className="text-muted-foreground">
            Administra las recogidas de aceite individuales y por ruta
          </p>
        </div>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
        <Card className="bg-white shadow-sm border-[#EE970D]/10">
          <CardHeader className="pb-3 bg-gradient-to-r from-[#EE970D]/5 to-transparent">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-[#EE970D]" />
              Recogidas Totales
            </CardTitle>
            <CardDescription>Estadísticas generales</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-[#EE970D]">
                  {recogidas.filter(r => !r.completada).length}
                </p>
                <p className="text-sm text-gray-500">Pendientes</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">
                  {recogidas.filter(r => r.completada).length}
                </p>
                <p className="text-sm text-gray-500">Completadas</p>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-white shadow-sm border-[#EE970D]/10">
          <CardHeader className="pb-3 bg-gradient-to-r from-[#EE970D]/5 to-transparent">
            <CardTitle className="text-lg font-medium flex items-center gap-2">
              <RouteIcon className="h-5 w-5 text-[#EE970D]" />
              Rutas Activas
            </CardTitle>
            <CardDescription>Rutas por distrito</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4 text-center">
              <div>
                <p className="text-3xl font-bold text-[#EE970D]">
                  {rutas.filter(r => !r.completada).length}
                </p>
                <p className="text-sm text-gray-500">Pendientes</p>
              </div>
              <div>
                <p className="text-3xl font-bold text-green-600">
                  {rutas.filter(r => r.completada).length}
                </p>
                <p className="text-sm text-gray-500">Completadas</p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="individuales" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2 mb-6">
          <TabsTrigger 
            value="individuales" 
            className="data-[state=active]:bg-[#EE970D] data-[state=active]:text-white"
          >
            Recogidas Individuales
          </TabsTrigger>
          <TabsTrigger 
            value="rutas" 
            className="data-[state=active]:bg-[#EE970D] data-[state=active]:text-white"
          >
            Recogidas por Ruta
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="individuales" className="mt-0">
          <RecogidasIndividuales clientes={clientes} />
        </TabsContent>
        
        <TabsContent value="rutas" className="mt-0">
          <RecogidasPorRuta rutas={rutas} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GestionRecogidas;


import React from 'react';
import { useComunidadesVecinos } from '@/hooks/useComunidadesVecinos';
import MisComunidades from './MisComunidades';
import GestionarComunidad from './GestionarComunidad';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdministradorDashboardContent = () => {
  const comunidadesHook = useComunidadesVecinos();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue="comunidades">
        <TabsList>
          <TabsTrigger value="comunidades">Mis Comunidades</TabsTrigger>
          <TabsTrigger value="gestionar">Gestionar Comunidad</TabsTrigger>
        </TabsList>
        <TabsContent value="comunidades">
          <MisComunidades />
        </TabsContent>
        <TabsContent value="gestionar">
          <GestionarComunidad />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdministradorDashboardContent;

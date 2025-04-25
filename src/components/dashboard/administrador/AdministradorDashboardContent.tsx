
import React from 'react';
import { useComunidadesVecinos } from '@/hooks/useComunidadesVecinos';
import MisComunidades from './MisComunidades';
import GestionarComunidad from './GestionarComunidad';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

interface AdministradorDashboardContentProps {
  activeTab?: string;
}

const AdministradorDashboardContent: React.FC<AdministradorDashboardContentProps> = ({ activeTab = 'comunidades' }) => {
  const comunidadesHook = useComunidadesVecinos();
  
  return (
    <div className="container mx-auto px-4 py-8">
      <Tabs defaultValue={activeTab}>
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

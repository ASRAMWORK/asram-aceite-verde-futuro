
import React from 'react';
import { useComunidadesVecinos } from '@/hooks/useComunidadesVecinos';
import MisComunidades from './MisComunidades';
import GestionarComunidad from './GestionarComunidad';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AdministradorPanel from './AdministradorPanel';
import AdministradorClientes from './clientes/AdministradorClientes';
import AdministradorRecogidas from './recogidas/AdministradorRecogidas';
import AdministradorEstadisticas from './estadisticas/AdministradorEstadisticas';
import AdministradorPerfil from './perfil/AdministradorPerfil';

interface AdministradorDashboardContentProps {
  activeTab?: string;
}

const AdministradorDashboardContent: React.FC<AdministradorDashboardContentProps> = ({ activeTab = 'home' }) => {
  // Based on the activeTab from the sidebar, render the appropriate component
  switch (activeTab) {
    case 'home':
      return <AdministradorPanel />;
    case 'comunidades':
      return <MisComunidades />;
    case 'gestionar':
      return <GestionarComunidad />;
    case 'clientes':
      return <AdministradorClientes />;
    case 'recogidas':
      return <AdministradorRecogidas />;
    case 'estadisticas':
      return <AdministradorEstadisticas />;
    case 'perfil':
      return <AdministradorPerfil />;
    default:
      return (
        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue={activeTab === 'dashboard' ? 'comunidades' : activeTab}>
            <TabsList>
              <TabsTrigger value="comunidades">Mis Comunidades</TabsTrigger>
              <TabsTrigger value="gestionar">Gestionar Comunidad</TabsTrigger>
              <TabsTrigger value="clientes">Gestión de Clientes</TabsTrigger>
              <TabsTrigger value="recogidas">Recogidas</TabsTrigger>
            </TabsList>
            <TabsContent value="comunidades">
              <MisComunidades />
            </TabsContent>
            <TabsContent value="gestionar">
              <GestionarComunidad />
            </TabsContent>
            <TabsContent value="clientes">
              <AdministradorClientes />
            </TabsContent>
            <TabsContent value="recogidas">
              <AdministradorRecogidas />
            </TabsContent>
          </Tabs>
        </div>
      );
  }
};

export default AdministradorDashboardContent;

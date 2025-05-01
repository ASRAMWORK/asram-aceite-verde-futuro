
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
import InformesPanel from './informes/InformesPanel';
import GestionComunidades from './comunidades/GestionComunidades';
import ReunionesView from '../admin/reuniones/ReunionesView';
import { useUserProfile } from '@/hooks/useUserProfile';

// Common interface for components that require adminId
interface AdminIdProps {
  adminId?: string;
}

// Define interfaces for each component that needs adminId prop
interface AdministradorPanelProps extends AdminIdProps {}
interface MisComunidadesProps extends AdminIdProps {}
interface GestionarComunidadProps extends AdminIdProps {}
interface AdministradorClientesProps extends AdminIdProps {}
interface AdministradorRecogidasProps extends AdminIdProps {}
interface AdministradorEstadisticasProps extends AdminIdProps {}
interface InformesPanelProps extends AdminIdProps {}
interface AdministradorPerfilProps extends AdminIdProps {}
interface GestionComunidadesProps extends AdminIdProps {}
interface ReunionesViewProps extends AdminIdProps {}

// Create wrapper components that accept and pass down adminId
const PanelWrapper: React.FC<AdminIdProps> = ({ adminId }) => {
  return <AdministradorPanel adminId={adminId} />;
};

const RecogidasWrapper: React.FC<AdminIdProps> = ({ adminId }) => {
  return <AdministradorRecogidas adminId={adminId} />;
};

const EstadisticasWrapper: React.FC<AdminIdProps> = ({ adminId }) => {
  return <AdministradorEstadisticas adminId={adminId} />;
};

const InformesPanelWrapper: React.FC<AdminIdProps> = ({ adminId }) => {
  return <InformesPanel adminId={adminId} />;
};

const GestionComunidadesWrapper: React.FC<AdminIdProps> = ({ adminId }) => {
  return <GestionComunidades adminId={adminId} />;
};

const ReunionesWrapper: React.FC<AdminIdProps> = ({ adminId }) => {
  return <ReunionesView adminId={adminId} />;
};

interface AdministradorDashboardContentProps {
  activeTab?: string;
  adminId?: string;
}

const AdministradorDashboardContent: React.FC<AdministradorDashboardContentProps> = ({ 
  activeTab = 'home',
  adminId 
}) => {
  const { profile } = useUserProfile();
  // Usar el adminId proporcionado o el del perfil
  const efectiveAdminId = adminId || profile?.id;

  // Verificar si tenemos un ID válido
  if (!efectiveAdminId) {
    return (
      <div className="flex justify-center items-center h-64 text-red-600">
        <p>Error: No se pudo determinar el ID del administrador. Por favor, inicia sesión nuevamente.</p>
      </div>
    );
  }

  // Based on the activeTab from the sidebar, render the appropriate component
  switch (activeTab) {
    case 'home':
      return <PanelWrapper adminId={efectiveAdminId} />; 
    case 'comunidades':
      return <MisComunidades adminId={efectiveAdminId} />;
    case 'gestionar':
      return <GestionarComunidad adminId={efectiveAdminId} />;
    case 'clientes':
      return <AdministradorClientes adminId={efectiveAdminId} />;
    case 'recogidas':
      return <RecogidasWrapper adminId={efectiveAdminId} />;
    case 'estadisticas': 
      return <EstadisticasWrapper adminId={efectiveAdminId} />;
    case 'informes':
      return <InformesPanelWrapper adminId={efectiveAdminId} />;
    case 'perfil':
      return <AdministradorPerfil adminId={efectiveAdminId} />;
    case 'gestionComunidades':
      return <GestionComunidadesWrapper adminId={efectiveAdminId} />;
    default:
      return (
        <div className="container mx-auto px-4 py-8">
          <Tabs defaultValue={activeTab === 'dashboard' ? 'comunidades' : activeTab}>
            <TabsList>
              <TabsTrigger value="comunidades">Mis Comunidades</TabsTrigger>
              <TabsTrigger value="gestionar">Gestionar Comunidad</TabsTrigger>
              <TabsTrigger value="informes">Informes y Contratos</TabsTrigger>
              <TabsTrigger value="recogidas">Recogidas</TabsTrigger>
            </TabsList>
            <TabsContent value="comunidades">
              <MisComunidades adminId={efectiveAdminId} />
            </TabsContent>
            <TabsContent value="gestionar">
              <GestionarComunidad adminId={efectiveAdminId} />
            </TabsContent>
            <TabsContent value="informes">
              <InformesPanelWrapper adminId={efectiveAdminId} />
            </TabsContent>
            <TabsContent value="recogidas">
              <RecogidasWrapper adminId={efectiveAdminId} />
            </TabsContent>
          </Tabs>
        </div>
      );
  }
};

export default AdministradorDashboardContent;

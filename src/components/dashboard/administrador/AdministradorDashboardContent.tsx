
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
  adminId: string;
}

// Create wrapper components that accept and pass down adminId only when needed
// These components don't need adminId
const PanelWrapper: React.FC = () => {
  return <AdministradorPanel />;
};

const PerfilWrapper: React.FC = () => {
  return <AdministradorPerfil />;
};

// These components need adminId
const MisComunidadesWrapper: React.FC<AdminIdProps> = ({ adminId }) => {
  return <MisComunidades adminId={adminId} />;
};

const GestionarComunidadWrapper: React.FC<AdminIdProps> = ({ adminId }) => {
  return <GestionarComunidad adminId={adminId} />;
};

const ClientesWrapper: React.FC<AdminIdProps> = ({ adminId }) => {
  if (!adminId) return null;
  return <AdministradorClientes adminId={adminId} />;
};

const RecogidasWrapper: React.FC<AdminIdProps> = ({ adminId }) => {
  if (!adminId) return null;
  return <AdministradorRecogidas adminId={adminId} />;
};

const EstadisticasWrapper: React.FC<AdminIdProps> = ({ adminId }) => {
  if (!adminId) return null;
  return <AdministradorEstadisticas adminId={adminId} />;
};

const InformesPanelWrapper: React.FC<AdminIdProps> = ({ adminId }) => {
  if (!adminId) return null;
  return <InformesPanel adminId={adminId} />;
};

const GestionComunidadesWrapper: React.FC<AdminIdProps> = ({ adminId }) => {
  if (!adminId) return null;
  return <GestionComunidades adminId={adminId} />;
};

const ReunionesWrapper: React.FC<AdminIdProps> = ({ adminId }) => {
  if (!adminId) return null;
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
      return <PanelWrapper />; // Don't pass adminId to components that don't need it
    case 'comunidades':
      return <MisComunidadesWrapper adminId={efectiveAdminId} />;
    case 'gestionar':
      return <GestionarComunidadWrapper adminId={efectiveAdminId} />;
    case 'clientes':
      return <ClientesWrapper adminId={efectiveAdminId} />;
    case 'recogidas':
      return <RecogidasWrapper adminId={efectiveAdminId} />;
    case 'estadisticas': 
      return <EstadisticasWrapper adminId={efectiveAdminId} />;
    case 'informes':
      return <InformesPanelWrapper adminId={efectiveAdminId} />;
    case 'perfil':
      return <PerfilWrapper />; // Don't pass adminId to components that don't need it
    case 'gestionComunidades':
      return <GestionComunidadesWrapper adminId={efectiveAdminId} />;
    case 'reuniones':
      return <ReunionesWrapper adminId={efectiveAdminId} />;
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
              <MisComunidadesWrapper adminId={efectiveAdminId} />
            </TabsContent>
            <TabsContent value="gestionar">
              <GestionarComunidadWrapper adminId={efectiveAdminId} />
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

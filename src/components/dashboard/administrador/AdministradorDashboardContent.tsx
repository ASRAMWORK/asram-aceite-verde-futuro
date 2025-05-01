
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

// Definimos interfaces para los componentes que no tienen adminId en sus props
interface AdminIdProps {
  adminId: string;
}

// Creamos componentes wrapper que aceptan adminId pero no lo utilizan
// Estos componentes no necesitan recibir adminId, así que lo extraemos antes de pasar el resto de props
const EstadisticasWrapper = ({ adminId, ...props }: AdminIdProps & React.ComponentProps<typeof AdministradorEstadisticas>) => {
  return <AdministradorEstadisticas {...props} />;
};

const ReunionesWrapper = ({ adminId, ...props }: AdminIdProps & React.ComponentProps<typeof ReunionesView>) => {
  return <ReunionesView {...props} />;
};

interface AdministradorDashboardContentProps {
  activeTab?: string;
  adminId?: string; // Añadimos la propiedad para pasar el ID
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
      return <AdministradorPanel />; // No adminId prop for this component
    case 'comunidades':
      return <MisComunidades adminId={efectiveAdminId} />;
    case 'gestionar':
      return <GestionarComunidad adminId={efectiveAdminId} />;
    case 'clientes':
      return <AdministradorClientes adminId={efectiveAdminId} />;
    case 'recogidas':
      return <AdministradorRecogidas adminId={efectiveAdminId} />;
    case 'estadisticas': 
      // Usamos el wrapper que acepta adminId
      return <EstadisticasWrapper adminId={efectiveAdminId} />;
    case 'informes':
      return <InformesPanel adminId={efectiveAdminId} />;
    case 'perfil':
      return <AdministradorPerfil adminId={efectiveAdminId} />;
    case 'gestionComunidades':
      return <GestionComunidades adminId={efectiveAdminId} />;
    case 'reuniones':
      // Usamos el wrapper que acepta adminId
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
              <TabsTrigger value="reuniones">Reuniones</TabsTrigger>
            </TabsList>
            <TabsContent value="comunidades">
              <MisComunidades adminId={efectiveAdminId} />
            </TabsContent>
            <TabsContent value="gestionar">
              <GestionarComunidad adminId={efectiveAdminId} />
            </TabsContent>
            <TabsContent value="informes">
              <InformesPanel adminId={efectiveAdminId} />
            </TabsContent>
            <TabsContent value="recogidas">
              <AdministradorRecogidas adminId={efectiveAdminId} />
            </TabsContent>
            <TabsContent value="reuniones">
              <ReunionesWrapper adminId={efectiveAdminId} />
            </TabsContent>
          </Tabs>
        </div>
      );
  }
};

export default AdministradorDashboardContent;

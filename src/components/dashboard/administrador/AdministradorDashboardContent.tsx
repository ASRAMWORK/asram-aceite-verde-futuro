
import React from 'react';
import { useUserProfile } from '@/hooks/useUserProfile';
import AdministradorDashboardOverview from './AdministradorDashboardOverview';
import MisComunidades from './MisComunidades';
import GestionarComunidad from './GestionarComunidad';
import InformesPanel from './informes/InformesPanel';
import PanelControl from './panel/PanelControl';
import AdministradorRecogidas from './recogidas/AdministradorRecogidas';
import AdministradorPerfil from './perfil/AdministradorPerfil';
import AdministradorEstadisticas from './estadisticas/AdministradorEstadisticas';
import AdministradorClientes from './clientes/AdministradorClientes';
import ClienteRankingWrapper from '../admin/rankings/ClienteRankingWrapper';

interface AdministradorDashboardContentProps {
  activeTab: string;
}

const AdministradorDashboardContent: React.FC<AdministradorDashboardContentProps> = ({ activeTab }) => {
  const { profile } = useUserProfile();
  
  // Verificar si hay un ID de perfil disponible
  if (!profile || !profile.id) {
    return (
      <div className="p-4 bg-yellow-50 border border-yellow-200 rounded-md">
        <p className="text-yellow-800">
          Cargando datos del perfil... Si este mensaje persiste, contacte al soporte técnico.
        </p>
      </div>
    );
  }
  
  return (
    <div>
      {activeTab === 'home' && <AdministradorDashboardOverview />}
      {activeTab === 'comunidades' && <MisComunidades adminId={profile.id} />}
      {activeTab === 'gestionar' && <GestionarComunidad adminId={profile.id} />}
      {activeTab === 'informes' && <InformesPanel adminId={profile.id} />}
      {activeTab === 'estadisticas' && <AdministradorEstadisticas adminId={profile.id} />}
      {activeTab === 'clientes' && <AdministradorClientes adminId={profile.id} />}
      {activeTab === 'recogidas' && <AdministradorRecogidas adminId={profile.id} />}
      {activeTab === 'perfil' && <AdministradorPerfil userId={profile.id} />}
      {activeTab === 'ranking' && <ClienteRankingWrapper adminId={profile.id} />}
    </div>
  );
};

export default AdministradorDashboardContent;

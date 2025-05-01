
import React from "react";
import AdministradorDashboardOverview from "./AdministradorDashboardOverview";
import MisComunidades from "./MisComunidades";
import GestionarComunidad from "./GestionarComunidad";
import InformesPanel from "./informes/InformesPanel";
import AdministradorEstadisticas from "./estadisticas/AdministradorEstadisticas";
import AdministradorPerfil from "./perfil/AdministradorPerfil";
import ClienteRankingWrapper from "../admin/rankings/ClienteRankingWrapper";
import { useUserProfile } from "@/hooks/useUserProfile";

interface AdministradorDashboardContentProps {
  activeTab: string;
}

const AdministradorDashboardContent: React.FC<AdministradorDashboardContentProps> = ({ activeTab }) => {
  const { profile } = useUserProfile();
  const adminId = profile?.id || '';

  // Function to render the active tab content
  const renderActiveTabContent = () => {
    switch (activeTab) {
      case "home":
        return <AdministradorDashboardOverview />;
      
      case "comunidades":
        return <MisComunidades />;
      
      case "gestionar":
        return <GestionarComunidad />;
      
      case "informes":
        return <InformesPanel />;
      
      case "estadisticas":
        return <AdministradorEstadisticas />;
      
      case "ranking":
        return <ClienteRankingWrapper adminId={adminId} />;
      
      case "perfil":
        return <AdministradorPerfil />;
      
      default:
        return <AdministradorDashboardOverview />;
    }
  };

  return (
    <div className="space-y-6">
      {renderActiveTabContent()}
    </div>
  );
};

export default AdministradorDashboardContent;

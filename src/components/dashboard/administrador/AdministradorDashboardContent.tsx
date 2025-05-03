
import React from "react";
import AdministradorDashboardOverview from "./AdministradorDashboardOverview";
import MisComunidades from "./MisComunidades";
import GestionarComunidad from "./GestionarComunidad";
import InformesPanel from "./informes/InformesPanel";
import AdministradorEstadisticas from "./estadisticas/AdministradorEstadisticas";
import AdministradorPerfil from "./perfil/AdministradorPerfil";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useIsMobile } from "@/hooks/useIsMobile";

interface AdministradorDashboardContentProps {
  activeTab: string;
}

const AdministradorDashboardContent: React.FC<AdministradorDashboardContentProps> = ({ activeTab }) => {
  const { profile } = useUserProfile();
  const adminId = profile?.id || '';
  const isMobile = useIsMobile();
  
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
      
      case "perfil":
        return <AdministradorPerfil />;
      
      default:
        return <AdministradorDashboardOverview />;
    }
  };

  return (
    <div className={`space-y-${isMobile ? '4' : '6'} w-full overflow-x-hidden`}>
      {renderActiveTabContent()}
    </div>
  );
};

export default AdministradorDashboardContent;

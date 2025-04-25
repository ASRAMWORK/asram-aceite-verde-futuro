
import React, { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Building, Activity, Home, BookOpen, School, MapPin, User, Plus } from "lucide-react";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useComunidadesVecinos } from "@/hooks/useComunidadesVecinos";
import HomeView from "../user/home/HomeView";
import RecursosView from "../user/recursos/RecursosView";
import AlianzaVerdeView from "../user/alianza/AlianzaVerdeView";
import ApadrinaCalleView from "../user/apadrina/ApadrinaCalleView";
import PuntosVerdesView from "../user/puntos/PuntosVerdesView";
import MisComunidades from "./MisComunidades";
import GestionarComunidad from "./GestionarComunidad";
import AdministradorDashboardOverview from "./AdministradorDashboardOverview";

interface AdministradorDashboardContentProps {
  activeTab: string;
}

const AdministradorDashboardContent: React.FC<AdministradorDashboardContentProps> = ({ 
  activeTab = "home" 
}) => {
  const [currentTab, setCurrentTab] = useState(activeTab);
  const { profile } = useUserProfile();
  const { comunidades, loading } = useComunidadesVecinos(profile?.id);

  React.useEffect(() => {
    setCurrentTab(activeTab);
  }, [activeTab]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight text-purple-800">
          Panel de Administrador de Fincas
        </h2>
        <p className="text-muted-foreground">
          Gestiona tus comunidades de vecinos y servicios de ASRAM
        </p>
      </div>

      <Tabs defaultValue={currentTab} value={currentTab} onValueChange={setCurrentTab} className="space-y-6">
        <TabsList className="grid grid-cols-4 md:grid-cols-8 h-auto p-1">
          <TabsTrigger value="home" className="flex items-center gap-2 py-2">
            <Home className="h-4 w-4" />
            <span className="hidden md:inline">Inicio</span>
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2 py-2">
            <Activity className="h-4 w-4" />
            <span className="hidden md:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="comunidades" className="flex items-center gap-2 py-2">
            <Building className="h-4 w-4" />
            <span className="hidden md:inline">Comunidades</span>
          </TabsTrigger>
          <TabsTrigger value="gestionar" className="flex items-center gap-2 py-2">
            <Plus className="h-4 w-4" />
            <span className="hidden md:inline">Añadir</span>
          </TabsTrigger>
          <TabsTrigger value="recursos" className="flex items-center gap-2 py-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden md:inline">Recursos</span>
          </TabsTrigger>
          <TabsTrigger value="alianza-verde" className="flex items-center gap-2 py-2">
            <School className="h-4 w-4" />
            <span className="hidden md:inline">Alianza</span>
          </TabsTrigger>
          <TabsTrigger value="apadrina" className="flex items-center gap-2 py-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden md:inline">Apadrina</span>
          </TabsTrigger>
          <TabsTrigger value="puntos-verdes" className="flex items-center gap-2 py-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Puntos</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="home" className="animate-fade-in">
          <HomeView />
        </TabsContent>
        
        <TabsContent value="dashboard" className="animate-fade-in">
          <AdministradorDashboardOverview comunidades={comunidades} loading={loading} />
        </TabsContent>
        
        <TabsContent value="comunidades" className="animate-fade-in">
          <MisComunidades />
        </TabsContent>
        
        <TabsContent value="gestionar" className="animate-fade-in">
          <GestionarComunidad />
        </TabsContent>
        
        <TabsContent value="recursos" className="animate-fade-in">
          <RecursosView />
        </TabsContent>
        
        <TabsContent value="alianza-verde" className="animate-fade-in">
          <AlianzaVerdeView />
        </TabsContent>
        
        <TabsContent value="apadrina" className="animate-fade-in">
          <ApadrinaCalleView />
        </TabsContent>
        
        <TabsContent value="puntos-verdes" className="animate-fade-in">
          <PuntosVerdesView />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdministradorDashboardContent;

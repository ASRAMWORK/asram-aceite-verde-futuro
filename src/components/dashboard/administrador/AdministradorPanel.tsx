
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserProfile } from '@/hooks/useUserProfile';
import PanelControl from './panel/PanelControl';
import GestionComunidades from './comunidades/GestionComunidades';
import InformesPanel from './informes/InformesPanel';

const AdministradorPanel = () => {
  const [activeTab, setActiveTab] = useState("panel");
  const { profile, loading } = useUserProfile();
  
  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p>Cargando panel de administrador...</p>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-[#ee970d]">Panel de Administrador de Fincas</h1>
        <p className="text-gray-600">
          Bienvenido, {profile?.nombreAdministracion || profile?.nombre || 'Administrador'}
          {profile?.id && <span className="text-xs text-gray-400 ml-2">(ID: {profile.id})</span>}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6 bg-white border">
          <TabsTrigger 
            value="panel"
            className="data-[state=active]:bg-[#ee970d] data-[state=active]:text-white"
          >
            Panel de Control
          </TabsTrigger>
          <TabsTrigger 
            value="comunidades"
            className="data-[state=active]:bg-[#ee970d] data-[state=active]:text-white"
          >
            Gestión de Comunidades
          </TabsTrigger>
          <TabsTrigger 
            value="informes"
            className="data-[state=active]:bg-[#ee970d] data-[state=active]:text-white"
          >
            Informes
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="panel" className="mt-6">
          <PanelControl adminId={profile?.id} />
        </TabsContent>
        
        <TabsContent value="comunidades" className="mt-6">
          <GestionComunidades adminId={profile?.id} />
        </TabsContent>
        
        <TabsContent value="informes" className="mt-6">
          <InformesPanel adminId={profile?.id} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdministradorPanel;

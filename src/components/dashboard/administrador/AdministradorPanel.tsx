
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useUserProfile } from '@/hooks/useUserProfile';
import MisComunidades from './MisComunidades';
import GestionarComunidad from './GestionarComunidad';
import AdministradorClientes from './clientes/AdministradorClientes';
import AdministradorRecogidas from './recogidas/AdministradorRecogidas';
import AdministradorEstadisticas from './estadisticas/AdministradorEstadisticas';
import AdministradorPerfil from './perfil/AdministradorPerfil';

/**
 * Panel principal para Administradores de Fincas
 * Integra todos los módulos solicitados en la especificación
 */
const AdministradorPanel = () => {
  const [activeTab, setActiveTab] = useState("comunidades");
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
        <h1 className="text-3xl font-bold text-purple-600">Panel de Administrador de Fincas</h1>
        <p className="text-gray-600">
          Bienvenido, {profile?.nombreAdministracion || 'Administrador'}
        </p>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="mb-6">
          <TabsTrigger value="comunidades">Mis Comunidades</TabsTrigger>
          <TabsTrigger value="nueva-comunidad">Nueva Comunidad</TabsTrigger>
          <TabsTrigger value="clientes">Gestión de Clientes</TabsTrigger>
          <TabsTrigger value="recogidas">Recogidas</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
          <TabsTrigger value="perfil">Mi Perfil</TabsTrigger>
        </TabsList>
        
        <TabsContent value="comunidades" className="mt-6">
          <MisComunidades />
        </TabsContent>
        
        <TabsContent value="nueva-comunidad" className="mt-6">
          <GestionarComunidad />
        </TabsContent>
        
        <TabsContent value="clientes" className="mt-6">
          <AdministradorClientes />
        </TabsContent>
        
        <TabsContent value="recogidas" className="mt-6">
          <AdministradorRecogidas />
        </TabsContent>
        
        <TabsContent value="estadisticas" className="mt-6">
          <AdministradorEstadisticas />
        </TabsContent>
        
        <TabsContent value="perfil" className="mt-6">
          <AdministradorPerfil />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdministradorPanel;


import React from 'react';
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger
} from "@/components/ui/tabs";
import CodigoReferidoView from "./CodigoReferidoView";
import ResumenActividadView from "./ResumenActividadView";
import ClientesCaptadosView from "./ClientesCaptadosView";
import ComisionesHistorialView from "./ComisionesHistorialView";
import MetodoPagoView from "./MetodoPagoView";
import { useUserProfile } from '@/hooks/useUserProfile';

const GestionComercialDashboard = () => {
  const { profile, loading } = useUserProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-[#ee970d] rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-lg font-medium">Cargando panel de comercial...</p>
        </div>
      </div>
    );
  }

  if (!profile) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-lg font-medium text-red-500">No se encontró información del perfil</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-4 py-8 max-w-7xl">
      <h1 className="text-3xl font-bold mb-8">Panel de Comercial</h1>
      
      <Tabs defaultValue="codigo" className="space-y-8">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="codigo">Código Referido</TabsTrigger>
          <TabsTrigger value="resumen">Resumen Actividad</TabsTrigger>
          <TabsTrigger value="clientes">Clientes Captados</TabsTrigger>
          <TabsTrigger value="comisiones">Comisiones</TabsTrigger>
          <TabsTrigger value="pagos">Método de Cobro</TabsTrigger>
        </TabsList>
        
        <TabsContent value="codigo">
          <CodigoReferidoView />
        </TabsContent>
        
        <TabsContent value="resumen">
          <ResumenActividadView />
        </TabsContent>
        
        <TabsContent value="clientes">
          <ClientesCaptadosView />
        </TabsContent>
        
        <TabsContent value="comisiones">
          <ComisionesHistorialView />
        </TabsContent>
        
        <TabsContent value="pagos">
          <MetodoPagoView />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GestionComercialDashboard;

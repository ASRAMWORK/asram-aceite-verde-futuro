
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GestionComercialesView from './GestionComercialesView';
import ComercialesDetalle from './ComercialesDetalle';

const ComercialView = () => {
  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Gestión de Comerciales</h2>
      
      <Tabs defaultValue="gestion" className="space-y-6">
        <TabsList className="bg-white">
          <TabsTrigger value="gestion">Gestión</TabsTrigger>
          <TabsTrigger value="detalle">Detalle Comunidades</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gestion" className="space-y-6">
          <GestionComercialesView />
        </TabsContent>
        
        <TabsContent value="detalle" className="space-y-6">
          <ComercialesDetalle />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComercialView;


import React, { useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useUserProfile } from "@/hooks/useUserProfile";

import CodigoReferidoView from "./CodigoReferidoView";
import ResumenActividadView from "./ResumenActividadView";
import ClientesCaptadosView from "./ClientesCaptadosView";
import ComisionesHistorialView from "./ComisionesHistorialView";
import MetodoPagoView from "./MetodoPagoView";

const ComercialDashboard = () => {
  const { profile, loading } = useUserProfile();

  if (loading) {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <div className="w-12 h-12 border-4 border-t-asram rounded-full animate-spin mx-auto mb-4"></div>
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

  if (profile.role !== "comercial") {
    return (
      <div className="flex items-center justify-center h-96">
        <div className="text-center">
          <p className="text-lg font-medium text-red-500">Acceso no autorizado</p>
          <p className="text-gray-500">Este panel es exclusivo para comerciales registrados</p>
        </div>
      </div>
    );
  }

  if (!profile.aprobado) {
    return (
      <Card className="mx-auto max-w-lg my-12">
        <CardHeader>
          <CardTitle className="text-center text-2xl">Perfil en revisión</CardTitle>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-lg mb-4">Tu perfil de comercial está pendiente de aprobación.</p>
          <p className="text-gray-500">Nos pondremos en contacto contigo a la mayor brevedad posible para activar tu cuenta.</p>
        </CardContent>
      </Card>
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

export default ComercialDashboard;

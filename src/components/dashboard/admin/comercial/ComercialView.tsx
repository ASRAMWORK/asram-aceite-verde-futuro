
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GestionComercialesView from './GestionComercialesView';
import ComercialesDetalle from './ComercialesDetalle';
import { useIsMobile } from '@/hooks/useIsMobile';
import { mobileHeadingSize, mobileTextSize } from '@/utils/mobileStyles';

const ComercialView = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-4 md:space-y-6">
      <h2 className={`${mobileHeadingSize()} font-bold tracking-tight`}>Gestión de Comerciales</h2>
      
      <Tabs defaultValue="gestion" className="space-y-4 md:space-y-6">
        <TabsList className="bg-white w-full">
          <TabsTrigger value="gestion" className={isMobile ? "text-xs py-2" : ""}>Gestión</TabsTrigger>
          <TabsTrigger value="detalle" className={isMobile ? "text-xs py-2" : ""}>Detalle Comunidades</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gestion" className="space-y-4 md:space-y-6">
          <GestionComercialesView />
        </TabsContent>
        
        <TabsContent value="detalle" className="space-y-4 md:space-y-6">
          <ComercialesDetalle />
        </TabsContent>
      </Tabs>
      
      {/* Add spacing at the bottom for mobile to prevent content being hidden behind bottom navigation */}
      {isMobile && <div className="h-16"></div>}
    </div>
  );
};

export default ComercialView;

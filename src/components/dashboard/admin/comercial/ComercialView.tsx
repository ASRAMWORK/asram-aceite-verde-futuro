
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GestionComercialesView from './GestionComercialesView';
import ComercialesDetalle from './ComercialesDetalle';
import { useIsMobile } from '@/hooks/useIsMobile';
import { mobileHeadingSize, mobileTextSize, mobileFullGrid } from '@/utils/mobileStyles';

const ComercialView = () => {
  const isMobile = useIsMobile();
  
  return (
    <div className="space-y-4 md:space-y-6 w-full overflow-x-hidden">
      <h2 className={`${mobileHeadingSize()} font-bold tracking-tight`}>Gestión de Comerciales</h2>
      
      <Tabs defaultValue="gestion" className="space-y-4 md:space-y-6 w-full">
        <TabsList className="bg-white w-full overflow-x-auto flex no-scrollbar">
          <TabsTrigger value="gestion" className={isMobile ? "text-xs py-2 flex-1" : ""}>Gestión</TabsTrigger>
          <TabsTrigger value="detalle" className={isMobile ? "text-xs py-2 flex-1" : ""}>Detalle</TabsTrigger>
        </TabsList>
        
        <TabsContent value="gestion" className="space-y-4 md:space-y-6 w-full">
          <GestionComercialesView />
        </TabsContent>
        
        <TabsContent value="detalle" className="space-y-4 md:space-y-6 w-full">
          <ComercialesDetalle />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ComercialView;

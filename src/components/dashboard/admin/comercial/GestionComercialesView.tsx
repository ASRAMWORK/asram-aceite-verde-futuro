
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus, User } from "lucide-react";
import ComercialList from "./ComercialList";
import PreciosComisionesView from "./PreciosComisionesView";
import ReferidosView from "./ReferidosView";
import ReportesComercialesView from "./ReportesComercialesView";
import PagosComercialesView from "./PagosComercialesView";
import ComercialForm from "./ComercialForm";
import { useIsMobile } from "@/hooks/useIsMobile";
import { mobileTouchTarget } from "@/utils/mobileStyles";

const GestionComercialesView = () => {
  const [formOpen, setFormOpen] = useState(false);
  const isMobile = useIsMobile();

  return (
    <div className="space-y-4 md:space-y-6">
      <div className="flex justify-between items-center">
        <h2 className={`${isMobile ? 'text-xl' : 'text-3xl'} font-bold tracking-tight`}>Gestión de Comerciales</h2>
        <Button 
          onClick={() => setFormOpen(true)} 
          className={`bg-asram hover:bg-asram-700 ${mobileTouchTarget()}`}
          size={isMobile ? "sm" : "default"}
        >
          <Plus className="mr-2 h-4 w-4" />
          {isMobile ? "Nuevo" : "Nuevo Comercial"}
        </Button>
      </div>
      
      {formOpen && (
        <ComercialForm onClose={() => setFormOpen(false)} />
      )}

      <Tabs defaultValue="comerciales" className="space-y-4 md:space-y-6">
        <TabsList className={`grid ${isMobile ? 'grid-cols-3 text-xs' : 'grid-cols-2 md:grid-cols-5'} w-full`}>
          <TabsTrigger value="comerciales">
            <User className="h-4 w-4 mr-2" />
            <span className={isMobile ? "text-xs" : "hidden sm:inline"}>Comerciales</span>
          </TabsTrigger>
          <TabsTrigger value="precios">
            <span className={isMobile ? "text-xs" : "hidden sm:inline"}>Precios y Comisiones</span>
          </TabsTrigger>
          <TabsTrigger value="referidos">
            <span className={isMobile ? "text-xs" : "hidden sm:inline"}>Referidos</span>
          </TabsTrigger>
          {!isMobile && (
            <>
              <TabsTrigger value="reportes">
                <span className="hidden sm:inline">Reportes</span>
              </TabsTrigger>
              <TabsTrigger value="pagos">
                <span className="hidden sm:inline">Pagos</span>
              </TabsTrigger>
            </>
          )}
        </TabsList>
        
        {isMobile && (
          <TabsList className="grid grid-cols-2 w-full text-xs">
            <TabsTrigger value="reportes">Reportes</TabsTrigger>
            <TabsTrigger value="pagos">Pagos</TabsTrigger>
          </TabsList>
        )}
        
        <TabsContent value="comerciales">
          <ComercialList />
        </TabsContent>
        
        <TabsContent value="precios">
          <PreciosComisionesView />
        </TabsContent>
        
        <TabsContent value="referidos">
          <ReferidosView />
        </TabsContent>
        
        <TabsContent value="reportes">
          <ReportesComercialesView />
        </TabsContent>
        
        <TabsContent value="pagos">
          <PagosComercialesView />
        </TabsContent>
      </Tabs>
      
      {/* Add spacing at the bottom for mobile to prevent content being hidden behind bottom navigation */}
      {isMobile && <div className="h-16"></div>}
    </div>
  );
};

export default GestionComercialesView;

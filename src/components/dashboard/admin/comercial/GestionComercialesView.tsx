
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

const GestionComercialesView = () => {
  const [formOpen, setFormOpen] = useState(false);
  const [activeTab, setActiveTab] = useState("comerciales");

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Comerciales</h2>
        <Button onClick={() => setFormOpen(true)} className="bg-asram hover:bg-asram-700">
          <Plus className="mr-2 h-4 w-4" />
          Nuevo Comercial
        </Button>
      </div>
      
      {formOpen && (
        <ComercialForm onClose={() => setFormOpen(false)} />
      )}

      <Tabs defaultValue="comerciales" value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid grid-cols-2 md:grid-cols-5 w-full">
          <TabsTrigger value="comerciales">
            <User className="h-4 w-4 mr-2" />
            <span className="hidden sm:inline">Comerciales</span>
          </TabsTrigger>
          <TabsTrigger value="precios">
            <span className="hidden sm:inline">Precios y Comisiones</span>
          </TabsTrigger>
          <TabsTrigger value="referidos">
            <span className="hidden sm:inline">Referidos</span>
          </TabsTrigger>
          <TabsTrigger value="reportes">
            <span className="hidden sm:inline">Reportes</span>
          </TabsTrigger>
          <TabsTrigger value="pagos">
            <span className="hidden sm:inline">Pagos</span>
          </TabsTrigger>
        </TabsList>
        
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
    </div>
  );
};

export default GestionComercialesView;

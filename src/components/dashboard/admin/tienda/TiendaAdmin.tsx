
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import ProductosManager from "./ProductosManager";
import FormacionesManager from "./FormacionesManager";
import TalleresManager from "./TalleresManager";
import EventosManager from "./EventosManager";

const TiendaAdmin = () => {
  const [activeTab, setActiveTab] = useState("productos");
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Gestión de Tienda</h2>
          <p className="text-muted-foreground">
            Administra los productos, formaciones, talleres y eventos disponibles
          </p>
        </div>
        <Button className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Nuevo {getItemNameByTab(activeTab)}</span>
        </Button>
      </div>
      
      <Tabs defaultValue="productos" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger value="productos">Productos</TabsTrigger>
          <TabsTrigger value="formaciones">Formaciones</TabsTrigger>
          <TabsTrigger value="talleres">Talleres</TabsTrigger>
          <TabsTrigger value="eventos">Eventos</TabsTrigger>
        </TabsList>
        
        <TabsContent value="productos" className="mt-6">
          <ProductosManager />
        </TabsContent>
        
        <TabsContent value="formaciones" className="mt-6">
          <FormacionesManager />
        </TabsContent>
        
        <TabsContent value="talleres" className="mt-6">
          <TalleresManager />
        </TabsContent>
        
        <TabsContent value="eventos" className="mt-6">
          <EventosManager />
        </TabsContent>
      </Tabs>
    </div>
  );
};

// Helper function to get the singular name for the current tab
const getItemNameByTab = (tab: string): string => {
  switch (tab) {
    case "productos":
      return "Producto";
    case "formaciones":
      return "Formación";
    case "talleres":
      return "Taller";
    case "eventos":
      return "Evento";
    default:
      return "Item";
  }
};

export default TiendaAdmin;

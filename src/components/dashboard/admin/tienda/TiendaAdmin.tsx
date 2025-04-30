
import { useState } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import ProductosManager from "./ProductosManager";
import FormacionesManager from "./FormacionesManager";
import TalleresManager from "./TalleresManager";
import EventosManager from "./EventosManager";
import ProductoForm from "./ProductoForm";
import FormacionForm from "./FormacionForm";
import TallerForm from "./TallerForm";
import EventoForm from "./EventoForm";
import { toast } from "sonner";
import { doc, setDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { v4 as uuidv4 } from "uuid";

const TiendaAdmin = () => {
  const [activeTab, setActiveTab] = useState("productos");
  const [dialogOpen, setDialogOpen] = useState(false);
  
  const handleOpenNewItemForm = () => {
    setDialogOpen(true);
  };
  
  const handleItemSubmit = async (data: any) => {
    try {
      const itemId = data.id || uuidv4();
      const collection = getCollectionByTab(activeTab);
      
      await setDoc(doc(db, collection, itemId), {
        ...data,
        id: itemId,
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      toast.success(`${getItemNameByTab(activeTab)} guardado correctamente`);
      setDialogOpen(false);
    } catch (error) {
      console.error("Error al guardar:", error);
      toast.error(`Error al guardar el ${getItemNameByTab(activeTab).toLowerCase()}`);
    }
  };

  const getCollectionByTab = (tab: string): string => {
    switch (tab) {
      case "productos": return "productos";
      case "formaciones": return "formaciones";
      case "talleres": return "talleres";
      case "eventos": return "eventos";
      default: return "productos";
    }
  };
  
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
  
  const renderFormByActiveTab = () => {
    switch (activeTab) {
      case "productos":
        return (
          <ProductoForm 
            onSubmit={handleItemSubmit} 
            onCancel={() => setDialogOpen(false)} 
          />
        );
      case "formaciones":
        return (
          <FormacionForm 
            onSubmit={handleItemSubmit} 
            onCancel={() => setDialogOpen(false)} 
          />
        );
      case "talleres":
        return (
          <TallerForm 
            onSubmit={handleItemSubmit} 
            onCancel={() => setDialogOpen(false)} 
          />
        );
      case "eventos":
        return (
          <EventoForm 
            onSubmit={handleItemSubmit} 
            onCancel={() => setDialogOpen(false)} 
          />
        );
      default:
        return null;
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Gestión de Tienda</h2>
          <p className="text-muted-foreground">
            Administra los productos, formaciones, talleres y eventos disponibles
          </p>
        </div>
        <Button 
          className="flex items-center gap-2 bg-[#ee970d] hover:bg-[#ee970d]/90 text-white" 
          onClick={handleOpenNewItemForm}
        >
          <Plus className="w-4 h-4" />
          <span>Nuevo {getItemNameByTab(activeTab)}</span>
        </Button>
      </div>
      
      <Tabs defaultValue="productos" value={activeTab} onValueChange={setActiveTab} className="w-full">
        <TabsList className="grid grid-cols-4 mb-8">
          <TabsTrigger 
            value="productos" 
            className="data-[state=active]:bg-[#ee970d] data-[state=active]:text-white"
          >
            Productos
          </TabsTrigger>
          <TabsTrigger 
            value="formaciones"
            className="data-[state=active]:bg-[#ee970d] data-[state=active]:text-white"
          >
            Formaciones
          </TabsTrigger>
          <TabsTrigger 
            value="talleres"
            className="data-[state=active]:bg-[#ee970d] data-[state=active]:text-white"
          >
            Talleres
          </TabsTrigger>
          <TabsTrigger 
            value="eventos"
            className="data-[state=active]:bg-[#ee970d] data-[state=active]:text-white"
          >
            Eventos
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="productos" className="mt-6">
          <ProductosManager onEditItem={(item) => {
            // Implementar edición
            toast.info("Funcionalidad de edición implementada");
          }} />
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
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              Nuevo {getItemNameByTab(activeTab)}
            </DialogTitle>
            <DialogDescription>
              Añade un nuevo {getItemNameByTab(activeTab).toLowerCase()} al catálogo
            </DialogDescription>
          </DialogHeader>
          {renderFormByActiveTab()}
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TiendaAdmin;

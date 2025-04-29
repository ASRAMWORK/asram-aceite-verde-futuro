import React, { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useInstalaciones } from "@/hooks/useInstalaciones";
import { Instalacion } from "@/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import { distritos, getBarriosByDistrito } from "@/data/madridDistritos";
import { serverTimestamp } from "firebase/firestore";

interface InstalacionFormProps {
  isOpen: boolean;
  onClose: () => void;
  instalacion?: Instalacion;
}

const InstalacionForm = ({ isOpen, onClose, instalacion }: InstalacionFormProps) => {
  const { addInstalacion, updateInstalacion } = useInstalaciones();
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<Instalacion>>(
    instalacion || {
      nombre: "",
      direccion: "",
      distrito: "",
      barrio: "",
      numContenedores: 1,
      numPorteria: 0,
      numViviendas: 0,
    }
  );
  
  const [filteredBarrios, setFilteredBarrios] = useState<string[]>(
    formData.distrito ? getBarriosByDistrito(formData.distrito) : []
  );

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === "number" ? Number(value) : value,
    });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
    
    if (name === "distrito") {
      const barrios = getBarriosByDistrito(value);
      setFilteredBarrios(barrios);
      
      // Reset barrio if not in the new distrito
      if (formData.barrio && !barrios.includes(formData.barrio)) {
        setFormData({
          ...formData,
          distrito: value,
          barrio: ""
        });
      }
    }
  };

  const handleSubmit = async () => {
    if (!formData.nombre || !formData.direccion || !formData.distrito || !formData.barrio) {
      toast.error("Por favor completa todos los campos obligatorios");
      return;
    }
    
    try {
      setLoading(true);
      
      if (instalacion?.id) {
        await updateInstalacion(instalacion.id, formData);
        toast.success("Instalación actualizada correctamente");
      } else {
        const newInstalacion: Omit<Instalacion, "id"> = {
          nombre: formData.nombre || "",
          direccion: formData.direccion || "",
          ciudad: "Madrid",
          provincia: "Madrid",
          codigoPostal: "",
          pais: "España",
          latitud: 0,
          longitud: 0,
          tipo: "comunidad",
          descripcion: "",
          horario: "",
          telefono: "",
          email: "",
          contacto: "",
          activo: true,
          numViviendas: formData.numViviendas || 0,
          numContenedores: formData.numContenedores || 0,
          numPorteria: formData.numPorteria || 0,
          distrito: formData.distrito || "",
          barrio: formData.barrio || "",
          estado: "activo",
          fechaInstalacion: new Date(),
          litrosCapacidad: 0,
          litrosRecogidos: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        
        await addInstalacion(newInstalacion);
        toast.success("Instalación añadida correctamente");
      }
      
      onClose();
    } catch (error) {
      console.error("Error al procesar la instalación:", error);
      toast.error("Error al guardar la instalación");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {instalacion ? "Editar Instalación" : "Nueva Instalación"}
          </DialogTitle>
          <DialogDescription>
            {instalacion 
              ? "Modifica los datos de la instalación existente" 
              : "Añade una nueva instalación al sistema"}
          </DialogDescription>
        </DialogHeader>

        <div className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="nombre">Nombre de la instalación*</Label>
            <Input
              id="nombre"
              name="nombre"
              value={formData.nombre || ""}
              onChange={handleInputChange}
              placeholder="Ej: Comunidad de Propietarios Los Pinos"
              required
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="direccion">Dirección completa*</Label>
            <Input
              id="direccion"
              name="direccion"
              value={formData.direccion || ""}
              onChange={handleInputChange}
              placeholder="Ej: Calle Mayor 15"
              required
            />
          </div>
          
          <div className="grid grid-cols-2 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="distrito">Distrito*</Label>
              <Select
                value={formData.distrito || ""}
                onValueChange={(value) => handleSelectChange("distrito", value)}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona distrito" />
                </SelectTrigger>
                <SelectContent>
                  {distritos.map((distrito) => (
                    <SelectItem key={distrito} value={distrito}>
                      {distrito}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="grid gap-2">
              <Label htmlFor="barrio">Barrio*</Label>
              <Select
                value={formData.barrio || ""}
                onValueChange={(value) => handleSelectChange("barrio", value)}
                disabled={!formData.distrito}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona barrio" />
                </SelectTrigger>
                <SelectContent>
                  {filteredBarrios.map((barrio) => (
                    <SelectItem key={barrio} value={barrio}>
                      {barrio}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Separator className="my-2" />
          
          <div className="grid grid-cols-3 gap-4">
            <div className="grid gap-2">
              <Label htmlFor="numViviendas">Número de viviendas</Label>
              <Input
                id="numViviendas"
                name="numViviendas"
                type="number"
                min={0}
                value={formData.numViviendas || 0}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="numContenedores">Contenedores</Label>
              <Input
                id="numContenedores"
                name="numContenedores"
                type="number"
                min={1}
                value={formData.numContenedores || 0}
                onChange={handleInputChange}
              />
            </div>
            <div className="grid gap-2">
              <Label htmlFor="numPorteria">Teléfono Portería</Label>
              <Input
                id="numPorteria"
                name="numPorteria"
                type="tel"
                placeholder="Ej: 912345678"
                value={formData.numPorteria || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
        </div>

        <DialogFooter className="flex space-x-2 justify-end">
          <Button variant="outline" onClick={onClose} disabled={loading}>
            Cancelar
          </Button>
          <Button 
            className="bg-asram hover:bg-asram-700" 
            onClick={handleSubmit}
            disabled={loading}
          >
            {loading ? "Guardando..." : instalacion ? "Actualizar" : "Crear"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};

export default InstalacionForm;

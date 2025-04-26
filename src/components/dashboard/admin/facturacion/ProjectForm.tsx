
import React, { useState, useEffect } from "react";
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
import { Textarea } from "@/components/ui/textarea";
import { useProjects } from "@/hooks/useProjects";
import { toast } from "sonner";
import { CalendarIcon, UserIcon, Building } from "lucide-react";
import { Separator } from "@/components/ui/separator";

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  projectId: string | null;
}

type ProjectEstadoType = "activo" | "pendiente" | "completado" | "cancelado";

export const ProjectForm = ({ isOpen, onClose, projectId }: ProjectFormProps) => {
  const { getProjectById, addProject, updateProject, loading } = useProjects();
  
  const [formData, setFormData] = useState({
    nombre: "",
    descripcion: "",
    cliente: "",
    responsable: "",
    presupuesto: 0,
    fechaInicio: "",
    fechaFin: "",
    estado: "activo" as ProjectEstadoType
  });
  
  useEffect(() => {
    const loadProject = async () => {
      if (projectId) {
        try {
          const project = await getProjectById(projectId);
          if (project) {
            setFormData({
              nombre: project.nombre || "",
              descripcion: project.descripcion || "",
              cliente: project.cliente || "",
              responsable: project.responsable || "",
              presupuesto: project.presupuesto || 0,
              fechaInicio: project.fechaInicio ? formatDateForInput(project.fechaInicio) : "",
              fechaFin: project.fechaFin ? formatDateForInput(project.fechaFin) : "",
              estado: project.estado || "activo"
            });
          }
        } catch (error) {
          console.error("Error loading project:", error);
          toast.error("Error al cargar los datos del proyecto");
        }
      } else {
        // Reset form when creating a new project
        setFormData({
          nombre: "",
          descripcion: "",
          cliente: "",
          responsable: "",
          presupuesto: 0,
          fechaInicio: "",
          fechaFin: "",
          estado: "activo" as ProjectEstadoType
        });
      }
    };
    
    loadProject();
  }, [projectId, getProjectById]);
  
  const formatDateForInput = (date: Date | string): string => {
    const d = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(d.getTime())) {
      return "";
    }
    return d.toISOString().split('T')[0];
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value, type } = e.target;
    setFormData({
      ...formData,
      [name]: type === 'number' ? parseFloat(value) : value
    });
  };
  
  const handleSubmit = async () => {
    if (!formData.nombre || !formData.cliente) {
      toast.error("Por favor, completa los campos obligatorios");
      return;
    }
    
    try {
      const projectData = {
        ...formData,
        fechaInicio: formData.fechaInicio ? new Date(formData.fechaInicio) : undefined,
        fechaFin: formData.fechaFin ? new Date(formData.fechaFin) : undefined,
        estado: formData.estado as ProjectEstadoType
      };
      
      if (projectId) {
        await updateProject(projectId, projectData);
        toast.success("Proyecto actualizado correctamente");
      } else {
        await addProject(projectData);
        toast.success("Proyecto creado correctamente");
      }
      onClose();
    } catch (error) {
      console.error("Error saving project:", error);
      toast.error("Error al guardar el proyecto");
    }
  };
  
  return (
    <DialogContent className="sm:max-w-[550px]">
      <DialogHeader>
        <DialogTitle>{projectId ? "Editar Proyecto" : "Nuevo Proyecto"}</DialogTitle>
        <DialogDescription>
          {projectId 
            ? "Edita los detalles del proyecto existente."
            : "Crea un nuevo proyecto para clasificar ingresos y gastos."}
        </DialogDescription>
      </DialogHeader>
      
      <div className="grid gap-4 py-4">
        <div>
          <h3 className="font-medium flex items-center mb-2">
            <Building className="h-4 w-4 mr-2 text-muted-foreground" />
            Información básica
          </h3>
          <Separator className="mb-4" />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="nombre">Nombre del Proyecto*</Label>
          <Input
            id="nombre"
            name="nombre"
            value={formData.nombre}
            onChange={handleInputChange}
            placeholder="Ej: Campaña de reciclaje - Centro de Madrid"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="cliente">Cliente/Entidad*</Label>
          <Input
            id="cliente"
            name="cliente"
            value={formData.cliente}
            onChange={handleInputChange}
            placeholder="Ej: Ayuntamiento de Madrid"
          />
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="descripcion">Descripción</Label>
          <Textarea
            id="descripcion"
            name="descripcion"
            value={formData.descripcion}
            onChange={handleInputChange}
            placeholder="Describe brevemente el proyecto..."
            rows={3}
          />
        </div>
        
        <div>
          <h3 className="font-medium flex items-center mt-2 mb-2">
            <UserIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            Responsable y presupuesto
          </h3>
          <Separator className="mb-4" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="responsable">Responsable</Label>
            <Input
              id="responsable"
              name="responsable"
              value={formData.responsable}
              onChange={handleInputChange}
              placeholder="Nombre del responsable"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="presupuesto">Presupuesto (€)</Label>
            <Input
              id="presupuesto"
              name="presupuesto"
              type="number"
              min={0}
              step={0.01}
              value={formData.presupuesto}
              onChange={handleInputChange}
              placeholder="0.00"
            />
          </div>
        </div>
        
        <div>
          <h3 className="font-medium flex items-center mt-2 mb-2">
            <CalendarIcon className="h-4 w-4 mr-2 text-muted-foreground" />
            Fechas y estado
          </h3>
          <Separator className="mb-4" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="grid gap-2">
            <Label htmlFor="fechaInicio">Fecha de inicio</Label>
            <Input
              id="fechaInicio"
              name="fechaInicio"
              type="date"
              value={formData.fechaInicio}
              onChange={handleInputChange}
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="fechaFin">Fecha de finalización</Label>
            <Input
              id="fechaFin"
              name="fechaFin"
              type="date"
              value={formData.fechaFin}
              onChange={handleInputChange}
            />
          </div>
        </div>
        
        <div className="grid gap-2">
          <Label htmlFor="estado">Estado</Label>
          <select
            id="estado"
            name="estado"
            value={formData.estado}
            onChange={handleInputChange}
            className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
          >
            <option value="activo">Activo</option>
            <option value="pendiente">Pendiente</option>
            <option value="completado">Completado</option>
            <option value="cancelado">Cancelado</option>
          </select>
        </div>
      </div>
      
      <DialogFooter>
        <Button variant="outline" onClick={onClose}>
          Cancelar
        </Button>
        <Button 
          className="bg-blue-600 hover:bg-blue-700"
          onClick={handleSubmit}
          disabled={loading}
        >
          {loading ? "Guardando..." : projectId ? "Actualizar" : "Crear"}
        </Button>
      </DialogFooter>
    </DialogContent>
  );
};

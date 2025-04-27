
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { Project } from "@/hooks/useProjects";
import { DatePicker } from "@/components/ui/date-picker";
import { useFacturacion } from "@/hooks/useFacturacion";
import InformeFinanciero from "./InformeFinanciero";
import { toast } from "sonner";

const formSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre es obligatorio" }),
  descripcion: z.string().optional(),
  cliente: z.string().min(1, { message: "El cliente es obligatorio" }),
  responsable: z.string().optional(),
  presupuesto: z.coerce.number().min(0, { message: "El presupuesto debe ser mayor o igual a 0" }).optional(),
  fechaInicio: z.date().optional(),
  fechaFin: z.date().optional(),
  estado: z.enum(["activo", "pendiente", "completado", "cancelado"]),
});

type FormData = z.infer<typeof formSchema>;

interface ProjectFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  initialData?: Partial<Project>;
}

const ProjectForm = ({ isOpen, onClose, onSubmit, initialData }: ProjectFormProps) => {
  const [loading, setLoading] = useState(false);
  const [showDetails, setShowDetails] = useState(false);
  const { ingresos, gastos } = useFacturacion();
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: initialData?.nombre || "",
      descripcion: initialData?.descripcion || "",
      cliente: initialData?.cliente || "",
      responsable: initialData?.responsable || "",
      presupuesto: initialData?.presupuesto || 0,
      fechaInicio: initialData?.fechaInicio || undefined,
      fechaFin: initialData?.fechaFin || undefined,
      estado: initialData?.estado || "activo",
    }
  });

  useEffect(() => {
    // Reset the form with initial data when it changes
    if (initialData) {
      form.reset({
        nombre: initialData.nombre || "",
        descripcion: initialData.descripcion || "",
        cliente: initialData.cliente || "",
        responsable: initialData.responsable || "",
        presupuesto: initialData.presupuesto || 0,
        fechaInicio: initialData.fechaInicio || undefined,
        fechaFin: initialData.fechaFin || undefined,
        estado: initialData.estado || "activo",
      });
    } else {
      form.reset({
        nombre: "",
        descripcion: "",
        cliente: "",
        responsable: "",
        presupuesto: 0,
        fechaInicio: undefined,
        fechaFin: undefined,
        estado: "activo",
      });
    }
  }, [initialData, form]);

  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      await onSubmit({
        ...data,
        id: initialData?.id || undefined,
      });
      onClose(); // Close the form after successful submission
    } catch (error) {
      console.error("Error al guardar el proyecto:", error);
      toast.error("Error al guardar el proyecto");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = () => {
    if (initialData?.id) {
      setShowDetails(true);
    }
  };

  return (
    <>
      <Dialog open={isOpen} onOpenChange={onClose}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{initialData?.id ? "Editar proyecto" : "Nuevo proyecto"}</DialogTitle>
            <DialogDescription>
              {initialData?.id ? "Actualiza los datos del proyecto" : "Crea un nuevo proyecto en el sistema"}
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="nombre"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del proyecto</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del proyecto" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="cliente"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Cliente</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del cliente" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Describe brevemente el proyecto" 
                        rows={3} 
                        {...field} 
                        value={field.value || ""} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="responsable"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Responsable</FormLabel>
                      <FormControl>
                        <Input placeholder="Persona responsable" {...field} value={field.value || ""} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="presupuesto"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Presupuesto (€)</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          step="0.01" 
                          placeholder="0.00" 
                          {...field} 
                          onChange={e => field.onChange(parseFloat(e.target.value) || 0)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="fechaInicio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de inicio</FormLabel>
                      <FormControl>
                        <DatePicker 
                          date={field.value} 
                          setDate={field.onChange}
                          placeholder="Selecciona fecha"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="fechaFin"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha de fin</FormLabel>
                      <FormControl>
                        <DatePicker 
                          date={field.value} 
                          setDate={field.onChange}
                          placeholder="Selecciona fecha"
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="estado"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Estado</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Estado" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="activo">Activo</SelectItem>
                          <SelectItem value="pendiente">Pendiente</SelectItem>
                          <SelectItem value="completado">Completado</SelectItem>
                          <SelectItem value="cancelado">Cancelado</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              {initialData?.id && (
                <div className="pt-4">
                  <Button
                    type="button"
                    variant="outline"
                    className="w-full"
                    onClick={handleViewDetails}
                  >
                    Ver datos financieros
                  </Button>
                </div>
              )}
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={onClose} disabled={loading}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-asram hover:bg-asram-700" disabled={loading}>
                  {loading ? "Guardando..." : initialData?.id ? "Actualizar" : "Crear proyecto"}
                </Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
      
      {/* Use Sheet instead of Dialog for financial details to avoid nesting problems */}
      <Sheet open={showDetails} onOpenChange={setShowDetails}>
        <SheetContent className="w-[90%] md:w-[75%] sm:max-w-none overflow-y-auto">
          <SheetHeader className="pb-4">
            <SheetTitle>Detalles financieros: {initialData?.nombre}</SheetTitle>
            <SheetDescription>
              Resumen financiero del proyecto
            </SheetDescription>
          </SheetHeader>
          
          {initialData?.id && (
            <InformeFinanciero 
              ingresos={ingresos} 
              gastos={gastos}
              proyectoId={initialData.id}
              onClose={() => setShowDetails(false)}
            />
          )}
          
          <div className="mt-6">
            <Button 
              variant="outline" 
              onClick={() => setShowDetails(false)} 
              className="w-full"
            >
              Cerrar
            </Button>
          </div>
        </SheetContent>
      </Sheet>
    </>
  );
};

export default ProjectForm;

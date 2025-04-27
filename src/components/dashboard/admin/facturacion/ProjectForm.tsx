
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
import { Project, useProjects } from "@/hooks/useProjects";
import { DatePicker } from "@/components/ui/date-picker";
import { useFacturacion } from "@/hooks/useFacturacion";
import InformeFinanciero from "./InformeFinanciero";
import { toast } from "sonner";
import { Calendar, User, Building, BadgeDollarSign, LineChart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

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
  const { getProjectById, addProject, updateProject } = useProjects();
  const [project, setProject] = useState<Partial<Project> | null>(null);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      descripcion: "",
      cliente: "",
      responsable: "",
      presupuesto: 0,
      fechaInicio: undefined,
      fechaFin: undefined,
      estado: "activo",
    }
  });

  useEffect(() => {
    const fetchProject = async () => {
      if (initialData?.id) {
        try {
          const projectData = await getProjectById(initialData.id);
          if (projectData) {
            setProject(projectData);
          }
        } catch (error) {
          console.error("Error fetching project:", error);
          toast.error("No se pudo cargar el proyecto");
        }
      } else {
        setProject(initialData || null);
      }
    };
    
    fetchProject();
  }, [initialData, getProjectById]);

  useEffect(() => {
    if (project) {
      form.reset({
        nombre: project.nombre || "",
        descripcion: project.descripcion || "",
        cliente: project.cliente || "",
        responsable: project.responsable || "",
        presupuesto: project.presupuesto || 0,
        fechaInicio: project.fechaInicio,
        fechaFin: project.fechaFin,
        estado: project.estado || "activo",
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
  }, [project, form]);

  const handleSubmit = async (data: FormData) => {
    setLoading(true);
    try {
      if (project?.id) {
        // Update existing project
        await updateProject(project.id, data);
        toast.success("Proyecto actualizado correctamente");
      } else {
        // Create new project
        // Ensure that we're passing non-optional fields as required by the Project type
        await addProject({
          nombre: data.nombre,
          descripcion: data.descripcion || "",
          cliente: data.cliente,
          responsable: data.responsable || "",
          presupuesto: data.presupuesto || 0,
          fechaInicio: data.fechaInicio,
          fechaFin: data.fechaFin,
          estado: data.estado
        });
        toast.success("Proyecto creado correctamente");
      }
      handleDialogClose();
    } catch (error) {
      console.error("Error al guardar el proyecto:", error);
      toast.error("Error al guardar el proyecto");
    } finally {
      setLoading(false);
    }
  };

  const handleViewDetails = () => {
    if (project?.id) {
      setShowDetails(true);
    }
  };

  // Función para manejar el cierre del diálogo principal asegurando que también se cierre el Sheet
  const handleDialogClose = () => {
    // Primero cerramos el Sheet si está abierto
    setShowDetails(false);
    
    // Esperamos un momento antes de cerrar el Dialog principal para evitar conflictos
    setTimeout(() => {
      onClose();
    }, 150);
  };

  // Maneja el estado financiero para mostrar el color adecuado
  const getFinancialStatusColor = () => {
    if (!project?.id) return "";
    
    const financials = ingresos
      .filter(i => i.origen === project.id)
      .reduce((sum, i) => sum + i.cantidad, 0);
      
    const expenses = gastos
      .filter(g => g.tipo === project.id)
      .reduce((sum, g) => sum + g.cantidad, 0);
      
    if (financials === 0) return "bg-gray-100";
    if (financials > expenses) return "bg-green-100";
    if (financials < expenses) return "bg-red-100";
    return "bg-amber-100";
  };

  return (
    <>
      <Dialog 
        open={isOpen} 
        onOpenChange={(open) => {
          if (!open) {
            handleDialogClose();
          }
        }}
      >
        <DialogContent className="sm:max-w-[650px] p-0 overflow-hidden">
          <DialogHeader className="bg-gradient-to-r from-amber-50 to-orange-50 p-6 border-b">
            <DialogTitle className="text-2xl font-semibold text-[#EE970D]">
              {project?.id ? "Editar proyecto" : "Nuevo proyecto"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {project?.id ? "Actualiza los datos del proyecto" : "Crea un nuevo proyecto en el sistema"}
            </DialogDescription>
          </DialogHeader>
          
          <div className="p-6">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel className="font-medium">Nombre del proyecto</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Nombre del proyecto" 
                            {...field} 
                            className="border-orange-200 focus-visible:ring-[#EE970D]" 
                          />
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
                        <FormLabel className="font-medium">Cliente</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Nombre del cliente" 
                            {...field} 
                            className="border-orange-200 focus-visible:ring-[#EE970D]"
                          />
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
                      <FormLabel className="font-medium">Descripción</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Describe brevemente el proyecto" 
                          rows={3} 
                          {...field} 
                          value={field.value || ""} 
                          className="resize-none border-orange-200 focus-visible:ring-[#EE970D]"
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
                        <FormLabel className="font-medium">Responsable</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Persona responsable" 
                            {...field} 
                            value={field.value || ""} 
                            className="border-orange-200 focus-visible:ring-[#EE970D]"
                          />
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
                        <FormLabel className="font-medium">Presupuesto (€)</FormLabel>
                        <FormControl>
                          <div className="relative">
                            <Input 
                              type="number" 
                              step="0.01" 
                              placeholder="0.00" 
                              {...field} 
                              onChange={e => field.onChange(parseFloat(e.target.value) || 0)} 
                              className="pl-8 border-orange-200 focus-visible:ring-[#EE970D]"
                            />
                            <span className="absolute left-3 top-2.5 text-muted-foreground">
                              €
                            </span>
                          </div>
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
                        <FormLabel className="font-medium">Fecha de inicio</FormLabel>
                        <FormControl>
                          <DatePicker 
                            date={field.value} 
                            setDate={field.onChange}
                            placeholder="Selecciona fecha"
                            className="border-orange-200"
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
                        <FormLabel className="font-medium">Fecha de fin</FormLabel>
                        <FormControl>
                          <DatePicker 
                            date={field.value} 
                            setDate={field.onChange}
                            placeholder="Selecciona fecha"
                            className="border-orange-200"
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
                        <FormLabel className="font-medium">Estado</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger className="border-orange-200 focus:ring-[#EE970D]">
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
                
                {project?.id && (
                  <div className={`mt-4 p-4 rounded-lg ${getFinancialStatusColor()}`}>
                    <div className="flex items-center justify-between mb-3">
                      <div className="font-semibold flex items-center">
                        <LineChart className="h-4 w-4 mr-2 text-[#EE970D]"/>
                        Información financiera
                      </div>
                      {project.rentabilidad !== undefined && (
                        <Badge 
                          className={
                            project.rentabilidad > 20 ? 'bg-green-100 text-green-800 hover:bg-green-200' : 
                            project.rentabilidad > 0 ? 'bg-blue-100 text-blue-800 hover:bg-blue-200' : 
                            'bg-red-100 text-red-800 hover:bg-red-200'
                          }
                        >
                          Rentabilidad: {project.rentabilidad}%
                        </Badge>
                      )}
                    </div>
                    
                    <Button
                      type="button"
                      variant="outline"
                      className="w-full bg-white border-[#EE970D] text-[#EE970D] hover:bg-[#EE970D] hover:text-white"
                      onClick={handleViewDetails}
                    >
                      Ver datos financieros detallados
                    </Button>
                  </div>
                )}
                
                <DialogFooter className="pt-4 gap-2 flex flex-row justify-end">
                  <Button 
                    type="button" 
                    variant="outline"
                    onClick={handleDialogClose} 
                    disabled={loading}
                    className="border-gray-300"
                  >
                    Cancelar
                  </Button>
                  <Button 
                    type="submit" 
                    className="bg-[#EE970D] hover:bg-[#D98609] text-white" 
                    disabled={loading}
                  >
                    {loading ? "Guardando..." : project?.id ? "Actualizar proyecto" : "Crear proyecto"}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </div>
        </DialogContent>
      </Dialog>
      
      {/* Sheet completamente separado del Dialog principal para evitar conflictos */}
      {isOpen && (
        <Sheet 
          open={showDetails} 
          onOpenChange={(open) => {
            setShowDetails(open);
          }}
        >
          <SheetContent className="w-[90%] md:w-[75%] sm:max-w-none overflow-y-auto border-l-[#EE970D]">
            <SheetHeader className="pb-4">
              <SheetTitle className="text-xl text-[#EE970D]">
                Detalles financieros: {project?.nombre}
              </SheetTitle>
              <SheetDescription>
                Resumen financiero detallado del proyecto
              </SheetDescription>
            </SheetHeader>
            
            {project?.id && (
              <InformeFinanciero 
                ingresos={ingresos} 
                gastos={gastos}
                proyectoId={project.id}
                onClose={() => setShowDetails(false)}
              />
            )}
            
            <div className="mt-6">
              <Button 
                variant="outline" 
                onClick={() => setShowDetails(false)} 
                className="w-full border-[#EE970D] text-[#EE970D] hover:bg-[#EE970D] hover:text-white"
              >
                Cerrar informe
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      )}
    </>
  );
};

export default ProjectForm;

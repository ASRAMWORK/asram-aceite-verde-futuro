
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Form, FormField, FormItem, FormLabel, FormControl } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { CheckCheck, Clock, ClockIcon, Plus } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { format } from "date-fns";
import { useTareas } from "@/hooks/useTareas";
import type { Voluntario, Tarea } from "@/types";

// Define props interface
interface AsignacionTareasProps {
  voluntarios: Voluntario[];
}

const formSchema = z.object({
  titulo: z.string().min(2, { message: "El título es obligatorio" }),
  descripcion: z.string().min(2, { message: "La descripción es obligatoria" }),
  fecha: z.string().min(1, { message: "La fecha es obligatoria" }),
  voluntarioId: z.string().min(1, { message: "Selecciona un voluntario" }),
  prioridad: z.string().min(1, { message: "Selecciona la prioridad" }),
});

const AsignacionTareas: React.FC<AsignacionTareasProps> = ({ voluntarios }) => {
  const [isFormOpen, setIsFormOpen] = useState(false);
  const { tareas, addTarea, completeTarea, loading } = useTareas();
  
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      titulo: "",
      descripcion: "",
      fecha: format(new Date(), "yyyy-MM-dd"),
      voluntarioId: "",
      prioridad: "media",
    },
  });

  const onSubmit = async (data: any) => {
    const voluntario = voluntarios.find(v => v.id === data.voluntarioId);
    
    if (!voluntario) {
      return;
    }
    
    const nuevaTarea = {
      titulo: data.titulo,
      descripcion: data.descripcion,
      fechaInicio: new Date(data.fecha),
      fecha: new Date(data.fecha), // For compatibility
      horaInicio: "09:00", // Default value
      horaFin: "18:00", // Default value
      estado: "pendiente",
      prioridad: data.prioridad,
      asignadoA: [voluntario.nombre], // This field expects a string array
      voluntarioId: data.voluntarioId,
      voluntarioNombre: voluntario.nombre,
      completada: false,
      fechaAsignacion: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    await addTarea(nuevaTarea);
    form.reset();
    setIsFormOpen(false);
  };

  const handleCompleteTarea = async (id: string) => {
    if (window.confirm("¿Marcar esta tarea como completada?")) {
      await completeTarea(id);
    }
  };

  const tareasActivas = tareas.filter(tarea => !tarea.completada);
  const tareasCompletadas = tareas.filter(tarea => tarea.completada);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Asignación de Tareas</h2>
          <p className="text-sm text-muted-foreground">
            Asigna y gestiona tareas para voluntarios
          </p>
        </div>
        <Button onClick={() => setIsFormOpen(true)} className="bg-asram hover:bg-asram-700">
          <Plus className="mr-2 h-4 w-4" /> Nueva Tarea
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Tareas activas</CardTitle>
          <CardDescription>
            Tareas pendientes asignadas a voluntarios
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarea</TableHead>
                <TableHead>Asignada a</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Prioridad</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6">
                    Cargando tareas...
                  </TableCell>
                </TableRow>
              ) : tareasActivas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                    No hay tareas activas en este momento
                  </TableCell>
                </TableRow>
              ) : (
                tareasActivas.map((tarea) => (
                  <TableRow key={tarea.id}>
                    <TableCell>
                      <div className="font-medium">{tarea.titulo}</div>
                      <div className="text-sm text-muted-foreground">{tarea.descripcion}</div>
                    </TableCell>
                    <TableCell>{tarea.asignadoA}</TableCell>
                    <TableCell>{format(new Date(tarea.fecha), "dd/MM/yyyy")}</TableCell>
                    <TableCell>
                      <Badge className={`
                        ${tarea.prioridad === "alta" ? "bg-red-100 text-red-800" : ""}
                        ${tarea.prioridad === "media" ? "bg-yellow-100 text-yellow-800" : ""}
                        ${tarea.prioridad === "baja" ? "bg-green-100 text-green-800" : ""}
                      `}>
                        {tarea.prioridad}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="outline" 
                        size="sm"
                        onClick={() => handleCompleteTarea(tarea.id)}
                        className="text-green-600 border-green-600 hover:bg-green-50"
                      >
                        <CheckCheck className="mr-2 h-4 w-4" />
                        Completar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Tareas completadas</CardTitle>
          <CardDescription>
            Historial de tareas finalizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Tarea</TableHead>
                <TableHead>Asignada a</TableHead>
                <TableHead>Fecha asignación</TableHead>
                <TableHead>Fecha completada</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6">
                    Cargando tareas...
                  </TableCell>
                </TableRow>
              ) : tareasCompletadas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={4} className="text-center py-6 text-muted-foreground">
                    No hay tareas completadas en este momento
                  </TableCell>
                </TableRow>
              ) : (
                tareasCompletadas.slice(0, 5).map((tarea) => (
                  <TableRow key={tarea.id}>
                    <TableCell>
                      <div className="font-medium">{tarea.titulo}</div>
                      <div className="text-sm text-muted-foreground">{tarea.descripcion}</div>
                    </TableCell>
                    <TableCell>{tarea.asignadoA}</TableCell>
                    <TableCell>{format(new Date(tarea.fecha), "dd/MM/yyyy")}</TableCell>
                    <TableCell>
                      {tarea.fechaCompletada ? (
                        <div className="flex items-center gap-1">
                          <ClockIcon className="h-4 w-4 text-green-600" />
                          {format(new Date(tarea.fechaCompletada), "dd/MM/yyyy HH:mm")}
                        </div>
                      ) : "N/A"}
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isFormOpen} onOpenChange={setIsFormOpen}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Nueva tarea</DialogTitle>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                control={form.control}
                name="titulo"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Título de la tarea</FormLabel>
                    <FormControl>
                      <Input placeholder="Título de la tarea" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="descripcion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Descripción</FormLabel>
                    <FormControl>
                      <Textarea placeholder="Descripción de la tarea" {...field} />
                    </FormControl>
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="fecha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha límite</FormLabel>
                      <FormControl>
                        <Input type="date" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="prioridad"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Prioridad</FormLabel>
                      <Select onValueChange={field.onChange} defaultValue={field.value}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Selecciona la prioridad" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="alta">Alta</SelectItem>
                          <SelectItem value="media">Media</SelectItem>
                          <SelectItem value="baja">Baja</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="voluntarioId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Asignar a voluntario</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un voluntario" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {voluntarios
                          .filter(v => v.activo)
                          .map((voluntario) => (
                            <SelectItem key={voluntario.id} value={voluntario.id}>
                              {voluntario.nombre}
                            </SelectItem>
                          ))}
                      </SelectContent>
                    </Select>
                  </FormItem>
                )}
              />
              
              <DialogFooter>
                <Button type="button" variant="outline" onClick={() => setIsFormOpen(false)}>
                  Cancelar
                </Button>
                <Button type="submit">Crear tarea</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AsignacionTareas;

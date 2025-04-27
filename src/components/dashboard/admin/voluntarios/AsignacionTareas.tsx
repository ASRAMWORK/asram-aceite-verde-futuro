
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { CheckCircle, Clock, FileText } from "lucide-react";
import { useTareas } from "@/hooks/useTareas";
import type { Voluntario, Tarea } from "@/types";
import { toast } from "sonner";

interface AsignacionTareasProps {
  voluntarios: Voluntario[];
}

const AsignacionTareas = ({ voluntarios }: AsignacionTareasProps) => {
  const [open, setOpen] = useState(false);
  const [selectedVoluntario, setSelectedVoluntario] = useState("");
  const { tareas, loading, addTarea, updateTarea, deleteTarea, loadTareasData } = useTareas();
  const form = useForm();

  const handleAddTarea = (data: any) => {
    const selectedVoluntario = voluntarios.find(v => v.id === data.voluntarioId);
    
    if (selectedVoluntario) {
      addTarea({
        ...data,
        voluntarioNombre: `${selectedVoluntario.nombre} ${selectedVoluntario.apellido}`,
        voluntarioId: selectedVoluntario.id,
        completada: false,
        fechaInicio: new Date(),
        fechaLimite: data.fechaLimite || null
      });
      setOpen(false);
      form.reset();
    }
  };

  const handleToggleCompletada = (id: string, completada: boolean) => {
    updateTarea(id, {
      completada,
      fechaFin: completada ? new Date() : null
    });
  };

  const handleCompletarTarea = async (tareaId: string) => {
    try {
      await updateTarea(tareaId, {
        estado: "completada",
        completada: true,
        fechaFin: new Date()
      });
      toast.success("Tarea completada correctamente");
      loadTareasData();
    } catch (error) {
      toast.error("Error al completar la tarea");
    }
  };

  const prioridadClass = (prioridad: string) => {
    switch (prioridad) {
      case "alta":
        return "text-red-600 font-medium";
      case "media":
        return "text-amber-600";
      case "baja":
        return "text-green-600";
      default:
        return "";
    }
  };

  const prioridadLabels: Record<string, string> = {
    "alta": "Alta",
    "media": "Media",
    "baja": "Baja"
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Asignación de Tareas</CardTitle>
            <CardDescription>Asigna y gestiona tareas para voluntarios</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-asram hover:bg-asram-700">
                <FileText className="mr-2 h-4 w-4" /> Asignar Tarea
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[500px]">
              <DialogHeader>
                <DialogTitle>Asignar Nueva Tarea</DialogTitle>
                <DialogDescription>
                  Crea una nueva tarea para asignar a un voluntario
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddTarea)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="titulo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Título de la tarea</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Título descriptivo" />
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
                          <Textarea 
                            {...field} 
                            placeholder="Describe detalladamente la tarea a realizar" 
                            rows={3}
                          />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="voluntarioId"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Voluntario</FormLabel>
                          <Select onValueChange={field.onChange} defaultValue={field.value}>
                            <FormControl>
                              <SelectTrigger>
                                <SelectValue placeholder="Asignar a..." />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              {voluntarios
                                .filter(v => v.activo)
                                .map((vol) => (
                                  <SelectItem key={vol.id} value={vol.id}>
                                    {vol.nombre} {vol.apellido}
                                  </SelectItem>
                                ))}
                            </SelectContent>
                          </Select>
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
                                <SelectValue placeholder="Selecciona prioridad" />
                              </SelectTrigger>
                            </FormControl>
                            <SelectContent>
                              <SelectItem value="baja">Baja</SelectItem>
                              <SelectItem value="media">Media</SelectItem>
                              <SelectItem value="alta">Alta</SelectItem>
                            </SelectContent>
                          </Select>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="fechaLimite"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Fecha límite (opcional)</FormLabel>
                        <FormControl>
                          <Input type="date" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="submit" className="bg-asram hover:bg-asram-700">Asignar tarea</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Cargando tareas...</p>
          ) : tareas.length === 0 ? (
            <p className="text-center py-4">No hay tareas asignadas</p>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-12">Estado</TableHead>
                  <TableHead>Tarea</TableHead>
                  <TableHead>Voluntario</TableHead>
                  <TableHead>Prioridad</TableHead>
                  <TableHead>Fecha Límite</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {tareas.map((tarea) => (
                  <TableRow key={tarea.id} className={tarea.completada ? "bg-gray-50" : ""}>
                    <TableCell>
                      <Checkbox 
                        checked={tarea.completada}
                        onCheckedChange={(checked) => handleToggleCompletada(tarea.id, !!checked)}
                      />
                    </TableCell>
                    <TableCell className={tarea.completada ? "line-through text-gray-500" : ""}>
                      <div className="font-medium">{tarea.titulo}</div>
                      <div className="text-sm text-gray-500 truncate max-w-[200px]">
                        {tarea.descripcion}
                      </div>
                    </TableCell>
                    <TableCell>{tarea.voluntarioNombre}</TableCell>
                    <TableCell>
                      <span className={prioridadClass(tarea.prioridad)}>
                        {prioridadLabels[tarea.prioridad]}
                      </span>
                    </TableCell>
                    <TableCell>
                      {tarea.fechaLimite ? new Date(tarea.fechaLimite).toLocaleDateString() : "-"}
                    </TableCell>
                    <TableCell className="text-right">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => deleteTarea(tarea.id)}
                        className="text-red-500 hover:text-red-700"
                      >
                        Eliminar
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleCompletarTarea(tarea.id)}
                        className="text-green-500 hover:text-green-700"
                      >
                        Completar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
        <CardFooter className="border-t bg-gray-50 flex justify-between items-center p-4">
          <div className="text-sm text-gray-500">
            <span className="font-medium">{tareas.filter(t => t.completada).length}</span> de <span className="font-medium">{tareas.length}</span> tareas completadas
          </div>
          <div className="flex items-center gap-2">
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => tareas
                .filter(t => t.completada)
                .forEach(t => deleteTarea(t.id))
              }
              className="text-gray-700"
              disabled={tareas.filter(t => t.completada).length === 0}
            >
              Limpiar completadas
            </Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AsignacionTareas;

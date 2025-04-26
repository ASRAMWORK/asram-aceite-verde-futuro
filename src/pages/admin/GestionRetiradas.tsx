
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useUsuarios } from "@/hooks/useUsuarios";
import { usePuntosVerdes } from "@/hooks/usePuntosVerdes";
import { useRecogidas } from "@/hooks/useRecogidas";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { CalendarIcon, Loader2, Search, Truck, MapPin, Building, User, Phone, Calendar as CalendarIcon2 } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { distritos, getBarriosByDistrito } from "@/data/madridDistritos";
import { es } from "date-fns/locale";
import { toast } from "sonner";

const formSchema = z.object({
  clienteId: z.string().optional(),
  nombreLugar: z.string().min(2, "El nombre es obligatorio"),
  direccion: z.string().min(5, "La dirección es obligatoria"),
  distrito: z.string().min(2, "El distrito es obligatorio"),
  barrio: z.string().min(2, "El barrio es obligatorio"),
  telefono: z.string().min(9, "El teléfono debe tener al menos 9 dígitos").optional(),
  fechaProgramada: z.date(),
  hora: z.string().min(5, "La hora es obligatoria"),
  litrosEstimados: z.number().min(1, "Los litros estimados son obligatorios"),
  observaciones: z.string().optional(),
});

type FormValues = z.infer<typeof formSchema>;

const GestionRetiradas = () => {
  const { usuarios, loading: loadingUsuarios } = useUsuarios();
  const { puntosVerdes, loading: loadingPuntos } = usePuntosVerdes();
  const { recogidas, addRecogida, deleteRecogida, updateRecogida, loading: loadingRecogidas } = useRecogidas();
  
  const [isAddingRecogida, setIsAddingRecogida] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterDistrito, setFilterDistrito] = useState("");
  const [filteredBarrios, setFilteredBarrios] = useState<string[]>([]);
  const [clienteSeleccionado, setClienteSeleccionado] = useState<any>(null);
  
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombreLugar: "",
      direccion: "",
      distrito: "",
      barrio: "",
      telefono: "",
      litrosEstimados: 0,
      observaciones: "",
    },
  });
  
  // Filtrar recogidas por término de búsqueda y distrito
  const filteredRecogidas = recogidas
    .filter(r => {
      if (searchTerm) {
        return (
          r.nombreLugar?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.direccion?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.distrito?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.barrio?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          r.telefono?.toLowerCase().includes(searchTerm.toLowerCase())
        );
      }
      return true;
    })
    .filter(r => {
      if (filterDistrito) {
        return r.distrito === filterDistrito;
      }
      return true;
    })
    .sort((a, b) => {
      // Ordenar por fecha programada
      const dateA = a.fechaProgramada ? new Date(a.fechaProgramada) : new Date(0);
      const dateB = b.fechaProgramada ? new Date(b.fechaProgramada) : new Date(0);
      return dateA.getTime() - dateB.getTime();
    });
  
  // Pending recogidas
  const pendingRecogidas = filteredRecogidas.filter(r => r.estado !== 'realizada' && r.estado !== 'cancelada');
  
  // Completed recogidas
  const completedRecogidas = filteredRecogidas.filter(r => r.estado === 'realizada');
  
  const handleDistritoChange = (distrito: string) => {
    form.setValue("distrito", distrito);
    form.setValue("barrio", "");
    
    const barriosDelDistrito = getBarriosByDistrito(distrito);
    setFilteredBarrios(barriosDelDistrito);
  };
  
  const handleClienteSelect = (usuarioId: string) => {
    const cliente = usuarios.find(u => u.id === usuarioId);
    if (cliente) {
      setClienteSeleccionado(cliente);
      
      form.setValue("clienteId", cliente.id);
      form.setValue("nombreLugar", cliente.nombre || "");
      form.setValue("direccion", cliente.direccion || "");
      form.setValue("distrito", cliente.distrito || "");
      form.setValue("telefono", cliente.telefono || "");
      
      // Update barrios if distrito exists
      if (cliente.distrito) {
        const barriosDelDistrito = getBarriosByDistrito(cliente.distrito);
        setFilteredBarrios(barriosDelDistrito);
        form.setValue("barrio", cliente.barrio || "");
      }
      
      // Set litros estimados if available
      if (cliente.litrosEstimados) {
        form.setValue("litrosEstimados", cliente.litrosEstimados);
      }
    }
  };
  
  const handleResetForm = () => {
    form.reset({
      nombreLugar: "",
      direccion: "",
      distrito: "",
      barrio: "",
      telefono: "",
      litrosEstimados: 0,
      observaciones: "",
    });
    setClienteSeleccionado(null);
    setFilteredBarrios([]);
  };
  
  const onSubmit = async (data: FormValues) => {
    try {
      const recogidaData = {
        ...data,
        estado: 'pendiente' as const,
        fechaSolicitud: new Date(),
        tipo: 'individual' as const,
      };
      
      await addRecogida(recogidaData);
      setIsAddingRecogida(false);
      handleResetForm();
      toast.success("Recogida programada correctamente");
    } catch (error) {
      console.error("Error al programar recogida:", error);
      toast.error("Error al programar la recogida");
    }
  };
  
  const handleMarkAsCompleted = async (recogidaId: string) => {
    try {
      await updateRecogida(recogidaId, {
        estado: 'realizada',
        fechaCompletada: new Date()
      });
      toast.success("Recogida marcada como completada");
    } catch (error) {
      console.error("Error al actualizar recogida:", error);
      toast.error("Error al actualizar la recogida");
    }
  };
  
  const handleCancelRecogida = async (recogidaId: string) => {
    try {
      if (window.confirm("¿Estás seguro de que quieres cancelar esta recogida?")) {
        await updateRecogida(recogidaId, {
          estado: 'cancelada'
        });
        toast.success("Recogida cancelada correctamente");
      }
    } catch (error) {
      console.error("Error al cancelar recogida:", error);
      toast.error("Error al cancelar la recogida");
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Retiradas</h2>
          <p className="text-muted-foreground">
            Programa y gestiona las retiradas de contenedores
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <Button 
            className="bg-asram hover:bg-asram-700"
            onClick={() => setIsAddingRecogida(true)}
          >
            <Truck className="mr-2 h-4 w-4" />
            Programar Retirada
          </Button>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="bg-gradient-to-br from-blue-50 to-white border-l-4 border-l-blue-600">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-blue-800">
                Retiradas Pendientes
              </CardTitle>
              <div className="p-2 bg-blue-100 rounded-full">
                <Truck className="h-5 w-5 text-blue-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">
              {pendingRecogidas.length}
            </div>
            <p className="text-sm text-blue-800/70 mt-1">
              retiradas programadas pendientes
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-green-50 to-white border-l-4 border-l-green-600">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-green-800">
                Retiradas Completadas
              </CardTitle>
              <div className="p-2 bg-green-100 rounded-full">
                <MapPin className="h-5 w-5 text-green-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">
              {completedRecogidas.length}
            </div>
            <p className="text-sm text-green-800/70 mt-1">
              retiradas realizadas con éxito
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-amber-50 to-white border-l-4 border-l-amber-600">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium text-amber-800">
                Litros Estimados
              </CardTitle>
              <div className="p-2 bg-amber-100 rounded-full">
                <Building className="h-5 w-5 text-amber-600" />
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-amber-600">
              {pendingRecogidas.reduce((acc, r) => acc + (r.litrosEstimados || 0), 0)} L
            </div>
            <p className="text-sm text-amber-800/70 mt-1">
              litros estimados por recoger
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
            <div>
              <CardTitle>Retiradas pendientes</CardTitle>
              <CardDescription>
                Listado de todas las retiradas programadas pendientes
              </CardDescription>
            </div>
            <div className="flex flex-col sm:flex-row gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Buscar retiradas..."
                  className="pl-8 w-full md:w-[250px]"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <Select value={filterDistrito} onValueChange={setFilterDistrito}>
                <SelectTrigger className="w-full md:w-[180px]">
                  <SelectValue placeholder="Filtrar por distrito" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="">Todos los distritos</SelectItem>
                  {distritos.map(distrito => (
                    <SelectItem key={distrito} value={distrito}>{distrito}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          {loadingRecogidas ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : pendingRecogidas.length === 0 ? (
            <div className="text-center p-8 border rounded-md bg-muted/10">
              <Truck className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-1">No hay retiradas pendientes</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Programa una nueva retirada para que aparezca en este listado
              </p>
              <Button
                variant="outline"
                onClick={() => setIsAddingRecogida(true)}
              >
                <Truck className="mr-2 h-4 w-4" />
                Programar Retirada
              </Button>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[25%]">Cliente/Lugar</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Distrito</TableHead>
                    <TableHead>Fecha</TableHead>
                    <TableHead>Hora</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Litros</TableHead>
                    <TableHead className="text-right">Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {pendingRecogidas.map((recogida) => (
                    <TableRow key={recogida.id} className="hover:bg-muted/20">
                      <TableCell className="font-medium">{recogida.nombreLugar}</TableCell>
                      <TableCell>{recogida.direccion}</TableCell>
                      <TableCell>{recogida.distrito} / {recogida.barrio}</TableCell>
                      <TableCell>
                        {recogida.fechaProgramada
                          ? new Date(recogida.fechaProgramada).toLocaleDateString()
                          : "No programada"}
                      </TableCell>
                      <TableCell>{recogida.hora || "-"}</TableCell>
                      <TableCell>
                        <Badge
                          className={
                            recogida.estado === 'pendiente' 
                              ? 'bg-blue-100 text-blue-800 hover:bg-blue-200'
                              : recogida.estado === 'programado'
                              ? 'bg-amber-100 text-amber-800 hover:bg-amber-200'
                              : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                          }
                        >
                          {recogida.estado}
                        </Badge>
                      </TableCell>
                      <TableCell>{recogida.litrosEstimados || 0} L</TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-green-600 hover:text-green-700 hover:bg-green-50"
                            onClick={() => handleMarkAsCompleted(recogida.id)}
                          >
                            Completada
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            className="h-8 text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={() => handleCancelRecogida(recogida.id)}
                          >
                            Cancelar
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Retiradas completadas</CardTitle>
          <CardDescription>
            Historial de retiradas realizadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loadingRecogidas ? (
            <div className="flex items-center justify-center p-8">
              <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
            </div>
          ) : completedRecogidas.length === 0 ? (
            <div className="text-center p-8 border rounded-md bg-muted/10">
              <CalendarIcon2 className="h-12 w-12 mx-auto text-muted-foreground mb-3" />
              <h3 className="text-lg font-medium mb-1">No hay retiradas completadas</h3>
              <p className="text-sm text-muted-foreground">
                Las retiradas completadas aparecerán aquí
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow className="bg-muted/50">
                    <TableHead className="w-[25%]">Cliente/Lugar</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Fecha realizada</TableHead>
                    <TableHead>Litros recogidos</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {completedRecogidas.map((recogida) => (
                    <TableRow key={recogida.id} className="hover:bg-muted/20">
                      <TableCell className="font-medium">{recogida.nombreLugar}</TableCell>
                      <TableCell>{recogida.direccion}</TableCell>
                      <TableCell>
                        {recogida.fechaCompletada
                          ? new Date(recogida.fechaCompletada).toLocaleDateString()
                          : new Date(recogida.fechaProgramada || "").toLocaleDateString()}
                      </TableCell>
                      <TableCell>{recogida.litrosRecogidos || recogida.litrosEstimados || 0} L</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
      
      {/* Dialog para añadir recogida */}
      <Dialog open={isAddingRecogida} onOpenChange={setIsAddingRecogida}>
        <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Programar nueva retirada</DialogTitle>
            <DialogDescription>
              Completa los datos para programar una nueva retirada de contenedores
            </DialogDescription>
          </DialogHeader>
          
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <div className="space-y-4">
                <div className="border rounded-md p-4 bg-muted/20">
                  <h4 className="font-medium mb-2 flex items-center">
                    <User className="h-4 w-4 mr-2" />
                    Seleccionar cliente existente (opcional)
                  </h4>
                  
                  <Select onValueChange={handleClienteSelect}>
                    <SelectTrigger>
                      <SelectValue placeholder="Buscar cliente" />
                    </SelectTrigger>
                    <SelectContent>
                      {loadingUsuarios ? (
                        <div className="flex items-center justify-center p-2">
                          <Loader2 className="h-4 w-4 animate-spin" />
                        </div>
                      ) : (
                        usuarios
                          .filter(u => u.activo)
                          .map(usuario => (
                            <SelectItem key={usuario.id} value={usuario.id}>
                              {usuario.nombre} - {usuario.direccion || "Sin dirección"}
                            </SelectItem>
                          ))
                      )}
                    </SelectContent>
                  </Select>
                  
                  {clienteSeleccionado && (
                    <div className="mt-2 p-2 bg-blue-50 rounded text-sm flex justify-between">
                      <div>
                        Cliente seleccionado: <span className="font-medium">{clienteSeleccionado.nombre}</span>
                      </div>
                      <Button 
                        variant="ghost" 
                        size="sm"
                        className="h-auto p-0 text-red-500 hover:text-red-700"
                        type="button"
                        onClick={() => {
                          setClienteSeleccionado(null);
                          form.setValue("clienteId", undefined);
                        }}
                      >
                        Quitar
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nombreLugar"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del lugar*</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: Comunidad Los Pinos" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono de contacto</FormLabel>
                        <FormControl>
                          <Input placeholder="Ej: 912345678" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="direccion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección completa*</FormLabel>
                      <FormControl>
                        <Input placeholder="Ej: Calle Gran Vía 1" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="distrito"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Distrito*</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={(value) => handleDistritoChange(value)}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona distrito" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {distritos.map(distrito => (
                              <SelectItem key={distrito} value={distrito}>
                                {distrito}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="barrio"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Barrio*</FormLabel>
                        <Select
                          value={field.value}
                          onValueChange={field.onChange}
                          disabled={!form.getValues("distrito")}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona barrio" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {filteredBarrios.map(barrio => (
                              <SelectItem key={barrio} value={barrio}>
                                {barrio}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="fechaProgramada"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Fecha de recogida*</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "PPP", { locale: es })
                                ) : (
                                  <span>Selecciona una fecha</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date < new Date(new Date().setHours(0, 0, 0, 0))
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="hora"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Hora de recogida*</FormLabel>
                        <FormControl>
                          <Input type="time" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="litrosEstimados"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Litros estimados a recoger*</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min={1} 
                          {...field}
                          onChange={e => field.onChange(parseInt(e.target.value) || 0)} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="observaciones"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Observaciones</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Instrucciones específicas para la recogida..." 
                          className="min-h-[100px]" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <DialogFooter>
                <Button variant="outline" type="button" onClick={() => setIsAddingRecogida(false)}>
                  Cancelar
                </Button>
                <Button 
                  type="submit" 
                  className="bg-asram hover:bg-asram-700"
                >
                  Programar retirada
                </Button>
              </DialogFooter>
            </form>
          </Form>
          
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default GestionRetiradas;

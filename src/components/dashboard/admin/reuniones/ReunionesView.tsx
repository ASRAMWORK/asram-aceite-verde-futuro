
import React, { useState } from 'react';
import { useReuniones } from '@/hooks/useReuniones';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Calendar as CalendarIcon, List, Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import CalendarioReuniones from './CalendarioReuniones';

const ReunionesView = () => {
  const { reuniones, loading, addReunion, deleteReunion } = useReuniones();
  const [open, setOpen] = useState(false);
  const [activeView, setActiveView] = useState('calendario');
  
  const form = useForm({
    defaultValues: {
      titulo: '',
      descripcion: '',
      tipo: '',
      tipoUsuario: '',
      direccion: '',
      nombreCentro: '',
      responsable: '',
      telefono: '',
      email: '',
      fecha: new Date(),
      hora: '',
      duracion: 60,
      ubicacion: '',
      participantes: [],
    }
  });

  const onSubmit = async (data: any) => {
    try {
      await addReunion(data);
      setOpen(false);
      form.reset();
    } catch (error) {
      toast.error("Error al crear la reunión");
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Gestión de Reuniones y Eventos</h2>
          <p className="text-muted-foreground mt-1">Programa y gestiona las reuniones con comunidades y clientes</p>
        </div>
        
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Reunión
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-lg">
            <DialogHeader>
              <DialogTitle>Agendar Nueva Reunión</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tipo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Reunión/Evento</FormLabel>
                        <FormControl>
                          <Input placeholder="Tipo de reunión" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="tipoUsuario"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Usuario</FormLabel>
                        <FormControl>
                          <Input placeholder="Tipo de usuario" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="direccion"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Dirección</FormLabel>
                      <FormControl>
                        <Input placeholder="Dirección" {...field} />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nombreCentro"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre del Centro</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre del centro" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="responsable"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Persona Responsable</FormLabel>
                        <FormControl>
                          <Input placeholder="Nombre del responsable" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="telefono"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Teléfono de Contacto</FormLabel>
                        <FormControl>
                          <Input type="tel" placeholder="Teléfono" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Correo Electrónico</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="Email" {...field} />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="fecha"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Fecha</FormLabel>
                      <FormControl>
                        <DatePickerWithRange 
                          value={{ from: field.value, to: field.value }}
                          onChange={(range) => field.onChange(range?.from)}
                        />
                      </FormControl>
                    </FormItem>
                  )}
                />
                
                <div className="flex justify-end gap-2">
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      Cancelar
                    </Button>
                  </DialogClose>
                  <Button type="submit">Guardar</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeView} onValueChange={setActiveView} className="w-full">
        <TabsList className="grid w-[400px] grid-cols-2">
          <TabsTrigger value="calendario" className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            Vista Calendario
          </TabsTrigger>
          <TabsTrigger value="lista" className="flex items-center gap-2">
            <List className="h-4 w-4" />
            Vista Lista
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="calendario" className="mt-4">
          <CalendarioReuniones />
        </TabsContent>
        
        <TabsContent value="lista" className="mt-4">
          <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
            {reuniones.map((reunion) => (
              <Card key={reunion.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <CardTitle className="text-lg">{reunion.titulo || reunion.tipo}</CardTitle>
                  <p className="text-sm text-muted-foreground flex items-center mt-1">
                    <CalendarIcon className="h-4 w-4 mr-1" />
                    {reunion.fecha instanceof Date 
                      ? reunion.fecha.toLocaleDateString() 
                      : new Date(reunion.fecha).toLocaleDateString()}
                  </p>
                </CardHeader>
                <CardContent className="space-y-2">
                  {reunion.tipoUsuario && <p className="text-sm"><strong>Tipo:</strong> {reunion.tipoUsuario}</p>}
                  {reunion.nombreCentro && <p className="text-sm"><strong>Centro:</strong> {reunion.nombreCentro}</p>}
                  {reunion.responsable && <p className="text-sm"><strong>Responsable:</strong> {reunion.responsable}</p>}
                  {reunion.direccion && <p className="text-sm"><strong>Dirección:</strong> {reunion.direccion}</p>}
                  {reunion.telefono && <p className="text-sm"><strong>Teléfono:</strong> {reunion.telefono}</p>}
                  {reunion.email && <p className="text-sm"><strong>Email:</strong> {reunion.email}</p>}
                  
                  <Button 
                    variant="destructive" 
                    size="sm" 
                    className="mt-4 w-full"
                    onClick={() => deleteReunion(reunion.id)}
                  >
                    Eliminar
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default ReunionesView;

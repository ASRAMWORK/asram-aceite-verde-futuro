
import React from 'react';
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
} from "@/components/ui/dialog";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { Plus } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

const ReunionesView = () => {
  const { reuniones, loading, addReunion, deleteReunion } = useReuniones();
  const [open, setOpen] = React.useState(false);
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
    return <div>Cargando...</div>;
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Reuniones</h2>
        <Dialog open={open} onOpenChange={setOpen}>
          <DialogTrigger asChild>
            <Button>
              <Plus className="h-4 w-4 mr-2" />
              Nueva Reunión
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Agendar Nueva Reunión</DialogTitle>
            </DialogHeader>
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
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
                  <Button type="button" variant="outline" onClick={() => setOpen(false)}>
                    Cancelar
                  </Button>
                  <Button type="submit">Guardar</Button>
                </div>
              </form>
            </Form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid gap-4 grid-cols-1 md:grid-cols-2 lg:grid-cols-3">
        {reuniones.map((reunion) => (
          <Card key={reunion.id}>
            <CardHeader>
              <CardTitle>{reunion.titulo || reunion.tipo}</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {reunion.tipoUsuario && <p><strong>Tipo de Usuario:</strong> {reunion.tipoUsuario}</p>}
              {reunion.nombreCentro && <p><strong>Centro:</strong> {reunion.nombreCentro}</p>}
              {reunion.responsable && <p><strong>Responsable:</strong> {reunion.responsable}</p>}
              {reunion.direccion && <p><strong>Dirección:</strong> {reunion.direccion}</p>}
              {reunion.telefono && <p><strong>Teléfono:</strong> {reunion.telefono}</p>}
              {reunion.email && <p><strong>Email:</strong> {reunion.email}</p>}
              <p><strong>Fecha:</strong> {reunion.fecha instanceof Date ? reunion.fecha.toLocaleString() : new Date(reunion.fecha).toLocaleString()}</p>
              <Button 
                variant="destructive" 
                size="sm" 
                className="mt-4"
                onClick={() => deleteReunion(reunion.id)}
              >
                Eliminar
              </Button>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ReunionesView;

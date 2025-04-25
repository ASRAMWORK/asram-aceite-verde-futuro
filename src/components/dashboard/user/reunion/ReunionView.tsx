
import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from '@/components/ui/select';
import {
  Popover,
  PopoverContent,
  PopoverTrigger
} from '@/components/ui/popover';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { toast } from 'sonner';
import { CalendarIcon, Check } from 'lucide-react';

const ReunionView = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  
  const form = useForm({
    defaultValues: {
      tipo: '',
      tipoUsuario: '',
      direccion: '',
      nombreCentro: '',
      responsable: '',
      telefono: '',
      email: '',
      fecha: undefined,
      mensaje: ''
    }
  });
  
  const onSubmit = async (data: any) => {
    setIsSubmitting(true);
    
    try {
      // Simulating API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      console.log('Submitted meeting request:', data);
      setIsSuccess(true);
      toast.success('Solicitud enviada correctamente');
      form.reset();
    } catch (error) {
      console.error('Error submitting meeting request:', error);
      toast.error('Error al enviar la solicitud');
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Card className="w-full max-w-md">
          <CardHeader>
            <div className="mx-auto bg-green-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
              <Check className="h-8 w-8 text-green-600" />
            </div>
            <CardTitle className="text-center">¡Solicitud Recibida!</CardTitle>
            <CardDescription className="text-center">
              Hemos recibido tu solicitud de reunión correctamente
            </CardDescription>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-muted-foreground mb-6">
              Nuestro equipo revisará tu solicitud y se pondrá en contacto contigo
              a la mayor brevedad posible para confirmar los detalles.
            </p>
          </CardContent>
          <CardFooter>
            <Button 
              className="w-full bg-asram hover:bg-asram-700"
              onClick={() => setIsSuccess(false)}
            >
              Solicitar otra reunión
            </Button>
          </CardFooter>
        </Card>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto">
      <h3 className="text-2xl font-bold mb-1">Solicitar Reunión</h3>
      <p className="text-muted-foreground mb-6">
        Completa el formulario para agendar una reunión con el equipo de ASRAM
      </p>
      
      <Card>
        <CardHeader>
          <CardTitle>Formulario de solicitud</CardTitle>
          <CardDescription>
            Proporciona la información necesaria para coordinar una reunión o evento
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
              <FormField
                control={form.control}
                name="tipo"
                rules={{ required: "Este campo es obligatorio" }}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Reunión/Evento</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona el tipo de reunión" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="informativa">Reunión Informativa</SelectItem>
                        <SelectItem value="presentacion">Presentación de Servicios</SelectItem>
                        <SelectItem value="taller">Taller o Formación</SelectItem>
                        <SelectItem value="consulta">Consulta Técnica</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="tipoUsuario"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tipo de Usuario</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tu tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="comunidad">Comunidad de Vecinos</SelectItem>
                        <SelectItem value="empresa">Empresa</SelectItem>
                        <SelectItem value="escolar">Centro Educativo</SelectItem>
                        <SelectItem value="particular">Particular</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="nombreCentro"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Nombre del Centro/Organización</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre del centro u organización" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="responsable"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Persona de Contacto</FormLabel>
                      <FormControl>
                        <Input placeholder="Nombre completo" {...field} />
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
                    <FormLabel>Dirección</FormLabel>
                    <FormControl>
                      <Input placeholder="Dirección completa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
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
                      <FormMessage />
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
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <FormField
                control={form.control}
                name="fecha"
                rules={{ required: "La fecha es obligatoria" }}
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha preferida</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className={`w-full pl-3 text-left font-normal ${!field.value && "text-muted-foreground"}`}
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
                          disabled={(date) => date < new Date()}
                          initialFocus
                        />
                      </PopoverContent>
                    </Popover>
                    <FormMessage />
                    <FormDescription>
                      Haremos lo posible por adaptarnos a esta fecha
                    </FormDescription>
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="mensaje"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Mensaje adicional</FormLabel>
                    <FormControl>
                      <Textarea 
                        placeholder="Proporciona más detalles sobre el motivo de la reunión" 
                        className="min-h-[100px]"
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="submit" 
                className="w-full bg-asram hover:bg-asram-700"
                disabled={isSubmitting}
              >
                {isSubmitting ? "Enviando..." : "Solicitar Reunión"}
              </Button>
            </form>
          </Form>
        </CardContent>
      </Card>
    </div>
  );
};

export default ReunionView;

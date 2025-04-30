
import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { auth, db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp, doc, getDoc } from 'firebase/firestore';
import { toast } from 'sonner';
import { useUserProfile } from '@/hooks/useUserProfile';

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, MapPin, Phone, Loader2 } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

const formSchema = z.object({
  litrosEstimados: z.coerce.number().min(1, {
    message: 'Ingresa al menos 1 litro.',
  }),
  fechaDeseada: z.date({
    required_error: 'Por favor selecciona una fecha.',
  }),
  direccion: z.string().min(5, {
    message: 'La dirección debe tener al menos 5 caracteres.',
  }),
  telefono: z.string().min(9, {
    message: 'Introduce un número de teléfono válido.',
  }),
  notas: z.string().optional(),
});

interface SolicitudRecogidaFormProps {
  onCancel?: () => void;
  onSuccess?: () => void;
  initialData?: {
    direccion?: string;
    distrito?: string;
    barrio?: string;
    telefono?: string;
    email?: string;
    nombre?: string;
    clienteId?: string;
  };
}

const SolicitudRecogidaForm = ({ onCancel, onSuccess, initialData = {} }: SolicitudRecogidaFormProps) => {
  const { profile, loading } = useUserProfile();
  const [submitting, setSubmitting] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      litrosEstimados: 5,
      direccion: initialData.direccion || '',
      telefono: initialData.telefono || '',
      notas: '',
    },
  });

  // Prellenar la dirección y teléfono cuando se cargue el perfil
  useEffect(() => {
    if (profile) {
      form.setValue('direccion', initialData.direccion || profile.direccion || '');
      form.setValue('telefono', initialData.telefono || profile.telefono || '');
    }
  }, [profile, form, initialData]);

  // Función para enviar correo electrónico de notificación
  const enviarCorreoNotificacion = async (data: any) => {
    try {
      // Creamos el contenido del correo
      const asunto = `Nueva solicitud de recogida de aceite - ${profile?.nombre || 'Cliente'}`;
      const cuerpo = `
        Nueva solicitud de recogida recibida:
        
        Cliente: ${profile?.nombre || ''} ${profile?.apellidos || ''}
        Email: ${profile?.email || ''}
        Teléfono: ${data.telefono}
        Dirección: ${data.direccion}
        Distrito: ${profile?.distrito || 'No especificado'}
        Barrio: ${profile?.barrio || 'No especificado'}
        Litros estimados: ${data.litrosEstimados}
        Fecha deseada: ${format(data.fechaDeseada, 'dd/MM/yyyy', { locale: es })}
        Notas: ${data.notas || 'Ninguna'}
        
        Fecha de solicitud: ${format(new Date(), 'dd/MM/yyyy HH:mm', { locale: es })}
      `;
      
      // Guarda la información del correo en Firestore para su posterior envío
      // En una aplicación real, aquí utilizaríamos una Cloud Function para enviar el correo
      await addDoc(collection(db, 'emailNotifications'), {
        to: 'info@asramadrid.com',
        from: profile?.email || 'noreply@asramadrid.com',
        subject: asunto,
        text: cuerpo,
        createdAt: serverTimestamp(),
        status: 'pending'
      });
      
      console.log('Notificación de correo programada');
    } catch (error) {
      console.error('Error al programar la notificación por correo:', error);
    }
  };

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setSubmitting(true);
      const user = auth.currentUser;
      
      if (!user) {
        toast.error('Debes iniciar sesión para solicitar una recogida');
        setSubmitting(false);
        return;
      }
      
      // Guardar la solicitud en Firestore
      const docRef = await addDoc(collection(db, 'solicitudesRecogida'), {
        userId: user.uid,
        userEmail: user.email,
        nombre: profile?.nombre || '',
        apellidos: profile?.apellidos || '',
        litrosEstimados: values.litrosEstimados,
        fechaDeseada: values.fechaDeseada,
        direccion: values.direccion,
        telefono: values.telefono,
        notas: values.notas,
        distrito: profile?.distrito || '',
        barrio: profile?.barrio || '',
        estado: 'pendiente',
        createdAt: serverTimestamp(),
      });
      
      // Enviar notificación por correo
      await enviarCorreoNotificacion(values);
      
      toast.success('Solicitud de recogida enviada correctamente');
      form.reset({
        litrosEstimados: 5,
        fechaDeseada: undefined,
        direccion: profile?.direccion || '',
        telefono: profile?.telefono || '',
        notas: '',
      });
      
      if (onSuccess) {
        onSuccess();
      }
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      toast.error('Error al enviar la solicitud. Inténtalo de nuevo.');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center p-6">
        <p className="text-muted-foreground">Cargando datos de contacto...</p>
      </div>
    );
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="litrosEstimados"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Litros estimados</FormLabel>
              <FormControl>
                <Input type="number" placeholder="5" {...field} />
              </FormControl>
              <FormDescription>
                Cantidad aproximada de aceite usado que tienes para reciclar
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="direccion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección de recogida</FormLabel>
                <FormControl>
                  <div className="flex items-center space-x-2">
                    <MapPin className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Dirección completa" {...field} />
                  </div>
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
                  <div className="flex items-center space-x-2">
                    <Phone className="h-4 w-4 text-muted-foreground" />
                    <Input placeholder="Teléfono" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="fechaDeseada"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha deseada para la recogida</FormLabel>
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
                    disabled={(date) => date < new Date() || date > new Date(new Date().setMonth(new Date().getMonth() + 3))}
                    initialFocus
                    locale={es}
                  />
                </PopoverContent>
              </Popover>
              <FormDescription>
                Selecciona una fecha en los próximos 3 meses
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="notas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas adicionales</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Información adicional para la recogida (opcional)" 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormDescription>
                Indica cualquier información relevante para la recogida
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <Card className="bg-green-50 border-green-200">
          <CardContent className="p-4 text-sm text-green-800">
            <p>Confirma que la dirección y teléfono son correctos antes de enviar la solicitud. Recibirás un correo de confirmación cuando tu solicitud sea procesada.</p>
          </CardContent>
        </Card>
        
        <div className="flex gap-2">
          {onCancel && (
            <Button 
              type="button" 
              variant="outline" 
              className="w-full" 
              onClick={onCancel}
              disabled={submitting}
            >
              Cancelar
            </Button>
          )}
          <Button 
            type="submit" 
            className="w-full bg-gradient-to-r from-[#ee970d] to-amber-500 hover:from-amber-500 hover:to-[#ee970d]"
            disabled={submitting}
          >
            {submitting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Enviando...
              </>
            ) : (
              'Enviar solicitud'
            )}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default SolicitudRecogidaForm;


import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { auth, db } from '@/lib/firebase';
import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { toast } from 'sonner';

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
import { CalendarIcon } from 'lucide-react';

const formSchema = z.object({
  litrosEstimados: z.coerce.number().min(1, {
    message: 'Ingresa al menos 1 litro.',
  }),
  fechaDeseada: z.date({
    required_error: 'Por favor selecciona una fecha.',
  }),
  notas: z.string().optional(),
});

const SolicitudRecogidaForm = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      litrosEstimados: 5,
      notas: '',
    },
  });

  const onSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      const user = auth.currentUser;
      
      if (!user) {
        toast.error('Debes iniciar sesión para solicitar una recogida');
        return;
      }
      
      await addDoc(collection(db, 'solicitudesRecogida'), {
        userId: user.uid,
        userEmail: user.email,
        litrosEstimados: values.litrosEstimados,
        fechaDeseada: values.fechaDeseada,
        notas: values.notas,
        estado: 'pendiente',
        createdAt: serverTimestamp(),
      });
      
      toast.success('Solicitud de recogida enviada correctamente');
      form.reset({
        litrosEstimados: 5,
        fechaDeseada: undefined,
        notas: '',
      });
    } catch (error) {
      console.error('Error al enviar la solicitud:', error);
      toast.error('Error al enviar la solicitud. Inténtalo de nuevo.');
    }
  };

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
        
        <Button type="submit" className="w-full bg-asram hover:bg-asram-700">
          Enviar solicitud
        </Button>
      </form>
    </Form>
  );
};

export default SolicitudRecogidaForm;

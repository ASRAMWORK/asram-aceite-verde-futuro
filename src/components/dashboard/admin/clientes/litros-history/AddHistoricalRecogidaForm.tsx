
import React, { useState } from 'react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogTrigger,
  DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CalendarIcon, Plus } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { Usuario } from '@/types';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

// Define the schema for the form
const formSchema = z.object({
  fecha: z.date({
    required_error: "La fecha es requerida",
  }),
  litros: z.coerce.number()
    .min(1, "Debes ingresar al menos 1 litro")
    .max(1000, "Cantidad máxima excedida")
});

interface AddHistoricalRecogidaFormProps {
  cliente: Usuario;
  onAddRecogida: (fecha: Date, litros: number) => Promise<void>;
}

const AddHistoricalRecogidaForm: React.FC<AddHistoricalRecogidaFormProps> = ({ 
  cliente, 
  onAddRecogida 
}) => {
  const [open, setOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Initialize the form with react-hook-form and zod resolver
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fecha: new Date(),
      litros: 5,
    },
  });

  const handleSubmit = async (values: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      console.log("Añadiendo recogida histórica:", { cliente: cliente.id, ...values });
      await onAddRecogida(values.fecha, values.litros);
      form.reset();
      setOpen(false);
      toast.success("Recogida histórica añadida correctamente");
    } catch (error) {
      console.error("Error adding historical recogida:", error);
      toast.error("Error al añadir la recogida histórica");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="ml-auto">
          <Plus className="mr-1 h-4 w-4" /> 
          Añadir recogida histórica
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Añadir recogida histórica</DialogTitle>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
            <FormField
              control={form.control}
              name="fecha"
              render={({ field }) => (
                <FormItem className="flex flex-col">
                  <FormLabel>Fecha de recogida</FormLabel>
                  <Popover>
                    <PopoverTrigger asChild>
                      <FormControl>
                        <Button
                          variant="outline"
                          className={cn(
                            "w-full pl-3 text-left font-normal",
                            !field.value && "text-muted-foreground"
                          )}
                        >
                          {field.value ? (
                            format(field.value, "dd/MM/yyyy", { locale: es })
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
                        initialFocus
                        locale={es}
                      />
                    </PopoverContent>
                  </Popover>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="litros"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Litros recogidos</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      placeholder="5" 
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={() => setOpen(false)}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                disabled={isSubmitting}
              >
                {isSubmitting ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHistoricalRecogidaForm;

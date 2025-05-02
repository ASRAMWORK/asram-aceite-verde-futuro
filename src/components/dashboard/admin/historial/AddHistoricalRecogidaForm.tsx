
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Plus, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import type { Usuario } from '@/types';
import { toast } from 'sonner';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { cn } from '@/lib/utils';

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
  onAddRecogida: (date: Date, litros: number) => Promise<void>;
}

const AddHistoricalRecogidaForm: React.FC<AddHistoricalRecogidaFormProps> = ({ 
  cliente, 
  onAddRecogida 
}) => {
  const [isAddingRecogida, setIsAddingRecogida] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Initialize the form with react-hook-form
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      fecha: new Date(),
      litros: 5,
    },
  });

  const handleAddHistoricalCollection = async (values: z.infer<typeof formSchema>) => {
    if (!cliente?.id) {
      toast.error("No se pueden añadir recolecciones a este cliente. Falta ID de cliente.");
      return;
    }
    
    if (values.litros <= 0) {
      toast.error("Por favor, introduce una cantidad válida de litros");
      return;
    }
    
    setIsLoading(true);
    try {
      await onAddRecogida(values.fecha, values.litros);
      setIsAddingRecogida(false);
      form.reset();
      toast.success("Recogida histórica añadida correctamente");
    } catch (error) {
      console.error("Error adding historical collection:", error);
      toast.error("Error al añadir la recolección histórica");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={isAddingRecogida} onOpenChange={setIsAddingRecogida}>
      <DialogTrigger asChild>
        <Button className="bg-[#EE970D] hover:bg-[#d88400]">
          <Plus className="mr-2 h-4 w-4" />
          Añadir recolección histórica
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Añadir recolección histórica</DialogTitle>
          <DialogDescription>
            Registra una recolección anterior para {cliente?.nombre || "este cliente"}.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleAddHistoricalCollection)} className="space-y-4">
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
                          <Calendar className="ml-auto h-4 w-4 opacity-50" />
                        </Button>
                      </FormControl>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={field.value}
                        onSelect={field.onChange}
                        initialFocus
                        className={cn("p-3 pointer-events-auto")}
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
                      min="0"
                      step="0.5"
                      {...field}
                      onChange={e => field.onChange(Number(e.target.value))}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <DialogFooter>
              <Button variant="outline" onClick={() => setIsAddingRecogida(false)}>
                Cancelar
              </Button>
              <Button 
                type="submit"
                disabled={isLoading}
                className="bg-[#EE970D] hover:bg-[#d88400]"
              >
                {isLoading ? "Guardando..." : "Guardar"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddHistoricalRecogidaForm;

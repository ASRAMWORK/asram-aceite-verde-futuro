
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon, MapPin } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";

const formSchema = z.object({
  nombre: z.string().min(3, "El nombre debe tener al menos 3 caracteres"),
  descripcion: z.string().min(10, "La descripción debe tener al menos 10 caracteres"),
  precio: z.coerce.number().nonnegative("El precio no puede ser negativo"),
  aforo: z.coerce.number().int().positive("El aforo debe ser un número positivo").optional(),
  fechaInicio: z.date(),
  fechaFin: z.date().optional(),
  horario: z.string(),
  ubicacion: z.string(),
  tipo: z.string().optional(),
  imagen: z.string().optional(),
  publico: z.string().optional(),
  activo: z.boolean().default(true),
});

type EventoFormProps = {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
};

const EventoForm = ({ initialData, onSubmit, onCancel }: EventoFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      nombre: "",
      descripcion: "",
      precio: 0,
      fechaInicio: new Date(),
      horario: "",
      ubicacion: "",
      activo: true,
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      // Here you would typically save to Firebase or your backend
      onSubmit(data);
      toast.success(initialData ? "Evento actualizado" : "Evento creado");
    } catch (error) {
      console.error("Error guardando evento:", error);
      toast.error("Error al guardar el evento");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="nombre"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre del evento</FormLabel>
              <FormControl>
                <Input placeholder="Feria de Economía Circular" {...field} />
              </FormControl>
              <FormMessage />
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
                  placeholder="Describe el evento y sus actividades..." 
                  className="resize-none h-24" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="precio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Precio (€)</FormLabel>
                <FormControl>
                  <Input type="number" step="0.01" {...field} />
                </FormControl>
                <FormDescription>
                  Usa 0 para eventos gratuitos
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="tipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de evento</FormLabel>
                <FormControl>
                  <Input placeholder="Feria, charla, exposición..." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fechaInicio"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de inicio</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
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
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="fechaFin"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de finalización (opcional)</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "dd/MM/yyyy")
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
                        date < new Date() || 
                        (form.getValues().fechaInicio && date < form.getValues().fechaInicio)
                      }
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Solo si el evento dura varios días
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="horario"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Horario</FormLabel>
              <FormControl>
                <Input placeholder="10:00 - 20:00" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="ubicacion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación</FormLabel>
              <FormControl>
                <div className="flex items-center">
                  <MapPin className="mr-2 h-4 w-4 text-gray-400" />
                  <Input placeholder="Madrid Río, Matadero Madrid..." {...field} />
                </div>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="aforo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Aforo máximo</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Dejarlo vacío si es ilimitado" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="publico"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Público objetivo</FormLabel>
              <FormControl>
                <Input placeholder="Todos los públicos, familias, adultos..." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="imagen"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de la imagen</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormDescription>
                Introduce la URL de la imagen para el evento
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="activo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Evento activo</FormLabel>
                <FormDescription>
                  El evento será visible en la tienda si está activo
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />

        <DialogFooter>
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Guardando..." : initialData ? "Actualizar" : "Crear"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default EventoForm;

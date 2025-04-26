
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
import { Calendar as CalendarIcon, Clock } from "lucide-react";
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
  precio: z.coerce.number().positive("El precio debe ser un número positivo"),
  plazasTotal: z.coerce.number().int().positive("El número de plazas debe ser positivo"),
  fecha: z.date(),
  horario: z.string(),
  ubicacion: z.string(),
  duracion: z.string(),
  materiales: z.string().optional(),
  edadRecomendada: z.string().optional(),
  imagen: z.string().optional(),
  activo: z.boolean().default(true),
});

type TallerFormProps = {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
};

const TallerForm = ({ initialData, onSubmit, onCancel }: TallerFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      nombre: "",
      descripcion: "",
      precio: 0,
      plazasTotal: 10,
      fecha: new Date(),
      horario: "",
      ubicacion: "",
      duracion: "",
      activo: true,
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      // Here you would typically save to Firebase or your backend
      onSubmit(data);
      toast.success(initialData ? "Taller actualizado" : "Taller creado");
    } catch (error) {
      console.error("Error guardando taller:", error);
      toast.error("Error al guardar el taller");
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
              <FormLabel>Nombre del taller</FormLabel>
              <FormControl>
                <Input placeholder="Taller de jabones ecológicos" {...field} />
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
                  placeholder="Describe el taller y sus objetivos..." 
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
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="plazasTotal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de plazas</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="fecha"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha del taller</FormLabel>
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="horario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horario</FormLabel>
                <FormControl>
                  <div className="flex items-center">
                    <Clock className="mr-2 h-4 w-4 text-gray-400" />
                    <Input placeholder="17:00 - 19:00" {...field} />
                  </div>
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="duracion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Duración</FormLabel>
                <FormControl>
                  <Input placeholder="2 horas" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="ubicacion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Ubicación</FormLabel>
              <FormControl>
                <Input placeholder="Centro ASRAM Madrid" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="materiales"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Materiales necesarios</FormLabel>
              <FormControl>
                <Input placeholder="Todo incluido en el precio" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="edadRecomendada"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Edad recomendada</FormLabel>
              <FormControl>
                <Input placeholder="A partir de 8 años" {...field} />
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
                Introduce la URL de la imagen para el taller
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
                <FormLabel className="text-base">Taller activo</FormLabel>
                <FormDescription>
                  El taller será visible en la tienda si está activo
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

export default TallerForm;

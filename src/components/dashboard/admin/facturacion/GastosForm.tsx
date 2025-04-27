import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { DialogFooter } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Gasto } from "@/types";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  proveedor: z.string().min(3, "El proveedor debe tener al menos 3 caracteres"),
  concepto: z.string().min(10, "El concepto debe tener al menos 10 caracteres"),
  cantidad: z.string().refine(value => !isNaN(parseFloat(value)), {
    message: "La cantidad debe ser un número",
  }),
  iva: z.string().refine(value => !isNaN(parseFloat(value)), {
    message: "El IVA debe ser un número",
  }),
  total: z.string().refine(value => !isNaN(parseFloat(value)), {
    message: "El total debe ser un número",
  }),
  metodoPago: z.string().min(3, "El método de pago debe tener al menos 3 caracteres"),
  notas: z.string().optional(),
  fecha: z.date(),
  categoria: z.string().optional(),
  estado: z.string().optional(),
  tipo: z.string().optional(),
});

type GastoFormProps = {
  initialData?: Partial<Gasto>;
  onSubmit: (data: any) => Promise<void>;
  onCancel: () => void;
  isOpen?: boolean;
};

const GastosForm = ({ initialData, onSubmit, onCancel, isOpen }: GastoFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      proveedor: initialData?.proveedor || "",
      concepto: initialData?.concepto || "",
      cantidad: initialData?.cantidad?.toString() || "0",
      iva: initialData?.iva?.toString() || "0",
      total: initialData?.total?.toString() || "0",
      metodoPago: initialData?.metodoPago || "",
      notas: initialData?.notas || "",
      fecha: initialData?.fecha || new Date(),
      categoria: initialData?.categoria || "",
      estado: initialData?.estado || "",
      tipo: initialData?.tipo || "general",
    },
  });

  const addGasto = async (data) => {
    try {
      setIsSubmitting(true);
      
      const nuevoGasto = {
        ...data,
        fecha: new Date(data.fecha),
        cantidad: parseFloat(data.cantidad),
        iva: parseFloat(data.iva),
        total: parseFloat(data.total),
        tipo: data.tipo || 'general',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      await onSubmit(nuevoGasto);
      toast.success(initialData ? "Gasto actualizado" : "Gasto creado");
    } catch (error) {
      console.error("Error guardando gasto:", error);
      toast.error("Error al guardar el gasto");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(addGasto)} className="space-y-4">
        <FormField
          control={form.control}
          name="proveedor"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Proveedor</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del proveedor" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="concepto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Concepto</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descripción del gasto"
                  className="resize-none h-24"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="cantidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad (€)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="iva"
            render={({ field }) => (
              <FormItem>
                <FormLabel>IVA (€)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="total"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Total (€)</FormLabel>
                <FormControl>
                  <Input type="text" placeholder="0.00" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="metodoPago"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Método de Pago</FormLabel>
              <FormControl>
                <Input placeholder="Tarjeta, transferencia, etc." {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="fecha"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Fecha</FormLabel>
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
          name="notas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas (opcional)</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Información adicional"
                  className="resize-none h-16"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="tipo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="general">General</SelectItem>
                  <SelectItem value="nomina">Nómina</SelectItem>
                  <SelectItem value="alquiler">Alquiler</SelectItem>
                  {/* Add more types as needed */}
                </SelectContent>
              </Select>
              <FormMessage />
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

export default GastosForm;

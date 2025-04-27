
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";
import { Ingreso } from "@/types";

type IngresosFormProps = {
  onSubmit: (data: Partial<Omit<Ingreso, "id">>) => void;
  onCancel: () => void;
  onClose?: () => void; // Add onClose prop to match usage
  initialData?: Partial<Omit<Ingreso, "id">>;
  isOpen?: boolean; // Add isOpen prop to match usage
};

const IngresosForm = ({ onSubmit, onCancel, initialData, isOpen, onClose }: IngresosFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);

  const form = useForm<Partial<Omit<Ingreso, "id">>>({
    defaultValues: initialData || {
      cliente: "",
      fecha: new Date(),
      concepto: "",
      cantidad: 0,
      iva: 0,
      total: 0,
      metodoPago: "",
      notas: "",
      estado: "pendiente",
      categoria: "general",
      origen: "otros",
    },
  });

  const addIngreso = async (data) => {
    try {
      setIsSubmitting(true);
      
      const nuevoIngreso = {
        ...data,
        fecha: new Date(data.fecha),
        cantidad: parseFloat(data.cantidad),
        iva: parseFloat(data.iva),
        total: parseFloat(data.total),
        estado: data.estado || "pendiente",
        tipo: data.tipo || 'general',
        createdAt: new Date(),
        updatedAt: new Date()
      };
      
      onSubmit(nuevoIngreso);
      toast.success("Ingreso añadido correctamente");
      if (onClose) onClose(); // Call onClose when provided
    } catch (error) {
      console.error("Error al añadir ingreso:", error);
      toast.error("Error al añadir ingreso");
    } finally {
      setIsSubmitting(false);
    }
  };

  // Use onClose if provided, otherwise fall back to onCancel
  const handleCancel = () => {
    if (onClose) onClose();
    else onCancel();
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(addIngreso)} className="space-y-4">
        <FormField
          control={form.control}
          name="cliente"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Cliente</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del cliente" {...field} />
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
                        format(field.value, "PP")
                      ) : (
                        <span>Pick a date</span>
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
                    disabled={(date) => date > new Date()}
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
          name="concepto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Concepto</FormLabel>
              <FormControl>
                <Input placeholder="Descripción del ingreso" {...field} />
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
                <FormLabel>Cantidad</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" {...field} />
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
                <FormLabel>IVA</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" {...field} />
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
                <FormLabel>Total</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="0.00" {...field} />
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
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un método" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="tarjeta">Tarjeta de Crédito</SelectItem>
                    <SelectItem value="transferencia">Transferencia Bancaria</SelectItem>
                    <SelectItem value="cheque">Cheque</SelectItem>
                    <SelectItem value="otro">Otro</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="notas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Información adicional"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end gap-2">
          <Button variant="outline" type="button" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button type="submit" disabled={isSubmitting}>
            {isSubmitting ? "Añadiendo..." : "Añadir Ingreso"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default IngresosForm;

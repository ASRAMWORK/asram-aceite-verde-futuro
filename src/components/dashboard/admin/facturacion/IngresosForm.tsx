
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

const tiposIngreso = [
  "Recogida de aceite",
  "Venta de biodiesel",
  "Servicios a comunidades",
  "Servicios a empresas",
  "Subvenciones",
  "Donaciones",
  "Otros"
];

const formSchema = z.object({
  concepto: z.string().min(2, { message: "El concepto es obligatorio" }),
  cantidad: z.number().min(0, { message: "La cantidad debe ser mayor o igual a 0" }),
  tipo: z.string().min(1, { message: "Selecciona un tipo de ingreso" }),
  fecha: z.string().min(1, { message: "La fecha es obligatoria" }),
  cliente: z.string().optional(),
  origen: z.string().optional(),
  numFactura: z.string().optional(),
  notas: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface IngresosFormProps {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  initialData?: any;
}

const IngresosForm = ({ onSubmit, onCancel, initialData }: IngresosFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      concepto: "",
      cantidad: 0,
      tipo: "",
      fecha: new Date().toISOString().split("T")[0],
      cliente: "",
      origen: "",
      numFactura: "",
      notas: ""
    }
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
          
          <FormField
            control={form.control}
            name="cantidad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Importe (€)</FormLabel>
                <FormControl>
                  <Input 
                    type="number" 
                    step="0.01" 
                    placeholder="0.00" 
                    {...field} 
                    onChange={e => field.onChange(parseFloat(e.target.value))} 
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
                <FormLabel>Tipo de ingreso</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {tiposIngreso.map((tipo) => (
                      <SelectItem key={tipo} value={tipo}>
                        {tipo}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormMessage />
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
                  <Input type="date" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="cliente"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cliente</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del cliente (opcional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="numFactura"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de factura</FormLabel>
                <FormControl>
                  <Input placeholder="Número de factura (opcional)" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="notas"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas adicionales</FormLabel>
              <FormControl>
                <Textarea placeholder="Información adicional (opcional)" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-asram hover:bg-asram-700">
            Guardar ingreso
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default IngresosForm;

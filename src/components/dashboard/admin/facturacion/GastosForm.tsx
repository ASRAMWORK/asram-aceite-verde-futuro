
import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { useFacturacion } from "@/hooks/useFacturacion";
import { toast } from "sonner";

const tiposGasto = [
  "Personal",
  "Transporte",
  "Equipamiento",
  "Mantenimiento",
  "Alquiler",
  "Suministros",
  "Marketing",
  "Seguros",
  "Impuestos",
  "Gastos financieros",
  "Otros"
];

const formSchema = z.object({
  concepto: z.string().min(2, { message: "El concepto es obligatorio" }),
  cantidad: z.number().min(0, { message: "La cantidad debe ser mayor o igual a 0" }),
  tipo: z.string().min(1, { message: "Selecciona un tipo de gasto" }),
  fecha: z.string().min(1, { message: "La fecha es obligatoria" }),
  proveedor: z.string().optional(),
  numFactura: z.string().optional(),
  notas: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface GastosFormProps {
  isOpen: boolean;
  onClose: () => void;
  initialData?: FormData;
}

const GastosForm = ({ isOpen, onClose, initialData }: GastosFormProps) => {
  const { addGasto } = useFacturacion();
  const [loading, setLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      concepto: "",
      cantidad: 0,
      tipo: "",
      fecha: new Date().toISOString().split("T")[0],
      proveedor: "",
      numFactura: "",
      notas: ""
    }
  });

  const handleSubmit = async (data: FormData) => {
    if (isSubmitting) return; // Prevenir envíos múltiples
    
    setIsSubmitting(true);
    setLoading(true);
    try {
      // Limpiar valores undefined y null antes de enviar
      const cleanedData: Record<string, any> = {};
      
      Object.entries(data).forEach(([key, value]) => {
        if (value !== undefined && value !== null && value !== "") {
          cleanedData[key] = value;
        }
      });
      
      // Pass all required data, addGasto will handle serverTimestamp internally
      await addGasto({
        concepto: data.concepto,
        cantidad: Number(data.cantidad),
        fecha: new Date(data.fecha),
        categoria: data.tipo,
        tipo: data.tipo,
        proveedor: cleanedData.proveedor,
        numFactura: cleanedData.numFactura,
        notas: cleanedData.notas,
      });
      
      // Usar un timeout para dar tiempo a que Firebase complete la operación
      setTimeout(() => {
        onClose();
      }, 200);
    } catch (error) {
      console.error("Error al registrar el gasto:", error);
      toast.error("Error al registrar el gasto");
    } finally {
      setLoading(false);
      setIsSubmitting(false);
    }
  };

  // Manejar cierre de diálogo de forma segura
  const handleDialogClose = () => {
    if (!isSubmitting) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleDialogClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Nuevo Gasto</DialogTitle>
          <DialogDescription>
            Registra un nuevo gasto en el sistema
          </DialogDescription>
        </DialogHeader>
        
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
                      <Input placeholder="Descripción del gasto" {...field} />
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
                        onChange={e => field.onChange(parseFloat(e.target.value) || 0)} 
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
                    <FormLabel>Tipo de gasto</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tiposGasto.map((tipo) => (
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
                name="proveedor"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Proveedor</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre del proveedor (opcional)" {...field} />
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
            
            <DialogFooter>
              <Button 
                type="button" 
                variant="outline" 
                onClick={handleDialogClose} 
                disabled={loading || isSubmitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit" 
                className="bg-asram hover:bg-asram-700" 
                disabled={loading || isSubmitting}
              >
                {loading ? "Guardando..." : "Registrar gasto"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default GastosForm;

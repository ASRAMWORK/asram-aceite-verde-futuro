
import { useState } from "react";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
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
  stock: z.coerce.number().int().nonnegative("El stock debe ser un número positivo o cero"),
  imagen: z.string().optional(),
  activo: z.boolean().default(true),
});

type ProductoFormProps = {
  initialData?: any;
  onSubmit: (data: any) => void;
  onCancel: () => void;
};

const ProductoForm = ({ initialData, onSubmit, onCancel }: ProductoFormProps) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: initialData || {
      nombre: "",
      descripcion: "",
      precio: 0,
      stock: 0,
      imagen: "",
      activo: true,
    },
  });

  const handleSubmit = async (data: z.infer<typeof formSchema>) => {
    try {
      setIsSubmitting(true);
      // Here you would typically save to Firebase or your backend
      onSubmit(data);
      toast.success(initialData ? "Producto actualizado" : "Producto creado");
    } catch (error) {
      console.error("Error guardando producto:", error);
      toast.error("Error al guardar el producto");
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
              <FormLabel>Nombre del producto</FormLabel>
              <FormControl>
                <Input placeholder="Kit de reciclaje" {...field} />
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
                  placeholder="Describe el producto y sus características..." 
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
            name="stock"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Stock disponible</FormLabel>
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
          name="imagen"
          render={({ field }) => (
            <FormItem>
              <FormLabel>URL de la imagen</FormLabel>
              <FormControl>
                <Input placeholder="https://..." {...field} />
              </FormControl>
              <FormDescription>
                Introduce la URL de la imagen del producto
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
                <FormLabel className="text-base">Producto activo</FormLabel>
                <FormDescription>
                  El producto será visible en la tienda si está activo
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

export default ProductoForm;

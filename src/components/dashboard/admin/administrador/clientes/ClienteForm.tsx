import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import { useUsuarios } from '@/hooks/useUsuarios';
import { toast } from 'sonner';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

const formSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre es obligatorio" }),
  apellidos: z.string().min(2, { message: "Los apellidos son obligatorios" }),
  email: z.string().email({ message: "Email inválido" }),
  telefono: z.string().min(9, { message: "Teléfono inválido" }),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  provincia: z.string().optional(),
  codigoPostal: z.string().optional(),
  pais: z.string().optional(),
  activo: z.boolean().default(true),
  tipo: z.enum(["comunidad", "restaurante", "hotel", "asociacion", "escolar", "usuario"]).default("usuario"),
  role: z.enum(["admin", "user", "comunidad", "restaurante", "hotel", "asociacion", "escolar", "usuario", "administrador", "comercial", "superadmin"]).default("usuario"),
  litrosAportados: z.number().optional(),
  litrosRecogidos: z.number().optional(),
  distrito: z.string().optional(),
  barrio: z.string().optional(),
  frecuenciaRecogida: z.string().optional(),
  numViviendas: z.number().optional(),
  numContenedores: z.number().optional(),
  nombreAdministracion: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface ClienteFormProps {
  open: boolean;
  onClose: () => void;
}

const ClienteForm = ({ open, onClose }: ClienteFormProps) => {
  const [isLoading, setIsLoading] = useState(false);
  const { addCliente } = useUsuarios();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      apellidos: "",
      email: "",
      telefono: "",
      direccion: "",
      ciudad: "",
      provincia: "",
      codigoPostal: "",
      pais: "",
      activo: true,
      tipo: "usuario",
      role: "usuario",
      litrosAportados: 0,
      litrosRecogidos: 0,
      distrito: "",
      barrio: "",
      frecuenciaRecogida: "",
      numViviendas: 0,
      numContenedores: 0,
      nombreAdministracion: "",
    },
  });

  const handleSaveCliente = async () => {
    setIsLoading(true);
    try {
      // Remove 'notas' or other invalid properties
      const { notas, ...clienteData } = form.getValues();
      
      if (clienteData.apellidos) {
        clienteData.apellido = clienteData.apellidos;
        delete clienteData.apellidos;
      }
      
      await addCliente(clienteData);
      
      toast.success('Cliente añadido correctamente');
      onClose();
    } catch (error) {
      console.error('Error al guardar cliente:', error);
      toast.error('Error al guardar el cliente');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Añadir nuevo cliente</DialogTitle>
          <DialogDescription>
            Crea un nuevo cliente para la plataforma
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSaveCliente)} className="space-y-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre del cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="apellidos"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Apellidos</FormLabel>
                  <FormControl>
                    <Input placeholder="Apellidos del cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input placeholder="Email del cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="telefono"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Teléfono</FormLabel>
                  <FormControl>
                    <Input placeholder="Teléfono del cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Input placeholder="Dirección del cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="ciudad"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Ciudad</FormLabel>
                  <FormControl>
                    <Input placeholder="Ciudad del cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="provincia"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Provincia</FormLabel>
                  <FormControl>
                    <Input placeholder="Provincia del cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="codigoPostal"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Código Postal</FormLabel>
                  <FormControl>
                    <Input placeholder="Código Postal del cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="pais"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>País</FormLabel>
                  <FormControl>
                    <Input placeholder="País del cliente" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="activo"
              render={({ field }) => (
                <FormItem className="flex flex-row items-start space-x-3 space-y-0">
                  <FormControl>
                    <Checkbox
                      checked={field.value}
                      onCheckedChange={field.onChange}
                    />
                  </FormControl>
                  <div className="space-y-1 leading-none">
                    <FormLabel>
                      Cliente activo
                    </FormLabel>
                    <FormDescription>
                      Indica si el cliente está activo
                    </FormDescription>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" disabled={isLoading}>
              {isLoading ? "Añadiendo..." : "Añadir cliente"}
            </Button>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default ClienteForm;

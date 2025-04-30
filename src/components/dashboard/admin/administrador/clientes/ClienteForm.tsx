import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form, 
  FormControl, 
  FormField, 
  FormItem, 
  FormLabel, 
  FormMessage 
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { useUsuarios } from '@/hooks/useUsuarios';
import { toast } from 'sonner';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Usuario } from '@/types';

const clienteSchema = z.object({
  nombre: z.string().min(2, 'El nombre es obligatorio'),
  apellidos: z.string().min(2, 'Los apellidos son obligatorios'),
  email: z.string().email('Email no válido').optional().or(z.literal('')),
  telefono: z.string().min(9, 'Teléfono no válido').optional().or(z.literal('')),
  direccion: z.string().min(5, 'La dirección es obligatoria').optional().or(z.literal('')),
  ciudad: z.string().optional().or(z.literal('')),
  provincia: z.string().optional().or(z.literal('')),
  codigoPostal: z.string().optional().or(z.literal('')),
});

type ClienteFormValues = z.infer<typeof clienteSchema>;

interface ClienteFormProps {
  onCancel: () => void;
  onSubmit: () => Promise<void> | void;
  usuario?: Usuario;
}

const ClienteForm: React.FC<ClienteFormProps> = ({ onCancel, onSubmit, usuario }) => {
  const { addUsuario, updateUsuario } = useUsuarios();
  
  const defaultValues: Partial<ClienteFormValues> = usuario ? {
    nombre: usuario.nombre || '',
    apellidos: usuario.apellidos || '',
    email: usuario.email || '',
    telefono: usuario.telefono || '',
    direccion: usuario.direccion || '',
    ciudad: usuario.ciudad || 'Madrid',
    provincia: usuario.provincia || 'Madrid',
    codigoPostal: usuario.codigoPostal || ''
  } : {
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: 'Madrid',
    provincia: 'Madrid',
    codigoPostal: ''
  };
  
  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues
  });

  const handleSubmit = async (data: ClienteFormValues) => {
    try {
      const clienteData: Omit<Usuario, 'id'> = {
        nombre: data.nombre,
        apellidos: data.apellidos, // Changed from apellido to apellidos
        email: data.email,
        telefono: data.telefono,
        direccion: data.direccion,
        codigoPostal: data.codigoPostal,
        ciudad: data.ciudad,
        provincia: data.provincia || 'Madrid',
        pais: 'España',
        role: 'user',
        uid: "", // Adding required uid property
        createdAt: new Date(),
        updatedAt: new Date()
      };

      if (usuario) {
        await updateUsuario(usuario.id, clienteData);
        toast.success('Cliente actualizado correctamente');
      } else {
        await addUsuario(clienteData);
        toast.success('Cliente añadido correctamente');
      }
      onSubmit();
    } catch (error) {
      console.error("Error al guardar cliente:", error);
      toast.error("Error al guardar cliente");
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
                <Input type="email" placeholder="Email de contacto" {...field} />
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
                <Input placeholder="Teléfono de contacto" {...field} />
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
                <Input placeholder="Dirección completa" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="grid grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="ciudad"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Ciudad</FormLabel>
                <FormControl>
                  <Input placeholder="Ciudad" {...field} />
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
                  <Input placeholder="Provincia" {...field} />
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
                  <Input placeholder="C.P." {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <div className="flex justify-end gap-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {usuario ? 'Actualizar Cliente' : 'Crear Cliente'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ClienteForm;

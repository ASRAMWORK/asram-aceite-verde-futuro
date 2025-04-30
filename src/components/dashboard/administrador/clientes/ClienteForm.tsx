
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
  apellidos: z.string().min(2, 'Los apellidos son obligatorios'), // Changed from apellido to apellidos
  telefono: z.string().min(9, 'Teléfono no válido'),
  email: z.string().email('Email no válido'),
  direccion: z.string().min(5, 'La dirección es obligatoria'),
  distrito: z.string().min(1, 'El distrito es obligatorio'),
  barrio: z.string().min(1, 'El barrio es obligatorio'),
  codigoPostal: z.string().min(5, 'Código postal no válido'),
  frecuenciaRecogida: z.string(),
  notas: z.string().optional(),
});

type ClienteFormValues = z.infer<typeof clienteSchema>;

interface ClienteFormProps {
  onCancel: () => void;
  onSubmit: (data: ClienteFormValues) => Promise<void> | void;
  clienteId?: string;
}

const ClienteForm: React.FC<ClienteFormProps> = ({ onCancel, onSubmit, clienteId }) => {
  const { addUsuario, updateUsuario, usuarios } = useUsuarios();
  
  const defaultValues: ClienteFormValues = clienteId 
    ? usuarios.find(u => u.id === clienteId) || {
        nombre: '',
        apellidos: '', // Changed from apellido to apellidos
        telefono: '',
        email: '',
        direccion: '',
        distrito: '',
        barrio: '',
        codigoPostal: '',
        frecuenciaRecogida: 'mensual',
        notas: '',
      }
    : {
        nombre: '',
        apellidos: '', // Changed from apellido to apellidos
        telefono: '',
        email: '',
        direccion: '',
        distrito: '',
        barrio: '',
        codigoPostal: '',
        frecuenciaRecogida: 'mensual',
        notas: '',
      };
  
  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues,
  });

  const handleSubmit = async (data: ClienteFormValues) => {
    try {
      if (clienteId) {
        await updateUsuario(clienteId, {
          ...data,
          tipo: 'comunidad',
          activo: true,
        });
        toast.success('Cliente actualizado correctamente');
      } else {
        await addUsuario({
          nombre: data.nombre,
          apellidos: data.apellidos, // Changed from apellido to apellidos
          telefono: data.telefono,
          email: data.email,
          direccion: data.direccion,
          distrito: data.distrito,
          barrio: data.barrio,
          codigoPostal: data.codigoPostal,
          frecuenciaRecogida: data.frecuenciaRecogida,
          tipo: 'comunidad',
          activo: true,
          role: 'user',
          ciudad: '',
          provincia: '',
          pais: '',
          createdAt: new Date(),
          updatedAt: new Date(),
          uid: `temp-${Date.now()}` // Adding required uid property with a temporary value
        });
        toast.success('Cliente añadido correctamente');
      }
      onSubmit(data);
    } catch (error) {
      toast.error('Error al guardar el cliente');
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            name="apellidos" // Changed from apellido to apellidos
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>
          
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
          
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <FormField
            control={form.control}
            name="distrito"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distrito</FormLabel>
                <FormControl>
                  <Input placeholder="Distrito" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
            
          <FormField
            control={form.control}
            name="barrio"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Barrio</FormLabel>
                <FormControl>
                  <Input placeholder="Barrio" {...field} />
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
        
        <FormField
          control={form.control}
          name="frecuenciaRecogida"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Frecuencia de Recogida</FormLabel>
              <Select onValueChange={field.onChange} defaultValue={field.value}>
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccione frecuencia" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="semanal">Semanal</SelectItem>
                  <SelectItem value="quincenal">Quincenal</SelectItem>
                  <SelectItem value="mensual">Mensual</SelectItem>
                  <SelectItem value="bajo_demanda">Bajo demanda</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
          
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {clienteId ? 'Actualizar Cliente' : 'Crear Cliente'}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default ClienteForm;

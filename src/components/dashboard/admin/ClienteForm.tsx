
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
  email: z.string().email('Email no válido').optional().or(z.literal('')),
  telefono: z.string().min(9, 'Teléfono no válido').optional().or(z.literal('')),
  direccion: z.string().min(5, 'La dirección es obligatoria').optional().or(z.literal('')),
  ciudad: z.string().optional().or(z.literal('')),
  provincia: z.string().optional().or(z.literal('')),
  codigoPostal: z.string().optional().or(z.literal('')),
  tipo: z.string(),
  contacto: z.string().optional().or(z.literal('')),
  distrito: z.string().optional().or(z.literal('')),
  barrio: z.string().optional().or(z.literal('')),
  numViviendas: z.number().optional(),
  numContenedores: z.number().optional(),
  cif: z.string().optional().or(z.literal('')),
  nombreAdministracion: z.string().optional().or(z.literal(''))
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
    email: usuario.email || '',
    telefono: usuario.telefono || '',
    direccion: usuario.direccion || '',
    ciudad: usuario.ciudad || 'Madrid',
    provincia: usuario.provincia || 'Madrid',
    codigoPostal: usuario.codigoPostal || '',
    tipo: usuario.tipo || 'particular',
    contacto: usuario.contacto || '',
    distrito: usuario.distrito || '',
    barrio: usuario.barrio || '',
    numViviendas: usuario.numViviendas || 0,
    numContenedores: usuario.numContenedores || 0,
    cif: usuario.cif || '',
    nombreAdministracion: usuario.nombreAdministracion || ''
  } : {
    nombre: '',
    email: '',
    telefono: '',
    direccion: '',
    ciudad: 'Madrid',
    provincia: 'Madrid',
    codigoPostal: '',
    tipo: 'particular',
    contacto: '',
    distrito: '',
    barrio: '',
    numViviendas: 0,
    numContenedores: 0,
    cif: '',
    nombreAdministracion: ''
  };
  
  const form = useForm<ClienteFormValues>({
    resolver: zodResolver(clienteSchema),
    defaultValues
  });

  const handleSubmit = async (data: ClienteFormValues) => {
    try {
      if (usuario) {
        await updateUsuario(usuario.id, {
          ...data,
          numViviendas: data.numViviendas || 0,
          numContenedores: data.numContenedores || 0
        });
        toast.success('Cliente actualizado correctamente');
      } else {
        await addUsuario({
          nombre: data.nombre, // Make sure nombre is required and not optional
          email: data.email,
          telefono: data.telefono,
          direccion: data.direccion,
          ciudad: data.ciudad,
          provincia: data.provincia,
          codigoPostal: data.codigoPostal,
          tipo: data.tipo,
          contacto: data.contacto,
          distrito: data.distrito,
          barrio: data.barrio,
          numViviendas: data.numViviendas || 0,
          numContenedores: data.numContenedores || 0,
          cif: data.cif,
          nombreAdministracion: data.nombreAdministracion,
          activo: true,
          role: 'client',
          createdAt: new Date(),
          updatedAt: new Date(),
          fechaRegistro: new Date()
        });
        toast.success('Cliente añadido correctamente');
      }
      onSubmit();
    } catch (error) {
      console.error('Error saving cliente:', error);
      toast.error('Error al guardar el cliente');
    }
  };

  // Determine if the form should show Punto Verde specific fields
  const isPuntoVerde = form.watch('tipo') === 'punto_verde';
  const isAdministrador = form.watch('tipo') === 'administrador';
  const isNegocio = form.watch('tipo') === 'negocio';

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
            name="tipo"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de cliente</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="particular">Particular</SelectItem>
                    <SelectItem value="negocio">Negocio/Restaurante</SelectItem>
                    <SelectItem value="administrador">Administrador de fincas</SelectItem>
                    <SelectItem value="punto_verde">Punto Verde</SelectItem>
                  </SelectContent>
                </Select>
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

        {/* Campos específicos según el tipo de cliente */}
        {isPuntoVerde && (
          <div className="space-y-4 border p-4 rounded-md bg-muted/30">
            <h3 className="font-medium">Información del Punto Verde</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="numViviendas"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de viviendas</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="numContenedores"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Número de contenedores</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0"
                        onChange={(e) => field.onChange(Number(e.target.value))}
                        value={field.value}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {isAdministrador && (
          <div className="space-y-4 border p-4 rounded-md bg-muted/30">
            <h3 className="font-medium">Información del Administrador de Fincas</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="nombreAdministracion"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Nombre de la administración</FormLabel>
                    <FormControl>
                      <Input placeholder="Nombre de la empresa/administración" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="cif"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>CIF</FormLabel>
                    <FormControl>
                      <Input placeholder="CIF de la empresa" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>
        )}

        {isNegocio && (
          <div className="space-y-4 border p-4 rounded-md bg-muted/30">
            <h3 className="font-medium">Información del Negocio</h3>
            <FormField
              control={form.control}
              name="cif"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>CIF</FormLabel>
                  <FormControl>
                    <Input placeholder="CIF de la empresa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        )}

        <FormField
          control={form.control}
          name="contacto"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Persona de contacto</FormLabel>
              <FormControl>
                <Input placeholder="Nombre del contacto" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
          
        <div className="flex justify-end gap-2 pt-4">
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

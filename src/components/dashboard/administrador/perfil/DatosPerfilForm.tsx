import React from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { toast } from 'sonner';
import { UserProfile } from '@/types';

const profileSchema = z.object({
  nombreAdministracion: z.string().min(2, "El nombre es obligatorio"),
  email: z.string().email("Email no válido"),
  telefono: z.string().min(9, "Teléfono no válido"),
  direccion: z.string().optional(),
  codigoPostal: z.string().optional(),
  ciudad: z.string().optional(),
});

type ProfileFormValues = z.infer<typeof profileSchema>;

interface DatosPerfilFormProps {
  profile: UserProfile | null;
}

const DatosPerfilForm: React.FC<DatosPerfilFormProps> = ({ profile }) => {
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      nombreAdministracion: profile?.nombreAdministracion || '',
      email: profile?.email || '',
      telefono: profile?.telefono || '',
      direccion: profile?.direccion || '',
      codigoPostal: profile?.codigoPostal || '',
      ciudad: profile?.ciudad || '',
    },
  });

  function onSubmit(data: ProfileFormValues) {
    // Here you would update the user profile in the database
    console.log("Perfil actualizado:", data);
    toast.success("Perfil actualizado correctamente");
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
        <FormField
          control={form.control}
          name="nombreAdministracion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Nombre de la Administración</FormLabel>
              <FormControl>
                <Input placeholder="Nombre de la administración" {...field} />
              </FormControl>
              <FormDescription>
                Este es el nombre que aparecerá en los informes y comunicaciones
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="tu@email.com" {...field} />
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
        </div>
        
        <FormField
          control={form.control}
          name="direccion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Dirección</FormLabel>
              <FormControl>
                <Input placeholder="Dirección profesional" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="codigoPostal"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Código Postal</FormLabel>
                <FormControl>
                  <Input placeholder="Código postal" {...field} />
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
                  <Input placeholder="Ciudad" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Button type="submit">Guardar cambios</Button>
      </form>
    </Form>
  );
};

export default DatosPerfilForm;

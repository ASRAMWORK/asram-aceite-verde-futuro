import React from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { distritos, getBarriosByDistrito } from "@/data/madridDistritos";
import { ClienteFormProps } from '@/types';

const formSchema = z.object({
  nombre: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  direccion: z.string().min(5, { message: "La dirección debe tener al menos 5 caracteres" }),
  distrito: z.string().min(1, { message: "Selecciona un distrito" }),
  barrio: z.string().min(1, { message: "Selecciona un barrio" }),
  telefono: z.string().min(9, { message: "Introduce un número de teléfono válido" }),
  email: z.string().email({ message: "Introduce un email válido" }).optional(),
});

type FormValues = z.infer<typeof formSchema>;

const ClienteForm: React.FC<ClienteFormProps> = ({ onSubmit, initialData = {}, onCancel }) => {
  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: initialData.nombre || "",
      direccion: initialData.direccion || "",
      distrito: initialData.distrito || "",
      barrio: initialData.barrio || "",
      telefono: initialData.telefono || "",
      email: initialData.email || "",
    },
  });

  const handleDistritoChange = (distrito: string) => {
    form.setValue("distrito", distrito);
    form.setValue("barrio", "");
  };

  const handleSubmit = (values: FormValues) => {
    onSubmit(values);
  };
  
  return (
    <form onSubmit={form.handleSubmit(handleSubmit)}>
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

      <div className="grid grid-cols-2 gap-4">
        <FormField
          control={form.control}
          name="distrito"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Distrito</FormLabel>
              <Select
                onValueChange={(value) => {
                  field.onChange(value);
                  handleDistritoChange(value);
                }}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un distrito" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {distritos.map((distrito) => (
                    <SelectItem key={distrito} value={distrito}>
                      {distrito}
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
          name="barrio"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Barrio</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Selecciona un barrio" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {form.getValues("distrito") &&
                    getBarriosByDistrito(form.getValues("distrito")).map((barrio) => (
                      <SelectItem key={barrio} value={barrio}>
                        {barrio}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

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
            <FormLabel>Correo electrónico</FormLabel>
            <FormControl>
              <Input placeholder="Email (opcional)" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <div className="flex justify-end space-x-2 mt-6">
        {onCancel && (
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
        )}
        <Button type="submit">
          {initialData.id ? 'Actualizar Cliente' : 'Añadir Cliente'}
        </Button>
      </div>
    </form>
  );
};

export default ClienteForm;

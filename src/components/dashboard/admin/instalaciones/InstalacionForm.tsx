import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Instalacion } from "@/types";
import { useInstalaciones } from "@/hooks/useInstalaciones";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { DialogFooter } from "@/components/ui/dialog";
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
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";

const formSchema = z.object({
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  direccion: z.string().min(5, {
    message: "La dirección debe tener al menos 5 caracteres.",
  }),
  ciudad: z.string().min(2, {
    message: "La ciudad debe tener al menos 2 caracteres.",
  }),
  provincia: z.string().min(2, {
    message: "La provincia debe tener al menos 2 caracteres.",
  }),
  codigoPostal: z.string().min(5, {
    message: "El código postal debe tener al menos 5 caracteres.",
  }),
  pais: z.string().min(2, {
    message: "El país debe tener al menos 2 caracteres.",
  }),
  latitud: z.number(),
  longitud: z.number(),
  tipo: z.string().min(3, {
    message: "El tipo debe tener al menos 3 caracteres.",
  }),
  descripcion: z.string().min(10, {
    message: "La descripción debe tener al menos 10 caracteres.",
  }),
  horario: z.string().min(5, {
    message: "El horario debe tener al menos 5 caracteres.",
  }),
  telefono: z.string().min(9, {
    message: "El teléfono debe tener al menos 9 caracteres.",
  }),
  email: z.string().email({
    message: "Introduce un email válido.",
  }),
  contacto: z.string().min(2, {
    message: "El contacto debe tener al menos 2 caracteres.",
  }),
  activo: z.boolean(),
  numViviendas: z.number().optional(),
  numContenedores: z.number().optional(),
  distrito: z.string().optional(),
  barrio: z.string().optional(),
  numPorteria: z.number().optional(),
});

interface InstalacionFormProps {
  instalacion: Instalacion | null;
  onClose: () => void;
}

const InstalacionForm: React.FC<InstalacionFormProps> = ({ instalacion, onClose }) => {
  const { addInstalacion, updateInstalacion } = useInstalaciones();

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: instalacion ? {
      nombre: instalacion.nombre,
      direccion: instalacion.direccion,
      ciudad: instalacion.ciudad,
      provincia: instalacion.provincia,
      codigoPostal: instalacion.codigoPostal,
      pais: instalacion.pais,
      latitud: instalacion.latitud,
      longitud: instalacion.longitud,
      tipo: instalacion.tipo,
      descripcion: instalacion.descripcion,
      horario: instalacion.horario,
      telefono: instalacion.telefono,
      email: instalacion.email,
      contacto: instalacion.contacto,
      activo: instalacion.activo,
      numViviendas: instalacion.numViviendas || 0,
      numContenedores: instalacion.numContenedores || 0,
      distrito: instalacion.distrito || "",
      barrio: instalacion.barrio || "",
      numPorteria: instalacion.numPorteria || 0,
    } : {
      nombre: "",
      direccion: "",
      ciudad: "",
      provincia: "",
      codigoPostal: "",
      pais: "España",
      latitud: 0,
      longitud: 0,
      tipo: "comunidad",
      descripcion: "",
      horario: "",
      telefono: "",
      email: "",
      contacto: "",
      activo: true,
      numViviendas: 0,
      numContenedores: 0,
      distrito: "",
      barrio: "",
      numPorteria: 0,
    },
  });

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (instalacion) {
      // Update existing instalacion
      updateInstalacion(instalacion.id, data)
        .then(() => {
          toast.success("Instalación actualizada correctamente");
          onClose();
        })
        .catch((error) => {
          console.error("Error al actualizar instalación:", error);
          toast.error("Error al actualizar instalación");
        });
    } else {
      // Add new instalacion - Make sure all fields are explicitly defined
      const nuevaInstalacion: Omit<Instalacion, "id"> = {
        nombre: data.nombre,
        direccion: data.direccion,
        ciudad: data.ciudad,
        provincia: data.provincia,
        codigoPostal: data.codigoPostal,
        pais: data.pais,
        latitud: data.latitud,
        longitud: data.longitud,
        tipo: data.tipo,
        descripcion: data.descripcion,
        horario: data.horario,
        telefono: data.telefono,
        email: data.email,
        contacto: data.contacto,
        activo: data.activo,
        distrito: data.distrito || "",
        barrio: data.barrio || "",
        numViviendas: data.numViviendas || 0,
        numContenedores: data.numContenedores || 0,
        numPorteria: data.numPorteria || 0,
        createdAt: new Date(),
        updatedAt: new Date()
      };

      addInstalacion(nuevaInstalacion)
        .then(() => {
          toast.success("Instalación añadida correctamente");
          onClose();
        })
        .catch((error) => {
          console.error("Error al añadir instalación:", error);
          toast.error("Error al añadir instalación");
        });
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre de la instalación" {...field} />
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
                  <Input placeholder="Código Postal" {...field} />
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
                  <Input placeholder="País" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
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
            name="latitud"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Latitud</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Latitud"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="longitud"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Longitud</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Longitud"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
                <FormLabel>Tipo</FormLabel>
                <FormControl>
                  <Input placeholder="Tipo de instalación" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="horario"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Horario</FormLabel>
                <FormControl>
                  <Input placeholder="Horario de atención" {...field} />
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
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Email de contacto"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="contacto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Contacto</FormLabel>
                <FormControl>
                  <Input placeholder="Persona de contacto" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="activo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-center space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Switch
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Activo</FormLabel>
                  <FormDescription>
                    Indica si la instalación está activa.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numViviendas"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Viviendas</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Número de viviendas"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
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
                <FormLabel>Número de Contenedores</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Número de contenedores"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="numPorteria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Portería</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="Número de portería"
                    {...field}
                    onChange={(e) => field.onChange(Number(e.target.value))}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="descripcion"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Descripción</FormLabel>
              <FormControl>
                <Textarea
                  placeholder="Descripción de la instalación"
                  className="resize-none"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <DialogFooter>
          <Button type="button" variant="outline" onClick={onClose} className="mr-2">
            Cancelar
          </Button>
          <Button 
            type="submit" 
            className="bg-[#EE970D] hover:bg-[#D38109] text-white"
          >
            {instalacion ? "Guardar cambios" : "Añadir"}
          </Button>
        </DialogFooter>
      </form>
    </Form>
  );
};

export default InstalacionForm;

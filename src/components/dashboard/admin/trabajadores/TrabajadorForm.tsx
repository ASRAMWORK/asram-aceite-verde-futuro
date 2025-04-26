import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import type { Trabajador, Vehiculo } from "@/types";

const formSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre es obligatorio" }),
  apellidos: z.string().min(2, { message: "Los apellidos son obligatorios" }),
  dni: z.string().min(9, { message: "El DNI/NIE debe tener al menos 9 caracteres" }),
  fechaNacimiento: z.string().min(1, { message: "La fecha de nacimiento es obligatoria" }),
  email: z.string().email({ message: "Introduce un email válido" }),
  telefono: z.string().min(9, { message: "El teléfono debe tener al menos 9 dígitos" }),
  direccion: z.string().min(5, { message: "La dirección es obligatoria" }),
  foto: z.string().optional(),
  fechaAlta: z.string().min(1, { message: "La fecha de alta es obligatoria" }),
  tipoContrato: z.string().min(1, { message: "Selecciona un tipo de contrato" }),
  tipoJornada: z.string().min(1, { message: "Selecciona un tipo de jornada" }),
  roles: z.array(z.string()).min(1, { message: "Debe seleccionar al menos un rol" }),
  vehiculoAsignado: z.string().optional(),
  rutasAsignadas: z.array(z.string()),
  activo: z.boolean().default(true),
});

type FormData = z.infer<typeof formSchema>;

const tiposContrato = [
  { value: "indefinido", label: "Indefinido" },
  { value: "temporal", label: "Temporal" },
  { value: "practicas", label: "Prácticas" },
  { value: "formacion", label: "Formación" },
  { value: "obra", label: "Obra y servicio" },
  { value: "otro", label: "Otro" },
];

const tiposJornada = [
  { value: "completa", label: "Completa" },
  { value: "parcial", label: "Parcial" },
];

const rolesTrabajador = [
  { id: "recolector", label: "Recolector" },
  { id: "conductor", label: "Conductor" },
  { id: "supervisor", label: "Supervisor" },
  { id: "analista", label: "Analista" },
  { id: "administrador", label: "Administrador" },
  { id: "gestor", label: "Gestor" },
];

interface TrabajadorFormProps {
  onSubmit: (data: FormData) => void;
  onCancel: () => void;
  initialData?: Partial<Trabajador>;
  vehiculos: Vehiculo[];
  rutas: { id: string; nombre: string }[];
}

const TrabajadorForm = ({ onSubmit, onCancel, initialData, vehiculos, rutas }: TrabajadorFormProps) => {
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: initialData?.nombre || "",
      apellidos: initialData?.apellidos || "",
      dni: initialData?.dni || "",
      fechaNacimiento: initialData?.fechaNacimiento
        ? new Date(initialData.fechaNacimiento).toISOString().split("T")[0]
        : "",
      email: initialData?.email || "",
      telefono: initialData?.telefono || "",
      direccion: initialData?.direccion || "",
      foto: initialData?.foto || "",
      fechaAlta: initialData?.fechaAlta
        ? new Date(initialData.fechaAlta).toISOString().split("T")[0]
        : new Date().toISOString().split("T")[0],
      tipoContrato: initialData?.tipoContrato || "indefinido",
      tipoJornada: initialData?.tipoJornada || "completa",
      roles: initialData?.roles || [],
      vehiculoAsignado: initialData?.vehiculoAsignado || "",
      rutasAsignadas: initialData?.rutasAsignadas || [],
      activo: initialData?.activo !== undefined ? initialData.activo : true,
    },
  });

  const handleSubmit = (data: FormData) => {
    onSubmit(data);
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="space-y-4">
          <div className="text-xl font-semibold">Datos personales</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre</FormLabel>
                  <FormControl>
                    <Input placeholder="Nombre" {...field} />
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
                    <Input placeholder="Apellidos" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="dni"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>DNI/NIE</FormLabel>
                  <FormControl>
                    <Input placeholder="DNI/NIE" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="fechaNacimiento"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de nacimiento</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="foto"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>URL de foto</FormLabel>
                  <FormControl>
                    <Input placeholder="URL de la foto (opcional)" {...field} />
                  </FormControl>
                  <FormDescription>
                    URL de la imagen de perfil del trabajador
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-xl font-semibold">Información de contacto</div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email</FormLabel>
                  <FormControl>
                    <Input type="email" placeholder="correo@ejemplo.com" {...field} />
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
                    <Input placeholder="Teléfono" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="direccion"
              render={({ field }) => (
                <FormItem className="col-span-1 md:col-span-2">
                  <FormLabel>Dirección</FormLabel>
                  <FormControl>
                    <Textarea placeholder="Dirección completa" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-xl font-semibold">Información laboral</div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <FormField
              control={form.control}
              name="fechaAlta"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Fecha de alta</FormLabel>
                  <FormControl>
                    <Input type="date" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="tipoContrato"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de contrato</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo de contrato" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tiposContrato.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
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
              name="tipoJornada"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Tipo de jornada</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo de jornada" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {tiposJornada.map((tipo) => (
                        <SelectItem key={tipo.value} value={tipo.value}>
                          {tipo.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </div>

        <div className="space-y-4">
          <div className="text-xl font-semibold">Roles y asignaciones</div>
          
          <FormField
            control={form.control}
            name="roles"
            render={() => (
              <FormItem>
                <div className="mb-4">
                  <FormLabel className="text-base">Roles</FormLabel>
                  <FormDescription>
                    Selecciona los roles que desempeñará el trabajador
                  </FormDescription>
                </div>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
                  {rolesTrabajador.map((rol) => (
                    <FormField
                      key={rol.id}
                      control={form.control}
                      name="roles"
                      render={({ field }) => {
                        return (
                          <FormItem
                            key={rol.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(rol.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, rol.id])
                                    : field.onChange(
                                        field.value?.filter(
                                          (value) => value !== rol.id
                                        )
                                      );
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal">
                              {rol.label}
                            </FormLabel>
                          </FormItem>
                        );
                      }}
                    />
                  ))}
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="vehiculoAsignado"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Vehículo asignado</FormLabel>
                <Select onValueChange={field.onChange} value={field.value || ""}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un vehículo (opcional)" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="">Sin asignar</SelectItem>
                    {vehiculos.map((vehiculo) => (
                      <SelectItem key={vehiculo.id} value={vehiculo.id}>
                        {vehiculo.matricula} - {vehiculo.modelo}
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
            name="activo"
            render={({ field }) => (
              <FormItem className="flex flex-row items-start space-x-3 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-1 leading-none">
                  <FormLabel>Activo</FormLabel>
                  <FormDescription>
                    Indica si el trabajador está actualmente en activo.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end space-x-4 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-asram hover:bg-asram-700">
            {initialData?.id ? "Actualizar trabajador" : "Añadir trabajador"}
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TrabajadorForm;

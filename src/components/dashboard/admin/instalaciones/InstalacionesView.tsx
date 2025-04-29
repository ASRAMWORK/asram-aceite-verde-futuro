import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableFooter,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { PlusCircle, MapPin, Edit, Trash2 } from "lucide-react";
import { Instalacion } from "@/types";
import { useInstalaciones } from "@/hooks/useInstalaciones";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";

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

const InstalacionesView = () => {
  const [open, setOpen] = useState(false);
  const [instalaciones, setInstalaciones] = useState<Instalacion[]>([]);
  const {
    instalaciones: instalacionesData,
    addInstalacion,
    updateInstalacion,
    deleteInstalacion,
    loading,
  } = useInstalaciones();
  const [selectedInstalacion, setSelectedInstalacion] =
    useState<Instalacion | null>(null);

  useEffect(() => {
    if (instalacionesData) {
      setInstalaciones(instalacionesData);
    }
  }, [instalacionesData]);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
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

  const handleAddInstalacion = (data: Partial<Instalacion>) => {
    const nuevaInstalacion: Omit<Instalacion, "id"> = {
      nombre: data.nombre,
      direccion: data.direccion,
      ciudad: data.ciudad || "Madrid",
      provincia: data.provincia || "Madrid",
      codigoPostal: data.codigoPostal || "",
      pais: data.pais || "España",
      latitud: data.latitud || 0,
      longitud: data.longitud || 0,
      tipo: data.tipo || "comunidad",
      descripcion: data.descripcion || "",
      horario: data.horario || "",
      telefono: data.telefono || "",
      email: data.email || "",
      contacto: data.contacto || "",
      activo: true,
      distrito: data.distrito || "",
      barrio: data.barrio || "",
      numViviendas: data.numViviendas || 0,
      numContenedores: data.numContenedores || 0,
      numPorteria: data.numPorteria || 0,
      estado: "activo",
      fechaInstalacion: new Date(),
      litrosCapacidad: 0,
      litrosRecogidos: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    addInstalacion(nuevaInstalacion)
      .then(() => {
        toast.success("Instalación añadida correctamente");
        setOpen(false);
        form.reset();
      })
      .catch((error) => {
        console.error("Error al añadir instalación:", error);
        toast.error("Error al añadir instalación");
      });
  };

  const handleUpdateInstalacion = (data: Partial<Instalacion>) => {
    if (!selectedInstalacion?.id) {
      toast.error("No se ha seleccionado ninguna instalación para actualizar");
      return;
    }

    updateInstalacion(selectedInstalacion.id, data)
      .then(() => {
        toast.success("Instalación actualizada correctamente");
        setOpen(false);
        setSelectedInstalacion(null);
        form.reset();
      })
      .catch((error) => {
        console.error("Error al actualizar instalación:", error);
        toast.error("Error al actualizar instalación");
      });
  };

  const handleDeleteInstalacion = (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta instalación?")) {
      deleteInstalacion(id)
        .then(() => {
          toast.success("Instalación eliminada correctamente");
        })
        .catch((error) => {
          console.error("Error al eliminar instalación:", error);
          toast.error("Error al eliminar instalación");
        });
    }
  };

  const onSubmit = (data: z.infer<typeof formSchema>) => {
    if (selectedInstalacion) {
      handleUpdateInstalacion(data);
    } else {
      handleAddInstalacion(data);
    }
  };

  return (
    <div className="container mx-auto py-10">
      <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Gestión de Instalaciones
          </CardTitle>
          <CardDescription>
            Añade, edita y elimina instalaciones de la base de datos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Nombre</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    Cargando instalaciones...
                  </TableCell>
                </TableRow>
              ) : instalaciones.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center">
                    No hay instalaciones registradas.
                  </TableCell>
                </TableRow>
              ) : (
                instalaciones.map((instalacion) => (
                  <TableRow key={instalacion.id}>
                    <TableCell className="font-medium">
                      {instalacion.nombre}
                    </TableCell>
                    <TableCell>{instalacion.direccion}</TableCell>
                    <TableCell>{instalacion.tipo}</TableCell>
                    <TableCell>{instalacion.contacto}</TableCell>
                    <TableCell className="text-right">
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => {
                          setSelectedInstalacion(instalacion);
                          form.reset({
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
                          });
                          setOpen(true);
                        }}
                      >
                        <Edit className="h-4 w-4 mr-2" />
                        Editar
                      </Button>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => handleDeleteInstalacion(instalacion.id)}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        Eliminar
                      </Button>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
        <CardFooter className="flex justify-end p-6">
          <Dialog>
            <DialogTrigger asChild>
              <Button onClick={() => setSelectedInstalacion(null)}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Añadir Instalación
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[625px]">
              <DialogHeader>
                <DialogTitle>
                  {selectedInstalacion ? "Editar Instalación" : "Añadir Instalación"}
                </DialogTitle>
                <DialogDescription>
                  {selectedInstalacion
                    ? "Edita los campos de la instalación. Haz clic en guardar cuando hayas terminado."
                    : "Añade una nueva instalación a la base de datos. Asegúrate de que todos los campos son correctos."}
                </DialogDescription>
              </DialogHeader>
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
                      name="latitud"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Latitud</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Latitud"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
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
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
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
                            <Input
                              type="checkbox"
                              checked={field.value}
                              onChange={(e) => field.onChange(e.target.checked)}
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
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
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
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
                            />
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
                      name="numPorteria"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Número de Portería</FormLabel>
                          <FormControl>
                            <Input
                              type="number"
                              placeholder="Número de portería"
                              {...field}
                              onChange={(e) =>
                                field.onChange(Number(e.target.value))
                              }
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
                    <Button type="submit">
                      {selectedInstalacion ? "Guardar cambios" : "Añadir"}
                    </Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardFooter>
      </Card>
    </div>
  );
};

export default InstalacionesView;

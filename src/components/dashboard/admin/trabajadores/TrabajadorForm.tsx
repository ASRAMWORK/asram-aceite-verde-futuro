import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar as CalendarIcon } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Switch } from "@/components/ui/switch";

import type { Trabajador } from "@/types";

// Define form schema with types
const formSchema = z.object({
  email: z.string().email({ message: "Introduce un email válido" }),
  nombre: z.string().min(2, { message: "Introduce un nombre válido" }),
  apellidos: z.string().min(2, { message: "Introduce apellidos válidos" }),
  telefono: z.string().min(9, { message: "Introduce un teléfono válido" }),
  direccion: z.string().optional(),
  ciudad: z.string().optional(),
  provincia: z.string().optional(),
  codigoPostal: z.string().optional(),
  pais: z.string().default("España"),
  dni: z.string().min(9, { message: "Introduce un DNI/NIE válido" }),
  fechaNacimiento: z.date().optional(),
  cargo: z.string().min(2, { message: "Indica el cargo" }),
  departamento: z.string().min(2, { message: "Indica el departamento" }),
  activo: z.boolean().default(true),
  fechaAlta: z.date(),
  tipoContrato: z.string().optional(),
  tipoJornada: z.string().optional(),
  roles: z.array(z.string()).min(1, { message: "Selecciona al menos un rol" }),
  vehiculoAsignado: z.string().optional(),
  rutasAsignadas: z.array(z.string()).optional(),
  salarioBase: z.coerce.number().optional(),
  cuentaBancaria: z.string().optional(),
  metodoPago: z.enum(["efectivo", "transferencia", "otro"]).optional(),
  frecuenciaPago: z.enum(["mensual", "semanal", "quincenal"]).optional(),
  diaCobro: z.coerce.number().optional(),
  beneficios: z.array(z.string()).optional(),
  foto: z.string().optional(),
});

type FormData = z.infer<typeof formSchema>;

interface TrabajadorFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Trabajador | null;
  vehiculos?: any[];
  rutas?: any[];
}

const roles = [
  { id: "recolector", label: "Recolector" },
  { id: "conductor", label: "Conductor" },
  { id: "supervisor", label: "Supervisor" },
  { id: "analista", label: "Analista"},
  { id: "administrador", label: "Administrador" },
  { id: "gestor", label: "Gestor" },
];

const beneficiosOptions = [
  { id: "seguro_salud", label: "Seguro de salud" },
  { id: "formacion", label: "Formación continua" },
  { id: "horario_flexible", label: "Horario flexible" },
  { id: "comidas", label: "Dietas" },
  { id: "gimnasio", label: "Gimnasio" },
  { id: "vacaciones_extra", label: "Días extra vacaciones" },
];

const TrabajadorForm = ({ onSubmit, onCancel, initialData, vehiculos = [], rutas = [] }: TrabajadorFormProps) => {
  // Process the initial data before setting form defaults
  const processedInitialData = initialData ? {
    ...initialData,
    // Ensure fields match expected types:
    rutasAsignadas: Array.isArray(initialData.rutasAsignadas) ? initialData.rutasAsignadas : [],
    metodoPago: (initialData.metodoPago as "efectivo" | "transferencia" | "otro") || "efectivo",
    frecuenciaPago: (initialData.frecuenciaPago as "mensual" | "semanal" | "quincenal") || "mensual",
    diaCobro: Number(initialData.diaCobro) || 1,
    // ... other field transformations as needed
  } : null;

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: processedInitialData?.email || "",
      nombre: processedInitialData?.nombre || "",
      apellidos: processedInitialData?.apellidos || "", // Changed from apellido to apellidos
      telefono: processedInitialData?.telefono || "",
      direccion: processedInitialData?.direccion || "",
      ciudad: processedInitialData?.ciudad || "",
      provincia: processedInitialData?.provincia || "",
      codigoPostal: processedInitialData?.codigoPostal || "",
      pais: processedInitialData?.pais || "España",
      dni: processedInitialData?.dni || "",
      fechaNacimiento: processedInitialData?.fechaNacimiento ? new Date(processedInitialData.fechaNacimiento) : undefined,
      cargo: processedInitialData?.cargo || "",
      departamento: processedInitialData?.departamento || "",
      activo: processedInitialData ? processedInitialData.activo : true,
      fechaAlta: processedInitialData?.fechaAlta ? new Date(processedInitialData.fechaAlta) : new Date(),
      tipoContrato: processedInitialData?.tipoContrato || "indefinido",
      tipoJornada: processedInitialData?.tipoJornada || "completa",
      roles: processedInitialData?.roles || ["recolector"],
      vehiculoAsignado: processedInitialData?.vehiculoAsignado || undefined,
      rutasAsignadas: processedInitialData?.rutasAsignadas || [],
      salarioBase: processedInitialData?.salarioBase,
      cuentaBancaria: processedInitialData?.cuentaBancaria || "",
      metodoPago: processedInitialData?.metodoPago || "transferencia",
      frecuenciaPago: processedInitialData?.frecuenciaPago || "mensual",
      diaCobro: processedInitialData?.diaCobro || 1,
      beneficios: processedInitialData?.beneficios || [],
      foto: processedInitialData?.foto || "",
    },
  });

  // Form submission handler
  const handleSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
      form.reset();
    } catch (error) {
      console.error("Error al guardar trabajador:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <Tabs defaultValue="datos-personales">
          <TabsList className="w-full">
            <TabsTrigger value="datos-personales" className="flex-1">Datos Personales</TabsTrigger>
            <TabsTrigger value="datos-laborales" className="flex-1">Datos Laborales</TabsTrigger>
            <TabsTrigger value="roles-asignaciones" className="flex-1">Roles y Asignaciones</TabsTrigger>
            <TabsTrigger value="datos-pago" className="flex-1">Datos de Pago</TabsTrigger>
          </TabsList>
          
          <TabsContent value="datos-personales" className="space-y-4 mt-4">
            <div className="flex flex-col md:flex-row gap-6">
              <div className="w-full md:w-1/3 flex flex-col items-center space-y-4">
                <div className="rounded-full overflow-hidden border-2 border-gray-200 h-40 w-40">
                  <Avatar className="h-40 w-40">
                    <AvatarImage src={form.getValues("foto")} />
                    <AvatarFallback className="text-4xl">
                      {form.getValues("nombre").charAt(0) || "T"}{form.getValues("apellidos").charAt(0) || ""}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <FormField
                  control={form.control}
                  name="foto"
                  render={({ field }) => (
                    <FormItem className="w-full">
                      <FormLabel>URL de la foto</FormLabel>
                      <FormControl>
                        <Input placeholder="URL de la imagen..." {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              
              <div className="w-full md:w-2/3">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="nombre"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Nombre *</FormLabel>
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
                        <FormLabel>Apellidos *</FormLabel>
                        <FormControl>
                          <Input placeholder="Apellidos" {...field} />
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
                        <FormLabel>Email *</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="ejemplo@correo.com" {...field} />
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
                        <FormLabel>Teléfono *</FormLabel>
                        <FormControl>
                          <Input placeholder="Número de teléfono" {...field} />
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
                        <FormLabel>DNI/NIE *</FormLabel>
                        <FormControl>
                          <Input placeholder="DNI o NIE" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fechaNacimiento"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Fecha de nacimiento</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy")
                                ) : (
                                  <span>Selecciona una fecha</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) =>
                                date > new Date() || date < new Date("1940-01-01")
                              }
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="mt-4">
                  <FormField
                    control={form.control}
                    name="direccion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Dirección</FormLabel>
                        <FormControl>
                          <Input placeholder="Dirección" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2 mt-2">
                  <FormField
                    control={form.control}
                    name="codigoPostal"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>C.P.</FormLabel>
                        <FormControl>
                          <Input placeholder="C.P." {...field} />
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
                </div>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="datos-laborales" className="space-y-6 mt-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="cargo"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cargo *</FormLabel>
                        <FormControl>
                          <Input placeholder="Cargo" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="departamento"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Departamento *</FormLabel>
                        <FormControl>
                          <Input placeholder="Departamento" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="fechaAlta"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Fecha de alta *</FormLabel>
                        <Popover>
                          <PopoverTrigger asChild>
                            <FormControl>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "w-full pl-3 text-left font-normal",
                                  !field.value && "text-muted-foreground"
                                )}
                              >
                                {field.value ? (
                                  format(field.value, "dd/MM/yyyy")
                                ) : (
                                  <span>Selecciona una fecha</span>
                                )}
                                <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                              </Button>
                            </FormControl>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={field.value}
                              onSelect={field.onChange}
                              disabled={(date) => date > new Date()}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="activo"
                    render={({ field }) => (
                      <FormItem className="flex flex-row items-center justify-between rounded-lg border p-3">
                        <div className="space-y-0.5">
                          <FormLabel className="text-base">Estado del trabajador</FormLabel>
                          <FormDescription>Indica si el trabajador está activo o no</FormDescription>
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
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="tipoContrato"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Tipo de Contrato</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="indefinido">Indefinido</SelectItem>
                            <SelectItem value="temporal">Temporal</SelectItem>
                            <SelectItem value="practicas">Prácticas</SelectItem>
                            <SelectItem value="formacion">Formación</SelectItem>
                            <SelectItem value="obra_servicio">Obra y servicio</SelectItem>
                            <SelectItem value="autonomo">Autónomo</SelectItem>
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
                        <FormLabel>Tipo de Jornada</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona tipo" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="completa">Completa</SelectItem>
                            <SelectItem value="parcial">Parcial</SelectItem>
                            <SelectItem value="intensiva">Intensiva</SelectItem>
                            <SelectItem value="turnos">Por turnos</SelectItem>
                            <SelectItem value="flexible">Flexible</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="roles-asignaciones" className="space-y-6 mt-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardContent className="p-4">
                  <FormField
                    control={form.control}
                    name="roles"
                    render={() => (
                      <FormItem>
                        <div className="mb-4">
                          <FormLabel className="text-base">Roles *</FormLabel>
                          <FormDescription>
                            Selecciona los roles que tendrá este trabajador
                          </FormDescription>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          {roles.map((role) => (
                            <FormField
                              key={role.id}
                              control={form.control}
                              name="roles"
                              render={({ field }) => {
                                return (
                                  <FormItem
                                    key={role.id}
                                    className="flex flex-row items-start space-x-3 space-y-0"
                                  >
                                    <FormControl>
                                      <Checkbox
                                        checked={field.value?.includes(role.id)}
                                        onCheckedChange={(checked) => {
                                          return checked
                                            ? field.onChange([...field.value, role.id])
                                            : field.onChange(
                                                field.value?.filter(
                                                  (value) => value !== role.id
                                                )
                                              )
                                        }}
                                      />
                                    </FormControl>
                                    <FormLabel className="font-normal text-sm cursor-pointer">
                                      {role.label}
                                    </FormLabel>
                                  </FormItem>
                                )
                              }}
                            />
                          ))}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
              
              <Card>
                <CardContent className="p-4 space-y-4">
                  <FormField
                    control={form.control}
                    name="vehiculoAsignado"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Vehículo asignado</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona vehículo" />
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
                    name="rutasAsignadas"
                    render={() => (
                      <FormItem>
                        <div className="mb-2">
                          <FormLabel>Rutas asignadas</FormLabel>
                        </div>
                        <div className="max-h-40 overflow-y-auto space-y-2">
                          {rutas.length === 0 ? (
                            <p className="text-sm text-gray-500">No hay rutas disponibles</p>
                          ) : (
                            rutas.map((ruta) => (
                              <FormField
                                key={ruta.id}
                                control={form.control}
                                name="rutasAsignadas"
                                render={({ field }) => {
                                  return (
                                    <FormItem
                                      key={ruta.id}
                                      className="flex flex-row items-start space-x-3 space-y-0"
                                    >
                                      <FormControl>
                                        <Checkbox
                                          checked={field.value?.includes(ruta.id)}
                                          onCheckedChange={(checked) => {
                                            return checked
                                              ? field.onChange([...field.value || [], ruta.id])
                                              : field.onChange(
                                                  field.value?.filter(
                                                    (value) => value !== ruta.id
                                                  )
                                                )
                                          }}
                                        />
                                      </FormControl>
                                      <FormLabel className="font-normal text-sm cursor-pointer">
                                        {ruta.nombre} - {ruta.distrito}
                                      </FormLabel>
                                    </FormItem>
                                  )
                                }}
                              />
                            ))
                          )}
                        </div>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </CardContent>
              </Card>
            </div>
          </TabsContent>
          
          <TabsContent value="datos-pago" className="space-y-6 mt-4">
            <Card>
              <CardContent className="p-4 space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="salarioBase"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Salario Base</FormLabel>
                        <FormControl>
                          <Input type="number" placeholder="0.00" {...field} />
                        </FormControl>
                        <FormDescription>
                          Salario bruto mensual
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="cuentaBancaria"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Cuenta Bancaria (IBAN)</FormLabel>
                        <FormControl>
                          <Input placeholder="ES00 0000 0000 0000 0000 0000" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="metodoPago"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Método de pago</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona método" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="transferencia">Transferencia</SelectItem>
                            <SelectItem value="efectivo">Efectivo</SelectItem>
                            <SelectItem value="otro">Otro</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="frecuenciaPago"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Frecuencia de pago</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value as string}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona frecuencia" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            <SelectItem value="mensual">Mensual</SelectItem>
                            <SelectItem value="quincenal">Quincenal</SelectItem>
                            <SelectItem value="semanal">Semanal</SelectItem>
                          </SelectContent>
                        </Select>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="diaCobro"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Día de cobro</FormLabel>
                        <FormControl>
                          <Input type="number" min={1} max={31} {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="beneficios"
                  render={() => (
                    <FormItem>
                      <div className="mb-4">
                        <FormLabel className="text-base">Beneficios adicionales</FormLabel>
                        <FormDescription>
                          Selecciona los beneficios adicionales del trabajador
                        </FormDescription>
                      </div>
                      <div className="grid grid-cols-2 gap-4">
                        {beneficiosOptions.map((beneficio) => (
                          <FormField
                            key={beneficio.id}
                            control={form.control}
                            name="beneficios"
                            render={({ field }) => {
                              return (
                                <FormItem
                                  key={beneficio.id}
                                  className="flex flex-row items-start space-x-3 space-y-0"
                                >
                                  <FormControl>
                                    <Checkbox
                                      checked={field.value?.includes(beneficio.id)}
                                      onCheckedChange={(checked) => {
                                        return checked
                                          ? field.onChange([...field.value || [], beneficio.id])
                                          : field.onChange(
                                              field.value?.filter(
                                                (value) => value !== beneficio.id
                                              )
                                            )
                                      }}
                                    />
                                  </FormControl>
                                  <FormLabel className="font-normal text-sm cursor-pointer">
                                    {beneficio.label}
                                  </FormLabel>
                                </FormItem>
                              )
                            }}
                          />
                        ))}
                      </div>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
        
        <div className="flex justify-end space-x-2">
          <Button variant="outline" type="button" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            {initialData ? "Actualizar" : "Guardar"} Trabajador
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default TrabajadorForm;

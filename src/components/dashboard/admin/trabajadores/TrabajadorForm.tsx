import React, { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
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
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar as CalendarIcon } from "lucide-react";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
} from "@/components/ui/command";
import {
  PopoverArrow,
  PopoverClose,
  PopoverContent as PopoverContentPrimitive,
  PopoverTrigger as PopoverTriggerPrimitive,
} from "@/components/ui/popover";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  TooltipArrow,
  TooltipClose,
  TooltipContent as TooltipContentPrimitive,
  TooltipTrigger as TooltipTriggerPrimitive,
} from "@/components/ui/tooltip";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  DropdownMenu,
  DropdownMenuCheckboxItem,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  HoverCard,
  HoverCardContent,
  HoverCardDefault,
  HoverCardDescription,
  HoverCardFooter,
  HoverCardHeader,
  HoverCardTitle,
  HoverCardTrigger,
} from "@/components/ui/hover-card";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetDescription,
  SheetFooter,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  ContextMenu,
  ContextMenuCheckboxItem,
  ContextMenuContent,
  ContextMenuGroup,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuRadioGroup,
  ContextMenuRadioItem,
  ContextMenuSeparator,
  ContextMenuShortcut,
  ContextMenuSub,
  ContextMenuSubContent,
  ContextMenuSubTrigger,
  ContextMenuTrigger,
} from "@/components/ui/context-menu";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  AspectRatio,
} from "@/components/ui/aspect-ratio";
import {
  Badge,
} from "@/components/ui/badge";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
  useCarousel,
} from "@/components/ui/carousel";
import {
  CommandDialog,
} from "@/components/ui/command";
import {
  DialogHeader as DialogHeaderPrimitive,
} from "@/components/ui/dialog";
import {
  DropdownMenuContent as DropdownMenuContentPrimitive,
} from "@/components/ui/dropdown-menu";
import {
  HoverCardContent as HoverCardContentPrimitive,
} from "@/components/ui/hover-card";
import {
  SheetContent as SheetContentPrimitive,
} from "@/components/ui/sheet";
import {
  ContextMenuContent as ContextMenuContentPrimitive,
} from "@/components/ui/context-menu";
import {
  Progress,
} from "@/components/ui/progress";
import {
  RadioGroup,
  RadioGroupItem,
} from "@/components/ui/radio-group";
import {
  ScrollArea,
} from "@/components/ui/scroll-area";
import {
  Separator,
} from "@/components/ui/separator";
import {
  Slider,
} from "@/components/ui/slider";
import {
  Switch,
} from "@/components/ui/switch";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import {
  Toast,
  ToastAction,
  ToastClose,
  ToastDescription,
  ToastProvider,
  ToastTitle,
  ToastViewport,
  useToast,
} from "@/components/ui/use-toast";
import {
  Toggle,
} from "@/components/ui/toggle";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
  ResizableSeparator,
} from "@/components/ui/resizable";
import {
  Skeleton,
} from "@/components/ui/skeleton";
import {
  ResizableHandle as ResizableHandlePrimitive,
} from "@/components/ui/resizable";
import {
  RangeCalendar,
} from "@/components/ui/calendar";
import {
  HoverCardPortal,
} from "@/components/ui/hover-card";
import {
  CommandList as CommandListPrimitive,
} from "@/components/ui/command";
import {
  SheetPortal,
} from "@/components/ui/sheet";
import {
  ContextMenuPortal,
} from "@/components/ui/context-menu";
import {
  CollapsiblePortal,
} from "@/components/ui/collapsible";
import {
  CarouselApi,
} from "@/components/ui/carousel";
import {
  CarouselContent as CarouselContentPrimitive,
} from "@/components/ui/carousel";
import {
  CarouselItem as CarouselItemPrimitive,
} from "@/components/ui/carousel";
import {
  CarouselNext as CarouselNextPrimitive,
} from "@/components/ui/carousel";
import {
  CarouselPrevious as CarouselPreviousPrimitive,
} from "@/components/ui/carousel";
import {
  useCarousel as useCarouselPrimitive,
} from "@/components/ui/carousel";
import {
  Toast as ToastPrimitive,
} from "@/components/ui/use-toast";
import {
  ToastAction as ToastActionPrimitive,
} from "@/components/ui/use-toast";
import {
  ToastClose as ToastClosePrimitive,
} from "@/components/ui/use-toast";
import {
  ToastDescription as ToastDescriptionPrimitive,
} from "@/components/ui/use-toast";
import {
  ToastProvider as ToastProviderPrimitive,
} from "@/components/ui/use-toast";
import {
  ToastTitle as ToastTitlePrimitive,
} from "@/components/ui/use-toast";
import {
  ToastViewport as ToastViewportPrimitive,
} from "@/components/ui/use-toast";
import {
  useToast as useToastPrimitive,
} from "@/components/ui/use-toast";
import {
  AlertDialogContent as AlertDialogContentPrimitive,
} from "@/components/ui/alert-dialog";
import {
  AlertDialogFooter as AlertDialogFooterPrimitive,
} from "@/components/ui/alert-dialog";
import {
  AlertDialogHeader as AlertDialogHeaderPrimitive,
} from "@/components/ui/alert-dialog";
import {
  DialogContent as DialogContentPrimitive,
} from "@/components/ui/dialog";
import {
  DialogFooter as DialogFooterPrimitive,
} from "@/components/ui/dialog";
import {
  DialogHeader as DialogHeaderPrimitive,
} from "@/components/ui/dialog";
import {
  DropdownMenuContent as DropdownMenuContentPrimitive,
} from "@/components/ui/dropdown-menu";
import {
  HoverCardContent as HoverCardContentPrimitive,
} from "@/components/ui/hover-card";
import {
  SheetContent as SheetContentPrimitive,
} from "@/components/ui/sheet";
import {
  ContextMenuContent as ContextMenuContentPrimitive,
} from "@/components/ui/context-menu";
import { CalendarIcon } from "lucide-react";
import { Trabajador } from "@/types";

const formSchema = z.object({
  nombre: z.string().min(2, {
    message: "El nombre debe tener al menos 2 caracteres.",
  }),
  apellido: z.string().min(2, {
    message: "El apellido debe tener al menos 2 caracteres.",
  }),
  email: z.string().email({
    message: "Por favor, introduce un email válido.",
  }),
  telefono: z.string().min(9, {
    message: "El teléfono debe tener al menos 9 números.",
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
    message: "El código postal debe tener al menos 5 números.",
  }),
  pais: z.string().min(2, {
    message: "El país debe tener al menos 2 caracteres.",
  }),
  dni: z.string().min(9, {
    message: "El DNI debe tener al menos 9 caracteres.",
  }),
  fechaNacimiento: z.date({
    required_error: "Se requiere una fecha de nacimiento.",
  }),
  cargo: z.string().min(2, {
    message: "El cargo debe tener al menos 2 caracteres.",
  }),
  departamento: z.string().min(2, {
    message: "El departamento debe tener al menos 2 caracteres.",
  }),
  fechaContratacion: z.date({
    required_error: "Se requiere una fecha de contratación.",
  }),
  foto: z.string().optional(),
  fechaAlta: z.date().optional(),
  tipoContrato: z.string().optional(),
  tipoJornada: z.string().optional(),
  roles: z.array(z.string()).optional(),
  vehiculoAsignado: z.string().optional(),
  rutasAsignadas: z.array(z.string()).optional(),
  salarioBase: z.number().optional(),
  cuentaBancaria: z.string().optional(),
  metodoPago: z.enum(["efectivo", "transferencia", "otro"]).optional(),
  frecuenciaPago: z.enum(["mensual", "semanal", "quincenal"]).optional(),
  diaCobro: z.number().optional(),
  beneficios: z.array(z.string()).optional(),
  activo: z.boolean().default(true),
});

interface TrabajadorFormProps {
  onSubmit: (data: Trabajador) => void;
  onCancel: () => void;
  initialData?: Partial<Trabajador>;
}

const TrabajadorForm: React.FC<TrabajadorFormProps> = ({ onSubmit, onCancel, initialData }) => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: initialData?.nombre || "",
      apellido: initialData?.apellido || "",
      email: initialData?.email || "",
      telefono: initialData?.telefono || "",
      direccion: initialData?.direccion || "",
      ciudad: initialData?.ciudad || "",
      provincia: initialData?.provincia || "",
      codigoPostal: initialData?.codigoPostal || "",
      pais: initialData?.pais || "",
      dni: initialData?.dni || "",
      fechaNacimiento: initialData?.fechaNacimiento || new Date(),
      cargo: initialData?.cargo || "",
      departamento: initialData?.departamento || "",
      fechaContratacion: initialData?.fechaContratacion || new Date(),
      foto: initialData?.foto || "",
      fechaAlta: initialData?.fechaAlta || new Date(),
      tipoContrato: initialData?.tipoContrato || "",
      tipoJornada: initialData?.tipoJornada || "",
      roles: initialData?.roles || [],
      vehiculoAsignado: initialData?.vehiculoAsignado || "",
      rutasAsignadas: initialData?.rutasAsignadas || [],
      salarioBase: initialData?.salarioBase || 0,
      cuentaBancaria: initialData?.cuentaBancaria || "",
      metodoPago: initialData?.metodoPago || "efectivo" as "efectivo" | "transferencia" | "otro",
      frecuenciaPago: initialData?.frecuenciaPago || "mensual" as "mensual" | "semanal" | "quincenal",
      diaCobro: initialData?.diaCobro || 0,
      beneficios: initialData?.beneficios || [],
      activo: initialData?.activo !== undefined ? initialData.activo : true,
    },
  });

  function onSubmitHandler(values: z.infer<typeof formSchema>) {
    onSubmit(values);
  }

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmitHandler)} className="space-y-8">
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
            name="apellido"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Apellido</FormLabel>
                <FormControl>
                  <Input placeholder="Apellido" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Email" type="email" {...field} />
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
                  <Input placeholder="Teléfono" type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="pais"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>País</FormLabel>
                <FormControl>
                  <Input
                    placeholder="País"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="dni"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>DNI</FormLabel>
                <FormControl>
                  <Input
                    placeholder="DNI/NIF"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fechaNacimiento"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Nacimiento</FormLabel>
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
                          format(new Date(field.value), "PPP")
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
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={field.onChange}
                      disabled={(date) =>
                        date > new Date() || date < new Date("1900-01-01")
                      }
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cargo"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Cargo</FormLabel>
                <FormControl>
                  <Input
                    placeholder="Cargo en la empresa"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="departamento"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Departamento</FormLabel>
                <FormControl>
                  <Input placeholder="Departamento" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="fechaContratacion"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de Contratación</FormLabel>
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
                          format(new Date(field.value), "PPP")
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
                      selected={field.value ? new Date(field.value) : undefined}
                      onSelect={field.onChange}
                      disabled={(date) => date > new Date()}
                    />
                  </PopoverContent>
                </Popover>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="salarioBase"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Salario Base</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Salario Base" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="cuentaBancaria"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cuenta Bancaria</FormLabel>
                <FormControl>
                  <Input placeholder="Cuenta Bancaria" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="metodoPago"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Método de Pago</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona un método" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="efectivo">Efectivo</SelectItem>
                    <SelectItem value="transferencia">Transferencia</SelectItem>
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
                <FormLabel>Frecuencia de Pago</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona la frecuencia" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="mensual">Mensual</SelectItem>
                    <SelectItem value="semanal">Semanal</SelectItem>
                    <SelectItem value="quincenal">Quincenal</SelectItem>
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
            name="diaCobro"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Día de Cobro</FormLabel>
                <FormControl>
                  <Input type="number" placeholder="Día de Cobro" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="activo"
            render={({ field }) => (
              <FormItem className="flex items-center space-x-2 space-y-0 rounded-md border p-4">
                <FormControl>
                  <Checkbox
                    checked={field.value}
                    onCheckedChange={field.onChange}
                  />
                </FormControl>
                <div className="space-y-0.5">
                  <FormLabel className="text-base">Activo</FormLabel>
                  <FormDescription>
                    Indica si el trabajador está activo o no.
                  </FormDescription>
                </div>
              </FormItem>
            )}
          />
        </div>

        <div className="flex justify-end gap-2">
          <Button variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">Guardar</Button>
        </div>
      </form>
    </Form>
  );
};

export default TrabajadorForm;

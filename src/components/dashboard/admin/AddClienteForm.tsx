import React, { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from "sonner";
import { useUsuarios } from "@/hooks/useUsuarios";
import { usePuntosVerdes } from "@/hooks/usePuntosVerdes";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { distritos, getBarriosByDistrito } from "@/data/madridDistritos";
import { Loader2 } from "lucide-react";
import { Usuario, PuntoVerde } from "@/types";

const tipos = [
  "Comunidad de Vecinos",
  "Bar/Restaurante",
  "Hotel",
  "Asociación/Entidad",
  "Centro Escolar",
  "Usuario Particular"
];

const frecuencias = [
  "Semanal",
  "Quincenal",
  "Mensual",
  "Bimestral",
  "Trimestral",
  "Bajo demanda"
];

const formSchema = z.object({
  nombre: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  tipo: z.string().min(1, { message: "Selecciona un tipo de cliente" }),
  direccion: z.string().min(5, { message: "La dirección debe tener al menos 5 caracteres" }),
  distrito: z.string().min(1, { message: "Selecciona un distrito" }),
  barrio: z.string().min(1, { message: "Selecciona un barrio" }),
  telefono: z.string().min(9, { message: "Introduce un número de teléfono válido" }),
  email: z.string().email({ message: "Introduce un email válido" }).optional().or(z.literal("")),
  numViviendas: z.number().int().min(0).optional(),
  numContenedores: z.number().int().min(0).optional(),
  frecuenciaRecogida: z.string().min(1, { message: "Selecciona una frecuencia de recogida" }),
  activo: z.boolean().default(true),
});

type FormValues = z.infer<typeof formSchema>;

interface AddClienteFormProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

export function AddClienteForm({ isOpen, onClose, onSuccess }: AddClienteFormProps) {
  const { addUsuario } = useUsuarios();
  const { addPuntoVerde } = usePuntosVerdes();
  const [filteredBarrios, setFilteredBarrios] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  const form = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      tipo: "",
      direccion: "",
      distrito: "",
      barrio: "",
      telefono: "",
      email: "",
      numViviendas: 0,
      numContenedores: 0,
      frecuenciaRecogida: "",
      activo: true,
    },
  });

  const handleDistritoChange = (distrito: string) => {
    form.setValue("distrito", distrito);
    form.setValue("barrio", "");
    setFilteredBarrios(getBarriosByDistrito(distrito));
  };

  const onSubmit = async (data: FormValues) => {
    try {
      setSubmitting(true);
      
      const formData = form.getValues();
      
      const nuevoUsuario: Omit<Usuario, 'id'> = {
        nombre: formData.nombre,
        apellidos: "",
        email: formData.email || "",
        telefono: formData.telefono,
        direccion: formData.direccion,
        tipo: formData.tipo,
        distrito: formData.distrito,
        barrio: formData.barrio,
        activo: true,
        numViviendas: formData.tipo === "Comunidad de Vecinos" ? parseInt(formData.numViviendas?.toString() || "0") : undefined,
        numContenedores: formData.tipo === "Comunidad de Vecinos" ? parseInt(formData.numContenedores?.toString() || "0") : undefined,
        frecuenciaRecogida: formData.frecuenciaRecogida
      };
      
      const usuarioCreado = await addUsuario(nuevoUsuario);
      
      if (data.tipo === "Comunidad de Vecinos" && data.numContenedores && data.numContenedores > 0) {
        const nuevoPuntoVerde: Omit<PuntoVerde, "id"> = {
          distrito: data.distrito,
          barrio: data.barrio,
          direccion: data.direccion,
          numViviendas: data.numViviendas || 0,
          numContenedores: data.numContenedores || 0,
          telefono: data.telefono,
          litrosRecogidos: 0,
          administradorId: null,
        };
        
        await addPuntoVerde(nuevoPuntoVerde);
      }
      
      toast.success("Cliente añadido correctamente");
      form.reset();
      if (onSuccess) onSuccess();
      onClose();
    } catch (error) {
      console.error("Error al añadir cliente:", error);
      toast.error("Error al añadir el cliente");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Añadir nuevo cliente</DialogTitle>
          <DialogDescription>
            Completa el formulario para añadir un nuevo cliente al sistema
          </DialogDescription>
        </DialogHeader>
        
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
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
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona tipo" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {tipos.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <Separator />
            <h3 className="text-lg font-medium">Datos de contacto</h3>
            
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
                      onValueChange={handleDistritoChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona distrito" />
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
                      disabled={filteredBarrios.length === 0}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona barrio" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {filteredBarrios.map((barrio) => (
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
            
            <div className="grid grid-cols-2 gap-4">
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
            </div>
            
            <Separator />
            <h3 className="text-lg font-medium">Datos de servicio</h3>
            
            <div className="grid grid-cols-3 gap-4">
              <FormField
                control={form.control}
                name="numViviendas"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Nº de viviendas</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="numContenedores"
                render={({ field: { onChange, ...field } }) => (
                  <FormItem>
                    <FormLabel>Nº de contenedores</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="0" 
                        onChange={(e) => onChange(parseInt(e.target.value) || 0)}
                        {...field} 
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={form.control}
                name="frecuenciaRecogida"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frecuencia de recogida</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona frecuencia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {frecuencias.map((frecuencia) => (
                          <SelectItem key={frecuencia} value={frecuencia}>
                            {frecuencia}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={onClose}
                disabled={submitting}
              >
                Cancelar
              </Button>
              <Button 
                type="submit"
                className="bg-asram hover:bg-asram-700"
                disabled={submitting}
              >
                {submitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Añadiendo...
                  </>
                ) : (
                  'Añadir cliente'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}

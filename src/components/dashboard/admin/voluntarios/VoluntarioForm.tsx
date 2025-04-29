
import React from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Card } from "@/components/ui/card";
import type { Voluntario } from "@/types";

const diasSemana = [
  { id: "lunes", label: "Lunes" },
  { id: "martes", label: "Martes" },
  { id: "miercoles", label: "Miércoles" },
  { id: "jueves", label: "Jueves" },
  { id: "viernes", label: "Viernes" },
  { id: "sabado", label: "Sábado" },
  { id: "domingo", label: "Domingo" },
];

const horasDisponibilidadOpciones = [
  "Mañanas (9:00 - 13:00)",
  "Tardes (16:00 - 20:00)",
  "Flexible",
  "Fines de semana",
  "Eventos específicos"
];

const formSchema = z.object({
  nombre: z.string().min(2, { message: "El nombre es obligatorio" }),
  apellidos: z.string().min(2, { message: "Los apellidos son obligatorios" }),
  email: z.string().email({ message: "Email inválido" }),
  telefono: z.string().min(9, { message: "Teléfono inválido" }),
  direccion: z.string().optional(),
  codigoPostal: z.string().optional(),
  diasDisponibles: z.array(z.string()).min(1, { message: "Selecciona al menos un día" }),
  horasDisponibles: z.string().min(1, { message: "Selecciona tu disponibilidad horaria" }),
  habilidades: z.array(z.string()).optional(),
  experiencia: z.string().optional(),
  activo: z.boolean().default(true)
});

type FormData = z.infer<typeof formSchema>;

interface VoluntarioFormProps {
  onSubmit: (data: FormData) => Promise<void>;
  onCancel: () => void;
  initialData?: Voluntario | null;
}

const VoluntarioForm = ({ onSubmit, onCancel, initialData }: VoluntarioFormProps) => {
  // Process initialData to ensure it matches expected form structure
  const processedData = initialData ? {
    nombre: initialData.nombre || "",
    apellidos: initialData.apellidos || initialData.apellido || "",
    email: initialData.email || "",
    telefono: initialData.telefono || "",
    direccion: initialData.direccion || "",
    codigoPostal: initialData.codigoPostal || "",
    diasDisponibles: initialData.diasDisponibles || [],
    // Convert any array of horasDisponibles to a string
    horasDisponibles: typeof initialData.horasDisponibles === 'string' 
      ? initialData.horasDisponibles 
      : Array.isArray(initialData.horasDisponibles) 
        ? initialData.horasDisponibles[0] || ""
        : "",
    habilidades: initialData.habilidades || [],
    experiencia: initialData.experiencia || "",
    activo: initialData.activo
  } : null;
  
  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: processedData || {
      nombre: "",
      apellidos: "",
      email: "",
      telefono: "",
      direccion: "",
      codigoPostal: "",
      diasDisponibles: [],
      horasDisponibles: "",
      habilidades: [],
      experiencia: "",
      activo: true
    }
  });

  const handleSubmit = async (data: FormData) => {
    try {
      await onSubmit(data);
    } catch (error) {
      console.error("Error al guardar voluntario:", error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nombre"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre del voluntario" {...field} />
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
                  <Input placeholder="Apellidos del voluntario" {...field} />
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
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input type="tel" placeholder="123456789" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="direccion"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección</FormLabel>
                <FormControl>
                  <Input placeholder="Dirección (opcional)" {...field} />
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
                  <Input placeholder="28001" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <Card className="p-4 border-dashed bg-gray-50">
          <h3 className="font-medium mb-3">Disponibilidad</h3>
          
          <FormField
            control={form.control}
            name="diasDisponibles"
            render={() => (
              <FormItem>
                <FormLabel>Días disponibles</FormLabel>
                <div className="flex flex-wrap gap-4">
                  {diasSemana.map((dia) => (
                    <FormField
                      key={dia.id}
                      control={form.control}
                      name="diasDisponibles"
                      render={({ field }) => {
                        return (
                          <FormItem 
                            key={dia.id}
                            className="flex flex-row items-start space-x-3 space-y-0"
                          >
                            <FormControl>
                              <Checkbox
                                checked={field.value?.includes(dia.id)}
                                onCheckedChange={(checked) => {
                                  return checked
                                    ? field.onChange([...field.value, dia.id])
                                    : field.onChange(field.value?.filter((value) => value !== dia.id))
                                }}
                              />
                            </FormControl>
                            <FormLabel className="font-normal cursor-pointer">
                              {dia.label}
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
          
          <div className="mt-4">
            <FormField
              control={form.control}
              name="horasDisponibles"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Disponibilidad horaria</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value}>
                    <FormControl>
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tu disponibilidad" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {horasDisponibilidadOpciones.map((opcion) => (
                        <SelectItem key={opcion} value={opcion}>
                          {opcion}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
        </Card>
        
        <FormField
          control={form.control}
          name="experiencia"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Experiencia previa</FormLabel>
              <FormControl>
                <Input placeholder="Experiencia previa como voluntario (opcional)" {...field} />
              </FormControl>
              <FormDescription>
                Indica cualquier experiencia previa como voluntario
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="activo"
          render={({ field }) => (
            <FormItem className="flex flex-row items-start space-x-3 space-y-0">
              <FormControl>
                <Checkbox 
                  checked={field.value} 
                  onCheckedChange={field.onChange}
                />
              </FormControl>
              <div className="space-y-1 leading-none">
                <FormLabel>
                  Voluntario activo
                </FormLabel>
                <FormDescription>
                  Indica si el voluntario está actualmente disponible
                </FormDescription>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="flex justify-end space-x-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit" className="bg-asram hover:bg-asram-700">
            {initialData ? "Actualizar" : "Guardar"} Voluntario
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default VoluntarioForm;

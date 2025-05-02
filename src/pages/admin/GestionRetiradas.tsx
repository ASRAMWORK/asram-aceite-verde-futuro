
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Calendar } from "@/components/ui/calendar"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { CalendarIcon } from "lucide-react";
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useToast } from "@/components/ui/use-toast"
import { useTrabajadores } from '@/hooks/useTrabajadores';
import { useRutas } from '@/hooks/useRutas';
import { Ruta } from '@/types';

// Create the hook import for useDistritos
import { useDistritos } from '@/hooks/useDistritos';

const formSchema = z.object({
  nombre: z.string().min(3, { message: "El nombre debe tener al menos 3 caracteres" }),
  fecha: z.date({
    required_error: "Se requiere una fecha.",
  }),
  distrito: z.string().min(1, { message: "Selecciona un distrito" }),
  zonas: z.array(z.string()).min(1, { message: "Selecciona al menos una zona" }),
  hora: z.string().min(5, { message: "Introduce una hora válida" }),
  recogedorId: z.string().min(1, { message: "Selecciona un recogedor" }),
  tiempoEstimado: z.number().min(1, { message: "Introduce un tiempo estimado" }),
  frecuencia: z.string().min(1, { message: "Selecciona una frecuencia" }),
});

const GestionRetiradas = () => {
  const [open, setOpen] = React.useState(false)
  const navigate = useNavigate();
  const { toast } = useToast()
  const { distritos } = useDistritos();
  const { trabajadores } = useTrabajadores();
  const { addRuta } = useRutas();

  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: "",
      fecha: new Date(),
      distrito: "",
      zonas: [] as string[],  // Explicitly typing as string array
      hora: "08:00",
      recogedorId: "",
      tiempoEstimado: 60,
      frecuencia: "diaria",
    },
  });

  const onSubmit = async (values: any) => {
    if (values.zonas.length === 0) {
      toast({
        title: "Error",
        description: "Debes seleccionar al menos una zona.",
        variant: "destructive",
      });
      return;
    }
      
    try {
      const nuevaRuta: Omit<Ruta, 'id'> = {
        nombre: values.nombre,
        fecha: values.fecha,
        distrito: values.distrito,
        barrios: values.zonas,
        hora: values.hora,
        recogedores: values.recogedorId,
        clientes: [],
        puntosRecogida: 0,
        distanciaTotal: 0,
        tiempoEstimado: values.tiempoEstimado.toString(), // Convert to string to match the Ruta interface
        frecuencia: values.frecuencia,
        completada: false,
        litrosTotales: 0,
        puntos: [], // This is an array not a string
        createdAt: new Date(),
        updatedAt: new Date(),
        tipo: 'recogida' // Adding required tipo property
      };
      
      await addRuta(nuevaRuta);
      toast({
        title: "Éxito",
        description: "Ruta creada correctamente.",
      });
      navigate('/rutas');
    } catch (error) {
      toast({
        title: "Error",
        description: "Error al crear la ruta.",
        variant: "destructive",
      });
    }
  };

  // Create a state for the selected zones
  const [selectedZones, setSelectedZones] = useState<string[]>([]);

  return (
    <div className="container mx-auto py-10">
      <h1 className="text-3xl font-bold mb-4">Gestionar Retiradas</h1>
      <Separator className="mb-6" />

      <div className="max-w-3xl mx-auto">
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="nombre"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Nombre de la Ruta</FormLabel>
                  <FormControl>
                    <Input placeholder="Ej: Retirada zona norte" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="fecha"
                render={({ field }) => (
                  <FormItem className="flex flex-col">
                    <FormLabel>Fecha de Retirada</FormLabel>
                    <Popover>
                      <PopoverTrigger asChild>
                        <FormControl>
                          <Button
                            variant={"outline"}
                            className="pl-3 text-left font-normal"
                          >
                            {field.value ? (
                              format(field.value, "PPP", { locale: es })
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
                          locale={es}
                          selected={field.value}
                          onSelect={field.onChange}
                          disabled={(date) =>
                            date < new Date()
                          }
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
                name="hora"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Hora de Retirada</FormLabel>
                    <FormControl>
                      <Input type="time" defaultValue="08:00" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="distrito"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Distrito</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
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
                name="recogedorId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Recogedor Asignado</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona un recogedor" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {trabajadores.map((trabajador) => (
                          <SelectItem key={trabajador.id} value={trabajador.id}>
                            {trabajador.nombre} {trabajador.apellidos}
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
              name="zonas"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Zonas de Retirada</FormLabel>
                  <div className="grid grid-cols-2 gap-2">
                    {distritos.map((distrito) => (
                      <div key={distrito} className="flex items-center space-x-2">
                        <input 
                          type="checkbox"
                          id={distrito}
                          value={distrito}
                          checked={field.value.includes(distrito)}
                          onChange={(e) => {
                            const value = e.target.value;
                            const isChecked = e.target.checked;
                            
                            const newZones = isChecked
                              ? [...field.value, value]
                              : field.value.filter(v => v !== value);
                              
                            field.onChange(newZones);
                          }}
                          className="h-4 w-4"
                        />
                        <label htmlFor={distrito} className="text-sm">{distrito}</label>
                      </div>
                    ))}
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="tiempoEstimado"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Tiempo Estimado (minutos)</FormLabel>
                    <FormControl>
                      <Input 
                        type="number" 
                        placeholder="Ej: 60" 
                        value={field.value}
                        onChange={(e) => field.onChange(parseInt(e.target.value, 10) || 0)}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="frecuencia"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Frecuencia</FormLabel>
                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Selecciona la frecuencia" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="diaria">Diaria</SelectItem>
                        <SelectItem value="semanal">Semanal</SelectItem>
                        <SelectItem value="quincenal">Quincenal</SelectItem>
                        <SelectItem value="mensual">Mensual</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <Button type="submit">Crear Ruta</Button>
          </form>
        </Form>
      </div>
    </div>
  );
};

export default GestionRetiradas;

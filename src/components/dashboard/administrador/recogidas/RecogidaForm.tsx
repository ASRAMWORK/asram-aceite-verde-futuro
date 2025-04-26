import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { CalendarDays } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toast } from 'sonner';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { useComunidadesVecinos } from '@/hooks/useComunidadesVecinos';
import { distritos, getBarriosByDistrito } from '@/data/madridDistritos';

const recogidaSchema = z.object({
  comunidadId: z.string().min(1, 'Selecciona una comunidad'),
  fechaRecogida: z.date({
    required_error: "Selecciona una fecha",
  }),
  litrosRecogidos: z.number().min(1, 'Ingresa la cantidad de litros'),
  observaciones: z.string().optional(),
  distrito: z.string().min(1, 'Selecciona un distrito'),
  barrio: z.string().min(1, 'Selecciona un barrio'),
});

type RecogidaFormValues = z.infer<typeof recogidaSchema>;

interface RecogidaFormProps {
  onCancel: () => void;
  recogidaId?: string;
}

const RecogidaForm: React.FC<RecogidaFormProps> = ({ onCancel, recogidaId }) => {
  const { comunidades, updateBeneficios } = useComunidadesVecinos();
  const [date, setDate] = useState<Date>(new Date());
  const [selectedDistrito, setSelectedDistrito] = useState<string>('');
  const [barrios, setBarrios] = useState<string[]>([]);
  
  useEffect(() => {
    if (selectedDistrito) {
      setBarrios(getBarriosByDistrito(selectedDistrito));
    }
  }, [selectedDistrito]);
  
  const form = useForm<RecogidaFormValues>({
    resolver: zodResolver(recogidaSchema),
    defaultValues: {
      comunidadId: '',
      fechaRecogida: new Date(),
      litrosRecogidos: 0,
      observaciones: '',
      distrito: '',
      barrio: '',
    }
  });

  const onSubmit = async (data: RecogidaFormValues) => {
    try {
      // Here you would normally save the recogida data to your database
      console.log('Datos de recogida:', data);
      
      // Update environmental benefits based on liters collected
      if (data.comunidadId && data.litrosRecogidos) {
        await updateBeneficios(data.comunidadId, data.litrosRecogidos);
      }
      
      toast.success('Recogida registrada correctamente');
      onCancel();
    } catch (error) {
      toast.error('Error al registrar la recogida');
      console.error(error);
    }
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="comunidadId"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Comunidad</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar comunidad" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {comunidades.map(comunidad => (
                      <SelectItem key={comunidad.id} value={comunidad.id}>
                        {comunidad.nombre}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <FormDescription>
                  Selecciona la comunidad donde se realizó la recogida
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="fechaRecogida"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Fecha de recogida</FormLabel>
                <Popover>
                  <PopoverTrigger asChild>
                    <FormControl>
                      <Button
                        variant={"outline"}
                        className={cn(
                          "pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "PPP")
                        ) : (
                          <span>Seleccionar fecha</span>
                        )}
                        <CalendarDays className="ml-auto h-4 w-4 opacity-50" />
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
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
                <FormDescription>
                  Fecha en la que se realizó la recogida
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="litrosRecogidos"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Litros recogidos</FormLabel>
              <FormControl>
                <Input 
                  type="number" 
                  placeholder="0" 
                  {...field}
                  onChange={(e) => field.onChange(Number(e.target.value))}
                />
              </FormControl>
              <FormDescription>
                Cantidad de litros de aceite recogidos
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <FormField
          control={form.control}
          name="observaciones"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Observaciones</FormLabel>
              <FormControl>
                <Textarea 
                  placeholder="Observaciones sobre la recogida" 
                  className="resize-none" 
                  {...field} 
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="distrito"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Distrito</FormLabel>
                <Select 
                  onValueChange={(value) => {
                    field.onChange(value);
                    setSelectedDistrito(value);
                  }} 
                  value={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar distrito" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {distritos.map(distrito => (
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
                  value={field.value}
                  disabled={!selectedDistrito}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccionar barrio" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {barrios.map(barrio => (
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
        
        <div className="flex justify-end gap-2 pt-4">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Registrar Recogida
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RecogidaForm;

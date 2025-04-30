
import React from 'react';
import { useForm } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { AddressInput } from '@/components/ui/address-input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { CalendarIcon } from 'lucide-react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { AddressComponent } from '@/lib/googleMaps';
import { toast } from 'sonner';

interface RecogidaFormProps {
  onCancel: () => void;
  onSubmit: (data: any) => void;
  initialData?: any;
}

const RecogidaForm: React.FC<RecogidaFormProps> = ({ onCancel, onSubmit, initialData }) => {
  const form = useForm({
    defaultValues: initialData || {
      nombreContacto: '',
      telefonoContacto: '',
      emailContacto: '',
      direccionRecogida: '',
      distrito: '',
      barrio: '',
      fechaRecogida: new Date(),
      horaRecogida: '10:00',
      cantidadAproximada: 0,
      tipoAceite: 'vegetal',
      notasAdicionales: '',
      latitud: 0,
      longitud: 0,
    },
  });

  const handleAddressSelected = (addressData: AddressComponent) => {
    if (addressData.direccionCompleta) {
      form.setValue('direccionRecogida', addressData.direccionCompleta);
    }
    if (addressData.distrito) {
      form.setValue('distrito', addressData.distrito);
    }
    if (addressData.barrio) {
      form.setValue('barrio', addressData.barrio);
    }
    if (addressData.latitud) {
      form.setValue('latitud', addressData.latitud);
    }
    if (addressData.longitud) {
      form.setValue('longitud', addressData.longitud);
    }
    
    toast.success("Dirección autocompletada con éxito");
  };

  const handleSubmit = (data: any) => {
    onSubmit({
      ...data,
      fecha: data.fechaRecogida,
    });
  };

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <FormField
            control={form.control}
            name="nombreContacto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Nombre de contacto</FormLabel>
                <FormControl>
                  <Input placeholder="Nombre completo" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="telefonoContacto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono</FormLabel>
                <FormControl>
                  <Input placeholder="Número de teléfono" type="tel" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="emailContacto"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input placeholder="Correo electrónico" type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="direccionRecogida"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Dirección de recogida</FormLabel>
                <FormControl>
                  <AddressInput 
                    placeholder="Buscar dirección..." 
                    {...field}
                    onAddressSelected={handleAddressSelected}
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
                          "w-full pl-3 text-left font-normal",
                          !field.value && "text-muted-foreground"
                        )}
                      >
                        {field.value ? (
                          format(field.value, "P", { locale: es })
                        ) : (
                          <span>Seleccionar fecha</span>
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
                      disabled={(date) => date < new Date()}
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
            name="horaRecogida"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora de recogida</FormLabel>
                <FormControl>
                  <Input type="time" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="cantidadAproximada"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Cantidad aproximada (litros)</FormLabel>
                <FormControl>
                  <Input type="number" min={0} {...field} onChange={(e) => field.onChange(Number(e.target.value))} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <FormField
            control={form.control}
            name="tipoAceite"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tipo de aceite</FormLabel>
                <Select onValueChange={field.onChange} defaultValue={field.value}>
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona el tipo" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    <SelectItem value="vegetal">Aceite vegetal</SelectItem>
                    <SelectItem value="oliva">Aceite de oliva</SelectItem>
                    <SelectItem value="mixto">Mixto</SelectItem>
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        
        <FormField
          control={form.control}
          name="notasAdicionales"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Notas adicionales</FormLabel>
              <FormControl>
                <Textarea placeholder="Información adicional sobre la recogida" className="min-h-[100px]" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="flex justify-end space-x-2">
          <Button type="button" variant="outline" onClick={onCancel}>
            Cancelar
          </Button>
          <Button type="submit">
            Guardar
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default RecogidaForm;

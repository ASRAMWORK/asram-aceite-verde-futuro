
import React from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, School, Users, Clock, Mail, Phone, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { AlianzaVerde, TallerProgramado } from "@/types";
import { format } from "date-fns";

interface TallerFormProps {
  centros: AlianzaVerde[];
  onSubmit: (data: Partial<TallerProgramado>) => void;
  taller?: TallerProgramado;
}

const TallerForm = ({ centros, onSubmit, taller }: TallerFormProps) => {
  const defaultValues: Partial<TallerProgramado> = taller 
    ? { ...taller } 
    : { 
        titulo: '', 
        fecha: new Date(), 
        hora: '10:00',
        duracion: 60,
        aforo: 20,
        gratuito: true,
        precio: 0,
        participantes: 0,
        tipo: 'reciclaje',
        responsable: '',
        contactoEmail: '',
        contactoTelefono: '',
        completado: false
      };

  const form = useForm<Partial<TallerProgramado>>({
    defaultValues
  });

  const watchGratuito = form.watch('gratuito');

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="organizador" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Centro Educativo</FormLabel>
              <Select
                onValueChange={field.onChange}
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar centro" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {centros.map((centro) => (
                    <SelectItem key={centro.id} value={centro.id}>
                      {centro.nombre}
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
          name="titulo"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Tipo de Taller</FormLabel>
              <Select 
                onValueChange={field.onChange} 
                defaultValue={field.value}
              >
                <FormControl>
                  <SelectTrigger>
                    <SelectValue placeholder="Seleccionar tipo" />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  <SelectItem value="reciclaje">Taller de Reciclaje</SelectItem>
                  <SelectItem value="huerto">Mini Huerto Escolar</SelectItem>
                  <SelectItem value="energia">Energías Renovables</SelectItem>
                  <SelectItem value="embajadores">Formación Embajadores</SelectItem>
                  <SelectItem value="jabon">Fabricación de Jabón</SelectItem>
                  <SelectItem value="otro">Otro</SelectItem>
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fecha"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha del Taller</FormLabel>
                <div className="flex">
                  <Calendar className="h-4 w-4 mr-2 mt-3" />
                  <FormControl>
                    <Input 
                      type="date" 
                      value={field.value instanceof Date ? format(field.value, 'yyyy-MM-dd') : ''}
                      onChange={(e) => {
                        field.onChange(e.target.value ? new Date(e.target.value) : null);
                      }}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="hora"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Hora</FormLabel>
                <div className="flex">
                  <Clock className="h-4 w-4 mr-2 mt-3" />
                  <FormControl>
                    <Input 
                      type="time" 
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="responsable"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Responsable del Taller</FormLabel>
              <div className="flex">
                <User className="h-4 w-4 mr-2 mt-3" />
                <FormControl>
                  <Input placeholder="Nombre del responsable" {...field} />
                </FormControl>
              </div>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="contactoEmail"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email de contacto</FormLabel>
                <div className="flex">
                  <Mail className="h-4 w-4 mr-2 mt-3" />
                  <FormControl>
                    <Input type="email" placeholder="ejemplo@email.com" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="contactoTelefono"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Teléfono de contacto</FormLabel>
                <div className="flex">
                  <Phone className="h-4 w-4 mr-2 mt-3" />
                  <FormControl>
                    <Input placeholder="600 000 000" {...field} />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="duracion"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Duración (minutos)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="60"
                    onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="aforo"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Capacidad</FormLabel>
                <div className="flex">
                  <Users className="h-4 w-4 mr-2 mt-3" />
                  <FormControl>
                    <Input
                      type="number"
                      placeholder="20"
                      onChange={(e) => onChange(parseInt(e.target.value, 10) || 0)}
                      {...field}
                    />
                  </FormControl>
                </div>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <FormField
          control={form.control}
          name="gratuito"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div>
                <FormLabel className="text-base">Taller Gratuito</FormLabel>
                <p className="text-sm text-muted-foreground">
                  Marcar si el taller es gratuito para los participantes
                </p>
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

        {!watchGratuito && (
          <FormField
            control={form.control}
            name="precio"
            render={({ field: { onChange, ...field } }) => (
              <FormItem>
                <FormLabel>Precio (€)</FormLabel>
                <FormControl>
                  <Input
                    type="number"
                    placeholder="0"
                    onChange={(e) => onChange(parseFloat(e.target.value) || 0)}
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        )}

        <Button type="submit" className="w-full">
          {taller ? 'Actualizar Taller' : 'Programar Taller'}
        </Button>
      </form>
    </Form>
  );
};

export default TallerForm;

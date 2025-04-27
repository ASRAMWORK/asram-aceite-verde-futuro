
import React from 'react';
import { useForm } from 'react-hook-form';
import { Calendar, School, Users } from "lucide-react";
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
import { AlianzaVerde, TallerProgramado } from "@/types";
import { format } from "date-fns";

interface TallerFormProps {
  centros: AlianzaVerde[];
  onSubmit: (data: Partial<TallerProgramado>) => void;
  taller?: TallerProgramado;
}

const TallerForm = ({ centros, onSubmit, taller }: TallerFormProps) => {
  const form = useForm<Partial<TallerProgramado>>({
    defaultValues: taller || {
      titulo: '',
      fechaHora: new Date(),
      numAsistentes: 0,
      estado: 'programado'
    }
  });

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <FormField
          control={form.control}
          name="centro"
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
                </SelectContent>
              </Select>
              <FormMessage />
            </FormItem>
          )}
        />

        <div className="grid grid-cols-2 gap-4">
          <FormField
            control={form.control}
            name="fechaHora"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Fecha del Taller</FormLabel>
                <FormControl>
                  <Input 
                    type="date" 
                    {...field}
                    value={field.value instanceof Date ? format(field.value, 'yyyy-MM-dd') : ''}
                    onChange={(e) => {
                      field.onChange(e.target.value ? new Date(e.target.value) : null);
                    }}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="numAsistentes"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Número de Alumnos</FormLabel>
                <FormControl>
                  <Input type="number" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
        </div>

        <Button type="submit" className="w-full">
          {taller ? 'Actualizar Taller' : 'Programar Taller'}
        </Button>
      </form>
    </Form>
  );
};

export default TallerForm;


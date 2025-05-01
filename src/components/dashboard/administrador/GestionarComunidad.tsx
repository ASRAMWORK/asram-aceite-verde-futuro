import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { useComunidadesVecinos } from '@/hooks/useComunidadesVecinos';
import { toast } from 'sonner';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { useUserProfile } from '@/hooks/useUserProfile';

interface GestionarComunidadProps {
  adminId?: string;
}

const GestionarComunidad: React.FC<GestionarComunidadProps> = ({ adminId }) => {
  const { profile } = useUserProfile();
  const efectiveAdminId = adminId || profile?.id;
  const { addComunidad } = useComunidadesVecinos(efectiveAdminId);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const formSchema = z.object({
    nombre: z.string().min(3, { message: 'El nombre debe tener al menos 3 caracteres' }),
    direccion: z.string().min(5, { message: 'La dirección debe tener al menos 5 caracteres' }),
    ciudad: z.string().min(2, { message: 'La ciudad es requerida' }),
    codigoPostal: z.string().min(5, { message: 'El código postal debe tener al menos 5 caracteres' }),
    cif: z.string().min(9, { message: 'El CIF debe tener al menos 9 caracteres' }),
    numViviendas: z.string().transform(val => parseInt(val) || 0),
    numPortales: z.string().transform(val => parseInt(val) || 0),
    numContenedores: z.string().transform(val => parseInt(val) || 0),
    tipoEdificio: z.string().optional(),
    notas: z.string().optional(),
  });

  const { register, handleSubmit, control, reset, formState: { errors } } = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      nombre: '',
      direccion: '',
      ciudad: '',
      codigoPostal: '',
      cif: '',
      numViviendas: '',
      numPortales: '',
      numContenedores: '',
      tipoEdificio: 'residencial',
      notas: '',
    }
  });

  const onSubmit = async (data) => {
    if (!efectiveAdminId) {
      toast.error('No se puede identificar al administrador. Por favor, inicia sesión nuevamente.');
      return;
    }

    setIsSubmitting(true);
    try {
      const result = await addComunidad({
        ...data,
        administradorId: efectiveAdminId,
        administradorNombre: profile?.nombreAdministracion || profile?.nombre || 'Administrador',
        fechaAlta: new Date(),
        activo: true,
        litrosRecogidos: 0,
        beneficiosMedioambientales: {
          co2Reducido: 0,
          aguaAhorrada: 0,
          energiaAhorrada: 0
        }
      });

      if (result) {
        toast.success('Comunidad añadida correctamente');
        reset();
      }
    } catch (error) {
      console.error('Error al añadir comunidad:', error);
      toast.error('Error al añadir la comunidad');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold">Añadir Nueva Comunidad</h2>
        <p className="text-gray-500">Registra una nueva comunidad de vecinos en el sistema</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Datos de la Comunidad</CardTitle>
          <CardDescription>
            Introduce la información básica de la comunidad de vecinos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <Label htmlFor="nombre">Nombre de la Comunidad *</Label>
                <Input
                  id="nombre"
                  placeholder="Ej: Comunidad de Propietarios Calle Mayor 10"
                  {...register('nombre')}
                />
                {errors.nombre && (
                  <p className="text-sm text-red-500">{errors.nombre.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="cif">CIF *</Label>
                <Input
                  id="cif"
                  placeholder="Ej: B12345678"
                  {...register('cif')}
                />
                {errors.cif && (
                  <p className="text-sm text-red-500">{errors.cif.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="direccion">Dirección *</Label>
                <Input
                  id="direccion"
                  placeholder="Ej: Calle Mayor 10"
                  {...register('direccion')}
                />
                {errors.direccion && (
                  <p className="text-sm text-red-500">{errors.direccion.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="ciudad">Ciudad *</Label>
                <Input
                  id="ciudad"
                  placeholder="Ej: Madrid"
                  {...register('ciudad')}
                />
                {errors.ciudad && (
                  <p className="text-sm text-red-500">{errors.ciudad.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="codigoPostal">Código Postal *</Label>
                <Input
                  id="codigoPostal"
                  placeholder="Ej: 28001"
                  {...register('codigoPostal')}
                />
                {errors.codigoPostal && (
                  <p className="text-sm text-red-500">{errors.codigoPostal.message}</p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="tipoEdificio">Tipo de Edificio</Label>
                <Controller
                  name="tipoEdificio"
                  control={control}
                  render={({ field }) => (
                    <Select
                      onValueChange={field.onChange}
                      defaultValue={field.value}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona un tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="residencial">Residencial</SelectItem>
                        <SelectItem value="comercial">Comercial</SelectItem>
                        <SelectItem value="mixto">Mixto</SelectItem>
                        <SelectItem value="otro">Otro</SelectItem>
                      </SelectContent>
                    </Select>
                  )}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numViviendas">Número de Viviendas</Label>
                <Input
                  id="numViviendas"
                  type="number"
                  placeholder="Ej: 20"
                  {...register('numViviendas')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numPortales">Número de Portales</Label>
                <Input
                  id="numPortales"
                  type="number"
                  placeholder="Ej: 2"
                  {...register('numPortales')}
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="numContenedores">Número de Contenedores</Label>
                <Input
                  id="numContenedores"
                  type="number"
                  placeholder="Ej: 4"
                  {...register('numContenedores')}
                />
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="notas">Notas Adicionales</Label>
              <Textarea
                id="notas"
                placeholder="Información adicional sobre la comunidad..."
                className="min-h-[100px]"
                {...register('notas')}
              />
            </div>

            <div className="flex justify-end space-x-4">
              <Button
                type="button"
                variant="outline"
                onClick={() => reset()}
                disabled={isSubmitting}
              >
                Cancelar
              </Button>
              <Button
                type="submit"
                disabled={isSubmitting}
                className="bg-green-600 hover:bg-green-700"
              >
                {isSubmitting ? 'Guardando...' : 'Guardar Comunidad'}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

export default GestionarComunidad;

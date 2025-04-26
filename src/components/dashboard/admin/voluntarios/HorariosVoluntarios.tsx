import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { useForm } from "react-hook-form";
import { Form, FormControl, FormField, FormItem, FormLabel } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Calendar, Clock } from "lucide-react";
import { DatePickerWithRange } from "@/components/ui/date-range-picker";
import { useHorarios } from "@/hooks/useHorarios";
import type { Voluntario } from "@/types";

interface HorariosVoluntariosProps {
  voluntarios: Voluntario[];
}

const HorariosVoluntarios = ({ voluntarios }: HorariosVoluntariosProps) => {
  const [open, setOpen] = useState(false);
  const [selectedVoluntario, setSelectedVoluntario] = useState<Voluntario | null>(null);
  
  const { horarios, loading, addHorario, deleteHorario } = useHorarios();
  const form = useForm();

  const handleAddHorario = (data: any) => {
    if (selectedVoluntario) {
      addHorario({
        voluntarioId: selectedVoluntario.id,
        voluntarioNombre: `${selectedVoluntario.nombre} ${selectedVoluntario.apellidos}`,
        ...data,
        createdAt: new Date()
      });
      setOpen(false);
      form.reset();
    }
  };

  const groupedHorarios = horarios.reduce((acc: Record<string, any[]>, horario) => {
    const voluntarioId = horario.voluntarioId;
    if (!acc[voluntarioId]) {
      acc[voluntarioId] = [];
    }
    acc[voluntarioId].push(horario);
    return acc;
  }, {});
  
  const diasSemanaMap: Record<string, string> = {
    lunes: "Lunes",
    martes: "Martes",
    miercoles: "Miércoles",
    jueves: "Jueves",
    viernes: "Viernes",
    sabado: "Sábado",
    domingo: "Domingo"
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Horarios de Voluntarios</CardTitle>
            <CardDescription>Programa y visualiza los horarios asignados</CardDescription>
          </div>
          <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
              <Button className="bg-asram hover:bg-asram-700">
                <Clock className="mr-2 h-4 w-4" /> Programar Horario
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
              <DialogHeader>
                <DialogTitle>Programar Nuevo Horario</DialogTitle>
                <DialogDescription>
                  Asigna un horario a un voluntario para actividades específicas
                </DialogDescription>
              </DialogHeader>
              <Form {...form}>
                <form onSubmit={form.handleSubmit(handleAddHorario)} className="space-y-4">
                  <FormField
                    control={form.control}
                    name="voluntarioId"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Voluntario</FormLabel>
                        <Select 
                          onValueChange={(value) => {
                            field.onChange(value);
                            const vol = voluntarios.find(v => v.id === value);
                            setSelectedVoluntario(vol || null);
                          }} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un voluntario" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {voluntarios
                              .filter(v => v.activo)
                              .map((vol) => (
                                <SelectItem key={vol.id} value={vol.id}>
                                  {vol.nombre} {vol.apellidos}
                                </SelectItem>
                              ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="actividad"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Actividad</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Nombre de la actividad" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <FormField
                    control={form.control}
                    name="dia"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Día de la semana</FormLabel>
                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Selecciona un día" />
                            </SelectTrigger>
                          </FormControl>
                          <SelectContent>
                            {Object.entries(diasSemanaMap).map(([value, label]) => (
                              <SelectItem key={value} value={value}>{label}</SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </FormItem>
                    )}
                  />

                  <div className="grid grid-cols-2 gap-4">
                    <FormField
                      control={form.control}
                      name="horaInicio"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hora inicio</FormLabel>
                          <FormControl>
                            <Input {...field} type="time" />
                          </FormControl>
                        </FormItem>
                      )}
                    />

                    <FormField
                      control={form.control}
                      name="horaFin"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Hora fin</FormLabel>
                          <FormControl>
                            <Input {...field} type="time" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>

                  <FormField
                    control={form.control}
                    name="ubicacion"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Ubicación</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="Lugar de la actividad" />
                        </FormControl>
                      </FormItem>
                    )}
                  />

                  <DialogFooter>
                    <Button type="submit" className="bg-asram hover:bg-asram-700">Guardar horario</Button>
                  </DialogFooter>
                </form>
              </Form>
            </DialogContent>
          </Dialog>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-center py-4">Cargando horarios...</p>
          ) : voluntarios.filter(v => v.activo).length === 0 ? (
            <p className="text-center py-4">No hay voluntarios activos disponibles</p>
          ) : Object.keys(groupedHorarios).length === 0 ? (
            <p className="text-center py-4">No hay horarios programados</p>
          ) : (
            <div className="space-y-6">
              {voluntarios.filter(v => v.activo).map((voluntario) => (
                <div key={voluntario.id} className="border rounded-lg p-4">
                  <h3 className="font-medium text-lg mb-2">{voluntario.nombre} {voluntario.apellidos}</h3>
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Día</TableHead>
                        <TableHead>Actividad</TableHead>
                        <TableHead>Horario</TableHead>
                        <TableHead>Ubicación</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {groupedHorarios[voluntario.id]?.map((horario, index) => (
                        <TableRow key={index}>
                          <TableCell>{diasSemanaMap[horario.dia] || horario.dia}</TableCell>
                          <TableCell>{horario.actividad}</TableCell>
                          <TableCell>
                            {horario.horaInicio} - {horario.horaFin}
                          </TableCell>
                          <TableCell>{horario.ubicacion}</TableCell>
                          <TableCell className="text-right">
                            <Button 
                              variant="ghost" 
                              size="sm" 
                              onClick={() => deleteHorario(horario.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Clock className="h-4 w-4 mr-1" /> Eliminar
                            </Button>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default HorariosVoluntarios;

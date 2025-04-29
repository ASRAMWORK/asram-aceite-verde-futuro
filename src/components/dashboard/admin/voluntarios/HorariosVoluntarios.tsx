import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "lucide-react";
import { format } from 'date-fns';
import { useVoluntarios } from '@/hooks/useVoluntarios';
import { useHorarios } from '@/hooks/useHorarios';

const HorariosVoluntarios = () => {
  const [mes, setMes] = useState<string>(new Date().toISOString().slice(0, 7));
  const [voluntarioId, setVoluntarioId] = useState<string>('');
  const { voluntarios, loading: loadingVoluntarios } = useVoluntarios();
  const { horarios, loading: loadingHorarios } = useHorarios();

  const voluntariosOptions = voluntarios.map(voluntario => ({
    value: voluntario.id,
    label: `${voluntario.nombre} ${voluntario.apellido}`,
  }));

  // Fix filtering logic to use the dia property instead of fecha
  const horariosFiltrados = horarios.filter(horario => {
    if (voluntarioId !== '' && horario.voluntarioId !== voluntarioId) {
      return false;
    }
    
    if (mes && horario.dia) {
      // If we have a fecha property, use it
      if (horario.fecha) {
        const horarioMes = new Date(horario.fecha).toISOString().slice(0, 7);
        return horarioMes === mes;
      }
      
      // Otherwise try to extract from dia if it's a date string
      if (typeof horario.dia === 'string' && horario.dia.includes('-')) {
        const horarioMes = horario.dia.slice(0, 7);
        return horarioMes === mes;
      }
    }
    
    return true;
  });

  const totalHorasMes = horariosFiltrados.reduce((sum, horario) => {
    const inicio = new Date(`2000-01-01T${horario.horaInicio}`);
    const fin = new Date(`2000-01-01T${horario.horaFin}`);
    const diff = fin.getTime() - inicio.getTime();
    const horas = diff / (1000 * 60 * 60);
    return sum + horas;
  }, 0);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Horarios de Voluntarios</CardTitle>
        <CardDescription>Gestiona los horarios de los voluntarios</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex items-center gap-4 mb-6">
          <div className="flex items-center gap-2">
            <Calendar className="h-4 w-4" />
            <Input
              type="month"
              value={mes}
              onChange={(e) => setMes(e.target.value)}
              className="w-40"
            />
          </div>
          <Select value={voluntarioId} onValueChange={setVoluntarioId}>
            <SelectTrigger className="w-[220px]">
              <SelectValue placeholder="Selecciona un voluntario" />
            </SelectTrigger>
            <SelectContent>
              {voluntariosOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {voluntarioId && (
            <div className="ml-auto font-semibold">
              Total horas del mes: {totalHorasMes.toFixed(2)}
            </div>
          )}
        </div>

        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Fecha</TableHead>
              <TableHead>Voluntario</TableHead>
              <TableHead>Hora Inicio</TableHead>
              <TableHead>Hora Fin</TableHead>
              <TableHead>Acciones</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {horariosFiltrados.map((horario) => {
              const voluntario = voluntarios.find(v => v.id === horario.voluntarioId);
              const voluntarioNombre = voluntario ? `${voluntario.nombre} ${voluntario.apellido}` : 'Desconocido';
              
              // Determine how to format the date based on available properties
              let fechaMostrar = 'Sin fecha';
              if (horario.fecha) {
                fechaMostrar = format(new Date(horario.fecha), 'dd/MM/yyyy');
              } else if (typeof horario.dia === 'string' && horario.dia.includes('-')) {
                fechaMostrar = format(new Date(horario.dia), 'dd/MM/yyyy');
              } else {
                fechaMostrar = horario.dia;
              }

              return (
                <TableRow key={horario.id}>
                  <TableCell>{fechaMostrar}</TableCell>
                  <TableCell>
                    <div className="font-medium text-sm">{voluntarioNombre}</div>
                  </TableCell>
                  <TableCell>{horario.horaInicio}</TableCell>
                  <TableCell>{horario.horaFin}</TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm">
                        Editar
                      </Button>
                      <Button variant="destructive" size="sm">
                        Eliminar
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>

        {horariosFiltrados.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            No hay horarios registrados para este mes y voluntario
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default HorariosVoluntarios;

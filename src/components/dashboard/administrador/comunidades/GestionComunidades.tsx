
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { useComunidadesVecinos } from '@/hooks/useComunidadesVecinos';
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import GestionarComunidad from '../GestionarComunidad';
import DistritoBarrioFilter from '@/components/calendario/filters/DistritoBarrioFilter';

const GestionComunidades = () => {
  const [showForm, setShowForm] = useState(false);
  const { comunidades } = useComunidadesVecinos();
  const [selectedDistrito, setSelectedDistrito] = useState('');
  const [selectedBarrio, setSelectedBarrio] = useState('');

  const filteredComunidades = comunidades.filter(com => {
    if (selectedDistrito && com.distrito !== selectedDistrito) return false;
    if (selectedBarrio && com.barrio !== selectedBarrio) return false;
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-[#ee970d]">Gestión de Comunidades</h2>
        <Dialog open={showForm} onOpenChange={setShowForm}>
          <DialogTrigger asChild>
            <Button className="bg-[#ee970d] hover:bg-[#ee970d]/90">
              <Plus className="h-4 w-4 mr-2" /> Nueva Comunidad
            </Button>
          </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Añadir Nueva Comunidad</DialogTitle>
            </DialogHeader>
            <GestionarComunidad onSuccess={() => setShowForm(false)} />
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Filtrar Comunidades</CardTitle>
        </CardHeader>
        <CardContent>
          <DistritoBarrioFilter
            selectedDistrito={selectedDistrito}
            selectedBarrio={selectedBarrio}
            onDistritoChange={setSelectedDistrito}
            onBarrioChange={setSelectedBarrio}
          />
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Comunidades</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Distrito</TableHead>
                <TableHead>Barrio</TableHead>
                <TableHead className="text-right">Viviendas</TableHead>
                <TableHead className="text-right">Litros Recogidos</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredComunidades.map((comunidad) => (
                <TableRow key={comunidad.id}>
                  <TableCell className="font-medium">{comunidad.nombre}</TableCell>
                  <TableCell>{comunidad.direccion}</TableCell>
                  <TableCell>{comunidad.distrito}</TableCell>
                  <TableCell>{comunidad.barrio}</TableCell>
                  <TableCell className="text-right">{comunidad.numViviendas}</TableCell>
                  <TableCell className="text-right">{comunidad.litrosRecogidos}L</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default GestionComunidades;


import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
  TableFooter,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePuntosVerdes } from "@/hooks/usePuntosVerdes";
import { useRutas } from "@/hooks/useRutas";
import { useUsuarios } from "@/hooks/useUsuarios";
import { useRecogidas } from "@/hooks/useRecogidas";
import type { Ruta } from "@/types";
import { Calendar, Check, Clock, FileSpreadsheet, FileText, Loader2, MapPin, PenLine, Plus, Route, Trash2, Users, Eye } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { distritos } from "@/data/madridDistritos";
import { toast } from 'sonner';
import { ClientesRutaList } from "./ClientesRutaList";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";

type RutaPersonalizada = {
  id?: string;
  nombre: string;
  distrito: string;
  fecha: Date;
  hora: string;
  recogedores: string;
  clientes: { id: string; nombre: string; direccion: string; barrio: string; orden: number; litrosEstimados: number; }[];
  puntosRecogida: number;
  distanciaTotal: number;
  tiempoEstimado: string;
  frecuencia: string;
  updatedAt: Date;
  createdAt: Date;
  barrios?: string[];
  puntos?: any[]; // Added to match Ruta interface requirements
};

const RutasDistritos = () => {
  const { puntosVerdes } = usePuntosVerdes();
  const { rutas, addRuta } = useRutas();
  const { usuarios } = useUsuarios();
  const { recogidas, updateRutaRecogida } = useRecogidas();
  
  const [isOpen, setIsOpen] = useState(false);
  const [nombreRuta, setNombreRuta] = useState<string>("");
  const [distritoSeleccionado, setDistritoSeleccionado] = useState<string>("");
  const [fechaSeleccionada, setFechaSeleccionada] = useState<Date | null>(null);
  const [horaSeleccionada, setHoraSeleccionada] = useState<string>("");
  const [recogedorSeleccionado, setRecogedorSeleccionado] = useState<string>("");
  const [clientesOrdenados, setClientesOrdenados] = useState<any[]>([]);

  const handleCrearRuta = async () => {
    if (!nombreRuta) {
      toast.error('Debe asignar un nombre a la ruta');
      return;
    }
    
    if (clientesOrdenados.length === 0) {
      toast.error('Debe seleccionar al menos un cliente');
      return;
    }

    await addRuta({
      nombre: `${distritoSeleccionado} - ${clientesOrdenados.map(cliente => cliente.nombre).join(", ")}`,
      distrito: distritoSeleccionado || "",
      barrios: [],
      fecha: fechaSeleccionada as Date,
      hora: horaSeleccionada || "",
      recogedores: recogedorSeleccionado || "",
      clientes: clientesOrdenados,
      puntosRecogida: clientesOrdenados.length,
      distanciaTotal: 0,
      tiempoEstimado: "0",
      frecuencia: "semanal",
      completada: false,
      litrosTotales: 0,
      updatedAt: new Date(),
      createdAt: new Date(),
      puntos: [] // Add the required 'puntos' property
    });
    
    setIsOpen(false);
    setNombreRuta("");
    setDistritoSeleccionado("");
    setFechaSeleccionada(null);
    setHoraSeleccionada("");
    setRecogedorSeleccionado("");
    setClientesOrdenados([]);
    toast.success('Ruta creada correctamente');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Rutas por Distritos</h2>
        <Button className="bg-asram" onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Crear Ruta
        </Button>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Listado de Rutas</CardTitle>
          <CardDescription>
            Gestiona las rutas asignadas a los distritos
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Distrito</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead>Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {rutas.map((ruta) => (
                <TableRow key={ruta.id}>
                  <TableCell>{ruta.nombre}</TableCell>
                  <TableCell>{ruta.distrito}</TableCell>
                  <TableCell>{ruta.fecha ? format(new Date(ruta.fecha), 'dd/MM/yyyy') : 'No programada'}</TableCell>
                  <TableCell>{ruta.hora}</TableCell>
                  <TableCell>
                    <Button variant="outline" onClick={() => {/* Edit functionality */}}>
                      Editar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Crear Ruta</DialogTitle>
            <DialogDescription>
              Completa los detalles de la nueva ruta
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <Label htmlFor="nombre">Nombre de la Ruta</Label>
            <Input
              id="nombre"
              value={nombreRuta}
              onChange={(e) => setNombreRuta(e.target.value)}
              placeholder="Ej: Ruta Centro"
            />
            <Label htmlFor="distrito">Distrito</Label>
            <Select value={distritoSeleccionado} onValueChange={setDistritoSeleccionado}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un distrito" />
              </SelectTrigger>
              <SelectContent>
                {/* Populate with district options */}
              </SelectContent>
            </Select>
            <Label htmlFor="fecha">Fecha</Label>
            <Input
              id="fecha"
              type="date"
              value={fechaSeleccionada ? format(fechaSeleccionada, 'yyyy-MM-dd') : ''}
              onChange={(e) => setFechaSeleccionada(new Date(e.target.value))}
            />
            <Label htmlFor="hora">Hora</Label>
            <Input
              id="hora"
              type="time"
              value={horaSeleccionada}
              onChange={(e) => setHoraSeleccionada(e.target.value)}
            />
            <Label htmlFor="recogedor">Recogedor</Label>
            <Select value={recogedorSeleccionado} onValueChange={setRecogedorSeleccionado}>
              <SelectTrigger>
                <SelectValue placeholder="Selecciona un recogedor" />
              </SelectTrigger>
              <SelectContent>
                {/* Populate with collector options */}
              </SelectContent>
            </Select>
            <Label htmlFor="clientes">Clientes</Label>
            <Input
              id="clientes"
              value={clientesOrdenados.map(cliente => cliente.nombre).join(", ")}
              readOnly
            />
            <Button onClick={handleCrearRuta}>Crear Ruta</Button>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RutasDistritos;

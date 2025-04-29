import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { useRutas } from "@/hooks/useRutas";
import { Ruta } from "@/types";
import { Plus, Pencil, Trash2, Search, MapPin, Calendar } from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Checkbox } from "@/components/ui/checkbox";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { useToast } from "@/components/ui/use-toast";

const RutasDistritos = () => {
  const { rutas, loading, addRuta, updateRuta, deleteRuta } = useRutas();
  const [searchQuery, setSearchQuery] = useState("");
  const [distritoSeleccionado, setDistritoSeleccionado] = useState("");
  const { toast } = useToast();

  // Add these state variables at the beginning of the component
  const [isOpen, setIsOpen] = useState(false);
  const [nombreRuta, setNombreRuta] = useState("");
  const [puntosSeleccionados, setPuntosSeleccionados] = useState<any[]>([]);
  const [fechaRecogida, setFechaRecogida] = useState(new Date());

  const distritos = [
    "Centro",
    "Chamberí",
    "Salamanca",
    "Retiro",
    "Chamartín",
    "Tetuán",
    "Moncloa",
  ];

  const puntosDeRecogida = [
    { id: "1", nombre: "Punto A", direccion: "Calle 1, 123" },
    { id: "2", nombre: "Punto B", direccion: "Calle 2, 456" },
    { id: "3", nombre: "Punto C", direccion: "Calle 3, 789" },
    { id: "4", nombre: "Punto D", direccion: "Calle 4, 101" },
    { id: "5", nombre: "Punto E", direccion: "Calle 5, 202" },
    { id: "6", nombre: "Punto F", direccion: "Calle 6, 303" },
  ];

  const filteredRutas = rutas.filter((ruta) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      ruta.nombre.toLowerCase().includes(searchTerm) ||
      ruta.distrito.toLowerCase().includes(searchTerm)
    );
  });

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
  };

  const handleDistritoChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setDistritoSeleccionado(e.target.value);
  };

  const handleAddRuta = async () => {
    if (!distritoSeleccionado) {
      toast({
        title: "Error",
        description: "Por favor, selecciona un distrito.",
      });
      return;
    }

    // Fixed version of nuevaRuta object with all required properties
    const nuevaRuta: Omit<Ruta, "id"> = {
      nombre: nombreRuta,
      distrito: distritoSeleccionado,
      barrios: [],
      puntos: puntosSeleccionados,
      distancia: 0,
      tiempoEstimado: 0,
      tipoRuta: "recogida",
      estado: "programada",
      fecha: fechaRecogida,
      hora: "09:00",
      recogedores: "",
      clientes: puntosSeleccionados,
      puntosRecogida: puntosSeleccionados.length,
      distanciaTotal: 0,
      frecuencia: "semanal",
      completada: false,
      litrosTotales: 0,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    try {
      await addRuta(nuevaRuta);
      setIsOpen(false);
      toast({
        title: "Éxito",
        description: "Ruta añadida correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al añadir la ruta.",
      });
    }
  };

  const handleUpdateRuta = async (id: string, data: Partial<Ruta>) => {
    try {
      await updateRuta(id, data);
      toast({
        title: "Éxito",
        description: "Ruta actualizada correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un error al actualizar la ruta.",
      });
    }
  };

  const handleDeleteRuta = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta ruta?")) {
      try {
        await deleteRuta(id);
        toast({
          title: "Éxito",
          description: "Ruta eliminada correctamente.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Hubo un error al eliminar la ruta.",
        });
      }
    }
  };

  const handleUpdateRutaRecogida = async (id: string, data: any) => await updateRuta(id, data);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rutas por Distrito</h2>
          <p className="text-muted-foreground">
            Gestiona las rutas de recogida por distrito
          </p>
        </div>
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger asChild>
            <Button className="bg-[#ee970d] hover:bg-[#e08500] text-white">
              <Plus className="mr-2 h-4 w-4" />
              Añadir Ruta
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-[525px]">
            <DialogHeader>
              <DialogTitle>Añadir Nueva Ruta</DialogTitle>
              <DialogDescription>
                Selecciona el distrito y los puntos de recogida para la nueva ruta.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="nombre" className="text-right">
                  Nombre
                </Label>
                <Input
                  id="nombre"
                  value={nombreRuta}
                  onChange={(e) => setNombreRuta(e.target.value)}
                  className="col-span-3"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="distrito" className="text-right">
                  Distrito
                </Label>
                <Select onValueChange={setDistritoSeleccionado} defaultValue={distritoSeleccionado}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue placeholder="Selecciona un distrito" />
                  </SelectTrigger>
                  <SelectContent>
                    {distritos.map((distrito) => (
                      <SelectItem key={distrito} value={distrito}>
                        {distrito}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="fecha" className="text-right">
                  Fecha
                </Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-[240px] pl-3 text-left font-normal",
                        !fechaRecogida && "text-muted-foreground"
                      )}
                    >
                      {fechaRecogida ? (
                        format(fechaRecogida, "PP", { locale: es })
                      ) : (
                        <span>Pick a date</span>
                      )}
                      <Calendar className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <CalendarComponent
                      mode="single"
                      selected={fechaRecogida}
                      onSelect={(date) => date && setFechaRecogida(date)}
                      disabled={(date) => date < new Date()}
                      initialFocus
                      className={cn("p-3 pointer-events-auto")}
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid grid-cols-4 items-start gap-4">
                <Label htmlFor="puntos" className="text-right mt-2">
                  Puntos de Recogida
                </Label>
                <ScrollArea className="h-[200px] w-[300px] rounded-md border col-span-3">
                  {puntosDeRecogida.map((punto) => (
                    <div
                      key={punto.id}
                      className="flex items-center space-x-2 p-2"
                    >
                      <Checkbox
                        id={`punto-${punto.id}`}
                        checked={puntosSeleccionados.some((p) => p.id === punto.id)}
                        onCheckedChange={(checked) => {
                          if (checked) {
                            setPuntosSeleccionados([...puntosSeleccionados, punto]);
                          } else {
                            setPuntosSeleccionados(
                              puntosSeleccionados.filter((p) => p.id !== punto.id)
                            );
                          }
                        }}
                      />
                      <Label htmlFor={`punto-${punto.id}`} className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed">
                        {punto.nombre} - {punto.direccion}
                      </Label>
                    </div>
                  ))}
                </ScrollArea>
              </div>
            </div>
            <div className="flex justify-end">
              <Button type="button" onClick={handleAddRuta}>
                Añadir Ruta
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Rutas</CardTitle>
          <CardDescription>
            Visualiza y gestiona las rutas de recogida por distrito
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-2">
            <Input
              type="search"
              placeholder="Buscar ruta..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Distrito</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Puntos de Recogida</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    Cargando rutas...
                  </TableCell>
                </TableRow>
              ) : filteredRutas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-4">
                    No se encontraron rutas.
                  </TableCell>
                </TableRow>
              ) : (
                filteredRutas.map((ruta) => (
                  <TableRow key={ruta.id}>
                    <TableCell>{ruta.nombre}</TableCell>
                    <TableCell>{ruta.distrito}</TableCell>
                    <TableCell>
                      {ruta.fecha
                        ? format(new Date(ruta.fecha), "dd 'de' MMMM 'de' yyyy", { locale: es })
                        : "No especificada"}
                    </TableCell>
                    <TableCell>{ruta.puntosRecogida}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() =>
                            handleUpdateRuta(ruta.id, {
                              nombre: "Nueva Ruta",
                            })
                          }
                          className="text-[#ee970d] border-[#ee970d]/30 hover:bg-[#ee970d]/10"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteRuta(ruta.id)}
                          className="text-red-500 border-red-300 hover:bg-red-50"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default RutasDistritos;

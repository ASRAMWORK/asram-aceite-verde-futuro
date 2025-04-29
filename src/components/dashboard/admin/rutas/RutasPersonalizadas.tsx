import React, { useState, useEffect } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableCaption,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
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
} from "@/components/ui/dialog";
import { useRutas } from "@/hooks/useRutas";
import { useToast } from "@/components/ui/use-toast";
import {
  Ruta,
} from "@/types";
import {
  Plus,
  Pencil,
  Trash2,
  Search,
  ArrowLeft,
  ArrowRight,
  ChevronsLeft,
  ChevronsRight,
  MapPin,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ITEMS_PAGE } from "../admin/trabajadores/constants";

interface Cliente {
  id: string;
  nombre: string;
  direccion: string;
  litros: number;
}

const RutasPersonalizadas = () => {
  const { rutas, loading, addRuta, updateRuta, deleteRuta } = useRutas();
  const { toast } = useToast();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingRuta, setEditingRuta] = useState<Ruta | null>(null);

  const [formData, setFormData] = useState({
    nombre: "",
    distrito: "",
    barrios: [] as string[],
    fecha: new Date(),
    hora: "08:00",
    clientes: [] as Cliente[],
    puntosRecogida: 0,
    distancia: 0,
    tiempoEstimado: 0,
    frecuencia: "semanal",
    recogedores: "",
  });

  const distritos = [
    "Centro", "Arganzuela", "Retiro", "Salamanca", "Chamartín",
    "Tetuán", "Chamberí", "Fuencarral-El Pardo", "Moncloa-Aravaca", "Latina",
    "Carabanchel", "Usera", "Puente de Vallecas", "Moratalaz", "Ciudad Lineal",
    "Hortaleza", "Villaverde", "Villa de Vallecas", "Vicálvaro", "San Blas-Canillejas", "Barajas"
  ];

  const frecuencias = ["diaria", "semanal", "quincenal", "mensual"];

  const filteredRutas = rutas.filter((ruta) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      ruta.nombre.toLowerCase().includes(searchTerm) ||
      ruta.distrito.toLowerCase().includes(searchTerm)
    );
  });

  const totalPages = Math.ceil(filteredRutas.length / ITEMS_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PAGE;
  const endIndex = startIndex + ITEMS_PAGE;
  const displayedRutas = filteredRutas.slice(startIndex, endIndex);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleMultiSelectChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const selectedOptions: string[] = [];
    for (let i = 0; i < e.target.options.length; i++) {
      if (e.target.options[i].selected) {
        selectedOptions.push(e.target.options[i].value);
      }
    }
    setFormData({ ...formData, barrios: selectedOptions });
  };

  const handleDateChange = (date: Date | undefined) => {
    if (date) {
      setFormData({ ...formData, fecha: date });
    }
  };

  const handleAddCliente = () => {
    setFormData({
      ...formData,
      clientes: [
        ...formData.clientes,
        { id: Date.now().toString(), nombre: "", direccion: "", litros: 0 },
      ],
    });
  };

  const handleClienteChange = (
    index: number,
    field: string,
    value: string | number
  ) => {
    const updatedClientes = [...formData.clientes];
    updatedClientes[index][field] =
      typeof value === "string" ? value : Number(value);
    setFormData({ ...formData, clientes: updatedClientes });
  };

  const handleRemoveCliente = (index: number) => {
    const updatedClientes = [...formData.clientes];
    updatedClientes.splice(index, 1);
    setFormData({ ...formData, clientes: updatedClientes });
  };

  const handleOpenForm = (ruta?: Ruta) => {
    if (ruta) {
      setEditingRuta(ruta);
      setFormData({
        nombre: ruta.nombre,
        distrito: ruta.distrito,
        barrios: ruta.barrios,
        fecha: ruta.fecha,
        hora: ruta.hora,
        clientes: ruta.clientes,
        puntosRecogida: ruta.puntosRecogida,
        distancia: ruta.distancia,
        tiempoEstimado: ruta.tiempoEstimado,
        frecuencia: ruta.frecuencia,
        recogedores: ruta.recogedores,
      });
    } else {
      setEditingRuta(null);
      setFormData({
        nombre: "",
        distrito: "",
        barrios: [] as string[],
        fecha: new Date(),
        hora: "08:00",
        clientes: [] as Cliente[],
        puntosRecogida: 0,
        distancia: 0,
        tiempoEstimado: 0,
        frecuencia: "semanal",
        recogedores: "",
      });
    }
    setFormOpen(true);
  };

  const handleSubmit = async () => {
    if (!formData.nombre || !formData.distrito) {
      toast({
        title: "Error",
        description: "Por favor, complete todos los campos requeridos.",
      });
      return;
    }

    try {
      if (editingRuta) {
        const updatedRuta: Ruta = {
          ...editingRuta,
          nombre: formData.nombre,
          distrito: formData.distrito,
          barrios: formData.barrios,
          fecha: formData.fecha,
          hora: formData.hora,
          clientes: formData.clientes,
          puntosRecogida: formData.clientes.length,
          distanciaTotal: formData.distancia,
          tiempoEstimado: formData.tiempoEstimado,
          frecuencia: formData.frecuencia,
          recogedores: formData.recogedores,
          updatedAt: new Date(),
        };
        await updateRuta(editingRuta.id, updatedRuta);
        toast({
          title: "Éxito",
          description: "Ruta actualizada correctamente.",
        });
      } else {
        const nuevaRuta: Omit<Ruta, "id"> = {
          nombre: formData.nombre,
          distrito: formData.distrito,
          barrios: formData.barrios,
          fecha: new Date(formData.fecha),
          hora: formData.hora || "08:00",
          clientes: formData.clientes,
          puntosRecogida: formData.clientes.length,
          distanciaTotal: formData.distancia || 0,
          tiempoEstimado: parseFloat(formData.tiempoEstimado.toString()) || 0,
          frecuencia: formData.frecuencia,
          completada: false,
          recogedores: formData.recogedores || "",
          puntos: [],
          distancia: formData.distancia || 0,
          tipoRuta: "recogida",
          estado: "pendiente",
          litrosTotales: 0,
          createdAt: new Date(),
          updatedAt: new Date()
        };
        await addRuta(nuevaRuta);
        toast({
          title: "Éxito",
          description: "Ruta añadida correctamente.",
        });
      }
      setFormOpen(false);
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al guardar la ruta.",
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
          description: "Hubo un problema al eliminar la ruta.",
        });
      }
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rutas Personalizadas</h2>
          <p className="text-muted-foreground">
            Gestiona las rutas personalizadas de recogida
          </p>
        </div>
        <Button onClick={() => handleOpenForm()} className="bg-[#ee970d] hover:bg-[#e08500] text-white">
          <MapPin className="mr-2 h-4 w-4" />
          Añadir Ruta
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Rutas</CardTitle>
          <CardDescription>
            Visualiza y gestiona las rutas personalizadas de recogida
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
                <TableHead>Barrios</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Hora</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Cargando rutas...
                  </TableCell>
                </TableRow>
              ) : displayedRutas.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No se encontraron rutas.
                  </TableCell>
                </TableRow>
              ) : (
                displayedRutas.map((ruta) => (
                  <TableRow key={ruta.id}>
                    <TableCell>{ruta.nombre}</TableCell>
                    <TableCell>{ruta.distrito}</TableCell>
                    <TableCell>{ruta.barrios.join(", ")}</TableCell>
                    <TableCell>
                      {format(new Date(ruta.fecha), "dd 'de' MMMM 'de' yyyy", { locale: es })}
                    </TableCell>
                    <TableCell>{ruta.hora}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenForm(ruta)}
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
        {filteredRutas.length > ITEMS_PAGE && (
          <CardFooter className="flex items-center justify-between px-4 py-2">
            <div className="text-sm text-muted-foreground">
              Página {currentPage} de {totalPages}
            </div>
            <div className="space-x-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(1)}
                disabled={currentPage === 1}
              >
                <ChevronsLeft className="h-4 w-4 mr-2" />
                Primero
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Anterior
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Siguiente
                <ArrowRight className="h-4 w-4 ml-2" />
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handlePageChange(totalPages)}
                disabled={currentPage === totalPages}
              >
                Último
                <ChevronsRight className="h-4 w-4 ml-2" />
              </Button>
            </div>
          </CardFooter>
        )}
      </Card>

      <Dialog open={formOpen} onOpenChange={() => setFormOpen(false)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingRuta ? "Editar Ruta" : "Añadir Ruta"}</DialogTitle>
            <DialogDescription>
              {editingRuta
                ? "Modifica los detalles de la ruta."
                : "Añade una nueva ruta a la lista."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="distrito">Distrito</Label>
                <Select
                  id="distrito"
                  name="distrito"
                  value={formData.distrito}
                  onValueChange={(value) => setFormData({ ...formData, distrito: value })}
                >
                  <SelectTrigger>
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
            </div>

            <div className="grid gap-2">
              <Label htmlFor="barrios">Barrios</Label>
              <Select
                multiple
                id="barrios"
                name="barrios"
                value={formData.barrios}
                onChange={handleMultiSelectChange}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona los barrios" />
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

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fecha">Fecha</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !formData.fecha && "text-muted-foreground"
                      )}
                    >
                      {formData.fecha ? (
                        format(new Date(formData.fecha), "PP")
                      ) : (
                        <span>Pick a date</span>
                      )}
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={formData.fecha}
                      onSelect={handleDateChange}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="hora">Hora</Label>
                <Input
                  type="time"
                  id="hora"
                  name="hora"
                  value={formData.hora}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="frecuencia">Frecuencia</Label>
              <Select
                id="frecuencia"
                name="frecuencia"
                value={formData.frecuencia}
                onValueChange={(value) => setFormData({ ...formData, frecuencia: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona la frecuencia" />
                </SelectTrigger>
                <SelectContent>
                  {frecuencias.map((frecuencia) => (
                    <SelectItem key={frecuencia} value={frecuencia}>
                      {frecuencia}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label>Clientes</Label>
              {formData.clientes.map((cliente, index) => (
                <div key={cliente.id} className="grid grid-cols-4 gap-2 py-2">
                  <Input
                    type="text"
                    placeholder="Nombre"
                    value={cliente.nombre}
                    onChange={(e) =>
                      handleClienteChange(index, "nombre", e.target.value)
                    }
                  />
                  <Input
                    type="text"
                    placeholder="Dirección"
                    value={cliente.direccion}
                    onChange={(e) =>
                      handleClienteChange(index, "direccion", e.target.value)
                    }
                  />
                  <Input
                    type="number"
                    placeholder="Litros"
                    value={cliente.litros}
                    onChange={(e) =>
                      handleClienteChange(index, "litros", e.target.value)
                    }
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleRemoveCliente(index)}
                    className="text-red-500 border-red-300 hover:bg-red-50"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              ))}
              <Button variant="outline" size="sm" onClick={handleAddCliente}>
                <Plus className="h-4 w-4 mr-2" />
                Añadir Cliente
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="distancia">Distancia (km)</Label>
                <Input
                  type="number"
                  id="distancia"
                  name="distancia"
                  value={formData.distancia}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="tiempoEstimado">Tiempo Estimado (min)</Label>
                <Input
                  type="number"
                  id="tiempoEstimado"
                  name="tiempoEstimado"
                  value={formData.tiempoEstimado}
                  onChange={handleInputChange}
                />
              </div>
            </div>
          </div>
          <DialogFooter>
            <Button type="button" variant="secondary" onClick={() => setFormOpen(false)}>
              Cancelar
            </Button>
            <Button type="submit" onClick={handleSubmit}>
              {editingRuta ? "Actualizar Ruta" : "Crear Ruta"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RutasPersonalizadas;

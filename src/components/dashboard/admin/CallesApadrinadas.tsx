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
import { useCallesApadrinadas } from "@/hooks/useCallesApadrinadas";
import {
  CalleApadrinada,
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
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { cn } from "@/lib/utils";
import { ITEMS_PAGE } from "../admin/trabajadores/constants";

const CallesApadrinadas = () => {
  const {
    callesApadrinadas,
    loading,
    addCalleApadrinada,
    updateCalleApadrinada,
    deleteCalleApadrinada,
  } = useCallesApadrinadas();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [formOpen, setFormOpen] = useState(false);
  const [editingCalle, setEditingCalle] = useState<CalleApadrinada | null>(null);
  const [formData, setFormData] = useState<Partial<CalleApadrinada>>({});
  const [fechaRenovacion, setFechaRenovacion] = useState<Date | undefined>(undefined);

  const filteredCalles = callesApadrinadas.filter((calle) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      calle.nombre.toLowerCase().includes(searchTerm) ||
      calle.distrito.toLowerCase().includes(searchTerm) ||
      calle.barrio.toLowerCase().includes(searchTerm)
    );
  });

  const totalPages = Math.ceil(filteredCalles.length / ITEMS_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PAGE;
  const endIndex = startIndex + ITEMS_PAGE;
  const displayedCalles = filteredCalles.slice(startIndex, endIndex);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  const handleSelectChange = (name: string, value: string) => {
    setFormData({ ...formData, [name]: value });
  };

  const handleOpenForm = (calle?: CalleApadrinada) => {
    setEditingCalle(calle || null);
    setFormData(calle ? { ...calle } : {});
    setFormOpen(true);
    if (calle && calle.fechaRenovacion) {
      setFechaRenovacion(new Date(calle.fechaRenovacion));
    } else {
      setFechaRenovacion(undefined);
    }
  };

  const handleCloseForm = () => {
    setFormOpen(false);
    setEditingCalle(null);
    setFormData({});
    setFechaRenovacion(undefined);
  };

  const handleAddCalle = async () => {
    if (!formData.nombre || !formData.distrito || !formData.barrio) {
      alert("Por favor, complete todos los campos obligatorios.");
      return;
    }

    const nuevaCalle: Omit<CalleApadrinada, "id"> = {
      nombre: formData.nombre,
      distrito: formData.distrito,
      barrio: formData.barrio,
      longitud: Number(formData.longitud) || 0,
      responsable: formData.responsable || "",
      contactoResponsable: formData.contactoResponsable || "",
      fechaInicio: formData.fechaInicio ? new Date(formData.fechaInicio) : new Date(),
      fechaFin: formData.fechaFin ? new Date(formData.fechaFin) : undefined,
      estado: formData.estado || "Activa",
      observaciones: formData.observaciones || "",
      padrino: formData.padrino || "",
      precio: Number(formData.precio) || 0,
      fechaRenovacion: fechaRenovacion,
      descripcion: formData.descripcion || "",
    };

    const success = await addCalleApadrinada(nuevaCalle);
    if (success) {
      handleCloseForm();
    }
  };

  const handleUpdateCalle = async () => {
    if (!editingCalle) return;

    const updatedCalleData: Partial<CalleApadrinada> = {
      nombre: formData.nombre,
      distrito: formData.distrito,
      barrio: formData.barrio,
      longitud: Number(formData.longitud) || 0,
      responsable: formData.responsable || "",
      contactoResponsable: formData.contactoResponsable || "",
      fechaInicio: formData.fechaInicio ? new Date(formData.fechaInicio) : new Date(),
      fechaFin: formData.fechaFin ? new Date(formData.fechaFin) : undefined,
      estado: formData.estado || "Activa",
      observaciones: formData.observaciones || "",
      padrino: formData.padrino || "",
      precio: Number(formData.precio) || 0,
      fechaRenovacion: fechaRenovacion,
      descripcion: formData.descripcion || "",
    };

    const success = await updateCalleApadrinada(editingCalle.id, updatedCalleData);
    if (success) {
      handleCloseForm();
    }
  };

  const handleDeleteCalle = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar esta calle?")) {
      await deleteCalleApadrinada(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Calles Apadrinadas</h2>
          <p className="text-muted-foreground">
            Gestiona las calles que han sido apadrinadas
          </p>
        </div>
        <Button onClick={() => handleOpenForm()} className="bg-[#ee970d] hover:bg-[#e08500] text-white">
          <Plus className="mr-2 h-4 w-4" />
          Añadir Calle
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Calles Apadrinadas</CardTitle>
          <CardDescription>
            Visualiza y gestiona las calles que han sido apadrinadas
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-2">
            <Input
              type="search"
              placeholder="Buscar calle..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Distrito</TableHead>
                <TableHead>Barrio</TableHead>
                <TableHead>Responsable</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Cargando calles...
                  </TableCell>
                </TableRow>
              ) : displayedCalles.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No se encontraron calles.
                  </TableCell>
                </TableRow>
              ) : (
                displayedCalles.map((calle) => (
                  <TableRow key={calle.id}>
                    <TableCell>{calle.nombre}</TableCell>
                    <TableCell>{calle.distrito}</TableCell>
                    <TableCell>{calle.barrio}</TableCell>
                    <TableCell>{calle.responsable}</TableCell>
                    <TableCell>{calle.estado}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenForm(calle)}
                          className="text-[#ee970d] border-[#ee970d]/30 hover:bg-[#ee970d]/10"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteCalle(calle.id)}
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
        {filteredCalles.length > ITEMS_PAGE && (
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

      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>{editingCalle ? "Editar Calle" : "Añadir Calle"}</DialogTitle>
            <DialogDescription>
              {editingCalle
                ? "Modifica los datos de la calle apadrinada."
                : "Introduce los datos de la nueva calle apadrinada."}
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="nombre">Nombre</Label>
                <Input
                  id="nombre"
                  name="nombre"
                  value={formData.nombre || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="distrito">Distrito</Label>
                <Input
                  id="distrito"
                  name="distrito"
                  value={formData.distrito || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="barrio">Barrio</Label>
                <Input
                  id="barrio"
                  name="barrio"
                  value={formData.barrio || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="longitud">Longitud</Label>
                <Input
                  id="longitud"
                  name="longitud"
                  type="number"
                  value={formData.longitud || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="responsable">Responsable</Label>
                <Input
                  id="responsable"
                  name="responsable"
                  value={formData.responsable || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="contactoResponsable">Contacto Responsable</Label>
                <Input
                  id="contactoResponsable"
                  name="contactoResponsable"
                  value={formData.contactoResponsable || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="precio">Precio</Label>
                <Input
                  id="precio"
                  name="precio"
                  type="number"
                  value={formData.precio || ""}
                  onChange={handleInputChange}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="padrino">Padrino</Label>
                <Input
                  id="padrino"
                  name="padrino"
                  value={formData.padrino || ""}
                  onChange={handleInputChange}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="fechaInicio">Fecha Inicio</Label>
                <Input
                  type="date"
                  id="fechaInicio"
                  name="fechaInicio"
                  value={formData.fechaInicio ? format(new Date(formData.fechaInicio), 'yyyy-MM-dd') : ''}
                  onChange={handleInputChange}
                />
              </div>
              
              <div className="grid gap-2">
                <Label htmlFor="fechaRenovacion">Fecha Renovación</Label>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !fechaRenovacion && "text-muted-foreground"
                      )}
                    >
                      {fechaRenovacion ? (
                        format(fechaRenovacion, "PP")
                      ) : (
                        <span>Seleccionar fecha</span>
                      )}
                      
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-auto p-0" align="start">
                    <Calendar
                      mode="single"
                      selected={fechaRenovacion}
                      onSelect={setFechaRenovacion}
                      disabled={(date) => date < new Date()}
                      initialFocus
                    />
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="estado">Estado</Label>
              <Select
                id="estado"
                name="estado"
                onValueChange={(value) => handleSelectChange("estado", value)}
                defaultValue={formData.estado || "Activa"}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Selecciona un estado" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Activa">Activa</SelectItem>
                  <SelectItem value="Inactiva">Inactiva</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="observaciones">Observaciones</Label>
              <Input
                id="observaciones"
                name="observaciones"
                value={formData.observaciones || ""}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="descripcion">Descripción</Label>
              <Input
                id="descripcion"
                name="descripcion"
                value={formData.descripcion || ""}
                onChange={handleInputChange}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="secondary" onClick={handleCloseForm}>
              Cancelar
            </Button>
            <Button onClick={editingCalle ? handleUpdateCalle : handleAddCalle}>
              {editingCalle ? "Actualizar Calle" : "Añadir Calle"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default CallesApadrinadas;


import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Search, Calendar, User, Star, PenLine, Trash2, Plus } from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import FormacionForm from "./FormacionForm";

const FormacionesManager = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingFormacion, setEditingFormacion] = useState(null);
  
  const handleAddFormacion = () => {
    setEditingFormacion(null);
    setDialogOpen(true);
  };
  
  const handleEditFormacion = (formacion) => {
    setEditingFormacion(formacion);
    setDialogOpen(true);
  };
  
  const handleFormacionSubmit = (data) => {
    console.log("Formación data:", data);
    // Here we would save the data to the backend
    setDialogOpen(false);
    // You could add a success toast message here
  };
  
  // Mock data - replace with real data from backend
  const formaciones = [
    {
      id: 1,
      nombre: "Curso de reciclaje avanzado",
      descripcion: "Aprende técnicas avanzadas de reciclaje",
      precio: 99.99,
      fechaInicio: new Date("2025-05-15"),
      plazasTotal: 20,
      plazasOcupadas: 8,
      modalidad: "online",
      duracion: "4 semanas",
      activo: true
    },
    {
      id: 2,
      nombre: "Taller de compostaje doméstico",
      descripcion: "Todo lo que necesitas saber para hacer compost en casa",
      precio: 49.99,
      fechaInicio: new Date("2025-06-10"),
      plazasTotal: 15,
      plazasOcupadas: 15,
      modalidad: "presencial",
      duracion: "1 día (8 horas)",
      activo: true
    },
    {
      id: 3,
      nombre: "Certificación en gestión de residuos",
      descripcion: "Certificación profesional en gestión de residuos urbanos",
      precio: 299.99,
      fechaInicio: new Date("2025-07-01"),
      plazasTotal: 30,
      plazasOcupadas: 12,
      modalidad: "mixta",
      duracion: "3 meses",
      activo: false
    }
  ];
  
  // Filter formaciones based on search term and status filter
  const filteredFormaciones = formaciones.filter(formacion => {
    const matchesSearch = formacion.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
                          formacion.descripcion.toLowerCase().includes(searchTerm.toLowerCase());
    
    if (statusFilter === "all") return matchesSearch;
    if (statusFilter === "active") return matchesSearch && formacion.activo;
    if (statusFilter === "inactive") return matchesSearch && !formacion.activo;
    
    return matchesSearch;
  });
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h3 className="text-2xl font-bold">Formaciones</h3>
          <p className="text-muted-foreground">
            Gestiona los cursos y formaciones disponibles
          </p>
        </div>
        <Button onClick={handleAddFormacion} className="flex items-center gap-2">
          <Plus className="w-4 h-4" />
          <span>Añadir Formación</span>
        </Button>
      </div>
      
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex flex-1 items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Buscar formaciones..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-sm"
          />
        </div>
        
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Filtrar por estado" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Todas</SelectItem>
            <SelectItem value="active">Activas</SelectItem>
            <SelectItem value="inactive">Inactivas</SelectItem>
          </SelectContent>
        </Select>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Precio</TableHead>
                <TableHead>Fecha</TableHead>
                <TableHead>Plazas</TableHead>
                <TableHead>Modalidad</TableHead>
                <TableHead>Estado</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredFormaciones.length > 0 ? (
                filteredFormaciones.map((formacion) => (
                  <TableRow key={formacion.id}>
                    <TableCell className="font-medium">{formacion.nombre}</TableCell>
                    <TableCell>{formacion.precio.toFixed(2)}€</TableCell>
                    <TableCell>{formacion.fechaInicio.toLocaleDateString()}</TableCell>
                    <TableCell>{`${formacion.plazasOcupadas}/${formacion.plazasTotal}`}</TableCell>
                    <TableCell>{formacion.modalidad}</TableCell>
                    <TableCell>
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                        formacion.activo 
                          ? "bg-green-100 text-green-800" 
                          : "bg-gray-100 text-gray-800"
                      }`}>
                        {formacion.activo ? "Activa" : "Inactiva"}
                      </span>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end space-x-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleEditFormacion(formacion)}
                        >
                          <PenLine className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          className="text-red-500 hover:text-red-600"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell colSpan={7} className="text-center py-4 text-muted-foreground">
                    No se encontraron formaciones
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
      
      <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
        <DialogContent className="max-w-3xl">
          <DialogHeader>
            <DialogTitle>
              {editingFormacion ? "Editar formación" : "Nueva formación"}
            </DialogTitle>
            <DialogDescription>
              {editingFormacion 
                ? "Modifica los datos de la formación" 
                : "Añade una nueva formación al catálogo"}
            </DialogDescription>
          </DialogHeader>
          <FormacionForm
            initialData={editingFormacion}
            onSubmit={handleFormacionSubmit}
            onCancel={() => setDialogOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default FormacionesManager;

import React, { useState, useEffect } from "react";
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
import { useTrabajadores } from "@/hooks/useTrabajadores";
import { useVehiculos } from "@/hooks/useVehiculos";
import { useRutas } from "@/hooks/useRutas";
import {
  Trabajador,
  Vehiculo,
  Ruta,
  TrabajadorFormProps,
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
  UserPlus,
  User,
} from "lucide-react";
import { format } from "date-fns";
import { es } from "date-fns/locale";
import { TrabajadorForm } from "./TrabajadorForm";
import { ITEMS_PAGE } from "./constants";

const TrabajadoresView = () => {
  const {
    trabajadores,
    loading,
    addTrabajador,
    updateTrabajador,
    deleteTrabajador,
    getTrabajador,
  } = useTrabajadores();
  const { vehiculos } = useVehiculos();
  const { rutas } = useRutas();

  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTrabajador, setSelectedTrabajador] = useState<Trabajador | null>(null);

  const [formOpen, setFormOpen] = useState(false);
  const [editingTrabajador, setEditingTrabajador] = useState<Trabajador | null>(null);
  const [vehiculosAsignados, setVehiculosAsignados] = useState<Vehiculo[]>([]);
  const [rutasAsignadas, setRutasAsignadas] = useState<Ruta[]>([]);

  const filteredTrabajadores = trabajadores.filter((trabajador) => {
    const searchTerm = searchQuery.toLowerCase();
    return (
      trabajador.nombre.toLowerCase().includes(searchTerm) ||
      trabajador.apellido.toLowerCase().includes(searchTerm) ||
      trabajador.email.toLowerCase().includes(searchTerm) ||
      trabajador.dni.toLowerCase().includes(searchTerm)
    );
  });

  const totalPages = Math.ceil(filteredTrabajadores.length / ITEMS_PAGE);

  const startIndex = (currentPage - 1) * ITEMS_PAGE;
  const endIndex = startIndex + ITEMS_PAGE;
  const displayedTrabajadores = filteredTrabajadores.slice(startIndex, endIndex);

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
  };

  const onTrabajadorSelect = async (id: string) => {
    const trabajador = await getTrabajador(id);
    setSelectedTrabajador(trabajador);
  };

  const handleAddTrabajador = async (data: Partial<Trabajador>) => {
    const completeData = {
      ...data,
      createdAt: new Date(),
      updatedAt: new Date(),
      activo: data.activo || true
    };
    await addTrabajador(completeData as any);
    setFormOpen(false);
  };

  const handleUpdateTrabajador = async (id: string, data: Partial<Trabajador>) => {
    await updateTrabajador(id, data);
    setSelectedTrabajador(null);
    setFormOpen(false);
  };

  const handleDeleteTrabajador = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este trabajador?")) {
      await deleteTrabajador(id);
      setSelectedTrabajador(null);
    }
  };

  const handleOpenForm = (trabajador?: Trabajador) => {
    if (trabajador) {
      setEditingTrabajador(trabajador);
      onTrabajadorSelect(trabajador.id);
    } else {
      setEditingTrabajador(null);
    }
    setFormOpen(true);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Trabajadores</h2>
          <p className="text-muted-foreground">
            Gestiona los trabajadores de la empresa
          </p>
        </div>
        <Button onClick={() => handleOpenForm()} className="bg-[#ee970d] hover:bg-[#e08500] text-white">
          <UserPlus className="mr-2 h-4 w-4" />
          Añadir Trabajador
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Lista de Trabajadores</CardTitle>
          <CardDescription>
            Visualiza y gestiona los trabajadores de la empresa
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-between py-2">
            <Input
              type="search"
              placeholder="Buscar trabajador..."
              value={searchQuery}
              onChange={handleSearchChange}
            />
          </div>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>DNI</TableHead>
                <TableHead>Departamento</TableHead>
                <TableHead>Cargo</TableHead>
                <TableHead>Fecha de Contratación</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    Cargando trabajadores...
                  </TableCell>
                </TableRow>
              ) : displayedTrabajadores.length === 0 ? (
                <TableRow>
                  <TableCell colSpan={6} className="text-center py-4">
                    No se encontraron trabajadores.
                  </TableCell>
                </TableRow>
              ) : (
                displayedTrabajadores.map((trabajador) => (
                  <TableRow key={trabajador.id}>
                    <TableCell>{trabajador.nombre} {trabajador.apellido}</TableCell>
                    <TableCell>{trabajador.email}</TableCell>
                    <TableCell>{trabajador.dni}</TableCell>
                    <TableCell>{trabajador.departamento}</TableCell>
                    <TableCell>{trabajador.cargo}</TableCell>
                    <TableCell>
                      {trabajador.fechaContratacion
                        ? format(new Date(trabajador.fechaContratacion), "dd 'de' MMMM 'de' yyyy", { locale: es })
                        : "No especificada"}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleOpenForm(trabajador)}
                          className="text-[#ee970d] border-[#ee970d]/30 hover:bg-[#ee970d]/10"
                        >
                          <Pencil className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => handleDeleteTrabajador(trabajador.id)}
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
        {filteredTrabajadores.length > ITEMS_PAGE && (
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
      
      {formOpen && (
        <TrabajadorForm
          onSubmit={editingTrabajador ? 
            (data) => handleUpdateTrabajador(editingTrabajador.id, data) : 
            handleAddTrabajador}
          onCancel={() => setFormOpen(false)}
          vehiculos={vehiculos as any}
          rutas={rutas as any}
        />
      )}
      
      {selectedTrabajador && (
        <TrabajadorForm
          initialData={selectedTrabajador}
          onSubmit={(data) => handleUpdateTrabajador(selectedTrabajador.id, data)}
          onCancel={() => setSelectedTrabajador(null)}
          vehiculos={vehiculos as any}
          rutas={rutas as any}
        />
      )}
    </div>
  );
};

export default TrabajadoresView;

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
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useToast } from "@/components/ui/use-toast";
import {
  FilePlus2,
  FileText,
  Loader2,
  Pencil,
  PlusCircle,
  Trash2,
  User,
  Users,
} from "lucide-react";
import { useTrabajadores } from "@/hooks/useTrabajadores";
import { useVehiculos } from "@/hooks/useVehiculos";
import { useRutas } from "@/hooks/useRutas";
import TrabajadorForm from "./TrabajadorForm";
import TrabajadorDetalle from "./TrabajadorDetalle";
import { Trabajador } from "@/types";
import { ITEMS_PAGE } from "./constants"; // Import constant

const TrabajadoresView = () => {
  const {
    trabajadores,
    loading,
    addTrabajador,
    updateTrabajador,
    deleteTrabajador,
  } = useTrabajadores();
  const { vehiculos } = useVehiculos();
  const { rutas } = useRutas();
  const [showForm, setShowForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [selectedTrabajador, setSelectedTrabajador] = useState<Trabajador | null>(null);
  const [showDetalle, setShowDetalle] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const { toast } = useToast();

  const totalPages = Math.ceil(trabajadores.length / ITEMS_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PAGE;
  const endIndex = startIndex + ITEMS_PAGE;
  const currentItems = trabajadores.slice(startIndex, endIndex);

  const handleAddTrabajador = async (data: any) => {
    try {
      await addTrabajador(data);
      setShowForm(false);
      toast({
        title: "Éxito",
        description: "Trabajador añadido correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al añadir el trabajador.",
      });
    }
  };

  const handleUpdateTrabajador = async (id: string, data: any) => {
    try {
      await updateTrabajador(id, data);
      setShowEditForm(false);
      setSelectedTrabajador(null);
      toast({
        title: "Éxito",
        description: "Trabajador actualizado correctamente.",
      });
    } catch (error) {
      toast({
        title: "Error",
        description: "Hubo un problema al actualizar el trabajador.",
      });
    }
  };

  const handleDeleteTrabajador = async (id: string) => {
    if (window.confirm("¿Estás seguro de eliminar este trabajador?")) {
      try {
        await deleteTrabajador(id);
        toast({
          title: "Éxito",
          description: "Trabajador eliminado correctamente.",
        });
      } catch (error) {
        toast({
          title: "Error",
          description: "Hubo un problema al eliminar el trabajador.",
        });
      }
    }
  };

  const handleOpenDetalle = (trabajador: Trabajador) => {
    setSelectedTrabajador(trabajador);
    setShowDetalle(true);
  };

  const handleOpenEditForm = (trabajador: Trabajador) => {
    setSelectedTrabajador(trabajador);
    setShowEditForm(true);
  };

  const renderTrabajadores = () => {
    return currentItems.map((trabajador) => (
      <tr key={trabajador.id} className="hover:bg-muted/50 cursor-pointer">
        <td className="p-4" onClick={() => handleOpenDetalle(trabajador)}>{trabajador.nombre}</td>
        <td className="p-4" onClick={() => handleOpenDetalle(trabajador)}>{trabajador.apellido}</td>  {/* Changed from apellidos to apellido */}
        <td className="p-4" onClick={() => handleOpenDetalle(trabajador)}>{trabajador.email}</td>
        <td className="p-4" onClick={() => handleOpenDetalle(trabajador)}>{trabajador.telefono}</td>
        <td className="p-4">
          <Button
            variant="outline"
            size="icon"
            onClick={() => handleOpenEditForm(trabajador)}
          >
            <Pencil className="h-4 w-4" />
          </Button>
          <Button
            variant="destructive"
            size="icon"
            onClick={() => handleDeleteTrabajador(trabajador.id)}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </td>
      </tr>
    ));
  };

  return (
    <div className="space-y-6">
      {/* Header section */}
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Trabajadores</h2>
          <p className="text-muted-foreground">
            Gestiona los trabajadores de la empresa
          </p>
        </div>
        <Button onClick={() => setShowForm(true)}>
          <PlusCircle className="mr-2 h-4 w-4" />
          Añadir Trabajador
        </Button>
      </div>

      {/* Cards section */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Total Trabajadores
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trabajadores.length}</div>
            <p className="text-xs text-muted-foreground">
              Total de trabajadores registrados
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Main content */}
      <Card>
        <CardHeader>
          <CardTitle>Lista de Trabajadores</CardTitle>
          <CardDescription>
            Información detallada de cada trabajador
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Apellido</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    <Loader2 className="h-5 w-5 animate-spin mx-auto" />
                  </td>
                </tr>
              ) : trabajadores.length === 0 ? (
                <tr>
                  <td colSpan={5} className="text-center py-4">
                    No hay trabajadores registrados.
                  </td>
                </tr>
              ) : (
                renderTrabajadores()
              )}
            </TableBody>
          </Table>
          {/* Pagination controls */}
          <div className="flex justify-between items-center mt-4">
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage - 1)}
              disabled={currentPage === 1}
            >
              Anterior
            </Button>
            <span>
              Página {currentPage} de {totalPages}
            </span>
            <Button
              variant="outline"
              onClick={() => setCurrentPage(currentPage + 1)}
              disabled={currentPage === totalPages}
            >
              Siguiente
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Forms and Dialogs */}
      {showForm && (
        <TrabajadorForm 
          onSubmit={handleAddTrabajador}
          onCancel={() => setShowForm(false)}
          vehiculos={vehiculos}
          rutas={rutas}
        />
      )}
      
      {showEditForm && selectedTrabajador && (
        <TrabajadorForm
          initialData={selectedTrabajador}
          onSubmit={handleUpdateTrabajador}
          onCancel={() => setShowEditForm(false)}
          vehiculos={vehiculos}
          rutas={rutas}
        />
      )}

      <Dialog open={showDetalle} onOpenChange={setShowDetalle}>
        <DialogContent className="sm:max-w-[625px]">
          <DialogHeader>
            <DialogTitle>Detalle del Trabajador</DialogTitle>
            <DialogDescription>
              Información completa del trabajador seleccionado
            </DialogDescription>
          </DialogHeader>
          <TrabajadorDetalle
            trabajador={selectedTrabajador}
            onClose={() => setShowDetalle(false)}
            onEdit={() => {
              setShowDetalle(false);
              setShowEditForm(true);
            }}
            onDelete={() => {
              if (selectedTrabajador) {
                handleDeleteTrabajador(selectedTrabajador.id);
                setShowDetalle(false);
              }
            }}
          />
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default TrabajadoresView;

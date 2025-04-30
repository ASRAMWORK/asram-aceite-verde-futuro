
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  UserCheck, 
  UserX, 
  FileText, 
  Search,
  Users,
  PieChart,
  UserPlus
} from "lucide-react";
import { toast } from "sonner";
import { useComerciales } from "@/hooks/useComerciales";
import { useClientesCaptados } from "@/hooks/useClientesCaptados";
import DetalleComercialDialog from "./DetalleComercialDialog";
import { addSpecificComerciales } from "@/hooks/addSpecificComerciales";

const ComercialList = () => {
  const { comerciales, loading, toggleComercialStatus, aprobarComercial, loadComercialesData } = useComerciales();
  const { getTotalLitrosByComercialId, getTotalClientesByComercialId } = useClientesCaptados();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComercial, setSelectedComercial] = useState<string | null>(null);

  const filteredComerciales = comerciales.filter(
    (comercial) =>
      comercial.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comercial.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comercial.codigo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleStatusToggle = async (id: string, currentStatus: boolean) => {
    try {
      await toggleComercialStatus(id, !currentStatus);
      toast.success(`Comercial ${!currentStatus ? "activado" : "desactivado"} correctamente`);
    } catch (error) {
      console.error("Error al cambiar estado:", error);
      toast.error("Error al cambiar el estado del comercial");
    }
  };

  const handleApprove = async (id: string) => {
    try {
      await aprobarComercial(id);
      toast.success("Comercial aprobado correctamente");
    } catch (error) {
      console.error("Error al aprobar comercial:", error);
      toast.error("Error al aprobar el comercial");
    }
  };

  const handleViewDetails = (comercialId: string) => {
    setSelectedComercial(comercialId);
  };
  
  const handleAddSpecificUsers = async () => {
    try {
      await addSpecificComerciales();
      await loadComercialesData(); // Refresh the list
      toast.success("Usuarios específicos procesados correctamente");
    } catch (error) {
      console.error("Error al añadir usuarios específicos:", error);
      toast.error("Error al procesar usuarios específicos");
    }
  };

  return (
    <>
      <Card>
        <CardContent className="pt-6">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4 mb-6">
            <div className="relative w-full md:w-80">
              <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
              <Input
                placeholder="Buscar por nombre, email o código..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex items-center gap-3">
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={handleAddSpecificUsers}
              >
                <UserPlus className="h-4 w-4" />
                <span>Añadir usuarios específicos</span>
              </Button>
              <Badge variant="outline" className="bg-gray-100">
                <Users className="h-3 w-3 mr-1" />
                {comerciales.length} comerciales
              </Badge>
              <Badge variant="outline" className="bg-green-100 text-green-800">
                <UserCheck className="h-3 w-3 mr-1" />
                {comerciales.filter(c => c.aprobado).length} aprobados
              </Badge>
              <Badge variant="outline" className="bg-amber-100 text-amber-800">
                <UserX className="h-3 w-3 mr-1" />
                {comerciales.filter(c => !c.aprobado).length} pendientes
              </Badge>
            </div>
          </div>

          {loading ? (
            <div className="flex justify-center items-center py-12">
              <div className="w-12 h-12 border-4 border-t-asram rounded-full animate-spin"></div>
            </div>
          ) : filteredComerciales.length > 0 ? (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Código</TableHead>
                    <TableHead>Clientes</TableHead>
                    <TableHead>Litros</TableHead>
                    <TableHead>Estado</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComerciales.map((comercial) => (
                    <TableRow key={comercial.id}>
                      <TableCell className="font-medium">
                        <div>
                          {comercial.nombre} {comercial.apellidos}
                          <div className="text-xs text-gray-500">{comercial.email}</div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline" className="font-mono">
                          {comercial.codigo}
                        </Badge>
                      </TableCell>
                      <TableCell>{getTotalClientesByComercialId(comercial.id)}</TableCell>
                      <TableCell>{getTotalLitrosByComercialId(comercial.id)} L</TableCell>
                      <TableCell>
                        <div className="flex flex-col gap-1">
                          <Badge
                            variant={comercial.activo ? "default" : "outline"}
                            className={comercial.activo ? "bg-green-600" : ""}
                          >
                            {comercial.activo ? "Activo" : "Inactivo"}
                          </Badge>
                          {!comercial.aprobado && (
                            <Badge variant="outline" className="bg-amber-100 text-amber-800">
                              Pendiente de aprobación
                            </Badge>
                          )}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex space-x-2">
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleViewDetails(comercial.id)}
                            title="Ver detalles"
                          >
                            <FileText className="h-4 w-4" />
                          </Button>
                          
                          {!comercial.aprobado && (
                            <Button
                              variant="outline"
                              size="icon"
                              onClick={() => handleApprove(comercial.id)}
                              title="Aprobar comercial"
                              className="text-green-600 hover:text-green-700"
                            >
                              <UserCheck className="h-4 w-4" />
                            </Button>
                          )}
                          
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() => handleStatusToggle(comercial.id, comercial.activo)}
                            title={comercial.activo ? "Desactivar" : "Activar"}
                            className={
                              comercial.activo
                                ? "text-red-600 hover:text-red-700"
                                : "text-green-600 hover:text-green-700"
                            }
                          >
                            {comercial.activo ? (
                              <UserX className="h-4 w-4" />
                            ) : (
                              <UserCheck className="h-4 w-4" />
                            )}
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          ) : (
            <div className="text-center py-12">
              <PieChart className="h-12 w-12 mx-auto mb-4 text-gray-300" />
              <h3 className="text-lg font-medium">No se encontraron comerciales</h3>
              <p className="text-gray-500">
                {searchTerm
                  ? "Prueba con otros términos de búsqueda"
                  : "Añade nuevos comerciales usando el botón superior"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {selectedComercial && (
        <DetalleComercialDialog
          comercialId={selectedComercial}
          open={!!selectedComercial}
          onClose={() => setSelectedComercial(null)}
        />
      )}
    </>
  );
};

export default ComercialList;

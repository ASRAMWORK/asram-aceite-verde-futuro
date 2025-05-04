
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
  UserPlus,
  AlertTriangle,
  Link as LinkIcon
} from "lucide-react";
import { toast } from "sonner";
import { useComerciales } from "@/hooks/useComerciales";
import { useClientesCaptados } from "@/hooks/useClientesCaptados";
import DetalleComercialDialog from "./DetalleComercialDialog";
import { addSpecificComerciales } from "@/hooks/addSpecificComerciales";
import VincularComercialDialog from "./VincularComercialDialog";
import AdminStatusToggle from "@/components/shared/AdminStatusToggle";
import { Usuario } from "@/types";

const ComercialList = () => {
  const { comerciales, loading, aprobarComercial, loadComercialesData } = useComerciales();
  const { getTotalLitrosByComercialId, getTotalClientesByComercialId } = useClientesCaptados();
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedComercial, setSelectedComercial] = useState<string | null>(null);
  const [vincularComercialId, setVincularComercialId] = useState<string | null>(null);

  // Make sure comerciales data is loaded
  useEffect(() => {
    loadComercialesData();
  }, []);

  const filteredComerciales = comerciales.filter(
    (comercial) =>
      comercial.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      comercial.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (comercial.codigo && comercial.codigo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

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

  const handleVincularComercial = (comercialId: string) => {
    setVincularComercialId(comercialId);
  };

  // Count comerciales by vinculación status
  const comercialesPendientes = comerciales.filter(c => 
    c.estadoVinculacion === 'pendiente' || 
    c.estadoVinculacion === 'falla_password' || 
    c.estadoVinculacion === 'sin_vincular'
  ).length;

  console.log("Comerciales loaded:", comerciales.length);
  console.log("Comerciales data:", comerciales);

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
            
            <div className="flex items-center gap-3 flex-wrap">
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={handleAddSpecificUsers}
              >
                <UserPlus className="h-4 w-4" />
                <span>Añadir usuarios específicos</span>
              </Button>
              <Button 
                variant="outline" 
                className="flex items-center gap-1"
                onClick={loadComercialesData}
              >
                <Users className="h-4 w-4" />
                <span>Actualizar lista</span>
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
              {comercialesPendientes > 0 && (
                <Badge variant="outline" className="bg-red-100 text-red-800">
                  <AlertTriangle className="h-3 w-3 mr-1" />
                  {comercialesPendientes} sin vincular
                </Badge>
              )}
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
                  {filteredComerciales.map((comercial) => {
                    // Create user object with required role property for AdminStatusToggle
                    const userWithRole: Usuario = {
                      ...comercial,
                      role: 'comercial', // Add the required role property
                    };
                    
                    return (
                      <TableRow key={comercial.id} className={
                        comercial.estadoVinculacion && 
                        comercial.estadoVinculacion !== 'completo' ? 
                        'bg-red-50' : ''
                      }>
                        <TableCell className="font-medium">
                          <div>
                            {comercial.nombre} {comercial.apellidos}
                            <div className="text-xs text-gray-500">{comercial.email}</div>
                            {comercial.estadoVinculacion && comercial.estadoVinculacion !== 'completo' && (
                              <Badge variant="outline" className="mt-1 bg-red-100 text-red-800 flex items-center gap-1">
                                <AlertTriangle className="h-3 w-3" />
                                {comercial.estadoVinculacion === 'pendiente' && "Pendiente de vincular"}
                                {comercial.estadoVinculacion === 'falla_password' && "Password incorrecto"}
                                {comercial.estadoVinculacion === 'sin_vincular' && "Sin vincular"}
                              </Badge>
                            )}
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant="outline" className="font-mono">
                            {comercial.codigo || "-"}
                          </Badge>
                        </TableCell>
                        <TableCell>{getTotalClientesByComercialId(comercial.id)}</TableCell>
                        <TableCell>{getTotalLitrosByComercialId(comercial.id)} L</TableCell>
                        <TableCell>
                          <div className="flex flex-col gap-1">
                            <AdminStatusToggle 
                              user={userWithRole}
                              userType="comercial" 
                            />
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
                            
                            {comercial.estadoVinculacion && comercial.estadoVinculacion !== 'completo' && (
                              <Button
                                variant="outline"
                                size="icon"
                                onClick={() => handleVincularComercial(comercial.id)}
                                title="Vincular con Firebase Auth"
                                className="text-blue-600 hover:text-blue-700"
                              >
                                <LinkIcon className="h-4 w-4" />
                              </Button>
                            )}
                            
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
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
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

      {vincularComercialId && (
        <VincularComercialDialog
          comercialId={vincularComercialId}
          open={!!vincularComercialId}
          onClose={() => setVincularComercialId(null)}
        />
      )}
    </>
  );
};

export default ComercialList;

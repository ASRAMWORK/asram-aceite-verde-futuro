
import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useComerciales } from "@/hooks/useComerciales";
import { useUsuarios } from "@/hooks/useUsuarios";
import { AlertCircle, Search, Box, Building, Users } from "lucide-react";

const ComercialesDetalle = () => {
  const { comerciales, loading: comercialesLoading } = useComerciales();
  const { usuarios, loading: usuariosLoading } = useUsuarios();
  const [searchTerm, setSearchTerm] = useState("");

  // Filter comerciales based on search term
  const filteredComerciales = comerciales.filter((comercial) =>
    comercial.nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
    comercial.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (comercial.codigo && comercial.codigo.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // Get communities and their counts for each commercial
  const getComunidadesByComercialId = (comercialId: string) => {
    // Filter usuarios with role "comunidad" that have this comercialId as their comercialId property
    const comunidades = usuarios.filter(
      (usuario) => 
        usuario.role === "comunidad" && 
        usuario.comercialId === comercialId
    );
    return {
      count: comunidades.length,
      activas: comunidades.filter(c => c.activo).length,
      totalContenedores: comunidades.reduce((sum, c) => sum + (c.numContenedores || 0), 0),
      totalViviendas: comunidades.reduce((sum, c) => sum + (c.numViviendas || 0), 0),
    };
  };

  const isLoading = comercialesLoading || usuariosLoading;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl">Detalle de Comerciales</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-6">
          <div className="relative w-full md:w-96">
            <Search className="absolute left-3 top-3 h-4 w-4 text-gray-500" />
            <Input
              placeholder="Buscar comercial..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center items-center py-12">
            <div className="w-12 h-12 border-4 border-t-asram rounded-full animate-spin"></div>
          </div>
        ) : filteredComerciales.length > 0 ? (
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Email</TableHead>
                  <TableHead>Código</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead>Comunidades</TableHead>
                  <TableHead>Contenedores</TableHead>
                  <TableHead>Viviendas</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredComerciales.map((comercial) => {
                  const comunidadesStats = getComunidadesByComercialId(comercial.id);
                  return (
                    <TableRow key={comercial.id} className={
                      comercial.estadoVinculacion && 
                      comercial.estadoVinculacion !== 'completo' ? 
                      'bg-red-50' : ''
                    }>
                      <TableCell className="font-medium">
                        {comercial.nombre} {comercial.apellidos}
                      </TableCell>
                      <TableCell>
                        <div className="flex flex-col">
                          {comercial.email}
                          {comercial.estadoVinculacion && comercial.estadoVinculacion !== 'completo' && (
                            <Badge variant="outline" className="mt-1 bg-red-100 text-red-800 flex items-center gap-1">
                              <AlertCircle className="h-3 w-3" />
                              {comercial.estadoVinculacion === 'pendiente' && "Pendiente"}
                              {comercial.estadoVinculacion === 'falla_password' && "Error password"}
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
                      <TableCell>
                        <Badge
                          variant={comercial.activo ? "default" : "outline"}
                          className={comercial.activo ? "bg-green-600" : ""}
                        >
                          {comercial.activo ? "Activo" : "Inactivo"}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Building className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="font-semibold">{comunidadesStats.count}</span>
                          <span className="text-green-600 ml-1">
                            ({comunidadesStats.activas} activas)
                          </span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Box className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="font-semibold">{comunidadesStats.totalContenedores}</span>
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center">
                          <Users className="h-4 w-4 mr-2 text-gray-500" />
                          <span className="font-semibold">{comunidadesStats.totalViviendas}</span>
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
            <p className="text-lg text-gray-600">No se encontraron comerciales</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ComercialesDetalle;


import React, { useState } from "react";
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
import { Input } from "@/components/ui/input";
import { useComunidadesVecinos } from "@/hooks/useComunidadesVecinos";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Edit, Trash, Search } from "lucide-react";

const MisComunidades: React.FC = () => {
  const { profile } = useUserProfile();
  const { comunidades, loading, deleteComunidad } = useComunidadesVecinos(profile?.id);
  const [searchQuery, setSearchQuery] = useState("");

  const filteredComunidades = comunidades.filter(
    (comunidad) =>
      comunidad.nombre.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comunidad.direccion.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comunidad.distrito.toLowerCase().includes(searchQuery.toLowerCase()) ||
      comunidad.barrio.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleDelete = async (id: string) => {
    if (window.confirm("¿Está seguro de que desea eliminar esta comunidad?")) {
      await deleteComunidad(id);
    }
  };

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <CardTitle className="text-xl font-bold text-purple-800">
                Mis Comunidades de Vecinos
              </CardTitle>
              <CardDescription>
                Gestiona todas las comunidades que administras
              </CardDescription>
            </div>
            <div className="flex gap-2 w-full md:w-auto">
              <div className="relative flex-1 md:w-64">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Buscar comunidades..."
                  className="pl-8"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent className="p-0">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <p>Cargando comunidades...</p>
            </div>
          ) : filteredComunidades.length === 0 ? (
            <div className="text-center py-12 px-4">
              <h3 className="text-lg font-medium text-gray-900">No hay comunidades</h3>
              <p className="mt-1 text-sm text-gray-500">
                {searchQuery
                  ? "No se encontraron comunidades con tu búsqueda."
                  : "Añade tu primera comunidad de vecinos para empezar."}
              </p>
              <div className="mt-6">
                <Button
                  onClick={() => window.location.href = "/administrador/dashboard?tab=gestionar"}
                  className="bg-purple-600 hover:bg-purple-700"
                >
                  Añadir comunidad
                </Button>
              </div>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Distrito / Barrio</TableHead>
                    <TableHead>Viviendas</TableHead>
                    <TableHead>Litros recogidos</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredComunidades.map((comunidad) => (
                    <TableRow key={comunidad.id}>
                      <TableCell className="font-medium">{comunidad.nombre}</TableCell>
                      <TableCell>{comunidad.direccion}</TableCell>
                      <TableCell>{`${comunidad.distrito} / ${comunidad.barrio}`}</TableCell>
                      <TableCell>{comunidad.totalViviendas}</TableCell>
                      <TableCell>
                        <span className="inline-flex items-center rounded-md bg-green-50 px-2 py-1 text-xs font-medium text-green-700 ring-1 ring-inset ring-green-600/20">
                          {comunidad.litrosRecogidos} litros
                        </span>
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => 
                              window.location.href = `/administrador/dashboard?tab=gestionar&id=${comunidad.id}`
                            }
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDelete(comunidad.id)}
                          >
                            <Trash className="h-4 w-4 text-red-500" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default MisComunidades;

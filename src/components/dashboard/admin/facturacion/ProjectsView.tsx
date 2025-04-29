
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash2, FileSpreadsheet, FileCheck, Banknote } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { format } from "date-fns";
import { toast } from "sonner";

export interface ProjectsViewProps {
  onOpenProjectForm: () => void;
  onEditProject: (project: any) => void;
}

export const ProjectsView: React.FC<ProjectsViewProps> = ({ 
  onOpenProjectForm, 
  onEditProject 
}) => {
  const { projects, deleteProject } = useProjects();

  const handleDeleteProject = async (id: string) => {
    if (window.confirm("¿Está seguro de eliminar este proyecto?")) {
      try {
        await deleteProject(id);
        toast.success("Proyecto eliminado correctamente");
      } catch (error) {
        toast.error("Error al eliminar el proyecto");
      }
    }
  };

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold text-gray-800 flex items-center gap-2">
            <Banknote className="h-8 w-8 text-[#EE970D]" />
            <span>Gestión de Proyectos</span>
          </h2>
          <p className="text-muted-foreground mt-2">
            Administra los proyectos y su facturación asociada
          </p>
        </div>
        <Button 
          onClick={onOpenProjectForm} 
          className="bg-[#EE970D] hover:bg-[#D38109] text-white shadow-md transition-all"
        >
          <Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto
        </Button>
      </div>

      <Card className="shadow-lg border-t-4 border-t-[#EE970D] overflow-hidden rounded-xl transition-all hover:shadow-xl">
        <CardHeader className="bg-gradient-to-r from-[#EE970D]/10 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-[#EE970D]/20">
              <FileSpreadsheet className="h-6 w-6 text-[#EE970D]" />
            </div>
            <div>
              <CardTitle className="text-xl">Proyectos activos</CardTitle>
              <CardDescription className="text-sm mt-1">
                Proyectos con facturación en curso
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="hover:bg-gray-50/80">
                  <TableHead className="font-semibold text-gray-600">Nombre</TableHead>
                  <TableHead className="font-semibold text-gray-600">Cliente</TableHead>
                  <TableHead className="font-semibold text-gray-600">Fecha inicio</TableHead>
                  <TableHead className="font-semibold text-gray-600">Fecha fin</TableHead>
                  <TableHead className="font-semibold text-gray-600">Presupuesto</TableHead>
                  <TableHead className="font-semibold text-gray-600">Estado</TableHead>
                  <TableHead className="text-right font-semibold text-gray-600">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects
                  .filter((project) => project.estado === "activo")
                  .map((project) => (
                    <TableRow key={project.id} className="hover:bg-gray-50/70 transition-colors">
                      <TableCell className="font-medium text-gray-700">{project.nombre}</TableCell>
                      <TableCell>{project.cliente}</TableCell>
                      <TableCell>
                        {project.fechaInicio ? format(new Date(project.fechaInicio), "dd/MM/yyyy") : "N/A"}
                      </TableCell>
                      <TableCell>
                        {project.fechaFin ? format(new Date(project.fechaFin), "dd/MM/yyyy") : "N/A"}
                      </TableCell>
                      <TableCell className="font-semibold text-[#EE970D]">{project.presupuesto?.toLocaleString('es-ES')}€</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-700 hover:bg-green-200 font-medium">Activo</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEditProject(project)}
                            className="hover:bg-[#EE970D]/10 hover:text-[#EE970D] transition-colors"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProject(project.id)}
                            className="hover:bg-red-50 text-red-500 transition-colors"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                {projects.filter(p => p.estado === "activo").length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 py-8">
                        <FileSpreadsheet className="h-12 w-12 text-gray-300 mb-2" />
                        <p className="text-lg font-medium">No hay proyectos activos</p>
                        <p className="text-sm text-gray-400">Crea un nuevo proyecto para comenzar</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-lg border-t-4 border-t-blue-400 overflow-hidden rounded-xl transition-all hover:shadow-xl">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-full bg-blue-100">
              <FileCheck className="h-6 w-6 text-blue-500" />
            </div>
            <div>
              <CardTitle className="text-xl">Proyectos completados</CardTitle>
              <CardDescription className="text-sm mt-1">
                Proyectos finalizados
              </CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border overflow-hidden">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow className="hover:bg-gray-50/80">
                  <TableHead className="font-semibold text-gray-600">Nombre</TableHead>
                  <TableHead className="font-semibold text-gray-600">Cliente</TableHead>
                  <TableHead className="font-semibold text-gray-600">Fecha inicio</TableHead>
                  <TableHead className="font-semibold text-gray-600">Fecha fin</TableHead>
                  <TableHead className="font-semibold text-gray-600">Facturado</TableHead>
                  <TableHead className="font-semibold text-gray-600">Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects
                  .filter((project) => project.estado === "completado")
                  .map((project) => (
                    <TableRow key={project.id} className="hover:bg-gray-50/70 transition-colors">
                      <TableCell className="font-medium text-gray-700">{project.nombre}</TableCell>
                      <TableCell>{project.cliente}</TableCell>
                      <TableCell>
                        {project.fechaInicio ? format(new Date(project.fechaInicio), "dd/MM/yyyy") : "N/A"}
                      </TableCell>
                      <TableCell>
                        {project.fechaFin ? format(new Date(project.fechaFin), "dd/MM/yyyy") : "N/A"}
                      </TableCell>
                      <TableCell className="font-semibold text-blue-600">{project.presupuesto?.toLocaleString('es-ES')}€</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-700 hover:bg-blue-200 font-medium">Completado</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                {projects.filter(p => p.estado === "completado").length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-32 text-center">
                      <div className="flex flex-col items-center justify-center text-gray-500 py-8">
                        <FileCheck className="h-12 w-12 text-gray-300 mb-2" />
                        <p className="text-lg font-medium">No hay proyectos completados</p>
                        <p className="text-sm text-gray-400">Los proyectos finalizados aparecerán aquí</p>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

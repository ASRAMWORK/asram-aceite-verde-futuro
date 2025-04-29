
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash2, FileSpreadsheet, FileCheck } from "lucide-react";
import { useProjects } from "@/hooks/useProjects";
import { format } from "date-fns";

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
      await deleteProject(id);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Proyectos</h2>
          <p className="text-muted-foreground">
            Gestiona los proyectos y facturación asociada
          </p>
        </div>
        <Button 
          onClick={onOpenProjectForm} 
          className="bg-[#EE970D] hover:bg-[#D38109] text-white"
        >
          <Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto
        </Button>
      </div>

      <Card className="shadow-md border-t-4 border-t-[#EE970D]">
        <CardHeader className="bg-gradient-to-r from-[#EE970D]/10 to-transparent">
          <div className="flex items-center gap-2">
            <FileSpreadsheet className="h-5 w-5 text-[#EE970D]" />
            <CardTitle>Proyectos activos</CardTitle>
          </div>
          <CardDescription>
            Proyectos con facturación en curso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha inicio</TableHead>
                  <TableHead>Fecha fin</TableHead>
                  <TableHead>Presupuesto</TableHead>
                  <TableHead>Estado</TableHead>
                  <TableHead className="text-right">Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects
                  .filter((project) => project.estado === "activo")
                  .map((project) => (
                    <TableRow key={project.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-medium">{project.nombre}</TableCell>
                      <TableCell>{project.cliente}</TableCell>
                      <TableCell>
                        {project.fechaInicio ? format(new Date(project.fechaInicio), "dd/MM/yyyy") : "N/A"}
                      </TableCell>
                      <TableCell>
                        {project.fechaFin ? format(new Date(project.fechaFin), "dd/MM/yyyy") : "N/A"}
                      </TableCell>
                      <TableCell>{project.presupuesto?.toLocaleString('es-ES')}€</TableCell>
                      <TableCell>
                        <Badge className="bg-green-100 text-green-800 hover:bg-green-200">Activo</Badge>
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex justify-end gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => onEditProject(project)}
                            className="hover:bg-[#EE970D]/10 hover:text-[#EE970D]"
                          >
                            <Edit className="h-4 w-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => handleDeleteProject(project.id)}
                            className="hover:bg-red-50 text-red-500"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                {projects.filter(p => p.estado === "activo").length === 0 && (
                  <TableRow>
                    <TableCell colSpan={7} className="h-24 text-center text-muted-foreground">
                      No hay proyectos activos
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>

      <Card className="shadow-md border-t-4 border-t-blue-400">
        <CardHeader className="bg-gradient-to-r from-blue-50 to-transparent">
          <div className="flex items-center gap-2">
            <FileCheck className="h-5 w-5 text-blue-500" />
            <CardTitle>Proyectos completados</CardTitle>
          </div>
          <CardDescription>
            Proyectos finalizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="rounded-md border">
            <Table>
              <TableHeader className="bg-gray-50">
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Fecha inicio</TableHead>
                  <TableHead>Fecha fin</TableHead>
                  <TableHead>Facturado</TableHead>
                  <TableHead>Estado</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {projects
                  .filter((project) => project.estado === "completado")
                  .map((project) => (
                    <TableRow key={project.id} className="hover:bg-gray-50/50">
                      <TableCell className="font-medium">{project.nombre}</TableCell>
                      <TableCell>{project.cliente}</TableCell>
                      <TableCell>
                        {project.fechaInicio ? format(new Date(project.fechaInicio), "dd/MM/yyyy") : "N/A"}
                      </TableCell>
                      <TableCell>
                        {project.fechaFin ? format(new Date(project.fechaFin), "dd/MM/yyyy") : "N/A"}
                      </TableCell>
                      <TableCell>{project.presupuesto?.toLocaleString('es-ES')}€</TableCell>
                      <TableCell>
                        <Badge className="bg-blue-100 text-blue-800 hover:bg-blue-200">Completado</Badge>
                      </TableCell>
                    </TableRow>
                  ))}
                {projects.filter(p => p.estado === "completado").length === 0 && (
                  <TableRow>
                    <TableCell colSpan={6} className="h-24 text-center text-muted-foreground">
                      No hay proyectos completados
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

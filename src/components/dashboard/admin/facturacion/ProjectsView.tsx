
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Plus, Trash2 } from "lucide-react";
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
        <Button onClick={onOpenProjectForm} className="bg-blue-600 hover:bg-blue-700">
          <Plus className="mr-2 h-4 w-4" /> Nuevo Proyecto
        </Button>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Proyectos activos</CardTitle>
          <CardDescription>
            Proyectos con facturación en curso
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
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
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.nombre}</TableCell>
                    <TableCell>{project.cliente}</TableCell>
                    <TableCell>
                      {project.fechaInicio ? format(new Date(project.fechaInicio), "dd/MM/yyyy") : "N/A"}
                    </TableCell>
                    <TableCell>
                      {project.fechaFin ? format(new Date(project.fechaFin), "dd/MM/yyyy") : "N/A"}
                    </TableCell>
                    <TableCell>{project.presupuesto?.toFixed(2)}€</TableCell>
                    <TableCell>
                      <Badge className="bg-green-100 text-green-800">Activo</Badge>
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex justify-end gap-2">
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => onEditProject(project)}
                        >
                          <Edit className="h-4 w-4" />
                        </Button>
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => handleDeleteProject(project.id)}
                          className="text-red-500"
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Proyectos completados</CardTitle>
          <CardDescription>
            Proyectos finalizados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
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
                  <TableRow key={project.id}>
                    <TableCell className="font-medium">{project.nombre}</TableCell>
                    <TableCell>{project.cliente}</TableCell>
                    <TableCell>
                      {project.fechaInicio ? format(new Date(project.fechaInicio), "dd/MM/yyyy") : "N/A"}
                    </TableCell>
                    <TableCell>
                      {project.fechaFin ? format(new Date(project.fechaFin), "dd/MM/yyyy") : "N/A"}
                    </TableCell>
                    <TableCell>{project.presupuesto?.toFixed(2)}€</TableCell>
                    <TableCell>
                      <Badge className="bg-blue-100 text-blue-800">Completado</Badge>
                    </TableCell>
                  </TableRow>
                ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

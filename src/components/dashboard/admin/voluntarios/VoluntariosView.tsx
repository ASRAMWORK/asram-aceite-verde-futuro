import React, { useState } from "react";
import { useVoluntarios } from "@/hooks/useVoluntarios";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Calendar, Clock, Trash2, Edit, UserPlus } from "lucide-react";
import VoluntarioForm from "./VoluntarioForm";
import AsignacionTareas from "./AsignacionTareas";
import HorariosVoluntarios from "./HorariosVoluntarios";
import type { Voluntario } from "@/types";

const VoluntariosView = () => {
  const [showForm, setShowForm] = useState(false);
  const [editingVoluntario, setEditingVoluntario] = useState<Voluntario | null>(null);
  const [activeTab, setActiveTab] = useState("inscripciones");
  const { voluntarios, loading, addVoluntario, updateVoluntario, deleteVoluntario } = useVoluntarios();

  const handleAddVoluntario = async (data: any) => {
    // Map form fields to expected structure
    const voluntarioData = {
      nombre: data.nombre,
      apellidos: data.apellidos,
      email: data.email,
      telefono: data.telefono,
      direccion: data.direccion || "",
      ciudad: "",
      provincia: "",
      codigoPostal: data.codigoPostal || "",
      pais: "España",
      activo: data.activo,
      diasDisponibles: data.diasDisponibles || [],
      disponibilidad: data.diasDisponibles || [],
      horasDisponibles: data.horasDisponibles || "",
      habilidades: data.habilidades || [],
      experiencia: data.experiencia || "",
      horasContribuidas: 0,
      fechaAlta: new Date(),
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    const success = await addVoluntario(voluntarioData);
    if (success) {
      setShowForm(false);
    }
  };

  const handleUpdateVoluntario = async (id: string, data: any) => {
    // Map form fields to expected structure
    const voluntarioData = {
      nombre: data.nombre,
      apellidos: data.apellidos,
      email: data.email,
      telefono: data.telefono,
      direccion: data.direccion || "",
      codigoPostal: data.codigoPostal || "",
      activo: data.activo,
      diasDisponibles: data.diasDisponibles,
      horasDisponibles: data.horasDisponibles,
      habilidades: data.habilidades || [],
      experiencia: data.experiencia || ""
    };
    
    const success = await updateVoluntario(id, voluntarioData);
    if (success) {
      setEditingVoluntario(null);
      setShowForm(false);
    }
  };

  const handleDeleteVoluntario = async (id: string) => {
    if (window.confirm("¿Está seguro de eliminar este voluntario?")) {
      await deleteVoluntario(id);
    }
  };

  const handleEditVoluntario = (voluntario: Voluntario) => {
    setEditingVoluntario(voluntario);
    setShowForm(true);
  };

  // Helper function to safely format horasDisponibles
  const formatHorasDisponibles = (horasDisponibles?: string | string[]) => {
    if (!horasDisponibles) return "No especificado";
    if (Array.isArray(horasDisponibles)) return horasDisponibles.join(", ");
    return horasDisponibles;
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-3xl font-bold tracking-tight">Gestión de Voluntarios</h2>
        {!showForm && (
          <Button onClick={() => setShowForm(true)} className="bg-asram hover:bg-asram-700">
            <UserPlus className="mr-2 h-4 w-4" /> Añadir Voluntario
          </Button>
        )}
      </div>

      {!showForm ? (
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="inscripciones">Inscripciones</TabsTrigger>
            <TabsTrigger value="horarios">Horarios</TabsTrigger>
            <TabsTrigger value="tareas">Asignación de Tareas</TabsTrigger>
          </TabsList>
          
          <TabsContent value="inscripciones">
            <Card>
              <CardHeader>
                <CardTitle>Listado de Voluntarios</CardTitle>
                <CardDescription>
                  Administra los voluntarios inscritos en el programa de ASRAM
                </CardDescription>
              </CardHeader>
              <CardContent>
                {loading ? (
                  <p className="text-center py-4">Cargando voluntarios...</p>
                ) : (
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>Nombre</TableHead>
                        <TableHead>Email</TableHead>
                        <TableHead>Teléfono</TableHead>
                        <TableHead>Disponibilidad</TableHead>
                        <TableHead>Estado</TableHead>
                        <TableHead className="text-right">Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {voluntarios.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center">
                            No hay voluntarios registrados
                          </TableCell>
                        </TableRow>
                      ) : (
                        voluntarios.map((voluntario) => (
                          <TableRow key={voluntario.id}>
                            <TableCell className="font-medium">{voluntario.nombre}</TableCell>
                            <TableCell>{voluntario.email}</TableCell>
                            <TableCell>{voluntario.telefono}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <Calendar className="h-4 w-4" />
                                <div className="text-sm text-gray-500">{voluntario.diasDisponibles?.join(", ") || voluntario.disponibilidad?.join(", ") || "No especificado"}</div>
                              </div>
                              <div className="flex items-center gap-1 mt-1">
                                <Clock className="h-4 w-4" />
                                <div className="text-sm text-gray-500">
                                  {Array.isArray(voluntario.horasDisponibles) 
                                    ? voluntario.horasDisponibles.join(", ") 
                                    : voluntario.horasDisponibles || "No especificado"}
                                </div>
                              </div>
                            </TableCell>
                            <TableCell>
                              <span className={`px-2 py-1 rounded-full text-xs ${
                                voluntario.activo ? "bg-green-100 text-green-800" : "bg-gray-100 text-gray-800"
                              }`}>
                                {voluntario.activo ? "Activo" : "Inactivo"}
                              </span>
                            </TableCell>
                            <TableCell className="text-right">
                              <div className="flex justify-end gap-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleEditVoluntario(voluntario)}
                                >
                                  <Edit className="h-4 w-4" />
                                </Button>
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  onClick={() => handleDeleteVoluntario(voluntario.id)}
                                  className="text-red-500 hover:text-red-700"
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
                )}
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="horarios">
            <HorariosVoluntarios />
          </TabsContent>
          
          <TabsContent value="tareas">
            <AsignacionTareas voluntarios={voluntarios} />
          </TabsContent>
        </Tabs>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle>{editingVoluntario ? "Editar" : "Añadir"} Voluntario</CardTitle>
            <CardDescription>
              {editingVoluntario 
                ? "Modifica los datos del voluntario" 
                : "Completa el formulario para añadir un nuevo voluntario"}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <VoluntarioForm 
              onSubmit={editingVoluntario 
                ? (data) => handleUpdateVoluntario(editingVoluntario.id, data) 
                : handleAddVoluntario
              }
              initialData={editingVoluntario}
              onCancel={() => {
                setShowForm(false);
                setEditingVoluntario(null);
              }}
            />
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default VoluntariosView;

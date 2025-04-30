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
import { useUsuarios } from "@/hooks/useUsuarios";
import type { Usuario } from "@/types";
import { 
  BadgeEuro, 
  Calendar, 
  FilePlus2, 
  FileSpreadsheet, 
  FileText, 
  Loader2, 
  MapPin, 
  PenLine, 
  Percent, 
  Trash2, 
  Users
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

type AdminFormData = {
  nombre: string;
  apellidos: string;
  email: string;
  telefono: string;
  direccion: string;
};

const AdministradoresFincas = () => {
  const { usuarios, loading, addUsuario, updateUsuario, deleteUsuario } = useUsuarios();
  const [isAddingAdmin, setIsAddingAdmin] = useState(false);
  const [isEditingAdmin, setIsEditingAdmin] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<Usuario | null>(null);
  const [formData, setFormData] = useState<AdminFormData>({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    direccion: ""
  });
  
  const totalAdmins = usuarios.filter(u => u.role === 'admin_finca').length;
  
  // Fix usage of apellido to apellidos
  const getAdminFullName = (admin: Usuario) => {
    return `${admin.nombre || ""} ${admin.apellidos || ""}`.trim();
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleOpenEditDialog = (admin: Usuario) => {
    setSelectedAdmin(admin);
    setFormData({
      nombre: admin.nombre || "",
      apellidos: admin.apellidos || "",
      email: admin.email || "",
      telefono: admin.telefono || "",
      direccion: admin.direccion || ""
    });
    setIsEditingAdmin(true);
  };
  
  const resetForm = () => {
    setFormData({
      nombre: "",
      apellidos: "",
      email: "",
      telefono: "",
      direccion: ""
    });
    setSelectedAdmin(null);
  };
  
  const handleSubmit = async () => {
    if (!formData.nombre || !formData.apellidos || !formData.email) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }
    
    const dataToSubmit: Partial<Usuario> = {
      ...formData,
      role: 'admin_finca',
      activo: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };
    
    if (isEditingAdmin && selectedAdmin) {
      await updateUsuario(selectedAdmin.id, dataToSubmit);
      setIsEditingAdmin(false);
    } else {
      await addUsuario(dataToSubmit as Omit<Usuario, 'id'>);
      setIsAddingAdmin(false);
    }
    
    resetForm();
  };
  
  const handleDeleteAdmin = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este administrador de fincas?")) {
      await deleteUsuario(id);
    }
  };
  
  const handleExportData = (format: 'pdf' | 'excel') => {
    alert(`Exportando datos en formato ${format}. Esta función estará disponible próximamente.`);
  };
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Administradores de Fincas</h2>
          <p className="text-muted-foreground">
            Gestión de administradores con acceso al sistema
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddingAdmin} onOpenChange={setIsAddingAdmin}>
            <DialogTrigger asChild>
              <Button className="bg-asram hover:bg-asram-700">
                <FilePlus2 className="mr-2 h-4 w-4" />
                Añadir Administrador
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Añadir nuevo administrador de fincas</DialogTitle>
                <DialogDescription>
                  Completa el formulario para añadir un nuevo administrador al sistema
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    id="nombre"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="apellidos">Apellidos</Label>
                  <Input
                    id="apellidos"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    id="telefono"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    id="direccion"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingAdmin(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  className="bg-asram hover:bg-asram-700"
                  onClick={handleSubmit}
                >
                  Guardar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Dialog open={isEditingAdmin} onOpenChange={setIsEditingAdmin}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Editar administrador de fincas</DialogTitle>
                <DialogDescription>
                  Actualiza la información del administrador
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="space-y-2">
                  <Label htmlFor="nombre-edit">Nombre</Label>
                  <Input
                    id="nombre-edit"
                    name="nombre"
                    value={formData.nombre}
                    onChange={handleInputChange}
                  />
                </div>
                 <div className="space-y-2">
                  <Label htmlFor="apellidos-edit">Apellidos</Label>
                  <Input
                    id="apellidos-edit"
                    name="apellidos"
                    value={formData.apellidos}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-edit">Email</Label>
                  <Input
                    id="email-edit"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="telefono-edit">Teléfono</Label>
                  <Input
                    id="telefono-edit"
                    name="telefono"
                    value={formData.telefono}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="direccion-edit">Dirección</Label>
                  <Input
                    id="direccion-edit"
                    name="direccion"
                    value={formData.direccion}
                    onChange={handleInputChange}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditingAdmin(false);
                    resetForm();
                  }}
                >
                  Cancelar
                </Button>
                <Button 
                  className="bg-asram hover:bg-asram-700"
                  onClick={handleSubmit}
                >
                  Actualizar
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          <Button variant="outline" onClick={() => handleExportData('excel')}>
            <FileSpreadsheet className="mr-2 h-4 w-4" />
            Excel
          </Button>
          <Button variant="outline" onClick={() => handleExportData('pdf')}>
            <FileText className="mr-2 h-4 w-4" />
            PDF
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Administradores de Fincas
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalAdmins}</div>
            <p className="text-xs text-muted-foreground">
              administradores activos
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Listado de Administradores de Fincas</CardTitle>
          <CardDescription>
            Administradores con acceso al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-6">
              <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
            </div>
          ) : (
            <div className="overflow-x-auto">
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Nombre</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Teléfono</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {usuarios.filter(u => u.role === 'admin_finca').length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={4} className="text-center">
                        No hay administradores de fincas registrados
                      </TableCell>
                    </TableRow>
                  ) : (
                    usuarios.filter(u => u.role === 'admin_finca').map((administrador) => (
                      <TableRow key={administrador.id}>
                        
  <TableCell>{administrador.nombre} {administrador.apellidos}</TableCell>
                        <TableCell>{administrador.email}</TableCell>
                        <TableCell>{administrador.telefono}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleOpenEditDialog(administrador)}
                            >
                              <PenLine className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDeleteAdmin(administrador.id)}
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
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AdministradoresFincas;

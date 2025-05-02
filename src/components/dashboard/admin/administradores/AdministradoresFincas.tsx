
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
  ExternalLink,
  FilePlus2, 
  FileSpreadsheet, 
  FileText, 
  Loader2, 
  LogIn,
  MapPin, 
  PenLine, 
  Percent, 
  Search,
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
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

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
  const [searchTerm, setSearchTerm] = useState("");
  const navigate = useNavigate();
  const [formData, setFormData] = useState<AdminFormData>({
    nombre: "",
    apellidos: "",
    email: "",
    telefono: "",
    direccion: ""
  });
  
  // Filter usuarios to only show those with administrador role
  const adminFincas = usuarios.filter(user => user.role === 'administrador');
  
  // Filter active administrador users
  const activeAdminFincas = adminFincas.filter(admin => admin.activo !== false);
  
  // Filter by search term
  const filteredAdmins = adminFincas.filter(admin => 
    admin.nombre?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.apellidos?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    admin.id.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  const totalAdmins = adminFincas.length;
  const activeAdmins = adminFincas.filter(admin => admin.activo !== false).length;
  
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
      role: 'administrador',
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
  
  const handleViewAdminDashboard = (adminId: string) => {
    // Almacenar ID de administrador en sessionStorage para su uso posterior
    sessionStorage.setItem('viewingAdminId', adminId);
    sessionStorage.setItem('fromSuperAdmin', 'true');
    
    // Redirigir a la ruta del dashboard del administrador
    navigate('/administrador/dashboard');
    toast.success("Accediendo al panel del administrador de fincas");
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
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Añadir nuevo administrador de fincas</DialogTitle>
                <DialogDescription>
                  Completa el formulario para añadir un nuevo administrador al sistema
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre <span className="text-red-500">*</span></Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellidos">Apellidos <span className="text-red-500">*</span></Label>
                    <Input
                      id="apellidos"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email <span className="text-red-500">*</span></Label>
                  <Input
                    id="email"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                
                {/* Nueva sección para mostrar administradores activos */}
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-md font-medium mb-2">Administradores de Fincas Activos ({activeAdminFincas.length})</h3>
                  <div className="max-h-40 overflow-y-auto border rounded-md">
                    {activeAdminFincas.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Teléfono</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activeAdminFincas.map((admin) => (
                            <TableRow key={admin.id}>
                              <TableCell className="font-medium">{admin.nombre} {admin.apellidos}</TableCell>
                              <TableCell>{admin.email}</TableCell>
                              <TableCell>{admin.telefono}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-center py-4 text-sm text-muted-foreground">
                        No hay administradores activos registrados
                      </p>
                    )}
                  </div>
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
            <DialogContent className="sm:max-w-[700px]">
              <DialogHeader>
                <DialogTitle>Editar administrador de fincas</DialogTitle>
                <DialogDescription>
                  Actualiza la información del administrador
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre-edit">Nombre <span className="text-red-500">*</span></Label>
                    <Input
                      id="nombre-edit"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="apellidos-edit">Apellidos <span className="text-red-500">*</span></Label>
                    <Input
                      id="apellidos-edit"
                      name="apellidos"
                      value={formData.apellidos}
                      onChange={handleInputChange}
                      required
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email-edit">Email <span className="text-red-500">*</span></Label>
                  <Input
                    id="email-edit"
                    name="email"
                    type="email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
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
                
                {/* Nueva sección para mostrar administradores activos */}
                <div className="mt-6 border-t pt-4">
                  <h3 className="text-md font-medium mb-2">Administradores de Fincas Activos ({activeAdminFincas.length})</h3>
                  <div className="max-h-40 overflow-y-auto border rounded-md">
                    {activeAdminFincas.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Nombre</TableHead>
                            <TableHead>Email</TableHead>
                            <TableHead>Teléfono</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {activeAdminFincas.map((admin) => (
                            <TableRow key={admin.id} className={selectedAdmin?.id === admin.id ? "bg-muted" : ""}>
                              <TableCell className="font-medium">{admin.nombre} {admin.apellidos}</TableCell>
                              <TableCell>{admin.email}</TableCell>
                              <TableCell>{admin.telefono}</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <p className="text-center py-4 text-sm text-muted-foreground">
                        No hay administradores activos registrados
                      </p>
                    )}
                  </div>
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

      <div className="grid gap-4 md:grid-cols-3">
        <Card className="bg-gradient-to-br from-white to-amber-50/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Administradores Registrados
            </CardTitle>
            <Users className="h-4 w-4 text-asram" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-asram">{totalAdmins}</div>
            <p className="text-xs text-muted-foreground">
              total en el sistema
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-white to-blue-50/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Administradores Activos
            </CardTitle>
            <Users className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-500">{activeAdmins}</div>
            <p className="text-xs text-muted-foreground">
              en funcionamiento
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-white to-green-50/30">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Comunidades Gestionadas
            </CardTitle>
            <MapPin className="h-4 w-4 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-500">
              {/* Número total de comunidades gestionadas por todos los administradores */}
              {/* Esta información vendría de otro hook o cálculo */}
              -
            </div>
            <p className="text-xs text-muted-foreground">
              en total
            </p>
          </CardContent>
        </Card>
      </div>

      <Card variant="sidebar">
        <CardHeader>
          <CardTitle className="flex items-center">
            <Users className="mr-2 h-5 w-5 text-asram" />
            Listado de Administradores de Fincas
          </CardTitle>
          <CardDescription>
            Administradores con acceso al sistema
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-4">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Buscar por nombre, email o ID..."
                className="pl-8"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          
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
                    <TableHead>Estado</TableHead>
                    <TableHead>Comunidades</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredAdmins.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={6} className="text-center">
                        No hay administradores de fincas registrados
                      </TableCell>
                    </TableRow>
                  ) : (
                    filteredAdmins.map((administrador) => (
                      <TableRow key={administrador.id}>
                        <TableCell>{administrador.nombre} {administrador.apellidos}</TableCell>
                        <TableCell>{administrador.email}</TableCell>
                        <TableCell>{administrador.telefono}</TableCell>
                        <TableCell>
                          <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
                            administrador.activo !== false 
                              ? "bg-green-100 text-green-800" 
                              : "bg-red-100 text-red-800"
                          }`}>
                            {administrador.activo !== false ? "Activo" : "Inactivo"}
                          </span>
                        </TableCell>
                        <TableCell>
                          {/* Número de comunidades gestionadas por este administrador */}
                          {/* Esta información vendría de otro hook o cálculo */}
                          -
                        </TableCell>
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
                            <Button 
                              variant="outline" 
                              size="icon" 
                              className="text-asram"
                              title="Acceder al dashboard"
                              onClick={() => handleViewAdminDashboard(administrador.id)}
                            >
                              <LogIn className="h-4 w-4" />
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

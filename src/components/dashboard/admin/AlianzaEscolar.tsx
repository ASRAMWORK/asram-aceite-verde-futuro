import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAlianzaVerde } from "@/hooks/useAlianzaVerde";
import type { AlianzaVerde } from "@/types";
import { 
  Download, 
  FilePlus2, 
  FileSpreadsheet, 
  FileText, 
  Loader2, 
  Mail, 
  PenLine, 
  School, 
  Trash2, 
  Users 
} from "lucide-react";

type CentroFormData = {
  nombre: string;
  tipo: string;
  direccion: string;
  distrito: string;
  barrio: string;
  contacto: string;
  telefono: string;
  email: string;
  numEstudiantes: number;
  talleresRealizados: number;
  certificaciones: number;
};

const tiposCentro = [
  "Colegio Público",
  "Colegio Concertado",
  "Colegio Privado",
  "Instituto",
  "Centro de Formación",
  "Asociación",
  "Empresa",
  "Entidad Pública"
];

const distritos = [
  "Centro", "Arganzuela", "Retiro", "Salamanca", "Chamartín", 
  "Tetuán", "Chamberí", "Fuencarral-El Pardo", "Moncloa-Aravaca", 
  "Latina", "Carabanchel", "Usera", "Puente de Vallecas", 
  "Moratalaz", "Ciudad Lineal", "Hortaleza", "Villaverde",
  "Villa de Vallecas", "Vicálvaro", "San Blas-Canillejas", "Barajas"
];

const barrios: Record<string, string[]> = {
  "Centro": ["Palacio", "Embajadores", "Cortes", "Justicia", "Universidad", "Sol"],
  "Arganzuela": ["Imperial", "Acacias", "Chopera", "Legazpi", "Delicias", "Palos de Moguer", "Atocha"],
  // Add more barrios for each distrito as needed
};

const AlianzaEscolar = () => {
  const { alianzas, loading, error, addAlianzaVerde, updateAlianzaVerde, deleteAlianzaVerde } = useAlianzaVerde();
  const [isAddingCentro, setIsAddingCentro] = useState(false);
  const [isEditingCentro, setIsEditingCentro] = useState(false);
  const [selectedCentro, setSelectedCentro] = useState<AlianzaVerde | null>(null);
  const [formData, setFormData] = useState<CentroFormData>({
    nombre: "",
    tipo: "",
    direccion: "",
    distrito: "",
    barrio: "",
    contacto: "",
    telefono: "",
    email: "",
    numEstudiantes: 0,
    talleresRealizados: 0,
    certificaciones: 0
  });
  const [filteredBarrios, setFilteredBarrios] = useState<string[]>([]);
  
  const handleDistritoChange = (value: string) => {
    setFormData({
      ...formData,
      distrito: value,
      barrio: ""
    });
    setFilteredBarrios(barrios[value] || []);
  };
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: name.includes("num") ? parseInt(value) || 0 : value,
    });
  };
  
  const handleSelectChange = (name: string, value: string) => {
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleOpenEditDialog = (centro: AlianzaVerde) => {
    setSelectedCentro(centro);
    setFormData({
      nombre: centro.nombre || "",
      tipo: centro.tipo || "",
      direccion: centro.direccion || "",
      distrito: centro.distrito || "",
      barrio: centro.barrio || "",
      contacto: centro.contacto || "",
      telefono: centro.telefono || "",
      email: centro.email || "",
      numEstudiantes: centro.numEstudiantes || 0,
      talleresRealizados: centro.talleresRealizados || 0,
      certificaciones: typeof centro.certificaciones === 'number' 
        ? centro.certificaciones 
        : (centro.certificaciones as string[])?.length || 0
    });
    
    if (centro.distrito) {
      setFilteredBarrios(barrios[centro.distrito] || []);
    }
    
    setIsEditingCentro(true);
  };
  
  const resetForm = () => {
    setFormData({
      nombre: "",
      tipo: "",
      direccion: "",
      distrito: "",
      barrio: "",
      contacto: "",
      telefono: "",
      email: "",
      numEstudiantes: 0,
      talleresRealizados: 0,
      certificaciones: 0
    });
    setFilteredBarrios([]);
    setSelectedCentro(null);
  };
  
  const handleSubmit = async () => {
    if (!formData.nombre || !formData.tipo || !formData.direccion || !formData.distrito || !formData.email) {
      alert("Por favor completa todos los campos obligatorios");
      return;
    }
    
    if (isEditingCentro && selectedCentro) {
      await updateAlianzaVerde(selectedCentro.id, formData as Partial<AlianzaVerde>);
      setIsEditingCentro(false);
    } else {
      await addAlianzaVerde(formData as Omit<AlianzaVerde, 'id'>);
      setIsAddingCentro(false);
    }
    
    resetForm();
  };
  
  const handleDeleteCentro = async (id: string) => {
    if (window.confirm("¿Estás seguro de que quieres eliminar este centro?")) {
      await deleteAlianzaVerde(id);
    }
  };
  
  const handleExportData = (format: 'pdf' | 'excel') => {
    alert(`Exportando datos en formato ${format}. Esta función estará disponible próximamente.`);
  };
  
  const handleSendNotification = () => {
    alert("Enviando notificaciones a todos los centros. Esta función estará disponible próximamente.");
  };
  
  const totalCentros = alianzas.length;
  const totalEstudiantes = alianzas.reduce((total, centro) => total + (centro.numEstudiantes || 0), 0);
  const totalTalleres = alianzas.reduce((total, centro) => total + (centro.talleresRealizados || 0), 0);
  const totalCertificaciones = alianzas.reduce((total, centro) => {
    if (typeof centro.certificaciones === 'number') {
      return total + centro.certificaciones;
    } else if (Array.isArray(centro.certificaciones)) {
      return total + centro.certificaciones.length;
    }
    return total;
  }, 0);
  
  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Alianza Verde Escolar</h2>
          <p className="text-muted-foreground">
            Gestión de centros educativos, asociaciones y entidades participantes
          </p>
        </div>
        <div className="flex gap-2">
          <Dialog open={isAddingCentro} onOpenChange={setIsAddingCentro}>
            <DialogTrigger asChild>
              <Button className="bg-asram hover:bg-asram-700">
                <FilePlus2 className="mr-2 h-4 w-4" />
                Añadir Centro
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Añadir nuevo centro</DialogTitle>
                <DialogDescription>
                  Completa el formulario para añadir un nuevo centro a la Alianza Verde Escolar
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre">Nombre del centro</Label>
                    <Input
                      id="nombre"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo">Tipo de centro</Label>
                    <Select
                      value={formData.tipo}
                      onValueChange={(value) => handleSelectChange("tipo", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposCentro.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="distrito">Distrito</Label>
                    <Select
                      value={formData.distrito}
                      onValueChange={handleDistritoChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona distrito" />
                      </SelectTrigger>
                      <SelectContent>
                        {distritos.map((distrito) => (
                          <SelectItem key={distrito} value={distrito}>
                            {distrito}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barrio">Barrio</Label>
                    <Select
                      value={formData.barrio}
                      onValueChange={(value) => handleSelectChange("barrio", value)}
                      disabled={!formData.distrito}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona barrio" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredBarrios.map((barrio) => (
                          <SelectItem key={barrio} value={barrio}>
                            {barrio}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contacto">Persona de contacto</Label>
                  <Input
                    id="contacto"
                    name="contacto"
                    value={formData.contacto}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefono">Teléfono de contacto</Label>
                    <Input
                      id="telefono"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Correo electrónico</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numEstudiantes">Nº de estudiantes</Label>
                    <Input
                      id="numEstudiantes"
                      name="numEstudiantes"
                      type="number"
                      value={formData.numEstudiantes}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="talleresRealizados">Talleres realizados</Label>
                    <Input
                      id="talleresRealizados"
                      name="talleresRealizados"
                      type="number"
                      value={formData.talleresRealizados}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="certificaciones">Certificaciones</Label>
                    <Input
                      id="certificaciones"
                      name="certificaciones"
                      type="number"
                      value={formData.certificaciones}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddingCentro(false);
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
          
          <Dialog open={isEditingCentro} onOpenChange={setIsEditingCentro}>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle>Editar centro</DialogTitle>
                <DialogDescription>
                  Actualiza la información del centro en la Alianza Verde Escolar
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="nombre-edit">Nombre del centro</Label>
                    <Input
                      id="nombre-edit"
                      name="nombre"
                      value={formData.nombre}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="tipo-edit">Tipo de centro</Label>
                    <Select
                      value={formData.tipo}
                      onValueChange={(value) => handleSelectChange("tipo", value)}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona tipo" />
                      </SelectTrigger>
                      <SelectContent>
                        {tiposCentro.map((tipo) => (
                          <SelectItem key={tipo} value={tipo}>
                            {tipo}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
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
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="distrito-edit">Distrito</Label>
                    <Select
                      value={formData.distrito}
                      onValueChange={handleDistritoChange}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona distrito" />
                      </SelectTrigger>
                      <SelectContent>
                        {distritos.map((distrito) => (
                          <SelectItem key={distrito} value={distrito}>
                            {distrito}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="barrio-edit">Barrio</Label>
                    <Select
                      value={formData.barrio}
                      onValueChange={(value) => handleSelectChange("barrio", value)}
                      disabled={!formData.distrito}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Selecciona barrio" />
                      </SelectTrigger>
                      <SelectContent>
                        {filteredBarrios.map((barrio) => (
                          <SelectItem key={barrio} value={barrio}>
                            {barrio}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="contacto-edit">Persona de contacto</Label>
                  <Input
                    id="contacto-edit"
                    name="contacto"
                    value={formData.contacto}
                    onChange={handleInputChange}
                  />
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="telefono-edit">Teléfono de contacto</Label>
                    <Input
                      id="telefono-edit"
                      name="telefono"
                      value={formData.telefono}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email-edit">Correo electrónico</Label>
                    <Input
                      id="email-edit"
                      name="email"
                      type="email"
                      value={formData.email}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="numEstudiantes-edit">Nº de estudiantes</Label>
                    <Input
                      id="numEstudiantes-edit"
                      name="numEstudiantes"
                      type="number"
                      value={formData.numEstudiantes}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="talleresRealizados-edit">Talleres realizados</Label>
                    <Input
                      id="talleresRealizados-edit"
                      name="talleresRealizados"
                      type="number"
                      value={formData.talleresRealizados}
                      onChange={handleInputChange}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="certificaciones-edit">Certificaciones</Label>
                    <Input
                      id="certificaciones-edit"
                      name="certificaciones"
                      type="number"
                      value={formData.certificaciones}
                      onChange={handleInputChange}
                    />
                  </div>
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsEditingCentro(false);
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
          <Button variant="outline" onClick={handleSendNotification}>
            <Mail className="mr-2 h-4 w-4" />
            Notificar
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Centros Activos
            </CardTitle>
            <School className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCentros}</div>
            <p className="text-xs text-muted-foreground">
              en el programa Alianza Verde Escolar
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Estudiantes
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalEstudiantes}</div>
            <p className="text-xs text-muted-foreground">
              participantes en actividades
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Talleres Realizados
            </CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalTalleres}</div>
            <p className="text-xs text-muted-foreground">
              en todos los centros
            </p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Certificaciones
            </CardTitle>
            <Download className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalCertificaciones}</div>
            <p className="text-xs text-muted-foreground">
              otorgadas a centros
            </p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Centros en Alianza Verde Escolar</CardTitle>
          <CardDescription>
            Lista de centros educativos y entidades participantes
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
                    <TableHead>Tipo</TableHead>
                    <TableHead>Distrito</TableHead>
                    <TableHead>Contacto</TableHead>
                    <TableHead>Estudiantes</TableHead>
                    <TableHead>Talleres</TableHead>
                    <TableHead>Certificaciones</TableHead>
                    <TableHead>Acciones</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {alianzas.length === 0 ? (
                    <TableRow>
                      <TableCell colSpan={8} className="text-center">
                        No hay centros registrados en la Alianza Verde Escolar
                      </TableCell>
                    </TableRow>
                  ) : (
                    alianzas.map((centro) => (
                      <TableRow key={centro.id}>
                        <TableCell className="font-medium">{centro.nombre}</TableCell>
                        <TableCell>{centro.tipo}</TableCell>
                        <TableCell>{centro.distrito}</TableCell>
                        <TableCell>{centro.contacto}</TableCell>
                        <TableCell>{centro.numEstudiantes}</TableCell>
                        <TableCell>{centro.talleresRealizados}</TableCell>
                        <TableCell>{centro.certificaciones}</TableCell>
                        <TableCell>
                          <div className="flex gap-1">
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleOpenEditDialog(centro)}
                            >
                              <PenLine className="h-4 w-4" />
                            </Button>
                            <Button 
                              variant="outline" 
                              size="icon"
                              onClick={() => handleDeleteCentro(centro.id)}
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
        <CardFooter className="flex justify-between">
          <div className="text-sm text-muted-foreground">
            Mostrando {alianzas.length} centros
          </div>
          <div className="space-x-2">
            <Button variant="outline" size="sm">Anterior</Button>
            <Button variant="outline" size="sm">Siguiente</Button>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AlianzaEscolar;


import React, { useState, useEffect } from 'react';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge" // Added Badge import
import { toast } from 'sonner';
import { useAlianzas } from '@/hooks/useAlianzas';
import { AlianzaVerde } from '@/types';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { Trash2 } from 'lucide-react';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"

const AlianzaEscolar = () => {
  const [showForm, setShowForm] = useState(false);
  const [nombre, setNombre] = useState('');
  const [tipo, setTipo] = useState('');
  const [direccion, setDireccion] = useState('');
  const [ciudad, setCiudad] = useState('');
  const [provincia, setProvincia] = useState('');
  const [codigoPostal, setCodigoPostal] = useState('');
  const [telefono, setTelefono] = useState('');
  const [email, setEmail] = useState('');
  const [contacto, setContacto] = useState('');
  const [numAlumnos, setNumAlumnos] = useState(0);
  const [numContenedores, setNumContenedores] = useState(0);
  const [litrosRecogidos, setLitrosRecogidos] = useState(0);
  const [activo, setActivo] = useState(true);
  const [fechaInicio, setFechaInicio] = useState<Date | null>(null);
  const [fechaFin, setFechaFin] = useState<Date | null>(null);
  const [distrito, setDistrito] = useState('');
  const [barrio, setBarrio] = useState('');
  const [numEstudiantes, setNumEstudiantes] = useState(0);
  const [talleresRealizados, setTalleresRealizados] = useState(0);
  const [certificacionesNivel, setCertificacionesNivel] = useState<number>(1);
  const [numParticipantes, setNumParticipantes] = useState(0);
  const [estado, setEstado] = useState('');
  const [alianzaSeleccionada, setAlianzaSeleccionada] = useState<AlianzaVerde | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [certificaciones, setCertificaciones] = useState<string[]>([]);

  const { alianzas, addAlianza, updateAlianza, deleteAlianza } = useAlianzas();

  useEffect(() => {
    if (alianzaSeleccionada) {
      setNombre(alianzaSeleccionada.nombre);
      setTipo(alianzaSeleccionada.tipo);
      setDireccion(alianzaSeleccionada.direccion);
      setCiudad(alianzaSeleccionada.ciudad);
      setProvincia(alianzaSeleccionada.provincia);
      setCodigoPostal(alianzaSeleccionada.codigoPostal);
      setTelefono(alianzaSeleccionada.telefono);
      setEmail(alianzaSeleccionada.email);
      setContacto(alianzaSeleccionada.contacto);
      setNumAlumnos(alianzaSeleccionada.numAlumnos);
      setNumContenedores(alianzaSeleccionada.numContenedores);
      setLitrosRecogidos(alianzaSeleccionada.litrosRecogidos);
      setActivo(alianzaSeleccionada.activo);
      setFechaInicio(alianzaSeleccionada.fechaInicio);
      setFechaFin(alianzaSeleccionada.fechaFin || null);
      setDistrito(alianzaSeleccionada.distrito || '');
      setBarrio(alianzaSeleccionada.barrio || '');
      setNumEstudiantes(alianzaSeleccionada.numEstudiantes || 0);
      setTalleresRealizados(alianzaSeleccionada.talleresRealizados || 0);
      setCertificaciones(alianzaSeleccionada.certificaciones ? (alianzaSeleccionada.certificaciones as unknown as string[]) : []);
      setNumParticipantes(alianzaSeleccionada.numParticipantes || 0);
      setEstado(alianzaSeleccionada.estado || '');
    } else {
      resetForm();
    }
  }, [alianzaSeleccionada]);

  const resetForm = () => {
    setNombre('');
    setTipo('');
    setDireccion('');
    setCiudad('');
    setProvincia('');
    setCodigoPostal('');
    setTelefono('');
    setEmail('');
    setContacto('');
    setNumAlumnos(0);
    setNumContenedores(0);
    setLitrosRecogidos(0);
    setActivo(true);
    setFechaInicio(null);
    setFechaFin(null);
    setDistrito('');
    setBarrio('');
    setNumEstudiantes(0);
    setTalleresRealizados(0);
    setCertificaciones([]);
    setNumParticipantes(0);
    setEstado('');
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const alianzaData = {
      nombre,
      tipo,
      direccion,
      ciudad,
      provincia,
      codigoPostal,
      telefono,
      email,
      contacto,
      numAlumnos,
      numContenedores,
      litrosRecogidos,
      activo,
      fechaInicio,
      fechaFin,
      distrito,
      barrio,
      numEstudiantes,
      talleresRealizados,
      certificaciones: certificaciones.map(Number),
      numParticipantes,
      estado,
    };

    if (alianzaSeleccionada) {
      // Update existing alianza
      await updateAlianza(alianzaSeleccionada.id, alianzaData);
      toast.success('Alianza actualizada correctamente');
    } else {
      // Add new alianza
      await addAlianza(alianzaData);
      toast.success('Alianza creada correctamente');
    }

    setShowForm(false);
    setAlianzaSeleccionada(null);
    resetForm();
  };

  const handleEdit = (alianza: AlianzaVerde) => {
    setAlianzaSeleccionada(alianza);
    setShowForm(true);
  };

  const handleDelete = (alianza: AlianzaVerde) => {
    setAlianzaSeleccionada(alianza);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (alianzaSeleccionada) {
      await deleteAlianza(alianzaSeleccionada.id);
      toast.success('Alianza eliminada correctamente');
      setShowDeleteAlert(false);
      setAlianzaSeleccionada(null);
    }
  };

  const handleAddCertificacion = () => {
    const nivel = certificacionesNivel;
    if (!certificaciones.includes(String(nivel))) {
      setCertificaciones([...certificaciones, String(nivel)]);
    }
  };

  const handleRemoveCertificacion = (nivel: string) => {
    setCertificaciones(certificaciones.filter(c => c !== nivel));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Gestión de Alianzas Escolares</h2>
          <p className="text-muted-foreground">
            Administra las alianzas con centros educativos
          </p>
        </div>
        <Button onClick={() => { setShowForm(true); setAlianzaSeleccionada(null); }} className="bg-green-500 hover:bg-green-700 text-white">
          Nueva Alianza
        </Button>
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>{alianzaSeleccionada ? 'Editar Alianza' : 'Nueva Alianza Escolar'}</CardTitle>
            <CardDescription>Ingrese los datos de la alianza</CardDescription>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="nombre">Nombre</Label>
                  <Input
                    type="text"
                    id="nombre"
                    value={nombre}
                    onChange={(e) => setNombre(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="tipo">Tipo</Label>
                  <Select value={tipo} onValueChange={setTipo}>
                    <SelectTrigger>
                      <SelectValue placeholder="Seleccione un tipo" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="colegio">Colegio</SelectItem>
                      <SelectItem value="instituto">Instituto</SelectItem>
                      <SelectItem value="universidad">Universidad</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="direccion">Dirección</Label>
                  <Input
                    type="text"
                    id="direccion"
                    value={direccion}
                    onChange={(e) => setDireccion(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="ciudad">Ciudad</Label>
                  <Input
                    type="text"
                    id="ciudad"
                    value={ciudad}
                    onChange={(e) => setCiudad(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="provincia">Provincia</Label>
                  <Input
                    type="text"
                    id="provincia"
                    value={provincia}
                    onChange={(e) => setProvincia(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="codigoPostal">Código Postal</Label>
                  <Input
                    type="text"
                    id="codigoPostal"
                    value={codigoPostal}
                    onChange={(e) => setCodigoPostal(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="telefono">Teléfono</Label>
                  <Input
                    type="tel"
                    id="telefono"
                    value={telefono}
                    onChange={(e) => setTelefono(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    type="email"
                    id="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="contacto">Contacto</Label>
                  <Input
                    type="text"
                    id="contacto"
                    value={contacto}
                    onChange={(e) => setContacto(e.target.value)}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="numAlumnos">Número de Alumnos</Label>
                  <Input
                    type="number"
                    id="numAlumnos"
                    value={numAlumnos}
                    onChange={(e) => setNumAlumnos(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="numContenedores">Número de Contenedores</Label>
                  <Input
                    type="number"
                    id="numContenedores"
                    value={numContenedores}
                    onChange={(e) => setNumContenedores(Number(e.target.value))}
                    required
                  />
                </div>
                <div>
                  <Label htmlFor="litrosRecogidos">Litros Recogidos</Label>
                  <Input
                    type="number"
                    id="litrosRecogidos"
                    value={litrosRecogidos}
                    onChange={(e) => setLitrosRecogidos(Number(e.target.value))}
                    required
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="distrito">Distrito</Label>
                  <Input
                    type="text"
                    id="distrito"
                    value={distrito}
                    onChange={(e) => setDistrito(e.target.value)}
                  />
                </div>
                <div>
                  <Label htmlFor="barrio">Barrio</Label>
                  <Input
                    type="text"
                    id="barrio"
                    value={barrio}
                    onChange={(e) => setBarrio(e.target.value)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="numEstudiantes">Número de Estudiantes</Label>
                  <Input
                    type="number"
                    id="numEstudiantes"
                    value={numEstudiantes}
                    onChange={(e) => setNumEstudiantes(Number(e.target.value))}
                  />
                </div>
                <div>
                  <Label htmlFor="talleresRealizados">Talleres Realizados</Label>
                  <Input
                    type="number"
                    id="talleresRealizados"
                    value={talleresRealizados}
                    onChange={(e) => setTalleresRealizados(Number(e.target.value))}
                  />
                </div>
              </div>

              <div>
                <Label>Certificaciones</Label>
                <div className="flex items-center space-x-2">
                  <Input
                    type="number"
                    value={certificacionesNivel}
                    onChange={(e) => setCertificacionesNivel(Number(e.target.value))}
                    className="w-20"
                  />
                  <Button type="button" variant="secondary" onClick={handleAddCertificacion}>
                    Añadir Nivel
                  </Button>
                </div>
                <div className="flex space-x-2 mt-2">
                  {certificaciones.map((nivel) => (
                    <Badge key={nivel} className="gap-0.5">
                      Nivel {nivel}
                      <Button type="button" variant="ghost" size="sm" onClick={() => handleRemoveCertificacion(nivel)}>
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <Label htmlFor="numParticipantes">Número de Participantes</Label>
                <Input
                  type="number"
                  id="numParticipantes"
                  value={numParticipantes}
                  onChange={(e) => setNumParticipantes(Number(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="estado">Estado</Label>
                <Input
                  type="text"
                  id="estado"
                  value={estado}
                  onChange={(e) => setEstado(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="activo">Activo</Label>
                <Switch
                  id="activo"
                  checked={activo}
                  onCheckedChange={(checked) => setActivo(checked)}
                />
              </div>

              <div className="flex justify-end space-x-2">
                <Button variant="secondary" onClick={() => { setShowForm(false); setAlianzaSeleccionada(null); resetForm(); }}>
                  Cancelar
                </Button>
                <Button type="submit" className="bg-green-500 hover:bg-green-700 text-white">
                  {alianzaSeleccionada ? 'Actualizar' : 'Guardar'}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Listado de Alianzas Escolares</CardTitle>
          <CardDescription>Gestiona las alianzas existentes</CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Tipo</TableHead>
                <TableHead>Contacto</TableHead>
                <TableHead>Teléfono</TableHead>
                <TableHead>Activo</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {alianzas.map((alianza) => (
                <TableRow key={alianza.id}>
                  <TableCell>{alianza.nombre}</TableCell>
                  <TableCell>{alianza.tipo}</TableCell>
                  <TableCell>{alianza.contacto}</TableCell>
                  <TableCell>{alianza.telefono}</TableCell>
                  <TableCell>{alianza.activo ? 'Sí' : 'No'}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="outline" size="sm" onClick={() => handleEdit(alianza)}>
                      Editar
                    </Button>
                    <Button variant="destructive" size="sm" onClick={() => handleDelete(alianza)}>
                      Eliminar
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <AlertDialog open={showDeleteAlert} onOpenChange={() => setShowDeleteAlert(false)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>¿Estás seguro?</AlertDialogTitle>
            <AlertDialogDescription>
              Esta acción eliminará la alianza de forma permanente. ¿Deseas continuar?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => setShowDeleteAlert(false)}>Cancelar</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete}>Eliminar</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default AlianzaEscolar;

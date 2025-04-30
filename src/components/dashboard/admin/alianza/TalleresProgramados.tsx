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
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
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
import { useTalleresProgramados } from '@/hooks/useTalleresProgramados';
import { TallerProgramado } from '@/types';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { CalendarIcon, CheckCircle2, Clock, MapPin, User, Edit, Trash2 } from 'lucide-react';
import { Separator } from "@/components/ui/separator"

const TalleresProgramados = () => {
  const [talleres, setTalleres] = useState<TallerProgramado[]>([]);
  const [tallerEditando, setTallerEditando] = useState<Partial<TallerProgramado>>({});
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);
  const [tallerSeleccionado, setTallerSeleccionado] = useState<TallerProgramado | null>(null);
  const { talleresProgramados, addTallerProgramado, updateTallerProgramado, deleteTallerProgramado } = useTalleresProgramados();
  const [showForm, setShowForm] = useState(false);

  useEffect(() => {
    setTalleres(talleresProgramados);
  }, [talleresProgramados]);

  const handleAddTaller = () => {
    // Using properties that exist in our updated TallerProgramado interface
    const nuevoTaller: Omit<TallerProgramado, 'id'> = {
      titulo: '',
      fecha: new Date(),
      hora: '', // Using hora instead of horaInicio
      duracion: 60,
      ubicacion: '',
      aforo: 0,
      estado: 'programado',
      createdAt: new Date(),
      updatedAt: new Date()
    };

    setTallerEditando(nuevoTaller);
    setShowForm(true);
  };

  const handleEditTaller = (taller: TallerProgramado) => {
    setTallerEditando(taller);
    setShowForm(true);
  };

  const handleDeleteTaller = (taller: TallerProgramado) => {
    setTallerSeleccionado(taller);
    setShowDeleteAlert(true);
  };

  const confirmDelete = async () => {
    if (tallerSeleccionado) {
      await deleteTallerProgramado(tallerSeleccionado.id);
      setShowDeleteAlert(false);
      setTallerSeleccionado(null);
    }
  };

  const handleSaveTaller = async () => {
    if (!tallerEditando) return;

    const { id, ...tallerDataSinId } = tallerEditando;

    const tallerData: Omit<TallerProgramado, 'id'> = {
      titulo: tallerEditando.titulo || '',
      descripcion: tallerEditando.descripcion || '',
      fecha: tallerEditando.fecha || new Date(),
      hora: tallerEditando.hora || '', // Using hora instead of horaInicio
      duracion: tallerEditando.duracion || 60,
      ubicacion: tallerEditando.ubicacion || '',
      aforo: tallerEditando.aforo || 0,
      participantes: tallerEditando.participantes || 0,
      organizador: tallerEditando.organizador || '',
      contacto: tallerEditando.contacto || '',
      telefono: tallerEditando.telefono || '',
      email: tallerEditando.email || '',
      estado: tallerEditando.estado || 'programado',
      createdAt: tallerEditando.createdAt || new Date(),
      updatedAt: new Date()
    };

    if (id) {
      await updateTallerProgramado(id, tallerData);
    } else {
      await addTallerProgramado(tallerData);
    }

    setShowForm(false);
    setTallerEditando({});
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setTallerEditando(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleDateChange = (date: Date | undefined) => {
    setTallerEditando(prev => ({
      ...prev,
      fecha: date
    }));
  };

  const formatFechaHora = (fecha: Date | undefined, hora: string | undefined) => {
    if (!fecha) return 'Fecha no especificada';
    const fechaFormateada = format(fecha, 'dd/MM/yyyy', { locale: es });
    return `${fechaFormateada} - ${hora || 'Sin hora'}`;
  };

  return (
    <div className="container mx-auto py-8">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-2xl font-bold">Talleres Programados</h1>
          <p className="text-muted-foreground">
            Gestiona los talleres programados para las alianzas
          </p>
        </div>
        <Button onClick={handleAddTaller} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">
          Añadir Taller
        </Button>
      </div>

      {showForm && (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>{tallerEditando.id ? 'Editar Taller' : 'Añadir Taller'}</CardTitle>
            <CardDescription>
              Completa los detalles del taller
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-4">
              <div>
                <Label htmlFor="titulo">Título</Label>
                <Input
                  type="text"
                  id="titulo"
                  name="titulo"
                  value={tallerEditando.titulo || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="descripcion">Descripción</Label>
                <Input
                  type="text"
                  id="descripcion"
                  name="descripcion"
                  value={tallerEditando.descripcion || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="fecha">Fecha</Label>
                <Input
                  type="text"
                  id="fecha"
                  name="fecha"
                  value={tallerEditando.fecha ? format(tallerEditando.fecha, 'dd/MM/yyyy', { locale: es }) : ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="hora">Hora</Label>
                <Input
                  type="text"
                  id="hora"
                  name="hora"
                  value={tallerEditando.hora || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="duracion">Duración (minutos)</Label>
                <Input
                  type="number"
                  id="duracion"
                  name="duracion"
                  value={tallerEditando.duracion || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="ubicacion">Ubicación</Label>
                <Input
                  type="text"
                  id="ubicacion"
                  name="ubicacion"
                  value={tallerEditando.ubicacion || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="aforo">Aforo</Label>
                <Input
                  type="number"
                  id="aforo"
                  name="aforo"
                  value={tallerEditando.aforo || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div>
                <Label htmlFor="organizador">Organizador</Label>
                <Input
                  type="text"
                  id="organizador"
                  name="organizador"
                  value={tallerEditando.organizador || ''}
                  onChange={handleInputChange}
                />
              </div>
              <div className="flex justify-end">
                <Button variant="secondary" onClick={() => setShowForm(false)}>
                  Cancelar
                </Button>
                <Button className="ml-2 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded" onClick={handleSaveTaller}>
                  Guardar
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle>Lista de Talleres</CardTitle>
          <CardDescription>
            Aquí puedes ver todos los talleres programados
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Título</TableHead>
                <TableHead>Fecha y Hora</TableHead>
                <TableHead>Ubicación</TableHead>
                <TableHead>Asistentes</TableHead>
                <TableHead>Organizador</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {talleres.map((taller) => (
                <TableRow key={taller.id}>
                  <TableCell className="font-medium">{taller.titulo}</TableCell>
                  <TableCell>
                    {formatFechaHora(taller.fecha, taller.hora)} {/* Use fecha and hora instead of fechaHora */}
                  </TableCell>
                  <TableCell>{taller.ubicacion}</TableCell>
                  <TableCell>{taller.participantes || 0}</TableCell>
                  <TableCell>{taller.organizador || 'No asignado'}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button variant="outline" size="icon" onClick={() => handleEditTaller(taller)}>
                        <Edit className="h-4 w-4 mr-2" />
                      </Button>
                      <Button variant="destructive" size="icon" onClick={() => handleDeleteTaller(taller)}>
                        <Trash2 className="h-4 w-4 mr-2" />
                      </Button>
                    </div>
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
              Esta acción eliminará el taller de forma permanente. ¿Deseas continuar?
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

export default TalleresProgramados;


import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRecogidas } from '@/hooks/useRecogidas';
import type { Usuario, Recogida } from '@/types';
import { Droplet, Calendar, Plus } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";
import HistorialRecogidasTable from '../historial/HistorialRecogidasTable';
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from 'sonner';

interface ClienteLitrosHistoryProps {
  cliente: Usuario;
}

const ClienteLitrosHistory: React.FC<ClienteLitrosHistoryProps> = ({ cliente }) => {
  const { recogidas, getRecogidasByClientId, addRecogida, deleteRecogida, updateRecogida } = useRecogidas();
  const [isAddingRecogida, setIsAddingRecogida] = useState(false);
  const [isEditingRecogida, setIsEditingRecogida] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [litros, setLitros] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  const [recogidaToEdit, setRecogidaToEdit] = useState<Partial<Recogida> | null>(null);
  const [recogidaToDeleteId, setRecogidaToDeleteId] = useState<string | null>(null);
  const [showDeleteAlert, setShowDeleteAlert] = useState(false);

  // Get all the recogidas for this client
  const recogidasCliente = getRecogidasByClientId(cliente.id);
  
  // Format date helper
  const formatDate = (date: Date | undefined | null) => {
    if (!date) return 'N/A';
    try {
      return format(date, 'dd/MM/yyyy', { locale: es });
    } catch (error) {
      console.error('Error formatting date:', error);
      return 'N/A';
    }
  };
  
  // Handle adding a historical collection
  const handleAddHistoricalCollection = async () => {
    setIsLoading(true);
    try {
      await addRecogida({
        clienteId: cliente.id,
        fecha: date,
        fechaRecogida: date,
        litrosRecogidos: litros,
        completada: true,
        estadoRecogida: "completada",
        direccion: cliente.direccion,
        direccionRecogida: cliente.direccion,
        distrito: cliente.distrito,
        barrio: cliente.barrio,
        nombreContacto: cliente.nombre,
        telefonoContacto: cliente.telefono,
        emailContacto: cliente.email,
        fechaCompletada: date,
      });
      setIsAddingRecogida(false);
      setDate(new Date());
      setLitros(0);
      toast.success("Recolección histórica añadida correctamente");
    } catch (error) {
      console.error("Error adding historical collection:", error);
      toast.error("Error al añadir la recolección histórica");
    } finally {
      setIsLoading(false);
    }
  };

  // Handle editing a recogida
  const handleEditRecogida = (recogida: any) => {
    setRecogidaToEdit(recogida);
    setDate(recogida.fechaRecogida || recogida.fecha || new Date());
    setLitros(recogida.litrosRecogidos || 0);
    setIsEditingRecogida(true);
  };

  // Handle delete recogida
  const handleDeleteRecogida = (recogidaId: string) => {
    setRecogidaToDeleteId(recogidaId);
    setShowDeleteAlert(true);
  };

  // Confirm delete recogida
  const confirmDeleteRecogida = async () => {
    if (!recogidaToDeleteId) return;
    
    setIsLoading(true);
    try {
      await deleteRecogida(recogidaToDeleteId);
      toast.success("Recolección eliminada correctamente");
    } catch (error) {
      console.error("Error deleting recogida:", error);
      toast.error("Error al eliminar la recolección");
    } finally {
      setIsLoading(false);
      setShowDeleteAlert(false);
      setRecogidaToDeleteId(null);
    }
  };

  // Submit edit recogida
  const submitEditRecogida = async () => {
    if (!recogidaToEdit?.id) return;
    
    setIsLoading(true);
    try {
      await updateRecogida(recogidaToEdit.id, {
        fechaRecogida: date,
        fecha: date,
        litrosRecogidos: litros
      });
      setIsEditingRecogida(false);
      setRecogidaToEdit(null);
      toast.success("Recolección actualizada correctamente");
    } catch (error) {
      console.error("Error updating recogida:", error);
      toast.error("Error al actualizar la recolección");
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate total liters
  const totalLitros = recogidasCliente.reduce((sum, r) => sum + (r.litrosRecogidos || 0), 0);

  return (
    <Card className="w-full mt-4">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle>Historial de litros recogidos</CardTitle>
            <CardDescription>
              Registro de todas las recolecciones realizadas para {cliente.nombre}
            </CardDescription>
          </div>
          <Dialog open={isAddingRecogida} onOpenChange={setIsAddingRecogida}>
            <DialogTrigger asChild>
              <Button className="bg-[#EE970D] hover:bg-[#d88400]">
                <Plus className="mr-2 h-4 w-4" />
                Añadir recolección histórica
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Añadir recolección histórica</DialogTitle>
                <DialogDescription>
                  Registra una recolección anterior para este cliente.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="fecha">Fecha de recolección</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP', { locale: es }) : <span>Seleccione una fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => newDate && setDate(newDate)}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="litros">Litros recogidos</Label>
                  <Input
                    id="litros"
                    type="number"
                    min="0"
                    step="0.5"
                    value={litros}
                    onChange={(e) => setLitros(Number(e.target.value))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => setIsAddingRecogida(false)}>
                  Cancelar
                </Button>
                <Button 
                  onClick={handleAddHistoricalCollection}
                  disabled={isLoading || litros <= 0}
                  className="bg-[#EE970D] hover:bg-[#d88400]"
                >
                  {isLoading ? "Guardando..." : "Guardar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Dialog for editing recogidas */}
          <Dialog open={isEditingRecogida} onOpenChange={setIsEditingRecogida}>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Editar recolección</DialogTitle>
                <DialogDescription>
                  Modifica los datos de esta recolección.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-4 py-4">
                <div className="grid gap-2">
                  <Label htmlFor="fecha-edit">Fecha de recolección</Label>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        className="w-full justify-start text-left font-normal"
                      >
                        <Calendar className="mr-2 h-4 w-4" />
                        {date ? format(date, 'PPP', { locale: es }) : <span>Seleccione una fecha</span>}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <CalendarComponent
                        mode="single"
                        selected={date}
                        onSelect={(newDate) => newDate && setDate(newDate)}
                        initialFocus
                        className="p-3 pointer-events-auto"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="litros-edit">Litros recogidos</Label>
                  <Input
                    id="litros-edit"
                    type="number"
                    min="0"
                    step="0.5"
                    value={litros}
                    onChange={(e) => setLitros(Number(e.target.value))}
                  />
                </div>
              </div>
              <DialogFooter>
                <Button variant="outline" onClick={() => {
                  setIsEditingRecogida(false);
                  setRecogidaToEdit(null);
                }}>
                  Cancelar
                </Button>
                <Button 
                  onClick={submitEditRecogida}
                  disabled={isLoading || litros <= 0}
                  className="bg-blue-600 hover:bg-blue-700"
                >
                  {isLoading ? "Guardando..." : "Actualizar"}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
          
          {/* Alert dialog for confirming delete */}
          <AlertDialog open={showDeleteAlert} onOpenChange={setShowDeleteAlert}>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>¿Eliminar esta recolección?</AlertDialogTitle>
                <AlertDialogDescription>
                  Esta acción no se puede deshacer. La recolección será eliminada permanentemente del sistema.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel onClick={() => {
                  setShowDeleteAlert(false);
                  setRecogidaToDeleteId(null);
                }}>Cancelar</AlertDialogCancel>
                <AlertDialogAction 
                  onClick={confirmDeleteRecogida}
                  className="bg-red-600 hover:bg-red-700"
                >
                  {isLoading ? "Eliminando..." : "Eliminar"}
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      </CardHeader>
      <CardContent>
        <HistorialRecogidasTable 
          recogidasCliente={recogidasCliente} 
          direccionCliente={cliente.direccion}
          onEditRecogida={handleEditRecogida}
          onDeleteRecogida={handleDeleteRecogida}
        />
      </CardContent>
      <CardFooter className="bg-slate-50 border-t flex justify-between">
        <span className="text-sm text-muted-foreground">Los registros incluyen recogidas individuales y por ruta</span>
        <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
          <Droplet className="h-3.5 w-3.5" />
          <span>Total: {totalLitros} litros</span>
        </Badge>
      </CardFooter>
    </Card>
  );
};

export default ClienteLitrosHistory;

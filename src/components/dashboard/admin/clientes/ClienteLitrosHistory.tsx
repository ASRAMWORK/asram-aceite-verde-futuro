
import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle,
  CardFooter
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { useRecogidas } from '@/hooks/useRecogidas';
import type { Usuario } from '@/types';
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

interface ClienteLitrosHistoryProps {
  cliente: Usuario;
}

const ClienteLitrosHistory: React.FC<ClienteLitrosHistoryProps> = ({ cliente }) => {
  const { recogidas, getRecogidasByClientId, addRecogida } = useRecogidas();
  const [isAddingRecogida, setIsAddingRecogida] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [litros, setLitros] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  
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
    } catch (error) {
      console.error("Error adding historical collection:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  // Calculate total liters
  const totalLitros = recogidasCliente.reduce((sum, r) => sum + (r.litrosRecogidos || 0), 0);
  
  // Sort recogidas by date (most recent first)
  const sortedRecogidas = [...recogidasCliente].sort((a, b) => {
    const dateA = a.fecha || a.fechaRecogida;
    const dateB = b.fecha || b.fechaRecogida;
    if (!dateA) return 1;
    if (!dateB) return -1;
    return dateB.getTime() - dateA.getTime();
  });

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
                      <Calendar
                        mode="single"
                        selected={date}
                        onSelect={(date) => date && setDate(date)}
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
        </div>
      </CardHeader>
      <CardContent>
        {sortedRecogidas.length === 0 ? (
          <div className="text-center py-8 text-muted-foreground">
            No hay registros de recolección para este cliente
          </div>
        ) : (
          <Table>
            <TableCaption>Total de litros recogidos: {totalLitros} litros</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead>Origen</TableHead>
                <TableHead className="text-right">Litros</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {sortedRecogidas.map((recogida) => (
                <TableRow key={recogida.id}>
                  <TableCell>{formatDate(recogida.fecha || recogida.fechaRecogida)}</TableCell>
                  <TableCell>{recogida.direccion || recogida.direccionRecogida || cliente.direccion}</TableCell>
                  <TableCell>
                    <Badge variant="outline">
                      {recogida.esRecogidaZona ? "Ruta" : "Individual"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end">
                      <Droplet className="h-4 w-4 mr-1 text-blue-500" />
                      {recogida.litrosRecogidos || 0} L
                    </div>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
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


import React, { useState, useEffect } from 'react';
import { useRecogidas } from '@/hooks/useRecogidas';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Droplet, Calendar, Plus } from 'lucide-react';
import { format, isValid, parseISO } from 'date-fns';
import { es } from 'date-fns/locale';
import { Usuario } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Calendar as CalendarComponent } from "@/components/ui/calendar";

interface ClienteHistorialRecogidasProps {
  cliente: Usuario;
}

const ClienteHistorialRecogidas: React.FC<ClienteHistorialRecogidasProps> = ({ cliente }) => {
  const { recogidas, getRecogidasByClientId, addRecogida } = useRecogidas();
  const [clienteRecogidas, setClienteRecogidas] = useState<any[]>([]);
  const [promedioLitros30Dias, setPromedioLitros30Dias] = useState<number>(0);
  const [isAddingRecogida, setIsAddingRecogida] = useState(false);
  const [date, setDate] = useState<Date>(new Date());
  const [litros, setLitros] = useState<number>(0);
  const [isLoading, setIsLoading] = useState(false);
  
  useEffect(() => {
    // Get recogidas for this specific client
    if (cliente && cliente.id) {
      const recogidasCliente = getRecogidasByClientId(cliente.id);
      setClienteRecogidas(recogidasCliente);
      
      // Calculate average liters per 30 days
      if (recogidasCliente.length > 0) {
        // Sort recogidas by date (oldest first)
        const sortedRecogidas = [...recogidasCliente].sort((a, b) => {
          const dateA = parseDate(a.fechaRecogida || a.fecha);
          const dateB = parseDate(b.fechaRecogida || b.fecha);
          return dateA.getTime() - dateB.getTime();
        });
        
        // Get first and last date
        const firstDate = parseDate(sortedRecogidas[0].fechaRecogida || sortedRecogidas[0].fecha);
        const lastDate = parseDate(sortedRecogidas[sortedRecogidas.length - 1].fechaRecogida || 
                        sortedRecogidas[sortedRecogidas.length - 1].fecha);
        
        // Calculate total days between first and last collection
        const totalDays = Math.max(1, Math.ceil((lastDate.getTime() - firstDate.getTime()) / (1000 * 60 * 60 * 24)));
        
        // Calculate total liters
        const totalLitros = sortedRecogidas.reduce((sum, recogida) => sum + (recogida.litrosRecogidos || 0), 0);
        
        // Calculate average per 30 days
        const promedio = (totalLitros / totalDays) * 30;
        setPromedioLitros30Dias(parseFloat(promedio.toFixed(2)));
      }
    }
  }, [cliente, recogidas, getRecogidasByClientId]);
  
  // Helper function to parse dates consistently
  const parseDate = (date: Date | string | undefined) => {
    if (!date) return new Date();
    
    try {
      if (typeof date === 'string') {
        // Try to parse with parseISO first (handles ISO format strings)
        const parsedDate = parseISO(date);
        
        // If not valid, try with new Date()
        if (!isValid(parsedDate)) {
          return new Date(date);
        }
        return parsedDate;
      } else if (date instanceof Date) {
        return date;
      }
    } catch (e) {
      console.error("Error parsing date:", e);
    }
    return new Date();
  };
  
  const formatDate = (date: Date | string | undefined) => {
    if (!date) return "Sin fecha";
    
    try {
      // Use our helper function to get a Date object
      const dateObj = parseDate(date);
      
      // Check if the date is valid before formatting
      if (!isValid(dateObj)) {
        return "Fecha inválida";
      }
      
      return format(dateObj, "dd/MM/yyyy", { locale: es });
    } catch (e) {
      console.error("Error formatting date:", e);
      return "Error en formato de fecha";
    }
  };
  
  // Calculate total liters
  const totalLitros = clienteRecogidas.reduce((sum, recogida) => {
    return sum + (recogida.litrosRecogidos || 0);
  }, 0);
  
  // Handle adding a historical collection
  const handleAddHistoricalCollection = async () => {
    if (!cliente.id) {
      console.error("Cliente ID is missing");
      return;
    }
    
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
      toast({
        title: "Recolección histórica añadida",
        description: `Se añadieron ${litros} litros al historial de ${cliente.nombre}`,
      });
    } catch (error) {
      console.error("Error adding historical collection:", error);
      toast({
        title: "Error",
        description: "No se pudo añadir la recolección histórica",
        variant: "destructive",
      });
    } finally {
      setIsLoading(false);
    }
  };
  
  return (
    <Card className="mt-4">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div>
            <CardTitle>Historial de recogidas</CardTitle>
            <CardDescription>
              {clienteRecogidas.length 
                ? `${clienteRecogidas.length} recogidas registradas` 
                : "Este cliente no tiene recogidas registradas"}
            </CardDescription>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex flex-col items-end gap-2">
              <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200 flex items-center gap-1">
                <Droplet className="h-3.5 w-3.5" />
                <span>Total: {totalLitros} litros</span>
              </Badge>
              {promedioLitros30Dias > 0 && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 flex items-center gap-1">
                  <Calendar className="h-3.5 w-3.5" />
                  <span>Media: {promedioLitros30Dias} L/30 días</span>
                </Badge>
              )}
            </div>
            
            <Dialog open={isAddingRecogida} onOpenChange={setIsAddingRecogida}>
              <DialogTrigger asChild>
                <Button className="bg-[#EE970D] hover:bg-[#d88400]">
                  <Plus className="mr-2 h-4 w-4" />
                  Añadir recolección
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
        </div>
      </CardHeader>
      <CardContent>
        {clienteRecogidas.length > 0 ? (
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Fecha</TableHead>
                <TableHead>Dirección</TableHead>
                <TableHead className="text-right">Litros</TableHead>
                <TableHead className="text-right">Estado</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {clienteRecogidas.map((recogida) => (
                <TableRow key={recogida.id}>
                  <TableCell>{formatDate(recogida.fechaRecogida || recogida.fecha)}</TableCell>
                  <TableCell>{recogida.direccionRecogida || recogida.direccion || cliente.direccion}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-1">
                      <Droplet className="h-4 w-4 text-blue-500" />
                      {recogida.litrosRecogidos || 0}L
                    </div>
                  </TableCell>
                  <TableCell className="text-right">
                    <Badge 
                      variant={recogida.completada || recogida.estadoRecogida === "completada" ? "default" : "outline"}
                      className={recogida.completada || recogida.estadoRecogida === "completada" ? "bg-green-500 hover:bg-green-600" : ""}
                    >
                      {recogida.completada || recogida.estadoRecogida === "completada" ? "Completada" : "Pendiente"}
                    </Badge>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        ) : (
          <div className="text-center py-8 text-muted-foreground">
            No hay recogidas registradas para este cliente
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ClienteHistorialRecogidas;


import React, { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Package, Clock, TrendingUp, LayoutList } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, isValid } from 'date-fns';
import { toast } from 'sonner';
import { useRecogidas } from '@/hooks/useRecogidas';
import { useRutas } from '@/hooks/useRutas';
import RecogidasList from './RecogidasList';
import RecogidaForm from './RecogidaForm';
import { 
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription
} from '@/components/ui/dialog';
import {
  Select, SelectContent, SelectItem, SelectTrigger, SelectValue
} from '@/components/ui/select';
import { StatsCard } from './stats/StatsCard';
import { es } from 'date-fns/locale';
import { Table, TableBody, TableCaption, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';
import { ScrollArea } from '@/components/ui/scroll-area';

const GestionRecogidas = () => {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('pendientes');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedRecogida, setSelectedRecogida] = useState<string | null>(null);
  const [showHistorialRutas, setShowHistorialRutas] = useState(false);
  const [selectedRuta, setSelectedRuta] = useState<string | null>(null);
  const [litrosCompletados, setLitrosCompletados] = useState<number>(0);
  const [showCompletarDialog, setShowCompletarDialog] = useState(false);
  
  const { recogidas, addRecogida, completeRecogida, getTotalLitrosRecogidos, calcularPromedioLitrosPorPeriodo } = useRecogidas();
  const { rutas, completeRuta } = useRutas();
  
  // Safe date formatting helper function
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "N/A";
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      if (!dateObj || !isValid(dateObj)) return "N/A";
      return format(dateObj, 'dd/MM/yyyy');
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };
  
  const handleCompleteRecogida = async (id: string) => {
    setSelectedRecogida(id);
    setShowCompletarDialog(true);
  };
  
  const confirmCompletarRecogida = async () => {
    if (selectedRecogida) {
      await completeRecogida(selectedRecogida, litrosCompletados);
      toast.success('Recogida completada correctamente');
      setSelectedRecogida(null);
      setLitrosCompletados(0);
      setShowCompletarDialog(false);
    }
  };

  // Obtener recogidas basadas en filtros
  const filteredRecogidas = selectedMonth 
    ? recogidas.filter(r => {
        if (!r.fecha) return false;
        const fecha = new Date(r.fecha);
        return (
          fecha.getMonth() === parseInt(selectedMonth) - 1 && 
          fecha.getFullYear() === parseInt(selectedYear)
        );
      })
    : recogidas;

  // Manejar envío de formulario para nuevas recogidas
  const handleAddRecogida = async (data: any) => {
    try {
      if (data.esRecogidaZona) {
        // Crear una recogida por zona (ruta)
        const rutaSeleccionada = rutas.find(r => r.id === data.rutaId);
        if (!rutaSeleccionada) {
          toast.error('Ruta no encontrada');
          return;
        }
        
        // Crear una recogida por cada cliente en la ruta
        const promesas = data.clientesRuta.map((cliente: any) => {
          return addRecogida({
            fechaRecogida: data.fecha,
            clienteId: cliente.id,
            cliente: cliente.nombre,
            direccionRecogida: cliente.direccion,
            horaRecogida: data.hora,
            litrosEstimados: cliente.litrosEstimados || 0,
            estadoRecogida: 'pendiente',
            rutaId: data.rutaId,
            esRecogidaZona: true,
            distrito: rutaSeleccionada.distrito,
            barrio: cliente.barrio,
            nombreContacto: cliente.nombre,
            telefonoContacto: cliente.telefono || '',
            direccion: cliente.direccion
          });
        });
        
        await Promise.all(promesas);
        toast.success(`Recogida por zona programada para ${rutaSeleccionada.distrito}`);
      } else {
        // Recogida individual normal
        await addRecogida({
          ...data,
          direccion: data.direccion,
          cliente: data.nombreContacto,
          distrito: data.distrito || 'Sin asignar',
          barrio: data.barrio || 'Sin asignar',
          estado: 'pendiente'
        });
      }
      
      setShowForm(false);
    } catch (error) {
      console.error('Error al crear recogida:', error);
      toast.error('Error al programar la recogida');
    }
  };

  // Obtener detalles de la recogida seleccionada
  const recogidaDetails = selectedRecogida 
    ? recogidas.find(r => r.id === selectedRecogida)
    : null;

  // Obtener rutas completadas
  const rutasCompletadas = rutas.filter(r => r.completada);
  
  // Obtener recogidas por ruta
  const getRecogidasPorRuta = (rutaId: string) => {
    return recogidas.filter(r => r.rutaId === rutaId);
  };
  
  // Calcular total de litros por ruta
  const calcularTotalLitrosRuta = (rutaId: string) => {
    const recogidasRuta = recogidas.filter(r => r.rutaId === rutaId);
    return recogidasRuta.reduce((total, recogida) => total + (recogida.litrosRecogidos || 0), 0);
  };

  // Stats calculation
  const promedioLitrosMes = calcularPromedioLitrosPorPeriodo();
  const totalLitros = getTotalLitrosRecogidos();
  const totalRecogidas = recogidas.length;
  const recogidasPendientes = recogidas.filter(r => !r.completada).length;

  const months = [
    { value: '1', label: 'Enero' },
    { value: '2', label: 'Febrero' },
    { value: '3', label: 'Marzo' },
    { value: '4', label: 'Abril' },
    { value: '5', label: 'Mayo' },
    { value: '6', label: 'Junio' },
    { value: '7', label: 'Julio' },
    { value: '8', label: 'Agosto' },
    { value: '9', label: 'Septiembre' },
    { value: '10', label: 'Octubre' },
    { value: '11', label: 'Noviembre' },
    { value: '12', label: 'Diciembre' },
  ];

  // Generate year options (last 5 years through next year)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: 6 }, (_, i) => (currentYear - 4 + i).toString());

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Gestión de Recogidas</h2>
          <p className="text-muted-foreground">
            Administra las recogidas de aceite programadas
          </p>
        </div>
        <div className="flex space-x-2">
          <Button onClick={() => setShowHistorialRutas(true)} variant="outline">
            <LayoutList className="mr-2 h-4 w-4" /> Historial de Rutas
          </Button>
          <Button onClick={() => setShowForm(true)} className="bg-[#ee970d] hover:bg-[#e08500]">
            <Plus className="mr-2 h-4 w-4" /> Nueva Recogida
          </Button>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        <StatsCard 
          title="Total Recogidas"
          value={totalRecogidas}
          icon={Package}
          className="bg-card"
        />
        <StatsCard 
          title="Litros Totales"
          value={totalLitros}
          suffix="L"
          icon={TrendingUp}
          className="bg-card"
        />
        <StatsCard 
          title="Pendientes"
          value={recogidasPendientes}
          icon={Clock}
          className="bg-card"
        />
      </div>

      {/* Formulario de nueva recogida */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[550px]">
          <DialogHeader>
            <DialogTitle>Nueva recogida</DialogTitle>
            <DialogDescription>
              Programar una nueva recogida de aceite usado
            </DialogDescription>
          </DialogHeader>
          <RecogidaForm 
            onCancel={() => setShowForm(false)} 
            onSubmit={handleAddRecogida}
          />
        </DialogContent>
      </Dialog>

      {/* Historial de Rutas */}
      <Dialog open={showHistorialRutas} onOpenChange={setShowHistorialRutas}>
        <DialogContent className="sm:max-w-[700px] h-[600px]">
          <DialogHeader>
            <DialogTitle>Historial de Rutas</DialogTitle>
            <DialogDescription>
              Rutas completadas y sus recogidas asociadas
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[500px] pr-4">
            {rutasCompletadas.length > 0 ? (
              <div className="space-y-6">
                {rutasCompletadas.map(ruta => (
                  <Card key={ruta.id} className="border-l-4 border-l-green-500">
                    <CardHeader>
                      <div className="flex justify-between items-center">
                        <CardTitle>{ruta.nombre || `Ruta ${ruta.distrito}`}</CardTitle>
                        <Badge>{formatDate(ruta.fecha)}</Badge>
                      </div>
                      <CardDescription>
                        {ruta.completada ? 'Completada' : 'Pendiente'} • {ruta.clientes?.length || 0} clientes • {ruta.litrosTotales || 0}L recogidos
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Cliente</TableHead>
                            <TableHead>Dirección</TableHead>
                            <TableHead className="text-right">Litros</TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {ruta.clientes && ruta.clientes.map((cliente: any, idx: number) => (
                            <TableRow key={cliente.id || idx}>
                              <TableCell>{cliente.nombre}</TableCell>
                              <TableCell>{cliente.direccion}</TableCell>
                              <TableCell className="text-right">{cliente.litros || 0}L</TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                        <tfoot>
                          <tr>
                            <td colSpan={2} className="text-right font-medium py-2">Total:</td>
                            <td className="text-right font-bold py-2">{ruta.litrosTotales || 0}L</td>
                          </tr>
                        </tfoot>
                      </Table>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                No hay rutas completadas en el historial
              </div>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Dialog para completar recogida */}
      <AlertDialog open={showCompletarDialog} onOpenChange={setShowCompletarDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Completar recogida</AlertDialogTitle>
            <AlertDialogDescription>
              Introduce la cantidad de litros recogidos para completar esta recogida
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4">
            <div className="space-y-2">
              <Label htmlFor="litros">Litros recogidos</Label>
              <Input 
                id="litros" 
                type="number" 
                min="0" 
                step="0.1"
                value={litrosCompletados}
                onChange={e => setLitrosCompletados(Number(e.target.value))}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowCompletarDialog(false);
              setSelectedRecogida(null);
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmCompletarRecogida}>
              Completar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Output for debugging */}
      {process.env.NODE_ENV === 'development' && (
        <div className="text-xs opacity-50">
          <p>Selected Month: {selectedMonth}</p>
          <p>Selected Year: {selectedYear}</p>
          <p>Total Recogidas: {recogidas.length}</p>
          <p>Filtered Recogidas: {filteredRecogidas.length}</p>
        </div>
      )}
    </div>
  );
};

export default GestionRecogidas;

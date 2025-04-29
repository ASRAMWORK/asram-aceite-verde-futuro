
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
            litrosEstimados: cliente.litrosEstimados,
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
          title="Litros Totales Recogidos"
          value={totalLitros}
          icon={TrendingUp}
          className="bg-card"
        />
        <StatsCard 
          title="Media Litros/Mes"
          value={promedioLitrosMes.toFixed(2)}
          icon={Clock}
          description="Litros promedio por mes"
          className="bg-card"
        />
      </div>

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nueva Recogida</CardTitle>
            <CardDescription>Registra una nueva recogida de aceite</CardDescription>
          </CardHeader>
          <CardContent>
            <RecogidaForm onCancel={() => setShowForm(false)} onSubmit={handleAddRecogida} />
          </CardContent>
        </Card>
      )}

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <Filter className="h-4 w-4" />
          <span className="text-sm font-medium">Filtrar por mes:</span>
        </div>
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Todos los meses" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">Todos los meses</SelectItem>
            {months.map((month) => (
              <SelectItem key={month.value} value={month.value}>{month.label}</SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={selectedYear} onValueChange={setSelectedYear}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Tabs defaultValue="pendientes" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
          <TabsTrigger value="completadas">Completadas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="pendientes">
          <Card>
            <CardContent className="pt-6">
              <RecogidasList 
                recogidas={filteredRecogidas.filter(r => !r.completada)}
                onCompleteRecogida={handleCompleteRecogida}
                showActions={true}
                formatDate={formatDate}
                onViewDetails={(id) => setSelectedRecogida(id)}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completadas">
          <Card>
            <CardContent className="pt-6">
              <RecogidasList 
                recogidas={filteredRecogidas.filter(r => r.completada)}
                showActions={false}
                formatDate={formatDate}
                onViewDetails={(id) => setSelectedRecogida(id)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Historial de Rutas Dialog */}
      <Dialog open={showHistorialRutas} onOpenChange={setShowHistorialRutas}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Historial de Rutas</DialogTitle>
            <DialogDescription>
              Historial de rutas completadas
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Distrito</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Puntos</TableHead>
                  <TableHead>Litros</TableHead>
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rutasCompletadas.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={6} className="text-center">No hay rutas completadas</TableCell>
                  </TableRow>
                ) : (
                  rutasCompletadas.map(ruta => (
                    <TableRow key={ruta.id}>
                      <TableCell>{ruta.nombre}</TableCell>
                      <TableCell>{ruta.distrito}</TableCell>
                      <TableCell>{formatDate(ruta.fecha)}</TableCell>
                      <TableCell>{ruta.puntosRecogida}</TableCell>
                      <TableCell>{calcularTotalLitrosRuta(ruta.id)} L</TableCell>
                      <TableCell>
                        <Button 
                          variant="outline" 
                          size="sm" 
                          onClick={() => setSelectedRuta(ruta.id)}
                        >
                          Ver Detalle
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Detalle de Ruta Dialog */}
      <Dialog open={!!selectedRuta} onOpenChange={(open) => !open && setSelectedRuta(null)}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Detalle de Ruta</DialogTitle>
            <DialogDescription>
              Recogidas asociadas a esta ruta
            </DialogDescription>
          </DialogHeader>

          <ScrollArea className="h-[500px]">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Cliente</TableHead>
                  <TableHead>Dirección</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Litros</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {selectedRuta && getRecogidasPorRuta(selectedRuta).map(recogida => (
                  <TableRow key={recogida.id}>
                    <TableCell>{recogida.cliente || recogida.nombreContacto}</TableCell>
                    <TableCell>{recogida.direccion || recogida.direccionRecogida}</TableCell>
                    <TableCell>{formatDate(recogida.fecha)}</TableCell>
                    <TableCell>{recogida.litrosRecogidos || 0} L</TableCell>
                  </TableRow>
                ))}
              </TableBody>
              <TableFooter>
                <TableRow>
                  <TableCell colSpan={3} className="text-right font-bold">Total Litros:</TableCell>
                  <TableCell className="font-bold">
                    {selectedRuta && calcularTotalLitrosRuta(selectedRuta)} L
                  </TableCell>
                </TableRow>
              </TableFooter>
            </Table>
          </ScrollArea>
        </DialogContent>
      </Dialog>

      {/* Recogida Details Dialog */}
      <Dialog open={!!selectedRecogida && !showCompletarDialog} onOpenChange={(open) => !open && setSelectedRecogida(null)}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>Detalles de Recogida</DialogTitle>
            <DialogDescription>
              Información detallada de la recogida seleccionada
            </DialogDescription>
          </DialogHeader>

          {recogidaDetails && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">Cliente</h3>
                  <p>{recogidaDetails.cliente || recogidaDetails.nombreContacto || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">Fecha</h3>
                  <p>{formatDate(recogidaDetails.fecha)}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">Dirección</h3>
                  <p>{recogidaDetails.direccion || recogidaDetails.direccionRecogida || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">Estado</h3>
                  <p>{recogidaDetails.completada ? 'Completada' : 'Pendiente'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">Distrito</h3>
                  <p>{recogidaDetails.distrito || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">Barrio</h3>
                  <p>{recogidaDetails.barrio || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">Contacto</h3>
                  <p>{recogidaDetails.telefonoContacto || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">Email</h3>
                  <p>{recogidaDetails.emailContacto || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">Litros Recogidos</h3>
                  <p>{recogidaDetails.litrosRecogidos || 'No completada'}</p>
                </div>
                {recogidaDetails.rutaId && (
                  <div>
                    <h3 className="font-semibold text-sm text-gray-500">Ruta</h3>
                    <Badge>Recogida por zona</Badge>
                  </div>
                )}
              </div>

              {recogidaDetails.notasAdicionales && (
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">Notas adicionales</h3>
                  <p>{recogidaDetails.notasAdicionales}</p>
                </div>
              )}

              {recogidaDetails.completada && recogidaDetails.fechaCompletada && (
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">Fecha de completado</h3>
                  <p>{formatDate(recogidaDetails.fechaCompletada)}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Completar Recogida Dialog */}
      <AlertDialog open={showCompletarDialog} onOpenChange={setShowCompletarDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Completar Recogida</AlertDialogTitle>
            <AlertDialogDescription>
              Introduce los litros recogidos y confirma para completar esta recogida.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <div className="py-4">
            <Label htmlFor="litrosRecogidos" className="text-sm font-medium">
              Litros Recogidos
            </Label>
            <Input
              id="litrosRecogidos"
              type="number"
              min="0"
              value={litrosCompletados}
              onChange={(e) => setLitrosCompletados(Number(e.target.value))}
              className="mt-1"
            />
          </div>
          
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => {
              setShowCompletarDialog(false);
              setSelectedRecogida(null);
              setLitrosCompletados(0);
            }}>
              Cancelar
            </AlertDialogCancel>
            <AlertDialogAction onClick={confirmCompletarRecogida}>
              Completar
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default GestionRecogidas;


import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  Plus, Filter, Package, Clock, TrendingUp, 
  LayoutList, Trash2, Pencil, Droplet, List, 
  CalendarDays, Search 
} from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, isValid } from 'date-fns';
import { toast } from 'sonner';
import { useRecogidas } from '@/hooks/useRecogidas';
import { useRutas } from '@/hooks/useRutas';
import { useClientes } from '@/hooks/useClientes';
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
import { useDebounce } from '@/hooks/useDebounce';

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
  const [searchTerm, setSearchTerm] = useState("");
  const [clientesRuta, setClientesRuta] = useState<any[]>([]);
  const [showRutaPendiente, setShowRutaPendiente] = useState(false);
  
  const { recogidas, addRecogida, completeRecogida, getTotalLitrosRecogidos, calcularPromedioLitrosPorPeriodo } = useRecogidas();
  const { rutas, completeRuta } = useRutas();
  const { clientes } = useClientes();
  
  const debouncedSearch = useDebounce(searchTerm, 300);
  
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

  // Filter recogidas based on search
  const searchFilteredRecogidas = debouncedSearch 
    ? filteredRecogidas.filter(r => 
        r.cliente?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        r.direccionRecogida?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        r.direccion?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
        r.distrito?.toLowerCase().includes(debouncedSearch.toLowerCase())
      )
    : filteredRecogidas;

  // Manejar envío de formulario para nuevas recogidas
  const handleAddRecogida = async (data: any) => {
    try {
      if (data.esRecogidaZona) {
        // Crear una recogida por zona (ruta)
        const rutaClientes = data.clientesRuta || [];
        if (rutaClientes.length === 0) {
          toast.error('No hay clientes seleccionados para la ruta');
          return;
        }
        
        // Crear una recogida por cada cliente en la ruta
        const promesas = rutaClientes.map((cliente: any) => {
          return addRecogida({
            fechaRecogida: data.fechaRecogida || data.fecha,
            clienteId: cliente.id,
            cliente: cliente.nombre,
            direccionRecogida: cliente.direccion,
            horaRecogida: data.horaRecogida || data.hora,
            cantidadAproximada: cliente.litrosEstimados || 0,
            estadoRecogida: 'pendiente',
            esRecogidaZona: true,
            distrito: cliente.distrito,
            barrio: cliente.barrio,
            nombreContacto: cliente.nombre,
            telefonoContacto: cliente.telefono || '',
            direccion: cliente.direccion
          });
        });
        
        await Promise.all(promesas);
        toast.success(`Recogida programada para ${rutaClientes.length} clientes`);
      } else {
        // Recogida individual normal
        await addRecogida({
          ...data,
          direccion: data.direccionRecogida,
          cliente: data.nombreContacto,
          distrito: data.distrito || 'Sin asignar',
          barrio: data.barrio || 'Sin asignar',
          estado: 'pendiente'
        });
        toast.success('Recogida programada correctamente');
      }
      
      setShowForm(false);
      setShowRutaPendiente(false);
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

  // Handle client selection for route
  const handleAddClienteRuta = (cliente: any) => {
    if (!clientesRuta.some(c => c.id === cliente.id)) {
      setClientesRuta([...clientesRuta, {
        ...cliente,
        litrosEstimados: 0,
        litrosRecogidos: 0
      }]);
    }
  };

  const handleRemoveClienteRuta = (clienteId: string) => {
    setClientesRuta(clientesRuta.filter(c => c.id !== clienteId));
  };

  const handleGuardarLitros = (clienteId: string, litros: number) => {
    setClientesRuta(clientesRuta.map(cliente => 
      cliente.id === clienteId ? { ...cliente, litrosRecogidos: litros } : cliente
    ));
    toast.success("Litros actualizados");
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
          <Button onClick={() => setShowRutaPendiente(true)} variant="outline">
            <List className="mr-2 h-4 w-4" /> Ruta Personalizada
          </Button>
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
        <DialogContent className="sm:max-w-[700px]">
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

      {/* Dialog para ruta personalizada */}
      <Dialog open={showRutaPendiente} onOpenChange={setShowRutaPendiente}>
        <DialogContent className="sm:max-w-[750px] h-[650px]">
          <DialogHeader>
            <DialogTitle>Ruta de Recogida Personalizada</DialogTitle>
            <DialogDescription>
              Selecciona los clientes para crear una ruta personalizada
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid grid-cols-1 gap-4">
            <div className="flex gap-4 items-end">
              <div className="flex-1">
                <Label htmlFor="search-clientes">Buscar clientes</Label>
                <Input 
                  id="search-clientes"
                  placeholder="Nombre, dirección..." 
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>
              
              <div className="w-[200px]">
                <Label htmlFor="fecha-ruta">Fecha de recogida</Label>
                <Input 
                  id="fecha-ruta"
                  type="date" 
                  defaultValue={format(new Date(), 'yyyy-MM-dd')}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <Card className="h-[200px] overflow-auto">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Clientes disponibles</CardTitle>
                </CardHeader>
                <CardContent className="p-0 px-4 pb-4">
                  <div className="max-h-[130px] overflow-auto">
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Cliente</TableHead>
                          <TableHead>Distrito</TableHead>
                          <TableHead></TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {clientes
                          .filter(c => 
                            !debouncedSearch || 
                            c.nombre?.toLowerCase().includes(debouncedSearch.toLowerCase()) ||
                            c.direccion?.toLowerCase().includes(debouncedSearch.toLowerCase())
                          )
                          .filter(c => !clientesRuta.some(rc => rc.id === c.id))
                          .slice(0, 10)
                          .map(cliente => (
                            <TableRow key={cliente.id}>
                              <TableCell className="py-1">{cliente.nombre}</TableCell>
                              <TableCell className="py-1">{cliente.distrito || 'N/A'}</TableCell>
                              <TableCell className="py-1 text-right">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  onClick={() => handleAddClienteRuta(cliente)}
                                >
                                  <Plus className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))
                        }
                      </TableBody>
                    </Table>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="h-[200px] overflow-auto">
                <CardHeader className="p-4 pb-2">
                  <CardTitle className="text-base">Ruta actual</CardTitle>
                </CardHeader>
                <CardContent className="p-0 px-4 pb-4">
                  <div className="max-h-[130px] overflow-auto">
                    {clientesRuta.length > 0 ? (
                      <Table>
                        <TableHeader>
                          <TableRow>
                            <TableHead>Cliente</TableHead>
                            <TableHead></TableHead>
                          </TableRow>
                        </TableHeader>
                        <TableBody>
                          {clientesRuta.map(cliente => (
                            <TableRow key={cliente.id}>
                              <TableCell className="py-1">{cliente.nombre}</TableCell>
                              <TableCell className="py-1 text-right">
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleRemoveClienteRuta(cliente.id)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              </TableCell>
                            </TableRow>
                          ))}
                        </TableBody>
                      </Table>
                    ) : (
                      <div className="flex items-center justify-center h-[100px] text-center text-muted-foreground">
                        No hay clientes seleccionados
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <ScrollArea className="h-[250px] border rounded">
              <div className="p-4">
                <h3 className="font-medium mb-4">Clientes en la ruta ({clientesRuta.length})</h3>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Cliente</TableHead>
                      <TableHead>Dirección</TableHead>
                      <TableHead>Litros estimados</TableHead>
                      <TableHead>Litros recogidos</TableHead>
                      <TableHead></TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {clientesRuta.map(cliente => (
                      <TableRow key={cliente.id}>
                        <TableCell>{cliente.nombre}</TableCell>
                        <TableCell>{cliente.direccion}</TableCell>
                        <TableCell>
                          <Input
                            type="number"
                            min={0}
                            value={cliente.litrosEstimados || 0}
                            onChange={(e) => {
                              const updatedClientes = clientesRuta.map(c => 
                                c.id === cliente.id ? { ...c, litrosEstimados: Number(e.target.value) } : c
                              );
                              setClientesRuta(updatedClientes);
                            }}
                            className="w-[80px]"
                          />
                        </TableCell>
                        <TableCell>
                          <div className="flex gap-2 items-center">
                            <Input
                              type="number"
                              min={0}
                              value={cliente.litrosRecogidos || 0}
                              onChange={(e) => {
                                const updatedClientes = clientesRuta.map(c => 
                                  c.id === cliente.id ? { ...c, litrosRecogidos: Number(e.target.value) } : c
                                );
                                setClientesRuta(updatedClientes);
                              }}
                              className="w-[80px]"
                            />
                            <Button 
                              size="sm" 
                              variant="outline"
                              onClick={() => handleGuardarLitros(cliente.id, cliente.litrosRecogidos || 0)}
                            >
                              <Droplet className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            className="text-red-500 hover:text-red-700"
                            onClick={() => handleRemoveClienteRuta(cliente.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </ScrollArea>
            
            <div className="flex justify-end space-x-2">
              <Button variant="outline" onClick={() => setShowRutaPendiente(false)}>
                Cancelar
              </Button>
              <Button 
                onClick={() => {
                  if (clientesRuta.length === 0) {
                    toast.error("No hay clientes seleccionados para la ruta");
                    return;
                  }
                  handleAddRecogida({
                    fechaRecogida: new Date(),
                    horaRecogida: "10:00",
                    esRecogidaZona: true,
                    clientesRuta
                  });
                }}
                disabled={clientesRuta.length === 0}
              >
                Guardar Ruta
              </Button>
            </div>
          </div>
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

      {/* Filtros y búsqueda */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <div className="flex items-center space-x-2">
          <Search className="h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Buscar cliente o dirección..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="flex-1"
          />
        </div>
        
        <Select value={selectedMonth} onValueChange={setSelectedMonth}>
          <SelectTrigger className="w-full">
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
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Año" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>{year}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <div className="md:text-right">
          <Badge variant="outline" className="px-3 py-1">
            {searchFilteredRecogidas.length} resultados
          </Badge>
        </div>
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
                recogidas={searchFilteredRecogidas.filter(r => !r.completada)}
                onCompleteRecogida={handleCompleteRecogida}
                onViewDetails={(id) => setSelectedRecogida(id)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completadas">
          <Card>
            <CardContent className="pt-6">
              <RecogidasList 
                recogidas={searchFilteredRecogidas.filter(r => r.completada)}
                onViewDetails={(id) => setSelectedRecogida(id)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GestionRecogidas;

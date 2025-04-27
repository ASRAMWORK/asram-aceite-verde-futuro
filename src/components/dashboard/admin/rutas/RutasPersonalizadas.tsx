import React, { useState, useEffect } from 'react';
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
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { usePuntosVerdes } from "@/hooks/usePuntosVerdes";
import { useRutas } from "@/hooks/useRutas";
import { PuntoVerde } from "@/types";
import { Check, Droplet, ListChecks, MapPin, Plus, Route, Save, Search } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';

type RutaPersonalizada = {
  id?: string;
  nombre: string;
  fecha: Date;
  puntosVerdes: PuntosVerdeRuta[];
  completada: boolean;
  litrosTotales: number;
};

type PuntosVerdeRuta = PuntoVerde & {
  litrosRecogidos?: number;
};

const RutasPersonalizadas = () => {
  const { puntosVerdes, loading: loadingPuntos } = usePuntosVerdes();
  const { rutas, addRuta, updateRuta, completeRuta } = useRutas();
  
  const [isOpen, setIsOpen] = useState(false);
  const [currentTab, setCurrentTab] = useState('pendientes');
  const [puntosSeleccionados, setPuntosSeleccionados] = useState<PuntosVerdeRuta[]>([]);
  const [distritoFiltro, setDistritoFiltro] = useState<string>("");
  const [barrioFiltro, setBarrioFiltro] = useState<string>("");
  const [nombreRuta, setNombreRuta] = useState<string>("");
  const [fechaRecogida, setFechaRecogida] = useState<string>(format(new Date(), "yyyy-MM-dd"));
  const [rutaActual, setRutaActual] = useState<RutaPersonalizada | null>(null);
  const [isCompletingRuta, setIsCompletingRuta] = useState(false);

  const rutasPendientes = rutas.filter(r => !r.completada);
  const rutasCompletadas = rutas.filter(r => r.completada);
  
  const rutasMostradas = currentTab === 'pendientes' ? rutasPendientes : rutasCompletadas;
  
  const distritos = Array.from(new Set(puntosVerdes.map(p => p.distrito))).sort();
  const barrios = distritoFiltro 
    ? Array.from(new Set(puntosVerdes
        .filter(p => p.distrito === distritoFiltro)
        .map(p => p.barrio))).sort()
    : [];
  
  const puntosFiltrados = puntosVerdes.filter(p => 
    (!distritoFiltro || p.distrito === distritoFiltro) &&
    (!barrioFiltro || p.barrio === barrioFiltro)
  );
  
  const handleSeleccionarPunto = (punto: PuntoVerde) => {
    const yaSeleccionado = puntosSeleccionados.some(p => p.id === punto.id);
    if (yaSeleccionado) {
      setPuntosSeleccionados(puntosSeleccionados.filter(p => p.id !== punto.id));
    } else {
      setPuntosSeleccionados([...puntosSeleccionados, { ...punto, litrosRecogidos: 0 }]);
    }
  };
  
  const handleCrearRuta = async () => {
    if (!nombreRuta) {
      toast.error('Debe asignar un nombre a la ruta');
      return;
    }
    
    if (puntosSeleccionados.length === 0) {
      toast.error('Debe seleccionar al menos un punto verde');
      return;
    }
    
    const nuevaRuta = {
      nombre: nombreRuta,
      distrito: puntosSeleccionados[0]?.distrito || 'Varios',
      barrios: Array.from(new Set(puntosSeleccionados.map(p => p.barrio))),
      fecha: new Date(fechaRecogida),
      clientes: puntosSeleccionados.map(p => ({
        id: p.id,
        nombre: `${p.direccion} (${p.barrio})`,
        direccion: p.direccion,
        litros: 0
      })),
      puntosRecogida: puntosSeleccionados.length,
      distanciaTotal: 0,
      tiempoEstimado: 0,
      frecuencia: 'unica',
      createdAt: new Date()
    };
    
    await addRuta(nuevaRuta);
    setIsOpen(false);
    setNombreRuta("");
    setFechaRecogida(format(new Date(), "yyyy-MM-dd"));
    setPuntosSeleccionados([]);
    toast.success('Ruta creada correctamente');
  };
  
  const handleEditarLitros = (rutaId: string) => {
    const ruta = rutas.find(r => r.id === rutaId);
    if (ruta) {
      const puntosConLitros = ruta.clientes?.map(cliente => {
        const punto = puntosVerdes.find(p => p.id === cliente.id);
        return punto ? {
          ...punto,
          litrosRecogidos: cliente.litros || 0
        } : null;
      }).filter(Boolean) as PuntosVerdeRuta[];
      
      setRutaActual({
        id: ruta.id,
        nombre: ruta.nombre,
        fecha: ruta.fecha ? new Date(ruta.fecha) : new Date(),
        puntosVerdes: puntosConLitros,
        completada: ruta.completada || false,
        litrosTotales: ruta.litrosTotales || 0
      });
      setIsCompletingRuta(true);
    }
  };
  
  const handleActualizarLitros = (puntoId: string, litros: number) => {
    if (!rutaActual) return;
    
    const puntosActualizados = rutaActual.puntosVerdes.map(p => 
      p.id === puntoId ? { ...p, litrosRecogidos: litros } : p
    );
    
    setRutaActual({
      ...rutaActual,
      puntosVerdes: puntosActualizados,
      litrosTotales: puntosActualizados.reduce((sum, p) => sum + (p.litrosRecogidos || 0), 0)
    });
  };
  
  const handleFinalizarRuta = async () => {
    if (!rutaActual || !rutaActual.id) return;
    
    for (const punto of rutaActual.puntosVerdes) {
      if (punto.id && punto.litrosRecogidos) {
        await updateRuta(rutaActual.id, {
          clientes: rutaActual.puntosVerdes.map(p => ({
            id: p.id,
            nombre: `${p.direccion} (${p.barrio})`,
            direccion: p.direccion,
            litros: p.litrosRecogidos || 0
          }))
        });
      }
    }
    
    await completeRuta(rutaActual.id, rutaActual.litrosTotales);
    
    setIsCompletingRuta(false);
    setRutaActual(null);
    toast.success('Ruta completada correctamente');
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Rutas Personalizadas</h2>
          <p className="text-muted-foreground">
            Crea y gestiona rutas personalizadas para los puntos verdes
          </p>
        </div>
        
        <Button className="bg-[#ee970d] hover:bg-[#e08500] text-white" onClick={() => setIsOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Crear Ruta
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rutas Pendientes
            </CardTitle>
            <Route className="h-4 w-4 text-[#ee970d]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rutasPendientes.length}</div>
            <p className="text-xs text-muted-foreground">
              rutas pendientes de realizar
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Rutas Completadas
            </CardTitle>
            <ListChecks className="h-4 w-4 text-[#ee970d]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{rutasCompletadas.length}</div>
            <p className="text-xs text-muted-foreground">
              rutas finalizadas
            </p>
          </CardContent>
        </Card>
        
        <Card className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">
              Litros Recogidos
            </CardTitle>
            <Droplet className="h-4 w-4 text-[#ee970d]" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {rutasCompletadas.reduce((sum, ruta) => sum + (ruta.litrosTotales || 0), 0)}L
            </div>
            <p className="text-xs text-muted-foreground">
              litros totales recolectados
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="space-y-4">
          <CardTitle>Listado de Rutas</CardTitle>
          <CardDescription>
            Gestiona tus rutas personalizadas para puntos verdes
          </CardDescription>
          
          <Tabs value={currentTab} onValueChange={setCurrentTab}>
            <TabsList>
              <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
              <TabsTrigger value="completadas">Completadas</TabsTrigger>
            </TabsList>
          </Tabs>
        </CardHeader>
        <CardContent>
          {loadingPuntos ? (
            <div className="flex items-center justify-center py-10">
              <p>Cargando rutas...</p>
            </div>
          ) : rutasMostradas.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-muted-foreground">No hay rutas {currentTab === 'pendientes' ? 'pendientes' : 'completadas'}</p>
              {currentTab === 'pendientes' && (
                <Button 
                  className="mt-4 bg-[#ee970d] hover:bg-[#e08500] text-white" 
                  onClick={() => setIsOpen(true)}
                >
                  <Plus className="mr-2 h-4 w-4" />
                  Crear Ruta
                </Button>
              )}
            </div>
          ) : (
            <Table>
              <TableHeader className="bg-slate-50">
                <TableRow>
                  <TableHead>Nombre</TableHead>
                  <TableHead>Fecha</TableHead>
                  <TableHead>Puntos Verdes</TableHead>
                  {currentTab === 'completadas' && <TableHead>Litros</TableHead>}
                  <TableHead>Acciones</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {rutasMostradas.map((ruta) => (
                  <TableRow key={ruta.id}>
                    <TableCell className="font-medium">{ruta.nombre}</TableCell>
                    <TableCell>{ruta.fecha ? format(new Date(ruta.fecha), 'dd/MM/yyyy') : 'No programada'}</TableCell>
                    <TableCell>{ruta.clientes?.length || 0} puntos</TableCell>
                    {currentTab === 'completadas' && (
                      <TableCell>
                        <Badge className="bg-[#ee970d]">{ruta.litrosTotales || 0}L</Badge>
                      </TableCell>
                    )}
                    <TableCell>
                      {currentTab === 'pendientes' ? (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-green-600 border-green-300 hover:bg-green-50"
                          onClick={() => handleEditarLitros(ruta.id)}
                        >
                          <Droplet className="mr-1 h-4 w-4" />
                          Registrar litros
                        </Button>
                      ) : (
                        <Button
                          size="sm"
                          variant="outline"
                          className="text-[#ee970d] border-[#ee970d]/30 hover:bg-[#ee970d]/10"
                          onClick={() => handleEditarLitros(ruta.id)}
                        >
                          <Search className="mr-1 h-4 w-4" />
                          Ver detalles
                        </Button>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>
      
      <Dialog open={isOpen} onOpenChange={setIsOpen}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>Crear Ruta Personalizada</DialogTitle>
            <DialogDescription>
              Selecciona los puntos verdes que formarán parte de la ruta
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="nombre">Nombre de la ruta</Label>
                <Input
                  id="nombre"
                  value={nombreRuta}
                  onChange={(e) => setNombreRuta(e.target.value)}
                  placeholder="Ej: Ruta Centro - 25/04/2025"
                  className="mt-1"
                />
              </div>
              
              <div>
                <Label htmlFor="fecha">Fecha de recogida</Label>
                <Input
                  id="fecha"
                  type="date"
                  value={fechaRecogida}
                  onChange={(e) => setFechaRecogida(e.target.value)}
                  className="mt-1"
                />
              </div>
            </div>
            
            <div className="grid grid-cols-2 gap-4 mt-4">
              <div>
                <Label>Filtrar por distrito</Label>
                <Select value={distritoFiltro} onValueChange={setDistritoFiltro}>
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccionar distrito" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los distritos</SelectItem>
                    {distritos.map(distrito => (
                      <SelectItem key={distrito} value={distrito}>
                        {distrito}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div>
                <Label>Filtrar por barrio</Label>
                <Select 
                  value={barrioFiltro} 
                  onValueChange={setBarrioFiltro}
                  disabled={!distritoFiltro}
                >
                  <SelectTrigger className="mt-1">
                    <SelectValue placeholder="Seleccionar barrio" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="">Todos los barrios</SelectItem>
                    {barrios.map(barrio => (
                      <SelectItem key={barrio} value={barrio}>
                        {barrio}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="mt-4">
              <div className="flex justify-between items-center">
                <Label className="text-lg">Puntos verdes disponibles</Label>
                <Badge variant="outline" className="bg-[#ee970d]/10">
                  {puntosSeleccionados.length} seleccionados
                </Badge>
              </div>
              
              <div className="border rounded-md mt-2 overflow-hidden max-h-[300px] overflow-y-auto">
                <Table>
                  <TableHeader className="bg-slate-50 sticky top-0">
                    <TableRow>
                      <TableHead className="w-[50px]"></TableHead>
                      <TableHead>Dirección</TableHead>
                      <TableHead>Distrito</TableHead>
                      <TableHead>Barrio</TableHead>
                      <TableHead className="text-right">Viviendas</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {puntosFiltrados.map(punto => {
                      const isSelected = puntosSeleccionados.some(p => p.id === punto.id);
                      return (
                        <TableRow 
                          key={punto.id} 
                          className={`cursor-pointer ${isSelected ? 'bg-[#ee970d]/10' : ''}`}
                          onClick={() => handleSeleccionarPunto(punto)}
                        >
                          <TableCell>
                            <div className={`w-5 h-5 rounded border flex items-center justify-center ${
                              isSelected ? 'bg-[#ee970d] border-[#ee970d]' : 'border-gray-300'
                            }`}>
                              {isSelected && <Check className="h-3 w-3 text-white" />}
                            </div>
                          </TableCell>
                          <TableCell>{punto.direccion}</TableCell>
                          <TableCell>{punto.distrito}</TableCell>
                          <TableCell>{punto.barrio}</TableCell>
                          <TableCell className="text-right">{punto.numViviendas}</TableCell>
                        </TableRow>
                      );
                    })}
                    
                    {puntosFiltrados.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-4 text-muted-foreground">
                          No se encontraron puntos verdes con los filtros aplicados
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </div>
            
            {puntosSeleccionados.length > 0 && (
              <div className="mt-4">
                <Label className="text-lg">Puntos verdes seleccionados</Label>
                <div className="flex flex-wrap gap-2 mt-2">
                  {puntosSeleccionados.map(punto => (
                    <Badge 
                      key={punto.id}
                      className="bg-[#ee970d] hover:bg-[#e08500] cursor-pointer"
                      onClick={() => handleSeleccionarPunto(punto)}
                    >
                      <MapPin className="h-3 w-3 mr-1" />
                      {punto.direccion} ({punto.barrio})
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setIsOpen(false)}>
              Cancelar
            </Button>
            <Button 
              className="bg-[#ee970d] hover:bg-[#e08500] text-white"
              onClick={handleCrearRuta}
              disabled={puntosSeleccionados.length === 0 || !nombreRuta}
            >
              Crear ruta
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      <Dialog open={isCompletingRuta} onOpenChange={setIsCompletingRuta}>
        <DialogContent className="sm:max-w-[800px]">
          <DialogHeader>
            <DialogTitle>
              {rutaActual?.completada ? 'Detalle de ruta completada' : 'Registrar litros recogidos'}
            </DialogTitle>
            <DialogDescription>
              {rutaActual?.completada 
                ? `Ruta completada el ${rutaActual?.fecha ? format(new Date(rutaActual.fecha), 'dd/MM/yyyy') : 'N/A'}`
                : 'Registra los litros recolectados en cada punto verde'
              }
            </DialogDescription>
          </DialogHeader>
          
          {rutaActual && (
            <div className="py-4">
              <div className="flex justify-between items-center mb-4">
                <div>
                  <h3 className="font-medium">Ruta: {rutaActual.nombre}</h3>
                  <p className="text-sm text-muted-foreground">
                    Fecha: {format(new Date(rutaActual.fecha), 'dd/MM/yyyy')}
                  </p>
                </div>
                <Badge className="bg-[#ee970d]">
                  {rutaActual.puntosVerdes.length} puntos de recogida
                </Badge>
              </div>
              
              <Table>
                <TableHeader className="bg-slate-50">
                  <TableRow>
                    <TableHead>Dirección</TableHead>
                    <TableHead>Barrio</TableHead>
                    <TableHead>Viviendas</TableHead>
                    <TableHead className="text-right">
                      Litros Recogidos
                    </TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {rutaActual.puntosVerdes.map(punto => (
                    <TableRow key={punto.id}>
                      <TableCell>{punto.direccion}</TableCell>
                      <TableCell>{punto.barrio}</TableCell>
                      <TableCell>{punto.numViviendas}</TableCell>
                      <TableCell className="text-right">
                        {rutaActual.completada ? (
                          <Badge className="bg-[#ee970d]">{punto.litrosRecogidos || 0}L</Badge>
                        ) : (
                          <div className="flex items-center justify-end">
                            <Input
                              type="number"
                              value={punto.litrosRecogidos || 0}
                              onChange={(e) => handleActualizarLitros(
                                punto.id, 
                                Number(e.target.value) || 0
                              )}
                              min={0}
                              className="w-24 text-right"
                            />
                            <span className="ml-1">L</span>
                          </div>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
                <tfoot className="border-t bg-slate-50 font-medium">
                  <tr>
                    <td colSpan={3} className="p-4 text-right">
                      Total litros recolectados:
                    </td>
                    <td className="p-4 text-right font-bold">
                      {rutaActual.litrosTotales}L
                    </td>
                  </tr>
                </tfoot>
              </Table>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => {
              setIsCompletingRuta(false);
              setRutaActual(null);
            }}>
              {rutaActual?.completada ? 'Cerrar' : 'Cancelar'}
            </Button>
            
            {!rutaActual?.completada && (
              <Button 
                className="bg-green-600 hover:bg-green-700 text-white"
                onClick={handleFinalizarRuta}
              >
                <Save className="mr-2 h-4 w-4" />
                Finalizar Ruta
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default RutasPersonalizadas;

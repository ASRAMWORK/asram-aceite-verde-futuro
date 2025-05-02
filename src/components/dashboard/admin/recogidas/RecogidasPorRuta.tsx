
import React, { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle,
  CardDescription, 
  CardFooter 
} from '@/components/ui/card';
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from '@/components/ui/button';
import { Input } from "@/components/ui/input";
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter
} from "@/components/ui/dialog";
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
import { Badge } from "@/components/ui/badge";
import { 
  MapPin, 
  Calendar, 
  Clock, 
  User, 
  Search,
  Route as RouteIcon,
  Eye,
  Check,
  AlertTriangle
} from 'lucide-react';
import { useRecogidas } from '@/hooks/useRecogidas';
import { useRutas } from '@/hooks/useRutas';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import type { Ruta } from '@/types';
import { ClientesRutaList } from '../rutas/ClientesRutaList';

interface RecogidasPorRutaProps {
  rutas: Ruta[];
}

const RecogidasPorRuta: React.FC<RecogidasPorRutaProps> = ({ rutas }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRutaId, setSelectedRutaId] = useState<string | null>(null);
  const [completingRutaId, setCompletingRutaId] = useState<string | null>(null);
  const [clientesLitros, setClientesLitros] = useState<Record<string, number>>({});
  const [activeTab, setActiveTab] = useState('pendientes');

  const { updateRutaRecogida, completarRecogidasRuta } = useRecogidas();
  const { completeRuta, loadRutas } = useRutas();

  // Get the selected ruta
  const selectedRuta = selectedRutaId ? rutas.find(r => r.id === selectedRutaId) : null;

  // Inicializar clientesLitros cuando se selecciona una ruta
  useEffect(() => {
    if (selectedRuta) {
      const initialLitros: Record<string, number> = {};
      selectedRuta.clientes?.forEach(cliente => {
        initialLitros[cliente.id] = cliente.litros || 0;
      });
      setClientesLitros(initialLitros);
    }
  }, [selectedRuta]);

  // Filter rutas by search term
  const filteredRutas = rutas.filter(ruta => {
    const rutaName = ruta.nombre || '';
    const distrito = ruta.distrito || '';
    
    const matchesSearch = rutaName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         distrito.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesSearch;
  });

  const pendingRutas = filteredRutas.filter(r => !r.completada);
  const completedRutas = filteredRutas.filter(r => r.completada);

  const handleSelectRuta = (rutaId: string) => {
    setSelectedRutaId(rutaId);
  };

  const handleUpdateLitros = (clienteId: string, litros: number) => {
    setClientesLitros(prev => ({
      ...prev,
      [clienteId]: litros
    }));
    
    // Si quieres guardar inmediatamente en la base de datos, descomenta esto
    // updateRutaRecogida(selectedRutaId!, clienteId, litros);
  };

  const handleCompleteRuta = (rutaId: string) => {
    setCompletingRutaId(rutaId);
  };

  const handleConfirmComplete = async () => {
    if (!completingRutaId) return;
    
    const ruta = rutas.find(r => r.id === completingRutaId);
    if (!ruta || !ruta.clientes?.length) {
      toast.error('Error: No se encontraron datos de la ruta');
      return;
    }

    try {
      // Calculate total liters collected
      const totalLitros = Object.values(clientesLitros).reduce((sum, litros) => sum + litros, 0);
      
      console.log("Completando ruta:", completingRutaId);
      console.log("Total litros calculados:", totalLitros);
      console.log("Clientes litros:", clientesLitros);
      
      // Update each client's liters in the route
      const updatePromises = Object.entries(clientesLitros).map(([clienteId, litros]) => 
        updateRutaRecogida(completingRutaId, clienteId, litros)
      );
      
      // Wait for all updates to complete
      await Promise.all(updatePromises);
      
      // Mark all recogidas in this route as complete
      await completarRecogidasRuta(completingRutaId);
      
      // Mark the route as complete
      await completeRuta(completingRutaId, totalLitros);
      
      // Close the dialog and reset states
      setCompletingRutaId(null);
      setSelectedRutaId(null);
      
      // Force refresh the routes data
      await loadRutas();
      
      // Switch to the "completed" tab to show the newly completed route
      setActiveTab('completadas');
      
      toast.success(`Ruta completada correctamente: ${totalLitros} litros recogidos`);
    } catch (error) {
      console.error("Error al completar ruta:", error);
      toast.error('Error al completar la ruta. Intente nuevamente.');
    }
  };

  // Format date helper function
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "N/A";
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return dateObj.toLocaleDateString();
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  return (
    <>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div className="relative w-64">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Buscar rutas..."
              className="pl-8 bg-white"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {selectedRutaId ? (
          <Card className="bg-white shadow-sm border-[#EE970D]/10">
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle className="text-xl flex items-center gap-2">
                  <RouteIcon className="h-5 w-5 text-[#EE970D]" />
                  {selectedRuta?.nombre}
                </CardTitle>
                <CardDescription>
                  Distrito: {selectedRuta?.distrito} • {selectedRuta?.clientes?.length || 0} clientes
                </CardDescription>
              </div>
              <Button 
                variant="outline" 
                onClick={() => setSelectedRutaId(null)}
                className="border-[#EE970D]/30 text-[#EE970D] hover:bg-[#EE970D]/10"
              >
                Volver a la lista
              </Button>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Calendar className="h-4 w-4 text-[#EE970D]" /> Fecha
                  </span>
                  <span className="font-medium">{formatDate(selectedRuta?.fecha)}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <Clock className="h-4 w-4 text-[#EE970D]" /> Hora
                  </span>
                  <span className="font-medium">{selectedRuta?.hora || 'No especificada'}</span>
                </div>
                <div className="flex flex-col">
                  <span className="text-sm text-gray-500 flex items-center gap-1">
                    <User className="h-4 w-4 text-[#EE970D]" /> Recogedor
                  </span>
                  <span className="font-medium">{selectedRuta?.recogedores || 'No asignado'}</span>
                </div>
              </div>

              <ClientesRutaList
                clientes={selectedRuta?.clientes?.map(cliente => ({
                  ...cliente,
                  litros: clientesLitros[cliente.id] || cliente.litros || 0
                })) || []}
                onUpdateLitros={handleUpdateLitros}
                showComplete={!selectedRuta?.completada}
                onComplete={() => handleCompleteRuta(selectedRuta?.id || '')}
              />
            </CardContent>
          </Card>
        ) : (
          <Tabs defaultValue="pendientes" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="bg-muted/60">
              <TabsTrigger value="pendientes">Pendientes ({pendingRutas.length})</TabsTrigger>
              <TabsTrigger value="completadas">Historial ({completedRutas.length})</TabsTrigger>
            </TabsList>
            
            <TabsContent value="pendientes" className="mt-4">
              <Card className="bg-white shadow-sm border-[#EE970D]/10">
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Nombre</TableHead>
                        <TableHead>Distrito</TableHead>
                        <TableHead>Clientes</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {pendingRutas.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={5} className="text-center py-8 text-gray-500">
                            No hay rutas pendientes
                          </TableCell>
                        </TableRow>
                      ) : (
                        pendingRutas.map((ruta) => (
                          <TableRow key={ruta.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{ruta.nombre}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-[#EE970D]" />
                                {ruta.distrito}
                              </div>
                            </TableCell>
                            <TableCell>{ruta.clientes?.length || 0}</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3 text-gray-500" />
                                  {formatDate(ruta.fecha)}
                                </span>
                                {ruta.hora && (
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> {ruta.hora}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button 
                                onClick={() => handleSelectRuta(ruta.id)}
                                className="bg-[#EE970D] hover:bg-[#DB8B0C] text-white"
                              >
                                Gestionar Recogida
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="completadas" className="mt-4">
              <Card className="bg-white shadow-sm border-[#EE970D]/10">
                <CardContent className="pt-6">
                  <Table>
                    <TableHeader>
                      <TableRow className="bg-gray-50">
                        <TableHead>Nombre</TableHead>
                        <TableHead>Distrito</TableHead>
                        <TableHead>Clientes</TableHead>
                        <TableHead>Litros Total</TableHead>
                        <TableHead>Fecha</TableHead>
                        <TableHead>Acciones</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {completedRutas.length === 0 ? (
                        <TableRow>
                          <TableCell colSpan={6} className="text-center py-8 text-gray-500">
                            No hay rutas completadas
                          </TableCell>
                        </TableRow>
                      ) : (
                        completedRutas.map((ruta) => (
                          <TableRow key={ruta.id} className="hover:bg-gray-50">
                            <TableCell className="font-medium">{ruta.nombre}</TableCell>
                            <TableCell>
                              <div className="flex items-center gap-1">
                                <MapPin className="h-4 w-4 text-[#EE970D]" />
                                {ruta.distrito}
                              </div>
                            </TableCell>
                            <TableCell>{ruta.clientes?.length || 0}</TableCell>
                            <TableCell>{ruta.litrosTotales || 0} L</TableCell>
                            <TableCell>
                              <div className="flex flex-col">
                                <span className="flex items-center gap-1">
                                  <Calendar className="h-3 w-3 text-gray-500" />
                                  {formatDate(ruta.fecha)}
                                </span>
                                {ruta.hora && (
                                  <span className="text-xs text-gray-500 flex items-center gap-1">
                                    <Clock className="h-3 w-3" /> {ruta.hora}
                                  </span>
                                )}
                              </div>
                            </TableCell>
                            <TableCell>
                              <Button 
                                onClick={() => handleSelectRuta(ruta.id)}
                                variant="outline"
                                className="border-[#EE970D]/30 text-[#EE970D] hover:bg-[#EE970D]/10"
                              >
                                <Eye className="mr-2 h-4 w-4" />
                                Ver Detalles
                              </Button>
                            </TableCell>
                          </TableRow>
                        ))
                      )}
                    </TableBody>
                  </Table>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        )}
      </div>

      {/* Complete Ruta Alert Dialog */}
      <AlertDialog open={!!completingRutaId} onOpenChange={(open) => !open && setCompletingRutaId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <AlertTriangle className="h-5 w-5 text-[#EE970D]" />
              Completar Ruta
            </AlertDialogTitle>
            <AlertDialogDescription>
              ¿Está seguro de que desea marcar esta ruta como completada? 
              Esta acción registrará los litros recogidos para cada cliente y 
              moverá la ruta al historial de rutas completadas.
            </AlertDialogDescription>
            <div className="mt-4 p-3 bg-amber-50 border border-amber-200 rounded-md">
              <p className="font-medium">Resumen de litros:</p>
              <p className="text-sm">
                Total: <span className="font-bold">
                  {Object.values(clientesLitros).reduce((sum, litros) => sum + litros, 0)} litros
                </span>
              </p>
            </div>
          </AlertDialogHeader>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmComplete}
              className="bg-[#EE970D] hover:bg-[#DB8B0C] text-white"
            >
              Completar Ruta
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RecogidasPorRuta;

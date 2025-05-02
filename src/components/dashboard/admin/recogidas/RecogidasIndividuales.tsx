import React, { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardHeader, 
  CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Plus, Calendar, Check, Search, Eye, FilterIcon } from 'lucide-react';
import { useRecogidas } from '@/hooks/useRecogidas';
import RecogidasList from './RecogidasList';
import RecogidaForm from '@/components/dashboard/admin/RecogidaForm';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { es } from 'date-fns/locale';
import { toast } from 'sonner';
import type { Usuario, Recogida } from '@/types';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';

interface RecogidasIndividualesProps {
  clientes: Usuario[];
}

// Define el schema para la cantidad de litros
const litrosFormSchema = z.object({
  litrosRecogidos: z.coerce.number()
    .min(0.5, "Debe ingresar al menos 0.5 litros")
    .max(1000, "Cantidad máxima excedida")
});

const RecogidasIndividuales: React.FC<RecogidasIndividualesProps> = ({ clientes }) => {
  const [showForm, setShowForm] = useState(false);
  const [selectedClienteId, setSelectedClienteId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedRecogidaId, setSelectedRecogidaId] = useState<string | null>(null);
  const [completingRecogidaId, setCompletingRecogidaId] = useState<string | null>(null);
  const [litrosRecogidos, setLitrosRecogidos] = useState(0);
  const [showDetallesDialog, setShowDetallesDialog] = useState(false);
  const [activeTab, setActiveTab] = useState('pendientes');
  const [filtroDistrito, setFiltroDistrito] = useState('todos');

  const { 
    recogidas,
    addRecogida,
    completeRecogida,
    loadRecogidasData
  } = useRecogidas();

  // Inicializar el formulario para los litros recogidos con react-hook-form
  const litrosForm = useForm<z.infer<typeof litrosFormSchema>>({
    resolver: zodResolver(litrosFormSchema),
    defaultValues: {
      litrosRecogidos: 0
    },
  });

  // Get the selected client
  const selectedCliente = selectedClienteId 
    ? clientes.find(c => c.id === selectedClienteId) 
    : null;

  // Get the selected recogida details
  const selectedRecogida = selectedRecogidaId 
    ? recogidas.find(r => r.id === selectedRecogidaId) 
    : null;

  // Filter recogidas by search term and district
  const filteredRecogidas = recogidas.filter(recogida => {
    const clienteName = recogida.cliente || recogida.nombreContacto || '';
    const direccion = recogida.direccion || recogida.direccionRecogida || '';
    const distrito = recogida.distrito || '';
    
    const matchesSearch = clienteName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         direccion.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesDistrito = filtroDistrito === 'todos' || distrito === filtroDistrito;
    
    // Only include recogidas that are not associated with a route
    const isIndividual = !recogida.rutaId;
    
    return matchesSearch && matchesDistrito && isIndividual;
  });

  // Get unique districts from clients
  const distritos = [...new Set(clientes.map(c => c.distrito).filter(Boolean))];

  const handleAddRecogida = async (data: any) => {
    await addRecogida({
      ...data,
      direccion: data.direccionRecogida || data.direccion,
      cliente: data.nombreContacto || (data.clienteId ? clientes.find(c => c.id === data.clienteId)?.nombre : ''),
      distrito: data.distrito || 'Sin asignar',
      barrio: data.barrio || 'Sin asignar',
      estado: 'pendiente'
    });
    setShowForm(false);
    toast.success('Recogida programada correctamente');
  };

  const handleCreateRecogidaFromCliente = (clienteId: string) => {
    setSelectedClienteId(clienteId);
    setShowForm(true);
  };

  const handleViewDetails = (id: string) => {
    setSelectedRecogidaId(id);
    setShowDetallesDialog(true);
  };

  const handleCompleteRecogida = (id: string) => {
    setCompletingRecogidaId(id);
    litrosForm.setValue("litrosRecogidos", 0);
  };

  const handleConfirmComplete = async () => {
    const values = litrosForm.getValues();
    if (completingRecogidaId && values.litrosRecogidos > 0) {
      await completeRecogida(completingRecogidaId, values.litrosRecogidos);
      setCompletingRecogidaId(null);
      loadRecogidasData(); // Refresh data
      toast.success('Recogida completada correctamente');
    } else {
      toast.error('Debe especificar los litros recogidos');
    }
  };

  // Format date helper function
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "N/A";
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'dd/MM/yyyy', { locale: es });
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  const pendingRecogidas = filteredRecogidas.filter(r => !r.completada);
  const completedRecogidas = filteredRecogidas.filter(r => r.completada);

  return (
    <>
      <div className="flex flex-col space-y-6">
        <div className="flex justify-between items-center">
          <div className="flex items-center space-x-4">
            <div className="relative w-64">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Buscar recogidas..."
                className="pl-8 bg-white"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            
            <div className="flex items-center space-x-2">
              <FilterIcon className="h-4 w-4 text-muted-foreground" />
              <Select 
                value={filtroDistrito} 
                onValueChange={setFiltroDistrito}
              >
                <SelectTrigger className="w-[180px] bg-white">
                  <SelectValue placeholder="Filtrar por distrito" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="todos">Todos los distritos</SelectItem>
                  {distritos.map(distrito => (
                    <SelectItem key={distrito} value={distrito}>{distrito}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
          
          <Button onClick={() => setShowForm(true)} className="bg-[#EE970D] hover:bg-[#DB8B0C] text-white">
            <Plus className="mr-2 h-4 w-4" /> Nueva Recogida
          </Button>
        </div>
        
        <Tabs defaultValue="pendientes" value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-muted/60">
            <TabsTrigger value="pendientes">Pendientes ({pendingRecogidas.length})</TabsTrigger>
            <TabsTrigger value="completadas">Historial ({completedRecogidas.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="pendientes" className="mt-4">
            <Card className="bg-white shadow-sm border-[#EE970D]/10">
              <CardContent className="pt-6">
                <RecogidasList
                  recogidas={pendingRecogidas}
                  onViewDetails={handleViewDetails}
                  onCompleteRecogida={handleCompleteRecogida}
                />
              </CardContent>
            </Card>
          </TabsContent>
          
          <TabsContent value="completadas" className="mt-4">
            <Card className="bg-white shadow-sm border-[#EE970D]/10">
              <CardContent className="pt-6">
                <RecogidasList
                  recogidas={completedRecogidas}
                  onViewDetails={handleViewDetails}
                />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>

      {/* Form Dialog */}
      <Dialog open={showForm} onOpenChange={setShowForm}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-[#EE970D] flex items-center gap-2">
              <Calendar className="h-5 w-5" />
              {selectedClienteId ? `Programar Recogida para ${selectedCliente?.nombre}` : 'Nueva Recogida'}
            </DialogTitle>
            <DialogDescription>
              Programa una nueva recogida de aceite
            </DialogDescription>
          </DialogHeader>
          
          <RecogidaForm 
            onCancel={() => setShowForm(false)} 
            onSubmit={handleAddRecogida}
            initialData={selectedCliente ? {
              direccion: selectedCliente.direccion,
              distrito: selectedCliente.distrito,
              barrio: selectedCliente.barrio,
              nombreContacto: selectedCliente.nombre,
              telefonoContacto: selectedCliente.telefono,
              emailContacto: selectedCliente.email,
              clienteId: selectedCliente.id
            } : undefined}
          />
        </DialogContent>
      </Dialog>

      {/* Details Dialog */}
      <Dialog open={showDetallesDialog} onOpenChange={setShowDetallesDialog}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="text-[#EE970D] flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Detalles de Recogida
            </DialogTitle>
            <DialogDescription>
              Información detallada de la recogida seleccionada
            </DialogDescription>
          </DialogHeader>

          {selectedRecogida && (
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">Cliente</h3>
                  <p>{selectedRecogida.cliente || selectedRecogida.nombreContacto || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">Fecha</h3>
                  <p>{formatDate(selectedRecogida.fecha)}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">Dirección</h3>
                  <p>{selectedRecogida.direccion || selectedRecogida.direccionRecogida || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">Estado</h3>
                  <p>{selectedRecogida.completada ? 'Completada' : 'Pendiente'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">Distrito</h3>
                  <p>{selectedRecogida.distrito || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">Barrio</h3>
                  <p>{selectedRecogida.barrio || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">Contacto</h3>
                  <p>{selectedRecogida.telefonoContacto || 'N/A'}</p>
                </div>
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">Email</h3>
                  <p>{selectedRecogida.emailContacto || 'N/A'}</p>
                </div>
                {selectedRecogida.completada && (
                  <div>
                    <h3 className="font-semibold text-sm text-gray-500">Litros Recogidos</h3>
                    <p>{selectedRecogida.litrosRecogidos || 0} L</p>
                  </div>
                )}
                {selectedRecogida.clienteId && (
                  <div>
                    <h3 className="font-semibold text-sm text-gray-500">Cliente Registrado</h3>
                    <p>Sí (ID: {selectedRecogida.clienteId.substring(0, 8)}...)</p>
                  </div>
                )}
              </div>

              {selectedRecogida.notasAdicionales && (
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">Notas adicionales</h3>
                  <p>{selectedRecogida.notasAdicionales}</p>
                </div>
              )}

              {selectedRecogida.completada && selectedRecogida.fechaCompletada && (
                <div>
                  <h3 className="font-semibold text-sm text-gray-500">Fecha de completado</h3>
                  <p>{formatDate(selectedRecogida.fechaCompletada)}</p>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Complete Recogida Alert Dialog */}
      <AlertDialog open={!!completingRecogidaId} onOpenChange={(open) => !open && setCompletingRecogidaId(null)}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle className="flex items-center gap-2">
              <Check className="h-5 w-5 text-[#EE970D]" />
              Completar Recogida
            </AlertDialogTitle>
            <AlertDialogDescription>
              Indique la cantidad de litros recogidos para completar el registro.
            </AlertDialogDescription>
          </AlertDialogHeader>
          
          <Form {...litrosForm}>
            <form onSubmit={(e) => {
              e.preventDefault();
              handleConfirmComplete();
            }} className="py-4">
              <FormField
                control={litrosForm.control}
                name="litrosRecogidos"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Litros Recogidos</FormLabel>
                    <div className="flex items-center gap-2">
                      <FormControl>
                        <Input
                          type="number"
                          min="0.5"
                          step="0.5"
                          {...field}
                          onChange={(e) => field.onChange(Number(e.target.value))}
                          className="flex-1"
                        />
                      </FormControl>
                      <span className="text-sm text-gray-500">L</span>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </form>
          </Form>
          
          <AlertDialogFooter>
            <AlertDialogCancel>Cancelar</AlertDialogCancel>
            <AlertDialogAction 
              onClick={handleConfirmComplete}
              className="bg-[#EE970D] hover:bg-[#DB8B0C] text-white"
            >
              Completar Recogida
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default RecogidasIndividuales;

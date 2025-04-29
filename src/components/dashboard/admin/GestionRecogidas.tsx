
import React, { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, Filter, Package, Clock, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format, isValid } from 'date-fns';
import { toast } from 'sonner';
import { useRecogidas } from '@/hooks/useRecogidas';
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

const GestionRecogidas = () => {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('pendientes');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedRecogida, setSelectedRecogida] = useState<string | null>(null);
  const { recogidas, addRecogida, completeRecogida, getTotalLitrosRecogidos, calcularPromedioLitrosPorPeriodo } = useRecogidas();
  
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
    // Default litros for this example
    const litrosRecogidos = 10;
    await completeRecogida(id, litrosRecogidos);
    toast.success('Recogida completada correctamente');
  };

  // Get recogidas based on filters
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

  // Handle form submission for new recogidas
  const handleAddRecogida = async (data: any) => {
    await addRecogida({
      ...data,
      direccion: data.direccionRecogida,
      cliente: data.nombreContacto,
      distrito: data.distrito || 'Sin asignar',
      barrio: data.barrio || 'Sin asignar',
      estado: 'pendiente'
    });
    setShowForm(false);
  };

  // Get selected recogida details
  const recogidaDetails = selectedRecogida 
    ? recogidas.find(r => r.id === selectedRecogida)
    : null;

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
        <Button onClick={() => setShowForm(true)} className="bg-[#ee970d] hover:bg-[#e08500]">
          <Plus className="mr-2 h-4 w-4" /> Nueva Recogida
        </Button>
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

      {/* Recogida Details Dialog */}
      <Dialog open={!!selectedRecogida} onOpenChange={(open) => !open && setSelectedRecogida(null)}>
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
    </div>
  );
};

export default GestionRecogidas;

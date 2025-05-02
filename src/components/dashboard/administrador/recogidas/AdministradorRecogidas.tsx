import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, FilePlus, Plus, TrendingUp, Clock } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RecogidasList from './RecogidasList';
import RecogidaForm from './RecogidaForm';
import RecogidasChart from '@/components/dashboard/admin/recogidas/RecogidasChart';
import { StatsCard } from '@/components/dashboard/admin/stats/StatsCard';
import { useRecogidas } from '@/hooks/useRecogidas';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';
import { toast } from 'sonner';

interface AdministradorRecogidasProps {
  adminId?: string;
}

const AdministradorRecogidas: React.FC<AdministradorRecogidasProps> = ({ adminId }) => {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('pendientes');
  const [selectedMonth, setSelectedMonth] = useState<string>('');
  const [selectedYear, setSelectedYear] = useState<string>(new Date().getFullYear().toString());
  const [selectedRecogidaId, setSelectedRecogidaId] = useState<string | null>(null);
  
  // Corregido: no pasar adminId a useRecogidas() ya que no acepta argumentos
  const { 
    recogidas, 
    loading, 
    completeRecogida, 
    getTotalLitrosRecogidos,
    calcularPromedioLitrosPorPeriodo,
    addRecogida,
    completarRecogida
  } = useRecogidas();

  // Generate chart data from recogidas
  const generateChartData = () => {
    // Get last 6 months
    const labels = [];
    const months = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const date = new Date();
      date.setMonth(currentDate.getMonth() - i);
      labels.push(months[date.getMonth()]);
    }
    
    // Generate sample data for now - in a real app, this would process recogidas by month
    const recogidasData = [450, 590, 800, 810, 560, 550];
    const objetivoData = new Array(6).fill(600);
    
    return {
      labels,
      datasets: [
        {
          label: 'Litros Recogidos',
          data: recogidasData,
          backgroundColor: '#8B5CF6',
          borderColor: '#7C3AED',
          borderWidth: 2,
        },
        {
          label: 'Objetivo',
          data: objetivoData,
          backgroundColor: '#D1D5DB',
          borderColor: '#9CA3AF',
          borderWidth: 2,
        },
      ],
    };
  };

  const chartData = generateChartData();
  
  const promedioLitrosMes = calcularPromedioLitrosPorPeriodo();
  
  const stats = [
    {
      title: "Total Recogidas",
      value: recogidas.length,
      icon: CalendarDays,
    },
    {
      title: "Litros Recogidos",
      value: getTotalLitrosRecogidos(),
      icon: TrendingUp,
    },
    {
      title: "Media Litros/Mes",
      value: promedioLitrosMes.toFixed(1),
      icon: Clock,
    }
  ];

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

  const handleCompletarRecogida = async (id: string) => {
    await completarRecogida(id, 10); // Default litros value
    toast.success("Recogida completada correctamente");
  };

  // Handle form submission for new recogidas - añadir adminId
  const handleAddRecogida = async (data: any) => {
    await addRecogida({
      ...data,
      direccion: data.direccionRecogida,
      cliente: data.nombreContacto,
      distrito: data.distrito || 'Sin asignar',
      barrio: data.barrio || 'Sin asignar',
      estado: 'pendiente',
      adminId: adminId // Añadir el adminId a la recogida
    });
    setShowForm(false);
  };

  // Get selected recogida details
  const recogidaDetails = selectedRecogidaId 
    ? recogidas.find(r => r.id === selectedRecogidaId)
    : null;

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

  // Format date helper function
  const formatDate = (date: Date | string | null | undefined) => {
    if (!date) return "N/A";
    
    try {
      const dateObj = typeof date === 'string' ? new Date(date) : date;
      return format(dateObj, 'dd/MM/yyyy');
    } catch (error) {
      console.error("Error formatting date:", error);
      return "N/A";
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold">Gestión de Recogidas</h2>
          <p className="text-muted-foreground">
            Administra y monitorea las recogidas de aceite
          </p>
        </div>
        <Button onClick={() => setShowForm(true)} className="flex items-center gap-2">
          <Plus className="h-4 w-4" /> Nueva Recogida
        </Button>
      </div>

      <div className="grid gap-4 md:grid-cols-3">
        {stats.map((stat, index) => (
          <StatsCard
            key={index}
            title={stat.title}
            value={stat.value}
            icon={stat.icon}
            className="bg-card"
          />
        ))}
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

      <Card>
        <CardHeader>
          <CardTitle>Evolución de Recogidas</CardTitle>
          <CardDescription>Litros de aceite recogidos por mes</CardDescription>
        </CardHeader>
        <CardContent>
          <RecogidasChart data={chartData} />
        </CardContent>
      </Card>

      <div className="flex flex-wrap items-center gap-4 mb-4">
        <div className="flex items-center gap-2">
          <FilePlus className="h-4 w-4" />
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
                onCompleteRecogida={handleCompletarRecogida}
                onViewDetails={(id) => setSelectedRecogidaId(id)}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completadas">
          <Card>
            <CardContent className="pt-6">
              <RecogidasList 
                recogidas={filteredRecogidas.filter(r => r.completada)}
                onViewDetails={(id) => setSelectedRecogidaId(id)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Recogida Details Dialog */}
      <Dialog open={!!selectedRecogidaId} onOpenChange={(open) => !open && setSelectedRecogidaId(null)}>
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

export default AdministradorRecogidas;

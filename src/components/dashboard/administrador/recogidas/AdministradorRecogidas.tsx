
import React, { useState, useEffect } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, FilePlus, Plus, TrendingUp } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RecogidasList from './RecogidasList';
import RecogidaForm from './RecogidaForm';
import RecogidasChart from '@/components/dashboard/admin/recogidas/RecogidasChart';
import { StatsCard } from '@/components/dashboard/admin/stats/StatsCard';
import { useRecogidas } from '@/hooks/useRecogidas';

const AdministradorRecogidas = () => {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('listado');
  const { recogidas, loading, completeRecogida, getTotalLitrosRecogidos } = useRecogidas();

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
  ];

  const handleCompleteRecogida = async (id: string) => {
    // Default to 10 liters but in a real implementation
    // you would prompt for the amount or have it in the form
    const litrosRecogidos = 10; 
    await completeRecogida(id, litrosRecogidos);
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

      <div className="grid gap-4 md:grid-cols-2">
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
            <RecogidaForm onCancel={() => setShowForm(false)} />
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

      <Tabs defaultValue="pendientes" value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="pendientes">Pendientes</TabsTrigger>
          <TabsTrigger value="completadas">Completadas</TabsTrigger>
        </TabsList>

        <TabsContent value="pendientes">
          <Card>
            <CardContent className="pt-6">
              <RecogidasList 
                recogidas={recogidas.filter(r => !r.completada)}
                onCompleteRecogida={handleCompleteRecogida}
              />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="completadas">
          <Card>
            <CardContent className="pt-6">
              <RecogidasList 
                recogidas={recogidas.filter(r => r.completada)}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdministradorRecogidas;

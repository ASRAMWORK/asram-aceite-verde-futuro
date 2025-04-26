
import React, { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CalendarDays, FilePlus, Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import RecogidasList from './RecogidasList';
import RecogidaForm from './RecogidaForm';
import RecogidasChart from './RecogidasChart';
import { Recogida } from '@/types';
import { toast } from 'sonner';
import { format } from 'date-fns';

const AdministradorRecogidas = () => {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('listado');
  const [recogidas, setRecogidas] = useState<Recogida[]>([]);
  
  const createRecogida = (formData: any) => {
    try {
      const nuevaRecogida: Omit<Recogida, 'id'> = {
        clienteId: formData.clienteId,
        fechaSolicitud: new Date(),
        fechaProgramada: new Date(formData.fechaProgramada),
        fechaCompletada: null,
        fecha: new Date(formData.fecha),
        hora: formData.hora,
        distrito: formData.distrito,
        barrio: formData.barrio,
        direccion: formData.direccion,
        telefono: formData.telefono,
        nombreLugar: formData.nombreLugar || formData.direccion,
        tipo: formData.tipoBusqueda as "zona" | "individual" | "calendario",
        estado: "pendiente",
        litrosRecogidos: 0,
        litrosEstimados: formData.litrosEstimados || 0,
        completada: false,
        createdAt: new Date()
      };

      console.log("Creating new recogida:", nuevaRecogida);
      
      // Add to recogidas with a unique ID
      setRecogidas([
        ...recogidas,
        {
          ...nuevaRecogida,
          id: `rec-${Date.now()}`,
        } as Recogida,
      ]);
      
      setShowForm(false);
      toast.success(`Recogida programada para ${format(new Date(formData.fecha), 'dd/MM/yyyy')}`);
    } catch (error) {
      console.error("Error creating recogida:", error);
      toast.error("Error al crear la recogida");
    }
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Registro de Recogidas</h2>
        <div className="flex gap-2">
          <Button onClick={() => setShowForm(true)}>
            <Plus className="mr-2 h-4 w-4" /> Nueva Recogida
          </Button>
          <Button variant="outline">
            <FilePlus className="mr-2 h-4 w-4" /> Exportar Informe
          </Button>
        </div>
      </div>
      
      {showForm ? (
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Registro de Recogida</CardTitle>
            <CardDescription>Ingrese los datos de la recogida</CardDescription>
          </CardHeader>
          <CardContent>
            <RecogidaForm onCancel={() => setShowForm(false)} onSubmit={createRecogida} />
          </CardContent>
        </Card>
      ) : null}
      
      <Tabs defaultValue="listado" value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="mb-4">
          <TabsTrigger value="listado">
            <CalendarDays className="mr-2 h-4 w-4" /> Listado de Recogidas
          </TabsTrigger>
          <TabsTrigger value="estadisticas">
            <CalendarDays className="mr-2 h-4 w-4" /> Estadísticas
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="listado">
          <Card>
            <CardContent className="pt-6">
              <RecogidasList recogidas={recogidas} />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="estadisticas">
          <Card>
            <CardHeader>
              <CardTitle>Evolución de Recogidas</CardTitle>
              <CardDescription>
                Litros de aceite recogidos por mes
              </CardDescription>
            </CardHeader>
            <CardContent>
              <RecogidasChart />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdministradorRecogidas;

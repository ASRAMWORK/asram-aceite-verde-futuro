
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

const AdministradorRecogidas = () => {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('listado');
  
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
            <RecogidaForm onCancel={() => setShowForm(false)} />
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
              <RecogidasList />
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

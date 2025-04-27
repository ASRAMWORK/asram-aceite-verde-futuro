
import React, { useState } from 'react';
import { 
  Card, CardContent, CardHeader, CardTitle, 
  CardDescription 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { format } from 'date-fns';
import { toast } from 'sonner';
import { useRecogidas } from '@/hooks/useRecogidas';
import RecogidasList from './RecogidasList';
import RecogidaForm from './RecogidaForm';

const GestionRecogidas = () => {
  const [showForm, setShowForm] = useState(false);
  const [activeTab, setActiveTab] = useState('pendientes');
  const { recogidas, addRecogida, completeRecogida } = useRecogidas();
  
  const handleCompleteRecogida = async (id: string) => {
    // Default litros for this example
    const litrosRecogidos = 10;
    await completeRecogida(id, litrosRecogidos);
    toast.success('Recogida completada correctamente');
  };

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

      {showForm && (
        <Card>
          <CardHeader>
            <CardTitle>Nueva Recogida</CardTitle>
            <CardDescription>Registra una nueva recogida de aceite</CardDescription>
          </CardHeader>
          <CardContent>
            <RecogidaForm onCancel={() => setShowForm(false)} onSubmit={addRecogida} />
          </CardContent>
        </Card>
      )}

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
                showActions={true}
              />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="completadas">
          <Card>
            <CardContent className="pt-6">
              <RecogidasList 
                recogidas={recogidas.filter(r => r.completada)}
                showActions={false}
              />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default GestionRecogidas;

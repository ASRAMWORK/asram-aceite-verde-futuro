
import React from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import EstadisticasGenerales from './EstadisticasGenerales';
import RankingComunidades from './RankingComunidades';
import ImpactoMedioambiental from './ImpactoMedioambiental';
import { ChartBar, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const AdministradorEstadisticas = () => {
  // Handler for report download (in a real application, this would generate a PDF)
  const handleDownloadReport = () => {
    alert("Esta funcionalidad generaría un reporte PDF en una aplicación real");
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Estadísticas y Reportes</h2>
        <Button onClick={handleDownloadReport}>
          <Download className="mr-2 h-4 w-4" /> Descargar Informe
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total aceite recogido</CardDescription>
            <CardTitle className="text-3xl">865 L</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              +20.1% respecto al mes anterior
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Comunidades activas</CardDescription>
            <CardTitle className="text-3xl">24</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              3 nuevas comunidades este mes
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Recogidas realizadas</CardDescription>
            <CardTitle className="text-3xl">42</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              98% de cumplimiento en frecuencia
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="general" className="space-y-4">
        <TabsList>
          <TabsTrigger value="general">
            <ChartBar className="mr-2 h-4 w-4" /> Estadísticas Generales
          </TabsTrigger>
          <TabsTrigger value="ranking">
            <ChartBar className="mr-2 h-4 w-4" /> Ranking Comunidades
          </TabsTrigger>
          <TabsTrigger value="impacto">
            <ChartBar className="mr-2 h-4 w-4" /> Impacto Medioambiental
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="general" className="space-y-4">
          <EstadisticasGenerales />
        </TabsContent>
        
        <TabsContent value="ranking" className="space-y-4">
          <RankingComunidades />
        </TabsContent>
        
        <TabsContent value="impacto" className="space-y-4">
          <ImpactoMedioambiental />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdministradorEstadisticas;

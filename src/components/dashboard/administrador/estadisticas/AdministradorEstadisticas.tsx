
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
import { useComunidadesVecinos } from '@/hooks/useComunidadesVecinos';
import { useUserProfile } from '@/hooks/useUserProfile';
import { toast } from '@/components/ui/use-toast';
import { ComunidadVecinos } from '@/types';

interface AdministradorEstadisticasProps {
  adminId?: string;
}

// Define interfaces for the components
interface EstadisticasGeneralesProps {
  adminId?: string;
  comunidades: ComunidadVecinos[];
}

interface RankingComunidadesProps {
  comunidades: ComunidadVecinos[];
}

interface ImpactoMedioambientalProps {
  comunidades: ComunidadVecinos[];
}

const AdministradorEstadisticas: React.FC<AdministradorEstadisticasProps> = ({ adminId }) => {
  const { profile } = useUserProfile();
  const efectiveAdminId = adminId || profile?.id;
  const { comunidades, loading, error } = useComunidadesVecinos(efectiveAdminId);

  // Handler for report download (in a real application, this would generate a PDF)
  const handleDownloadReport = () => {
    toast({
      title: "Generación de informes",
      description: "El informe se está generando y se descargará en breve."
    });
  };

  // Cálculo de estadísticas basadas en las comunidades
  const totalComunidades = comunidades.length;
  const totalViviendas = comunidades.reduce((sum, com) => sum + (com.numViviendas || 0), 0);
  const totalContenedores = comunidades.reduce((sum, com) => sum + (com.numContenedores || 0), 0);
  const totalLitrosRecogidos = comunidades.reduce((sum, com) => sum + (com.litrosRecogidos || 0), 0);
  
  // Calcular litros del mes actual
  const hoy = new Date();
  const inicioMes = new Date(hoy.getFullYear(), hoy.getMonth(), 1);
  const litrosDelMes = comunidades.reduce((sum, com) => {
    // Suponiendo que hay un historial de recogidas en cada comunidad
    const recogidasDelMes = com.historialRecogidas?.filter(
      rec => new Date(rec.fecha) >= inicioMes
    ) || [];
    return sum + recogidasDelMes.reduce((litros, rec) => litros + (rec.litros || 0), 0);
  }, 0);

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <p className="text-gray-500">Cargando estadísticas...</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-600">
        <p>Error al cargar las estadísticas: {error}</p>
      </div>
    );
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">Estadísticas y Reportes</h2>
        <Button onClick={handleDownloadReport}>
          <Download className="mr-2 h-4 w-4" /> Descargar Informe
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total comunidades</CardDescription>
            <CardTitle className="text-3xl">{totalComunidades}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Comunidades gestionadas
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total viviendas</CardDescription>
            <CardTitle className="text-3xl">{totalViviendas}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              En todas tus comunidades
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total contenedores</CardDescription>
            <CardTitle className="text-3xl">{totalContenedores}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              Instalados en comunidades
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Litros recogidos</CardDescription>
            <CardTitle className="text-3xl">{totalLitrosRecogidos}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-xs text-muted-foreground">
              {litrosDelMes} L este mes
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
          <EstadisticasGenerales adminId={efectiveAdminId} comunidades={comunidades} />
        </TabsContent>
        
        <TabsContent value="ranking" className="space-y-4">
          <RankingComunidades comunidades={comunidades} />
        </TabsContent>
        
        <TabsContent value="impacto" className="space-y-4">
          <ImpactoMedioambiental comunidades={comunidades} />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdministradorEstadisticas;


import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useComunidadesVecinos } from '@/hooks/useComunidadesVecinos';

const AdministradorDashboardOverview = () => {
  const { comunidades, loading } = useComunidadesVecinos();
  
  const totalComunidades = comunidades.length;
  const totalViviendas = comunidades.reduce((acc, com) => acc + (com.numViviendas || 0), 0);
  const totalLitros = comunidades.reduce((acc, com) => acc + (com.litrosRecogidos || 0), 0);
  
  // Calculate total environmental impact
  const totalImpacto = {
    co2: comunidades.reduce((acc, com) => acc + (com.beneficiosMedioambientales?.co2 || 0), 0),
    agua: comunidades.reduce((acc, com) => acc + (com.beneficiosMedioambientales?.agua || 0), 0),
    energia: comunidades.reduce((acc, com) => acc + (com.beneficiosMedioambientales?.energia || 0), 0)
  };
  
  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Comunidades</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? '...' : totalComunidades}</div>
          <p className="text-xs text-muted-foreground">
            Comunidades gestionadas
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Viviendas</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? '...' : totalViviendas}</div>
          <p className="text-xs text-muted-foreground">
            Total viviendas registradas
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Litros Recogidos</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{loading ? '...' : `${totalLitros}L`}</div>
          <p className="text-xs text-muted-foreground">
            Total aceite recogido
          </p>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Impacto Ambiental</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-sm">
            <p><span className="font-semibold">CO2:</span> {loading ? '...' : `${totalImpacto.co2.toFixed(1)}kg`}</p>
            <p><span className="font-semibold">Agua:</span> {loading ? '...' : `${totalImpacto.agua.toFixed(1)}L`}</p>
            <p><span className="font-semibold">Energía:</span> {loading ? '...' : `${totalImpacto.energia.toFixed(1)}kWh`}</p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdministradorDashboardOverview;

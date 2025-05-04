
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { useComunidadesVecinos } from '@/hooks/useComunidadesVecinos';
import { useUsuarios } from '@/hooks/useUsuarios';
import { Chart } from '@/components/ui/chart';
import { Building, Users, Droplet, Workflow } from 'lucide-react';
import { useRecogidas } from '@/hooks/useRecogidas';

const AdministradorDashboardOverview = () => {
  const { comunidades, loading } = useComunidadesVecinos();
  const { usuarios, loading: loadingUsuarios } = useUsuarios();
  const { recogidas, getTotalLitrosRecogidos } = useRecogidas();
  
  const totalComunidades = comunidades.length;
  const totalViviendas = comunidades.reduce((acc, com) => acc + (com.numViviendas || 0), 0);
  
  // Get total litros from recogidas
  const totalLitros = getTotalLitrosRecogidos();
  
  // Clientes asociados a las comunidades de este administrador
  const clientesActivos = usuarios.filter(u => u.activo && u.tipo === 'comunidad').length;
  
  // Calculate total environmental impact
  const totalImpacto = {
    co2: comunidades.reduce((acc, com) => {
      const beneficios = com.beneficiosMedioambientales || {};
      // Check co2Evitado and co2Reducido first, fall back to co2
      const co2Value = beneficios.co2Evitado !== undefined 
        ? beneficios.co2Evitado 
        : (beneficios.co2Reducido !== undefined 
          ? beneficios.co2Reducido 
          : beneficios.co2 || 0);
      return acc + co2Value;
    }, 0),
    agua: comunidades.reduce((acc, com) => {
      const beneficios = com.beneficiosMedioambientales || {};
      // Check aguaAhorrada first, fall back to agua
      const aguaValue = beneficios.aguaAhorrada !== undefined
        ? beneficios.aguaAhorrada
        : beneficios.agua || 0;
      return acc + aguaValue;
    }, 0),
    energia: comunidades.reduce((acc, com) => {
      const beneficios = com.beneficiosMedioambientales || {};
      // Check energiaAhorrada first, fall back to energia
      const energiaValue = beneficios.energiaAhorrada !== undefined
        ? beneficios.energiaAhorrada
        : beneficios.energia || 0;
      return acc + energiaValue;
    }, 0)
  };
  
  // Prepare chart data
  const litrosChartData = {
    labels: comunidades.slice(0, 10).map(c => c.nombre),
    datasets: [
      {
        label: 'Litros recogidos',
        data: comunidades.slice(0, 10).map(c => c.litrosRecogidos || 0),
        backgroundColor: 'rgba(34, 197, 94, 0.6)',
        borderWidth: 1,
      },
    ],
  };
  
  // Monthly trend data (mock data, replace with real data if available)
  const monthlyTrendData = {
    labels: ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun'],
    datasets: [
      {
        label: 'Aceite recogido mensual',
        data: [65, 78, 90, 85, 95, 110],
        borderColor: 'rgb(34, 197, 94)',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        fill: true,
        tension: 0.4,
      },
    ],
  };
  
  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Comunidades</CardTitle>
            <Building className="h-4 w-4 text-muted-foreground" />
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
            <Users className="h-4 w-4 text-muted-foreground" />
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
            <Droplet className="h-4 w-4 text-muted-foreground" />
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
            <CardTitle className="text-sm font-medium">Clientes</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{loadingUsuarios ? '...' : clientesActivos}</div>
            <p className="text-xs text-muted-foreground">
              Total clientes registrados
            </p>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle>Impacto Medioambiental</CardTitle>
          <CardDescription>Beneficios totales de las recogidas</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="p-4 bg-green-50 rounded-md">
              <p className="text-sm text-muted-foreground">CO2 no emitido</p>
              <p className="text-2xl font-bold text-green-600">
                {loading ? '...' : `${totalImpacto.co2.toFixed(1)}kg`}
              </p>
            </div>
            <div className="p-4 bg-blue-50 rounded-md">
              <p className="text-sm text-muted-foreground">Agua no contaminada</p>
              <p className="text-2xl font-bold text-blue-600">
                {loading ? '...' : `${totalImpacto.agua.toFixed(1)}L`}
              </p>
            </div>
            <div className="p-4 bg-amber-50 rounded-md">
              <p className="text-sm text-muted-foreground">Energía ahorrada</p>
              <p className="text-2xl font-bold text-amber-600">
                {loading ? '...' : `${totalImpacto.energia.toFixed(1)}kWh`}
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Litros por Comunidad</CardTitle>
            <CardDescription>
              Top 10 comunidades por litros recogidos
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Chart
              type="bar"
              data={litrosChartData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
              className="h-80"
            />
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Evolución mensual</CardTitle>
            <CardDescription>
              Litros de aceite recogidos por mes
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Chart
              type="line"
              data={monthlyTrendData}
              options={{
                maintainAspectRatio: false,
                plugins: {
                  legend: {
                    display: false,
                  },
                },
              }}
              className="h-80"
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default AdministradorDashboardOverview;

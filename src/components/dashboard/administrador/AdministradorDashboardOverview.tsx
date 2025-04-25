
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Legend, PieChart, Pie, Cell } from "recharts";
import { ComunidadVecinos } from "@/types";
import { Building, Activity, Users } from "lucide-react";

interface AdministradorDashboardOverviewProps {
  comunidades: ComunidadVecinos[];
  loading: boolean;
}

const AdministradorDashboardOverview: React.FC<AdministradorDashboardOverviewProps> = ({
  comunidades,
  loading
}) => {
  // Calculate total statistics
  const totalComunidades = comunidades.length;
  const totalViviendas = comunidades.reduce((acc, com) => acc + com.totalViviendas, 0);
  const totalLitrosRecogidos = comunidades.reduce((acc, com) => acc + com.litrosRecogidos, 0);
  
  const totalBeneficios = {
    co2Evitado: comunidades.reduce((acc, com) => acc + (com.beneficiosMedioambientales?.co2Evitado || 0), 0),
    aguaAhorrada: comunidades.reduce((acc, com) => acc + (com.beneficiosMedioambientales?.aguaAhorrada || 0), 0),
    energiaAhorrada: comunidades.reduce((acc, com) => acc + (com.beneficiosMedioambientales?.energiaAhorrada || 0), 0),
  };

  // Prepare chart data
  const comunidadesBarData = comunidades
    .sort((a, b) => b.litrosRecogidos - a.litrosRecogidos)
    .slice(0, 5)
    .map((com) => ({
      nombre: com.nombre.length > 20 ? com.nombre.substring(0, 20) + "..." : com.nombre,
      litrosRecogidos: com.litrosRecogidos,
    }));

  const impactData = [
    { name: "CO2 Evitado (kg)", value: totalBeneficios.co2Evitado, color: "#10B981" },
    { name: "Agua Ahorrada (L)", value: totalBeneficios.aguaAhorrada, color: "#3B82F6" },
    { name: "Energía Ahorrada (kWh)", value: totalBeneficios.energiaAhorrada, color: "#8B5CF6" },
  ];

  const COLORS = ["#10B981", "#3B82F6", "#8B5CF6"];

  return (
    <div className="space-y-6">
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <p>Cargando datos...</p>
        </div>
      ) : (
        <>
          <div className="grid gap-4 md:grid-cols-3">
            <Card className="border-l-4 border-l-purple-500">
              <CardHeader className="pb-2">
                <CardDescription>Total de Comunidades</CardDescription>
                <CardTitle className="text-3xl font-bold">{totalComunidades}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground flex items-center">
                  <Building className="mr-1 h-4 w-4" />
                  Comunidades gestionadas
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader className="pb-2">
                <CardDescription>Total de Viviendas</CardDescription>
                <CardTitle className="text-3xl font-bold">{totalViviendas}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground flex items-center">
                  <Users className="mr-1 h-4 w-4" />
                  Viviendas administradas
                </div>
              </CardContent>
            </Card>
            
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-2">
                <CardDescription>Litros de Aceite Recogidos</CardDescription>
                <CardTitle className="text-3xl font-bold">{totalLitrosRecogidos}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-muted-foreground flex items-center">
                  <Activity className="mr-1 h-4 w-4" />
                  Litros totales
                </div>
              </CardContent>
            </Card>
          </div>
          
          <div className="grid gap-6 md:grid-cols-2">
            <Card className="md:col-span-2 overflow-hidden border-purple-100">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                <CardTitle className="text-xl text-purple-800">Comunidades con Mayor Recogida</CardTitle>
                <CardDescription>
                  Las 5 comunidades con mayor volumen de aceite recogido
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {comunidadesBarData.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No hay datos de recogidas disponibles
                    </p>
                  </div>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={comunidadesBarData}>
                        <XAxis dataKey="nombre" />
                        <YAxis label={{ value: 'Litros', angle: -90, position: 'insideLeft' }} />
                        <Tooltip />
                        <Legend />
                        <Bar dataKey="litrosRecogidos" name="Litros Recogidos" fill="#8B5CF6" />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-purple-100">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                <CardTitle className="text-xl text-purple-800">Impacto Medioambiental</CardTitle>
                <CardDescription>
                  Distribución del impacto positivo del reciclaje
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                {totalLitrosRecogidos === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-muted-foreground">
                      No hay datos de impacto disponibles
                    </p>
                  </div>
                ) : (
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={impactData}
                          cx="50%"
                          cy="50%"
                          outerRadius={80}
                          fill="#8884d8"
                          dataKey="value"
                          label={({ name, percent }) => `${name}: ${(percent * 100).toFixed(0)}%`}
                        >
                          {impactData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Legend />
                        <Tooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                )}
              </CardContent>
            </Card>
            
            <Card className="overflow-hidden border-purple-100">
              <CardHeader className="bg-gradient-to-r from-purple-50 to-blue-50">
                <CardTitle className="text-xl text-purple-800">Resumen de Beneficios</CardTitle>
                <CardDescription>
                  Beneficios medioambientales totales
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <div className="space-y-6">
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="w-3 h-3 inline-block bg-green-500 rounded-full mr-2"></span>
                        <span>CO2 Evitado</span>
                      </div>
                      <span className="font-semibold">{totalBeneficios.co2Evitado.toLocaleString()} kg</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-green-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="w-3 h-3 inline-block bg-blue-500 rounded-full mr-2"></span>
                        <span>Agua Ahorrada</span>
                      </div>
                      <span className="font-semibold">{totalBeneficios.aguaAhorrada.toLocaleString()} L</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-blue-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                  
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <span className="w-3 h-3 inline-block bg-purple-500 rounded-full mr-2"></span>
                        <span>Energía Ahorrada</span>
                      </div>
                      <span className="font-semibold">{totalBeneficios.energiaAhorrada.toLocaleString()} kWh</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div className="bg-purple-500 h-2 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </>
      )}
    </div>
  );
};

export default AdministradorDashboardOverview;

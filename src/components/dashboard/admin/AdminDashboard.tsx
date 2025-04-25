
import React from "react";
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from "@/components/ui/card";
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from "@/components/ui/tabs";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";

const AdminDashboard = () => {
  const data = [
    { name: "Ene", litros: 400 },
    { name: "Feb", litros: 500 },
    { name: "Mar", litros: 600 },
    { name: "Abr", litros: 540 },
    { name: "May", litros: 680 },
    { name: "Jun", litros: 720 },
  ];

  const summaryData = {
    totalClientes: 324,
    totalPuntosVerdes: 56,
    totalCentrosEscolares: 18,
    totalCallesApadrinadas: 42,
    litrosRecogidos: 4320,
    co2Evitado: 8640,
  };

  return (
    <div className="space-y-6">
      <h2 className="text-3xl font-bold tracking-tight">Panel de Control</h2>
      
      <Tabs defaultValue="vista-general" className="space-y-6">
        <TabsList>
          <TabsTrigger value="vista-general">Vista General</TabsTrigger>
          <TabsTrigger value="puntos-verdes">Puntos Verdes</TabsTrigger>
          <TabsTrigger value="alianza-escolar">Alianza Escolar</TabsTrigger>
          <TabsTrigger value="calles-apadrinadas">Calles Apadrinadas</TabsTrigger>
          <TabsTrigger value="estadisticas">Estadísticas</TabsTrigger>
        </TabsList>
        
        <TabsContent value="vista-general" className="space-y-6">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-3">
            <Card className="futuristic-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold">
                  Clientes Activos
                </CardTitle>
                <CardDescription>Total de clientes registrados</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-asram">
                  {summaryData.totalClientes}
                </div>
                <p className="text-xs text-muted-foreground">
                  +24 nuevos clientes este mes
                </p>
              </CardContent>
            </Card>
            
            <Card className="futuristic-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold">
                  Puntos Verdes
                </CardTitle>
                <CardDescription>Contenedores activos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-asram">
                  {summaryData.totalPuntosVerdes}
                </div>
                <p className="text-xs text-muted-foreground">
                  +5 nuevos puntos este mes
                </p>
              </CardContent>
            </Card>
            
            <Card className="futuristic-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold">
                  Litros Recogidos
                </CardTitle>
                <CardDescription>Aceite usado procesado</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-asram">
                  {summaryData.litrosRecogidos}L
                </div>
                <p className="text-xs text-muted-foreground">
                  +320L desde el mes anterior
                </p>
              </CardContent>
            </Card>
            
            <Card className="futuristic-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold">
                  CO2 Evitado
                </CardTitle>
                <CardDescription>Impacto medioambiental</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-green-600">
                  {summaryData.co2Evitado}kg
                </div>
                <p className="text-xs text-muted-foreground">
                  Equivalente a 3 árboles plantados
                </p>
              </CardContent>
            </Card>
            
            <Card className="futuristic-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold">
                  Alianza Verde Escolar
                </CardTitle>
                <CardDescription>Centros participantes</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-asram">
                  {summaryData.totalCentrosEscolares}
                </div>
                <p className="text-xs text-muted-foreground">
                  2 nuevos este mes
                </p>
              </CardContent>
            </Card>
            
            <Card className="futuristic-card">
              <CardHeader className="pb-2">
                <CardTitle className="text-2xl font-bold">
                  Calles Apadrinadas
                </CardTitle>
                <CardDescription>Calles con padrinos</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="text-4xl font-bold text-asram">
                  {summaryData.totalCallesApadrinadas}
                </div>
                <p className="text-xs text-muted-foreground">
                  +3 desde el mes anterior
                </p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle>Estadísticas de Recogida</CardTitle>
              <CardDescription>Litros de aceite recogidos durante los últimos 6 meses</CardDescription>
            </CardHeader>
            <CardContent className="pl-2">
              <ResponsiveContainer width="100%" height={350}>
                <BarChart
                  data={data}
                  margin={{
                    top: 5,
                    right: 30,
                    left: 20,
                    bottom: 5,
                  }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="litros" fill="#EE970D" name="Litros recogidos" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="puntos-verdes">
          <p className="text-center text-muted-foreground py-8">
            Sección de gestión de Puntos Verdes cargando...
          </p>
          {/* Here we would include the Puntos Verdes management component */}
        </TabsContent>
        
        <TabsContent value="alianza-escolar">
          <p className="text-center text-muted-foreground py-8">
            Sección de gestión de la Alianza Verde Escolar cargando...
          </p>
          {/* Here we would include the Alianza Verde Escolar management component */}
        </TabsContent>
        
        <TabsContent value="calles-apadrinadas">
          <p className="text-center text-muted-foreground py-8">
            Sección de gestión de Calles Apadrinadas cargando...
          </p>
          {/* Here we would include the Calles Apadrinadas management component */}
        </TabsContent>
        
        <TabsContent value="estadisticas">
          <p className="text-center text-muted-foreground py-8">
            Sección de reportes y estadísticas cargando...
          </p>
          {/* Here we would include the statistics and reports component */}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default AdminDashboard;

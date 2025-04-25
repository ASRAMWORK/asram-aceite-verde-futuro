import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { PieChart, Pie, Cell, ResponsiveContainer, Legend, Tooltip } from "recharts";

const UserDashboard = () => {
  const impactData = [
    { name: "CO2 Evitado", value: 540, color: "#10B981" },
    { name: "Agua Ahorrada", value: 360, color: "#3B82F6" },
    { name: "Energía Ahorrada", value: 250, color: "#EE970D" },
  ];

  const COLORS = ["#10B981", "#3B82F6", "#EE970D"];

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Panel de Usuario</h2>
          <p className="text-muted-foreground">
            Bienvenido de nuevo, gestiona tus recogidas de aceite
          </p>
        </div>
        <Button className="bg-asram hover:bg-asram-700">
          Solicitar Recogida
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="futuristic-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Aceite Reciclado
            </CardTitle>
            <CardDescription>Total acumulado</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-asram">28L</div>
            <p className="text-xs text-muted-foreground">
              +5L desde la última recogida
            </p>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Próxima Recogida
            </CardTitle>
            <CardDescription>Fecha programada</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-xl font-bold text-asram">15 Mayo 2025</div>
            <p className="text-xs text-muted-foreground">
              En 21 días
            </p>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              CO2 Evitado
            </CardTitle>
            <CardDescription>Impacto ambiental</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-green-600">56kg</div>
            <p className="text-xs text-muted-foreground">
              Equivalente a 15 árboles por día
            </p>
          </CardContent>
        </Card>
        
        <Card className="futuristic-card">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">
              Agua Ahorrada
            </CardTitle>
            <CardDescription>Litros no contaminados</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-blue-600">28000L</div>
            <p className="text-xs text-muted-foreground">
              1000L por cada litro de aceite
            </p>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="perfil" className="space-y-6">
        <TabsList>
          <TabsTrigger value="perfil">Perfil</TabsTrigger>
          <TabsTrigger value="recursos">Recursos</TabsTrigger>
          <TabsTrigger value="alianza-verde">Alianza Verde Escolar</TabsTrigger>
          <TabsTrigger value="apadrina">Apadrina una Calle</TabsTrigger>
          <TabsTrigger value="puntos-verdes">Puntos Verdes</TabsTrigger>
        </TabsList>
        
        <TabsContent value="perfil" className="space-y-6">
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle>Tu Impacto Medioambiental</CardTitle>
              <CardDescription>
                Distribución del impacto positivo de tu reciclaje
              </CardDescription>
            </CardHeader>
            <CardContent className="h-80">
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
            </CardContent>
          </Card>
          
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle>Tus Datos Personales</CardTitle>
              <CardDescription>
                Información personal y de contacto
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Nombre</p>
                  <p className="font-medium">Juan Pérez</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Email</p>
                  <p className="font-medium">juan.perez@example.com</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Dirección</p>
                  <p className="font-medium">Calle Gran Vía, 15</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Teléfono</p>
                  <p className="font-medium">+34 612 345 678</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Distrito</p>
                  <p className="font-medium">Centro</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-muted-foreground">Barrio</p>
                  <p className="font-medium">Sol</p>
                </div>
              </div>
              
              <div className="pt-4">
                <Button variant="outline">Editar perfil</Button>
              </div>
            </CardContent>
          </Card>
          
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle>Historial de Recogidas</CardTitle>
              <CardDescription>
                Últimas recogidas de aceite realizadas
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">10 Mar 2025</p>
                    <p className="text-sm text-muted-foreground">10L recogidos</p>
                  </div>
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-700 border-green-200">
                    Completado
                  </span>
                </div>
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">15 Feb 2025</p>
                    <p className="text-sm text-muted-foreground">8L recogidos</p>
                  </div>
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-700 border-green-200">
                    Completado
                  </span>
                </div>
                
                <div className="flex items-center justify-between border-b pb-4">
                  <div>
                    <p className="font-medium">20 Ene 2025</p>
                    <p className="text-sm text-muted-foreground">10L recogidos</p>
                  </div>
                  <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold bg-green-50 text-green-700 border-green-200">
                    Completado
                  </span>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        {/* Other tab contents would be implemented in a complete app */}
        <TabsContent value="recursos">
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle>Recursos Disponibles</CardTitle>
              <CardDescription>
                Guías y formaciones gratuitas para el reciclaje de aceite
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Sección de recursos cargando...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alianza-verde">
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle>Alianza Verde Escolar</CardTitle>
              <CardDescription>
                Programa educativo para centros escolares
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Sección de Alianza Verde Escolar cargando...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="apadrina">
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle>Apadrina una Calle</CardTitle>
              <CardDescription>
                Programa de suscripción para apadrinar calles
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Sección de Apadrina una Calle cargando...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="puntos-verdes">
          <Card className="futuristic-card">
            <CardHeader>
              <CardTitle>Puntos Verdes</CardTitle>
              <CardDescription>
                Información sobre puntos de recogida de aceite
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p className="text-center text-muted-foreground py-8">
                Sección de Puntos Verdes cargando...
              </p>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default UserDashboard;

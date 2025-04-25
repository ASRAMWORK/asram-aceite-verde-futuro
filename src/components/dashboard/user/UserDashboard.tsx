
import React, { useState, useEffect } from "react";
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
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

import UserProfileView from "./profile/UserProfileView";
import RecursosView from "./recursos/RecursosView";
import AlianzaVerdeView from "./alianza/AlianzaVerdeView";
import ApadrinaCalleView from "./apadrina/ApadrinaCalleView";
import PuntosVerdesView from "./puntos/PuntosVerdesView";
import SolicitudRecogidaForm from "./solicitud/SolicitudRecogidaForm";

const UserDashboard = () => {
  const [showSolicitudDialog, setShowSolicitudDialog] = useState(false);
  const [currentTab, setCurrentTab] = useState("perfil");

  // Mock data for the chart
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
        <Button className="bg-asram hover:bg-asram-700" onClick={() => setShowSolicitudDialog(true)}>
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

      <Tabs defaultValue="perfil" className="space-y-6" value={currentTab} onValueChange={setCurrentTab}>
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
          
          <UserProfileView />
          
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
        
        <TabsContent value="recursos">
          <RecursosView />
        </TabsContent>
        
        <TabsContent value="alianza-verde">
          <AlianzaVerdeView />
        </TabsContent>
        
        <TabsContent value="apadrina">
          <ApadrinaCalleView />
        </TabsContent>
        
        <TabsContent value="puntos-verdes">
          <PuntosVerdesView />
        </TabsContent>
      </Tabs>

      {/* Dialog for Solicitud de Recogida */}
      <Dialog open={showSolicitudDialog} onOpenChange={setShowSolicitudDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Solicitar recogida de aceite</DialogTitle>
            <DialogDescription>
              Completa el formulario para programar una recogida de aceite usado
            </DialogDescription>
          </DialogHeader>
          <SolicitudRecogidaForm />
          <DialogFooter className="mt-4">
            <Button variant="outline" onClick={() => setShowSolicitudDialog(false)}>
              Cancelar
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default UserDashboard;

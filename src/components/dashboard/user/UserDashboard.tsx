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
import { DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";

import UserProfileView from "./profile/UserProfileView";
import RecursosView from "./recursos/RecursosView";
import AlianzaVerdeView from "./alianza/AlianzaVerdeView";
import ApadrinaCalleView from "./apadrina/ApadrinaCalleView";
import PuntosVerdesView from "./puntos/PuntosVerdesView";
import SolicitudRecogidaForm from "./solicitud/SolicitudRecogidaForm";
import HomeView from "./home/HomeView";
import { Activity, Home, UserCircle, BookOpen, School, MapPin, User } from "lucide-react";
import RecogidaCalendar from "@/components/calendario/RecogidaCalendar";

const UserDashboard = () => {
  const [currentTab, setCurrentTab] = useState("home");

  useEffect(() => {
    setCurrentTab("home");
  }, []);

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
        <Button className="bg-asram hover:bg-asram-700">
          Solicitar Recogida
        </Button>
      </div>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid grid-cols-7 h-auto p-1 max-w-3xl">
          <TabsTrigger value="home" className="flex items-center gap-2 py-2">
            <Home className="h-4 w-4" />
            <span className="hidden md:inline">Home</span>
          </TabsTrigger>
          <TabsTrigger value="dashboard" className="flex items-center gap-2 py-2">
            <Activity className="h-4 w-4" />
            <span className="hidden md:inline">Dashboard</span>
          </TabsTrigger>
          <TabsTrigger value="perfil" className="flex items-center gap-2 py-2">
            <UserCircle className="h-4 w-4" />
            <span className="hidden md:inline">Perfil</span>
          </TabsTrigger>
          <TabsTrigger value="recursos" className="flex items-center gap-2 py-2">
            <BookOpen className="h-4 w-4" />
            <span className="hidden md:inline">Recursos</span>
          </TabsTrigger>
          <TabsTrigger value="alianza-verde" className="flex items-center gap-2 py-2">
            <School className="h-4 w-4" />
            <span className="hidden md:inline">Alianza</span>
          </TabsTrigger>
          <TabsTrigger value="apadrina" className="flex items-center gap-2 py-2">
            <MapPin className="h-4 w-4" />
            <span className="hidden md:inline">Apadrina</span>
          </TabsTrigger>
          <TabsTrigger value="puntos-verdes" className="flex items-center gap-2 py-2">
            <User className="h-4 w-4" />
            <span className="hidden md:inline">Puntos</span>
          </TabsTrigger>
        </TabsList>
        
        <TabsContent value="home" className="animate-fade-in">
          <HomeView />
        </TabsContent>
        
        <TabsContent value="dashboard" className="space-y-6 animate-fade-in">
          <Card className="overflow-hidden border-green-100">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
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
          
          <Card className="overflow-hidden border-green-100">
            <CardHeader className="bg-gradient-to-r from-green-50 to-blue-50">
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
        
        <TabsContent value="perfil" className="animate-fade-in">
          <UserProfileView />
        </TabsContent>
        
        <TabsContent value="recursos" className="animate-fade-in">
          <RecursosView />
        </TabsContent>
        
        <TabsContent value="alianza-verde" className="animate-fade-in">
          <AlianzaVerdeView />
        </TabsContent>
        
        <TabsContent value="apadrina" className="animate-fade-in">
          <ApadrinaCalleView />
        </TabsContent>
        
        <TabsContent value="puntos-verdes" className="animate-fade-in">
          <PuntosVerdesView />
        </TabsContent>
      </Tabs>

      <RecogidaCalendar isAdmin={false} />

      {/* Dialog Content for Solicitud de Recogida */}
      <DialogContent className="sm:max-w-[550px]">
        <DialogHeader>
          <DialogTitle>Solicitar recogida de aceite</DialogTitle>
          <DialogDescription>
            Completa el formulario para programar una recogida de aceite usado
          </DialogDescription>
        </DialogHeader>
        <SolicitudRecogidaForm />
        <DialogFooter className="mt-4 gap-2">
          <Button variant="outline">
            Cancelar
          </Button>
        </DialogFooter>
      </DialogContent>
    </div>
  );
};

export default UserDashboard;

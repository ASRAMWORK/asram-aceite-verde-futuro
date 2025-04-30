
import React from "react";
import HeroSection from "./components/HeroSection";
import StatsOverview from "./components/StatsOverview";
import ImpactCharts from "./components/ImpactCharts";
import ServiceFeatures from "./components/ServiceFeatures";
import RecogidaCalendar from "@/components/calendario/RecogidaCalendar";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { CalendarDays, BarChart, Info } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";

const HomeView = () => {
  return (
    <div className="space-y-8">
      <HeroSection />
      <StatsOverview />
      
      <Tabs defaultValue="impact" className="space-y-6">
        <div className="flex justify-center">
          <TabsList>
            <TabsTrigger value="impact" className="flex items-center gap-1">
              <BarChart className="h-4 w-4" />
              <span>Impacto Ambiental</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-1">
              <CalendarDays className="h-4 w-4" />
              <span>Calendario</span>
            </TabsTrigger>
            <TabsTrigger value="services" className="flex items-center gap-1">
              <Info className="h-4 w-4" />
              <span>Servicios</span>
            </TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="impact" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">Tu Impacto Ambiental</CardTitle>
              <CardDescription>
                Visualización de tu contribución al medio ambiente
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ImpactCharts />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="calendar" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">Calendario de Recogidas</CardTitle>
              <CardDescription>
                Fechas programadas para la recogida de aceite en tu zona
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-4">
              <RecogidaCalendar />
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="services" className="mt-0">
          <Card>
            <CardHeader className="pb-2">
              <CardTitle className="text-2xl font-bold">Nuestros Servicios</CardTitle>
              <CardDescription>
                Descubre todos los servicios que ofrecemos
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ServiceFeatures />
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
        <CardHeader>
          <CardTitle className="text-xl text-amber-800">Beneficios e Impacto Ambiental</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mb-4">
                <Droplet className="w-6 h-6 text-green-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Reducción de la contaminación</h3>
              <p className="text-gray-600 text-sm">
                Un solo litro de aceite usado puede llegar a contaminar más de 1.000 L de agua.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center mb-4">
                <RecycleIcon className="w-6 h-6 text-blue-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Economía circular</h3>
              <p className="text-gray-600 text-sm">
                Convierte un residuo doméstico en recurso útil, generando empleo verde y apoyando a personas en riesgo de exclusión social.
              </p>
            </div>
            
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-12 h-12 rounded-full bg-purple-100 flex items-center justify-center mb-4">
                <BookOpen className="w-6 h-6 text-purple-600" />
              </div>
              <h3 className="font-bold text-lg mb-2">Concienciación educativa</h3>
              <p className="text-gray-600 text-sm">
                A través de talleres y campañas vinculadas a los Puntos Verdes, se fomenta la responsabilidad ambiental en toda la comunidad.
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default HomeView;


import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { motion } from "framer-motion";
import { Home, Users, RecycleIcon, Calendar, MapPin, Droplet, Heart, GraduationCap } from "lucide-react";
import StatsSection from "@/components/home/StatsSection";
import ImpactMetrics from "@/components/home/ImpactMetrics";
import ServiceInfo from "@/components/home/ServiceInfo";
import ProgramHighlights from "@/components/home/ProgramHighlights";

const Index = () => {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <main>
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="container mx-auto px-4 py-8"
        >
          <div className="mb-8 space-y-4">
            <motion.div 
              initial={{ y: -20 }}
              animate={{ y: 0 }}
            >
              <h1 className="text-4xl font-bold text-asram-800">
                ASRAM - Aceite Usado
              </h1>
              <p className="text-gray-600">
                Transformando residuos en recursos sostenibles
              </p>
            </motion.div>

            <StatsSection />
          </div>

          <Tabs defaultValue="inicio" className="space-y-6">
            <TabsList className="inline-flex h-auto p-1 bg-muted gap-2">
              <TabsTrigger value="inicio" className="flex items-center gap-2 px-4 py-2">
                <Home className="h-4 w-4" />
                <span>Inicio</span>
              </TabsTrigger>
              <TabsTrigger value="alianza" className="flex items-center gap-2 px-4 py-2">
                <Users className="h-4 w-4" />
                <span>Alianza Verde</span>
              </TabsTrigger>
              <TabsTrigger value="apadrina" className="flex items-center gap-2 px-4 py-2">
                <MapPin className="h-4 w-4" />
                <span>Apadrina Calle</span>
              </TabsTrigger>
              <TabsTrigger value="recogida" className="flex items-center gap-2 px-4 py-2">
                <RecycleIcon className="h-4 w-4" />
                <span>Recogida</span>
              </TabsTrigger>
              <TabsTrigger value="reunion" className="flex items-center gap-2 px-4 py-2">
                <Calendar className="h-4 w-4" />
                <span>Reuniones</span>
              </TabsTrigger>
            </TabsList>

            <TabsContent value="inicio" className="space-y-6">
              <ImpactMetrics />
              <ProgramHighlights />
            </TabsContent>

            <TabsContent value="alianza" className="space-y-6">
              <ServiceInfo 
                title="Alianza Verde"
                description="Programa de colaboración para la gestión sostenible del aceite usado"
                icon={Users}
              />
            </TabsContent>

            <TabsContent value="apadrina" className="space-y-6">
              <ServiceInfo 
                title="Apadrina una Calle"
                description="Programa para transformar la gestión de residuos en zonas urbanas"
                icon={Heart}
              />
            </TabsContent>

            <TabsContent value="recogida" className="space-y-6">
              <ServiceInfo 
                title="Servicio de Recogida"
                description="Gestión eficiente de la recogida de aceite usado"
                icon={RecycleIcon}
              />
            </TabsContent>

            <TabsContent value="reunion" className="space-y-6">
              <ServiceInfo 
                title="Reuniones y Eventos"
                description="Participa en nuestras actividades comunitarias"
                icon={Calendar}
              />
            </TabsContent>
          </Tabs>
        </motion.div>
      </main>
    </div>
  );
};

export default Index;

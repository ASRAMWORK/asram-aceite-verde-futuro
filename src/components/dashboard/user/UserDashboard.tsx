
import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";
import { useUserProfile } from "@/hooks/useUserProfile";
import { Home, Users, RecycleIcon, Calendar, User, GraduationCap, MapPin, Droplet } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import HomeView from "./home/HomeView";
import AlianzaVerdeView from "./alianza/AlianzaVerdeView";
import ApadrinaCalleView from "./apadrina/ApadrinaCalleView";
import RecogidaAceiteView from "./recogida/RecogidaAceiteView";
import ReunionView from "./reunion/ReunionView";
import { useAuth } from "@/contexts/AuthContext";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { profile, loading } = useUserProfile();
  const { logout } = useAuth();

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-asram"></div>
      </div>
    );
  }

  return (
    <motion.div 
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100"
    >
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8 space-y-4">
          <motion.div 
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="flex justify-between items-center"
          >
            <div>
              <h1 className="text-4xl font-bold text-asram-800">
                Panel de Usuario
              </h1>
              <p className="text-gray-600">
                Bienvenido, {profile?.nombre || 'Usuario'}
              </p>
            </div>
            <Button onClick={logout} variant="destructive">
              Cerrar sesión
            </Button>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <RecycleIcon className="h-6 w-6 text-green-600" />
                  <span>Aceite Reciclado</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-700">25L</div>
                <p className="text-sm text-green-600">Este mes</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <Droplet className="h-6 w-6 text-blue-600" />
                  <span>Agua Ahorrada</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-700">25,000L</div>
                <p className="text-sm text-blue-600">Impacto total</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200">
              <CardHeader className="space-y-1">
                <CardTitle className="text-2xl flex items-center gap-2">
                  <GraduationCap className="h-6 w-6 text-purple-600" />
                  <span>Puntos Verdes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-700">150</div>
                <p className="text-sm text-purple-600">Puntos acumulados</p>
              </CardContent>
            </Card>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="inline-flex h-auto p-1 bg-muted gap-2">
            <TabsTrigger value="home" className="flex items-center gap-2 px-4 py-2">
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

          <TabsContent value="home" className="space-y-6">
            <HomeView />
          </TabsContent>

          <TabsContent value="alianza" className="space-y-6">
            <AlianzaVerdeView />
          </TabsContent>

          <TabsContent value="apadrina" className="space-y-6">
            <ApadrinaCalleView />
          </TabsContent>

          <TabsContent value="recogida" className="space-y-6">
            <RecogidaAceiteView />
          </TabsContent>

          <TabsContent value="reunion" className="space-y-6">
            <ReunionView />
          </TabsContent>
        </Tabs>
      </div>
    </motion.div>
  );
};

export default UserDashboard;

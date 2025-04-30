
import React, { useState, useEffect } from "react";
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
import { 
  Home, 
  Users, 
  RecycleIcon, 
  User, 
  GraduationCap, 
  MapPin, 
  Droplet, 
  BookOpen,
  CalendarDays,
  Award
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import HomeView from "./home/HomeView";
import AlianzaVerdeView from "./alianza/AlianzaVerdeView";
import ApadrinaCalleView from "./apadrina/ApadrinaCalleView";
import RecogidaAceiteView from "./recogida/RecogidaAceiteView";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useRecogidas } from "@/hooks/useRecogidas";
import { toast } from "sonner";
import RecursosView from "./recursos/RecursosView";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const UserDashboard = () => {
  const [activeTab, setActiveTab] = useState("home");
  const { profile, loading } = useUserProfile();
  const { logout } = useAuth();
  const navigate = useNavigate();
  const { getTotalLitrosRecogidos } = useRecogidas();
  
  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
      toast.success("Sesión cerrada correctamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#ee970d]"></div>
      </div>
    );
  }

  // Safely access profile properties with fallbacks
  const litrosAportados = profile?.litrosAportados || 0;
  const puntosVerdes = profile?.puntosVerdes || 0;
  const nombreUsuario = profile?.nombre || 'Usuario';
  const avatarInitial = nombreUsuario.charAt(0).toUpperCase();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <div className="rounded-full bg-[#ee970d] w-10 h-10 flex items-center justify-center text-white font-bold">
              ASRAM
            </div>
            <span className="text-xl font-bold text-gray-800">Panel de Usuario</span>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-gray-600">¡Bienvenido!</span>
              <span className="font-medium">{nombreUsuario}</span>
            </div>
            <Avatar className="h-8 w-8 border-2 border-[#ee970d]">
              <AvatarImage src={profile?.photoURL || undefined} alt={nombreUsuario} />
              <AvatarFallback className="bg-[#ee970d] text-white">{avatarInitial}</AvatarFallback>
            </Avatar>
            <Button onClick={handleLogout} variant="outline" size="sm" className="text-red-500 border-red-200 hover:bg-red-50">
              Cerrar sesión
            </Button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-6 space-y-6">
        {/* Stats Overview Cards */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-green-50 to-green-100 border-green-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <RecycleIcon className="h-24 w-24 text-green-700" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <RecycleIcon className="h-5 w-5 text-green-600" />
                  <span>Aceite Reciclado</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-600">{litrosAportados}L</div>
                <p className="text-sm text-green-700">Tu contribución al medio ambiente</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-blue-50 to-blue-100 border-blue-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <Droplet className="h-24 w-24 text-blue-700" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Droplet className="h-5 w-5 text-blue-600" />
                  <span>Agua Ahorrada</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-blue-600">{litrosAportados * 1000}L</div>
                <p className="text-sm text-blue-700">Impacto positivo total</p>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <Award className="h-24 w-24 text-purple-700" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <GraduationCap className="h-5 w-5 text-purple-600" />
                  <span>Puntos Verdes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{puntosVerdes}</div>
                <p className="text-sm text-purple-700">Puntos acumulados para canjear</p>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="bg-white p-2 rounded-lg shadow-sm">
            <TabsList className="w-full grid grid-cols-2 md:flex md:justify-start gap-1 bg-gray-100/50">
              <TabsTrigger value="home" className="data-[state=active]:bg-[#ee970d] data-[state=active]:text-white">
                <Home className="h-4 w-4 mr-2" />
                <span>Inicio</span>
              </TabsTrigger>
              <TabsTrigger value="alianza" className="data-[state=active]:bg-[#ee970d] data-[state=active]:text-white">
                <Users className="h-4 w-4 mr-2" />
                <span>Alianza Verde</span>
              </TabsTrigger>
              <TabsTrigger value="apadrina" className="data-[state=active]:bg-[#ee970d] data-[state=active]:text-white">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Apadrina Calle</span>
              </TabsTrigger>
              <TabsTrigger value="recogida" className="data-[state=active]:bg-[#ee970d] data-[state=active]:text-white">
                <RecycleIcon className="h-4 w-4 mr-2" />
                <span>Recogida</span>
              </TabsTrigger>
              <TabsTrigger value="recursos" className="data-[state=active]:bg-[#ee970d] data-[state=active]:text-white">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>Recursos</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <TabsContent value="home" className="m-0">
              <HomeView />
            </TabsContent>

            <TabsContent value="alianza" className="m-0">
              <AlianzaVerdeView />
            </TabsContent>

            <TabsContent value="apadrina" className="m-0">
              <ApadrinaCalleView />
            </TabsContent>

            <TabsContent value="recogida" className="m-0">
              <RecogidaAceiteView />
            </TabsContent>

            <TabsContent value="recursos" className="m-0">
              <RecursosView />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t py-4 mt-8">
        <div className="container mx-auto px-4 text-center text-sm text-gray-500">
          <p>© {new Date().getFullYear()} ASRAM. Todos los derechos reservados.</p>
          <div className="flex justify-center gap-4 mt-2">
            <a href="#" className="hover:text-[#ee970d] transition-colors">Política de privacidad</a>
            <a href="#" className="hover:text-[#ee970d] transition-colors">Términos y condiciones</a>
            <a href="#" className="hover:text-[#ee970d] transition-colors">Contacto</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserDashboard;

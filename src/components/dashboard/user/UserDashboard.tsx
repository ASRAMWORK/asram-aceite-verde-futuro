
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
  RecycleIcon, 
  User,
  MapPin, 
  Droplet, 
  BookOpen,
  CalendarDays,
  Award,
  LogOut,
  Settings
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion } from "framer-motion";
import HomeView from "./home/HomeView";
import ApadrinaCalleView from "./apadrina/ApadrinaCalleView";
import RecogidaAceiteView from "./recogida/RecogidaAceiteView";
import { useAuth } from "@/contexts/AuthContext";
import { useNavigate } from "react-router-dom";
import { useRecogidas } from "@/hooks/useRecogidas";
import { toast } from "sonner";
import RecursosView from "./recursos/RecursosView";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import UserProfileView from "./profile/UserProfileView";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
      <div className="flex justify-center items-center h-screen bg-gray-50">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-[#ee970d]"></div>
      </div>
    );
  }

  // Safely access profile properties with fallbacks
  const litrosAportados = profile?.litrosAportados || 0;
  const puntosVerdes = profile?.puntosVerdes || 0;
  const nombreUsuario = profile?.nombre || 'Usuario';
  const apellidos = profile?.apellidos || '';
  const avatarInitial = nombreUsuario.charAt(0).toUpperCase();
  const displayName = `${nombreUsuario} ${apellidos}`;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header con nueva barra de navegación mejorada */}
      <header className="bg-white shadow-md sticky top-0 z-10">
        <div className="container mx-auto px-4 py-3 flex justify-between items-center">
          <div className="flex items-center gap-3">
            <div className="rounded-full bg-gradient-to-r from-[#ee970d] to-amber-500 w-10 h-10 flex items-center justify-center text-white font-bold shadow-sm">
              ASRAM
            </div>
            <div>
              <h1 className="text-xl font-bold text-gray-800">Panel de Usuario</h1>
              <p className="text-xs text-gray-500">ASRAM Madrid</p>
            </div>
          </div>
          
          <div className="flex items-center gap-4">
            <div className="hidden md:flex items-center gap-2">
              <span className="text-sm text-gray-600">¡Bienvenido!</span>
              <span className="font-medium">{nombreUsuario}</span>
            </div>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <button className="flex items-center gap-2 bg-gray-50 hover:bg-gray-100 transition-colors rounded-full p-1 pr-3">
                  <Avatar className="h-8 w-8 border-2 border-[#ee970d]">
                    <AvatarImage src={profile?.photoURL || undefined} alt={nombreUsuario} />
                    <AvatarFallback className="bg-[#ee970d] text-white">{avatarInitial}</AvatarFallback>
                  </Avatar>
                  <span className="text-sm font-medium hidden md:inline">{displayName}</span>
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel>Mi cuenta</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => setActiveTab("profile")} className="cursor-pointer">
                  <User className="w-4 h-4 mr-2" />
                  <span>Perfil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer">
                  <Settings className="w-4 h-4 mr-2" />
                  <span>Ajustes</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout} className="text-red-500 cursor-pointer">
                  <LogOut className="w-4 h-4 mr-2" />
                  <span>Cerrar sesión</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
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
                <div className="mt-2 w-full bg-green-200/50 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-green-500 h-full rounded-full" style={{ width: `${Math.min(litrosAportados/100 * 100, 100)}%` }}></div>
                </div>
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
                <div className="mt-2 w-full bg-blue-200/50 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-blue-500 h-full rounded-full" style={{ width: `${Math.min(litrosAportados/50 * 100, 100)}%` }}></div>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-gradient-to-br from-purple-50 to-purple-100 border-purple-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
              <div className="absolute top-0 right-0 p-2 opacity-10">
                <Award className="h-24 w-24 text-purple-700" />
              </div>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg font-medium flex items-center gap-2">
                  <Award className="h-5 w-5 text-purple-600" />
                  <span>Puntos Verdes</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-purple-600">{puntosVerdes}</div>
                <p className="text-sm text-purple-700">Puntos acumulados para canjear</p>
                <div className="mt-2 w-full bg-purple-200/50 h-1.5 rounded-full overflow-hidden">
                  <div className="bg-purple-500 h-full rounded-full" style={{ width: `${Math.min(puntosVerdes/100 * 100, 100)}%` }}></div>
                </div>
              </CardContent>
            </Card>
          </div>
        </motion.div>

        {/* Main Content con nuevo diseño */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <div className="bg-white p-3 rounded-lg shadow-sm">
            <TabsList className="w-full grid grid-cols-2 md:flex md:justify-start gap-2 bg-gray-100/50 p-1">
              <TabsTrigger value="home" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ee970d] data-[state=active]:to-amber-500 data-[state=active]:text-white">
                <Home className="h-4 w-4 mr-2" />
                <span>Inicio</span>
              </TabsTrigger>
              <TabsTrigger value="recogida" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ee970d] data-[state=active]:to-amber-500 data-[state=active]:text-white">
                <RecycleIcon className="h-4 w-4 mr-2" />
                <span>Recogida</span>
              </TabsTrigger>
              <TabsTrigger value="apadrina" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ee970d] data-[state=active]:to-amber-500 data-[state=active]:text-white">
                <MapPin className="h-4 w-4 mr-2" />
                <span>Apadrina Calle</span>
              </TabsTrigger>
              <TabsTrigger value="recursos" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ee970d] data-[state=active]:to-amber-500 data-[state=active]:text-white">
                <BookOpen className="h-4 w-4 mr-2" />
                <span>Recursos</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="data-[state=active]:bg-gradient-to-r data-[state=active]:from-[#ee970d] data-[state=active]:to-amber-500 data-[state=active]:text-white">
                <User className="h-4 w-4 mr-2" />
                <span>Mi Perfil</span>
              </TabsTrigger>
            </TabsList>
          </div>

          <div className="bg-white rounded-lg shadow-sm p-6">
            <TabsContent value="home" className="m-0">
              <HomeView />
            </TabsContent>

            <TabsContent value="recogida" className="m-0">
              <RecogidaAceiteView />
            </TabsContent>

            <TabsContent value="apadrina" className="m-0">
              <ApadrinaCalleView />
            </TabsContent>

            <TabsContent value="recursos" className="m-0">
              <RecursosView />
            </TabsContent>
            
            <TabsContent value="profile" className="m-0">
              <UserProfileView />
            </TabsContent>
          </div>
        </Tabs>
      </div>

      {/* Footer mejorado */}
      <footer className="bg-white border-t py-6 mt-8">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row justify-between items-center">
            <div className="mb-4 md:mb-0">
              <div className="flex items-center gap-2 mb-2">
                <div className="rounded-full bg-[#ee970d] w-8 h-8 flex items-center justify-center text-white font-bold text-xs">
                  ASRAM
                </div>
                <span className="text-lg font-bold">ASRAM Madrid</span>
              </div>
              <p className="text-sm text-gray-500">Asociación para el Reciclaje de Aceite de Madrid</p>
            </div>
            <div className="flex flex-wrap justify-center gap-6">
              <div>
                <h4 className="font-medium mb-2 text-sm">Enlaces</h4>
                <div className="flex flex-col gap-1">
                  <a href="#" className="text-sm text-gray-500 hover:text-[#ee970d] transition-colors">Inicio</a>
                  <a href="#" className="text-sm text-gray-500 hover:text-[#ee970d] transition-colors">Sobre nosotros</a>
                  <a href="#" className="text-sm text-gray-500 hover:text-[#ee970d] transition-colors">Contacto</a>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-sm">Legal</h4>
                <div className="flex flex-col gap-1">
                  <a href="#" className="text-sm text-gray-500 hover:text-[#ee970d] transition-colors">Política de privacidad</a>
                  <a href="#" className="text-sm text-gray-500 hover:text-[#ee970d] transition-colors">Términos y condiciones</a>
                  <a href="#" className="text-sm text-gray-500 hover:text-[#ee970d] transition-colors">Cookies</a>
                </div>
              </div>
              <div>
                <h4 className="font-medium mb-2 text-sm">Contáctanos</h4>
                <div className="flex flex-col gap-1">
                  <a href="mailto:info@asramadrid.com" className="text-sm text-gray-500 hover:text-[#ee970d] transition-colors">info@asramadrid.com</a>
                  <a href="tel:+34912345678" className="text-sm text-gray-500 hover:text-[#ee970d] transition-colors">+34 912 345 678</a>
                </div>
              </div>
            </div>
          </div>
          <div className="mt-6 pt-4 border-t border-gray-100 text-center">
            <p className="text-sm text-gray-500">© {new Date().getFullYear()} ASRAM. Todos los derechos reservados.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default UserDashboard;

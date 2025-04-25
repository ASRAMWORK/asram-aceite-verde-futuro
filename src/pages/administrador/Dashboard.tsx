
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { 
  User, UserCircle, BookOpen, School, MapPin, 
  Activity, LogOut, Home as HomeIcon, Building, Plus
} from "lucide-react";
import AdministradorDashboardContent from "@/components/dashboard/administrador/AdministradorDashboardContent";
import { useUserProfile } from "@/hooks/useUserProfile";

const AdministradorDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();
  const { profile } = useUserProfile();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }
      
      // Check if the user is an administrador
      try {
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (!userDoc.exists() || userDoc.data().role !== "administrador") {
          toast.error("No tienes permisos para acceder a este panel");
          navigate("/login");
        }
      } catch (error) {
        console.error("Error verificando rol:", error);
        navigate("/login");
      }
      
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, [navigate]);

  const handleSignOut = async () => {
    try {
      await auth.signOut();
      navigate("/login");
      toast.success("Sesión cerrada correctamente");
    } catch (error) {
      console.error("Error al cerrar sesión:", error);
      toast.error("Error al cerrar sesión");
    }
  };

  const handleTabChange = (tab) => {
    let tabValue = "home";
    switch(tab) {
      case "home": tabValue = "home"; break;
      case "dashboard": tabValue = "dashboard"; break;
      case "comunidades": tabValue = "comunidades"; break;
      case "gestionar": tabValue = "gestionar"; break;
      case "recursos": tabValue = "recursos"; break; 
      case "alianza": tabValue = "alianza-verde"; break;
      case "apadrina": tabValue = "apadrina"; break;
      case "puntos": tabValue = "puntos-verdes"; break;
      default: tabValue = "home";
    }
    setActiveTab(tabValue);
  };

  if (loading) {
    return (
      <div className="min-h-screen dash-gradient flex items-center justify-center">
        <p className="text-lg">Cargando...</p>
      </div>
    );
  }

  return (
    <Dialog>
      <div className="flex min-h-screen bg-gray-50">
        <div className="hidden md:flex flex-col w-72 bg-white border-r shadow-sm">
          <div className="p-6 flex items-center justify-center">
            <h1 className="text-2xl font-bold text-purple-600">ASRAM Admin Fincas</h1>
          </div>
          
          <div className="p-4">
            <div className="bg-gray-100 p-4 rounded-lg mb-4 flex items-center space-x-3">
              <div className="bg-purple-600 text-white p-2 rounded-full">
                <Building className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-sm">Bienvenido</p>
                <p className="text-xs text-gray-500">{profile?.nombreAdministracion || "Administrador de Fincas"}</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-4 pb-6 space-y-1.5 overflow-auto">
            <Button
              variant={activeTab === "home" ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "home" ? "bg-purple-600 hover:bg-purple-700" : ""
              }`}
              onClick={() => handleTabChange("home")}
            >
              <HomeIcon className="mr-3 h-5 w-5" />
              Inicio
            </Button>
            
            <Button
              variant={activeTab === "dashboard" ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "dashboard" ? "bg-purple-600 hover:bg-purple-700" : ""
              }`}
              onClick={() => handleTabChange("dashboard")}
            >
              <Activity className="mr-3 h-5 w-5" />
              Dashboard
            </Button>
            
            <Button
              variant={activeTab === "comunidades" ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "comunidades" ? "bg-purple-600 hover:bg-purple-700" : ""
              }`}
              onClick={() => handleTabChange("comunidades")}
            >
              <Building className="mr-3 h-5 w-5" />
              Mis Comunidades
            </Button>
            
            <Button
              variant={activeTab === "gestionar" ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "gestionar" ? "bg-purple-600 hover:bg-purple-700" : ""
              }`}
              onClick={() => handleTabChange("gestionar")}
            >
              <Plus className="mr-3 h-5 w-5" />
              Añadir Comunidad
            </Button>
            
            <Separator className="my-2" />
            <div className="px-3 py-2">
              <h3 className="text-xs font-medium text-gray-500 uppercase">Servicios ASRAM</h3>
            </div>
            
            <Button
              variant={activeTab === "recursos" ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "recursos" ? "bg-purple-600 hover:bg-purple-700" : ""
              }`}
              onClick={() => handleTabChange("recursos")}
            >
              <BookOpen className="mr-3 h-5 w-5" />
              Recursos
            </Button>
            
            <Button
              variant={activeTab === "alianza-verde" ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "alianza-verde" ? "bg-purple-600 hover:bg-purple-700" : ""
              }`}
              onClick={() => handleTabChange("alianza")}
            >
              <School className="mr-3 h-5 w-5" />
              Alianza Verde Escolar
            </Button>
            
            <Button
              variant={activeTab === "apadrina" ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "apadrina" ? "bg-purple-600 hover:bg-purple-700" : ""
              }`}
              onClick={() => handleTabChange("apadrina")}
            >
              <MapPin className="mr-3 h-5 w-5" />
              Apadrina una Calle
            </Button>
            
            <Button
              variant={activeTab === "puntos-verdes" ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "puntos-verdes" ? "bg-purple-600 hover:bg-purple-700" : ""
              }`}
              onClick={() => handleTabChange("puntos")}
            >
              <User className="mr-3 h-5 w-5" />
              Puntos Verdes
            </Button>
            
            <Separator className="my-4" />
            
            <Button
              variant="ghost"
              className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
              onClick={handleSignOut}
            >
              <LogOut className="mr-3 h-5 w-5" />
              Cerrar sesión
            </Button>
          </nav>
        </div>
        
        <div className="flex-1 overflow-auto">
          <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
            <div className="container flex items-center justify-between h-16 px-4">
              <h2 className="text-lg font-medium md:hidden">ASRAM Admin Fincas</h2>
              
              <div className="flex items-center gap-4 ml-auto">
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="hidden md:flex"
                  >
                    Solicitar Recogida
                  </Button>
                </DialogTrigger>
                <Button
                  variant="ghost"
                  className="md:hidden"
                  onClick={handleSignOut}
                >
                  Salir
                </Button>
              </div>
            </div>
          </header>
          
          <main className="container py-8 px-4">
            <AdministradorDashboardContent activeTab={activeTab} />
          </main>
        </div>
      </div>
    </Dialog>
  );
};

export default AdministradorDashboardPage;

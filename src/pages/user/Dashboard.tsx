import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import UserDashboard from "@/components/dashboard/user/UserDashboard";
import { toast } from "sonner";
import { 
  User, UserCircle, BookOpen, School, MapPin, 
  Activity, LogOut
} from "lucide-react";

const UserDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setLoading(false);
      
      if (!user) {
        navigate("/login");
      }
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
      case "perfil": tabValue = "perfil"; break;
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
    <div className="flex min-h-screen bg-gray-50">
      <div className="hidden md:flex flex-col w-64 bg-white border-r">
        <div className="p-6">
          <h1 className="text-2xl font-bold text-asram">ASRAM</h1>
        </div>
        
        <nav className="flex-1 px-4 pb-4 space-y-1">
          <Button
            variant={activeTab === "home" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "home" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => handleTabChange("home")}
          >
            <Activity className="mr-2 h-4 w-4" />
            Home
          </Button>
          
          <Button
            variant={activeTab === "dashboard" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "dashboard" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => handleTabChange("dashboard")}
          >
            <Activity className="mr-2 h-4 w-4" />
            Dashboard
          </Button>
          
          <Button
            variant={activeTab === "perfil" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "perfil" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => handleTabChange("perfil")}
          >
            <UserCircle className="mr-2 h-4 w-4" />
            Perfil
          </Button>
          
          <Button
            variant={activeTab === "recursos" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "recursos" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => handleTabChange("recursos")}
          >
            <BookOpen className="mr-2 h-4 w-4" />
            Recursos
          </Button>
          
          <Button
            variant={activeTab === "alianza-verde" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "alianza-verde" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => handleTabChange("alianza")}
          >
            <School className="mr-2 h-4 w-4" />
            Alianza Verde Escolar
          </Button>
          
          <Button
            variant={activeTab === "apadrina" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "apadrina" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => handleTabChange("apadrina")}
          >
            <MapPin className="mr-2 h-4 w-4" />
            Apadrina una Calle
          </Button>
          
          <Button
            variant={activeTab === "puntos-verdes" ? "default" : "ghost"}
            className={`w-full justify-start ${
              activeTab === "puntos-verdes" ? "bg-asram hover:bg-asram-700" : ""
            }`}
            onClick={() => handleTabChange("puntos")}
          >
            <User className="mr-2 h-4 w-4" />
            Puntos Verdes
          </Button>
          
          <Separator className="my-4" />
          
          <Button
            variant="ghost"
            className="w-full justify-start text-red-500 hover:text-red-600 hover:bg-red-50"
            onClick={handleSignOut}
          >
            <LogOut className="mr-2 h-4 w-4" />
            Cerrar sesión
          </Button>
        </nav>
      </div>
      
      <div className="flex-1 overflow-auto">
        <header className="bg-white border-b sticky top-0 z-10">
          <div className="container flex items-center justify-between h-16 px-4">
            <h2 className="text-lg font-medium md:hidden">ASRAM</h2>
            
            <div className="flex items-center gap-4 ml-auto">
              <Button
                variant="outline"
                className="hidden md:flex"
              >
                Solicitar Recogida
              </Button>
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
          <UserDashboard activeTab={activeTab} />
        </main>
      </div>
    </div>
  );
};

export default UserDashboardPage;

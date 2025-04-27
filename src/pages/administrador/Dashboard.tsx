import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Home, Users, PlusCircle, LogOut } from "lucide-react";
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
      case "comunidades": tabValue = "comunidades"; break;
      case "gestionar": tabValue = "gestionar"; break;
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
            <h1 className="text-2xl font-bold text-[#ee970d]">ASRAM Admin Fincas</h1>
          </div>
          
          <div className="p-4">
            <div className="bg-gray-100 p-4 rounded-lg mb-4 flex items-center space-x-3">
              <div className="bg-[#ee970d] text-white p-2 rounded-full">
                <Users className="h-5 w-5" />
              </div>
              <div>
                <p className="font-medium text-sm">Bienvenido</p>
                <p className="text-xs text-gray-500">{profile?.nombreAdministracion || "Administrador de Fincas"}</p>
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-4 pb-6 space-y-1.5">
            <Button
              variant={activeTab === "home" ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "home" ? "bg-[#ee970d] hover:bg-[#ee970d]/90 text-white" : ""
              }`}
              onClick={() => handleTabChange("home")}
            >
              <Home className="mr-3 h-5 w-5" />
              Inicio
            </Button>
            
            <Button
              variant={activeTab === "comunidades" ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "comunidades" ? "bg-[#ee970d] hover:bg-[#ee970d]/90 text-white" : ""
              }`}
              onClick={() => handleTabChange("comunidades")}
            >
              <Users className="mr-3 h-5 w-5" />
              Mis Comunidades
            </Button>
            
            <Button
              variant={activeTab === "gestionar" ? "default" : "ghost"}
              className={`w-full justify-start ${
                activeTab === "gestionar" ? "bg-[#ee970d] hover:bg-[#ee970d]/90 text-white" : ""
              }`}
              onClick={() => handleTabChange("gestionar")}
            >
              <PlusCircle className="mr-3 h-5 w-5" />
              Añadir Comunidad
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

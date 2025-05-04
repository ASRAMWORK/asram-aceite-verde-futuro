
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { doc, getDoc, query, collection, where, getDocs } from "firebase/firestore";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";
import { toast } from "sonner";
import { Home, Users, PlusCircle, LogOut, FileText, BarChart, Loader2, Trophy, User } from "lucide-react";
import AdministradorDashboardContent from "@/components/dashboard/administrador/AdministradorDashboardContent";
import { useUserProfile } from "@/hooks/useUserProfile";
import { useIsMobile } from "@/hooks/useIsMobile";
import { MobileNavigation } from "@/components/mobile/MobileNavigation";
import { MobileBottomNav } from "@/components/mobile/MobileBottomNav";
import { mobileTouchTarget } from "@/utils/mobileStyles";

const AdministradorDashboardPage = () => {
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState("home");
  const navigate = useNavigate();
  const { profile } = useUserProfile();
  const isMobile = useIsMobile();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (!user) {
        navigate("/login");
        return;
      }
      
      try {
        // First check in users collection
        const userDoc = await getDoc(doc(db, "users", user.uid));
        if (userDoc.exists() && (userDoc.data().role === "administrador" || userDoc.data().role === "admin_finca")) {
          setLoading(false);
          return;
        }
        
        // If not in users, check in usuarios collection by UID
        const usuariosQuery = query(
          collection(db, "usuarios"),
          where("uid", "==", user.uid)
        );
        
        const usuariosSnap = await getDocs(usuariosQuery);
        if (!usuariosSnap.empty) {
          const userData = usuariosSnap.docs[0].data();
          if (userData.role === "administrador" || userData.role === "admin_finca") {
            setLoading(false);
            return;
          }
        }
        
        // Finally check by email as fallback
        const emailQuery = query(
          collection(db, "usuarios"),
          where("email", "==", user.email)
        );
        
        const emailSnap = await getDocs(emailQuery);
        if (!emailSnap.empty) {
          const userData = emailSnap.docs[0].data();
          if (userData.role === "administrador" || userData.role === "admin_finca") {
            setLoading(false);
            return;
          }
        }
        
        // If we get here, the user doesn't have permission
        toast.error("No tienes permisos para acceder a este panel");
        navigate("/login");
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
      case "informes": tabValue = "informes"; break;
      case "estadisticas": tabValue = "estadisticas"; break;
      case "perfil": tabValue = "perfil"; break;
      default: tabValue = "home";
    }
    setActiveTab(tabValue);
  };

  const menuItems = [
    { label: "Inicio", href: "#home", icon: <Home className="h-5 w-5" />, onClick: () => handleTabChange("home") },
    { label: "Mis Comunidades", href: "#comunidades", icon: <Users className="h-5 w-5" />, onClick: () => handleTabChange("comunidades") },
    { label: "Añadir Comunidad", href: "#gestionar", icon: <PlusCircle className="h-5 w-5" />, onClick: () => handleTabChange("gestionar") },
    { label: "Informes y Contratos", href: "#informes", icon: <FileText className="h-5 w-5" />, onClick: () => handleTabChange("informes") },
    { label: "Estadísticas", href: "#estadisticas", icon: <BarChart className="h-5 w-5" />, onClick: () => handleTabChange("estadisticas") },
    { label: "Mi perfil", href: "#perfil", icon: <User className="h-5 w-5" />, onClick: () => handleTabChange("perfil") }
  ];

  const bottomNavItems = [
    { label: "Inicio", href: "#home", icon: <Home />, onClick: () => handleTabChange("home") },
    { label: "Comunidades", href: "#comunidades", icon: <Users />, onClick: () => handleTabChange("comunidades") },
    { label: "Informes", href: "#informes", icon: <FileText />, onClick: () => handleTabChange("informes") },
    { label: "Estadísticas", href: "#estadisticas", icon: <BarChart />, onClick: () => handleTabChange("estadisticas") }
  ];

  if (loading) {
    return (
      <div className="min-h-screen dash-gradient flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4" />
          <p className="text-lg">Cargando panel de administrador...</p>
        </div>
      </div>
    );
  }

  return (
    <Dialog>
      <div className="flex min-h-screen bg-gray-50">
        {/* Desktop sidebar - hidden on mobile */}
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
                <p className="text-xs text-gray-500">{profile?.nombreAdministracion || profile?.nombre || "Administrador de Fincas"}</p>
                {profile?.id && <p className="text-xs text-gray-400">ID: {profile.id.substring(0, 8)}...</p>}
              </div>
            </div>
          </div>
          
          <nav className="flex-1 px-4 pb-6 space-y-1.5">
            {/* Desktop navigation buttons */}
            {menuItems.map((item) => (
              <Button
                key={item.label}
                variant={activeTab === item.href.substring(1) ? "default" : "ghost"}
                className={`w-full justify-start ${
                  activeTab === item.href.substring(1) ? "bg-[#ee970d] hover:bg-[#ee970d]/90 text-white" : ""
                }`}
                onClick={item.onClick}
              >
                {item.icon}
                <span className="ml-3">{item.label}</span>
              </Button>
            ))}
            
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
        
        {/* Mobile hamburger menu */}
        {isMobile && (
          <MobileNavigation 
            items={menuItems}
            title="ASRAM Admin"
          />
        )}
        
        <div className="flex-1 overflow-auto">
          <header className="bg-white border-b sticky top-0 z-10 shadow-sm">
            <div className="container flex items-center justify-between h-16 px-4">
              {isMobile ? (
                <div className="flex items-center">
                  <MobileNavigation 
                    items={menuItems}
                    title="ASRAM Admin"
                  />
                  <h2 className="text-lg font-medium ml-2">ASRAM Admin Fincas</h2>
                </div>
              ) : (
                <h2 className="text-lg font-medium md:hidden">ASRAM Admin Fincas</h2>
              )}
              
              <div className="flex items-center gap-4 ml-auto">
                <DialogTrigger asChild>
                  <Button
                    variant="outline"
                    className="hidden md:flex"
                  >
                    Solicitar Recogida
                  </Button>
                </DialogTrigger>
                {isMobile ? (
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={handleSignOut}
                    className={mobileTouchTarget()}
                  >
                    <LogOut className="h-5 w-5" />
                  </Button>
                ) : (
                  <Button
                    variant="ghost"
                    className="md:hidden"
                    onClick={handleSignOut}
                  >
                    Salir
                  </Button>
                )}
              </div>
            </div>
          </header>
          
          <main className={`container py-4 md:py-8 px-3 md:px-4`}>
            <AdministradorDashboardContent activeTab={activeTab} />
          </main>
          
          {/* Mobile bottom navigation */}
          {isMobile && (
            <MobileBottomNav items={bottomNavItems} />
          )}
        </div>
      </div>
    </Dialog>
  );
};

export default AdministradorDashboardPage;

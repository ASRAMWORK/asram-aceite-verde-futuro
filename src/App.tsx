import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, ensureAdminUser, isAdminEmail, db } from "@/lib/firebase";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/Dashboard";
import UserDashboard from "./pages/user/Dashboard";
import ComercialDashboard from "./pages/comercial/Dashboard";
import AdministradorDashboard from "./pages/administrador/Dashboard";
import NotFound from "./pages/NotFound";
import { doc, getDoc, query, collection, where, getDocs } from 'firebase/firestore';
import { AuthProvider } from '@/contexts/AuthContext';
import About from "./pages/About";
import Mision from "./pages/Mision";
import Modelo from "./pages/Modelo";
import RutaDorada from "./pages/sobre-nosotros/RutaDorada";
import AlianzaVerde from "./pages/programas/AlianzaVerde";
import AsramKids from "./pages/programas/AsramKids";
import PuntosVerdes from "./pages/programas/PuntosVerdes";
import AsramRural from "./pages/programas/AsramRural";
import Apadrina from "./pages/colabora/Apadrina";
import Detergente from "./pages/colabora/Detergente";
import Contacto from "./pages/colabora/Contacto";
import Voluntarios from "./pages/colabora/Voluntarios";
import Tienda from "./pages/tienda/Tienda";
import Convocatorias from "./pages/convocatorias/Convocatorias";
import { toast } from 'sonner';
import { Loader2 } from 'lucide-react';

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <BrowserRouter>
      <AuthProvider>
        <TooltipProvider>
          <Toaster />
          <Sonner />
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/dashboard" element={<ProtectedAdminRoute />} />
            <Route path="/user/dashboard" element={<ProtectedUserRoute />} />
            <Route path="/administrador/dashboard" element={<ProtectedAdministradorRoute />} />
            <Route path="/comercial/dashboard" element={<ProtectedComercialRoute />} />
            
            <Route path="/about" element={<About />} />
            <Route path="/mision" element={<Mision />} />
            <Route path="/modelo" element={<Modelo />} />
            <Route path="/ruta-dorada" element={<RutaDorada />} />
            
            <Route path="/alianza-verde" element={<AlianzaVerde />} />
            <Route path="/asram-kids" element={<AsramKids />} />
            <Route path="/puntos-verdes" element={<PuntosVerdes />} />
            <Route path="/asram-rural" element={<AsramRural />} />
            
            <Route path="/apadrina" element={<Apadrina />} />
            <Route path="/detergente" element={<Detergente />} />
            <Route path="/contacto" element={<Contacto />} />
            <Route path="/voluntarios" element={<Voluntarios />} />
            <Route path="/tienda" element={<Tienda />} />
            <Route path="/convocatorias" element={<Convocatorias />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </TooltipProvider>
      </AuthProvider>
    </BrowserRouter>
  </QueryClientProvider>
);

const ProtectedAdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkAdminAccess = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user && isAdminEmail(user.email)) {
          setIsAdmin(true);
        } else if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists() && (userDoc.data().role === "superadmin")) {
            setIsAdmin(true);
          }
        }
        setLoading(false);
      });

      ensureAdminUser();

      return () => unsubscribe();
    };

    checkAdminAccess();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-asram" />
        <p>Verificando permisos de administrador...</p>
      </div>
    </div>;
  }

  return isAdmin ? <AdminDashboard /> : <Navigate to="/login" />;
};

const ProtectedUserRoute = () => {
  const [authenticated, setAuthenticated] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setAuthenticated(!!user);
      setLoading(false);
    });
    
    return () => unsubscribe();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-asram" />
        <p>Cargando...</p>
      </div>
    </div>;
  }

  return authenticated ? <UserDashboard /> : <Navigate to="/login" />;
};

const ProtectedAdministradorRoute = () => {
  const [isAdministrador, setIsAdministrador] = useState(false);
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState<any>(null);

  useEffect(() => {
    const checkRole = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            // Comprobar primero si hay un ID de administrador en sessionStorage
            // (para superadministrador viendo un panel de administrador)
            const viewingAdminId = sessionStorage.getItem('viewingAdminId');
            const fromSuperAdmin = sessionStorage.getItem('fromSuperAdmin') === 'true';
            
            if (viewingAdminId && fromSuperAdmin) {
              // Si estamos accediendo como superadministrador, verificar que el usuario actual es un superadmin
              const superadminDoc = await getDoc(doc(db, "users", user.uid));
              if (superadminDoc.exists() && 
                  (superadminDoc.data().role === "superadmin" || isAdminEmail(user.email))) {
                setIsAdministrador(true);
              }
            } else {
              // Verificación normal para el administrador de fincas
              const userDoc = await getDoc(doc(db, "users", user.uid));
              if (userDoc.exists() && 
                  (userDoc.data().role === "administrador" || userDoc.data().role === "admin_finca")) {
                setIsAdministrador(true);
                setUserData(userDoc.data());
              }
            }
          } catch (error) {
            console.error("Error checking role:", error);
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    };

    checkRole();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-asram" />
        <p>Verificando permisos de administrador de fincas...</p>
      </div>
    </div>;
  }

  if (!isAdministrador) {
    toast("No tienes permisos para acceder al panel de administrador de fincas");
    return <Navigate to="/login" />;
  }

  return <AdministradorDashboard />;
};

const ProtectedComercialRoute = () => {
  const [isComercial, setIsComercial] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkRole = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            // Check in "users" collection first
            const userDoc = await getDoc(doc(db, "users", user.uid));
            
            if (userDoc.exists() && userDoc.data().role === "comercial") {
              setIsComercial(true);
            } else {
              // Check in "usuarios" collection by uid
              const usuariosQuery = query(
                collection(db, "usuarios"),
                where("uid", "==", user.uid)
              );
              
              const usuariosSnap = await getDocs(usuariosQuery);
              
              if (!usuariosSnap.empty && usuariosSnap.docs[0].data().role === "comercial") {
                setIsComercial(true);
              } else {
                // Additional check by email as fallback
                const emailQuery = query(
                  collection(db, "usuarios"),
                  where("email", "==", user.email)
                );
                
                const emailSnap = await getDocs(emailQuery);
                
                if (!emailSnap.empty && emailSnap.docs[0].data().role === "comercial") {
                  setIsComercial(true);
                }
              }
            }
          } catch (error) {
            console.error("Error checking role:", error);
          }
        }
        setLoading(false);
      });

      return () => unsubscribe();
    };

    checkRole();
  }, []);

  if (loading) {
    return <div className="flex justify-center items-center min-h-screen">
      <div className="text-center">
        <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-asram" />
        <p>Verificando permisos de comercial...</p>
      </div>
    </div>;
  }

  if (!isComercial) {
    toast("No tienes permisos para acceder al panel de comercial");
    return <Navigate to="/login" />;
  }

  return <ComercialDashboard />;
};

export default App;

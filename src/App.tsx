import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Navigate, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, ensureAdminUser, isAdminEmail, db } from "@/lib/firebase";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import AdminDashboard from "./pages/admin/Dashboard";
import UserDashboard from "./pages/user/Dashboard";
import AdministradorDashboard from "./pages/administrador/Dashboard";
import NotFound from "./pages/NotFound";
import { doc, getDoc } from 'firebase/firestore';
import { AuthProvider } from '@/contexts/AuthContext';
import About from "./pages/About";
import Mision from "./pages/Mision";
import Modelo from "./pages/Modelo";
import AlianzaVerde from "./pages/programas/AlianzaVerde";
import AsramKids from "./pages/programas/AsramKids";
import PuntosVerdes from "./pages/programas/PuntosVerdes";
import AsramRural from "./pages/programas/AsramRural";
import Apadrina from "./pages/colabora/Apadrina";
import Detergente from "./pages/colabora/Detergente";
import Contacto from "./pages/colabora/Contacto";

const queryClient = new QueryClient();

const ProtectedAdminRoute = () => {
  const [isAdmin, setIsAdmin] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user && isAdminEmail(user.email)) {
        setIsAdmin(true);
      } else {
        if (user) {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists() && userDoc.data().role === "superadmin") {
            setIsAdmin(true);
          } else {
            navigate("/login");
          }
        } else {
          navigate("/login");
        }
      }
      setLoading(false);
    });

    ensureAdminUser();

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return isAdmin ? <AdminDashboard /> : <Navigate to="/login" />;
};

const ProtectedAdministradorRoute = () => {
  const [isAdministrador, setIsAdministrador] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        const checkRole = async () => {
          try {
            const userDoc = await getDoc(doc(db, "users", user.uid));
            if (userDoc.exists() && (userDoc.data().role === "administrador" || userDoc.data().role === "admin_finca")) {
              setIsAdministrador(true);
            } else {
              navigate("/login");
            }
          } catch (error) {
            console.error("Error checking role:", error);
            navigate("/login");
          } finally {
            setLoading(false);
          }
        };
        checkRole();
      } else {
        navigate("/login");
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, [navigate]);

  if (loading) {
    return <div>Cargando...</div>;
  }

  return isAdministrador ? <AdministradorDashboard /> : <Navigate to="/login" />;
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <AuthProvider>
      <TooltipProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<Index />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/admin/dashboard" element={<ProtectedAdminRoute />} />
            <Route path="/user/dashboard" element={<UserDashboard />} />
            <Route path="/administrador/dashboard" element={<ProtectedAdministradorRoute />} />
            
            <Route path="/about" element={<About />} />
            <Route path="/mision" element={<Mision />} />
            <Route path="/modelo" element={<Modelo />} />
            
            <Route path="/alianza-verde" element={<AlianzaVerde />} />
            <Route path="/asram-kids" element={<AsramKids />} />
            <Route path="/puntos-verdes" element={<PuntosVerdes />} />
            <Route path="/asram-rural" element={<AsramRural />} />
            
            <Route path="/apadrina" element={<Apadrina />} />
            <Route path="/detergente" element={<Detergente />} />
            <Route path="/contacto" element={<Contacto />} />
            
            <Route path="*" element={<NotFound />} />
          </Routes>
        </BrowserRouter>
      </TooltipProvider>
    </AuthProvider>
  </QueryClientProvider>
);

export default App;

import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import { AlertTriangle, Loader2 } from "lucide-react";
import { doc, getDoc, getDocs, query, where, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ComercialDashboard from "@/components/dashboard/comercial/ComercialDashboard";
import { Button } from "@/components/ui/button";

const Dashboard = () => {
  const [isComercial, setIsComercial] = useState(false);
  const [loading, setLoading] = useState(true);
  const [aprobado, setAprobado] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            console.log("Checking comercial permissions for:", user.email);
            
            // Check first in the "users" collection using the uid as the document ID
            const userDoc = await getDoc(doc(db, "users", user.uid));
            
            if (userDoc.exists() && userDoc.data().role === "comercial") {
              console.log("Found comercial in users collection");
              setIsComercial(true);
              setAprobado(userDoc.data().aprobado === true);
              if (!userDoc.data().aprobado) {
                toast.error("Tu cuenta está pendiente de aprobación por un administrador");
              }
            } else {
              // If not found as ID, search in "usuarios" collection by uid field
              const usuariosQuery = query(
                collection(db, "usuarios"),
                where("uid", "==", user.uid)
              );
              
              const usuariosSnap = await getDocs(usuariosQuery);
              
              if (!usuariosSnap.empty && usuariosSnap.docs[0].data().role === "comercial") {
                console.log("Found comercial in usuarios collection by uid");
                setIsComercial(true);
                const userData = usuariosSnap.docs[0].data();
                setAprobado(userData.aprobado === true);
                if (!userData.aprobado) {
                  toast.error("Tu cuenta está pendiente de aprobación por un administrador");
                }
              } else {
                // Additional check by email as fallback
                const emailQuery = query(
                  collection(db, "usuarios"),
                  where("email", "==", user.email)
                );
                
                const emailSnap = await getDocs(emailQuery);
                
                if (!emailSnap.empty && emailSnap.docs[0].data().role === "comercial") {
                  console.log("Found comercial in usuarios collection by email");
                  setIsComercial(true);
                  const userData = emailSnap.docs[0].data();
                  setAprobado(userData.aprobado === true);
                  if (!userData.aprobado) {
                    toast.error("Tu cuenta está pendiente de aprobación por un administrador");
                  }
                } else {
                  // Not authorized as comercial
                  console.log("Not authorized as comercial");
                  toast.error("No tienes permisos para acceder al panel de comercial");
                  navigate("/login");
                }
              }
            }
          } catch (error) {
            console.error("Error checking role:", error);
            toast.error("Error verificando permisos");
            navigate("/login");
          }
        } else {
          // No está autenticado
          console.log("User not authenticated");
          navigate("/login");
        }
        setLoading(false);
      });

      return () => unsubscribe();
    };

    checkRole();
  }, [navigate]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-asram" />
          <p>Verificando permisos...</p>
        </div>
      </div>
    );
  }

  if (!isComercial) {
    return null; // No renderizar nada mientras redirige
  }

  if (!aprobado) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-50">
        <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-md">
          <AlertTriangle className="h-16 w-16 mx-auto mb-4 text-amber-500" />
          <h2 className="text-2xl font-bold mb-4">Cuenta pendiente de aprobación</h2>
          <p className="mb-6 text-gray-600">
            Tu cuenta de comercial está pendiente de ser aprobada por un administrador. 
            Serás notificado cuando tu cuenta esté activada.
          </p>
          <Button
            onClick={() => navigate("/login")}
            className="w-full"
          >
            Volver al inicio
          </Button>
        </div>
      </div>
    );
  }

  return <ComercialDashboard />;
};

export default Dashboard;

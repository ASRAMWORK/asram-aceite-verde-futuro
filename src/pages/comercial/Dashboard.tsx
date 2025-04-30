
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { toast } from "sonner";
import { Loader2 } from "lucide-react";
import { doc, getDoc, getDocs, query, where, collection } from 'firebase/firestore';
import { db } from '@/lib/firebase';
import ComercialDashboard from "@/components/dashboard/comercial/ComercialDashboard";

const Dashboard = () => {
  const [isComercial, setIsComercial] = useState(false);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const checkRole = async () => {
      const unsubscribe = onAuthStateChanged(auth, async (user) => {
        if (user) {
          try {
            // Check first in the "users" collection using the uid as the document ID
            const userDoc = await getDoc(doc(db, "users", user.uid));
            
            if (userDoc.exists() && userDoc.data().role === "comercial") {
              console.log("Found comercial in users collection");
              setIsComercial(true);
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

  return <ComercialDashboard />;
};

export default Dashboard;

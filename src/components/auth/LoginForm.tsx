
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, isAdminEmail, db } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import { doc, getDoc, collection, query, where, getDocs } from "firebase/firestore";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [loginTab, setLoginTab] = useState("general");
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      console.log("Attempting login for:", email);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      console.log("Login successful for user:", user.uid);
      
      // Check if user is admin by email first (fastest check)
      if (isAdminEmail(user.email)) {
        console.log("Admin email detected, redirecting to admin dashboard");
        navigate("/admin/dashboard");
        toast.success("Inicio de sesión de administrador exitoso");
        setLoading(false);
        return;
      }
      
      // Check in "users" collection by UID
      const userDoc = await getDoc(doc(db, "users", user.uid));
      
      if (userDoc.exists()) {
        const userData = userDoc.data();
        const userRole = userData.role;
        console.log("Found user in users collection with role:", userRole);
        
        if (userRole === "superadmin") {
          navigate("/admin/dashboard");
          toast.success("Bienvenido, Superadministrador");
        } else if (userRole === "admin_finca" || userRole === "administrador") {
          console.log("Redirecting to administrador dashboard");
          navigate("/administrador/dashboard");
          toast.success(`Bienvenido, ${userData.nombreAdministracion || "Administrador de Fincas"}`);
        } else if (userRole === "comercial") {
          console.log("Comercial account, checking approval status");
          if (userData.aprobado) {
            console.log("Approved comercial, redirecting to dashboard");
            navigate("/comercial/dashboard");
            toast.success("Bienvenido, Comercial");
          } else {
            console.log("Comercial not approved yet");
            navigate("/comercial/dashboard");
            toast.warning("Tu cuenta está pendiente de aprobación por un administrador");
          }
          setLoading(false);
          return;
        } else {
          navigate("/user/dashboard");
          toast.success("Inicio de sesión exitoso");
        }
      } else {
        console.log("User not found in users collection, checking usuarios");
        // If not found in "users" by UID, check in "usuarios" collection
        const usuariosQuery = query(
          collection(db, "usuarios"),
          where("uid", "==", user.uid)
        );
        
        const usuariosSnap = await getDocs(usuariosQuery);
        
        if (!usuariosSnap.empty) {
          const userData = usuariosSnap.docs[0].data();
          const userRole = userData.role;
          console.log("Found user in usuarios collection by uid with role:", userRole);
          
          if (userRole === "administrador" || userRole === "admin_finca") {
            console.log("Administrator account, redirecting to admin dashboard");
            navigate("/administrador/dashboard");
            toast.success(`Bienvenido, ${userData.nombreAdministracion || "Administrador de Fincas"}`);
            setLoading(false);
            return;
          } else if (userRole === "comercial") {
            console.log("Comercial account, checking approval status");
            if (userData.aprobado) {
              console.log("Approved comercial, redirecting to dashboard");
              navigate("/comercial/dashboard");
              toast.success("Bienvenido, Comercial");
            } else {
              console.log("Comercial not approved yet");
              navigate("/comercial/dashboard");
              toast.warning("Tu cuenta está pendiente de aprobación por un administrador");
            }
            setLoading(false);
            return;
          } else {
            navigate("/user/dashboard");
            toast.success("Inicio de sesión exitoso");
          }
        } else {
          // If not found by UID, check by email in "usuarios" collection as a fallback
          const emailQuery = query(
            collection(db, "usuarios"),
            where("email", "==", email)
          );
          
          const emailSnap = await getDocs(emailQuery);
          
          if (!emailSnap.empty) {
            const userData = emailSnap.docs[0].data();
            const userRole = userData.role;
            console.log("Found user in usuarios collection by email with role:", userRole);
            
            if (userRole === "administrador" || userRole === "admin_finca") {
              console.log("Administrator account from email check, redirecting to admin dashboard");
              navigate("/administrador/dashboard");
              toast.success(`Bienvenido, ${userData.nombreAdministracion || "Administrador de Fincas"}`);
              setLoading(false);
              return;
            } else if (userRole === "comercial") {
              console.log("Comercial account, checking approval status");
              if (userData.aprobado) {
                console.log("Approved comercial, redirecting to dashboard");
                navigate("/comercial/dashboard");
                toast.success("Bienvenido, Comercial");
              } else {
                console.log("Comercial not approved yet");
                navigate("/comercial/dashboard");
                toast.warning("Tu cuenta está pendiente de aprobación por un administrador");
              }
              setLoading(false);
              return;
            }
          }
          
          // Default to user dashboard if no specific role found
          console.log("No specific role found, defaulting to user dashboard");
          navigate("/user/dashboard");
          toast.success("Inicio de sesión exitoso");
        }
      }
    } catch (error: any) {
      console.error("Error al iniciar sesión:", error);
      toast.error("Error al iniciar sesión: " + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md mx-auto">
      <div className="futuristic-card p-8 glow">
        <div className="text-center mb-8">
          <h2 className="text-3xl font-bold mb-2 text-gray-800">
            Bienvenido a ASRAM 👋
          </h2>
          <p className="text-gray-500">Inicia sesión para continuar</p>
        </div>

        <Tabs value={loginTab} onValueChange={setLoginTab} className="w-full mb-6">
          <TabsList className="grid grid-cols-2 mb-4">
            <TabsTrigger value="general">Acceso General</TabsTrigger>
            <TabsTrigger value="admin_finca">Administradores</TabsTrigger>
          </TabsList>
          
          <TabsContent value="general">
            <p className="text-sm mb-4 text-center text-gray-500">
              Acceso para usuarios generales y participantes
            </p>
          </TabsContent>
          
          <TabsContent value="admin_finca">
            <p className="text-sm mb-4 text-center text-gray-500">
              Acceso exclusivo para administradores de fincas registrados
            </p>
          </TabsContent>
        </Tabs>

        <form onSubmit={handleLogin}>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                placeholder="tu@email.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="password">Contraseña</Label>
              <Input
                id="password"
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="w-full"
              />
            </div>

            <Button
              type="submit"
              className={`w-full text-white ${
                loginTab === "admin_finca" ? "bg-purple-600 hover:bg-purple-700" : "bg-asram hover:bg-asram-700"
              }`}
              disabled={loading}
            >
              {loading ? "Iniciando sesión..." : "Iniciar sesión"}
            </Button>
          </div>
        </form>

        <div className="mt-6 text-center">
          <p className="text-sm text-gray-500">
            ¿No tienes una cuenta?{" "}
            <a
              href="/register"
              className="text-asram hover:text-asram-700 font-medium"
            >
              Regístrate
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginForm;

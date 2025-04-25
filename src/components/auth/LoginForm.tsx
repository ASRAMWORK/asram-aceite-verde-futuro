
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth, isAdminEmail } from "@/lib/firebase";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";

const LoginForm = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;

      // Check if admin
      if (isAdminEmail(user.email)) {
        navigate("/admin/dashboard");
        toast.success("Inicio de sesión de administrador exitoso");
      } else {
        navigate("/user/dashboard");
        toast.success("Inicio de sesión exitoso");
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
            Bienvenido 👋
          </h2>
          <p className="text-gray-500">Inicia sesión para continuar</p>
        </div>

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
              className="w-full bg-asram hover:bg-asram-700 text-white"
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

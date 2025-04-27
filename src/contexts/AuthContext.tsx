import React, {
  useState,
  useEffect,
  useContext,
  createContext,
  ReactNode,
} from "react";
import {
  getAuth,
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
  updateProfile,
  sendPasswordResetEmail,
} from "firebase/auth";
import { auth } from "@/config/firebase";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";
import { UserRole } from "@/types";

interface AuthContextProps {
  currentUser: any;
  loading: boolean;
  signUp: (email: string, pass: string, displayName: string) => Promise<any>;
  login: (email: string, pass: string) => Promise<any>;
  logout: () => Promise<void>;
  resetPassword: (email: string) => Promise<void>;
  isAdmin: () => boolean;
}

const AuthContext = createContext<AuthContextProps>({
  currentUser: null,
  loading: false,
  signUp: async () => {},
  login: async () => {},
  logout: async () => {},
  resetPassword: async () => {},
  isAdmin: () => false,
});

export const useAuth = () => useContext(AuthContext);

interface Props {
  children: ReactNode;
}

export const AuthProvider = ({ children }: Props) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, pass: string, displayName: string) => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        pass
      );
      await updateProfile(userCredential.user, {
        displayName: displayName,
      });
      setCurrentUser(userCredential.user);
      toast.success("Usuario creado correctamente");
      navigate("/dashboard");
      return userCredential.user;
    } catch (error: any) {
      toast.error("Error al crear usuario: " + error.message);
      return null;
    }
  };

  const login = async (email: string, pass: string) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      toast.success("Sesión iniciada correctamente");
      navigate("/dashboard");
    } catch (error: any) {
      toast.error("Error al iniciar sesión: " + error.message);
    }
  };

  const logout = async () => {
    try {
      await signOut(auth);
      toast.success("Sesión cerrada correctamente");
      navigate("/login");
    } catch (error: any) {
      toast.error("Error al cerrar sesión: " + error.message);
    }
  };

  const resetPassword = async (email: string) => {
    try {
      await sendPasswordResetEmail(auth, email);
      toast.success("Se ha enviado un correo para restablecer la contraseña");
    } catch (error: any) {
      toast.error("Error al enviar correo: " + error.message);
    }
  };

  const isAdmin = () => {
    return currentUser?.role === "admin" || 
           currentUser?.role === "superadmin" as UserRole;
  };

  const value = {
    currentUser,
    loading,
    signUp,
    login,
    logout,
    resetPassword,
    isAdmin,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

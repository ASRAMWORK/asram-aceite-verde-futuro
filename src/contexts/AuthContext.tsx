
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
import { auth } from "@/lib/firebase"; // Updated import path
import { toast } from "sonner";
import { UserRole } from "@/types";

interface AuthContextProps {
  currentUser: any;
  loading: boolean;
  signUp: (email: string, pass: string, displayName: string, callback?: () => void) => Promise<any>;
  login: (email: string, pass: string, callback?: () => void) => Promise<any>;
  logout: (callback?: () => void) => Promise<void>;
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

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  const signUp = async (email: string, pass: string, displayName: string, callback?: () => void) => {
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
      if (callback) callback();
      return userCredential.user;
    } catch (error: any) {
      toast.error("Error al crear usuario: " + error.message);
      return null;
    }
  };

  const login = async (email: string, pass: string, callback?: () => void) => {
    try {
      await signInWithEmailAndPassword(auth, email, pass);
      toast.success("Sesión iniciada correctamente");
      if (callback) callback();
    } catch (error: any) {
      toast.error("Error al iniciar sesión: " + error.message);
    }
  };

  const logout = async (callback?: () => void) => {
    try {
      await signOut(auth);
      toast.success("Sesión cerrada correctamente");
      if (callback) callback();
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
    const adminRoles: UserRole[] = ["admin", "superadmin"];
    return currentUser?.role && adminRoles.includes(currentUser.role as UserRole);
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

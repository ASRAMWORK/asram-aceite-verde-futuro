
import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth, db } from '@/lib/firebase';
import { onAuthStateChanged, User } from 'firebase/auth';
import { doc, getDoc } from 'firebase/firestore';
import { UserRole } from '@/types';

type AuthContextType = {
  user: User | null;
  userRole: UserRole | null;
  logout: () => Promise<void>;
  checkUserPermission: (permission: string) => boolean;
  userPermissions: string[];
};

const AuthContext = createContext<AuthContextType>({
  user: null,
  userRole: null,
  logout: async () => {},
  checkUserPermission: () => false,
  userPermissions: [],
});

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [userRole, setUserRole] = useState<UserRole | null>(null);
  const [userPermissions, setUserPermissions] = useState<string[]>([]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (currentUser) => {
      setUser(currentUser);
      
      if (currentUser) {
        try {
          const userDoc = await getDoc(doc(db, "users", currentUser.uid));
          if (userDoc.exists()) {
            const userData = userDoc.data();
            setUserRole(userData.role as UserRole || 'user');
            setUserPermissions(userData.permisos || []);
          }
        } catch (error) {
          console.error("Error fetching user role:", error);
        }
      } else {
        setUserRole(null);
        setUserPermissions([]);
      }
    });

    return () => unsubscribe();
  }, []);

  const logout = async () => {
    try {
      await auth.signOut();
      setUserRole(null);
      setUserPermissions([]);
    } catch (error) {
      console.error('Error logging out:', error);
    }
  };

  // Check if user has a specific permission
  const checkUserPermission = (permission: string): boolean => {
    if (!user) return false;
    
    // Superadmin has all permissions
    if (userRole === 'superadmin') return true;
    
    // Check in user permissions array
    return userPermissions.includes(permission);
  };

  return (
    <AuthContext.Provider value={{ 
      user, 
      userRole, 
      logout, 
      checkUserPermission, 
      userPermissions 
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

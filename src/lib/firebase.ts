
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyA5-CoIBJe1zKVcyAziRWAEXkrq9ZWg3BY",
  authDomain: "asram-work-28f9e.firebaseapp.com",
  projectId: "asram-work-28f9e",
  storageBucket: "asram-work-28f9e.firebasestorage.app",
  messagingSenderId: "712463325766",
  appId: "1:712463325766:web:18962614579eb99ac44847",
  measurementId: "G-M6FKMQ95WS"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = typeof window !== 'undefined' ? getAnalytics(app) : null;
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

// Admin email for quick checks
export const ADMIN_EMAILS = [
  "admin@asramadrid.com", 
  "colabora@asramadrid.com"
];

// Helper function to check if a user is an admin
export const isAdminEmail = (email: string | null | undefined) => {
  if (!email) return false;
  return ADMIN_EMAILS.includes(email.toLowerCase());
};

// Function to ensure admin user exists
export const ensureAdminUser = async () => {
  try {
    // Try to sign in first
    await signInWithEmailAndPassword(auth, "colabora@asramadrid.com", "Hola3030");
    console.log("Admin user already exists");
  } catch (error: any) {
    // If sign in fails, create the user
    if (error.code === 'auth/user-not-found') {
      try {
        await createUserWithEmailAndPassword(auth, "colabora@asramadrid.com", "Hola3030");
        console.log("Admin user created successfully");
      } catch (createError) {
        console.error("Error creating admin user:", createError);
      }
    } else {
      console.error("Unexpected error:", error);
    }
  }
};

export { app, analytics, auth, db, storage };

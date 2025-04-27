
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth, createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage, ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";

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

// Helper function to upload image to Firebase Storage
export const uploadImage = async (file: File, path: string): Promise<string> => {
  const storageRef = ref(storage, `${path}/${file.name}`);
  
  try {
    const uploadTask = uploadBytesResumable(storageRef, file);
    
    return new Promise((resolve, reject) => {
      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Track progress if needed
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          console.log("Upload is " + progress + "% done");
        },
        (error) => {
          // Handle errors
          console.error("Upload error:", error);
          reject(error);
        },
        async () => {
          // Handle successful upload
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          resolve(downloadURL);
        }
      );
    });
  } catch (error) {
    console.error("Error uploading image:", error);
    throw error;
  }
};

export { app, analytics, auth, db, storage };

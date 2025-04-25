
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
import { getAuth } from "firebase/auth";
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

export { app, analytics, auth, db, storage };

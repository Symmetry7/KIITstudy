import { initializeApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";
import { getStorage } from "firebase/storage";

// Check if we have real Firebase credentials
const isFirebaseConfigured = () => {
  const apiKey = import.meta.env.VITE_FIREBASE_API_KEY;
  return (
    apiKey &&
    apiKey !== "demo-api-key" &&
    apiKey.length > 10 &&
    !apiKey.includes("demo")
  );
};

const firebaseConfig = {
  // These would be your actual Firebase config values
  // For demo purposes, these are placeholder values
  // In Vite, use VITE_ prefix for environment variables
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-api-key",
  authDomain:
    import.meta.env.VITE_FIREBASE_AUTH_DOMAIN ||
    "kiitconnect-demo.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "kiitconnect-demo",
  storageBucket:
    import.meta.env.VITE_FIREBASE_STORAGE_BUCKET ||
    "kiitconnect-demo.appspot.com",
  messagingSenderId:
    import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "123456789",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:123456789:web:abcdef123456",
};

let app: any = null;
let auth: any = null;
let db: any = null;
let storage: any = null;

// Only initialize Firebase if we have real credentials
if (isFirebaseConfigured()) {
  try {
    // Initialize Firebase
    app = initializeApp(firebaseConfig);

    // Initialize Firebase Authentication and get a reference to the service
    auth = getAuth(app);

    // Initialize Cloud Firestore and get a reference to the service
    db = getFirestore(app);

    // Initialize Cloud Storage and get a reference to the service
    storage = getStorage(app);

    console.log("Firebase initialized successfully");
  } catch (error) {
    console.error("Failed to initialize Firebase:", error);
  }
} else {
  console.log("Running in demo mode - Firebase not initialized");

  // Create comprehensive mock objects for demo mode
  auth = {
    currentUser: null,
    onAuthStateChanged: (callback: (user: any) => void) => {
      // Check localStorage for demo auth state
      const isAuth = localStorage.getItem("kiit_auth") === "true";
      const userData = localStorage.getItem("kiit_user");

      if (isAuth && userData) {
        setTimeout(() => callback({ uid: JSON.parse(userData).uid }), 100);
      } else {
        setTimeout(() => callback(null), 100);
      }

      return () => {}; // Return unsubscribe function
    },
  };

  // Mock Firestore functions
  db = {
    collection: () => ({}),
    doc: () => ({}),
    setDoc: () => Promise.resolve(),
    getDoc: () => Promise.resolve({ exists: () => false, data: () => ({}) }),
    updateDoc: () => Promise.resolve(),
  };

  storage = {};
}

export { auth, db, storage, isFirebaseConfigured };
export default app;

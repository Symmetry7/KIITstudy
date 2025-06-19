import { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  useLocation,
} from "react-router-dom";
import { ThemeProvider } from "@/context/ThemeContext";
import { Toaster } from "@/components/ui/toaster";
import { MainLayout } from "@/components/layout/MainLayout";
import { getCurrentUserData, KIITUser } from "@/lib/auth";
import { isFirebaseConfigured } from "@/lib/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { auth } from "@/lib/firebase";

import Index from "@/pages/Index";
import Feed from "@/pages/Feed";
import MyGroups from "@/pages/MyGroups";
import BrowseGroups from "@/pages/BrowseGroups";
import Schedule from "@/pages/Schedule";
import Goals from "@/pages/Goals";
import Chats from "@/pages/Chats";
import CreateGroup from "@/pages/CreateGroup";
import StudyRoom from "@/pages/StudyRoom";
import Profile from "@/pages/Profile";
import NotFound from "@/pages/NotFound";
import GroupChat from "@/pages/group/GroupChat";

function AuthenticatedApp() {
  const [currentUser, setCurrentUser] = useState<KIITUser | null>(null);
  const [loading, setLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const checkAuth = async () => {
      const isDemoMode = !isFirebaseConfigured();

      if (isDemoMode) {
        // Demo mode: check localStorage
        const isAuth = localStorage.getItem("kiit_auth");
        const userData = localStorage.getItem("kiit_user");

        if (isAuth === "true" && userData) {
          try {
            const user = JSON.parse(userData);
            setCurrentUser(user);
          } catch (error) {
            console.error("Error parsing user data:", error);
            localStorage.removeItem("kiit_auth");
            localStorage.removeItem("kiit_user");
          }
        }
        setLoading(false);
      } else {
        // Real Firebase mode
        const unsubscribe = onAuthStateChanged(auth, async (user) => {
          if (user) {
            try {
              const userData = await getCurrentUserData(user);
              setCurrentUser(userData);
            } catch (error) {
              console.error("Error loading user data:", error);
            }
          } else {
            setCurrentUser(null);
          }
          setLoading(false);
        });

        return () => unsubscribe();
      }
    };

    checkAuth();
  }, []);

  // Show loading while checking authentication
  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-kiit-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <div className="w-8 h-8 bg-white rounded-lg"></div>
          </div>
          <p className="text-lg font-medium">Loading KIITConnect...</p>
        </div>
      </div>
    );
  }

  // Redirect to login if not authenticated
  if (!currentUser && location.pathname !== "/") {
    return <Navigate to="/" replace />;
  }

  // Show login page
  if (location.pathname === "/") {
    return <Index />;
  }

  // Show authenticated app with layout
  return (
    <MainLayout currentUser={currentUser}>
      <Routes>
        <Route path="/feed" element={<Feed currentUser={currentUser} />} />
        <Route path="/dashboard" element={<Navigate to="/feed" replace />} />
        <Route
          path="/my-groups"
          element={<MyGroups currentUser={currentUser} />}
        />
        <Route
          path="/browse-groups"
          element={<BrowseGroups currentUser={currentUser} />}
        />
        <Route
          path="/schedule"
          element={<Schedule currentUser={currentUser} />}
        />
        <Route path="/goals" element={<Goals currentUser={currentUser} />} />
        <Route path="/chats" element={<Chats currentUser={currentUser} />} />
        <Route path="/create-group" element={<CreateGroup />} />
        <Route path="/study-room/:id" element={<StudyRoom />} />
        <Route
          path="/group/:groupId/chat"
          element={
            <GroupChat
              currentUser={
                currentUser
                  ? {
                      uid: currentUser.uid,
                      name: currentUser.name,
                      avatar: "/api/placeholder/40/40",
                    }
                  : undefined
              }
            />
          }
        />
        <Route path="/profile" element={<Profile />} />
        <Route path="/404" element={<NotFound />} />
        <Route path="*" element={<Navigate to="/404" replace />} />
      </Routes>
    </MainLayout>
  );
}

function App() {
  return (
    <ThemeProvider defaultTheme="dark" storageKey="kiit-connect-theme">
      <Router>
        <div className="min-h-screen bg-background font-sans antialiased">
          <AuthenticatedApp />
          <Toaster />
        </div>
      </Router>
    </ThemeProvider>
  );
}

export default App;

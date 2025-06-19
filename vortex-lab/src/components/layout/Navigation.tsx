import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { signOutUser } from "@/lib/auth";
import { isFirebaseConfigured } from "@/lib/firebase";
import {
  Heart,
  Home,
  Users,
  Calendar,
  Target,
  MessageCircle,
  Plus,
  Settings,
  LogOut,
  Search,
  Bell,
  User,
  BookOpen,
  Trophy,
  Clock,
} from "lucide-react";

interface NavigationProps {
  currentUser: {
    name: string;
    email: string;
    course: string;
    avatar?: string;
  } | null;
}

export function Navigation({ currentUser }: NavigationProps) {
  const location = useLocation();
  const navigate = useNavigate();
  const [notifications] = useState(3); // Mock notification count

  const handleLogout = async () => {
    try {
      // Clear demo mode data
      localStorage.removeItem("kiit_auth");
      localStorage.removeItem("kiit_user");

      // Sign out from Firebase if in real mode
      const isDemoMode = !isFirebaseConfigured();
      if (!isDemoMode) {
        await signOutUser();
      }

      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
      navigate("/", { replace: true });
    }
  };

  const navItems = [
    {
      path: "/feed",
      icon: Home,
      label: "Live Feed",
      description: "Active study sessions",
    },
    {
      path: "/my-groups",
      icon: Users,
      label: "My Groups",
      description: "Groups you've joined",
    },
    {
      path: "/browse-groups",
      icon: BookOpen,
      label: "Browse Groups",
      description: "Discover new groups",
    },
    {
      path: "/schedule",
      icon: Calendar,
      label: "Schedule",
      description: "Study calendar",
    },
    {
      path: "/goals",
      icon: Target,
      label: "Goals",
      description: "Track progress",
    },
    {
      path: "/chats",
      icon: MessageCircle,
      label: "Chats",
      description: "All conversations",
      badge: 5, // Mock unread count
    },
    {
      path: "/create-group",
      icon: Plus,
      label: "Create Group",
      description: "Start new group",
    },
  ];

  const isActive = (path: string) => {
    if (
      path === "/feed" &&
      (location.pathname === "/" || location.pathname === "/dashboard")
    ) {
      return true;
    }
    return location.pathname.startsWith(path);
  };

  return (
    <div className="h-screen bg-white dark:bg-gray-900 border-r dark:border-gray-800 flex flex-col">
      {/* Header */}
      <div className="p-6 border-b dark:border-gray-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 bg-kiit-gradient rounded-xl flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold gradient-text">KIITConnect</h1>
            <p className="text-sm text-gray-500">Study Together</p>
          </div>
        </div>
      </div>

      {/* Navigation Items */}
      <nav className="flex-1 p-4 space-y-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.path);

          return (
            <Link
              key={item.path}
              to={item.path}
              className={`block p-3 rounded-xl transition-all duration-200 ${
                active
                  ? "bg-kiit-gradient text-white shadow-lg"
                  : "hover:bg-gray-100 dark:hover:bg-gray-800 text-gray-700 dark:text-gray-300"
              }`}
            >
              <div className="flex items-center space-x-3">
                <Icon className={`w-5 h-5 ${active ? "text-white" : ""}`} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span
                      className={`font-medium ${active ? "text-white" : ""}`}
                    >
                      {item.label}
                    </span>
                    {item.badge && !active && (
                      <Badge variant="secondary" className="text-xs">
                        {item.badge}
                      </Badge>
                    )}
                  </div>
                  <p
                    className={`text-xs ${
                      active ? "text-white/80" : "text-gray-500"
                    }`}
                  >
                    {item.description}
                  </p>
                </div>
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile & Actions */}
      <div className="p-4 border-t dark:border-gray-800 space-y-4">
        {/* Quick Actions */}
        <div className="flex items-center justify-between">
          <Button variant="ghost" size="icon">
            <Search className="w-5 h-5" />
          </Button>
          <div className="relative">
            <Button variant="ghost" size="icon">
              <Bell className="w-5 h-5" />
            </Button>
            {notifications > 0 && (
              <Badge className="absolute -top-1 -right-1 w-5 h-5 text-xs bg-red-500 text-white">
                {notifications}
              </Badge>
            )}
          </div>
          <Button variant="ghost" size="icon">
            <Settings className="w-5 h-5" />
          </Button>
        </div>

        {/* Test Login Button (Demo Mode) */}
        <Button
          onClick={handleLogout}
          variant="outline"
          className="w-full text-xs bg-purple-50 hover:bg-purple-100 text-purple-700 border-purple-200 dark:bg-purple-950/30 dark:hover:bg-purple-950/50 dark:text-purple-300 dark:border-purple-800"
        >
          🚀 Test New Login Page
        </Button>

        {/* User Profile */}
        {currentUser && (
          <div className="flex items-center space-x-3 p-3 rounded-xl bg-gray-50 dark:bg-gray-800">
            <Avatar className="w-10 h-10">
              <AvatarImage
                src={currentUser.avatar || "/api/placeholder/40/40"}
              />
              <AvatarFallback>
                {currentUser.name
                  .split(" ")
                  .map((n) => n[0])
                  .join("")}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm truncate">{currentUser.name}</p>
              <p className="text-xs text-gray-500 truncate">
                {currentUser.course}
              </p>
            </div>
            <Button
              variant="ghost"
              size="icon"
              onClick={handleLogout}
              className="text-red-500 hover:text-red-600 hover:bg-red-50"
            >
              <LogOut className="w-4 h-4" />
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}

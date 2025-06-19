import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Progress } from "@/components/ui/progress";
import { NotificationCenter } from "@/components/notifications/NotificationCenter";
import { ChatSystem } from "@/components/chat/ChatSystem";
import { onAuthStateChanged } from "firebase/auth";
import { auth, isFirebaseConfigured } from "@/lib/firebase";
import { getCurrentUserData, KIITUser, signOutUser } from "@/lib/auth";
import {
  StudyGroup,
  subscribeToActiveStudyGroups,
  joinGroup,
  sendFriendRequest,
  startStudyTimer,
  updateStudyStatus,
} from "@/lib/studyGroups";
import {
  Heart,
  Users,
  Calendar,
  Settings,
  Search,
  Plus,
  BookOpen,
  Clock,
  Trophy,
  Play,
  Pause,
  Target,
  Zap,
  TrendingUp,
  User,
  UserPlus,
  Crown,
  Shield,
  MessageCircle,
  Timer,
  BarChart3,
  Flame,
  Award,
  LogOut,
  Menu,
  X,
} from "lucide-react";

const Dashboard = () => {
  const navigate = useNavigate();
  const [currentUser, setCurrentUser] = useState<KIITUser | null>(null);
  const [activeStudyGroups, setActiveStudyGroups] = useState<StudyGroup[]>([]);
  const [activeStudySession, setActiveStudySession] = useState(false);
  const [studyTimer, setStudyTimer] = useState("25:00");
  const [loading, setLoading] = useState(true);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  // Check authentication and load user data
  useEffect(() => {
    const checkAuth = async () => {
      // Check if user is authenticated (demo mode or real Firebase)
      const isDemoMode = !isFirebaseConfigured();

      if (isDemoMode) {
        // Demo mode: check localStorage
        const isAuth = localStorage.getItem("kiit_auth");
        const userData = localStorage.getItem("kiit_user");

        if (isAuth === "true" && userData) {
          try {
            const user = JSON.parse(userData);
            console.log("Demo mode: Loading user data", user);
            setCurrentUser(user);
          } catch (error) {
            console.error("Error parsing user data:", error);
            localStorage.removeItem("kiit_auth");
            localStorage.removeItem("kiit_user");
            navigate("/");
          }
        } else {
          console.log("Demo mode: No auth found, redirecting to login");
          navigate("/");
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
              navigate("/");
            }
          } else {
            navigate("/");
          }
          setLoading(false);
        });

        return () => unsubscribe();
      }
    };

    checkAuth();
  }, [navigate]);

  // Subscribe to active study groups
  useEffect(() => {
    const unsubscribe = subscribeToActiveStudyGroups(setActiveStudyGroups);
    return () => unsubscribe();
  }, []);

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

      console.log("Logout successful, redirecting to login");
      navigate("/", { replace: true });
    } catch (error) {
      console.error("Error signing out:", error);
      // Force navigation even if signout fails
      navigate("/", { replace: true });
    }
  };

  const handleJoinGroup = async (groupId: string) => {
    if (!currentUser) return;

    try {
      await joinGroup(groupId, {
        uid: currentUser.uid,
        name: currentUser.name,
        email: currentUser.email,
        avatar: "/api/placeholder/40/40",
        course: currentUser.course,
      });
      alert("Successfully joined the study group! 🎉");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleSendFriendRequest = async (targetUserId: string) => {
    if (!currentUser) return;

    try {
      await sendFriendRequest(currentUser.uid, targetUserId, {
        name: currentUser.name,
        email: currentUser.email,
        avatar: "/api/placeholder/40/40",
        course: currentUser.course,
      });
      alert("Friend request sent!");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const handleStartTimer = async (groupId: string) => {
    try {
      await startStudyTimer(groupId, 25, "pomodoro");
    } catch (error: any) {
      alert(error.message);
    }
  };

  const toggleStudySession = () => {
    setActiveStudySession(!activeStudySession);
  };

  // Mock stats - in real app, these would come from Firebase
  const myStats = {
    todayHours: currentUser?.totalStudyHours ? 3.5 : 0,
    weeklyHours: 25,
    totalHours: currentUser?.totalStudyHours || 0,
    streak: currentUser?.streak || 0,
    rank: currentUser?.rank || 0,
    friendsCount: currentUser?.friends?.length || 0,
    groupsJoined: currentUser?.groups?.length || 0,
    achievements: 8,
  };

  // Mock leaderboard - in real app, this would be fetched from Firebase
  const leaderboard = [
    {
      name: "Sneha Roy",
      points: 2840,
      rank: 1,
      streak: 15,
      totalHours: 248,
      weeklyHours: 35,
      avatar: "/api/placeholder/40/40",
      achievements: ["Study Master", "Consistency King"],
    },
    {
      name: "Vikash Singh",
      points: 2710,
      rank: 2,
      streak: 12,
      totalHours: 221,
      weeklyHours: 28,
      avatar: "/api/placeholder/40/40",
      achievements: ["Problem Solver"],
    },
    {
      name: currentUser?.name || "You",
      points: 2580,
      rank: 4,
      streak: myStats.streak,
      totalHours: myStats.totalHours,
      weeklyHours: myStats.weeklyHours,
      avatar: "/api/placeholder/40/40",
      achievements: ["Rising Star"],
    },
  ];

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-kiit-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg font-medium">Loading KIITConnect...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 md:h-16">
            {/* Logo and Title */}
            <div className="flex items-center space-x-2 md:space-x-3">
              <div className="w-6 h-6 md:w-8 md:h-8 bg-kiit-gradient rounded-lg flex items-center justify-center">
                <Heart className="w-3 h-3 md:w-5 md:h-5 text-white" />
              </div>
              <span className="text-lg md:text-xl font-bold gradient-text">
                KIITConnect
              </span>
            </div>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search students, groups..."
                  className="pl-10 w-64"
                />
              </div>
              <NotificationCenter />
              <ChatSystem />
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
              <Button
                variant="ghost"
                size="icon"
                onClick={handleLogout}
                title="Logout"
              >
                <LogOut className="w-5 h-5" />
              </Button>
              <Avatar className="w-8 h-8">
                <AvatarImage src="/api/placeholder/40/40" />
                <AvatarFallback>
                  {currentUser?.name
                    ?.split(" ")
                    .map((n) => n[0])
                    .join("") || "U"}
                </AvatarFallback>
              </Avatar>
            </div>

            {/* Mobile Menu Button */}
            <div className="md:hidden flex items-center space-x-2">
              <NotificationCenter />
              <ChatSystem />
              <Button
                variant="ghost"
                size="icon"
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              >
                {mobileMenuOpen ? (
                  <X className="w-5 h-5" />
                ) : (
                  <Menu className="w-5 h-5" />
                )}
              </Button>
            </div>
          </div>

          {/* Mobile Menu */}
          {mobileMenuOpen && (
            <div className="md:hidden border-t dark:border-gray-800 py-4">
              <div className="space-y-3">
                <div className="flex items-center space-x-3 px-2">
                  <Avatar className="w-10 h-10">
                    <AvatarImage src="/api/placeholder/40/40" />
                    <AvatarFallback>
                      {currentUser?.name
                        ?.split(" ")
                        .map((n) => n[0])
                        .join("") || "U"}
                    </AvatarFallback>
                  </Avatar>
                  <div>
                    <p className="font-medium">{currentUser?.name}</p>
                    <p className="text-sm text-gray-500">
                      {currentUser?.course}
                    </p>
                  </div>
                </div>
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input placeholder="Search..." className="pl-10" />
                </div>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate("/community")}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Communities
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => navigate("/profile")}
                  >
                    <User className="w-4 h-4 mr-2" />
                    Profile
                  </Button>
                </div>
                <Button
                  variant="ghost"
                  className="w-full justify-start text-red-600"
                  onClick={handleLogout}
                >
                  <LogOut className="w-4 h-4 mr-2" />
                  Logout
                </Button>
              </div>
            </div>
          )}
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 md:py-8">
        {/* Welcome Banner - Mobile */}
        <div className="md:hidden mb-6">
          <Card className="bg-kiit-gradient text-white border-0">
            <CardContent className="p-4">
              <h2 className="text-lg font-bold mb-1">
                Welcome back, {currentUser?.name?.split(" ")[0]}!
              </h2>
              <p className="text-blue-100 text-sm">
                {currentUser?.course} • {myStats.totalHours}h studied
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-4 mb-6 md:mb-8">
          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-blue-100 dark:bg-blue-900 rounded-lg flex items-center justify-center">
                  <Clock className="w-3 h-3 md:w-4 md:h-4 text-blue-600" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    Today
                  </p>
                  <p className="text-sm md:text-lg font-bold">
                    {myStats.todayHours}h
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-green-100 dark:bg-green-900 rounded-lg flex items-center justify-center">
                  <Flame className="w-3 h-3 md:w-4 md:h-4 text-green-600" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    Streak
                  </p>
                  <p className="text-sm md:text-lg font-bold">
                    {myStats.streak} days
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-yellow-100 dark:bg-yellow-900 rounded-lg flex items-center justify-center">
                  <Trophy className="w-3 h-3 md:w-4 md:h-4 text-yellow-600" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    Rank
                  </p>
                  <p className="text-sm md:text-lg font-bold">
                    #{myStats.rank || "N/A"}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-3 md:p-4">
              <div className="flex items-center space-x-2">
                <div className="w-6 h-6 md:w-8 md:h-8 bg-purple-100 dark:bg-purple-900 rounded-lg flex items-center justify-center">
                  <Users className="w-3 h-3 md:w-4 md:h-4 text-purple-600" />
                </div>
                <div>
                  <p className="text-xs md:text-sm text-gray-600 dark:text-gray-400">
                    Friends
                  </p>
                  <p className="text-sm md:text-lg font-bold">
                    {myStats.friendsCount}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="grid lg:grid-cols-3 gap-6 md:gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6 md:space-y-8">
            {/* Study Timer Widget */}
            <Card className="bg-kiit-gradient text-white border-0">
              <CardContent className="p-4 md:p-6">
                <div className="flex flex-col md:flex-row md:items-center md:justify-between space-y-4 md:space-y-0">
                  <div>
                    <h3 className="text-xl md:text-2xl font-bold mb-2">
                      Focus Session
                    </h3>
                    <p className="text-blue-100 text-sm md:text-base">
                      Stay focused with Pomodoro technique
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="text-3xl md:text-4xl font-bold mb-2">
                      {studyTimer}
                    </div>
                    <Button
                      onClick={toggleStudySession}
                      variant="secondary"
                      className="bg-white text-kiit-600 hover:bg-gray-100"
                      size="sm"
                    >
                      {activeStudySession ? (
                        <>
                          <Pause className="w-4 h-4 mr-2" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4 mr-2" />
                          Start
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Active Study Groups */}
            <Card>
              <CardHeader className="pb-3 md:pb-4">
                <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
                  <Zap className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                  <span>Live Study Groups</span>
                  <Badge variant="secondary" className="ml-2 text-xs">
                    {activeStudyGroups.length} Active
                  </Badge>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid gap-4 md:gap-6">
                  {activeStudyGroups.length === 0 ? (
                    <div className="text-center py-8">
                      <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-lg font-medium mb-2">
                        No active study groups
                      </h3>
                      <p className="text-gray-600 mb-4">
                        Be the first to start a study session today!
                      </p>
                      <Button>
                        <Plus className="w-4 h-4 mr-2" />
                        Create Study Group
                      </Button>
                    </div>
                  ) : (
                    activeStudyGroups.map((group) => {
                      const activeParticipants = group.participants.filter(
                        (p) => p.isStudying,
                      );
                      const sortedParticipants = [...group.participants].sort(
                        (a, b) => b.studyTime - a.studyTime,
                      );
                      const isCurrentUserAdmin =
                        group.adminId === currentUser?.uid;
                      const isCurrentUserParticipant = group.participants.some(
                        (p) => p.uid === currentUser?.uid,
                      );

                      return (
                        <Card
                          key={group.id}
                          className="border-l-4 border-l-green-500"
                        >
                          <CardContent className="p-4">
                            {/* Group Header */}
                            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 space-y-2 md:space-y-0">
                              <div className="flex items-center space-x-3">
                                <div className="w-10 h-10 md:w-12 md:h-12 bg-green-100 dark:bg-green-900 rounded-xl flex items-center justify-center">
                                  <BookOpen className="w-5 h-5 md:w-6 md:h-6 text-green-600" />
                                </div>
                                <div>
                                  <h4 className="font-semibold text-base md:text-lg">
                                    {group.name}
                                  </h4>
                                  <p className="text-sm text-gray-600 dark:text-gray-400">
                                    {group.subject}
                                  </p>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge
                                  variant="outline"
                                  className="text-green-600 border-green-600 text-xs"
                                >
                                  <div className="w-2 h-2 bg-green-500 rounded-full mr-1 animate-pulse"></div>
                                  Live Timer
                                </Badge>
                                {!isCurrentUserParticipant && (
                                  <Button
                                    size="sm"
                                    onClick={() => handleJoinGroup(group.id)}
                                  >
                                    Join
                                  </Button>
                                )}
                              </div>
                            </div>

                            {/* Timer Progress */}
                            <div className="mb-4">
                              <div className="flex items-center justify-between text-sm mb-2">
                                <span className="flex items-center">
                                  <Timer className="w-4 h-4 mr-1" />
                                  Study session in progress
                                </span>
                                <span className="text-xs md:text-sm">
                                  {group.timer.type}
                                </span>
                              </div>
                              <Progress value={75} className="h-2" />
                            </div>

                            {/* Active Participants */}
                            <div className="mb-4">
                              <h5 className="font-medium mb-2 flex items-center text-sm md:text-base">
                                <Users className="w-4 h-4 mr-2" />
                                Active Participants ({activeParticipants.length}
                                )
                              </h5>
                              <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                                {sortedParticipants
                                  .filter((p) => p.isStudying)
                                  .slice(0, 4)
                                  .map((participant, index) => (
                                    <div
                                      key={participant.uid}
                                      className="flex items-center space-x-2 p-2 bg-green-50 dark:bg-green-900/20 rounded-lg"
                                    >
                                      <div className="relative">
                                        <Avatar className="w-8 h-8">
                                          <AvatarImage
                                            src={participant.avatar}
                                          />
                                          <AvatarFallback className="text-xs">
                                            {participant.name
                                              .split(" ")
                                              .map((n) => n[0])
                                              .join("")}
                                          </AvatarFallback>
                                        </Avatar>
                                        {participant.role === "admin" && (
                                          <Crown className="absolute -top-1 -right-1 w-3 h-3 text-yellow-500" />
                                        )}
                                      </div>
                                      <div className="flex-1 min-w-0">
                                        <p className="text-sm font-medium truncate">
                                          {participant.name}
                                        </p>
                                        <p className="text-xs text-gray-500">
                                          {participant.studyTime}min
                                        </p>
                                      </div>
                                      <div className="flex items-center space-x-1">
                                        <Badge
                                          variant="secondary"
                                          className="text-xs px-1"
                                        >
                                          #{index + 1}
                                        </Badge>
                                        <Button
                                          size="sm"
                                          variant="ghost"
                                          className="h-6 w-6 p-0"
                                          onClick={() =>
                                            handleSendFriendRequest(
                                              participant.uid,
                                            )
                                          }
                                        >
                                          <UserPlus className="w-3 h-3" />
                                        </Button>
                                      </div>
                                    </div>
                                  ))}
                              </div>
                            </div>

                            {/* Admin Panel */}
                            {isCurrentUserAdmin &&
                              group.pendingRequests.length > 0 && (
                                <div className="mb-4 p-3 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                                  <div className="flex items-center space-x-2 mb-2">
                                    <Shield className="w-4 h-4 text-yellow-600" />
                                    <span className="text-sm font-medium">
                                      Admin Panel
                                    </span>
                                  </div>
                                  <div className="space-y-2">
                                    <p className="text-xs text-gray-600">
                                      Pending join requests:
                                    </p>
                                    {group.pendingRequests.map((request) => (
                                      <div
                                        key={request.uid}
                                        className="flex items-center justify-between p-2 bg-white dark:bg-gray-800 rounded text-sm"
                                      >
                                        <div className="flex items-center space-x-2">
                                          <Avatar className="w-6 h-6">
                                            <AvatarImage src={request.avatar} />
                                            <AvatarFallback className="text-xs">
                                              {request.name
                                                .split(" ")
                                                .map((n) => n[0])
                                                .join("")}
                                            </AvatarFallback>
                                          </Avatar>
                                          <div>
                                            <p className="font-medium">
                                              {request.name}
                                            </p>
                                            <p className="text-xs text-gray-500">
                                              {request.course}
                                            </p>
                                          </div>
                                        </div>
                                        <div className="flex space-x-1">
                                          <Button
                                            size="sm"
                                            className="h-6 px-2 text-xs bg-green-500 hover:bg-green-600"
                                            onClick={() =>
                                              handleApproveRequest(
                                                group.id,
                                                request.uid,
                                              )
                                            }
                                          >
                                            Accept
                                          </Button>
                                          <Button
                                            size="sm"
                                            variant="outline"
                                            className="h-6 px-2 text-xs border-red-300 text-red-600"
                                            onClick={() =>
                                              handleRejectRequest(
                                                group.id,
                                                request.uid,
                                              )
                                            }
                                          >
                                            Reject
                                          </Button>
                                        </div>
                                      </div>
                                    ))}
                                  </div>
                                </div>
                              )}

                            {/* Group Actions */}
                            <div className="flex flex-col md:flex-row space-y-2 md:space-y-0 md:space-x-2">
                              {isCurrentUserParticipant ? (
                                <Button className="flex-1">
                                  <Target className="w-4 h-4 mr-2" />
                                  Continue Studying
                                </Button>
                              ) : (
                                <Button
                                  className="flex-1"
                                  onClick={() => handleJoinGroup(group.id)}
                                >
                                  <Target className="w-4 h-4 mr-2" />
                                  Join Study Session
                                </Button>
                              )}
                              <Button variant="outline" size="icon">
                                <MessageCircle className="w-4 h-4" />
                              </Button>
                              {isCurrentUserAdmin && (
                                <Button variant="outline" size="icon">
                                  <Settings className="w-4 h-4" />
                                </Button>
                              )}
                            </div>
                          </CardContent>
                        </Card>
                      );
                    })
                  )}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2 mt-4">
                  <Button
                    variant="outline"
                    onClick={() => navigate("/community")}
                  >
                    <Users className="w-4 h-4 mr-2" />
                    Browse All Groups
                  </Button>
                  <Button
                    onClick={() => navigate("/create-group")}
                    className="bg-kiit-gradient hover:shadow-kiit"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create Group
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Enhanced Leaderboard */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base md:text-lg">
                  <Trophy className="w-4 h-4 md:w-5 md:h-5 text-yellow-500" />
                  <span>Study Leaderboard</span>
                  <Button variant="ghost" size="sm">
                    <BarChart3 className="w-4 h-4" />
                  </Button>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {leaderboard.map((user, index) => (
                    <div
                      key={index}
                      className={`p-3 rounded-lg transition-colors ${user.name === currentUser?.name ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800" : "hover:bg-gray-50 dark:hover:bg-gray-800"}`}
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`w-6 h-6 md:w-8 md:h-8 rounded-full flex items-center justify-center text-xs md:text-sm font-bold ${
                            user.rank === 1
                              ? "bg-yellow-500 text-white"
                              : user.rank === 2
                                ? "bg-gray-400 text-white"
                                : user.rank === 3
                                  ? "bg-orange-500 text-white"
                                  : "bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300"
                          }`}
                        >
                          {user.rank}
                        </div>
                        <Avatar className="w-6 h-6 md:w-8 md:h-8">
                          <AvatarImage src={user.avatar} />
                          <AvatarFallback className="text-xs">
                            {user.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center justify-between">
                            <p className="font-medium text-sm truncate">
                              {user.name}
                            </p>
                            <div className="text-right">
                              <p className="text-sm font-bold text-blue-600">
                                {user.totalHours}h
                              </p>
                              <p className="text-xs text-gray-500">
                                {user.weeklyHours}h/week
                              </p>
                            </div>
                          </div>
                          <div className="flex items-center space-x-2 mt-1">
                            <div className="flex items-center space-x-1">
                              <Flame className="w-3 h-3 text-orange-500" />
                              <span className="text-xs text-gray-500">
                                {user.streak}d
                              </span>
                            </div>
                          </div>
                        </div>
                        {user.name !== currentUser?.name && (
                          <Button
                            size="sm"
                            variant="ghost"
                            className="h-6 w-6 p-0"
                            onClick={() => handleSendFriendRequest("user-id")}
                          >
                            <UserPlus className="w-3 h-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                <Button
                  className="w-full mt-4"
                  variant="outline"
                  size="sm"
                  onClick={() => navigate("/leaderboard")}
                >
                  <TrendingUp className="w-4 h-4 mr-2" />
                  View Full Leaderboard
                </Button>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="text-base">Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button
                  className="w-full justify-start text-sm"
                  variant="outline"
                  onClick={() => navigate("/community")}
                >
                  <Users className="w-4 h-4 mr-2" />
                  Browse Communities
                </Button>
                <Button
                  className="w-full justify-start text-sm"
                  variant="outline"
                >
                  <Plus className="w-4 h-4 mr-2" />
                  Create Study Group
                </Button>
                <Button
                  className="w-full justify-start text-sm"
                  variant="outline"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  Schedule Session
                </Button>
                <Button
                  className="w-full justify-start text-sm"
                  variant="outline"
                >
                  <Target className="w-4 h-4 mr-2" />
                  Set Study Goals
                </Button>
              </CardContent>
            </Card>

            {/* Personal Progress */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center space-x-2 text-base">
                  <Award className="w-4 h-4 md:w-5 md:h-5 text-purple-500" />
                  <span>Your Progress</span>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Weekly Goal</span>
                    <span className="font-bold">{myStats.weeklyHours}/30h</span>
                  </div>
                  <Progress
                    value={(myStats.weeklyHours / 30) * 100}
                    className="h-2"
                  />
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span>Study Streak</span>
                    <span className="font-bold">{myStats.streak} days</span>
                  </div>
                  <Progress
                    value={(myStats.streak / 30) * 100}
                    className="h-2"
                  />
                </div>
                <div className="grid grid-cols-2 gap-4 pt-2">
                  <div className="text-center">
                    <p className="text-lg md:text-xl font-bold text-blue-600">
                      {myStats.totalHours}
                    </p>
                    <p className="text-xs text-gray-500">Total Hours</p>
                  </div>
                  <div className="text-center">
                    <p className="text-lg md:text-xl font-bold text-green-600">
                      {myStats.achievements}
                    </p>
                    <p className="text-xs text-gray-500">Achievements</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

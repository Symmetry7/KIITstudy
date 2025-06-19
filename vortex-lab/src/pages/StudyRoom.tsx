import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import { getUserJoinedGroups } from "@/lib/studyGroups";
import {
  subscribeToGroupChat,
  sendMessage,
  sendSystemMessage,
} from "@/lib/chatService";
import { notificationService } from "@/lib/notificationService";
import {
  ArrowLeft,
  Heart,
  Users,
  MessageCircle,
  Play,
  Pause,
  Square,
  Timer,
  Trophy,
  Crown,
  Send,
  Clock,
  Target,
  Zap,
  Settings,
  Medal,
  TrendingUp,
  Calendar,
  Flame,
} from "lucide-react";

interface StudySession {
  id: string;
  startTime: Date;
  endTime?: Date;
  duration: number; // in seconds
  isActive: boolean;
  isPaused: boolean;
  pausedTime: number; // total paused time in seconds
}

interface Participant {
  id: string;
  name: string;
  avatar: string;
  isStudying: boolean;
  totalStudyTime: number; // in minutes
  todayStudyTime: number; // in minutes
  currentSessionTime: number; // in minutes
  rank: number;
  isAdmin: boolean;
  streak: number;
  lastActive: Date;
}

const StudyRoom = () => {
  const { groupId, id } = useParams(); // Also check for 'id' param
  const navigate = useNavigate();
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const intervalRef = useRef<NodeJS.Timeout | null>(null);

  // Use either groupId or id parameter
  const actualGroupId = groupId || id;

  // Session Management
  const [currentSession, setCurrentSession] = useState<StudySession | null>(
    null,
  );
  const [totalSessionTime, setTotalSessionTime] = useState(0); // in seconds
  const [todayTotalTime, setTodayTotalTime] = useState(0); // in minutes
  const [isStudying, setIsStudying] = useState(false);
  const [isPaused, setIsPaused] = useState(false);

  // Chat states
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState<any[]>([]);
  const [isLoadingMessages, setIsLoadingMessages] = useState(true);

  // Group data
  const [groupData, setGroupData] = useState<any>(null);
  const [participants, setParticipants] = useState<Participant[]>([]);

  // Initialize group data
  useEffect(() => {
    const initializeGroup = async () => {
      console.log(
        "Initializing group with ID:",
        actualGroupId,
        "from params:",
        { groupId, id },
      );

      try {
        // Add a small delay to simulate loading
        await new Promise((resolve) => setTimeout(resolve, 500));

        // In a real app, you'd fetch this data from your backend
        const mockGroupData = {
          id: actualGroupId,
          name:
            actualGroupId === "user-group-1"
              ? "My Study Circle"
              : "DSA Marathon",
          subject:
            actualGroupId === "user-group-1"
              ? "Computer Science"
              : "Data Structures & Algorithms",
          admin: {
            name: "Rahul Kumar",
            avatar: "/api/placeholder/40/40",
          },
        };

        // Mock participants with realistic study data
        const mockParticipants: Participant[] = [
          {
            id: "1",
            name: "Rahul Kumar",
            avatar: "/api/placeholder/40/40",
            isStudying: true,
            totalStudyTime: 145,
            todayStudyTime: 45,
            currentSessionTime: 25,
            rank: 1,
            isAdmin: true,
            streak: 7,
            lastActive: new Date(),
          },
          {
            id: "2",
            name: "Priya Sharma",
            avatar: "/api/placeholder/40/40",
            isStudying: true,
            totalStudyTime: 132,
            todayStudyTime: 38,
            currentSessionTime: 18,
            rank: 2,
            isAdmin: false,
            streak: 5,
            lastActive: new Date(),
          },
          {
            id: "3",
            name: "Arjun Patel",
            avatar: "/api/placeholder/40/40",
            isStudying: false,
            totalStudyTime: 98,
            todayStudyTime: 22,
            currentSessionTime: 0,
            rank: 3,
            isAdmin: false,
            streak: 3,
            lastActive: new Date(Date.now() - 300000), // 5 minutes ago
          },
          {
            id: "current-user",
            name: "You",
            avatar: "/api/placeholder/40/40",
            isStudying: isStudying,
            totalStudyTime: todayTotalTime,
            todayStudyTime: todayTotalTime,
            currentSessionTime: Math.floor(totalSessionTime / 60),
            rank: 4,
            isAdmin: false,
            streak: 2,
            lastActive: new Date(),
          },
        ];

        setGroupData(mockGroupData);
        setParticipants(mockParticipants);
        console.log("Group initialized successfully:", mockGroupData);
      } catch (error) {
        console.error("Error initializing group:", error);
        // Set a fallback group data
        setGroupData({
          id: actualGroupId || "unknown",
          name: "Study Room",
          subject: "General Study",
          admin: {
            name: "Admin",
            avatar: "/api/placeholder/40/40",
          },
        });
      }
    };

    if (actualGroupId) {
      initializeGroup();
    } else {
      console.warn("No groupId provided");
      // Set default data if no groupId
      setGroupData({
        id: "default",
        name: "Study Room",
        subject: "General Study",
        admin: {
          name: "Admin",
          avatar: "/api/placeholder/40/40",
        },
      });
    }
  }, [actualGroupId, isStudying, todayTotalTime, totalSessionTime]);

  // Subscribe to chat messages
  useEffect(() => {
    if (!actualGroupId) return;

    setIsLoadingMessages(true);
    const unsubscribe = subscribeToGroupChat(actualGroupId, (chatMessages) => {
      setMessages(chatMessages);
      setIsLoadingMessages(false);
    });

    return () => unsubscribe();
  }, [actualGroupId]);

  // Auto-scroll chat messages
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Study session timer
  useEffect(() => {
    if (isStudying && !isPaused && currentSession) {
      intervalRef.current = setInterval(() => {
        setTotalSessionTime((prev) => prev + 1);
      }, 1000);
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    }

    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
    };
  }, [isStudying, isPaused, currentSession]);

  // Start study session
  const startStudySession = async () => {
    const newSession: StudySession = {
      id: `session_${Date.now()}`,
      startTime: new Date(),
      duration: 0,
      isActive: true,
      isPaused: false,
      pausedTime: 0,
    };

    setCurrentSession(newSession);
    setIsStudying(true);
    setIsPaused(false);
    setTotalSessionTime(0);

    // Send system message
    if (actualGroupId) {
      await sendSystemMessage(actualGroupId, "You started a study session");
    }

    // Show notification
    if ("Notification" in window && Notification.permission === "granted") {
      new Notification("Study session started!", {
        body: "You're now in focus mode. Good luck!",
        icon: "/favicon.ico",
      });
    }
  };

  // Pause study session
  const pauseStudySession = async () => {
    if (currentSession) {
      setIsPaused(true);

      if (actualGroupId) {
        await sendSystemMessage(actualGroupId, "You paused your study session");
      }
    }
  };

  // Resume study session
  const resumeStudySession = async () => {
    if (currentSession) {
      setIsPaused(false);

      if (actualGroupId) {
        await sendSystemMessage(
          actualGroupId,
          "You resumed your study session",
        );
      }
    }
  };

  // Stop study session
  const stopStudySession = async () => {
    if (currentSession) {
      const sessionMinutes = Math.floor(totalSessionTime / 60);

      setCurrentSession((prev) =>
        prev
          ? {
              ...prev,
              endTime: new Date(),
              duration: totalSessionTime,
              isActive: false,
            }
          : null,
      );

      setIsStudying(false);
      setIsPaused(false);
      setTodayTotalTime((prev) => prev + sessionMinutes);

      // Send system message
      if (actualGroupId) {
        await sendSystemMessage(
          actualGroupId,
          `You completed a ${sessionMinutes} minute study session! 🎉`,
        );
      }

      // Trigger notifications
      notificationService.notifySessionComplete(
        sessionMinutes,
        groupData?.name,
      );

      // Check for milestones
      const newTotalTime = todayTotalTime + sessionMinutes;
      if (newTotalTime >= 60 && todayTotalTime < 60) {
        notificationService.notifyStudyMilestone(
          "1 hour of study",
          newTotalTime,
        );
      } else if (newTotalTime >= 120 && todayTotalTime < 120) {
        notificationService.notifyStudyMilestone(
          "2 hours of study",
          newTotalTime,
        );
      }

      // Check for rank improvements (mock logic)
      const oldRank = currentUserStats?.rank || 4;
      if (sessionMinutes >= 30 && oldRank > 2) {
        notificationService.notifyRankChange(
          oldRank - 1,
          oldRank,
          groupData?.name || "Study Group",
        );
      }
    }
  };

  // Send chat message
  const sendChatMessage = async () => {
    if (!message.trim() || !actualGroupId) return;

    try {
      await sendMessage(actualGroupId, message, {
        uid: "current-user",
        name: "You",
        avatar: "/api/placeholder/40/40",
      });
      setMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendChatMessage();
    }
  };

  // Format time display
  const formatTime = (seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate leaderboard
  const sortedParticipants = [...participants]
    .sort((a, b) => b.todayStudyTime - a.todayStudyTime)
    .map((p, index) => ({ ...p, rank: index + 1 }));

  const activeParticipants = participants.filter((p) => p.isStudying);
  const currentUserStats = participants.find((p) => p.id === "current-user");

  // Initialize notifications
  useEffect(() => {
    const initNotifications = async () => {
      await notificationService.requestPermission();
    };
    initNotifications();
  }, []);

  if (!groupData) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-kiit-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Heart className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg font-medium mb-2">Loading study room...</p>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Setting up your study space for group: {actualGroupId}
          </p>
          <div className="mt-4">
            <Button
              variant="outline"
              onClick={() => navigate("/my-groups")}
              className="text-sm"
            >
              ← Back to My Groups
            </Button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/my-groups")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-8 h-8 bg-kiit-gradient rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <div>
                <span className="text-xl font-bold gradient-text">
                  {groupData.name}
                </span>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  {groupData.subject}
                </p>
              </div>
            </div>

            <div className="flex items-center space-x-4">
              <Badge className="bg-green-500 text-white">
                <Users className="w-3 h-3 mr-1" />
                {activeParticipants.length} studying
              </Badge>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Study Area */}
          <div className="lg:col-span-2">
            <Tabs defaultValue="timer" className="space-y-6">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="timer">Study Live</TabsTrigger>
                <TabsTrigger value="leaderboard">Leaderboard</TabsTrigger>
                <TabsTrigger value="chat">Group Chat</TabsTrigger>
              </TabsList>

              {/* Study Timer Tab */}
              <TabsContent value="timer" className="space-y-6">
                <Card className="bg-gradient-to-r from-kiit-500 to-connect-500 text-white border-0">
                  <CardContent className="p-8 text-center">
                    <h2 className="text-3xl font-bold mb-4">Focus Timer</h2>

                    {/* No-End Timer Display */}
                    <div className="text-7xl font-bold mb-6 font-mono">
                      {formatTime(totalSessionTime)}
                    </div>

                    <div className="mb-6">
                      <p className="text-lg text-blue-100">
                        {isStudying
                          ? isPaused
                            ? "Session Paused"
                            : "Studying in Progress"
                          : "Ready to Start"}
                      </p>
                    </div>

                    {/* Control Buttons */}
                    <div className="flex justify-center space-x-4 mb-6">
                      {!isStudying ? (
                        <Button
                          onClick={startStudySession}
                          variant="secondary"
                          className="bg-white text-kiit-600 text-lg px-8 py-3"
                          size="lg"
                        >
                          <Play className="w-5 h-5 mr-2" />
                          Start Studying
                        </Button>
                      ) : (
                        <>
                          {isPaused ? (
                            <Button
                              onClick={resumeStudySession}
                              variant="secondary"
                              className="bg-green-500 text-white hover:bg-green-600 text-lg px-6 py-3"
                              size="lg"
                            >
                              <Play className="w-5 h-5 mr-2" />
                              Resume
                            </Button>
                          ) : (
                            <Button
                              onClick={pauseStudySession}
                              variant="secondary"
                              className="bg-yellow-500 text-white hover:bg-yellow-600 text-lg px-6 py-3"
                              size="lg"
                            >
                              <Pause className="w-5 h-5 mr-2" />
                              Pause
                            </Button>
                          )}
                          <Button
                            onClick={stopStudySession}
                            variant="secondary"
                            className="bg-red-500 text-white hover:bg-red-600 text-lg px-6 py-3"
                            size="lg"
                          >
                            <Square className="w-5 h-5 mr-2" />
                            Stop
                          </Button>
                        </>
                      )}
                    </div>

                    {/* Session Stats */}
                    <div className="grid grid-cols-3 gap-4 text-center text-blue-100">
                      <div>
                        <div className="text-2xl font-bold">
                          {Math.floor(totalSessionTime / 60)}m
                        </div>
                        <div className="text-sm">Current Session</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">
                          {todayTotalTime}m
                        </div>
                        <div className="text-sm">Today Total</div>
                      </div>
                      <div>
                        <div className="text-2xl font-bold">
                          #{currentUserStats?.rank || 4}
                        </div>
                        <div className="text-sm">Your Rank</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {/* Study Progress */}
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <TrendingUp className="w-5 h-5 text-kiit-600" />
                      <span>Your Study Progress</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                      <div className="p-4 bg-gradient-to-r from-blue-50 to-blue-100 dark:from-blue-900/20 dark:to-blue-800/20 rounded-lg">
                        <div className="text-2xl font-bold text-blue-600">
                          {Math.floor(totalSessionTime / 60)}
                        </div>
                        <div className="text-sm text-gray-600">
                          Current Session
                        </div>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-green-50 to-green-100 dark:from-green-900/20 dark:to-green-800/20 rounded-lg">
                        <div className="text-2xl font-bold text-green-600">
                          {todayTotalTime}
                        </div>
                        <div className="text-sm text-gray-600">Today</div>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-purple-50 to-purple-100 dark:from-purple-900/20 dark:to-purple-800/20 rounded-lg">
                        <div className="text-2xl font-bold text-purple-600">
                          {currentUserStats?.streak || 2}
                        </div>
                        <div className="text-sm text-gray-600">Day Streak</div>
                      </div>
                      <div className="p-4 bg-gradient-to-r from-yellow-50 to-yellow-100 dark:from-yellow-900/20 dark:to-yellow-800/20 rounded-lg">
                        <div className="text-2xl font-bold text-yellow-600">
                          #{currentUserStats?.rank || 4}
                        </div>
                        <div className="text-sm text-gray-600">Group Rank</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Leaderboard Tab */}
              <TabsContent value="leaderboard" className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <Trophy className="w-5 h-5 text-yellow-500" />
                      <span>Group Leaderboard</span>
                      <Badge variant="secondary">Today's Rankings</Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {sortedParticipants.map((participant, index) => (
                        <div
                          key={participant.id}
                          className={`flex items-center space-x-4 p-4 rounded-lg transition-all ${
                            participant.id === "current-user"
                              ? "bg-kiit-50 dark:bg-kiit-900/20 border-2 border-kiit-200 dark:border-kiit-800"
                              : index < 3
                                ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                                : "bg-gray-50 dark:bg-gray-800/50"
                          }`}
                        >
                          {/* Rank */}
                          <div className="flex items-center justify-center w-8 h-8">
                            {index === 0 ? (
                              <Crown className="w-6 h-6 text-yellow-500" />
                            ) : index === 1 ? (
                              <Medal className="w-6 h-6 text-gray-400" />
                            ) : index === 2 ? (
                              <Medal className="w-6 h-6 text-amber-600" />
                            ) : (
                              <span className="text-lg font-bold text-gray-500">
                                #{index + 1}
                              </span>
                            )}
                          </div>

                          {/* Avatar */}
                          <div className="relative">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={participant.avatar} />
                              <AvatarFallback>
                                {participant.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            {participant.isAdmin && (
                              <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500" />
                            )}
                            {participant.isStudying && (
                              <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                            )}
                          </div>

                          {/* User Info */}
                          <div className="flex-1">
                            <div className="flex items-center space-x-2">
                              <p className="font-semibold">
                                {participant.name}
                                {participant.id === "current-user" && " (You)"}
                              </p>
                              {participant.isStudying && (
                                <Badge
                                  variant="secondary"
                                  className="text-xs bg-green-100 text-green-800"
                                >
                                  Studying
                                </Badge>
                              )}
                            </div>
                            <div className="flex items-center space-x-4 text-sm text-gray-600">
                              <span>
                                Today: {participant.todayStudyTime}min
                              </span>
                              <span>•</span>
                              <span className="flex items-center">
                                <Flame className="w-3 h-3 mr-1 text-orange-500" />
                                {participant.streak} day streak
                              </span>
                              {participant.currentSessionTime > 0 && (
                                <>
                                  <span>•</span>
                                  <span>
                                    Current: {participant.currentSessionTime}min
                                  </span>
                                </>
                              )}
                            </div>
                          </div>

                          {/* Study Time */}
                          <div className="text-right">
                            <div className="text-2xl font-bold text-kiit-600">
                              {participant.todayStudyTime}
                            </div>
                            <div className="text-xs text-gray-500">minutes</div>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Leaderboard Stats */}
                    <div className="mt-6 pt-6 border-t">
                      <div className="grid grid-cols-3 gap-4 text-center">
                        <div>
                          <div className="text-2xl font-bold text-kiit-600">
                            {sortedParticipants.reduce(
                              (acc, p) => acc + p.todayStudyTime,
                              0,
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            Total Group Minutes
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-green-600">
                            {activeParticipants.length}
                          </div>
                          <div className="text-sm text-gray-600">
                            Currently Studying
                          </div>
                        </div>
                        <div>
                          <div className="text-2xl font-bold text-purple-600">
                            {Math.round(
                              sortedParticipants.reduce(
                                (acc, p) => acc + p.todayStudyTime,
                                0,
                              ) / sortedParticipants.length,
                            )}
                          </div>
                          <div className="text-sm text-gray-600">
                            Average Minutes
                          </div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Chat Tab */}
              <TabsContent value="chat" className="space-y-6">
                <Card className="h-[600px] flex flex-col">
                  <CardHeader className="pb-3 flex-shrink-0">
                    <CardTitle className="flex items-center space-x-2">
                      <MessageCircle className="w-5 h-5" />
                      <span>Group Chat</span>
                      <Badge variant="secondary" className="ml-2">
                        {participants.length} members
                      </Badge>
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="flex-1 flex flex-col p-4 min-h-0">
                    <ScrollArea className="flex-1 pr-4 mb-4">
                      {isLoadingMessages ? (
                        <div className="flex items-center justify-center py-8">
                          <div className="text-center">
                            <div className="w-8 h-8 border-2 border-kiit-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                            <p className="text-gray-500 text-sm">
                              Loading messages...
                            </p>
                          </div>
                        </div>
                      ) : (
                        <div className="space-y-4 pb-4">
                          {messages.map((msg, index) => {
                            const prevMessage = messages[index - 1];
                            const showAvatar =
                              !prevMessage ||
                              prevMessage.userId !== msg.userId ||
                              new Date(msg.timestamp).getTime() -
                                new Date(prevMessage.timestamp).getTime() >
                                5 * 60 * 1000;

                            return (
                              <div key={msg.id}>
                                {/* System messages */}
                                {msg.type === "system" && (
                                  <div className="flex justify-center my-2">
                                    <Badge
                                      variant="secondary"
                                      className="text-xs bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-200"
                                    >
                                      {msg.content}
                                    </Badge>
                                  </div>
                                )}

                                {/* Regular messages */}
                                {msg.type === "text" && (
                                  <div
                                    className={`flex items-start space-x-3 ${
                                      msg.userId === "current-user"
                                        ? "flex-row-reverse space-x-reverse"
                                        : ""
                                    }`}
                                  >
                                    {/* Avatar */}
                                    <div
                                      className={`${showAvatar ? "opacity-100" : "opacity-0"} transition-opacity`}
                                    >
                                      <Avatar className="w-8 h-8">
                                        <AvatarImage src={msg.userAvatar} />
                                        <AvatarFallback className="text-xs">
                                          {msg.userName
                                            .split(" ")
                                            .map((n: string) => n[0])
                                            .join("")}
                                        </AvatarFallback>
                                      </Avatar>
                                    </div>

                                    {/* Message bubble */}
                                    <div
                                      className={`flex-1 max-w-xs ${
                                        msg.userId === "current-user"
                                          ? "text-right"
                                          : ""
                                      }`}
                                    >
                                      {/* Username and time */}
                                      {showAvatar && (
                                        <div
                                          className={`flex items-center space-x-2 mb-1 text-xs ${
                                            msg.userId === "current-user"
                                              ? "justify-end"
                                              : ""
                                          }`}
                                        >
                                          <span className="font-medium text-gray-900 dark:text-white">
                                            {msg.userName}
                                          </span>
                                          <span className="text-gray-500">
                                            {new Date(
                                              msg.timestamp,
                                            ).toLocaleTimeString([], {
                                              hour: "2-digit",
                                              minute: "2-digit",
                                            })}
                                          </span>
                                        </div>
                                      )}

                                      {/* Message content */}
                                      <div
                                        className={`rounded-2xl px-3 py-2 inline-block max-w-full text-sm ${
                                          msg.userId === "current-user"
                                            ? "bg-kiit-gradient text-white rounded-br-md"
                                            : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md"
                                        }`}
                                      >
                                        <p className="whitespace-pre-wrap break-words">
                                          {msg.content}
                                        </p>
                                      </div>

                                      {/* Time for grouped messages */}
                                      {!showAvatar && (
                                        <div
                                          className={`text-xs text-gray-400 mt-1 ${
                                            msg.userId === "current-user"
                                              ? "text-right"
                                              : ""
                                          }`}
                                        >
                                          {new Date(
                                            msg.timestamp,
                                          ).toLocaleTimeString([], {
                                            hour: "2-digit",
                                            minute: "2-digit",
                                          })}
                                        </div>
                                      )}
                                    </div>
                                  </div>
                                )}
                              </div>
                            );
                          })}
                          <div ref={messagesEndRef} />
                        </div>
                      )}
                    </ScrollArea>

                    <div className="flex-shrink-0 border-t pt-4">
                      <div className="flex space-x-2">
                        <Input
                          placeholder="Type a message..."
                          value={message}
                          onChange={(e) => setMessage(e.target.value)}
                          onKeyPress={handleKeyPress}
                          className="flex-1 rounded-full"
                        />
                        <Button
                          onClick={sendChatMessage}
                          disabled={!message.trim()}
                          className="bg-kiit-gradient text-white rounded-full px-4"
                        >
                          <Send className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Live Participants */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Zap className="w-5 h-5 text-yellow-500" />
                  <span>Live Participants</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {participants.map((participant) => (
                    <div
                      key={participant.id}
                      className={`flex items-center space-x-3 p-3 rounded-lg transition-all ${
                        participant.isStudying
                          ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                          : "bg-gray-50 dark:bg-gray-800"
                      }`}
                    >
                      <div className="relative">
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={participant.avatar} />
                          <AvatarFallback>
                            {participant.name
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                        {participant.isAdmin && (
                          <Crown className="absolute -top-1 -right-1 w-4 h-4 text-yellow-500" />
                        )}
                        {participant.isStudying && (
                          <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 border-2 border-white rounded-full animate-pulse" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <p className="font-medium text-sm">
                            {participant.name}
                            {participant.id === "current-user" && " (You)"}
                          </p>
                          <Badge variant="secondary" className="text-xs">
                            #{participant.rank}
                          </Badge>
                        </div>
                        <p className="text-xs text-gray-500">
                          {participant.todayStudyTime}min today •{" "}
                          {participant.isStudying ? "Studying" : "Break"}
                        </p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Quick Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Quick Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full justify-start" size="sm">
                  <Target className="w-4 h-4 mr-2" />
                  Set Study Goal
                </Button>
                <Button
                  className="w-full justify-start"
                  size="sm"
                  variant="outline"
                >
                  <Calendar className="w-4 h-4 mr-2" />
                  View Schedule
                </Button>
                <Button
                  className="w-full justify-start"
                  size="sm"
                  variant="outline"
                  onClick={() => navigate("/my-groups")}
                >
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Back to My Groups
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StudyRoom;

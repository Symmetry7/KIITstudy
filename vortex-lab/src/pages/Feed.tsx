import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Input } from "@/components/ui/input";
import {
  StudyGroup,
  subscribeToActiveStudyGroups,
  joinGroup,
} from "@/lib/studyGroups";
import { getCurrentUserData, KIITUser } from "@/lib/auth";
import {
  Play,
  Users,
  Clock,
  Target,
  BookOpen,
  Search,
  Zap,
  Timer,
  Filter,
  CheckCircle,
} from "lucide-react";

interface FeedProps {
  currentUser: KIITUser | null;
}

export default function Feed({ currentUser }: FeedProps) {
  const navigate = useNavigate();
  const [activeGroups, setActiveGroups] = useState<StudyGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = subscribeToActiveStudyGroups((groups) => {
      setActiveGroups(groups);
      setLoading(false);
    });
    return () => unsubscribe();
  }, []);

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

      // Update the group in the active groups list to reflect the new participant
      setActiveGroups((prevGroups) =>
        prevGroups.map((group) => {
          if (group.id === groupId) {
            return {
              ...group,
              participants: [
                ...group.participants,
                {
                  uid: currentUser.uid,
                  name: currentUser.name,
                  email: currentUser.email,
                  avatar: "/api/placeholder/40/40",
                  course: currentUser.course,
                  isStudying: false,
                  studyTime: 0,
                  joinedAt: new Date(),
                  role: "member",
                },
              ],
            };
          }
          return group;
        }),
      );

      // Show success message
      alert(
        "🎉 Successfully joined the study group!\n\nYou can find it in 'My Groups' section and start chatting with your study partners.",
      );
    } catch (error: any) {
      alert(`❌ ${error.message}`);
    }
  };

  const filteredGroups = activeGroups.filter(
    (group) =>
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.subject.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-kiit-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Play className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg font-medium">Loading live sessions...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Live Study Sessions
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Join active study groups happening right now
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search live sessions..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        {filteredGroups.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-20 h-20 bg-gray-200 dark:bg-gray-700 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <Timer className="w-10 h-10 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
              No live sessions right now
            </h3>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              Be the first to start a study session today!
            </p>
            <Button
              onClick={() => navigate("/create-group")}
              className="bg-kiit-gradient text-white"
            >
              <Target className="w-4 h-4 mr-2" />
              Create Study Group
            </Button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
            {filteredGroups.map((group) => (
              <Card
                key={group.id}
                className="overflow-hidden hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-green-500 rounded-xl flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {group.subject}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-1">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-xs text-green-600 font-medium">
                        LIVE
                      </span>
                    </div>
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  {/* Timer Display */}
                  <div className="text-center p-4 bg-gray-50 dark:bg-gray-800 rounded-xl">
                    <div className="text-2xl font-bold text-green-600">
                      {formatTime(Math.max(0, group.timer.duration * 60 - 300))}
                    </div>
                    <p className="text-sm text-gray-500 capitalize">
                      {group.timer.type} session
                    </p>
                  </div>

                  {/* Active Participants */}
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-sm font-medium flex items-center">
                        <Users className="w-4 h-4 mr-1" />
                        {group.participants.length} studying
                      </span>
                      <span className="text-xs text-gray-500">
                        {group.participants.filter((p) => p.isStudying).length}{" "}
                        active
                      </span>
                    </div>

                    <div className="flex -space-x-2">
                      {group.participants
                        .slice(0, 6)
                        .map((participant, index) => (
                          <Avatar
                            key={participant.uid}
                            className="w-8 h-8 border-2 border-white"
                          >
                            <AvatarImage src={participant.avatar} />
                            <AvatarFallback className="text-xs">
                              {participant.name
                                .split(" ")
                                .map((n) => n[0])
                                .join("")}
                            </AvatarFallback>
                          </Avatar>
                        ))}
                      {group.participants.length > 6 && (
                        <div className="w-8 h-8 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-white flex items-center justify-center">
                          <span className="text-xs font-medium">
                            +{group.participants.length - 6}
                          </span>
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-2 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-kiit-600">
                        {group.stats.totalHours}
                      </div>
                      <div className="text-xs text-gray-500">Total Hours</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600">
                        {group.stats.totalSessions}
                      </div>
                      <div className="text-xs text-gray-500">Sessions</div>
                    </div>
                  </div>

                  {/* Join Button */}
                  {group.participants.some(
                    (p) => p.uid === currentUser?.uid,
                  ) ? (
                    <Button
                      disabled
                      className="w-full bg-gray-400 text-white cursor-not-allowed"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Already Joined
                    </Button>
                  ) : (
                    <Button
                      onClick={() => handleJoinGroup(group.id)}
                      className="w-full bg-green-500 hover:bg-green-600 text-white"
                    >
                      <Zap className="w-4 h-4 mr-2" />
                      Join Live Session
                    </Button>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

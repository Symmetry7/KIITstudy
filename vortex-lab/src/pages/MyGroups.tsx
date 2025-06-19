import { useState, useEffect } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StudyGroup, getUserJoinedGroups, leaveGroup } from "@/lib/studyGroups";
import { KIITUser } from "@/lib/auth";
import {
  Users,
  Clock,
  MessageCircle,
  Trophy,
  Settings,
  BookOpen,
  Play,
  Pause,
  Target,
  Crown,
} from "lucide-react";

interface MyGroupsProps {
  currentUser: KIITUser | null;
}

export default function MyGroups({ currentUser }: MyGroupsProps) {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [myGroups, setMyGroups] = useState<StudyGroup[]>([]);
  const [loading, setLoading] = useState(true);

  // Debug: Log that the component is mounting
  console.log("MyGroups component mounted with user:", currentUser?.name);

  const selectedGroupId = searchParams.get("group");
  const activeTab = searchParams.get("tab") || "overview";

  useEffect(() => {
    const loadJoinedGroups = async () => {
      if (!currentUser) return;

      try {
        // Load both joined groups and created groups
        const joinedGroups = await getUserJoinedGroups(currentUser.uid);

        // Also load user-created groups from localStorage
        const createdGroupsKey = `createdGroups_${currentUser.uid}`;
        const createdGroups = JSON.parse(
          localStorage.getItem(createdGroupsKey) || "[]",
        );

        // Combine and deduplicate groups
        const allGroups = [...joinedGroups];

        // Add created groups that aren't already in joined groups
        createdGroups.forEach((createdGroup: StudyGroup) => {
          if (!allGroups.find((group) => group.id === createdGroup.id)) {
            allGroups.push(createdGroup);
          }
        });

        setMyGroups(allGroups);
      } catch (error) {
        console.error("Error loading joined groups:", error);
      } finally {
        setLoading(false);
      }
    };

    loadJoinedGroups();
  }, [currentUser]);

  const handleSelectGroup = (groupId: string, tab: string = "overview") => {
    const params = new URLSearchParams();
    params.set("group", groupId);
    params.set("tab", tab);
    navigate(`/my-groups?${params.toString()}`);
  };

  const selectedGroup = myGroups.find((g) => g.id === selectedGroupId);
  const isAdmin = selectedGroup?.adminId === currentUser?.uid;

  const handleLeaveGroup = async (groupId: string) => {
    if (!currentUser) return;

    const confirmed = window.confirm(
      "Are you sure you want to leave this group? You'll need to request to join again if you change your mind.",
    );

    if (!confirmed) return;

    try {
      await leaveGroup(groupId, currentUser.uid);

      // Remove from local state
      setMyGroups((prev) => prev.filter((group) => group.id !== groupId));

      // If this was the selected group, clear selection
      if (selectedGroupId === groupId) {
        navigate("/my-groups");
      }

      alert("✅ Successfully left the group.");
    } catch (error: any) {
      alert(`❌ ${error.message}`);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-kiit-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <Users className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg font-medium">Loading your groups...</p>
          <p className="text-sm text-gray-500 mt-2">
            Please wait while we fetch your study groups
          </p>
        </div>
      </div>
    );
  }

  if (!currentUser) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 bg-red-500 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <Users className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg font-medium">Authentication Required</p>
          <p className="text-sm text-gray-500 mt-2">
            Please log in to view your groups
          </p>
          <Button
            onClick={() => navigate("/")}
            className="mt-4 bg-kiit-gradient text-white"
          >
            Go to Login
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      <div className="flex h-full">
        {/* Groups Sidebar */}
        <div className="w-80 bg-white dark:bg-gray-900 border-r dark:border-gray-800 overflow-y-auto">
          <div className="p-6 border-b dark:border-gray-800">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white">
              My Groups
            </h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm mt-1">
              {myGroups.length} groups joined
            </p>
          </div>

          <div className="p-4 space-y-3">
            {myGroups.map((group) => (
              <Card
                key={group.id}
                className={`cursor-pointer transition-all ${
                  selectedGroupId === group.id
                    ? "ring-2 ring-kiit-500 bg-kiit-50 dark:bg-kiit-900/20"
                    : "hover:bg-gray-50 dark:hover:bg-gray-800"
                }`}
                onClick={() => handleSelectGroup(group.id)}
              >
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center space-x-2">
                      <h3 className="font-semibold text-sm">{group.name}</h3>
                      {group.adminId === currentUser?.uid && (
                        <Badge className="bg-green-500 text-white text-xs px-2 py-1 flex items-center">
                          <Crown className="w-3 h-3 mr-1" />
                          Admin
                        </Badge>
                      )}
                    </div>
                    <div className="flex items-center space-x-1">
                      {group.timer.isActive && (
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      )}
                    </div>
                  </div>
                  <p className="text-xs text-gray-600 dark:text-gray-400 mb-2">
                    {group.subject}
                  </p>
                  <div className="flex items-center justify-between text-xs">
                    <span className="flex items-center text-gray-500">
                      <Users className="w-3 h-3 mr-1" />
                      {group.participants.length}
                    </span>
                    <Badge
                      variant={group.timer.isActive ? "default" : "secondary"}
                      className="text-xs"
                    >
                      {group.timer.isActive ? "Active" : "Offline"}
                    </Badge>
                  </div>
                </CardContent>
              </Card>
            ))}

            {myGroups.length === 0 && (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <p className="text-gray-500 text-sm mb-4">
                  No groups joined yet
                </p>
                <div className="space-y-2">
                  <Button
                    className="w-full bg-kiit-gradient text-white"
                    size="sm"
                    onClick={() => navigate("/create-group")}
                  >
                    Create Your First Group
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="w-full"
                    onClick={() => navigate("/browse-groups")}
                  >
                    Browse Existing Groups
                  </Button>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Group Details */}
        <div className="flex-1 overflow-y-auto">
          {selectedGroup ? (
            <div className="h-full">
              {/* Group Header */}
              <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <h1 className="text-2xl font-bold text-gray-900 dark:text-white flex items-center">
                      {selectedGroup.name}
                      {isAdmin && (
                        <Crown className="w-6 h-6 text-yellow-500 ml-2" />
                      )}
                    </h1>
                    <p className="text-gray-600 dark:text-gray-400 mt-1">
                      {selectedGroup.subject} •{" "}
                      {selectedGroup.participants.length} members
                    </p>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Badge
                      variant={
                        selectedGroup.timer.isActive ? "default" : "secondary"
                      }
                      className="flex items-center"
                    >
                      {selectedGroup.timer.isActive ? (
                        <Play className="w-3 h-3 mr-1" />
                      ) : (
                        <Pause className="w-3 h-3 mr-1" />
                      )}
                      {selectedGroup.timer.isActive
                        ? "Live Session"
                        : "Offline"}
                    </Badge>
                    {!isAdmin && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleLeaveGroup(selectedGroup.id)}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        Leave Group
                      </Button>
                    )}
                  </div>
                </div>
              </div>

              {/* Group Tabs */}
              <div className="p-6">
                <Tabs
                  value={activeTab}
                  onValueChange={(tab) =>
                    handleSelectGroup(selectedGroup.id, tab)
                  }
                >
                  <TabsList className="grid w-full grid-cols-4">
                    <TabsTrigger value="overview" className="flex items-center">
                      <Clock className="w-4 h-4 mr-2" />
                      Study Room
                    </TabsTrigger>
                    <TabsTrigger value="chat" className="flex items-center">
                      <MessageCircle className="w-4 h-4 mr-2" />
                      Chat
                    </TabsTrigger>
                    <TabsTrigger
                      value="leaderboard"
                      className="flex items-center"
                    >
                      <Trophy className="w-4 h-4 mr-2" />
                      Leaderboard
                    </TabsTrigger>
                    {isAdmin && (
                      <TabsTrigger value="admin" className="flex items-center">
                        <Settings className="w-4 h-4 mr-2" />
                        Admin
                      </TabsTrigger>
                    )}
                  </TabsList>

                  <TabsContent value="overview" className="mt-6">
                    <div className="text-center py-8">
                      <Target className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">
                        Study Room content will be implemented
                      </p>
                      <Button
                        className="mt-4"
                        onClick={() =>
                          navigate(`/study-room/${selectedGroup.id}`)
                        }
                      >
                        Enter Study Room
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="chat" className="mt-6">
                    <div className="text-center py-8">
                      <MessageCircle className="w-12 h-12 text-kiit-500 mx-auto mb-3" />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        Group Chat
                      </h3>
                      <p className="text-gray-500 mb-4">
                        Join the conversation with your study group
                      </p>
                      <Button
                        onClick={() =>
                          navigate(`/group/${selectedGroup.id}/chat`)
                        }
                        className="bg-kiit-gradient text-white"
                      >
                        <MessageCircle className="w-4 h-4 mr-2" />
                        Open Chat
                      </Button>
                    </div>
                  </TabsContent>

                  <TabsContent value="leaderboard" className="mt-6">
                    <div className="text-center py-8">
                      <Trophy className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-gray-500">
                        Leaderboard will be implemented
                      </p>
                    </div>
                  </TabsContent>

                  {isAdmin && (
                    <TabsContent value="admin" className="mt-6">
                      <div className="text-center py-8">
                        <Settings className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">
                          Admin panel will be implemented
                        </p>
                      </div>
                    </TabsContent>
                  )}
                </Tabs>
              </div>
            </div>
          ) : (
            <div className="flex items-center justify-center h-full">
              <div className="text-center">
                <Users className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                  Select a Group
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  Choose a group from the sidebar to view details
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

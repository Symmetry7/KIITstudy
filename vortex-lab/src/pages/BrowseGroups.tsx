import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { StudyGroup, joinGroup } from "@/lib/studyGroups";
import { KIITUser } from "@/lib/auth";
import {
  Search,
  Filter,
  Users,
  Clock,
  BookOpen,
  Target,
  Crown,
  MessageCircle,
  Calendar,
  Star,
  TrendingUp,
} from "lucide-react";

interface BrowseGroupsProps {
  currentUser: KIITUser | null;
}

export default function BrowseGroups({ currentUser }: BrowseGroupsProps) {
  const navigate = useNavigate();
  const [allGroups, setAllGroups] = useState<StudyGroup[]>([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [difficultyFilter, setDifficultyFilter] = useState("all");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Mock data for all available groups
    const mockGroups: StudyGroup[] = [
      {
        id: "browse-1",
        name: "Advanced JavaScript Concepts",
        subject: "Web Development",
        description: "Deep dive into closures, promises, and async programming",
        adminId: "admin-1",
        participants: [
          {
            uid: "user-1",
            name: "Rahul Kumar",
            email: "rahul@kiit.ac.in",
            avatar: "/api/placeholder/40/40",
            course: "B.Tech CSE",
            isStudying: true,
            studyTime: 180,
            joinedAt: new Date(),
            role: "admin",
          },
          {
            uid: "user-2",
            name: "Priya Sharma",
            email: "priya@kiit.ac.in",
            avatar: "/api/placeholder/40/40",
            course: "B.Tech CSE",
            isStudying: false,
            studyTime: 165,
            joinedAt: new Date(),
            role: "member",
          },
        ],
        pendingRequests: [],
        timer: {
          duration: 45,
          startTime: new Date(),
          isActive: true,
          type: "deep-focus",
        },
        settings: {
          isPrivate: false,
          requireApproval: false,
          maxParticipants: 25,
          allowChat: true,
        },
        stats: {
          totalSessions: 22,
          totalHours: 68,
          averageParticipants: 12,
        },
        createdAt: new Date(),
        lastActive: new Date(),
      },
      {
        id: "browse-2",
        name: "Machine Learning Fundamentals",
        subject: "Computer Science",
        description: "Learn the basics of ML algorithms and implementations",
        adminId: "admin-2",
        participants: [
          {
            uid: "user-3",
            name: "Ananya Das",
            email: "ananya@kiit.ac.in",
            avatar: "/api/placeholder/40/40",
            course: "B.Tech CSE",
            isStudying: false,
            studyTime: 220,
            joinedAt: new Date(),
            role: "admin",
          },
        ],
        pendingRequests: [],
        timer: {
          duration: 60,
          startTime: new Date(),
          isActive: false,
          type: "deep-focus",
        },
        settings: {
          isPrivate: false,
          requireApproval: false,
          maxParticipants: 30,
          allowChat: true,
        },
        stats: {
          totalSessions: 18,
          totalHours: 52,
          averageParticipants: 15,
        },
        createdAt: new Date(),
        lastActive: new Date(),
      },
      {
        id: "browse-3",
        name: "Competitive Programming Practice",
        subject: "Problem Solving",
        description: "Daily coding challenges and contest preparation",
        adminId: "admin-3",
        participants: [
          {
            uid: "user-4",
            name: "Vikash Singh",
            email: "vikash@kiit.ac.in",
            avatar: "/api/placeholder/40/40",
            course: "B.Tech CSE",
            isStudying: true,
            studyTime: 320,
            joinedAt: new Date(),
            role: "admin",
          },
          {
            uid: "user-5",
            name: "Siddharth Patel",
            email: "siddharth@kiit.ac.in",
            avatar: "/api/placeholder/40/40",
            course: "B.Tech CSE",
            isStudying: true,
            studyTime: 285,
            joinedAt: new Date(),
            role: "member",
          },
          {
            uid: "user-6",
            name: "Meera Singh",
            email: "meera@kiit.ac.in",
            avatar: "/api/placeholder/40/40",
            course: "B.Tech IT",
            isStudying: false,
            studyTime: 195,
            joinedAt: new Date(),
            role: "member",
          },
        ],
        pendingRequests: [],
        timer: {
          duration: 90,
          startTime: new Date(),
          isActive: true,
          type: "sprint",
        },
        settings: {
          isPrivate: false,
          requireApproval: false,
          maxParticipants: 20,
          allowChat: true,
        },
        stats: {
          totalSessions: 35,
          totalHours: 125,
          averageParticipants: 8,
        },
        createdAt: new Date(),
        lastActive: new Date(),
      },
      {
        id: "browse-4",
        name: "Digital Electronics Study",
        subject: "Electronics",
        description: "Boolean algebra, logic gates, and circuit design",
        adminId: "admin-4",
        participants: [
          {
            uid: "user-7",
            name: "Kavya Jain",
            email: "kavya@kiit.ac.in",
            avatar: "/api/placeholder/40/40",
            course: "B.Tech EE",
            isStudying: false,
            studyTime: 145,
            joinedAt: new Date(),
            role: "admin",
          },
        ],
        pendingRequests: [],
        timer: {
          duration: 30,
          startTime: new Date(),
          isActive: false,
          type: "pomodoro",
        },
        settings: {
          isPrivate: false,
          requireApproval: false,
          maxParticipants: 15,
          allowChat: true,
        },
        stats: {
          totalSessions: 12,
          totalHours: 28,
          averageParticipants: 6,
        },
        createdAt: new Date(),
        lastActive: new Date(),
      },
    ];

    setTimeout(() => {
      setAllGroups(mockGroups);
      setLoading(false);
    }, 500);
  }, []);

  const handleJoinGroup = async (groupId: string, groupName: string) => {
    if (!currentUser) return;

    try {
      await joinGroup(groupId, {
        uid: currentUser.uid,
        name: currentUser.name,
        email: currentUser.email,
        avatar: "/api/placeholder/40/40",
        course: currentUser.course,
      });
      alert(`Successfully joined ${groupName}! 🎉`);
    } catch (error: any) {
      alert(error.message);
    }
  };

  const categories = [
    "all",
    "Computer Science",
    "Mathematics",
    "Physics",
    "Electronics",
    "Web Development",
    "Problem Solving",
  ];
  const difficulties = ["all", "beginner", "intermediate", "advanced"];

  const filteredGroups = allGroups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.description.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCategory =
      categoryFilter === "all" || group.subject === categoryFilter;

    return matchesSearch && matchesCategory;
  });

  const popularGroups = [...filteredGroups].sort(
    (a, b) => b.participants.length - a.participants.length,
  );
  const recentGroups = [...filteredGroups].sort(
    (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
  );

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="w-16 h-16 bg-kiit-gradient rounded-2xl flex items-center justify-center mx-auto mb-4 animate-pulse">
            <BookOpen className="w-8 h-8 text-white" />
          </div>
          <p className="text-lg font-medium">Loading study groups...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Discover Study Groups
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Find the perfect study group to join and learn together
              </p>
            </div>
            <Button
              onClick={() => navigate("/create-group")}
              className="bg-kiit-gradient text-white"
            >
              <Target className="w-4 h-4 mr-2" />
              Create Group
            </Button>
          </div>

          {/* Filters */}
          <div className="flex items-center space-x-4">
            <div className="relative flex-1 max-w-md">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search groups, subjects, topics..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={categoryFilter} onValueChange={setCategoryFilter}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="Category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((category) => (
                  <SelectItem key={category} value={category}>
                    {category === "all" ? "All Categories" : category}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button variant="outline" size="icon">
              <Filter className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6 space-y-8">
        {/* Popular Groups */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <Star className="w-5 h-5 mr-2 text-yellow-500" />
              Popular Groups
            </h2>
            <Badge variant="secondary">{popularGroups.length} groups</Badge>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {popularGroups.slice(0, 6).map((group) => (
              <Card
                key={group.id}
                className="hover:shadow-lg transition-shadow"
              >
                <CardHeader className="pb-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="w-12 h-12 bg-kiit-gradient rounded-xl flex items-center justify-center">
                        <BookOpen className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        <p className="text-sm text-gray-600 dark:text-gray-400">
                          {group.subject}
                        </p>
                      </div>
                    </div>
                    {group.timer.isActive && (
                      <div className="flex items-center space-x-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                        <span className="text-xs text-green-600 font-medium">
                          LIVE
                        </span>
                      </div>
                    )}
                  </div>
                </CardHeader>

                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                    {group.description}
                  </p>

                  {/* Admin Info */}
                  <div className="flex items-center space-x-2">
                    <Crown className="w-4 h-4 text-yellow-500" />
                    <span className="text-sm text-gray-600 dark:text-gray-400">
                      Admin:{" "}
                      {group.participants.find((p) => p.role === "admin")?.name}
                    </span>
                  </div>

                  {/* Stats */}
                  <div className="grid grid-cols-3 gap-4 text-center">
                    <div>
                      <div className="text-lg font-bold text-kiit-600">
                        {group.participants.length}
                      </div>
                      <div className="text-xs text-gray-500">Members</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-green-600">
                        {group.stats.totalHours}
                      </div>
                      <div className="text-xs text-gray-500">Hours</div>
                    </div>
                    <div>
                      <div className="text-lg font-bold text-purple-600">
                        {group.stats.totalSessions}
                      </div>
                      <div className="text-xs text-gray-500">Sessions</div>
                    </div>
                  </div>

                  {/* Members Preview */}
                  <div className="flex items-center justify-between">
                    <div className="flex -space-x-2">
                      {group.participants.slice(0, 4).map((participant) => (
                        <Avatar
                          key={participant.uid}
                          className="w-6 h-6 border-2 border-white"
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
                      {group.participants.length > 4 && (
                        <div className="w-6 h-6 rounded-full bg-gray-100 dark:bg-gray-700 border-2 border-white flex items-center justify-center">
                          <span className="text-xs font-medium">
                            +{group.participants.length - 4}
                          </span>
                        </div>
                      )}
                    </div>
                    <span className="text-xs text-gray-500">
                      {group.settings.maxParticipants -
                        group.participants.length}{" "}
                      spots left
                    </span>
                  </div>

                  {/* Join Button */}
                  <Button
                    onClick={() => handleJoinGroup(group.id, group.name)}
                    className="w-full"
                    variant={group.timer.isActive ? "default" : "outline"}
                  >
                    {group.timer.isActive ? (
                      <>
                        <Target className="w-4 h-4 mr-2" />
                        Join Live Session
                      </>
                    ) : (
                      <>
                        <Users className="w-4 h-4 mr-2" />
                        Join Group
                      </>
                    )}
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* All Groups */}
        <section>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
              <TrendingUp className="w-5 h-5 mr-2 text-blue-500" />
              All Groups
            </h2>
            <Badge variant="secondary">{filteredGroups.length} groups</Badge>
          </div>

          {filteredGroups.length === 0 ? (
            <div className="text-center py-12">
              <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
                No groups found
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                Try adjusting your search or create a new group
              </p>
              <Button
                onClick={() => navigate("/create-group")}
                className="bg-kiit-gradient text-white"
              >
                <Target className="w-4 h-4 mr-2" />
                Create New Group
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredGroups.map((group) => (
                <Card
                  key={group.id}
                  className="hover:shadow-lg transition-shadow"
                >
                  <CardHeader className="pb-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="w-12 h-12 bg-gray-200 dark:bg-gray-700 rounded-xl flex items-center justify-center">
                          <BookOpen className="w-6 h-6 text-gray-600 dark:text-gray-400" />
                        </div>
                        <div>
                          <CardTitle className="text-lg">
                            {group.name}
                          </CardTitle>
                          <p className="text-sm text-gray-600 dark:text-gray-400">
                            {group.subject}
                          </p>
                        </div>
                      </div>
                      {group.timer.isActive && (
                        <Badge className="bg-green-500">Live</Badge>
                      )}
                    </div>
                  </CardHeader>

                  <CardContent className="space-y-4">
                    <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
                      {group.description}
                    </p>

                    <div className="flex items-center justify-between text-sm">
                      <span className="flex items-center text-gray-500">
                        <Users className="w-4 h-4 mr-1" />
                        {group.participants.length} members
                      </span>
                      <span className="flex items-center text-gray-500">
                        <Clock className="w-4 h-4 mr-1" />
                        {group.stats.totalHours}h total
                      </span>
                    </div>

                    <Button
                      onClick={() => handleJoinGroup(group.id, group.name)}
                      className="w-full"
                      variant="outline"
                    >
                      <Users className="w-4 h-4 mr-2" />
                      Join Group
                    </Button>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
}

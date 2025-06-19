import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Progress } from "@/components/ui/progress";
import {
  Search,
  Filter,
  Plus,
  Users,
  Calendar,
  BookOpen,
  Trophy,
  Clock,
  Crown,
  Target,
  MessageCircle,
  Timer,
  Heart,
  ArrowLeft,
  Zap,
  UserPlus,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Community = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState("");
  const [filterCategory, setFilterCategory] = useState("all");

  // All study groups from different admins
  const allStudyGroups = [
    {
      id: "group-1",
      name: "DSA Marathon",
      subject: "Data Structures & Algorithms",
      description: "Master DSA through intensive problem-solving sessions",
      admin: {
        name: "Rahul Kumar",
        avatar: "/api/placeholder/40/40",
        course: "B.Tech CSE",
      },
      participants: [
        { name: "Priya Sharma", studyTime: 145, rank: 1, isActive: true },
        { name: "Arjun Patel", studyTime: 132, rank: 2, isActive: true },
        { name: "Sneha Roy", studyTime: 98, rank: 3, isActive: false },
        { name: "Vikash Singh", studyTime: 87, rank: 4, isActive: true },
      ],
      totalHours: 47,
      isActive: true,
      requiresApproval: false,
      category: "Computer Science",
      difficulty: "Intermediate",
      schedule: "Daily 6-8 PM",
    },
    {
      id: "group-2",
      name: "Calculus Problem Solving",
      subject: "Mathematics",
      description: "Advanced calculus concepts and problem solving",
      admin: {
        name: "Ananya Das",
        avatar: "/api/placeholder/40/40",
        course: "B.Tech CSE",
      },
      participants: [
        { name: "Rohit Mehta", studyTime: 167, rank: 1, isActive: true },
        { name: "Kavya Jain", studyTime: 134, rank: 2, isActive: true },
        { name: "Aditya Kumar", studyTime: 121, rank: 3, isActive: false },
      ],
      totalHours: 35,
      isActive: true,
      requiresApproval: false,
      category: "Mathematics",
      difficulty: "Advanced",
      schedule: "Mon, Wed, Fri 7-9 PM",
    },
    {
      id: "group-3",
      name: "Physics Lab Discussion",
      subject: "Physics",
      description: "Discuss lab experiments and theoretical concepts",
      admin: {
        name: "Siddharth Patel",
        avatar: "/api/placeholder/40/40",
        course: "B.Tech EE",
      },
      participants: [
        { name: "Meera Singh", studyTime: 89, rank: 1, isActive: true },
        { name: "Akash Yadav", studyTime: 76, rank: 2, isActive: false },
        { name: "Divya Sharma", studyTime: 65, rank: 3, isActive: true },
      ],
      totalHours: 23,
      isActive: false,
      requiresApproval: false,
      category: "Physics",
      difficulty: "Beginner",
      schedule: "Weekends 3-5 PM",
    },
    {
      id: "group-4",
      name: "Web Development Bootcamp",
      subject: "Web Development",
      description: "Learn modern web technologies and build projects",
      admin: {
        name: "Nisha Gupta",
        avatar: "/api/placeholder/40/40",
        course: "B.Tech IT",
      },
      participants: [
        { name: "Harsh Agarwal", studyTime: 203, rank: 1, isActive: true },
        { name: "Pooja Singh", studyTime: 189, rank: 2, isActive: true },
        { name: "Amit Shah", studyTime: 156, rank: 3, isActive: true },
        { name: "Ritika Jain", studyTime: 143, rank: 4, isActive: false },
        { name: "Kartik Mehta", studyTime: 134, rank: 5, isActive: true },
      ],
      totalHours: 82,
      isActive: true,
      requiresApproval: true,
      category: "Computer Science",
      difficulty: "Intermediate",
      schedule: "Daily 8-10 PM",
    },
  ];

  const categories = [
    { id: "all", name: "All Groups", count: allStudyGroups.length },
    {
      id: "active",
      name: "Active Now",
      count: allStudyGroups.filter((g) => g.isActive).length,
    },
    { id: "Computer Science", name: "Computer Science", count: 2 },
    { id: "Mathematics", name: "Mathematics", count: 1 },
    { id: "Physics", name: "Physics", count: 1 },
  ];

  const filteredGroups = allStudyGroups.filter((group) => {
    const matchesSearch =
      group.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      group.subject.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory =
      filterCategory === "all" || filterCategory === "active"
        ? group.isActive
        : group.category === filterCategory;
    return matchesSearch && matchesCategory;
  });

  const handleJoinGroup = async (groupId: string, groupName: string) => {
    // In a real app, this would call the joinGroup API
    alert(`Successfully joined ${groupName}! 🎉`);
    // Simulate successful join and navigate to study room
    setTimeout(() => {
      navigate(`/study-room/${groupId}`);
    }, 1000);
  };

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
                onClick={() => navigate("/dashboard")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-8 h-8 bg-kiit-gradient rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">
                Study Communities
              </span>
            </div>

            <div className="flex items-center space-x-4">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search study groups..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10 w-80"
                />
              </div>
              <Button
                onClick={() => navigate("/create-group")}
                className="bg-kiit-gradient hover:shadow-kiit"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Group
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Overview */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-kiit-600 mb-1">
                {allStudyGroups.length}
              </div>
              <p className="text-sm text-gray-600">Total Groups</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-green-600 mb-1">
                {allStudyGroups.filter((g) => g.isActive).length}
              </div>
              <p className="text-sm text-gray-600">Active Now</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-blue-600 mb-1">
                {allStudyGroups.reduce(
                  (acc, g) => acc + g.participants.length,
                  0,
                )}
              </div>
              <p className="text-sm text-gray-600">Total Members</p>
            </CardContent>
          </Card>
          <Card>
            <CardContent className="p-4 text-center">
              <div className="text-2xl font-bold text-purple-600 mb-1">
                {allStudyGroups.reduce((acc, g) => acc + g.totalHours, 0)}h
              </div>
              <p className="text-sm text-gray-600">Study Hours</p>
            </CardContent>
          </Card>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map((category) => (
            <Button
              key={category.id}
              variant={filterCategory === category.id ? "default" : "outline"}
              onClick={() => setFilterCategory(category.id)}
              className="text-sm"
            >
              {category.name} ({category.count})
            </Button>
          ))}
        </div>

        {/* Study Groups Grid */}
        <div className="grid lg:grid-cols-2 gap-6">
          {filteredGroups.map((group) => {
            const activeParticipants = group.participants.filter(
              (p) => p.isActive,
            );
            const topParticipants = group.participants.slice(0, 3);

            return (
              <Card
                key={group.id}
                className={`hover:shadow-lg transition-all duration-300 ${group.isActive ? "border-l-4 border-l-green-500" : ""}`}
              >
                <CardHeader>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-2">
                        <CardTitle className="text-lg">{group.name}</CardTitle>
                        {group.isActive && (
                          <Badge className="bg-green-500 text-white text-xs">
                            <Zap className="w-3 h-3 mr-1" />
                            Live
                          </Badge>
                        )}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-2">
                        {group.description}
                      </p>
                      <div className="flex items-center space-x-4 text-sm text-gray-500">
                        <span className="flex items-center">
                          <BookOpen className="w-4 h-4 mr-1" />
                          {group.subject}
                        </span>
                        <span className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {group.totalHours}h studied
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleJoinGroup(group.id, group.name)}
                      className={
                        group.isActive ? "bg-green-500 hover:bg-green-600" : ""
                      }
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Join
                    </Button>
                  </div>
                </CardHeader>

                <CardContent>
                  {/* Admin Info */}
                  <div className="flex items-center space-x-2 mb-4 p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded-lg">
                    <Crown className="w-4 h-4 text-yellow-600" />
                    <Avatar className="w-6 h-6">
                      <AvatarImage src={group.admin.avatar} />
                      <AvatarFallback className="text-xs">
                        {group.admin.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="text-sm font-medium">
                        Admin: {group.admin.name}
                      </p>
                      <p className="text-xs text-gray-500">
                        {group.admin.course}
                      </p>
                    </div>
                  </div>

                  {/* Active Participants Ranking */}
                  <div className="mb-4">
                    <h4 className="font-medium mb-2 flex items-center text-sm">
                      <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
                      Top Performers ({activeParticipants.length} active)
                    </h4>
                    <div className="space-y-2">
                      {topParticipants.map((participant, index) => (
                        <div
                          key={index}
                          className={`flex items-center justify-between p-2 rounded-lg ${
                            participant.isActive
                              ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                              : "bg-gray-50 dark:bg-gray-800 opacity-60"
                          }`}
                        >
                          <div className="flex items-center space-x-2">
                            <Badge
                              variant="secondary"
                              className={`w-6 h-6 p-0 text-xs ${
                                index === 0
                                  ? "bg-yellow-500 text-white"
                                  : index === 1
                                    ? "bg-gray-400 text-white"
                                    : index === 2
                                      ? "bg-orange-500 text-white"
                                      : "bg-gray-200"
                              }`}
                            >
                              #{participant.rank}
                            </Badge>
                            <span className="text-sm font-medium">
                              {participant.name}
                            </span>
                            {participant.isActive && (
                              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                            )}
                          </div>
                          <div className="flex items-center space-x-2">
                            <span className="text-sm text-gray-600">
                              {participant.studyTime}h
                            </span>
                            <Button
                              size="sm"
                              variant="ghost"
                              className="h-6 w-6 p-0"
                            >
                              <UserPlus className="w-3 h-3" />
                            </Button>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Group Details */}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-600">Schedule:</span>
                      <span className="font-medium">{group.schedule}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Difficulty:</span>
                      <Badge variant="outline" className="text-xs">
                        {group.difficulty}
                      </Badge>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-600">Approval:</span>
                      <span
                        className={
                          group.requiresApproval
                            ? "text-yellow-600"
                            : "text-green-600"
                        }
                      >
                        {group.requiresApproval ? "Required" : "Instant"}
                      </span>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex space-x-2 mt-4 pt-4 border-t">
                    <Button
                      variant="outline"
                      className="flex-1 text-sm"
                      onClick={() => navigate(`/study-room/${group.id}`)}
                    >
                      <MessageCircle className="w-4 h-4 mr-2" />
                      View Details
                    </Button>
                    <Button
                      className="flex-1 text-sm"
                      onClick={() => handleJoinGroup(group.id, group.name)}
                    >
                      <Target className="w-4 h-4 mr-2" />
                      Join Now
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {filteredGroups.length === 0 && (
          <div className="text-center py-12">
            <BookOpen className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium mb-2">No study groups found</h3>
            <p className="text-gray-600 mb-4">
              Try adjusting your search or create a new study group.
            </p>
            <Button onClick={() => navigate("/create-group")}>
              <Plus className="w-4 h-4 mr-2" />
              Create New Group
            </Button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Community;

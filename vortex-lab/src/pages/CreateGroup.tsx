import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { getCurrentUserData } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Alert, AlertDescription } from "@/components/ui/alert";
import {
  ArrowLeft,
  Heart,
  Plus,
  BookOpen,
  Users,
  Clock,
  Settings,
  CheckCircle,
  Info,
} from "lucide-react";

const CreateGroup = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const [formData, setFormData] = useState({
    name: "",
    subject: "",
    description: "",
    category: "",
    difficulty: "",
    schedule: "",
    maxParticipants: "20",
    requireApproval: true,
    allowChat: true,
    isPrivate: false,
  });

  const subjects = [
    "Data Structures & Algorithms",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Web Development",
    "Machine Learning",
    "Database Systems",
    "Computer Networks",
    "Operating Systems",
    "Software Engineering",
  ];

  const categories = [
    "Computer Science",
    "Mathematics",
    "Physics",
    "Chemistry",
    "Electronics",
    "Mechanical",
    "Civil",
    "Other",
  ];

  const difficulties = ["Beginner", "Intermediate", "Advanced"];

  const schedules = [
    "Daily 6-8 PM",
    "Daily 8-10 PM",
    "Mon, Wed, Fri 7-9 PM",
    "Tue, Thu, Sat 6-8 PM",
    "Weekends 3-5 PM",
    "Flexible timing",
    "Custom schedule",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Validate required fields
    if (
      !formData.name ||
      !formData.subject ||
      !formData.description ||
      !formData.category
    ) {
      alert("Please fill in all required fields");
      setIsLoading(false);
      return;
    }

    try {
      // Get current user info
      const currentUser = localStorage.getItem("kiit_user");
      if (!currentUser) {
        alert("Please log in to create a group");
        setIsLoading(false);
        return;
      }

      const userData = JSON.parse(currentUser);

      // Create the new group with user as admin
      const newGroup = {
        id: `user-group-${Date.now()}`,
        name: formData.name,
        subject: formData.subject,
        description: formData.description,
        adminId: userData.uid,
        participants: [
          {
            uid: userData.uid,
            name: userData.name,
            email: userData.email,
            avatar: "/api/placeholder/40/40",
            course: userData.course || "B.Tech CSE",
            isStudying: false,
            studyTime: 0,
            joinedAt: new Date(),
            role: "admin",
          },
        ],
        pendingRequests: [],
        timer: {
          duration: 25,
          startTime: new Date(),
          isActive: false,
          type: "pomodoro",
        },
        settings: {
          isPrivate: formData.isPrivate,
          requireApproval: formData.requireApproval,
          maxParticipants: parseInt(formData.maxParticipants),
          allowChat: formData.allowChat,
        },
        stats: {
          totalSessions: 0,
          totalHours: 0,
          averageParticipants: 1,
        },
        createdAt: new Date(),
        lastActive: new Date(),
      };

      // Store in localStorage for demo mode
      const joinedGroupsKey = `joinedGroups_${userData.uid}`;
      const joinedGroups = JSON.parse(
        localStorage.getItem(joinedGroupsKey) || "[]",
      );
      joinedGroups.push(newGroup.id);
      localStorage.setItem(joinedGroupsKey, JSON.stringify(joinedGroups));

      // Store the group data
      const groupsKey = `createdGroups_${userData.uid}`;
      const createdGroups = JSON.parse(localStorage.getItem(groupsKey) || "[]");
      createdGroups.push(newGroup);
      localStorage.setItem(groupsKey, JSON.stringify(createdGroups));

      // Simulate API delay
      await new Promise((resolve) => setTimeout(resolve, 1500));

      console.log("Creating study group:", newGroup);
      setSuccess(true);

      setTimeout(() => {
        navigate("/my-groups");
      }, 2000);
    } catch (error) {
      console.error("Error creating group:", error);
      alert("Failed to create group. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: string, value: string | boolean) => {
    setFormData((prev) => ({
      ...prev,
      [field]: value,
    }));
  };

  if (success) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-8 text-center">
            <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center mx-auto mb-4">
              <CheckCircle className="w-8 h-8 text-white" />
            </div>
            <h2 className="text-2xl font-bold mb-2">Group Created!</h2>
            <p className="text-gray-600 mb-4">
              Your study group "{formData.name}" has been created successfully.
            </p>
            <Button onClick={() => navigate("/my-groups")}>
              View My Groups
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <header className="bg-white dark:bg-gray-900 shadow-sm border-b dark:border-gray-800">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <Button
                variant="ghost"
                size="icon"
                onClick={() => navigate("/browse-groups")}
              >
                <ArrowLeft className="w-5 h-5" />
              </Button>
              <div className="w-8 h-8 bg-kiit-gradient rounded-lg flex items-center justify-center">
                <Heart className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold gradient-text">
                Create Study Group
              </span>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="grid lg:grid-cols-3 gap-8">
            {/* Main Form */}
            <div className="lg:col-span-2 space-y-6">
              {/* Basic Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <BookOpen className="w-5 h-5" />
                    <span>Basic Information</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="name">Group Name *</Label>
                    <Input
                      id="name"
                      placeholder="e.g., DSA Marathon, Calculus Study Circle"
                      value={formData.name}
                      onChange={(e) =>
                        handleInputChange("name", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div>
                    <Label htmlFor="subject">Subject *</Label>
                    <Select
                      value={formData.subject}
                      onValueChange={(value) =>
                        handleInputChange("subject", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select a subject" />
                      </SelectTrigger>
                      <SelectContent>
                        {subjects.map((subject) => (
                          <SelectItem key={subject} value={subject}>
                            {subject}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="description">Description *</Label>
                    <Textarea
                      id="description"
                      placeholder="Describe what your study group is about, goals, and expectations..."
                      rows={4}
                      value={formData.description}
                      onChange={(e) =>
                        handleInputChange("description", e.target.value)
                      }
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="category">Category *</Label>
                      <Select
                        value={formData.category}
                        onValueChange={(value) =>
                          handleInputChange("category", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select category" />
                        </SelectTrigger>
                        <SelectContent>
                          {categories.map((category) => (
                            <SelectItem key={category} value={category}>
                              {category}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>

                    <div>
                      <Label htmlFor="difficulty">Difficulty Level</Label>
                      <Select
                        value={formData.difficulty}
                        onValueChange={(value) =>
                          handleInputChange("difficulty", value)
                        }
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select difficulty" />
                        </SelectTrigger>
                        <SelectContent>
                          {difficulties.map((difficulty) => (
                            <SelectItem key={difficulty} value={difficulty}>
                              {difficulty}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Schedule & Settings */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Settings className="w-5 h-5" />
                    <span>Schedule & Settings</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label htmlFor="schedule">Study Schedule</Label>
                    <Select
                      value={formData.schedule}
                      onValueChange={(value) =>
                        handleInputChange("schedule", value)
                      }
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Select schedule" />
                      </SelectTrigger>
                      <SelectContent>
                        {schedules.map((schedule) => (
                          <SelectItem key={schedule} value={schedule}>
                            {schedule}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="maxParticipants">
                      Maximum Participants
                    </Label>
                    <Input
                      id="maxParticipants"
                      type="number"
                      min="5"
                      max="100"
                      value={formData.maxParticipants}
                      onChange={(e) =>
                        handleInputChange("maxParticipants", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-3">
                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="requireApproval"
                        checked={formData.requireApproval}
                        onCheckedChange={(checked) =>
                          handleInputChange("requireApproval", checked)
                        }
                      />
                      <Label htmlFor="requireApproval">
                        Require admin approval to join
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="allowChat"
                        checked={formData.allowChat}
                        onCheckedChange={(checked) =>
                          handleInputChange("allowChat", checked)
                        }
                      />
                      <Label htmlFor="allowChat">Enable group chat</Label>
                    </div>

                    <div className="flex items-center space-x-2">
                      <Checkbox
                        id="isPrivate"
                        checked={formData.isPrivate}
                        onCheckedChange={(checked) =>
                          handleInputChange("isPrivate", checked)
                        }
                      />
                      <Label htmlFor="isPrivate">
                        Make group private (invite-only)
                      </Label>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              {/* Preview */}
              <Card>
                <CardHeader>
                  <CardTitle>Preview</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div>
                      <h3 className="font-semibold text-lg">
                        {formData.name || "Group Name"}
                      </h3>
                      <p className="text-sm text-gray-600">
                        {formData.subject || "Subject"}
                      </p>
                    </div>

                    <div className="flex flex-wrap gap-1">
                      {formData.category && (
                        <Badge variant="secondary">{formData.category}</Badge>
                      )}
                      {formData.difficulty && (
                        <Badge variant="outline">{formData.difficulty}</Badge>
                      )}
                    </div>

                    <p className="text-sm text-gray-700">
                      {formData.description ||
                        "Description will appear here..."}
                    </p>

                    <div className="text-xs text-gray-500 space-y-1">
                      {formData.schedule && <div>📅 {formData.schedule}</div>}
                      <div>👥 Max {formData.maxParticipants} participants</div>
                      <div>
                        {formData.requireApproval
                          ? "🔒 Approval required"
                          : "🔓 Open to join"}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              {/* Tips */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Info className="w-5 h-5 text-blue-500" />
                    <span>Tips</span>
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-3 text-sm">
                  <div>
                    <strong>Choose a clear name:</strong> Make it easy for
                    students to understand what your group is about.
                  </div>
                  <div>
                    <strong>Set expectations:</strong> Describe the study goals,
                    commitment level, and group rules.
                  </div>
                  <div>
                    <strong>Admin approval:</strong> Enable this to maintain
                    group quality and prevent spam.
                  </div>
                </CardContent>
              </Card>

              {/* Admin Responsibilities */}
              <Alert>
                <Users className="h-4 w-4" />
                <AlertDescription>
                  As a group admin, you'll be responsible for managing members,
                  moderating discussions, and maintaining the study schedule.
                </AlertDescription>
              </Alert>
            </div>
          </div>

          {/* Submit Button */}
          <div className="flex justify-end space-x-4">
            <Button
              type="button"
              variant="outline"
              onClick={() => navigate("/browse-groups")}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isLoading}
              className="bg-kiit-gradient hover:shadow-kiit"
            >
              {isLoading ? "Creating..." : "Create Study Group"}
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateGroup;

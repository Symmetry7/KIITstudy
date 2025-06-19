import { useState, useEffect } from "react";
import { KIITUser } from "@/lib/auth";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Target,
  Plus,
  Trophy,
  Calendar,
  Clock,
  CheckCircle,
  Circle,
  Trash2,
  TrendingUp,
  Star,
  Flame,
  BookOpen,
  Brain,
  Zap,
  Award,
  PlayCircle,
  PauseCircle,
  Edit3,
  BarChart3,
  Bell,
} from "lucide-react";

interface GoalsProps {
  currentUser: KIITUser | null;
}

interface Goal {
  id: string;
  title: string;
  description: string;
  category: "study" | "exam" | "skill" | "project";
  targetValue: number;
  currentValue: number;
  unit: string;
  deadline: string;
  priority: "low" | "medium" | "high";
  status: "active" | "completed" | "paused";
  createdAt: string;
  completedAt?: string;
  tags: string[];
  streak: number;
  lastUpdated: string;
  schedule?: {
    type: "daily" | "weekly" | "custom";
    timeSlots: string[];
    duration: string;
    reminders: boolean;
  };
}

interface Milestone {
  id: string;
  goalId: string;
  title: string;
  targetValue: number;
  isCompleted: boolean;
  completedAt?: string;
  reward: string;
}

export default function Goals({ currentUser }: GoalsProps) {
  const [goals, setGoals] = useState<Goal[]>([
    {
      id: "1",
      title: "Complete 100 DSA Problems",
      description:
        "Practice data structures and algorithms problems daily to prepare for interviews",
      category: "study",
      targetValue: 100,
      currentValue: 67,
      unit: "problems",
      deadline: "2024-02-15",
      priority: "high",
      status: "active",
      createdAt: "2024-01-01",
      tags: ["dsa", "interview-prep", "leetcode"],
      streak: 7,
      lastUpdated: "2024-01-12",
      schedule: {
        type: "daily",
        timeSlots: ["09:00", "14:00"],
        duration: "2 hours",
        reminders: true,
      },
    },
    {
      id: "2",
      title: "Study 50 Hours This Month",
      description:
        "Focused study sessions across all subjects to improve academic performance",
      category: "study",
      targetValue: 50,
      currentValue: 32,
      unit: "hours",
      deadline: "2024-01-31",
      priority: "medium",
      status: "active",
      createdAt: "2024-01-01",
      tags: ["study-time", "academics"],
      streak: 12,
      lastUpdated: "2024-01-12",
      schedule: {
        type: "weekly",
        timeSlots: ["19:00"],
        duration: "3 hours",
        reminders: true,
      },
    },
    {
      id: "3",
      title: "Master React Development",
      description: "Build 3 complete React projects with modern features",
      category: "skill",
      targetValue: 3,
      currentValue: 3,
      unit: "projects",
      deadline: "2024-01-20",
      priority: "high",
      status: "completed",
      createdAt: "2023-12-01",
      completedAt: "2024-01-18",
      tags: ["react", "web-development", "portfolio"],
      streak: 15,
      lastUpdated: "2024-01-18",
      schedule: {
        type: "custom",
        timeSlots: ["20:00"],
        duration: "4 hours",
        reminders: false,
      },
    },
  ]);

  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: "m1",
      goalId: "1",
      title: "Complete First 25 Problems",
      targetValue: 25,
      isCompleted: true,
      completedAt: "2024-01-05",
      reward: "🎯 Problem Solver Badge",
    },
    {
      id: "m2",
      goalId: "1",
      title: "Reach 50 Problems",
      targetValue: 50,
      isCompleted: true,
      completedAt: "2024-01-08",
      reward: "🔥 Consistency Champion",
    },
    {
      id: "m3",
      goalId: "1",
      title: "Complete 75 Problems",
      targetValue: 75,
      isCompleted: false,
      reward: "⚡ Algorithm Master",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState<Partial<Goal>>({
    category: "study",
    status: "active",
    priority: "medium",
    tags: [],
    schedule: {
      type: "daily",
      timeSlots: [],
      duration: "1 hour",
      reminders: true,
    },
  });

  const [studyStats, setStudyStats] = useState({
    totalStudyTime: 156,
    weeklyProgress: [12, 15, 18, 22, 19, 25, 20],
    streakDays: 12,
    completedGoals: 3,
    averageCompletion: 85,
  });

  // Load goals from localStorage
  useEffect(() => {
    const savedGoals = localStorage.getItem(`goals_${currentUser?.uid}`);
    const savedMilestones = localStorage.getItem(
      `milestones_${currentUser?.uid}`,
    );

    if (savedGoals) {
      setGoals(JSON.parse(savedGoals));
    }
    if (savedMilestones) {
      setMilestones(JSON.parse(savedMilestones));
    }
  }, [currentUser]);

  // Save goals to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(`goals_${currentUser.uid}`, JSON.stringify(goals));
    }
  }, [goals, currentUser]);

  // Save milestones to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        `milestones_${currentUser.uid}`,
        JSON.stringify(milestones),
      );
    }
  }, [milestones, currentUser]);

  const handleAddGoal = () => {
    if (
      newGoal.title &&
      newGoal.targetValue &&
      newGoal.unit &&
      newGoal.deadline
    ) {
      const goal: Goal = {
        id: Date.now().toString(),
        title: newGoal.title,
        description: newGoal.description || "",
        category: newGoal.category as "study" | "exam" | "skill" | "project",
        targetValue: newGoal.targetValue,
        currentValue: 0,
        unit: newGoal.unit,
        deadline: newGoal.deadline,
        priority: newGoal.priority as "low" | "medium" | "high",
        status: "active",
        createdAt: new Date().toISOString().split("T")[0],
        tags: newGoal.tags || [],
        streak: 0,
        lastUpdated: new Date().toISOString().split("T")[0],
        schedule: newGoal.schedule,
      };

      setGoals([...goals, goal]);
      setNewGoal({
        category: "study",
        status: "active",
        priority: "medium",
        tags: [],
        schedule: {
          type: "daily",
          timeSlots: [],
          duration: "1 hour",
          reminders: true,
        },
      });
      setShowAddForm(false);

      // Create default milestones
      const defaultMilestones = [
        {
          id: `m_${goal.id}_25`,
          goalId: goal.id,
          title: `Complete 25% (${Math.round(goal.targetValue * 0.25)} ${goal.unit})`,
          targetValue: Math.round(goal.targetValue * 0.25),
          isCompleted: false,
          reward: "🎯 Getting Started Badge",
        },
        {
          id: `m_${goal.id}_50`,
          goalId: goal.id,
          title: `Reach 50% (${Math.round(goal.targetValue * 0.5)} ${goal.unit})`,
          targetValue: Math.round(goal.targetValue * 0.5),
          isCompleted: false,
          reward: "🔥 Halfway Hero",
        },
        {
          id: `m_${goal.id}_75`,
          goalId: goal.id,
          title: `Almost There! (${Math.round(goal.targetValue * 0.75)} ${goal.unit})`,
          targetValue: Math.round(goal.targetValue * 0.75),
          isCompleted: false,
          reward: "⚡ Champion Status",
        },
      ];

      setMilestones([...milestones, ...defaultMilestones]);
      alert("Goal created successfully! 🎯");
    } else {
      alert("Please fill in all required fields");
    }
  };

  const handleUpdateProgress = (goalId: string, newValue: number) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === goalId) {
          const updatedGoal = {
            ...goal,
            currentValue: newValue,
            lastUpdated: new Date().toISOString().split("T")[0],
          };

          if (newValue >= goal.targetValue && goal.status !== "completed") {
            updatedGoal.status = "completed";
            updatedGoal.completedAt = new Date().toISOString().split("T")[0];
          }

          // Check and update milestones
          setMilestones(
            milestones.map((milestone) => {
              if (
                milestone.goalId === goalId &&
                !milestone.isCompleted &&
                newValue >= milestone.targetValue
              ) {
                return {
                  ...milestone,
                  isCompleted: true,
                  completedAt: new Date().toISOString().split("T")[0],
                };
              }
              return milestone;
            }),
          );

          return updatedGoal;
        }
        return goal;
      }),
    );
  };

  const handleDeleteGoal = (id: string) => {
    if (
      confirm(
        "Are you sure you want to delete this goal? This action cannot be undone.",
      )
    ) {
      setGoals(goals.filter((g) => g.id !== id));
      setMilestones(milestones.filter((m) => m.goalId !== id));
      alert("Goal removed");
    }
  };

  const handleToggleGoalStatus = (id: string) => {
    setGoals(
      goals.map((goal) => {
        if (goal.id === id) {
          const newStatus = goal.status === "active" ? "paused" : "active";
          return { ...goal, status: newStatus };
        }
        return goal;
      }),
    );
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "study":
        return "bg-blue-500";
      case "exam":
        return "bg-red-500";
      case "skill":
        return "bg-green-500";
      case "project":
        return "bg-purple-500";
      default:
        return "bg-gray-500";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-300 bg-red-50 dark:bg-red-900/20";
      case "medium":
        return "border-yellow-300 bg-yellow-50 dark:bg-yellow-900/20";
      case "low":
        return "border-green-300 bg-green-50 dark:bg-green-900/20";
      default:
        return "border-gray-300";
    }
  };

  const activeGoals = goals.filter((g) => g.status === "active");
  const completedGoals = goals.filter((g) => g.status === "completed");
  const pausedGoals = goals.filter((g) => g.status === "paused");

  const overallProgress =
    goals.length > 0
      ? Math.round(
          goals.reduce(
            (acc, goal) => acc + (goal.currentValue / goal.targetValue) * 100,
            0,
          ) / goals.length,
        )
      : 0;

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <Target className="w-8 h-8 mr-3 text-kiit-600" />
                Study Goals
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Set targets, track progress, and achieve academic excellence
              </p>
            </div>
            <Button
              onClick={() => setShowAddForm(true)}
              className="bg-kiit-gradient text-white px-6 py-3"
              size="lg"
            >
              <Plus className="w-5 h-5 mr-2" />
              New Goal
            </Button>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        <Tabs defaultValue="overview" className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="active">Active Goals</TabsTrigger>
            <TabsTrigger value="progress">Progress</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Stats Overview */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
                <CardContent className="text-center p-6">
                  <Target className="w-8 h-8 mx-auto mb-2 opacity-80" />
                  <div className="text-3xl font-bold">{activeGoals.length}</div>
                  <p className="text-sm opacity-80">Active Goals</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
                <CardContent className="text-center p-6">
                  <Trophy className="w-8 h-8 mx-auto mb-2 opacity-80" />
                  <div className="text-3xl font-bold">
                    {completedGoals.length}
                  </div>
                  <p className="text-sm opacity-80">Completed</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-purple-500 to-purple-600 text-white">
                <CardContent className="text-center p-6">
                  <Flame className="w-8 h-8 mx-auto mb-2 opacity-80" />
                  <div className="text-3xl font-bold">
                    {studyStats.streakDays}
                  </div>
                  <p className="text-sm opacity-80">Day Streak</p>
                </CardContent>
              </Card>
              <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
                <CardContent className="text-center p-6">
                  <TrendingUp className="w-8 h-8 mx-auto mb-2 opacity-80" />
                  <div className="text-3xl font-bold">{overallProgress}%</div>
                  <p className="text-sm opacity-80">Overall Progress</p>
                </CardContent>
              </Card>
            </div>

            {/* Weekly Progress Chart */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="w-5 h-5 mr-2 text-kiit-600" />
                  Weekly Study Progress
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"].map(
                    (day, index) => (
                      <div key={day} className="flex items-center space-x-3">
                        <div className="w-12 text-sm font-medium">{day}</div>
                        <div className="flex-1">
                          <Progress
                            value={
                              (studyStats.weeklyProgress[index] / 30) * 100
                            }
                            className="h-3"
                          />
                        </div>
                        <div className="w-16 text-sm text-gray-600">
                          {studyStats.weeklyProgress[index]}h
                        </div>
                      </div>
                    ),
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Recent Goals */}
            <Card>
              <CardHeader>
                <CardTitle>Recent Active Goals</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {activeGoals.slice(0, 3).map((goal) => {
                    const progress =
                      (goal.currentValue / goal.targetValue) * 100;
                    return (
                      <div
                        key={goal.id}
                        className="flex items-center space-x-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                      >
                        <div className="flex-1">
                          <h4 className="font-medium">{goal.title}</h4>
                          <div className="flex items-center space-x-2 mt-1">
                            <Progress value={progress} className="flex-1 h-2" />
                            <span className="text-sm text-gray-600">
                              {Math.round(progress)}%
                            </span>
                          </div>
                        </div>
                        <Badge
                          className={`${getCategoryColor(goal.category)} text-white capitalize`}
                        >
                          {goal.category}
                        </Badge>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Active Goals Tab */}
          <TabsContent value="active" className="space-y-6">
            {/* Add Goal Form */}
            {showAddForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Create New Goal
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="md:col-span-2">
                      <label className="text-sm font-medium mb-2 block">
                        Goal Title *
                      </label>
                      <Input
                        placeholder="e.g., Complete 50 Math Problems"
                        value={newGoal.title || ""}
                        onChange={(e) =>
                          setNewGoal({ ...newGoal, title: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Category
                      </label>
                      <Select
                        value={newGoal.category || "study"}
                        onValueChange={(value) =>
                          setNewGoal({ ...newGoal, category: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="study">Study</SelectItem>
                          <SelectItem value="exam">Exam Prep</SelectItem>
                          <SelectItem value="skill">Skill Building</SelectItem>
                          <SelectItem value="project">Project</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Priority
                      </label>
                      <Select
                        value={newGoal.priority || "medium"}
                        onValueChange={(value) =>
                          setNewGoal({ ...newGoal, priority: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="low">Low</SelectItem>
                          <SelectItem value="medium">Medium</SelectItem>
                          <SelectItem value="high">High</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Target Value *
                      </label>
                      <Input
                        type="number"
                        placeholder="e.g., 50"
                        value={newGoal.targetValue || ""}
                        onChange={(e) =>
                          setNewGoal({
                            ...newGoal,
                            targetValue: parseInt(e.target.value),
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Unit *
                      </label>
                      <Input
                        placeholder="e.g., hours, problems, pages"
                        value={newGoal.unit || ""}
                        onChange={(e) =>
                          setNewGoal({ ...newGoal, unit: e.target.value })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Deadline *
                      </label>
                      <Input
                        type="date"
                        value={newGoal.deadline || ""}
                        onChange={(e) =>
                          setNewGoal({ ...newGoal, deadline: e.target.value })
                        }
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Description
                    </label>
                    <Textarea
                      placeholder="Describe your goal and motivation..."
                      value={newGoal.description || ""}
                      onChange={(e) =>
                        setNewGoal({ ...newGoal, description: e.target.value })
                      }
                    />
                  </div>

                  {/* Schedule Section */}
                  <div className="border-t pt-4">
                    <h4 className="text-lg font-semibold mb-4 flex items-center">
                      <Clock className="w-5 h-5 mr-2 text-blue-500" />
                      Schedule Settings
                    </h4>
                    <div className="space-y-4">
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Schedule Type
                          </label>
                          <Select
                            value={newGoal.schedule?.type || "daily"}
                            onValueChange={(value) =>
                              setNewGoal({
                                ...newGoal,
                                schedule: {
                                  ...newGoal.schedule,
                                  type: value as "daily" | "weekly" | "custom",
                                },
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="daily">Daily</SelectItem>
                              <SelectItem value="weekly">Weekly</SelectItem>
                              <SelectItem value="custom">Custom</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <label className="text-sm font-medium mb-2 block">
                            Session Duration
                          </label>
                          <Select
                            value={newGoal.schedule?.duration || "1 hour"}
                            onValueChange={(value) =>
                              setNewGoal({
                                ...newGoal,
                                schedule: {
                                  ...newGoal.schedule,
                                  duration: value,
                                },
                              })
                            }
                          >
                            <SelectTrigger>
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="30 minutes">
                                30 minutes
                              </SelectItem>
                              <SelectItem value="1 hour">1 hour</SelectItem>
                              <SelectItem value="1.5 hours">
                                1.5 hours
                              </SelectItem>
                              <SelectItem value="2 hours">2 hours</SelectItem>
                              <SelectItem value="3 hours">3 hours</SelectItem>
                              <SelectItem value="4 hours">4 hours</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-2 block">
                          Study Time Slots
                          <span className="text-gray-500 ml-1">
                            (Add preferred times)
                          </span>
                        </label>
                        <div className="flex flex-wrap gap-2 mb-2">
                          {newGoal.schedule?.timeSlots?.map((time, index) => (
                            <Badge
                              key={index}
                              variant="secondary"
                              className="flex items-center space-x-1"
                            >
                              <Clock className="w-3 h-3" />
                              <span>{time}</span>
                              <button
                                type="button"
                                onClick={() => {
                                  const updatedTimeSlots =
                                    newGoal.schedule?.timeSlots?.filter(
                                      (_, i) => i !== index,
                                    ) || [];
                                  setNewGoal({
                                    ...newGoal,
                                    schedule: {
                                      ...newGoal.schedule,
                                      timeSlots: updatedTimeSlots,
                                    },
                                  });
                                }}
                                className="ml-1 text-red-500 hover:text-red-700"
                              >
                                ×
                              </button>
                            </Badge>
                          ))}
                        </div>
                        <div className="flex space-x-2">
                          <Input
                            type="time"
                            placeholder="Add time slot"
                            onChange={(e) => {
                              if (e.target.value) {
                                const currentTimeSlots =
                                  newGoal.schedule?.timeSlots || [];
                                if (
                                  !currentTimeSlots.includes(e.target.value)
                                ) {
                                  setNewGoal({
                                    ...newGoal,
                                    schedule: {
                                      ...newGoal.schedule,
                                      timeSlots: [
                                        ...currentTimeSlots,
                                        e.target.value,
                                      ],
                                    },
                                  });
                                }
                                e.target.value = "";
                              }
                            }}
                          />
                          <Button
                            type="button"
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              const commonTimes = [
                                "09:00",
                                "14:00",
                                "19:00",
                                "21:00",
                              ];
                              const randomTime =
                                commonTimes[
                                  Math.floor(Math.random() * commonTimes.length)
                                ];
                              const currentTimeSlots =
                                newGoal.schedule?.timeSlots || [];
                              if (!currentTimeSlots.includes(randomTime)) {
                                setNewGoal({
                                  ...newGoal,
                                  schedule: {
                                    ...newGoal.schedule,
                                    timeSlots: [
                                      ...currentTimeSlots,
                                      randomTime,
                                    ],
                                  },
                                });
                              }
                            }}
                          >
                            + Quick Add
                          </Button>
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          id="reminders"
                          checked={newGoal.schedule?.reminders || false}
                          onChange={(e) =>
                            setNewGoal({
                              ...newGoal,
                              schedule: {
                                ...newGoal.schedule,
                                reminders: e.target.checked,
                              },
                            })
                          }
                          className="rounded border-gray-300"
                        />
                        <label
                          htmlFor="reminders"
                          className="text-sm font-medium"
                        >
                          Enable study reminders
                        </label>
                      </div>
                    </div>
                  </div>

                  <div className="flex space-x-3">
                    <Button onClick={handleAddGoal} className="flex-1">
                      Create Goal
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setShowAddForm(false)}
                      className="flex-1"
                    >
                      Cancel
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Active Goals List */}
            {activeGoals.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Target className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No active goals
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Set your first goal to start tracking progress
                  </p>
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-kiit-gradient text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Create First Goal
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {activeGoals.map((goal) => {
                  const progress = (goal.currentValue / goal.targetValue) * 100;
                  const daysLeft = Math.ceil(
                    (new Date(goal.deadline).getTime() - new Date().getTime()) /
                      (1000 * 60 * 60 * 24),
                  );
                  const goalMilestones = milestones.filter(
                    (m) => m.goalId === goal.id,
                  );

                  return (
                    <Card
                      key={goal.id}
                      className={`hover:shadow-md transition-shadow border-l-4 ${getPriorityColor(goal.priority)}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <Badge
                              className={`${getCategoryColor(goal.category)} text-white capitalize`}
                            >
                              {goal.category}
                            </Badge>
                            <Badge
                              variant="outline"
                              className={
                                goal.priority === "high"
                                  ? "border-red-500 text-red-700"
                                  : goal.priority === "medium"
                                    ? "border-yellow-500 text-yellow-700"
                                    : "border-green-500 text-green-700"
                              }
                            >
                              {goal.priority} priority
                            </Badge>
                            <h3 className="font-semibold text-lg">
                              {goal.title}
                            </h3>
                          </div>
                          <div className="flex items-center space-x-2">
                            {daysLeft > 0 ? (
                              <Badge variant="outline">
                                <Clock className="w-3 h-3 mr-1" />
                                {daysLeft} days left
                              </Badge>
                            ) : (
                              <Badge className="bg-red-500 text-white">
                                <Clock className="w-3 h-3 mr-1" />
                                Overdue
                              </Badge>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleToggleGoalStatus(goal.id)}
                            >
                              {goal.status === "active" ? (
                                <PauseCircle className="w-4 h-4" />
                              ) : (
                                <PlayCircle className="w-4 h-4" />
                              )}
                            </Button>
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteGoal(goal.id)}
                              className="text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>

                        {goal.description && (
                          <p className="text-gray-600 dark:text-gray-400 mb-4">
                            {goal.description}
                          </p>
                        )}

                        {/* Progress Section */}
                        <div className="space-y-3">
                          <div className="flex items-center justify-between">
                            <span className="text-sm font-medium">
                              Progress
                            </span>
                            <span className="text-sm text-gray-600">
                              {goal.currentValue} / {goal.targetValue}{" "}
                              {goal.unit}
                            </span>
                          </div>
                          <Progress value={progress} className="h-3" />
                          <div className="text-center">
                            <span className="text-3xl font-bold text-kiit-600">
                              {Math.round(progress)}%
                            </span>
                            <span className="text-sm text-gray-500 ml-2">
                              complete
                            </span>
                          </div>

                          {/* Update Progress */}
                          <div className="flex items-center space-x-2 pt-2">
                            <Input
                              type="number"
                              placeholder={`Current ${goal.unit}`}
                              value={goal.currentValue}
                              onChange={(e) =>
                                handleUpdateProgress(
                                  goal.id,
                                  parseInt(e.target.value) || 0,
                                )
                              }
                              className="flex-1"
                            />
                            <span className="text-sm text-gray-500">
                              {goal.unit}
                            </span>
                          </div>

                          {/* Milestones */}
                          {goalMilestones.length > 0 && (
                            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <h4 className="text-sm font-medium mb-2 flex items-center">
                                <Star className="w-4 h-4 mr-1 text-yellow-500" />
                                Milestones
                              </h4>
                              <div className="space-y-2">
                                {goalMilestones.map((milestone) => (
                                  <div
                                    key={milestone.id}
                                    className="flex items-center justify-between"
                                  >
                                    <div className="flex items-center space-x-2">
                                      {milestone.isCompleted ? (
                                        <CheckCircle className="w-4 h-4 text-green-500" />
                                      ) : (
                                        <Circle className="w-4 h-4 text-gray-400" />
                                      )}
                                      <span
                                        className={`text-sm ${milestone.isCompleted ? "line-through text-gray-500" : ""}`}
                                      >
                                        {milestone.title}
                                      </span>
                                    </div>
                                    <span className="text-xs text-gray-500">
                                      {milestone.reward}
                                    </span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Tags */}
                          {goal.tags && goal.tags.length > 0 && (
                            <div className="flex flex-wrap gap-1 mt-3">
                              {goal.tags.map((tag, index) => (
                                <Badge
                                  key={index}
                                  variant="secondary"
                                  className="text-xs"
                                >
                                  #{tag}
                                </Badge>
                              ))}
                            </div>
                          )}

                          {/* Schedule */}
                          {goal.schedule && (
                            <div className="mt-4 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                              <h4 className="text-sm font-medium mb-2 flex items-center">
                                <Clock className="w-4 h-4 mr-1 text-blue-500" />
                                Study Schedule
                              </h4>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">Type:</span>
                                  <Badge
                                    variant="outline"
                                    className="capitalize"
                                  >
                                    {goal.schedule.type}
                                  </Badge>
                                </div>
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">
                                    Duration:
                                  </span>
                                  <span className="font-medium">
                                    {goal.schedule.duration}
                                  </span>
                                </div>
                                {goal.schedule.timeSlots &&
                                  goal.schedule.timeSlots.length > 0 && (
                                    <div className="text-sm">
                                      <span className="text-gray-600">
                                        Time slots:
                                      </span>
                                      <div className="flex flex-wrap gap-1 mt-1">
                                        {goal.schedule.timeSlots.map(
                                          (time, index) => (
                                            <Badge
                                              key={index}
                                              variant="secondary"
                                              className="text-xs bg-blue-100 text-blue-800"
                                            >
                                              {time}
                                            </Badge>
                                          ),
                                        )}
                                      </div>
                                    </div>
                                  )}
                                {goal.schedule.reminders && (
                                  <div className="flex items-center space-x-1 text-sm text-green-600">
                                    <Bell className="w-3 h-3" />
                                    <span>Reminders enabled</span>
                                  </div>
                                )}
                              </div>
                            </div>
                          )}

                          {/* Streak */}
                          {goal.streak > 0 && (
                            <div className="flex items-center space-x-2 mt-2">
                              <Flame className="w-4 h-4 text-orange-500" />
                              <span className="text-sm text-gray-600">
                                {goal.streak} day streak!
                              </span>
                            </div>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Progress Tab */}
          <TabsContent value="progress" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Completed Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Trophy className="w-5 h-5 mr-2 text-green-500" />
                    Completed Goals ({completedGoals.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80">
                    <div className="space-y-3">
                      {completedGoals.map((goal) => (
                        <div
                          key={goal.id}
                          className="p-3 border-green-200 dark:border-green-800 bg-green-50 dark:bg-green-900/20 rounded-lg"
                        >
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <CheckCircle className="w-5 h-5 text-green-500" />
                              <div>
                                <h4 className="font-semibold text-sm">
                                  {goal.title}
                                </h4>
                                <p className="text-xs text-gray-600 dark:text-gray-400">
                                  Completed {goal.targetValue} {goal.unit}
                                  {goal.completedAt &&
                                    ` on ${new Date(goal.completedAt).toLocaleDateString()}`}
                                </p>
                              </div>
                            </div>
                            <Badge className="bg-green-500 text-white">
                              <Trophy className="w-3 h-3 mr-1" />
                              Completed
                            </Badge>
                          </div>
                        </div>
                      ))}
                    </div>
                  </ScrollArea>
                </CardContent>
              </Card>

              {/* Paused Goals */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <PauseCircle className="w-5 h-5 mr-2 text-orange-500" />
                    Paused Goals ({pausedGoals.length})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <ScrollArea className="h-80">
                    {pausedGoals.length === 0 ? (
                      <div className="text-center py-8">
                        <PauseCircle className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500 text-sm">No paused goals</p>
                      </div>
                    ) : (
                      <div className="space-y-3">
                        {pausedGoals.map((goal) => (
                          <div
                            key={goal.id}
                            className="p-3 border-orange-200 dark:border-orange-800 bg-orange-50 dark:bg-orange-900/20 rounded-lg"
                          >
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <PauseCircle className="w-5 h-5 text-orange-500" />
                                <div>
                                  <h4 className="font-semibold text-sm">
                                    {goal.title}
                                  </h4>
                                  <p className="text-xs text-gray-600 dark:text-gray-400">
                                    Progress: {goal.currentValue} /{" "}
                                    {goal.targetValue} {goal.unit}
                                  </p>
                                </div>
                              </div>
                              <Button
                                size="sm"
                                onClick={() => handleToggleGoalStatus(goal.id)}
                                className="bg-orange-500 text-white hover:bg-orange-600"
                              >
                                <PlayCircle className="w-3 h-3 mr-1" />
                                Resume
                              </Button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </ScrollArea>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Achievements Tab */}
          <TabsContent value="achievements" className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Achievement Cards */}
              <Card className="bg-gradient-to-r from-yellow-400 to-yellow-500 text-white">
                <CardContent className="text-center p-6">
                  <Award className="w-12 h-12 mx-auto mb-3 opacity-80" />
                  <h3 className="font-bold text-lg mb-2">Goal Crusher</h3>
                  <p className="text-sm opacity-80">Complete your first goal</p>
                  <Badge className="bg-white text-yellow-600 mt-3">
                    {completedGoals.length > 0 ? "UNLOCKED" : "LOCKED"}
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-purple-400 to-purple-500 text-white">
                <CardContent className="text-center p-6">
                  <Flame className="w-12 h-12 mx-auto mb-3 opacity-80" />
                  <h3 className="font-bold text-lg mb-2">Streak Master</h3>
                  <p className="text-sm opacity-80">Maintain a 7-day streak</p>
                  <Badge className="bg-white text-purple-600 mt-3">
                    {studyStats.streakDays >= 7 ? "UNLOCKED" : "LOCKED"}
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-green-400 to-green-500 text-white">
                <CardContent className="text-center p-6">
                  <Brain className="w-12 h-12 mx-auto mb-3 opacity-80" />
                  <h3 className="font-bold text-lg mb-2">Knowledge Seeker</h3>
                  <p className="text-sm opacity-80">Complete 100 study hours</p>
                  <Badge className="bg-white text-green-600 mt-3">
                    {studyStats.totalStudyTime >= 100 ? "UNLOCKED" : "LOCKED"}
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-blue-400 to-blue-500 text-white">
                <CardContent className="text-center p-6">
                  <Target className="w-12 h-12 mx-auto mb-3 opacity-80" />
                  <h3 className="font-bold text-lg mb-2">Perfectionist</h3>
                  <p className="text-sm opacity-80">Achieve 100% on any goal</p>
                  <Badge className="bg-white text-blue-600 mt-3">
                    {completedGoals.length > 0 ? "UNLOCKED" : "LOCKED"}
                  </Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-red-400 to-red-500 text-white">
                <CardContent className="text-center p-6">
                  <Zap className="w-12 h-12 mx-auto mb-3 opacity-80" />
                  <h3 className="font-bold text-lg mb-2">Speed Demon</h3>
                  <p className="text-sm opacity-80">
                    Complete a goal ahead of deadline
                  </p>
                  <Badge className="bg-white text-red-600 mt-3">LOCKED</Badge>
                </CardContent>
              </Card>

              <Card className="bg-gradient-to-r from-indigo-400 to-indigo-500 text-white">
                <CardContent className="text-center p-6">
                  <BookOpen className="w-12 h-12 mx-auto mb-3 opacity-80" />
                  <h3 className="font-bold text-lg mb-2">Multitasker</h3>
                  <p className="text-sm opacity-80">
                    Have 5 active goals simultaneously
                  </p>
                  <Badge className="bg-white text-indigo-600 mt-3">
                    {activeGoals.length >= 5 ? "UNLOCKED" : "LOCKED"}
                  </Badge>
                </CardContent>
              </Card>
            </div>

            {/* Milestones Progress */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Star className="w-5 h-5 mr-2 text-yellow-500" />
                  Recent Milestones
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {milestones
                    .filter((m) => m.isCompleted)
                    .slice(0, 5)
                    .map((milestone) => {
                      const goal = goals.find((g) => g.id === milestone.goalId);
                      return (
                        <div
                          key={milestone.id}
                          className="flex items-center space-x-3 p-3 bg-gray-50 dark:bg-gray-800 rounded-lg"
                        >
                          <CheckCircle className="w-5 h-5 text-green-500" />
                          <div className="flex-1">
                            <h4 className="font-medium">{milestone.title}</h4>
                            <p className="text-sm text-gray-600">
                              {goal?.title} •{" "}
                              {milestone.completedAt &&
                                new Date(
                                  milestone.completedAt,
                                ).toLocaleDateString()}
                            </p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg">{milestone.reward}</div>
                          </div>
                        </div>
                      );
                    })}
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

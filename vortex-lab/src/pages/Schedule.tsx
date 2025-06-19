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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Calendar,
  Clock,
  Plus,
  Edit,
  Trash2,
  BookOpen,
  Target,
  AlertCircle,
  CheckCircle2,
  PlayCircle,
  Bell,
  Users,
  MapPin,
  Repeat,
  Filter,
  Download,
  Share2,
} from "lucide-react";

interface ScheduleProps {
  currentUser: KIITUser | null;
}

interface ScheduleItem {
  id: string;
  title: string;
  subject: string;
  date: string;
  time: string;
  endTime: string;
  duration: string;
  type: "study" | "exam" | "assignment" | "group" | "class" | "meeting";
  description: string;
  location?: string;
  priority: "low" | "medium" | "high";
  status: "scheduled" | "completed" | "missed" | "in-progress";
  recurring: "none" | "daily" | "weekly" | "monthly";
  reminder: number; // minutes before
  participants?: string[];
  createdAt: string;
}

interface CalendarDay {
  date: Date;
  isCurrentMonth: boolean;
  isToday: boolean;
  events: ScheduleItem[];
}

export default function Schedule({ currentUser }: ScheduleProps) {
  const [schedules, setSchedules] = useState<ScheduleItem[]>([
    {
      id: "1",
      title: "DSA Practice Session",
      subject: "Data Structures",
      date: "2024-01-15",
      time: "14:00",
      endTime: "16:00",
      duration: "2 hours",
      type: "study",
      description: "Tree and graph problems practice",
      location: "Library Study Room 3",
      priority: "high",
      status: "scheduled",
      recurring: "daily",
      reminder: 15,
      createdAt: "2024-01-10",
    },
    {
      id: "2",
      title: "Physics Lab Exam",
      subject: "Physics",
      date: "2024-01-16",
      time: "10:00",
      endTime: "13:00",
      duration: "3 hours",
      type: "exam",
      description: "Practical examination on wave optics",
      location: "Physics Lab A",
      priority: "high",
      status: "scheduled",
      recurring: "none",
      reminder: 60,
      createdAt: "2024-01-08",
    },
    {
      id: "3",
      title: "Group Study Session",
      subject: "Mathematics",
      date: "2024-01-14",
      time: "19:00",
      endTime: "21:00",
      duration: "2 hours",
      type: "group",
      description: "Calculus problem solving",
      location: "Study Hall B",
      priority: "medium",
      status: "completed",
      recurring: "weekly",
      reminder: 30,
      participants: ["Rahul", "Priya", "Arjun"],
      createdAt: "2024-01-05",
    },
  ]);

  const [showAddForm, setShowAddForm] = useState(false);
  const [editingSchedule, setEditingSchedule] = useState<ScheduleItem | null>(
    null,
  );
  const [newSchedule, setNewSchedule] = useState<Partial<ScheduleItem>>({
    type: "study",
    priority: "medium",
    status: "scheduled",
    recurring: "none",
    reminder: 15,
  });

  const [currentDate, setCurrentDate] = useState(new Date());
  const [viewMode, setViewMode] = useState<"calendar" | "list" | "agenda">(
    "calendar",
  );
  const [filterType, setFilterType] = useState<string>("all");
  const [filterStatus, setFilterStatus] = useState<string>("all");

  // Load schedules from localStorage
  useEffect(() => {
    const savedSchedules = localStorage.getItem(
      `schedules_${currentUser?.uid}`,
    );
    if (savedSchedules) {
      setSchedules(JSON.parse(savedSchedules));
    }
  }, [currentUser]);

  // Save schedules to localStorage
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem(
        `schedules_${currentUser.uid}`,
        JSON.stringify(schedules),
      );
    }
  }, [schedules, currentUser]);

  const handleAddSchedule = () => {
    if (
      newSchedule.title &&
      newSchedule.subject &&
      newSchedule.date &&
      newSchedule.time
    ) {
      const schedule: ScheduleItem = {
        id: Date.now().toString(),
        title: newSchedule.title,
        subject: newSchedule.subject,
        date: newSchedule.date,
        time: newSchedule.time,
        endTime:
          newSchedule.endTime ||
          calculateEndTime(newSchedule.time!, newSchedule.duration || "1 hour"),
        duration: newSchedule.duration || "1 hour",
        type: newSchedule.type as
          | "study"
          | "exam"
          | "assignment"
          | "group"
          | "class"
          | "meeting",
        description: newSchedule.description || "",
        location: newSchedule.location,
        priority: newSchedule.priority as "low" | "medium" | "high",
        status: "scheduled",
        recurring: newSchedule.recurring as
          | "none"
          | "daily"
          | "weekly"
          | "monthly",
        reminder: newSchedule.reminder || 15,
        participants: newSchedule.participants,
        createdAt: new Date().toISOString().split("T")[0],
      };

      setSchedules([...schedules, schedule]);
      setNewSchedule({
        type: "study",
        priority: "medium",
        status: "scheduled",
        recurring: "none",
        reminder: 15,
      });
      setShowAddForm(false);
      alert("Schedule added successfully! 📅");
    } else {
      alert("Please fill in all required fields");
    }
  };

  const calculateEndTime = (startTime: string, duration: string): string => {
    const [hours, minutes] = startTime.split(":").map(Number);
    const durationMinutes = duration.includes("hour")
      ? parseInt(duration) * 60
      : parseInt(duration);

    const totalMinutes = hours * 60 + minutes + durationMinutes;
    const endHours = Math.floor(totalMinutes / 60);
    const endMins = totalMinutes % 60;

    return `${endHours.toString().padStart(2, "0")}:${endMins.toString().padStart(2, "0")}`;
  };

  const handleDeleteSchedule = (id: string) => {
    if (confirm("Are you sure you want to delete this schedule?")) {
      setSchedules(schedules.filter((s) => s.id !== id));
      alert("Schedule removed");
    }
  };

  const handleUpdateStatus = (
    id: string,
    status: "scheduled" | "completed" | "missed" | "in-progress",
  ) => {
    setSchedules(
      schedules.map((schedule) =>
        schedule.id === id ? { ...schedule, status } : schedule,
      ),
    );
  };

  const getTypeColor = (type: string) => {
    switch (type) {
      case "study":
        return "bg-blue-500";
      case "exam":
        return "bg-red-500";
      case "assignment":
        return "bg-yellow-500";
      case "group":
        return "bg-green-500";
      case "class":
        return "bg-purple-500";
      case "meeting":
        return "bg-indigo-500";
      default:
        return "bg-gray-500";
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "study":
        return BookOpen;
      case "exam":
        return Target;
      case "assignment":
        return Edit;
      case "group":
        return Users;
      case "class":
        return Calendar;
      case "meeting":
        return MapPin;
      default:
        return BookOpen;
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

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-100";
      case "in-progress":
        return "text-blue-600 bg-blue-100";
      case "missed":
        return "text-red-600 bg-red-100";
      default:
        return "text-gray-600 bg-gray-100";
    }
  };

  // Generate calendar days
  const generateCalendarDays = (): CalendarDay[] => {
    const startOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      1,
    );
    const endOfMonth = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth() + 1,
      0,
    );
    const startOfCalendar = new Date(startOfMonth);
    const endOfCalendar = new Date(endOfMonth);

    // Adjust to start from Sunday
    startOfCalendar.setDate(
      startOfCalendar.getDate() - startOfCalendar.getDay(),
    );
    endOfCalendar.setDate(
      endOfCalendar.getDate() + (6 - endOfCalendar.getDay()),
    );

    const days: CalendarDay[] = [];
    const current = new Date(startOfCalendar);

    while (current <= endOfCalendar) {
      const dateString = current.toISOString().split("T")[0];
      const dayEvents = schedules.filter(
        (schedule) => schedule.date === dateString,
      );

      days.push({
        date: new Date(current),
        isCurrentMonth: current.getMonth() === currentDate.getMonth(),
        isToday: current.toDateString() === new Date().toDateString(),
        events: dayEvents,
      });

      current.setDate(current.getDate() + 1);
    }

    return days;
  };

  // Filter schedules
  const filteredSchedules = schedules.filter((schedule) => {
    const typeMatch = filterType === "all" || schedule.type === filterType;
    const statusMatch =
      filterStatus === "all" || schedule.status === filterStatus;
    return typeMatch && statusMatch;
  });

  const upcomingSchedules = filteredSchedules
    .filter((s) => new Date(s.date + " " + s.time) >= new Date())
    .sort(
      (a, b) =>
        new Date(a.date + " " + a.time).getTime() -
        new Date(b.date + " " + b.time).getTime(),
    );

  const todaySchedules = schedules.filter(
    (s) => s.date === new Date().toISOString().split("T")[0],
  );

  const calendarDays = generateCalendarDays();

  const stats = {
    total: schedules.length,
    completed: schedules.filter((s) => s.status === "completed").length,
    upcoming: upcomingSchedules.length,
    overdue: schedules.filter(
      (s) =>
        new Date(s.date + " " + s.time) < new Date() &&
        s.status === "scheduled",
    ).length,
  };

  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 dark:text-white flex items-center">
                <Calendar className="w-8 h-8 mr-3 text-kiit-600" />
                Study Schedule
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                Plan, organize, and track your study sessions
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="flex items-center space-x-2">
                <Select
                  value={viewMode}
                  onValueChange={(value: any) => setViewMode(value)}
                >
                  <SelectTrigger className="w-32">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="calendar">Calendar</SelectItem>
                    <SelectItem value="list">List</SelectItem>
                    <SelectItem value="agenda">Agenda</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button
                onClick={() => setShowAddForm(true)}
                className="bg-kiit-gradient text-white px-6 py-3"
                size="lg"
              >
                <Plus className="w-5 h-5 mr-2" />
                Add Schedule
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-7xl mx-auto p-6">
        <Tabs
          value={viewMode}
          onValueChange={setViewMode}
          className="space-y-6"
        >
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="calendar">Calendar View</TabsTrigger>
            <TabsTrigger value="list">List View</TabsTrigger>
            <TabsTrigger value="agenda">Today's Agenda</TabsTrigger>
          </TabsList>

          {/* Stats Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card className="bg-gradient-to-r from-blue-500 to-blue-600 text-white">
              <CardContent className="text-center p-6">
                <Calendar className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="text-3xl font-bold">{stats.total}</div>
                <p className="text-sm opacity-80">Total Schedules</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-green-500 to-green-600 text-white">
              <CardContent className="text-center p-6">
                <CheckCircle2 className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="text-3xl font-bold">{stats.completed}</div>
                <p className="text-sm opacity-80">Completed</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-orange-500 to-orange-600 text-white">
              <CardContent className="text-center p-6">
                <Clock className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="text-3xl font-bold">{stats.upcoming}</div>
                <p className="text-sm opacity-80">Upcoming</p>
              </CardContent>
            </Card>
            <Card className="bg-gradient-to-r from-red-500 to-red-600 text-white">
              <CardContent className="text-center p-6">
                <AlertCircle className="w-8 h-8 mx-auto mb-2 opacity-80" />
                <div className="text-3xl font-bold">{stats.overdue}</div>
                <p className="text-sm opacity-80">Overdue</p>
              </CardContent>
            </Card>
          </div>

          {/* Calendar View */}
          <TabsContent value="calendar" className="space-y-6">
            {/* Calendar Header */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-4">
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentDate(
                          new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth() - 1,
                          ),
                        )
                      }
                    >
                      ←
                    </Button>
                    <h2 className="text-xl font-bold">
                      {currentDate.toLocaleDateString("en-US", {
                        month: "long",
                        year: "numeric",
                      })}
                    </h2>
                    <Button
                      variant="outline"
                      onClick={() =>
                        setCurrentDate(
                          new Date(
                            currentDate.getFullYear(),
                            currentDate.getMonth() + 1,
                          ),
                        )
                      }
                    >
                      →
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setCurrentDate(new Date())}
                    >
                      Today
                    </Button>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Select value={filterType} onValueChange={setFilterType}>
                      <SelectTrigger className="w-32">
                        <SelectValue placeholder="Filter type" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">All Types</SelectItem>
                        <SelectItem value="study">Study</SelectItem>
                        <SelectItem value="exam">Exam</SelectItem>
                        <SelectItem value="assignment">Assignment</SelectItem>
                        <SelectItem value="group">Group</SelectItem>
                        <SelectItem value="class">Class</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                {/* Calendar Grid */}
                <div className="grid grid-cols-7 gap-1 mb-4">
                  {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map(
                    (day) => (
                      <div
                        key={day}
                        className="p-2 text-center font-medium text-gray-600"
                      >
                        {day}
                      </div>
                    ),
                  )}
                </div>
                <div className="grid grid-cols-7 gap-1">
                  {calendarDays.map((day, index) => (
                    <div
                      key={index}
                      className={`min-h-24 p-2 border rounded-lg cursor-pointer hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors ${
                        day.isCurrentMonth
                          ? "bg-white dark:bg-gray-900"
                          : "bg-gray-100 dark:bg-gray-800"
                      } ${
                        day.isToday
                          ? "ring-2 ring-kiit-500 bg-kiit-50 dark:bg-kiit-900/20"
                          : ""
                      }`}
                    >
                      <div
                        className={`text-sm font-medium mb-1 ${
                          day.isCurrentMonth
                            ? "text-gray-900 dark:text-white"
                            : "text-gray-400"
                        }`}
                      >
                        {day.date.getDate()}
                      </div>
                      <div className="space-y-1">
                        {day.events.slice(0, 2).map((event) => (
                          <div
                            key={event.id}
                            className={`text-xs p-1 rounded truncate ${getTypeColor(event.type)} text-white`}
                          >
                            {event.title}
                          </div>
                        ))}
                        {day.events.length > 2 && (
                          <div className="text-xs text-gray-500">
                            +{day.events.length - 2} more
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* List View */}
          <TabsContent value="list" className="space-y-6">
            {/* Add Schedule Form */}
            {showAddForm && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Plus className="w-5 h-5 mr-2" />
                    Add New Schedule
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Title *
                      </label>
                      <Input
                        placeholder="e.g., Math Study Session"
                        value={newSchedule.title || ""}
                        onChange={(e) =>
                          setNewSchedule({
                            ...newSchedule,
                            title: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Subject *
                      </label>
                      <Input
                        placeholder="e.g., Mathematics"
                        value={newSchedule.subject || ""}
                        onChange={(e) =>
                          setNewSchedule({
                            ...newSchedule,
                            subject: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Type
                      </label>
                      <Select
                        value={newSchedule.type || "study"}
                        onValueChange={(value) =>
                          setNewSchedule({ ...newSchedule, type: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="study">Study Session</SelectItem>
                          <SelectItem value="exam">Exam</SelectItem>
                          <SelectItem value="assignment">Assignment</SelectItem>
                          <SelectItem value="group">Group Study</SelectItem>
                          <SelectItem value="class">Class</SelectItem>
                          <SelectItem value="meeting">Meeting</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Date *
                      </label>
                      <Input
                        type="date"
                        value={newSchedule.date || ""}
                        onChange={(e) =>
                          setNewSchedule({
                            ...newSchedule,
                            date: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Start Time *
                      </label>
                      <Input
                        type="time"
                        value={newSchedule.time || ""}
                        onChange={(e) =>
                          setNewSchedule({
                            ...newSchedule,
                            time: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Duration
                      </label>
                      <Select
                        value={newSchedule.duration || "1 hour"}
                        onValueChange={(value) =>
                          setNewSchedule({ ...newSchedule, duration: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="30 minutes">30 minutes</SelectItem>
                          <SelectItem value="1 hour">1 hour</SelectItem>
                          <SelectItem value="1.5 hours">1.5 hours</SelectItem>
                          <SelectItem value="2 hours">2 hours</SelectItem>
                          <SelectItem value="3 hours">3 hours</SelectItem>
                          <SelectItem value="4 hours">4 hours</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Priority
                      </label>
                      <Select
                        value={newSchedule.priority || "medium"}
                        onValueChange={(value) =>
                          setNewSchedule({ ...newSchedule, priority: value })
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
                        Location
                      </label>
                      <Input
                        placeholder="e.g., Library Study Room"
                        value={newSchedule.location || ""}
                        onChange={(e) =>
                          setNewSchedule({
                            ...newSchedule,
                            location: e.target.value,
                          })
                        }
                      />
                    </div>
                    <div>
                      <label className="text-sm font-medium mb-2 block">
                        Recurring
                      </label>
                      <Select
                        value={newSchedule.recurring || "none"}
                        onValueChange={(value) =>
                          setNewSchedule({ ...newSchedule, recurring: value })
                        }
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">None</SelectItem>
                          <SelectItem value="daily">Daily</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium mb-2 block">
                      Description
                    </label>
                    <Textarea
                      placeholder="Add details about your study session..."
                      value={newSchedule.description || ""}
                      onChange={(e) =>
                        setNewSchedule({
                          ...newSchedule,
                          description: e.target.value,
                        })
                      }
                    />
                  </div>
                  <div className="flex space-x-3">
                    <Button onClick={handleAddSchedule} className="flex-1">
                      Add Schedule
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

            {/* Filters */}
            <Card>
              <CardContent className="pt-6">
                <div className="flex items-center space-x-4">
                  <div className="flex items-center space-x-2">
                    <Filter className="w-4 h-4 text-gray-500" />
                    <span className="text-sm font-medium">Filters:</span>
                  </div>
                  <Select value={filterType} onValueChange={setFilterType}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Types</SelectItem>
                      <SelectItem value="study">Study</SelectItem>
                      <SelectItem value="exam">Exam</SelectItem>
                      <SelectItem value="assignment">Assignment</SelectItem>
                      <SelectItem value="group">Group</SelectItem>
                      <SelectItem value="class">Class</SelectItem>
                      <SelectItem value="meeting">Meeting</SelectItem>
                    </SelectContent>
                  </Select>
                  <Select value={filterStatus} onValueChange={setFilterStatus}>
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Filter by status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Status</SelectItem>
                      <SelectItem value="scheduled">Scheduled</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="in-progress">In Progress</SelectItem>
                      <SelectItem value="missed">Missed</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Schedules List */}
            {filteredSchedules.length === 0 ? (
              <Card>
                <CardContent className="text-center py-12">
                  <Calendar className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    No schedules found
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400 mb-4">
                    Start by adding your first study session
                  </p>
                  <Button
                    onClick={() => setShowAddForm(true)}
                    className="bg-kiit-gradient text-white"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add First Schedule
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-4">
                {filteredSchedules.map((schedule) => {
                  const TypeIcon = getTypeIcon(schedule.type);
                  const scheduleDateTime = new Date(
                    schedule.date + " " + schedule.time,
                  );
                  const isToday =
                    scheduleDateTime.toDateString() ===
                    new Date().toDateString();
                  const isTomorrow =
                    scheduleDateTime.toDateString() ===
                    new Date(Date.now() + 24 * 60 * 60 * 1000).toDateString();
                  const isPast = scheduleDateTime < new Date();

                  return (
                    <Card
                      key={schedule.id}
                      className={`hover:shadow-md transition-shadow border-l-4 ${getPriorityColor(schedule.priority)}`}
                    >
                      <CardContent className="p-6">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-4">
                            <div
                              className={`w-12 h-12 ${getTypeColor(schedule.type)} rounded-xl flex items-center justify-center`}
                            >
                              <TypeIcon className="w-6 h-6 text-white" />
                            </div>
                            <div className="flex-1">
                              <div className="flex items-center space-x-2 mb-1">
                                <h3 className="font-semibold text-lg">
                                  {schedule.title}
                                </h3>
                                <Badge
                                  className={`${getTypeColor(schedule.type)} text-white capitalize`}
                                >
                                  {schedule.type}
                                </Badge>
                                <Badge
                                  variant="outline"
                                  className={
                                    schedule.priority === "high"
                                      ? "border-red-500 text-red-700"
                                      : schedule.priority === "medium"
                                        ? "border-yellow-500 text-yellow-700"
                                        : "border-green-500 text-green-700"
                                  }
                                >
                                  {schedule.priority}
                                </Badge>
                                <Badge
                                  className={getStatusColor(schedule.status)}
                                >
                                  {schedule.status}
                                </Badge>
                              </div>
                              <p className="text-gray-600 dark:text-gray-400 mb-2">
                                {schedule.subject}
                              </p>
                              {schedule.description && (
                                <p className="text-sm text-gray-500 mb-2">
                                  {schedule.description}
                                </p>
                              )}
                              <div className="flex items-center space-x-4 text-sm text-gray-600">
                                <div className="flex items-center">
                                  <Calendar className="w-4 h-4 mr-1" />
                                  {new Date(schedule.date).toLocaleDateString()}
                                  {isToday && (
                                    <Badge className="ml-2 bg-green-500 text-white">
                                      Today
                                    </Badge>
                                  )}
                                  {isTomorrow && (
                                    <Badge className="ml-2 bg-blue-500 text-white">
                                      Tomorrow
                                    </Badge>
                                  )}
                                </div>
                                <div className="flex items-center">
                                  <Clock className="w-4 h-4 mr-1" />
                                  {schedule.time} - {schedule.endTime}
                                </div>
                                {schedule.location && (
                                  <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    {schedule.location}
                                  </div>
                                )}
                                {schedule.recurring !== "none" && (
                                  <div className="flex items-center">
                                    <Repeat className="w-4 h-4 mr-1" />
                                    {schedule.recurring}
                                  </div>
                                )}
                              </div>
                            </div>
                          </div>

                          <div className="flex items-center space-x-2">
                            {schedule.status === "scheduled" && !isPast && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleUpdateStatus(schedule.id, "in-progress")
                                }
                                className="bg-blue-500 text-white hover:bg-blue-600"
                              >
                                <PlayCircle className="w-3 h-3 mr-1" />
                                Start
                              </Button>
                            )}
                            {schedule.status === "in-progress" && (
                              <Button
                                size="sm"
                                onClick={() =>
                                  handleUpdateStatus(schedule.id, "completed")
                                }
                                className="bg-green-500 text-white hover:bg-green-600"
                              >
                                <CheckCircle2 className="w-3 h-3 mr-1" />
                                Complete
                              </Button>
                            )}
                            <Button
                              variant="ghost"
                              size="icon"
                              onClick={() => handleDeleteSchedule(schedule.id)}
                              className="text-red-500 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  );
                })}
              </div>
            )}
          </TabsContent>

          {/* Today's Agenda */}
          <TabsContent value="agenda" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Today's Schedule */}
              <div className="lg:col-span-2">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Calendar className="w-5 h-5 mr-2 text-kiit-600" />
                      Today's Schedule -{" "}
                      {new Date().toLocaleDateString("en-US", {
                        weekday: "long",
                        month: "long",
                        day: "numeric",
                      })}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {todaySchedules.length === 0 ? (
                      <div className="text-center py-8">
                        <Calendar className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                        <p className="text-gray-500">No schedules for today</p>
                        <Button
                          onClick={() => setShowAddForm(true)}
                          className="mt-3 bg-kiit-gradient text-white"
                        >
                          Add Today's Schedule
                        </Button>
                      </div>
                    ) : (
                      <div className="space-y-4">
                        {todaySchedules
                          .sort((a, b) => a.time.localeCompare(b.time))
                          .map((schedule) => {
                            const TypeIcon = getTypeIcon(schedule.type);
                            const scheduleTime = new Date(
                              `${schedule.date} ${schedule.time}`,
                            );
                            const now = new Date();
                            const isUpcoming = scheduleTime > now;
                            const isInProgress =
                              scheduleTime <= now &&
                              now <=
                                new Date(
                                  `${schedule.date} ${schedule.endTime}`,
                                ) &&
                              schedule.status === "in-progress";

                            return (
                              <div
                                key={schedule.id}
                                className={`p-4 rounded-lg border-l-4 ${
                                  isInProgress
                                    ? "bg-blue-50 border-blue-500 dark:bg-blue-900/20"
                                    : isUpcoming
                                      ? "bg-gray-50 border-gray-300 dark:bg-gray-800"
                                      : "bg-gray-100 border-gray-400 dark:bg-gray-700"
                                }`}
                              >
                                <div className="flex items-center space-x-4">
                                  <div
                                    className={`w-10 h-10 ${getTypeColor(schedule.type)} rounded-lg flex items-center justify-center`}
                                  >
                                    <TypeIcon className="w-5 h-5 text-white" />
                                  </div>
                                  <div className="flex-1">
                                    <div className="flex items-center space-x-2">
                                      <h4 className="font-semibold">
                                        {schedule.title}
                                      </h4>
                                      {isInProgress && (
                                        <Badge className="bg-blue-500 text-white animate-pulse">
                                          In Progress
                                        </Badge>
                                      )}
                                    </div>
                                    <p className="text-sm text-gray-600">
                                      {schedule.subject}
                                    </p>
                                    <div className="flex items-center space-x-3 mt-1 text-sm text-gray-500">
                                      <span>
                                        {schedule.time} - {schedule.endTime}
                                      </span>
                                      {schedule.location && (
                                        <>
                                          <span>•</span>
                                          <span>{schedule.location}</span>
                                        </>
                                      )}
                                    </div>
                                  </div>
                                  <div className="text-right">
                                    <Badge
                                      className={getStatusColor(
                                        schedule.status,
                                      )}
                                    >
                                      {schedule.status}
                                    </Badge>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>

              {/* Quick Actions & Stats */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <Card>
                  <CardHeader>
                    <CardTitle>Quick Actions</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <Button className="w-full justify-start" size="sm">
                      <Plus className="w-4 h-4 mr-2" />
                      Quick Add Study Session
                    </Button>
                    <Button
                      className="w-full justify-start"
                      size="sm"
                      variant="outline"
                    >
                      <Bell className="w-4 h-4 mr-2" />
                      Set Reminder
                    </Button>
                    <Button
                      className="w-full justify-start"
                      size="sm"
                      variant="outline"
                    >
                      <Share2 className="w-4 h-4 mr-2" />
                      Share Schedule
                    </Button>
                    <Button
                      className="w-full justify-start"
                      size="sm"
                      variant="outline"
                    >
                      <Download className="w-4 h-4 mr-2" />
                      Export Calendar
                    </Button>
                  </CardContent>
                </Card>

                {/* Upcoming Events */}
                <Card>
                  <CardHeader>
                    <CardTitle>Next 3 Events</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      {upcomingSchedules.slice(0, 3).map((schedule) => (
                        <div
                          key={schedule.id}
                          className="flex items-center space-x-3"
                        >
                          <div
                            className={`w-8 h-8 ${getTypeColor(schedule.type)} rounded-lg flex items-center justify-center`}
                          >
                            <Clock className="w-4 h-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="font-medium text-sm">
                              {schedule.title}
                            </p>
                            <p className="text-xs text-gray-500">
                              {new Date(schedule.date).toLocaleDateString()} at{" "}
                              {schedule.time}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}

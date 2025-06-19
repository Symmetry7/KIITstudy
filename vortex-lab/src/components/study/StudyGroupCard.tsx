import { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import {
  Clock,
  Users,
  Play,
  Pause,
  Square,
  Trophy,
  Target,
  MessageCircle,
  Settings,
  Zap,
  Timer,
  BookOpen,
} from "lucide-react";

interface StudyGroupProps {
  group: {
    id: number | string;
    name: string;
    subject: string;
    description: string;
    participants: Array<{
      id: number | string;
      name: string;
      avatar: string;
      status: "active" | "inactive" | "break";
      studyTime: number;
      rank: number;
    }>;
    timer: {
      duration: number; // in minutes
      remaining: number;
      isActive: boolean;
      type: "pomodoro" | "deep-focus" | "sprint";
    };
    settings: {
      subject: string;
      difficulty: "beginner" | "intermediate" | "advanced";
      autoBreaks: boolean;
      competitionMode: boolean;
    };
  };
  onJoin?: () => void;
  onLeave?: () => void;
}

export function StudyGroupCard({ group, onJoin, onLeave }: StudyGroupProps) {
  const [timeRemaining, setTimeRemaining] = useState(group.timer.remaining);
  const [isActive, setIsActive] = useState(group.timer.isActive);

  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive && timeRemaining > 0) {
      interval = setInterval(() => {
        setTimeRemaining((prev) => {
          if (prev <= 1) {
            setIsActive(false);
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, timeRemaining]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  const progressPercentage =
    ((group.timer.duration * 60 - timeRemaining) /
      (group.timer.duration * 60)) *
    100;

  const activeParticipants = group.participants.filter(
    (p) => p.status === "active",
  );
  const sortedParticipants = [...group.participants].sort(
    (a, b) => b.studyTime - a.studyTime,
  );

  const timerTypeColors = {
    pomodoro: "bg-red-500",
    "deep-focus": "bg-blue-500",
    sprint: "bg-green-500",
  };

  const handleJoinClick = () => {
    if (onJoin) {
      onJoin();
    } else {
      // Default behavior: show success message
      alert(`Successfully joined ${group.name}! 🎉`);
    }
  };

  return (
    <Card className="overflow-hidden shadow-lg border-0 bg-white dark:bg-gray-900">
      <CardHeader className="pb-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div
              className={`w-12 h-12 ${timerTypeColors[group.timer.type]} rounded-xl flex items-center justify-center`}
            >
              <BookOpen className="w-6 h-6 text-white" />
            </div>
            <div>
              <CardTitle className="text-lg">{group.name}</CardTitle>
              <p className="text-sm text-gray-600 dark:text-gray-400">
                {group.subject} • {group.settings.difficulty}
              </p>
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <Badge variant="outline" className="capitalize">
              {group.timer.type}
            </Badge>
            {group.settings.competitionMode && (
              <Badge className="bg-yellow-500 text-white">
                <Trophy className="w-3 h-3 mr-1" />
                Competition
              </Badge>
            )}
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Timer Section */}
        <div className="text-center space-y-4">
          <div className="relative">
            <div className="text-4xl font-bold text-kiit-600 dark:text-kiit-400">
              {formatTime(timeRemaining)}
            </div>
            <p className="text-sm text-gray-500">
              {group.timer.duration} min session
            </p>
          </div>

          <Progress value={progressPercentage} className="h-3" />

          <div className="flex items-center justify-center space-x-2">
            <Button
              onClick={() => setIsActive(!isActive)}
              className={`${isActive ? "bg-red-500 hover:bg-red-600" : "bg-green-500 hover:bg-green-600"}`}
            >
              {isActive ? (
                <Pause className="w-4 h-4 mr-2" />
              ) : (
                <Play className="w-4 h-4 mr-2" />
              )}
              {isActive ? "Pause" : "Start"}
            </Button>
            <Button
              variant="outline"
              onClick={() => setTimeRemaining(group.timer.duration * 60)}
            >
              <Square className="w-4 h-4 mr-2" />
              Reset
            </Button>
          </div>
        </div>

        {/* Active Participants */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <h4 className="font-semibold flex items-center">
              <Users className="w-4 h-4 mr-2" />
              Active Participants ({activeParticipants.length})
            </h4>
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600">Live</span>
            </div>
          </div>

          <div className="space-y-2 max-h-48 overflow-y-auto">
            {sortedParticipants.slice(0, 8).map((participant, index) => (
              <div
                key={participant.id}
                className={`flex items-center justify-between p-2 rounded-lg transition-colors ${
                  participant.status === "active"
                    ? "bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800"
                    : participant.status === "break"
                      ? "bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800"
                      : "bg-gray-50 dark:bg-gray-800 opacity-50"
                }`}
              >
                <div className="flex items-center space-x-2">
                  <div className="relative">
                    <Avatar className="w-8 h-8">
                      <AvatarImage src={participant.avatar} />
                      <AvatarFallback className="text-xs">
                        {participant.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div
                      className={`absolute -bottom-1 -right-1 w-3 h-3 rounded-full border-2 border-white ${
                        participant.status === "active"
                          ? "bg-green-500"
                          : participant.status === "break"
                            ? "bg-yellow-500"
                            : "bg-gray-400"
                      }`}
                    />
                  </div>
                  <div>
                    <p className="text-sm font-medium">{participant.name}</p>
                    <p className="text-xs text-gray-500">
                      {Math.floor(participant.studyTime / 60)}h{" "}
                      {participant.studyTime % 60}m
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2">
                  {group.settings.competitionMode && (
                    <Badge
                      variant="secondary"
                      className={`text-xs ${
                        index === 0
                          ? "bg-yellow-100 text-yellow-800"
                          : index === 1
                            ? "bg-gray-100 text-gray-800"
                            : index === 2
                              ? "bg-orange-100 text-orange-800"
                              : "bg-blue-100 text-blue-800"
                      }`}
                    >
                      #{index + 1}
                    </Badge>
                  )}
                  <div className="flex items-center space-x-1">
                    <Zap
                      className={`w-3 h-3 ${participant.status === "active" ? "text-green-500" : "text-gray-400"}`}
                    />
                    <span className="text-xs text-gray-600">
                      {participant.studyTime}m
                    </span>
                  </div>
                </div>
              </div>
            ))}

            {group.participants.length > 8 && (
              <div className="text-center py-2">
                <Button variant="ghost" size="sm" className="text-xs">
                  +{group.participants.length - 8} more participants
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Competition Stats */}
        {group.settings.competitionMode && (
          <div className="border-t pt-4">
            <h4 className="font-semibold mb-3 flex items-center">
              <Trophy className="w-4 h-4 mr-2 text-yellow-500" />
              Competition Stats
            </h4>
            <div className="grid grid-cols-3 gap-4 text-center">
              <div>
                <div className="text-lg font-bold text-kiit-600">
                  {activeParticipants.length}
                </div>
                <div className="text-xs text-gray-500">Active</div>
              </div>
              <div>
                <div className="text-lg font-bold text-green-600">
                  {Math.max(...group.participants.map((p) => p.studyTime))}m
                </div>
                <div className="text-xs text-gray-500">Top Score</div>
              </div>
              <div>
                <div className="text-lg font-bold text-blue-600">
                  {Math.round(
                    group.participants.reduce(
                      (acc, p) => acc + p.studyTime,
                      0,
                    ) / group.participants.length,
                  )}
                  m
                </div>
                <div className="text-xs text-gray-500">Average</div>
              </div>
            </div>
          </div>
        )}

        {/* Action Buttons */}
        <div className="flex space-x-2 pt-4 border-t">
          <Button
            onClick={handleJoinClick}
            className="flex-1 bg-green-500 hover:bg-green-600"
          >
            <Target className="w-4 h-4 mr-2" />
            Join Now
          </Button>
          <Button variant="outline" size="icon">
            <MessageCircle className="w-4 h-4" />
          </Button>
          <Button variant="outline" size="icon">
            <Settings className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

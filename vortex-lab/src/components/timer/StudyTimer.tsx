import { useState, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import {
  Play,
  Pause,
  Square,
  RotateCcw,
  Clock,
  Infinity,
  Timer,
} from "lucide-react";

interface StudyTimerProps {
  onTimerUpdate?: (isActive: boolean, timeRemaining: number) => void;
}

export function StudyTimer({ onTimerUpdate }: StudyTimerProps) {
  const [selectedMode, setSelectedMode] = useState<"25" | "50" | "endless">(
    "25",
  );
  const [timeRemaining, setTimeRemaining] = useState(25 * 60); // 25 minutes in seconds
  const [isActive, setIsActive] = useState(false);
  const [sessions, setSessions] = useState(0);
  const [endlessTime, setEndlessTime] = useState(0); // For endless mode

  const modes = {
    "25": { duration: 25 * 60, label: "25 Min", color: "bg-blue-500" },
    "50": { duration: 50 * 60, label: "50 Min", color: "bg-green-500" },
    endless: { duration: 0, label: "Endless", color: "bg-purple-500" },
  };

  const formatTime = useCallback((seconds: number) => {
    const hours = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;

    if (hours > 0) {
      return `${hours}:${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
    }
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  }, []);

  // Timer effect
  useEffect(() => {
    let interval: NodeJS.Timeout;

    if (isActive) {
      interval = setInterval(() => {
        if (selectedMode === "endless") {
          setEndlessTime((prev) => prev + 1);
        } else {
          setTimeRemaining((prev) => {
            const newTime = prev - 1;
            if (newTime <= 0) {
              setIsActive(false);
              setSessions((prev) => prev + 1);
              // Timer completed notification
              if (Notification.permission === "granted") {
                new Notification("Study Session Complete!", {
                  body: `Your ${modes[selectedMode].label} session is finished. Great work!`,
                  icon: "/favicon.ico",
                });
              }
              return 0;
            }
            return newTime;
          });
        }
      }, 1000);
    }

    return () => clearInterval(interval);
  }, [isActive, selectedMode, modes]);

  // Notify parent component of timer updates
  useEffect(() => {
    if (onTimerUpdate) {
      onTimerUpdate(
        isActive,
        selectedMode === "endless" ? endlessTime : timeRemaining,
      );
    }
  }, [isActive, timeRemaining, endlessTime, selectedMode, onTimerUpdate]);

  const handleModeChange = (mode: "25" | "50" | "endless") => {
    setSelectedMode(mode);
    setIsActive(false);
    if (mode === "endless") {
      setEndlessTime(0);
    } else {
      setTimeRemaining(modes[mode].duration);
    }
  };

  const handleStart = () => {
    setIsActive(true);
    // Request notification permission
    if (Notification.permission === "default") {
      Notification.requestPermission();
    }
  };

  const handlePause = () => {
    setIsActive(false);
  };

  const handleStop = () => {
    setIsActive(false);
    if (selectedMode === "endless") {
      setEndlessTime(0);
    } else {
      setTimeRemaining(modes[selectedMode].duration);
    }
  };

  const handleReset = () => {
    setIsActive(false);
    setEndlessTime(0);
    setTimeRemaining(modes[selectedMode].duration);
    setSessions(0);
  };

  const currentMode = modes[selectedMode];
  const progressPercentage =
    selectedMode === "endless"
      ? 100
      : ((currentMode.duration - timeRemaining) / currentMode.duration) * 100;

  const displayTime = selectedMode === "endless" ? endlessTime : timeRemaining;

  return (
    <Card className="w-full max-w-lg mx-auto">
      <CardHeader className="text-center">
        <CardTitle className="text-2xl flex items-center justify-center">
          <Timer className="w-6 h-6 mr-2" />
          Study Timer
        </CardTitle>
      </CardHeader>

      <CardContent className="space-y-6">
        {/* Mode Selection */}
        <div className="grid grid-cols-3 gap-3">
          {Object.entries(modes).map(([key, mode]) => (
            <Button
              key={key}
              variant={selectedMode === key ? "default" : "outline"}
              className={`h-12 ${
                selectedMode === key
                  ? `${mode.color} text-white hover:opacity-90`
                  : ""
              }`}
              onClick={() => handleModeChange(key as "25" | "50" | "endless")}
              disabled={isActive}
            >
              {key === "endless" ? (
                <Infinity className="w-4 h-4 mr-2" />
              ) : (
                <Clock className="w-4 h-4 mr-2" />
              )}
              {mode.label}
            </Button>
          ))}
        </div>

        {/* Timer Display */}
        <div className="text-center space-y-4">
          <div className="relative">
            <div
              className={`text-6xl font-bold transition-colors ${
                selectedMode !== "endless" &&
                timeRemaining <= 60 &&
                timeRemaining > 0
                  ? "text-red-500 animate-pulse"
                  : "text-gray-900 dark:text-white"
              }`}
            >
              {formatTime(displayTime)}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              {selectedMode === "endless"
                ? "Endless session - stop when you want"
                : `${currentMode.duration / 60} minute session`}
            </p>
          </div>

          {/* Progress Bar (only for timed sessions) */}
          {selectedMode !== "endless" && (
            <Progress value={progressPercentage} className="h-3" />
          )}

          {/* Status Badge */}
          <Badge
            variant={isActive ? "default" : "secondary"}
            className={`${isActive ? currentMode.color + " text-white" : ""} text-lg py-1 px-4`}
          >
            {isActive
              ? "Studying"
              : selectedMode !== "endless" && timeRemaining === 0
                ? "Completed"
                : "Paused"}
          </Badge>
        </div>

        {/* Timer Controls */}
        <div className="flex justify-center space-x-3">
          {!isActive ? (
            <Button
              onClick={handleStart}
              disabled={selectedMode !== "endless" && timeRemaining === 0}
              className={`${currentMode.color} hover:opacity-90 text-white px-8 py-3 text-lg`}
              size="lg"
            >
              <Play className="w-5 h-5 mr-2" />
              Start
            </Button>
          ) : (
            <Button
              onClick={handlePause}
              variant="outline"
              size="lg"
              className="px-8 py-3 text-lg"
            >
              <Pause className="w-5 h-5 mr-2" />
              Pause
            </Button>
          )}

          <Button
            onClick={handleStop}
            variant="outline"
            size="lg"
            className="px-6 py-3"
            disabled={
              !isActive &&
              (selectedMode === "endless"
                ? endlessTime === 0
                : timeRemaining === currentMode.duration)
            }
          >
            <Square className="w-5 h-5 mr-2" />
            Stop
          </Button>

          <Button
            onClick={handleReset}
            variant="outline"
            size="lg"
            className="px-6 py-3"
            disabled={isActive}
          >
            <RotateCcw className="w-5 h-5 mr-2" />
            Reset
          </Button>
        </div>

        {/* Session Stats */}
        {sessions > 0 && (
          <div className="text-center space-y-2 pt-4 border-t">
            <div className="text-3xl font-bold text-kiit-600">{sessions}</div>
            <p className="text-sm text-gray-500">
              Session{sessions === 1 ? "" : "s"} completed today
            </p>
            <div className="text-sm text-gray-600">
              🔥 Keep up the great work!
            </div>
          </div>
        )}

        {/* Completion message */}
        {selectedMode !== "endless" && timeRemaining === 0 && (
          <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg border border-green-200 dark:border-green-800">
            <div className="text-4xl mb-2">🎉</div>
            <p className="text-green-700 dark:text-green-400 font-medium text-lg">
              Session Complete!
            </p>
            <p className="text-sm text-green-600 dark:text-green-500 mt-1">
              Great work! Take a break before your next session.
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

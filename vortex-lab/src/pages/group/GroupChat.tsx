import { useState, useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  ChatMessage,
  sendMessage,
  subscribeToGroupChat,
  getOnlineMembers,
  sendSystemMessage,
} from "@/lib/chatService";
import {
  MessageCircle,
  Send,
  ArrowLeft,
  Users,
  Settings,
  Paperclip,
  Smile,
  MoreVertical,
} from "lucide-react";

interface GroupChatProps {
  currentUser?: {
    uid: string;
    name: string;
    avatar: string;
  };
}

export default function GroupChat({ currentUser }: GroupChatProps) {
  const { groupId } = useParams();
  const navigate = useNavigate();
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [newMessage, setNewMessage] = useState("");
  const [onlineMembers, setOnlineMembers] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Mock group data (in real app, this would be fetched based on groupId)
  const groupInfo = {
    id: groupId,
    name: "DSA Marathon",
    subject: "Data Structures & Algorithms",
    memberCount: 12,
  };

  // Subscribe to chat messages
  useEffect(() => {
    if (!groupId) return;

    setIsLoading(true);
    const unsubscribe = subscribeToGroupChat(groupId, (chatMessages) => {
      setMessages(chatMessages);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, [groupId]);

  // Get online members count
  useEffect(() => {
    if (!groupId) return;

    setOnlineMembers(getOnlineMembers(groupId));

    // Update online count every 30 seconds for demo
    const interval = setInterval(() => {
      setOnlineMembers(getOnlineMembers(groupId));
    }, 30000);

    return () => clearInterval(interval);
  }, [groupId]);

  // Send system message when user joins
  useEffect(() => {
    if (!groupId || !currentUser) return;

    const sendJoinMessage = async () => {
      await sendSystemMessage(groupId, `${currentUser.name} joined the chat`);
    };

    sendJoinMessage();
  }, [groupId, currentUser]);

  // Auto scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSendMessage = async () => {
    if (!newMessage.trim() || !groupId || !currentUser) return;

    try {
      await sendMessage(groupId, newMessage, {
        uid: currentUser.uid,
        name: currentUser.name,
        avatar: currentUser.avatar,
      });
      setNewMessage("");
    } catch (error) {
      console.error("Error sending message:", error);
    }
  };

  const handleKeyPress = async (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      await handleSendMessage();
    }
  };

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  };

  const formatDate = (date: Date) => {
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);

    if (date.toDateString() === today.toDateString()) {
      return "Today";
    } else if (date.toDateString() === yesterday.toDateString()) {
      return "Yesterday";
    } else {
      return date.toLocaleDateString();
    }
  };

  return (
    <div className="h-full bg-white dark:bg-gray-900 flex flex-col">
      {/* Chat Header */}
      <div className="border-b dark:border-gray-800 p-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Button
              variant="ghost"
              size="icon"
              onClick={() => navigate(-1)}
              className="md:hidden"
            >
              <ArrowLeft className="w-5 h-5" />
            </Button>

            <div className="flex items-center space-x-3">
              <div className="w-12 h-12 bg-kiit-gradient rounded-xl flex items-center justify-center">
                <MessageCircle className="w-6 h-6 text-white" />
              </div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">
                  {groupInfo.name}
                </h1>
                <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
                  <Users className="w-4 h-4" />
                  <span>{groupInfo.memberCount} members</span>
                  <span>•</span>
                  <div className="flex items-center space-x-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>{onlineMembers} online</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="icon">
              <Settings className="w-5 h-5" />
            </Button>
            <Button variant="ghost" size="icon">
              <MoreVertical className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>

      {/* Messages Area */}
      <ScrollArea className="flex-1 p-4">
        <div className="space-y-4 max-w-4xl mx-auto">
          {isLoading ? (
            <div className="flex items-center justify-center py-8">
              <div className="text-center">
                <div className="w-8 h-8 border-2 border-kiit-500 border-t-transparent rounded-full animate-spin mx-auto mb-3"></div>
                <p className="text-gray-500 text-sm">Loading messages...</p>
              </div>
            </div>
          ) : (
            messages.map((message, index) => {
              const prevMessage = messages[index - 1];
              const showDate =
                !prevMessage ||
                formatDate(message.timestamp) !==
                  formatDate(prevMessage.timestamp);
              const showAvatar =
                !prevMessage ||
                prevMessage.userId !== message.userId ||
                message.timestamp.getTime() - prevMessage.timestamp.getTime() >
                  5 * 60 * 1000;

              return (
                <div key={message.id}>
                  {/* Date separator */}
                  {showDate && (
                    <div className="flex items-center justify-center my-6">
                      <div className="bg-gray-100 dark:bg-gray-800 rounded-full px-4 py-2">
                        <span className="text-sm font-medium text-gray-600 dark:text-gray-400">
                          {formatDate(message.timestamp)}
                        </span>
                      </div>
                    </div>
                  )}

                  {/* System messages */}
                  {message.type === "system" && (
                    <div className="flex justify-center my-2">
                      <Badge variant="secondary" className="text-xs">
                        {message.content}
                      </Badge>
                    </div>
                  )}

                  {/* Regular messages */}
                  {message.type === "text" && (
                    <div
                      className={`flex items-start space-x-3 ${
                        message.userId === currentUser?.uid
                          ? "flex-row-reverse space-x-reverse"
                          : ""
                      }`}
                    >
                      {/* Avatar */}
                      <div
                        className={`${showAvatar ? "opacity-100" : "opacity-0"} transition-opacity`}
                      >
                        <Avatar className="w-10 h-10">
                          <AvatarImage src={message.userAvatar} />
                          <AvatarFallback>
                            {message.userName
                              .split(" ")
                              .map((n) => n[0])
                              .join("")}
                          </AvatarFallback>
                        </Avatar>
                      </div>

                      {/* Message bubble */}
                      <div
                        className={`flex-1 max-w-md ${
                          message.userId === currentUser?.uid
                            ? "text-right"
                            : ""
                        }`}
                      >
                        {/* Username and time */}
                        {showAvatar && (
                          <div
                            className={`flex items-center space-x-2 mb-1 ${
                              message.userId === currentUser?.uid
                                ? "justify-end"
                                : ""
                            }`}
                          >
                            <span className="text-sm font-medium text-gray-900 dark:text-white">
                              {message.userName}
                            </span>
                            <span className="text-xs text-gray-500">
                              {formatTime(message.timestamp)}
                            </span>
                          </div>
                        )}

                        {/* Message content */}
                        <div
                          className={`rounded-2xl px-4 py-2 inline-block max-w-full ${
                            message.userId === currentUser?.uid
                              ? "bg-kiit-gradient text-white rounded-br-md"
                              : "bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-white rounded-bl-md"
                          }`}
                        >
                          <p className="text-sm whitespace-pre-wrap break-words">
                            {message.content}
                          </p>
                        </div>

                        {/* Time for grouped messages */}
                        {!showAvatar && (
                          <div
                            className={`text-xs text-gray-400 mt-1 ${
                              message.userId === currentUser?.uid
                                ? "text-right"
                                : ""
                            }`}
                          >
                            {formatTime(message.timestamp)}
                          </div>
                        )}
                      </div>
                    </div>
                  )}
                </div>
              );
            })
          )}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>

      {/* Message Input */}
      <div className="border-t dark:border-gray-800 p-4">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="text-gray-500">
              <Paperclip className="w-5 h-5" />
            </Button>

            <div className="flex-1 relative">
              <Input
                placeholder="Type a message..."
                value={newMessage}
                onChange={(e) => setNewMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                className="pr-12 py-3 rounded-full border-gray-300 dark:border-gray-600"
              />
              <Button
                variant="ghost"
                size="icon"
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500"
              >
                <Smile className="w-5 h-5" />
              </Button>
            </div>

            <Button
              onClick={handleSendMessage}
              disabled={!newMessage.trim()}
              className="bg-kiit-gradient text-white rounded-full p-3"
              size="icon"
            >
              <Send className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  MessageCircle,
  Send,
  Phone,
  Video,
  MoreVertical,
  Search,
  Users,
  Online,
  Smile,
  Paperclip,
  X,
} from "lucide-react";

interface Message {
  id: number;
  senderId: number;
  content: string;
  timestamp: string;
  type: "text" | "image" | "file";
  isRead: boolean;
}

interface ChatContact {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  isOnline: boolean;
  course: string;
}

interface GroupChat {
  id: number;
  name: string;
  avatar: string;
  lastMessage: string;
  lastMessageTime: string;
  unreadCount: number;
  memberCount: number;
  type: "study_group" | "class_group";
}

export function ChatSystem() {
  const [selectedContact, setSelectedContact] = useState<ChatContact | null>(
    null,
  );
  const [selectedGroup, setSelectedGroup] = useState<GroupChat | null>(null);
  const [messageInput, setMessageInput] = useState("");
  const [searchQuery, setSearchQuery] = useState("");
  const [activeTab, setActiveTab] = useState<"friends" | "groups">("friends");
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const [friendChats] = useState<ChatContact[]>([
    {
      id: 1,
      name: "Priya Sharma",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Hey! Want to study together for tomorrow's exam?",
      lastMessageTime: "2 min ago",
      unreadCount: 2,
      isOnline: true,
      course: "B.Tech CSE",
    },
    {
      id: 2,
      name: "Arjun Patel",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Thanks for the notes! Really helpful 📚",
      lastMessageTime: "1 hour ago",
      unreadCount: 0,
      isOnline: false,
      course: "B.Tech EE",
    },
    {
      id: 3,
      name: "Sneha Roy",
      avatar: "/api/placeholder/40/40",
      lastMessage: "See you in the study group session",
      lastMessageTime: "3 hours ago",
      unreadCount: 1,
      isOnline: true,
      course: "B.Tech IT",
    },
  ]);

  const [groupChats] = useState<GroupChat[]>([
    {
      id: 1,
      name: "DSA Marathon",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Rahul: Let's start with binary trees today",
      lastMessageTime: "5 min ago",
      unreadCount: 3,
      memberCount: 12,
      type: "study_group",
    },
    {
      id: 2,
      name: "CSE 3rd Year",
      avatar: "/api/placeholder/40/40",
      lastMessage: "Assignment deadline extended to Friday",
      lastMessageTime: "30 min ago",
      unreadCount: 8,
      memberCount: 45,
      type: "class_group",
    },
  ]);

  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      senderId: 1,
      content: "Hey! How's your preparation going?",
      timestamp: "10:30 AM",
      type: "text",
      isRead: true,
    },
    {
      id: 2,
      senderId: 0, // Current user
      content: "Going well! Just finished the data structures chapter.",
      timestamp: "10:32 AM",
      type: "text",
      isRead: true,
    },
    {
      id: 3,
      senderId: 1,
      content: "That's great! Want to study together for tomorrow's exam?",
      timestamp: "10:35 AM",
      type: "text",
      isRead: false,
    },
    {
      id: 4,
      senderId: 1,
      content: "I have some really good notes on algorithms",
      timestamp: "10:36 AM",
      type: "text",
      isRead: false,
    },
  ]);

  const sendMessage = () => {
    if (!messageInput.trim()) return;

    const newMessage: Message = {
      id: messages.length + 1,
      senderId: 0, // Current user
      content: messageInput,
      timestamp: new Date().toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
      }),
      type: "text",
      isRead: false,
    };

    setMessages((prev) => [...prev, newMessage]);
    setMessageInput("");
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage();
    }
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const filteredFriends = friendChats.filter((contact) =>
    contact.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  const filteredGroups = groupChats.filter((group) =>
    group.name.toLowerCase().includes(searchQuery.toLowerCase()),
  );

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="ghost" size="icon" className="relative">
          <MessageCircle className="w-5 h-5" />
          <Badge className="absolute -top-2 -right-2 w-5 h-5 p-0 text-xs bg-green-500 hover:bg-green-600">
            {friendChats.reduce((acc, chat) => acc + chat.unreadCount, 0) +
              groupChats.reduce((acc, chat) => acc + chat.unreadCount, 0)}
          </Badge>
        </Button>
      </DialogTrigger>
      <DialogContent className="max-w-5xl h-[80vh] p-0">
        <div className="flex h-full">
          {/* Sidebar */}
          <div className="w-80 border-r bg-gray-50 dark:bg-gray-900 flex flex-col">
            <DialogHeader className="p-4 border-b">
              <DialogTitle className="flex items-center space-x-2">
                <MessageCircle className="w-5 h-5" />
                <span>Messages</span>
              </DialogTitle>
            </DialogHeader>

            {/* Search */}
            <div className="p-4 border-b">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search conversations..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Tabs */}
            <div className="flex border-b">
              <button
                onClick={() => setActiveTab("friends")}
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  activeTab === "friends"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Friends
              </button>
              <button
                onClick={() => setActiveTab("groups")}
                className={`flex-1 px-4 py-2 text-sm font-medium ${
                  activeTab === "groups"
                    ? "border-b-2 border-blue-500 text-blue-600"
                    : "text-gray-600 hover:text-gray-900"
                }`}
              >
                Groups
              </button>
            </div>

            {/* Chat List */}
            <ScrollArea className="flex-1">
              <div className="p-2">
                {activeTab === "friends"
                  ? filteredFriends.map((contact) => (
                      <div
                        key={contact.id}
                        onClick={() => {
                          setSelectedContact(contact);
                          setSelectedGroup(null);
                        }}
                        className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 mb-1 ${
                          selectedContact?.id === contact.id
                            ? "bg-blue-50 dark:bg-blue-950/30"
                            : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={contact.avatar} />
                              <AvatarFallback>
                                {contact.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            {contact.isOnline && (
                              <div className="absolute bottom-0 right-0 w-3 h-3 bg-green-500 border-2 border-white rounded-full"></div>
                            )}
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium truncate">
                                {contact.name}
                              </p>
                              <span className="text-xs text-gray-500">
                                {contact.lastMessageTime}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {contact.lastMessage}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {contact.course}
                            </p>
                          </div>
                          {contact.unreadCount > 0 && (
                            <Badge className="w-5 h-5 p-0 text-xs bg-blue-500">
                              {contact.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))
                  : filteredGroups.map((group) => (
                      <div
                        key={group.id}
                        onClick={() => {
                          setSelectedGroup(group);
                          setSelectedContact(null);
                        }}
                        className={`p-3 rounded-lg cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-800 mb-1 ${
                          selectedGroup?.id === group.id
                            ? "bg-blue-50 dark:bg-blue-950/30"
                            : ""
                        }`}
                      >
                        <div className="flex items-center space-x-3">
                          <div className="relative">
                            <Avatar>
                              <AvatarImage src={group.avatar} />
                              <AvatarFallback>
                                {group.name
                                  .split(" ")
                                  .map((n) => n[0])
                                  .join("")}
                              </AvatarFallback>
                            </Avatar>
                            <div className="absolute bottom-0 right-0 w-3 h-3 bg-purple-500 border-2 border-white rounded-full flex items-center justify-center">
                              <Users className="w-2 h-2 text-white" />
                            </div>
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center justify-between">
                              <p className="text-sm font-medium truncate">
                                {group.name}
                              </p>
                              <span className="text-xs text-gray-500">
                                {group.lastMessageTime}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 truncate">
                              {group.lastMessage}
                            </p>
                            <p className="text-xs text-gray-500 mt-1">
                              {group.memberCount} members
                            </p>
                          </div>
                          {group.unreadCount > 0 && (
                            <Badge className="w-5 h-5 p-0 text-xs bg-purple-500">
                              {group.unreadCount}
                            </Badge>
                          )}
                        </div>
                      </div>
                    ))}
              </div>
            </ScrollArea>
          </div>

          {/* Chat Area */}
          <div className="flex-1 flex flex-col">
            {selectedContact || selectedGroup ? (
              <>
                {/* Chat Header */}
                <div className="p-4 border-b flex items-center justify-between">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarImage
                        src={selectedContact?.avatar || selectedGroup?.avatar}
                      />
                      <AvatarFallback>
                        {(selectedContact?.name || selectedGroup?.name)
                          ?.split(" ")
                          .map((n) => n[0])
                          .join("")}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <h3 className="font-medium">
                        {selectedContact?.name || selectedGroup?.name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {selectedContact
                          ? selectedContact.isOnline
                            ? "Online"
                            : "Offline"
                          : `${selectedGroup?.memberCount} members`}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-2">
                    {selectedContact && (
                      <>
                        <Button variant="ghost" size="icon">
                          <Phone className="w-4 h-4" />
                        </Button>
                        <Button variant="ghost" size="icon">
                          <Video className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    <Button variant="ghost" size="icon">
                      <MoreVertical className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Messages */}
                <ScrollArea className="flex-1 p-4">
                  <div className="space-y-4">
                    {messages.map((message) => (
                      <div
                        key={message.id}
                        className={`flex ${message.senderId === 0 ? "justify-end" : "justify-start"}`}
                      >
                        <div
                          className={`max-w-xs lg:max-w-md px-3 py-2 rounded-lg ${
                            message.senderId === 0
                              ? "bg-blue-500 text-white"
                              : "bg-gray-100 dark:bg-gray-800"
                          }`}
                        >
                          <p className="text-sm">{message.content}</p>
                          <p
                            className={`text-xs mt-1 ${
                              message.senderId === 0
                                ? "text-blue-100"
                                : "text-gray-500"
                            }`}
                          >
                            {message.timestamp}
                          </p>
                        </div>
                      </div>
                    ))}
                    <div ref={messagesEndRef} />
                  </div>
                </ScrollArea>

                {/* Message Input */}
                <div className="p-4 border-t">
                  <div className="flex items-center space-x-2">
                    <Button variant="ghost" size="icon">
                      <Paperclip className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="icon">
                      <Smile className="w-4 h-4" />
                    </Button>
                    <Input
                      placeholder="Type a message..."
                      value={messageInput}
                      onChange={(e) => setMessageInput(e.target.value)}
                      onKeyPress={handleKeyPress}
                      className="flex-1"
                    />
                    <Button
                      onClick={sendMessage}
                      disabled={!messageInput.trim()}
                    >
                      <Send className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </>
            ) : (
              <div className="flex-1 flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MessageCircle className="w-16 h-16 mx-auto mb-4 opacity-50" />
                  <h3 className="text-lg font-medium mb-2">
                    Select a conversation
                  </h3>
                  <p>Choose a friend or group to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}

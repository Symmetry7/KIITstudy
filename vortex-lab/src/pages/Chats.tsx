import { KIITUser } from "@/lib/auth";
import { MessageCircle, Users, Search, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface ChatsProps {
  currentUser: KIITUser | null;
}

export default function Chats({ currentUser }: ChatsProps) {
  return (
    <div className="h-full bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800">
      {/* Header */}
      <div className="bg-white dark:bg-gray-900 border-b dark:border-gray-800 p-6">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
                Messages & Chats
              </h1>
              <p className="text-gray-600 dark:text-gray-400 mt-1">
                All your conversations in one place
              </p>
            </div>
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input placeholder="Search chats..." className="pl-10 w-64" />
              </div>
              <Button className="bg-kiit-gradient text-white">
                <Plus className="w-4 h-4 mr-2" />
                New Chat
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-6xl mx-auto p-6">
        <div className="text-center py-12">
          <div className="w-20 h-20 bg-kiit-gradient rounded-2xl flex items-center justify-center mx-auto mb-4">
            <MessageCircle className="w-10 h-10 text-white" />
          </div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            Enhanced Chat System Coming Soon
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Real-time messaging with group chats, file sharing, and more
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <Card>
              <CardHeader className="text-center">
                <MessageCircle className="w-8 h-8 text-kiit-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Direct Messages</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  One-on-one conversations with fellow students
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <Users className="w-8 h-8 text-kiit-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Group Chats</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Study group discussions and collaboration
                </p>
              </CardContent>
            </Card>
            <Card>
              <CardHeader className="text-center">
                <Search className="w-8 h-8 text-kiit-500 mx-auto mb-2" />
                <CardTitle className="text-lg">Smart Search</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  Find messages, files, and shared resources
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}

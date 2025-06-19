import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Heart,
  Edit,
  Settings,
  MapPin,
  BookOpen,
  Calendar,
  Camera,
  ArrowLeft,
} from "lucide-react";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const navigate = useNavigate();

  const userProfile = {
    name: "Your Name",
    course: "B.Tech CSE",
    year: "3rd Year",
    age: 20,
    bio: "Tech enthusiast and photography lover. Always excited to meet new people and explore new ideas!",
    interests: ["Programming", "Photography", "Music", "Travel", "Books"],
    photos: ["/api/placeholder/400/500", "/api/placeholder/400/500"],
    location: "KIIT Campus",
    joinedDate: "September 2024",
  };

  const stats = [
    { label: "Connections", value: "47" },
    { label: "Events Joined", value: "12" },
    { label: "Profile Views", value: "89" },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
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
              <span className="text-xl font-bold gradient-text">Profile</span>
            </div>

            <div className="flex items-center space-x-2">
              <Button variant="outline" size="sm">
                <Edit className="w-4 h-4 mr-2" />
                Edit Profile
              </Button>
              <Button variant="ghost" size="icon">
                <Settings className="w-5 h-5" />
              </Button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Main Profile Card */}
          <div className="lg:col-span-2">
            <Card className="overflow-hidden shadow-xl">
              <div className="relative">
                {/* Cover Photo */}
                <div className="h-48 bg-kiit-gradient"></div>

                {/* Profile Photo */}
                <div className="absolute -bottom-16 left-8">
                  <div className="relative">
                    <Avatar className="w-32 h-32 border-4 border-white shadow-lg">
                      <AvatarImage src="/api/placeholder/128/128" />
                      <AvatarFallback className="text-2xl">YN</AvatarFallback>
                    </Avatar>
                    <Button
                      size="icon"
                      className="absolute bottom-2 right-2 w-8 h-8 bg-white text-gray-600 hover:bg-gray-50"
                    >
                      <Camera className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>

              <CardContent className="pt-20 p-8">
                <div className="mb-6">
                  <h1 className="text-3xl font-bold text-gray-900 mb-2">
                    {userProfile.name}, {userProfile.age}
                  </h1>
                  <div className="flex items-center space-x-4 text-gray-600">
                    <div className="flex items-center">
                      <BookOpen className="w-4 h-4 mr-2" />
                      {userProfile.course} • {userProfile.year}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="w-4 h-4 mr-2" />
                      {userProfile.location}
                    </div>
                  </div>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    About Me
                  </h3>
                  <p className="text-gray-700 leading-relaxed">
                    {userProfile.bio}
                  </p>
                </div>

                <div className="mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Interests
                  </h3>
                  <div className="flex flex-wrap gap-2">
                    {userProfile.interests.map((interest, index) => (
                      <Badge
                        key={index}
                        variant="secondary"
                        className="bg-kiit-100 text-kiit-700 hover:bg-kiit-200"
                      >
                        {interest}
                      </Badge>
                    ))}
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-3">
                    Photos
                  </h3>
                  <div className="grid grid-cols-3 gap-4">
                    {userProfile.photos.map((photo, index) => (
                      <div
                        key={index}
                        className="aspect-square bg-gray-200 rounded-lg overflow-hidden"
                      >
                        <img
                          src={photo}
                          alt={`Photo ${index + 1}`}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    ))}
                    <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center cursor-pointer hover:border-kiit-400 hover:bg-kiit-50 transition-colors">
                      <Camera className="w-8 h-8 text-gray-400" />
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Stats */}
            <Card>
              <CardHeader>
                <CardTitle>Profile Stats</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {stats.map((stat, index) => (
                    <div
                      key={index}
                      className="flex justify-between items-center"
                    >
                      <span className="text-gray-600">{stat.label}</span>
                      <span className="font-bold text-kiit-600">
                        {stat.value}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Member Since */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Calendar className="w-5 h-5 text-green-500" />
                  <span>Member Since</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">{userProfile.joinedDate}</p>
                <p className="text-sm text-gray-500 mt-2">
                  Thank you for being part of the KIITConnect community!
                </p>
              </CardContent>
            </Card>

            {/* Privacy Settings */}
            <Card>
              <CardHeader>
                <CardTitle>Privacy & Safety</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button variant="outline" className="w-full justify-start">
                  Privacy Settings
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Block List
                </Button>
                <Button variant="outline" className="w-full justify-start">
                  Report an Issue
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

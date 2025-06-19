import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Home, ArrowLeft, Heart } from "lucide-react";

const NotFound = () => {
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    // Only log error if it's not the intended 404 page route
    if (location.pathname !== "/404") {
      console.error(
        "404 Error: User attempted to access non-existent route:",
        location.pathname,
      );
    }
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-800 flex items-center justify-center p-4">
      <Card className="w-full max-w-md text-center">
        <CardContent className="pt-8 pb-8">
          <div className="w-16 h-16 bg-kiit-gradient rounded-2xl flex items-center justify-center mx-auto mb-6">
            <Heart className="w-8 h-8 text-white" />
          </div>

          <h1 className="text-6xl font-bold text-gray-900 dark:text-white mb-4">
            404
          </h1>

          <h2 className="text-2xl font-semibold text-gray-800 dark:text-gray-200 mb-3">
            Page Not Found
          </h2>

          <p className="text-gray-600 dark:text-gray-400 mb-8">
            The page you're looking for doesn't exist or has been moved.
          </p>

          <div className="space-y-3">
            <Button
              onClick={() => navigate("/")}
              className="w-full bg-kiit-gradient text-white"
            >
              <Home className="w-4 h-4 mr-2" />
              Go to Homepage
            </Button>

            <Button
              onClick={() => navigate(-1)}
              variant="outline"
              className="w-full"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Go Back
            </Button>
          </div>

          <div className="mt-6 pt-6 border-t">
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Lost? Try visiting your{" "}
              <button
                onClick={() => navigate("/feed")}
                className="text-kiit-600 hover:text-kiit-700 underline"
              >
                feed
              </button>{" "}
              or{" "}
              <button
                onClick={() => navigate("/my-groups")}
                className="text-kiit-600 hover:text-kiit-700 underline"
              >
                study groups
              </button>
              .
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default NotFound;

import { ReactNode } from "react";
import { Navigation } from "./Navigation";

interface MainLayoutProps {
  children: ReactNode;
  currentUser: {
    name: string;
    email: string;
    course: string;
    avatar?: string;
  } | null;
}

export function MainLayout({ children, currentUser }: MainLayoutProps) {
  return (
    <div className="flex h-screen bg-gray-50 dark:bg-gray-900">
      {/* Sidebar Navigation */}
      <div className="w-80 flex-shrink-0">
        <Navigation currentUser={currentUser} />
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden">
        <main className="h-full overflow-y-auto">{children}</main>
      </div>
    </div>
  );
}

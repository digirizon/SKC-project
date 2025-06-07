import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown, Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar";

// Import dropdown components - Fixed import paths
import ChatsDropdown from "@/components/ui/dropdown-chats"; 
import NotificationsDropdown from "@/components/ui/dropdown-notifications";
import ProfileDropdown from "@/components/ui/dropdown-profile";
import LogoDropdown from "./LogoDropdown";

import AuthModal from "@/components/auth/AuthModal"; 
import authService from "@/services/auth"; 
import { useAuth } from "@/contexts/AuthContext";
import { useRouter } from "next/router";

interface HeaderProps {
  onLogout?: () => void; 
  showCommunityHeader?: boolean;
  communityName?: string;
  communityIcon?: string | React.ReactNode;
  communityImage?: string; 
}

export default function Header({ 
  onLogout,
  showCommunityHeader = false, 
  communityName, 
  communityIcon,
  communityImage 
}: HeaderProps) {
  const { isLoggedIn, setIsLoggedIn, setUserEmail, userEmail } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const router = useRouter();

  const handleAuthClick = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    setAuthModalOpen(false);
  };

  const handleInternalLogout = async () => {
    await authService.signOut();
    setIsLoggedIn(false);
    setUserEmail("");
    if (onLogout) {
      onLogout();
    }
    router.push("/"); 
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Left side - Logo and Community Header */}
            <div className="flex items-center space-x-4">
              {showCommunityHeader && isLoggedIn ? (
                // Community header with logo, search, and community info
                <>
                  {communityImage ? (
                    <Avatar className="w-8 h-8 rounded-md">
                      <AvatarImage src={communityImage} alt={communityName || "Community"} />
                      <AvatarFallback>{communityName?.charAt(0) || "C"}</AvatarFallback>
                    </Avatar>
                  ) : communityIcon && typeof communityIcon === "string" ? (
                    <span className="text-2xl">{communityIcon}</span>
                  ) : (
                    communityIcon 
                  )}
                  <span className="font-semibold text-gray-800">{communityName}</span>
                  <ChevronDown className="w-4 h-4 text-gray-500" />
                  
                  {/* Search bar for community pages */}
                  <div className="relative ml-8">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                    <Input
                      type="text"
                      placeholder="Search"
                      className="pl-10 w-80 bg-gray-100 border-0 focus-visible:ring-1 focus-visible:ring-gray-300"
                    />
                  </div>
                </>
              ) : (
                // Regular header with 3rdHub logo
                <div className="flex items-center space-x-2">
                  <Link href="/" className="flex items-center space-x-2">
                    <div className="text-2xl font-bold">
                      <span className="text-blue-500">3rd</span>
                      <span className="text-orange-500">H</span>
                      <span className="text-green-500">u</span>
                      <span className="text-purple-500">b</span>
                    </div>
                  </Link>
                  {!isLoggedIn && <LogoDropdown onTriggerAuthModal={handleAuthClick} />}
                </div>
              )}
            </div>

            {/* Right side content */}
            <div className="flex items-center space-x-4">
              {isLoggedIn ? (
                <>
                  <ChatsDropdown />
                  <NotificationsDropdown />
                  <ProfileDropdown onLogout={handleInternalLogout} userEmail={userEmail} />
                </>
              ) : (
                <Button
                  variant="ghost"
                  className="text-gray-700 hover:text-gray-900 cursor-pointer"
                  onClick={() => handleAuthClick("login")}
                  type="button"
                >
                  LOG IN
                </Button>
              )}
            </div>
          </div>
        </div>

        {/* Community Navigation Menu - Only show when logged in and viewing a community */}
        {isLoggedIn && showCommunityHeader && (
          <div className="bg-white border-b border-gray-200">
            <div className="max-w-7xl mx-auto px-4">
              <nav className="flex space-x-8">
                <Link href="#" className="border-b-2 border-black py-4 px-1 text-sm font-medium text-gray-900">
                  Community
                </Link>
                <Link href="#" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                  Classroom
                </Link>
                <Link href="#" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                  Calendar
                </Link>
                <Link href="#" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                  Members
                </Link>
                <Link href="#" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                  Map
                </Link>
                <Link href="#" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                  Leaderboards
                </Link>
                <Link href="#" className="border-b-2 border-transparent py-4 px-1 text-sm font-medium text-gray-500 hover:text-gray-700 hover:border-gray-300">
                  About
                </Link>
              </nav>
            </div>
          </div>
        )}
      </header>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
        onSuccess={handleAuthSuccess}
      />
    </>
  );
}

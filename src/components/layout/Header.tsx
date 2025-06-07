import React, { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react"; // Keep Search, Input if used by LogoDropdown or other parts
import { Button } from "@/components/ui/button";
// import { Input } from "@/components/ui/input"; // Removed if not directly used
// import { Search } from "lucide-react"; // Removed if not directly used
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"; // Added Avatar imports

// Assuming these are the correct paths for your custom dropdown components
import ChatsDropdown from "@/components/ui/dropdown-chats"; 
import NotificationsDropdown from "@/components/ui/dropdown-notifications";
import ProfileDropdown from "@/components/ui/dropdown-profile";
// import LogoDropdown from "./LogoDropdown"; // Keep if LogoDropdown is used when not logged in

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
  onLogout, // This prop is passed to ProfileDropdown
  showCommunityHeader = false, 
  communityName, 
  communityIcon,
  communityImage 
}: HeaderProps) {
  const { isLoggedIn, setIsLoggedIn, setUserEmail, userEmail } = useAuth(); // Removed unused 'user'
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");
  const router = useRouter();

  const handleAuthClick = (mode: "login" | "signup") => { // Added mode parameter
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    setAuthModalOpen(false);
    // Potentially call user.reload() or re-fetch user data if needed
  };

  const handleInternalLogout = async () => { // Renamed to avoid conflict if onLogout is also named handleLogout
    await authService.signOut();
    setIsLoggedIn(false);
    setUserEmail("");
    if (onLogout) {
      onLogout(); // Call the passed onLogout prop
    }
    router.push("/"); 
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {/* Community Header Content */}
              {showCommunityHeader && isLoggedIn && (
                <div className="flex items-center space-x-3">
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
                </div>
              )}

              {/* Spacer to push right content */}
              <div className="flex-grow"></div>

              {/* Right side content */}
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
                  onClick={() => handleAuthClick("login")} // Corrected: Call handleAuthClick
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

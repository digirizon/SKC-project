import React, { useState } from "react";
import Link from "next/link";
import { Search } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import NotificationsDropdown from "@/components/ui/dropdown-notifications";
import ChatsDropdown from "@/components/ui/dropdown-chats";
import ProfileDropdown from "@/components/ui/dropdown-profile";
import AuthModal from "@/components/auth/AuthModal";
import LogoDropdown from "@/components/layout/LogoDropdown";
import { useAuth } from "@/contexts/AuthContext";

interface HeaderProps {
  onLogout?: () => void;
  showCommunityHeader?: boolean;
  communityName?: string;
  communityIcon?: string;
}

export default function Header({ onLogout, showCommunityHeader = false, communityName, communityIcon }: HeaderProps) {
  const { isLoggedIn, setIsLoggedIn, userEmail, setUserEmail } = useAuth();
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const handleAuthClick = (mode: "login" | "signup") => {
    setAuthMode(mode);
    setAuthModalOpen(true);
  };

  const handleAuthSuccess = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    setAuthModalOpen(false);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    if (onLogout) onLogout();
  };

  return (
    <>
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              {showCommunityHeader && communityName ? (
                <>
                  <div className="w-8 h-8 bg-yellow-400 rounded-full flex items-center justify-center">
                    {communityIcon || "🤖"}
                  </div>
                  <div>
                    <h1 className="font-semibold text-gray-900">{communityName}</h1>
                  </div>
                </>
              ) : (
                <>
                  <Link href="/" className="flex items-center">
                    <div className="text-2xl font-bold">
                      <span className="text-blue-600">3rd</span>
                      <span className="text-orange-500">Hub</span>
                    </div>
                  </Link>
                  {!isLoggedIn && <LogoDropdown onTriggerAuthModal={handleAuthClick} />}
                </>
              )}
            </div>

            <div className="flex items-center space-x-4">
              {isLoggedIn && showCommunityHeader && (
                <div className="relative max-w-md">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search"
                    className="pl-10 pr-4 py-2 bg-gray-100 border-0 rounded-lg"
                  />
                </div>
              )}

              {isLoggedIn ? (
                <>
                  <ChatsDropdown />
                  <NotificationsDropdown />
                  <ProfileDropdown onLogout={handleLogout} userEmail={userEmail} />
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

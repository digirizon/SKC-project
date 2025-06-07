import React, { useState, useContext } from "react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import NotificationsDropdown from "@/components/ui/dropdown-notifications";
import ChatsDropdown from "@/components/ui/dropdown-chats";
import ProfileDropdown from "@/components/ui/dropdown-profile";
import AuthModal from "@/components/auth/AuthModal";
import LogoDropdown from "@/components/layout/LogoDropdown";
import { AuthContext } from "@/pages/index";

interface HeaderProps {
  onLogout?: () => void;
}

export default function Header({ onLogout }: HeaderProps) {
  const { isLoggedIn, setIsLoggedIn, userEmail, setUserEmail } = useContext(AuthContext);
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
            <div className="flex items-center">
              <Link href="/" className="flex items-center">
                <div className="text-2xl font-bold">
                  <span className="text-blue-600">3rd</span>
                  <span className="text-orange-500">Hub</span>
                </div>
              </Link>
              {!isLoggedIn && <LogoDropdown onTriggerAuthModal={handleAuthClick} />}
            </div>

            {isLoggedIn && (
              <nav className="hidden md:flex items-center space-x-8">
                <Link href="/" className="text-gray-700 hover:text-gray-900">
                  Communities
                </Link>
                <Link href="/affiliates" className="text-gray-700 hover:text-gray-900">
                  Affiliates
                </Link>
                <Link href="/support" className="text-gray-700 hover:text-gray-900">
                  Support
                </Link>
                <Link href="/careers" className="text-gray-700 hover:text-gray-900">
                  Careers
                </Link>
              </nav>
            )}

            <div className="flex items-center space-x-4">
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

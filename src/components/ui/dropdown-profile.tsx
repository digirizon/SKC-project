import React from "react";
import { useRouter } from "next/router";
import { User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";

interface ProfileDropdownProps {
  onLogout: () => void;
  userEmail: string;
}

const getInitials = (email: string): string => {
  if (!email) return "U";
  const emailPrefix = email.split("@")[0];
  if (!emailPrefix) return "U";

  const nameParts = emailPrefix.split(/[._-]/);
  
  if (nameParts.length > 1 && nameParts[0] && nameParts[1]) {
    return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
  } else if (nameParts.length === 1 && nameParts[0].length >= 2) {
    return nameParts[0].substring(0, 2).toUpperCase();
  } else if (nameParts.length === 1 && nameParts[0].length === 1) {
    return nameParts[0][0].toUpperCase();
  }
  return emailPrefix.substring(0, 1).toUpperCase() || "U";
};

export default function ProfileDropdown({ onLogout, userEmail }: ProfileDropdownProps) {
  const router = useRouter();
  const userInitials = getInitials(userEmail);

  const handleLogout = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    onLogout();
    router.push("/");
  };

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center cursor-pointer">
          <User className="w-5 h-5 md:hidden" />
          <div className="hidden md:flex items-center justify-center w-8 h-8 rounded-full bg-gray-200 text-gray-700 font-semibold text-sm">
            {userInitials}
          </div>
          <span className="ml-2 md:hidden">{userInitials}</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-0" align="end">
        <div className="bg-white rounded-lg shadow-lg border">
          <div className="p-4 border-b">
            <p className="text-base font-semibold text-gray-900 truncate">{userEmail || "User Profile"}</p>
          </div>

          <div className="py-2">
            <DropdownMenuItem
              className="px-4 py-3 text-base font-medium text-gray-800 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleNavigation("/profile")}
            >
              Profile
            </DropdownMenuItem>
            
            <DropdownMenuItem className="px-4 py-3 text-base font-medium text-gray-800 hover:bg-gray-50 cursor-pointer">
              Settings
            </DropdownMenuItem>
            
            <DropdownMenuItem className="px-4 py-3 text-base font-medium text-gray-800 hover:bg-gray-50 cursor-pointer">
              Affiliates
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator />

          <div className="py-2">
            <DropdownMenuItem className="px-4 py-3 text-base text-gray-600 hover:bg-gray-50 cursor-pointer">
              Help center
            </DropdownMenuItem>
            
            <DropdownMenuItem className="px-4 py-3 text-base text-gray-600 hover:bg-gray-50 cursor-pointer">
              Create a community
            </DropdownMenuItem>
            
            <DropdownMenuItem
              className="px-4 py-3 text-base text-gray-600 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleNavigation("/")}
            >
              Discover communities
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator />

          <div className="py-2">
            <DropdownMenuItem
              className="px-4 py-3 text-base text-red-600 hover:bg-red-50 cursor-pointer flex items-center"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

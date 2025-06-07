import React from "react";
// Removed: import Link from "next/link";
import { useRouter } from "next/router";
import { User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

interface ProfileDropdownProps {
  onLogout: () => void
  userEmail: string
}

export default function ProfileDropdown({ onLogout, userEmail }: ProfileDropdownProps) {
  const router = useRouter()

  const handleLogout = () => {
    onLogout()
    router.push("/")
  }

  const handleNavigation = (path: string) => {
    router.push(path)
  }

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="flex items-center">
          <User className="w-5 h-5" />
          <span className="ml-2">PE</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-0" align="end">
        <div className="bg-white rounded-lg shadow-lg border">
          <div className="p-4 border-b">
            <p className="text-lg font-semibold text-gray-900">{userEmail || "digirizon@gmail.com"}</p>
          </div>

          <div className="py-2">
            <DropdownMenuItem 
              className="px-4 py-3 text-lg font-semibold text-gray-900 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleNavigation("/profile")}
            >
              Profile
            </DropdownMenuItem>
            
            <DropdownMenuItem className="px-4 py-3 text-lg font-semibold text-gray-900 hover:bg-gray-50 cursor-pointer">
              Settings
            </DropdownMenuItem>
            
            <DropdownMenuItem className="px-4 py-3 text-lg font-semibold text-gray-900 hover:bg-gray-50 cursor-pointer">
              Affiliates
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator />

          <div className="py-2">
            <DropdownMenuItem className="px-4 py-3 text-lg text-gray-500 hover:bg-gray-50 cursor-pointer">
              Help center
            </DropdownMenuItem>
            
            <DropdownMenuItem className="px-4 py-3 text-lg text-gray-500 hover:bg-gray-50 cursor-pointer">
              Create a community
            </DropdownMenuItem>
            
            <DropdownMenuItem 
              className="px-4 py-3 text-lg text-gray-500 hover:bg-gray-50 cursor-pointer"
              onClick={() => handleNavigation("/")}
            >
              Discover communities
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator />

          <div className="py-2">
            <DropdownMenuItem 
              className="px-4 py-3 text-lg text-gray-500 hover:bg-gray-50 cursor-pointer"
              onClick={handleLogout}
            >
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

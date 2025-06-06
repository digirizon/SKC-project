
import React from "react"
import Link from "next/link"
import { User, LogOut } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
  DropdownMenuItem,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu"

export default function ProfileDropdown() {
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
          {/* User Email */}
          <div className="p-4 border-b">
            <p className="text-lg font-semibold text-gray-900">digirizon@gmail.com</p>
          </div>

          {/* Menu Items */}
          <div className="py-2">
            <Link href="/profile">
              <DropdownMenuItem className="px-4 py-3 text-lg font-semibold text-gray-900 hover:bg-gray-50 cursor-pointer">
                Profile
              </DropdownMenuItem>
            </Link>
            
            <DropdownMenuItem className="px-4 py-3 text-lg font-semibold text-gray-900 hover:bg-gray-50 cursor-pointer">
              Settings
            </DropdownMenuItem>
            
            <DropdownMenuItem className="px-4 py-3 text-lg font-semibold text-gray-900 hover:bg-gray-50 cursor-pointer">
              Affiliates
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator />

          {/* Secondary Menu Items */}
          <div className="py-2">
            <DropdownMenuItem className="px-4 py-3 text-lg text-gray-500 hover:bg-gray-50 cursor-pointer">
              Help center
            </DropdownMenuItem>
            
            <DropdownMenuItem className="px-4 py-3 text-lg text-gray-500 hover:bg-gray-50 cursor-pointer">
              Create a community
            </DropdownMenuItem>
            
            <DropdownMenuItem className="px-4 py-3 text-lg text-gray-500 hover:bg-gray-50 cursor-pointer">
              Discover communities
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator />

          {/* Logout */}
          <div className="py-2">
            <DropdownMenuItem className="px-4 py-3 text-lg text-gray-500 hover:bg-gray-50 cursor-pointer">
              <LogOut className="w-4 h-4 mr-2" />
              Log out
            </DropdownMenuItem>
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

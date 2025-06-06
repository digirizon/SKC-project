import React, { useState } from "react"
import Link from "next/link"
import { ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import NotificationsDropdown from "@/components/ui/dropdown-notifications"
import ChatsDropdown from "@/components/ui/dropdown-chats"
import ProfileDropdown from "@/components/ui/dropdown-profile"

export default function Header() {
  const [isLoggedIn] = useState(true) // Set to true for testing profile link and dropdowns

  return (
    <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link href="/" className="flex items-center">
            <div className="text-2xl font-bold">
              <span className="text-blue-600">3rd</span>
              <span className="text-orange-500">Hub</span>
            </div>
            <ChevronDown className="ml-1 w-4 h-4 text-gray-400" />
          </Link>

          {/* Navigation */}
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

          {/* Right Side */}
          <div className="flex items-center space-x-4">
            {isLoggedIn ? (
              <>
                <ChatsDropdown />
                <NotificationsDropdown />
                <ProfileDropdown />
              </>
            ) : (
              <Link href="/auth/login">
                <Button variant="ghost" className="text-gray-700 hover:text-gray-900">
                  LOG IN
                </Button>
              </Link>
            )}
          </div>
        </div>
      </div>
    </header>
  )
}

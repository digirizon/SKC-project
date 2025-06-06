
import React, { useState } from "react"
import { MessageCircle, Search, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const chats = [
  {
    id: 1,
    user: "Yash Chauhan",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=40&h=40&fit=crop&crop=face",
    badge: "🔥",
    time: "5d",
    message: "Hello there, Yash here! Just approved your membership. ...",
    isRead: false
  },
  {
    id: 2,
    user: "Nate Herkelman",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    time: "5d",
    message: "Hey A! Welcome to AI Automation Society! We're so glad ...",
    isRead: true
  }
]

export default function ChatsDropdown() {
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm">
          <MessageCircle className="w-5 h-5" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[480px] p-0" align="end">
        <div className="bg-white rounded-lg shadow-lg border">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">Chats</h3>
            <Button variant="outline" size="sm" className="bg-gray-100">
              All
              <ChevronDown className="w-4 h-4 ml-2" />
            </Button>
          </div>

          {/* Search */}
          <div className="p-4 border-b">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                type="text"
                placeholder="Search users"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 bg-gray-100 border-0"
              />
            </div>
          </div>

          {/* Chats List */}
          <div className="max-h-96 overflow-y-auto">
            {chats.map((chat) => (
              <div key={chat.id} className={`flex items-start gap-3 p-4 hover:bg-gray-50 border-b last:border-b-0 cursor-pointer ${chat.isRead ? 'opacity-60' : ''}`}>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={chat.avatar} />
                  <AvatarFallback>{chat.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{chat.user}</span>
                    {chat.badge && <span className="text-sm">{chat.badge}</span>}
                    <span className="text-sm text-gray-500">• {chat.time}</span>
                  </div>
                  <p className="text-sm text-gray-600 line-clamp-2">{chat.message}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

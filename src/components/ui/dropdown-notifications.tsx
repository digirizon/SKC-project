import React, { useState } from "react"
import { Bell, ChevronDown } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

const notifications = [
  {
    id: 1,
    user: "Jay E",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=faces",
    badge: "💎",
    action: "(following) new post",
    time: "5d",
    title: "Google's Veo3 is NOW in n8n, Here's How to Use It",
    isRead: false
  },
  {
    id: 2,
    user: "Nate Herk",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces",
    badge: "💎",
    action: "(following) new post",
    time: "5d",
    title: "TrueHorizon is Hiring a Technical Assistant",
    isRead: false
  },
  {
    id: 3,
    user: "Nate Herk",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    badge: "💎",
    action: "(following) new post",
    time: "5d",
    title: "New Video: n8n Just Got Way Easier (NEW Cloud C...",
    isRead: false
  },
  {
    id: 4,
    user: "AI Automation",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face",
    action: "membership approved",
    time: "5d",
    title: "A community for mastering AI-driven automation and ...",
    isRead: false
  },
  {
    id: 5,
    user: "AI Automation",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=40&h=40&fit=crop&crop=face",
    action: "membership approved",
    time: "1d",
    title: "Where Creators & Business Owners Automate like pros...",
    isRead: true
  },
  {
    id: 6,
    user: "Nate Herk",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    badge: "💎",
    action: "(following) new post",
    time: "3d",
    title: "New Video: This AI Agent Can Scrape and Screensh...",
    isRead: true
  },
  {
    id: 7,
    user: "Nate Herk",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=face",
    badge: "💎",
    action: "(admin) new post",
    time: "3d",
    title: "ANNOUNCING: 35% Off Sale on AI Automation Society...",
    isRead: true
  }
]

export default function NotificationsDropdown() {
  const [selectedGroup, setSelectedGroup] = useState("All groups")
  const unreadCount = notifications.filter(n => !n.isRead).length

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="sm" className="relative cursor-pointer">
          <Bell className="w-5 h-5" />
          {unreadCount > 0 && (
            <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {unreadCount}
            </span>
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-[480px] p-0" align="end">
        <div className="bg-white rounded-lg shadow-lg border">
          <div className="flex items-center justify-between p-4 border-b">
            <h3 className="text-lg font-semibold">Notifications</h3>
            <div className="flex items-center gap-3">
              <Button variant="link" className="text-blue-600 text-sm p-0">
                Mark all as read
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="outline" size="sm" className="bg-gray-100">
                    {selectedGroup}
                    <ChevronDown className="w-4 h-4 ml-2" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent className="w-48">
                  <div className="p-2">
                    <div className="py-2 px-3 hover:bg-gray-100 rounded cursor-pointer" onClick={() => setSelectedGroup("All groups")}>
                      All groups
                    </div>
                    <div className="py-2 px-3 hover:bg-gray-100 rounded cursor-pointer" onClick={() => setSelectedGroup("Just this group")}>
                      Just this group
                    </div>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div key={notification.id} className={`flex items-start gap-3 p-4 hover:bg-gray-50 border-b last:border-b-0 cursor-pointer ${notification.isRead ? 'opacity-60' : ''}`}>
                <Avatar className="w-10 h-10">
                  <AvatarImage src={notification.avatar} />
                  <AvatarFallback>{notification.user.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                </Avatar>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-sm">{notification.user}</span>
                    {notification.badge && <span className="text-sm">{notification.badge}</span>}
                    <span className="text-sm text-gray-600">{notification.action}</span>
                    <span className="text-sm text-gray-500">• {notification.time}</span>
                  </div>
                  <p className="text-sm text-gray-700 line-clamp-2">{notification.title}</p>
                </div>
                {!notification.isRead && (
                  <div className="w-2 h-2 bg-blue-500 rounded-full mt-2"></div>
                )}
              </div>
            ))}
          </div>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

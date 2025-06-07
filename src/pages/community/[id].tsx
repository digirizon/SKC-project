import React, { useState } from "react"
import Head from "next/head"
// import { useRouter } from "next/router" // Removed unused import
import { MessageSquare, Heart, MoreHorizontal, Pin } from "lucide-react" // Removed Bell, User, MessageCircle, Search as they are in Header or unused
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Header from "@/components/layout/Header" // Added shared Header
import Footer from "@/components/layout/Footer" // Added Footer for consistency
import { useAuth } from "@/contexts/AuthContext" // Added AuthContext

const communityData = {
  id: 1,
  name: "The RoboNuggets Network (free)",
  description: "Making AI connections easy 🤖",
  url: "3rdhub.com/robonuggets-free",
  members: "2k",
  online: "30",
  admin: "1",
  memberAvatars: [
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=32&h=32&fit=crop&crop=faces",
    "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=faces"
  ]
}

const posts = [
  {
    id: 1,
    author: "Jay E",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=faces",
    timestamp: "Dec 24",
    category: "Introduce Yourself",
    title: "Welcome to The RoboNuggets Network 🤖",
    content: "Hi there! Thank you for being here. We're very early in the journey so really appreciate the trust as we build up this network to become something that's really valuable for everyone in this group! Basically",
    likes: 82,
    comments: 83,
    isPinned: true,
    commentTime: "23h ago"
  },
  {
    id: 2,
    author: "Jay E",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=faces",
    timestamp: "Dec 24",
    category: "Nuggets & Tips",
    title: "Bonus lesson (n5) - The 1 Method you should know to win AI ...",
    content: "Hey everyone! 👋 Have a short but important bonus lesson for you all! Because in this video we go through a principle that's true not just for AI Automations, but when",
    likes: 9,
    comments: 8,
    isPinned: true,
    commentTime: "5h ago",
    hasImage: true
  },
  {
    id: 3,
    author: "Jay E",
    authorAvatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=faces",
    timestamp: "Dec 24",
    category: "Announcements",
    title: "The Ultimate Publishing Agent - 9 Socials in 1! (n8n no-code)...",
    content: "Hey team, got an exciting lesson for you this week! In this tutorial, you'll learn how to set up one of the best publishing agents available today - as it seamlessly integrates",
    likes: 15,
    comments: 10,
    isPinned: true,
    commentTime: "23h ago",
    hasImage: true
  },
  {
    id: 4,
    author: "Cheeto Burrito",
    authorAvatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=40&h=40&fit=crop&crop=faces",
    timestamp: "7d",
    category: "Introduce Yourself",
    title: "Can you make profit off AI without spending a penny?",
    content: "That's pretty much my goal is to try and make atleast one penny off of AI. Hope everyone who sees this has a great day.",
    likes: 6,
    comments: 12,
    commentTime: "5h ago"
  },
  {
    id: 5,
    author: "N M",
    authorAvatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=40&h=40&fit=crop&crop=faces",
    timestamp: "7d",
    category: "General discussion",
    title: "Expression Inside Message Model",
    content: "In the prompt to message ai model the part that is `{{$json.response.text}}` is red and in the result it is [undefined]",
    likes: 1,
    comments: 0
  }
]

const leaderboard = [
  { rank: 1, name: "Cheeto Burrito", points: "+7", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=faces" },
  { rank: 2, name: "Beno Curt", points: "+7", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=faces" },
  { rank: 3, name: "Andy C", points: "+6", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=faces" },
  { rank: 4, name: "Brian McCaffrey", points: "+5", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=faces" },
  { rank: 5, name: "Mirko Baschek", points: "+5", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces" }
]

export default function CommunityDetails() {
  // const router = useRouter() // Removed unused router variable
  const { setIsLoggedIn, setUserEmail } = useAuth(); // Get auth functions

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserEmail("");
    // router.push("/"); // Optionally redirect, Header already does this
  };

  return (
    <>
      <Head>
        <title>{communityData.name} - 3rdHub</title>
        <meta name="description" content={communityData.description} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        {/* Use Shared Header */}
        <Header 
          showCommunityHeader={true} 
          communityName={communityData.name} 
          communityIcon="🤖" // Example icon, can be dynamic
          onLogout={handleLogout} 
        />

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            {/* Main Content */}
            <div className="lg:col-span-3">
              {/* Post Creation */}
              <Card className="mb-6">
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                      <AvatarFallback>PE</AvatarFallback>
                    </Avatar>
                    <Input
                      placeholder="Write something"
                      className="flex-1 bg-gray-50 border-0"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Category Filters */}
              <div className="flex flex-wrap gap-2 mb-6">
                <Button variant="outline" size="sm" className="rounded-full text-gray-800 border-gray-300 hover:bg-gray-100 bg-white">
                  All
                </Button>
                <Button variant="outline" size="sm" className="rounded-full text-gray-800 border-gray-300 hover:bg-gray-100 bg-white">
                  🔥 General discussion
                </Button>
                <Button variant="outline" size="sm" className="rounded-full text-gray-800 border-gray-300 hover:bg-gray-100 bg-white">
                  📢 Announcements
                </Button>
                <Button variant="outline" size="sm" className="rounded-full text-gray-800 border-gray-300 hover:bg-gray-100 bg-white">
                  🎯 Nuggets & Tips
                </Button>
                <Button variant="outline" size="sm" className="rounded-full text-gray-800 border-gray-300 hover:bg-gray-100 bg-white">
                  👋 Introduce Yourself
                </Button>
                <Button variant="outline" size="sm" className="rounded-full text-gray-800 border-gray-300 hover:bg-gray-100 bg-white">
                  ⚙️
                </Button>
              </div>

              {/* Posts */}
              <div className="space-y-4">
                {posts.map((post) => (
                  <Card key={post.id} className="bg-white">
                    <CardContent className="p-6">
                      <div className="flex items-start space-x-3">
                        <Avatar>
                          <AvatarImage src={post.authorAvatar} />
                          <AvatarFallback>{post.author.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <div className="flex items-center space-x-2 mb-2">
                            <span className="font-semibold text-gray-900">{post.author}</span>
                            <span className="text-sm text-gray-500">{post.timestamp}</span>
                            <Badge variant="secondary" className="text-xs">
                              {post.category}
                            </Badge>
                            {post.isPinned && (
                              <Pin className="w-4 h-4 text-gray-400" />
                            )}
                          </div>
                          
                          <div className="flex items-start space-x-2 mb-3">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                            <div>
                              <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                              <p className="text-gray-700 text-sm">{post.content}</p>
                            </div>
                          </div>

                          {post.hasImage && (
                            <div className="mb-4">
                              <div className="w-32 h-20 bg-gray-200 rounded-lg"></div>
                            </div>
                          )}

                          <div className="flex items-center space-x-6 text-sm text-gray-500">
                            <button className="flex items-center space-x-1 hover:text-gray-700">
                              <Heart className="w-4 h-4" />
                              <span>{post.likes}</span>
                            </button>
                            <button className="flex items-center space-x-1 hover:text-gray-700">
                              <MessageSquare className="w-4 h-4" />
                              <span>{post.comments}</span>
                            </button>
                            <div className="flex items-center space-x-2">
                              <div className="flex -space-x-1">
                                {[
                                  "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=24&h=24&fit=crop&crop=faces",
                                  "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=24&h=24&fit=crop&crop=faces",
                                  "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=24&h=24&fit=crop&crop=faces"
                                ].map((avatarUrl, i) => (
                                  <Avatar key={i} className="w-6 h-6 border-2 border-white">
                                    <AvatarImage src={avatarUrl} />
                                    <AvatarFallback className="text-xs">U</AvatarFallback>
                                  </Avatar>
                                ))}
                              </div>
                              {post.commentTime && (
                                <span className="text-blue-600">New comment {post.commentTime}</span>
                              )}
                            </div>
                          </div>
                        </div>
                        <Button variant="ghost" size="sm">
                          <MoreHorizontal className="w-4 h-4" />
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Pagination */}
              <div className="flex justify-center items-center gap-4 mt-8">
                <Button variant="ghost" className="text-gray-500">
                  ← Previous
                </Button>
                <div className="flex gap-2">
                  <Button variant="default" className="w-10 h-10 rounded-full bg-orange-400 text-white">
                    1
                  </Button>
                  <Button variant="ghost" className="w-10 h-10 rounded-full">
                    2
                  </Button>
                </div>
                <Button variant="ghost" className="text-gray-700">
                  Next →
                </Button>
                <span className="text-sm text-gray-500">1-30 of 58</span>
              </div>
            </div>

            {/* Sidebar */}
            <div className="lg:col-span-1">
              <Card className="mb-6">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <div className="w-16 h-16 bg-yellow-400 rounded-full flex items-center justify-center mx-auto mb-3">
                      🤖
                    </div>
                    <h2 className="font-bold text-lg">{communityData.name}</h2>
                    <p className="text-gray-600 text-sm mb-2">{communityData.url}</p>
                    <p className="text-gray-700">{communityData.description}</p>
                  </div>

                  <div className="space-y-2 mb-4">
                    <div className="flex items-center text-sm text-gray-600">
                      <span>🔗 Join the main community</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span>🎁 Get a free trial of n8n</span>
                    </div>
                    <div className="flex items-center text-sm text-gray-600">
                      <span>🎁 Get a free trial of Make</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 text-center mb-4">
                    <div>
                      <div className="font-bold text-lg">{communityData.members}</div>
                      <div className="text-xs text-gray-500">Members</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg">{communityData.online}</div>
                      <div className="text-xs text-gray-500">Online</div>
                    </div>
                    <div>
                      <div className="font-bold text-lg">{communityData.admin}</div>
                      <div className="text-xs text-gray-500">Admin</div>
                    </div>
                  </div>

                  <div className="flex justify-center mb-4">
                    <div className="flex -space-x-2">
                      {communityData.memberAvatars.map((avatar, index) => (
                        <Avatar key={index} className="w-8 h-8 border-2 border-white">
                          <AvatarImage src={avatar} />
                          <AvatarFallback>M</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>

                  <Button className="w-full bg-gray-900 text-white hover:bg-gray-800">
                    INVITE PEOPLE
                  </Button>
                </CardContent>
              </Card>

              {/* Leaderboard */}
              <Card>
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Leaderboard (30-day)</h3>
                  <div className="space-y-3">
                    {leaderboard.map((member) => (
                      <div key={member.rank} className="flex items-center space-x-3">
                        <span className="text-sm font-medium w-4">{member.rank}</span>
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="flex-1 text-sm">{member.name}</span>
                        <span className="text-sm font-medium">{member.points}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="link" className="w-full mt-4 text-blue-600">
                    See all leaderboards
                  </Button>
                  <div className="text-center mt-4 text-xs text-gray-500">
                    powered by{" "}
                    <span className="font-semibold">
                      <span className="text-blue-600">3rd</span>
                      <span className="text-orange-500">Hub</span>
                    </span>
                  </div>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer /> {/* Added Footer */}
      </div>
    </>
  )
}


import React, { useState, useEffect } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { MessageSquare, Heart, MoreHorizontal, Pin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { useAuth } from "@/contexts/AuthContext"
import { postService, Post } from "@/services/postService"

const communityData = {
  id: "550e8400-e29b-41d4-a716-446655440007",
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

const leaderboard = [
  { rank: 1, name: "Cheeto Burrito", points: "+7", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=faces" },
  { rank: 2, name: "Beno Curt", points: "+7", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=faces" },
  { rank: 3, name: "Andy C", points: "+6", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=faces" },
  { rank: 4, name: "Brian McCaffrey", points: "+5", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=faces" },
  { rank: 5, name: "Mirko Baschek", points: "+5", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces" }
]

export default function CommunityDetails() {
  const router = useRouter()
  const { user, isLoggedIn } = useAuth()
  const [posts, setPosts] = useState<Post[]>([])
  const [loading, setLoading] = useState(true)
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set())

  useEffect(() => {
    if (router.isReady) {
      loadPosts()
    }
  }, [router.isReady, user])

  const loadPosts = async () => {
    try {
      setLoading(true)
      const fetchedPosts = await postService.getPosts(communityData.id, user?.id)
      setPosts(fetchedPosts)
    } catch (error) {
      console.error("Error loading posts:", error)
    } finally {
      setLoading(false)
    }
  }

  const handleLikePost = async (postId: string) => {
    if (!user || !isLoggedIn) {
      console.log("User must be logged in to like posts")
      return
    }

    if (likingPosts.has(postId)) {
      return // Prevent double-clicking
    }

    try {
      setLikingPosts(prev => new Set(prev).add(postId))
      
      const wasLiked = await postService.likePost(postId, user.id)
      
      // Update the post in the local state
      setPosts(prevPosts => 
        prevPosts.map(post => {
          if (post.id === postId) {
            return {
              ...post,
              user_has_liked: wasLiked,
              like_count: wasLiked ? post.like_count + 1 : post.like_count - 1
            }
          }
          return post
        })
      )
    } catch (error) {
      console.error("Error liking post:", error)
    } finally {
      setLikingPosts(prev => {
        const newSet = new Set(prev)
        newSet.delete(postId)
        return newSet
      })
    }
  }

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp)
    const now = new Date()
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60))
    
    if (diffInHours < 24) {
      return `${diffInHours}h ago`
    } else if (diffInHours < 168) {
      return `${Math.floor(diffInHours / 24)}d ago`
    } else {
      return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
    }
  }

  const getCategoryFromPostType = (postType: string) => {
    switch (postType) {
      case 'announcement': return 'Announcements'
      case 'lesson': return 'Nuggets & Tips'
      case 'discussion': return 'General discussion'
      default: return 'General discussion'
    }
  }

  return (
    <>
      <Head>
        <title>{communityData.name} - 3rdHub</title>
        <meta name="description" content={communityData.description} />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header 
          showCommunityHeader={true} 
          communityName={communityData.name} 
          communityIcon="🤖"
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
                      <AvatarFallback>
                        {user?.email?.charAt(0).toUpperCase() || "U"}
                      </AvatarFallback>
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
                {loading ? (
                  <div className="text-center py-8">Loading posts...</div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No posts yet. Be the first to post!</div>
                ) : (
                  posts.map((post) => (
                    <Card key={post.id} className="bg-white">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-3">
                          <Avatar>
                            <AvatarImage src={post.author?.avatar_url || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=40&h=40&fit=crop&crop=faces"} />
                            <AvatarFallback>
                              {post.author?.full_name?.split(' ').map(n => n[0]).join('') || "U"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-2">
                              <span className="font-semibold text-gray-900">
                                {post.author?.full_name || "Anonymous"}
                              </span>
                              <span className="text-sm text-gray-500">
                                {formatTimestamp(post.created_at)}
                              </span>
                              <Badge variant="secondary" className="text-xs">
                                {getCategoryFromPostType(post.post_type)}
                              </Badge>
                              {post.is_pinned && (
                                <Pin className="w-4 h-4 text-gray-400" />
                              )}
                            </div>
                            
                            <div className="flex items-start space-x-2 mb-3">
                              <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 flex-shrink-0"></div>
                              <div>
                                {post.title && (
                                  <h3 className="font-semibold text-gray-900 mb-2">{post.title}</h3>
                                )}
                                <p className="text-gray-700 text-sm">{post.content}</p>
                              </div>
                            </div>

                            <div className="flex items-center space-x-6 text-sm text-gray-500">
                              <button 
                                className={`flex items-center space-x-1 hover:text-red-500 transition-colors ${
                                  post.user_has_liked ? 'text-red-500' : 'text-gray-500'
                                } ${likingPosts.has(post.id) ? 'opacity-50' : ''}`}
                                onClick={() => handleLikePost(post.id)}
                                disabled={likingPosts.has(post.id)}
                              >
                                <Heart 
                                  className={`w-4 h-4 ${
                                    post.user_has_liked ? 'fill-current text-red-500' : ''
                                  }`} 
                                />
                                <span>{post.like_count}</span>
                              </button>
                              <button className="flex items-center space-x-1 hover:text-gray-700">
                                <MessageSquare className="w-4 h-4" />
                                <span>{post.comment_count}</span>
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
                              </div>
                            </div>
                          </div>
                          <Button variant="ghost" size="sm">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
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
        <Footer />
      </div>
    </>
  )
}

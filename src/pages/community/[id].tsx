import React, { useState, useEffect, useCallback } from "react"
import Head from "next/head"
import { useRouter } from "next/router"
import { MessageSquare, Heart, MoreHorizontal, Pin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import { useAuth } from "@/contexts/AuthContext"
import { postService, Post } from "@/services/postService"
import authService from "@/services/auth"
import { communities as homepageCommunities } from "@/pages/index" 
import CreatePostModal from "@/components/community/CreatePostModal"
import AuthModal from "@/components/auth/AuthModal"

interface CommunityDetailsData {
  id: string;
  name: string;
  description: string;
  icon?: string;
  url?: string;
  members?: string;
  online?: string;
  admin?: string;
  memberAvatars?: string[];
  image?: string; 
  avatar?: string; 
}

const leaderboard = [
  { rank: 1, name: "Cheeto Burrito", points: "+7", avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=32&h=32&fit=crop&crop=faces" },
  { rank: 2, name: "Beno Curt", points: "+7", avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=32&h=32&fit=crop&crop=faces" },
  { rank: 3, name: "Andy C", points: "+6", avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=32&h=32&fit=crop&crop=faces" },
  { rank: 4, name: "Brian McCaffrey", points: "+5", avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=faces" },
  { rank: 5, name: "Mirko Baschek", points: "+5", avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces" }
];

export default function CommunityDetailsPage() {
  const router = useRouter();
  const { user, isLoggedIn, setIsLoggedIn, setUserEmail } = useAuth();
  const [communityData, setCommunityData] = useState<CommunityDetailsData | null>(null);
  const [posts, setPosts] = useState<Post[]>([]);
  const [loadingPosts, setLoadingPosts] = useState(true);
  const [loadingCommunity, setLoadingCommunity] = useState(true);
  const [likingPosts, setLikingPosts] = useState<Set<string>>(new Set());
  const [isCreatePostModalOpen, setIsCreatePostModalOpen] = useState(false);
  const [authModalOpen, setAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<"login" | "signup">("login");

  const communityId = typeof router.query.id === "string" ? router.query.id : null;

  const loadCommunityData = useCallback(() => {
    if (communityId) {
      setLoadingCommunity(true);
      const foundCommunity = homepageCommunities.find(c => c.id === communityId);
      if (foundCommunity) {
        setCommunityData({
          id: foundCommunity.id,
          name: foundCommunity.title,
          description: foundCommunity.description,
          icon: "🤖", 
          url: `3rdhub.com/${foundCommunity.title.toLowerCase().replace(/\s+/g, "-").replace(/[^\w-]+/g, "")}`,
          members: foundCommunity.members,
          online: "30", 
          admin: "1", 
          memberAvatars: [
            "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=32&h=32&fit=crop&crop=faces",
            "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=32&h=32&fit=crop&crop=faces",
          ], 
          image: foundCommunity.image,
          avatar: foundCommunity.avatar,
        });
      } else {
        console.error("Community not found with ID:", communityId);
        router.push('/404');
      }
      setLoadingCommunity(false);
    }
  }, [communityId, router]);
  
  const loadPosts = useCallback(async () => {
    if (!communityId) return;
    try {
      setLoadingPosts(true);
      console.log("Loading posts for community:", communityId, "with user:", user?.id);
      
      // Check current session first
      const session = await authService.getCurrentSession();
      console.log("Current session:", session?.user?.email);
      
      const fetchedPosts = await postService.getPosts(communityId, user?.id);
      console.log("Fetched posts:", fetchedPosts);
      setPosts(fetchedPosts);
    } catch (error) {
      console.error("Error loading posts:", error);
      setPosts([]); 
    } finally {
      setLoadingPosts(false);
    }
  }, [communityId, user?.id]);

  useEffect(() => {
    if (router.isReady) {
      loadCommunityData();
      loadPosts();
    }
  }, [router.isReady, loadCommunityData, loadPosts]);

  const handleLikePost = async (postId: string) => {
    if (!user || !isLoggedIn) {
      setAuthMode("login");
      setAuthModalOpen(true);
      return;
    }
    if (likingPosts.has(postId)) return;

    setLikingPosts(prev => new Set(prev).add(postId));
    try {
      const wasLiked = await postService.likePost(postId, user.id);
      setPosts(prevPosts =>
        prevPosts.map(p =>
          p.id === postId
            ? { ...p, user_has_liked: wasLiked, like_count: wasLiked ? p.like_count + 1 : Math.max(0, p.like_count - 1) }
            : p
        )
      );
    } catch (error) {
      console.error("Error liking post:", error);
    } finally {
      setLikingPosts(prev => {
        const newSet = new Set(prev);
        newSet.delete(postId);
        return newSet;
      });
    }
  };

  const handleCreatePostSubmit = async (title: string, content: string): Promise<boolean> => {
    if (!communityId || !user) {
      console.error("Community ID or user not available for creating post.");
      return false;
    }
    try {
      await postService.createPost(communityId, user.id, content, title);
      setIsCreatePostModalOpen(false);
      loadPosts(); 
      return true;
    } catch (error) {
      console.error("Error creating post:", error);
      alert("Failed to create post. Please try again.");
      return false;
    }
  };

  const handleAuthSuccess = (email: string) => {
    setIsLoggedIn(true);
    setUserEmail(email);
    setAuthModalOpen(false);
    loadPosts(); // Reload posts to get user-specific like status
  };

  const formatTimestamp = (timestamp: string) => {
    const date = new Date(timestamp);
    const now = new Date();
    const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);
    if (diffInSeconds < 60) return `${diffInSeconds}s ago`;
    const diffInMinutes = Math.floor(diffInSeconds / 60);
    if (diffInMinutes < 60) return `${diffInMinutes}m ago`;
    const diffInHours = Math.floor(diffInMinutes / 60);
    if (diffInHours < 24) return `${diffInHours}h ago`;
    const diffInDays = Math.floor(diffInHours / 24);
    if (diffInDays < 7) return `${diffInDays}d ago`;
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  };

  const getCategoryFromPostType = (postType: string) => {
    switch (postType) {
      case 'announcement': return '📢 Announcements';
      case 'lesson': return '🎯 Nuggets & Tips';
      case 'discussion': return '🔥 General discussion';
      default: return '💬 General discussion';
    }
  };

  if (loadingCommunity || !communityData) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50">
        <Header />
        <div className="text-center py-10">Loading community details...</div>
        <Footer />
      </div>
    );
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
          communityIcon={communityData.icon || "🤖"}
          communityImage={communityData.image}
        />

        <div className="max-w-7xl mx-auto px-4 py-6">
          <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
            <div className="lg:col-span-3">
              <Card className="mb-6 shadow hover:shadow-md transition-shadow" onClick={() => {
                  if (isLoggedIn) {
                    setIsCreatePostModalOpen(true);
                  } else {
                    setAuthMode("login");
                    setAuthModalOpen(true);
                  }
                }}
              >
                <CardContent className="p-4">
                  <div className="flex items-center space-x-3">
                    <Avatar>
                       <AvatarImage src={user?.user_metadata?.avatar_url || ""} />
                      <AvatarFallback>
                        {user?.email?.charAt(0).toUpperCase() || "P"}
                      </AvatarFallback>
                    </Avatar>
                    <div className="flex-1 text-gray-500 cursor-pointer">Write something...</div>
                  </div>
                </CardContent>
              </Card>

              <div className="flex flex-wrap gap-2 mb-6">
                <Button variant="outline" size="sm" className="rounded-full text-gray-800 border-gray-300 hover:bg-gray-100 bg-white">All</Button>
                <Button variant="outline" size="sm" className="rounded-full text-gray-800 border-gray-300 hover:bg-gray-100 bg-white">🔥 General discussion</Button>
                <Button variant="outline" size="sm" className="rounded-full text-gray-800 border-gray-300 hover:bg-gray-100 bg-white">📢 Announcements</Button>
                <Button variant="outline" size="sm" className="rounded-full text-gray-800 border-gray-300 hover:bg-gray-100 bg-white">🎯 Nuggets & Tips</Button>
                <Button variant="outline" size="sm" className="rounded-full text-gray-800 border-gray-300 hover:bg-gray-100 bg-white">👋 Introduce Yourself</Button>
                <Button variant="outline" size="sm" className="rounded-full text-gray-800 border-gray-300 hover:bg-gray-100 bg-white">⚙️</Button>
              </div>

              <div className="space-y-4">
                {loadingPosts ? (
                  <div className="text-center py-8 text-gray-500">Loading posts...</div>
                ) : posts.length === 0 ? (
                  <div className="text-center py-8 text-gray-500">No posts yet. Be the first to post!</div>
                ) : (
                  posts.map((post) => (
                    <Card key={post.id} className="bg-white shadow">
                      <CardContent className="p-6">
                        <div className="flex items-start space-x-3">
                          <Avatar>
                            <AvatarImage src={post.author?.avatar_url || ""} />
                            <AvatarFallback>
                              {post.author?.full_name?.split(' ').map(n => n[0]).join('') || "A"}
                            </AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <span className="font-semibold text-gray-900">{post.author?.full_name || "Anonymous"}</span>
                              <span className="text-xs text-gray-500">• {formatTimestamp(post.created_at)}</span>
                              {post.is_pinned && <Pin className="w-3 h-3 text-gray-400 ml-1" />}
                            </div>
                            <div className="text-xs text-gray-500 mb-2">
                                <Badge variant="outline" className="text-xs font-normal">{getCategoryFromPostType(post.post_type)}</Badge>
                            </div>
                            
                            {post.title && (
                              <h3 className="font-semibold text-gray-900 mb-1 text-lg">{post.title}</h3>
                            )}
                            <p className="text-gray-700 text-sm whitespace-pre-wrap">{post.content}</p>
                            
                            <div className="flex items-center space-x-6 text-sm text-gray-500 mt-4">
                              <button 
                                className={`flex items-center space-x-1 transition-colors ${
                                  post.user_has_liked ? 'text-red-500 hover:text-red-600' : 'text-gray-500 hover:text-red-500'
                                } ${likingPosts.has(post.id) ? 'opacity-50 cursor-not-allowed' : ''}`}
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
                            </div>
                          </div>
                          <Button variant="ghost" size="icon" className="w-8 h-8">
                            <MoreHorizontal className="w-4 h-4" />
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  ))
                )}
              </div>
            </div>

            <div className="lg:col-span-1 space-y-6">
              <Card className="shadow">
                <CardContent className="p-6">
                  <div className="text-center mb-4">
                    <Avatar className="w-16 h-16 mx-auto mb-3">
                        <AvatarImage src={communityData.avatar || communityData.image} alt={communityData.name} />
                        <AvatarFallback>{communityData.name.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <h2 className="font-bold text-lg">{communityData.name}</h2>
                    {communityData.url && <p className="text-blue-600 hover:underline text-sm mb-2"><a href={`http://${communityData.url}`} target="_blank" rel="noopener noreferrer">{communityData.url}</a></p>}
                    <p className="text-gray-700 text-sm">{communityData.description}</p>
                  </div>

                  <div className="grid grid-cols-3 gap-2 text-center mb-4 text-sm">
                    <div>
                      <div className="font-bold">{communityData.members}</div>
                      <div className="text-xs text-gray-500">Members</div>
                    </div>
                    <div>
                      <div className="font-bold">{communityData.online}</div>
                      <div className="text-xs text-gray-500">Online</div>
                    </div>
                    <div>
                      <div className="font-bold">{communityData.admin}</div>
                      <div className="text-xs text-gray-500">Admin</div>
                    </div>
                  </div>
                  <div className="flex justify-center mb-4">
                    <div className="flex -space-x-2">
                      {(communityData.memberAvatars || []).map((avatar, index) => (
                        <Avatar key={index} className="w-8 h-8 border-2 border-white">
                          <AvatarImage src={avatar} />
                          <AvatarFallback>M</AvatarFallback>
                        </Avatar>
                      ))}
                    </div>
                  </div>
                  <Button className="w-full bg-gray-900 text-white hover:bg-gray-800">INVITE PEOPLE</Button>
                </CardContent>
              </Card>

              <Card className="shadow">
                <CardContent className="p-6">
                  <h3 className="font-semibold mb-4">Leaderboard (30-day)</h3>
                  <div className="space-y-3">
                    {leaderboard.map((member) => (
                      <div key={member.rank} className="flex items-center space-x-3">
                        <span className="text-sm font-medium w-4 text-gray-500">{member.rank}</span>
                        <Avatar className="w-8 h-8">
                          <AvatarImage src={member.avatar} />
                          <AvatarFallback>{member.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                        </Avatar>
                        <span className="flex-1 text-sm text-gray-800">{member.name}</span>
                        <span className="text-sm font-medium text-green-600">{member.points}</span>
                      </div>
                    ))}
                  </div>
                  <Button variant="link" className="w-full mt-4 text-blue-600 px-0">See all leaderboards</Button>
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
        <Footer />
      </div>
      {communityData && (
        <CreatePostModal
          isOpen={isCreatePostModalOpen}
          onClose={() => setIsCreatePostModalOpen(false)}
          onSubmit={handleCreatePostSubmit}
          communityName={communityData.name}
          userAvatarUrl={user?.user_metadata?.avatar_url || ""}
          userName={user?.user_metadata?.full_name || user?.email || "User"}
        />
      )}
      {/* AuthModal for login prompt */}
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

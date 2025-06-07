
import React, { useState, createContext, useContext } from "react"
import Head from "next/head"
import { Search } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"
import CommunityCard from "@/components/community/CommunityCard"
import AuthModal from "@/components/auth/AuthModal"

interface AuthContextType {
  isLoggedIn: boolean
  setIsLoggedIn: (value: boolean) => void
  userEmail: string
  setUserEmail: (value: string) => void
}

export const AuthContext = createContext<AuthContextType>({
  isLoggedIn: false,
  setIsLoggedIn: () => {},
  userEmail: "",
  setUserEmail: () => {}
})

const categories = [
  { name: "All", active: true },
  { name: "Hobbies", icon: "🎨", active: false },
  { name: "Music", icon: "🎵", active: false },
  { name: "Money", icon: "💰", active: false },
  { name: "Spirituality", icon: "✨", active: false },
  { name: "Tech", icon: "💻", active: false },
  { name: "Health", icon: "🏥", active: false },
  { name: "Sports", icon: "⚽", active: false },
  { name: "Self-improvement", icon: "🌱", active: false },
  { name: "More...", active: false }
]

const communities = [
  {
    id: 1,
    rank: "#1",
    title: "Calligraphy 3rdHub",
    description: "Learn modern calligraphy the fun, easy way! ✏️ With sisters Jordan & Jillian",
    members: "1.3k Members",
    price: "$9/month",
    image: "https://images.unsplash.com/photo-1596495577886-d920f1fb7238?w=800&h=400&fit=crop",
    category: "Hobbies",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=80&h=80&fit=crop&crop=faces"
  },
  {
    id: 2,
    rank: "#2",
    title: "Zero To Founder by Tom Bilyeu",
    description: "Level up your business and get on the path to financial freedom with billion-dollar founder Tom Bilyeu.",
    members: "1.1k Members",
    price: "$119/month",
    image: "https://images.unsplash.com/photo-1553484771-047a44eee27a?w=800&h=400&fit=crop",
    category: "Money",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=faces"
  },
  {
    id: 3,
    rank: "#3",
    title: "Brotherhood Of Scent",
    description: "#1 Fragrance Community 🧔 Our mission is to help YOU leverage the power of scent to become the man you know yourself to...",
    members: "6.9k Members",
    price: "Free",
    image: "https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=800&h=400&fit=crop",
    category: "Self-improvement",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=faces"
  },
  {
    id: 4,
    rank: "#28",
    title: "Kickstarter Challenge",
    description: "Welcome! Ready to start losing weight in 2025 with massive piles of plant based food? Let's go!!",
    members: "14.5k Members",
    price: "Free",
    image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=400&fit=crop",
    category: "Health",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=80&h=80&fit=crop&crop=faces"
  },
  {
    id: 5,
    rank: "#29",
    title: "AI Automation Society",
    description: "A community for mastering AI-driven automation and AI agents. Learn, collaborate, and optimize your workflows!",
    members: "73.9k Members",
    price: "Free",
    image: "https://images.unsplash.com/photo-1677442136019-21780ecad995?w=800&h=400&fit=crop",
    category: "Tech",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=80&h=80&fit=crop&crop=faces"
  },
  {
    id: 6,
    rank: "#30",
    title: "Snipe University",
    description: "Get a PhD in Sneaker Reselling 😷 👟",
    members: "487 Members",
    price: "$97/month",
    image: "https://images.unsplash.com/photo-1552346154-21d32810aba3?w=800&h=400&fit=crop",
    category: "Money",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=80&h=80&fit=crop&crop=faces"
  }
]

export default function Home() {
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("All")
  const [authModalOpen, setAuthModalOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("signup")
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [userEmail, setUserEmail] = useState("")

  const handleCreateYourOwn = () => {
    setAuthMode("signup")
    setAuthModalOpen(true)
  }

  const handleAuthSuccess = (email: string) => {
    setIsLoggedIn(true)
    setUserEmail(email)
    setAuthModalOpen(false)
  }

  const handleLogout = () => {
    setIsLoggedIn(false)
    setUserEmail("")
  }

  return (
    <AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn, userEmail, setUserEmail }}>
      <Head>
        <title>3rdHub - Discover communities</title>
        <meta name="description" content="Discover communities or create your own on 3rdHub" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <div className="min-h-screen bg-gray-50">
        <Header onLogout={handleLogout} />
        
        <main className="max-w-7xl mx-auto px-4 py-8">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold text-gray-900 mb-4">
              Discover communities
            </h1>
            <p className="text-lg text-gray-600 mb-8">
              or{" "}
              <button 
                onClick={handleCreateYourOwn}
                className="text-blue-600 hover:text-blue-700 underline cursor-pointer"
              >
                create your own
              </button>
            </p>

            <div className="max-w-2xl mx-auto relative">
              <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <Input
                type="text"
                placeholder="Search for anything"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-12 py-4 text-lg border-gray-300 rounded-xl"
              />
            </div>
          </div>

          <div className="flex flex-wrap gap-3 mb-8 justify-center">
            {categories.map((category) => (
              <Button
                key={category.name}
                variant={selectedCategory === category.name ? "default" : "outline"}
                onClick={() => setSelectedCategory(category.name)}
                className={`rounded-full px-4 py-2 ${
                  selectedCategory === category.name
                    ? "bg-gray-900 text-white"
                    : "bg-white text-gray-700 border-gray-300 hover:bg-gray-50"
                }`}
              >
                {category.icon && <span className="mr-2">{category.icon}</span>}
                {category.name}
              </Button>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
            {communities.map((community) => (
              <CommunityCard key={community.id} community={community} />
            ))}
          </div>

          <div className="flex justify-center items-center gap-4">
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
              <Button variant="ghost" className="w-10 h-10 rounded-full">
                3
              </Button>
              <Button variant="ghost" className="w-10 h-10 rounded-full">
                4
              </Button>
              <Button variant="ghost" className="w-10 h-10 rounded-full">
                5
              </Button>
              <span className="px-2">...</span>
              <Button variant="ghost" className="w-10 h-10 rounded-full">
                34
              </Button>
            </div>
            <Button variant="ghost" className="text-gray-700">
              Next →
            </Button>
          </div>
        </main>

        <Footer />
      </div>

      <AuthModal
        isOpen={authModalOpen}
        onClose={() => setAuthModalOpen(false)}
        mode={authMode}
        onSwitchMode={setAuthMode}
        onSuccess={handleAuthSuccess}
      />
    </AuthContext.Provider>
  )
}

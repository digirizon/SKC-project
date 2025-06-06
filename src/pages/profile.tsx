
import React from "react"
import Head from "next/head"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Lock } from "lucide-react"
import Header from "@/components/layout/Header"
import Footer from "@/components/layout/Footer"

const userProfile = {
  initials: "PE",
  name: "Patrik Engblad",
  level: 1,
  levelName: "Bit",
  pointsToNextLevel: 6,
  currentProgress: 30,
  joinDate: "Jun 6th 2025",
}

const levels = [
  { name: "Level 1 - Bit", members: "16% of members", unlocked: true },
  { name: "Level 2 - Byte", members: "Unlock with 20 points!", unlocked: false, requiredPoints: 20 },
  { name: "Level 3 - Kilobyte", members: "Unlock Chat with members", unlocked: false, requiredPoints: 50 },
  { name: "Level 4 - Megabyte", members: "0% of members", unlocked: false, requiredPoints: 100 },
  { name: "Level 5 - Gigabyte", members: "1% of members", unlocked: false, requiredPoints: 200 },
  { name: "Level 6 - Terabyte", members: "0% of members", unlocked: false, requiredPoints: 500 },
  { name: "Level 7 - Petabyte", members: "0% of members", unlocked: false, requiredPoints: 1000 },
  { name: "Level 8 - Exabyte", members: "0% of members", unlocked: false, requiredPoints: 2000 },
  { name: "Level 9 - Zettabyte", members: "0% of members", unlocked: false, requiredPoints: 5000 },
]

const leaderboardData = {
  sevenDay: [
    { rank: 1, name: "Andy C", points: "+6", avatar: "/api/placeholder/32/32" },
    { rank: 2, name: "Matija Lonjak", points: "+5", avatar: "/api/placeholder/32/32" },
    { rank: 3, name: "Valica Lehel", points: "+4", avatar: "/api/placeholder/32/32" },
    { rank: 4, name: "Nefise Nur Bora", points: "+3", avatar: "/api/placeholder/32/32" },
    { rank: 5, name: "Brian McCaffrey", points: "+3", avatar: "/api/placeholder/32/32" },
    { rank: 6, name: "Dylan Pintado", points: "+3", avatar: "/api/placeholder/32/32" },
    { rank: 7, name: "Guille Nun", points: "+3", avatar: "/api/placeholder/32/32" },
    { rank: 8, name: "Robin Bach", points: "+3", avatar: "/api/placeholder/32/32" },
    { rank: 9, name: "Sabri Turhan", points: "+3", avatar: "/api/placeholder/32/32" },
    { rank: 10, name: "Eric McLeod", points: "+3", avatar: "/api/placeholder/32/32" },
  ],
  thirtyDay: [
    { rank: 1, name: "Cheeto Burrito", points: "+7", avatar: "/api/placeholder/32/32" },
    { rank: 2, name: "Beno Curt", points: "+7", avatar: "/api/placeholder/32/32" },
    { rank: 3, name: "Andy C", points: "+6", avatar: "/api/placeholder/32/32" },
    { rank: 4, name: "Brian McCaffrey", points: "+5", avatar: "/api/placeholder/32/32" },
    { rank: 5, name: "Mirko Baschek", points: "+5", avatar: "/api/placeholder/32/32" },
    { rank: 6, name: "Matija Lonjak", points: "+5", avatar: "/api/placeholder/32/32" },
    { rank: 7, name: "Maustfa Mauhamed", points: "+5", avatar: "/api/placeholder/32/32" },
    { rank: 8, name: "Valics Lehel", points: "+4", avatar: "/api/placeholder/32/32" },
    { rank: 9, name: "Matyas Laznicka", points: "+4", avatar: "/api/placeholder/32/32" },
    { rank: 10, name: "Sourya Mohanty", points: "+4", avatar: "/api/placeholder/32/32" },
  ],
  allTime: [
    { rank: 1, name: "Monatehi Elias", points: "12", avatar: "/api/placeholder/32/32" },
    { rank: 2, name: "Alex Rojas", points: "7", avatar: "/api/placeholder/32/32" },
    { rank: 3, name: "Beno Curt", points: "7", avatar: "/api/placeholder/32/32" },
    { rank: 4, name: "Cheeto Burrito", points: "7", avatar: "/api/placeholder/32/32" },
    { rank: 5, name: "Andy C", points: "6", avatar: "/api/placeholder/32/32" },
    { rank: 6, name: "Sarah Howard", points: "6", avatar: "/api/placeholder/32/32" },
    { rank: 7, name: "Matija Lonjak", points: "5", avatar: "/api/placeholder/32/32" },
    { rank: 8, name: "Valics Lehel", points: "5", avatar: "/api/placeholder/32/32" },
    { rank: 9, name: "Mirko Baschek", points: "5", avatar: "/api/placeholder/32/32" },
    { rank: 10, name: "Maustfa Mauhamed", points: "5", avatar: "/api/placeholder/32/32" },
  ],
}

type LeaderboardMember = {
  rank: number
  name: string
  points: string
  avatar: string
}

const LeaderboardList = ({ title, data }: { title: string; data: LeaderboardMember[] }) => (
  <Card>
    <CardHeader>
      <CardTitle className="text-lg font-semibold">{title}</CardTitle>
    </CardHeader>
    <CardContent className="space-y-3">
      {data.map((member) => (
        <div key={member.rank} className="flex items-center space-x-3">
          <span className="text-sm text-gray-500 w-4 text-right">{member.rank}</span>
          <Avatar className="w-8 h-8">
            <AvatarImage src={member.avatar} alt={member.name} />
            <AvatarFallback>{member.name.split(" ").map(n => n[0]).join("")}</AvatarFallback>
          </Avatar>
          <span className="flex-1 text-sm text-gray-700">{member.name}</span>
          <span className="text-sm font-medium text-gray-900">{member.points}</span>
        </div>
      ))}
    </CardContent>
  </Card>
)

export default function ProfilePage() {
  return (
    <>
      <Head>
        <title>My Profile - 3rdHub</title>
        <meta name="description" content={`${userProfile.name}'s profile on 3rdHub`} />
      </Head>
      <div className="min-h-screen bg-gray-100">
        <Header />
        <main className="max-w-7xl mx-auto px-4 py-8">
          {/* Profile Header Section */}
          <div className="bg-white p-6 md:p-8 rounded-lg shadow mb-8">
            <div className="flex flex-col md:flex-row items-center md:space-x-8">
              <div className="relative mb-6 md:mb-0">
                <Avatar className="w-32 h-32 md:w-40 md:h-40 text-5xl md:text-6xl border-4 border-white shadow-lg">
                  <AvatarFallback>{userProfile.initials}</AvatarFallback>
                </Avatar>
                <div className="absolute -bottom-2 -right-2 bg-blue-600 text-white rounded-full w-10 h-10 flex items-center justify-center text-lg font-bold border-2 border-white">
                  {userProfile.level}
                </div>
              </div>
              <div className="text-center md:text-left">
                <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{userProfile.name}</h1>
                <p className="text-gray-600">Level {userProfile.level} - {userProfile.levelName}</p>
                <p className="text-sm text-gray-500 mt-1">
                  {userProfile.pointsToNextLevel} points to level up
                </p>
                <Progress value={userProfile.currentProgress} className="mt-3 h-2 w-full md:w-64" />
                <p className="text-xs text-gray-400 mt-1">Joined: {userProfile.joinDate}</p>
              </div>
            </div>
          </div>

          {/* Levels Section */}
          <Card className="mb-8">
            <CardHeader>
              <CardTitle className="text-xl font-semibold">Your Levels</CardTitle>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {levels.map((level) => (
                <div key={level.name} className={`p-4 border rounded-lg ${level.unlocked ? "bg-green-50 border-green-200" : "bg-gray-50 border-gray-200"}`}>
                  <div className="flex items-center justify-between mb-1">
                    <h3 className={`font-semibold ${level.unlocked ? "text-green-700" : "text-gray-700"}`}>{level.name}</h3>
                    {!level.unlocked && <Lock className="w-4 h-4 text-gray-400" />}
                  </div>
                  <p className="text-xs text-gray-500">{level.members}</p>
                  {!level.unlocked && level.requiredPoints && (
                     <p className="text-xs text-blue-600 mt-1">Unlock with {level.requiredPoints} points</p>
                  )}
                </div>
              ))}
            </CardContent>
          </Card>
          
          <p className="text-sm text-gray-500 mb-4">Last updated: {new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}</p>

          {/* Leaderboards Section */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <LeaderboardList title="Leaderboard (7-day)" data={leaderboardData.sevenDay} />
            <LeaderboardList title="Leaderboard (30-day)" data={leaderboardData.thirtyDay} />
            <LeaderboardList title="Leaderboard (all-time)" data={leaderboardData.allTime} />
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}

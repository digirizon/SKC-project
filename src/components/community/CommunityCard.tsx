import React from "react"
import Link from "next/link"
import { Badge } from "@/components/ui/badge"
import { Card, CardContent } from "@/components/ui/card"

interface Community {
  id: number
  rank: string
  title: string
  description: string
  members: string
  price: string
  image: string
  category: string
  avatar: string
}

interface CommunityCardProps {
  community: Community
}

export default function CommunityCard({ community }: CommunityCardProps) {
  return (
    <Link href={`/community/${community.id}`} className="block">
      <Card className="hover:shadow-lg transition-shadow cursor-pointer bg-white border border-gray-200 rounded-xl overflow-hidden">
        <div className="relative">
          <div 
            className="h-48 bg-gradient-to-br from-purple-400 via-pink-400 to-orange-400"
            style={{
              backgroundImage: `url(${community.image})`,
              backgroundSize: "cover",
              backgroundPosition: "center"
            }}
          >
            <div className="absolute top-3 left-3">
              <Badge className="bg-black/70 text-white text-sm font-medium px-2 py-1">
                {community.rank}
              </Badge>
            </div>
          </div>
        </div>
        
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 rounded-lg flex-shrink-0 overflow-hidden">
              <img src={community.avatar} alt={community.title} className="w-full h-full object-cover" />
            </div>
            <div className="flex-1 min-w-0">
              <h3 className="font-semibold text-gray-900 mb-2 line-clamp-1">
                {community.title}
              </h3>
              <p className="text-sm text-gray-600 mb-3 line-clamp-2">
                {community.description}
              </p>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">{community.members}</span>
                <span className="font-medium text-gray-900">{community.price}</span>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    </Link>
  )
}

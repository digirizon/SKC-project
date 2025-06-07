import React from "react"
import Link from "next/link" // Added Link import
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"

interface Community {
  id: string; // Ensure id is string
  rank: string;
  title: string;
  description: string;
  members: string;
  price: string;
  image: string;
  category: string;
  avatar: string;
}

interface CommunityCardProps {
  community: Community;
}

export default function CommunityCard({ community }: CommunityCardProps) {
  return (
    <Link href={`/community/${community.id}`} passHref> {/* Added Link component */}
      <Card className="overflow-hidden hover:shadow-lg transition-shadow duration-200 cursor-pointer h-full flex flex-col">
        <div className="relative">
          <img
            src={community.image}
            alt={community.title}
            className="w-full h-40 object-cover"
          />
          <Badge
            variant="secondary"
            className="absolute top-2 left-2 bg-black bg-opacity-50 text-white px-2 py-1 text-xs"
          >
            {community.rank}
          </Badge>
        </div>
        <CardHeader className="p-4">
          <div className="flex items-center mb-2">
            <Avatar className="w-8 h-8 mr-2">
              <AvatarImage src={community.avatar} alt={community.title} />
              <AvatarFallback>{community.title.charAt(0)}</AvatarFallback>
            </Avatar>
            <CardTitle className="text-md font-semibold leading-tight">
              {community.title}
            </CardTitle>
          </div>
        </CardHeader>
        <CardContent className="p-4 pt-0 text-sm text-gray-600 flex-grow">
          <p className="line-clamp-3">{community.description}</p>
        </CardContent>
        <CardFooter className="p-4 pt-0 text-xs text-gray-500">
          <span>{community.members}</span>
          <span className="mx-1">·</span>
          <span>{community.price}</span>
        </CardFooter>
      </Card>
    </Link>
  )
}

import React from "react";
// Removed unused: useRouter
import { PlusCircle, Compass, ChevronDown, Search as SearchIcon } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from "next/link";

interface LogoDropdownProps {
  onTriggerAuthModal: (mode: "login" | "signup") => void;
}

export default function LogoDropdown({ onTriggerAuthModal }: LogoDropdownProps) {
  // Removed unused: const router = useRouter();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="w-auto h-auto p-0 ml-1 hover:bg-transparent">
          <ChevronDown className="w-5 h-5 text-gray-500" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 mt-2" align="start">
        <div className="p-2">
          <div className="relative">
            <SearchIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <input 
              type="text" 
              placeholder="Search" 
              className="w-full pl-10 pr-3 py-2 text-sm border border-gray-300 rounded-md focus:ring-1 focus:ring-blue-500 focus:border-blue-500" 
            />
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem
          className="flex items-center gap-2 cursor-pointer text-sm py-2 px-3"
          onClick={() => onTriggerAuthModal("signup")} 
        >
          <PlusCircle className="w-4 h-4 text-gray-600" />
          <span>Create a community</span>
        </DropdownMenuItem>
        <Link href="/" passHref>
          <DropdownMenuItem className="flex items-center gap-2 cursor-pointer text-sm py-2 px-3">
            <Compass className="w-4 h-4 text-gray-600" />
            <span>Discover communities</span>
          </DropdownMenuItem>
        </Link>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

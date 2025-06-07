import React from "react";
import { useRouter } from "next/router";
import { Search, PlusCircle, Compass, Settings2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
  // DropdownMenuSeparator, // Removed unused import
} from "@/components/ui/dropdown-menu";

interface LogoDropdownProps {
  onTriggerAuthModal: (mode: "login" | "signup") => void;
}

export default function LogoDropdown({ onTriggerAuthModal }: LogoDropdownProps) {
  const router = useRouter();

  const handleNavigation = (path: string) => {
    router.push(path);
  };

  const handleCreateCommunity = () => {
    // This should trigger the signup/login modal if user is not logged in
    // For now, we'll assume the parent component (Header) handles the auth check
    // and calls onTriggerAuthModal appropriately.
    // If already logged in, it might navigate to a create community page.
    // For this example, let's make it trigger signup if called.
    onTriggerAuthModal("signup");
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="ml-1">
          <Compass className="h-5 w-5 text-gray-500" /> 
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-64 p-2" align="start">
        <div className="relative mb-2">
          <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-400" />
          <Input placeholder="Search..." className="pl-8" />
          <Button variant="ghost" size="icon" className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7">
            <Settings2 className="h-4 w-4 text-gray-400" />
          </Button>
        </div>
        <DropdownMenuItem
          className="flex items-center gap-2 py-2 px-3 text-sm cursor-pointer hover:bg-gray-100 rounded-md"
          onClick={handleCreateCommunity}
        >
          <PlusCircle className="h-4 w-4" />
          <span>Create a community</span>
        </DropdownMenuItem>
        <DropdownMenuItem
          className="flex items-center gap-2 py-2 px-3 text-sm cursor-pointer hover:bg-gray-100 rounded-md"
          onClick={() => handleNavigation("/")} // Assuming discover communities is the home page
        >
          <Compass className="h-4 w-4" />
          <span>Discover communities</span>
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

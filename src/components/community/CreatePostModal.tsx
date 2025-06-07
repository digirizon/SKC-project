import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"; // Removed DialogClose
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Paperclip, Link2, Youtube, BarChart2, Smile, ChevronDown } from "lucide-react";

interface CreatePostModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (title: string, content: string) => Promise<boolean>;
  communityName: string;
  userAvatarUrl?: string;
  userName?: string;
}

export default function CreatePostModal({
  isOpen,
  onClose,
  onSubmit,
  communityName,
  userAvatarUrl,
  userName,
}: CreatePostModalProps) {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) {
      return;
    }
    setIsSubmitting(true);
    const success = await onSubmit(title, content);
    setIsSubmitting(false);
    if (success) {
      setTitle("");
      setContent("");
      onClose();
    }
  };

  const handleClose = () => {
    setTitle("");
    setContent("");
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[800px] p-0 bg-white">
        {/* Header */}
        <DialogHeader className="p-6 pb-4">
          <div className="flex items-center space-x-3">
            <Avatar className="w-10 h-10">
              <AvatarImage src={userAvatarUrl} />
              <AvatarFallback className="bg-gray-800 text-white font-bold">
                {userName?.split(' ').map(n => n[0]).join('') || "U"}
              </AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-lg font-normal text-gray-900">
                <span className="font-semibold">{userName || "A N"}</span> posting in{" "}
                <span className="font-semibold">{communityName}</span>
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="flex flex-col h-full">
          {/* Content Area */}
          <div className="px-6 flex-1">
            {/* Title Input */}
            <Input
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-2xl font-normal border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 mb-4 placeholder:text-gray-400 placeholder:font-normal"
            />
            
            {/* Content Textarea */}
            <Textarea
              placeholder="Write something..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[200px] text-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 resize-none placeholder:text-gray-400"
              required
            />
          </div>

          {/* Footer with tools and buttons */}
          <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              {/* Left side tools */}
              <div className="flex items-center space-x-1">
                <Button variant="ghost" size="icon" type="button" className="w-10 h-10 text-gray-500 hover:bg-gray-200">
                  <Paperclip className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" type="button" className="w-10 h-10 text-gray-500 hover:bg-gray-200">
                  <Link2 className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" type="button" className="w-10 h-10 text-gray-500 hover:bg-gray-200">
                  <Youtube className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" type="button" className="w-10 h-10 text-gray-500 hover:bg-gray-200">
                  <BarChart2 className="w-5 h-5" />
                </Button>
                <Button variant="ghost" size="icon" type="button" className="w-10 h-10 text-gray-500 hover:bg-gray-200">
                  <Smile className="w-5 h-5" />
                </Button>
                <div className="text-2xl">🎁</div>
                
                {/* Category Selector */}
                <Button variant="ghost" type="button" className="text-gray-500 hover:bg-gray-200 ml-4">
                  Select a category <ChevronDown className="w-4 h-4 ml-1" />
                </Button>
              </div>

              {/* Right side buttons */}
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  type="button" 
                  onClick={handleClose}
                  disabled={isSubmitting}
                  className="text-gray-600 hover:text-gray-800"
                >
                  CANCEL
                </Button>
                <Button 
                  type="submit" 
                  disabled={!content.trim() || isSubmitting} 
                  className="bg-gray-800 hover:bg-gray-900 text-white px-8"
                >
                  {isSubmitting ? "POSTING..." : "POST"}
                </Button>
              </div>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

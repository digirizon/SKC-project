
import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Paperclip, Link2, Youtube, BarChart2, Smile, AtSign, Gif, ChevronDown } from "lucide-react";

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
      // Optionally show an error that content is required
      return;
    }
    setIsSubmitting(true);
    const success = await onSubmit(title, content);
    setIsSubmitting(false);
    if (success) {
      setTitle("");
      setContent("");
      onClose();
    } else {
      // Optionally show an error message to the user
      alert("Failed to create post. Please try again.");
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] p-0">
        <DialogHeader className="p-6 pb-4 border-b">
          <div className="flex items-center space-x-2">
            <Avatar className="w-8 h-8">
              <AvatarImage src={userAvatarUrl} />
              <AvatarFallback>{userName?.charAt(0).toUpperCase() || "U"}</AvatarFallback>
            </Avatar>
            <div>
              <DialogTitle className="text-md font-normal">
                {userName || "You"} posting in{" "}
                <span className="font-semibold">{communityName}</span>
              </DialogTitle>
            </div>
          </div>
        </DialogHeader>
        <form onSubmit={handleSubmit}>
          <div className="p-6 space-y-4">
            <Input
              placeholder="Title (optional)"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="text-lg border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 placeholder:text-gray-400"
            />
            <Textarea
              placeholder="Write something..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              className="min-h-[120px] border-0 focus-visible:ring-0 focus-visible:ring-offset-0 px-0 placeholder:text-gray-400"
              required
            />
          </div>
          <div className="px-6 py-4 border-t flex justify-between items-center">
            <div className="flex items-center space-x-2 text-gray-500">
              <Button variant="ghost" size="icon" type="button" className="hover:bg-gray-100"><Paperclip className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon" type="button" className="hover:bg-gray-100"><Link2 className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon" type="button" className="hover:bg-gray-100"><Youtube className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon" type="button" className="hover:bg-gray-100"><BarChart2 className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon" type="button" className="hover:bg-gray-100"><Smile className="w-5 h-5" /></Button>
              <Button variant="ghost" size="icon" type="button" className="hover:bg-gray-100"><Gif className="w-5 h-5" /></Button>
              <Button variant="ghost" size="sm" type="button" className="hover:bg-gray-100 text-gray-500">
                Select a category <ChevronDown className="w-4 h-4 ml-1" />
              </Button>
            </div>
            <div className="flex items-center space-x-2">
              <DialogClose asChild>
                <Button variant="ghost" type="button" disabled={isSubmitting}>Cancel</Button>
              </DialogClose>
              <Button type="submit" disabled={!content.trim() || isSubmitting} className="bg-gray-800 hover:bg-gray-900">
                {isSubmitting ? "Posting..." : "POST"}
              </Button>
            </div>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}

import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Define more specific types based on your Database types
type PostRow = Database["public"]["Tables"]["posts"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type PostLikeRow = Database["public"]["Tables"]["post_likes"]["Row"];

// Define a more accurate type for the author object as returned by Supabase join
type PostAuthor = Pick<ProfileRow, "full_name" | "username" | "avatar_url"> | null;

// Combined type for Post with author details
export interface Post extends PostRow {
  author?: PostAuthor;
  user_has_liked?: boolean;
}

// Changed to type alias to resolve lint warning
export type PostLike = PostLikeRow;

export const postService = {
  async getPosts(communityId: string, userId?: string): Promise<Post[]> {
    // Use a simpler approach - fetch posts and profiles separately
    const { data: postsData, error } = await supabase
      .from("posts")
      .select("*")
      .eq("community_id", communityId)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }

    if (!postsData || postsData.length === 0) return [];

    // Get unique author IDs
    const authorIds = [...new Set(postsData.map(post => post.author_id).filter(Boolean))];
    
    // Fetch author profiles separately
    const { data: profilesData, error: profilesError } = await supabase
      .from("profiles")
      .select("id, full_name, username, avatar_url")
      .in("id", authorIds);

    if (profilesError) {
      console.error("Error fetching profiles:", profilesError);
    }

    // Create a map of profiles for quick lookup
    const profilesMap = new Map();
    if (profilesData) {
      profilesData.forEach(profile => {
        profilesMap.set(profile.id, profile);
      });
    }

    // Combine posts with author details
    const postsWithAuthorDetails = postsData.map(post => ({
      ...post,
      author: profilesMap.get(post.author_id) || null,
    })) as Post[];

    if (userId) {
      const postIds = postsWithAuthorDetails.map(post => post.id);
      if (postIds.length > 0) {
        const { data: likesData, error: likesError } = await supabase
          .from("post_likes")
          .select("post_id")
          .eq("user_id", userId)
          .in("post_id", postIds);

        if (likesError) {
          console.error("Error fetching post likes:", likesError);
        }

        const likedPostIds = new Set(likesData?.map(like => like.post_id) || []);

        return postsWithAuthorDetails.map(post => ({
          ...post,
          user_has_liked: likedPostIds.has(post.id)
        }));
      }
    }

    return postsWithAuthorDetails.map(post => ({
      ...post,
      user_has_liked: false
    }));
  },

  async likePost(postId: string, userId: string): Promise<boolean> {
    try {
      const { data: existingLike, error: fetchLikeError } = await supabase
        .from("post_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .single();

      if (fetchLikeError && fetchLikeError.code !== "PGRST116") {
        console.error("Error fetching existing like:", fetchLikeError);
        throw fetchLikeError;
      }
      
      if (existingLike) {
        const { error: deleteError } = await supabase
          .from("post_likes")
          .delete()
          .eq("post_id", postId)
          .eq("user_id", userId);

        if (deleteError) throw deleteError;

        const { error: rpcError } = await supabase.rpc("decrement_like_count", {
          post_id: postId,
        });
        if (rpcError) console.error("RPC decrement_like_count error:", rpcError);
        
        return false;
      } else {
        const { error: insertError } = await supabase
          .from("post_likes")
          .insert({ post_id: postId, user_id: userId });

        if (insertError) throw insertError;
        
        const { error: rpcError } = await supabase.rpc("increment_like_count", {
           post_id: postId,
        });
        if (rpcError) console.error("RPC increment_like_count error:", rpcError);
        
        return true;
      }
    } catch (error) {
      console.error("Error toggling post like:", error);
      throw error;
    }
  },

  async createPost(
    communityId: string, 
    authorId: string, 
    content: string, 
    title?: string, 
    postType: string = "discussion"
  ): Promise<Post> {
    // Use the simpler approach for creating posts too
    const { data: newPostData, error } = await supabase
      .from("posts")
      .insert({
        community_id: communityId,
        author_id: authorId,
        title,
        content,
        post_type: postType,
      })
      .select()
      .single();

    if (error) {
      console.error("Error creating post:", error);
      throw error;
    }

    if (!newPostData) {
      throw new Error("No data returned from post creation");
    }
    
    // Fetch the author profile separately
    const { data: authorProfile } = await supabase
      .from("profiles")
      .select("full_name, username, avatar_url")
      .eq("id", authorId)
      .single();

    // Return the post with author details
    const createdPostWithAuthorDetails = {
      ...newPostData,
      author: authorProfile || null,
      user_has_liked: false,
    } as Post;

    return createdPostWithAuthorDetails;
  }
};

export default postService;

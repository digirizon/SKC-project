import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Define more specific types based on your Database types
type PostRow = Database["public"]["Tables"]["posts"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type PostLikeRow = Database["public"]["Tables"]["post_likes"]["Row"];

// Combined type for Post with author details
export interface Post extends Omit<PostRow, "author_id"> {
  author_id: string; // Keep author_id for relations
  author?: Pick<ProfileRow, "full_name" | "username" | "avatar_url">;
  user_has_liked?: boolean;
}

// Changed to type alias to resolve lint warning
export type PostLike = PostLikeRow;

export const postService = {
  async getPosts(communityId: string, userId?: string): Promise<Post[]> {
    const {  postsData, error } = await supabase // Corrected destructuring
      .from("posts")
      .select(`
        *,
        author:author_id ( 
          full_name,
          username,
          avatar_url
        )
      `)
      .eq("community_id", communityId)
      .order("created_at", { ascending: false });
    
    if (error) {
      console.error("Error fetching posts:", error);
      throw error;
    }

    if (!postsData) return [];

    // Explicitly type postsData based on the select query structure
    const postsWithAuthor = postsData as Array<PostRow & { author: Pick<ProfileRow, "full_name" | "username" | "avatar_url"> | null }>;

    if (userId) {
      const postIds = postsWithAuthor.map(post => post.id);
      const {  likesData, error: likesError } = await supabase // Corrected destructuring
        .from("post_likes")
        .select("post_id")
        .eq("user_id", userId)
        .in("post_id", postIds);

      if (likesError) {
        console.error("Error fetching post likes:", likesError);
        // Decide how to handle this - perhaps return posts without like status or throw
      }

      const likedPostIds = new Set(likesData?.map(like => like.post_id) || []);

      return postsWithAuthor.map(post => ({
        ...post,
        author: post.author || undefined, // Handle null author case
        user_has_liked: likedPostIds.has(post.id)
      }));
    }

    return postsWithAuthor.map(post => ({
      ...post,
      author: post.author || undefined,
      user_has_liked: false
    }));
  },

  async likePost(postId: string, userId: string): Promise<boolean> {
    try {
      const {  existingLike, error: fetchLikeError } = await supabase // Corrected destructuring
        .from("post_likes")
        .select("id")
        .eq("post_id", postId)
        .eq("user_id", userId)
        .single();

      if (fetchLikeError && fetchLikeError.code !== "PGRST116") { // PGRST116: 'No rows found' which is fine for .single() if it might not exist
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
        
        return false; // Post was unliked
      } else {
        const { error: insertError } = await supabase
          .from("post_likes")
          .insert({ post_id: postId, user_id: userId });

        if (insertError) throw insertError;
        
        const { error: rpcError } = await supabase.rpc("increment_like_count", {
           post_id: postId,
        });
        if (rpcError) console.error("RPC increment_like_count error:", rpcError);
        
        return true; // Post was liked
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
    const {  newPostData, error } = await supabase // Corrected destructuring
      .from("posts")
      .insert({
        community_id: communityId,
        author_id: authorId,
        title,
        content,
        post_type: postType,
      })
      .select(`
        *,
        author:author_id (
          full_name,
          username,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error("Error creating post:", error);
      throw error;
    }

    if (!newPostData) {
      throw new Error("No data returned from post creation");
    }
    
    const createdPost = newPostData as PostRow & { author: Pick<ProfileRow, "full_name" | "username" | "avatar_url"> | null };

    return {
      ...createdPost,
      author: createdPost.author || undefined,
      user_has_liked: false, // New post is not liked by default
      // Ensure all PostRow fields are mapped
      id: createdPost.id,
      community_id: createdPost.community_id,
      // author_id is already part of PostRow
      title: createdPost.title,
      content: createdPost.content,
      post_type: createdPost.post_type,
      is_pinned: createdPost.is_pinned,
      like_count: createdPost.like_count,
      comment_count: createdPost.comment_count,
      created_at: createdPost.created_at,
      updated_at: createdPost.updated_at,
    };
  }
};

export default postService;

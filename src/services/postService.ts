import { supabase } from "@/integrations/supabase/client";
import type { Database } from "@/integrations/supabase/types";

// Define more specific types based on your Database types
type PostRow = Database["public"]["Tables"]["posts"]["Row"];
type ProfileRow = Database["public"]["Tables"]["profiles"]["Row"];
type PostLikeRow = Database["public"]["Tables"]["post_likes"]["Row"];

// Define a more accurate type for the author object as returned by Supabase join
type PostAuthor = Pick<ProfileRow, "full_name" | "username" | "avatar_url"> | null;

// Combined type for Post with author details
export interface Post extends PostRow { // Inherit all fields from PostRow
  author?: PostAuthor; // Make author optional and use the PostAuthor type
  user_has_liked?: boolean;
}

// Changed to type alias to resolve lint warning
export type PostLike = PostLikeRow;

export const postService = {
  async getPosts(communityId: string, userId?: string): Promise<Post[]> {
    const {  postsData, error } = await supabase
      .from("posts")
      .select(`
        *,
        author:profiles!posts_author_id_fkey ( 
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

    // postsData should now be an array of PostRow with an optional author object
    const postsWithAuthorDetails = postsData.map(p => ({
      ...p,
      // Supabase might return an array for the join, take the first element or null
      author: Array.isArray(p.author) ? p.author[0] : p.author, 
    })) as unknown as Array<PostRow & { author: PostAuthor }>;

    if (userId) {
      const postIds = postsWithAuthorDetails.map(post => post.id);
      const { data: likesData, error: likesError } = await supabase
        .from("post_likes")
        .select("post_id")
        .eq("user_id", userId)
        .in("post_id", postIds);

      if (likesError) {
        console.error("Error fetching post likes:", likesError);
        // Decide how to handle this - perhaps return posts without like status or throw
      }

      const likedPostIds = new Set(likesData?.map(like => like.post_id) || []);

      return postsWithAuthorDetails.map(post => ({
        ...post,
        user_has_liked: likedPostIds.has(post.id)
      }));
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
    const {  newPostData, error } = await supabase
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
        author:profiles!posts_author_id_fkey (
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
    
    // newPostData should be a single PostRow with an optional author object
    const createdPostWithAuthorDetails = {
      ...newPostData,
      // Supabase might return an array for the join, take the first element or null
      author: Array.isArray(newPostData.author) ? newPostData.author[0] : newPostData.author,
      user_has_liked: false, // New post is not liked by default
    } as unknown as Post;


    return createdPostWithAuthorDetails;
  }
};

export default postService;

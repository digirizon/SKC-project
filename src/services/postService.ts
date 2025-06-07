import { supabase } from "@/integrations/supabase/client";

export interface Post {
  id: string;
  community_id: string;
  author_id: string;
  title?: string;
  content: string;
  post_type: string;
  is_pinned: boolean;
  like_count: number;
  comment_count: number;
  created_at: string;
  updated_at: string;
  author?: {
    full_name: string;
    username: string;
    avatar_url: string;
  };
  user_has_liked?: boolean;
}

export interface PostLike {
  id: string;
  post_id: string;
  user_id: string;
  created_at: string;
}

export const postService = {
  async getPosts(communityId: string, userId?: string): Promise<Post[]> {
    const { data: posts, error } = await supabase
      .from('posts')
      .select(`
        *,
        profiles:author_id (
          full_name,
          username,
          avatar_url
        )
      `)
      .eq('community_id', communityId)
      .order('created_at', { ascending: false });
    
    if (error) {
      console.error('Error fetching posts:', error);
      throw error;
    }

    if (!posts) return [];

    // Check if user has liked each post
    if (userId) {
      const postIds = posts.map((post: any) => post.id);
      const { data: likes } = await supabase
        .from('post_likes')
        .select('post_id')
        .eq('user_id', userId)
        .in('post_id', postIds);

      const likedPostIds = new Set(likes?.map((like: any) => like.post_id) || []);

      return posts.map((post: any) => ({
        ...post,
        author: post.profiles,
        user_has_liked: likedPostIds.has(post.id)
      }));
    }

    return posts.map((post: any) => ({
      ...post,
      author: post.profiles,
      user_has_liked: false
    }));
  },

  async likePost(postId: string, userId: string): Promise<boolean> {
    try {
      // Check if user already liked this post
      const { data: existingLike } = await supabase
        .from('post_likes')
        .select('id')
        .eq('post_id', postId)
        .eq('user_id', userId)
        .single();

      if (existingLike) {
        // Unlike the post
        const { error: deleteError } = await supabase
          .from('post_likes')
          .delete()
          .eq('post_id', postId)
          .eq('user_id', userId);

        if (deleteError) throw deleteError;

        // Decrease like count using raw SQL
        const { error: updateError } = await supabase.rpc('decrement_like_count', {
          post_id: postId
        });

        if (updateError) {
          // Fallback: manually update like count
          const { data: currentPost } = await supabase
            .from('posts')
            .select('like_count')
            .eq('id', postId)
            .single();

          if (currentPost) {
            await supabase
              .from('posts')
              .update({ like_count: Math.max(0, currentPost.like_count - 1) })
              .eq('id', postId);
          }
        }

        return false; // Post was unliked
      } else {
        // Like the post
        const { error: insertError } = await supabase
          .from('post_likes')
          .insert({ post_id: postId, user_id: userId });

        if (insertError) throw insertError;

        // Increase like count using raw SQL
        const { error: updateError } = await supabase.rpc('increment_like_count', {
          post_id: postId
        });

        if (updateError) {
          // Fallback: manually update like count
          const { data: currentPost } = await supabase
            .from('posts')
            .select('like_count')
            .eq('id', postId)
            .single();

          if (currentPost) {
            await supabase
              .from('posts')
              .update({ like_count: currentPost.like_count + 1 })
              .eq('id', postId);
          }
        }

        return true; // Post was liked
      }
    } catch (error) {
      console.error('Error toggling post like:', error);
      throw error;
    }
  },

  async createPost(communityId: string, authorId: string, content: string, title?: string, postType: string = 'discussion'): Promise<Post> {
    const { data, error } = await supabase
      .from('posts')
      .insert({
        community_id: communityId,
        author_id: authorId,
        title,
        content,
        post_type: postType
      })
      .select(`
        *,
        profiles:author_id (
          full_name,
          username,
          avatar_url
        )
      `)
      .single();

    if (error) {
      console.error('Error creating post:', error);
      throw error;
    }

    if (!data) {
      throw new Error('No data returned from post creation');
    }

    return {
      ...data,
      author: (data as any).profiles,
      user_has_liked: false
    };
  }
};

export default postService;

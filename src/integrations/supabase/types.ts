
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      chat_conversations: {
        Row: {
          id: string
          participant1_id: string | null
          participant2_id: string | null
          last_message_at: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          participant1_id?: string | null
          participant2_id?: string | null
          last_message_at?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          participant1_id?: string | null
          participant2_id?: string | null
          last_message_at?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          id: string
          conversation_id: string | null
          sender_id: string | null
          content: string
          is_read: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          conversation_id?: string | null
          sender_id?: string | null
          content: string
          is_read?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          conversation_id?: string | null
          sender_id?: string | null
          content?: string
          is_read?: boolean | null
          created_at?: string | null
        }
        Relationships: []
      }
      comment_likes: {
        Row: {
          id: string
          comment_id: string | null
          user_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          comment_id?: string | null
          user_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          comment_id?: string | null
          user_id?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      comments: {
        Row: {
          id: string
          post_id: string | null
          author_id: string | null
          content: string
          like_count: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          post_id?: string | null
          author_id?: string | null
          content: string
          like_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          post_id?: string | null
          author_id?: string | null
          content?: string
          like_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      communities: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          avatar_url: string | null
          category: string | null
          price_type: string | null
          price_amount: number | null
          price_period: string | null
          member_count: number | null
          rank: number | null
          owner_id: string
          is_public: boolean | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          avatar_url?: string | null
          category?: string | null
          price_type?: string | null
          price_amount?: number | null
          price_period?: string | null
          member_count?: number | null
          rank?: number | null
          owner_id: string
          is_public?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          avatar_url?: string | null
          category?: string | null
          price_type?: string | null
          price_amount?: number | null
          price_period?: string | null
          member_count?: number | null
          rank?: number | null
          owner_id?: string
          is_public?: boolean | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      community_memberships: {
        Row: {
          id: string
          community_id: string | null
          user_id: string | null
          role: string | null
          joined_at: string | null
        }
        Insert: {
          id?: string
          community_id?: string | null
          user_id?: string | null
          role?: string | null
          joined_at?: string | null
        }
        Update: {
          id?: string
          community_id?: string | null
          user_id?: string | null
          role?: string | null
          joined_at?: string | null
        }
        Relationships: []
      }
      leaderboard_entries: {
        Row: {
          id: string
          community_id: string | null
          user_id: string | null
          points: number | null
          rank: number | null
          period: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          community_id?: string | null
          user_id?: string | null
          points?: number | null
          rank?: number | null
          period?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          community_id?: string | null
          user_id?: string | null
          points?: number | null
          rank?: number | null
          period?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      notifications: {
        Row: {
          id: string
          user_id: string | null
          type: string
          title: string
          message: string
          related_id: string | null
          community_id: string | null
          is_read: boolean | null
          created_at: string | null
        }
        Insert: {
          id?: string
          user_id?: string | null
          type: string
          title: string
          message: string
          related_id?: string | null
          community_id?: string | null
          is_read?: boolean | null
          created_at?: string | null
        }
        Update: {
          id?: string
          user_id?: string | null
          type?: string
          title?: string
          message?: string
          related_id?: string | null
          community_id?: string | null
          is_read?: boolean | null
          created_at?: string | null
        }
        Relationships: []
      }
      post_likes: {
        Row: {
          id: string
          post_id: string | null
          user_id: string | null
          created_at: string | null
        }
        Insert: {
          id?: string
          post_id?: string | null
          user_id?: string | null
          created_at?: string | null
        }
        Update: {
          id?: string
          post_id?: string | null
          user_id?: string | null
          created_at?: string | null
        }
        Relationships: []
      }
      posts: {
        Row: {
          id: string
          community_id: string | null
          author_id: string | null
          title: string | null
          content: string
          post_type: string | null
          is_pinned: boolean | null
          like_count: number | null
          comment_count: number | null
          created_at: string | null
          updated_at: string | null
        }
        Insert: {
          id?: string
          community_id?: string | null
          author_id?: string | null
          title?: string | null
          content: string
          post_type?: string | null
          is_pinned?: boolean | null
          like_count?: number | null
          comment_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          community_id?: string | null
          author_id?: string | null
          title?: string | null
          content?: string
          post_type?: string | null
          is_pinned?: boolean | null
          like_count?: number | null
          comment_count?: number | null
          created_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
      profiles: {
        Row: {
          id: string
          full_name: string | null
          username: string | null
          avatar_url: string | null
          bio: string | null
          level: number | null
          points: number | null
          online_status: boolean | null
          joined_at: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          full_name?: string | null
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          level?: number | null
          points?: number | null
          online_status?: boolean | null
          joined_at?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          full_name?: string | null
          username?: string | null
          avatar_url?: string | null
          bio?: string | null
          level?: number | null
          points?: number | null
          online_status?: boolean | null
          joined_at?: string | null
          updated_at?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_like_count: {
        Args: {
          post_id: string
        }
        Returns: undefined
      }
      decrement_like_count: {
        Args: {
          post_id: string
        }
        Returns: undefined
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

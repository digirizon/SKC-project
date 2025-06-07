
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
      communities: {
        Row: {
          id: string
          name: string
          description: string | null
          image_url: string | null
          avatar_url: string | null
          created_at: string
          owner_id: string | null
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          image_url?: string | null
          avatar_url?: string | null
          created_at?: string
          owner_id?: string | null
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          image_url?: string | null
          avatar_url?: string | null
          created_at?: string
          owner_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "communities_owner_id_fkey"
            columns: ["owner_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          }
        ]
      }
      posts: {
        Row: {
          id: string
          community_id: string
          author_id: string
          title: string | null
          content: string
          post_type: string // e.g., 'discussion', 'announcement', 'lesson'
          is_pinned: boolean
          like_count: number
          comment_count: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          community_id: string
          author_id: string
          title?: string | null
          content: string
          post_type?: string
          is_pinned?: boolean
          like_count?: number
          comment_count?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          community_id?: string
          author_id?: string
          title?: string | null
          content?: string
          post_type?: string
          is_pinned?: boolean
          like_count?: number
          comment_count?: number
          created_at?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "posts_author_id_fkey"
            columns: ["author_id"]
            referencedRelation: "profiles"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "posts_community_id_fkey"
            columns: ["community_id"]
            referencedRelation: "communities"
            referencedColumns: ["id"]
          }
        ]
      }
      post_likes: {
        Row: {
          id: string
          post_id: string
          user_id: string
          created_at: string
        }
        Insert: {
          id?: string
          post_id: string
          user_id: string
          created_at?: string
        }
        Update: {
          id?: string
          post_id?: string
          user_id?: string
          created_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "post_likes_post_id_fkey"
            columns: ["post_id"]
            referencedRelation: "posts"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "post_likes_user_id_fkey"
            columns: ["user_id"]
            referencedRelation: "profiles" // Assuming you have a profiles table linked to auth.users
            referencedColumns: ["id"]
          }
        ]
      }
      profiles: { // Assuming a profiles table for user metadata
        Row: {
          id: string // Typically mirrors auth.users.id
          username: string | null
          full_name: string | null
          avatar_url: string | null
          updated_at: string | null
        }
        Insert: {
          id: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
        }
        Update: {
          id?: string
          username?: string | null
          full_name?: string | null
          avatar_url?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "profiles_id_fkey"
            columns: ["id"]
            referencedRelation: "users"
            referencedColumns: ["id"]
          }
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      increment_like_count: { // Renamed from increment for clarity
        Args: {
          post_id: string
        }
        Returns: undefined 
      }
      decrement_like_count: { // Renamed from decrement for clarity
        Args: {
          post_id: string
        }
        Returns: undefined
      }
      // Example: If you had a function to get user profile
      // get_user_profile: {
      //   Args: {
      //     user_id: string
      //   }
      //   Returns: {
      //     username: string
      //     full_name: string
      //     avatar_url: string
      //   }[]
      // }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

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
      users: {
        Row: {
          id: string
          email: string
          name: string | null
          height: number // in cm
          age: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          email: string
          name?: string | null
          height: number
          age: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          email?: string
          name?: string | null
          height?: number
          age?: number
          created_at?: string
          updated_at?: string
        }
      }
      daily_logs: {
        Row: {
          id: string
          user_id: string
          date: string
          weight: number
          activity_calories: number
          is_training_day: boolean
          is_weekend: boolean
          bmr: number
          activity_base: number
          apple_watch_modifier: number
          weekend_modifier: number
          training_bonus: number
          target_calories: number
          target_protein: number
          target_carbs: number
          target_fat: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          date: string
          weight: number
          activity_calories: number
          is_training_day?: boolean
          is_weekend?: boolean
          bmr: number
          activity_base: number
          apple_watch_modifier: number
          weekend_modifier: number
          training_bonus: number
          target_calories: number
          target_protein: number
          target_carbs: number
          target_fat: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          date?: string
          weight?: number
          activity_calories?: number
          is_training_day?: boolean
          is_weekend?: boolean
          bmr?: number
          activity_base?: number
          apple_watch_modifier?: number
          weekend_modifier?: number
          training_bonus?: number
          target_calories?: number
          target_protein?: number
          target_carbs?: number
          target_fat?: number
          created_at?: string
          updated_at?: string
        }
      }
      food_entries: {
        Row: {
          id: string
          user_id: string
          daily_log_id: string
          description: string
          image_url: string | null
          calories: number
          protein: number
          carbs: number
          fat: number
          source: 'user_input' | 'photo_analysis' | 'database'
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          daily_log_id: string
          description: string
          image_url?: string | null
          calories: number
          protein: number
          carbs: number
          fat: number
          source: 'user_input' | 'photo_analysis' | 'database'
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          daily_log_id?: string
          description?: string
          image_url?: string | null
          calories?: number
          protein?: number
          carbs?: number
          fat?: number
          source?: 'user_input' | 'photo_analysis' | 'database'
          created_at?: string
          updated_at?: string
        }
      }
      personal_foods: {
        Row: {
          id: string
          user_id: string
          name: string
          description: string | null
          calories: number
          protein: number
          carbs: number
          fat: number
          serving_size: string
          times_logged: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          name: string
          description?: string | null
          calories: number
          protein: number
          carbs: number
          fat: number
          serving_size: string
          times_logged?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          name?: string
          description?: string | null
          calories?: number
          protein?: number
          carbs?: number
          fat?: number
          serving_size?: string
          times_logged?: number
          created_at?: string
          updated_at?: string
        }
      }
      project_foods: {
        Row: {
          id: string
          name: string
          description: string | null
          calories: number
          protein: number
          carbs: number
          fat: number
          serving_size: string
          category: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          name: string
          description?: string | null
          calories: number
          protein: number
          carbs: number
          fat: number
          serving_size: string
          category?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          name?: string
          description?: string | null
          calories?: number
          protein?: number
          carbs?: number
          fat?: number
          serving_size?: string
          category?: string | null
          created_at?: string
          updated_at?: string
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
  }
}

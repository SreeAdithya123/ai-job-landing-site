export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      interview_analyses: {
        Row: {
          areas_for_improvement: string[] | null
          communication_score: number | null
          confidence_score: number | null
          created_at: string
          duration_minutes: number | null
          feedback: string | null
          id: string
          interview_type: string
          overall_score: number | null
          problem_solving_score: number | null
          strengths: string[] | null
          technical_score: number | null
          transcript_summary: string | null
          updated_at: string
          user_id: string
        }
        Insert: {
          areas_for_improvement?: string[] | null
          communication_score?: number | null
          confidence_score?: number | null
          created_at?: string
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          interview_type: string
          overall_score?: number | null
          problem_solving_score?: number | null
          strengths?: string[] | null
          technical_score?: number | null
          transcript_summary?: string | null
          updated_at?: string
          user_id: string
        }
        Update: {
          areas_for_improvement?: string[] | null
          communication_score?: number | null
          confidence_score?: number | null
          created_at?: string
          duration_minutes?: number | null
          feedback?: string | null
          id?: string
          interview_type?: string
          overall_score?: number | null
          problem_solving_score?: number | null
          strengths?: string[] | null
          technical_score?: number | null
          transcript_summary?: string | null
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
      interview_questions: {
        Row: {
          ai_feedback: string | null
          confidence_score: number | null
          created_at: string
          fluency_score: number | null
          id: string
          interview_analysis_id: string
          question_order: number | null
          question_score: number | null
          question_text: string
          user_answer: string
        }
        Insert: {
          ai_feedback?: string | null
          confidence_score?: number | null
          created_at?: string
          fluency_score?: number | null
          id?: string
          interview_analysis_id: string
          question_order?: number | null
          question_score?: number | null
          question_text: string
          user_answer: string
        }
        Update: {
          ai_feedback?: string | null
          confidence_score?: number | null
          created_at?: string
          fluency_score?: number | null
          id?: string
          interview_analysis_id?: string
          question_order?: number | null
          question_score?: number | null
          question_text?: string
          user_answer?: string
        }
        Relationships: [
          {
            foreignKeyName: "interview_questions_interview_analysis_id_fkey"
            columns: ["interview_analysis_id"]
            isOneToOne: false
            referencedRelation: "interview_analyses"
            referencedColumns: ["id"]
          },
        ]
      }
      interviews: {
        Row: {
          answer: string
          feedback: string | null
          id: string
          question: string
          timestamp: string
          user_id: string
        }
        Insert: {
          answer: string
          feedback?: string | null
          id?: string
          question: string
          timestamp?: string
          user_id: string
        }
        Update: {
          answer?: string
          feedback?: string | null
          id?: string
          question?: string
          timestamp?: string
          user_id?: string
        }
        Relationships: []
      }
      profiles: {
        Row: {
          avatar_url: string | null
          created_at: string
          email: string | null
          full_name: string | null
          id: string
          updated_at: string
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id: string
          updated_at?: string
        }
        Update: {
          avatar_url?: string | null
          created_at?: string
          email?: string | null
          full_name?: string | null
          id?: string
          updated_at?: string
        }
        Relationships: []
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
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

type DefaultSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? (Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      Database[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : DefaultSchemaTableNameOrOptions extends keyof (DefaultSchema["Tables"] &
        DefaultSchema["Views"])
    ? (DefaultSchema["Tables"] &
        DefaultSchema["Views"])[DefaultSchemaTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  DefaultSchemaTableNameOrOptions extends
    | keyof DefaultSchema["Tables"]
    | { schema: keyof Database },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : DefaultSchemaTableNameOrOptions extends keyof DefaultSchema["Tables"]
    ? DefaultSchema["Tables"][DefaultSchemaTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  DefaultSchemaEnumNameOrOptions extends
    | keyof DefaultSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends { schema: keyof Database }
  ? Database[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

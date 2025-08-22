export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  // Allows to automatically instantiate createClient with right options
  // instead of createClient<Database, { PostgrestVersion: 'XX' }>(URL, KEY)
  __InternalSupabase: {
    PostgrestVersion: "12.2.12 (cd3cf9e)"
  }
  public: {
    Tables: {
      elevenlabs_transcripts: {
        Row: {
          content: string
          conversation_id: string | null
          created_at: string
          id: string
          interview_id: string
          timestamp: string
          updated_at: string
          user_id: string
        }
        Insert: {
          content: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          interview_id: string
          timestamp: string
          updated_at?: string
          user_id: string
        }
        Update: {
          content?: string
          conversation_id?: string | null
          created_at?: string
          id?: string
          interview_id?: string
          timestamp?: string
          updated_at?: string
          user_id?: string
        }
        Relationships: []
      }
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
      interview_sessions: {
        Row: {
          ai_feedback: string | null
          audio_url: string | null
          created_at: string
          duration_minutes: number | null
          id: string
          interview_type: string
          question: string
          session_id: string
          timestamp_end: string | null
          timestamp_start: string | null
          transcript: Json
          updated_at: string
          user_id: string
          user_response: string
        }
        Insert: {
          ai_feedback?: string | null
          audio_url?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          interview_type?: string
          question: string
          session_id: string
          timestamp_end?: string | null
          timestamp_start?: string | null
          transcript?: Json
          updated_at?: string
          user_id: string
          user_response: string
        }
        Update: {
          ai_feedback?: string | null
          audio_url?: string | null
          created_at?: string
          duration_minutes?: number | null
          id?: string
          interview_type?: string
          question?: string
          session_id?: string
          timestamp_end?: string | null
          timestamp_start?: string | null
          transcript?: Json
          updated_at?: string
          user_id?: string
          user_response?: string
        }
        Relationships: []
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
      store_elevenlabs_transcript: {
        Args: {
          p_content: string
          p_conversation_id?: string
          p_interview_id: string
          p_timestamp: string
          p_user_id: string
        }
        Returns: string
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

type DatabaseWithoutInternals = Omit<Database, "__InternalSupabase">

type DefaultSchema = DatabaseWithoutInternals[Extract<keyof Database, "public">]

export type Tables<
  DefaultSchemaTableNameOrOptions extends
    | keyof (DefaultSchema["Tables"] & DefaultSchema["Views"])
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
        DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? (DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"] &
      DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Views"])[TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  TableName extends DefaultSchemaTableNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = DefaultSchemaTableNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaTableNameOrOptions["schema"]]["Tables"][TableName] extends {
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
    | { schema: keyof DatabaseWithoutInternals },
  EnumName extends DefaultSchemaEnumNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = DefaultSchemaEnumNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[DefaultSchemaEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : DefaultSchemaEnumNameOrOptions extends keyof DefaultSchema["Enums"]
    ? DefaultSchema["Enums"][DefaultSchemaEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof DefaultSchema["CompositeTypes"]
    | { schema: keyof DatabaseWithoutInternals },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof DatabaseWithoutInternals
  }
    ? keyof DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends {
  schema: keyof DatabaseWithoutInternals
}
  ? DatabaseWithoutInternals[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof DefaultSchema["CompositeTypes"]
    ? DefaultSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

export const Constants = {
  public: {
    Enums: {},
  },
} as const

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
    PostgrestVersion: "14.1"
  }
  public: {
    Tables: {
      ai_chat_logs: {
        Row: {
          assistant_response: string
          created_at: string
          id: string
          language: string | null
          session_id: string
          telegram_user_id: number | null
          user_message: string
        }
        Insert: {
          assistant_response: string
          created_at?: string
          id?: string
          language?: string | null
          session_id: string
          telegram_user_id?: number | null
          user_message: string
        }
        Update: {
          assistant_response?: string
          created_at?: string
          id?: string
          language?: string | null
          session_id?: string
          telegram_user_id?: number | null
          user_message?: string
        }
        Relationships: [
          {
            foreignKeyName: "ai_chat_logs_telegram_user_id_fkey"
            columns: ["telegram_user_id"]
            isOneToOne: false
            referencedRelation: "telegram_profiles"
            referencedColumns: ["telegram_id"]
          },
        ]
      }
      crm_data: {
        Row: {
          add_to_experts: string | null
          available_skills: string | null
          birth_date: string | null
          birth_date_manual: string | null
          birthday_enabled: boolean | null
          birthday_enabled_manual: boolean | null
          block_id: string | null
          business_card_link: string | null
          checklist_answers: string | null
          city: string | null
          code: string | null
          conditions: string | null
          contract_date: string | null
          contract_date_manual: string | null
          contract_link: string | null
          contract_link_chat: string | null
          contract_signing: string | null
          created_at: string
          days_worked: number | null
          disabled_aa: boolean | null
          disabled_ac: boolean | null
          disabled_ae: boolean | null
          disabled_n: boolean | null
          disabled_y: boolean | null
          dismissal_date: string | null
          feedback_date: string | null
          full_info: string | null
          full_info_manual: string | null
          hr: string | null
          hr_chat_id: string | null
          hr_comment: string | null
          hr_manual: string | null
          hr_robot: string | null
          id: string
          in_app: boolean | null
          interview: string | null
          interview_date: string | null
          language: string | null
          language_choice: string | null
          level: string | null
          level_manual: string | null
          phone: string | null
          photo_link: string | null
          portal: string | null
          profile_link: string | null
          progress: string | null
          projects_in_work: number | null
          projects_mailing: string | null
          protalk_id: string | null
          rating: string | null
          region: string | null
          rejection_date: string | null
          rejection_date_manual: string | null
          rejection_id: string | null
          reminders_disabled: boolean | null
          reporting: string | null
          result: string | null
          result_manual: string | null
          resume_link: string | null
          resume_link_chat: string | null
          resume_text: string | null
          rf_phone: string | null
          rop_name: string | null
          row_hash: string | null
          sending: string | null
          start_date: string | null
          status: string | null
          status_manual: string | null
          telegram_id: number | null
          telegram_name: string | null
          test_conditions: string | null
          test_portal: string | null
          test_report: string | null
          test_robot: string | null
          tests_manual: string | null
          tests_passed: string | null
          to_experts: string | null
          to_experts_manual: string | null
          training_completed: string | null
          updated_at: string
          video_card: string | null
          video_script: string | null
          waiting_period: string | null
          work_start: string | null
          work_start_date: string | null
        }
        Insert: {
          add_to_experts?: string | null
          available_skills?: string | null
          birth_date?: string | null
          birth_date_manual?: string | null
          birthday_enabled?: boolean | null
          birthday_enabled_manual?: boolean | null
          block_id?: string | null
          business_card_link?: string | null
          checklist_answers?: string | null
          city?: string | null
          code?: string | null
          conditions?: string | null
          contract_date?: string | null
          contract_date_manual?: string | null
          contract_link?: string | null
          contract_link_chat?: string | null
          contract_signing?: string | null
          created_at?: string
          days_worked?: number | null
          disabled_aa?: boolean | null
          disabled_ac?: boolean | null
          disabled_ae?: boolean | null
          disabled_n?: boolean | null
          disabled_y?: boolean | null
          dismissal_date?: string | null
          feedback_date?: string | null
          full_info?: string | null
          full_info_manual?: string | null
          hr?: string | null
          hr_chat_id?: string | null
          hr_comment?: string | null
          hr_manual?: string | null
          hr_robot?: string | null
          id?: string
          in_app?: boolean | null
          interview?: string | null
          interview_date?: string | null
          language?: string | null
          language_choice?: string | null
          level?: string | null
          level_manual?: string | null
          phone?: string | null
          photo_link?: string | null
          portal?: string | null
          profile_link?: string | null
          progress?: string | null
          projects_in_work?: number | null
          projects_mailing?: string | null
          protalk_id?: string | null
          rating?: string | null
          region?: string | null
          rejection_date?: string | null
          rejection_date_manual?: string | null
          rejection_id?: string | null
          reminders_disabled?: boolean | null
          reporting?: string | null
          result?: string | null
          result_manual?: string | null
          resume_link?: string | null
          resume_link_chat?: string | null
          resume_text?: string | null
          rf_phone?: string | null
          rop_name?: string | null
          row_hash?: string | null
          sending?: string | null
          start_date?: string | null
          status?: string | null
          status_manual?: string | null
          telegram_id?: number | null
          telegram_name?: string | null
          test_conditions?: string | null
          test_portal?: string | null
          test_report?: string | null
          test_robot?: string | null
          tests_manual?: string | null
          tests_passed?: string | null
          to_experts?: string | null
          to_experts_manual?: string | null
          training_completed?: string | null
          updated_at?: string
          video_card?: string | null
          video_script?: string | null
          waiting_period?: string | null
          work_start?: string | null
          work_start_date?: string | null
        }
        Update: {
          add_to_experts?: string | null
          available_skills?: string | null
          birth_date?: string | null
          birth_date_manual?: string | null
          birthday_enabled?: boolean | null
          birthday_enabled_manual?: boolean | null
          block_id?: string | null
          business_card_link?: string | null
          checklist_answers?: string | null
          city?: string | null
          code?: string | null
          conditions?: string | null
          contract_date?: string | null
          contract_date_manual?: string | null
          contract_link?: string | null
          contract_link_chat?: string | null
          contract_signing?: string | null
          created_at?: string
          days_worked?: number | null
          disabled_aa?: boolean | null
          disabled_ac?: boolean | null
          disabled_ae?: boolean | null
          disabled_n?: boolean | null
          disabled_y?: boolean | null
          dismissal_date?: string | null
          feedback_date?: string | null
          full_info?: string | null
          full_info_manual?: string | null
          hr?: string | null
          hr_chat_id?: string | null
          hr_comment?: string | null
          hr_manual?: string | null
          hr_robot?: string | null
          id?: string
          in_app?: boolean | null
          interview?: string | null
          interview_date?: string | null
          language?: string | null
          language_choice?: string | null
          level?: string | null
          level_manual?: string | null
          phone?: string | null
          photo_link?: string | null
          portal?: string | null
          profile_link?: string | null
          progress?: string | null
          projects_in_work?: number | null
          projects_mailing?: string | null
          protalk_id?: string | null
          rating?: string | null
          region?: string | null
          rejection_date?: string | null
          rejection_date_manual?: string | null
          rejection_id?: string | null
          reminders_disabled?: boolean | null
          reporting?: string | null
          result?: string | null
          result_manual?: string | null
          resume_link?: string | null
          resume_link_chat?: string | null
          resume_text?: string | null
          rf_phone?: string | null
          rop_name?: string | null
          row_hash?: string | null
          sending?: string | null
          start_date?: string | null
          status?: string | null
          status_manual?: string | null
          telegram_id?: number | null
          telegram_name?: string | null
          test_conditions?: string | null
          test_portal?: string | null
          test_report?: string | null
          test_robot?: string | null
          tests_manual?: string | null
          tests_passed?: string | null
          to_experts?: string | null
          to_experts_manual?: string | null
          training_completed?: string | null
          updated_at?: string
          video_card?: string | null
          video_script?: string | null
          waiting_period?: string | null
          work_start?: string | null
          work_start_date?: string | null
        }
        Relationships: []
      }
      faq_knowledge: {
        Row: {
          answer: string
          answer_en: string | null
          answer_kz: string | null
          category: string | null
          created_at: string
          id: string
          question: string
          question_en: string | null
          question_kz: string | null
          row_hash: string | null
          search_keywords: string | null
          updated_at: string
        }
        Insert: {
          answer: string
          answer_en?: string | null
          answer_kz?: string | null
          category?: string | null
          created_at?: string
          id?: string
          question: string
          question_en?: string | null
          question_kz?: string | null
          row_hash?: string | null
          search_keywords?: string | null
          updated_at?: string
        }
        Update: {
          answer?: string
          answer_en?: string | null
          answer_kz?: string | null
          category?: string | null
          created_at?: string
          id?: string
          question?: string
          question_en?: string | null
          question_kz?: string | null
          row_hash?: string | null
          search_keywords?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      project_swipes: {
        Row: {
          action: string
          created_at: string
          id: string
          project_code: string
          project_id: string
          telegram_id: number
          updated_at: string
        }
        Insert: {
          action: string
          created_at?: string
          id?: string
          project_code: string
          project_id: string
          telegram_id: number
          updated_at?: string
        }
        Update: {
          action?: string
          created_at?: string
          id?: string
          project_code?: string
          project_id?: string
          telegram_id?: number
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "project_swipes_project_id_fkey"
            columns: ["project_id"]
            isOneToOne: false
            referencedRelation: "projects_data"
            referencedColumns: ["id"]
          },
        ]
      }
      projects_data: {
        Row: {
          availability: string | null
          created_at: string
          description: string | null
          dpr: string | null
          dpr_link: string | null
          id: string
          manager_link: string | null
          project_code: string
          project_manager: string | null
          project_status: string | null
          region: string | null
          row_hash: string | null
          updated_at: string
        }
        Insert: {
          availability?: string | null
          created_at?: string
          description?: string | null
          dpr?: string | null
          dpr_link?: string | null
          id?: string
          manager_link?: string | null
          project_code: string
          project_manager?: string | null
          project_status?: string | null
          region?: string | null
          row_hash?: string | null
          updated_at?: string
        }
        Update: {
          availability?: string | null
          created_at?: string
          description?: string | null
          dpr?: string | null
          dpr_link?: string | null
          id?: string
          manager_link?: string | null
          project_code?: string
          project_manager?: string | null
          project_status?: string | null
          region?: string | null
          row_hash?: string | null
          updated_at?: string
        }
        Relationships: []
      }
      telegram_profiles: {
        Row: {
          created_at: string
          first_name: string | null
          id: string
          language_code: string | null
          last_name: string | null
          photo_url: string | null
          telegram_id: number
          updated_at: string
          username: string | null
        }
        Insert: {
          created_at?: string
          first_name?: string | null
          id?: string
          language_code?: string | null
          last_name?: string | null
          photo_url?: string | null
          telegram_id: number
          updated_at?: string
          username?: string | null
        }
        Update: {
          created_at?: string
          first_name?: string | null
          id?: string
          language_code?: string | null
          last_name?: string | null
          photo_url?: string | null
          telegram_id?: number
          updated_at?: string
          username?: string | null
        }
        Relationships: []
      }
      translations: {
        Row: {
          category: string | null
          created_at: string
          id: string
          key: string
          text_en: string
          text_kz: string
          text_ru: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          created_at?: string
          id?: string
          key: string
          text_en?: string
          text_kz?: string
          text_ru?: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          created_at?: string
          id?: string
          key?: string
          text_en?: string
          text_kz?: string
          text_ru?: string
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

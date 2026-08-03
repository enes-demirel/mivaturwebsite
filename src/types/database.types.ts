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
    PostgrestVersion: "14.15"
  }
  public: {
    Tables: {
      admin_users: {
        Row: {
          created_at: string
          email: string
          user_id: string
        }
        Insert: {
          created_at?: string
          email: string
          user_id: string
        }
        Update: {
          created_at?: string
          email?: string
          user_id?: string
        }
        Relationships: []
      }
      blog_posts: {
        Row: {
          category: string | null
          content: string | null
          cover_image_alt: string | null
          cover_image_path: string | null
          created_at: string
          excerpt: string
          featured: boolean
          id: string
          published_at: string | null
          reading_time: number | null
          seo_description: string | null
          seo_title: string | null
          slug: string
          sort_order: number
          status: string
          title: string
          updated_at: string
        }
        Insert: {
          category?: string | null
          content?: string | null
          cover_image_alt?: string | null
          cover_image_path?: string | null
          created_at?: string
          excerpt: string
          featured?: boolean
          id?: string
          published_at?: string | null
          reading_time?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug: string
          sort_order?: number
          status?: string
          title: string
          updated_at?: string
        }
        Update: {
          category?: string | null
          content?: string | null
          cover_image_alt?: string | null
          cover_image_path?: string | null
          created_at?: string
          excerpt?: string
          featured?: boolean
          id?: string
          published_at?: string | null
          reading_time?: number | null
          seo_description?: string | null
          seo_title?: string | null
          slug?: string
          sort_order?: number
          status?: string
          title?: string
          updated_at?: string
        }
        Relationships: []
      }
      destinations: {
        Row: {
          content: string | null
          country_code: string | null
          created_at: string
          id: string
          map_featured: boolean
          map_latitude: number | null
          map_longitude: number | null
          map_order: number
          mobile_visible: boolean
          name: string
          seo_description: string | null
          seo_title: string | null
          short_description: string | null
          slug: string
          status: string
          type: string
          updated_at: string
        }
        Insert: {
          content?: string | null
          country_code?: string | null
          created_at?: string
          id?: string
          map_featured?: boolean
          map_latitude?: number | null
          map_longitude?: number | null
          map_order?: number
          mobile_visible?: boolean
          name: string
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug: string
          status?: string
          type: string
          updated_at?: string
        }
        Update: {
          content?: string | null
          country_code?: string | null
          created_at?: string
          id?: string
          map_featured?: boolean
          map_latitude?: number | null
          map_longitude?: number | null
          map_order?: number
          mobile_visible?: boolean
          name?: string
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string | null
          slug?: string
          status?: string
          type?: string
          updated_at?: string
        }
        Relationships: []
      }
      reservation_requests: {
        Row: {
          admin_note: string | null
          created_at: string
          departure_id: string | null
          full_name: string
          id: string
          note: string | null
          phone: string
          source: string
          status: string
          tour_id: string | null
          updated_at: string
        }
        Insert: {
          admin_note?: string | null
          created_at?: string
          departure_id?: string | null
          full_name: string
          id?: string
          note?: string | null
          phone: string
          source?: string
          status?: string
          tour_id?: string | null
          updated_at?: string
        }
        Update: {
          admin_note?: string | null
          created_at?: string
          departure_id?: string | null
          full_name?: string
          id?: string
          note?: string | null
          phone?: string
          source?: string
          status?: string
          tour_id?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "reservation_requests_departure_id_fkey"
            columns: ["departure_id"]
            isOneToOne: false
            referencedRelation: "tour_departures"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "reservation_requests_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      site_settings: {
        Row: {
          key: string
          updated_at: string
          updated_by: string | null
          value: Json
        }
        Insert: {
          key: string
          updated_at?: string
          updated_by?: string | null
          value: Json
        }
        Update: {
          key?: string
          updated_at?: string
          updated_by?: string | null
          value?: Json
        }
        Relationships: []
      }
      tour_departures: {
        Row: {
          airline: string | null
          arrival_point: string | null
          created_at: string
          currency: string
          departure_city: string
          end_date: string
          id: string
          previous_price: number | null
          price: number
          start_date: string
          status: string
          tour_id: string
          transportation_note: string | null
          updated_at: string
        }
        Insert: {
          airline?: string | null
          arrival_point?: string | null
          created_at?: string
          currency: string
          departure_city: string
          end_date: string
          id?: string
          previous_price?: number | null
          price: number
          start_date: string
          status?: string
          tour_id: string
          transportation_note?: string | null
          updated_at?: string
        }
        Update: {
          airline?: string | null
          arrival_point?: string | null
          created_at?: string
          currency?: string
          departure_city?: string
          end_date?: string
          id?: string
          previous_price?: number | null
          price?: number
          start_date?: string
          status?: string
          tour_id?: string
          transportation_note?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_departures_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_destinations: {
        Row: {
          destination_id: string
          sort_order: number
          tour_id: string
        }
        Insert: {
          destination_id: string
          sort_order?: number
          tour_id: string
        }
        Update: {
          destination_id?: string
          sort_order?: number
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_destinations_destination_id_fkey"
            columns: ["destination_id"]
            isOneToOne: false
            referencedRelation: "destinations"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "tour_destinations_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_faqs: {
        Row: {
          answer: string
          created_at: string
          id: string
          published: boolean
          question: string
          sort_order: number
          tour_id: string
          updated_at: string
        }
        Insert: {
          answer: string
          created_at?: string
          id?: string
          published?: boolean
          question: string
          sort_order?: number
          tour_id: string
          updated_at?: string
        }
        Update: {
          answer?: string
          created_at?: string
          id?: string
          published?: boolean
          question?: string
          sort_order?: number
          tour_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_faqs_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_gallery: {
        Row: {
          alt_text: string
          created_at: string
          id: string
          is_cover: boolean
          sort_order: number
          storage_path: string
          tour_id: string
        }
        Insert: {
          alt_text: string
          created_at?: string
          id?: string
          is_cover?: boolean
          sort_order?: number
          storage_path: string
          tour_id: string
        }
        Update: {
          alt_text?: string
          created_at?: string
          id?: string
          is_cover?: boolean
          sort_order?: number
          storage_path?: string
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_gallery_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_hotels: {
        Row: {
          city: string
          hotel_name: string
          id: string
          night_count: number
          sort_order: number
          stars: number | null
          tour_id: string
        }
        Insert: {
          city: string
          hotel_name: string
          id?: string
          night_count: number
          sort_order?: number
          stars?: number | null
          tour_id: string
        }
        Update: {
          city?: string
          hotel_name?: string
          id?: string
          night_count?: number
          sort_order?: number
          stars?: number | null
          tour_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_hotels_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_important_notes: {
        Row: {
          content: string
          created_at: string
          id: string
          sort_order: number
          title: string | null
          tour_id: string
          updated_at: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          sort_order?: number
          title?: string | null
          tour_id: string
          updated_at?: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          sort_order?: number
          title?: string | null
          tour_id?: string
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_important_notes_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_itinerary_days: {
        Row: {
          accommodation: string | null
          created_at: string
          day_number: number
          description: string | null
          highlights: Json
          id: string
          image_alt: string | null
          image_path: string | null
          meals: string | null
          route: string | null
          summary: string | null
          title: string
          tour_id: string
          transportation: string | null
          updated_at: string
        }
        Insert: {
          accommodation?: string | null
          created_at?: string
          day_number: number
          description?: string | null
          highlights?: Json
          id?: string
          image_alt?: string | null
          image_path?: string | null
          meals?: string | null
          route?: string | null
          summary?: string | null
          title: string
          tour_id: string
          transportation?: string | null
          updated_at?: string
        }
        Update: {
          accommodation?: string | null
          created_at?: string
          day_number?: number
          description?: string | null
          highlights?: Json
          id?: string
          image_alt?: string | null
          image_path?: string | null
          meals?: string | null
          route?: string | null
          summary?: string | null
          title?: string
          tour_id?: string
          transportation?: string | null
          updated_at?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_itinerary_days_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tour_service_items: {
        Row: {
          content: string
          created_at: string
          id: string
          sort_order: number
          tour_id: string
          type: string
        }
        Insert: {
          content: string
          created_at?: string
          id?: string
          sort_order?: number
          tour_id: string
          type: string
        }
        Update: {
          content?: string
          created_at?: string
          id?: string
          sort_order?: number
          tour_id?: string
          type?: string
        }
        Relationships: [
          {
            foreignKeyName: "tour_service_items_tour_id_fkey"
            columns: ["tour_id"]
            isOneToOne: false
            referencedRelation: "tours"
            referencedColumns: ["id"]
          },
        ]
      }
      tours: {
        Row: {
          cover_image_path: string | null
          created_at: string
          duration_days: number
          duration_nights: number
          featured_home: boolean
          featured_order: number
          id: string
          long_description: string | null
          pdf_path: string | null
          region: string | null
          room_occupancy_label: string | null
          seo_description: string | null
          seo_title: string | null
          short_description: string
          single_room_supplement: number | null
          single_room_supplement_currency: string | null
          slug: string
          status: string
          title: string
          transportation_type: string | null
          type: string
          updated_at: string
          visa_status: string | null
        }
        Insert: {
          cover_image_path?: string | null
          created_at?: string
          duration_days: number
          duration_nights?: number
          featured_home?: boolean
          featured_order?: number
          id?: string
          long_description?: string | null
          pdf_path?: string | null
          region?: string | null
          room_occupancy_label?: string | null
          seo_description?: string | null
          seo_title?: string | null
          short_description: string
          single_room_supplement?: number | null
          single_room_supplement_currency?: string | null
          slug: string
          status?: string
          title: string
          transportation_type?: string | null
          type: string
          updated_at?: string
          visa_status?: string | null
        }
        Update: {
          cover_image_path?: string | null
          created_at?: string
          duration_days?: number
          duration_nights?: number
          featured_home?: boolean
          featured_order?: number
          id?: string
          long_description?: string | null
          pdf_path?: string | null
          region?: string | null
          room_occupancy_label?: string | null
          seo_description?: string | null
          seo_title?: string | null
          short_description?: string
          single_room_supplement?: number | null
          single_room_supplement_currency?: string | null
          slug?: string
          status?: string
          title?: string
          transportation_type?: string | null
          type?: string
          updated_at?: string
          visa_status?: string | null
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      is_admin: { Args: never; Returns: boolean }
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

export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  graphql_public: {
    Tables: {
      [_ in never]: never
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      graphql: {
        Args: {
          operationName?: string
          query?: string
          variables?: Json
          extensions?: Json
        }
        Returns: Json
      }
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
  public: {
    Tables: {
      event_2024cacc: {
        Row: {
          alliance: boolean
          author: string | null
          event: string
          match: number
          team: number
        }
        Insert: {
          alliance: boolean
          author?: string | null
          event: string
          match: number
          team: number
        }
        Update: {
          alliance?: boolean
          author?: string | null
          event?: string
          match?: number
          team?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_author"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "users_2024cacc"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "fk_event"
            columns: ["event"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event"]
          },
          {
            foreignKeyName: "fk_teams"
            columns: ["team"]
            isOneToOne: false
            referencedRelation: "teams_2024cacc"
            referencedColumns: ["team"]
          },
        ]
      }
      event_2024casf: {
        Row: {
          alliance: boolean
          author: string | null
          event: string
          match: number
          team: number
        }
        Insert: {
          alliance: boolean
          author?: string | null
          event: string
          match: number
          team: number
        }
        Update: {
          alliance?: boolean
          author?: string | null
          event?: string
          match?: number
          team?: number
        }
        Relationships: [
          {
            foreignKeyName: "event_2024casf_author_fkey"
            columns: ["author"]
            isOneToOne: false
            referencedRelation: "users_2024casf"
            referencedColumns: ["name"]
          },
          {
            foreignKeyName: "event_2024casf_event_fkey"
            columns: ["event"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event"]
          },
          {
            foreignKeyName: "event_2024casf_team_fkey"
            columns: ["team"]
            isOneToOne: false
            referencedRelation: "teams_2024casf"
            referencedColumns: ["team"]
          },
        ]
      }
      event_data: {
        Row: {
          alliance: boolean
          author: string | null
          event: string
          match: number
          team: number
        }
        Insert: {
          alliance: boolean
          author?: string | null
          event: string
          match: number
          team: number
        }
        Update: {
          alliance?: boolean
          author?: string | null
          event?: string
          match?: number
          team?: number
        }
        Relationships: []
      }
      events: {
        Row: {
          date: string
          event: string
          id: number
        }
        Insert: {
          date: string
          event: string
          id?: number
        }
        Update: {
          date?: string
          event?: string
          id?: number
        }
        Relationships: []
      }
      match_data: {
        Row: {
          alliance: boolean
          amp: number
          author: string
          auto: Json
          auto_position: number
          climb: boolean
          comment: string
          defense: boolean
          disabled: number
          event: string
          match: number
          miss: number
          speaker: number
          team: number
        }
        Insert: {
          alliance: boolean
          amp: number
          author: string
          auto: Json
          auto_position?: number
          climb: boolean
          comment: string
          defense: boolean
          disabled: number
          event: string
          match: number
          miss: number
          speaker: number
          team: number
        }
        Update: {
          alliance?: boolean
          amp?: number
          author?: string
          auto?: Json
          auto_position?: number
          climb?: boolean
          comment?: string
          defense?: boolean
          disabled?: number
          event?: string
          match?: number
          miss?: number
          speaker?: number
          team?: number
        }
        Relationships: []
      }
      matches_2024cacc: {
        Row: {
          alliance: boolean
          amp: number
          author: string
          auto: Json
          auto_position: number
          climb: boolean
          comment: string
          defense: boolean
          disabled: number
          event: string
          match: number
          miss: number
          speaker: number
          team: number
        }
        Insert: {
          alliance: boolean
          amp: number
          author: string
          auto: Json
          auto_position?: number
          climb: boolean
          comment: string
          defense: boolean
          disabled: number
          event: string
          match: number
          miss: number
          speaker: number
          team: number
        }
        Update: {
          alliance?: boolean
          amp?: number
          author?: string
          auto?: Json
          auto_position?: number
          climb?: boolean
          comment?: string
          defense?: boolean
          disabled?: number
          event?: string
          match?: number
          miss?: number
          speaker?: number
          team?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_match"
            columns: ["event", "match", "team"]
            isOneToOne: true
            referencedRelation: "event_2024cacc"
            referencedColumns: ["event", "match", "team"]
          },
        ]
      }
      matches_2024casf: {
        Row: {
          alliance: boolean
          amp: number
          author: string
          auto: Json
          auto_position: number
          climb: boolean
          comment: string
          defense: boolean
          disabled: number
          event: string
          match: number
          miss: number
          speaker: number
          team: number
        }
        Insert: {
          alliance: boolean
          amp: number
          author: string
          auto: Json
          auto_position?: number
          climb: boolean
          comment: string
          defense: boolean
          disabled: number
          event: string
          match: number
          miss: number
          speaker: number
          team: number
        }
        Update: {
          alliance?: boolean
          amp?: number
          author?: string
          auto?: Json
          auto_position?: number
          climb?: boolean
          comment?: string
          defense?: boolean
          disabled?: number
          event?: string
          match?: number
          miss?: number
          speaker?: number
          team?: number
        }
        Relationships: [
          {
            foreignKeyName: "matches_2024casf_event_fkey"
            columns: ["event"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event"]
          },
          {
            foreignKeyName: "matches_2024casf_match_event_team_fkey"
            columns: ["match", "event", "team"]
            isOneToOne: false
            referencedRelation: "event_2024casf"
            referencedColumns: ["match", "event", "team"]
          },
        ]
      }
      team_data: {
        Row: {
          avg_amp: number
          avg_score: number
          avg_speaker: number
          defense: number
          event: string
          failures: number
          team: number
        }
        Insert: {
          avg_amp: number
          avg_score: number
          avg_speaker: number
          defense: number
          event: string
          failures: number
          team: number
        }
        Update: {
          avg_amp?: number
          avg_score?: number
          avg_speaker?: number
          defense?: number
          event?: string
          failures?: number
          team?: number
        }
        Relationships: []
      }
      teams_2024cacc: {
        Row: {
          avg_amp: number
          avg_score: number
          avg_speaker: number
          defense: number
          event: string
          failures: number
          team: number
        }
        Insert: {
          avg_amp: number
          avg_score: number
          avg_speaker: number
          defense: number
          event: string
          failures: number
          team: number
        }
        Update: {
          avg_amp?: number
          avg_score?: number
          avg_speaker?: number
          defense?: number
          event?: string
          failures?: number
          team?: number
        }
        Relationships: [
          {
            foreignKeyName: "fk_event"
            columns: ["event"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event"]
          },
        ]
      }
      teams_2024casf: {
        Row: {
          avg_amp: number
          avg_score: number
          avg_speaker: number
          defense: number
          event: string
          failures: number
          team: number
        }
        Insert: {
          avg_amp: number
          avg_score: number
          avg_speaker: number
          defense: number
          event: string
          failures: number
          team: number
        }
        Update: {
          avg_amp?: number
          avg_score?: number
          avg_speaker?: number
          defense?: number
          event?: string
          failures?: number
          team?: number
        }
        Relationships: [
          {
            foreignKeyName: "teams_2024casf_event_fkey"
            columns: ["event"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event"]
          },
        ]
      }
      users: {
        Row: {
          event: string
          id: number
          matches: number
          name: string
        }
        Insert: {
          event: string
          id?: number
          matches: number
          name: string
        }
        Update: {
          event?: string
          id?: number
          matches?: number
          name?: string
        }
        Relationships: []
      }
      users_2024cacc: {
        Row: {
          event: string
          id: number
          matches: number
          name: string
        }
        Insert: {
          event: string
          id: number
          matches: number
          name: string
        }
        Update: {
          event?: string
          id?: number
          matches?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "fk_event"
            columns: ["event"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event"]
          },
        ]
      }
      users_2024casf: {
        Row: {
          event: string
          id: number
          matches: number
          name: string
        }
        Insert: {
          event: string
          id: number
          matches: number
          name: string
        }
        Update: {
          event?: string
          id?: number
          matches?: number
          name?: string
        }
        Relationships: [
          {
            foreignKeyName: "users_2024casf_event_fkey"
            columns: ["event"]
            isOneToOne: false
            referencedRelation: "events"
            referencedColumns: ["event"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      count_teams: {
        Args: {
          event_name: string
        }
        Returns: number
      }
      fetch_average: {
        Args: {
          event_code: string
          team_id: number
        }
        Returns: number
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

type PublicSchema = Database[Extract<keyof Database, "public">]

export type Tables<
  PublicTableNameOrOptions extends
    | keyof (PublicSchema["Tables"] & PublicSchema["Views"])
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
        Database[PublicTableNameOrOptions["schema"]]["Views"])
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? (Database[PublicTableNameOrOptions["schema"]]["Tables"] &
      Database[PublicTableNameOrOptions["schema"]]["Views"])[TableName] extends {
      Row: infer R
    }
    ? R
    : never
  : PublicTableNameOrOptions extends keyof (PublicSchema["Tables"] &
        PublicSchema["Views"])
    ? (PublicSchema["Tables"] &
        PublicSchema["Views"])[PublicTableNameOrOptions] extends {
        Row: infer R
      }
      ? R
      : never
    : never

export type TablesInsert<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Insert: infer I
    }
    ? I
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Insert: infer I
      }
      ? I
      : never
    : never

export type TablesUpdate<
  PublicTableNameOrOptions extends
    | keyof PublicSchema["Tables"]
    | { schema: keyof Database },
  TableName extends PublicTableNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicTableNameOrOptions["schema"]]["Tables"]
    : never = never,
> = PublicTableNameOrOptions extends { schema: keyof Database }
  ? Database[PublicTableNameOrOptions["schema"]]["Tables"][TableName] extends {
      Update: infer U
    }
    ? U
    : never
  : PublicTableNameOrOptions extends keyof PublicSchema["Tables"]
    ? PublicSchema["Tables"][PublicTableNameOrOptions] extends {
        Update: infer U
      }
      ? U
      : never
    : never

export type Enums<
  PublicEnumNameOrOptions extends
    | keyof PublicSchema["Enums"]
    | { schema: keyof Database },
  EnumName extends PublicEnumNameOrOptions extends { schema: keyof Database }
    ? keyof Database[PublicEnumNameOrOptions["schema"]]["Enums"]
    : never = never,
> = PublicEnumNameOrOptions extends { schema: keyof Database }
  ? Database[PublicEnumNameOrOptions["schema"]]["Enums"][EnumName]
  : PublicEnumNameOrOptions extends keyof PublicSchema["Enums"]
    ? PublicSchema["Enums"][PublicEnumNameOrOptions]
    : never

export type CompositeTypes<
  PublicCompositeTypeNameOrOptions extends
    | keyof PublicSchema["CompositeTypes"]
    | { schema: keyof Database },
  CompositeTypeName extends PublicCompositeTypeNameOrOptions extends {
    schema: keyof Database
  }
    ? keyof Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"]
    : never = never,
> = PublicCompositeTypeNameOrOptions extends { schema: keyof Database }
  ? Database[PublicCompositeTypeNameOrOptions["schema"]]["CompositeTypes"][CompositeTypeName]
  : PublicCompositeTypeNameOrOptions extends keyof PublicSchema["CompositeTypes"]
    ? PublicSchema["CompositeTypes"][PublicCompositeTypeNameOrOptions]
    : never

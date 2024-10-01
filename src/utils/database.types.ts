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
        Relationships: []
      }
      event_2024test: {
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
          climb: boolean
          comment: string
          defense: number
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
          climb: boolean
          comment: string
          defense: number
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
          climb?: boolean
          comment?: string
          defense?: number
          disabled?: number
          event?: string
          match?: number
          miss?: number
          speaker?: number
          team?: number
        }
        Relationships: []
      }
      matches_2024casf: {
        Row: {
          alliance: boolean
          amp: number
          author: string
          auto: Json
          climb: boolean
          comment: string
          defense: number
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
          climb: boolean
          comment: string
          defense: number
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
          climb?: boolean
          comment?: string
          defense?: number
          disabled?: number
          event?: string
          match?: number
          miss?: number
          speaker?: number
          team?: number
        }
        Relationships: []
      }
      matches_2024test: {
        Row: {
          alliance: boolean
          amp: number
          author: string
          auto: Json
          climb: boolean
          comment: string
          defense: number
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
          climb: boolean
          comment: string
          defense: number
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
          climb?: boolean
          comment?: string
          defense?: number
          disabled?: number
          event?: string
          match?: number
          miss?: number
          speaker?: number
          team?: number
        }
        Relationships: []
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
        Relationships: []
      }
      teams_2024test: {
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
        Relationships: []
      }
      users_2024test: {
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

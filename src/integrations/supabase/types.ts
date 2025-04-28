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
      arena_game_sessions: {
        Row: {
          created_at: string | null
          custom_formations_allowed: boolean
          gamer_tag_1: string | null
          gamer_tag_2: string | null
          half_length_minutes: number
          id: string
          legacy_defending_allowed: boolean
          mode: Database["public"]["Enums"]["game_mode"]
          platform: Database["public"]["Enums"]["game_platform"]
          team_type: Database["public"]["Enums"]["team_type"]
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          custom_formations_allowed?: boolean
          gamer_tag_1?: string | null
          gamer_tag_2?: string | null
          half_length_minutes?: number
          id: string
          legacy_defending_allowed?: boolean
          mode?: Database["public"]["Enums"]["game_mode"]
          platform?: Database["public"]["Enums"]["game_platform"]
          team_type?: Database["public"]["Enums"]["team_type"]
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          custom_formations_allowed?: boolean
          gamer_tag_1?: string | null
          gamer_tag_2?: string | null
          half_length_minutes?: number
          id?: string
          legacy_defending_allowed?: boolean
          mode?: Database["public"]["Enums"]["game_mode"]
          platform?: Database["public"]["Enums"]["game_platform"]
          team_type?: Database["public"]["Enums"]["team_type"]
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "arena_game_sessions_id_fkey"
            columns: ["id"]
            isOneToOne: true
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
        ]
      }
      arena_players: {
        Row: {
          avatar_url: string | null
          created_at: string | null
          display_name: string
          ea_id: string | null
          id: string
          psn_username: string | null
          updated_at: string | null
          user_id: string
          xbox_gamertag: string | null
        }
        Insert: {
          avatar_url?: string | null
          created_at?: string | null
          display_name: string
          ea_id?: string | null
          id?: string
          psn_username?: string | null
          updated_at?: string | null
          user_id: string
          xbox_gamertag?: string | null
        }
        Update: {
          avatar_url?: string | null
          created_at?: string | null
          display_name?: string
          ea_id?: string | null
          id?: string
          psn_username?: string | null
          updated_at?: string | null
          user_id?: string
          xbox_gamertag?: string | null
        }
        Relationships: []
      }
      audit_logs: {
        Row: {
          action: string
          actor_id: string | null
          created_at: string | null
          details: Json | null
          id: string
          target_id: string | null
        }
        Insert: {
          action: string
          actor_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          target_id?: string | null
        }
        Update: {
          action?: string
          actor_id?: string | null
          created_at?: string | null
          details?: Json | null
          id?: string
          target_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "audit_logs_actor_id_fkey"
            columns: ["actor_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      avatars: {
        Row: {
          created_at: string | null
          image_url: string
          item_id: string
          rarity: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          image_url: string
          item_id: string
          rarity: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          image_url?: string
          item_id?: string
          rarity?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "avatars_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: true
            referencedRelation: "store_items"
            referencedColumns: ["id"]
          },
        ]
      }
      cards: {
        Row: {
          color: string
          created_at: string | null
          id: string
          value: string
        }
        Insert: {
          color: string
          created_at?: string | null
          id?: string
          value: string
        }
        Update: {
          color?: string
          created_at?: string | null
          id?: string
          value?: string
        }
        Relationships: []
      }
      casino_settings: {
        Row: {
          commission_private: number
          commission_public: number
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          commission_private?: number
          commission_public?: number
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          commission_private?: number
          commission_public?: number
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      chat_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          session_id: string
          user_id: string | null
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          session_id: string
          user_id?: string | null
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          session_id?: string
          user_id?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_messages_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "chat_messages_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      chat_words: {
        Row: {
          created_at: string | null
          item_id: string
          special_effect: string
          updated_at: string | null
          usage_rules: string | null
        }
        Insert: {
          created_at?: string | null
          item_id: string
          special_effect: string
          updated_at?: string | null
          usage_rules?: string | null
        }
        Update: {
          created_at?: string | null
          item_id?: string
          special_effect?: string
          updated_at?: string | null
          usage_rules?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "chat_words_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: true
            referencedRelation: "store_items"
            referencedColumns: ["id"]
          },
        ]
      }
      checkers_players: {
        Row: {
          color: string
          created_at: string | null
          pieces_remaining: number
          player_id: string
          updated_at: string | null
        }
        Insert: {
          color: string
          created_at?: string | null
          pieces_remaining?: number
          player_id: string
          updated_at?: string | null
        }
        Update: {
          color?: string
          created_at?: string | null
          pieces_remaining?: number
          player_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checkers_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "game_players"
            referencedColumns: ["id"]
          },
        ]
      }
      checkgame_players: {
        Row: {
          created_at: string | null
          hand_cards: Json
          number_of_cards: number
          player_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          hand_cards?: Json
          number_of_cards?: number
          player_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          hand_cards?: Json
          number_of_cards?: number
          player_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "checkgame_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "game_players"
            referencedColumns: ["id"]
          },
        ]
      }
      documents: {
        Row: {
          file_path: string
          id: string
          kyc_id: string
          type: Database["public"]["Enums"]["document_type"]
          upload_date: string | null
        }
        Insert: {
          file_path: string
          id?: string
          kyc_id: string
          type: Database["public"]["Enums"]["document_type"]
          upload_date?: string | null
        }
        Update: {
          file_path?: string
          id?: string
          kyc_id?: string
          type?: Database["public"]["Enums"]["document_type"]
          upload_date?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "documents_kyc_id_fkey"
            columns: ["kyc_id"]
            isOneToOne: false
            referencedRelation: "kyc_requests"
            referencedColumns: ["id"]
          },
        ]
      }
      duo_bets: {
        Row: {
          amount: number
          bet_code: string
          commission_rate: number | null
          completed_at: string | null
          created_at: string | null
          creator_id: string
          creator_prediction: Database["public"]["Enums"]["duo_bet_result"]
          expires_at: string
          id: string
          is_private: boolean
          match_description: string
          opponent_id: string | null
          opponent_prediction:
            | Database["public"]["Enums"]["duo_bet_result"]
            | null
          result: Database["public"]["Enums"]["duo_bet_result"] | null
          status: Database["public"]["Enums"]["duo_bet_status"] | null
          team_a: string
          team_b: string
        }
        Insert: {
          amount: number
          bet_code?: string
          commission_rate?: number | null
          completed_at?: string | null
          created_at?: string | null
          creator_id: string
          creator_prediction: Database["public"]["Enums"]["duo_bet_result"]
          expires_at: string
          id?: string
          is_private?: boolean
          match_description: string
          opponent_id?: string | null
          opponent_prediction?:
            | Database["public"]["Enums"]["duo_bet_result"]
            | null
          result?: Database["public"]["Enums"]["duo_bet_result"] | null
          status?: Database["public"]["Enums"]["duo_bet_status"] | null
          team_a: string
          team_b: string
        }
        Update: {
          amount?: number
          bet_code?: string
          commission_rate?: number | null
          completed_at?: string | null
          created_at?: string | null
          creator_id?: string
          creator_prediction?: Database["public"]["Enums"]["duo_bet_result"]
          expires_at?: string
          id?: string
          is_private?: boolean
          match_description?: string
          opponent_id?: string | null
          opponent_prediction?:
            | Database["public"]["Enums"]["duo_bet_result"]
            | null
          result?: Database["public"]["Enums"]["duo_bet_result"] | null
          status?: Database["public"]["Enums"]["duo_bet_status"] | null
          team_a?: string
          team_b?: string
        }
        Relationships: []
      }
      fut_players: {
        Row: {
          created_at: string | null
          fut_id: string
          id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          fut_id: string
          id?: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          fut_id?: string
          id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "fut_players_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      game_players: {
        Row: {
          created_at: string | null
          current_score: number | null
          display_name: string
          ea_id: string | null
          has_forfeited: boolean | null
          id: string
          is_connected: boolean | null
          is_ready: boolean | null
          session_id: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          created_at?: string | null
          current_score?: number | null
          display_name: string
          ea_id?: string | null
          has_forfeited?: boolean | null
          id?: string
          is_connected?: boolean | null
          is_ready?: boolean | null
          session_id: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          created_at?: string | null
          current_score?: number | null
          display_name?: string
          ea_id?: string | null
          has_forfeited?: boolean | null
          id?: string
          is_connected?: boolean | null
          is_ready?: boolean | null
          session_id?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "game_players_session_id_fkey"
            columns: ["session_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "game_players_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      game_sessions: {
        Row: {
          commission_rate: number
          connected_players: string[] | null
          created_at: string | null
          current_players: number
          ea_id: string | null
          end_time: string | null
          entry_fee: number
          game_type: Database["public"]["Enums"]["game_type"]
          id: string
          match_duration: number | null
          max_players: number
          pot: number
          room_id: string | null
          room_type: Database["public"]["Enums"]["room_type"]
          start_time: string | null
          status: Database["public"]["Enums"]["session_status"]
          updated_at: string | null
        }
        Insert: {
          commission_rate: number
          connected_players?: string[] | null
          created_at?: string | null
          current_players?: number
          ea_id?: string | null
          end_time?: string | null
          entry_fee: number
          game_type: Database["public"]["Enums"]["game_type"]
          id?: string
          match_duration?: number | null
          max_players: number
          pot?: number
          room_id?: string | null
          room_type: Database["public"]["Enums"]["room_type"]
          start_time?: string | null
          status?: Database["public"]["Enums"]["session_status"]
          updated_at?: string | null
        }
        Update: {
          commission_rate?: number
          connected_players?: string[] | null
          created_at?: string | null
          current_players?: number
          ea_id?: string | null
          end_time?: string | null
          entry_fee?: number
          game_type?: Database["public"]["Enums"]["game_type"]
          id?: string
          match_duration?: number | null
          max_players?: number
          pot?: number
          room_id?: string | null
          room_type?: Database["public"]["Enums"]["room_type"]
          start_time?: string | null
          status?: Database["public"]["Enums"]["session_status"]
          updated_at?: string | null
        }
        Relationships: []
      }
      game_types: {
        Row: {
          code: Database["public"]["Enums"]["game_variant"]
          created_at: string | null
          id: string
          image_url: string | null
          is_active: boolean | null
          is_configurable: boolean | null
          max_players: number
          min_players: number
          name: string
          updated_at: string | null
        }
        Insert: {
          code: Database["public"]["Enums"]["game_variant"]
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_configurable?: boolean | null
          max_players: number
          min_players: number
          name: string
          updated_at?: string | null
        }
        Update: {
          code?: Database["public"]["Enums"]["game_variant"]
          created_at?: string | null
          id?: string
          image_url?: string | null
          is_active?: boolean | null
          is_configurable?: boolean | null
          max_players?: number
          min_players?: number
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      kyc_requests: {
        Row: {
          id: string
          reviewed_at: string | null
          reviewed_by: string | null
          status: Database["public"]["Enums"]["kyc_status"]
          submitted_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          submitted_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          reviewed_at?: string | null
          reviewed_by?: string | null
          status?: Database["public"]["Enums"]["kyc_status"]
          submitted_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "kyc_requests_reviewed_by_fkey"
            columns: ["reviewed_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "kyc_requests_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      ludo_players: {
        Row: {
          created_at: string | null
          pawn_color: string
          pawn_positions: Json
          player_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          pawn_color: string
          pawn_positions?: Json
          player_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          pawn_color?: string
          pawn_positions?: Json
          player_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "ludo_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "game_players"
            referencedColumns: ["id"]
          },
        ]
      }
      market_types: {
        Row: {
          created_at: string | null
          description: string | null
          id: number
          name: string
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: number
          name: string
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: number
          name?: string
        }
        Relationships: []
      }
      notifications: {
        Row: {
          body: string
          created_at: string | null
          id: string
          read: boolean | null
          title: string
          type: string
          user_id: string
        }
        Insert: {
          body: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          title: string
          type: string
          user_id: string
        }
        Update: {
          body?: string
          created_at?: string | null
          id?: string
          read?: boolean | null
          title?: string
          type?: string
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "notifications_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      sport_leagues: {
        Row: {
          data: Json | null
          id: number
          image_path: string | null
          name: string
          updated_at: string | null
        }
        Insert: {
          data?: Json | null
          id: number
          image_path?: string | null
          name: string
          updated_at?: string | null
        }
        Update: {
          data?: Json | null
          id?: number
          image_path?: string | null
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      sport_matches: {
        Row: {
          data: Json | null
          id: number
          is_active: boolean | null
          league_id: number
          scores: Json | null
          starting_at: string
          status: string | null
          team_a: string
          team_a_id: number | null
          team_a_image: string | null
          team_b: string
          team_b_id: number | null
          team_b_image: string | null
          updated_at: string | null
        }
        Insert: {
          data?: Json | null
          id: number
          is_active?: boolean | null
          league_id: number
          scores?: Json | null
          starting_at: string
          status?: string | null
          team_a: string
          team_a_id?: number | null
          team_a_image?: string | null
          team_b: string
          team_b_id?: number | null
          team_b_image?: string | null
          updated_at?: string | null
        }
        Update: {
          data?: Json | null
          id?: number
          is_active?: boolean | null
          league_id?: number
          scores?: Json | null
          starting_at?: string
          status?: string | null
          team_a?: string
          team_a_id?: number | null
          team_a_image?: string | null
          team_b?: string
          team_b_id?: number | null
          team_b_image?: string | null
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "sport_matches_league_id_fkey"
            columns: ["league_id"]
            isOneToOne: false
            referencedRelation: "sport_leagues"
            referencedColumns: ["id"]
          },
        ]
      }
      store: {
        Row: {
          created_at: string | null
          id: string
          name: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          id?: string
          name: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          id?: string
          name?: string
          updated_at?: string | null
        }
        Relationships: []
      }
      store_items: {
        Row: {
          created_at: string | null
          description: string | null
          id: string
          item_type: string
          name: string
          price: number
          store_id: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          description?: string | null
          id?: string
          item_type: string
          name: string
          price: number
          store_id: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          description?: string | null
          id?: string
          item_type?: string
          name?: string
          price?: number
          store_id?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "store_items_store_id_fkey"
            columns: ["store_id"]
            isOneToOne: false
            referencedRelation: "store"
            referencedColumns: ["id"]
          },
        ]
      }
      support_messages: {
        Row: {
          content: string
          created_at: string | null
          id: string
          sender_id: string | null
          ticket_id: string
        }
        Insert: {
          content: string
          created_at?: string | null
          id?: string
          sender_id?: string | null
          ticket_id: string
        }
        Update: {
          content?: string
          created_at?: string | null
          id?: string
          sender_id?: string | null
          ticket_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "support_messages_ticket_id_fkey"
            columns: ["ticket_id"]
            isOneToOne: false
            referencedRelation: "support_tickets"
            referencedColumns: ["id"]
          },
        ]
      }
      support_tickets: {
        Row: {
          category: Database["public"]["Enums"]["ticket_category"]
          created_at: string | null
          id: string
          status: Database["public"]["Enums"]["ticket_status"]
          subject: string
          updated_at: string | null
          user_id: string
        }
        Insert: {
          category: Database["public"]["Enums"]["ticket_category"]
          created_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["ticket_status"]
          subject: string
          updated_at?: string | null
          user_id: string
        }
        Update: {
          category?: Database["public"]["Enums"]["ticket_category"]
          created_at?: string | null
          id?: string
          status?: Database["public"]["Enums"]["ticket_status"]
          subject?: string
          updated_at?: string | null
          user_id?: string
        }
        Relationships: []
      }
      tictactoe_players: {
        Row: {
          created_at: string | null
          player_id: string
          symbol: string
          updated_at: string | null
        }
        Insert: {
          created_at?: string | null
          player_id: string
          symbol: string
          updated_at?: string | null
        }
        Update: {
          created_at?: string | null
          player_id?: string
          symbol?: string
          updated_at?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "tictactoe_players_player_id_fkey"
            columns: ["player_id"]
            isOneToOne: true
            referencedRelation: "game_players"
            referencedColumns: ["id"]
          },
        ]
      }
      transactions: {
        Row: {
          amount: number
          created_at: string | null
          description: string | null
          id: string
          payment_method: string | null
          source_balance: Database["public"]["Enums"]["balance_source"]
          status: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at: string | null
          wallet_id: string
        }
        Insert: {
          amount: number
          created_at?: string | null
          description?: string | null
          id?: string
          payment_method?: string | null
          source_balance: Database["public"]["Enums"]["balance_source"]
          status?: Database["public"]["Enums"]["transaction_status"]
          type: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          wallet_id: string
        }
        Update: {
          amount?: number
          created_at?: string | null
          description?: string | null
          id?: string
          payment_method?: string | null
          source_balance?: Database["public"]["Enums"]["balance_source"]
          status?: Database["public"]["Enums"]["transaction_status"]
          type?: Database["public"]["Enums"]["transaction_type"]
          updated_at?: string | null
          wallet_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "transactions_wallet_id_fkey"
            columns: ["wallet_id"]
            isOneToOne: false
            referencedRelation: "wallets"
            referencedColumns: ["id"]
          },
        ]
      }
      user_items: {
        Row: {
          id: string
          item_id: string
          purchased_at: string | null
          user_id: string
        }
        Insert: {
          id?: string
          item_id: string
          purchased_at?: string | null
          user_id: string
        }
        Update: {
          id?: string
          item_id?: string
          purchased_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "user_items_item_id_fkey"
            columns: ["item_id"]
            isOneToOne: false
            referencedRelation: "store_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "user_items_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      users: {
        Row: {
          active_room_id: string | null
          activision_username: string | null
          avatar_url: string | null
          country: string | null
          created_at: string | null
          ea_id: string | null
          email: string
          epic_username: string | null
          equipped_avatar_id: string | null
          first_name: string
          id: string
          is_connected: boolean | null
          last_name: string
          phone: string | null
          psn_username: string | null
          referral_code: string | null
          referred_by: string | null
          role: Database["public"]["Enums"]["user_role"]
          updated_at: string | null
          username: string
          xbox_gamertag: string | null
        }
        Insert: {
          active_room_id?: string | null
          activision_username?: string | null
          avatar_url?: string | null
          country?: string | null
          created_at?: string | null
          ea_id?: string | null
          email: string
          epic_username?: string | null
          equipped_avatar_id?: string | null
          first_name: string
          id?: string
          is_connected?: boolean | null
          last_name: string
          phone?: string | null
          psn_username?: string | null
          referral_code?: string | null
          referred_by?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          username: string
          xbox_gamertag?: string | null
        }
        Update: {
          active_room_id?: string | null
          activision_username?: string | null
          avatar_url?: string | null
          country?: string | null
          created_at?: string | null
          ea_id?: string | null
          email?: string
          epic_username?: string | null
          equipped_avatar_id?: string | null
          first_name?: string
          id?: string
          is_connected?: boolean | null
          last_name?: string
          phone?: string | null
          psn_username?: string | null
          referral_code?: string | null
          referred_by?: string | null
          role?: Database["public"]["Enums"]["user_role"]
          updated_at?: string | null
          username?: string
          xbox_gamertag?: string | null
        }
        Relationships: [
          {
            foreignKeyName: "users_active_room_id_fkey"
            columns: ["active_room_id"]
            isOneToOne: false
            referencedRelation: "game_sessions"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_equipped_avatar_id_fkey"
            columns: ["equipped_avatar_id"]
            isOneToOne: false
            referencedRelation: "store_items"
            referencedColumns: ["id"]
          },
          {
            foreignKeyName: "users_referred_by_fkey"
            columns: ["referred_by"]
            isOneToOne: false
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
      wallets: {
        Row: {
          bonus_balance: number
          created_at: string | null
          currency: string | null
          id: string
          real_balance: number
          updated_at: string | null
          user_id: string
        }
        Insert: {
          bonus_balance?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          real_balance?: number
          updated_at?: string | null
          user_id: string
        }
        Update: {
          bonus_balance?: number
          created_at?: string | null
          currency?: string | null
          id?: string
          real_balance?: number
          updated_at?: string | null
          user_id?: string
        }
        Relationships: [
          {
            foreignKeyName: "wallets_user_id_fkey"
            columns: ["user_id"]
            isOneToOne: true
            referencedRelation: "users"
            referencedColumns: ["id"]
          },
        ]
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      calculate_prize_pool: {
        Args: { session_id: string }
        Returns: number
      }
      deduct_entry_fee: {
        Args: { p_user_id: string; p_amount: number }
        Returns: {
          new_balance: number
        }[]
      }
      get_available_markets: {
        Args: Record<PropertyKey, never>
        Returns: {
          id: number
          name: string
          description: string
          created_at: string
        }[]
      }
      get_matches_by_date: {
        Args: { target_date: string }
        Returns: {
          id: number
          league_id: number
          league_name: string
          league_image: string
          starting_at: string
          team_a: string
          team_b: string
          team_a_image: string
          team_b_image: string
          status: string
          scores: Json
          match_data: Json
        }[]
      }
      has_active_room: {
        Args: { p_user_id: string }
        Returns: string
      }
      is_admin: {
        Args: Record<PropertyKey, never>
        Returns: boolean
      }
      purchase_item: {
        Args: {
          p_item_id: string
          p_user_id: string
          p_price: number
          p_item_name: string
        }
        Returns: {
          new_balance: number
        }[]
      }
    }
    Enums: {
      balance_source: "real" | "bonus"
      document_type: "ID" | "ProofOfAddress" | "Passport"
      duo_bet_result: "TeamA" | "TeamB" | "Draw"
      duo_bet_status: "Pending" | "Active" | "Completed" | "Cancelled"
      game_code:
        | "ludo"
        | "tictactoe"
        | "chess"
        | "checkers"
        | "futarena"
        | "checkgame"
      game_mode: "online_friendlies" | "fut"
      game_platform: "ps5" | "xbox_series" | "cross_play"
      game_type:
        | "Ludo"
        | "Checkers"
        | "TicTacToe"
        | "CheckGame"
        | "FUTArena"
        | "Madden24"
        | "NBA2K24"
        | "NHL24"
      game_variant:
        | "ludo"
        | "checkers"
        | "tictactoe"
        | "checkgame"
        | "futarena"
        | "eafc25"
        | "madden24"
        | "nba2k24"
        | "nhl24"
      kyc_status: "Pending" | "Approved" | "Rejected"
      room_type: "public" | "private"
      session_status: "Waiting" | "Active" | "Finished"
      team_type: "any_teams" | "85_rated" | "country" | "fut_team"
      ticket_category: "Technical" | "Billing" | "Behavior" | "Other"
      ticket_status: "Open" | "InProgress" | "Resolved" | "Closed"
      transaction_status: "Pending" | "Success" | "Failed" | "Rejected"
      transaction_type:
        | "Deposit"
        | "Withdrawal"
        | "Stake"
        | "Winnings"
        | "Bonus"
        | "StorePurchase"
        | "ReferralReward"
      user_role: "PLAYER" | "ADMIN"
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
    Enums: {
      balance_source: ["real", "bonus"],
      document_type: ["ID", "ProofOfAddress", "Passport"],
      duo_bet_result: ["TeamA", "TeamB", "Draw"],
      duo_bet_status: ["Pending", "Active", "Completed", "Cancelled"],
      game_code: [
        "ludo",
        "tictactoe",
        "chess",
        "checkers",
        "futarena",
        "checkgame",
      ],
      game_mode: ["online_friendlies", "fut"],
      game_platform: ["ps5", "xbox_series", "cross_play"],
      game_type: [
        "Ludo",
        "Checkers",
        "TicTacToe",
        "CheckGame",
        "FUTArena",
        "Madden24",
        "NBA2K24",
        "NHL24",
      ],
      game_variant: [
        "ludo",
        "checkers",
        "tictactoe",
        "checkgame",
        "futarena",
        "eafc25",
        "madden24",
        "nba2k24",
        "nhl24",
      ],
      kyc_status: ["Pending", "Approved", "Rejected"],
      room_type: ["public", "private"],
      session_status: ["Waiting", "Active", "Finished"],
      team_type: ["any_teams", "85_rated", "country", "fut_team"],
      ticket_category: ["Technical", "Billing", "Behavior", "Other"],
      ticket_status: ["Open", "InProgress", "Resolved", "Closed"],
      transaction_status: ["Pending", "Success", "Failed", "Rejected"],
      transaction_type: [
        "Deposit",
        "Withdrawal",
        "Stake",
        "Winnings",
        "Bonus",
        "StorePurchase",
        "ReferralReward",
      ],
      user_role: ["PLAYER", "ADMIN"],
    },
  },
} as const

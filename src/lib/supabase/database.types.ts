export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export type Database = {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          email: string;
          full_name: string | null;
          role:
            | "admin"
            | "direccion"
            | "comercial"
            | "tecnico"
            | "soporte"
            | "finanzas"
            | "solo_lectura";
          is_active: boolean;
        };
        Insert: {
          id: string;
          created_at?: string;
          updated_at?: string;
          email: string;
          full_name?: string | null;
          role?:
            | "admin"
            | "direccion"
            | "comercial"
            | "tecnico"
            | "soporte"
            | "finanzas"
            | "solo_lectura";
          is_active?: boolean;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          email?: string;
          full_name?: string | null;
          role?:
            | "admin"
            | "direccion"
            | "comercial"
            | "tecnico"
            | "soporte"
            | "finanzas"
            | "solo_lectura";
          is_active?: boolean;
        };
        Relationships: [];
      };

      companies: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          assigned_commercial_id: string | null;
          assigned_technical_id: string | null;
          commercial_name: string;
          legal_name: string | null;
          tax_id: string | null;
          email: string | null;
          phone: string | null;
          website: string | null;
          sector: string | null;
          source: string | null;
          address: string | null;
          city: string | null;
          province: string | null;
          postal_code: string | null;
          country: string;
          status:
            | "prospecto"
            | "contactado"
            | "oportunidad"
            | "cliente"
            | "inactivo"
            | "descartado";
          potential: "bajo" | "medio" | "alto" | "estrategico";
          risk_level: "bajo" | "normal" | "alto";
          status_reason: string | null;
          notes: string | null;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          assigned_commercial_id?: string | null;
          assigned_technical_id?: string | null;
          commercial_name: string;
          legal_name?: string | null;
          tax_id?: string | null;
          email?: string | null;
          phone?: string | null;
          website?: string | null;
          sector?: string | null;
          source?: string | null;
          address?: string | null;
          city?: string | null;
          province?: string | null;
          postal_code?: string | null;
          country?: string;
          status?:
            | "prospecto"
            | "contactado"
            | "oportunidad"
            | "cliente"
            | "inactivo"
            | "descartado";
          potential?: "bajo" | "medio" | "alto" | "estrategico";
          risk_level?: "bajo" | "normal" | "alto";
          status_reason?: string | null;
          notes?: string | null;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          assigned_commercial_id?: string | null;
          assigned_technical_id?: string | null;
          commercial_name?: string;
          legal_name?: string | null;
          tax_id?: string | null;
          email?: string | null;
          phone?: string | null;
          website?: string | null;
          sector?: string | null;
          source?: string | null;
          address?: string | null;
          city?: string | null;
          province?: string | null;
          postal_code?: string | null;
          country?: string;
          status?:
            | "prospecto"
            | "contactado"
            | "oportunidad"
            | "cliente"
            | "inactivo"
            | "descartado";
          potential?: "bajo" | "medio" | "alto" | "estrategico";
          risk_level?: "bajo" | "normal" | "alto";
          status_reason?: string | null;
          notes?: string | null;
          deleted_at?: string | null;
        };
        Relationships: [];
      };

      contacts: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          first_name: string;
          last_name: string | null;
          email: string | null;
          phone: string | null;
          mobile: string | null;
          job_title: string | null;
          preferred_channel:
            | "email"
            | "telefono"
            | "whatsapp"
            | "reunion"
            | "indiferente";
          language: string;
          contact_schedule: string | null;
          consent_notes: string | null;
          notes: string | null;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          first_name: string;
          last_name?: string | null;
          email?: string | null;
          phone?: string | null;
          mobile?: string | null;
          job_title?: string | null;
          preferred_channel?:
            | "email"
            | "telefono"
            | "whatsapp"
            | "reunion"
            | "indiferente";
          language?: string;
          contact_schedule?: string | null;
          consent_notes?: string | null;
          notes?: string | null;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          first_name?: string;
          last_name?: string | null;
          email?: string | null;
          phone?: string | null;
          mobile?: string | null;
          job_title?: string | null;
          preferred_channel?:
            | "email"
            | "telefono"
            | "whatsapp"
            | "reunion"
            | "indiferente";
          language?: string;
          contact_schedule?: string | null;
          consent_notes?: string | null;
          notes?: string | null;
          deleted_at?: string | null;
        };
        Relationships: [];
      };

      company_contacts: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          company_id: string;
          contact_id: string;
          role:
            | "comercial"
            | "tecnico"
            | "administracion"
            | "emergencias"
            | "direccion"
            | "general";
          job_title: string | null;
          is_primary: boolean;
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          company_id: string;
          contact_id: string;
          role?:
            | "comercial"
            | "tecnico"
            | "administracion"
            | "emergencias"
            | "direccion"
            | "general";
          job_title?: string | null;
          is_primary?: boolean;
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          company_id?: string;
          contact_id?: string;
          role?:
            | "comercial"
            | "tecnico"
            | "administracion"
            | "emergencias"
            | "direccion"
            | "general";
          job_title?: string | null;
          is_primary?: boolean;
          notes?: string | null;
        };
        Relationships: [];
      };

      opportunities: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          assigned_to: string | null;
          company_id: string;
          contact_id: string | null;
          title: string;
          description: string | null;
          status: "abierta" | "ganada" | "perdida" | "pospuesta" | "no_encaja";
          stage:
            | "detectada"
            | "contactada"
            | "reunion"
            | "propuesta"
            | "negociacion"
            | "ganada"
            | "perdida";
          temperature: "fria" | "templada" | "caliente";
          probability: number;
          one_time_value: number;
          expected_mrr: number;
          estimated_cost: number;
          estimated_margin: number;
          source: string | null;
          campaign: string | null;
          referred_by: string | null;
          competitor: string | null;
          detected_need: string | null;
          next_action: string | null;
          next_action_at: string | null;
          expected_close_date: string | null;
          lost_reason: string | null;
          won_at: string | null;
          lost_at: string | null;
          notes: string | null;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          assigned_to?: string | null;
          company_id: string;
          contact_id?: string | null;
          title: string;
          description?: string | null;
          status?: "abierta" | "ganada" | "perdida" | "pospuesta" | "no_encaja";
          stage?:
            | "detectada"
            | "contactada"
            | "reunion"
            | "propuesta"
            | "negociacion"
            | "ganada"
            | "perdida";
          temperature?: "fria" | "templada" | "caliente";
          probability?: number;
          one_time_value?: number;
          expected_mrr?: number;
          estimated_cost?: number;
          estimated_margin?: number;
          source?: string | null;
          campaign?: string | null;
          referred_by?: string | null;
          competitor?: string | null;
          detected_need?: string | null;
          next_action?: string | null;
          next_action_at?: string | null;
          expected_close_date?: string | null;
          lost_reason?: string | null;
          won_at?: string | null;
          lost_at?: string | null;
          notes?: string | null;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          assigned_to?: string | null;
          company_id?: string;
          contact_id?: string | null;
          title?: string;
          description?: string | null;
          status?: "abierta" | "ganada" | "perdida" | "pospuesta" | "no_encaja";
          stage?:
            | "detectada"
            | "contactada"
            | "reunion"
            | "propuesta"
            | "negociacion"
            | "ganada"
            | "perdida";
          temperature?: "fria" | "templada" | "caliente";
          probability?: number;
          one_time_value?: number;
          expected_mrr?: number;
          estimated_cost?: number;
          estimated_margin?: number;
          source?: string | null;
          campaign?: string | null;
          referred_by?: string | null;
          competitor?: string | null;
          detected_need?: string | null;
          next_action?: string | null;
          next_action_at?: string | null;
          expected_close_date?: string | null;
          lost_reason?: string | null;
          won_at?: string | null;
          lost_at?: string | null;
          notes?: string | null;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
    };
    Views: Record<string, never>;
    Functions: {
      soft_delete_company: {
        Args: {
          company_id: string;
        };
        Returns: void;
      };
      soft_delete_contact: {
        Args: {
          contact_id: string;
        };
        Returns: void;
      };
      soft_delete_opportunity: {
        Args: {
          opportunity_id: string;
        };
        Returns: void;
      };
      replace_contact_company_relation: {
        Args: {
          p_contact_id: string;
          p_company_id: string | null;
          p_role: string;
          p_job_title: string;
          p_is_primary: boolean;
        };
        Returns: void;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
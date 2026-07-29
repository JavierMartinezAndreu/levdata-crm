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
    };
    Views: Record<string, never>;
    Functions: {
    soft_delete_company: {
        Args: {
        company_id: string;
        };
        Returns: void;
    };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
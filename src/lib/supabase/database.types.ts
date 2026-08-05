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
          follow_up_activity_id: string | null;
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
          follow_up_activity_id?: string | null;
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
          follow_up_activity_id?: string | null;
          expected_close_date?: string | null;
          lost_reason?: string | null;
          won_at?: string | null;
          lost_at?: string | null;
          notes?: string | null;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      activities: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          created_by: string | null;
          assigned_to: string | null;
          company_id: string | null;
          contact_id: string | null;
          opportunity_id: string | null;
          project_id: string | null;
          type:
            | "llamada"
            | "email"
            | "whatsapp"
            | "reunionFisica"
            | "googleMeet"
            | "notaInterna"
            | "tarea"
            | "seguimiento"
            | "envioPropuesta"
            | "revisionTecnica"
            | "soporteMantenimiento";
          title: string;
          subject: string;
          description: string | null;
          status: "pendiente" | "realizada" | "cancelada" | "vencida";
          scheduled_at: string | null;
          finished_at: string | null;
          completed_at: string | null;
          outcome: string | null;
          next_action: string | null;
          next_action_at: string | null;
          notes: string | null;
          deleted_at: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          assigned_to?: string | null;
          company_id?: string | null;
          contact_id?: string | null;
          opportunity_id?: string | null;
          project_id?: string | null;
          type?:
            | "llamada"
            | "email"
            | "whatsapp"
            | "reunionFisica"
            | "googleMeet"
            | "notaInterna"
            | "tarea"
            | "seguimiento"
            | "envioPropuesta"
            | "revisionTecnica"
            | "soporteMantenimiento";
          title: string;
          subject: string;
          description?: string | null;
          status?: "pendiente" | "realizada" | "cancelada" | "vencida";
          scheduled_at?: string | null;
          finished_at?: string | null;
          completed_at?: string | null;
          outcome?: string | null;
          next_action?: string | null;
          next_action_at?: string | null;
          notes?: string | null;
          deleted_at?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          created_by?: string | null;
          assigned_to?: string | null;
          company_id?: string | null;
          contact_id?: string | null;
          opportunity_id?: string | null;
          project_id?: string | null;
          type?:
            | "llamada"
            | "email"
            | "whatsapp"
            | "reunionFisica"
            | "googleMeet"
            | "notaInterna"
            | "tarea"
            | "seguimiento"
            | "envioPropuesta"
            | "revisionTecnica"
            | "soporteMantenimiento";
          title?: string;
          subject?: string;
          description?: string | null;
          status?: "pendiente" | "realizada" | "cancelada" | "vencida";
          scheduled_at?: string | null;
          finished_at?: string | null;
          completed_at?: string | null;
          outcome?: string | null;
          next_action?: string | null;
          next_action_at?: string | null;
          notes?: string | null;
          deleted_at?: string | null;
        };
        Relationships: [];
      };
      payments: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          company_id: string | null;
          opportunity_id: string | null;
          project_id: string | null;
          quote_id: string | null;
          registered_by: string | null;
          amount: number;
          payment_date: string;
          due_date: string | null;
          method:
            | "transferencia"
            | "efectivo"
            | "bizum"
            | "stripe"
            | "redsys"
            | "otro";
          status: "pendiente" | "cobrado" | "parcial" | "vencido" | "cancelado";
          concept: string;
          notes: string | null;
          receipt_url: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          company_id?: string | null;
          opportunity_id?: string | null;
          project_id?: string | null;
          quote_id?: string | null;
          registered_by?: string | null;
          amount?: number;
          payment_date?: string;
          due_date?: string | null;
          method?:
            | "transferencia"
            | "efectivo"
            | "bizum"
            | "stripe"
            | "redsys"
            | "otro";
          status?: "pendiente" | "cobrado" | "parcial" | "vencido" | "cancelado";
          concept: string;
          notes?: string | null;
          receipt_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          company_id?: string | null;
          opportunity_id?: string | null;
          project_id?: string | null;
          quote_id?: string | null;
          registered_by?: string | null;
          amount?: number;
          payment_date?: string;
          due_date?: string | null;
          method?:
            | "transferencia"
            | "efectivo"
            | "bizum"
            | "stripe"
            | "redsys"
            | "otro";
          status?: "pendiente" | "cobrado" | "parcial" | "vencido" | "cancelado";
          concept?: string;
          notes?: string | null;
          receipt_url?: string | null;
        };
        Relationships: [];
      };

      expenses: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          company_id: string | null;
          opportunity_id: string | null;
          project_id: string | null;
          paid_by: string | null;
          amount: number;
          expense_date: string;
          next_date: string | null;
          type:
            | "puntual"
            | "recurrente"
            | "internoLevData"
            | "asociadoProyecto"
            | "asociadoMantenimiento";
          category:
            | "dominio"
            | "hosting"
            | "microsoft365"
            | "sim"
            | "licencia"
            | "plugin"
            | "servidor"
            | "diseno"
            | "subcontratacion"
            | "herramientaIA"
            | "publicidad"
            | "otro";
          concept: string;
          periodicity: string | null;
          is_reimbursable: boolean;
          notes: string | null;
          receipt_url: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          company_id?: string | null;
          opportunity_id?: string | null;
          project_id?: string | null;
          paid_by?: string | null;
          amount?: number;
          expense_date?: string;
          next_date?: string | null;
          type?:
            | "puntual"
            | "recurrente"
            | "internoLevData"
            | "asociadoProyecto"
            | "asociadoMantenimiento";
          category?:
            | "dominio"
            | "hosting"
            | "microsoft365"
            | "sim"
            | "licencia"
            | "plugin"
            | "servidor"
            | "diseno"
            | "subcontratacion"
            | "herramientaIA"
            | "publicidad"
            | "otro";
          concept: string;
          periodicity?: string | null;
          is_reimbursable?: boolean;
          notes?: string | null;
          receipt_url?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          company_id?: string | null;
          opportunity_id?: string | null;
          project_id?: string | null;
          paid_by?: string | null;
          amount?: number;
          expense_date?: string;
          next_date?: string | null;
          type?:
            | "puntual"
            | "recurrente"
            | "internoLevData"
            | "asociadoProyecto"
            | "asociadoMantenimiento";
          category?:
            | "dominio"
            | "hosting"
            | "microsoft365"
            | "sim"
            | "licencia"
            | "plugin"
            | "servidor"
            | "diseno"
            | "subcontratacion"
            | "herramientaIA"
            | "publicidad"
            | "otro";
          concept?: string;
          periodicity?: string | null;
          is_reimbursable?: boolean;
          notes?: string | null;
          receipt_url?: string | null;
        };
        Relationships: [];
      };

      payouts: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          user_id: string | null;
          project_id: string | null;
          amount: number;
          payout_date: string;
          concept: string;
          type:
            | "repartoBeneficio"
            | "sueldo"
            | "reembolso"
            | "bonus"
            | "adelanto";
          notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          user_id?: string | null;
          project_id?: string | null;
          amount?: number;
          payout_date?: string;
          concept: string;
          type?:
            | "repartoBeneficio"
            | "sueldo"
            | "reembolso"
            | "bonus"
            | "adelanto";
          notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          user_id?: string | null;
          project_id?: string | null;
          amount?: number;
          payout_date?: string;
          concept?: string;
          type?:
            | "repartoBeneficio"
            | "sueldo"
            | "reembolso"
            | "bonus"
            | "adelanto";
          notes?: string | null;
        };
        Relationships: [];
      };
            projects: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          created_by: string | null;
          assigned_to: string | null;
          company_id: string;
          contact_id: string | null;
          opportunity_id: string | null;
          name: string;
          description: string | null;
          status:
            | "presupuestado"
            | "aceptado"
            | "enDesarrollo"
            | "pausado"
            | "entregado"
            | "enMantenimiento"
            | "cerrado"
            | "cancelado";
          health: string;
          start_date: string | null;
          target_date: string | null;
          delivered_at: string | null;
          budget_total: number;
          manual_progress: number;
          notes: string | null;
          repository_url: string | null;
          staging_url: string | null;
          production_url: string | null;
          private_notes: string | null;
          collected_total: number;
          expenses_total: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          created_by?: string | null;
          assigned_to?: string | null;
          company_id: string;
          contact_id?: string | null;
          opportunity_id?: string | null;
          name: string;
          description?: string | null;
          status?:
            | "presupuestado"
            | "aceptado"
            | "enDesarrollo"
            | "pausado"
            | "entregado"
            | "enMantenimiento"
            | "cerrado"
            | "cancelado";
          health?: string;
          start_date?: string | null;
          target_date?: string | null;
          delivered_at?: string | null;
          budget_total?: number;
          manual_progress?: number;
          notes?: string | null;
          repository_url?: string | null;
          staging_url?: string | null;
          production_url?: string | null;
          private_notes?: string | null;
          collected_total?: number;
          expenses_total?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          created_by?: string | null;
          assigned_to?: string | null;
          company_id?: string;
          contact_id?: string | null;
          opportunity_id?: string | null;
          name?: string;
          description?: string | null;
          status?:
            | "presupuestado"
            | "aceptado"
            | "enDesarrollo"
            | "pausado"
            | "entregado"
            | "enMantenimiento"
            | "cerrado"
            | "cancelado";
          health?: string;
          start_date?: string | null;
          target_date?: string | null;
          delivered_at?: string | null;
          budget_total?: number;
          manual_progress?: number;
          notes?: string | null;
          repository_url?: string | null;
          staging_url?: string | null;
          production_url?: string | null;
          private_notes?: string | null;
          collected_total?: number;
          expenses_total?: number;
        };
        Relationships: [];
      };
      project_sprints: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          project_id: string;
          name: string;
          description: string | null;
          sort_order: number;
          status: "planificado" | "enCurso" | "entregado" | "pausado" | "cancelado";
          planned_start_date: string | null;
          planned_delivery_date: string | null;
          delivered_at: string | null;
          budget_amount: number;
          collected_amount: number;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          project_id: string;
          name: string;
          description?: string | null;
          sort_order?: number;
          status?: "planificado" | "enCurso" | "entregado" | "pausado" | "cancelado";
          planned_start_date?: string | null;
          planned_delivery_date?: string | null;
          delivered_at?: string | null;
          budget_amount?: number;
          collected_amount?: number;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          project_id?: string;
          name?: string;
          description?: string | null;
          sort_order?: number;
          status?: "planificado" | "enCurso" | "entregado" | "pausado" | "cancelado";
          planned_start_date?: string | null;
          planned_delivery_date?: string | null;
          delivered_at?: string | null;
          budget_amount?: number;
          collected_amount?: number;
        };
        Relationships: [];
      };

      project_features: {
        Row: {
          id: string;
          created_at: string;
          updated_at: string;
          deleted_at: string | null;
          project_id: string;
          sprint_id: string | null;
          title: string;
          description: string | null;
          status:
            | "planificada"
            | "enDesarrollo"
            | "desarrollada"
            | "entregada"
            | "cancelada";
          priority: "baja" | "media" | "alta" | "critica";
          assigned_to: string | null;
          sort_order: number;
          started_at: string | null;
          developed_at: string | null;
          delivered_at: string | null;
          cancelled_at: string | null;
          cancellation_reason: string | null;
          technical_notes: string | null;
        };
        Insert: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          project_id: string;
          sprint_id?: string | null;
          title: string;
          description?: string | null;
          status?:
            | "planificada"
            | "enDesarrollo"
            | "desarrollada"
            | "entregada"
            | "cancelada";
          priority?: "baja" | "media" | "alta" | "critica";
          assigned_to?: string | null;
          sort_order?: number;
          started_at?: string | null;
          developed_at?: string | null;
          delivered_at?: string | null;
          cancelled_at?: string | null;
          cancellation_reason?: string | null;
          technical_notes?: string | null;
        };
        Update: {
          id?: string;
          created_at?: string;
          updated_at?: string;
          deleted_at?: string | null;
          project_id?: string;
          sprint_id?: string | null;
          title?: string;
          description?: string | null;
          status?:
            | "planificada"
            | "enDesarrollo"
            | "desarrollada"
            | "entregada"
            | "cancelada";
          priority?: "baja" | "media" | "alta" | "critica";
          assigned_to?: string | null;
          sort_order?: number;
          started_at?: string | null;
          developed_at?: string | null;
          delivered_at?: string | null;
          cancelled_at?: string | null;
          cancellation_reason?: string | null;
          technical_notes?: string | null;
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
      soft_delete_activity: {
        Args: {
          activity_id: string;
        };
        Returns: void;
      };
      complete_activity: {
        Args: {
          activity_id: string;
          p_outcome: string;
          p_next_action: string;
          p_next_action_at: string | null;
        };
        Returns: void;
      };
      soft_delete_payment: {
        Args: {
          payment_id: string;
        };
        Returns: void;
      };
      soft_delete_expense: {
        Args: {
          expense_id: string;
        };
        Returns: void;
      };
      soft_delete_payout: {
        Args: {
          payout_id: string;
        };
        Returns: void;
      };
      soft_delete_project: {
        Args: {
          project_id: string;
        };
        Returns: void;
      };
      soft_delete_project_sprint: {
        Args: {
          sprint_id: string;
        };
        Returns: void;
      };
      soft_delete_project_feature: {
        Args: {
          feature_id: string;
        };
        Returns: void;
      };
    };
    Enums: Record<string, never>;
    CompositeTypes: Record<string, never>;
  };
};
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type UserRole = 'patient' | 'doctor' | 'pharmacy' | 'lab' | 'admin'
export type AppointmentStatus = 'pending' | 'confirmed' | 'cancelled' | 'completed'
export type AppointmentMode = 'online' | 'in_person'
export type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled'
export type LabBookingStatus = 'pending' | 'confirmed' | 'sample_collected' | 'processing' | 'completed' | 'cancelled'
export type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded'

export interface Database {
  public: {
    Tables: {
      profiles: {
        Row: {
          id: string
          role: UserRole
          full_name: string | null
          avatar_url: string | null
          phone: string | null
          city: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id: string
          role?: UserRole
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          city?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          role?: UserRole
          full_name?: string | null
          avatar_url?: string | null
          phone?: string | null
          city?: string | null
          updated_at?: string
        }
      }
      doctors: {
        Row: {
          id: string
          profile_id: string
          speciality: string
          experience_years: number
          fee: number
          bio: string | null
          qualifications: string | null
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          speciality: string
          experience_years?: number
          fee?: number
          bio?: string | null
          qualifications?: string | null
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          speciality?: string
          experience_years?: number
          fee?: number
          bio?: string | null
          qualifications?: string | null
          verified?: boolean
          updated_at?: string
        }
      }
      doctor_availability: {
        Row: {
          id: string
          doctor_id: string
          day_of_week: number
          start_time: string
          end_time: string
          created_at: string
        }
        Insert: {
          id?: string
          doctor_id: string
          day_of_week: number
          start_time: string
          end_time: string
          created_at?: string
        }
        Update: {
          id?: string
          doctor_id?: string
          day_of_week?: number
          start_time?: string
          end_time?: string
        }
      }
      pharmacies: {
        Row: {
          id: string
          profile_id: string
          name: string
          address: string
          license_no: string
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          name: string
          address: string
          license_no: string
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          name?: string
          address?: string
          license_no?: string
          verified?: boolean
          updated_at?: string
        }
      }
      medicines: {
        Row: {
          id: string
          pharmacy_id: string
          name: string
          price: number
          stock: number
          requires_prescription: boolean
          description: string | null
          image_url: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          pharmacy_id: string
          name: string
          price?: number
          stock?: number
          requires_prescription?: boolean
          description?: string | null
          image_url?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          pharmacy_id?: string
          name?: string
          price?: number
          stock?: number
          requires_prescription?: boolean
          description?: string | null
          image_url?: string | null
          updated_at?: string
        }
      }
      labs: {
        Row: {
          id: string
          profile_id: string
          name: string
          address: string
          license_no: string
          verified: boolean
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          profile_id: string
          name: string
          address: string
          license_no: string
          verified?: boolean
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          profile_id?: string
          name?: string
          address?: string
          license_no?: string
          verified?: boolean
          updated_at?: string
        }
      }
      lab_tests: {
        Row: {
          id: string
          lab_id: string
          name: string
          price: number
          description: string | null
          sample_type: string
          turnaround_hours: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          lab_id: string
          name: string
          price?: number
          description?: string | null
          sample_type?: string
          turnaround_hours?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          lab_id?: string
          name?: string
          price?: number
          description?: string | null
          sample_type?: string
          turnaround_hours?: number
          updated_at?: string
        }
      }
      appointments: {
        Row: {
          id: string
          patient_id: string
          doctor_id: string
          slot_time: string
          status: AppointmentStatus
          mode: AppointmentMode
          amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          doctor_id: string
          slot_time: string
          status?: AppointmentStatus
          mode?: AppointmentMode
          amount?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          doctor_id?: string
          slot_time?: string
          status?: AppointmentStatus
          mode?: AppointmentMode
          amount?: number
          updated_at?: string
        }
      }
      consultations: {
        Row: {
          id: string
          appointment_id: string
          notes: string | null
          prescription: string | null
          chat_log: Json
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          appointment_id: string
          notes?: string | null
          prescription?: string | null
          chat_log?: Json
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          appointment_id?: string
          notes?: string | null
          prescription?: string | null
          chat_log?: Json
          updated_at?: string
        }
      }
      orders: {
        Row: {
          id: string
          patient_id: string
          pharmacy_id: string
          status: OrderStatus
          total: number
          prescription_url: string | null
          payment_id: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          pharmacy_id: string
          status?: OrderStatus
          total?: number
          prescription_url?: string | null
          payment_id?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          pharmacy_id?: string
          status?: OrderStatus
          total?: number
          prescription_url?: string | null
          payment_id?: string | null
          updated_at?: string
        }
      }
      order_items: {
        Row: {
          id: string
          order_id: string
          medicine_id: string
          qty: number
          price: number
        }
        Insert: {
          id?: string
          order_id: string
          medicine_id: string
          qty?: number
          price?: number
        }
        Update: {
          id?: string
          order_id?: string
          medicine_id?: string
          qty?: number
          price?: number
        }
      }
      lab_bookings: {
        Row: {
          id: string
          patient_id: string
          lab_id: string
          test_id: string
          slot_time: string
          status: LabBookingStatus
          amount: number
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          lab_id: string
          test_id: string
          slot_time: string
          status?: LabBookingStatus
          amount?: number
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          lab_id?: string
          test_id?: string
          slot_time?: string
          status?: LabBookingStatus
          amount?: number
          updated_at?: string
        }
      }
      lab_reports: {
        Row: {
          id: string
          lab_booking_id: string
          file_url: string
          notes: string | null
          created_at: string
        }
        Insert: {
          id?: string
          lab_booking_id: string
          file_url: string
          notes?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          lab_booking_id?: string
          file_url?: string
          notes?: string | null
        }
      }
      health_records: {
        Row: {
          id: string
          patient_id: string
          type: string
          title: string
          file_url: string
          uploaded_by: string | null
          created_at: string
        }
        Insert: {
          id?: string
          patient_id: string
          type: string
          title: string
          file_url: string
          uploaded_by?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          patient_id?: string
          type?: string
          title?: string
          file_url?: string
          uploaded_by?: string | null
        }
      }
      reviews: {
        Row: {
          id: string
          reviewer_id: string
          target_type: 'doctor' | 'pharmacy' | 'lab'
          target_id: string
          rating: number
          comment: string | null
          created_at: string
        }
        Insert: {
          id?: string
          reviewer_id: string
          target_type: 'doctor' | 'pharmacy' | 'lab'
          target_id: string
          rating: number
          comment?: string | null
          created_at?: string
        }
        Update: {
          id?: string
          reviewer_id?: string
          target_type?: 'doctor' | 'pharmacy' | 'lab'
          target_id?: string
          rating?: number
          comment?: string | null
        }
      }
      notifications: {
        Row: {
          id: string
          user_id: string
          title: string
          body: string
          read: boolean
          type: string
          created_at: string
        }
        Insert: {
          id?: string
          user_id: string
          title: string
          body: string
          read?: boolean
          type?: string
          created_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          title?: string
          body?: string
          read?: boolean
          type?: string
        }
      }
      payments: {
        Row: {
          id: string
          user_id: string
          related_type: 'appointment' | 'order' | 'lab_booking'
          related_id: string
          amount: number
          status: PaymentStatus
          provider_ref: string | null
          created_at: string
          updated_at: string
        }
        Insert: {
          id?: string
          user_id: string
          related_type: 'appointment' | 'order' | 'lab_booking'
          related_id: string
          amount?: number
          status?: PaymentStatus
          provider_ref?: string | null
          created_at?: string
          updated_at?: string
        }
        Update: {
          id?: string
          user_id?: string
          related_type?: 'appointment' | 'order' | 'lab_booking'
          related_id?: string
          amount?: number
          status?: PaymentStatus
          provider_ref?: string | null
          updated_at?: string
        }
      }
    }
    Views: Record<string, never>
    Functions: {
      is_admin: {
        Args: Record<string, never>
        Returns: boolean
      }
    }
    Enums: {
      user_role: UserRole
      appointment_status: AppointmentStatus
      appointment_mode: AppointmentMode
      order_status: OrderStatus
      lab_booking_status: LabBookingStatus
      payment_status: PaymentStatus
    }
  }
}

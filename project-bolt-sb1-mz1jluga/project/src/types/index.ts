export interface RepairRequest {
  id?: string;
  full_name: string;
  email: string;
  phone_model: string;
  issue_description?: string;
  voice_recording_url?: string;
  photo_url?: string;
  urgency: 'low' | 'medium' | 'high';
  created_at?: string;
  status?: 'pending' | 'in_progress' | 'completed';
}

export interface UrgencyLevel {
  value: 'low' | 'medium' | 'high';
  label: string;
  description: string;
  turnaround: string;
  color: string;
  bgColor: string;
}
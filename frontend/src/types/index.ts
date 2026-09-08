// TypeScript Types based on ERD & BRD/PRD Photobooth SaaS

export type RoleName = 'super_admin' | 'tenant_admin' | 'operator' | 'customer' | 'management';

export type TenantStatus = 'active' | 'suspended' | 'expired';
export type UserStatus = 'active' | 'inactive';
export type SubscriptionStatus = 'active' | 'expired' | 'cancelled' | 'pending';
export type PackageType = 'onsite' | 'online' | 'hybrid';
export type EventType = 'onsite' | 'online' | 'hybrid';
export type EventStatus = 'draft' | 'scheduled' | 'active' | 'completed' | 'cancelled';
export type TemplateOrientation = 'portrait' | 'landscape' | 'square';
export type ElementType = 'image' | 'text' | 'shape' | 'sticker' | 'qr_code';
export type SessionMode = 'onsite' | 'online';
export type SessionStatus = 'waiting' | 'in_progress' | 'photo_taken' | 'template_selected' | 'completed' | 'cancelled';
export type TransactionStatus = 'pending' | 'paid' | 'failed' | 'refunded' | 'expired';
export type PaymentStatus = 'pending' | 'successful' | 'failed';

export interface BaseEntity {
  id: number;
  created_at: string;
  updated_at: string;
}

export interface Tenant extends BaseEntity {
  name: string;
  slug: string;
  domain?: string;
  status: TenantStatus;
  logo_media_id?: number;
  max_operators: number;
  max_events_per_month: number;
  max_storage_mb: number;
  business_profile?: BusinessProfile;
  active_subscription?: TenantSubscription;
}

export interface User extends BaseEntity {
  tenant_id?: number;
  name: string;
  email: string;
  phone?: string;
  status: UserStatus;
  last_login_at?: string;
  roles?: { id: number; name: RoleName; guard_name: string }[];
  tenant?: Tenant;
}

export interface BusinessProfile extends BaseEntity {
  tenant_id: number;
  company_name: string;
  brand_name?: string;
  email?: string;
  phone?: string;
  address?: string;
  city?: string;
  province?: string;
  postal_code?: string;
  website?: string;
  instagram?: string;
  tiktok?: string;
  bank_name?: string;
  bank_account_number?: string;
  bank_account_holder?: string;
  qris_media_id?: number;
  logo_media_id?: number;
}

export interface SubscriptionPlan extends BaseEntity {
  name: string;
  code: string;
  price_monthly: number;
  price_yearly: number;
  max_operators: number;
  max_events_per_month: number;
  max_storage_mb: number;
  features?: string[];
  is_active: boolean;
}

export interface TenantSubscription extends BaseEntity {
  tenant_id: number;
  subscription_plan_id: number;
  starts_at: string;
  ends_at: string;
  billing_cycle: 'monthly' | 'yearly';
  status: SubscriptionStatus;
  plan?: SubscriptionPlan;
}

export interface Package extends BaseEntity {
  tenant_id: number;
  name: string;
  slug: string;
  description?: string;
  package_type: PackageType;
  price: number;
  photo_limit: number;
  duration_minutes: number;
  is_active: boolean;
  templates?: Template[];
}

export interface Event extends BaseEntity {
  tenant_id: number;
  package_id?: number;
  name: string;
  slug: string;
  event_type: EventType;
  start_date: string;
  end_date: string;
  location?: string;
  status: EventStatus;
  watermark_enabled: boolean;
  qr_expiry_days: number;
  package?: Package;
  operators?: User[];
  templates?: Template[];
}

export interface Template extends BaseEntity {
  tenant_id: number;
  name: string;
  slug: string;
  category?: string;
  aspect_ratio: string;
  orientation: TemplateOrientation;
  width: number;
  height: number;
  total_slots: number;
  is_active: boolean;
  versions?: TemplateVersion[];
  current_version?: TemplateVersion;
}

export interface TemplateVersion extends BaseEntity {
  template_id: number;
  version_number: number;
  preview_media_id?: number;
  background_media_id?: number;
  overlay_media_id?: number;
  is_published: boolean;
  slots?: TemplatePhotoSlot[];
  elements?: TemplateElement[];
}

export interface TemplatePhotoSlot extends BaseEntity {
  template_version_id: number;
  slot_index: number;
  pos_x: number;
  pos_y: number;
  width: number;
  height: number;
  rotation: number;
  border_radius: number;
}

export interface TemplateElement extends BaseEntity {
  template_version_id: number;
  element_type: ElementType;
  content?: string;
  pos_x: number;
  pos_y: number;
  width: number;
  height: number;
  rotation: number;
  layer_order: number;
  properties?: Record<string, unknown>;
}

export interface Customer extends BaseEntity {
  tenant_id: number;
  name: string;
  email?: string;
  phone?: string;
  instagram?: string;
}

export interface PhotoSession extends BaseEntity {
  tenant_id: number;
  event_id: number;
  operator_id?: number;
  customer_id?: number;
  package_id?: number;
  session_token: string;
  session_mode: SessionMode;
  status: SessionStatus;
  selected_template_version_id?: number;
  photos_taken_count: number;
  started_at?: string;
  completed_at?: string;
  photos?: SessionPhoto[];
  results?: PhotoResult[];
  event?: Event;
  customer?: Customer;
}

export interface SessionPhoto extends BaseEntity {
  photo_session_id: number;
  media_file_id: number;
  photo_sequence: number;
  is_retake: boolean;
  media_file?: MediaFile;
}

export interface PhotoResult extends BaseEntity {
  photo_session_id: number;
  template_version_id: number;
  result_token: string;
  image_media_id: number;
  gif_media_id?: number;
  qr_code_media_id?: number;
  downloads_count: number;
  expires_at?: string;
  items?: PhotoResultItem[];
  media_file?: MediaFile;
}

export interface PhotoResultItem extends BaseEntity {
  photo_result_id: number;
  session_photo_id: number;
  template_photo_slot_id: number;
}

export interface Transaction extends BaseEntity {
  tenant_id: number;
  event_id?: number;
  customer_id?: number;
  photo_session_id?: number;
  transaction_number: string;
  amount: number;
  status: TransactionStatus;
  payment_method?: string;
  paid_at?: string;
  payments?: Payment[];
}

export interface Payment extends BaseEntity {
  transaction_id: number;
  gateway: string;
  payment_type: string;
  gateway_reference?: string;
  amount: number;
  status: PaymentStatus;
  payload?: Record<string, unknown>;
}

export interface MediaFile extends BaseEntity {
  tenant_id?: number;
  file_name: string;
  file_path: string;
  url?: string;
  mime_type: string;
  file_size: number;
  disk: string;
}

export interface Notification extends BaseEntity {
  tenant_id?: number;
  user_id: number;
  title: string;
  message: string;
  type: string;
  read_at?: string;
  data?: Record<string, unknown>;
}

export interface AuditLog extends BaseEntity {
  tenant_id?: number;
  user_id?: number;
  action: string;
  auditable_type: string;
  auditable_id: number;
  old_values?: Record<string, unknown>;
  new_values?: Record<string, unknown>;
  ip_address?: string;
  user_agent?: string;
}

// API Envelope Interfaces
export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
  meta?: PaginationMeta;
}

export interface PaginationMeta {
  current_page: number;
  last_page: number;
  per_page: number;
  total: number;
}

export interface AuthResponse {
  token: string;
  user: User;
  tenant?: Tenant;
}

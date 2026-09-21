-- ==============================================================================
-- SkillNest Academy - Complete PostgreSQL Database Schema for Supabase
-- Instructions: 
-- 1. Go to your Supabase Dashboard: https://supabase.com/dashboard
-- 2. Open your project, click on "SQL Editor" on the left navigation.
-- 3. Click "New query", paste this entire script and click "RUN".
-- ==============================================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. USERS TABLE
CREATE TABLE IF NOT EXISTS public.users (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    phone TEXT DEFAULT '',
    role TEXT NOT NULL DEFAULT 'STUDENT', -- STUDENT, INSTRUCTOR, ADMIN, SUPER_ADMIN, SUPPORT_AGENT
    avatar TEXT,
    headline TEXT,
    bio TEXT,
    is_active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. CATEGORIES TABLE
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    name_bn TEXT NOT NULL,
    slug TEXT UNIQUE NOT NULL,
    icon TEXT NOT NULL DEFAULT 'Code',
    description TEXT,
    course_count INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. INSTRUCTORS TABLE
CREATE TABLE IF NOT EXISTS public.instructors (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT,
    title TEXT,
    expertise TEXT,
    bio TEXT,
    avatar TEXT,
    total_students INTEGER DEFAULT 0,
    total_courses INTEGER DEFAULT 0,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 4. COURSES TABLE
CREATE TABLE IF NOT EXISTS public.courses (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    title_bn TEXT,
    slug TEXT UNIQUE NOT NULL,
    subtitle TEXT,
    description TEXT,
    learning_outcomes JSONB DEFAULT '[]'::jsonb,
    what_you_will_learn JSONB DEFAULT '[]'::jsonb,
    requirements JSONB DEFAULT '[]'::jsonb,
    thumbnail TEXT,
    promo_video_url TEXT,
    price INTEGER NOT NULL DEFAULT 0,
    discount_price INTEGER,
    level TEXT DEFAULT 'ALL_LEVELS', -- BEGINNER, INTERMEDIATE, ADVANCED, ALL_LEVELS
    language TEXT DEFAULT 'Bangla & English',
    duration_hours NUMERIC(5, 1) DEFAULT 0,
    lessons_count INTEGER DEFAULT 0,
    rating NUMERIC(3, 2) DEFAULT 5.0,
    students_count INTEGER DEFAULT 0,
    category_id TEXT REFERENCES public.categories(id) ON DELETE SET NULL,
    instructor_id TEXT REFERENCES public.instructors(id) ON DELETE SET NULL,
    modules JSONB DEFAULT '[]'::jsonb,
    is_published BOOLEAN DEFAULT true,
    is_featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 5. ORDERS TABLE
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    user_name TEXT,
    user_email TEXT,
    user_phone TEXT,
    items JSONB DEFAULT '[]'::jsonb,
    subtotal NUMERIC(10, 2) NOT NULL,
    discount NUMERIC(10, 2) DEFAULT 0,
    total NUMERIC(10, 2) NOT NULL,
    coupon_code TEXT,
    payment_method TEXT NOT NULL, -- BKASH, NAGAD, SSLCOMMERZ, STRIPE
    payment_status TEXT NOT NULL DEFAULT 'INITIATED', -- INITIATED, PROCESSING, SUCCESS, FAILED, CANCELLED
    order_status TEXT NOT NULL DEFAULT 'PENDING', -- PENDING, PAID, FAILED, CANCELLED, REFUNDED
    transaction_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 6. ENROLLMENTS TABLE
CREATE TABLE IF NOT EXISTS public.enrollments (
    id TEXT PRIMARY KEY,
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
    enrolled_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    completion_percentage INTEGER DEFAULT 0,
    completed_lessons JSONB DEFAULT '[]'::jsonb,
    last_accessed_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    certificate_id TEXT,
    CONSTRAINT unique_user_course UNIQUE(user_id, course_id)
);

-- 7. CERTIFICATES TABLE
CREATE TABLE IF NOT EXISTS public.certificates (
    id TEXT PRIMARY KEY,
    certificate_number TEXT UNIQUE NOT NULL,
    user_id TEXT REFERENCES public.users(id) ON DELETE CASCADE,
    student_name TEXT NOT NULL,
    course_id TEXT REFERENCES public.courses(id) ON DELETE CASCADE,
    course_title TEXT NOT NULL,
    instructor_name TEXT NOT NULL,
    issue_date TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    status TEXT DEFAULT 'VALID', -- VALID, REVOKED
    verification_url TEXT NOT NULL
);

-- 8. COUPONS TABLE
CREATE TABLE IF NOT EXISTS public.coupons (
    id TEXT PRIMARY KEY,
    code TEXT UNIQUE NOT NULL,
    discount_type TEXT NOT NULL DEFAULT 'PERCENTAGE', -- PERCENTAGE, FIXED
    discount_value NUMERIC(10, 2) NOT NULL,
    min_order_amount NUMERIC(10, 2) DEFAULT 0,
    max_discount_amount NUMERIC(10, 2),
    expires_at TIMESTAMP WITH TIME ZONE,
    usage_count INTEGER DEFAULT 0,
    max_usage INTEGER DEFAULT 500,
    is_active BOOLEAN DEFAULT true
);

-- 9. PLATFORM SETTINGS (DYNAMIC CMS)
CREATE TABLE IF NOT EXISTS public.platform_settings (
    id TEXT PRIMARY KEY DEFAULT 'default',
    platform_name TEXT DEFAULT 'SkillNest Academy',
    tagline_bn TEXT DEFAULT 'শিখুন। তৈরি করুন। ক্যারিয়ারে এগিয়ে যান।',
    tagline_en TEXT DEFAULT 'Learn. Build. Advance Your Career.',
    contact_email TEXT DEFAULT 'support@skillnest.academy',
    contact_phone TEXT DEFAULT '+৮৮০ ১৮০০-৭৫৪৫৫৬',
    contact_working_hours TEXT DEFAULT 'সকাল ১০টা - রাত ৮টা (শনি - বৃহস্পতি)',
    address TEXT DEFAULT 'লেভেল ৮, ভিশন টেক টাওয়ার, কারওয়ান বাজার, ঢাকা-১২১৫',
    currency_symbol TEXT DEFAULT '৳',
    default_language TEXT DEFAULT 'bn',
    bkash_enabled BOOLEAN DEFAULT true,
    nagad_enabled BOOLEAN DEFAULT true,
    sslcommerz_enabled BOOLEAN DEFAULT true,
    stripe_enabled BOOLEAN DEFAULT true,
    hero_badge_bn TEXT,
    hero_badge_en TEXT,
    hero_banner_title_bn TEXT,
    hero_banner_title_en TEXT,
    hero_highlight_bn TEXT,
    hero_highlight_en TEXT,
    hero_banner_sub_bn TEXT,
    hero_banner_sub_en TEXT,
    hero_cta1_text_bn TEXT,
    hero_cta1_text_en TEXT,
    hero_cta1_link TEXT,
    hero_cta2_text_bn TEXT,
    hero_cta2_text_en TEXT,
    hero_cta2_link TEXT,
    trust_bullet1 TEXT,
    trust_bullet2 TEXT,
    trust_bullet3 TEXT,
    stat1_value TEXT,
    stat1_label_bn TEXT,
    stat1_label_en TEXT,
    stat2_value TEXT,
    stat2_label_bn TEXT,
    stat2_label_en TEXT,
    stat3_value TEXT,
    stat3_label_bn TEXT,
    stat3_label_en TEXT,
    stat4_value TEXT,
    stat4_label_bn TEXT,
    stat4_label_en TEXT,
    top_banner_enabled BOOLEAN DEFAULT true,
    top_banner_badge_bn TEXT,
    top_banner_text_bn TEXT,
    top_banner_text_en TEXT,
    top_banner_coupon TEXT,
    top_banner_btn_text_bn TEXT,
    top_banner_btn_text_en TEXT,
    promo_modal_enabled BOOLEAN DEFAULT true,
    promo_modal_title TEXT,
    promo_modal_subtitle TEXT,
    promo_modal_discount TEXT,
    promo_modal_code TEXT,
    promo_modal_hours INTEGER DEFAULT 48,
    value_props JSONB DEFAULT '[]'::jsonb,
    footer_bio_bn TEXT,
    footer_bio_en TEXT,
    copyright_text TEXT,
    facebook_url TEXT,
    youtube_url TEXT,
    linkedin_url TEXT,
    github_url TEXT,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- ==============================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ==============================================================================
ALTER TABLE public.courses ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.instructors ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.platform_settings ENABLE ROW LEVEL SECURITY;

-- Allow public read access to courses, categories, instructors, and settings
CREATE POLICY "Public courses are viewable by everyone" ON public.courses FOR SELECT USING (true);
CREATE POLICY "Public categories are viewable by everyone" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public instructors are viewable by everyone" ON public.instructors FOR SELECT USING (true);
CREATE POLICY "Public settings are viewable by everyone" ON public.platform_settings FOR SELECT USING (true);

-- Insert default row for platform_settings
INSERT INTO public.platform_settings (
    id, platform_name, tagline_bn, tagline_en, contact_email, contact_phone, address,
    top_banner_coupon, promo_modal_code
) VALUES (
    'default',
    'SkillNest Academy',
    'শিখুন। তৈরি করুন। ক্যারিয়ারে এগিয়ে যান।',
    'Learn. Build. Advance Your Career.',
    'support@skillnest.academy',
    '+৮৮০ ১৮০০-৭৫৪৫৫৬',
    'লেভেল ৮, ভিশন টেক টাওয়ার, কারওয়ান বাজার, ঢাকা-১২১৫',
    'NINE',
    'NINE'
) ON CONFLICT (id) DO NOTHING;

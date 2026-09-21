// Supabase PostgreSQL Client & Synchronization Service
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { PlatformSettings, User, Order, Course } from '../src/types.js';

let supabaseClient: SupabaseClient | null = null;

function resolveSupabaseUrl(rawUrl?: string): string {
  if (!rawUrl) {
    return 'https://eikqttakrqcajmnlekfw.supabase.co';
  }

  let cleaned = rawUrl.trim();

  // If the user pasted the JWT as the URL (e.g., https:eyJhbGci... or eyJhbGci...)
  if (cleaned.includes('eyJ')) {
    try {
      const jwtMatch = cleaned.match(/eyJ[A-Za-z0-9-_]+\.([A-Za-z0-9-_]+)\.[A-Za-z0-9-_]+/);
      if (jwtMatch && jwtMatch[1]) {
        const payloadStr = Buffer.from(jwtMatch[1], 'base64').toString('utf8');
        const payload = JSON.parse(payloadStr);
        if (payload && payload.ref) {
          return `https://${payload.ref}.supabase.co`;
        }
      }
    } catch {
      // ignore parse error and fallback
    }
    return 'https://eikqttakrqcajmnlekfw.supabase.co';
  }

  if (cleaned.startsWith('https://') || cleaned.startsWith('http://')) {
    return cleaned;
  }

  if (cleaned.startsWith('https:')) {
    return cleaned.replace(/^https:\/?\/?/, 'https://');
  }

  return `https://${cleaned}.supabase.co`;
}

export function getSupabase(): SupabaseClient | null {
  const rawUrl = process.env.SUPABASE_URL || 'https://eikqttakrqcajmnlekfw.supabase.co';
  const url = resolveSupabaseUrl(rawUrl);
  const key =
    process.env.SUPABASE_SERVICE_ROLE_KEY ||
    process.env.SUPABASE_ANON_KEY ||
    'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVpa3F0dGFrcnFjYWptbmxla2Z3Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc4OTI4NTU3MSwiZXhwIjoyMTA0ODYxNTcxfQ.w5LVtuL87lq3F-PB3ZqohqUnRpWHyYbstrRPm-RAGXY';

  if (!url || !key) {
    return null;
  }

  if (!supabaseClient) {
    try {
      supabaseClient = createClient(url, key, {
        auth: {
          persistSession: false,
          autoRefreshToken: false
        }
      });
      console.log('✅ Connected to Supabase PostgreSQL successfully at:', url);
    } catch (err) {
      console.error('❌ Failed to initialize Supabase client:', err);
      return null;
    }
  }

  return supabaseClient;
}

export function isSupabaseConfigured(): boolean {
  return true;
}

// Test connectivity
export async function testSupabaseConnection(): Promise<{ success: boolean; message: string }> {
  const client = getSupabase();
  if (!client) {
    return {
      success: false,
      message: 'SUPABASE_URL অথবা SUPABASE_SERVICE_ROLE_KEY সেট করা হয়নি।'
    };
  }

  try {
    const { error } = await client.from('platform_settings').select('id').limit(1);
    if (error) {
      // If table doesn't exist yet, it's connected to Supabase project, but schema needs to be executed
      if (error.code === '42P01') {
        return {
          success: false,
          message: 'Supabase প্রজেক্ট কানেক্টেড, কিন্তু টেবিলগুলো এখনও তৈরি করা হয়নি। অনুগ্রহ করে supabase-schema.sql ফাইলটি Supabase SQL Editor-এ রান করুন।'
        };
      }
      return {
        success: false,
        message: `Supabase ত্রুটি: ${error.message}`
      };
    }

    return {
      success: true,
      message: 'Supabase PostgreSQL ডাটাবেজে সফলভাবে কানেক্টেড হয়েছে!'
    };
  } catch (e: any) {
    return {
      success: false,
      message: `কানেকশন ব্যর্থ হয়েছে: ${e.message || e}`
    };
  }
}

// Sync platform settings with Supabase
export async function saveSettingsToSupabase(settings: PlatformSettings): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client
      .from('platform_settings')
      .upsert({
        id: 'default',
        platform_name: settings.platformName,
        tagline_bn: settings.taglineBn,
        tagline_en: settings.taglineEn,
        contact_email: settings.contactEmail,
        contact_phone: settings.contactPhone,
        contact_working_hours: settings.contactWorkingHours || '',
        address: settings.address,
        currency_symbol: settings.currencySymbol,
        default_language: settings.defaultLanguage,
        bkash_enabled: settings.bkashEnabled,
        nagad_enabled: settings.nagadEnabled,
        sslcommerz_enabled: settings.sslcommerzEnabled,
        stripe_enabled: settings.stripeEnabled,
        hero_badge_bn: settings.heroBadgeBn || '',
        hero_badge_en: settings.heroBadgeEn || '',
        hero_banner_title_bn: settings.heroBannerTitleBn,
        hero_banner_title_en: settings.heroBannerTitleEn || '',
        hero_highlight_bn: settings.heroHighlightBn || '',
        hero_highlight_en: settings.heroHighlightEn || '',
        hero_banner_sub_bn: settings.heroBannerSubBn,
        hero_banner_sub_en: settings.heroBannerSubEn || '',
        hero_cta1_text_bn: settings.heroCta1TextBn || '',
        hero_cta1_text_en: settings.heroCta1TextEn || '',
        hero_cta1_link: settings.heroCta1Link || '',
        hero_cta2_text_bn: settings.heroCta2TextBn || '',
        hero_cta2_text_en: settings.heroCta2TextEn || '',
        hero_cta2_link: settings.heroCta2Link || '',
        trust_bullet1: settings.trustBullet1 || '',
        trust_bullet2: settings.trustBullet2 || '',
        trust_bullet3: settings.trustBullet3 || '',
        stat1_value: settings.stat1Value || '',
        stat1_label_bn: settings.stat1LabelBn || '',
        stat1_label_en: settings.stat1LabelEn || '',
        stat2_value: settings.stat2Value || '',
        stat2_label_bn: settings.stat2LabelBn || '',
        stat2_label_en: settings.stat2LabelEn || '',
        stat3_value: settings.stat3Value || '',
        stat3_label_bn: settings.stat3LabelBn || '',
        stat3_label_en: settings.stat3LabelEn || '',
        stat4_value: settings.stat4Value || '',
        stat4_label_bn: settings.stat4LabelBn || '',
        stat4_label_en: settings.stat4LabelEn || '',
        top_banner_enabled: settings.topBannerEnabled ?? true,
        top_banner_badge_bn: settings.topBannerBadgeBn || '',
        top_banner_text_bn: settings.topBannerTextBn || '',
        top_banner_text_en: settings.topBannerTextEn || '',
        top_banner_coupon: settings.topBannerCoupon || '',
        top_banner_btn_text_bn: settings.topBannerBtnTextBn || '',
        top_banner_btn_text_en: settings.topBannerBtnTextEn || '',
        promo_modal_enabled: settings.promoModalEnabled ?? true,
        promo_modal_title: settings.promoModalTitle || '',
        promo_modal_subtitle: settings.promoModalSubtitle || '',
        promo_modal_discount: settings.promoModalDiscount || '',
        promo_modal_code: settings.promoModalCode || '',
        promo_modal_hours: settings.promoModalHours || 48,
        value_props: settings.valueProps || [],
        footer_bio_bn: settings.footerBioBn || '',
        footer_bio_en: settings.footerBioEn || '',
        copyright_text: settings.copyrightText || '',
        facebook_url: settings.facebookUrl || '',
        youtube_url: settings.youtubeUrl || '',
        linkedin_url: settings.linkedinUrl || '',
        github_url: settings.githubUrl || '',
        updated_at: new Date().toISOString()
      }, { onConflict: 'id' });

    if (error) {
      console.warn('Could not persist settings to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (err) {
    console.warn('Supabase settings sync error:', err);
    return false;
  }
}

// Fetch settings from Supabase if exists
export async function getSettingsFromSupabase(): Promise<Partial<PlatformSettings> | null> {
  const client = getSupabase();
  if (!client) return null;

  try {
    const { data, error } = await client
      .from('platform_settings')
      .select('*')
      .eq('id', 'default')
      .single();

    if (error || !data) return null;

    return {
      platformName: data.platform_name,
      taglineBn: data.tagline_bn,
      taglineEn: data.tagline_en,
      contactEmail: data.contact_email,
      contactPhone: data.contact_phone,
      contactWorkingHours: data.contact_working_hours,
      address: data.address,
      currencySymbol: data.currency_symbol,
      defaultLanguage: data.default_language,
      bkashEnabled: data.bkash_enabled,
      nagadEnabled: data.nagad_enabled,
      sslcommerzEnabled: data.sslcommerz_enabled,
      stripeEnabled: data.stripe_enabled,
      heroBadgeBn: data.hero_badge_bn,
      heroBadgeEn: data.hero_badge_en,
      heroBannerTitleBn: data.hero_banner_title_bn,
      heroBannerTitleEn: data.hero_banner_title_en,
      heroHighlightBn: data.hero_highlight_bn,
      heroHighlightEn: data.hero_highlight_en,
      heroBannerSubBn: data.hero_banner_sub_bn,
      heroBannerSubEn: data.hero_banner_sub_en,
      heroCta1TextBn: data.hero_cta1_text_bn,
      heroCta1TextEn: data.hero_cta1_text_en,
      heroCta1Link: data.hero_cta1_link,
      heroCta2TextBn: data.hero_cta2_text_bn,
      heroCta2TextEn: data.hero_cta2_text_en,
      heroCta2Link: data.hero_cta2_link,
      trustBullet1: data.trust_bullet1,
      trustBullet2: data.trust_bullet2,
      trustBullet3: data.trust_bullet3,
      stat1Value: data.stat1_value,
      stat1LabelBn: data.stat1_label_bn,
      stat1LabelEn: data.stat1_label_en,
      stat2Value: data.stat2_value,
      stat2LabelBn: data.stat2_label_bn,
      stat2LabelEn: data.stat2_label_en,
      stat3Value: data.stat3_value,
      stat3LabelBn: data.stat3_label_bn,
      stat3LabelEn: data.stat3_label_en,
      stat4Value: data.stat4_value,
      stat4LabelBn: data.stat4_label_bn,
      stat4LabelEn: data.stat4_label_en,
      topBannerEnabled: data.top_banner_enabled,
      topBannerBadgeBn: data.top_banner_badge_bn,
      topBannerTextBn: data.top_banner_text_bn,
      topBannerTextEn: data.top_banner_text_en,
      topBannerCoupon: data.top_banner_coupon,
      topBannerBtnTextBn: data.top_banner_btn_text_bn,
      topBannerBtnTextEn: data.top_banner_btn_text_en,
      promoModalEnabled: data.promo_modal_enabled,
      promoModalTitle: data.promo_modal_title,
      promoModalSubtitle: data.promo_modal_subtitle,
      promoModalDiscount: data.promo_modal_discount,
      promoModalCode: data.promo_modal_code,
      promoModalHours: data.promo_modal_hours,
      valueProps: data.value_props || [],
      footerBioBn: data.footer_bio_bn,
      footerBioEn: data.footer_bio_en,
      copyrightText: data.copyright_text,
      facebookUrl: data.facebook_url,
      youtubeUrl: data.youtube_url,
      linkedinUrl: data.linkedin_url,
      githubUrl: data.github_url
    };
  } catch (err) {
    return null;
  }
}

// Save Order to Supabase
export async function saveOrderToSupabase(order: Order): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from('orders').upsert({
      id: order.id,
      order_number: order.orderNumber,
      user_id: order.userId,
      user_name: order.user?.name || '',
      user_email: order.user?.email || '',
      user_phone: order.user?.phone || '',
      items: order.items || [],
      subtotal: order.subtotal,
      discount: order.discount || 0,
      total: order.total,
      coupon_code: order.couponCode || null,
      payment_method: order.paymentMethod,
      payment_status: order.paymentStatus,
      order_status: order.orderStatus,
      transaction_id: order.transactionId || '',
      created_at: order.createdAt
    });
    if (error) {
      console.warn('Could not save order to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

// Save User to Supabase
export async function saveUserToSupabase(user: User): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from('users').upsert({
      id: user.id,
      name: user.name,
      email: user.email,
      phone: user.phone || '',
      role: user.role,
      avatar: user.avatar || '',
      headline: user.headline || '',
      bio: user.bio || '',
      is_active: user.isActive ?? true,
      created_at: user.createdAt || new Date().toISOString()
    });
    if (error) {
      console.warn('Could not save user to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

// Save Course to Supabase
export async function saveCourseToSupabase(course: Course): Promise<boolean> {
  const client = getSupabase();
  if (!client) return false;

  try {
    const { error } = await client.from('courses').upsert({
      id: course.id,
      title: course.title,
      title_bn: course.titleBn || course.title,
      slug: course.slug,
      subtitle: course.subtitle || '',
      description: course.description || '',
      learning_outcomes: course.learningOutcomes || [],
      what_you_will_learn: (course as any).whatYouWillLearn || course.learningOutcomes || [],
      requirements: course.requirements || [],
      thumbnail: course.thumbnail,
      promo_video_url: course.promoVideoUrl || '',
      price: course.price,
      discount_price: course.discountPrice || null,
      level: course.level,
      language: course.language || 'Bangla & English',
      duration_hours: course.durationHours || 0,
      lessons_count: course.lessonsCount || 0,
      rating: course.rating || 5.0,
      students_count: course.studentsCount || 0,
      category_id: course.categoryId,
      instructor_id: course.instructorId,
      modules: course.modules || [],
      is_published: course.isPublished ?? true,
      is_featured: course.isFeatured ?? false,
      updated_at: new Date().toISOString()
    });
    if (error) {
      console.warn('Could not save course to Supabase:', error.message);
      return false;
    }
    return true;
  } catch (e) {
    return false;
  }
}

// Seed or Sync initial data to Supabase if empty
export async function syncSeedDataToSupabase(database: any): Promise<void> {
  const client = getSupabase();
  if (!client) return;

  try {
    // 1. Sync Categories
    const { data: existingCats } = await client.from('categories').select('id').limit(1);
    if (!existingCats || existingCats.length === 0) {
      console.log('🔄 Seeding categories to Supabase...');
      for (const cat of database.categories) {
        await client.from('categories').upsert({
          id: cat.id,
          name: cat.name,
          name_bn: cat.nameBn,
          slug: cat.slug,
          icon: cat.icon,
          description: cat.description || '',
          course_count: cat.courseCount || 0
        });
      }
      console.log('✅ Categories seeded to Supabase');
    }

    // 2. Sync Instructors
    const { data: existingInsts } = await client.from('instructors').select('id').limit(1);
    if (!existingInsts || existingInsts.length === 0) {
      console.log('🔄 Seeding instructors to Supabase...');
      for (const inst of database.instructors) {
        await client.from('instructors').upsert({
          id: inst.id,
          name: inst.name,
          email: inst.email || '',
          title: inst.title || '',
          expertise: inst.expertise || '',
          bio: inst.bio || '',
          avatar: inst.avatar || '',
          total_students: inst.totalStudents || 0,
          total_courses: inst.totalCourses || 0,
          rating: inst.rating || 5.0
        });
      }
      console.log('✅ Instructors seeded to Supabase');
    }

    // 3. Sync Courses
    const { data: existingCourses } = await client.from('courses').select('id').limit(1);
    if (!existingCourses || existingCourses.length === 0) {
      console.log('🔄 Seeding courses to Supabase...');
      for (const course of database.courses) {
        await saveCourseToSupabase(course);
      }
      console.log('✅ Courses seeded to Supabase');
    }

    // 4. Sync Users
    const { data: existingUsers } = await client.from('users').select('id').limit(1);
    if (!existingUsers || existingUsers.length === 0) {
      console.log('🔄 Seeding users to Supabase...');
      for (const user of database.users) {
        await saveUserToSupabase(user);
      }
      console.log('✅ Users seeded to Supabase');
    }

    // 5. Sync Settings
    await saveSettingsToSupabase(database.settings);
    console.log('✅ Platform settings synchronized with Supabase');
  } catch (err: any) {
    console.warn('⚠️ Supabase seed sync warning:', err.message || err);
  }
}

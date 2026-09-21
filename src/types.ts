// SkillNest Academy - Shared TypeScript Type Definitions

export type UserRole = 'SUPER_ADMIN' | 'ADMIN' | 'INSTRUCTOR' | 'STUDENT' | 'SUPPORT_AGENT';

export type CourseLevel = 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS';

export type OrderStatus = 'PENDING' | 'PAID' | 'FAILED' | 'CANCELLED' | 'REFUNDED';

export type PaymentStatus = 'INITIATED' | 'PROCESSING' | 'SUCCESS' | 'FAILED' | 'CANCELLED';

export type PaymentMethod = 'BKASH' | 'NAGAD' | 'SSLCOMMERZ' | 'STRIPE';

export type CertificateStatus = 'VALID' | 'REVOKED';

export type CouponDiscountType = 'PERCENTAGE' | 'FIXED';

export interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: UserRole;
  avatar?: string;
  bio?: string;
  headline?: string;
  isActive: boolean;
  createdAt: string;
}

export interface Category {
  id: string;
  name: string;
  nameBn: string;
  slug: string;
  icon: string;
  description: string;
  courseCount: number;
}

export interface Instructor {
  id: string;
  name: string;
  title: string;
  expertise: string;
  bio: string;
  avatar: string;
  totalStudents: number;
  totalCourses: number;
  rating: number;
  email?: string;
  company?: string;
  experienceYears?: number;
  specialties?: string[];
  socialLinks?: {
    linkedin?: string;
    github?: string;
    twitter?: string;
    website?: string;
  };
  featuredQuote?: string;
  courses?: Course[];
}

export interface ContactInquiry {
  id: string;
  name: string;
  email: string;
  phone?: string;
  subject: string;
  category: string;
  message: string;
  status: 'PENDING' | 'RESOLVED';
  createdAt: string;
}

export interface LessonResource {
  id: string;
  title: string;
  fileUrl: string;
  fileSize: string;
  fileType: string;
}

export interface Lesson {
  id: string;
  moduleId?: string;
  title: string;
  description?: string;
  durationMinutes?: number;
  duration?: string;
  videoUrl?: string;
  videoProvider?: string;
  isFreePreview: boolean;
  orderIndex?: number;
  order?: number;
  resources?: LessonResource[];
  isCompleted?: boolean;
  watchedSeconds?: number;
}

export type CourseLesson = Lesson;

export interface QuizOption {
  id: string;
  text: string;
}

export interface QuizQuestion {
  id: string;
  question: string;
  options: QuizOption[];
  correctOptionIndex: number;
  explanation?: string;
}

export interface Quiz {
  id: string;
  moduleId: string;
  title: string;
  description?: string;
  passingScore: number; // percentage
  questions: QuizQuestion[];
  totalQuestions?: number;
}

export interface QuizAttempt {
  id: string;
  quizId: string;
  userId: string;
  score: number;
  totalQuestions: number;
  isPassed: boolean;
  submittedAt: string;
}

export interface CourseModule {
  id: string;
  courseId?: string;
  title: string;
  orderIndex?: number;
  order?: number;
  lessons: Lesson[];
  quiz?: Quiz;
}

export interface CourseReview {
  id: string;
  courseId: string;
  userId: string;
  userName?: string;
  userAvatar?: string;
  user?: {
    id?: string;
    name: string;
    avatar?: string;
  };
  rating: number;
  comment: string;
  createdAt: string;
  isApproved?: boolean;
}

export type Review = CourseReview;

export interface Course {
  id: string;
  title: string;
  titleBn: string;
  slug: string;
  subtitle?: string;
  description: string;
  learningOutcomes: string[];
  whatYouWillLearn?: string[];
  requirements: string[];
  thumbnail: string;
  promoVideoUrl?: string;
  price: number;
  discountPrice?: number;
  level: CourseLevel;
  language: string;
  durationHours: number;
  lessonsCount: number;
  rating: number;
  reviewsCount: number;
  studentsCount: number;
  isBestseller: boolean;
  isFeatured: boolean;
  isPublished: boolean;
  categoryId: string;
  categoryName: string;
  instructorId: string;
  instructor: Instructor;
  modules: CourseModule[];
  faqs?: { question: string; answer: string }[];
  createdAt: string;
  updatedAt: string;
}

export interface Enrollment {
  id: string;
  userId: string;
  courseId: string;
  course: Course;
  enrolledAt: string;
  completionPercentage: number;
  completedAt?: string;
  certificateId?: string;
  completedLessons: string[];
  batchName?: string;
}

export interface OrderItem {
  id: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  thumbnail: string;
  price: number;
}

export interface Order {
  id: string;
  orderNumber: string;
  userId: string;
  user: {
    name: string;
    email: string;
    phone?: string;
  };
  items: OrderItem[];
  subtotal: number;
  discount: number;
  total: number;
  couponCode?: string;
  paymentMethod: PaymentMethod;
  paymentStatus: PaymentStatus;
  orderStatus: OrderStatus;
  transactionId?: string;
  paymentDetails?: any;
  createdAt: string;
}

export interface Coupon {
  id: string;
  code: string;
  discountType: CouponDiscountType;
  discountValue: number;
  minOrderAmount: number;
  maxDiscountAmount?: number;
  expiresAt: string;
  usageCount: number;
  maxUsage: number;
  isActive: boolean;
}

export interface Certificate {
  id: string;
  certificateNumber: string;
  userId: string;
  studentName: string;
  courseId: string;
  courseTitle: string;
  instructorName: string;
  issueDate: string;
  status: CertificateStatus;
  verificationUrl: string;
}

export interface BlogPost {
  id: string;
  slug: string;
  title: string;
  titleBn: string;
  excerpt: string;
  content: string;
  coverImage: string;
  authorName: string;
  authorAvatar: string;
  category: string;
  readTimeMinutes: number;
  publishedAt: string;
  isPublished: boolean;
}

export interface ValuePropItem {
  id?: string;
  title: string;
  titleEn?: string;
  desc: string;
  descEn?: string;
  icon?: string;
}

export interface MentorItem {
  id?: string;
  name: string;
  role: string;
  tag: string;
  rating: string;
  reviews?: string;
  courses: string;
  students: string;
  image: string;
}

export interface TestimonialItem {
  id?: string;
  student: string;
  company: string;
  quote: string;
  avatar: string;
  rating?: number;
}

export interface LiveSaleNotification {
  id: string;
  studentName: string;
  city: string;
  courseId: string;
  courseTitle: string;
  courseSlug: string;
  courseThumbnail: string;
  price?: number;
  timeAgoBn: string;
  timeAgoEn: string;
  actionBn: string;
  actionEn: string;
  verified: boolean;
}

export interface PlatformSettings {
  platformName: string;
  taglineBn: string;
  taglineEn: string;
  contactEmail: string;
  contactPhone: string;
  contactWorkingHours?: string;
  address: string;
  currencySymbol: string;
  defaultLanguage: 'bn' | 'en';
  bkashEnabled: boolean;
  nagadEnabled: boolean;
  sslcommerzEnabled: boolean;
  stripeEnabled: boolean;

  // Live Sales Social Proof Toast
  liveSalesNotificationEnabled?: boolean;
  liveSalesIntervalSeconds?: number;

  // Hero Section
  heroBadgeBn?: string;
  heroBadgeEn?: string;
  heroBannerTitleBn: string;
  heroBannerTitleEn?: string;
  heroHighlightBn?: string;
  heroHighlightEn?: string;
  heroBannerSubBn: string;
  heroBannerSubEn?: string;
  heroCta1TextBn?: string;
  heroCta1TextEn?: string;
  heroCta1Link?: string;
  heroCta2TextBn?: string;
  heroCta2TextEn?: string;
  heroCta2Link?: string;
  trustBullet1?: string;
  trustBullet2?: string;
  trustBullet3?: string;

  // Key Stats Counters
  stat1Value?: string;
  stat1LabelBn?: string;
  stat1LabelEn?: string;
  stat2Value?: string;
  stat2LabelBn?: string;
  stat2LabelEn?: string;
  stat3Value?: string;
  stat3LabelBn?: string;
  stat3LabelEn?: string;
  stat4Value?: string;
  stat4LabelBn?: string;
  stat4LabelEn?: string;

  // Top Promo Ads Banner
  topBannerEnabled?: boolean;
  topBannerBadgeBn?: string;
  topBannerTextBn?: string;
  topBannerTextEn?: string;
  topBannerCoupon?: string;
  topBannerBtnTextBn?: string;
  topBannerBtnTextEn?: string;

  // Promo Popup Modal
  promoModalEnabled?: boolean;
  promoModalTitle?: string;
  promoModalSubtitle?: string;
  promoModalDiscount?: string;
  promoModalCode?: string;
  promoModalHours?: number;

  // Categories Section
  categoriesBadgeBn?: string;
  categoriesTitleBn?: string;
  categoriesSubBn?: string;
  categoriesBtnTextBn?: string;

  // Featured Courses Section
  featuredBadgeBn?: string;
  featuredTitleBn?: string;
  featuredSubBn?: string;
  featuredBtnTextBn?: string;

  // Value propositions (Why choose us)
  whyChooseTitleBn?: string;
  whyChooseTitleEn?: string;
  whyChooseSubBn?: string;
  whyChooseSubEn?: string;
  valueProps?: ValuePropItem[];

  // Instructors & Mentors Section
  mentorsBadgeBn?: string;
  mentorsTitleBn?: string;
  mentorsSubBn?: string;
  mentorsList?: MentorItem[];

  // Student Testimonials Section
  testimonialsBadgeBn?: string;
  testimonialsTitleBn?: string;
  testimonialsSubBn?: string;
  testimonialsList?: TestimonialItem[];

  // Bottom CTA Enrollment Banner
  ctaBannerBadgeBn?: string;
  ctaBannerTitleBn?: string;
  ctaBannerSubBn?: string;
  ctaBannerBtn1TextBn?: string;
  ctaBannerBtn1Link?: string;
  ctaBannerBtn2TextBn?: string;
  ctaBannerBtn2Link?: string;

  // Footer & Social Links
  footerBioBn?: string;
  footerBioEn?: string;
  copyrightText?: string;
  facebookUrl?: string;
  youtubeUrl?: string;
  linkedinUrl?: string;
  githubUrl?: string;
}

export interface CartItem {
  course: Course;
  addedAt: string;
}

export interface NotificationItem {
  id: string;
  type?: 'order' | 'chat' | 'student' | 'review' | 'certificate' | 'system';
  title: string;
  message: string;
  link?: string;
  isRead: boolean;
  createdAt: string;
  metadata?: any;
}

export interface ChatMessage {
  id: string;
  sender: 'user' | 'admin';
  senderName: string;
  text: string;
  timestamp: string;
}

export interface SupportConversation {
  id: string;
  userName: string;
  userEmail: string;
  userPhone?: string;
  userId?: string;
  lastMessage: string;
  updatedAt: string;
  unreadCountAdmin: number;
  unreadCountUser: number;
  status: 'OPEN' | 'RESOLVED';
  messages: ChatMessage[];
}

export interface LiveClass {
  id: string;
  courseId: string;
  courseTitle?: string;
  instructorId: string;
  instructorName?: string;
  title: string;
  description?: string;
  scheduledAt: string; // ISO date string
  durationMinutes: number;
  zoomUrl: string;
  meetingId?: string;
  passcode?: string;
  status: 'SCHEDULED' | 'LIVE' | 'COMPLETED';
  createdAt: string;
}

export interface ExamQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation?: string;
  points?: number;
}

export interface Exam {
  id: string;
  courseId: string;
  courseTitle?: string;
  instructorId: string;
  instructorName?: string;
  title: string;
  description: string;
  durationMinutes: number;
  passingScore: number;
  questions: ExamQuestion[];
  totalMarks?: number;
  isPublished: boolean;
  createdAt: string;
}

export interface ExamSubmission {
  id: string;
  examId: string;
  examTitle?: string;
  courseId: string;
  courseTitle?: string;
  userId: string;
  userName: string;
  userEmail?: string;
  score: number;
  correctAnswersCount: number;
  totalQuestions: number;
  passed: boolean;
  answers: { questionId: string; selectedIndex: number; isCorrect: boolean }[];
  submittedAt: string;
}

export type NoticePriority = 'NORMAL' | 'IMPORTANT' | 'URGENT';
export type NoticeTargetType = 'ALL' | 'COURSE' | 'BATCH';

export interface Notice {
  id: string;
  title: string;
  content: string;
  targetType: NoticeTargetType;
  targetCourseId?: string;
  targetCourseTitle?: string;
  batchName?: string;
  priority: NoticePriority;
  authorId: string;
  authorName: string;
  authorRole: 'ADMIN' | 'SUPER_ADMIN' | 'INSTRUCTOR' | 'TEACHER';
  isPinned?: boolean;
  createdAt: string;
  updatedAt?: string;
}


import React, { useState, useEffect, useRef } from 'react';
import {
  GraduationCap,
  Search,
  ShoppingCart,
  Moon,
  Sun,
  Globe,
  User as UserIcon,
  BookOpen,
  Award,
  ShieldAlert,
  LogOut,
  Menu,
  X,
  LayoutDashboard,
  Home,
  Grid,
  Users,
  CheckCircle,
  FileText,
  ChevronRight,
  LogIn,
  Star,
  Loader2,
  ArrowRight,
  Phone,
  Mail,
  Sparkles,
  Info,
  PhoneCall,
  Megaphone
} from 'lucide-react';
import { Course } from '../types';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useWebsiteContent } from '../context/WebsiteContentContext';

interface NavbarProps {
  onNavigate: (route: string, param?: string) => void;
  currentRoute: string;
  onOpenCart?: () => void;
  onOpenAuth?: (mode?: 'login' | 'register') => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onNavigate,
  currentRoute,
  onOpenCart,
  onOpenAuth
}) => {
  const { user, logout, demoLogin } = useAuth();
  const { cart, setIsCartOpen } = useCart();
  const { theme, toggleTheme } = useTheme();
  const { language, toggleLanguage, t } = useLanguage();
  const { settings } = useWebsiteContent();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [userDropdownOpen, setUserDropdownOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<Course[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchDropdownOpen, setIsSearchDropdownOpen] = useState(false);
  const [unreadNoticesCount, setUnreadNoticesCount] = useState<number>(0);
  const desktopSearchRef = useRef<HTMLDivElement>(null);

  // Sync unread notices for student
  useEffect(() => {
    if (!user) {
      setUnreadNoticesCount(0);
      return;
    }

    const checkUnread = () => {
      fetch('/api/notices')
        .then((r) => r.json())
        .then((data) => {
          const list = data.notices || [];
          try {
            const stored = localStorage.getItem(`read_notices_${user.id || 'guest'}`);
            const readIds = stored ? JSON.parse(stored) : [];
            const count = list.filter((n: any) => !readIds.includes(n.id)).length;
            setUnreadNoticesCount(count);
          } catch {
            setUnreadNoticesCount(0);
          }
        })
        .catch(() => {});
    };

    checkUnread();

    const handleNoticesUpdated = () => checkUnread();
    const handleNoticeRead = () => checkUnread();

    window.addEventListener('notices_updated', handleNoticesUpdated);
    window.addEventListener('notice_read', handleNoticeRead);
    return () => {
      window.removeEventListener('notices_updated', handleNoticesUpdated);
      window.removeEventListener('notice_read', handleNoticeRead);
    };
  }, [user]);

  // Prevent background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  // Dynamic search debounced query
  useEffect(() => {
    const trimmed = searchQuery.trim();
    if (!trimmed) {
      setSearchResults([]);
      setIsSearchDropdownOpen(false);
      setIsSearching(false);
      return;
    }

    setIsSearching(true);
    setIsSearchDropdownOpen(true);

    const timer = setTimeout(() => {
      fetch(`/api/courses?search=${encodeURIComponent(trimmed)}`)
        .then((res) => res.json())
        .then((data) => {
          const list: Course[] = Array.isArray(data) ? data : (data?.courses || []);
          setSearchResults(list.slice(0, 6));
        })
        .catch(() => {
          setSearchResults([]);
        })
        .finally(() => {
          setIsSearching(false);
        });
    }, 180);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  // Click outside to close desktop search dropdown
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (desktopSearchRef.current && !desktopSearchRef.current.contains(e.target as Node)) {
        setIsSearchDropdownOpen(false);
      }
    };
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsSearchDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      onNavigate('courses', searchQuery.trim());
      setIsSearchDropdownOpen(false);
      setMobileMenuOpen(false);
    }
  };

  const handleSelectSearchResult = (slug: string) => {
    onNavigate('course-details', slug);
    setIsSearchDropdownOpen(false);
    setSearchQuery('');
    setMobileMenuOpen(false);
  };

  // Lock background scroll when mobile drawer is open
  useEffect(() => {
    if (mobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [mobileMenuOpen]);

  const navLinks = [
    { label: language === 'bn' ? 'হোম' : 'Home', route: 'home', icon: Home },
    { label: t('navCourses'), route: 'courses', icon: BookOpen },
    { label: t('navCategories'), route: 'categories', icon: Grid },
    { label: language === 'bn' ? 'মেন্টরস' : 'Mentors', route: 'instructors', icon: Users },
    { label: language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us', route: 'about', icon: Info },
    { label: language === 'bn' ? 'যোগাযোগ' : 'Contact', route: 'contact', icon: PhoneCall },
    { label: t('navVerifyCert'), route: 'verify-cert', icon: Award },
    { label: t('navBlog'), route: 'blog', icon: FileText }
  ];

  return (
    <>
      <header className="sticky top-0 z-40 w-full border-b border-slate-200 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md transition-colors shadow-xs">
        {/* Top Header Bar: Contact Phone, Email & Highlights (hidden on tiny screens for mobile space) */}
        <div
          id="navbar-top-header"
          className="hidden sm:block w-full bg-slate-900 text-slate-300 text-xs border-b border-slate-800/80 py-1.5 px-4 sm:px-6 lg:px-8 transition-colors"
        >
        <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
          {/* Left: Contact Info (Phone & Email) */}
          <div className="flex items-center gap-4 sm:gap-6 flex-wrap">
            <a
              id="topbar-phone"
              href={`tel:${settings.supportPhone || '+880 1712-345678'}`}
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <Phone className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-semibold text-slate-200">{settings.supportPhone || '+880 1712-345678'}</span>
              <span className="hidden md:inline text-[11px] text-slate-400 font-normal">
                ({language === 'bn' ? 'সকাল ৯টা - রাত ১০টা' : '9 AM - 10 PM'})
              </span>
            </a>

            <a
              id="topbar-email"
              href={`mailto:${settings.supportEmail || 'support@skillnest.academy'}`}
              className="flex items-center gap-1.5 hover:text-emerald-400 transition-colors"
            >
              <Mail className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-medium">{settings.supportEmail || 'support@skillnest.academy'}</span>
            </a>
          </div>

          {/* Right: Announcement & Quick Certificate Verification */}
          <div className="flex items-center gap-3 ml-auto sm:ml-0">
            <div className="hidden sm:flex items-center gap-1.5 text-amber-300 bg-amber-950/60 px-2.5 py-0.5 rounded-full border border-amber-800/50 text-[11px] font-semibold">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 shrink-0" />
              <span>
                {settings.topPromoCode
                  ? (language === 'bn'
                      ? `🎉 বিশেষ অফার! কুপন: ${settings.topPromoCode}`
                      : `🎉 Special Offer! Coupon: ${settings.topPromoCode}`)
                  : (language === 'bn'
                      ? '🎉 নতুন ব্যাচ ছাড়! কুপন: SKILL20'
                      : '🎉 New Batch Offer! Coupon: SKILL20')}
              </span>
            </div>

            <button
              id="topbar-verify-cert"
              onClick={() => onNavigate('verify-cert')}
              className="text-[11px] hover:text-emerald-400 transition-colors text-slate-300 flex items-center gap-1 cursor-pointer"
            >
              <Award className="w-3 h-3 text-emerald-400" />
              <span>{language === 'bn' ? 'সার্টিফিকেট যাচাই' : 'Verify Certificate'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 sm:h-18 flex items-center justify-between gap-3">
        
        {/* LEFT: Brand Logo & Name */}
        <div
          id="brand-logo"
          onClick={() => {
            onNavigate('home');
            setMobileMenuOpen(false);
          }}
          className="flex items-center gap-2.5 cursor-pointer select-none group shrink-0"
        >
          <div className="w-9 h-9 sm:w-10 sm:h-10 rounded-xl bg-gradient-to-br from-emerald-600 to-teal-700 flex items-center justify-center text-white shadow-md shadow-emerald-500/20 group-hover:scale-105 transition-transform">
            <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6" />
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-lg sm:text-xl tracking-tight text-slate-900 dark:text-white">
                Skill<span className="text-emerald-600 dark:text-emerald-400">Nest</span>
              </span>
              <span className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 dark:bg-emerald-950/80 text-emerald-800 dark:text-emerald-300 uppercase tracking-wide">
                Academy
              </span>
            </div>
            <p className="text-[10px] sm:text-[11px] text-slate-500 dark:text-slate-400 hidden sm:block">
              {language === 'bn' ? 'বাংলাদেশ এডটেক প্ল্যাটফর্ম' : 'Bangladesh EdTech LMS'}
            </p>
          </div>
        </div>

        {/* CENTER (Desktop): Nav Links & Search Bar */}
        <div className="hidden lg:flex items-center gap-6 flex-1 justify-center max-w-2xl mx-4">
          <nav className="flex items-center gap-5 text-sm font-medium">
            {navLinks.map((link) => (
              <button
                key={link.route}
                id={`desktop-nav-${link.route}`}
                onClick={() => onNavigate(link.route)}
                className={`transition-colors py-1 relative whitespace-nowrap ${
                  currentRoute === link.route
                    ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-emerald-600 dark:hover:text-emerald-400'
                }`}
              >
                {link.label}
                {currentRoute === link.route && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-emerald-600 dark:bg-emerald-400 rounded-full" />
                )}
              </button>
            ))}
          </nav>

          {/* Desktop Search */}
          <div ref={desktopSearchRef} className="relative w-56 xl:w-72">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
              <input
                id="global-search-input"
                type="text"
                value={searchQuery}
                onFocus={() => {
                  if (searchQuery.trim()) setIsSearchDropdownOpen(true);
                }}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('navSearchPlaceholder')}
                className="w-full pl-9 pr-8 py-1.5 text-xs rounded-full bg-slate-100 dark:bg-slate-800 border border-transparent focus:border-emerald-500 dark:focus:border-emerald-500 focus:bg-white dark:focus:bg-slate-900 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none transition-all"
              />
              {isSearching ? (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-500 animate-spin" />
              ) : searchQuery ? (
                <button
                  type="button"
                  onClick={() => {
                    setSearchQuery('');
                    setIsSearchDropdownOpen(false);
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 rounded-full text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                >
                  <X className="w-3 h-3" />
                </button>
              ) : null}
            </form>

            {/* Live Autocomplete Suggestions Dropdown */}
            {isSearchDropdownOpen && searchQuery.trim() && (
              <div
                id="desktop-search-dropdown"
                className="absolute left-0 right-0 sm:right-auto sm:w-96 top-full mt-2 bg-white dark:bg-slate-900 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-800 p-2.5 z-50 animate-in fade-in zoom-in-95 duration-100"
              >
                <div className="px-2.5 py-1.5 flex items-center justify-between text-[11px] font-bold text-slate-500 border-b border-slate-100 dark:border-slate-800">
                  <span>
                    {language === 'bn' ? 'কোর্স সাজেশন' : 'Suggested Courses'}
                    {searchResults.length > 0 ? ` (${searchResults.length})` : ''}
                  </span>
                  <button
                    onClick={() => setIsSearchDropdownOpen(false)}
                    className="text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>

                {isSearching ? (
                  <div className="p-4 space-y-2">
                    <div className="flex items-center gap-2 text-xs text-slate-400 animate-pulse">
                      <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                      <span>{language === 'bn' ? 'খোঁজা হচ্ছে...' : 'Searching...'}</span>
                    </div>
                    {[1, 2].map((i) => (
                      <div key={i} className="h-12 bg-slate-100 dark:bg-slate-800 rounded-xl animate-pulse" />
                    ))}
                  </div>
                ) : searchResults.length === 0 ? (
                  <div className="p-5 text-center space-y-2">
                    <p className="text-xs text-slate-500">
                      {language === 'bn'
                        ? `"${searchQuery}" সম্পর্কিত কোনো কোর্স পাওয়া যায়নি`
                        : `No courses found matching "${searchQuery}"`}
                    </p>
                    <button
                      type="button"
                      onClick={() => {
                        setIsSearchDropdownOpen(false);
                        onNavigate('courses');
                      }}
                      className="text-xs font-bold text-emerald-600 hover:underline cursor-pointer"
                    >
                      {language === 'bn' ? 'সকল কোর্স দেখুন' : 'Browse All Courses'}
                    </button>
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100 dark:divide-slate-800/60 max-h-80 overflow-y-auto">
                    {searchResults.map((course) => {
                      const currentPrice = (course.discountPrice !== undefined ? course.discountPrice : course.price) ?? 0;
                      return (
                        <div
                          key={course.id}
                          onClick={() => handleSelectSearchResult(course.slug)}
                          className="p-2 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800/80 cursor-pointer transition-colors flex items-center gap-3 group"
                        >
                          <img
                            src={course.thumbnail}
                            alt={course.title}
                            className="w-12 h-10 rounded-lg object-cover bg-slate-100 shrink-0 border border-slate-200/50"
                          />
                          <div className="min-w-0 flex-1">
                            <h4 className="font-bold text-xs text-slate-900 dark:text-white truncate group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
                              {course.title}
                            </h4>
                            <div className="flex items-center gap-2 mt-0.5 text-[10px] text-slate-500">
                              <span className="text-emerald-600 font-semibold">{course.categoryName}</span>
                              <span>•</span>
                              <span className="truncate">{course.instructor?.name || 'মেন্টর'}</span>
                            </div>
                          </div>
                          <div className="text-right shrink-0">
                            <div className="text-xs font-bold text-emerald-600">
                              {currentPrice === 0 ? (
                                <span className="text-emerald-600 font-bold">{t('priceFree')}</span>
                              ) : (
                                `৳${(currentPrice ?? 0).toLocaleString()}`
                              )}
                            </div>
                            <div className="flex items-center justify-end gap-1 text-[10px] text-amber-500">
                              <Star className="w-2.5 h-2.5 fill-amber-400 text-amber-400" />
                              <span>{course.rating.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {/* View all results footer */}
                    <div className="pt-2 px-1">
                      <button
                        type="button"
                        onClick={handleSearchSubmit}
                        className="w-full py-2 px-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 dark:hover:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 text-xs font-bold flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
                      >
                        <span>
                          {language === 'bn'
                            ? `"${searchQuery}" সম্পর্কিত সকল কোর্স দেখুন`
                            : `View all results for "${searchQuery}"`}
                        </span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>

        {/* RIGHT: Controls & Auth */}
        <div className="flex items-center gap-1.5 sm:gap-2.5">
          
          {/* 1. Language button */}
          <button
            id="lang-switcher-btn"
            onClick={toggleLanguage}
            title="Switch Language (বাংলা / English)"
            className="flex items-center gap-1 px-2 sm:px-2.5 py-1.5 rounded-lg text-xs font-semibold text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            <Globe className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400" />
            <span>{language === 'bn' ? 'বাং' : 'EN'}</span>
          </button>

          {/* 2. Theme toggle */}
          <button
            id="theme-switcher-btn"
            onClick={toggleTheme}
            title="Toggle Light/Dark Theme"
            className="p-2 rounded-lg text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
          >
            {theme === 'dark' ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
          </button>

          {/* 3. Cart icon */}
          <button
            id="cart-drawer-trigger"
            onClick={() => {
              if (onOpenCart) onOpenCart();
              setIsCartOpen(true);
            }}
            className="relative p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="Shopping Cart"
          >
            <ShoppingCart className="w-4 h-4" />
            {cart.length > 0 && (
              <span className="absolute -top-1.5 -right-1.5 w-5 h-5 bg-emerald-600 text-white text-[11px] font-bold rounded-full flex items-center justify-center shadow-xs">
                {cart.length}
              </span>
            )}
          </button>

          {/* 4. Desktop User / Login (hidden on mobile, drawer handles it on mobile) */}
          <div className="hidden lg:block">
            {user ? (
              <div className="relative">
                <button
                  id="user-profile-menu-trigger"
                  onClick={() => setUserDropdownOpen(!userDropdownOpen)}
                  className="flex items-center gap-2 p-1 rounded-full hover:ring-2 hover:ring-emerald-500/30 transition-all"
                >
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={user.name}
                    className="w-8 h-8 rounded-full object-cover border border-emerald-500/50"
                  />
                </button>

                {userDropdownOpen && (
                  <div
                    id="user-dropdown-menu"
                    className="absolute right-0 mt-2 w-64 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-xl py-2 z-50 text-sm animate-in fade-in zoom-in-95 duration-100"
                  >
                    <div className="px-4 py-3 border-b border-slate-100 dark:border-slate-800">
                      <p className="font-semibold text-slate-900 dark:text-white truncate">{user.name}</p>
                      <p className="text-xs text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                      <div className="mt-1.5">
                        <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                          user.role === 'SUPER_ADMIN' || user.role === 'ADMIN'
                            ? 'bg-rose-100 dark:bg-rose-950/70 text-rose-700 dark:text-rose-300'
                            : 'bg-emerald-100 dark:bg-emerald-950/70 text-emerald-700 dark:text-emerald-300'
                        }`}>
                          {user.role}
                        </span>
                      </div>
                    </div>

                    <div className="py-1">
                      <button
                        id="dropdown-student-dashboard"
                        onClick={() => {
                          onNavigate('student-dashboard');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      >
                        <LayoutDashboard className="w-4 h-4 text-emerald-600" />
                        <span>{t('navDashboard')}</span>
                      </button>

                      <button
                        id="dropdown-my-courses"
                        onClick={() => {
                          onNavigate('student-dashboard', 'courses');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      >
                        <BookOpen className="w-4 h-4 text-teal-600" />
                        <span>{t('tabMyCourses')}</span>
                      </button>

                      <button
                        id="dropdown-my-certificates"
                        onClick={() => {
                          onNavigate('student-dashboard', 'certificates');
                          setUserDropdownOpen(false);
                        }}
                        className="w-full text-left px-4 py-2 flex items-center gap-2.5 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800/60"
                      >
                        <Award className="w-4 h-4 text-amber-500" />
                        <span>{t('tabCertificates')}</span>
                      </button>

                      {(user.role === 'INSTRUCTOR' || user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                        <button
                          id="dropdown-teacher-portal"
                          onClick={() => {
                            onNavigate('teacher-dashboard');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 flex items-center gap-2.5 text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 font-bold"
                        >
                          <GraduationCap className="w-4 h-4 text-emerald-600" />
                          <span>শিক্ষক ড্যাশবোর্ড (Teacher Portal)</span>
                        </button>
                      )}

                      {(user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                        <button
                          id="dropdown-admin-panel"
                          onClick={() => {
                            onNavigate('admin');
                            setUserDropdownOpen(false);
                          }}
                          className="w-full text-left px-4 py-2 flex items-center gap-2.5 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-semibold"
                        >
                          <ShieldAlert className="w-4 h-4" />
                          <span>{t('navAdmin')}</span>
                        </button>
                      )}
                    </div>

                    <div className="border-t border-slate-100 dark:border-slate-800 pt-1.5 pb-1 px-3">
                      <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                        রোল পরিবর্তন (Demo Roles):
                      </div>
                      <div className="grid grid-cols-3 gap-1">
                        <button
                          onClick={() => {
                            demoLogin('student');
                            setUserDropdownOpen(false);
                          }}
                          className={`py-1 px-1.5 rounded-lg text-[10px] font-bold text-center border transition-colors ${
                            user.role === 'STUDENT'
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          ছাত্র
                        </button>
                        <button
                          onClick={() => {
                            demoLogin('instructor');
                            setUserDropdownOpen(false);
                          }}
                          className={`py-1 px-1.5 rounded-lg text-[10px] font-bold text-center border transition-colors ${
                            user.role === 'INSTRUCTOR'
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          শিক্ষক
                        </button>
                        <button
                          onClick={() => {
                            demoLogin('admin');
                            setUserDropdownOpen(false);
                          }}
                          className={`py-1 px-1.5 rounded-lg text-[10px] font-bold text-center border transition-colors ${
                            user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
                              ? 'bg-emerald-600 text-white border-emerald-600'
                              : 'bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:bg-slate-100'
                          }`}
                        >
                          এডমিন
                        </button>
                      </div>

                      <button
                        id="dropdown-logout-btn"
                        onClick={() => {
                          logout();
                          setUserDropdownOpen(false);
                        }}
                        className="w-full mt-2 py-1.5 flex items-center justify-center gap-2 text-xs font-semibold text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 rounded-lg"
                      >
                        <LogOut className="w-3.5 h-3.5" />
                        <span>{t('navLogout')}</span>
                      </button>
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <button
                  id="header-login-btn"
                  onClick={() => onNavigate('login')}
                  className="px-3 py-1.5 text-xs font-semibold text-slate-700 dark:text-slate-200 hover:text-emerald-600 transition-colors"
                >
                  {t('navLogin')}
                </button>
                <button
                  id="header-register-btn"
                  onClick={() => onNavigate('register')}
                  className="px-3.5 py-1.5 rounded-lg text-xs font-semibold bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs transition-all"
                >
                  {t('navRegister')}
                </button>
              </div>
            )}
          </div>

          {/* 5. Mobile Hamburger Menu Button */}
          <button
            id="mobile-menu-trigger"
            onClick={() => setMobileMenuOpen(true)}
            className="lg:hidden p-2 rounded-lg text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors cursor-pointer"
            title="Open Navigation Menu"
          >
            <Menu className="w-5 h-5" />
          </button>

        </div>

      </div>
    </header>

    {/* MOBILE NAVIGATION DRAWER / SHEET (Rendered outside header so position:fixed covers full viewport) */}
    {mobileMenuOpen && (
      <div className="fixed inset-0 z-[70] lg:hidden flex justify-end">
        {/* Backdrop Overlay with smooth transition */}
        <div
          id="mobile-drawer-backdrop"
          onClick={() => setMobileMenuOpen(false)}
          className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity animate-in fade-in duration-200"
        />

        {/* Drawer Content Panel */}
        <div
          id="mobile-nav-drawer"
          className="relative w-full max-w-xs sm:max-w-sm h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-300 overflow-hidden"
        >
            {/* Drawer Header */}
            <div className="p-4.5 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shadow-xs">
                  <GraduationCap className="w-5 h-5" />
                </div>
                <div>
                  <span className="font-extrabold text-base text-slate-900 dark:text-white">
                    Skill<span className="text-emerald-600 dark:text-emerald-400">Nest</span>
                  </span>
                  <p className="text-[10px] text-slate-400">মেনু ও নেভিগেশন</p>
                </div>
              </div>

              {/* Close Button */}
              <button
                id="mobile-drawer-close-btn"
                onClick={() => setMobileMenuOpen(false)}
                className="p-2 rounded-xl text-slate-500 hover:text-slate-800 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Scrollable Drawer Content */}
            <div className="flex-1 overflow-y-auto p-4 space-y-5">
              
              {/* Drawer Search Input with Live Suggestions */}
              <div className="space-y-2">
                <form onSubmit={handleSearchSubmit}>
                  <div className="relative w-full">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder={t('navSearchPlaceholder')}
                      className="w-full pl-9 pr-8 py-2.5 text-xs sm:text-sm rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-100 placeholder-slate-400 outline-none focus:border-emerald-500"
                    />
                    {isSearching ? (
                      <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-emerald-500 animate-spin" />
                    ) : searchQuery ? (
                      <button
                        type="button"
                        onClick={() => setSearchQuery('')}
                        className="absolute right-2.5 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-slate-600"
                      >
                        <X className="w-3.5 h-3.5" />
                      </button>
                    ) : null}
                  </div>
                </form>

                {searchQuery.trim() && (
                  <div className="rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/90 p-2 space-y-1 shadow-sm">
                    <div className="px-2 py-1 text-[11px] font-bold text-slate-400 flex items-center justify-between">
                      <span>{language === 'bn' ? 'ফলাফল' : 'Results'}</span>
                      {searchResults.length > 0 && <span>{searchResults.length}টি পাওয়া গেছে</span>}
                    </div>

                    {isSearching ? (
                      <div className="p-3 text-center text-xs text-slate-400 flex items-center justify-center gap-2">
                        <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-500" />
                        <span>{language === 'bn' ? 'খোঁজা হচ্ছে...' : 'Searching...'}</span>
                      </div>
                    ) : searchResults.length === 0 ? (
                      <div className="p-3 text-center text-xs text-slate-500">
                        {language === 'bn' ? 'কোনো কোর্স পাওয়া যায়নি' : 'No courses found'}
                      </div>
                    ) : (
                      <div className="divide-y divide-slate-100 dark:divide-slate-800 max-h-56 overflow-y-auto">
                        {searchResults.map((course) => (
                          <div
                            key={course.id}
                            onClick={() => handleSelectSearchResult(course.slug)}
                            className="p-2 flex items-center gap-2.5 hover:bg-slate-50 dark:hover:bg-slate-800/80 rounded-lg cursor-pointer transition-colors"
                          >
                            <img
                              src={course.thumbnail}
                              alt={course.title}
                              className="w-10 h-8 rounded object-cover shrink-0"
                            />
                            <div className="min-w-0 flex-1">
                              <p className="text-xs font-bold text-slate-900 dark:text-white truncate">
                                {course.title}
                              </p>
                              <span className="text-[10px] text-emerald-600 font-medium">
                                {course.categoryName}
                              </span>
                            </div>
                            <span className="text-[11px] font-bold text-emerald-600 shrink-0">
                              {((course.discountPrice ?? course.price ?? 0)) === 0 ? 'ফ্রি' : `৳${((course.discountPrice ?? course.price ?? 0)).toLocaleString()}`}
                            </span>
                          </div>
                        ))}

                        <button
                          type="button"
                          onClick={handleSearchSubmit}
                          className="w-full mt-1 py-1.5 text-center text-xs font-bold text-emerald-600 dark:text-emerald-400 hover:underline cursor-pointer"
                        >
                          {language === 'bn' ? `"${searchQuery}" দিয়ে সকল কোর্স দেখুন` : `View all for "${searchQuery}"`}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* User Quick Info (if logged in) */}
              {user && (
                <div className="p-3 rounded-2xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/80 flex items-center gap-3">
                  <img
                    src={user.avatar || 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=100'}
                    alt={user.name}
                    className="w-10 h-10 rounded-full object-cover border border-emerald-500"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="font-bold text-xs text-slate-900 dark:text-white truncate">{user.name}</p>
                    <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate">{user.email}</p>
                    <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-emerald-600 text-white mt-0.5 inline-block">
                      {user.role}
                    </span>
                  </div>
                </div>
              )}

              {/* Core Navigation Links with Active Menu Indicator */}
              <div className="space-y-1">
                <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {language === 'bn' ? 'মূল পেইজসমূহ' : 'Main Menu'}
                </p>

                {/* Home */}
                <button
                  id="mobile-drawer-home"
                  onClick={() => {
                    onNavigate('home');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between transition-colors ${
                    currentRoute === 'home'
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Home className="w-4 h-4" />
                    <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
                  </div>
                  {currentRoute === 'home' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </button>

                {/* Courses */}
                <button
                  id="mobile-drawer-courses"
                  onClick={() => {
                    onNavigate('courses');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between transition-colors ${
                    currentRoute === 'courses'
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-4 h-4" />
                    <span>{t('navCourses')}</span>
                  </div>
                  {currentRoute === 'courses' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </button>

                {/* Categories */}
                <button
                  id="mobile-drawer-categories"
                  onClick={() => {
                    onNavigate('categories');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between transition-colors ${
                    currentRoute === 'categories'
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Grid className="w-4 h-4" />
                    <span>{t('navCategories')}</span>
                  </div>
                  {currentRoute === 'categories' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </button>

                {/* Mentors */}
                <button
                  id="mobile-drawer-mentors"
                  onClick={() => {
                    onNavigate('instructors');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between transition-colors ${
                    currentRoute === 'instructors'
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Users className="w-4 h-4" />
                    <span>{language === 'bn' ? 'মেন্টরস ও ট্রেইনার' : 'Mentors & Instructors'}</span>
                  </div>
                  {currentRoute === 'instructors' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </button>

                {/* Certificate Verification */}
                <button
                  id="mobile-drawer-cert"
                  onClick={() => {
                    onNavigate('verify-cert');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between transition-colors ${
                    currentRoute === 'verify-cert'
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Award className="w-4 h-4" />
                    <span>{t('navVerifyCert')}</span>
                  </div>
                  {currentRoute === 'verify-cert' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </button>

                {/* Blog */}
                <button
                  id="mobile-drawer-blog"
                  onClick={() => {
                    onNavigate('blog');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between transition-colors ${
                    currentRoute === 'blog'
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <FileText className="w-4 h-4" />
                    <span>{t('navBlog')}</span>
                  </div>
                  {currentRoute === 'blog' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </button>

                {/* About Us */}
                <button
                  id="mobile-drawer-about"
                  onClick={() => {
                    onNavigate('about');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between transition-colors ${
                    currentRoute === 'about'
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <Info className="w-4 h-4" />
                    <span>{language === 'bn' ? 'আমাদের সম্পর্কে' : 'About Us'}</span>
                  </div>
                  {currentRoute === 'about' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </button>

                {/* Contact */}
                <button
                  id="mobile-drawer-contact"
                  onClick={() => {
                    onNavigate('contact');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between transition-colors ${
                    currentRoute === 'contact'
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <PhoneCall className="w-4 h-4" />
                    <span>{language === 'bn' ? 'যোগাযোগ' : 'Contact'}</span>
                  </div>
                  {currentRoute === 'contact' && <span className="w-1.5 h-1.5 rounded-full bg-white" />}
                </button>
              </div>

              {/* Student & Account Section */}
              <div className="pt-2 border-t border-slate-200 dark:border-slate-800 space-y-1">
                <p className="px-3 text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-1">
                  {language === 'bn' ? 'লার্নিং ও অ্যাকাউন্ট' : 'Learning & Account'}
                </p>

                {/* My Learning */}
                <button
                  id="mobile-drawer-learning"
                  onClick={() => {
                    onNavigate('student-dashboard', 'courses');
                    setMobileMenuOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium flex items-center justify-between transition-colors ${
                    currentRoute === 'student-dashboard'
                      ? 'bg-emerald-600 text-white font-bold shadow-xs'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <LayoutDashboard className="w-4 h-4 text-emerald-500" />
                    <span>{language === 'bn' ? 'মাই লার্নিং ড্যাশবোর্ড' : 'My Learning'}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Profile */}
                <button
                  id="mobile-drawer-profile"
                  onClick={() => {
                    onNavigate('student-dashboard', 'profile');
                    setMobileMenuOpen(false);
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between"
                >
                  <div className="flex items-center gap-3">
                    <UserIcon className="w-4 h-4 text-indigo-500" />
                    <span>{language === 'bn' ? 'প্রোফাইল সেটিংস' : 'Profile'}</span>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400" />
                </button>

                {/* Cart in drawer */}
                <button
                  id="mobile-drawer-cart"
                  onClick={() => {
                    setMobileMenuOpen(false);
                    if (onOpenCart) onOpenCart();
                    setIsCartOpen(true);
                  }}
                  className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-medium text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 flex items-center justify-between cursor-pointer"
                >
                  <div className="flex items-center gap-3">
                    <ShoppingCart className="w-4 h-4 text-amber-500" />
                    <span>{language === 'bn' ? 'শপিং কার্ট' : 'Cart'}</span>
                  </div>
                  {cart.length > 0 && (
                    <span className="px-2 py-0.5 rounded-full text-xs font-bold bg-emerald-600 text-white">
                      {cart.length}
                    </span>
                  )}
                </button>

                {/* Teacher Portal Link */}
                {user && (user.role === 'INSTRUCTOR' || user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                  <button
                    id="mobile-drawer-teacher"
                    onClick={() => {
                      onNavigate('teacher-dashboard');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-emerald-700 dark:text-emerald-400 hover:bg-emerald-50 dark:hover:bg-emerald-950/40 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <GraduationCap className="w-4 h-4 text-emerald-600" />
                      <span>শিক্ষক ড্যাশবোর্ড (Teacher Portal)</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-emerald-500" />
                  </button>
                )}

                {/* Admin Link (if authorized) */}
                {user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN') && (
                  <button
                    id="mobile-drawer-admin"
                    onClick={() => {
                      onNavigate('admin');
                      setMobileMenuOpen(false);
                    }}
                    className="w-full text-left px-3.5 py-2.5 rounded-xl text-xs sm:text-sm font-bold text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-3">
                      <ShieldAlert className="w-4 h-4" />
                      <span>{t('navAdmin')}</span>
                    </div>
                    <ChevronRight className="w-4 h-4 text-rose-400" />
                  </button>
                )}
              </div>

            </div>

            {/* Drawer Footer: Login / Logout / Demo Role Switch */}
            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950/60 space-y-2">
              {user ? (
                <div className="space-y-2">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                    ডেমো রোল পরিবর্তন:
                  </div>
                  <div className="grid grid-cols-3 gap-1.5">
                    <button
                      onClick={() => {
                        demoLogin('student');
                        setMobileMenuOpen(false);
                      }}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold text-center border transition-colors ${
                        user.role === 'STUDENT'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      শিক্ষার্থী
                    </button>
                    <button
                      onClick={() => {
                        demoLogin('instructor');
                        setMobileMenuOpen(false);
                      }}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold text-center border transition-colors ${
                        user.role === 'INSTRUCTOR'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      শিক্ষক
                    </button>
                    <button
                      onClick={() => {
                        demoLogin('admin');
                        setMobileMenuOpen(false);
                      }}
                      className={`py-1.5 px-2 rounded-xl text-[11px] font-bold text-center border transition-colors ${
                        user.role === 'ADMIN' || user.role === 'SUPER_ADMIN'
                          ? 'bg-emerald-600 text-white border-emerald-600'
                          : 'bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-slate-200 dark:border-slate-700'
                      }`}
                    >
                      এডমিন
                    </button>
                  </div>

                  <button
                    id="mobile-drawer-logout"
                    onClick={() => {
                      logout();
                      setMobileMenuOpen(false);
                    }}
                    className="w-full py-2.5 px-3 rounded-xl border border-rose-200 dark:border-rose-900/60 text-rose-600 dark:text-rose-400 hover:bg-rose-50 dark:hover:bg-rose-950/40 font-bold text-xs flex items-center justify-center gap-2 transition-colors"
                  >
                    <LogOut className="w-4 h-4" />
                    <span>{t('navLogout')}</span>
                  </button>
                </div>
              ) : (
                <div className="grid grid-cols-2 gap-2">
                  <button
                    id="mobile-drawer-login"
                    onClick={() => {
                      onNavigate('login');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2.5 px-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs flex items-center justify-center gap-1.5"
                  >
                    <LogIn className="w-3.5 h-3.5" />
                    <span>{t('navLogin')}</span>
                  </button>

                  <button
                    id="mobile-drawer-register"
                    onClick={() => {
                      onNavigate('register');
                      setMobileMenuOpen(false);
                    }}
                    className="py-2.5 px-3 rounded-xl bg-emerald-600 text-white font-bold text-xs shadow-xs"
                  >
                    {t('navRegister')}
                  </button>
                </div>
              )}
            </div>

          </div>
        </div>
      )}
    </>
  );
};

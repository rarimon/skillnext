import React from 'react';
import { Home, BookOpen, ShoppingBag, GraduationCap, ShieldCheck, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface MobileBottomNavProps {
  currentRoute: string;
  onNavigate: (route: string, param?: string) => void;
  onOpenCart: () => void;
  onOpenAuth: (mode?: 'login' | 'register') => void;
}

export const MobileBottomNav: React.FC<MobileBottomNavProps> = ({
  currentRoute,
  onNavigate,
  onOpenCart,
  onOpenAuth
}) => {
  const { user } = useAuth();
  const { cart } = useCart();
  const { language } = useLanguage();

  const isAdmin = user && (user.role === 'ADMIN' || user.role === 'SUPER_ADMIN');

  const navItems = [
    {
      id: 'home',
      label: language === 'bn' ? 'হোম' : 'Home',
      icon: Home,
      isActive: currentRoute === 'home',
      onClick: () => onNavigate('home')
    },
    {
      id: 'courses',
      label: language === 'bn' ? 'কোর্সসমূহ' : 'Courses',
      icon: BookOpen,
      isActive: currentRoute === 'courses' || currentRoute === 'course-details',
      onClick: () => onNavigate('courses')
    },
    {
      id: 'cart',
      label: language === 'bn' ? 'কার্ট' : 'Cart',
      icon: ShoppingBag,
      badge: cart.length > 0 ? cart.length : null,
      isActive: false,
      onClick: onOpenCart
    },
    {
      id: 'learning',
      label: language === 'bn' ? 'লার্নিং' : 'My Courses',
      icon: GraduationCap,
      isActive: currentRoute === 'student-dashboard' || currentRoute === 'learn',
      onClick: () => {
        if (user) {
          onNavigate('student-dashboard', 'courses');
        } else {
          onOpenAuth('login');
        }
      }
    },
    isAdmin
      ? {
          id: 'admin',
          label: language === 'bn' ? 'অ্যাডমিন' : 'Admin',
          icon: ShieldCheck,
          isActive: currentRoute === 'admin',
          onClick: () => onNavigate('admin')
        }
      : {
          id: 'profile',
          label: user ? (language === 'bn' ? 'প্রোফাইল' : 'Profile') : (language === 'bn' ? 'লগইন' : 'Login'),
          icon: User,
          isActive: currentRoute === 'student-dashboard' && !isAdmin,
          onClick: () => {
            if (user) {
              onNavigate('student-dashboard', 'profile');
            } else {
              onOpenAuth('login');
            }
          }
        }
  ];

  return (
    <nav
      id="mobile-bottom-navigation-bar"
      aria-label="Mobile Navigation"
      className="md:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-lg border-t border-slate-200 dark:border-slate-800 shadow-[0_-4px_20px_rgba(0,0,0,0.06)] dark:shadow-[0_-4px_20px_rgba(0,0,0,0.4)] transition-all"
    >
      <div className="grid grid-cols-5 h-16 max-w-lg mx-auto px-1">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = item.isActive;

          return (
            <button
              key={item.id}
              id={`mobile-nav-btn-${item.id}`}
              onClick={item.onClick}
              className={`relative flex flex-col items-center justify-center py-1.5 px-1 transition-all group ${
                isActive
                  ? 'text-emerald-600 dark:text-emerald-400 font-semibold'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200'
              }`}
            >
              {/* Active Pill Indicator */}
              {isActive && (
                <span className="absolute top-1 w-8 h-1 rounded-full bg-emerald-600 dark:bg-emerald-400 animate-in fade-in zoom-in duration-200" />
              )}

              {/* Icon Container with Badge */}
              <div className="relative flex items-center justify-center w-7 h-7">
                <Icon
                  className={`w-5 h-5 transition-transform group-hover:scale-110 ${
                    isActive ? 'scale-110 stroke-[2.4px]' : 'stroke-[1.8px]'
                  }`}
                />
                {typeof item.badge === 'number' && item.badge > 0 && (
                  <span className="absolute -top-1 -right-2 min-w-[18px] h-[18px] px-1 rounded-full bg-emerald-600 text-white font-bold text-[10px] flex items-center justify-center shadow-xs animate-in zoom-in">
                    {item.badge > 99 ? '99+' : item.badge}
                  </span>
                )}
              </div>

              {/* Label */}
              <span className="text-[11px] leading-tight tracking-tight mt-0.5 truncate max-w-full">
                {item.label}
              </span>
            </button>
          );
        })}
      </div>
    </nav>
  );
};

import React, { useState, useRef, useEffect, useCallback } from 'react';
import {
  Search,
  Bell,
  Menu,
  ExternalLink,
  RefreshCw,
  LogOut,
  Settings,
  ShieldCheck,
  BookOpen,
  Users,
  Receipt,
  Plus,
  ChevronDown,
  CheckCircle2,
  AlertCircle,
  MessageSquare,
  Sparkles,
  Command,
  X,
  Check,
  Trash2,
  Award,
  Star,
  BellRing
} from 'lucide-react';
import { User, Course, Order, NotificationItem } from '../types';

interface AdminTopNavbarProps {
  isSidebarCollapsed: boolean;
  onToggleSidebar: () => void;
  onToggleMobileSidebar: () => void;
  activeTab: string;
  activeTabLabel: string;
  user: User | null;
  courses: Course[];
  students: User[];
  orders: Order[];
  unreadChatCount: number;
  loading: boolean;
  onRefresh: () => void;
  onNavigateTab: (tab: string, subView?: string) => void;
  onNavigateSite: (route: string) => void;
  onLogout: () => void;
}

export const AdminTopNavbar: React.FC<AdminTopNavbarProps> = ({
  onToggleMobileSidebar,
  user,
  courses,
  students,
  orders,
  unreadChatCount = 0,
  loading,
  onRefresh,
  onNavigateTab,
  onNavigateSite,
  onLogout
}) => {
  // Search state
  const [searchQuery, setSearchQuery] = useState('');
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const searchInputRef = useRef<HTMLInputElement>(null);
  const searchContainerRef = useRef<HTMLDivElement>(null);

  // Dropdown states
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [isNotificationOpen, setIsNotificationOpen] = useState(false);
  const profileRef = useRef<HTMLDivElement>(null);
  const notificationRef = useRef<HTMLDivElement>(null);

  // Dynamic Notifications State
  const [notifications, setNotifications] = useState<NotificationItem[]>([]);
  const [unreadCount, setUnreadCount] = useState<number>(0);
  const [activeTabFilter, setActiveTabFilter] = useState<'ALL' | 'ORDER' | 'CHAT' | 'STUDENT'>('ALL');
  const [liveToast, setLiveToast] = useState<{ id: string; title: string; message: string; type?: string } | null>(null);
  const prevCountRef = useRef<number>(0);
  const isInitialLoad = useRef<boolean>(true);

  // Browser tab title blinking when new SMS / unread messages arrive
  useEffect(() => {
    if (unreadChatCount > 0) {
      let isAlt = false;
      const interval = setInterval(() => {
        document.title = isAlt
          ? `(${unreadChatCount}) 💬 নতুন মেসেজ এসেছে! | SkillNest Admin`
          : `(${unreadChatCount}) 🔔 SkillNest Bangladesh`;
        isAlt = !isAlt;
      }, 1000);

      return () => {
        clearInterval(interval);
        document.title = 'SkillNest Bangladesh - Admin Panel';
      };
    } else {
      document.title = 'SkillNest Bangladesh - Admin Panel';
    }
  }, [unreadChatCount]);

  // Subtle audio synthesizer for notification chimes
  const playNotificationSound = useCallback(() => {
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.setValueAtTime(587.33, ctx.currentTime); // D5
      osc.frequency.exponentialRampToValueAtTime(880, ctx.currentTime + 0.12); // A5
      gain.gain.setValueAtTime(0.12, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.28);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.3);
    } catch {
      // Audio might fail if no user gesture yet
    }
  }, []);

  // Fetch dynamic notifications from backend
  const fetchNotifications = useCallback(async (isPolling = false) => {
    try {
      const res = await fetch('/api/admin/notifications', {
        headers: {
          Authorization: `Bearer ${user?.id || 'usr-admin-1'}`
        }
      });
      if (!res.ok) return;
      const data = await res.json();
      const list: NotificationItem[] = data.notifications || [];
      const unread: number = data.unreadCount ?? list.filter((n) => !n.isRead).length;

      // Check if new unread notification arrived
      if (!isInitialLoad.current && isPolling && unread > prevCountRef.current && list.length > 0) {
        const latest = list[0];
        setLiveToast({
          id: latest.id,
          title: latest.title,
          message: latest.message,
          type: latest.type
        });
        playNotificationSound();
      }

      prevCountRef.current = unread;
      isInitialLoad.current = false;
      setNotifications(list);
      setUnreadCount(unread);
    } catch {
      // Fallback local notifications if offline
    }
  }, [user?.id, playNotificationSound]);

  // Initial fetch and real-time polling
  useEffect(() => {
    fetchNotifications(false);
    const interval = setInterval(() => {
      fetchNotifications(true);
    }, 7000);

    const onFocus = () => fetchNotifications(true);
    window.addEventListener('focus', onFocus);

    return () => {
      clearInterval(interval);
      window.removeEventListener('focus', onFocus);
    };
  }, [fetchNotifications]);

  // Auto-dismiss live toast after 5s
  useEffect(() => {
    if (!liveToast) return;
    const timer = setTimeout(() => {
      setLiveToast(null);
    }, 5000);
    return () => clearTimeout(timer);
  }, [liveToast]);

  // Mark single notification as read
  const handleMarkAsRead = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await fetch(`/api/admin/notifications/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${user?.id || 'usr-admin-1'}` }
      });
      setNotifications((prev) =>
        prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
      );
      setUnreadCount((c) => Math.max(0, c - 1));
    } catch {
      // Silent error
    }
  };

  // Mark all notifications as read
  const handleMarkAllAsRead = async () => {
    try {
      await fetch('/api/admin/notifications/mark-all-read', {
        method: 'PUT',
        headers: { Authorization: `Bearer ${user?.id || 'usr-admin-1'}` }
      });
      setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
      setUnreadCount(0);
    } catch {
      // Silent error
    }
  };

  // Delete notification
  const handleDeleteNotification = async (id: string, e?: React.MouseEvent) => {
    e?.stopPropagation();
    try {
      await fetch(`/api/admin/notifications/${id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${user?.id || 'usr-admin-1'}` }
      });
      setNotifications((prev) => prev.filter((n) => n.id !== id));
      setUnreadCount((c) => {
        const item = notifications.find((n) => n.id === id);
        return item && !item.isRead ? Math.max(0, c - 1) : c;
      });
    } catch {
      // Silent error
    }
  };

  // Trigger test live notification for instant preview
  const handleTriggerTest = async () => {
    try {
      const testEvents = [
        {
          type: 'order',
          title: 'নতুন কোর্স অর্ডার প্লেস হয়েছে',
          message: 'সাকিব আল হাসান ৳২,২৪০ টাকার একটি নতুন অর্ডার (#ORD-2025-1004) করেছেন।',
          link: 'orders'
        },
        {
          type: 'chat',
          title: 'নতুন লাইভ চ্যাট মেসেজ',
          message: 'মাহমুদ আলম: "ভাইয়া, পাইথন কোর্সের রেকর্ডেড ভিডিও কি আজকেই পাব?"',
          link: 'messages'
        },
        {
          type: 'student',
          title: 'নতুন শিক্ষার্থী নিবন্ধন',
          message: 'আফসানা মিমি (afsana@gmail.com) প্ল্যাটফর্মে নতুন একাউন্ট খুলেছেন।',
          link: 'students'
        }
      ];
      const randomEvent = testEvents[Math.floor(Math.random() * testEvents.length)];

      const res = await fetch('/api/admin/notifications/test', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${user?.id || 'usr-admin-1'}`
        },
        body: JSON.stringify(randomEvent)
      });
      if (res.ok) {
        const data = await res.json();
        if (data.notification) {
          setNotifications((prev) => [data.notification, ...prev]);
          setUnreadCount((c) => c + 1);
          setLiveToast({
            id: data.notification.id,
            title: data.notification.title,
            message: data.notification.message,
            type: data.notification.type
          });
          playNotificationSound();
        }
      }
    } catch {
      // Ignore
    }
  };

  // Global search shortcut (Ctrl + K or Meta + K)
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
        setTimeout(() => searchInputRef.current?.focus(), 50);
      }
      if (e.key === 'Escape') {
        setIsSearchOpen(false);
        setIsProfileOpen(false);
        setIsNotificationOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, []);

  // Close dropdowns on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (profileRef.current && !profileRef.current.contains(e.target as Node)) {
        setIsProfileOpen(false);
      }
      if (notificationRef.current && !notificationRef.current.contains(e.target as Node)) {
        setIsNotificationOpen(false);
      }
      if (searchContainerRef.current && !searchContainerRef.current.contains(e.target as Node)) {
        setIsSearchOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Relative time helper
  const getRelativeTime = (isoString: string) => {
    try {
      const diffMs = Date.now() - new Date(isoString).getTime();
      const diffSec = Math.floor(diffMs / 1000);
      const diffMin = Math.floor(diffSec / 60);
      const diffHour = Math.floor(diffMin / 60);
      const diffDay = Math.floor(diffHour / 24);

      if (diffSec < 45) return 'এইমাত্র';
      if (diffMin < 60) return `${diffMin} মিনিট আগে`;
      if (diffHour < 24) return `${diffHour} ঘণ্টা আগে`;
      return `${diffDay} দিন আগে`;
    } catch {
      return 'কিছুক্ষণ আগে';
    }
  };

  // Filtered notifications
  const filteredNotifications = notifications.filter((n) => {
    if (activeTabFilter === 'ALL') return true;
    if (activeTabFilter === 'ORDER') return n.type === 'order';
    if (activeTabFilter === 'CHAT') return n.type === 'chat';
    if (activeTabFilter === 'STUDENT') return n.type === 'student';
    return true;
  });

  // Filtered search items
  const normalizedQuery = searchQuery.trim().toLowerCase();

  const matchingCourses = normalizedQuery
    ? courses.filter(
        (c) =>
          c.title.toLowerCase().includes(normalizedQuery) ||
          c.categoryName.toLowerCase().includes(normalizedQuery) ||
          (c.instructor?.name && c.instructor.name.toLowerCase().includes(normalizedQuery))
      ).slice(0, 4)
    : [];

  const matchingStudents = normalizedQuery
    ? students.filter(
        (s) =>
          s.name.toLowerCase().includes(normalizedQuery) ||
          s.email.toLowerCase().includes(normalizedQuery) ||
          (s.phone && s.phone.includes(normalizedQuery))
      ).slice(0, 4)
    : [];

  const matchingOrders = normalizedQuery
    ? orders.filter(
        (o) =>
          o.orderNumber.toLowerCase().includes(normalizedQuery) ||
          (o.user?.name && o.user.name.toLowerCase().includes(normalizedQuery)) ||
          (o.transactionId && o.transactionId.toLowerCase().includes(normalizedQuery))
      ).slice(0, 4)
    : [];

  const quickNavTabs = [
    { id: 'overview', label: 'ওভারভিউ ও অ্যানালিটিক্স', icon: BookOpen },
    { id: 'courses', label: 'কোর্স ম্যানেজমেন্ট', icon: BookOpen },
    { id: 'orders', label: 'অর্ডার ও ট্রানজেকশন', icon: Receipt },
    { id: 'students', label: 'শিক্ষার্থী তালিকা', icon: Users },
    { id: 'users', label: 'ইউজার ও রোল পারমিশন', icon: ShieldCheck },
    { id: 'messages', label: 'লাইভ চ্যাট ও সাপোর্ট', icon: MessageSquare },
    { id: 'settings', label: 'প্ল্যাটফর্ম সেটিংস', icon: Settings }
  ].filter((tab) => !normalizedQuery || tab.label.toLowerCase().includes(normalizedQuery));

  const hasSearchResults =
    matchingCourses.length > 0 || matchingStudents.length > 0 || matchingOrders.length > 0;

  // Render notification category icon
  const renderNotifIcon = (type?: string) => {
    switch (type) {
      case 'order':
        return <Receipt className="w-4 h-4 text-amber-400" />;
      case 'chat':
        return <MessageSquare className="w-4 h-4 text-sky-400" />;
      case 'student':
        return <Users className="w-4 h-4 text-purple-400" />;
      case 'certificate':
        return <Award className="w-4 h-4 text-emerald-400" />;
      case 'review':
        return <Star className="w-4 h-4 text-yellow-400" />;
      default:
        return <BellRing className="w-4 h-4 text-emerald-400" />;
    }
  };

  const renderNotifBadgeBg = (type?: string) => {
    switch (type) {
      case 'order':
        return 'bg-amber-500/15 border-amber-500/30 text-amber-400';
      case 'chat':
        return 'bg-sky-500/15 border-sky-500/30 text-sky-400';
      case 'student':
        return 'bg-purple-500/15 border-purple-500/30 text-purple-400';
      case 'certificate':
        return 'bg-emerald-500/15 border-emerald-500/30 text-emerald-400';
      case 'review':
        return 'bg-yellow-500/15 border-yellow-500/30 text-yellow-400';
      default:
        return 'bg-slate-800 border-slate-700 text-slate-300';
    }
  };

  return (
    <>
      <header className="sticky top-0 z-30 bg-slate-900/95 backdrop-blur-md border-b border-slate-800 text-slate-100 shadow-sm">
        <div className="flex items-center justify-between h-16 px-4 sm:px-6 gap-3">
          {/* LEFT: Mobile Menu Button ONLY (Redundant desktop breadcrumbs & icons removed as requested) */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={onToggleMobileSidebar}
              className="lg:hidden p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer"
              title="মেনু খুলুন"
              id="admin-mobile-menu-btn"
            >
              <Menu className="w-5 h-5" />
            </button>
          </div>

          {/* CENTER / SEARCH: Global Search Bar */}
          <div
            ref={searchContainerRef}
            className="relative flex-1 max-w-lg mx-1 sm:mx-2"
          >
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
              <input
                ref={searchInputRef}
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setIsSearchOpen(true);
                }}
                onFocus={() => setIsSearchOpen(true)}
                placeholder="কোর্স, শিক্ষার্থী, অর্ডার নম্বর খুঁজুন..."
                className="w-full pl-9 pr-14 py-2 text-xs rounded-xl bg-slate-800/90 border border-slate-700/80 text-slate-100 placeholder-slate-400 focus:outline-none focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500 transition-all"
              />
              <div className="absolute right-2.5 top-1/2 -translate-y-1/2 hidden sm:flex items-center gap-1 px-1.5 py-0.5 rounded bg-slate-700/60 border border-slate-600/50 text-[10px] text-slate-300 font-mono pointer-events-none">
                <Command className="w-3 h-3" />
                <span>K</span>
              </div>
              {searchQuery && (
                <button
                  onClick={() => setSearchQuery('')}
                  className="absolute right-12 top-1/2 -translate-y-1/2 p-0.5 text-slate-400 hover:text-white cursor-pointer"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Search Results Dropdown Popover */}
            {isSearchOpen && (
              <div className="absolute top-full left-0 right-0 mt-2 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 text-xs animate-in fade-in-50 duration-150">
                <div className="max-h-96 overflow-y-auto p-2 space-y-3 divide-y divide-slate-800">
                  {/* When empty query, show quick navigation */}
                  {!normalizedQuery && (
                    <div>
                      <div className="px-2.5 py-1.5 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                        কুইক মেনু ও পেজসমূহ
                      </div>
                      <div className="grid grid-cols-2 gap-1 mt-1">
                        {quickNavTabs.slice(0, 6).map((tab) => {
                          const Icon = tab.icon;
                          return (
                            <button
                              key={tab.id}
                              onClick={() => {
                                onNavigateTab(tab.id);
                                setIsSearchOpen(false);
                              }}
                              className="flex items-center gap-2 px-2.5 py-2 rounded-xl text-left text-slate-300 hover:text-white hover:bg-slate-800/90 transition-colors cursor-pointer"
                            >
                              <Icon className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                              <span className="truncate">{tab.label}</span>
                            </button>
                          );
                        })}
                      </div>
                    </div>
                  )}

                  {/* Courses search result */}
                  {matchingCourses.length > 0 && (
                    <div className="pt-2">
                      <div className="px-2.5 py-1 text-[10px] font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                        <BookOpen className="w-3 h-3" />
                        <span>কোর্সসমূহ ({matchingCourses.length})</span>
                      </div>
                      <div className="space-y-1 mt-1">
                        {matchingCourses.map((c) => (
                          <button
                            key={c.id}
                            onClick={() => {
                              onNavigateTab('courses');
                              setIsSearchOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
                          >
                            <div className="min-w-0 pr-2">
                              <p className="font-semibold text-white truncate">{c.title}</p>
                              <p className="text-[10px] text-slate-400">{c.categoryName}</p>
                            </div>
                            <span className="text-[11px] font-bold text-emerald-400 shrink-0">
                              ৳{c.discountPrice || c.price}
                            </span>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Students search result */}
                  {matchingStudents.length > 0 && (
                    <div className="pt-2">
                      <div className="px-2.5 py-1 text-[10px] font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Users className="w-3 h-3" />
                        <span>শিক্ষার্থী ({matchingStudents.length})</span>
                      </div>
                      <div className="space-y-1 mt-1">
                        {matchingStudents.map((s) => (
                          <button
                            key={s.id}
                            onClick={() => {
                              onNavigateTab('students');
                              setIsSearchOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
                          >
                            <div className="min-w-0 pr-2">
                              <p className="font-semibold text-white truncate">{s.name}</p>
                              <p className="text-[10px] text-slate-400 truncate">{s.email}</p>
                            </div>
                            {s.phone && (
                              <span className="text-[10px] text-slate-400 shrink-0 font-mono">
                                {s.phone}
                              </span>
                            )}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Orders search result */}
                  {matchingOrders.length > 0 && (
                    <div className="pt-2">
                      <div className="px-2.5 py-1 text-[10px] font-bold text-amber-400 uppercase tracking-wider flex items-center gap-1.5">
                        <Receipt className="w-3 h-3" />
                        <span>অর্ডারসমূহ ({matchingOrders.length})</span>
                      </div>
                      <div className="space-y-1 mt-1">
                        {matchingOrders.map((o) => (
                          <button
                            key={o.id}
                            onClick={() => {
                              onNavigateTab('orders');
                              setIsSearchOpen(false);
                            }}
                            className="w-full flex items-center justify-between px-2.5 py-2 rounded-xl text-left hover:bg-slate-800 text-slate-200 transition-colors cursor-pointer"
                          >
                            <div className="min-w-0 pr-2">
                              <p className="font-semibold text-white font-mono">{o.orderNumber}</p>
                              <p className="text-[10px] text-slate-400 truncate">{o.user?.name || 'Customer'}</p>
                            </div>
                            <div className="text-right shrink-0">
                              <span className="text-[11px] font-bold text-emerald-400 block">
                                ৳{o.totalAmount}
                              </span>
                              <span
                                className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full ${
                                  o.status === 'PAID'
                                    ? 'bg-emerald-950 text-emerald-400 border border-emerald-800'
                                    : 'bg-amber-950 text-amber-400 border border-amber-800'
                                }`}
                              >
                                {o.status}
                              </span>
                            </div>
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  {normalizedQuery && !hasSearchResults && (
                    <div className="py-6 text-center text-slate-400">
                      <AlertCircle className="w-6 h-6 mx-auto mb-2 text-slate-500" />
                      <p className="font-medium text-slate-300">কোন ফলাফল পাওয়া যায়নি</p>
                      <p className="text-[11px] text-slate-500 mt-0.5">"{searchQuery}" এর জন্য অন্য কিছু লিখে খুঁজুন</p>
                    </div>
                  )}
                </div>
              </div>
            )}
          </div>

          {/* RIGHT: Quick Action Buttons, Dynamic Notifications, User Profile */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            {/* Add Course Quick Action */}
            <button
              onClick={() => onNavigateTab('courses', 'editor')}
              className="hidden md:flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-emerald-600 to-teal-600 hover:from-emerald-500 hover:to-teal-500 text-white font-bold text-xs shadow-sm shadow-emerald-600/30 transition-all cursor-pointer"
              title="নতুন কোর্স যুক্ত করুন"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>নতুন কোর্স</span>
            </button>

            {/* Visit Public Website Button */}
            <button
              onClick={() => onNavigateSite('home')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800 hover:bg-slate-700/80 border border-slate-700/70 text-slate-200 hover:text-white text-xs font-semibold transition-colors cursor-pointer"
              title="পাবলিক ওয়েবসাইট দেখুন"
              id="admin-visit-site-btn"
            >
              <ExternalLink className="w-3.5 h-3.5 text-emerald-400" />
              <span className="hidden sm:inline">ওয়েবসাইট দেখুন</span>
            </button>

            {/* Refresh Data Button */}
            <button
              onClick={() => {
                onRefresh();
                fetchNotifications(false);
              }}
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 border border-slate-700/70 text-slate-300 hover:text-white transition-colors cursor-pointer"
              title="তথ্য রিফ্রেশ করুন"
              id="admin-topbar-refresh-btn"
            >
              <RefreshCw className={`w-4 h-4 ${loading ? 'animate-spin text-emerald-400' : ''}`} />
            </button>


            {/* DYNAMIC NOTIFICATIONS POPOVER */}
            <div ref={notificationRef} className="relative">
              <button
                onClick={() => setIsNotificationOpen(!isNotificationOpen)}
                className={`relative p-2 rounded-xl transition-all cursor-pointer border ${
                  unreadCount > 0
                    ? 'bg-emerald-950/40 border-emerald-600/50 text-emerald-400 shadow-sm shadow-emerald-500/20'
                    : 'bg-slate-800 hover:bg-slate-700 border-slate-700/70 text-slate-300 hover:text-white'
                }`}
                title="রিয়েল-টাইম নোটিফিকেশন"
                id="admin-notification-bell-btn"
              >
                <Bell className={`w-4 h-4 ${unreadCount > 0 ? 'animate-bounce' : ''}`} />
                {unreadCount > 0 && (
                  <span className="absolute -top-1 -right-1 min-w-[18px] h-[18px] px-1 bg-amber-500 text-slate-950 font-black text-[10px] rounded-full flex items-center justify-center ring-2 ring-slate-900 animate-pulse">
                    {unreadCount > 9 ? '9+' : unreadCount}
                  </span>
                )}
              </button>

              {/* Dynamic Notification Dropdown */}
              {isNotificationOpen && (
                <div className="absolute right-0 mt-2 w-80 sm:w-[420px] bg-slate-900 border border-slate-750 rounded-2xl shadow-2xl overflow-hidden z-50 animate-in fade-in-50 duration-150">
                  {/* Header */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-slate-800 bg-slate-950/80">
                    <div className="flex items-center gap-2">
                      <BellRing className="w-4 h-4 text-emerald-400" />
                      <span className="font-bold text-xs text-white">রিয়েল-টাইম নোটিফিকেশন</span>
                      {unreadCount > 0 && (
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-400 font-bold border border-amber-500/30">
                          {unreadCount} টি নতুন
                        </span>
                      )}
                    </div>
                    {unreadCount > 0 && (
                      <button
                        onClick={handleMarkAllAsRead}
                        className="text-[11px] font-semibold text-emerald-400 hover:text-emerald-300 flex items-center gap-1 transition-colors cursor-pointer"
                      >
                        <Check className="w-3 h-3" />
                        <span>সব পঠিত</span>
                      </button>
                    )}
                  </div>

                  {/* Filter Categories Tabs */}
                  <div className="flex items-center gap-1 p-2 bg-slate-950/40 border-b border-slate-800 text-[11px] overflow-x-auto">
                    <button
                      onClick={() => setActiveTabFilter('ALL')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                        activeTabFilter === 'ALL'
                          ? 'bg-emerald-600 text-white font-bold shadow-xs'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      সকল ({notifications.length})
                    </button>
                    <button
                      onClick={() => setActiveTabFilter('ORDER')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                        activeTabFilter === 'ORDER'
                          ? 'bg-emerald-600 text-white font-bold shadow-xs'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      অর্ডার ({notifications.filter((n) => n.type === 'order').length})
                    </button>
                    <button
                      onClick={() => setActiveTabFilter('CHAT')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                        activeTabFilter === 'CHAT'
                          ? 'bg-emerald-600 text-white font-bold shadow-xs'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      মেসেজ ({notifications.filter((n) => n.type === 'chat').length})
                    </button>
                    <button
                      onClick={() => setActiveTabFilter('STUDENT')}
                      className={`px-2.5 py-1 rounded-lg font-medium transition-colors cursor-pointer shrink-0 ${
                        activeTabFilter === 'STUDENT'
                          ? 'bg-emerald-600 text-white font-bold shadow-xs'
                          : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800'
                      }`}
                    >
                      শিক্ষার্থী ({notifications.filter((n) => n.type === 'student').length})
                    </button>
                  </div>

                  {/* Notification Items List */}
                  <div className="max-h-84 overflow-y-auto divide-y divide-slate-800/80 p-2 space-y-1.5">
                    {filteredNotifications.length === 0 ? (
                      <div className="py-10 text-center text-slate-400 space-y-2">
                        <CheckCircle2 className="w-10 h-10 mx-auto text-slate-600 stroke-1" />
                        <p className="text-xs font-bold text-slate-300">কোনো নোটিফিকেশন নেই</p>
                        <p className="text-[11px] text-slate-500">সব নতুন কার্যকলাপ ও অ্যালার্ট এখানে প্রদর্শিত হবে</p>
                      </div>
                    ) : (
                      filteredNotifications.map((item) => {
                        const typeLabel =
                          item.type === 'order'
                            ? 'নতুন অর্ডার'
                            : item.type === 'chat'
                            ? 'লাইভ মেসেজ'
                            : item.type === 'student'
                            ? 'নতুন শিক্ষার্থী'
                            : item.type === 'certificate'
                            ? 'সার্টিফিকেট'
                            : 'সিস্টেম অ্যালার্ট';

                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              handleMarkAsRead(item.id);
                              if (item.link) {
                                onNavigateTab(item.link);
                                setIsNotificationOpen(false);
                              }
                            }}
                            className={`p-3 rounded-xl cursor-pointer transition-all duration-200 flex items-start gap-3 relative group border ${
                              !item.isRead
                                ? 'bg-gradient-to-r from-slate-800/95 via-slate-800/80 to-slate-850 border-emerald-500/40 shadow-sm shadow-emerald-500/10 hover:border-emerald-400/70 hover:shadow-md'
                                : 'bg-slate-900/60 border-slate-800/80 hover:bg-slate-850 hover:border-slate-700 opacity-85 hover:opacity-100'
                            }`}
                          >
                            {/* Glowing Icon Container */}
                            <div
                              className={`w-9 h-9 rounded-xl border flex items-center justify-center shrink-0 shadow-xs relative ${renderNotifBadgeBg(
                                item.type
                              )}`}
                            >
                              {renderNotifIcon(item.type)}
                              {!item.isRead && (
                                <span className="absolute -top-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-slate-900 animate-ping" />
                              )}
                            </div>

                            {/* Content Body */}
                            <div className="flex-1 min-w-0 pr-2">
                              <div className="flex items-center justify-between gap-1 mb-1">
                                <div className="flex items-center gap-1.5 truncate">
                                  <span
                                    className={`text-[9px] px-1.5 py-0.5 rounded-md font-extrabold uppercase tracking-wider ${
                                      item.type === 'order'
                                        ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                                        : item.type === 'chat'
                                        ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                                        : item.type === 'student'
                                        ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                                        : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                                    }`}
                                  >
                                    {typeLabel}
                                  </span>
                                  <p
                                    className={`text-xs truncate ${
                                      !item.isRead ? 'font-extrabold text-white' : 'font-semibold text-slate-300'
                                    }`}
                                  >
                                    {item.title}
                                  </p>
                                </div>
                                <span className="text-[10px] font-medium text-slate-400 shrink-0">
                                  {getRelativeTime(item.createdAt)}
                                </span>
                              </div>

                              <p className="text-[11px] text-slate-300 line-clamp-2 leading-relaxed font-normal">
                                {item.message}
                              </p>

                              {item.link && (
                                <div className="mt-1.5 flex items-center gap-1 text-[11px] font-bold text-emerald-400 group-hover:text-emerald-300">
                                  <span>অ্যাকশন নিতে ক্লিক করুন</span>
                                  <span className="group-hover:translate-x-1 transition-transform">→</span>
                                </div>
                              )}
                            </div>

                            {/* Actions */}
                            <div className="flex items-center gap-1 shrink-0 self-center">
                              {!item.isRead && (
                                <span
                                  className="w-2 h-2 rounded-full bg-emerald-500 ring-2 ring-slate-900"
                                  title="নতুন আনপঠিত"
                                />
                              )}
                              <button
                                onClick={(e) => handleDeleteNotification(item.id, e)}
                                className="opacity-0 group-hover:opacity-100 p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-950/40 transition-all cursor-pointer"
                                title="নোটিফিকেশন মুছুন"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        );
                      })
                    )}
                  </div>

                  {/* Dropdown Footer with Quick Test Action */}
                  <div className="p-2 bg-slate-950/80 border-t border-slate-800 flex items-center justify-between">
                    <button
                      onClick={handleTriggerTest}
                      className="text-[11px] text-slate-400 hover:text-emerald-400 flex items-center gap-1 px-2 py-1 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                      title="ইউজার কার্যকলাপ সিমুলেট করে টেস্ট করুন"
                    >
                      <Sparkles className="w-3 h-3 text-emerald-400" />
                      <span>লাইভ নোটিফিকেশন টেস্ট</span>
                    </button>
                    <button
                      onClick={() => {
                        onNavigateTab('overview');
                        setIsNotificationOpen(false);
                      }}
                      className="text-[11px] text-emerald-400 hover:text-emerald-300 font-bold px-2 py-1 transition-colors cursor-pointer"
                    >
                      ওভারভিউ ড্যাশবোর্ড
                    </button>
                  </div>
                </div>
              )}
            </div>

            {/* Admin Profile Menu */}
            <div ref={profileRef} className="relative">
              <button
                onClick={() => setIsProfileOpen(!isProfileOpen)}
                className="flex items-center gap-2 p-1 sm:px-2.5 sm:py-1.5 rounded-xl bg-slate-800/90 hover:bg-slate-800 border border-slate-700/80 transition-all cursor-pointer group"
                id="admin-topbar-profile-btn"
              >
                <div className="relative">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-bold text-xs flex items-center justify-center border border-emerald-400/30 shadow-xs">
                    {user?.name?.charAt(0) || 'A'}
                  </div>
                  <span className="absolute bottom-0 right-0 w-2.5 h-2.5 rounded-full bg-emerald-500 ring-2 ring-slate-900" />
                </div>
                <div className="hidden lg:block text-left min-w-0">
                  <p className="text-xs font-bold text-slate-100 group-hover:text-emerald-400 transition-colors truncate max-w-[120px]">
                    {user?.name || 'এডমিন'}
                  </p>
                  <p className="text-[10px] text-emerald-400 font-semibold truncate">
                    {user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN' ? 'সুপার অ্যাডমিন' : user?.role || 'Admin'}
                  </p>
                </div>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 group-hover:text-slate-200 transition-transform duration-200" />
              </button>

              {/* Profile Dropdown */}
              {isProfileOpen && (
                <div className="absolute right-0 mt-2 w-64 bg-slate-900 border border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 text-xs animate-in fade-in-50 duration-150 divide-y divide-slate-800">
                  {/* User Info Header */}
                  <div className="p-3.5 bg-slate-950/70">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-emerald-500 to-teal-700 text-white font-bold text-sm flex items-center justify-center shrink-0 border border-emerald-400/40">
                        {user?.name?.charAt(0) || 'A'}
                      </div>
                      <div className="min-w-0">
                        <p className="font-bold text-white text-sm truncate">{user?.name || 'Admin User'}</p>
                        <p className="text-[11px] text-slate-400 truncate">{user?.email || 'admin@skillnest.academy'}</p>
                        <span className="inline-block mt-1 px-2 py-0.5 rounded-md text-[9px] font-bold bg-emerald-950 text-emerald-300 border border-emerald-800">
                          {user?.role || 'SUPER_ADMIN'}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Navigation Links */}
                  <div className="p-1.5 space-y-0.5">
                    <button
                      onClick={() => {
                        onNavigateTab('users');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <ShieldCheck className="w-4 h-4 text-emerald-400" />
                      <span>ইউজার ও রোল পারমিশন</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigateTab('settings');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <Settings className="w-4 h-4 text-slate-400" />
                      <span>প্ল্যাটফর্ম সেটিংস</span>
                    </button>

                    <button
                      onClick={() => {
                        onNavigateTab('courses');
                        setIsProfileOpen(false);
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <BookOpen className="w-4 h-4 text-slate-400" />
                      <span>কোর্স ড্যাশবোর্ড</span>
                    </button>

                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        onNavigateSite('home');
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-slate-300 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
                    >
                      <ExternalLink className="w-4 h-4 text-teal-400" />
                      <span>পাবলিক ওয়েবসাইট দেখুন</span>
                    </button>
                  </div>

                  {/* Logout Button */}
                  <div className="p-1.5">
                    <button
                      onClick={() => {
                        setIsProfileOpen(false);
                        onLogout();
                      }}
                      className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-left text-rose-400 hover:text-rose-300 hover:bg-rose-950/40 transition-colors font-semibold cursor-pointer"
                      id="admin-logout-btn"
                    >
                      <LogOut className="w-4 h-4 text-rose-400" />
                      <span>লগআউট</span>
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* FLOATING LIVE NOTIFICATION TOAST POPUP */}
      {liveToast && (
        <div className="fixed top-20 right-6 z-50 max-w-sm w-full bg-slate-900/95 backdrop-blur-md border border-emerald-500/50 rounded-2xl shadow-2xl p-4 animate-in slide-in-from-top-4 fade-in-50 duration-200">
          <div className="flex items-start gap-3">
            <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shrink-0 ${renderNotifBadgeBg(liveToast.type)}`}>
              {renderNotifIcon(liveToast.type)}
            </div>
            <div className="flex-1 min-w-0">
              <div className="flex items-center justify-between">
                <p className="text-xs font-bold text-white truncate">{liveToast.title}</p>
                <button
                  onClick={() => setLiveToast(null)}
                  className="p-0.5 text-slate-400 hover:text-white rounded transition-colors"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              </div>
              <p className="text-[11px] text-slate-300 mt-1 line-clamp-2 leading-relaxed">
                {liveToast.message}
              </p>
              <div className="mt-2 flex items-center justify-between">
                <span className="text-[10px] text-emerald-400 font-semibold flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                  নতুন লাইভ আপডেট
                </span>
                <button
                  onClick={() => {
                    setIsNotificationOpen(true);
                    setLiveToast(null);
                  }}
                  className="text-[10px] text-slate-400 hover:text-white underline font-medium"
                >
                  সব নোটিফিকেশন খুলুন
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

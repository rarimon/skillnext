import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  Send,
  User,
  Mail,
  Phone,
  Clock,
  CheckCircle2,
  RefreshCw,
  Search,
  Filter,
  Check,
  ShieldCheck,
  Headphones,
  Sparkles,
  Inbox,
  TrendingUp,
  BarChart3,
  Calendar,
  Zap,
  ChevronDown,
  ChevronUp,
  Users,
  AlertCircle
} from 'lucide-react';
import { SupportConversation, ChatMessage } from '../types';

interface AdminMessagesSectionProps {
  token: string | null;
  adminName?: string;
  onRefreshUnreadCount?: () => void;
}

export const AdminMessagesSection: React.FC<AdminMessagesSectionProps> = ({
  token,
  adminName = 'SkillNest Admin',
  onRefreshUnreadCount
}) => {
  const [conversations, setConversations] = useState<SupportConversation[]>([]);
  const [selectedId, setSelectedId] = useState<string>('');
  const [replyText, setReplyText] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'OPEN' | 'RESOLVED'>('ALL');
  const messagesEndRef = useRef<HTMLDivElement>(null);


  const fetchConversations = async () => {
    if (!token) return;
    try {
      const res = await fetch('/api/chat/conversations', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        if (Array.isArray(data.conversations)) {
          setConversations(data.conversations);
          if (!selectedId && data.conversations.length > 0) {
            setSelectedId(data.conversations[0].id);
          }
        }
      }
    } catch (err) {
      console.error('Fetch conversations error:', err);
    }
  };

  useEffect(() => {
    setIsLoading(true);
    fetchConversations().finally(() => setIsLoading(false));

    // Polling every 3.5s for real-time live support messages
    const timer = setInterval(() => {
      fetchConversations();
    }, 3500);
    return () => clearInterval(timer);
  }, [token]);

  const handleSelectConversation = async (id: string) => {
    setSelectedId(id);
    try {
      const res = await fetch(`/api/admin/chat/${id}/read`, {
        method: 'PUT',
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        setConversations((prev) =>
          prev.map((c) => (c.id === id ? { ...c, unreadCountAdmin: 0 } : c))
        );
        if (onRefreshUnreadCount) onRefreshUnreadCount();
      }
    } catch (err) {
      // Ignore
    }
  };

  const activeConversation = conversations.find((c) => c.id === selectedId) || conversations[0];

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [activeConversation?.messages?.length, selectedId]);

  const handleSendReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!replyText.trim() || !activeConversation || isSending) return;

    setIsSending(true);
    try {
      const res = await fetch('/api/admin/chat/reply', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          conversationId: activeConversation.id,
          replyText: replyText.trim()
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.conversation) {
          setConversations((prev) =>
            prev.map((c) => (c.id === data.conversation.id ? data.conversation : c))
          );
        }
        setReplyText('');
      }
    } catch (err) {
      console.error('Send reply error:', err);
    } finally {
      setIsSending(false);
    }
  };

  const handleToggleStatus = async (convId: string, currentStatus: 'OPEN' | 'RESOLVED') => {
    const nextStatus = currentStatus === 'OPEN' ? 'RESOLVED' : 'OPEN';
    try {
      const res = await fetch(`/api/admin/chat/${convId}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ status: nextStatus })
      });
      if (res.ok) {
        const data = await res.json();
        if (data.conversation) {
          setConversations((prev) =>
            prev.map((c) => (c.id === convId ? data.conversation : c))
          );
        }
      }
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  const filteredConversations = conversations.filter((c) => {
    const matchesSearch =
      c.userName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.userEmail.toLowerCase().includes(searchQuery.toLowerCase()) ||
      c.lastMessage.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter === 'ALL' || c.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const quickReplies = [
    'আসসালামু আলাইকুম! SkillNest সাপোর্টে আপনাকে স্বাগতম। কিভাবে সাহায্য করতে পারি?',
    'পেমেন্ট করার পর সাথে সাথে আপনার ড্যাশবোর্ডে কোর্স এনরোল হয়ে যাবে।',
    'আমাদের কুপন কোড ব্যবহার করে আপনি বিশেষ ছাড় উপভোগ করতে পারেন।',
    'কোর্স সম্পন্ন হলে ভেরিফায়েড কিউআর কোডযুক্ত ডিজিটাল সার্টিফিকেট প্রদান করা হয়।'
  ];

  return (
    <div className="space-y-4 animate-in fade-in duration-200">
      {/* Top Section Header with Reporting Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600/10 text-emerald-600 flex items-center justify-center">
            <Headphones className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg font-black text-slate-900 dark:text-white flex items-center gap-2">
              লাইভ চ্যাট ও সাপোর্ট মেসেজ
              <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-ping" />
            </h1>
            <p className="text-xs text-slate-500">
              শিক্ষার্থী ও ওয়েবসাইট ভিজিটরদের সরাসরি বার্তা এবং প্রশ্নের তাৎক্ষণিক উত্তর দিন
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto">
          <button
            onClick={() => {
              setIsLoading(true);
              fetchConversations().finally(() => setIsLoading(false));
            }}
            className="flex items-center gap-2 px-3.5 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isLoading ? 'animate-spin' : ''}`} />
            <span>রিফ্রেশ</span>
          </button>
        </div>
      </div>

      {/* Main Split View: Left List + Right Chat Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 min-h-[580px]">
        {/* Left Column: Conversations List */}
        <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col overflow-hidden">
          {/* Search & Filter Header */}
          <div className="p-3.5 border-b border-slate-200 dark:border-slate-800 space-y-2.5">
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="নাম বা ইমেইল দিয়ে খুঁজুন..."
                className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
            </div>

            <div className="flex items-center gap-1 text-[11px] font-bold">
              <button
                onClick={() => setStatusFilter('ALL')}
                className={`flex-1 py-1.5 rounded-lg transition-colors text-center ${
                  statusFilter === 'ALL'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                সব ({conversations.length})
              </button>
              <button
                onClick={() => setStatusFilter('OPEN')}
                className={`flex-1 py-1.5 rounded-lg transition-colors text-center ${
                  statusFilter === 'OPEN'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                চলমান ({conversations.filter((c) => c.status === 'OPEN').length})
              </button>
              <button
                onClick={() => setStatusFilter('RESOLVED')}
                className={`flex-1 py-1.5 rounded-lg transition-colors text-center ${
                  statusFilter === 'RESOLVED'
                    ? 'bg-emerald-600 text-white'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300'
                }`}
              >
                সমাধানকৃত ({conversations.filter((c) => c.status === 'RESOLVED').length})
              </button>
            </div>
          </div>

          {/* Conversations Scrollable Stream */}
          <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800/80 max-h-[500px]">
            {filteredConversations.length === 0 ? (
              <div className="p-8 text-center text-slate-400 space-y-2">
                <Inbox className="w-8 h-8 mx-auto stroke-1 text-slate-300 dark:text-slate-600" />
                <p className="text-xs">কোনো বার্তা পাওয়া যায়নি</p>
              </div>
            ) : (
              filteredConversations.map((conv) => {
                const isSelected = conv.id === activeConversation?.id;
                return (
                  <button
                    key={conv.id}
                    onClick={() => handleSelectConversation(conv.id)}
                    className={`w-full text-left p-3.5 transition-all flex items-start gap-3 relative ${
                      isSelected
                        ? 'bg-emerald-50/70 dark:bg-emerald-950/40 border-l-4 border-emerald-600'
                        : 'hover:bg-slate-50 dark:hover:bg-slate-800/60'
                    }`}
                  >
                    <div className="w-9 h-9 rounded-full bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold text-xs flex items-center justify-center shrink-0">
                      {conv.userName?.charAt(0) || 'U'}
                    </div>

                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between gap-1 mb-0.5">
                        <h4 className="font-extrabold text-xs text-slate-900 dark:text-white truncate">
                          {conv.userName}
                        </h4>
                        <span className="text-[10px] text-slate-400 shrink-0">
                          {new Date(conv.updatedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </div>

                      <p className="text-[11px] text-slate-500 dark:text-slate-400 truncate mb-1">
                        {conv.lastMessage}
                      </p>

                      <div className="flex items-center justify-between">
                        <span className="text-[10px] text-slate-400 truncate">
                          {conv.userEmail}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {conv.status === 'OPEN' ? (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300">
                              Open
                            </span>
                          ) : (
                            <span className="text-[9px] px-1.5 py-0.2 rounded-full font-bold bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400">
                              Resolved
                            </span>
                          )}

                          {conv.unreadCountAdmin > 0 && (
                            <span className="w-4 h-4 rounded-full bg-rose-500 text-white font-extrabold text-[9px] flex items-center justify-center">
                              {conv.unreadCountAdmin}
                            </span>
                          )}
                        </div>
                      </div>
                    </div>
                  </button>
                );
              })
            )}
          </div>
        </div>

        {/* Right Column: Active Conversation Thread & Reply Box */}
        <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs flex flex-col overflow-hidden">
          {activeConversation ? (
            <>
              {/* Header */}
              <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 bg-slate-50/50 dark:bg-slate-800/30">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white font-black text-sm flex items-center justify-center shadow-xs">
                    {activeConversation.userName?.charAt(0) || 'U'}
                  </div>
                  <div>
                    <h3 className="font-extrabold text-sm text-slate-900 dark:text-white">
                      {activeConversation.userName}
                    </h3>
                    <div className="flex flex-wrap items-center gap-3 text-[11px] text-slate-500">
                      <span className="flex items-center gap-1">
                        <Mail className="w-3 h-3 text-slate-400" />
                        {activeConversation.userEmail}
                      </span>
                      {activeConversation.userPhone && (
                        <span className="flex items-center gap-1">
                          <Phone className="w-3 h-3 text-slate-400" />
                          {activeConversation.userPhone}
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleStatus(activeConversation.id, activeConversation.status)}
                    className={`px-3 py-1.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors ${
                      activeConversation.status === 'OPEN'
                        ? 'bg-emerald-100 hover:bg-emerald-200 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700 dark:bg-slate-800 dark:text-slate-300'
                    }`}
                  >
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    <span>
                      {activeConversation.status === 'OPEN' ? 'সমাধান হিসেবে চিহ্নিত করুন' : 'পুনরায় ওপেন করুন'}
                    </span>
                  </button>
                </div>
              </div>

              {/* Message List */}
              <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/40 dark:bg-slate-950/40 min-h-[320px] max-h-[380px]">
                {activeConversation.messages.map((msg) => {
                  const isAdmin = msg.sender === 'admin';
                  return (
                    <div
                      key={msg.id}
                      className={`flex gap-2.5 items-start ${isAdmin ? 'flex-row-reverse' : ''}`}
                    >
                      <div
                        className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 shadow-xs ${
                          isAdmin
                            ? 'bg-emerald-600 text-white'
                            : 'bg-indigo-600 text-white'
                        }`}
                      >
                        {isAdmin ? 'A' : 'U'}
                      </div>

                      <div
                        className={`max-w-[75%] rounded-2xl p-3 shadow-xs space-y-1 text-xs ${
                          isAdmin
                            ? 'bg-emerald-600 text-white rounded-tr-sm'
                            : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                        }`}
                      >
                        <div className="flex items-center justify-between gap-3 text-[10px]">
                          <span
                            className={`font-bold ${
                              isAdmin ? 'text-emerald-100' : 'text-emerald-600 dark:text-emerald-400'
                            }`}
                          >
                            {msg.senderName || (isAdmin ? 'এডমিন' : 'শিক্ষার্থী')}
                          </span>
                          <span className={isAdmin ? 'text-emerald-200' : 'text-slate-400'}>
                            {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                          </span>
                        </div>
                        <p className="leading-relaxed whitespace-pre-wrap font-medium">{msg.text}</p>
                      </div>
                    </div>
                  );
                })}
                <div ref={messagesEndRef} />
              </div>

              {/* Quick Replies Strip */}
              <div className="px-4 py-2 border-t border-slate-100 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-1.5 overflow-x-auto scrollbar-none text-[11px]">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider shrink-0 mr-1">
                  কুইক রিপ্লাই:
                </span>
                {quickReplies.map((qr, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setReplyText(qr)}
                    className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-emerald-50 hover:text-emerald-700 dark:hover:bg-emerald-950/50 text-[11px] whitespace-nowrap shrink-0 transition-colors"
                  >
                    {qr.slice(0, 28)}...
                  </button>
                ))}
              </div>

              {/* Input Reply Box */}
              <form
                onSubmit={handleSendReply}
                className="p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center gap-2"
              >
                <input
                  type="text"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  placeholder="শিক্ষার্থীকে উত্তর লিখুন..."
                  disabled={isSending}
                  className="flex-1 px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
                <button
                  type="submit"
                  disabled={!replyText.trim() || isSending}
                  className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all shrink-0"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSending ? 'পাঠানো হচ্ছে...' : 'পাঠান'}</span>
                </button>
              </form>
            </>
          ) : (
            <div className="flex-1 flex flex-col items-center justify-center p-8 text-center text-slate-400">
              <MessageSquare className="w-12 h-12 stroke-1 mb-2 text-slate-300 dark:text-slate-600" />
              <p className="text-sm font-bold">কথোপকথন নির্বাচন করুন</p>
              <p className="text-xs text-slate-500 mt-1">বাম পাশ থেকে যেকোনো কনভারসেশনে ক্লিক করে মেসেজ দেখুন</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

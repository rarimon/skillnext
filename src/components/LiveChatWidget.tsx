import React, { useState, useEffect, useRef } from 'react';
import {
  MessageSquare,
  X,
  Send,
  User,
  Mail,
  Phone,
  CheckCircle2,
  Sparkles,
  Minimize2,
  Headphones,
  ExternalLink,
  HelpCircle
} from 'lucide-react';
import { ChatMessage, SupportConversation } from '../types';

interface LiveChatWidgetProps {
  currentUser?: {
    id?: string;
    name?: string;
    email?: string;
    phone?: string;
  } | null;
}

export const LiveChatWidget: React.FC<LiveChatWidgetProps> = ({ currentUser }) => {
  const [isOpen, setIsOpen] = useState(false);
  const [conversation, setConversation] = useState<SupportConversation | null>(null);
  const [userName, setUserName] = useState(currentUser?.name || '');
  const [userEmail, setUserEmail] = useState(currentUser?.email || '');
  const [userPhone, setUserPhone] = useState(currentUser?.phone || '');
  const [inputMessage, setInputMessage] = useState('');
  const [isSending, setIsSending] = useState(false);
  const [unreadCount, setUnreadCount] = useState(0);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Load conversation ID from localStorage if stored
  const [conversationId, setConversationId] = useState<string>(() => {
    return localStorage.getItem('skillnest_chat_conv_id') || '';
  });

  // Sync with currentUser if logged in
  useEffect(() => {
    if (currentUser?.name && !userName) setUserName(currentUser.name);
    if (currentUser?.email && !userEmail) setUserEmail(currentUser.email);
    if (currentUser?.phone && !userPhone) setUserPhone(currentUser.phone);
  }, [currentUser]);

  // Fetch conversation messages
  const fetchConversation = async (convId: string) => {
    if (!convId) return;
    try {
      const res = await fetch(`/api/chat/conversation/${convId}`);
      if (res.ok) {
        const data = await res.json();
        if (data.conversation) {
          setConversation(data.conversation);
          // If widget is closed and there are unread user messages
          if (!isOpen && data.conversation.unreadCountUser > 0) {
            setUnreadCount(data.conversation.unreadCountUser);
          }
        }
      }
    } catch {
      // Ignore polling error
    }
  };

  // Poll conversation when open
  useEffect(() => {
    if (conversationId) {
      fetchConversation(conversationId);
      const interval = setInterval(() => {
        fetchConversation(conversationId);
      }, 3500);
      return () => clearInterval(interval);
    }
  }, [conversationId, isOpen]);

  // Scroll to bottom when messages update
  useEffect(() => {
    if (isOpen) {
      messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
      setUnreadCount(0);
    }
  }, [conversation?.messages, isOpen]);

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputMessage.trim() || isSending) return;

    const senderName = userName.trim() || currentUser?.name || 'ভিজিটর';
    const senderEmail = userEmail.trim() || currentUser?.email || 'visitor@skillnest.bd';

    setIsSending(true);
    try {
      const res = await fetch('/api/chat/send', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          conversationId: conversationId || undefined,
          userName: senderName,
          userEmail: senderEmail,
          userPhone: userPhone.trim(),
          message: inputMessage.trim(),
          userId: currentUser?.id
        })
      });

      if (res.ok) {
        const data = await res.json();
        if (data.conversation) {
          setConversation(data.conversation);
          setConversationId(data.conversation.id);
          localStorage.setItem('skillnest_chat_conv_id', data.conversation.id);
        }
        setInputMessage('');
      }
    } catch (err) {
      console.error('Chat error:', err);
    } finally {
      setIsSending(false);
    }
  };

  const quickPrompts = [
    'কোর্সের ফি ও ডিসকাউন্ট সম্পর্কে জানতে চাই',
    'পেমেন্ট করার পর কিভাবে এক্সেস পাব?',
    'সার্টিফিকেট কি ভেরিফাইড কিউআর কোড থাকবে?'
  ];

  return (
    <div id="skillnest-live-chat-root" className="fixed bottom-20 right-4 sm:bottom-6 sm:right-6 z-50 select-none">
      {/* Floating Chat Trigger Button with Animation */}
      {!isOpen && (
        <div className="relative group">
          {/* Animated Ripple Rings */}
          <span className="absolute -inset-1 rounded-full bg-emerald-500/40 animate-ping opacity-75 pointer-events-none" />
          <span className="absolute -inset-2 rounded-full bg-emerald-400/20 animate-pulse pointer-events-none" />

          {/* Quick Floating Badge */}
          <div className="hidden sm:flex items-center gap-1.5 absolute bottom-full right-0 mb-3 px-3 py-1.5 rounded-full bg-slate-900/90 dark:bg-white/90 backdrop-blur-md text-white dark:text-slate-900 text-xs font-bold shadow-lg whitespace-nowrap animate-bounce pointer-events-none border border-white/10">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>আমরা অনলাইনে আছি! চ্যাট করুন</span>
          </div>

          <button
            id="open-live-chat-btn"
            onClick={() => {
              setIsOpen(true);
              setUnreadCount(0);
            }}
            className="relative flex items-center justify-center w-12 h-12 sm:w-14 sm:h-14 rounded-full bg-gradient-to-tr from-emerald-600 via-teal-600 to-emerald-500 text-white shadow-xl shadow-emerald-600/30 hover:shadow-2xl hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            aria-label="Open Live Chat"
          >
            <MessageSquare className="w-5 h-5 sm:w-6 sm:h-6 animate-pulse" />

            {/* Unread badge */}
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-rose-500 text-white text-[10px] font-extrabold flex items-center justify-center border-2 border-white shadow-md animate-bounce">
                {unreadCount}
              </span>
            )}
          </button>
        </div>
      )}

      {/* Floating Chat Modal Window */}
      {isOpen && (
        <div
          id="live-chat-modal-window"
          className="w-[calc(100vw-2rem)] max-w-sm sm:w-96 max-h-[calc(100vh-7rem)] sm:max-h-[85vh] h-[520px] flex flex-col rounded-3xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden animate-in slide-in-from-bottom-5 duration-300"
        >
          {/* Header */}
          <div className="p-4 bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 text-white flex items-center justify-between shadow-md">
            <div className="flex items-center gap-3">
              <div className="relative">
                <div className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-sm flex items-center justify-center border border-white/30">
                  <Headphones className="w-5 h-5 text-white" />
                </div>
                <span className="absolute bottom-0 right-0 w-3 h-3 rounded-full bg-emerald-300 border-2 border-emerald-700" />
              </div>
              <div>
                <h3 className="font-extrabold text-sm leading-tight flex items-center gap-1.5">
                  SkillNest লাইভ সাপোর্ট
                  <span className="text-[10px] px-1.5 py-0.5 rounded-full bg-emerald-400/20 text-emerald-100 font-normal border border-emerald-300/30">
                    Active
                  </span>
                </h3>
                <p className="text-[11px] text-emerald-100/90 font-medium">
                  আমাদের টিম আপনাকে সহায়তার জন্য প্রস্তুত
                </p>
              </div>
            </div>

            <button
              onClick={() => setIsOpen(false)}
              className="p-1.5 rounded-full hover:bg-white/20 text-white/90 hover:text-white transition-colors"
              title="Close Chat"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* User Details input if not recognized */}
          {!currentUser && !conversation && (
            <div className="p-3 bg-emerald-50/70 dark:bg-emerald-950/30 border-b border-emerald-100 dark:border-emerald-900/40 space-y-2 text-xs">
              <p className="font-semibold text-emerald-900 dark:text-emerald-200 text-[11px] flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                আপনার তথ্য দিন (এডমিন সরাসরি উত্তর দিতে পারবে):
              </p>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="text"
                  placeholder="আপনার নাম"
                  value={userName}
                  onChange={(e) => setUserName(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-xs"
                />
                <input
                  type="email"
                  placeholder="ইমেইল বা ফোন"
                  value={userEmail}
                  onChange={(e) => setUserEmail(e.target.value)}
                  className="px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 outline-none text-xs"
                />
              </div>
            </div>
          )}

          {/* Chat Messages Stream */}
          <div className="flex-1 p-4 overflow-y-auto space-y-3 bg-slate-50/50 dark:bg-slate-900/50 text-xs">
            {/* Welcome Greeting */}
            <div className="flex gap-2.5 items-start">
              <div className="w-7 h-7 rounded-full bg-emerald-600 text-white flex items-center justify-center font-bold text-[11px] shrink-0 shadow-xs">
                SN
              </div>
              <div className="max-w-[80%] rounded-2xl rounded-tl-sm p-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-xs space-y-1">
                <p className="font-bold text-slate-800 dark:text-slate-100 text-[11px]">SkillNest সাপোর্ট বট</p>
                <p className="text-slate-600 dark:text-slate-300 leading-relaxed">
                  আসসালামু আলাইকুম! SkillNest Academy-তে স্বাগতম। কোর্স, ভর্তির প্রক্রিয়া বা টেকনিক্যাল যেকোনো বিষয়ে প্রশ্ন করতে পারেন।
                </p>
                <span className="text-[10px] text-slate-400 block text-right">এখনই</span>
              </div>
            </div>

            {/* Conversation History */}
            {conversation?.messages.map((msg) => {
              const isUser = msg.sender === 'user';
              return (
                <div
                  key={msg.id}
                  className={`flex gap-2.5 items-start ${isUser ? 'flex-row-reverse' : ''}`}
                >
                  <div
                    className={`w-7 h-7 rounded-full flex items-center justify-center font-bold text-[11px] shrink-0 shadow-xs ${
                      isUser
                        ? 'bg-indigo-600 text-white'
                        : 'bg-emerald-600 text-white'
                    }`}
                  >
                    {isUser ? 'U' : 'SN'}
                  </div>

                  <div
                    className={`max-w-[80%] rounded-2xl p-3 shadow-xs space-y-1 ${
                      isUser
                        ? 'bg-emerald-600 text-white rounded-tr-sm'
                        : 'bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 rounded-tl-sm'
                    }`}
                  >
                    {!isUser && (
                      <p className="font-bold text-[11px] text-emerald-600 dark:text-emerald-400">
                        {msg.senderName || 'এডমিন সাপোর্ট'}
                      </p>
                    )}
                    <p className="leading-relaxed whitespace-pre-wrap">{msg.text}</p>
                    <span
                      className={`text-[9px] block text-right ${
                        isUser ? 'text-emerald-100' : 'text-slate-400'
                      }`}
                    >
                      {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* Quick Prompt suggestions when no messages yet */}
            {(!conversation || conversation.messages.length === 0) && (
              <div className="pt-2 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">
                  কুইক প্রশ্নসমূহ:
                </span>
                {quickPrompts.map((prompt, idx) => (
                  <button
                    key={idx}
                    type="button"
                    onClick={() => setInputMessage(prompt)}
                    className="w-full text-left p-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-emerald-500 hover:text-emerald-600 dark:hover:text-emerald-400 text-[11px] font-medium transition-all shadow-xs"
                  >
                    💬 {prompt}
                  </button>
                ))}
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Message Input Box */}
          <form
            onSubmit={handleSendMessage}
            className="p-3 bg-white dark:bg-slate-900 border-t border-slate-200 dark:border-slate-800 flex items-center gap-2"
          >
            <input
              type="text"
              id="live-chat-input-field"
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              placeholder="আপনার মেসেজ লিখুন..."
              disabled={isSending}
              className="flex-1 px-3.5 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-white text-xs outline-none focus:ring-2 focus:ring-emerald-500 transition-all"
            />
            <button
              type="submit"
              id="live-chat-send-btn"
              disabled={!inputMessage.trim() || isSending}
              className="p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold transition-all shadow-md shadow-emerald-600/20 active:scale-95 shrink-0"
              title="Send Message"
            >
              <Send className="w-4 h-4" />
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

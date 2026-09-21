import React, { useState } from 'react';
import {
  Users,
  UserPlus,
  Search,
  Filter,
  Trash2,
  Edit2,
  Shield,
  ShieldCheck,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  BookOpen,
  DollarSign,
  X,
  Save,
  GraduationCap,
  Briefcase,
  Headphones
} from 'lucide-react';
import { User, UserRole } from '../types';

interface AdminUsersManagementProps {
  token: string | null;
  currentUser?: User | null;
  onRefresh: () => void;
}

export const AdminUsersManagement: React.FC<AdminUsersManagementProps> = ({
  token,
  currentUser,
  onRefresh
}) => {
  const [users, setUsers] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [roleFilter, setRoleFilter] = useState<string>('ALL');

  // Add / Edit Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingUser, setEditingUser] = useState<any | null>(null);

  // Form fields
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [role, setRole] = useState<UserRole>('STUDENT');
  const [headline, setHeadline] = useState('');
  const [bio, setBio] = useState('');
  const [isActive, setIsActive] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  const fetchUsers = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const res = await fetch(`/api/admin/users${roleFilter !== 'ALL' ? `?role=${roleFilter}` : ''}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setUsers(data.users || data.students || []);
      }
    } catch (err) {
      console.error('Fetch users error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  React.useEffect(() => {
    fetchUsers();
  }, [token, roleFilter]);

  const handleOpenAddModal = () => {
    setEditingUser(null);
    setName('');
    setEmail('');
    setPhone('');
    setRole('STUDENT');
    setHeadline('Student at SkillNest');
    setBio('');
    setIsActive(true);
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (u: any) => {
    setEditingUser(u);
    setName(u.name || '');
    setEmail(u.email || '');
    setPhone(u.phone || '');
    setRole(u.role || 'STUDENT');
    setHeadline(u.headline || '');
    setBio(u.bio || '');
    setIsActive(u.isActive !== false);
    setErrorMessage('');
    setIsModalOpen(true);
  };

  const handleSaveUser = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim() || !email.trim()) {
      setErrorMessage('নাম ও ইমেইল আবশ্যক');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const isEdit = !!editingUser?.id;
      const url = isEdit ? `/api/admin/users/${editingUser.id}` : '/api/admin/users';
      const method = isEdit ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({
          name: name.trim(),
          email: email.trim().toLowerCase(),
          phone: phone.trim(),
          role,
          headline: headline.trim(),
          bio: bio.trim(),
          isActive
        })
      });

      const data = await res.json();
      if (!res.ok) {
        setErrorMessage(data.error || 'সংরক্ষণ ব্যর্থ হয়েছে');
        return;
      }

      setIsModalOpen(false);
      fetchUsers();
      onRefresh();
    } catch (err: any) {
      setErrorMessage(err.message || 'নেটওয়ার্ক এরর');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!window.confirm(`আপনি কি নিশ্চিতভাবে "${userName}" ব্যবহারকারীকে স্থায়ীভাবে মুছে ফেলতে চান?`)) {
      return;
    }

    try {
      const res = await fetch(`/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });

      if (res.ok) {
        setUsers(users.filter((u) => u.id !== userId));
        onRefresh();
      } else {
        const d = await res.json();
        alert(d.error || 'ডিলিট করা সম্ভব হয়নি');
      }
    } catch (err) {
      console.error('Delete error:', err);
    }
  };

  const handleToggleActive = async (u: any) => {
    try {
      const nextStatus = !u.isActive;
      const res = await fetch(`/api/admin/users/${u.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: nextStatus })
      });
      if (res.ok) {
        setUsers(users.map((item) => (item.id === u.id ? { ...item, isActive: nextStatus } : item)));
      }
    } catch (err) {
      console.error('Toggle status error:', err);
    }
  };

  const filteredUsers = users.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      u.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (u.phone && u.phone.includes(searchQuery));
    return matchesSearch;
  });

  const getRoleBadge = (r: UserRole) => {
    switch (r) {
      case 'SUPER_ADMIN':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-rose-100 text-rose-700 dark:bg-rose-950 dark:text-rose-300 flex items-center gap-1">
            <Shield className="w-3 h-3 text-rose-600" />
            SUPER ADMIN
          </span>
        );
      case 'ADMIN':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-purple-100 text-purple-700 dark:bg-purple-950 dark:text-purple-300 flex items-center gap-1">
            <ShieldCheck className="w-3 h-3 text-purple-600" />
            ADMIN
          </span>
        );
      case 'INSTRUCTOR':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-blue-100 text-blue-700 dark:bg-blue-950 dark:text-blue-300 flex items-center gap-1">
            <Briefcase className="w-3 h-3 text-blue-600" />
            INSTRUCTOR
          </span>
        );
      case 'SUPPORT_AGENT':
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-amber-100 text-amber-700 dark:bg-amber-950 dark:text-amber-300 flex items-center gap-1">
            <Headphones className="w-3 h-3 text-amber-600" />
            SUPPORT
          </span>
        );
      default:
        return (
          <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 flex items-center gap-1">
            <GraduationCap className="w-3 h-3 text-emerald-600" />
            STUDENT
          </span>
        );
    }
  };

  return (
    <div className="space-y-5 animate-in fade-in duration-200">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 bg-white dark:bg-slate-900 p-4 sm:p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div>
          <h1 className="text-lg sm:text-xl font-black text-slate-900 dark:text-white flex items-center gap-2">
            <Users className="w-5 h-5 text-emerald-600" />
            শিক্ষার্থী ও ইউজার ম্যানেজমেন্ট (RBAC)
          </h1>
          <p className="text-xs text-slate-500 mt-0.5">
            রোল ভিত্তিক অ্যাক্সেস কন্ট্রোল, স্টুডেন্ট প্রোফাইল, ইন্সট্রাক্টর ও অ্যাডমিন তালিকা নিয়ন্ত্রণ করুন
          </p>
        </div>

        <button
          onClick={handleOpenAddModal}
          id="admin-add-user-btn"
          className="px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-md shadow-emerald-600/20 active:scale-95 transition-all self-start sm:self-auto"
        >
          <UserPlus className="w-4 h-4" />
          <span>নতুন ইউজার / শিক্ষার্থী যোগ করুন</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col md:flex-row items-center justify-between gap-3 bg-white dark:bg-slate-900 p-3.5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs">
        <div className="relative w-full md:w-80">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="নাম, ইমেইল বা ফোন নম্বর দিয়ে সার্চ..."
            className="w-full pl-9 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
          />
        </div>

        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0 scrollbar-none text-xs font-bold">
          {['ALL', 'STUDENT', 'INSTRUCTOR', 'ADMIN', 'SUPPORT_AGENT'].map((r) => (
            <button
              key={r}
              onClick={() => setRoleFilter(r)}
              className={`px-3 py-1.5 rounded-xl transition-colors whitespace-nowrap ${
                roleFilter === r
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200'
              }`}
            >
              {r === 'ALL'
                ? 'সকল ইউজার'
                : r === 'STUDENT'
                ? 'শিক্ষার্থী'
                : r === 'INSTRUCTOR'
                ? 'ইন্সট্রাক্টর'
                : r === 'ADMIN'
                ? 'এডমিন'
                : 'সাপোর্ট'}
            </button>
          ))}
        </div>
      </div>

      {/* Users Data Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200 dark:border-slate-800 text-slate-500 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-3.5 pl-5">ইউজার প্রোফাইল</th>
                <th className="p-3.5">রোল (RBAC)</th>
                <th className="p-3.5">যোগাযোগ</th>
                <th className="p-3.5 text-center">কোর্স সংখ্যা</th>
                <th className="p-3.5 text-center">মোট ব্যয় (৳)</th>
                <th className="p-3.5 text-center">স্ট্যাটাস</th>
                <th className="p-3.5 pr-5 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800 font-medium">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-8 text-center text-slate-400">
                    কোনো ইউজার বা শিক্ষার্থী পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredUsers.map((u) => (
                  <tr
                    key={u.id}
                    className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                  >
                    <td className="p-3.5 pl-5">
                      <div className="flex items-center gap-3">
                        <img
                          src={u.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(u.name)}`}
                          alt={u.name}
                          className="w-9 h-9 rounded-full bg-slate-100 dark:bg-slate-800 object-cover border border-slate-200 dark:border-slate-700"
                        />
                        <div>
                          <p className="font-extrabold text-slate-900 dark:text-white leading-tight">
                            {u.name}
                          </p>
                          <span className="text-[11px] text-slate-400 truncate block max-w-xs">
                            {u.headline || u.role}
                          </span>
                        </div>
                      </div>
                    </td>

                    <td className="p-3.5">{getRoleBadge(u.role)}</td>

                    <td className="p-3.5 space-y-0.5 text-[11px]">
                      <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                        <Mail className="w-3 h-3 text-slate-400" />
                        <span>{u.email}</span>
                      </div>
                      {u.phone && (
                        <div className="flex items-center gap-1.5 text-slate-500">
                          <Phone className="w-3 h-3 text-slate-400" />
                          <span>{u.phone}</span>
                        </div>
                      )}
                    </td>

                    <td className="p-3.5 text-center font-bold text-slate-700 dark:text-slate-300">
                      {u.enrolledCount || 0} টি
                    </td>

                    <td className="p-3.5 text-center font-bold text-emerald-600 dark:text-emerald-400">
                      ৳{(u.totalSpent || 0).toLocaleString()}
                    </td>

                    <td className="p-3.5 text-center">
                      <button
                        onClick={() => handleToggleActive(u)}
                        className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[10px] font-bold transition-all ${
                          u.isActive !== false
                            ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                        title="স্ট্যাটাস পরিবর্তন করতে ক্লিক করুন"
                      >
                        {u.isActive !== false ? (
                          <>
                            <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                            Active
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3 text-rose-600" />
                            Inactive
                          </>
                        )}
                      </button>
                    </td>

                    <td className="p-3.5 pr-5 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => handleOpenEditModal(u)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-emerald-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors"
                          title="এডিট করুন"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => handleDeleteUser(u.id, u.name)}
                          className="p-1.5 rounded-lg text-slate-500 hover:text-rose-600 hover:bg-rose-50 dark:hover:bg-rose-950/40 transition-colors"
                          title="ডিলিট করুন"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit User Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-200">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-3xl shadow-2xl max-w-lg w-full overflow-hidden">
            <div className="p-5 border-b border-slate-100 dark:border-slate-800 flex items-center justify-between">
              <h3 className="font-extrabold text-base text-slate-900 dark:text-white flex items-center gap-2">
                <UserPlus className="w-5 h-5 text-emerald-600" />
                {editingUser ? 'ইউজার তথ্য আপডেট করুন' : 'নতুন ইউজার বা শিক্ষার্থী যুক্ত করুন'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveUser} className="p-5 space-y-4 text-xs">
              {errorMessage && (
                <div className="p-3 rounded-xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 text-rose-700 dark:text-rose-300 font-bold">
                  {errorMessage}
                </div>
              )}

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  পুরো নাম <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="যেমন: সাকিব আহমেদ"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ইমেইল অ্যাড্রেস <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="student@example.com"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                    required
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ফোন নম্বর
                  </label>
                  <input
                    type="text"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                    placeholder="01712-XXXXXX"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              {/* Role Selector (RBAC) */}
              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  রোল নির্ধারণ (Role-Based Access Control)
                </label>
                <select
                  value={role}
                  onChange={(e: any) => setRole(e.target.value)}
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-bold outline-none text-slate-900 dark:text-white"
                >
                  <option value="STUDENT">STUDENT (সাধারণ শিক্ষার্থী - কোর্স কেনা ও দেখা)</option>
                  <option value="INSTRUCTOR">INSTRUCTOR (কোর্স ট্রেইনার / ইন্সট্রাক্টর)</option>
                  <option value="SUPPORT_AGENT">SUPPORT_AGENT (লাইভ চ্যাট ও কাস্টমার সাপোর্ট)</option>
                  <option value="ADMIN">ADMIN (সম্পূর্ণ কোর্স ও অর্ডার ম্যানেজমেন্ট)</option>
                  <option value="SUPER_ADMIN">SUPER_ADMIN (সর্বোচ্চ সিস্টেম এক্সেস)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  পদবি বা হেডলাইন (Headline)
                </label>
                <input
                  type="text"
                  value={headline}
                  onChange={(e) => setHeadline(e.target.value)}
                  placeholder="যেমন: Frontend Engineer at Acme Corp"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <label className="flex items-center gap-2 cursor-pointer pt-1">
                <input
                  type="checkbox"
                  checked={isActive}
                  onChange={(e) => setIsActive(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <span className="font-bold text-slate-700 dark:text-slate-300">
                  অ্যাকাউন্ট সক্রিয় রাখুন (Active Account)
                </span>
              </label>

              <div className="pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-end gap-2.5">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 font-bold"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold flex items-center gap-1.5 shadow-md shadow-emerald-600/20"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ করুন'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState, useEffect } from 'react';
import {
  GraduationCap,
  Search,
  Filter,
  CheckCircle2,
  XCircle,
  Mail,
  Phone,
  BookOpen,
  Award,
  DollarSign,
  Calendar,
  ExternalLink,
  ChevronRight,
  Eye,
  MessageSquare,
  ShieldCheck,
  ShieldAlert,
  UserCheck,
  UserX,
  Clock,
  Download,
  X
} from 'lucide-react';
import { User } from '../types';
import { useLanguage } from '../context/LanguageContext';
import { useToast } from '../context/ToastContext';

interface AdminStudentsManagementProps {
  token: string | null;
  onNavigateToChat?: (userEmail?: string) => void;
}

export const AdminStudentsManagement: React.FC<AdminStudentsManagementProps> = ({
  token,
  onNavigateToChat
}) => {
  const { language } = useLanguage();
  const { success: toastSuccess, error: toastError } = useToast();

  const [students, setStudents] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'ACTIVE' | 'SUSPENDED'>('ALL');
  const [selectedStudent, setSelectedStudent] = useState<any | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);

  const fetchStudents = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      // Role is strictly STUDENT
      const res = await fetch('/api/admin/users?role=STUDENT', {
        headers: { Authorization: `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setStudents(data.users || data.students || []);
      }
    } catch (err) {
      console.error('Fetch students error:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, [token]);

  const handleToggleStatus = async (studentId: string, currentStatus: boolean) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/students/${studentId}/status`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      if (res.ok) {
        setStudents((prev) =>
          prev.map((s) => (s.id === studentId ? { ...s, isActive: !currentStatus } : s))
        );
        if (selectedStudent?.id === studentId) {
          setSelectedStudent((prev: any) => ({ ...prev, isActive: !currentStatus }));
        }
        toastSuccess(`শিক্ষার্থীর স্ট্যাটাস সফলভাবে ${!currentStatus ? 'সক্রিয়' : 'সাময়িক স্থগিত'} করা হয়েছে`);
      } else {
        toastError('স্ট্যাটাস আপডেট করা সম্ভব হয়নি');
      }
    } catch {
      toastError('নেটওয়ার্ক সমস্যা');
    }
  };

  // Filter students
  const filteredStudents = students.filter((st) => {
    const matchesQuery =
      st.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      st.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (st.phone && st.phone.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      statusFilter === 'ALL' ||
      (statusFilter === 'ACTIVE' && st.isActive !== false) ||
      (statusFilter === 'SUSPENDED' && st.isActive === false);

    return matchesQuery && matchesStatus;
  });

  // Calculate high-level student stats
  const totalStudentsCount = students.length;
  const activeStudentsCount = students.filter((s) => s.isActive !== false).length;
  const suspendedStudentsCount = students.filter((s) => s.isActive === false).length;
  const totalEnrollmentsCount = students.reduce((sum, s) => sum + (s.enrolledCount || 0), 0);
  const totalStudentSpend = students.reduce((sum, s) => sum + (s.totalSpent || 0), 0);

  const handleExportCSV = () => {
    const headers = ['Name', 'Email', 'Phone', 'Status', 'Enrolled Courses', 'Total Spent', 'Join Date'];
    const rows = filteredStudents.map((s) => [
      `"${s.name}"`,
      `"${s.email}"`,
      `"${s.phone || 'N/A'}"`,
      s.isActive !== false ? 'Active' : 'Suspended',
      s.enrolledCount || 0,
      s.totalSpent || 0,
      new Date(s.createdAt).toLocaleDateString()
    ]);

    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map((e) => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `skillnest_students_export_${Date.now()}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toastSuccess('শিক্ষার্থী তালিকা CSV আকারে ডাউনলোড হয়েছে');
  };

  return (
    <div className="space-y-6">
      {/* Top Banner & Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">মোট শিক্ষার্থী (Total Students)</p>
            <h3 className="text-2xl font-black text-slate-900 dark:text-white mt-1">{totalStudentsCount}</h3>
            <span className="text-[11px] text-emerald-600 dark:text-emerald-400 font-medium">নিবন্ধিত শিক্ষার্থী</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <GraduationCap className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">সক্রিয় শিক্ষার্থী (Active)</p>
            <h3 className="text-2xl font-black text-emerald-600 dark:text-emerald-400 mt-1">{activeStudentsCount}</h3>
            <span className="text-[11px] text-slate-500 font-medium">নিয়মিত কোর্স অ্যাক্সেস</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
            <UserCheck className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">মোট এনরোলমেন্ট (Enrollments)</p>
            <h3 className="text-2xl font-black text-blue-600 dark:text-blue-400 mt-1">{totalEnrollmentsCount}</h3>
            <span className="text-[11px] text-blue-600/80 dark:text-blue-400/80 font-medium">ভর্তিকৃত কোর্স সংখ্যা</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 flex items-center justify-center">
            <BookOpen className="w-6 h-6" />
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-xs flex items-center justify-between">
          <div>
            <p className="text-xs font-semibold text-slate-500 dark:text-slate-400">শিক্ষার্থী রেভিনিউ (Revenue)</p>
            <h3 className="text-2xl font-black text-purple-600 dark:text-purple-400 mt-1">৳{totalStudentSpend.toLocaleString()}</h3>
            <span className="text-[11px] text-purple-600/80 dark:text-purple-400/80 font-medium">পরিশোধিত কোর্স ফি</span>
          </div>
          <div className="w-12 h-12 rounded-xl bg-purple-50 dark:bg-purple-950/40 text-purple-600 dark:text-purple-400 flex items-center justify-center">
            <DollarSign className="w-6 h-6" />
          </div>
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 flex flex-col md:flex-row items-center justify-between gap-3 shadow-xs">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="শিক্ষার্থীর নাম, ইমেইল বা ফোন নম্বর দিয়ে খুঁজুন..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500/20 text-slate-900 dark:text-white"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          {/* Status Filter */}
          <div className="flex items-center gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-xl text-xs font-semibold">
            <button
              onClick={() => setStatusFilter('ALL')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'ALL'
                  ? 'bg-white dark:bg-slate-700 text-slate-900 dark:text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              সকল ({students.length})
            </button>
            <button
              onClick={() => setStatusFilter('ACTIVE')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'ACTIVE'
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-emerald-600'
              }`}
            >
              সক্রিয় ({activeStudentsCount})
            </button>
            <button
              onClick={() => setStatusFilter('SUSPENDED')}
              className={`px-3 py-1.5 rounded-lg transition-all ${
                statusFilter === 'SUSPENDED'
                  ? 'bg-rose-600 text-white shadow-xs'
                  : 'text-slate-600 dark:text-slate-400 hover:text-rose-600'
              }`}
            >
              স্থগিত ({suspendedStudentsCount})
            </button>
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer shrink-0"
            title="CSV এক্সপোর্ট"
          >
            <Download className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">CSV এক্সপোর্ট</span>
          </button>
        </div>
      </div>

      {/* Students Table */}
      <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 shadow-xs overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-sm">
            <thead>
              <tr className="bg-slate-50 dark:bg-slate-800/60 border-b border-slate-200/80 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold text-xs uppercase tracking-wider">
                <th className="py-3.5 px-4">শিক্ষার্থী (Student Info)</th>
                <th className="py-3.5 px-4">যোগাযোগ (Contact)</th>
                <th className="py-3.5 px-4 text-center">এনরোলমেন্ট (Courses)</th>
                <th className="py-3.5 px-4 text-center">মোট খরচ (Spent)</th>
                <th className="py-3.5 px-4">যোগদানের তারিখ</th>
                <th className="py-3.5 px-4 text-center">স্ট্যাটাস</th>
                <th className="py-3.5 px-4 text-right">একশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    <div className="flex items-center justify-center gap-2">
                      <div className="w-4 h-4 border-2 border-emerald-500 border-t-transparent rounded-full animate-spin" />
                      <span>শিক্ষার্থী তালিকা লোড হচ্ছে...</span>
                    </div>
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-12 text-center text-slate-400">
                    কোন শিক্ষার্থী খুঁজে পাওয়া যায়নি।
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const isActive = student.isActive !== false;
                  return (
                    <tr
                      key={student.id}
                      className="hover:bg-slate-50/80 dark:hover:bg-slate-800/40 transition-colors"
                    >
                      {/* Student Info */}
                      <td className="py-3.5 px-4">
                        <div className="flex items-center gap-3">
                          <img
                            src={
                              student.avatar ||
                              `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                                student.name
                              )}`
                            }
                            alt={student.name}
                            className="w-10 h-10 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shrink-0"
                          />
                          <div className="min-w-0">
                            <span className="font-bold text-slate-900 dark:text-white block truncate">
                              {student.name}
                            </span>
                            <span className="text-xs text-slate-500 dark:text-slate-400 truncate block">
                              ID: {student.id}
                            </span>
                          </div>
                        </div>
                      </td>

                      {/* Contact */}
                      <td className="py-3.5 px-4 text-xs space-y-0.5">
                        <div className="flex items-center gap-1.5 text-slate-700 dark:text-slate-300">
                          <Mail className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                          <span className="truncate max-w-[180px]">{student.email}</span>
                        </div>
                        {student.phone && (
                          <div className="flex items-center gap-1.5 text-slate-500">
                            <Phone className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                            <span>{student.phone}</span>
                          </div>
                        )}
                      </td>

                      {/* Courses count */}
                      <td className="py-3.5 px-4 text-center">
                        <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-emerald-50 dark:bg-emerald-950/40 text-emerald-700 dark:text-emerald-300 font-bold text-xs">
                          <BookOpen className="w-3 h-3" />
                          <span>{student.enrolledCount || 0} টি কোর্স</span>
                        </span>
                      </td>

                      {/* Total spent */}
                      <td className="py-3.5 px-4 text-center font-bold text-slate-900 dark:text-white">
                        ৳{(student.totalSpent || 0).toLocaleString()}
                      </td>

                      {/* Join Date */}
                      <td className="py-3.5 px-4 text-xs text-slate-500">
                        {new Date(student.createdAt || Date.now()).toLocaleDateString('bn-BD', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 text-center">
                        <span
                          className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-bold ${
                            isActive
                              ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950/80 dark:text-emerald-300'
                              : 'bg-rose-100 text-rose-800 dark:bg-rose-950/80 dark:text-rose-300'
                          }`}
                        >
                          {isActive ? (
                            <>
                              <CheckCircle2 className="w-3 h-3" />
                              <span>সক্রিয়</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-3 h-3" />
                              <span>স্থগিত</span>
                            </>
                          )}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            onClick={() => {
                              setSelectedStudent(student);
                              setIsDetailOpen(true);
                            }}
                            className="p-1.5 rounded-lg bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-300 hover:text-emerald-600 transition-colors"
                            title="বিস্তারিত দেখুন"
                          >
                            <Eye className="w-4 h-4" />
                          </button>

                          <button
                            onClick={() => handleToggleStatus(student.id, isActive)}
                            className={`p-1.5 rounded-lg transition-colors ${
                              isActive
                                ? 'bg-rose-50 dark:bg-rose-950/40 text-rose-600 hover:bg-rose-100'
                                : 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 hover:bg-emerald-100'
                            }`}
                            title={isActive ? 'অ্যাকাউন্ট স্থগিত করুন' : 'অ্যাকাউন্ট পুনরায় সক্রিয় করুন'}
                          >
                            {isActive ? <UserX className="w-4 h-4" /> : <UserCheck className="w-4 h-4" />}
                          </button>

                          {onNavigateToChat && (
                            <button
                              onClick={() => onNavigateToChat(student.email)}
                              className="p-1.5 rounded-lg bg-blue-50 dark:bg-blue-950/40 text-blue-600 hover:bg-blue-100 transition-colors"
                              title="সরাসরি মেসেজ পাঠান"
                            >
                              <MessageSquare className="w-4 h-4" />
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Student Details Modal / Drawer */}
      {isDetailOpen && selectedStudent && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white dark:bg-slate-900 w-full max-w-2xl rounded-3xl border border-slate-200 dark:border-slate-800 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Header */}
            <div className="p-6 border-b border-slate-100 dark:border-slate-800 flex items-start justify-between bg-slate-50/50 dark:bg-slate-800/30">
              <div className="flex items-center gap-4">
                <img
                  src={
                    selectedStudent.avatar ||
                    `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(
                      selectedStudent.name
                    )}`
                  }
                  alt={selectedStudent.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-white dark:border-slate-700 shadow-sm"
                />
                <div>
                  <h3 className="text-xl font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                    {selectedStudent.name}
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full font-bold ${
                        selectedStudent.isActive !== false
                          ? 'bg-emerald-100 text-emerald-800 dark:bg-emerald-950 dark:text-emerald-300'
                          : 'bg-rose-100 text-rose-800 dark:bg-rose-950 dark:text-rose-300'
                      }`}
                    >
                      {selectedStudent.isActive !== false ? 'Active' : 'Suspended'}
                    </span>
                  </h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">{selectedStudent.email}</p>
                </div>
              </div>
              <button
                onClick={() => setIsDetailOpen(false)}
                className="p-2 rounded-xl text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Body */}
            <div className="p-6 space-y-6 overflow-y-auto">
              {/* Quick Info Grid */}
              <div className="grid grid-cols-3 gap-3">
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">ফোন নম্বর</span>
                  <span className="font-bold text-slate-900 dark:text-white text-sm mt-0.5 block">
                    {selectedStudent.phone || 'যুক্ত করা হয়নি'}
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">এনরোল্ড কোর্স</span>
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 text-sm mt-0.5 block">
                    {selectedStudent.enrolledCount || 0} টি
                  </span>
                </div>
                <div className="p-3.5 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200/80 dark:border-slate-700">
                  <span className="text-[11px] text-slate-500 dark:text-slate-400 block font-medium">মোট খরচ</span>
                  <span className="font-bold text-purple-600 dark:text-purple-400 text-sm mt-0.5 block">
                    ৳{(selectedStudent.totalSpent || 0).toLocaleString()}
                  </span>
                </div>
              </div>

              {/* Bio & Details */}
              {selectedStudent.bio && (
                <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700">
                  <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider mb-1">
                    বায়ো / পরিচিতি
                  </h4>
                  <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                    {selectedStudent.bio}
                  </p>
                </div>
              )}

              {/* Account timeline */}
              <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/40 border border-slate-200 dark:border-slate-700 text-xs space-y-2">
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="w-3.5 h-3.5 text-slate-400" />
                    রেজিস্ট্রেশনের তারিখ:
                  </span>
                  <span className="font-bold">
                    {new Date(selectedStudent.createdAt || Date.now()).toLocaleString('bn-BD')}
                  </span>
                </div>
                <div className="flex items-center justify-between text-slate-600 dark:text-slate-300">
                  <span className="flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-emerald-500" />
                    অ্যাকাউন্ট ভেরিফিকেশন:
                  </span>
                  <span className="font-bold text-emerald-600">ভেরিফায়েড ইমেইল</span>
                </div>
              </div>
            </div>

            {/* Footer Actions */}
            <div className="p-5 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between bg-slate-50/50 dark:bg-slate-800/30">
              <button
                onClick={() => handleToggleStatus(selectedStudent.id, selectedStudent.isActive !== false)}
                className={`px-4 py-2.5 rounded-xl font-bold text-xs flex items-center gap-1.5 transition-colors ${
                  selectedStudent.isActive !== false
                    ? 'bg-rose-50 text-rose-600 hover:bg-rose-100 dark:bg-rose-950/40 dark:hover:bg-rose-900/60'
                    : 'bg-emerald-600 text-white hover:bg-emerald-700'
                }`}
              >
                {selectedStudent.isActive !== false ? (
                  <>
                    <UserX className="w-3.5 h-3.5" />
                    <span>অ্যাকাউন্ট স্থগিত করুন</span>
                  </>
                ) : (
                  <>
                    <UserCheck className="w-3.5 h-3.5" />
                    <span>পুনরায় সক্রিয় করুন</span>
                  </>
                )}
              </button>

              <div className="flex items-center gap-2">
                {onNavigateToChat && (
                  <button
                    onClick={() => {
                      setIsDetailOpen(false);
                      onNavigateToChat(selectedStudent.email);
                    }}
                    className="px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <MessageSquare className="w-3.5 h-3.5" />
                    <span>মেসেজ দিন</span>
                  </button>
                )}
                <button
                  onClick={() => setIsDetailOpen(false)}
                  className="px-4 py-2.5 rounded-xl bg-slate-200 dark:bg-slate-700 hover:bg-slate-300 dark:hover:bg-slate-600 text-slate-800 dark:text-slate-200 text-xs font-bold"
                >
                  বন্ধ করুন
                </button>
              </div>
            </div>

          </div>
        </div>
      )}
    </div>
  );
};

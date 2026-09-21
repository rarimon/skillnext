import React, { useState, useEffect } from 'react';
import {
  Users,
  Plus,
  Search,
  BookOpen,
  DollarSign,
  Star,
  Edit,
  Trash2,
  CheckCircle2,
  XCircle,
  RefreshCw,
  Mail,
  Phone,
  ShieldCheck,
  TrendingUp,
  AlertCircle,
  ExternalLink,
  Award,
  Lock,
  Layers
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../context/ToastContext';
import { Course } from '../types';

interface InstructorItem {
  id: string;
  name: string;
  title?: string;
  headline?: string;
  expertise?: string;
  email: string;
  phone?: string;
  bio?: string;
  avatar?: string;
  coursesCount: number;
  studentsCount: number;
  rating: number;
  totalEarnings?: number;
  isActive: boolean;
}

export const AdminTeacherManagement: React.FC<{
  onSelectTeacherForCourses?: (teacherId: string) => void;
}> = ({ onSelectTeacherForCourses }) => {
  const { token } = useAuth();
  const { success, error } = useToast();

  const [instructors, setInstructors] = useState<InstructorItem[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [searchQuery, setSearchQuery] = useState<string>('');

  // Modal states
  const [isAddModalOpen, setIsAddModalOpen] = useState<boolean>(false);
  const [editingTeacher, setEditingTeacher] = useState<InstructorItem | null>(null);
  const [selectedTeacherReport, setSelectedTeacherReport] = useState<InstructorItem | null>(null);
  const [teacherToDelete, setTeacherToDelete] = useState<InstructorItem | null>(null);

  // Add/Edit Form fields
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    title: '',
    expertise: '',
    bio: '',
    avatar: ''
  });
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const fetchInstructorsAndCourses = async () => {
    if (!token) return;
    setIsLoading(true);
    try {
      const [resIns, resCourses] = await Promise.all([
        fetch('/api/admin/instructors', {
          headers: { Authorization: `Bearer ${token}` }
        }),
        fetch('/api/courses?includeUnpublished=true')
      ]);

      if (resIns.ok) {
        const data = await resIns.json();
        const normalized = (data.instructors || []).map((t: any) => ({
          ...t,
          studentsCount: Number(t.studentsCount ?? t.totalStudents ?? 0),
          coursesCount: Number(t.coursesCount ?? t.totalCourses ?? 0)
        }));
        setInstructors(normalized);
      } else {
        error('শিক্ষকদের তালিকা লোড করা যায়নি');
      }

      if (resCourses.ok) {
        const cData = await resCourses.json();
        setCourses(Array.isArray(cData) ? cData : cData.courses || []);
      }
    } catch (err) {
      console.error(err);
      error('সার্ভারে যোগাযোগ করতে সমস্যা হয়েছে');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchInstructorsAndCourses();
  }, [token]);

  // Open Add Teacher modal
  const handleOpenAddModal = () => {
    setFormData({
      name: '',
      email: '',
      password: 'password123',
      phone: '+8801',
      title: 'Senior Software Engineer & Instructor',
      expertise: 'Web Development, JavaScript, React',
      bio: '',
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&h=300&fit=crop`
    });
    setEditingTeacher(null);
    setIsAddModalOpen(true);
  };

  // Open Edit Teacher modal
  const handleOpenEditModal = (teacher: InstructorItem) => {
    setEditingTeacher(teacher);
    setFormData({
      name: teacher.name,
      email: teacher.email,
      password: '',
      phone: teacher.phone || '',
      title: teacher.title || teacher.headline || '',
      expertise: teacher.expertise || '',
      bio: teacher.bio || '',
      avatar: teacher.avatar || ''
    });
    setIsAddModalOpen(true);
  };

  // Submit Add or Edit Form
  const handleSubmitTeacherForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!token) return;
    if (!formData.name.trim() || !formData.email.trim()) {
      error('শিক্ষকের নাম এবং ইমেইল প্রদান করুন');
      return;
    }

    setIsSubmitting(true);
    try {
      if (editingTeacher) {
        // Edit
        const res = await fetch(`/api/admin/instructors/${editingTeacher.id}`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify({
            name: formData.name,
            title: formData.title,
            expertise: formData.expertise,
            bio: formData.bio,
            phone: formData.phone,
            avatar: formData.avatar
          })
        });

        const d = await res.json();
        if (!res.ok) throw new Error(d.error || 'আপডেট করা যায়নি');
        success('শিক্ষকের প্রোফাইল তথ্য সফলভাবে আপডেট হয়েছে!');
      } else {
        // Create new
        const res = await fetch('/api/admin/instructors', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
          },
          body: JSON.stringify(formData)
        });

        const d = await res.json();
        if (!res.ok) throw new Error(d.error || 'শিক্ষক অ্যাকাউন্ট তৈরি করা যায়নি');
        success('নতুন শিক্ষক অ্যাকাউন্ট সফলভাবে তৈরি হয়েছে! তারা এই ইমেইল ও পাসওয়ার্ড দিয়ে লগইন করতে পারবে।');
      }

      setIsAddModalOpen(false);
      await fetchInstructorsAndCourses();
    } catch (err: any) {
      error(err.message || 'অপারেশন ব্যর্থ হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle active status
  const handleToggleActive = async (teacher: InstructorItem) => {
    if (!token) return;
    try {
      const res = await fetch(`/api/admin/instructors/${teacher.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ isActive: !teacher.isActive })
      });
      if (res.ok) {
        success(!teacher.isActive ? 'শিক্ষক অ্যাকাউন্ট সক্রিয় করা হয়েছে' : 'শিক্ষক অ্যাকাউন্ট নিষ্ক্রিয় করা হয়েছে');
        await fetchInstructorsAndCourses();
      }
    } catch (err) {
      error('স্ট্যাটাস পরিবর্তন করা যায়নি');
    }
  };

  // Delete Teacher
  const handleConfirmDelete = async () => {
    if (!teacherToDelete || !token) return;
    setIsSubmitting(true);
    try {
      const res = await fetch(`/api/admin/instructors/${teacherToDelete.id}`, {
        method: 'DELETE',
        headers: { Authorization: `Bearer ${token}` }
      });
      const d = await res.json();
      if (!res.ok) throw new Error(d.error || 'মুছে ফেলা সম্ভব হয়নি');

      success('শিক্ষক অ্যাকাউন্ট সফলভাবে মুছে ফেলা হয়েছে');
      setTeacherToDelete(null);
      await fetchInstructorsAndCourses();
    } catch (err: any) {
      error(err.message || 'মুছতে সমস্যা হয়েছে');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Filter instructors
  const filteredInstructors = instructors.filter((ins) => {
    if (!searchQuery) return true;
    const q = searchQuery.toLowerCase();
    return (
      ins.name.toLowerCase().includes(q) ||
      ins.email.toLowerCase().includes(q) ||
      (ins.title && ins.title.toLowerCase().includes(q)) ||
      (ins.expertise && ins.expertise.toLowerCase().includes(q))
    );
  });

  // Total metrics
  const totalCoursesCount = instructors.reduce((acc, i) => acc + (i.coursesCount || 0), 0);
  const totalStudentsTaught = instructors.reduce((acc, i) => acc + (i.studentsCount || 0), 0);

  return (
    <div className="space-y-6">
      {/* Header with Title and Create Teacher Button */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 sm:p-6 shadow-xs flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800">
              মেন্টর ও শিক্ষক হাব
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400">
              মোট {instructors.length} জন নিবন্ধিত ইন্সট্রাক্টর
            </span>
          </div>
          <h2 className="text-xl font-black text-slate-900 dark:text-white mt-1">
            শিক্ষক ও মেন্টর ব্যবস্থাপনা (Teacher Management System)
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
            শিক্ষক অ্যাকাউন্ট তৈরি, কোর্স তৈরির অনুমোদন, এনরোলমেন্ট রিপোর্ট এবং পারফরম্যান্স ট্র্যাকিং।
          </p>
        </div>

        <div className="flex items-center gap-2 w-full md:w-auto">
          <button
            onClick={fetchInstructorsAndCourses}
            disabled={isLoading}
            className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-100 transition-colors"
            title="রিফ্রেশ করুন"
          >
            <RefreshCw className={`w-4 h-4 ${isLoading ? 'animate-spin' : ''}`} />
          </button>

          <button
            id="admin-add-teacher-btn"
            onClick={handleOpenAddModal}
            className="flex-1 md:flex-none px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs sm:text-sm flex items-center justify-center gap-2 shadow-xs transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span>নতুন শিক্ষক অ্যাকাউন্ট তৈরি করুন</span>
          </button>
        </div>
      </div>

      {/* 4 Summary Metric Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-emerald-600 mb-1.5">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">মোট শিক্ষক</span>
            <Users className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {instructors.length.toLocaleString('bn-BD')}
          </div>
          <div className="text-[11px] text-emerald-600 font-semibold mt-1">
            নিবন্ধিত ইন্সট্রাক্টর
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-teal-600 mb-1.5">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">সক্রিয় শিক্ষক</span>
            <CheckCircle2 className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {instructors.filter((i) => i.isActive).length.toLocaleString('bn-BD')}
          </div>
          <div className="text-[11px] text-teal-600 font-semibold mt-1">
            সক্রিয় পাঠদান করছেন
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-blue-600 mb-1.5">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">শিক্ষকদের কোর্স</span>
            <BookOpen className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalCoursesCount.toLocaleString('bn-BD')}
          </div>
          <div className="text-[11px] text-blue-600 font-semibold mt-1">
            প্রকাশিত ও ড্রাফট কোর্স
          </div>
        </div>

        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 shadow-xs">
          <div className="flex items-center justify-between text-amber-500 mb-1.5">
            <span className="text-xs font-bold text-slate-500 dark:text-slate-400">মোট শিক্ষার্থী</span>
            <TrendingUp className="w-4 h-4" />
          </div>
          <div className="text-2xl font-black text-slate-900 dark:text-white">
            {totalStudentsTaught.toLocaleString('bn-BD')}
          </div>
          <div className="text-[11px] text-amber-600 font-semibold mt-1">
            মোট কোর্স এনরোলমেন্ট
          </div>
        </div>
      </div>

      {/* Search and Table */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl overflow-hidden shadow-xs">
        {/* Table top search */}
        <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="w-3.5 h-3.5 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="শিক্ষকের নাম, ইমেইল বা বিষয় দিয়ে খুঁজুন..."
              className="w-full pl-8 pr-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
          <div className="text-xs font-semibold text-slate-500">
            {filteredInstructors.length} জন শিক্ষক প্রদর্শিত
          </div>
        </div>

        {/* Instructors Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-500 dark:text-slate-400 font-bold bg-slate-50/50 dark:bg-slate-800/40">
                <th className="py-3 px-4">শিক্ষক ও পরিচিতি</th>
                <th className="py-3 px-3">পদবী ও বিষয় (Expertise)</th>
                <th className="py-3 px-3">যোগাযোগের তথ্য</th>
                <th className="py-3 px-3">কোর্স সংখ্যা</th>
                <th className="py-3 px-3">শিক্ষার্থী ভর্তি</th>
                <th className="py-3 px-3">রেটিং</th>
                <th className="py-3 px-3">অ্যাকাউন্ট স্ট্যাটাস</th>
                <th className="py-3 pr-4 pl-2 text-right">অ্যাকশন</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
              {filteredInstructors.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-8 text-center text-slate-400 font-medium">
                    কোনো শিক্ষক পাওয়া যায়নি
                  </td>
                </tr>
              ) : (
                filteredInstructors.map((teacher) => (
                  <tr key={teacher.id} className="hover:bg-slate-50/60 dark:hover:bg-slate-800/40">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <img
                          src={teacher.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(teacher.name)}`}
                          alt={teacher.name}
                          className="w-10 h-10 rounded-xl object-cover bg-slate-100 dark:bg-slate-800 shrink-0"
                        />
                        <div>
                          <div className="font-bold text-slate-900 dark:text-white flex items-center gap-1.5">
                            <span>{teacher.name}</span>
                            <span className="text-[10px] px-1.5 py-0.5 rounded-md bg-emerald-50 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 font-extrabold">
                              INSTRUCTOR
                            </span>
                          </div>
                          <div className="text-[10px] text-slate-400">ID: {teacher.id}</div>
                        </div>
                      </div>
                    </td>

                    <td className="py-3 px-3 max-w-[200px]">
                      <div className="font-semibold text-slate-800 dark:text-slate-200 truncate">
                        {teacher.title || teacher.headline || 'ইন্সট্রাক্টর'}
                      </div>
                      <div className="text-[10px] text-slate-400 truncate">
                        {teacher.expertise || 'General Tech'}
                      </div>
                    </td>

                    <td className="py-3 px-3">
                      <div className="flex items-center gap-1 text-slate-700 dark:text-slate-300 font-medium">
                        <Mail className="w-3 h-3 text-slate-400 shrink-0" />
                        <span>{teacher.email}</span>
                      </div>
                      {teacher.phone && (
                        <div className="flex items-center gap-1 text-[10px] text-slate-400 mt-0.5">
                          <Phone className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                          <span>{teacher.phone}</span>
                        </div>
                      )}
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-bold text-slate-900 dark:text-white">
                        {teacher.coursesCount ?? 0} টি
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="font-bold text-emerald-600 dark:text-emerald-400">
                        {(teacher.studentsCount ?? 0).toLocaleString('bn-BD')} জন
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <span className="inline-flex items-center gap-1 font-bold text-amber-500">
                        <Star className="w-3 h-3 fill-amber-400" />
                        {teacher.rating || 5.0}
                      </span>
                    </td>

                    <td className="py-3 px-3">
                      <button
                        onClick={() => handleToggleActive(teacher)}
                        className={`inline-flex items-center gap-1 text-[11px] font-bold px-2 py-0.5 rounded-full transition-colors ${
                          teacher.isActive
                            ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300'
                            : 'bg-rose-50 text-rose-700 dark:bg-rose-950 dark:text-rose-300'
                        }`}
                        title="স্ট্যাটাস টগল করতে ক্লিক করুন"
                      >
                        {teacher.isActive ? (
                          <>
                            <CheckCircle2 className="w-3 h-3" />
                            <span>সক্রিয় (Active)</span>
                          </>
                        ) : (
                          <>
                            <XCircle className="w-3 h-3" />
                            <span>নিষ্ক্রিয় (Inactive)</span>
                          </>
                        )}
                      </button>
                    </td>

                    <td className="py-3 pr-4 pl-2 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        <button
                          onClick={() => setSelectedTeacherReport(teacher)}
                          className="p-1.5 rounded-lg bg-emerald-50 hover:bg-emerald-100 dark:bg-emerald-950/60 dark:hover:bg-emerald-900 text-emerald-700 dark:text-emerald-300 font-bold text-xs"
                          title="পারফরম্যান্স রিপোর্ট ও কোর্স তালিকা"
                        >
                          <TrendingUp className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleOpenEditModal(teacher)}
                          className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
                          title="সম্পাদনা করুন"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setTeacherToDelete(teacher)}
                          className="p-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 dark:bg-rose-950/50 dark:hover:bg-rose-900 text-rose-600 dark:text-rose-300 font-bold text-xs"
                          title="মুছে ফেলুন"
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

      {/* MODAL 1: ADD / EDIT TEACHER */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="w-5 h-5 text-emerald-600" />
                  {editingTeacher ? 'শিক্ষকের তথ্য সম্পাদনা (Edit Teacher)' : 'নতুন শিক্ষক অ্যাকাউন্ট তৈরি (Create Teacher)'}
                </h3>
                <p className="text-xs text-slate-500">
                  {editingTeacher
                    ? 'শিক্ষকের পরিচিতি ও যোগাযোগের তথ্য আপডেট করুন'
                    : 'শিক্ষকের নাম, ইমেইল এবং লগইন পাসওয়ার্ড সেট করুন'}
                </p>
              </div>
              <button
                onClick={() => setIsAddModalOpen(false)}
                className="text-slate-400 hover:text-slate-600 text-sm font-bold p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitTeacherForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    শিক্ষকের পুরো নাম <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="যেমন: Tanvir Hasan"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    লগইন ইমেইল <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="email"
                    required
                    disabled={!!editingTeacher}
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="instructor@example.com"
                    className={`w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 ${
                      editingTeacher ? 'bg-slate-100 dark:bg-slate-800/80 cursor-not-allowed text-slate-500' : 'bg-slate-50 dark:bg-slate-800'
                    }`}
                  />
                </div>
              </div>

              {!editingTeacher && (
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    লগইন পাসওয়ার্ড <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    placeholder="কমপক্ষে ৬ অক্ষরের পাসওয়ার্ড..."
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <p className="text-[10px] text-slate-400 mt-0.5">
                    শিক্ষক এই পাসওয়ার্ড ব্যবহার করে প্ল্যাটফর্মে লগইন করে কোর্স তৈরি করতে পারবেন।
                  </p>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ফোন নম্বর
                  </label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="+880 1711-XXXXXX"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>

                <div>
                  <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                    পদবী / হেডলাইন
                  </label>
                  <input
                    type="text"
                    value={formData.title}
                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                    placeholder="Lead FullStack Engineer & Mentor"
                    className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  বিশেষজ্ঞ বিষয় (Expertise / Tags)
                </label>
                <input
                  type="text"
                  value={formData.expertise}
                  onChange={(e) => setFormData({ ...formData, expertise: e.target.value })}
                  placeholder="React, Next.js, Python, MERN Stack"
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  প্রোফাইল ছবি URL (Avatar)
                </label>
                <input
                  type="url"
                  value={formData.avatar}
                  onChange={(e) => setFormData({ ...formData, avatar: e.target.value })}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 dark:text-slate-300 mb-1">
                  শিক্ষক পরিচিতি ও বায়ো (Bio)
                </label>
                <textarea
                  rows={3}
                  value={formData.bio}
                  onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                  placeholder="শিক্ষকের অভিজ্ঞতা ও ক্যারিয়ার সংক্ষেপ..."
                  className="w-full px-3 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 resize-none"
                />
              </div>

              <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100 dark:border-slate-800">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold hover:bg-slate-200 transition-colors"
                >
                  বাতিল
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center gap-1.5 transition-colors shadow-xs"
                >
                  {isSubmitting ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>সংরক্ষণ হচ্ছে...</span>
                    </>
                  ) : (
                    <span>{editingTeacher ? 'আপডেট করুন' : 'শিক্ষক তৈরি করুন'}</span>
                  )}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL 2: TEACHER PERFORMANCE & COURSE BREAKDOWN */}
      {selectedTeacherReport && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-2xl w-full p-6 shadow-2xl space-y-5 max-h-[90vh] overflow-y-auto">
            <div className="flex items-start justify-between border-b border-slate-100 dark:border-slate-800 pb-3">
              <div className="flex items-center gap-3">
                <img
                  src={selectedTeacherReport.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${encodeURIComponent(selectedTeacherReport.name)}`}
                  alt={selectedTeacherReport.name}
                  className="w-12 h-12 rounded-xl object-cover"
                />
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                    {selectedTeacherReport.name} এর পারফরম্যান্স রিপোর্ট
                  </h3>
                  <p className="text-xs text-slate-500">
                    {selectedTeacherReport.title} • {selectedTeacherReport.email}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTeacherReport(null)}
                className="text-slate-400 hover:text-slate-600 font-bold text-sm p-1"
              >
                ✕
              </button>
            </div>

            {/* Performance Cards for this teacher */}
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-xl font-black text-emerald-600">
                  {(selectedTeacherReport.studentsCount ?? 0).toLocaleString('bn-BD')}
                </div>
                <div className="text-[11px] font-semibold text-slate-500">মোট এনরোল শিক্ষার্থী</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-xl font-black text-slate-900 dark:text-white">
                  {selectedTeacherReport.coursesCount ?? 0}
                </div>
                <div className="text-[11px] font-semibold text-slate-500">তৈরিকৃত কোর্স</div>
              </div>

              <div className="p-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700">
                <div className="text-xl font-black text-amber-500 flex items-center justify-center gap-1">
                  <Star className="w-4 h-4 fill-amber-400" />
                  {selectedTeacherReport.rating}
                </div>
                <div className="text-[11px] font-semibold text-slate-500">গড় কোর্স রেটিং</div>
              </div>
            </div>

            {/* Courses list by this teacher */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="w-3.5 h-3.5 text-emerald-600" />
                এই শিক্ষকের কোর্সসমূহ
              </h4>

              <div className="divide-y divide-slate-100 dark:divide-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl overflow-hidden">
                {courses.filter(
                  (c) =>
                    c.instructorId === selectedTeacherReport.id ||
                    (c.instructor && (c.instructor.id === selectedTeacherReport.id || c.instructor.name === selectedTeacherReport.name))
                ).length === 0 ? (
                  <div className="p-4 text-center text-xs text-slate-400">
                    এই শিক্ষকের এখনও কোনো কোর্স সিস্টেমে যুক্ত হয়নি।
                  </div>
                ) : (
                  courses
                    .filter(
                      (c) =>
                        c.instructorId === selectedTeacherReport.id ||
                        (c.instructor && (c.instructor.id === selectedTeacherReport.id || c.instructor.name === selectedTeacherReport.name))
                    )
                    .map((c) => (
                      <div key={c.id} className="p-3 flex items-center justify-between text-xs hover:bg-slate-50 dark:hover:bg-slate-800/40">
                        <div className="flex items-center gap-2.5">
                          <img src={c.thumbnail} alt={c.title} className="w-10 h-7 rounded object-cover" />
                          <div>
                            <div className="font-bold text-slate-900 dark:text-white line-clamp-1">
                              {c.titleBn || c.title}
                            </div>
                            <div className="text-[10px] text-slate-400">
                              {c.level} • {c.durationHours} ঘন্টা • {c.lessonsCount} লেসন
                            </div>
                          </div>
                        </div>

                        <div className="text-right">
                          <span className="font-bold text-emerald-600 block">
                            {c.studentsCount} জন শিক্ষার্থী
                          </span>
                          <span className="text-[10px] text-slate-400">
                            ফি: ৳{c.discountPrice || c.price}
                          </span>
                        </div>
                      </div>
                    ))
                )}
              </div>
            </div>

            <div className="flex justify-end pt-2">
              <button
                onClick={() => setSelectedTeacherReport(null)}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs"
              >
                বন্ধ করুন
              </button>
            </div>
          </div>
        </div>
      )}

      {/* MODAL 3: DELETE TEACHER CONFIRMATION */}
      {teacherToDelete && (
        <div className="fixed inset-0 z-50 bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl max-w-md w-full p-6 shadow-xl space-y-4">
            <div className="flex items-center gap-3 text-rose-600">
              <div className="p-2.5 rounded-xl bg-rose-50 dark:bg-rose-950/50">
                <AlertCircle className="w-6 h-6" />
              </div>
              <div>
                <h3 className="text-base font-extrabold text-slate-900 dark:text-white">
                  শিক্ষক অ্যাকাউন্ট মুছে ফেলবেন?
                </h3>
                <p className="text-xs text-slate-500">এই সিদ্ধান্তটি অপরিবর্তনযোগ্য</p>
              </div>
            </div>

            <p className="text-xs text-slate-600 dark:text-slate-300">
              আপনি কি নিশ্চিতভাবে <strong>"{teacherToDelete.name}"</strong> এর শিক্ষক অ্যাকাউন্ট মুছে ফেলতে চান?
            </p>

            <div className="flex items-center justify-end gap-2.5 pt-2">
              <button
                onClick={() => setTeacherToDelete(null)}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold text-xs hover:bg-slate-200"
              >
                বাতিল
              </button>
              <button
                onClick={handleConfirmDelete}
                disabled={isSubmitting}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-700 text-white font-bold text-xs flex items-center gap-1.5"
              >
                {isSubmitting ? (
                  <>
                    <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                    <span>মুছে ফেলা হচ্ছে...</span>
                  </>
                ) : (
                  <span>হ্যাঁ, মুছে ফেলুন</span>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

import React, { useState } from 'react';
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  Video,
  FileText,
  FolderPlus,
  CheckCircle2,
  Sparkles,
  Link,
  DollarSign,
  Clock,
  Layers,
  HelpCircle,
  Eye,
  AlertCircle,
  BookOpen,
  Image as ImageIcon,
  Check,
  ChevronDown,
  ChevronUp
} from 'lucide-react';
import { Course, CourseModule, CourseLesson } from '../types';

interface AdminCourseEditorProps {
  initialCourse?: Course | null;
  onSave: (courseData: Partial<Course>) => Promise<void>;
  onCancel: () => void;
  categories: Array<{ id: string; name: string }>;
  instructors: Array<{ id: string; name: string; headline?: string }>;
  isTeacherView?: boolean;
  currentTeacherName?: string;
}

export const AdminCourseEditor: React.FC<AdminCourseEditorProps> = ({
  initialCourse,
  onSave,
  onCancel,
  categories,
  instructors,
  isTeacherView = false,
  currentTeacherName
}) => {
  const isEditing = !!initialCourse?.id;

  // Basic Info
  const [title, setTitle] = useState(initialCourse?.title || '');
  const [titleBn, setTitleBn] = useState(initialCourse?.titleBn || '');
  const [subtitle, setSubtitle] = useState(initialCourse?.subtitle || '');
  const [description, setDescription] = useState(initialCourse?.description || '');
  const [categoryId, setCategoryId] = useState(initialCourse?.categoryId || (categories[0]?.id || 'cat-1'));
  const [instructorId, setInstructorId] = useState(initialCourse?.instructorId || (instructors[0]?.id || 'ins-1'));
  const [level, setLevel] = useState<'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'ALL_LEVELS'>(initialCourse?.level || 'BEGINNER');
  const [language, setLanguage] = useState(initialCourse?.language || 'বাংলা');
  const [durationHours, setDurationHours] = useState(initialCourse?.durationHours ? String(initialCourse.durationHours) : '15');

  // Media & Pricing
  const [price, setPrice] = useState(initialCourse?.price ? String(initialCourse.price) : '3500');
  const [discountPrice, setDiscountPrice] = useState(initialCourse?.discountPrice !== undefined ? String(initialCourse.discountPrice) : '2450');
  const [thumbnail, setThumbnail] = useState(initialCourse?.thumbnail || 'https://images.unsplash.com/photo-1587620962725-abab7fe55159?auto=format&fit=crop&w=800&q=80');
  const [promoVideoUrl, setPromoVideoUrl] = useState(initialCourse?.promoVideoUrl || 'https://www.youtube.com/watch?v=dQw4w9WgXcQ');
  const [isFeatured, setIsFeatured] = useState(initialCourse?.isFeatured || false);
  const [isBestseller, setIsBestseller] = useState(initialCourse?.isBestseller || false);
  const [isPublished, setIsPublished] = useState(initialCourse?.isPublished !== undefined ? initialCourse.isPublished : true);

  // Learning Outcomes & Requirements
  const [learningOutcomes, setLearningOutcomes] = useState<string[]>(
    initialCourse?.learningOutcomes && initialCourse.learningOutcomes.length > 0
      ? initialCourse.learningOutcomes
      : ['কোর্সের প্রজেক্ট বাস্তব কোড দিয়ে তৈরি করতে পারবেন', 'ইন্ডাস্ট্রি স্ট্যান্ডার্ড বেস্ট প্র্যাকটিস শিখবেন', 'প্রফেশনাল পোর্টফোলিও বিল্ড করতে পারবেন']
  );
  const [newOutcomeInput, setNewOutcomeInput] = useState('');

  const [requirements, setRequirements] = useState<string[]>(
    initialCourse?.requirements && initialCourse.requirements.length > 0
      ? initialCourse.requirements
      : ['কম্পিউটার ও ইন্টারনেট সংযোগ থাকা আবশ্যক', 'শেখার আগ্রহ ও নিয়মিত অনুশীলনের মানসিকতা']
  );
  const [newRequirementInput, setNewRequirementInput] = useState('');

  // Course Modules & Lessons (Curriculum)
  const [modules, setModules] = useState<CourseModule[]>(() => {
    if (initialCourse?.modules && initialCourse.modules.length > 0) {
      return JSON.parse(JSON.stringify(initialCourse.modules));
    }
    return [
      {
        id: `mod-${Date.now()}-1`,
        title: 'মডিউল ০১: পরিচিতি ও এনভায়রনমেন্ট সেটআপ',
        order: 1,
        lessons: [
          {
            id: `les-${Date.now()}-1`,
            title: 'লেকচার ১.১: কোর্স ওভারভিউ ও রোডম্যাপ',
            duration: '10:45',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            isFreePreview: true,
            order: 1
          },
          {
            id: `les-${Date.now()}-2`,
            title: 'লেকচার ১.২: টুলস ও লাইব্রেরি ইনস্টলেশন',
            duration: '18:20',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            isFreePreview: false,
            order: 2
          }
        ]
      },
      {
        id: `mod-${Date.now()}-2`,
        title: 'মডিউল ০২: মূল কনসেপ্ট ও হ্যান্ডস-অন প্রজেক্ট',
        order: 2,
        lessons: [
          {
            id: `les-${Date.now()}-3`,
            title: 'লেকচার ২.১: বেসিক আর্কিটেকচার ও কোডিং',
            duration: '22:15',
            videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
            isFreePreview: false,
            order: 1
          }
        ]
      }
    ];
  });

  // Course Resources State
  const [resources, setResources] = useState<Array<{ id: string; title: string; url: string; type: string }>>([
    { id: 'res-1', title: 'গিটহাব সোর্স কোড রিপোজিটরি (GitHub Repo)', url: 'https://github.com/skillnest-academy/course-project', type: 'GITHUB' },
    { id: 'res-2', title: 'লেকচার স্লাইড ও চিটশিট (Cheat Sheet PDF)', url: 'https://skillnest.bd/resources/cheatsheet.pdf', type: 'PDF' }
  ]);
  const [newResTitle, setNewResTitle] = useState('');
  const [newResUrl, setNewResUrl] = useState('');
  const [newResType, setNewResType] = useState('PDF');

  // Submitting
  const [isSaving, setIsSaving] = useState(false);
  const [activeTab, setActiveTab] = useState<'BASIC' | 'CURRICULUM' | 'MEDIA_PRICING' | 'RESOURCES'>('BASIC');

  // Add / Remove Outcomes
  const handleAddOutcome = () => {
    if (!newOutcomeInput.trim()) return;
    setLearningOutcomes([...learningOutcomes, newOutcomeInput.trim()]);
    setNewOutcomeInput('');
  };
  const handleRemoveOutcome = (index: number) => {
    setLearningOutcomes(learningOutcomes.filter((_, i) => i !== index));
  };

  // Add / Remove Requirements
  const handleAddRequirement = () => {
    if (!newRequirementInput.trim()) return;
    setRequirements([...requirements, newRequirementInput.trim()]);
    setNewRequirementInput('');
  };
  const handleRemoveRequirement = (index: number) => {
    setRequirements(requirements.filter((_, i) => i !== index));
  };

  // Modules CRUD
  const handleAddModule = () => {
    const newModNumber = modules.length + 1;
    const newModule: CourseModule = {
      id: `mod-${Date.now()}-${newModNumber}`,
      title: `মডিউল 0${newModNumber}: নতুন মডিউলের নাম`,
      order: newModNumber,
      lessons: [
        {
          id: `les-${Date.now()}-1`,
          title: `লেকচার ${newModNumber}.1: প্রথম পাঠ`,
          duration: '15:00',
          videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
          isFreePreview: false,
          order: 1
        }
      ]
    };
    setModules([...modules, newModule]);
  };

  const handleUpdateModuleTitle = (modIndex: number, title: string) => {
    const updated = [...modules];
    updated[modIndex].title = title;
    setModules(updated);
  };

  const handleDeleteModule = (modIndex: number) => {
    if (modules.length <= 1) {
      alert('কমপক্ষে একটি মডিউল থাকা আবশ্যক');
      return;
    }
    setModules(modules.filter((_, i) => i !== modIndex));
  };

  // Lessons CRUD
  const handleAddLesson = (modIndex: number) => {
    const updated = [...modules];
    const lessonOrder = (updated[modIndex].lessons?.length || 0) + 1;
    const newLesson: CourseLesson = {
      id: `les-${Date.now()}-${Math.floor(Math.random() * 1000)}`,
      title: `লেকচার ${modIndex + 1}.${lessonOrder}: নতুন পাঠের নাম`,
      duration: '12:00',
      videoUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      isFreePreview: false,
      order: lessonOrder
    };
    updated[modIndex].lessons = [...(updated[modIndex].lessons || []), newLesson];
    setModules(updated);
  };

  const handleUpdateLesson = (modIndex: number, lessonIndex: number, fields: Partial<CourseLesson>) => {
    const updated = [...modules];
    updated[modIndex].lessons[lessonIndex] = {
      ...updated[modIndex].lessons[lessonIndex],
      ...fields
    };
    setModules(updated);
  };

  const handleDeleteLesson = (modIndex: number, lessonIndex: number) => {
    const updated = [...modules];
    updated[modIndex].lessons = updated[modIndex].lessons.filter((_, i) => i !== lessonIndex);
    setModules(updated);
  };

  // Resources CRUD
  const handleAddResource = () => {
    if (!newResTitle.trim() || !newResUrl.trim()) return;
    setResources([
      ...resources,
      {
        id: `res-${Date.now()}`,
        title: newResTitle.trim(),
        url: newResUrl.trim(),
        type: newResType
      }
    ]);
    setNewResTitle('');
    setNewResUrl('');
  };

  const handleDeleteResource = (id: string) => {
    setResources(resources.filter((r) => r.id !== id));
  };

  // Save Submit
  const handleSubmit = async (publishStatus?: boolean) => {
    if (!title.trim()) {
      alert('অনুগ্রহ করে কোর্সের নাম (Title) লিখুন');
      setActiveTab('BASIC');
      return;
    }

    setIsSaving(true);
    try {
      const selectedCategory = categories.find((c) => c.id === categoryId);
      const selectedInstructor = instructors.find((i) => i.id === instructorId);

      const payload: Partial<Course> = {
        title: title.trim(),
        titleBn: titleBn.trim() || title.trim(),
        subtitle: subtitle.trim(),
        description: description.trim(),
        categoryId,
        categoryName: selectedCategory?.name || 'General',
        instructorId,
        instructor: (selectedInstructor as any) || (instructors[0] as any),
        level,
        language,
        durationHours: Number(durationHours) || 10,
        price: Number(price) || 0,
        discountPrice: discountPrice !== '' ? Number(discountPrice) : undefined,
        thumbnail: thumbnail.trim(),
        promoVideoUrl: promoVideoUrl.trim(),
        isFeatured,
        isBestseller,
        isPublished: publishStatus !== undefined ? publishStatus : isPublished,
        learningOutcomes,
        requirements,
        modules
      };

      await onSave(payload);
    } catch (err) {
      console.error('Save failed:', err);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="space-y-6 pb-12 animate-in fade-in duration-300">
      {/* Top Header Bar */}
      <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-4 sm:p-6 shadow-xs flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={onCancel}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 transition-colors"
            title="Back to Courses"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300">
                {isEditing ? 'কোর্স সম্পাদনা' : 'নতুন কোর্স তৈরি'}
              </span>
              <span className={`text-xs px-2 py-0.5 rounded-full font-semibold ${isPublished ? 'bg-teal-50 text-teal-700 dark:bg-teal-950 dark:text-teal-300' : 'bg-amber-50 text-amber-700 dark:bg-amber-950 dark:text-amber-300'}`}>
                {isPublished ? 'পাবলিশড' : 'ড্রাফট মোড'}
              </span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black text-slate-900 dark:text-white mt-1">
              {title || (isEditing ? 'কোর্স আপডেট করুন' : 'নতুন ফুলস্ট্যাক কোর্স যোগ করুন')}
            </h1>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2.5 w-full sm:w-auto">
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 font-bold text-xs transition-colors"
          >
            বাতিল করুন
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(false)}
            disabled={isSaving}
            className="flex-1 sm:flex-none px-4 py-2.5 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors"
          >
            ড্রাফট রাখুন
          </button>
          <button
            type="button"
            onClick={() => handleSubmit(true)}
            disabled={isSaving}
            className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-md shadow-emerald-600/20 active:scale-95 transition-all"
          >
            <Save className="w-4 h-4" />
            <span>{isSaving ? 'সংরক্ষণ হচ্ছে...' : 'সংরক্ষণ ও পাবলিশ করুন'}</span>
          </button>
        </div>
      </div>

      {/* Navigation Sub-Tabs for Course Builder */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 overflow-x-auto pb-1 text-xs font-bold scrollbar-none">
        <button
          onClick={() => setActiveTab('BASIC')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'BASIC'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>১. সাধারণ তথ্য ও বর্ণনা</span>
        </button>

        <button
          onClick={() => setActiveTab('CURRICULUM')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'CURRICULUM'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <Layers className="w-4 h-4" />
          <span>২. কারিকুলাম ও কন্টেন্ট ({modules.length}টি মডিউল)</span>
        </button>

        <button
          onClick={() => setActiveTab('MEDIA_PRICING')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'MEDIA_PRICING'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <DollarSign className="w-4 h-4" />
          <span>৩. ফি, থাম্বনেইল ও প্রিভিউ ভিডিও</span>
        </button>

        <button
          onClick={() => setActiveTab('RESOURCES')}
          className={`px-4 py-2.5 rounded-xl flex items-center gap-2 transition-colors whitespace-nowrap ${
            activeTab === 'RESOURCES'
              ? 'bg-emerald-600 text-white shadow-xs'
              : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
          }`}
        >
          <FileText className="w-4 h-4" />
          <span>৪. রিসোর্স ও স্টাডি ফাইলস ({resources.length})</span>
        </button>
      </div>

      {/* TAB 1: BASIC INFO & OUTCOMES */}
      {activeTab === 'BASIC' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <BookOpen className="w-4 h-4 text-emerald-600" />
                কোর্সের শিরোনাম ও বিবরণ
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    কোর্সের নাম (ইংরেজি) <span className="text-rose-500">*</span>
                  </label>
                  <input
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Next.js 15 & React FullStack Mastery"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                    required
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    কোর্সের নাম (বাংলা)
                  </label>
                  <input
                    type="text"
                    value={titleBn}
                    onChange={(e) => setTitleBn(e.target.value)}
                    placeholder="যেমন: নেক্সট.জেএস ১৫ ও রিঅ্যাক্ট কমপ্লিট ফুলস্ট্যাক ডেভেলপমেন্ট"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    সাব-টাইটেল / সংক্ষিপ্ত সারসংক্ষেপ
                  </label>
                  <input
                    type="text"
                    value={subtitle}
                    onChange={(e) => setSubtitle(e.target.value)}
                    placeholder="যেমন: বেসিক থেকে অ্যাডভান্সড লেভেলের ৩টি লাইভ ফুলস্ট্যাক প্রজেক্ট"
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    কোর্সের বিস্তারিত বিবরণ (Course Description)
                  </label>
                  <textarea
                    rows={6}
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="কোর্সের বিস্তারিত বিষয়বস্তু, সিলেবাস ও লক্ষ্য সম্পর্কে লিখুন..."
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-medium leading-relaxed"
                  />
                </div>
              </div>
            </div>

            {/* Learning Outcomes Builder */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                এই কোর্স থেকে শিক্ষার্থীরা কি শিখবে? (What You Will Learn)
              </h2>

              <div className="space-y-2">
                {learningOutcomes.map((item, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                    <Check className="w-4 h-4 text-emerald-600 shrink-0" />
                    <span className="flex-1 text-slate-800 dark:text-slate-200 font-medium">{item}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveOutcome(idx)}
                      className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newOutcomeInput}
                    onChange={(e) => setNewOutcomeInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddOutcome())}
                    placeholder="নতুন শিক্ষণীয় বিষয় লিখুন ও যোগ করুন..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddOutcome}
                    className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    যোগ করুন
                  </button>
                </div>
              </div>
            </div>

            {/* Requirements Builder */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
                <AlertCircle className="w-4 h-4 text-amber-600" />
                পূর্বশর্ত বা প্রয়োজনীয়তা (Prerequisites / Requirements)
              </h2>

              <div className="space-y-2">
                {requirements.map((req, idx) => (
                  <div key={idx} className="flex items-center gap-2 p-2 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 text-xs">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500 shrink-0" />
                    <span className="flex-1 text-slate-800 dark:text-slate-200 font-medium">{req}</span>
                    <button
                      type="button"
                      onClick={() => handleRemoveRequirement(idx)}
                      className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}

                <div className="flex gap-2 pt-2">
                  <input
                    type="text"
                    value={newRequirementInput}
                    onChange={(e) => setNewRequirementInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), handleAddRequirement())}
                    placeholder="যেমন: এইচটিএমএল ও সিএসএস-এর প্রাথমিক জ্ঞান..."
                    className="flex-1 px-3.5 py-2 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  />
                  <button
                    type="button"
                    onClick={handleAddRequirement}
                    className="px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white font-bold text-xs flex items-center gap-1 shrink-0"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    যোগ করুন
                  </button>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Taxonomy & Parameters */}
          <div className="space-y-6">
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                ক্যাটাগরি ও ইন্সট্রাক্টর নির্বাচন
              </h2>

              <div className="space-y-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    ক্যাটাগরি
                  </label>
                  <select
                    value={categoryId}
                    onChange={(e) => setCategoryId(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none font-medium"
                  >
                    {categories.map((c) => (
                      <option key={c.id} value={c.id}>
                        {c.name}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    কোর্স ইন্সট্রাক্টর
                  </label>
                  {isTeacherView ? (
                    <div className="w-full px-3.5 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-800/60 text-xs font-bold text-emerald-800 dark:text-emerald-300 flex items-center justify-between">
                      <span>{currentTeacherName || 'আপনি নিজে (ইন্সট্রাক্টর)'}</span>
                      <span className="text-[10px] px-2 py-0.5 rounded-md bg-emerald-200/60 dark:bg-emerald-800 text-emerald-900 dark:text-emerald-100 font-extrabold uppercase">
                        কোর্স ক্রিয়েটর
                      </span>
                    </div>
                  ) : (
                    <select
                      value={instructorId}
                      onChange={(e) => setInstructorId(e.target.value)}
                      className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none font-medium"
                    >
                      {instructors.map((ins) => (
                        <option key={ins.id} value={ins.id}>
                          {ins.name} ({ins.headline || 'Instructor'})
                        </option>
                      ))}
                    </select>
                  )}
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    লেভেল (Difficulty Level)
                  </label>
                  <select
                    value={level}
                    onChange={(e: any) => setLevel(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none font-medium"
                  >
                    <option value="BEGINNER">BEGINNER (শুরু থেকে)</option>
                    <option value="INTERMEDIATE">INTERMEDIATE (মধ্যবর্তী)</option>
                    <option value="ADVANCED">ADVANCED (অ্যাডভান্সড)</option>
                    <option value="ALL_LEVELS">ALL LEVELS (সকলের জন্য)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    কোর্সের ভাষা
                  </label>
                  <input
                    type="text"
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none font-medium"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    আনুমানিক সময়সীমা (ঘণ্টায়)
                  </label>
                  <input
                    type="number"
                    value={durationHours}
                    onChange={(e) => setDurationHours(e.target.value)}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none font-medium"
                  />
                </div>
              </div>
            </div>

            {/* Quick Badges & Flags */}
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-3 shadow-xs">
              <h2 className="text-sm font-extrabold text-slate-900 dark:text-white border-b border-slate-100 dark:border-slate-800 pb-3">
                ডিসপ্লে সেটিংস ও ব্যাজ
              </h2>

              <label className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isPublished}
                  onChange={(e) => setIsPublished(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-white block">সরাসরি পাবলিশ রাখুন</span>
                  <span className="text-[11px] text-slate-500">অনচেক করলে কোর্সটি ড্রাফট থাকবে</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isBestseller}
                  onChange={(e) => setIsBestseller(e.target.checked)}
                  className="w-4 h-4 rounded text-amber-600 focus:ring-amber-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-white block">বেস্টসেলার ব্যাজ দিন (Bestseller)</span>
                  <span className="text-[11px] text-slate-500">হোমপেজের সেরা সেকশনে প্রাধান্য পাবে</span>
                </div>
              </label>

              <label className="flex items-center gap-3 p-2.5 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer">
                <input
                  type="checkbox"
                  checked={isFeatured}
                  onChange={(e) => setIsFeatured(e.target.checked)}
                  className="w-4 h-4 rounded text-emerald-600 focus:ring-emerald-500"
                />
                <div>
                  <span className="text-xs font-bold text-slate-800 dark:text-white block">ফিচার্ড কোর্স (Featured)</span>
                  <span className="text-[11px] text-slate-500">টপ হাইলাইটেড হিসেবে দেখানো হবে</span>
                </div>
              </label>
            </div>
          </div>
        </div>
      )}

      {/* TAB 2: CURRICULUM & MODULES BUILDER */}
      {activeTab === 'CURRICULUM' && (
        <div className="space-y-6">
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs flex items-center justify-between">
            <div>
              <h2 className="text-sm sm:text-base font-extrabold text-slate-900 dark:text-white">
                কোর্স কারিকুলাম ও লেকচার বিল্ডার
              </h2>
              <p className="text-xs text-slate-500 mt-0.5">
                মডিউল এবং প্রতিটি মডিউলের অন্তর্গত ভিডিও লেকচার সাজান। ভিডিও প্রিভিউ ও ডিউরেশন সেট করুন।
              </p>
            </div>
            <button
              type="button"
              onClick={handleAddModule}
              className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1.5 shadow-xs active:scale-95 transition-all"
            >
              <FolderPlus className="w-4 h-4" />
              নতুন মডিউল যোগ করুন
            </button>
          </div>

          {/* Module List */}
          <div className="space-y-4">
            {modules.map((module, modIndex) => (
              <div
                key={module.id || modIndex}
                className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 shadow-xs space-y-4"
              >
                {/* Module Header */}
                <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 pb-3 border-b border-slate-100 dark:border-slate-800">
                  <div className="flex items-center gap-3 w-full sm:w-auto">
                    <span className="w-7 h-7 rounded-lg bg-emerald-600 text-white font-black text-xs flex items-center justify-center shrink-0">
                      {modIndex + 1}
                    </span>
                    <input
                      type="text"
                      value={module.title}
                      onChange={(e) => handleUpdateModuleTitle(modIndex, e.target.value)}
                      className="w-full sm:w-96 px-3 py-1.5 rounded-lg bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-extrabold text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                    />
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-auto">
                    <button
                      type="button"
                      onClick={() => handleAddLesson(modIndex)}
                      className="px-3 py-1.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/50 hover:bg-emerald-100 text-emerald-700 dark:text-emerald-300 font-bold text-xs flex items-center gap-1 transition-colors"
                    >
                      <Plus className="w-3.5 h-3.5" />
                      লেকচার যোগ করুন
                    </button>
                    <button
                      type="button"
                      onClick={() => handleDeleteModule(modIndex)}
                      className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                      title="Delete Module"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Lessons in this Module */}
                <div className="space-y-2.5 pl-0 sm:pl-4">
                  {module.lessons?.map((lesson, lessonIndex) => (
                    <div
                      key={lesson.id || lessonIndex}
                      className="flex flex-col sm:flex-row items-start sm:items-center gap-3 p-3 rounded-xl bg-slate-50 dark:bg-slate-800/70 border border-slate-200 dark:border-slate-700 text-xs"
                    >
                      <div className="flex items-center gap-2 flex-1 w-full min-w-0">
                        <Video className="w-4 h-4 text-emerald-600 shrink-0" />
                        <input
                          type="text"
                          value={lesson.title}
                          onChange={(e) => handleUpdateLesson(modIndex, lessonIndex, { title: e.target.value })}
                          placeholder="লেকচারের নাম"
                          className="flex-1 px-2.5 py-1.5 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-semibold text-slate-800 dark:text-white outline-none text-xs"
                        />
                      </div>

                      <div className="flex flex-wrap items-center gap-2.5 w-full sm:w-auto justify-between sm:justify-start">
                        {/* Duration */}
                        <div className="flex items-center gap-1">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <input
                            type="text"
                            value={lesson.duration}
                            onChange={(e) => handleUpdateLesson(modIndex, lessonIndex, { duration: e.target.value })}
                            placeholder="12:30"
                            className="w-16 px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-center font-bold text-xs"
                          />
                        </div>

                        {/* Video URL */}
                        <div className="flex items-center gap-1 flex-1 sm:flex-none">
                          <Link className="w-3.5 h-3.5 text-slate-400" />
                          <input
                            type="text"
                            value={lesson.videoUrl || ''}
                            onChange={(e) => handleUpdateLesson(modIndex, lessonIndex, { videoUrl: e.target.value })}
                            placeholder="ভিডিও URL (YouTube/MP4)"
                            className="w-36 sm:w-48 px-2 py-1 rounded-lg bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 font-medium text-xs"
                          />
                        </div>

                        {/* Free preview toggle */}
                        <label className="flex items-center gap-1 text-[11px] font-semibold text-slate-600 dark:text-slate-300 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={lesson.isFreePreview || false}
                            onChange={(e) => handleUpdateLesson(modIndex, lessonIndex, { isFreePreview: e.target.checked })}
                            className="w-3.5 h-3.5 rounded text-emerald-600"
                          />
                          <span>ফ্রি প্রিভিউ</span>
                        </label>

                        {/* Delete lesson */}
                        <button
                          type="button"
                          onClick={() => handleDeleteLesson(modIndex, lessonIndex)}
                          className="p-1 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                          title="Delete Lesson"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* TAB 3: MEDIA & PRICING */}
      {activeTab === 'MEDIA_PRICING' && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Pricing Config */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <DollarSign className="w-4 h-4 text-emerald-600" />
              কোর্স ফি ও মূল্য নির্ধারণ (BDT)
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  রেগুলার ফি (মূল মূল্য ৳) <span className="text-rose-500">*</span>
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  placeholder="3500"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-black text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ডিসকাউন্ট অফার মূল্য (৳)
                </label>
                <input
                  type="number"
                  value={discountPrice}
                  onChange={(e) => setDiscountPrice(e.target.value)}
                  placeholder="2450 (খালি রাখলে ডিসকাউন্ট থাকবে না)"
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-sm font-black text-emerald-600 dark:text-emerald-400 outline-none focus:ring-2 focus:ring-emerald-500"
                />
              </div>

              <div className="p-3.5 rounded-xl bg-emerald-50/70 dark:bg-emerald-950/30 border border-emerald-200/50 dark:border-emerald-900/40 text-xs space-y-1.5">
                <span className="font-bold text-emerald-900 dark:text-emerald-200 flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
                  হিসেবিত ডিসকাউন্ট:
                </span>
                <p className="text-slate-600 dark:text-slate-300 font-medium">
                  {discountPrice && Number(price) > Number(discountPrice)
                    ? `শিক্ষার্থী ৳${Number(price) - Number(discountPrice)} ছাড় পাচ্ছেন (${Math.round(((Number(price) - Number(discountPrice)) / Number(price)) * 100)}% ডিসকাউন্ট)`
                    : 'বর্তমানে কোনো ডিসকাউন্ট প্রযোজ্য নয়'}
                </p>
              </div>
            </div>
          </div>

          {/* Media & URLs */}
          <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4 shadow-xs">
            <h2 className="text-sm font-extrabold text-slate-900 dark:text-white flex items-center gap-2 border-b border-slate-100 dark:border-slate-800 pb-3">
              <ImageIcon className="w-4 h-4 text-emerald-600" />
              থাম্বনেইল ও প্রোমো ভিডিও
            </h2>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  থাম্বনেইল ইমেজ URL
                </label>
                <input
                  type="text"
                  value={thumbnail}
                  onChange={(e) => setThumbnail(e.target.value)}
                  placeholder="https://images.unsplash.com/..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>

              {thumbnail && (
                <div className="relative aspect-video rounded-xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xs max-h-48">
                  <img
                    src={thumbnail}
                    alt="Course Preview"
                    className="w-full h-full object-cover"
                    onError={(e: any) => {
                      e.target.src = 'https://images.unsplash.com/photo-1517694712202-14dd9538aa97?w=800';
                    }}
                  />
                  <div className="absolute top-2 right-2 px-2 py-1 rounded-md bg-black/70 text-white text-[10px] font-bold">
                    প্রিভিউ
                  </div>
                </div>
              )}

              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  প্রোমো ভিডিও URL (YouTube/Vimeo)
                </label>
                <input
                  type="text"
                  value={promoVideoUrl}
                  onChange={(e) => setPromoVideoUrl(e.target.value)}
                  placeholder="https://www.youtube.com/watch?v=..."
                  className="w-full px-3.5 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500 font-medium"
                />
              </div>
            </div>
          </div>
        </div>
      )}

      {/* TAB 4: RESOURCES */}
      {activeTab === 'RESOURCES' && (
        <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-6 shadow-xs">
          <div>
            <h2 className="text-base font-extrabold text-slate-900 dark:text-white flex items-center gap-2">
              <FileText className="w-4 h-4 text-emerald-600" />
              কোর্স রিসোর্স ও সাপোর্টিং ফাইলস
            </h2>
            <p className="text-xs text-slate-500 mt-1">
              কোর্সের সাথে শিক্ষার্থীদের জন্য সোর্স কোড রিপো, লেকচার নোটস, স্লাইড ডেক বা চিটশিট যুক্ত করুন।
            </p>
          </div>

          {/* Add Resource Form */}
          <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-200 dark:border-slate-700 space-y-3">
            <h3 className="text-xs font-bold text-slate-800 dark:text-slate-200">নতুন রিসোর্স যোগ করুন:</h3>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
              <input
                type="text"
                value={newResTitle}
                onChange={(e) => setNewResTitle(e.target.value)}
                placeholder="রিসোর্সের নাম (যেমন: প্রজেক্ট সোর্স কোড)"
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <input
                type="text"
                value={newResUrl}
                onChange={(e) => setNewResUrl(e.target.value)}
                placeholder="ডাউনলোড বা গিটহাব লিংক (URL)"
                className="px-3.5 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs text-slate-900 dark:text-white outline-none focus:ring-2 focus:ring-emerald-500"
              />
              <div className="flex gap-2">
                <select
                  value={newResType}
                  onChange={(e) => setNewResType(e.target.value)}
                  className="flex-1 px-3 py-2 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs font-semibold text-slate-800 dark:text-white outline-none"
                >
                  <option value="PDF">PDF ডকুমেন্ট</option>
                  <option value="GITHUB">GitHub Repo</option>
                  <option value="ZIP">ZIP Code</option>
                  <option value="LINK">External Link</option>
                </select>
                <button
                  type="button"
                  onClick={handleAddResource}
                  className="px-4 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs flex items-center gap-1 shrink-0"
                >
                  <Plus className="w-3.5 h-3.5" />
                  যুক্ত করুন
                </button>
              </div>
            </div>
          </div>

          {/* Existing Resources List */}
          <div className="space-y-2">
            {resources.map((res) => (
              <div
                key={res.id}
                className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs shadow-xs"
              >
                <div className="flex items-center gap-3">
                  <span className="px-2 py-1 rounded-md bg-emerald-100 text-emerald-700 dark:bg-emerald-950 dark:text-emerald-300 font-extrabold text-[10px]">
                    {res.type}
                  </span>
                  <div>
                    <h4 className="font-bold text-slate-800 dark:text-white">{res.title}</h4>
                    <a
                      href={res.url}
                      target="_blank"
                      rel="noreferrer"
                      className="text-[11px] text-emerald-600 hover:underline flex items-center gap-1 truncate max-w-sm sm:max-w-md"
                    >
                      {res.url}
                    </a>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => handleDeleteResource(res.id)}
                  className="p-1.5 rounded-lg text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/40"
                  title="Remove Resource"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

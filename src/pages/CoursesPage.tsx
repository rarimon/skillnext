import React, { useState, useEffect, useMemo } from 'react';
import {
  Search,
  Filter,
  RotateCcw,
  SlidersHorizontal,
  BookOpen,
  X,
  Check,
  ChevronRight,
  Layers,
  Sparkles,
  Tag
} from 'lucide-react';
import { Course } from '../types';
import { CourseCard } from '../components/CourseCard';
import { useLanguage } from '../context/LanguageContext';

interface CoursesPageProps {
  initialSearch?: string;
  initialCategory?: string;
  onNavigate?: (route: string, param?: string) => void;
  onSelectCourse?: (slug: string) => void;
  onEnrollCourse?: (course: Course) => void;
}

export const CoursesPage: React.FC<CoursesPageProps> = ({
  initialSearch = '',
  initialCategory = '',
  onNavigate,
  onSelectCourse,
  onEnrollCourse
}) => {
  const { language, t } = useLanguage();

  const [courses, setCourses] = useState<Course[]>([]);
  const [categories, setCategories] = useState<{ id: string; name: string; nameBn?: string }[]>([]);
  const [loading, setLoading] = useState(true);
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Filter States
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState(initialCategory);
  const [selectedLevel, setSelectedLevel] = useState<string>('ALL');
  const [selectedPrice, setSelectedPrice] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<string>('POPULAR');

  useEffect(() => {
    // Fetch courses and categories
    Promise.all([
      fetch('/api/courses').then((r) => r.json()),
      fetch('/api/categories').then((r) => r.json())
    ])
      .then(([courseData, catData]) => {
        const cList: Course[] = Array.isArray(courseData) ? courseData : (courseData?.courses || []);
        const catList: { id: string; name: string; nameBn?: string }[] = Array.isArray(catData) ? catData : (catData?.categories || []);
        setCourses(cList);
        setCategories(catList);

        // Disambiguate initialCategory / initialSearch
        const incomingParam = (initialCategory || initialSearch || '').trim();
        if (incomingParam) {
          if (incomingParam.toLowerCase().startsWith('search:')) {
            setSearch(incomingParam.replace(/^search:/i, '').trim());
            setSelectedCategory('');
          } else {
            // Check if matches category slug, id, name or nameBn
            const matchedCat = catList.find(
              (c: any) =>
                c.id.toLowerCase() === incomingParam.toLowerCase() ||
                (c.slug && c.slug.toLowerCase() === incomingParam.toLowerCase()) ||
                c.name.toLowerCase() === incomingParam.toLowerCase() ||
                (c.nameBn && c.nameBn.toLowerCase() === incomingParam.toLowerCase()) ||
                c.name.toLowerCase().includes(incomingParam.toLowerCase()) ||
                incomingParam.toLowerCase().includes(c.name.toLowerCase()) ||
                (c.slug && incomingParam.toLowerCase().includes(c.slug.toLowerCase()))
            );
            if (matchedCat) {
              setSelectedCategory(matchedCat.name);
              setSearch('');
            } else {
              // check if any course has this category
              const matchCourse = cList.find(
                (c) =>
                  (c.categoryId && c.categoryId.toLowerCase() === incomingParam.toLowerCase()) ||
                  (c.categoryName && c.categoryName.toLowerCase().includes(incomingParam.toLowerCase()))
              );
              if (matchCourse) {
                setSelectedCategory(matchCourse.categoryName);
                setSearch('');
              } else {
                setSearch(incomingParam);
                setSelectedCategory('');
              }
            }
          }
        }
      })
      .catch((err) => console.error(err))
      .finally(() => setLoading(false));
  }, [initialSearch, initialCategory]);

  const handleSelectCourse = (slug: string) => {
    if (onSelectCourse) {
      onSelectCourse(slug);
    } else if (onNavigate) {
      onNavigate('course-details', slug);
    }
  };

  const handleEnrollCourse = (course: Course) => {
    if (onEnrollCourse) {
      onEnrollCourse(course);
    } else if (onNavigate) {
      onNavigate('course-details', course.slug);
    }
  };

  // Count courses per category
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    courses.forEach((c) => {
      if (c.categoryId) {
        counts[c.categoryId] = (counts[c.categoryId] || 0) + 1;
      }
      if (c.categoryName) {
        counts[c.categoryName.toLowerCase()] = (counts[c.categoryName.toLowerCase()] || 0) + 1;
      }
    });
    return counts;
  }, [courses]);

  const filteredCourses = useMemo(() => {
    return courses
      .filter((c) => {
        // Search text
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchTitle = c.title.toLowerCase().includes(q) || (c.titleBn && c.titleBn.toLowerCase().includes(q));
          const matchDesc = c.description.toLowerCase().includes(q);
          const matchInstructor = c.instructor.name.toLowerCase().includes(q);
          const matchCategory = c.categoryName.toLowerCase().includes(q);
          if (!matchTitle && !matchDesc && !matchInstructor && !matchCategory) return false;
        }

        // Category Filter with Robust Matching
        if (selectedCategory && selectedCategory !== 'ALL' && selectedCategory.trim() !== '') {
          const sel = selectedCategory.trim().toLowerCase();
          
          // 1. Direct match on categoryId or categoryName
          const isDirectMatch =
            (c.categoryId && c.categoryId.toLowerCase() === sel) ||
            (c.categoryName && c.categoryName.toLowerCase() === sel);

          if (!isDirectMatch) {
            // 2. Find selected category definition in categories list
            const matchedCat = categories.find(
              (cat: any) =>
                cat.id.toLowerCase() === sel ||
                (cat.slug && cat.slug.toLowerCase() === sel) ||
                cat.name.toLowerCase() === sel ||
                (cat.nameBn && cat.nameBn.toLowerCase() === sel)
            );

            if (matchedCat) {
              const matchById = c.categoryId && c.categoryId.toLowerCase() === matchedCat.id.toLowerCase();
              const matchByName = c.categoryName && c.categoryName.toLowerCase() === matchedCat.name.toLowerCase();
              if (!matchById && !matchByName) {
                return false;
              }
            } else {
              // 3. Normalized keyword fallback
              const normSel = sel.replace(/[^a-z0-9]/g, '');
              const normCatName = (c.categoryName || '').toLowerCase().replace(/[^a-z0-9]/g, '');
              if (!normCatName.includes(normSel) && !normSel.includes(normCatName)) {
                return false;
              }
            }
          }
        }

        // Level
        if (selectedLevel !== 'ALL') {
          if (c.level !== selectedLevel) return false;
        }

        // Price
        if (selectedPrice === 'FREE') {
          const p = c.discountPrice !== undefined ? c.discountPrice : c.price;
          if (p > 0) return false;
        } else if (selectedPrice === 'PAID') {
          const p = c.discountPrice !== undefined ? c.discountPrice : c.price;
          if (p === 0) return false;
        }

        return true;
      })
      .sort((a, b) => {
        const priceA = a.discountPrice !== undefined ? a.discountPrice : a.price;
        const priceB = b.discountPrice !== undefined ? b.discountPrice : b.price;

        if (sortBy === 'NEWEST') {
          return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
        }
        if (sortBy === 'RATING') {
          return b.rating - a.rating;
        }
        if (sortBy === 'PRICE_LOW') {
          return priceA - priceB;
        }
        if (sortBy === 'PRICE_HIGH') {
          return priceB - priceA;
        }
        // Default: Popularity (students count)
        return b.studentsCount - a.studentsCount;
      });
  }, [courses, search, selectedCategory, selectedLevel, selectedPrice, sortBy]);

  const activeFiltersCount = [
    search ? 1 : 0,
    selectedCategory && selectedCategory !== 'ALL' ? 1 : 0,
    selectedLevel !== 'ALL' ? 1 : 0,
    selectedPrice !== 'ALL' ? 1 : 0,
    sortBy !== 'POPULAR' ? 1 : 0
  ].reduce((a, b) => a + b, 0);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('');
    setSelectedLevel('ALL');
    setSelectedPrice('ALL');
    setSortBy('POPULAR');
  };

  // Reusable Sidebar Content component
  const renderSidebarFilters = (isMobile = false) => (
    <div className="space-y-6">
      {/* Sidebar Header */}
      <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
          <Filter className="w-4 h-4 text-emerald-600 dark:text-emerald-400" />
          <span>{language === 'bn' ? 'ফিল্টার অপশন' : 'Filter Options'}</span>
          {activeFiltersCount > 0 && (
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300">
              {activeFiltersCount}
            </span>
          )}
        </div>

        {activeFiltersCount > 0 && (
          <button
            onClick={handleResetFilters}
            className="flex items-center gap-1 text-xs font-semibold text-rose-600 hover:text-rose-700 dark:text-rose-400 transition-colors cursor-pointer"
            title={t('resetFilters')}
          >
            <RotateCcw className="w-3 h-3" />
            <span>{language === 'bn' ? 'রিসেট' : 'Reset'}</span>
          </button>
        )}
      </div>

      {/* 1. Search Filter */}
      <div className="space-y-2">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
          {language === 'bn' ? 'কোর্স খুঁজুন' : 'Search Courses'}
        </label>
        <div className="relative">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder={t('navSearchPlaceholder')}
            className="w-full pl-9 pr-8 py-2 text-xs rounded-xl bg-slate-50 dark:bg-slate-800/80 border border-slate-200 dark:border-slate-700 outline-none focus:border-emerald-500 text-slate-800 dark:text-slate-100 placeholder-slate-400 transition-all"
          />
          {search && (
            <button
              onClick={() => setSearch('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-0.5"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>

      {/* 2. Categories List Filter */}
      <div className="space-y-2.5">
        <div className="flex items-center justify-between">
          <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider">
            {language === 'bn' ? 'ক্যাটাগরি সমূহ' : 'Categories'}
          </label>
          <span className="text-[11px] text-slate-400">
            {categories.length + 1}
          </span>
        </div>

        <div className="space-y-1 max-h-56 overflow-y-auto pr-1">
          {/* All Categories Option */}
          <button
            onClick={() => setSelectedCategory('')}
            className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs font-medium transition-all text-left cursor-pointer ${
              !selectedCategory
                ? 'bg-emerald-600 text-white shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <BookOpen className="w-3.5 h-3.5 shrink-0 opacity-80" />
              <span className="truncate">{language === 'bn' ? 'সকল ক্যাটাগরি' : 'All Categories'}</span>
            </div>
            <span
              className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                !selectedCategory
                  ? 'bg-white/20 text-white'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
              }`}
            >
              {courses.length}
            </span>
          </button>

          {/* Dynamic Categories */}
          {categories.map((cat: any) => {
            const isSelected =
              Boolean(selectedCategory) &&
              (selectedCategory.toLowerCase() === cat.name.toLowerCase() ||
                selectedCategory.toLowerCase() === cat.id.toLowerCase() ||
                Boolean(cat.slug && selectedCategory.toLowerCase() === cat.slug.toLowerCase()) ||
                Boolean(cat.nameBn && selectedCategory.toLowerCase() === cat.nameBn.toLowerCase()));
            const count =
              categoryCounts[cat.id] ||
              categoryCounts[cat.name.toLowerCase()] ||
              courses.filter(
                (c) =>
                  (c.categoryId && c.categoryId.toLowerCase() === cat.id.toLowerCase()) ||
                  c.categoryName.toLowerCase() === cat.name.toLowerCase()
              ).length;
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(isSelected ? '' : cat.name)}
                className={`w-full flex items-center justify-between px-3 py-2 rounded-xl text-xs transition-all text-left cursor-pointer ${
                  isSelected
                    ? 'bg-emerald-600 text-white shadow-xs font-bold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800'
                }`}
              >
                <div className="flex items-center gap-2 truncate">
                  <div
                    className={`w-1.5 h-1.5 rounded-full shrink-0 ${
                      isSelected ? 'bg-white' : 'bg-emerald-500'
                    }`}
                  />
                  <span className="truncate">
                    {language === 'bn' && cat.nameBn ? cat.nameBn : cat.name}
                  </span>
                </div>
                <span
                  className={`text-[10px] px-2 py-0.5 rounded-full font-mono ${
                    isSelected
                      ? 'bg-white/20 text-white'
                      : 'bg-slate-100 dark:bg-slate-800 text-slate-500'
                  }`}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 3. Course Level Filter */}
      <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
          {language === 'bn' ? 'কোর্স লেভেল' : 'Course Level'}
        </label>
        <div className="space-y-1">
          {[
            { id: 'ALL', label: language === 'bn' ? 'সকল লেভেল' : 'All Levels' },
            { id: 'BEGINNER', label: language === 'bn' ? 'বিগিনার (Beginner)' : 'Beginner' },
            { id: 'INTERMEDIATE', label: language === 'bn' ? 'ইন্টারমিডিয়েট (Intermediate)' : 'Intermediate' },
            { id: 'ADVANCED', label: language === 'bn' ? 'অ্যাডভান্সড (Advanced)' : 'Advanced' }
          ].map((lvl) => {
            const isChecked = selectedLevel === lvl.id;
            return (
              <label
                key={lvl.id}
                onClick={() => setSelectedLevel(lvl.id)}
                className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-xs cursor-pointer transition-colors ${
                  isChecked
                    ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-900 dark:text-emerald-200 font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-800/60'
                }`}
              >
                <input
                  type="radio"
                  name={`level-filter-${isMobile ? 'm' : 'd'}`}
                  checked={isChecked}
                  onChange={() => setSelectedLevel(lvl.id)}
                  className="accent-emerald-600 w-3.5 h-3.5"
                />
                <span>{lvl.label}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* 4. Price Filter */}
      <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
          {language === 'bn' ? 'মূল্য ও ফি' : 'Pricing'}
        </label>
        <div className="grid grid-cols-3 gap-1.5">
          {[
            { id: 'ALL', label: language === 'bn' ? 'সকল' : 'All' },
            { id: 'PAID', label: language === 'bn' ? 'পেইড' : 'Paid' },
            { id: 'FREE', label: language === 'bn' ? 'ফ্রি' : 'Free' }
          ].map((item) => (
            <button
              key={item.id}
              type="button"
              onClick={() => setSelectedPrice(item.id)}
              className={`py-1.5 px-2 rounded-lg text-xs font-semibold text-center transition-all cursor-pointer ${
                selectedPrice === item.id
                  ? 'bg-emerald-600 text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-700'
              }`}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>

      {/* 5. Sort By Filter */}
      <div className="space-y-2 pt-3 border-t border-slate-100 dark:border-slate-800">
        <label className="text-xs font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider block">
          {language === 'bn' ? 'সাজান (Sort By)' : 'Sort By'}
        </label>
        <select
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value)}
          className="w-full px-3 py-2 text-xs font-medium rounded-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-800 dark:text-slate-200 outline-none focus:border-emerald-500 cursor-pointer"
        >
          <option value="POPULAR">{language === 'bn' ? '🔥 সবচেয়ে জনপ্রিয় (Popular)' : 'Most Popular'}</option>
          <option value="NEWEST">{language === 'bn' ? '✨ নতুন কোর্স (Newest)' : 'Newest'}</option>
          <option value="RATING">{language === 'bn' ? '⭐ সর্বোচ্চ রেটিং (Rating)' : 'Highest Rating'}</option>
          <option value="PRICE_LOW">{language === 'bn' ? '৳ ফি: কম থেকে বেশি' : 'Price: Low to High'}</option>
          <option value="PRICE_HIGH">{language === 'bn' ? '৳ ফি: বেশি থেকে কম' : 'Price: High to Low'}</option>
        </select>
      </div>
    </div>
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      
      {/* Page Title & Breadcrumb Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="space-y-1">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <span>{language === 'bn' ? 'হোম' : 'Home'}</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="text-emerald-600 font-semibold">{language === 'bn' ? 'কোর্সসমূহ' : 'Courses'}</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white tracking-tight">
            {t('coursesTitle')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 max-w-xl">
            {t('coursesSub')}
          </p>
        </div>

        {/* Mobile Filter Toggle Button (< lg screens) */}
        <div className="lg:hidden flex items-center justify-between gap-3 pt-2 sm:pt-0">
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="flex-1 sm:flex-none flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-sm transition-all cursor-pointer"
          >
            <Filter className="w-4 h-4" />
            <span>{language === 'bn' ? 'ক্যাটাগরি ও ফিল্টার অপশন' : 'Categories & Filters'}</span>
            {activeFiltersCount > 0 && (
              <span className="ml-1 w-5 h-5 rounded-full bg-white text-emerald-700 font-bold text-[10px] flex items-center justify-center">
                {activeFiltersCount}
              </span>
            )}
          </button>

          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="px-3 py-2 text-xs font-semibold rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200"
          >
            <option value="POPULAR">জনপ্রিয়</option>
            <option value="NEWEST">নতুন</option>
            <option value="RATING">রেটিং</option>
            <option value="PRICE_LOW">কম মূল্য</option>
          </select>
        </div>
      </div>

      {/* Main Two-Column Layout (Left Sidebar + Right Courses Grid) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        
        {/* ======================================================== */}
        {/* LEFT SIDEBAR: Categories & Filters (Desktop Persistent)  */}
        {/* ======================================================== */}
        <aside
          id="courses-left-sidebar"
          className="hidden lg:block w-72 xl:w-80 shrink-0 sticky top-24 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 p-5 shadow-xs transition-all"
        >
          {renderSidebarFilters(false)}
        </aside>

        {/* ======================================================== */}
        {/* RIGHT CONTENT AREA: Search Summary & Courses Grid       */}
        {/* ======================================================== */}
        <main className="flex-1 min-w-0 w-full space-y-5">
          
          {/* Top Results Bar */}
          <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex flex-wrap items-center justify-between gap-3 shadow-xs">
            <div className="flex items-center gap-2">
              <span className="font-bold text-xs sm:text-sm text-slate-900 dark:text-white">
                {language === 'bn'
                  ? `মোট ${filteredCourses.length}টি কোর্স পাওয়া গেছে`
                  : `Showing ${filteredCourses.length} courses`}
              </span>
              {selectedCategory && selectedCategory !== 'ALL' && (
                <span className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                  • {selectedCategory}
                </span>
              )}
            </div>

            {/* Active Filters Pill Badges with Clear buttons */}
            <div className="flex flex-wrap items-center gap-1.5">
              {search && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-200">
                  <Search className="w-3 h-3 text-slate-400" />
                  <span className="truncate max-w-[120px]">"{search}"</span>
                  <button onClick={() => setSearch('')} className="hover:text-rose-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedCategory && selectedCategory !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-medium">
                  <span>{selectedCategory}</span>
                  <button onClick={() => setSelectedCategory('')} className="hover:text-rose-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedLevel !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-teal-50 dark:bg-teal-950/60 text-teal-700 dark:text-teal-300 font-medium">
                  <span>{selectedLevel}</span>
                  <button onClick={() => setSelectedLevel('ALL')} className="hover:text-rose-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {selectedPrice !== 'ALL' && (
                <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs bg-amber-50 dark:bg-amber-950/60 text-amber-700 dark:text-amber-300 font-medium">
                  <span>{selectedPrice === 'FREE' ? 'ফ্রি' : 'পেইড'}</span>
                  <button onClick={() => setSelectedPrice('ALL')} className="hover:text-rose-500">
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}

              {activeFiltersCount > 0 && (
                <button
                  onClick={handleResetFilters}
                  className="text-xs text-rose-600 hover:underline font-semibold ml-1 cursor-pointer"
                >
                  {language === 'bn' ? 'ফিল্টার সাফ করুন' : 'Clear all'}
                </button>
              )}
            </div>
          </div>

          {/* Courses Grid View */}
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <div key={i} className="h-80 rounded-2xl bg-slate-100 dark:bg-slate-800 animate-pulse" />
              ))}
            </div>
          ) : filteredCourses.length === 0 ? (
            <div className="p-12 text-center bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-xs">
              <div className="w-14 h-14 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-400 mx-auto flex items-center justify-center">
                <BookOpen className="w-7 h-7" />
              </div>
              <div className="space-y-1">
                <h3 className="font-bold text-base text-slate-800 dark:text-slate-200">
                  {t('noCoursesFound')}
                </h3>
                <p className="text-xs text-slate-500 max-w-sm mx-auto">
                  {language === 'bn'
                    ? 'আপনার ফিল্টারের সাথে মিলে এমন কোনো কোর্স খুঁজে পাওয়া যায়নি। অনুগ্রহ করে ফিল্টার পরিবর্তন বা রিসেট করুন।'
                    : 'No courses match your selected filters. Please adjust your criteria or reset filters.'}
                </p>
              </div>
              <button
                onClick={handleResetFilters}
                className="px-5 py-2.5 rounded-xl bg-emerald-600 text-white text-xs font-bold hover:bg-emerald-700 transition-colors cursor-pointer"
              >
                {t('resetFilters')}
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {filteredCourses.map((course) => (
                <CourseCard
                  key={course.id}
                  course={course}
                  onSelect={handleSelectCourse}
                  onEnrollNow={handleEnrollCourse}
                />
              ))}
            </div>
          )}

        </main>
      </div>

      {/* ======================================================== */}
      {/* MOBILE FILTER DRAWER (Screens < lg)                      */}
      {/* ======================================================== */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 lg:hidden flex justify-end">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-xs transition-opacity"
            onClick={() => setMobileFilterOpen(false)}
          />

          {/* Drawer Panel */}
          <div className="relative w-full max-w-xs sm:max-w-sm h-full bg-white dark:bg-slate-900 border-l border-slate-200 dark:border-slate-800 shadow-2xl flex flex-col z-10 animate-in slide-in-from-right duration-200">
            <div className="p-4 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
              <div className="flex items-center gap-2 font-bold text-sm text-slate-900 dark:text-white">
                <Filter className="w-4 h-4 text-emerald-600" />
                <span>{language === 'bn' ? 'ক্যাটাগরি ও ফিল্টার' : 'Categories & Filters'}</span>
              </div>
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              {renderSidebarFilters(true)}
            </div>

            <div className="p-4 border-t border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-colors cursor-pointer"
              >
                {language === 'bn' ? `ফলাফল দেখুন (${filteredCourses.length}টি কোর্স)` : `View Results (${filteredCourses.length})`}
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

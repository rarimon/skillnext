import React from 'react';
import { Star, Clock, BookOpen, Users, ShoppingCart, Check } from 'lucide-react';
import { Course } from '../types';
import { useCart } from '../context/CartContext';
import { useLanguage } from '../context/LanguageContext';

interface CourseCardProps {
  course: Course;
  onSelect: (slug: string) => void;
  onEnrollNow?: (course: Course) => void;
}

export const CourseCard: React.FC<CourseCardProps> = ({ course, onSelect, onEnrollNow }) => {
  const { addToCart, isInCart } = useCart();
  const { language, t } = useLanguage();

  const isCart = isInCart(course.id);
  const currentPrice = (course.discountPrice !== undefined ? course.discountPrice : course.price) ?? 0;
  const originalPrice = course.price ?? 0;
  const hasDiscount = course.discountPrice !== undefined && course.discountPrice < (course.price ?? 0);
  const discountPercent = hasDiscount && originalPrice > 0
    ? Math.round(((originalPrice - course.discountPrice!) / originalPrice) * 100)
    : 0;

  const getLevelBadgeText = (level: string) => {
    switch (level) {
      case 'BEGINNER':
        return language === 'bn' ? 'বিগিনার' : 'Beginner';
      case 'INTERMEDIATE':
        return language === 'bn' ? 'ইন্টারমিডিয়েট' : 'Intermediate';
      case 'ADVANCED':
        return language === 'bn' ? 'অ্যাডভান্সড' : 'Advanced';
      default:
        return language === 'bn' ? 'সকল লেভেল' : 'All Levels';
    }
  };

  return (
    <div
      id={`course-card-${course.id}`}
      className="group flex flex-col justify-between bg-white dark:bg-slate-900 rounded-2xl border border-slate-200/90 dark:border-slate-800 overflow-hidden shadow-sm hover:shadow-xl hover:border-emerald-500/40 dark:hover:border-emerald-500/40 transition-all duration-300"
    >
      {/* Thumbnail Section with Badges */}
      <div
        onClick={() => onSelect(course.slug)}
        className="relative aspect-video w-full overflow-hidden cursor-pointer bg-slate-100 dark:bg-slate-800"
      >
        <img
          src={course.thumbnail}
          alt={course.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          loading="lazy"
        />

        {/* Overlay gradient */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity" />

        {/* Badges container */}
        <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
          {course.isBestseller && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500 text-white shadow-sm">
              ★ {t('bestseller')}
            </span>
          )}
          {course.isFeatured && !course.isBestseller && (
            <span className="px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-600 text-white shadow-sm">
              {t('featured')}
            </span>
          )}
          <span className="px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-slate-900/80 backdrop-blur-md text-white border border-white/10">
            {getLevelBadgeText(course.level)}
          </span>
        </div>

        {hasDiscount && (
          <div className="absolute top-3 right-3 z-10">
            <span className="px-2 py-0.5 rounded-full text-[11px] font-extrabold bg-rose-600 text-white shadow-sm">
              {discountPercent}% {t('off')}
            </span>
          </div>
        )}
      </div>

      {/* Body Content */}
      <div className="p-5 flex flex-col flex-1">
        
        {/* Category & Rating */}
        <div className="flex items-center justify-between gap-2 text-xs mb-2">
          <span className="text-emerald-700 dark:text-emerald-400 font-semibold px-2 py-0.5 rounded bg-emerald-50 dark:bg-emerald-950/60 truncate max-w-[170px]">
            {course.categoryName}
          </span>
          <div className="flex items-center gap-1 text-amber-500 font-bold shrink-0">
            <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
            <span>{course.rating.toFixed(1)}</span>
            <span className="text-slate-400 font-normal text-[11px]">({course.reviewsCount})</span>
          </div>
        </div>

        {/* Title */}
        <h3
          onClick={() => onSelect(course.slug)}
          className="font-bold text-base text-slate-900 dark:text-white line-clamp-2 cursor-pointer hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors mb-2"
        >
          {language === 'bn' && course.titleBn ? course.titleBn : course.title}
        </h3>

        {/* Instructor */}
        <div className="flex items-center gap-2 mb-4 text-xs text-slate-600 dark:text-slate-300">
          <img
            src={course.instructor.avatar}
            alt={course.instructor.name}
            className="w-5 h-5 rounded-full object-cover"
          />
          <span className="truncate">{course.instructor.name}</span>
        </div>

        {/* Meta Stats: Hours, Lessons, Students */}
        <div className="grid grid-cols-3 gap-2 py-2.5 px-3 rounded-xl bg-slate-50 dark:bg-slate-800/60 border border-slate-100 dark:border-slate-800 text-[11px] text-slate-600 dark:text-slate-400 mb-4 mt-auto">
          <div className="flex items-center gap-1.5 justify-center">
            <Clock className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 shrink-0" />
            <span>{course.durationHours} {t('hours')}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center border-x border-slate-200 dark:border-slate-700">
            <BookOpen className="w-3.5 h-3.5 text-teal-600 dark:text-teal-400 shrink-0" />
            <span>{course.lessonsCount} {t('lessons')}</span>
          </div>
          <div className="flex items-center gap-1.5 justify-center">
            <Users className="w-3.5 h-3.5 text-indigo-600 dark:text-indigo-400 shrink-0" />
            <span>{course.studentsCount}</span>
          </div>
        </div>

        {/* Pricing & Actions */}
        <div className="pt-2 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between gap-3">
          <div className="flex flex-col">
            <div className="flex items-baseline gap-1.5">
              <span className="text-xl font-extrabold text-slate-900 dark:text-white">
                ৳{(currentPrice ?? 0).toLocaleString()}
              </span>
              {hasDiscount && (
                <span className="text-xs text-slate-400 line-through">
                  ৳{(originalPrice ?? 0).toLocaleString()}
                </span>
              )}
            </div>
          </div>

          <div className="flex items-center gap-1.5">
            <button
              id={`cart-btn-${course.id}`}
              onClick={() => addToCart(course)}
              className={`p-2 rounded-xl border text-sm font-semibold transition-all ${
                isCart
                  ? 'bg-emerald-50 border-emerald-300 text-emerald-700 dark:bg-emerald-950/60 dark:border-emerald-800 dark:text-emerald-300'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200'
              }`}
              title={isCart ? t('inCart') : t('addToCart')}
            >
              {isCart ? <Check className="w-4 h-4 text-emerald-600" /> : <ShoppingCart className="w-4 h-4" />}
            </button>

            <button
              id={`enroll-btn-${course.id}`}
              onClick={() => {
                if (onEnrollNow) onEnrollNow(course);
                else onSelect(course.slug);
              }}
              className="px-3.5 py-2 rounded-xl text-xs font-bold bg-emerald-600 hover:bg-emerald-700 text-white shadow-sm transition-all shrink-0"
            >
              {t('enrollNow')}
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};

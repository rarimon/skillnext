import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider, useCart } from './context/CartContext';
import { LanguageProvider, useLanguage } from './context/LanguageContext';
import { ThemeProvider } from './context/ThemeContext';
import { ToastProvider, useToast } from './context/ToastContext';
import { WebsiteContentProvider } from './context/WebsiteContentContext';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { CartDrawer } from './components/CartDrawer';
import { PaymentModal } from './components/PaymentModal';
import { AuthModal } from './components/AuthModal';
import { MobileBottomNav } from './components/MobileBottomNav';
import { TopPromoAdsBanner } from './components/TopPromoAdsBanner';
import { PromoAdsPopupModal } from './components/PromoAdsPopupModal';
import { TopProgressBar } from './components/TopProgressBar';
import { LiveChatWidget } from './components/LiveChatWidget';
import { LiveSalesNotificationToast } from './components/LiveSalesNotificationToast';

import { HomePage } from './pages/HomePage';
import { CoursesPage } from './pages/CoursesPage';
import { CourseDetailsPage } from './pages/CourseDetailsPage';
import { LearningPlayerPage } from './pages/LearningPlayerPage';
import { StudentDashboardPage } from './pages/StudentDashboardPage';
import { TeacherDashboardPage } from './pages/TeacherDashboardPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';
import { CertificateVerifyPage } from './pages/CertificateVerifyPage';
import { BlogPage } from './pages/BlogPage';
import { AuthPage } from './pages/AuthPage';
import { CartPage } from './pages/CartPage';
import { CheckoutPage } from './pages/CheckoutPage';
import { MentorsPage } from './pages/MentorsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { AboutUsPage } from './pages/AboutUsPage';
import { ContactPage } from './pages/ContactPage';

import { Course } from './types';

function MainApp() {
  const { user, token } = useAuth();
  const { cart, total: cartTotal, clearCart, isCartOpen, setIsCartOpen } = useCart();
  const { language, t } = useLanguage();
  const { success: toastSuccess, error: toastError } = useToast();

  // Navigation & Page Loading Progress State
  const [currentRoute, setCurrentRoute] = useState<string>('home');
  const [routeParam, setRouteParam] = useState<string>('');
  const [pageProgress, setPageProgress] = useState<number>(0);
  const [isPageLoading, setIsPageLoading] = useState<boolean>(false);

  // Modals
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'register'>('login');

  // Payment Modal State
  const [isPaymentOpen, setIsPaymentOpen] = useState(false);
  const [checkoutItems, setCheckoutItems] = useState<Array<{ courseId: string; courseTitle: string; price: number }>>([]);
  const [checkoutTotal, setCheckoutTotal] = useState(0);

  // Trigger top progress bar during route changes
  const navigate = (route: string, param: string = '') => {
    // If navigating to the same route and param, just scroll top
    if (route === currentRoute && param === routeParam) {
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }

    // Start progress bar immediately
    setIsPageLoading(true);
    setPageProgress(25);

    // Progressive rapid ticks
    const t1 = setTimeout(() => setPageProgress(60), 60);
    const t2 = setTimeout(() => setPageProgress(85), 150);

    const t3 = setTimeout(() => {
      setCurrentRoute(route);
      setRouteParam(param);
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setPageProgress(100);
    }, 220);

    const t4 = setTimeout(() => {
      setIsPageLoading(false);
      setPageProgress(0);
    }, 450);

    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
      clearTimeout(t3);
      clearTimeout(t4);
    };
  };

  // Direct Course Enrollment / Buy Now handler
  const handleEnrollCourse = (course: Course) => {
    const price = course.discountPrice !== undefined ? course.discountPrice : course.price;
    setCheckoutItems([
      {
        courseId: course.id,
        courseTitle: course.title,
        price,
        course
      } as any
    ]);
    setCheckoutTotal(price);
    navigate('checkout');
  };

  // Cart Drawer & Cart Page Checkout handler
  const handleCartCheckout = (totalWithDiscount?: number) => {
    setIsCartOpen(false);
    if (!cart || cart.length === 0) {
      toastError(language === 'bn' ? 'আপনার কার্ট খালি!' : 'Your cart is empty!');
      return;
    }
    setCheckoutItems(
      cart.map((item) => ({
        courseId: item.id,
        courseTitle: item.title,
        price: item.discountPrice !== undefined ? item.discountPrice : item.price,
        course: item
      }))
    );
    setCheckoutTotal(typeof totalWithDiscount === 'number' ? totalWithDiscount : cartTotal);
    navigate('checkout');
  };

  // Payment Completed Callback
  const handlePaymentSuccess = (order: any) => {
    setIsPaymentOpen(false);
    clearCart();
    confetti({ particleCount: 120, spread: 80, origin: { y: 0.6 } });
    toastSuccess(language === 'bn' ? 'পেমেন্ট সফল হয়েছে! কোর্সে স্বাগতম।' : 'Payment successful! Welcome to the course.');

    // If order has an enrolled course, navigate to learn or dashboard
    if (order.items && order.items.length === 1) {
      // Find course slug if possible
      fetch(`/api/courses/${order.items[0].courseId}`)
        .then((r) => r.json())
        .then((d) => {
          if (d.course?.slug) {
            navigate('learn', d.course.slug);
          } else {
            navigate('student-dashboard');
          }
        })
        .catch(() => navigate('student-dashboard'));
    } else {
      navigate('student-dashboard');
    }
  };

  // Render Current Page
  const renderPage = () => {
    switch (currentRoute) {
      case 'home':
        return (
          <HomePage
            onNavigate={navigate}
            onEnrollCourse={handleEnrollCourse}
          />
        );

      case 'courses':
        return (
          <CoursesPage
            initialSearch={routeParam}
            initialCategory={routeParam}
            onNavigate={navigate}
            onEnrollCourse={handleEnrollCourse}
          />
        );

      case 'course-details':
        return (
          <CourseDetailsPage
            courseSlug={routeParam}
            onNavigate={navigate}
            onEnrollCourse={handleEnrollCourse}
          />
        );

      case 'learn':
        return (
          <LearningPlayerPage
            courseSlug={routeParam}
            onNavigate={navigate}
          />
        );

      case 'student-dashboard':
        return (
          <StudentDashboardPage
            initialTab={routeParam || 'courses'}
            onNavigate={navigate}
          />
        );

      case 'teacher-dashboard':
        return (
          <TeacherDashboardPage
            onNavigateToCourse={(slug) => navigate('course-details', slug)}
          />
        );

      case 'admin':
        return (
          <AdminDashboardPage
            onNavigate={navigate}
          />
        );

      case 'verify-cert':
        return (
          <CertificateVerifyPage
            initialCertId={routeParam}
            onNavigate={navigate}
          />
        );

      case 'blog':
        return <BlogPage />;

      case 'login':
        return (
          <AuthPage
            initialMode="login"
            onNavigate={navigate}
          />
        );

      case 'register':
        return (
          <AuthPage
            initialMode="register"
            onNavigate={navigate}
          />
        );

      case 'cart':
        return (
          <CartPage
            onNavigate={navigate}
            onCheckout={() => navigate('checkout')}
          />
        );

      case 'checkout':
        return (
          <CheckoutPage
            onNavigate={navigate}
            directItems={checkoutItems as any}
          />
        );

      case 'mentors':
      case 'instructors':
        return (
          <MentorsPage
            onNavigate={navigate}
            onEnrollCourse={handleEnrollCourse}
          />
        );

      case 'categories':
        return (
          <CategoriesPage
            onNavigate={navigate}
          />
        );

      case 'about':
      case 'about-us':
        return (
          <AboutUsPage
            onNavigate={navigate}
          />
        );

      case 'contact':
      case 'contact-us':
        return (
          <ContactPage
            onNavigate={navigate}
          />
        );

      default:
        return (
          <HomePage
            onNavigate={navigate}
            onEnrollCourse={handleEnrollCourse}
          />
        );
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-slate-50 dark:bg-slate-950 text-slate-900 dark:text-slate-100 font-sans selection:bg-emerald-500 selection:text-white">
      
      {/* Top Loading Progress Bar */}
      <TopProgressBar progress={pageProgress} isVisible={isPageLoading} />

      {/* Top Promotional Ads Banner (Closable with X) - only on public website */}
      {currentRoute !== 'admin' && <TopPromoAdsBanner onNavigate={navigate} />}

      {/* Website Entry Popup Ads Modal - only on public website */}
      {currentRoute !== 'admin' && <PromoAdsPopupModal onNavigate={navigate} />}

      {/* Global Public Navbar - hidden on admin dashboard */}
      {currentRoute !== 'admin' && (
        <Navbar
          currentRoute={currentRoute}
          onNavigate={navigate}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenAuth={(mode) => {
            setAuthMode(mode || 'login');
            setIsAuthModalOpen(true);
          }}
        />
      )}

      {/* Main Content View */}
      <main className={`flex-1 ${currentRoute !== 'learn' && currentRoute !== 'admin' ? 'pb-16 md:pb-0' : ''}`}>
        {renderPage()}
      </main>

      {/* Global Footer (hidden on learning player and admin dashboard for clean full-screen layout) */}
      {currentRoute !== 'learn' && currentRoute !== 'admin' && (
        <Footer onNavigate={navigate} />
      )}

      {/* Mobile Bottom Navigation Bar (Screens < md, hidden on admin & player) */}
      {currentRoute !== 'learn' && currentRoute !== 'admin' && (
        <MobileBottomNav
          currentRoute={currentRoute}
          onNavigate={navigate}
          onOpenCart={() => setIsCartOpen(true)}
          onOpenAuth={(mode) => {
            setAuthMode(mode || 'login');
            setIsAuthModalOpen(true);
          }}
        />
      )}

      {/* Cart Drawer */}
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        onCheckout={handleCartCheckout}
        onNavigate={navigate}
        onNavigateCourses={() => navigate('courses')}
        onNavigateCheckout={handleCartCheckout}
      />

      {/* Payment Gateway Sandbox Modal */}
      <PaymentModal
        isOpen={isPaymentOpen}
        onClose={() => setIsPaymentOpen(false)}
        items={checkoutItems}
        totalAmount={checkoutTotal}
        onSuccess={handlePaymentSuccess}
      />

      {/* Authentication Modal */}
      <AuthModal
        isOpen={isAuthModalOpen}
        initialMode={authMode}
        onClose={() => setIsAuthModalOpen(false)}
      />

      {/* Floating Animated Live Chat Widget (Visible across public site, hidden on admin and player) */}
      {currentRoute !== 'learn' && currentRoute !== 'admin' && (
        <LiveChatWidget currentUser={user} />
      )}

      {/* Live Sales & Enrollment Social Proof Toast (Public website, hidden on admin and player) */}
      {currentRoute !== 'learn' && currentRoute !== 'admin' && (
        <LiveSalesNotificationToast onNavigate={navigate} />
      )}

    </div>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ToastProvider>
          <AuthProvider>
            <CartProvider>
              <WebsiteContentProvider>
                <MainApp />
              </WebsiteContentProvider>
            </CartProvider>
          </AuthProvider>
        </ToastProvider>
      </LanguageProvider>
    </ThemeProvider>
  );
}

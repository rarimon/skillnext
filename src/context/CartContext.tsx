import React, { createContext, useContext, useState, useEffect } from 'react';
import { Course, Coupon } from '../types';
import { useToast } from './ToastContext';

interface CartContextType {
  cart: Course[];
  items: Course[];
  addToCart: (course: Course) => void;
  removeFromCart: (courseId: string) => void;
  clearCart: () => void;
  isInCart: (courseId: string) => boolean;
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  coupon: Coupon | null;
  discountAmount: number;
  subtotal: number;
  total: number;
  cartTotal: number;
  applyCouponCode: (code: string) => Promise<boolean>;
  removeCoupon: () => void;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const CartProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [cart, setCart] = useState<Course[]>(() => {
    try {
      const saved = localStorage.getItem('skillnest_cart');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [coupon, setCoupon] = useState<Coupon | null>(null);
  const [discountAmount, setDiscountAmount] = useState<number>(0);
  const { success, error } = useToast();

  useEffect(() => {
    localStorage.setItem('skillnest_cart', JSON.stringify(cart));
  }, [cart]);

  const subtotal = cart.reduce((sum, item) => {
    const price = item.discountPrice !== undefined ? item.discountPrice : item.price;
    return sum + price;
  }, 0);

  // Recalculate discount whenever subtotal or coupon changes
  useEffect(() => {
    if (!coupon) {
      setDiscountAmount(0);
      return;
    }
    if (subtotal < coupon.minOrderAmount) {
      setCoupon(null);
      setDiscountAmount(0);
      return;
    }
    let d = 0;
    if (coupon.discountType === 'PERCENTAGE') {
      d = Math.round((subtotal * coupon.discountValue) / 100);
      if (coupon.maxDiscountAmount && d > coupon.maxDiscountAmount) {
        d = coupon.maxDiscountAmount;
      }
    } else {
      d = coupon.discountValue;
    }
    setDiscountAmount(d);
  }, [subtotal, coupon]);

  const total = Math.max(0, subtotal - discountAmount);

  const addToCart = (course: Course) => {
    if (cart.some((c) => c.id === course.id)) {
      setIsCartOpen(true);
      return;
    }
    setCart((prev) => [...prev, course]);
    success(`"${course.title}" কার্টে যোগ করা হয়েছে`);
    setIsCartOpen(true);
  };

  const removeFromCart = (courseId: string) => {
    setCart((prev) => prev.filter((c) => c.id !== courseId));
  };

  const clearCart = () => {
    setCart([]);
    setCoupon(null);
    setDiscountAmount(0);
    localStorage.removeItem('skillnest_cart');
  };

  const isInCart = (courseId: string) => {
    return cart.some((c) => c.id === courseId);
  };

  const applyCouponCode = async (code: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/coupons/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ code, cartTotal: subtotal })
      });
      const data = await res.json();
      if (!res.ok) {
        error(data.error || 'কুপন প্রয়োগ ব্যর্থ হয়েছে');
        return false;
      }
      setCoupon(data.coupon);
      setDiscountAmount(data.discountAmount);
      success(`কুপন "${code.toUpperCase()}" প্রয়োগ হয়েছে! ৳${data.discountAmount} ছাড়`);
      return true;
    } catch {
      error('কুপন যাচাই করতে ব্যর্থ হয়েছে');
      return false;
    }
  };

  const removeCoupon = () => {
    setCoupon(null);
    setDiscountAmount(0);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        items: cart,
        addToCart,
        removeFromCart,
        clearCart,
        isInCart,
        isCartOpen,
        setIsCartOpen,
        coupon,
        discountAmount,
        subtotal,
        total,
        cartTotal: total,
        applyCouponCode,
        removeCoupon
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error('useCart must be used within CartProvider');
  return ctx;
};

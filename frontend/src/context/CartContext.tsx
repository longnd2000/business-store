import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Product, CartItem } from '../types';

interface CartContextType {
  cart: CartItem[];
  addToCart: (product: Product, quantity?: number) => void;
  removeFromCart: (productId: number) => void;
  updateQuantity: (productId: number, quantity: number) => void;
  clearCart: () => void;
  cartCount: number;
  cartTotal: number;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

interface CartProviderProps {
  children: ReactNode;
}

export const CartProvider: React.FC<CartProviderProps> = ({ children }) => {
  const [cart, setCart] = useState<CartItem[]>(() => {
    const localData = localStorage.getItem('business_store_cart');
    return localData ? JSON.parse(localData) : [];
  });

  // 1. Cập nhật localStorage ngay lập tức để bảo toàn dữ liệu giao diện
  useEffect(() => {
    localStorage.setItem('business_store_cart', JSON.stringify(cart));
  }, [cart]);

  // 2. Đồng bộ giỏ hàng lên Server sử dụng cơ chế Debounce của Event Loop
  useEffect(() => {
    // Không cần sync nếu giỏ hàng trống rỗng lúc khởi chạy
    if (cart.length === 0) return;

    // Lập lịch gửi API sau 1 giây (Macrotask)
    const timer = setTimeout(async () => {
      try {
        console.log('🚀 [Event Loop] Đang đồng bộ giỏ hàng lên Server (Debounced):', cart);
        // Để gửi thực tế lên Laravel backend, hãy import api từ '../services/api' và chạy:
        // const payload = cart.map(item => ({ product_id: item.product.id, quantity: item.quantity }));
        // await api.post('/cart/sync', { items: payload });
      } catch (error) {
        console.error('Lỗi đồng bộ giỏ hàng lên server:', error);
      }
    }, 1000); // 1000ms trì hoãn

    // Hủy timer cũ nếu người dùng nhấn nút tăng/giảm tiếp trong vòng 1 giây
    return () => clearTimeout(timer);
  }, [cart]);

  const addToCart = (product: Product, quantity = 1) => {
    setCart((prevCart) => {
      const existingItem = prevCart.find((item) => item.product.id === product.id);
      if (existingItem) {
        const newQty = Math.min(existingItem.quantity + quantity, product.stock);
        return prevCart.map((item) =>
          item.product.id === product.id ? { ...item, quantity: newQty } : item
        );
      }
      return [...prevCart, { product, quantity: Math.min(quantity, product.stock) }];
    });
  };

  const removeFromCart = (productId: number) => {
    setCart((prevCart) => prevCart.filter((item) => item.product.id !== productId));
  };

  const updateQuantity = (productId: number, quantity: number) => {
    if (quantity <= 0) {
      removeFromCart(productId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) => {
        if (item.product.id === productId) {
          const maxStock = item.product.stock;
          return { ...item, quantity: Math.min(quantity, maxStock) };
        }
        return item;
      })
    );
  };

  const clearCart = () => {
    setCart([]);
  };

  const cartCount = cart.reduce((total, item) => total + item.quantity, 0);
  const cartTotal = cart.reduce((total, item) => total + item.product.price * item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartCount,
        cartTotal,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};

"use client";

import {
  createContext,
  useContext,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import type { Product, CartItem } from "@/types";

interface CartContextType {
  items: CartItem[];
  addItem: (product: Product, qty?: number, customizations?: Record<string, string>) => void;
  removeItem: (productId: string) => void;
  updateQuantity: (productId: string, qty: number) => void;
  setArtwork: (productId: string, url: string) => void;
  clearCart: () => void;
  totalItems: number;
  totalInCents: number;
  hasServiceItems: boolean;
}

const CartContext = createContext<CartContextType | undefined>(undefined);

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);

  const addItem = useCallback((product: Product, qty = 1, customizations?: Record<string, string>) => {
    setItems((prev) => {
      const existing = prev.find((i) => i.product.id === product.id);
      if (existing) {
        const merged = {
          ...existing.customizations,
          ...customizations,
        };
        if (Object.keys(merged).length === 0) {
          return prev.map((i) =>
            i.product.id === product.id ? { ...i, quantity: i.quantity + qty } : i
          );
        }
      }
      return [...prev, { product, quantity: qty, customizations }];
    });
  }, []);

  const removeItem = useCallback((productId: string) => {
    setItems((prev) => prev.filter((i) => i.product.id !== productId));
  }, []);

  const updateQuantity = useCallback((productId: string, qty: number) => {
    setItems((prev) =>
      qty <= 0
        ? prev.filter((i) => i.product.id !== productId)
        : prev.map((i) =>
            i.product.id === productId ? { ...i, quantity: qty } : i
          )
    );
  }, []);

  const setArtwork = useCallback((productId: string, url: string) => {
    setItems((prev) =>
      prev.map((i) =>
        i.product.id === productId ? { ...i, artworkUrl: url } : i
      )
    );
  }, []);

  const clearCart = useCallback(() => setItems([]), []);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const totalInCents = items.reduce(
    (sum, i) => sum + i.product.priceInCents * i.quantity,
    0
  );
  const hasServiceItems = items.some((i) => i.product.isService);

  return (
    <CartContext.Provider
      value={{
        items,
        addItem,
        removeItem,
        updateQuantity,
        setArtwork,
        clearCart,
        totalItems,
        totalInCents,
        hasServiceItems,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart deve estar dentro de CartProvider");
  return ctx;
}

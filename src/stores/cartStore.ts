import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface CartItem {
  id: string;
  name: string;
  price: number;
  planType: "monthly" | "yearly";
}

interface CartState {
  items: CartItem[];
  discountCode: string | null;
  discountAmount: number;
  checkoutStep: "cart" | "payment" | "confirmation";
  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  clearCart: () => void;
  applyDiscount: (code: string) => boolean;
  setCheckoutStep: (step: "cart" | "payment" | "confirmation") => void;
  getTotal: () => number;
}

const PROMO_CODES: Record<string, number> = {
  SAVE200: 4.0,
  WELCOME50: 2.0,
  LAUNCH: 3.0,
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      discountCode: null,
      discountAmount: 0,
      checkoutStep: "cart",
      addItem: (item) =>
        set((state) => ({
          items: state.items.some((i) => i.id === item.id)
            ? state.items.map((i) => (i.id === item.id ? item : i))
            : [...state.items, item],
        })),
      removeItem: (id) =>
        set((state) => ({ items: state.items.filter((i) => i.id !== id) })),
      clearCart: () =>
        set({ items: [], discountCode: null, discountAmount: 0, checkoutStep: "cart" }),
      applyDiscount: (code) => {
        const discount = PROMO_CODES[code.toUpperCase()];
        if (discount) {
          set({ discountCode: code.toUpperCase(), discountAmount: discount });
          return true;
        }
        return false;
      },
      setCheckoutStep: (step) => set({ checkoutStep: step }),
      getTotal: () => {
        const state = get();
        const subtotal = state.items.reduce((sum, item) => sum + item.price, 0);
        return Math.max(0, subtotal - state.discountAmount);
      },
    }),
    {
      name: "cart-storage",
      storage: createJSONStorage(() => sessionStorage),
    }
  )
);

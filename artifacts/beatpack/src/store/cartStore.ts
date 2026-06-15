import { create } from "zustand";
import { persist } from "zustand/middleware";

export type LicenseType = "basic" | "premium" | "exclusive";

export interface CartItem {
  beatId: string;
  beatTitle: string;
  artistName: string | null;
  artistSlug: string | null;
  coverUrl: string | null;
  license: LicenseType;
  price: number;
}

interface CartState {
  items: CartItem[];
  addItem: (item: CartItem) => void;
  removeItem: (beatId: string, license: string) => void;
  updateLicense: (beatId: string, license: LicenseType, price: number) => void;
  clear: () => void;
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      addItem: (item) =>
        set((s) => ({
          items: [
            ...s.items.filter(
              (i) => !(i.beatId === item.beatId)
            ),
            item,
          ],
        })),
      removeItem: (beatId) =>
        set((s) => ({
          items: s.items.filter((i) => i.beatId !== beatId),
        })),
      updateLicense: (beatId, license, price) =>
        set((s) => ({
          items: s.items.map((i) =>
            i.beatId === beatId ? { ...i, license, price } : i
          ),
        })),
      clear: () => set({ items: [] }),
    }),
    { name: "beatpack-cart" }
  )
);

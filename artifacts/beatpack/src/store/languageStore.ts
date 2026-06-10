import { create } from "zustand";
import { persist } from "zustand/middleware";

export type Lang = "en" | "cs";

interface LanguageStore {
  lang: Lang;
  toggle: () => void;
  setLang: (lang: Lang) => void;
}

export const useLanguageStore = create<LanguageStore>()(
  persist(
    (set, get) => ({
      lang: "cs",
      toggle: () => set({ lang: get().lang === "en" ? "cs" : "en" }),
      setLang: (lang) => set({ lang }),
    }),
    { name: "beatpack-lang" }
  )
);

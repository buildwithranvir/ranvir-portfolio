"use client";

import { createContext, useCallback, useContext, useMemo, useState, type ReactNode } from "react";
import type { Product, collections } from "@/lib/content";

type Filter = (typeof collections)[number];

type Shop = {
  filter: Filter;
  setFilter: (f: Filter) => void;
  quickView: Product | null;
  openQuickView: (p: Product) => void;
  closeQuickView: () => void;
};

const ShopContext = createContext<Shop | null>(null);

/** Shares the active collection filter and the quick-view product across sections. */
export function ShopProvider({ children }: { children: ReactNode }) {
  const [filter, setFilter] = useState<Filter>("All");
  const [quickView, setQuickView] = useState<Product | null>(null);
  const closeQuickView = useCallback(() => setQuickView(null), []);
  const value = useMemo(
    () => ({ filter, setFilter, quickView, openQuickView: setQuickView, closeQuickView }),
    [filter, quickView, closeQuickView],
  );
  return (
    <ShopContext.Provider value={value}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error("useShop must be used inside <ShopProvider>");
  return ctx;
}

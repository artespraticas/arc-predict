"use client";

import { useState } from "react";
import { Header } from "@/components/Header";
import { HeroStats } from "@/components/HeroStats";
import { MarketGrid } from "@/components/MarketGrid";
import { CreateMarketModal } from "@/components/CreateMarketModal";
import { CATEGORIES } from "@/lib/contract";

export default function Home() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [showCreate, setShowCreate] = useState(false);

  return (
    <div className="min-h-screen bg-arc-bg bg-grid noise">
      {/* Radial glow top */}
      <div className="fixed top-0 left-1/2 -translate-x-1/2 w-[800px] h-[400px] bg-arc-accent/5 rounded-full blur-[120px] pointer-events-none" />

      <Header onCreateMarket={() => setShowCreate(true)} />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8 pb-24">
        {/* Hero */}
        <div className="mb-12">
          <div className="flex items-end gap-4 mb-3">
            <h1 className="font-display text-7xl sm:text-8xl text-white leading-none tracking-wide">
              ARC<span className="text-arc-accent">PREDICT</span>
            </h1>
          </div>
          <p className="text-arc-muted text-lg max-w-xl font-body">
            Bet on financial outcomes — ECB rates, FX, crypto — with instant USDC settlement on Arc&apos;s 1-second finality chain.
          </p>
        </div>

        <HeroStats />

        {/* Category Filter */}
        <div className="flex gap-2 mt-10 mb-8 overflow-x-auto pb-2 scrollbar-hide">
          {CATEGORIES.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategory(cat.id)}
              className={`flex items-center gap-2 px-4 py-2 rounded-sm border text-sm font-body font-medium whitespace-nowrap transition-all duration-150 ${
                activeCategory === cat.id
                  ? "bg-arc-accent/10 border-arc-accent/50 text-arc-accent"
                  : "bg-arc-surface border-arc-border text-arc-muted hover:border-arc-accent/30 hover:text-arc-text"
              }`}
            >
              <span>{cat.icon}</span>
              {cat.label}
            </button>
          ))}
        </div>

        <MarketGrid activeCategory={activeCategory} />
      </main>

      {showCreate && (
        <CreateMarketModal onClose={() => setShowCreate(false)} />
      )}
    </div>
  );
}

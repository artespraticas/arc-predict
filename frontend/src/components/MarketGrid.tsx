"use client";

import { useState } from "react";
import { DEMO_MARKETS } from "@/lib/contract";
import { MarketCard } from "./MarketCard";
import { BetModal } from "./BetModal";

interface MarketGridProps {
  activeCategory: string;
}

export function MarketGrid({ activeCategory }: MarketGridProps) {
  const [selectedMarket, setSelectedMarket] = useState<
    (typeof DEMO_MARKETS)[0] | null
  >(null);

  const filtered =
    activeCategory === "all"
      ? DEMO_MARKETS
      : DEMO_MARKETS.filter((m) => m.category === activeCategory);

  return (
    <>
      {filtered.length === 0 ? (
        <div className="text-center py-20 text-arc-muted">
          <div className="text-4xl mb-3">📭</div>
          <p>No markets in this category yet.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
          {filtered.map((market) => (
            <MarketCard
              key={market.id.toString()}
              market={market}
              onBet={() => setSelectedMarket(market)}
            />
          ))}
        </div>
      )}

      {selectedMarket && (
        <BetModal
          market={selectedMarket}
          onClose={() => setSelectedMarket(null)}
        />
      )}
    </>
  );
}

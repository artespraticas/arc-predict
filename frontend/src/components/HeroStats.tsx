"use client";

import { DEMO_MARKETS } from "@/lib/contract";

function formatUSDC(amount: bigint): string {
  const num = Number(amount) / 1_000_000;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
  return `$${num.toFixed(0)}`;
}

export function HeroStats() {
  const totalVolume = DEMO_MARKETS.reduce(
    (acc, m) => acc + m.totalYes + m.totalNo,
    0n
  );
  const openMarkets = DEMO_MARKETS.filter((m) => m.status === 0).length;
  const totalBettors = 347; // demo

  const stats = [
    { label: "Total Volume", value: formatUSDC(totalVolume), accent: "text-arc-accent" },
    { label: "Open Markets", value: openMarkets.toString(), accent: "text-arc-gold" },
    { label: "Total Bettors", value: totalBettors.toLocaleString(), accent: "text-arc-green" },
    { label: "Settlement", value: "< 1s", accent: "text-arc-accent" },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {stats.map((s) => (
        <div
          key={s.label}
          className="bg-arc-surface border border-arc-border rounded-sm p-4"
        >
          <div className={`font-mono text-2xl font-medium ${s.accent}`}>
            {s.value}
          </div>
          <div className="text-arc-muted text-xs mt-1 font-body">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

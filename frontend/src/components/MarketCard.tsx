"use client";

import { Clock, TrendingUp, Users } from "lucide-react";
import { formatDistanceToNow } from "date-fns";
import { DEMO_MARKETS } from "@/lib/contract";

const CATEGORY_COLORS: Record<string, string> = {
  "Central Banks": "text-arc-gold border-arc-gold/30 bg-arc-gold/5",
  FX: "text-arc-accent border-arc-accent/30 bg-arc-accent/5",
  Crypto: "text-arc-green border-arc-green/30 bg-arc-green/5",
  Equities: "text-purple-400 border-purple-400/30 bg-purple-400/5",
  Macro: "text-orange-400 border-orange-400/30 bg-orange-400/5",
};

interface MarketCardProps {
  market: (typeof DEMO_MARKETS)[0];
  onBet: () => void;
}

function formatUSDC(amount: bigint): string {
  const num = Number(amount) / 1_000_000;
  if (num >= 1_000_000) return `$${(num / 1_000_000).toFixed(1)}M`;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
  return `$${num.toFixed(0)}`;
}

export function MarketCard({ market, onBet }: MarketCardProps) {
  const total = market.totalYes + market.totalNo;
  const yesPct =
    total === 0n ? 50 : Math.round((Number(market.totalYes) / Number(total)) * 100);
  const noPct = 100 - yesPct;

  const deadline = new Date(Number(market.deadline) * 1000);
  const timeLeft = formatDistanceToNow(deadline, { addSuffix: true });

  const catColor =
    CATEGORY_COLORS[market.category] ||
    "text-arc-muted border-arc-border bg-arc-surface";

  return (
    <div className="market-card bg-arc-surface border border-arc-border rounded-sm p-5 flex flex-col gap-4 cursor-pointer group">
      {/* Category + timer */}
      <div className="flex items-center justify-between">
        <span
          className={`text-xs font-mono px-2 py-0.5 rounded-sm border ${catColor}`}
        >
          {market.category}
        </span>
        <span className="flex items-center gap-1 text-xs text-arc-muted font-mono">
          <Clock className="w-3 h-3" />
          {timeLeft}
        </span>
      </div>

      {/* Question */}
      <h3 className="text-arc-text font-body font-medium text-base leading-snug line-clamp-3 group-hover:text-white transition-colors">
        {market.question}
      </h3>

      {/* Probability bar */}
      <div className="space-y-2">
        <div className="flex justify-between text-xs font-mono">
          <span className="text-arc-green">YES {yesPct}%</span>
          <span className="text-arc-red">NO {noPct}%</span>
        </div>
        <div className="h-2 bg-arc-bg rounded-full overflow-hidden flex">
          <div
            className="h-full bg-arc-green transition-all duration-500"
            style={{ width: `${yesPct}%` }}
          />
          <div
            className="h-full bg-arc-red flex-1"
          />
        </div>
      </div>

      {/* Stats row */}
      <div className="flex items-center justify-between text-xs text-arc-muted">
        <span className="flex items-center gap-1 font-mono">
          <TrendingUp className="w-3 h-3" />
          {formatUSDC(total)} vol.
        </span>
        <span className="flex items-center gap-1">
          <Users className="w-3 h-3" />
          {Math.floor(Number(total) / 50_000_000) + 12} bettors
        </span>
      </div>

      {/* CTA */}
      <div className="grid grid-cols-2 gap-2 pt-1">
        <button
          onClick={onBet}
          className="py-2.5 text-sm font-medium rounded-sm bg-arc-green/10 hover:bg-arc-green/20 border border-arc-green/30 hover:border-arc-green/60 text-arc-green transition-all duration-150"
        >
          YES ↑
        </button>
        <button
          onClick={onBet}
          className="py-2.5 text-sm font-medium rounded-sm bg-arc-red/10 hover:bg-arc-red/20 border border-arc-red/30 hover:border-arc-red/60 text-arc-red transition-all duration-150"
        >
          NO ↓
        </button>
      </div>
    </div>
  );
}

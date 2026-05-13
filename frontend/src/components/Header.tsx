"use client";

import { ConnectButton } from "@rainbow-me/rainbowkit";
import { Plus, TrendingUp, Zap } from "lucide-react";

interface HeaderProps {
  onCreateMarket: () => void;
}

export function Header({ onCreateMarket }: HeaderProps) {
  return (
    <header className="sticky top-0 z-50 border-b border-arc-border bg-arc-bg/80 backdrop-blur-xl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 rounded-sm bg-arc-accent/10 border border-arc-accent/30 flex items-center justify-center glow-accent">
            <TrendingUp className="w-4 h-4 text-arc-accent" />
          </div>
          <span className="font-display text-xl text-white tracking-widest">
            ARCPREDICT
          </span>
          <span className="hidden sm:flex items-center gap-1 px-2 py-0.5 rounded-sm bg-arc-green/10 border border-arc-green/20 text-arc-green text-xs font-mono">
            <Zap className="w-3 h-3" />
            TESTNET
          </span>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-3">
          <button
            onClick={onCreateMarket}
            className="hidden sm:flex items-center gap-2 px-4 py-2 bg-arc-accent/10 hover:bg-arc-accent/20 border border-arc-accent/30 hover:border-arc-accent/60 text-arc-accent text-sm font-medium rounded-sm transition-all duration-150"
          >
            <Plus className="w-4 h-4" />
            Create Market
          </button>
          <ConnectButton
            showBalance={false}
            chainStatus="icon"
            accountStatus="address"
          />
        </div>
      </div>
    </header>
  );
}

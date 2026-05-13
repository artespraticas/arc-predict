"use client";

import { useState } from "react";
import { X, Plus } from "lucide-react";
import { useAccount, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import { ABI, CONTRACT_ADDRESS, CATEGORIES } from "@/lib/contract";

interface CreateMarketModalProps {
  onClose: () => void;
}

export function CreateMarketModal({ onClose }: CreateMarketModalProps) {
  const [question, setQuestion] = useState("");
  const [category, setCategory] = useState("Central Banks");
  const [resolutionSource, setResolutionSource] = useState("");
  const [deadlineDays, setDeadlineDays] = useState("7");
  const [minBet, setMinBet] = useState("1");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  const { isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  async function handleCreate() {
    if (!isConnected) {
      alert("Connect your wallet first.");
      return;
    }
    if (!question || !resolutionSource) return;

    setLoading(true);
    try {
      const now = Math.floor(Date.now() / 1000);
      const deadlineTs = now + parseInt(deadlineDays) * 86400;
      const resolutionTs = deadlineTs + 86400;

      await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: ABI,
        functionName: "createMarket",
        args: [
          question,
          category,
          "",
          resolutionSource,
          BigInt(deadlineTs),
          BigInt(resolutionTs),
          parseUnits(minBet, 6),
        ],
      });

      setSuccess(true);
    } catch (err) {
      console.error(err);
      alert("Transaction failed. Check console.");
    } finally {
      setLoading(false);
    }
  }

  const catOptions = CATEGORIES.filter((c) => c.id !== "all");

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-black/70 backdrop-blur-sm"
        onClick={onClose}
      />
      <div className="relative w-full max-w-lg bg-arc-surface border border-arc-border rounded-sm shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-arc-border">
          <h2 className="font-display text-xl text-white tracking-wide">
            CREATE MARKET
          </h2>
          <button onClick={onClose} className="text-arc-muted hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 space-y-4">
          {success ? (
            <div className="text-center py-8 space-y-3">
              <div className="text-5xl">🎉</div>
              <p className="text-arc-green font-medium text-lg">Market Created!</p>
              <p className="text-arc-muted text-sm">
                Your prediction market is live on Arc testnet.
              </p>
              <button
                onClick={onClose}
                className="mt-4 px-6 py-2.5 bg-arc-accent/10 border border-arc-accent/30 text-arc-accent rounded-sm text-sm font-medium"
              >
                Done
              </button>
            </div>
          ) : (
            <>
              {/* Question */}
              <div className="space-y-1.5">
                <label className="text-xs text-arc-muted font-mono uppercase tracking-wider">
                  Question *
                </label>
                <textarea
                  value={question}
                  onChange={(e) => setQuestion(e.target.value)}
                  placeholder="Will the ECB cut rates at its next meeting?"
                  rows={3}
                  className="w-full bg-arc-bg border border-arc-border rounded-sm p-3 text-sm text-white font-body outline-none focus:border-arc-accent/50 resize-none placeholder:text-arc-muted/50"
                />
              </div>

              {/* Category */}
              <div className="space-y-1.5">
                <label className="text-xs text-arc-muted font-mono uppercase tracking-wider">
                  Category *
                </label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  className="w-full bg-arc-bg border border-arc-border rounded-sm p-3 text-sm text-white font-body outline-none focus:border-arc-accent/50"
                >
                  {catOptions.map((c) => (
                    <option key={c.id} value={c.id}>
                      {c.icon} {c.label}
                    </option>
                  ))}
                </select>
              </div>

              {/* Resolution source */}
              <div className="space-y-1.5">
                <label className="text-xs text-arc-muted font-mono uppercase tracking-wider">
                  Resolution Source *
                </label>
                <input
                  value={resolutionSource}
                  onChange={(e) => setResolutionSource(e.target.value)}
                  placeholder="e.g. ECB official press release"
                  className="w-full bg-arc-bg border border-arc-border rounded-sm p-3 text-sm text-white font-body outline-none focus:border-arc-accent/50 placeholder:text-arc-muted/50"
                />
              </div>

              {/* Deadline + Min Bet */}
              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1.5">
                  <label className="text-xs text-arc-muted font-mono uppercase tracking-wider">
                    Betting Period (days)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={deadlineDays}
                    onChange={(e) => setDeadlineDays(e.target.value)}
                    className="w-full bg-arc-bg border border-arc-border rounded-sm p-3 text-sm text-white font-mono outline-none focus:border-arc-accent/50"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs text-arc-muted font-mono uppercase tracking-wider">
                    Min Bet (USDC)
                  </label>
                  <input
                    type="number"
                    min="1"
                    value={minBet}
                    onChange={(e) => setMinBet(e.target.value)}
                    className="w-full bg-arc-bg border border-arc-border rounded-sm p-3 text-sm text-white font-mono outline-none focus:border-arc-accent/50"
                  />
                </div>
              </div>

              <button
                onClick={handleCreate}
                disabled={loading || !question || !resolutionSource}
                className="w-full py-3.5 bg-arc-accent/10 hover:bg-arc-accent/20 border border-arc-accent/40 hover:border-arc-accent/70 text-arc-accent rounded-sm text-sm font-medium flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {loading ? (
                  "Creating..."
                ) : (
                  <>
                    <Plus className="w-4 h-4" />
                    Create Market
                  </>
                )}
              </button>

              {!isConnected && (
                <p className="text-center text-xs text-arc-muted">
                  Connect your wallet to create markets
                </p>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

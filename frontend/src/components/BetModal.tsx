"use client";

import { useState } from "react";
import { X, AlertCircle, CheckCircle2, ExternalLink, Zap } from "lucide-react";
import { useAccount, useWriteContract } from "wagmi";
import { parseUnits } from "viem";
import { ABI, USDC_ABI, CONTRACT_ADDRESS, USDC_ADDRESS, DEMO_MARKETS } from "@/lib/contract";interface BetModalProps {
  market: (typeof DEMO_MARKETS)[0];
  onClose: () => void;
}

type Step = "bet" | "approving" | "betting" | "success" | "error";

function formatUSDC(amount: bigint): string {
  const num = Number(amount) / 1_000_000;
  if (num >= 1_000) return `$${(num / 1_000).toFixed(0)}K`;
  return `$${num.toFixed(2)}`;
}

const ZERO = BigInt(0);

export function BetModal({ market, onClose }: BetModalProps) {
  const [side, setSide] = useState<"yes" | "no">("yes");
  const [amount, setAmount] = useState("10");
  const [step, setStep] = useState<Step>("bet");
  const [txHash, setTxHash] = useState("");

  const { address, isConnected } = useAccount();
  const { writeContractAsync } = useWriteContract();

  const total = market.totalYes + market.totalNo;
  const totalNum = Number(total);
  const yesPct = totalNum === 0 ? 50 : Math.round((Number(market.totalYes) / totalNum) * 100);
  const noPct = 100 - yesPct;

  const amountBigInt = (() => {
    try { return parseUnits(amount || "0", 6); } catch { return ZERO; }
  })();

  const estimatedPayout = (() => {
    if (amountBigInt === ZERO) return ZERO;
    const pool = total + amountBigInt;
    const winPool = side === "yes" ? market.totalYes + amountBigInt : market.totalNo + amountBigInt;
    if (winPool === ZERO) return ZERO;
    const gross = (amountBigInt * pool) / winPool;
    return (gross * BigInt(98)) / BigInt(100);
  })();

  const multiplier = amountBigInt > ZERO
    ? (Number(estimatedPayout) / Number(amountBigInt)).toFixed(2)
    : "0.00";

  async function handleBet() {
    if (!isConnected || !address) { alert("Please connect your wallet first."); return; }
    if (amountBigInt === ZERO) return;
    try {
      setStep("approving");
      await writeContractAsync({
        address: USDC_ADDRESS as `0x${string}`,
        abi: USDC_ABI,
        functionName: "approve",
        args: [CONTRACT_ADDRESS as `0x${string}`, amountBigInt],
      });
      setStep("betting");
      const betTx = await writeContractAsync({
        address: CONTRACT_ADDRESS as `0x${string}`,
        abi: ABI,
        functionName: "placeBet",
        args: [market.id, side === "yes", amountBigInt],
      });
      setTxHash(betTx);
      setStep("success");
    } catch (err) {
      console.error(err);
      setStep("error");
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" onClick={onClose} />
      <div className="relative w-full max-w-md bg-arc-surface border border-arc-border rounded-sm shadow-2xl">
        <div className="flex items-center justify-between p-5 border-b border-arc-border">
          <h2 className="font-display text-xl text-white tracking-wide">PLACE BET</h2>
          <button onClick={onClose} className="text-arc-muted hover:text-white transition-colors">
            <X className="w-5 h-5" />
          </button>
        </div>
        <div className="p-5 space-y-5">
          <p className="text-arc-text text-sm font-body leading-relaxed">{market.question}</p>
          <div className="bg-arc-bg rounded-sm p-3 space-y-2">
            <div className="flex justify-between text-xs font-mono">
              <span className="text-arc-green">YES {yesPct}%</span>
              <span className="text-arc-red">NO {noPct}%</span>
            </div>
            <div className="h-1.5 bg-arc-border rounded-full overflow-hidden flex">
              <div className="h-full bg-arc-green" style={{ width: `${yesPct}%` }} />
              <div className="h-full bg-arc-red flex-1" />
            </div>
          </div>
          {step === "success" ? (
            <div className="text-center py-6 space-y-3">
              <CheckCircle2 className="w-12 h-12 text-arc-green mx-auto" />
              <p className="text-arc-green font-medium">Bet placed successfully!</p>
              <p className="text-arc-muted text-sm">
                You bet {formatUSDC(amountBigInt)} on{" "}
                <span className={side === "yes" ? "text-arc-green" : "text-arc-red"}>{side.toUpperCase()}</span>
              </p>
              {txHash && (
                <a href={`https://testnet.arcscan.app/tx/${txHash}`} target="_blank" rel="noreferrer"
                  className="inline-flex items-center gap-1 text-arc-accent text-xs hover:underline">
                  View on ArcScan <ExternalLink className="w-3 h-3" />
                </a>
              )}
              <button onClick={onClose} className="w-full mt-2 py-2.5 bg-arc-accent/10 border border-arc-accent/30 text-arc-accent rounded-sm text-sm font-medium">Close</button>
            </div>
          ) : step === "error" ? (
            <div className="text-center py-6 space-y-3">
              <AlertCircle className="w-12 h-12 text-arc-red mx-auto" />
              <p className="text-arc-red font-medium">Transaction failed</p>
              <p className="text-arc-muted text-sm">Check your wallet and try again.</p>
              <button onClick={() => setStep("bet")} className="w-full py-2.5 bg-arc-red/10 border border-arc-red/30 text-arc-red rounded-sm text-sm font-medium">Try Again</button>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-2 gap-2">
                <button onClick={() => setSide("yes")} className={`py-3 rounded-sm border text-sm font-medium transition-all ${side === "yes" ? "bg-arc-green/15 border-arc-green/60 text-arc-green" : "bg-arc-bg border-arc-border text-arc-muted hover:border-arc-green/30"}`}>YES ↑</button>
                <button onClick={() => setSide("no")} className={`py-3 rounded-sm border text-sm font-medium transition-all ${side === "no" ? "bg-arc-red/15 border-arc-red/60 text-arc-red" : "bg-arc-bg border-arc-border text-arc-muted hover:border-arc-red/30"}`}>NO ↓</button>
              </div>
              <div className="space-y-1.5">
                <label className="text-xs text-arc-muted font-mono uppercase tracking-wider">Amount (USDC)</label>
                <div className="flex items-center bg-arc-bg border border-arc-border rounded-sm overflow-hidden focus-within:border-arc-accent/50">
                  <span className="pl-3 text-arc-muted font-mono text-sm">$</span>
                  <input type="number" min="1" step="1" value={amount} onChange={(e) => setAmount(e.target.value)} className="flex-1 bg-transparent py-3 px-2 text-white font-mono text-sm outline-none" placeholder="10" />
                  <span className="pr-3 text-arc-muted font-mono text-xs">USDC</span>
                </div>
                <div className="flex gap-2">
                  {["5", "10", "50", "100"].map((q) => (
                    <button key={q} onClick={() => setAmount(q)} className="flex-1 py-1 text-xs font-mono bg-arc-bg border border-arc-border hover:border-arc-accent/30 text-arc-muted hover:text-arc-accent rounded-sm transition-all">${q}</button>
                  ))}
                </div>
              </div>
              <div className="bg-arc-bg border border-arc-border rounded-sm p-3 flex justify-between items-center">
                <span className="text-xs text-arc-muted font-mono">Est. payout if correct</span>
                <span className="text-arc-gold font-mono font-medium text-sm">{formatUSDC(estimatedPayout)} <span className="text-arc-muted text-xs">({multiplier}×)</span></span>
              </div>
              <p className="text-xs text-arc-muted font-body">📋 Resolution source: <span className="text-arc-text">{market.resolutionSource}</span></p>
              <button onClick={handleBet} disabled={step === "approving" || step === "betting" || amountBigInt === ZERO}
                className={`w-full py-3.5 rounded-sm text-sm font-medium flex items-center justify-center gap-2 transition-all ${side === "yes" ? "bg-arc-green/15 hover:bg-arc-green/25 border border-arc-green/40 text-arc-green" : "bg-arc-red/15 hover:bg-arc-red/25 border border-arc-red/40 text-arc-red"} disabled:opacity-50 disabled:cursor-not-allowed`}>
                {step === "approving" ? <><Zap className="w-4 h-4 animate-pulse" />Approving USDC...</>
                  : step === "betting" ? <><Zap className="w-4 h-4 animate-pulse" />Placing Bet...</>
                  : <>Bet {formatUSDC(amountBigInt)} on {side.toUpperCase()}</>}
              </button>
              {!isConnected && <p className="text-center text-xs text-arc-muted">Connect your wallet above to place bets</p>}
            </>
          )}
        </div>
      </div>
    </div>
  );
}

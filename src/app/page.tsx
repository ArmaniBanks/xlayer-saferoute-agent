"use client";

import { useMemo, useState } from "react";
import {
  AlertTriangle,
  CheckCircle2,
  Shield,
  Wallet,
  ArrowRight,
  Sparkles,
} from "lucide-react";

type RiskLevel = "Safe" | "Caution" | "High Risk";

type AnalysisResult = {
  riskLevel: RiskLevel;
  score: number;
  summary: string;
  reasons: string[];
  saferRoute?: string;
  recommendedAction: string;
};

function analyzeIntent(intent: string): AnalysisResult {
  const text = intent.toLowerCase().trim();

  if (!text) {
    return {
      riskLevel: "Caution",
      score: 50,
      summary: "Enter a transaction intent so the agent can evaluate it.",
      reasons: ["No intent provided yet."],
      recommendedAction: "Analyze first",
    };
  }

  const reasons: string[] = [];
  let score = 85;
  let saferRoute = "";
  let recommendedAction = "Execute on X Layer";

  if (
    text.includes("random token") ||
    text.includes("unknown token") ||
    text.includes("meme token") ||
    text.includes("fresh token")
  ) {
    score -= 30;
    reasons.push("The token looks speculative or not clearly identified.");
  }

  if (
    text.includes("high slippage") ||
    text.includes("100% slippage") ||
    text.includes("low liquidity")
  ) {
    score -= 25;
    reasons.push("High slippage or low liquidity can cause poor execution.");
    saferRoute = "Use a more liquid route and lower slippage before swapping.";
  }

  if (
    text.includes("approve") ||
    text.includes("infinite approval") ||
    text.includes("unlimited approval")
  ) {
    score -= 25;
    reasons.push("Approval actions can expose funds if the contract is unsafe.");
    saferRoute = "Use limited approval only for the exact amount needed.";
    recommendedAction = "Approve with safer limits";
  }

  if (text.includes("bridge")) {
    score -= 10;
    reasons.push("Bridging introduces extra execution and contract risk.");
  }

  if (text.includes("swap")) {
    reasons.push("Swap intent detected.");
    recommendedAction = "Execute safer swap";
  }
if (
  text.includes("drain") ||
  text.includes("all funds") ||
  text.includes("unsafe contract") ||
  text.includes("send everything")
) {
  score -= 35;
  reasons.push("This intent includes severe fund safety risk.");
  saferRoute = "Do not execute this action without strict verification and contract review.";
  recommendedAction = "Block execution";
}

if (
  text.includes("eth") ||
  text.includes("usdc") ||
  text.includes("liquid route") ||
  text.includes("verified token")
) {
  score += 5;
  reasons.push("The intent references more established assets or safer routing.");
}
  let riskLevel: RiskLevel = "Safe";

  if (score < 40) {
  riskLevel = "High Risk";
} else if (score < 80) {
  riskLevel = "Caution";
}

  if (!saferRoute && riskLevel !== "Safe") {
    saferRoute =
      "Consider routing into a more liquid major asset first, then re-evaluate the next step.";
  }

  return {
    riskLevel,
    score: Math.max(0, Math.min(100, score)),
    summary:
      riskLevel === "Safe"
        ? "This action looks reasonable based on the current intent."
        : riskLevel === "Caution"
        ? "This action may be possible, but the route should be made safer first."
        : "This action has multiple warning signs and should not be executed blindly.",
    reasons,
    saferRoute,
    recommendedAction,
  };
}

function generateMockTxHash() {
  const chars = "abcdef0123456789";
  let hash = "0x";
  for (let i = 0; i < 64; i++) {
    hash += chars[Math.floor(Math.random() * chars.length)];
  }
  return hash;
}

function SafeRouteLogo() {
  return (
    <svg
      width="64"
      height="64"
      viewBox="0 0 64 64"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className="shrink-0"
    >
      <defs>
        <linearGradient id="sr-bg" x1="8" y1="8" x2="56" y2="56" gradientUnits="userSpaceOnUse">
          <stop stopColor="#0F172A" />
          <stop offset="1" stopColor="#111827" />
        </linearGradient>

        <linearGradient id="sr-stroke" x1="12" y1="12" x2="52" y2="52" gradientUnits="userSpaceOnUse">
          <stop stopColor="#7DD3FC" />
          <stop offset="1" stopColor="#38BDF8" />
        </linearGradient>

        <filter id="sr-glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2.2" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>

      <g filter="url(#sr-glow)">
        <path
          d="M32 6L50 12V27C50 39.5 42.3 50.3 32 56C21.7 50.3 14 39.5 14 27V12L32 6Z"
          fill="url(#sr-bg)"
          stroke="url(#sr-stroke)"
          strokeWidth="2.2"
        />
        <path
          d="M23 22H34"
          stroke="url(#sr-stroke)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M23 30H31"
          stroke="url(#sr-stroke)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M23 38H28"
          stroke="url(#sr-stroke)"
          strokeWidth="3"
          strokeLinecap="round"
        />
        <path
          d="M33 22L43 32L33 42"
          stroke="url(#sr-stroke)"
          strokeWidth="3.2"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
        <path
          d="M26 32H42"
          stroke="url(#sr-stroke)"
          strokeWidth="3.2"
          strokeLinecap="round"
        />
      </g>
    </svg>
  );
}

export default function HomePage() {
  const [intent, setIntent] = useState("");
  const [executed, setExecuted] = useState(false);
  const [txHash, setTxHash] = useState("");
  const [isExecuting, setIsExecuting] = useState(false);
  const [wallet, setWallet] = useState<string | null>(null);
  const [chain, setChain] = useState<string | null>(null);
  const result = useMemo(() => analyzeIntent(intent), [intent]);

  const handleExecute = async () => {
  setIsExecuting(true);
setExecuted(false);

try {
  if (!wallet) {
    alert("Connect wallet first");
    setIsExecuting(false);
    return;
  }

  if (result.riskLevel === "High Risk") {
    alert("Blocked: High risk transaction");
    setIsExecuting(false);
    return;
  }

  const eth = (window as any).ethereum;

  const txHash = await eth.request({
    method: "eth_sendTransaction",
    params: [
      {
        from: wallet,
        to: wallet,
        value: "0x0",
      },
    ],
  });

  setTxHash(txHash);
  setExecuted(true);
} catch (err) {
  console.log(err);
  alert("Transaction failed or was rejected");
} finally {
  setIsExecuting(false);
}
};
  
const connectWallet = async () => {
  try {
    const eth = (window as any).ethereum;
    if (!eth) {
      alert("Install MetaMask");
      return;
    }

    const accounts = await eth.request({
      method: "eth_requestAccounts",
    });
const chainId = await eth.request({ method: "eth_chainId" });

if (chainId !== "0xc4") {
  alert("You are not on X Layer. Please switch network.");
}
    setWallet(accounts[0]);
    setChain(chainId);
    } catch (err) {
    console.log(err);
    }
};
  return (
    <main className="min-h-screen bg-zinc-950 text-white">
      <div className="mx-auto max-w-6xl px-6 py-10">
        <div className="mb-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <div className="mb-3 inline-flex items-center gap-2 rounded-full border border-zinc-800 bg-zinc-900 px-3 py-1 text-xs text-zinc-300">
              <Sparkles className="h-3.5 w-3.5" />
              Build X Hackathon
            </div>

            <div className="flex items-center gap-4">
              <SafeRouteLogo />

              <div>
                <h1 className="text-3xl font-semibold tracking-tight md:text-5xl">
                  SafeRoute
                </h1>
                <p className="mt-1 text-xs uppercase tracking-[0.22em] text-sky-300/80">
                  Secure Execution Layer
                </p>
              </div>
            </div>

            <p className="mt-3 max-w-2xl text-sm leading-6 text-zinc-400 md:text-base">
              AI agent for safe and intelligent onchain execution on X Layer.
            </p>
          </div>

          
  
  <div className="flex w-full max-w-sm flex-col gap-3">
  <div className="rounded-2xl border border-zinc-800 bg-zinc-900 px-4 py-3 text-sm text-zinc-300">
    Status: <span className="font-medium text-white">UI Prototype Live</span>
  </div>

  <div className="rounded-2xl border border-zinc-800 bg-zinc-900 p-4">
    <div className="mb-2 text-sm text-zinc-300">
      Wallet
    </div>

    <div className="rounded-xl bg-zinc-950 px-3 py-2 text-sm text-zinc-400">
      {wallet ? `${wallet.slice(0, 6)}...${wallet.slice(-4)}` : "Not connected"}
    </div>

<div className="mt-2 text-xs text-zinc-400">
  {chain === "0xc4"
    ? "Network: X Layer ✅"
    : chain
    ? "Wrong Network ⚠️"
    : "Network: Unknown"}
</div>

    <button
      onClick={connectWallet}
      disabled={!!wallet}
      className="mt-3 w-full rounded-2xl bg-sky-500 px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:opacity-50"
    >
      {wallet ? "Ready to Execute" : "Connect Wallet"}
    </button>
  </div>
</div>
        </div>

        <section className="grid gap-6 lg:grid-cols-[1.1fr_0.9fr]">
          <div className="rounded-3xl border border-zinc-800 bg-zinc-900 p-6 shadow-2xl shadow-black/20">
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-zinc-300">
              <Wallet className="h-4 w-4" />
              User Intent
            </div>

            <label className="mb-2 block text-sm text-zinc-400">
              Describe what you want the agent to do
            </label>

            <textarea
              value={intent}
              onChange={(e) => {
                setIntent(e.target.value);
                setExecuted(false);
                setTxHash("");
              }}
              placeholder="Example: Swap 100 USDT to random token with high slippage"
              className="min-h-[220px] w-full rounded-2xl border border-zinc-700 bg-zinc-950 px-4 py-3 text-sm text-white outline-none placeholder:text-zinc-500"
            />

            <div className="mt-4 flex flex-wrap gap-3">
              <button
                onClick={() =>
                  setIntent("Swap 100 USDT to random token with high slippage")
                }
                className="rounded-xl border border-zinc-700 px-3 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800"
              >
                Load risky swap
              </button>

              <button
                onClick={() =>
                  setIntent("Swap 50 USDT to ETH using a liquid route")
                }
                className="rounded-xl border border-zinc-700 px-3 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800"
              >
                Load safer swap
              </button>

              <button
                onClick={() =>
                  setIntent("Approve unlimited approval for unknown token")
                }
                className="rounded-xl border border-zinc-700 px-3 py-2 text-sm text-zinc-200 transition hover:bg-zinc-800"
              >
                Load risky approval
              </button>
            </div>
          </div>

          <div
  className={`rounded-3xl border p-6 shadow-2xl shadow-black/20 ${
    result.riskLevel === "High Risk"
      ? "border-red-800 bg-red-950/30"
      : result.riskLevel === "Caution"
      ? "border-yellow-800 bg-yellow-950/30"
      : "border-emerald-800 bg-emerald-950/30"
  }`}
>
            <div className="mb-4 flex items-center gap-2 text-sm font-medium text-zinc-300">
              <Shield className="h-4 w-4" />
              Agent Decision
            </div>

            <div className="mb-5 flex items-center gap-3">
              {result.riskLevel === "Safe" ? (
                <CheckCircle2 className="h-6 w-6 text-emerald-400" />
              ) : (
                <AlertTriangle className="h-6 w-6 text-amber-400" />
              )}

              <div>
                <div className="text-lg font-semibold">{result.riskLevel}</div>
                <div className="text-sm text-zinc-400">
                  Safety score: {result.score}/100
                </div>
              </div>
            </div>

            <p className="mb-5 text-sm leading-6 text-zinc-300">{result.summary}</p>

            <div className="mb-5">
              <div className="mb-2 text-sm font-medium text-zinc-200">
                Why the agent said this
              </div>

              <div className="space-y-2">
                {result.reasons.map((reason, index) => (
                  <div
                    key={index}
                    className="rounded-xl border border-zinc-800 bg-zinc-950 px-3 py-2 text-sm text-zinc-400"
                  >
                    {reason}
                  </div>
                ))}
              </div>
            </div>

            {result.saferRoute ? (
              <div className="mb-5 rounded-2xl border border-emerald-900 bg-emerald-950/30 p-4">
                <div className="mb-1 text-sm font-medium text-emerald-300">
                  Safer route suggestion
                </div>
                <p className="text-sm leading-6 text-emerald-100">
                  {result.saferRoute}
                </p>
              </div>
            ) : null}

            <div className="mb-4 rounded-2xl border border-zinc-800 bg-zinc-950 p-4">
              <div className="mb-1 text-sm text-zinc-400">Recommended action</div>
              <div className="flex items-center gap-2 text-sm font-medium text-white">
                <ArrowRight className="h-4 w-4" />
                {result.recommendedAction}
              </div>
            </div>

            <button
  onClick={handleExecute}
  disabled={!intent || isExecuting || result.riskLevel === "High Risk"}
  className="w-full rounded-2xl bg-white px-4 py-3 text-sm font-semibold text-black transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-40"
>
  {result.riskLevel === "High Risk"
  ? "Blocked by SafeRoute"
  : isExecuting
  ? "Executing..."
  : "Execute preview action"}
</button>

            {executed ? (
  <div className="mt-4 rounded-2xl border border-emerald-800 bg-emerald-950/30 p-4">
    <div className="mb-2 text-sm font-medium text-emerald-300">
      Preview execution complete
    </div>
    <p className="mb-2 text-xs text-zinc-400">
      Mock transaction hash
    </p>
    <p className="break-all text-xs text-emerald-100">
      {txHash}
    </p>
    <a
  href={`https://www.oklink.com/xlayer/tx/${txHash}`}
  target="_blank"
  className="text-xs text-blue-400 underline"
>
  View on Explorer
</a>
  </div>
) : null}
          </div>
        </section>
      </div>
    </main>
  );
}
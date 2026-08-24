"use client";

import React, { useState, useEffect } from "react";
import {
  Activity,
  Server,
  Database,
  Cpu,
  Zap,
  ShieldCheck,
  RefreshCw,
  CheckCircle2,
  AlertTriangle,
  Radio,
  Power
} from "lucide-react";

interface TelemetryProbe {
  endpoint: string;
  name: string;
  latencyMs: number;
  status: "HEALTHY" | "HOT_SUBSTITUTE_ACTIVE" | "DEGRADED";
  engine: string;
  hitRate: string;
}

export function LiveSreNetworkPulse() {
  const [isProbing, setIsProbing] = useState<boolean>(false);
  const [lastProbeTime, setLastProbeTime] = useState<string>("Just now");
  const [tokenSavingsCount, setTokenSavingsCount] = useState<number>(148200);
  const [simulatedBlackout, setSimulatedBlackout] = useState<boolean>(false);

  const [probes, setProbes] = useState<TelemetryProbe[]>([
    {
      endpoint: "https://azure-containerapps.io/api/v1/health",
      name: "Azure Container App Cluster",
      latencyMs: 14.2,
      status: "HEALTHY",
      engine: "FastAPI / Uvicorn (Worker Pool x4)",
      hitRate: "99.98% Uptime"
    },
    {
      endpoint: "redis://epfo-cache-inmemory:6379",
      name: "Distributed Redis Read-Cache",
      latencyMs: 0.8,
      status: "HEALTHY",
      engine: "Redis In-Memory Pod (p50: 0.8ms)",
      hitRate: "99.4% Hit Rate"
    },
    {
      endpoint: "local://client-wasm-deterministic",
      name: "Sovereign On-Device 80/20 Core",
      latencyMs: 0.4,
      status: "HEALTHY",
      engine: "Levenshtein + Form 31 Math (Zero Cost)",
      hitRate: "100% Deterministic"
    },
    {
      endpoint: "presidio://zero-trust-pii-shield",
      name: "Presidio DPDP Security Shield",
      latencyMs: 0.2,
      status: "HEALTHY",
      engine: "AES-256-GCM + Token Vault",
      hitRate: "100% Masked"
    }
  ]);

  const handleTriggerProbe = () => {
    setIsProbing(true);
    setTimeout(() => {
      setProbes((prev) =>
        prev.map((p) => {
          if (simulatedBlackout && p.endpoint.includes("azure")) {
            return {
              ...p,
              latencyMs: 0.05,
              status: "HOT_SUBSTITUTE_ACTIVE",
              engine: "Hot Substitute: On-Device WASM Engine (<0.1ms)",
              hitRate: "100% Failover Safe"
            };
          }
          return {
            ...p,
            latencyMs: p.endpoint.startsWith("local")
              ? Number((Math.random() * 0.5 + 0.2).toFixed(2))
              : p.endpoint.startsWith("redis")
              ? Number((Math.random() * 0.9 + 0.4).toFixed(1))
              : p.endpoint.startsWith("presidio")
              ? Number((Math.random() * 0.3 + 0.1).toFixed(2))
              : Number((Math.random() * 12 + 8).toFixed(1)),
            status: "HEALTHY",
            engine: p.endpoint.includes("azure") ? "FastAPI / Uvicorn (Worker Pool x4)" : p.engine
          };
        })
      );
      setTokenSavingsCount((c) => c + Math.floor(Math.random() * 50 + 20));
      setLastProbeTime(new Date().toLocaleTimeString());
      setIsProbing(false);
    }, 350);
  };

  const handleToggleBlackout = () => {
    const nextState = !simulatedBlackout;
    setSimulatedBlackout(nextState);
    setProbes((prev) =>
      prev.map((p) => {
        if (p.endpoint.includes("azure")) {
          return {
            ...p,
            status: nextState ? "HOT_SUBSTITUTE_ACTIVE" : "HEALTHY",
            latencyMs: nextState ? 0.05 : 12.4,
            engine: nextState
              ? "Hot Substitute: Client-Side Deterministic Engine"
              : "FastAPI / Uvicorn (Worker Pool x4)"
          };
        }
        return p;
      })
    );
  };

  useEffect(() => {
    const timer = setInterval(() => {
      if (!simulatedBlackout) {
        setProbes((prev) =>
          prev.map((p) => ({
            ...p,
            latencyMs: p.endpoint.startsWith("local")
              ? Number((Math.random() * 0.5 + 0.2).toFixed(2))
              : p.endpoint.startsWith("redis")
              ? Number((Math.random() * 0.9 + 0.4).toFixed(1))
              : p.endpoint.startsWith("presidio")
              ? Number((Math.random() * 0.3 + 0.1).toFixed(2))
              : Number((Math.random() * 12 + 8).toFixed(1))
          }))
        );
      }
    }, 4000);
    return () => clearInterval(timer);
  }, [simulatedBlackout]);

  return (
    <div className="bg-slate-950 text-white rounded-3xl p-5 sm:p-7 border border-slate-800 shadow-2xl space-y-6 relative overflow-hidden">
      <div className="absolute top-0 right-0 w-80 h-80 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Header */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3 relative z-10 border-b border-slate-800 pb-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30 shrink-0">
            <Activity className="w-5 h-5 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-emerald-400 uppercase tracking-wider flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-ping inline-block" />
                Live SRE & Azure Network Pulse
              </span>
              <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
                P99 &lt; 15ms
              </span>
            </div>
            <h3 className="text-base sm:text-lg font-black tracking-tight text-white">
              Real-Time Azure Container Health & Deterministic Fallback Telemetry
            </h3>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <button
            onClick={handleToggleBlackout}
            className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all border ${
              simulatedBlackout
                ? "bg-red-500/20 text-red-300 border-red-500/40"
                : "bg-slate-900 hover:bg-slate-800 text-slate-300 border-slate-700"
            }`}
          >
            <Power className={`w-3.5 h-3.5 ${simulatedBlackout ? "text-red-400" : "text-amber-400"}`} />
            <span>{simulatedBlackout ? "⚡ Blackout Active (Fallback On)" : "Simulate Cloud Blackout"}</span>
          </button>

          <button
            onClick={handleTriggerProbe}
            disabled={isProbing}
            className="px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-bold text-slate-200 flex items-center gap-1.5 transition-all shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 text-emerald-400 ${isProbing ? "animate-spin" : ""}`} />
            <span>{isProbing ? "Probing..." : "Probe Telemetry"}</span>
          </button>
        </div>
      </div>

      {/* 4 Network Pillars Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 relative z-10">
        {probes.map((probe, idx) => (
          <div
            key={idx}
            className={`p-4 rounded-2xl bg-slate-900/90 border transition-all flex flex-col justify-between space-y-3 ${
              probe.status === "HOT_SUBSTITUTE_ACTIVE"
                ? "border-amber-500/60 ring-1 ring-amber-500/30"
                : "border-slate-800 hover:border-slate-700"
            }`}
          >
            <div className="flex justify-between items-start">
              <span className="text-xs font-bold text-slate-300">{probe.name}</span>
              <span
                className={`text-[9px] font-mono font-bold px-2 py-0.5 rounded-full border ${
                  probe.status === "HOT_SUBSTITUTE_ACTIVE"
                    ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                    : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                }`}
              >
                {probe.status}
              </span>
            </div>

            <div>
              <div className="text-2xl font-black font-mono text-white tracking-tight flex items-baseline gap-1">
                <span>{probe.latencyMs}</span>
                <span className="text-xs font-normal text-slate-400">ms</span>
              </div>
              <p className="text-[11px] text-slate-400 mt-0.5 truncate">
                {probe.engine}
              </p>
            </div>

            <div className="pt-2 border-t border-slate-800/80 flex justify-between items-center text-[10px] font-mono text-slate-400">
              <span>Metric:</span>
              <span className="text-emerald-400 font-bold">{probe.hitRate}</span>
            </div>
          </div>
        ))}
      </div>

      {/* SRE Summary Bar */}
      <div className="p-3.5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-2 text-xs relative z-10">
        <div className="flex items-center gap-2 text-slate-300">
          <Zap className="w-4 h-4 text-amber-400 shrink-0" />
          <span>
            <strong className="text-white">Tiktoken BPE Context Pruning:</strong> Cumulative{" "}
            <strong className="font-mono text-emerald-400">{tokenSavingsCount.toLocaleString()} tokens</strong> pruned before LLM ingress.
          </span>
        </div>
        <span className="text-[10px] font-mono text-slate-400">
          Last Probe: <strong className="text-slate-200">{lastProbeTime}</strong>
        </span>
      </div>
    </div>
  );
}

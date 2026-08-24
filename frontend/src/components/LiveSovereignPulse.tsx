"use client";

import React, { useState, useEffect } from "react";
import { Activity, ShieldCheck, Zap, Radio, Server, CheckCircle2 } from "lucide-react";

type TelemetryData = {
  name: string;
  status: string;
  value: number;
  unit: string;
  isLeak?: boolean;
};

const initialTelemetry: TelemetryData[] = [
  { name: "NPCI Instant DBT", status: "100%", value: 38, unit: "ms" },
  { name: "UIDAI Face RD", status: "Live", value: 42, unit: "ms" },
  { name: "NSDL PAN API", status: "Live", value: 15, unit: "ms" },
  { name: "Bank Penny Drop", status: "Live", value: 124, unit: "ms" },
  { name: "Presidio PII Vault", status: "100% Local", value: 0, unit: " Leaks", isLeak: true },
  { name: "Active TPS", status: "Peak", value: 1480, unit: " tx/s" },
  { name: "EPFO Core Gateway", status: "99.99% Up", value: 18, unit: "ms" }
];

export const LiveSovereignPulse: React.FC = () => {
  const [metrics, setMetrics] = useState<TelemetryData[]>(initialTelemetry);

  useEffect(() => {
    const interval = setInterval(() => {
      setMetrics((prevMetrics) =>
        prevMetrics.map((metric) => {
          if (metric.isLeak) return metric;
          const fluctuation = metric.unit === " tx/s" 
            ? Math.floor(Math.random() * 50) - 25 
            : Math.floor(Math.random() * 11) - 5;
          const newValue = Math.max(0, metric.value + fluctuation);
          return { ...metric, value: newValue };
        })
      );
    }, 2500);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full bg-[#050B14] border-t border-sovereign-navy/80 py-1.5 overflow-hidden relative flex items-center shadow-inner backdrop-blur-md select-none">
      {/* Subtle cyber-grid backdrop */}
      <div 
        className="absolute inset-0 opacity-10 pointer-events-none" 
        style={{
          backgroundImage: "linear-gradient(#0A3161 1px, transparent 1px), linear-gradient(90deg, #0A3161 1px, transparent 1px)",
          backgroundSize: "20px 20px"
        }}
      />
      
      {/* Live Badge Fixed on Left */}
      <div className="flex items-center gap-2 px-3 sm:px-4 shrink-0 bg-[#050B14] z-10 border-r border-sovereign-navy shadow-[10px_0_15px_-3px_rgba(5,11,20,1)] relative">
        <span className="relative flex h-2.5 w-2.5">
          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-emerald-500"></span>
        </span>
        <span className="font-mono text-[10px] font-bold text-emerald-400 tracking-wider whitespace-nowrap">
          SOVEREIGN PULSE LIVE
        </span>
      </div>

      {/* Marquee Container */}
      <div className="flex-1 overflow-hidden relative flex">
        <style dangerouslySetInnerHTML={{__html: `
          @keyframes sovereignMarquee {
            0% { transform: translateX(0%); }
            100% { transform: translateX(-50%); }
          }
          .animate-sovereign-marquee {
            animation: sovereignMarquee 35s linear infinite;
            display: flex;
            width: max-content;
          }
          .animate-sovereign-marquee:hover {
            animation-play-state: paused;
          }
        `}} />
        
        <div className="animate-sovereign-marquee">
          {[...metrics, ...metrics].map((metric, idx) => (
            <div key={idx} className="flex items-center gap-2 mx-4 font-mono text-[11px] whitespace-nowrap">
              <span className="text-slate-400 font-medium flex items-center gap-1.5">
                {metric.unit === "ms" && <Activity className="w-3 h-3 text-emerald-400" />}
                {metric.name}:
              </span>
              <span className={`font-bold ${metric.isLeak ? "text-amber-400" : "text-slate-200"}`}>
                {metric.status} 
                <span className={`${metric.isLeak ? "text-amber-400" : "text-emerald-400"} ml-1 font-mono`}>
                  ({metric.value}{metric.unit})
                </span>
              </span>
              <span className="mx-2 text-slate-700 font-bold">•</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

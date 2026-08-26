"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CopilotRedirectPage() {
  const router = useRouter();

  useEffect(() => {
    // Smoothly redirect to home dashboard and trigger the floating AI Agent bottom island
    if (typeof window !== "undefined") {
      setTimeout(() => {
        window.dispatchEvent(new CustomEvent("open-sovereign-agent"));
      }, 300);
    }
    router.replace("/");
  }, [router]);

  return (
    <div className="min-h-screen bg-sovereign-darkest flex items-center justify-center text-white">
      <div className="flex items-center gap-3 p-6 rounded-2xl bg-slate-900 border border-slate-800 shadow-xl">
        <div className="w-4 h-4 rounded-full border-2 border-saffron border-t-transparent animate-spin" />
        <span className="text-sm font-bold text-slate-200">Opening Sovereign AI Agent...</span>
      </div>
    </div>
  );
}

"use client";

import { useEffect } from "react";
import { AlertTriangle, RotateCcw } from "lucide-react";

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error("[Jan-EPF AI] Runtime Error:", error);
  }, [error]);

  return (
    <div className="min-h-[60vh] flex flex-col items-center justify-center p-8 text-center space-y-6">
      <div className="w-16 h-16 rounded-2xl bg-red-100 dark:bg-red-950/40 border border-red-200 dark:border-red-800 flex items-center justify-center">
        <AlertTriangle className="w-8 h-8 text-red-600 dark:text-red-400" />
      </div>
      <div className="space-y-2">
        <h2 className="text-xl font-black text-sovereign-navy dark:text-white">
          Something went wrong
        </h2>
        <p className="text-sm text-slate-600 dark:text-slate-400 max-w-md">
          An unexpected error occurred. This is a prototype proof-of-concept — your data is safe.
        </p>
      </div>
      <button
        onClick={reset}
        className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-sovereign-navy dark:bg-amber-500 text-white dark:text-slate-950 font-bold text-sm hover:opacity-90 transition-opacity shadow-lg"
      >
        <RotateCcw className="w-4 h-4" />
        Try Again
      </button>
    </div>
  );
}

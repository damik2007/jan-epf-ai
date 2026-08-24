"use client";

import React, { useEffect, useState } from "react";
import { usePathname } from "next/navigation";

export function RouteProgressBar() {
  const pathname = usePathname();
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    setLoading(true);
    const timer = setTimeout(() => {
      setLoading(false);
    }, 280);
    return () => clearTimeout(timer);
  }, [pathname]);

  if (!loading) return null;

  return (
    <div className="fixed top-0 left-0 right-0 z-[9999] h-[2.5px] bg-gradient-to-r from-saffron via-amber-400 to-emerald-400 shadow-[0_0_12px_rgba(255,153,51,0.9)] animate-pulse pointer-events-none transition-all" />
  );
}

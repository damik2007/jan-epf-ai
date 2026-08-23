"use client";

import { useEffect } from "react";

export function ServiceWorkerRegister() {
  useEffect(() => {
    if (typeof window !== "undefined" && "serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js")
        .then((reg) => {
          console.log("[Jan-EPF AI] Sovereign PWA ServiceWorker active:", reg.scope);
        })
        .catch((err) => {
          console.warn("[Jan-EPF AI] ServiceWorker registration skipped:", err);
        });
    }
  }, []);

  return null;
}

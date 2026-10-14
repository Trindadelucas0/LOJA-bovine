"use client"

import { useEffect } from "react"

/** Registra o service worker (PWA). Somente em producao e em contexto seguro (HTTPS/localhost). */
export default function RegisterSW() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return
    if (typeof window === "undefined" || !("serviceWorker" in navigator) || !window.isSecureContext) return
    const onLoad = () => navigator.serviceWorker.register("/sw.js", { scope: "/" }).catch(() => {})
    if (document.readyState === "complete") onLoad()
    else window.addEventListener("load", onLoad, { once: true })
  }, [])
  return null
}

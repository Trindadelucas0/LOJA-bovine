/* BOVINE PWA service worker - cache seguro.
 * NUNCA cacheia: API do Medusa (/store, /admin, /auth, /app, /hooks), carrinho,
 * checkout, conta, pedidos, requisicoes nao-GET ou com credenciais/RSC.
 * Cacheia: assets imutaveis do Next (/_next/static), icones e imagens de produto (/static).
 * Paginas HTML: network-first com fallback offline simples. */
const VERSION = "bovine-v2"
const STATIC_CACHE = `${VERSION}-static`
const IMG_CACHE = `${VERSION}-img`
const OFFLINE_URL = "/offline.html"
const PRECACHE = [
  OFFLINE_URL,
  "/icons/icon-192.png",
  "/icons/icon-512.png",
  "/icons/maskable-192.png",
  "/icons/apple-touch-icon.png",
  "/manifest.webmanifest",
]

const NEVER = /^\/(store|admin|auth|app|hooks|api|health)(\/|$)|\/(cart|checkout|account|order)(\/|$)/

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(STATIC_CACHE).then((c) => c.addAll(PRECACHE)).then(() => self.skipWaiting()))
})

self.addEventListener("activate", (e) => {
  e.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.filter((k) => !k.startsWith(VERSION)).map((k) => caches.delete(k)))).then(() => self.clients.claim())
  )
})

async function trimCache(name, max) {
  const c = await caches.open(name)
  const keys = await c.keys()
  for (let i = 0; i < keys.length - max; i++) await c.delete(keys[i])
}

self.addEventListener("fetch", (event) => {
  const req = event.request
  if (req.method !== "GET") return
  const url = new URL(req.url)
  if (url.origin !== self.location.origin) return
  if (NEVER.test(url.pathname)) return
  if (req.headers.get("RSC") || url.searchParams.has("_rsc")) return

  // Assets imutaveis do Next: cache-first
  if (url.pathname.startsWith("/_next/static/") || url.pathname.startsWith("/icons/")) {
    event.respondWith(
      caches.match(req).then((hit) => hit || fetch(req).then((res) => {
        if (res.ok) { const cp = res.clone(); caches.open(STATIC_CACHE).then((c) => c.put(req, cp)) }
        return res
      }))
    )
    return
  }

  // Imagens de produto: stale-while-revalidate, limitado
  if (url.pathname.startsWith("/static/") && req.destination === "image") {
    event.respondWith(
      caches.open(IMG_CACHE).then(async (c) => {
        const hit = await c.match(req)
        const net = fetch(req).then((res) => {
          if (res.ok) { c.put(req, res.clone()); trimCache(IMG_CACHE, 150) }
          return res
        }).catch(() => hit)
        return hit || net
      })
    )
    return
  }

  // Navegacao HTML: sempre rede (dados frescos/precos), offline -> pagina simples
  if (req.mode === "navigate") {
    event.respondWith(fetch(req).catch(() => caches.match(OFFLINE_URL)))
  }
})

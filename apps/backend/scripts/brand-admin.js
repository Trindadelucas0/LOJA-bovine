#!/usr/bin/env node
/**
 * brand-admin.js — Rebrand do painel admin (Medusa dashboard) para BOVINE.
 *
 * Rode SEMPRE depois de `medusa build` (o build recria .medusa/server/public/admin):
 *   cd apps/backend && npx medusa build && node scripts/brand-admin.js
 *
 * O que faz (idempotente):
 *  - troca textos visiveis "Medusa" -> "BOVINE" nos bundles JS do admin (todas as linguas);
 *  - textos do login/convite em pt-BR e en ("Bem-vindo à BOVINE" / "Entre para acessar o painel");
 *  - titulo da aba, favicon e icone (icones em scripts/brand-assets/);
 *  - idioma padrao pt-BR (se o usuario ainda nao escolheu outro);
 *  - esconde o logo SVG do Medusa no login e mostra o icone BOVINE.
 * Nao altera codigo-fonte de terceiros nem arquivos de licenca.
 */
const fs = require("fs")
const crypto = require("crypto")
const path = require("path")

const ADMIN = path.resolve(process.argv[2] || path.join(__dirname, "..", ".medusa", "server", "public", "admin"))
const ASSETS = path.join(ADMIN, "assets")
const BRAND_ASSETS = path.join(__dirname, "brand-assets")
if (!fs.existsSync(path.join(ADMIN, "index.html"))) {
  console.error("[brand-admin] admin build nao encontrado em", ADMIN, "- rode `medusa build` antes.")
  process.exit(1)
}

const specific = [
  ['title:"Welcome to Medusa",hint:"Sign in to access the account area"', 'title:"Bem-vindo à BOVINE",hint:"Entre para acessar o painel"'],
  ['title:"Welcome to Medusa",hint:"Create your account below"', 'title:"Bem-vindo à BOVINE",hint:"Crie sua conta abaixo"'],
  ['title:"Bem-vindo ao Medusa",hint:"Faça login para acessar a área da conta"', 'title:"Bem-vindo à BOVINE",hint:"Entre para acessar o painel"'],
  ['title:"Bem-vindo ao Medusa"', 'title:"Bem-vindo à BOVINE"'],
  ["Medusa Admin", "Painel BOVINE"],
]
let files = 0, hits = 0
const renamed = {}
for (const f of fs.readdirSync(ASSETS)) {
  if (!f.endsWith(".js")) continue
  const p = path.join(ASSETS, f)
  let s = fs.readFileSync(p, "utf8")
  const before = s
  for (const [a, b] of specific) s = s.split(a).join(b)
  // "Medusa" como palavra isolada (nao toca MedusaError, medusa_, x-medusa-*, etc.)
  s = s.replace(/(?<![A-Za-z0-9_$.\/-])Medusa(?![A-Za-z0-9_$])/g, () => (hits++, "BOVINE"))
  // flexoes em outras linguas (ex.: fi "Medusaan", he "ל-Medusa")
  s = s.replace(/(?<![A-Za-z0-9_$.\/])Medusa(?=(?:an|aa|a|n)[^A-Za-z0-9_$])/g, () => (hits++, "BOVINE"))
  s = s.replace(/(?<=[\u0590-\u05FF]-)Medusa/g, () => (hits++, "BOVINE"))
  if (s !== before) {
    fs.writeFileSync(p, s); files++
    // novo nome (cache-busting): os assets sao servidos com "immutable", entao o navegador/Cloudflare
    // manteriam a versao antiga com o mesmo nome
    const h = crypto.createHash("md5").update(s).digest("hex").slice(0, 8)
    const nf = f.replace(/(-bv[0-9a-f]{8})?\.js$/, `-bv${h}.js`)
    if (nf !== f) { fs.renameSync(p, path.join(ASSETS, nf)); renamed[f] = nf }
  }
}

// Cache-busting: assets saem com "immutable"; se algo mudou, renomeia TODOS os .js/.css
// (o conteudo de varios muda ao atualizar referencias) e atualiza as referencias.
if (Object.keys(renamed).length) {
  const tag = crypto.randomBytes(4).toString("hex")
  for (const f of fs.readdirSync(ASSETS)) {
    if (!/\.(js|css)$/.test(f) || renamed[f] || Object.values(renamed).includes(f)) continue
    const nf = f.replace(/(-bv[0-9a-f]{8})?\.(js|css)$/, `-bv${tag}.$2`)
    fs.renameSync(path.join(ASSETS, f), path.join(ASSETS, nf)); renamed[f] = nf
  }
  const keys = Object.keys(renamed).sort((a, b) => b.length - a.length)
  const targets = fs.readdirSync(ASSETS).filter((f) => /\.(js|css)$/.test(f)).map((f) => path.join(ASSETS, f))
  targets.push(path.join(ADMIN, "index.html"))
  for (const p of targets) {
    let s = fs.readFileSync(p, "utf8"), o = s
    for (const a of keys) s = s.split(a).join(renamed[a])
    if (s !== o) fs.writeFileSync(p, s)
  }
}

for (const icon of ["icon-32.png", "icon-192.png", "apple-touch-icon.png"]) {
  const src = path.join(BRAND_ASSETS, icon)
  if (fs.existsSync(src)) fs.copyFileSync(src, path.join(ASSETS, "bovine-" + icon))
}

const idx = path.join(ADMIN, "index.html")
let html = fs.readFileSync(idx, "utf8")
if (!html.includes("data-bovine-brand")) {
  html = html.replace(/<link rel="icon"[^>]*>/, "")
  const head = `
        <title>Painel BOVINE</title>
        <link rel="icon" type="image/png" href="/app/assets/bovine-icon-32.png" data-bovine-brand />
        <link rel="apple-touch-icon" href="/app/assets/bovine-apple-touch-icon.png" />
        <meta name="theme-color" content="#0E2439" />
        <script>try{var l=localStorage.getItem("lng");if(!l||l==="pt-BR"){if(!/(^|; )lng=/.test(document.cookie)||/(^|; )lng=pt-BR/.test(document.cookie)){localStorage.setItem("lng","ptBR");document.cookie="lng=ptBR; path=/; max-age=31536000"}}}catch(e){}</script>
        <style>
          /* logo do login: troca o SVG do Medusa pelo icone BOVINE */
          .size-12 > div > svg.rounded-\\[10px\\]{display:none}
          .size-12 > div:has(> svg.rounded-\\[10px\\]){background:url(/app/assets/bovine-icon-192.png) center/cover no-repeat !important;border-radius:10px}
        </style>`
  html = html.replace("</head>", head + "\n    </head>")
  fs.writeFileSync(idx, html)
}
console.log(`[brand-admin] ok: ${files} bundles alterados, ${hits} ocorrencias de "Medusa" -> "BOVINE"; index.html atualizado`)

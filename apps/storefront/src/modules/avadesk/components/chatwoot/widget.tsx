"use client"

import { useEffect } from "react"
import { setChatUser } from "@lib/util/chatwoot"

type Props = {
  baseUrl?: string | null
  websiteToken?: string | null
  user?: { id: string; email?: string | null; name?: string | null; phone?: string | null } | null
}

/** Carrega o widget do Chatwoot somente quando URL e token estão configurados. */
export default function ChatwootWidget({ baseUrl, websiteToken, user }: Props) {
  useEffect(() => {
    if (!baseUrl || !websiteToken || typeof window === "undefined") return
    if (document.getElementById("chatwoot-sdk")) return
    const url = baseUrl.replace(/\/$/, "")
    window.chatwootSettings = { locale: "pt_BR", position: "right", type: "standard" }
    const s = document.createElement("script")
    s.id = "chatwoot-sdk"
    s.src = `${url}/packs/js/sdk.js`
    s.async = true
    s.defer = true
    s.onload = () => window.chatwootSDK?.run({ websiteToken, baseUrl: url })
    document.body.appendChild(s)
  }, [baseUrl, websiteToken])

  useEffect(() => {
    if (user?.id && baseUrl && websiteToken) setChatUser(user)
  }, [user?.id, baseUrl, websiteToken]) // eslint-disable-line react-hooks/exhaustive-deps

  return null
}

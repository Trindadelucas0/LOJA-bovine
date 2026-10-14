"use client"

import { useState } from "react"
import { useSearchParams } from "next/navigation"

import Register from "@modules/account/components/register"
import Login from "@modules/account/components/login"

export enum LOGIN_VIEW {
  SIGN_IN = "sign-in",
  REGISTER = "register",
}

const LoginTemplate = () => {
  const [currentView, setCurrentView] = useState("sign-in")
  const searchParams = useSearchParams()
  const raw = searchParams.get("redirect") || ""
  // somente caminhos internos
  const redirectTo = raw.startsWith("/") && !raw.startsWith("//") ? raw : ""
  const fromCheckout = redirectTo.includes("/checkout")

  return (
    <div className="w-full flex flex-col items-start px-8 py-8 gap-4">
      {fromCheckout && (
        <div
          role="status"
          className="max-w-sm w-full rounded-ava-md border border-brand/30 bg-brand/10 text-ink px-4 py-3 text-body-sm font-semibold"
          data-testid="checkout-login-required"
        >
          Entre ou crie sua conta para finalizar o pedido. Seu carrinho será mantido.
        </div>
      )}
      {currentView === "sign-in" ? (
        <Login setCurrentView={setCurrentView} redirectTo={redirectTo} />
      ) : (
        <Register setCurrentView={setCurrentView} redirectTo={redirectTo} />
      )}
    </div>
  )
}

export default LoginTemplate

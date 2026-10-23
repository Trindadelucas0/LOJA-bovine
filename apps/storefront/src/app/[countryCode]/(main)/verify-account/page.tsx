import { Metadata } from "next"
import { Suspense } from "react"

import VerifyAccount from "@modules/account/components/verify-account"

export const metadata: Metadata = {
  title: "Verifique seu e-mail",
  description: "Verifique seu endereço de e-mail para concluir o cadastro.",
}

export default function VerifyAccountPage() {
  return (
    <div className="w-full flex justify-center px-8 py-12">
      <Suspense
        fallback={
          <p className="text-base-regular text-ink">
            Verificando seu e-mail...
          </p>
        }
      >
        <VerifyAccount />
      </Suspense>
    </div>
  )
}

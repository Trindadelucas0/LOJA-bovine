import { Metadata } from "next"

import LoginTemplate from "@modules/account/templates/login-template"

export const metadata: Metadata = {
  title: "Entrar",
  description: "Entre na sua conta da Minha Loja.",
}

export default function Login() {
  return <LoginTemplate />
}

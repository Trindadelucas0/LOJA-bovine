import { getBaseURL } from "@lib/util/env"
import RegisterSW from "@modules/avadesk/components/pwa/register-sw"
import { Metadata, Viewport } from "next"
import { Inter, Plus_Jakarta_Sans } from "next/font/google"
import "styles/globals.css"

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" })
const jakarta = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["500", "600", "700", "800"],
  variable: "--font-jakarta",
  display: "swap",
})

const APP_NAME = "BOVINE Saúde Animal e Agro"

export const metadata: Metadata = {
  metadataBase: new URL(getBaseURL()),
  applicationName: APP_NAME,
  manifest: "/manifest.webmanifest",
  appleWebApp: {
    capable: true,
    title: "BOVINE",
    statusBarStyle: "default",
  },
  formatDetection: { telephone: false },
  icons: {
    icon: [
      { url: "/icons/icon-32.png", sizes: "32x32", type: "image/png" },
      { url: "/icons/icon-192.png", sizes: "192x192", type: "image/png" },
    ],
    apple: [{ url: "/icons/apple-touch-icon.png", sizes: "180x180" }],
  },
  other: { "mobile-web-app-capable": "yes" },
}

export const viewport: Viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#0E2439",
}

export default function RootLayout(props: { children: React.ReactNode }) {
  return (
    <html lang="pt-BR" data-mode="light" className={`${inter.variable} ${jakarta.variable}`}>
      <head>
        {/* eslint-disable-next-line @next/next/no-page-custom-font */}
        <link
          rel="stylesheet"
          href="https://fonts.googleapis.com/css2?family=Material+Symbols+Outlined:opsz,wght,FILL,GRAD@20..48,400,0..1,0&display=block"
        />
      </head>
      <body className="bg-canvas text-ink font-sans antialiased">
        <main className="relative">{props.children}</main>
        <RegisterSW />
      </body>
    </html>
  )
}

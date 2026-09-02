import "./globals.css"
import TanstackQueryProvider from "@/components/provider/TanstackQueryProvider"
import AntConfigProvider from "@/components/provider/AntConfigProvider"
import type { Metadata } from "next"

export const metadata: Metadata = {
  title: "Starter Pack",
  description: "Starter Pack Using NestJS and NextJS",
}

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>
        <AntConfigProvider>
          <TanstackQueryProvider>{children}</TanstackQueryProvider>
        </AntConfigProvider>
      </body>
    </html>
  )
}

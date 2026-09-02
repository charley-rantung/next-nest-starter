"use client"

import { useRouter } from "next/navigation"
import { Card } from "antd"
import { RequestPasswordResetForm } from "@/modules/user"

export default function ForgotPasswordPage() {
  const router = useRouter()

  return (
    <div>
      <section className="flex items-center justify-center h-screen p-8">
        <div className="w-80">
          <div className="mb-8">
            <h1 className="text-center font-bold text-2xl">Lupa Password?</h1>
            <h2 className="text-center">Masukkan email Anda untuk menerima link reset.</h2>
          </div>
          <Card>
            <RequestPasswordResetForm
              onSuccess={(data) => {
                router.push(`/auth/recovery/code?email=${data.email}`)
              }}
            />
          </Card>
        </div>
      </section>
    </div>
  )
}

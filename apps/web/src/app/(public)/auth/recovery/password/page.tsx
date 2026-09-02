"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useRecoveryStore } from "@/store/recovery.store"
import { Card } from "antd"
import { ResetPasswordForm } from "@/modules/user"

export default function ResetPasswordPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")
  const token = useRecoveryStore((s) => s.token)

  useEffect(() => {
    if (!token || !email) router.back()
  }, [token, email])

  if (!token || !email) return

  return (
    <div>
      <section className="flex items-center justify-center h-screen p-8">
        <div className="w-80">
          <div className="mb-8">
            <h1 className="text-center font-bold text-2xl">Setel Ulang Kata Sandi</h1>
            <h2 className="text-center">Silakan masukkan kata sandi baru anda</h2>
          </div>
          <Card>
            <ResetPasswordForm
              email={email}
              token={token}
              onSuccess={() => {
                router.push("/auth/sign-in")
              }}
            />
          </Card>
        </div>
      </section>
    </div>
  )
}

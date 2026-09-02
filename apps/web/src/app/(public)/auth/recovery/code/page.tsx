"use client"

import { useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { useRecoveryStore } from "@/store/recovery.store"
import { Card } from "antd"
import { RecoveryCodeForm } from "@/modules/user"

export default function RecoveryCodePage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const email = searchParams.get("email")

  const setToken = useRecoveryStore((s) => s.setToken)

  useEffect(() => {
    if (!email) router.replace("/auth/recovery/initiate")
  }, [email])

  if (!email) return

  return (
    <div>
      <section className="flex items-center justify-center h-screen p-8">
        <div className="w-80">
          <div className="mb-8">
            <h1 className="text-center font-bold text-2xl">Masukkan kode OTP</h1>
            <h2 className="text-center">Kode OTP dikirim ke: {email}</h2>
          </div>
          <Card>
            <RecoveryCodeForm
              email={email}
              onSuccess={(_, res) => {
                setToken(res.data.token)
                router.push(`/auth/recovery/password?email=${email}`)
              }}
            />
          </Card>
        </div>
      </section>
    </div>
  )
}

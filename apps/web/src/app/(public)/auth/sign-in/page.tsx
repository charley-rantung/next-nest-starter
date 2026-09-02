"use client"

import { useSignInController } from "./controller"
import { Card, Divider } from "antd"
import { SignInForm } from "@/modules/user"
import Link from "next/link"
import Image from "next/image"
import Logo from "@/assets/icons8-captain-america.svg"

export default function LoginPage() {
  const c = useSignInController()

  return (
    <div>
      <section className="flex items-center justify-center h-screen p-8">
        <div className="w-80">
          <Card>
            <div className="h-28">
              <Image src={Logo} height={80} width={80} alt="" className="mx-auto" />
            </div>
            <SignInForm onSuccess={c.onSignInSuccess} />
            <Divider />
            <div>
              <p className="text-center">
                <Link href="/auth/recovery/initiate">Lupa Password?</Link>
              </p>
            </div>
          </Card>
        </div>
      </section>
    </div>
  )
}

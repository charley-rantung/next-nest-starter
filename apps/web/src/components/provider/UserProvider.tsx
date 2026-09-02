import { cookies } from "next/headers"
import { redirect } from "next/navigation"
import { jwtVerify } from "jose"
import { JWT_ACCESS_TOKEN_SECRET } from "@/constant/private"
import UserHydrate from "../UserHydrate"
import type { AccessTokenPayload } from "@starter-pack/api-contracts"

export default async function UserProvider({ children }: React.PropsWithChildren) {
  let user: AccessTokenPayload["user"] | null = null

  try {
    const accessToken = (await cookies()).get("access-token")?.value
    if (!accessToken) throw new Error()

    const { payload } = await jwtVerify<AccessTokenPayload>(
      accessToken,
      new TextEncoder().encode(JWT_ACCESS_TOKEN_SECRET),
    )
    user = payload.user
  } catch {
    redirect("/auth/sign-in")
  }

  return (
    <>
      <UserHydrate user={user} />

      {children}
    </>
  )
}

import * as jose from "jose"
import { NextRequest, NextResponse } from "next/server"
import { refreshToken } from "./api/main/user/auth"
import { JWT_ACCESS_TOKEN_SECRET } from "./constant/private"
import { PRIVATE_ROUTE_PREFIX } from "./constant/public"
import type { AccessTokenPayload } from "@starter-pack/api-contracts"

export async function proxy(req: NextRequest) {
  const currentRoute = req.nextUrl.pathname
  const privateRoute = PRIVATE_ROUTE_PREFIX
  const loginRoute = "/auth/sign-in"

  // Handle sign-in route
  if (currentRoute === loginRoute) {
    try {
      await validateAccessToken(req)
      return NextResponse.redirect(new URL(privateRoute, req.url))
    } catch {
      try {
        const res = NextResponse.redirect(new URL(privateRoute, req.url))
        return await refreshAccessToken(req, res)
      } catch {
        return NextResponse.next()
      }
    }
  }

  // Handle private route
  else if (currentRoute.startsWith(privateRoute)) {
    try {
      await validateAccessToken(req)
      return NextResponse.next()
    } catch {
      try {
        const res = NextResponse.next()
        return await refreshAccessToken(req, res)
      } catch {
        return NextResponse.redirect(new URL(loginRoute, req.url))
      }
    }
  }

  // Handle public route
  else {
    return NextResponse.next()
  }
}

const validateAccessToken = async (req: NextRequest) => {
  try {
    const token = req.cookies.get("access-token")
    if (!token || !token.value) throw new Error("Access token not found")

    return jose.jwtVerify<AccessTokenPayload>(token.value, new TextEncoder().encode(JWT_ACCESS_TOKEN_SECRET))
  } catch (err) {
    throw err
  }
}

const refreshAccessToken = async (req: NextRequest, res: NextResponse) => {
  try {
    const token = req.cookies.get("refresh-token")
    if (!token || !token.value) throw new Error("Refresh token not found")

    const cookies = (
      await refreshToken({
        headers: {
          Cookie: req.cookies.toString(),
        },
      })
    ).headers["set-cookie"]

    if (!cookies || cookies.length === 0) throw new Error("Failed to refresh token: No new cookies returned")

    if (Array.isArray(cookies)) {
      cookies.forEach((e) => res.headers.append("Set-Cookie", e))
    } else {
      res.headers.set("Set-Cookie", cookies)
    }

    return res
  } catch (err) {
    throw err
  }
}

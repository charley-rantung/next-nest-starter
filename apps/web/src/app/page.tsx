import { Button, Flex } from "antd"
import Link from "next/link"

export default function HomePage() {
  return (
    <div className="w-full h-full">
      <section className="w-full h-screen">
        <Flex align="center" justify="center" className="h-full w-full">
          <Link href="/auth/sign-in">
            <Button type="primary">Go to Sign-In Page</Button>
          </Link>
        </Flex>
      </section>
    </div>
  )
}

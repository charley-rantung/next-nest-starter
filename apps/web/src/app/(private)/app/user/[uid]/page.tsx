"use client"

import { use } from "react"
import { Card } from "antd"
import { UpdateUserForm } from "@/modules/user"

type UserPageProps = {
  params: Promise<{ uid: string }>
}

export default function UserPage(props: UserPageProps) {
  const { uid } = use(props.params)

  return (
    <div>
      <section>
        <Card title="User">
          <UpdateUserForm uid={uid} />
        </Card>
      </section>
    </div>
  )
}

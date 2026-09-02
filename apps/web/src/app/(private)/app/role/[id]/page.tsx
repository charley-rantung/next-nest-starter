"use client"

import { use } from "react"
import { Card } from "antd"
import { UpdateRoleForm } from "@/modules/user"

type RolePageProps = {
  params: Promise<{ id: number }>
}

export default function RolePage(props: RolePageProps) {
  const { id } = use(props.params)

  return (
    <div>
      <section>
        <Card title="Role">
          <UpdateRoleForm id={id} />
        </Card>
      </section>
    </div>
  )
}

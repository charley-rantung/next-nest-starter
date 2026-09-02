"use client"

import { Card } from "antd"
import { CreateRoleForm } from "@/modules/user"

export default function CreateRolePage() {
  return (
    <div>
      <section>
        <Card title="Role">
          <CreateRoleForm />
        </Card>
      </section>
    </div>
  )
}

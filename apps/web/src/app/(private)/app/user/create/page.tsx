"use client"

import { Card } from "antd"
import { CreateUserForm } from "@/modules/user"

export default function CreateUserPage() {
  return (
    <div>
      <section>
        <Card title="User">
          <CreateUserForm />
        </Card>
      </section>
    </div>
  )
}

"use client"

import { useAccountController } from "./controller"
import { UpdateMyPasswordForm } from "@/modules/user"
import { Button, Card, Descriptions, Modal, Table, Typography, type DescriptionsProps } from "antd"

export default function ProfilePage() {
  const c = useAccountController()

  const items: DescriptionsProps["items"] = [
    {
      key: "Name",
      label: "Name",
      children: c.user.data?.data.data?.name,
    },
    {
      key: "Username",
      label: "Username",
      children: c.user.data?.data.data?.username,
    },
    {
      key: "Password",
      label: "Password",
      children: (
        <Button type="primary" onClick={() => c.setIsModalOpen(true)}>
          Change Password
        </Button>
      ),
    },
  ]

  return (
    <div>
      <section>
        <Card>
          <Descriptions title="Account" items={items} bordered column={1} />
          <br />
          <Typography.Title level={5}>Session Record</Typography.Title>
          <Table
            dataSource={c.sessions.data?.data.data}
            rowKey="created_at"
            columns={[
              {
                key: "ip_address",
                dataIndex: "ip_address",
                title: "IP Address",
              },
              {
                key: "user_agent",
                dataIndex: "user_agent",
                title: "User Agent",
              },
              {
                key: "created_at",
                dataIndex: "created_at",
                title: "Created At",
              },
              {
                key: "last_used_at",
                dataIndex: "last_used_at",
                title: "Last Activity",
              },
              {
                key: "action",
                title: "Action",
                render: () => <Button>Revoke</Button>,
              },
            ]}
          />
        </Card>
      </section>
      <Modal
        open={c.isModalOpen}
        footer={null}
        onCancel={() => {
          c.setIsModalOpen(false)
        }}
      >
        <UpdateMyPasswordForm
          onSuccess={() => {
            c.setIsModalOpen(false)
          }}
        />
      </Modal>
    </div>
  )
}

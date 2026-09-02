"use client"

import { useRoleListController } from "./controller"
import Link from "next/link"
import { Button, Card, Input, Space, Table, TableProps } from "antd"
import { EditOutlined, FilterOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons"
import { PRIVATE_ROUTE_PREFIX } from "@/constant/public"
import type { RoleListResponse } from "@starter-pack/api-contracts"

export default function RolesPage() {
  const c = useRoleListController()

  const columns: TableProps<RoleListResponse["data"][number]>["columns"] = [
    {
      title: "Actions",
      dataIndex: "id",
      key: "id",
      width: 1,
      align: "center",
      fixed: "left",
      render: (data) => (
        <Link href={`${PRIVATE_ROUTE_PREFIX}/role/${data}`}>
          <Button icon={<EditOutlined />} />
        </Link>
      ),
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Description",
      dataIndex: "description",
      key: "description",
    },
  ]

  return (
    <div>
      <section>
        <Card
          title={
            <Space orientation="vertical" className="py-6" size="middle">
              <h1 className="text-xl">Roles</h1>
              <Space>
                <Link href={`${PRIVATE_ROUTE_PREFIX}/role/create`}>
                  <Button type="primary" size="large" icon={<PlusOutlined />}>
                    New
                  </Button>
                </Link>
                <Button
                  size="large"
                  shape="circle"
                  icon={<ReloadOutlined />}
                  loading={c.roles.isRefetching}
                  onClick={() => {
                    c.roles.refetch()
                  }}
                />
                <Button size="large" shape="circle" icon={<FilterOutlined />} disabled />
                <Input
                  size="large"
                  placeholder="Search"
                  onChange={(e) => {
                    c.handleSearch(e.target.value)
                  }}
                  allowClear
                />
              </Space>
            </Space>
          }
        >
          <Table
            columns={columns}
            dataSource={c.roles.data?.data.data}
            rowKey={(data) => data.id}
            loading={c.roles.isLoading}
            pagination={{
              current: c.query.page,
              pageSize: c.query.size,
              total: c.roles.data?.data.meta.total,
            }}
            onChange={(pagination) => {
              c.setQuery({
                page: pagination.current || 1,
                size: pagination.pageSize || 10,
              })
            }}
            size="small"
            tableLayout="auto"
            scroll={{ x: "max-content" }}
            bordered
          />
        </Card>
      </section>
    </div>
  )
}

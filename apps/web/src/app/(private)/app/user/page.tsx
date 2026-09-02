"use client"

import { useUserListController } from "./controller"
import Link from "next/link"
import dayjs from "@/utils/dayjs.util"
import { Button, Card, Checkbox, Drawer, Form, Input, Select, Space, Table, TableProps } from "antd"
import { EditOutlined, FilterOutlined, PlusOutlined, ReloadOutlined } from "@ant-design/icons"
import { PRIVATE_ROUTE_PREFIX } from "@/constant/public"
import { Controller } from "react-hook-form"
import type { UserListResponse } from "@starter-pack/api-contracts"

export default function UsersPage() {
  const c = useUserListController()

  const {
    control,
    formState: { errors },
  } = c.filterForm

  const columns: TableProps<UserListResponse["data"][number]>["columns"] = [
    {
      title: "Actions",
      dataIndex: "uid",
      key: "uid",
      width: 1,
      align: "center",
      fixed: "left",
      render: (data) => (
        <Link href={`${PRIVATE_ROUTE_PREFIX}/user/${data}`}>
          <Button icon={<EditOutlined />} />
        </Link>
      ),
    },
    {
      title: "Active",
      dataIndex: "is_active",
      key: "is_active",
      width: 1,
      align: "center",
      render: (data) => <Checkbox checked={data} />,
    },
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
    },
    {
      title: "Created At",
      dataIndex: "created_at",
      key: "created_at",
      render: (data) => dayjs(data).format("YYYY-MM-DD HH:mm:ss"),
    },
    {
      title: "Updated At",
      dataIndex: "updated_at",
      key: "updated_at",
      render: (data) => dayjs(data).format("YYYY-MM-DD HH:mm:ss"),
    },
  ]

  return (
    <div>
      <section>
        <Card
          title={
            <Space orientation="vertical" className="py-6" size="middle">
              <h1 className="text-xl">Users</h1>
              <Space>
                <Link href={`${PRIVATE_ROUTE_PREFIX}/user/create`}>
                  <Button type="primary" size="large" icon={<PlusOutlined />}>
                    New
                  </Button>
                </Link>
                <Button
                  size="large"
                  shape="circle"
                  icon={<ReloadOutlined />}
                  loading={c.users.isRefetching}
                  onClick={() => {
                    c.users.refetch()
                  }}
                />
                <Button
                  size="large"
                  shape="circle"
                  icon={<FilterOutlined />}
                  onClick={() => c.setIsFilterDrawerOpen(true)}
                />
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
            dataSource={c.users.data?.data.data}
            rowKey={(data) => data.username}
            loading={c.users.isLoading}
            pagination={{
              current: c.query.page,
              pageSize: c.query.size,
              total: c.users.data?.data.meta.total,
              showTotal: (total, range) => `${range[0]}-${range[1]} of ${total}`,
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
      <Drawer
        title="Filter"
        closable={{ "aria-label": "Close Button" }}
        onClose={() => c.setIsFilterDrawerOpen(false)}
        open={c.isFilterDrawerOpen}
      >
        <Form layout="vertical" onFinish={c.handleFilter} requiredMark="optional">
          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Type"
                validateStatus={errors.type ? "error" : undefined}
                help={errors.type?.message}
                required
              >
                <Select {...field} allowClear>
                  <Select.Option value="user">User</Select.Option>
                  <Select.Option value="admin">Administrator</Select.Option>
                </Select>
              </Form.Item>
            )}
          />
          <Controller
            name="active"
            control={control}
            render={({ field }) => (
              <Form.Item
                label="Status"
                validateStatus={errors.active ? "error" : undefined}
                help={errors.active?.message}
                required
              >
                <Select {...field} allowClear>
                  <Select.Option value={1}>Active</Select.Option>
                  <Select.Option value={0}>Inactive</Select.Option>
                </Select>
              </Form.Item>
            )}
          />
          <Form.Item>
            <Button block htmlType="submit" type="primary" className="mt-4" loading={c.users.isLoading}>
              Apply
            </Button>
          </Form.Item>
        </Form>
      </Drawer>
    </div>
  )
}

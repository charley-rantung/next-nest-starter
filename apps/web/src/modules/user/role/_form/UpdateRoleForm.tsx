import { useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RoleUpdateSchema } from "@starter-pack/api-contracts"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getRoleQueryOptions, updateRoleMutationOptions } from "@/api/main/user/role/query"
import { getPermissionsQueryOptions } from "@/api/main/user/permission/query"
import { App, Button, Empty, Form, Input, Select, Skeleton } from "antd"

export const useUpdateRoleForm = () =>
  useForm({
    resolver: zodResolver(RoleUpdateSchema.body),
  })

type UpdateRoleFormProps = {
  id: number
  onSuccess?: () => void
  onError?: () => void
}

export function UpdateRoleForm(props: UpdateRoleFormProps) {
  const { notification } = App.useApp()

  const role = useQuery(getRoleQueryOptions({ id: props.id }))
  const permissions = useQuery(getPermissionsQueryOptions())

  const action = useMutation(updateRoleMutationOptions())
  const form = useUpdateRoleForm()
  const handleSubmit = form.handleSubmit((data) => {
    action.mutate(
      {
        params: {
          id: props.id,
        },
        body: {
          name: data.name,
          description: data.description,
          permissions: data.permissions,
        },
      },
      {
        onSuccess: (res) => {
          form.reset({
            name: res.data.data.name,
            description: res.data.data.description ?? "",
            permissions: res.data.data.permissions.map((p) => p.id),
          })
          notification.success({
            title: "Success",
            description: res.data.message,
          })
          props.onSuccess?.()
        },
        onError: (err) => {
          notification.error({
            title: err.response?.statusText || "Failed",
            description: err.response?.data.message || err.message,
          })
          props.onError?.()
        },
      },
    )
  })

  useEffect(() => {
    if (role.data?.data.data) {
      form.reset({
        name: role.data.data.data.name,
        description: role.data.data.data.description ?? "",
        permissions: role.data.data.data.permissions.map((p) => p.id),
      })
    }
  }, [role.data, form])

  if (role.isLoading) {
    return <Skeleton />
  }

  if (!role.data?.data.data) {
    return <Empty />
  }

  return (
    <Form layout="vertical" onFinish={handleSubmit} requiredMark="optional">
      <Controller
        name="name"
        control={form.control}
        render={({ field, fieldState }) => (
          <Form.Item
            label="Name"
            validateStatus={fieldState.error ? "error" : undefined}
            help={fieldState.error?.message}
            required
          >
            <Input {...field} />
          </Form.Item>
        )}
      />
      <Controller
        name="description"
        control={form.control}
        render={({ field, fieldState }) => (
          <Form.Item
            label="Description"
            validateStatus={fieldState.error ? "error" : undefined}
            help={fieldState.error?.message}
          >
            <Input {...field} value={field.value ?? ""} />
          </Form.Item>
        )}
      />
      <Controller
        name="permissions"
        control={form.control}
        render={({ field, fieldState }) => (
          <Form.Item
            label="Permissions"
            validateStatus={fieldState.error ? "error" : undefined}
            help={
              fieldState.error?.message ||
              (Array.isArray(fieldState.error) && fieldState.error.find((data) => data.message).message)
            }
          >
            <Select
              {...field}
              loading={permissions.isLoading}
              mode="multiple"
              options={permissions.data?.data.data.map((p) => ({
                label: p.name,
                value: p.id,
              }))}
              showSearch={{ optionFilterProp: ["label"] }}
              allowClear
            />
          </Form.Item>
        )}
      />
      <Form.Item>
        <Button block type="primary" htmlType="submit" className="mt-4" loading={action.isPending}>
          Update
        </Button>
      </Form.Item>
    </Form>
  )
}

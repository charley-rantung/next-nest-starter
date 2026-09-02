import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RoleCreateSchema } from "@starter-pack/api-contracts"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getPermissionsQueryOptions } from "@/api/main/user/permission/query"
import { createRoleMutationOptions } from "@/api/main/user/role/query"
import { App, Button, Form, Input, Select } from "antd"

export const useCreateRoleForm = () =>
  useForm({
    resolver: zodResolver(RoleCreateSchema.body),
  })

type CreateRoleFormProps = {
  onSuccess?: () => void
  onError?: () => void
}

export function CreateRoleForm(props: CreateRoleFormProps) {
  const { notification } = App.useApp()

  const permissions = useQuery(getPermissionsQueryOptions())

  const action = useMutation(createRoleMutationOptions())
  const form = useCreateRoleForm()
  const handleSubmit = form.handleSubmit((data) => {
    action.mutate(
      {
        body: {
          name: data.name,
          description: data.description,
          permissions: data.permissions,
        },
      },
      {
        onSuccess: (res) => {
          form.reset()
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
          Create
        </Button>
      </Form.Item>
    </Form>
  )
}

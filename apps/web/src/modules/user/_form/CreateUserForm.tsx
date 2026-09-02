import { zodResolver } from "@hookform/resolvers/zod"
import { Controller, useForm } from "react-hook-form"
import { UserCreateSchema } from "@starter-pack/api-contracts"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getRolesQueryOptions } from "@/api/main/user/role/query"
import { createUserMutationOptions } from "@/api/main/user/query"
import { App, Button, Form, Input, Select } from "antd"

export const useCreateUserForm = () =>
  useForm({
    resolver: zodResolver(UserCreateSchema.body),
    defaultValues: {
      type: "user",
    },
  })

type CreateUserFormProps = {
  onSuccess?: () => void
  onError?: () => void
}

export function CreateUserForm(props: CreateUserFormProps) {
  const { notification } = App.useApp()

  const roles = useQuery(getRolesQueryOptions())

  const action = useMutation(createUserMutationOptions())
  const form = useCreateUserForm()
  const handleSubmit = form.handleSubmit((data) => {
    action.mutate(
      {
        body: {
          name: data.name,
          email: data.email,
          username: data.username,
          password: data.password,
          type: data.type,
          roles: data.roles?.map(Number) || [],
          permissions: data.permissions?.map(Number) || [],
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
            <Input {...field} autoFocus />
          </Form.Item>
        )}
      />
      <Controller
        name="email"
        control={form.control}
        render={({ field, fieldState }) => (
          <Form.Item
            label="Email"
            validateStatus={fieldState.error ? "error" : undefined}
            help={fieldState.error?.message}
            required
          >
            <Input {...field} />
          </Form.Item>
        )}
      />
      <Controller
        name="username"
        control={form.control}
        render={({ field, fieldState }) => (
          <Form.Item
            label="Username"
            validateStatus={fieldState.error ? "error" : undefined}
            help={fieldState.error?.message}
            required
          >
            <Input {...field} />
          </Form.Item>
        )}
      />
      <Controller
        name="password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Form.Item
            label="Password"
            validateStatus={fieldState.error ? "error" : undefined}
            help={fieldState.error?.message}
            required
          >
            <Input.Password {...field} autoComplete="new-password" />
          </Form.Item>
        )}
      />
      <Controller
        name="type"
        control={form.control}
        render={({ field, fieldState }) => (
          <Form.Item
            label="Type"
            validateStatus={fieldState.error ? "error" : undefined}
            help={fieldState.error?.message}
            required
          >
            <Select
              {...field}
              options={[
                { label: "User", value: "user" },
                { label: "Administrator", value: "admin" },
              ]}
            />
          </Form.Item>
        )}
      />
      <Controller
        name="roles"
        control={form.control}
        render={({ field, fieldState }) => (
          <Form.Item
            label="Roles"
            validateStatus={fieldState.error ? "error" : undefined}
            help={
              fieldState.error?.message ||
              (Array.isArray(fieldState.error) && fieldState.error.find((data) => data.message).message)
            }
          >
            <Select
              {...field}
              loading={roles.isLoading}
              mode="multiple"
              options={roles.data?.data.data.map((role) => ({
                label: role.name,
                value: role.id,
              }))}
              showSearch={{ optionFilterProp: ["label"] }}
              allowClear
            />
          </Form.Item>
        )}
      />
      <Form.Item>
        <Button block htmlType="submit" type="primary" className="mt-4" loading={action.isPending}>
          Create
        </Button>
      </Form.Item>
    </Form>
  )
}

import { useCallback, useEffect } from "react"
import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { UserDetailResponse, UserUpdateSchema } from "@starter-pack/api-contracts"
import { useMutation, useQuery } from "@tanstack/react-query"
import { getUserQueryOptions, updateUserMutationOptions } from "@/api/main/user/query"
import { getRolesQueryOptions } from "@/api/main/user/role/query"
import { App, Button, Empty, Form, Input, Select, Skeleton } from "antd"

export const useUpdateUserForm = () =>
  useForm({
    resolver: zodResolver(UserUpdateSchema.body),
    defaultValues: {}
  })

type UpdateUserFormProps = {
  uid: string
  onSuccess?: () => void
  onError?: () => void
}

export function UpdateUserForm(props: UpdateUserFormProps) {
  const { notification } = App.useApp()

  const user = useQuery(getUserQueryOptions({ uid: props.uid }))
  const roles = useQuery(getRolesQueryOptions())

  const action = useMutation(updateUserMutationOptions())
  const form = useUpdateUserForm()
  const resetForm = useCallback(
    (data: UserDetailResponse) => {
      const user = data.data
      if (!user) return

      form.reset({
        name: user.name,
        username: user.username,
        type: user.type === "user" ? "user" : "admin",
        roles: user.roles.map((role) => role.id)
      })
    },
    [form]
  )
  const handleSubmit = form.handleSubmit((data) => {
    action.mutate(
      {
        params: {
          uid: props.uid
        },
        body: {
          username: data.username,
          name: data.name,
          type: data.type,
          roles: data.roles,
          permissions: data.permissions
        }
      },
      {
        onSuccess: (res) => {
          resetForm(res.data)
          notification.success({
            title: "Success",
            description: res.data.message
          })
          props.onSuccess?.()
        },
        onError: (err) => {
          notification.error({
            title: err.response?.statusText || "Failed",
            description: err.response?.data.message || err.message
          })
          props.onError?.()
        }
      }
    )
  })

  useEffect(() => {
    if (user.data?.data.data) {
      resetForm(user.data.data)
    }
  }, [user.data, resetForm])

  if (user.isLoading) {
    return <Skeleton />
  }

  if (!user.data?.data.data) {
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
                { label: "Administrator", value: "admin" }
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
                value: role.id
              }))}
              showSearch={{ optionFilterProp: "label" }}
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

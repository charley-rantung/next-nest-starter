import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ResetPasswordSchema, type ResetPasswordBody, type ResetPasswordResponse } from "@starter-pack/api-contracts"
import { useMutation } from "@tanstack/react-query"
import { resetPasswordMutationOptions } from "@/api/main/user/auth/query"
import { App, Button, Form, Input } from "antd"
import { LockOutlined } from "@ant-design/icons"

export const useResetPasswordForm = (token: string) =>
  useForm({
    resolver: zodResolver(ResetPasswordSchema.body),
    defaultValues: {
      token,
    },
  })

type ResetPasswordFormProps = {
  email: string
  token: string
  onSuccess?: (form: ResetPasswordBody, res: ResetPasswordResponse) => void
  onError?: () => void
}

export function ResetPasswordForm(props: ResetPasswordFormProps) {
  const { notification } = App.useApp()

  const action = useMutation(resetPasswordMutationOptions())
  const form = useResetPasswordForm(props.token)
  const handleSubmit = form.handleSubmit((data) => {
    action.mutate(
      {
        body: {
          email: props.email,
          password: data.password,
          token: data.token,
        },
      },
      {
        onSuccess: (res) => {
          notification.success({
            title: "Success",
            description: res.data.message,
          })
          props.onSuccess?.(data, res.data)
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
    <Form onFinish={handleSubmit} layout="vertical" size="large">
      <fieldset>
        <Form.Item
          validateStatus={form.formState.errors.password ? "error" : undefined}
          help={form.formState.errors.password?.message}
        >
          <Controller
            name="password"
            control={form.control}
            render={({ field }) => (
              <Input.Password
                {...field}
                prefix={<LockOutlined />}
                placeholder="password"
                autoComplete="new-password"
                autoFocus
              />
            )}
          />
        </Form.Item>
        <Form.Item>
          <Button block type="primary" htmlType="submit" className="mt-4" loading={action.isPending}>
            Atur
          </Button>
        </Form.Item>
      </fieldset>
    </Form>
  )
}

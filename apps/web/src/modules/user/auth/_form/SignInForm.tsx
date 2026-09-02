import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { SignInSchema } from "@starter-pack/api-contracts"
import { useMutation } from "@tanstack/react-query"
import { signInMutationOptions } from "@/api/main/user/auth/query"
import { App, Button, Form, Input } from "antd"
import { LockOutlined, UserOutlined } from "@ant-design/icons"

export const useSignInForm = () =>
  useForm({
    resolver: zodResolver(SignInSchema.body),
  })

type SignInFormProps = {
  onSuccess?: () => void
  onError?: () => void
}

export function SignInForm(props: SignInFormProps) {
  const { notification } = App.useApp()

  const action = useMutation(signInMutationOptions())
  const form = useSignInForm()
  const handleSubmit = form.handleSubmit((data) => {
    action.mutate(
      {
        body: {
          username: data.username,
          password: data.password,
        },
      },
      {
        onSuccess: () => {
          props.onSuccess?.()
        },
        onError: (err) => {
          notification.error({
            title: err.response?.statusText || "Failed",
            description: `${err.response?.data.requestId}: ${err.response?.data.message || err.message}`,
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
          validateStatus={form.formState.errors.username ? "error" : undefined}
          help={form.formState.errors.username?.message}
        >
          <Controller
            name="username"
            control={form.control}
            render={({ field }) => <Input {...field} prefix={<UserOutlined />} placeholder="username" autoFocus />}
          />
        </Form.Item>
        <Form.Item
          validateStatus={form.formState.errors.password ? "error" : undefined}
          help={form.formState.errors.password?.message}
        >
          <Controller
            name="password"
            control={form.control}
            render={({ field }) => (
              <Input.Password {...field} prefix={<LockOutlined />} placeholder="password" autoComplete="new-password" />
            )}
          />
        </Form.Item>
        <Form.Item>
          <Button block type="primary" htmlType="submit" className="mt-4" loading={action.isPending}>
            Sign In
          </Button>
        </Form.Item>
      </fieldset>
    </Form>
  )
}

import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { RequestPasswordResetSchema, type RequestPasswordResetBody } from "@starter-pack/api-contracts"
import { useMutation } from "@tanstack/react-query"
import { requestPasswordResetMutationOptions } from "@/api/main/user/auth/query"
import { App, Button, Form, Input } from "antd"
import { MailOutlined } from "@ant-design/icons"

export const useRequestPasswordResetForm = () =>
  useForm({
    resolver: zodResolver(RequestPasswordResetSchema.body),
  })

type RequestPasswordResetFormProps = {
  onSuccess?: (data: RequestPasswordResetBody) => void
  onError?: () => void
}

export function RequestPasswordResetForm(props: RequestPasswordResetFormProps) {
  const { notification } = App.useApp()

  const action = useMutation(requestPasswordResetMutationOptions())
  const form = useRequestPasswordResetForm()
  const handleSubmit = form.handleSubmit((data) => {
    action.mutate(
      {
        body: {
          email: data.email,
        },
      },
      {
        onSuccess: (res) => {
          notification.success({
            title: "Success",
            description: res.data.message,
          })
          props.onSuccess?.(data)
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
          validateStatus={form.formState.errors.email ? "error" : undefined}
          help={form.formState.errors.email?.message}
        >
          <Controller
            name="email"
            control={form.control}
            render={({ field }) => (
              <Input {...field} prefix={<MailOutlined />} placeholder="email@domain.com" inputMode="email" autoFocus />
            )}
          />
        </Form.Item>
        <Form.Item>
          <Button block type="primary" htmlType="submit" className="mt-4" loading={action.isPending}>
            Kirim
          </Button>
        </Form.Item>
      </fieldset>
    </Form>
  )
}

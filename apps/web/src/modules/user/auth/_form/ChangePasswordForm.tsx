import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { ChangePasswordSchema } from "@starter-pack/api-contracts"
import { useMutation } from "@tanstack/react-query"
import { changePasswordMutationOptions } from "@/api/main/user/auth/query"
import { App, Button, Form, Input } from "antd"

export const useChangePasswordForm = () =>
  useForm({
    resolver: zodResolver(ChangePasswordSchema.body)
  })

type ChangePasswordFormProps = {
  onSuccess?: () => void
  onError?: () => void
}

export function ChangePasswordForm(props: ChangePasswordFormProps) {
  const { notification } = App.useApp()

  const action = useMutation(changePasswordMutationOptions())
  const form = useChangePasswordForm()
  const handleSubmit = form.handleSubmit((data) => {
    action.mutate(
      {
        body: {
          old_password: data.old_password,
          new_password: data.new_password
        }
      },
      {
        onSuccess: (res) => {
          form.reset()
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

  return (
    <Form layout="vertical" onFinish={handleSubmit} requiredMark="optional">
      <Controller
        name="old_password"
        control={form.control}
        render={({ field, fieldState }) => (
          <Form.Item
            label="Old Password"
            validateStatus={fieldState.error ? "error" : undefined}
            help={fieldState.error?.message}
            required
          >
            <Input.Password {...field} autoFocus />
          </Form.Item>
        )}
      />
      <Controller
        name="new_password"
        control={form.control}
        render={({ field, fieldState }) => (
          <>
            <Form.Item
              label="New Password"
              validateStatus={fieldState.error ? "error" : undefined}
              help={fieldState.error?.message}
              required
            >
              <Input.Password {...field} autoFocus />
            </Form.Item>
          </>
        )}
      />
      <Form.Item>
        <Button block htmlType="submit" type="primary" className="mt-4" loading={action.isPending}>
          Save
        </Button>
      </Form.Item>
    </Form>
  )
}

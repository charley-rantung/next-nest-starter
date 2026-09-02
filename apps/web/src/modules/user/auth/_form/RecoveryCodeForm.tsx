import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import {
  VerifyPasswordResetOtpResponse,
  VerifyPasswordResetOtpSchema,
  type VerifyPasswordResetOtpBody,
} from "@starter-pack/api-contracts"
import { useMutation } from "@tanstack/react-query"
import { verifyPasswordResetOtpMutationOptions } from "@/api/main/user/auth/query"
import { App, Button, Form, Input } from "antd"

export const useRecoveryCodeForm = (email: string) =>
  useForm({
    resolver: zodResolver(VerifyPasswordResetOtpSchema.body),
    defaultValues: {
      email: email,
    },
  })

type RecoveryCodeFormProps = {
  onSuccess?: (form: VerifyPasswordResetOtpBody, res: VerifyPasswordResetOtpResponse) => void
  onError?: () => void
  email: string
}

export function RecoveryCodeForm(props: RecoveryCodeFormProps) {
  const { notification } = App.useApp()

  const action = useMutation(verifyPasswordResetOtpMutationOptions())
  const form = useRecoveryCodeForm(props.email)
  const handleSubmit = form.handleSubmit(
    (data) => {
      action.mutate(
        {
          body: {
            email: props.email,
            otp: data.otp,
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
    },
    (err) => console.log(err),
  )

  return (
    <Form onFinish={handleSubmit} layout="vertical" size="large">
      <fieldset>
        <Form.Item
          validateStatus={form.formState.errors.otp ? "error" : undefined}
          help={form.formState.errors.otp?.message}
        >
          <Controller
            name="otp"
            control={form.control}
            render={({ field }) => <Input.OTP {...field} autoFocus inputMode="decimal" />}
          />
        </Form.Item>
        <Form.Item>
          <Button block type="primary" htmlType="submit" className="mt-4" loading={action.isPending}>
            Lanjutkan
          </Button>
        </Form.Item>
      </fieldset>
    </Form>
  )
}

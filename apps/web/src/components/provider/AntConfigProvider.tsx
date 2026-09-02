"use client"

import { AntdRegistry } from "@ant-design/nextjs-registry"
import { App, ConfigProvider } from "antd"

export default function AntConfigProvider({ children }: React.PropsWithChildren) {
  return (
    <AntdRegistry>
      <ConfigProvider>
        <App>{children}</App>
      </ConfigProvider>
    </AntdRegistry>
  )
}

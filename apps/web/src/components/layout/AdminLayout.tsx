"use client"

import Link from "next/link"
import Image from "next/image"
import { usePathname, useRouter } from "next/navigation"
import { Menu, Layout, Popover, Button, MenuProps, Divider, Space } from "antd"
import { HomeOutlined, SettingOutlined, TeamOutlined, UserOutlined } from "@ant-design/icons"
import { useMutation } from "@tanstack/react-query"
import { useUserStore } from "@/store/user.store"
import { refreshTokenMutationOptions, signOutMutationOptions } from "@/api/main/user/auth/query"
import { PRIVATE_ROUTE_PREFIX } from "@/constant/public"
import Logo from "@/assets/placeholder.svg"

const { Header, Content, Footer, Sider } = Layout

const menu: MenuProps["items"] = [
  {
    key: "home",
    label: <Link href={`${PRIVATE_ROUTE_PREFIX}/home`}>Home</Link>,
    icon: <HomeOutlined />,
  },
  {
    key: "settings",
    label: "Settings",
    icon: <SettingOutlined />,
    children: [
      {
        key: "user",
        label: <Link href={`${PRIVATE_ROUTE_PREFIX}/user`}>User</Link>,
        icon: <UserOutlined />,
      },
      {
        key: "user-role",
        label: <Link href={`${PRIVATE_ROUTE_PREFIX}/role`}>Role</Link>,
        icon: <TeamOutlined />,
      },
    ],
  },
]

const menuMap: Record<string, string> = {
  [PRIVATE_ROUTE_PREFIX + "/home"]: "home",
  [PRIVATE_ROUTE_PREFIX + "/user"]: "user",
  [PRIVATE_ROUTE_PREFIX + "/role"]: "user-role",
}

export default function AdminLayout({ children }: React.PropsWithChildren) {
  const pathname = usePathname()
  const router = useRouter()
  const user = useUserStore((s) => s.user)
  const setUser = useUserStore((s) => s.setUser)

  const refreshToken = useMutation(refreshTokenMutationOptions())
  const signOut = useMutation(signOutMutationOptions())

  return (
    <Layout hasSider>
      <Sider theme="light" breakpoint="md" collapsedWidth="0" width="240px">
        <div
          style={{
            height: "100vh",
            position: "sticky",
            top: 0,
            bottom: 0,
            insetInlineStart: 0,
            overflowY: "auto",
            scrollbarWidth: "none",
            scrollbarGutter: "stable",
          }}
        >
          <div id="brand" className="flex items-center justify-center h-16">
            <Image src={Logo} height={0} width={150} alt="" />
          </div>
          <nav id="menu" className="flex-1">
            <Menu
              theme="light"
              mode="inline"
              items={menu}
              selectedKeys={Object.entries(menuMap).find(([key, value]) => (pathname.startsWith(key) ? value[1] : ""))}
            />
          </nav>
        </div>
      </Sider>
      <Layout>
        <Header
          style={{
            position: "sticky",
            top: 0,
            zIndex: 1,
            background: "#ffffff",
          }}
        >
          <div className="flex items-center">
            <div className="flex-1 "></div>
            <div>
              <Popover
                content={
                  user ? (
                    <div>
                      {user.name}
                      <Divider size="small" />
                      <Space orientation="vertical">
                        <Link href={`${PRIVATE_ROUTE_PREFIX}/account`}>
                          <Button block>Account</Button>
                        </Link>
                        <Button
                          block
                          loading={refreshToken.isPending}
                          onClick={() => {
                            refreshToken.mutate(undefined, {
                              onSuccess: () => {
                                // window.location.reload()
                                router.refresh()
                              },
                            })
                          }}
                        >
                          Sync Profile
                        </Button>
                        <Button
                          block
                          loading={signOut.isPending}
                          onClick={() => {
                            signOut.mutate(undefined, {
                              onSuccess: () => {
                                setUser(null)
                                router.replace("/auth/sign-in")
                              },
                            })
                          }}
                        >
                          Logout
                        </Button>
                      </Space>
                    </div>
                  ) : (
                    <></>
                  )
                }
                trigger="click"
              >
                <Button shape="circle" icon={<UserOutlined />} size="large" />
              </Popover>
            </div>
          </div>
        </Header>
        <Content className="m-2 md:m-8">{children}</Content>
        <Footer style={{ textAlign: "center" }}>Copyright ©{new Date().getFullYear()} - Charley Rantung</Footer>
      </Layout>
    </Layout>
  )
}

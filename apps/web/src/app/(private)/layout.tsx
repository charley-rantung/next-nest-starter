import Layout from "@/components/layout/AdminLayout"
import UserProvider from "@/components/provider/UserProvider"

export default function PrivateLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <UserProvider>
      <Layout>{children}</Layout>
    </UserProvider>
  )
}

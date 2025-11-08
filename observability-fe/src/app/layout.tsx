import "@/app/globals.css"
import { Sidebar } from "@/components/Sidebar"

export const metadata = {
  title: "Langfuse Dashboard Clone",
  description: "LLMOps + AgentOps Observability",
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body className="flex bg-gray-50 text-gray-900">
        <Sidebar />
        <div className="ml-64 w-full">{children}</div>
      </body>
    </html>
  )
}

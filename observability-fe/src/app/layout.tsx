import "@/app/globals.css";
import { Sidebar } from "@/components/Sidebar";

export const metadata = {
  title: "Langfuse Dashboard Clone",
  description: "LLMOps + AgentOps Observability",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="h-full">
      <body className="h-full bg-[#0d1117] text-gray-100">
        <Sidebar />
        <main className="ml-64 min-h-screen overflow-y-auto">{children}</main>
      </body>
    </html>
  );
}

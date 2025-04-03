import { SiteHeader } from "@/components/site-header";

export default function Layout({ children }: { children: React.ReactNode }) {
  return (
    <main className="w-full">
      <SiteHeader />
      <div className="p-6">
        {children}
      </div>
    </main>
  )
}
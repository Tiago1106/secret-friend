export default function PublicLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <div className="w-full h-screen items-center justify-center flex">
      {children}
    </div>
  )
}
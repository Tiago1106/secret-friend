'use client'

import { useRouter } from "next/navigation";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import { Button } from "./ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "./ui/dropdown-menu";
import { signOutFirebase } from "@/lib/auth/auth";
import { removeAuthToken } from "@/lib/auth/authCookies";

export function SiteHeader() {
  const router = useRouter()

  const handleSignOut = async () => {
    await signOutFirebase()
    await removeAuthToken()
    router.push('/sign-in')
  }
  
  return (
    <header className="group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 flex h-12 shrink-0 items-center gap-2 border-b transition-[width,height] ease-linear">
      <div className="flex w-full items-center gap-1 px-4 lg:gap-2 lg:px-6 justify-between">
        <h1 className="text-base font-medium">Amigo Secreto</h1>
        <div className="flex flex-row gap-3">
          <Button variant="outline" onClick={() => router.push('/')}>Meus Grupos</Button>
          <DropdownMenu>
            <DropdownMenuTrigger>
              <Avatar className="cursor-pointer">
                <AvatarImage src="https://github.com/shadcn.png" />
                <AvatarFallback>CN</AvatarFallback>
              </Avatar>
            </DropdownMenuTrigger>
            <DropdownMenuContent>
              <DropdownMenuItem onClick={handleSignOut}>Sair</DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </div>
    </header>
  )
}
'use client'

import { cn } from "@/lib/utils"

import { Button } from "@/components/ui/button"
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs"
import { toast } from "sonner";

import { z } from "zod"
import { ZodError } from "zod"
import { useState } from "react"
import { setAuthToken } from "@/helpers/auth/authCookies"
import { useRouter } from "next/navigation"

const loginSchema = z.object({
  email: z.string().email("Email inválido").nonempty("Email é obrigatório"),
  password: z.string().nonempty("Senha é obrigatória"),
})

const registerSchema = z.object({
  email: z.string().email("Email inválido").nonempty("Email é obrigatório"),
  password: z.string().min(6, "Senha deve ter no mínimo 6 caracteres").nonempty("Senha é obrigatória"),
})

type LoginFormValues = {
  email: string
  password: string
}

type RegisterFormValues = {
  email: string
  password: string
}

type FormErrors = {
  email?: string
  password?: string
}

const ErrorText: React.FC<{message?: string}> = ({ message }) => {
  return (
    <div className="text-red-500 text-sm">{message}</div>
  )
}
export function LoginForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter()
  const [selectedTab, setSelectedTab] = useState("login")

  const [loginValues, setLoginValues] = useState<LoginFormValues>({ email: "", password: "" })
  const [registerValues, setRegisterValues] = useState<RegisterFormValues>({ email: "", password: "" })

  const [loginErrors, setLoginErrors] = useState<FormErrors>({})
  const [registerErrors, setRegisterErrors] = useState<FormErrors>({})

  const validateLogin = (values: LoginFormValues) => {
    try {
      loginSchema.parse(values)
      setLoginErrors({})
      return true
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: FormErrors = error.errors.reduce((acc: FormErrors, err) => {
          acc[err.path[0] as keyof FormErrors] = err.message
          return acc
        }, {})
        setLoginErrors(errors)
      }
      return false
    }
  }

  const validateRegister = (values: RegisterFormValues) => {
    try {
      registerSchema.parse(values)
      setRegisterErrors({})
      return true
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: FormErrors = error.errors.reduce((acc: FormErrors, err) => {
          acc[err.path[0] as keyof FormErrors] = err.message
          return acc
        }, {})
        setRegisterErrors(errors)
      }
      return false
    }
  }

  const handleLoginSubmit = async (event: React.FormEvent) => {
    event.preventDefault()
    if (validateLogin(loginValues)) {
      console.log("Login bem-sucedido:", loginValues)
      // Adicione a lógica de login (ex: chamada API)
      await setAuthToken('Token Fake')
      router.push("/");
    }
  }

  const handleRegisterSubmit = (event: React.FormEvent) => {
    event.preventDefault()
    if (validateRegister(registerValues)) {
      console.log("Registro bem-sucedido:", registerValues)
      // Adicione a lógica de registro (ex: chamada API)
      setRegisterValues({ email: "", password: "" })
      toast.success("Registro bem sucedido!", {
        duration: 2000,
      })
      setSelectedTab("login")
    }
  }

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Tabs value={selectedTab} onValueChange={setSelectedTab} defaultValue="login" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="login">Login</TabsTrigger>
          <TabsTrigger value="register">Registrar</TabsTrigger>
        </TabsList>
        <TabsContent value="login">
          <Card>
            <CardHeader>
              <CardTitle>Login</CardTitle>
              <CardDescription>
                Faça login e crie seus grupos!
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleLoginSubmit} className="space-y-2">
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={loginValues.email}
                    onChange={(e) => setLoginValues({ ...loginValues, email: e.target.value })}
                    className={loginErrors.email ? "border-red-500" : ""}
                  />
                  {loginErrors.email && <ErrorText message={loginErrors.email}/>}
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password">Senha</Label>
                  <Input
                    id="password"
                    type="password"
                    value={loginValues.password}
                    onChange={(e) => setLoginValues({ ...loginValues, password: e.target.value })}
                    className={loginErrors.password ? "border-red-500" : ""}
                  />
                  {loginErrors.email && <ErrorText message={loginErrors.password}/>}
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Login</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
        <TabsContent value="register">
          <Card>
            <CardHeader>
              <CardTitle>Registrar</CardTitle>
              <CardDescription>
                Não tem uma conta. Registre agora!
              </CardDescription>
            </CardHeader>
            <form onSubmit={handleRegisterSubmit} className="space-y-2">
              <CardContent className="space-y-2">
                <div className="space-y-1">
                  <Label htmlFor="email-register">Email</Label>
                  <Input
                    id="email-register"
                    type="email"
                    value={registerValues.email}
                    onChange={(e) => setRegisterValues({ ...registerValues, email: e.target.value })}
                    className={registerErrors.email ? "border-red-500 text-sm" : ""}
                  />
                  <ErrorText message={registerErrors.email} />
                </div>
                <div className="space-y-1">
                  <Label htmlFor="password-register">Senha</Label>
                  <Input
                    id="password-register"
                    type="password"
                    value={registerValues.password}
                    onChange={(e) => setRegisterValues({ ...registerValues, password: e.target.value })}
                    className={registerErrors.password ? "border-red-500" : ""}
                  />
                  <ErrorText message={registerErrors.password} />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit">Criar conta</Button>
              </CardFooter>
            </form>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

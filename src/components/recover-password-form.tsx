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
import { Spinner } from "./ui/spinner"
import { toast } from "sonner";

import { z } from "zod"
import { ZodError } from "zod"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { recoverPassword } from "@/lib/queries/auth/recoverPassword"

const recoverPasswordSchema = z.object({
  email: z.string().email("Email inválido").nonempty("Email é obrigatório"),
})


type RecoverPasswordFormValues = {
  email: string
}

type FormErrors = {
  email?: string
}

const ErrorText: React.FC<{ message?: string }> = ({ message }) => {
  return (
    <div className="text-red-500 text-sm">{message}</div>
  )
}

export function RecoverPasswordForm({
  className,
  ...props
}: React.ComponentPropsWithoutRef<"div">) {
  const router = useRouter()
  const [loading, setLoading] = useState(false);

  const [recoverPasswordValue, setRecoverPasswordValue] = useState<RecoverPasswordFormValues>({ email: "" })

  const [recoverPasswordErrors, setRecoverPasswordErrors] = useState<FormErrors>({})

  const validateRecoverPassword = (values: RecoverPasswordFormValues) => {
    try {
      recoverPasswordSchema.parse(values)
      setRecoverPasswordErrors({})
      return true
    } catch (error) {
      if (error instanceof ZodError) {
        const errors: FormErrors = error.errors.reduce((acc: FormErrors, err) => {
          acc[err.path[0] as keyof FormErrors] = err.message
          return acc
        }, {})
        setRecoverPasswordErrors(errors)
      }
      return false
    }
  }


  const handlePasswordRecovery = async (event: React.FormEvent) => {
    event.preventDefault();
    if (await validateRecoverPassword(recoverPasswordValue)) {
      setLoading(true);
      try {
        const message = await recoverPassword(recoverPasswordValue.email);
        toast.success(message, { duration: 2000 });
        router.push('/sign-in')
      } catch (err) {
        if (err instanceof Error) {
          toast.error(err.message, { duration: 3000 });
        } else {
          toast.error('Erro desconhecido', { duration: 3000 });
        }
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className={cn("flex flex-col gap-6", className)} {...props}>
      <Card>
        <CardHeader>
          <CardTitle>Recuperar Senha</CardTitle>
          <CardDescription>
            Digite seu email para receber um link de recuperação!
          </CardDescription>
        </CardHeader>
        <form onSubmit={handlePasswordRecovery} className="space-y-2">
          <CardContent className="space-y-2">
            <div className="space-y-1">
              <Label htmlFor="email">Email</Label>
              <Input
                id="email"
                type="email"
                value={recoverPasswordValue.email}
                onChange={(e) => setRecoverPasswordValue({ email: e.target.value })}
                className={recoverPasswordErrors.email ? "border-red-500" : ""}
              />
              {recoverPasswordErrors.email && <ErrorText message={recoverPasswordErrors.email} />}
            </div>
          </CardContent>
          <CardFooter className="flex flex-row gap-2">
            <Button type="submit" disabled={loading}>
              {loading ? <Spinner size="medium" /> : "Enviar"}
            </Button>
            <Button onClick={() => router.push('/sign-in')} variant={'outline'}>Voltar</Button>
          </CardFooter>
        </form>
      </Card>
    </div>
  )
}

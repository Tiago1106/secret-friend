'use client'

import { use, useState } from "react";
import { Calendar, Users } from "lucide-react";
import { useGroupForId } from "@/lib/queries/groups/useGroupId";
import { useAuthStore } from "@/stores/useAuthStore";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";

interface GroupPageProps {
  params: Promise<{ id: string }>
}

export default function Group({ params }: GroupPageProps) {
  const { id } = use(params)
  const [revelate, setRevelate] = useState(false)
  const [loadingRevalate, setLoadingRevelate] = useState(false)

  const { data, isLoading, isError } = useGroupForId(id)
  const user = useAuthStore((state) => state.user)

  if (isLoading) return <p>Carregando...</p>
  if (isError) return <p>Erro ao carregar grupo</p>
  if (!data || !user) return null

  const currentPair = data.pairs?.find(pair => pair.giver.email === user.email)

  const handleRevalete = () => {
    if (revelate || loadingRevalate) return
    setLoadingRevelate(true)
    setTimeout(() => {
      setLoadingRevelate(false)
      setRevelate(true)
    }, 2000)
  }

  return (
    <div className="item-center justify-center flex">
      <Card className="max-w-[600px] border rounded-md px-0 w-full">
        <CardHeader>
          <CardTitle>{data?.title}</CardTitle>
          <CardDescription className="flex flex-row items-center gap-2">
            <Calendar size={14} />
            {data?.date}
          </CardDescription>
          <CardDescription className="flex flex-row items-center gap-2">
            <Users size={14} />
            {data?.participants.length} Participantes
          </CardDescription>
        </CardHeader>

        <Separator />

        <CardContent className="flex flex-row justify-between items-center">
          <div
            className="w-full h-32 bg-muted rounded-md items-center justify-center flex flex-col cursor-pointer transition-all duration-300"
            onClick={handleRevalete}
          >
            {loadingRevalate ? (
              <>
                <CardTitle>⏳ Revelando...</CardTitle>
                <CardDescription>Tirando os papeizinhos...</CardDescription>
              </>
            ) : revelate ? (
              <>
                <CardTitle>🤫 {currentPair?.receiver.name}</CardTitle>
                <CardDescription>🎁 Agora é com você! Presentes em breve.</CardDescription>
              </>
            ) : (
              <>
                <CardTitle>Preparado para saber?</CardTitle>
                <CardDescription>Clique para revelar</CardDescription>
              </>
            )}
          </div>
        </CardContent>

        <Separator />

        <CardContent className="gap-5 flex flex-col">
          <CardTitle>Participantes</CardTitle>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nome</TableHead>
                <TableHead>Email</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.participants.map((participant) => (
                <TableRow key={participant.name}>
                  <TableCell>{participant.name}</TableCell>
                  <TableCell>{participant.email}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
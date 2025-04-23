"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Separator } from "@/components/ui/separator";
import { cn } from "@/lib/utils";
import { CalendarIcon, Mail, Trash } from "lucide-react";
import { useState } from "react";
import { z } from "zod";
import { format } from "date-fns"
import { ptBR } from "date-fns/locale";
import { useAuthStore } from "@/stores/useAuthStore";
import { toast } from "sonner";
import { useCreateGroup } from "@/lib/queries/groups/useCreateGroup";
import { useRouter } from "next/navigation";  

type Participants = {
  name: string;
  email: string;
}

const participantSchema = z.object({
  name: z.string().min(1, "Nome é obrigatório"),
  email: z.string().email("Email inválido"),
});

export default function NewGroup() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user)
  const createGroupMutation = useCreateGroup();

  const [groupName, setGroupName] = useState<string>('')
  const [groupDate, setGroupDate] = useState<Date>();
  const [participants, setParticipants] = useState<Participants[]>([{ name: "", email: "" }]);
  const [errors, setErrors] = useState<Record<number, { name?: string; email?: string }>>({});

  const handleAddParticipant = () => {
    setParticipants([...participants, { name: '', email: '' }]);
  };

  const handleRemoveParticipant = (index: number) => {
    if (index === 0) return;
    setParticipants(participants.filter((_, i) => i !== index));
    setErrors((prev) => {
      const newErrors = { ...prev };
      delete newErrors[index];
      return newErrors;
    });
  };

  const handleInputChange = (index: number, field: 'name' | 'email', value: string) => {
    const newParticipants = [...participants];
    newParticipants[index][field] = value;
    setParticipants(newParticipants);
    setErrors((prev) => ({
      ...prev,
      [index]: { ...prev[index], [field]: undefined },
    }));
  };

  const handleCreateGroup = async () => {
    let hasError = false;
    const newErrors: Record<number, { name?: string; email?: string }> = {};
  
    const nonEmptyParticipants = participants.filter(
      (p) => p.name.trim() !== '' || p.email.trim() !== ''
    );
  
    const validParticipants = nonEmptyParticipants.filter((p, index) => {
      const result = participantSchema.safeParse(p);
      if (!result.success) {
        hasError = true;
        newErrors[index] = {
          name: result.error.formErrors.fieldErrors.name?.[0],
          email: result.error.formErrors.fieldErrors.email?.[0],
        };
      }
      return result.success;
    });
  
    setErrors(newErrors);
  
    if (hasError) {
      console.error('Participantes inválidos.');
      return;
    }
  
    if (!user) {
      toast.error("Você precisa estar logado para criar um grupo.");
      return;
    }
  
    if (!groupDate) {
      toast.error("Selecione a data do amigo secreto.");
      return;
    }
  
    if (validParticipants.length < 2) {
      toast.error("Você precisa de pelo menos 2 participantes.");
      return;
    }
  
    try {
      const { id } = await createGroupMutation.mutateAsync({
        name: groupName,
        date: groupDate.toISOString(),
        participants: validParticipants,
        ownerId: user.uid,
      });
  
      toast.success('Grupo criado com sucesso!');
      router.replace(`/group/${id}`);
    } catch (err) {
      console.error('Erro ao criar grupo:', err);
      toast.error('Erro ao criar grupo.');
    }
  };

  return (
    <div className="item-center justify-center flex">
      <Card className="max-w-[600px] border rounded-md px-0 w-full">
        <CardHeader>
          <CardTitle>Novo Grupo</CardTitle>
          <CardDescription>Convide seus amigos para participar</CardDescription>
        </CardHeader>
        <CardContent className="gap-5 flex flex-col">
          <div className="space-y-1">
            <Label htmlFor="group-name">Nome do Grupo</Label>
            <Input
              id="group-name"
              value={groupName}
              onChange={(e) => setGroupName(e.target.value)}
            />
          </div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant={"outline"}
                className={cn(
                  "w-[280px] justify-start text-left font-normal",
                  !groupDate && "text-muted-foreground"
                )}
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {groupDate ? format(groupDate, "PPP", { locale: ptBR }) : <span>Pick a date</span>}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0">
              <Calendar
                mode="single"
                selected={groupDate}
                onSelect={setGroupDate}
                initialFocus
                locale={ptBR}
              />
            </PopoverContent>
          </Popover>

        </CardContent>
        <Separator />
        <CardContent className="gap-5 flex flex-col">
          <CardTitle>Participantes</CardTitle>
          {participants.map((participant, index) => (
            <div key={index} className="flex flex-row gap-2 justify-between items-end">
              <div className="space-y-1 w-full">
                <Label htmlFor={`name-${index}`}>Nome</Label>
                <Input
                  className={`w-full ${errors[index]?.name ? "border-red-500" : ""}`}
                  id={`name-${index}`}
                  value={participant.name}
                  onChange={(e) => handleInputChange(index, 'name', e.target.value)}
                />
              </div>
              <div className="space-y-1 w-full">
                <Label htmlFor={`email-${index}`}>Email</Label>
                <Input
                  className={`w-full ${errors[index]?.name ? "border-red-500" : ""}`}
                  id={`email-${index}`}
                  value={participant.email}
                  onChange={(e) => handleInputChange(index, 'email', e.target.value)}
                />
              </div>

              <Button variant="default" disabled={index === 0} onClick={() => handleRemoveParticipant(index)}>
                <Trash />
              </Button>

            </div>
          ))}
        </CardContent>
        <Separator />
        <CardFooter className="flex flex-row justify-between items-center">
          <Button variant='outlineCard' onClick={handleAddParticipant}>Adicionar Amigo</Button>
          <Button onClick={handleCreateGroup}><Mail />Criar grupo e enviar emails</Button>
        </CardFooter>
      </Card>
    </div >
  );
}

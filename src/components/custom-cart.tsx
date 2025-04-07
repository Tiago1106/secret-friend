import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Trash, Users } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "./ui/alert-dialog";

interface CustomCardProps {
  title: string;
  date: string;
  participants: string;
  id: string;
  onClick: (id: string) => void
}

function HandleDeleteGroup() {
  return (
    <AlertDialog>
      <AlertDialogTrigger className="absolute right-4 cursor-pointer"><Trash size={16} /></AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deseja realmente excluir esse grupo?</AlertDialogTitle>
          <AlertDialogDescription>
            Se você excluir o grupo não tera mais acesso a informações!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancelar</AlertDialogCancel>
          <AlertDialogAction>Excluir</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function CustomCard({ title, date, participants, id, onClick }: CustomCardProps) {
  return (
    <Card 
      className="relative min-w-[300px] border rounded-md bg-accent cursor-pointer p-4"
      onClick={() => onClick(id)}
    >
      <HandleDeleteGroup />
      <CardContent className="flex flex-col gap-2 px-0">
        <CardTitle>{title}</CardTitle>
        <CardDescription className="flex flex-row items-center gap-2">
          <Calendar size={14} />
          {date}
        </CardDescription>
        <CardDescription className="flex flex-row items-center gap-2">
          <Users size={14} />
          {participants} Participantes
        </CardDescription>
      </CardContent>
    </Card>
  );
}
import { Card, CardContent, CardTitle, CardDescription } from "@/components/ui/card";
import { Calendar, Trash, Users } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";

interface CustomCardProps {
  title: string;
  date: string;
  participants: number;
  id: string;
  onClick: (id: string) => void;
  onDelete: (id: string) => void;
}

function HandleDeleteGroup({ onDelete, id }: { onDelete: (id: string) => void, id: string }) {

  return (
    <AlertDialog>
      <AlertDialogTrigger
        className="absolute right-4 cursor-pointer"
        onClick={(e) => e.stopPropagation()}
      >
        <Trash size={16} />
      </AlertDialogTrigger>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Deseja realmente excluir esse grupo?</AlertDialogTitle>
          <AlertDialogDescription>
            Se você excluir o grupo não terá mais acesso a informações!
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel onClick={(e) => e.stopPropagation()}>Cancelar</AlertDialogCancel>
          <AlertDialogAction onClick={(e) => {
            onDelete(id);
            e.stopPropagation();
          }}>Excluir</AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  );
}

export function CustomCard({ title, date, participants, id, onClick, onDelete }: CustomCardProps) {
  return (
    <Card
      className="relative min-w-[300px] border rounded-md bg-accent cursor-pointer p-4"
      onClick={() => onClick(id)}
    >
      <HandleDeleteGroup id={id} onDelete={onDelete} />
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

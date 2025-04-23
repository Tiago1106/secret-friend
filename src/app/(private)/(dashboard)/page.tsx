"use client";

import { CustomCard } from "@/components/custom-cart";
import { Button } from "@/components/ui/button";
import { useDeleteGroup } from "@/lib/queries/groups/deleteGroup";
import { useGroups } from "@/lib/queries/groups/useGroups";
import { useAuthStore } from "@/stores/useAuthStore";
import { useRouter } from "next/navigation";

export default function Dashboard() {
  const router = useRouter();
  const user = useAuthStore((state) => state.user);

  const { mutate: deleteGroup } = useDeleteGroup();
  const { data, isLoading, isError } = useGroups(user?.uid);

  if (isLoading) return <p>Carregando...</p>;
  if (isError) return <p>Erro ao carregar grupos</p>;

  const handleClickGroup = (id: string) => {
    router.push(`group/${id}`);
  };

  const handleDelete = (id: string) => {
    deleteGroup(id);
  };

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-row items-center justify-between">
        <h1 className="font-medium text-2xl">Meus Grupos</h1>
        <Button variant="secondary" onClick={() => router.push("new-group")}>
          Novo Grupo
        </Button>
      </div>
      <div
        className="
        grid grid-flow-row gap-4 grid-cols-1 
        sm:grid-cols-1 
        md:grid-cols-2 
        lg:grid-cols-3
        xl:grid-cols-4"
      >
        {data?.map((item) => (
          <CustomCard
            key={item.id}
            id={item.id}
            date={item.date}
            participants={item.participants.length}
            title={item.name}
            onClick={handleClickGroup}
            onDelete={handleDelete}
          />
        ))}
      </div>
    </div>
  );
}
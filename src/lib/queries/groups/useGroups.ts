import { db } from "@/lib/firebaseConfig";
import { useQuery } from "@tanstack/react-query";
import { collection, getDocs, query, where } from "firebase/firestore";
import { Group } from "@/types/group"; // ajuste para seu tipo correto

export const getGroupsByOwner = async (ownerId: string): Promise<Group[]> => {
  const q = query(collection(db, "groups"), where("ownerId", "==", ownerId));
  const snapshot = await getDocs(q);

  const groups: Group[] = snapshot.docs.map((doc) => ({
    id: doc.id,
    ...(doc.data() as Omit<Group, "id">),
  }));

  return groups;
};

export const useGroups = (ownerId?: string) => {
  return useQuery({
    queryKey: ["groups", ownerId],
    queryFn: () => getGroupsByOwner(ownerId!),
    enabled: !!ownerId,
  });
};
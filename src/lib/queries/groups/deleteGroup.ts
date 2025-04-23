import { deleteDoc, doc } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import { useMutation, useQueryClient } from "@tanstack/react-query";

export const deleteGroup = async (groupId: string) => {
  const groupRef = doc(db, "groups", groupId);
  await deleteDoc(groupRef);
};

export const useDeleteGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: deleteGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["groups"] });
    },
  });
};
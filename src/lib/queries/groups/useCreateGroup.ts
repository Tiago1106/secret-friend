import { addDoc, collection, serverTimestamp } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { GroupFormValues, Participant } from '@/types/group';

export const createGroup = async (
  data: GroupFormValues & { ownerId: string; pairs: { giver: Participant; receiver: Participant }[] }
) => {
  const docRef = await addDoc(collection(db, 'groups'), {
    name: data.name,
    date: data.date,
    participants: data.participants,
    ownerId: data.ownerId,
    pairs: data.pairs, // <-- adiciona os pares aqui
    createdAt: serverTimestamp(),
  });
  return docRef;
};

export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: createGroup,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
};
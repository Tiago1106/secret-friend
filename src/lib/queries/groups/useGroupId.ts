import { doc, getDoc } from 'firebase/firestore';
import { useQuery } from '@tanstack/react-query';
import { db } from '@/lib/firebaseConfig';

export type Participant = {
  name: string;
  email: string;
};

export type GroupData = {
  id: string;
  title: string;
  date: string;
  yourSecret?: string;
  participants: Participant[];
  pairs: {
    giver: Participant;
    receiver: Participant;
  }[];
};

const fetchGroupForId = async (id: string): Promise<GroupData> => {
  const docRef = doc(db, 'groups', id);
  const snapshot = await getDoc(docRef);

  if (!snapshot.exists()) {
    throw new Error('Grupo não encontrado');
  }

  const data = snapshot.data();

  return {
    id: snapshot.id,
    title: data.name,
    date: data.date,
    yourSecret: data.yourSecret,
    participants: data.participants || [],
    pairs: data.pairs || [],
  };
};

export const useGroupForId = (id: string) => {
  return useQuery<GroupData>({
    queryKey: ['group', id],
    queryFn: () => fetchGroupForId(id),
    enabled: !!id,
  });
};
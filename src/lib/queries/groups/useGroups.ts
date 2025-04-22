"use client";

import { useQuery } from '@tanstack/react-query';
import { collection, getDocs, query, where } from 'firebase/firestore';
import { db } from '@/lib/firebaseConfig';
import { useAuthStore } from '@/stores/useAuthStore';

export const getGroupsByUser = async (userId: string) => {
  const q = query(collection(db, "groups"), where("ownerId", "==", userId));
  const snapshot = await getDocs(q);
  return snapshot.docs.map(doc => ({
    id: doc.id,
    ...doc.data()
  }));
};

export const useGroups = () => {
  const user = useAuthStore((state) => state.user);

  return useQuery({
    queryKey: ['groups', user?.uid],
    queryFn: () => getGroupsByUser(user!.uid),
    enabled: !!user?.uid, 
    staleTime: 1000 * 60 * 5,
  });
};
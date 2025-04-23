import api from '@/helpers/api';
import { GroupFormValues } from '@/types/group';
import { useMutation, useQueryClient } from '@tanstack/react-query';

export const createGroup = async (data: GroupFormValues & { ownerId: string }) => {
  const res = await api.post('groups/create', { json: data }).json<{ id: string }>();
  return res;
};


export const useCreateGroup = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (data: GroupFormValues & { ownerId: string }) => createGroup(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['groups'] });
    },
  });
};
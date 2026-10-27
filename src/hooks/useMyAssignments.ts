import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import type { AssignmentStatus, MyAssignment } from '../types';

export function useMyAssignments(status: AssignmentStatus | '', upcoming: boolean) {
    return useQuery({
        queryKey: ['my-assignments', status, upcoming],
        queryFn: async () => {
            const response = await api.get<MyAssignment[]>('/assignments/mine', {
                params: {
                    status: status || undefined,
                    upcoming: upcoming || undefined,
                },
            });
            return response.data;
        },
    });
}

export function useAssignmentAction() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, action }: { id: number; action: 'cancel' | 'delivered' }) => {
            const response =
                action === 'cancel'
                    ? await api.delete<MyAssignment>(`/assignments/${id}`)
                    : await api.patch<MyAssignment>(`/assignments/${id}/delivered`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['my-assignments'] });
            queryClient.invalidateQueries({ queryKey: ['board'] });
        },
    });
}
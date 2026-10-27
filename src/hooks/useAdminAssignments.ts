import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import type { AdminAssignment, AssignmentStatus, ManualAssignFormData } from '../types';

export function useAdminAssignments(shabbatId: number, status: AssignmentStatus | '') {
    return useQuery({
        queryKey: ['admin-assignments', shabbatId, status],
        queryFn: async () => {
            const response = await api.get<AdminAssignment[]>('/assignments', {
                params: { shabbatId, status: status || undefined },
            });
            return response.data;
        },
        enabled: shabbatId > 0,
    });
}

function useRefreshAssignments() {
    const queryClient = useQueryClient();
    return () => {
        queryClient.invalidateQueries({ queryKey: ['admin-assignments'] });
        queryClient.invalidateQueries({ queryKey: ['shabbatot'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        queryClient.invalidateQueries({ queryKey: ['board'] });
        queryClient.invalidateQueries({ queryKey: ['my-assignments'] });
    };
}

export function useAdminAssignmentAction() {
    const refresh = useRefreshAssignments();
    return useMutation({
        mutationFn: async ({ id, action }: { id: number; action: 'cancel' | 'delivered' }) => {
            const response =
                action === 'cancel'
                    ? await api.delete<AdminAssignment>(`/assignments/${id}`)
                    : await api.patch<AdminAssignment>(`/assignments/${id}/delivered`);
            return response.data;
        },
        onSuccess: refresh,
    });
}

export function useManualAssign() {
    const refresh = useRefreshAssignments();
    return useMutation({
        mutationFn: async (data: ManualAssignFormData) => {
            const response = await api.post<AdminAssignment>('/assignments', data);
            return response.data;
        },
        onSettled: refresh,
    });
}
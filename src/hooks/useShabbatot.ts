import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import type { Category, Shabbat, ShabbatBoard, ShabbatFormData, ShabbatListItem, SlotFormData } from '../types';

export function useShabbatot(status: Shabbat['status'] | '') {
    return useQuery({
        queryKey: ['shabbatot', 'list', status],
        queryFn: async () => {
            const response = await api.get<ShabbatListItem[]>('/shabbatot', {
                params: { status: status || undefined },
            });
            return response.data;
        },
    });
}

export function useShabbatBoard(id: number) {
    return useQuery({
        queryKey: ['shabbatot', 'detail', id],
        queryFn: async () => {
            const response = await api.get<ShabbatBoard>(`/shabbatot/${id}`);
            return response.data;
        },
            enabled: id > 0,
    });
}

function useRefreshShabbatot() {
    const queryClient = useQueryClient();
    return () => {
        queryClient.invalidateQueries({ queryKey: ['shabbatot'] });
        queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        queryClient.invalidateQueries({ queryKey: ['board'] });
    };
}

export function useSaveShabbat() {
    const refresh = useRefreshShabbatot();
    return useMutation({
        mutationFn: async ({ id, data }: { id?: number; data: Partial<ShabbatFormData> }) => {
            const response = id
                ? await api.put<Shabbat>(`/shabbatot/${id}`, data)
                : await api.post<Shabbat>('/shabbatot', data);
            return response.data;
        },
        onSuccess: refresh,
    });
}

export type ShabbatAction = 'generate' | 'publish' | 'close' | 'delete';

export function useShabbatAction() {
    const refresh = useRefreshShabbatot();
    return useMutation({
        mutationFn: async ({ id, action, categories }: { id: number; action: ShabbatAction; categories?: Category[] }) => {
            if (action === 'generate') {
                const response = await api.post<{ familiesCount: number; created: number }>(
                    `/shabbatot/${id}/generate-slots`,
                    { categories },
                );
                return response.data;
            }
            if (action === 'delete') {
                await api.delete(`/shabbatot/${id}`);
                return null;
            }
            const response = await api.patch(`/shabbatot/${id}/${action}`);
            return response.data;
        },
        onSuccess: refresh,
    });
}

export function useCreateSlot() {
    const refresh = useRefreshShabbatot();
    return useMutation({
        mutationFn: async (data: SlotFormData & { shabbatId: number }) => {
            const response = await api.post('/slots', data);
            return response.data;
        },
        onSuccess: refresh,
    });
}

export function useDeleteSlot() {
    const refresh = useRefreshShabbatot();
    return useMutation({
        mutationFn: async (id: number) => {
            await api.delete(`/slots/${id}`);
        },
        onSuccess: refresh,
    });
}
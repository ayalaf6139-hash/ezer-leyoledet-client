import { keepPreviousData, useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import type { Category, CurrentBoard } from '../types';

export function useCurrentBoard(category: Category | '', onlyOpen: boolean) {
    return useQuery({
        queryKey: ['board', category, onlyOpen],
        queryFn: async () => {
            const response = await api.get<CurrentBoard>('/shabbatot/current', {
                params: {
                    category: category || undefined,
                    onlyOpen: onlyOpen || undefined,
                },
            });
            return response.data;
        },
        placeholderData: keepPreviousData,
    });
}

export interface TakeSlotData {
    slotId: number;
    productId: number;
    note: string;
}

export function useTakeSlot() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (data: TakeSlotData) => {
            const response = await api.post('/assignments', data);
            return response.data;
        },
        onSettled: () => {
            queryClient.invalidateQueries({ queryKey: ['board'] });
            queryClient.invalidateQueries({ queryKey: ['my-assignments'] });
        },
    });
}
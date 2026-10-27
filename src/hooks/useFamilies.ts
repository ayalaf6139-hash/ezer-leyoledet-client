import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import type { Family, FamilyFormData, FamilyStatus, Paginated } from '../types';

export interface FamiliesFilters {
    q: string;
    status: FamilyStatus | '';
    sortBy: 'familyName' | 'createdAt' | 'firstShabbat' | 'peopleCount';
    order: 'asc' | 'desc';
}

export function useFamilies(filters: FamiliesFilters) {
    return useQuery({
        queryKey: ['families', filters],
        queryFn: async () => {
            const response = await api.get<Paginated<Family>>('/families', {
                params: {
                    q: filters.q || undefined,
                    status: filters.status || undefined,
                    sortBy: filters.sortBy,
                    order: filters.order,
                    pageSize: 100,
                },
            });
            return response.data;
        },
    });
}

export function useSaveFamily() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id?: number; data: FamilyFormData }) => {
            const response = id
                ? await api.put<Family>(`/families/${id}`, data)
                : await api.post<Family>('/families', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['families'] });
        },
    });
}

export function useFinishFamily() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async (id: number) => {
            const response = await api.delete<Family>(`/families/${id}`);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['families'] });
        },
    });
}
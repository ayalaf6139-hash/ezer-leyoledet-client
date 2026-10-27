import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import type { AdminUser, Paginated, UserStatus, VolunteerFormData } from '../types';

export function useVolunteers(status: UserStatus | '', q: string) {
    return useQuery({
        queryKey: ['users', status, q],
        queryFn: async () => {
            const response = await api.get<Paginated<AdminUser>>('/users', {
                params: {
                    status: status || undefined,
                    q: q || undefined,
                    pageSize: 100,
                },
            });
            return response.data;
        },
    });
}

export function useUpdateUserStatus() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, status }: { id: number; status: UserStatus }) => {
            const response = await api.patch<AdminUser>(`/users/${id}`, { status });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
        },
    });
}

export function useSaveVolunteer() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id?: number; data: VolunteerFormData }) => {
            const { email, password, ...details } = data;
            if (id) {
                const response = await api.patch<AdminUser>(`/users/${id}`, details);
                return response.data;
            }
            const response = await api.post<{ user: AdminUser; inviteEmailSent: boolean }>('/users', {
                ...details,
                email,
                password: password || undefined,
            });
            return response.data.user;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['users'] });
            queryClient.invalidateQueries({ queryKey: ['dashboard'] });
        },
    });
}
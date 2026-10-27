import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import type { DashboardData } from '../types';

export function useDashboard() {
    return useQuery({
        queryKey: ['dashboard'],
        queryFn: async () => {
            const response = await api.get<DashboardData>('/reports/dashboard');
            return response.data;
        },
    });
}
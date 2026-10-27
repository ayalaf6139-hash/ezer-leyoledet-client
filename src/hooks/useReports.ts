import { useQuery } from '@tanstack/react-query';
import api from '../utils/api';
import type { WeekReport } from '../types';

export function useWeekReport(shabbatId: number) {
    return useQuery({
        queryKey: ['reports', 'week', shabbatId],
        queryFn: async () => {
            const response = await api.get<WeekReport>(`/reports/week/${shabbatId}`);
            return response.data;
        },
        enabled: shabbatId > 0,
    });
}
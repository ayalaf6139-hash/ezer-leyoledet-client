import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../utils/api';
import type { Category, Product, ProductFormData } from '../types';

export function useProducts(category?: Category) {
    return useQuery({
        queryKey: ['products', category ?? 'all'],
        queryFn: async () => {
            const response = await api.get<Product[]>('/products', {
                params: { category },
            });
            return response.data;
        },
    });
}

export function useAdminProducts(category: Category | '') {
    return useQuery({
        queryKey: ['products', 'admin', category],
        queryFn: async () => {
            const response = await api.get<Product[]>('/products', {
                params: {
                    includeInactive: true,
                    category: category || undefined,
                },
            });
            return response.data;
        },
    });
}

export function useSaveProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, data }: { id?: number; data: ProductFormData }) => {
            const response = id
                ? await api.put<Product>(`/products/${id}`, data)
                : await api.post<Product>('/products', data);
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
}

export function useToggleProduct() {
    const queryClient = useQueryClient();
    return useMutation({
        mutationFn: async ({ id, isActive }: { id: number; isActive: boolean }) => {
            const response = isActive
                ? await api.delete<Product>(`/products/${id}`)
                : await api.put<Product>(`/products/${id}`, { isActive: true });
            return response.data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['products'] });
        },
    });
}
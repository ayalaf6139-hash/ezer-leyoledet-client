import type { BoardSlot, Category, Shabbat } from '../types';

export const CATEGORY_LABELS: Record<Category, string> = {
    MAIN: 'תבשיל',
    SALAD: 'סלט',
    DESSERT: 'קינוח',
    OTHER: 'אחר',
};

export function formatDateTime(iso: string): string {
    return new Date(iso).toLocaleString('he-IL', {
        timeZone: 'Asia/Jerusalem',
        weekday: 'long',
        day: 'numeric',
        month: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
    });
}

export function formatDate(dateOnly: string): string {
    const [year, month, day] = dateOnly.split('-');
    return `${day}/${month}/${year}`;
}

export const SHABBAT_STATUS_LABELS: Record<Shabbat['status'], string> = {
    DRAFT: 'טיוטה',
    PUBLISHED: 'פורסמה',
    CLOSED: 'סגורה',
};

export const SLOT_STATUS_LABELS: Record<BoardSlot['status'], string> = {
    OPEN: 'פנויה',
    TAKEN: 'תפוסה',
    DELIVERED: 'נמסרה',
};
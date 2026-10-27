import type { AssignmentStatus, BoardSlot, Category, Shabbat, User } from './user';

export interface AdminUser extends User {
    notes: string | null;
    createdAt: string;
    assignmentsCount: number;
}

export interface Paginated<T> {
    items: T[];
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
}

export type FamilyStatus = 'ACTIVE' | 'FINISHED';

export interface Family {
    id: number;
    familyName: string;
    contactPhone: string | null;
    address: string | null;
    peopleCount: number;
    simchaType: string;
    firstShabbat: string;
    lastShabbat: string;
    dietaryNotes: string | null;
    deliveryNotes: string | null;
    status: FamilyStatus;
    createdAt: string;
}

export interface FamilyFormData {
    familyName: string;
    contactPhone: string;
    address: string;
    peopleCount: number;
    simchaType: string;
    firstShabbat: string;
    lastShabbat: string;
    dietaryNotes: string;
    deliveryNotes: string;
}

export interface ProductFormData {
    name: string;
    category: Category;
    description: string;
}

export interface SlotCounts {
    total: number;
    open: number;
    taken: number;
    delivered: number;
}

export interface FamilyMissing {
    familyId: number;
    familyName: string;
    openCategories: string[];
}

export interface WeekSummary {
    shabbat: Shabbat;
    slotCounts: SlotCounts;
    familiesCount: number;
    volunteersCount: number;
    totalPortions: number;
    familiesMissing: FamilyMissing[];
}

export interface DashboardData {
    upcomingShabbat: WeekSummary | null;
    pendingVolunteers: number;
    activeVolunteers: number;
    activeFamilies: number;
}

export interface ShabbatListItem extends Shabbat {
    familiesCount: number;
    slotCounts: SlotCounts;
}

export interface ShabbatFormData {
    shabbatDate: string;
    parasha: string;
    collectionPoint: string;
    message: string;
}

export interface AdminSlot {
    id: number;
    familyId: number;
    category: Category;
    categoryLabel: string;
    portions: number;
    status: BoardSlot['status'];
    assignment: {
        id: number;
        status: AssignmentStatus;
        note: string | null;
        product: { id: number; name: string };
        user: { id: number; firstName: string; lastName: string; phone: string; email: string };
    } | null;
}

export interface AdminBoardFamily extends Family {
    slots: AdminSlot[];
}

export interface ShabbatBoard {
    shabbat: Shabbat;
    slotCounts: SlotCounts;
    families: AdminBoardFamily[];
    distributionListMessage: string | null;
}

export interface SlotFormData {
    familyId: number;
    category: Category;
    portions: number;
}

export interface AdminAssignment {
    id: number;
    status: AssignmentStatus;
    note: string | null;
    createdAt: string;
    cancelledAt: string | null;
    deliveredAt: string | null;
    product: { id: number; name: string; category: Category };
    user: { id: number; firstName: string; lastName: string; email: string; phone: string };
    slot: { id: number; category: Category; categoryLabel: string; portions: number; status: BoardSlot['status'] };
    family: { id: number; familyName: string; peopleCount: number };
    shabbat: { id: number; shabbatDate: string; parasha: string; status: Shabbat['status'] };
}

export interface ManualAssignFormData {
    slotId: number;
    userId: number;
    productId: number;
    note: string;
}

export interface ReportItem {
    slotId: number;
    category: Category;
    categoryLabel: string;
    portions: number;
    status: BoardSlot['status'];
    productName: string | null;
    volunteer: { id: number; name: string; phone: string } | null;
}

export interface ReportFamily {
    familyId: number;
    familyName: string;
    peopleCount: number;
    items: ReportItem[];
}

export interface WeekReport extends WeekSummary {
    families: ReportFamily[];
}

export interface VolunteerFormData {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
    notes: string;
    password: string;
}
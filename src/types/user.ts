export type Role = 'ADMIN' | 'VOLUNTEER';

export interface User {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string | null;
    role: Role;
    status: 'PENDING' | 'ACTIVE' | 'INACTIVE';
    receiveWeeklyEmail: boolean;
}

export type UserStatus = User['status'];

export type Category = 'MAIN' | 'SALAD' | 'DESSERT' | 'OTHER';

export interface Product {
    id: number;
    name: string;
    category: Category;
    categoryLabel: string;
    description: string | null;
    isActive: boolean;
}

export interface Shabbat {
    id: number;
    shabbatDate: string;
    parasha: string;
    deliveryDeadline: string;
    cancelDeadline: string;
    collectionPoint: string;
    message: string | null;
    status: 'DRAFT' | 'PUBLISHED' | 'CLOSED';
    isOpenForRegistration: boolean;
}

export interface BoardSlot {
    id: number;
    category: Category;
    categoryLabel: string;
    portions: number;
    status: 'OPEN' | 'TAKEN' | 'DELIVERED';
    productName: string | null;
    isMine: boolean;
}

export interface BoardFamily {
    label: string;
    peopleCount: number;
    simchaType: string;
    dietaryNotes: string | null;
    slots: BoardSlot[];
}

export interface CurrentBoard {
    shabbat: Shabbat | null;
    slotCounts: { total: number; open: number; taken: number; delivered: number } | null;
    families: BoardFamily[];
}

export type AssignmentStatus = 'ACTIVE' | 'DELIVERED' | 'CANCELLED';

export interface MyAssignment {
    id: number;
    status: AssignmentStatus;
    note: string | null;
    createdAt: string;
    canCancel: boolean;
    product: Pick<Product, 'id' | 'name' | 'category'>;
    slot: Pick<BoardSlot, 'id' | 'category' | 'categoryLabel' | 'portions'>;
    family: Omit<BoardFamily, 'slots'>;
    shabbat: Shabbat;
}

export interface ProfileFormData extends Pick<User, 'firstName' | 'lastName' | 'phone' | 'receiveWeeklyEmail'> {
    address: string;
}

export interface PasswordFormData {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
}
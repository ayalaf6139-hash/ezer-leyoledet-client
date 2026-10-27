import { useForm } from 'react-hook-form';
import { CATEGORY_LABELS } from '../utils/format';
import { btnGold, btnOutline, form, formButtons } from '../utils/styles';
import type { Product, ProductFormData } from '../types';

interface ProductFormProps {
    product?: Product;
    isSaving: boolean;
    onSubmit: (data: ProductFormData) => void;
    onCancel: () => void;
}

export default function ProductForm({ product, isSaving, onSubmit, onCancel }: ProductFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ProductFormData>({
        defaultValues: {
            name: product?.name ?? '',
            category: product?.category ?? 'MAIN',
            description: product?.description ?? '',
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={form}>
            <h2>{product ? 'עריכת מוצר' : 'הוספת מוצר'}</h2>

            <div>
                <label htmlFor="name">שם המוצר:</label>
                <input
                    id="name"
                    type="text"
                    {...register('name', {
                        required: 'שדה חובה',
                        minLength: { value: 2, message: 'לפחות 2 תווים' },
                        maxLength: { value: 100, message: 'עד 100 תווים' },
                    })}
                />
                {errors.name && <span>{errors.name.message}</span>}
            </div>

            <div>
                <label htmlFor="category">קטגוריה:</label>
                <select id="category" {...register('category', { required: 'שדה חובה' })}>
                    {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
            </div>

            <div>
                <label htmlFor="description">תיאור (לא חובה):</label>
                <textarea
                    id="description"
                    {...register('description', {
                        maxLength: { value: 300, message: 'עד 300 תווים' },
                    })}
                />
                {errors.description && <span>{errors.description.message}</span>}
            </div>

            <div className={formButtons}>
                <button type="submit" disabled={isSaving} className={btnGold}>
                    {isSaving ? 'שומרת...' : 'שמירה'}
                </button>
                <button type="button" onClick={onCancel} className={btnOutline}>ביטול</button>
            </div>
        </form>
    );
}
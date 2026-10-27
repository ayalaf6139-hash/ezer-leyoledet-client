import { useForm } from 'react-hook-form';
import { btnGold, btnOutline, form, formButtons, formGrid } from '../utils/styles';
import type { Family, FamilyFormData } from '../types';

interface FamilyFormProps {
    family?: Family;
    isSaving: boolean;
    onSubmit: (data: FamilyFormData) => void;
    onCancel: () => void;
}

export default function FamilyForm({ family, isSaving, onSubmit, onCancel }: FamilyFormProps) {
    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors },
    } = useForm<FamilyFormData>({
        defaultValues: {
            familyName: family?.familyName ?? '',
            contactPhone: family?.contactPhone ?? '',
            address: family?.address ?? '',
            peopleCount: family?.peopleCount ?? 1,
            simchaType: family?.simchaType ?? '',
            firstShabbat: family?.firstShabbat ?? '',
            lastShabbat: family?.lastShabbat ?? '',
            dietaryNotes: family?.dietaryNotes ?? '',
            deliveryNotes: family?.deliveryNotes ?? '',
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`${form} ${formGrid}`}>
            <h2>{family ? 'עריכת משפחה' : 'הוספת משפחה'}</h2>

            <div>
                <label htmlFor="familyName">שם משפחה:</label>
                <input
                    id="familyName"
                    type="text"
                    {...register('familyName', {
                        required: 'שדה חובה',
                        minLength: { value: 2, message: 'לפחות 2 תווים' },
                        maxLength: { value: 100, message: 'עד 100 תווים' },
                    })}
                />
                {errors.familyName && <span>{errors.familyName.message}</span>}
            </div>

            <div>
                <label htmlFor="peopleCount">מספר נפשות:</label>
                <input
                    id="peopleCount"
                    type="number"
                    {...register('peopleCount', {
                        valueAsNumber: true,
                        required: 'שדה חובה',
                        min: { value: 1, message: 'לפחות 1' },
                        max: { value: 30, message: 'עד 30' },
                    })}
                />
                {errors.peopleCount && <span>{errors.peopleCount.message}</span>}
            </div>

            <div>
                <label htmlFor="simchaType">סוג שמחה:</label>
                <select id="simchaType" {...register('simchaType', { required: 'שדה חובה' })}>
                    <option value="">בחרי</option>
                    <option value="בן">בן</option>
                    <option value="בת">בת</option>
                    <option value="תאומים">תאומים</option>
                </select>
                {errors.simchaType && <span>{errors.simchaType.message}</span>}
            </div>

            <div>
                <label htmlFor="firstShabbat">שבת ראשונה:</label>
                <input
                    id="firstShabbat"
                    type="date"
                    {...register('firstShabbat', { required: 'שדה חובה' })}
                />
                {errors.firstShabbat && <span>{errors.firstShabbat.message}</span>}
            </div>

            <div>
                <label htmlFor="lastShabbat">שבת אחרונה:</label>
                <input
                    id="lastShabbat"
                    type="date"
                    {...register('lastShabbat', {
                        required: 'שדה חובה',
                        validate: (value) =>
                            value >= getValues('firstShabbat') || 'השבת האחרונה חייבת להיות אחרי הראשונה',
                    })}
                />
                {errors.lastShabbat && <span>{errors.lastShabbat.message}</span>}
            </div>

            <div>
                <label htmlFor="contactPhone">טלפון ליצירת קשר:</label>
                <input
                    id="contactPhone"
                    type="tel"
                    {...register('contactPhone', {
                        pattern: { value: /^0\d{1,2}-?\d{7}$/, message: 'מספר טלפון אינו תקין' },
                    })}
                />
                {errors.contactPhone && <span>{errors.contactPhone.message}</span>}
            </div>

            <div>
                <label htmlFor="address">כתובת:</label>
                <input id="address" type="text" {...register('address', { maxLength: 200 })} />
            </div>

            <div>
                <label htmlFor="dietaryNotes">הערות אוכל (המתנדבות רואות):</label>
                <textarea id="dietaryNotes" {...register('dietaryNotes', { maxLength: 500 })} />
            </div>

            <div>
                <label htmlFor="deliveryNotes">הערות מסירה (רק למנהלת):</label>
                <textarea id="deliveryNotes" {...register('deliveryNotes', { maxLength: 500 })} />
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
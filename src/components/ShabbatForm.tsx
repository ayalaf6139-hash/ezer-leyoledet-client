import { useForm } from 'react-hook-form';
import { btnGold, btnOutline, form, formButtons } from '../utils/styles';
import type { Shabbat, ShabbatFormData } from '../types';

interface ShabbatFormProps {
    shabbat?: Shabbat;
    isSaving: boolean;
    onSubmit: (data: ShabbatFormData) => void;
    onCancel: () => void;
}

export default function ShabbatForm({ shabbat, isSaving, onSubmit, onCancel }: ShabbatFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<ShabbatFormData>({
        defaultValues: {
            shabbatDate: shabbat?.shabbatDate ?? '',
            parasha: shabbat?.parasha ?? '',
            collectionPoint: shabbat?.collectionPoint ?? '',
            message: shabbat?.message ?? '',
        },
    });

    const canChangeDate = !shabbat || shabbat.status === 'DRAFT';

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={form}>
            <h2>{shabbat ? 'עריכת פרטי השבת' : 'שבת חדשה'}</h2>

            <div>
                <label htmlFor="shabbatDate">תאריך השבת:</label>
                <input
                    id="shabbatDate"
                    type="date"
                    {...register('shabbatDate', {
                        disabled: !canChangeDate,
                        required: 'שדה חובה',
                        validate: (value) => new Date(value).getUTCDay() === 6 || 'התאריך חייב להיות יום שבת',
                    })}
                />
                {!canChangeDate && <small>אפשר לשנות תאריך רק לפני הפרסום</small>}
                {errors.shabbatDate && <span>{errors.shabbatDate.message}</span>}
            </div>

            <div>
                <label htmlFor="parasha">פרשה:</label>
                <input
                    id="parasha"
                    type="text"
                    {...register('parasha', {
                        required: 'שדה חובה',
                        minLength: { value: 2, message: 'לפחות 2 תווים' },
                        maxLength: { value: 50, message: 'עד 50 תווים' },
                    })}
                />
                {errors.parasha && <span>{errors.parasha.message}</span>}
            </div>

            <div>
                <label htmlFor="collectionPoint">נקודת איסוף{shabbat ? ':' : ' (ריק = ברירת המחדל):'}</label>
                <input
                    id="collectionPoint"
                    type="text"
                    {...register('collectionPoint', {
                        required: shabbat ? 'שדה חובה' : false,
                        maxLength: { value: 200, message: 'עד 200 תווים' },
                    })}
                />
                {errors.collectionPoint && <span>{errors.collectionPoint.message}</span>}
            </div>

            <div>
                <label htmlFor="message">דברי פתיחה למתנדבות (לא חובה):</label>
                <textarea
                    id="message"
                    {...register('message', {
                        maxLength: { value: 2000, message: 'עד 2000 תווים' },
                    })}
                />
                {errors.message && <span>{errors.message.message}</span>}
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
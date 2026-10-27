import { useForm } from 'react-hook-form';
import { btnGold, btnOutline, form, formButtons, formGrid } from '../utils/styles';
import type { AdminUser, VolunteerFormData } from '../types';

interface VolunteerFormProps {
    volunteer?: AdminUser;
    isSaving: boolean;
    onSubmit: (data: VolunteerFormData) => void;
    onCancel: () => void;
}

export default function VolunteerForm({ volunteer, isSaving, onSubmit, onCancel }: VolunteerFormProps) {
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<VolunteerFormData>({
        defaultValues: {
            firstName: volunteer?.firstName ?? '',
            lastName: volunteer?.lastName ?? '',
            phone: volunteer?.phone ?? '',
            email: volunteer?.email ?? '',
            address: volunteer?.address ?? '',
            notes: volunteer?.notes ?? '',
            password: '',
        },
    });

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`${form} ${formGrid}`}>
            <h2>{volunteer ? `עריכת ${volunteer.firstName} ${volunteer.lastName}` : 'הוספת מתנדבת'}</h2>

            <div>
                <label htmlFor="volFirstName">שם פרטי:</label>
                <input
                    id="volFirstName"
                    type="text"
                    {...register('firstName', {
                        required: 'שדה חובה',
                        minLength: { value: 2, message: 'לפחות 2 תווים' },
                        maxLength: { value: 50, message: 'עד 50 תווים' },
                    })}
                />
                {errors.firstName && <span>{errors.firstName.message}</span>}
            </div>

            <div>
                <label htmlFor="volLastName">שם משפחה:</label>
                <input
                    id="volLastName"
                    type="text"
                    {...register('lastName', {
                        required: 'שדה חובה',
                        minLength: { value: 2, message: 'לפחות 2 תווים' },
                        maxLength: { value: 50, message: 'עד 50 תווים' },
                    })}
                />
                {errors.lastName && <span>{errors.lastName.message}</span>}
            </div>

            <div>
                <label htmlFor="volPhone">טלפון:</label>
                <input
                    id="volPhone"
                    type="tel"
                    {...register('phone', {
                        required: 'שדה חובה',
                        pattern: { value: /^0\d{1,2}-?\d{7}$/, message: 'מספר טלפון אינו תקין' },
                    })}
                />
                {errors.phone && <span>{errors.phone.message}</span>}
            </div>

            <div>
                <label htmlFor="volEmail">אימייל:</label>
                <input
                    id="volEmail"
                    type="email"
                    {...register('email', {
                        disabled: Boolean(volunteer),
                        required: 'שדה חובה',
                        pattern: {
                            value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                            message: 'כתובת אימייל לא תקינה',
                        },
                    })}
                />
                {volunteer && <small>אי אפשר לשנות אימייל</small>}
                {errors.email && <span>{errors.email.message}</span>}
            </div>

            <div>
                <label htmlFor="volAddress">כתובת:</label>
                <input id="volAddress" type="text" {...register('address', { maxLength: 200 })} />
            </div>

            <div>
                <label htmlFor="volNotes">הערות פנימיות (רק למנהלת):</label>
                <textarea id="volNotes" {...register('notes', { maxLength: 1000 })} />
            </div>

            {!volunteer && (
                <div>
                    <label htmlFor="volPassword">סיסמה (לא חובה):</label>
                    <input
                        id="volPassword"
                        type="password"
                        {...register('password', {
                            validate: (value) =>
                                !value ||
                                (value.length >= 8 && /[A-Za-zא-ת]/.test(value) && /\d/.test(value)) ||
                                'לפחות 8 תווים, אות אחת וספרה אחת',
                        })}
                    />
                    <small>בלי סיסמה – המתנדבת תקבל מייל עם קישור לבחירת סיסמה</small>
                    {errors.password && <span>{errors.password.message}</span>}
                </div>
            )}

            <div className={formButtons}>
                <button type="submit" disabled={isSaving} className={btnGold}>
                    {isSaving ? 'שומרת...' : 'שמירה'}
                </button>
                <button type="button" onClick={onCancel} className={btnOutline}>ביטול</button>
            </div>
        </form>
    );
}
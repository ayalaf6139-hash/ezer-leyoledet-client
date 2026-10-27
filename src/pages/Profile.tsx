import { useForm } from 'react-hook-form';
import { useAuth } from '../context/AuthContext';
import api, { getErrorMessage } from '../utils/api';
import { btnGold, eyebrow, form, page, pageHeader, pageTitle } from '../utils/styles';
import type { PasswordFormData, ProfileFormData, User } from '../types';

export default function Profile() {
    const { user, updateUser } = useAuth();

    const profileForm = useForm<ProfileFormData>({
        defaultValues: {
            firstName: user?.firstName ?? '',
            lastName: user?.lastName ?? '',
            phone: user?.phone ?? '',
            address: user?.address ?? '',
            receiveWeeklyEmail: user?.receiveWeeklyEmail ?? true,
        },
    });

    const passwordForm = useForm<PasswordFormData>();

    const saveProfile = async (data: ProfileFormData) => {
        try {
            const response = await api.put<User>('/users/me', data);
            updateUser(response.data);
            alert('הפרטים עודכנו');
        } catch (error) {
            alert(getErrorMessage(error, 'העדכון נכשל, נסי שוב'));
        }
    };

    const changePassword = async (data: PasswordFormData) => {
        try {
            await api.put('/users/me/password', {
                currentPassword: data.currentPassword,
                newPassword: data.newPassword,
            });
            alert('הסיסמה שונתה');
            passwordForm.reset();
        } catch (error) {
            alert(getErrorMessage(error, 'שינוי הסיסמה נכשל, נסי שוב'));
        }
    };

    const profileErrors = profileForm.formState.errors;
    const passwordErrors = passwordForm.formState.errors;

    return (
        <div className={page}>
            <div className={pageHeader}>
                <p className={eyebrow}>החשבון שלי</p>
                <h1 className={`${pageTitle} mt-1`}>הפרופיל שלי</h1>
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-2">
                <form onSubmit={profileForm.handleSubmit(saveProfile)} className={form}>
                    <h2>פרטים אישיים</h2>

                    <div>
                        <label htmlFor="firstName">שם פרטי:</label>
                        <input
                            id="firstName"
                            type="text"
                            {...profileForm.register('firstName', {
                                required: 'שדה חובה',
                                minLength: { value: 2, message: 'לפחות 2 תווים' },
                            })}
                        />
                        {profileErrors.firstName && <span>{profileErrors.firstName.message}</span>}
                    </div>

                    <div>
                        <label htmlFor="lastName">שם משפחה:</label>
                        <input
                            id="lastName"
                            type="text"
                            {...profileForm.register('lastName', {
                                required: 'שדה חובה',
                                minLength: { value: 2, message: 'לפחות 2 תווים' },
                            })}
                        />
                        {profileErrors.lastName && <span>{profileErrors.lastName.message}</span>}
                    </div>

                    <div>
                        <label htmlFor="phone">טלפון:</label>
                        <input
                            id="phone"
                            type="tel"
                            {...profileForm.register('phone', {
                                required: 'שדה חובה',
                                pattern: { value: /^0\d{1,2}-?\d{7}$/, message: 'מספר טלפון אינו תקין' },
                            })}
                        />
                        {profileErrors.phone && <span>{profileErrors.phone.message}</span>}
                    </div>

                    <div>
                        <label htmlFor="address">כתובת:</label>
                        <input id="address" type="text" {...profileForm.register('address')} />
                    </div>

                    <div>
                        <label>
                            <input type="checkbox" {...profileForm.register('receiveWeeklyEmail')} />
                            לקבל מייל שבועי על השבת הקרובה
                        </label>
                        <small>המייל נשלח לכתובת {user?.email}</small>
                    </div>

                    <button type="submit" disabled={profileForm.formState.isSubmitting} className={btnGold}>
                        {profileForm.formState.isSubmitting ? 'שומרת...' : 'שמירת פרטים'}
                    </button>
                </form>

                <form onSubmit={passwordForm.handleSubmit(changePassword)} className={form}>
                    <h2>שינוי סיסמה</h2>

                    <div>
                        <label htmlFor="currentPassword">סיסמה נוכחית:</label>
                        <input
                            id="currentPassword"
                            type="password"
                            {...passwordForm.register('currentPassword', { required: 'שדה חובה' })}
                        />
                        {passwordErrors.currentPassword && <span>{passwordErrors.currentPassword.message}</span>}
                    </div>

                    <div>
                        <label htmlFor="newPassword">סיסמה חדשה:</label>
                        <input
                            id="newPassword"
                            type="password"
                            {...passwordForm.register('newPassword', {
                                required: 'שדה חובה',
                                minLength: { value: 8, message: 'לפחות 8 תווים' },
                                pattern: {
                                    value: /^(?=.*[A-Za-zא-ת])(?=.*\d).+$/,
                                    message: 'לפחות אות אחת וספרה אחת',
                                },
                            })}
                        />
                        {passwordErrors.newPassword && <span>{passwordErrors.newPassword.message}</span>}
                    </div>

                    <div>
                        <label htmlFor="confirmPassword">אימות סיסמה חדשה:</label>
                        <input
                            id="confirmPassword"
                            type="password"
                            {...passwordForm.register('confirmPassword', {
                                required: 'שדה חובה',
                                validate: (value) =>
                                    value === passwordForm.getValues('newPassword') || 'הסיסמאות אינן תואמות',
                            })}
                        />
                        {passwordErrors.confirmPassword && <span>{passwordErrors.confirmPassword.message}</span>}
                    </div>

                    <button type="submit" disabled={passwordForm.formState.isSubmitting} className={btnGold}>
                        {passwordForm.formState.isSubmitting ? 'משנה...' : 'שינוי סיסמה'}
                    </button>
                </form>
            </div>
        </div>
    );
}
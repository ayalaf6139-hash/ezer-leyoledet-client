import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import api, { getErrorMessage } from '../utils/api';
import logo from '../assets/ezer-logo.png';
import { authAside, authFrame, authMain, btnGold, eyebrow, form, formGrid, link, pageTitle } from '../utils/styles';

interface RegisterFormData {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
    address: string;
    password: string;
}

const Register: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<RegisterFormData>();

    const navigate = useNavigate();

    const onSubmit = async (data: RegisterFormData) => {
        try {
            await api.post('/auth/register', data);
            alert('בקשת ההצטרפות נשלחה. החשבון ייפתח לאחר אישור המנהלת');
            navigate('/login');
        } catch (error) {
            alert(getErrorMessage(error, 'אירעה שגיאה בהרשמה, אנא נסי שנית'));
        }
    };

    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            <aside className={authAside}>
                <div className={authFrame} />
                <img src={logo} alt="עזר ליולדת – מבשלות באהבה · בית השם" className="w-full max-w-md" />
                <div className="h-px w-48 bg-white/70" />
                <p className="max-w-sm font-serif text-2xl font-bold text-gold-900">"כל יולדת ראויה לשבת מלאה"</p>
                <p className="text-sm text-gold-900">מתנדבות הקהילה מבשלות ומביאות עד הדלת</p>
            </aside>
            <main className={authMain}>
                <div className="w-full max-w-xl">
                    <img src={logo} alt="עזר ליולדת" className="mx-auto mb-6 w-56 lg:hidden" />
                    <p className={eyebrow}>הצטרפות למעגל המתנדבות</p>
                    <h2 className={`${pageTitle} mb-8 mt-2`}>הרשמה כמתנדבת</h2>

                    <form onSubmit={handleSubmit(onSubmit)} className={`${form} ${formGrid}`}>
                        <div>
                            <label htmlFor="firstName">שם פרטי:</label>
                            <input
                                id="firstName"
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
                            <label htmlFor="lastName">שם משפחה:</label>
                            <input
                                id="lastName"
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
                            <label htmlFor="phone">טלפון:</label>
                            <input
                                id="phone"
                                type="tel"
                                {...register('phone', {
                                    required: 'שדה חובה',
                                    pattern: {
                                        value: /^0\d{1,2}-?\d{7}$/,
                                        message: 'מספר טלפון אינו תקין',
                                    },
                                })}
                            />
                            {errors.phone && <span>{errors.phone.message}</span>}
                        </div>

                        <div>
                            <label htmlFor="email">אימייל:</label>
                            <input
                                id="email"
                                type="email"
                                {...register('email', {
                                    required: 'שדה חובה',
                                    pattern: {
                                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                                        message: 'כתובת אימייל לא תקינה',
                                    },
                                })}
                            />
                            {errors.email && <span>{errors.email.message}</span>}
                        </div>

                        <div>
                            <label htmlFor="address">כתובת:</label>
                            <input
                                id="address"
                                type="text"
                                {...register('address', {
                                    maxLength: { value: 200, message: 'עד 200 תווים' },
                                })}
                            />
                            {errors.address && <span>{errors.address.message}</span>}
                        </div>

                        <div>
                            <label htmlFor="password">סיסמה:</label>
                            <input
                                id="password"
                                type="password"
                                {...register('password', {
                                    required: 'שדה חובה',
                                    minLength: { value: 8, message: 'הסיסמה חייבת להכיל לפחות 8 תווים' },
                                    pattern: {
                                        value: /^(?=.*[A-Za-zא-ת])(?=.*\d).+$/,
                                        message: 'הסיסמה חייבת להכיל לפחות אות אחת וספרה אחת',
                                    },
                                })}
                            />
                            {errors.password && <span>{errors.password.message}</span>}
                        </div>

                        <div className="flex flex-wrap items-center justify-between gap-4">
                            <button type="submit" disabled={isSubmitting} className={`${btnGold} min-w-40`}>
                                {isSubmitting ? 'שולחת...' : 'הרשמה'}
                            </button>

                            <Link to="/login" className={`text-sm ${link}`}>כבר רשומה? להתחברות</Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Register;
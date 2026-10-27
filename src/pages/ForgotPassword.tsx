import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { Link } from 'react-router-dom';
import api, { getErrorMessage } from '../utils/api';
import logo from '../assets/ezer-logo.svg';
import { authMain, btnGold, form, link, pageTitle } from '../utils/styles';

interface ForgotPasswordFormData {
    email: string;
}

export default function ForgotPassword() {
    const [message, setMessage] = useState('');

    const {
        register,
        handleSubmit,
        reset,
        formState: { errors, isSubmitting },
    } = useForm<ForgotPasswordFormData>();

    const onSubmit = async (data: ForgotPasswordFormData) => {
        setMessage('');
        try {
            await api.post('/auth/forgot-password', data);
            setMessage('אם קיימת כתובת כזו במערכת, נשלחו הוראות להמשך התהליך.');
            reset();
        } catch (error) {
            setMessage(getErrorMessage(error, 'לא ניתן לשלוח את הבקשה כרגע. נסו שוב מאוחר יותר.'));
        }
    };

    return (
        <div className={authMain}>
            <div className="w-full max-w-md">
                <img src={logo} alt="עזר ליולדת" className="mx-auto mb-8 w-64" />
                <h2 className={`${pageTitle} mb-6 text-center`}>שחזור סיסמה</h2>

                <form onSubmit={handleSubmit(onSubmit)} className={form}>
                    <div>
                        <label htmlFor="email">אימייל:</label>
                        <input
                            id="email"
                            type="email"
                            autoComplete="email"
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

                    <button type="submit" disabled={isSubmitting} className={`${btnGold} w-full`}>
                        {isSubmitting ? 'שולחת...' : 'שליחת בקשה'}
                    </button>

                    <Link to="/login" className={`mt-6 block text-center text-sm ${link}`}>חזרה להתחברות</Link>
                </form>

                {message && (
                    <p role="status" className="mt-6 rounded-2xl border border-gold-200 bg-gold-50 px-5 py-4 text-center text-sm font-semibold text-gold-800">
                        {message}
                    </p>
                )}
            </div>
        </div>
    );
}
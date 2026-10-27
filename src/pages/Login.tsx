import React from 'react';
import { useForm } from 'react-hook-form';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import api, { getErrorMessage } from '../utils/api';
import logo from '../assets/ezer-logo.svg';
import { authAside, authFrame, authMain, btnGold,  form, link, pageTitle } from '../utils/styles';

interface LoginFormData {
    email: string;
    password: string;
}

export const Login: React.FC = () => {
    const {
        register,
        handleSubmit,
        formState: { errors, isSubmitting },
    } = useForm<LoginFormData>();

    const { login } = useAuth();
    const navigate = useNavigate();

    const onSubmit = async (data: LoginFormData) => {
        try {
            const response = await api.post('/auth/login', data);
            const { token, user } = response.data;

            login(token, user);
            navigate(user.role === 'ADMIN' ? '/admin' : '/board');
        } catch (error) {
            alert(getErrorMessage(error, 'אירעה שגיאה בהתחברות, אנא נסי שנית'));
        }
    };

    return (
        <div className="grid min-h-screen lg:grid-cols-2">
            <aside className={authAside}>
                <div className={authFrame} />
                <img src={logo} alt="עזר ליולדת – מבשלות באהבה · בית השם" className="w-full max-w-md" />
                <div className="h-px w-48 bg-white/70" />
                <p className="text-sm text-gold-900">מזל-טוב ৹ אנחנו כאן</p>
            </aside>
            <main className={authMain}>
                <div className="w-full max-w-md">
                    <img src={logo} alt="עזר ליולדת" className="mx-auto mb-6 w-56 lg:hidden" />
                    <h2 className={`${pageTitle} `}>כי את חלק ...</h2>
                    <form onSubmit={handleSubmit(onSubmit)} className={form}>
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
                            <label htmlFor="password">סיסמה:</label>
                            <input
                                id="password"
                                type="password"
                                {...register('password', {
                                    required: 'שדה חובה',
                                    minLength: {
                                        value: 8,
                                        message: 'הסיסמה חייבת להכיל לפחות 8 תווים',
                                    },
                                })}
                            />
                            {errors.password && <span>{errors.password.message}</span>}
                        </div>

                        <button type="submit" disabled={isSubmitting} className={`${btnGold} w-full`}>
                            {isSubmitting ? 'מתחבר...' : 'התחברות'}
                        </button>

                        <div className="mt-6 flex justify-between text-sm">
                            <Link to="/forgot-password" className={link}>שכחתי סיסמה</Link>
                            <Link to="/register" className={link}>הרשמה למערכת</Link>
                        </div>
                    </form>
                </div>
            </main>
        </div>
    );
};

export default Login;
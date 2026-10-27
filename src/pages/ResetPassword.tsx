import { useForm } from 'react-hook-form';
import { Link, useNavigate, useSearchParams } from 'react-router-dom';
import api, { getErrorMessage } from '../utils/api';
import logo from '../assets/ezer-logo.png';
import { authMain, btnGold, card, form, link, pageTitle } from '../utils/styles';

interface ResetPasswordFormData {
    password: string;
    confirmPassword: string;
}

export default function ResetPassword() {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const {
        register,
        handleSubmit,
        getValues,
        formState: { errors, isSubmitting },
    } = useForm<ResetPasswordFormData>();

    const onSubmit = async (data: ResetPasswordFormData) => {
        try {
            await api.post('/auth/reset-password', { token, password: data.password });
            alert('הסיסמה עודכנה. אפשר להתחבר עם הסיסמה החדשה');
            navigate('/login');
        } catch (error) {
            alert(getErrorMessage(error, 'עדכון הסיסמה נכשל, נסי שוב'));
        }
    };

    if (!token) {
        return (
            <div className={authMain}>
                <div className={`${card} w-full max-w-md text-center`}>
                    <img src={logo} alt="עזר ליולדת" className="mx-auto mb-6 w-56" />
                    <h2 className={`${pageTitle} mb-4`}>סיסמה חדשה</h2>
                    <p role="alert" className="mb-6 rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-800">
                        הקישור אינו תקין. יש לפתוח את הקישור שנשלח במייל.
                    </p>
                    <Link to="/forgot-password" className={link}>לשליחת קישור חדש</Link>
                </div>
            </div>
        );
    }

    return (
        <div className={authMain}>
            <div className="w-full max-w-md">
                <img src={logo} alt="עזר ליולדת" className="mx-auto mb-8 w-64" />
                <h2 className={`${pageTitle} mb-6 text-center`}>בחירת סיסמה חדשה</h2>

                <form onSubmit={handleSubmit(onSubmit)} className={form}>
                    <div>
                        <label htmlFor="newPassword">סיסמה חדשה:</label>
                        <input
                            id="newPassword"
                            type="password"
                            autoComplete="new-password"
                            {...register('password', {
                                required: 'שדה חובה',
                                minLength: { value: 8, message: 'לפחות 8 תווים' },
                                pattern: {
                                    value: /^(?=.*[A-Za-zא-ת])(?=.*\d).+$/,
                                    message: 'לפחות אות אחת וספרה אחת',
                                },
                            })}
                        />
                        {errors.password && <span>{errors.password.message}</span>}
                    </div>

                    <div>
                        <label htmlFor="confirmNewPassword">אימות סיסמה:</label>
                        <input
                            id="confirmNewPassword"
                            type="password"
                            autoComplete="new-password"
                            {...register('confirmPassword', {
                                required: 'שדה חובה',
                                validate: (value) => value === getValues('password') || 'הסיסמאות אינן תואמות',
                            })}
                        />
                        {errors.confirmPassword && <span>{errors.confirmPassword.message}</span>}
                    </div>

                    <button type="submit" disabled={isSubmitting} className={`${btnGold} w-full`}>
                        {isSubmitting ? 'שומרת...' : 'שמירת סיסמה'}
                    </button>

                    <Link to="/login" className={`mt-6 block text-center text-sm ${link}`}>חזרה להתחברות</Link>
                </form>
            </div>
        </div>
    );
}
import { getErrorMessage } from '../utils/api';

interface ErrorMessageProps {
    error: unknown;
}

export default function ErrorMessage({ error }: ErrorMessageProps) {
    return (
        <p role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-800">
            {getErrorMessage(error, 'אירעה שגיאה בטעינת הנתונים')}
        </p>
    );
}

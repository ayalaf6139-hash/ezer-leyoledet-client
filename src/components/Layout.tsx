import { Link, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import logo from '../assets/ezer-logo.svg';
import { btnOutline, goldLine } from '../utils/styles';

export default function Layout() {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    return (
        <div className="flex min-h-screen flex-col">
            <header className="sticky top-0 z-30 bg-white/90 shadow-[0_8px_30px_-20px_rgba(90,63,18,0.5)] backdrop-blur-md">
                <nav className="mx-auto flex max-w-6xl flex-wrap items-center gap-x-6 gap-y-2 px-4 py-2">
                    <img src={logo} alt="עזר ליולדת – מבשלות באהבה · בית השם" className="h-20 w-auto" />
                    <div className="flex flex-wrap items-center gap-1 [&_a]:rounded-lg [&_a]:px-3 [&_a]:py-2 [&_a]:text-sm [&_a]:font-semibold [&_a]:text-ink/80 [&_a]:transition [&_a:hover]:bg-gold-50 [&_a:hover]:text-gold-700">
                        {user?.role === 'ADMIN' ? (
                            <>
                                <Link to="/admin">לוח בקרה</Link>
                                <Link to="/admin/shabbatot">שבתות</Link>
                                <Link to="/admin/assignments">מעקב שיבוצים</Link>
                                <Link to="/admin/reports">דוחות</Link>
                                <Link to="/admin/products">מוצרים</Link>
                                <Link to="/admin/volunteers">מתנדבות</Link>
                                <Link to="/admin/families">משפחות</Link>
                            </>
                        ) : (
                            <>
                                <Link to="/board">לוח השבוע</Link>
                                <Link to="/my-assignments">השיבוצים שלי</Link>
                            </>
                        )}
                        <Link to="/profile">הפרופיל שלי</Link>
                    </div>
                    <div className="ms-auto flex items-center gap-3">
                        <span className="text-sm font-bold text-gold-700">שלום, {user?.firstName}</span>
                        <button type="button" onClick={handleLogout} className={btnOutline}>
                            התנתקות
                        </button>
                    </div>
                </nav>
                <div className={goldLine} />
            </header>
            <main className="mx-auto w-full max-w-6xl flex-1 px-4 py-10">
                <Outlet />
            </main>
            <footer className="py-8 text-center text-xs tracking-[0.2em] text-ink-soft">
                <div className={`mx-auto mb-4 max-w-xs ${goldLine}`} />
                עזר ליולדת · מבשלות באהבה · קהילת בית השם
            </footer>
        </div>
    );
}

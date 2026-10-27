import { Link } from 'react-router-dom';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { useDashboard } from '../../hooks/useDashboard';
import { formatDate, formatDateTime } from '../../utils/format';
import { btnOutline, card, chip, eyebrow, link, muted, page, pageHeader, pageTitle, sectionTitle, statNumber, statTile } from '../../utils/styles';

const shabbatStatusLabels = {
    DRAFT: 'טיוטה – עוד לא פורסמה',
    PUBLISHED: 'פורסמה – ההרשמה פתוחה',
    CLOSED: 'סגורה',
};

export default function AdminDashboard() {
    const { data, isLoading, error, refetch, isFetching } = useDashboard();

    if (isLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;
    if (!data) return null;

    const upcoming = data.upcomingShabbat;

    return (
        <div className={page}>
            <div className={pageHeader}>
                <p className={eyebrow}>סקירה כללית</p>
                <h1 className={`${pageTitle} mt-1`}>לוח בקרה</h1>
                <button type="button" onClick={() => refetch()} disabled={isFetching} className={`${btnOutline} mt-4`}>
                    {isFetching ? 'מרענן...' : 'רענון נתונים'}
                </button>
            </div>

            <div className="grid items-start gap-6 lg:grid-cols-[2fr_1fr]">
                <div className="space-y-6">
                    {!upcoming && (
                        <div className={`${card} text-center`}>
                            <p className={`${muted} mb-3`}>אין שבת קרובה במערכת.</p>
                            <Link to="/admin/shabbatot" className={link}>ליצירת שבת חדשה</Link>
                        </div>
                    )}

                    {upcoming && (
                        <>
                            <div className={card}>
                                <p className={eyebrow}>השבת הקרובה</p>
                                <h2 className="mt-1 font-serif text-2xl font-bold">
                                    פרשת {upcoming.shabbat.parasha} ({formatDate(upcoming.shabbat.shabbatDate)})
                                </h2>
                                <p className="mt-4 text-sm">
                                    <span className={chip} data-status={upcoming.shabbat.status}>
                                        {shabbatStatusLabels[upcoming.shabbat.status]}
                                    </span>
                                </p>
                                <p className={`${muted} mt-3`}>מסירה עד: {formatDateTime(upcoming.shabbat.deliveryDeadline)}</p>
                            </div>

                            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                                <p className={statTile}><span className={statNumber}>{upcoming.slotCounts.total}</span><span className={muted}>משבצות</span></p>
                                <p className={statTile}><span className={statNumber}>{upcoming.slotCounts.open}</span><span className={muted}>פתוחות</span></p>
                                <p className={statTile}><span className={statNumber}>{upcoming.slotCounts.taken}</span><span className={muted}>תפוסות</span></p>
                                <p className={statTile}><span className={statNumber}>{upcoming.slotCounts.delivered}</span><span className={muted}>נמסרו</span></p>
                            </div>

                            <div className={card}>
                                <p className={`${muted} mb-6`}>
                                    משפחות: <b className="text-ink">{upcoming.familiesCount}</b> · מתנדבות שנרשמו:{' '}
                                    <b className="text-ink">{upcoming.volunteersCount}</b> · סך מנות:{' '}
                                    <b className="text-ink">{upcoming.totalPortions}</b>
                                </p>

                                <h3 className={sectionTitle}>משפחות שעדיין חסר להן</h3>
                                {upcoming.familiesMissing.length === 0 ? (
                                    <p className="rounded-2xl bg-olive-50 px-4 py-3 font-semibold text-olive-700">לכל המשפחות יש מענה 🎉</p>
                                ) : (
                                    <ul className="space-y-2">
                                        {upcoming.familiesMissing.map((family) => (
                                            <li
                                                key={family.familyId}
                                                className="flex flex-wrap items-center justify-between gap-2 rounded-2xl bg-cream-100 px-4 py-3"
                                            >
                                                <b>{family.familyName}</b>
                                                <span className={chip} data-status="PENDING">{family.openCategories.join(', ')}</span>
                                            </li>
                                        ))}
                                    </ul>
                                )}

                                <p className="mt-6 text-sm">
                                    <Link to="/admin/shabbatot" className={link}>לניהול השבתות</Link>
                                    {' · '}
                                    <Link to="/admin/families" className={link}>לניהול המשפחות</Link>
                                </p>
                            </div>
                        </>
                    )}
                </div>

                <aside className={`${card} space-y-4`}>
                    <h2 className={sectionTitle}>נתונים כלליים</h2>
                    <p className={statTile}><span className={statNumber}>{data.activeFamilies}</span><span className={muted}>משפחות פעילות</span></p>
                    <p className={statTile}><span className={statNumber}>{data.activeVolunteers}</span><span className={muted}>מתנדבות פעילות</span></p>
                    <p className={statTile}>
                        <span className={statNumber}>{data.pendingVolunteers}</span>
                        <span className={muted}>ממתינות לאישור</span>
                        {data.pendingVolunteers > 0 && (
                            <>
                                {' · '}
                                <Link to="/admin/volunteers" className={link}>לאישור</Link>
                            </>
                        )}
                    </p>
                </aside>
            </div>
        </div>
    );
}

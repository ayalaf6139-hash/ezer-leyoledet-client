import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { useShabbatot } from '../../hooks/useShabbatot';
import { useWeekReport } from '../../hooks/useReports';
import { getErrorMessage } from '../../utils/api';
import { downloadFile } from '../../utils/download';
import { formatDate, SHABBAT_STATUS_LABELS, SLOT_STATUS_LABELS } from '../../utils/format';
import { btnGold, btnOutline, btnSmall, card, chip, eyebrow, muted, page, pageHeader, pageTitle, sectionTitle, table, tableWrap } from '../../utils/styles';

export default function Reports() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [isDownloading, setIsDownloading] = useState(false);

    const { data: shabbatot, isLoading: isLoadingList } = useShabbatot('');
    const shabbatId = Number(searchParams.get('shabbatId')) || shabbatot?.[0]?.id || 0;

    const { data: report, isLoading, error } = useWeekReport(shabbatId);

    const handleDownload = async () => {
        setIsDownloading(true);
        try {
            await downloadFile(`/reports/week/${shabbatId}/export`, `shabbat-${shabbatId}.csv`);
        } catch (err) {
            alert(getErrorMessage(err, 'ההורדה נכשלה, נסי שוב'));
        } finally {
            setIsDownloading(false);
        }
    };

    return (
        <div className={page}>
            <div className={pageHeader}>
                <p className={eyebrow}>סיכומי שבתות</p>
                <h1 className={`${pageTitle} mt-1`}>דוחות</h1>
            </div>

            <h2 className={sectionTitle}>היסטוריית שבתות</h2>
            {isLoadingList && <Loading />}
            {shabbatot && (
                <div className={tableWrap}>
                    <table className={table}>
                        <thead>
                            <tr>
                                <th>תאריך</th>
                                <th>פרשה</th>
                                <th>סטטוס</th>
                                <th>משפחות</th>
                                <th>משבצות</th>
                                <th>נמסרו</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {shabbatot.map((shabbat) => (
                                <tr key={shabbat.id} className={shabbat.id === shabbatId ? 'bg-gold-50' : undefined}>
                                    <td>{formatDate(shabbat.shabbatDate)}</td>
                                    <td>{shabbat.parasha}</td>
                                    <td><span className={chip} data-status={shabbat.status}>{SHABBAT_STATUS_LABELS[shabbat.status]}</span></td>
                                    <td>{shabbat.familiesCount}</td>
                                    <td>{shabbat.slotCounts.total}</td>
                                    <td>{shabbat.slotCounts.delivered}</td>
                                    <td>
                                        <button
                                            className={btnSmall}
                                            type="button"
                                            onClick={() => setSearchParams({ shabbatId: String(shabbat.id) })}
                                        >
                                            לדוח
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}

            {isLoading && <Loading />}
            {error && <ErrorMessage error={error} />}

            {report && (
                <div className={`${card} space-y-5`}>
                    <h2 className="font-serif text-2xl font-bold">
                        דוח שבת פרשת {report.shabbat.parasha} – {formatDate(report.shabbat.shabbatDate)}
                    </h2>

                    <p className={muted}>
                        משפחות: {report.familiesCount} · מתנדבות: {report.volunteersCount} · סך מנות:{' '}
                        {report.totalPortions}
                    </p>
                    <p className={muted}>
                        משבצות: {report.slotCounts.total} · פנויות: {report.slotCounts.open} · תפוסות:{' '}
                        {report.slotCounts.taken} · נמסרו: {report.slotCounts.delivered}
                    </p>

                    {report.familiesMissing.length > 0 && (
                        <p role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-sm font-semibold text-rose-800">
                            חסר עדיין:{' '}
                            {report.familiesMissing
                                .map((family) => `${family.familyName} (${family.openCategories.join(', ')})`)
                                .join(' · ')}
                        </p>
                    )}

                    <button type="button" onClick={handleDownload} disabled={isDownloading} className={`${btnGold} me-3`}>
                        {isDownloading ? 'מוריד...' : 'יצוא לאקסל'}
                    </button>
                    <button type="button" onClick={() => window.print()} className={btnOutline}>
                        הדפסה
                    </button>

                    {report.families.length === 0 && <p className={muted}>אין משבצות בשבת הזו</p>}

                    {report.families.map((family) => (
                        <div key={family.familyId}>
                            <h3 className="mb-3 font-serif text-lg font-bold">
                                משפחת {family.familyName} – {family.peopleCount} נפשות
                            </h3>
                            <div className={tableWrap}>
                                <table className={table}>
                                    <thead>
                                        <tr>
                                            <th>קטגוריה</th>
                                            <th>מנות</th>
                                            <th>סטטוס</th>
                                            <th>מוצר</th>
                                            <th>מתנדבת</th>
                                            <th>טלפון</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {family.items.map((item) => (
                                            <tr key={item.slotId}>
                                                <td>{item.categoryLabel}</td>
                                                <td>{item.portions}</td>
                                                <td><span className={chip} data-status={item.status}>{SLOT_STATUS_LABELS[item.status]}</span></td>
                                                <td>{item.productName ?? '-'}</td>
                                                <td>{item.volunteer?.name ?? '-'}</td>
                                                <td>{item.volunteer?.phone ?? '-'}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
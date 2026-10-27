import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import ShabbatForm from '../../components/ShabbatForm';
import { useSaveShabbat, useShabbatot } from '../../hooks/useShabbatot';
import { getErrorMessage } from '../../utils/api';
import { formatDate, SHABBAT_STATUS_LABELS } from '../../utils/format';
import type { Shabbat, ShabbatFormData } from '../../types';
import { btnGold, card, chip, eyebrow, filterBar, link, muted, page, pageHeader, pageTitle, table, tableWrap } from '../../utils/styles';

export default function Shabbatot() {
    const [status, setStatus] = useState<Shabbat['status'] | ''>('');
    const [isAdding, setIsAdding] = useState(false);

    const { data, isLoading, error } = useShabbatot(status);
    const saveShabbat = useSaveShabbat();
    const navigate = useNavigate();

    const handleCreate = (formData: ShabbatFormData) => {
        saveShabbat.mutate(
            { data: formData },
            {
                onSuccess: (created) => navigate(`/admin/shabbatot/${created.id}`),
                onError: (err) => alert(getErrorMessage(err, 'יצירת השבת נכשלה, נסי שוב')),
            },
        );
    };

    return (
        <div className={page}>
            <div className={pageHeader}>
                <p className={eyebrow}>לוח השבתות</p>
                <h1 className={`${pageTitle} mt-1`}>ניהול שבתות</h1>
            </div>

            {isAdding ? (
                <ShabbatForm
                    isSaving={saveShabbat.isPending}
                    onSubmit={handleCreate}
                    onCancel={() => setIsAdding(false)}
                />
            ) : (
                <button type="button" onClick={() => setIsAdding(true)} className={btnGold}>+ שבת חדשה</button>
            )}

            <div className={filterBar}>
                <label htmlFor="shabbatStatus">סטטוס:</label>
                <select
                    id="shabbatStatus"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as Shabbat['status'] | '')}
                >
                    <option value="">הכול</option>
                    {Object.entries(SHABBAT_STATUS_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
            </div>

            {isLoading && <Loading />}
            {error && <ErrorMessage error={error} />}

            {data && data.length === 0 && <p className={`${card} ${muted} text-center`}>לא נמצאו שבתות</p>}

            {data && data.length > 0 && (
                <div className={tableWrap}>
                    <table className={table}>
                        <thead>
                            <tr>
                                <th>תאריך</th>
                                <th>פרשה</th>
                                <th>סטטוס</th>
                                <th>משפחות</th>
                                <th>משבצות</th>
                                <th>פנויות / תפוסות / נמסרו</th>
                                <th></th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((shabbat) => (
                                <tr key={shabbat.id}>
                                    <td>{formatDate(shabbat.shabbatDate)}</td>
                                    <td className="font-serif text-base font-bold">{shabbat.parasha}</td>
                                    <td><span className={chip} data-status={shabbat.status}>{SHABBAT_STATUS_LABELS[shabbat.status]}</span></td>
                                    <td>{shabbat.familiesCount}</td>
                                    <td>{shabbat.slotCounts.total}</td>
                                    <td>
                                        {shabbat.slotCounts.open} / {shabbat.slotCounts.taken} / {shabbat.slotCounts.delivered}
                                    </td>
                                    <td>
                                        <Link to={`/admin/shabbatot/${shabbat.id}`} className={link}>ניהול ←</Link>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
}
import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import ManualAssignForm from '../../components/ManualAssignForm';
import { useShabbatot } from '../../hooks/useShabbatot';
import { useAdminAssignmentAction, useAdminAssignments } from '../../hooks/useAdminAssignments';
import { getErrorMessage } from '../../utils/api';
import { formatDate, formatDateTime } from '../../utils/format';
import type { AdminAssignment, AssignmentStatus } from '../../types';
import { btnSmall, btnSmallDanger, card, chip, eyebrow, filterBar, muted, page, pageHeader, pageTitle, table, tableWrap } from '../../utils/styles';

const statusLabels: Record<AssignmentStatus, string> = {
    ACTIVE: 'פעיל',
    DELIVERED: 'התקבל',
    CANCELLED: 'בוטל',
};

export default function AssignmentsTracking() {
    const [searchParams, setSearchParams] = useSearchParams();
    const [status, setStatus] = useState<AssignmentStatus | ''>('');

    const { data: shabbatot } = useShabbatot('');
    const shabbatId = Number(searchParams.get('shabbatId')) || shabbatot?.[0]?.id || 0;

    const { data, isLoading, error } = useAdminAssignments(shabbatId, status);
    const assignmentAction = useAdminAssignmentAction();

    const runAction = (assignment: AdminAssignment, action: 'cancel' | 'delivered') => {
        const name = `${assignment.user.firstName} ${assignment.user.lastName}`;
        const question =
            action === 'cancel' ? `לבטל את השיבוץ של ${name}?` : `לסמן שהמנה של ${name} התקבלה?`;
        if (!window.confirm(question)) return;
        assignmentAction.mutate(
            { id: assignment.id, action },
            { onError: (err) => alert(getErrorMessage(err, 'הפעולה נכשלה, נסי שוב')) },
        );
    };

    const selectedShabbat = shabbatot?.find((shabbat) => shabbat.id === shabbatId);

    return (
        <div className={page}>
            <div className={pageHeader}>
                <p className={eyebrow}>ניהול השבוע</p>
                <h1 className={`${pageTitle} mt-1`}>מעקב שיבוצים</h1>
            </div>

            <div className={filterBar}>
                <label htmlFor="trackingShabbat">שבת:</label>
                <select
                    id="trackingShabbat"
                    value={shabbatId || ''}
                    onChange={(e) => setSearchParams({ shabbatId: e.target.value })}
                >
                    {shabbatot?.map((shabbat) => (
                        <option key={shabbat.id} value={shabbat.id}>
                            {formatDate(shabbat.shabbatDate)} – {shabbat.parasha}
                        </option>
                    ))}
                </select>

                <label htmlFor="trackingStatus">סטטוס:</label>
                <select
                    id="trackingStatus"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as AssignmentStatus | '')}
                >
                    <option value="">הכול</option>
                    {Object.entries(statusLabels).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
            </div>

            {selectedShabbat && selectedShabbat.status !== 'CLOSED' && (
                <ManualAssignForm key={shabbatId} shabbatId={shabbatId} />
            )}

            {isLoading && <Loading />}
            {error && <ErrorMessage error={error} />}

            {data && data.length === 0 && <p className={`${card} ${muted} text-center`}>אין שיבוצים להצגה</p>}

            {data && data.length > 0 && (
                <div className={tableWrap}>
                    <table className={table}>
                        <thead>
                            <tr>
                                <th>משפחה</th>
                                <th>קטגוריה</th>
                                <th>מוצר</th>
                                <th>מתנדבת</th>
                                <th>טלפון</th>
                                <th>נרשמה</th>
                                <th>סטטוס</th>
                                <th>פעולות</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((assignment) => (
                                <tr key={assignment.id}>
                                    <td className="font-bold">{assignment.family.familyName}</td>
                                    <td>{assignment.slot.categoryLabel} ({assignment.slot.portions})</td>
                                    <td>
                                        {assignment.product.name}
                                        {assignment.note && <small className={muted}> – {assignment.note}</small>}
                                    </td>
                                    <td>{assignment.user.firstName} {assignment.user.lastName}</td>
                                    <td>{assignment.user.phone}</td>
                                    <td>{formatDateTime(assignment.createdAt)}</td>
                                    <td><span className={chip} data-status={assignment.status}>{statusLabels[assignment.status]}</span></td>
                                    <td>
                                        {assignment.status === 'ACTIVE' && (
                                            <>
                                                <button
                                                    className={btnSmall}
                                                    type="button"
                                                    disabled={assignmentAction.isPending}
                                                    onClick={() => runAction(assignment, 'delivered')}
                                                >
                                                    התקבל
                                                </button>
                                                <button
                                                    className={btnSmallDanger}
                                                    type="button"
                                                    disabled={assignmentAction.isPending}
                                                    onClick={() => runAction(assignment, 'cancel')}
                                                >
                                                    ביטול
                                                </button>
                                            </>
                                        )}
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
import { useState } from 'react';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { useAssignmentAction, useMyAssignments } from '../../hooks/useMyAssignments';
import { getErrorMessage } from '../../utils/api';
import { formatDate, formatDateTime } from '../../utils/format';
import { btnGold, btnOutline, card, chip, eyebrow, filterBar, muted, page, pageHeader, pageTitle } from '../../utils/styles';
import type { AssignmentStatus, MyAssignment } from '../../types';

const statusLabels: Record<AssignmentStatus, string> = {
    ACTIVE: 'פעיל',
    DELIVERED: 'נמסר',
    CANCELLED: 'בוטל',
};

export default function MyAssignments() {
    const [status, setStatus] = useState<AssignmentStatus | ''>('ACTIVE');
    const [upcoming, setUpcoming] = useState(true);

    const { data, isLoading, error } = useMyAssignments(status, upcoming);
    const assignmentAction = useAssignmentAction();

    const runAction = (assignment: MyAssignment, action: 'cancel' | 'delivered') => {
        const question = action === 'cancel' ? 'לבטל את השיבוץ?' : 'לסמן שהמנה נמסרה?';
        if (!window.confirm(question)) return;
        assignmentAction.mutate(
            { id: assignment.id, action },
            { onError: (err) => alert(getErrorMessage(err, 'הפעולה נכשלה, נסי שוב')) },
        );
    };

    return (
        <div className={page}>
            <div className={pageHeader}>
                <p className={eyebrow}>מה אני מביאה השבת</p>
                <h1 className={`${pageTitle} mt-1`}>השיבוצים שלי</h1>
            </div>

            <div className={filterBar}>
                <label htmlFor="assignmentStatus">סטטוס:</label>
                <select
                    id="assignmentStatus"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as AssignmentStatus | '')}
                >
                    <option value="ACTIVE">פעילים</option>
                    <option value="DELIVERED">נמסרו</option>
                    <option value="CANCELLED">בוטלו</option>
                    <option value="">הכול</option>
                </select>

                <label>
                    <input
                        type="checkbox"
                        checked={upcoming}
                        onChange={(e) => setUpcoming(e.target.checked)}
                    />
                    רק שבתות קרובות
                </label>
            </div>

            {isLoading && <Loading />}
            {error && <ErrorMessage error={error} />}

            {data && data.length === 0 && <p className={`${card} ${muted} text-center`}>אין שיבוצים להצגה</p>}

            {data?.map((assignment) => (
                <div
                    key={assignment.id}
                    className={card}
                >
                    <h3 className={eyebrow}>
                        שבת {formatDate(assignment.shabbat.shabbatDate)} – פרשת {assignment.shabbat.parasha}
                    </h3>
                    <p className="mt-2 font-serif text-xl font-bold text-ink">
                        {assignment.family.label}: {assignment.product.name} ({assignment.slot.categoryLabel},{' '}
                        {assignment.slot.portions} מנות)
                    </p>
                    {assignment.family.dietaryNotes && (
                        <p className="mt-3 w-fit rounded-xl bg-gold-50 px-4 py-2 text-sm text-gold-800">הערות אוכל: {assignment.family.dietaryNotes}</p>
                    )}
                    {assignment.note && <p className={`${muted} mt-3`}>ההערה שלי: {assignment.note}</p>}
                    <p className={`${muted} mt-3`}>
                        מסירה עד {formatDateTime(assignment.shabbat.deliveryDeadline)} ·{' '}
                        {assignment.shabbat.collectionPoint}
                    </p>
                    <p className="mt-4">
                        <span className={chip} data-status={assignment.status}>סטטוס: {statusLabels[assignment.status]}</span>
                    </p>
                    { assignment.status === 'ACTIVE' && (
                        <div className="mt-5 flex flex-wrap items-center gap-3">
                            <button onClick={() => runAction(assignment, 'delivered')} type="button" disabled={assignmentAction.isPending} className={btnGold}>
                                סמן כנמסר
                            </button>
                            {assignment.canCancel ? (
                                <button onClick={() => runAction(assignment, 'cancel')} type="button" disabled={assignmentAction.isPending} className={btnOutline}>
                                    בטל שיבוץ
                                </button>
                            ) : (
                                <small className={muted}>מועד הביטול עבר</small>
                            )}
                        </div>
                    )}
                </div>
            ))}
        </div>
    );
}
import { useState } from 'react';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import { useUpdateUserStatus, useVolunteers } from '../../hooks/useVolunteers';
import { getErrorMessage } from '../../utils/api';
import type { UserStatus } from '../../types';
import { btnSmall, btnSmallDanger, card, chip, eyebrow, filterBar, muted, page, pageHeader, pageTitle, table, tableWrap } from '../../utils/styles';

const statusLabels: Record<UserStatus, string> = {
    PENDING: 'ממתינה',
    ACTIVE: 'פעילה',
    INACTIVE: 'מושבתת',
};

export default function Volunteers() {
    const [status, setStatus] = useState<UserStatus | ''>('PENDING');
    const [search, setSearch] = useState('');

    const { data, isLoading, error } = useVolunteers(status, search);
    const updateStatus = useUpdateUserStatus();

    const changeStatus = (id: number, newStatus: UserStatus) => {
        updateStatus.mutate(
            { id, status: newStatus },
            { onError: (err) => alert(getErrorMessage(err, 'העדכון נכשל, נסי שוב')) },
        );
    };

    return (
        <div className={page}>
            <div className={pageHeader}>
                <p className={eyebrow}>מעגל המתנדבות</p>
                <h1 className={`${pageTitle} mt-1`}>מתנדבות</h1>
            </div>

            <div className={filterBar}>
                <label htmlFor="status">סטטוס:</label>
                <select
                    id="status"
                    value={status}
                    onChange={(e) => setStatus(e.target.value as UserStatus | '')}
                >
                    <option value="PENDING">ממתינות לאישור</option>
                    <option value="ACTIVE">פעילות</option>
                    <option value="INACTIVE">מושבתות</option>
                    <option value="">הכול</option>
                </select>

                <label htmlFor="search">חיפוש:</label>
                <input
                    id="search"
                    type="text"
                    placeholder="שם, אימייל או טלפון"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
            </div>

            {isLoading && <Loading />}
            {error && <ErrorMessage error={error} />}

            {data && data.items.length === 0 && <p className={`${card} ${muted} text-center`}>לא נמצאו מתנדבות</p>}

            {data && data.items.length > 0 && (
                <div className={tableWrap}>
                    <table className={table}>
                        <thead>
                            <tr>
                                <th>שם</th>
                                <th>טלפון</th>
                                <th>אימייל</th>
                                <th>סטטוס</th>
                                <th>שיבוצים</th>
                                <th>פעולות</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.items.map((user) => (
                                <tr key={user.id}>
                                    <td className="font-bold">{user.firstName} {user.lastName}</td>
                                    <td>{user.phone}</td>
                                    <td>{user.email}</td>
                                    <td><span className={chip} data-status={user.status}>{statusLabels[user.status]}</span></td>
                                    <td>{user.assignmentsCount}</td>
                                    <td>
                                        {user.status !== 'ACTIVE' && (
                                            <button
                                                className={btnSmall}
                                                type="button"
                                                disabled={updateStatus.isPending}
                                                onClick={() => changeStatus(user.id, 'ACTIVE')}
                                            >
                                                אישור
                                            </button>
                                        )}
                                        {user.status === 'ACTIVE' && user.role !== 'ADMIN' && (
                                            <button
                                                className={btnSmallDanger}
                                                type="button"
                                                disabled={updateStatus.isPending}
                                                onClick={() => changeStatus(user.id, 'INACTIVE')}
                                            >
                                                השבתה
                                            </button>
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
import { useState } from 'react';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import FamilyForm from '../../components/FamilyForm';
import { useFamilies, useFinishFamily, useSaveFamily } from '../../hooks/useFamilies';
import type { FamiliesFilters } from '../../hooks/useFamilies';
import { getErrorMessage } from '../../utils/api';
import type { Family, FamilyFormData } from '../../types';
import { btnGold, btnSmall, btnSmallDanger, card, chip, eyebrow, filterBar, muted, page, pageHeader, pageTitle, table, tableWrap } from '../../utils/styles';

export default function Families() {
    const [filters, setFilters] = useState<FamiliesFilters>({
        q: '',
        status: 'ACTIVE',
        sortBy: 'familyName',
        order: 'asc',
    });
    const [editingFamily, setEditingFamily] = useState<Family | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const { data, isLoading, error } = useFamilies(filters);
    const saveFamily = useSaveFamily();
    const finishFamily = useFinishFamily();

    const updateFilter = <K extends keyof FamiliesFilters>(key: K, value: FamiliesFilters[K]) => {
        setFilters((prev) => ({ ...prev, [key]: value }));
    };

    const closeForm = () => {
        setEditingFamily(null);
        setIsAdding(false);
    };

    const handleSave = (formData: FamilyFormData) => {
        saveFamily.mutate(
            { id: editingFamily?.id, data: formData },
            {
                onSuccess: closeForm,
                onError: (err) => alert(getErrorMessage(err, 'השמירה נכשלה, נסי שוב')),
            },
        );
    };

    const handleFinish = (family: Family) => {
        if (!window.confirm(`לסיים את הסיוע למשפחת ${family.familyName}?`)) return;
        finishFamily.mutate(family.id, {
            onError: (err) => alert(getErrorMessage(err, 'הפעולה נכשלה, נסי שוב')),
        });
    };

    const showForm = isAdding || editingFamily !== null;

    return (
        <div className={page}>
            <div className={pageHeader}>
                <p className={eyebrow}>המשפחות שלנו</p>
                <h1 className={`${pageTitle} mt-1`}>ניהול משפחות</h1>
            </div>

            {showForm ? (
                <FamilyForm
                    key={editingFamily?.id ?? 'new'}
                    family={editingFamily ?? undefined}
                    isSaving={saveFamily.isPending}
                    onSubmit={handleSave}
                    onCancel={closeForm}
                />
            ) : (
                <button type="button" onClick={() => setIsAdding(true)} className={btnGold}>+ הוספת משפחה</button>
            )}

            <div className={filterBar}>
                <label htmlFor="q">חיפוש:</label>
                <input
                    id="q"
                    type="text"
                    placeholder="שם, כתובת"
                    value={filters.q}
                    onChange={(e) => updateFilter('q', e.target.value)}
                />

                <label htmlFor="familyStatus">סטטוס:</label>
                <select
                    id="familyStatus"
                    value={filters.status}
                    onChange={(e) => updateFilter('status', e.target.value as FamiliesFilters['status'])}
                >
                    <option value="ACTIVE">פעילות</option>
                    <option value="FINISHED">סיימו</option>
                    <option value="">הכול</option>
                </select>

                <label htmlFor="sortBy">מיון:</label>
                <select
                    id="sortBy"
                    value={filters.sortBy}
                    onChange={(e) => updateFilter('sortBy', e.target.value as FamiliesFilters['sortBy'])}
                >
                    <option value="familyName">שם משפחה</option>
                    <option value="firstShabbat">שבת ראשונה</option>
                    <option value="peopleCount">מספר נפשות</option>
                    <option value="createdAt">תאריך הוספה</option>
                </select>

                <select
                    aria-label="כיוון מיון"
                    value={filters.order}
                    onChange={(e) => updateFilter('order', e.target.value as FamiliesFilters['order'])}
                >
                    <option value="asc">עולה</option>
                    <option value="desc">יורד</option>
                </select>
            </div>

            {isLoading && <Loading />}
            {error && <ErrorMessage error={error} />}

            {data && data.items.length === 0 && <p className={`${card} ${muted} text-center`}>לא נמצאו משפחות</p>}

            {data && data.items.length > 0 && (
                <div className={tableWrap}>
                    <table className={table}>
                        <thead>
                            <tr>
                                <th>שם משפחה</th>
                                <th>נפשות</th>
                                <th>שמחה</th>
                                <th>תקופת סיוע</th>
                                <th>סטטוס</th>
                                <th>פעולות</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.items.map((family) => (
                                <tr key={family.id}>
                                    <td className="font-bold">{family.familyName}</td>
                                    <td>{family.peopleCount}</td>
                                    <td>{family.simchaType}</td>
                                    <td>{family.firstShabbat} עד {family.lastShabbat}</td>
                                    <td><span className={chip} data-status={family.status}>{family.status === 'ACTIVE' ? 'פעילה' : 'סיימה'}</span></td>
                                    <td>
                                        <button
                                            className={btnSmall}
                                            type="button"
                                            onClick={() => {
                                                setIsAdding(false);
                                                setEditingFamily(family);
                                            }}
                                        >
                                            עריכה
                                        </button>
                                        {family.status === 'ACTIVE' && (
                                            <button
                                                className={btnSmallDanger}
                                                type="button"
                                                disabled={finishFamily.isPending}
                                                onClick={() => handleFinish(family)}
                                            >
                                                סיום סיוע
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
import { useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import ShabbatForm from '../../components/ShabbatForm';
import { useFamilies } from '../../hooks/useFamilies';
import {
    useCreateSlot,
    useDeleteSlot,
    useSaveShabbat,
    useShabbatAction,
    useShabbatBoard,
} from '../../hooks/useShabbatot';
import type { ShabbatAction } from '../../hooks/useShabbatot';
import { getErrorMessage } from '../../utils/api';
import {
    CATEGORY_LABELS,
    formatDate,
    formatDateTime,
    SHABBAT_STATUS_LABELS,
    SLOT_STATUS_LABELS,
} from '../../utils/format';
import type { Category, ShabbatFormData, SlotFormData } from '../../types';
import {
    btnGold,
    btnOutline,
    btnSmallDanger,
    card,
    chip,
    filterBar,
    form,
    link,
    muted,
    page,
    pageHeader,
    pageTitle,
    sectionTitle,
    statNumber,
    statTile,
    table,
} from '../../utils/styles';

const actionQuestions: Record<ShabbatAction, string> = {
    generate: 'ליצור משבצות לכל המשפחות הפעילות בשבת הזו?',
    publish: 'לפרסם את השבת? המתנדבות יקבלו מייל ויוכלו להירשם',
    close: 'לסגור את ההרשמה לשבת?',
    delete: 'למחוק את השבת? הפעולה אינה ניתנת לביטול',
};

export default function ShabbatDetail() {
    const id = Number(useParams().id);
    const navigate = useNavigate();

    const [isEditing, setIsEditing] = useState(false);
    const [categories, setCategories] = useState<Category[]>(['MAIN', 'SALAD', 'DESSERT']);

    const { data, isLoading, error } = useShabbatBoard(id);
    const { data: activeFamilies } = useFamilies({ q: '', status: 'ACTIVE', sortBy: 'familyName', order: 'asc' });
    const saveShabbat = useSaveShabbat();
    const shabbatAction = useShabbatAction();
    const createSlot = useCreateSlot();
    const deleteSlot = useDeleteSlot();

    const slotForm = useForm<SlotFormData>({ defaultValues: { category: 'MAIN', portions: 5 } });

    if (isLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;
    if (!data) return null;

    const { shabbat, slotCounts, families, distributionListMessage } = data;
    const isClosed = shabbat.status === 'CLOSED';

    const toggleCategory = (category: Category) => {
        setCategories((prev) =>
            prev.includes(category) ? prev.filter((c) => c !== category) : [...prev, category],
        );
    };

    const runAction = (action: ShabbatAction) => {
        if (!window.confirm(actionQuestions[action])) return;
        shabbatAction.mutate(
            { id, action, categories },
            {
                onSuccess: (result) => {
                    if (action === 'delete') navigate('/admin/shabbatot');
                    if (action === 'generate' && result) {
                        alert(`נוצרו ${result.created} משבצות עבור ${result.familiesCount} משפחות`);
                    }
                },
                onError: (err) => alert(getErrorMessage(err, 'הפעולה נכשלה, נסי שוב')),
            },
        );
    };

    const handleEdit = (formData: ShabbatFormData) => {
        saveShabbat.mutate(
            { id, data: formData },
            {
                onSuccess: () => setIsEditing(false),
                onError: (err) => alert(getErrorMessage(err, 'השמירה נכשלה, נסי שוב')),
            },
        );
    };

    const handleAddSlot = (formData: SlotFormData) => {
        createSlot.mutate(
            { ...formData, shabbatId: id },
            {
                onSuccess: () => slotForm.reset({ category: 'MAIN', portions: 5 }),
                onError: (err) => alert(getErrorMessage(err, 'הוספת המשבצת נכשלה')),
            },
        );
    };

    const handleDeleteSlot = (slotId: number) => {
        if (!window.confirm('למחוק את המשבצת?')) return;
        deleteSlot.mutate(slotId, {
            onError: (err) => alert(getErrorMessage(err, 'מחיקת המשבצת נכשלה')),
        });
    };

    const copyMessage = async () => {
        if (!distributionListMessage) return;
        await navigator.clipboard.writeText(distributionListMessage);
        alert('ההודעה הועתקה');
    };

    return (
        <div className={page}>
            <div className={pageHeader}>
                <Link to="/admin/shabbatot" className={`text-sm ${link}`}>→ חזרה לרשימת השבתות</Link>
                <h1 className={`${pageTitle} mt-2`}>
                    שבת פרשת {shabbat.parasha} – {formatDate(shabbat.shabbatDate)}
                </h1>
                <p className="mt-3">
                    <span className={chip} data-status={shabbat.status}>סטטוס: {SHABBAT_STATUS_LABELS[shabbat.status]}</span>
                </p>
                <p className={`${muted} mt-2`}>מסירה עד: {formatDateTime(shabbat.deliveryDeadline)} · נקודת איסוף: {shabbat.collectionPoint}</p>
                {shabbat.message && <p className={`${muted} mt-1`}>דברי פתיחה: {shabbat.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <p className={statTile}><span className={statNumber}>{slotCounts.total}</span><span className={muted}>משבצות</span></p>
                <p className={statTile}><span className={statNumber}>{slotCounts.open}</span><span className={muted}>פנויות</span></p>
                <p className={statTile}><span className={statNumber}>{slotCounts.taken}</span><span className={muted}>תפוסות</span></p>
                <p className={statTile}><span className={statNumber}>{slotCounts.delivered}</span><span className={muted}>נמסרו</span></p>
            </div>

            <p className="text-sm">
                <Link to={`/admin/assignments?shabbatId=${id}`} className={link}>מעקב שיבוצים</Link>
                {' · '}
                <Link to={`/admin/reports?shabbatId=${id}`} className={link}>דוח השבת</Link>
            </p>

            <div className={card}>
                <h2 className={sectionTitle}>פעולות</h2>
                <div className="flex flex-wrap gap-3">
                    {!isClosed && (
                        <button type="button" onClick={() => setIsEditing(true)} className={btnOutline}>עריכת פרטים</button>
                    )}
                    {shabbat.status === 'DRAFT' && (
                        <>
                            <button
                                type="button"
                                disabled={shabbatAction.isPending}
                                onClick={() => runAction('publish')}
                                className={btnGold}
                            >
                                פרסום השבת
                            </button>
                            <button
                                type="button"
                                disabled={shabbatAction.isPending}
                                onClick={() => runAction('delete')}
                                className={btnSmallDanger}
                            >
                                מחיקה
                            </button>
                        </>
                    )}
                    {shabbat.status === 'PUBLISHED' && (
                        <button
                            type="button"
                            disabled={shabbatAction.isPending}
                            onClick={() => runAction('close')}
                            className={btnGold}
                        >
                            סגירת ההרשמה
                        </button>
                    )}
                </div>
            </div>

            {isEditing && (
                <ShabbatForm
                    shabbat={shabbat}
                    isSaving={saveShabbat.isPending}
                    onSubmit={handleEdit}
                    onCancel={() => setIsEditing(false)}
                />
            )}

            {distributionListMessage && (
                <div className={card}>
                    <h2 className={sectionTitle}>הודעה לרשימת התפוצה</h2>
                    <textarea readOnly rows={8} className="mb-4 w-full rounded-xl border border-cream-300 bg-cream-50 px-4 py-3 text-sm leading-relaxed" value={distributionListMessage} />
                    <button type="button" onClick={copyMessage} className={btnGold}>העתקה</button>
                </div>
            )}

            <div className="grid items-start gap-6 lg:grid-cols-2">
                {!isClosed && (
                    <div className={card}>
                        <h2 className={sectionTitle}>יצירת משבצות אוטומטית</h2>
                        <p className={`${muted} mb-4`}>נוצרת משבצת לכל משפחה פעילה שהשבת בתוך תקופת הסיוע שלה, בכל קטגוריה שנבחרה.</p>
                        <div className={`${filterBar} mb-5`}>
                            {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                                <label key={value}>
                                    <input
                                        type="checkbox"
                                        checked={categories.includes(value as Category)}
                                        onChange={() => toggleCategory(value as Category)}
                                    />
                                    {label}
                                </label>
                            ))}
                        </div>
                        <button
                            type="button"
                            disabled={shabbatAction.isPending || categories.length === 0}
                            onClick={() => runAction('generate')}
                            className={btnGold}
                        >
                            יצירת משבצות
                        </button>
                    </div>
                )}

                {!isClosed && (
                    <form onSubmit={slotForm.handleSubmit(handleAddSlot)} className={form}>
                        <h2>הוספת משבצת ידנית</h2>
                        <div>
                            <label htmlFor="familyId">משפחה:</label>
                            <select
                                id="familyId"
                                {...slotForm.register('familyId', {
                                    valueAsNumber: true,
                                    validate: (value) => !Number.isNaN(value) || 'יש לבחור משפחה',
                                })}
                            >
                                <option value="">בחרי משפחה</option>
                                {activeFamilies?.items.map((family) => (
                                    <option key={family.id} value={family.id}>
                                        {family.familyName} ({family.peopleCount} נפשות)
                                    </option>
                                ))}
                            </select>
                            {slotForm.formState.errors.familyId && (
                                <span>{slotForm.formState.errors.familyId.message}</span>
                            )}
                        </div>
                        <div>
                            <label htmlFor="slotCategory">קטגוריה:</label>
                            <select id="slotCategory" {...slotForm.register('category')}>
                                {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                                    <option key={value} value={value}>{label}</option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label htmlFor="portions">מנות:</label>
                            <input
                                id="portions"
                                type="number"
                                {...slotForm.register('portions', {
                                    valueAsNumber: true,
                                    required: 'שדה חובה',
                                    min: { value: 1, message: 'לפחות 1' },
                                    max: { value: 100, message: 'עד 100' },
                                })}
                            />
                            {slotForm.formState.errors.portions && (
                                <span>{slotForm.formState.errors.portions.message}</span>
                            )}
                        </div>
                        <button type="submit" disabled={createSlot.isPending} className={btnGold}>הוספת משבצת</button>
                    </form>
                )}
            </div>

            <h2 className={`${sectionTitle} pt-4 text-2xl`}>משפחות ומשבצות</h2>
            {families.length === 0 && <p className={`${card} ${muted} text-center`}>עדיין אין משבצות לשבת הזו</p>}

            {families.map((family) => (
                <div key={family.id} className={`${card} space-y-4`}>
                    <h3 className="font-serif text-xl font-bold">
                        משפחת {family.familyName} – {family.peopleCount} נפשות ({family.simchaType})
                    </h3>
                    {family.dietaryNotes && (
                        <p className="w-fit rounded-xl bg-gold-50 px-4 py-2 text-sm text-gold-800">הערות אוכל: {family.dietaryNotes}</p>
                    )}
                    <div className="overflow-x-auto">
                        <table className={table}>
                            <thead>
                                <tr>
                                    <th>קטגוריה</th>
                                    <th>מנות</th>
                                    <th>סטטוס</th>
                                    <th>מתנדבת</th>
                                    <th>מוצר</th>
                                    <th></th>
                                </tr>
                            </thead>
                            <tbody>
                                {family.slots.map((slot) => (
                                    <tr key={slot.id}>
                                        <td className="font-bold">{slot.categoryLabel}</td>
                                        <td>{slot.portions}</td>
                                        <td><span className={chip} data-status={slot.status}>{SLOT_STATUS_LABELS[slot.status]}</span></td>
                                        <td>
                                            {slot.assignment
                                                ? `${slot.assignment.user.firstName} ${slot.assignment.user.lastName} (${slot.assignment.user.phone})`
                                                : '-'}
                                        </td>
                                        <td>{slot.assignment?.product.name ?? '-'}</td>
                                        <td>
                                            {slot.status === 'OPEN' && !isClosed && (
                                                <button
                                                    type="button"
                                                    disabled={deleteSlot.isPending}
                                                    onClick={() => handleDeleteSlot(slot.id)}
                                                    className={btnSmallDanger}
                                                >
                                                    מחיקה
                                                </button>
                                            )}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            ))}
        </div>
    );
}
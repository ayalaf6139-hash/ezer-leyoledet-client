import { useState } from 'react';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import FamilyCard from '../../components/FamilyCard';
import SlotRegistrationModal from '../../components/SlotRegistrationModal';
import { useCurrentBoard } from '../../hooks/useBoard';
import { CATEGORY_LABELS, formatDate, formatDateTime } from '../../utils/format';
import { card, eyebrow, filterSide, muted, page, pageHeader, pageTitle, statNumber, statTile } from '../../utils/styles';
import type { BoardFamily, BoardSlot, Category } from '../../types';

export default function Board() {
    const [category, setCategory] = useState<Category | ''>('');
    const [onlyOpen, setOnlyOpen] = useState(false);
    const [selected, setSelected] = useState<{ slot: BoardSlot; family: BoardFamily } | null>(null);

    const { data, isLoading, error } = useCurrentBoard(category, onlyOpen);

    if (isLoading) return <Loading />;
    if (error) return <ErrorMessage error={error} />;
    if (!data?.shabbat) return <p className={`${card} ${muted} text-center`}>אין כרגע שבת פתוחה להרשמה</p>;

    const { shabbat, slotCounts, families } = data;

    return (
        <div className={page}>
            <div className={pageHeader}>
                <p className={eyebrow}>שבת {formatDate(shabbat.shabbatDate)}</p>
                <h1 className={`${pageTitle} mt-1`}>לוח השבוע – פרשת {shabbat.parasha}</h1>
                <p className={`${muted} mt-2`}>
                    מסירה עד: <b className="text-ink">{formatDateTime(shabbat.deliveryDeadline)}</b> · נקודת איסוף: <b className="text-ink">{shabbat.collectionPoint}</b>
                </p>
            </div>

            {shabbat.message && <p className={`${card} leading-relaxed`}>{shabbat.message}</p>}
            {slotCounts && (
                <div className="grid grid-cols-3 gap-4">
                    <p className={statTile}><span className={statNumber}>{slotCounts.open}</span><span className={muted}>פנויות</span></p>
                    <p className={statTile}><span className={statNumber}>{slotCounts.taken}</span><span className={muted}>תפוסות</span></p>
                    <p className={statTile}><span className={statNumber}>{slotCounts.delivered}</span><span className={muted}>נמסרו</span></p>
                </div>
            )}
            {!shabbat.isOpenForRegistration && (
                <p role="alert" className="rounded-2xl border border-rose-200 bg-rose-50 px-5 py-4 text-center text-sm font-semibold text-rose-800">ההרשמה לשבת זו נסגרה</p>
            )}

            <div className="grid items-start gap-6 lg:grid-cols-[15rem_1fr]">
                <div className={`${filterSide} lg:sticky lg:top-28`}>
                    <p className="font-serif text-lg font-bold">סינון</p>
                    <label htmlFor="category">קטגוריה:</label>
                    <select
                        id="category"
                        value={category}
                        onChange={(e) => setCategory(e.target.value as Category | '')}
                    >
                        <option value="">הכול</option>
                        {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                            <option key={value} value={value}>{label}</option>
                        ))}
                    </select>

                    <label>
                        <input
                            type="checkbox"
                            checked={onlyOpen}
                            onChange={(e) => setOnlyOpen(e.target.checked)}
                        />
                        רק פנויות
                    </label>
                </div>

                <div className="grid gap-6 md:grid-cols-2">
                    {families.length === 0 && <p className={`${card} ${muted} md:col-span-2`}>אין משבצות להצגה</p>}

                    {families.map((family) => (
                        <FamilyCard
                            key={family.label}
                            family={family}
                            canRegister={shabbat.isOpenForRegistration}
                            onSlotClick={(slot) => setSelected({ slot, family })}
                        />
                    ))}
                </div>
            </div>

            {selected && (
                <SlotRegistrationModal
                    slot={selected.slot}
                    family={selected.family}
                    deliveryDeadline={shabbat.deliveryDeadline}
                    onClose={() => setSelected(null)}
                />
            )}
        </div>
    );
}
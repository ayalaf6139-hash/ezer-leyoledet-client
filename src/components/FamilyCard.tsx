import type { BoardFamily, BoardSlot } from '../types';
import { btnGold, card, chip, muted } from '../utils/styles';

interface FamilyCardProps {
    family: BoardFamily;
    canRegister: boolean;
    onSlotClick: (slot: BoardSlot) => void;
}

export default function FamilyCard({ family, canRegister, onSlotClick }: FamilyCardProps) {
    return (
        <div className={`${card} flex flex-col gap-4 transition hover:-translate-y-1 hover:border-gold-300`}>
            <div>
                <h3 className="font-serif text-xl font-bold">{family.label} – {family.peopleCount} נפשות</h3>
                <p className={muted}>שמחה: {family.simchaType}</p>
                {family.dietaryNotes && (
                    <p className="mt-2 rounded-xl bg-gold-50 px-3 py-2 text-sm text-gold-800">הערות אוכל: {family.dietaryNotes}</p>
                )}
            </div>

            <ul className="flex flex-col gap-2">
                {family.slots.map((slot) => (
                    <li
                        key={slot.id}
                        className={`flex flex-wrap items-center justify-between gap-2 rounded-2xl border px-4 py-3 text-sm ${slot.isMine ? 'border-gold-300 bg-gold-50' : 'border-cream-200 bg-cream-50'}`}
                    >
                        <span>
                            <strong className="text-ink">{slot.categoryLabel}</strong>{' '}
                            <span className="text-ink-soft">({slot.portions} מנות)</span>
                        </span>
                        {slot.status === 'OPEN' ? (
                            canRegister ? (
                                <button type="button" onClick={() => onSlotClick(slot)} className={btnGold}>
                                    אני לוקחת
                                </button>
                            ) : (
                                <span className={chip} data-status="OPEN">פנוי</span>
                            )
                        ) : (
                            <span className={chip} data-status={slot.status}>
                                {slot.productName}
                                {slot.isMine && ' (שלי)'}
                                {slot.status === 'DELIVERED' && ' ✓ נמסר'}
                            </span>
                        )}
                    </li>
                ))}
            </ul>
        </div>
    );
}

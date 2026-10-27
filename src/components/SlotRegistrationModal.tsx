import { useForm } from 'react-hook-form';
import Loading from './Loading';
import ErrorMessage from './ErrorMessage';
import { useProducts } from '../hooks/useProducts';
import { useTakeSlot } from '../hooks/useBoard';
import { getErrorMessage } from '../utils/api';
import { formatDateTime } from '../utils/format';
import { btnGold, btnOutline, eyebrow, formButtons, formFields, goldLine } from '../utils/styles';
import type { BoardFamily, BoardSlot } from '../types';

interface SlotRegistrationModalProps {
    slot: BoardSlot;
    family: BoardFamily;
    deliveryDeadline: string;
    onClose: () => void;
}

interface SlotFormData {
    productId: number;
    note: string;
}

export default function SlotRegistrationModal({
    slot,
    family,
    deliveryDeadline,
    onClose,
}: SlotRegistrationModalProps) {
    const { data: products, isLoading, error } = useProducts(slot.category);
    const takeSlot = useTakeSlot();

    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm<SlotFormData>({ defaultValues: { note: '' } });

    const onSubmit = (data: SlotFormData) => {
        takeSlot.mutate(
            { slotId: slot.id, productId: data.productId, note: data.note },
            {
                onSuccess: () => {
                    alert('תודה! נרשמת בהצלחה');
                    onClose();
                },
                onError: (err) => {
                    alert(getErrorMessage(err, 'ההרשמה נכשלה, נסי שוב'));
                    onClose();
                },
            },
        );
    };

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gold-900/40 p-4 backdrop-blur-sm" onClick={onClose}>
            <div
                className="max-h-[90vh] w-full max-w-lg overflow-y-auto rounded-3xl border-2 border-gold-300 bg-white p-8 shadow-2xl"
                onClick={(e) => e.stopPropagation()}
            >
                <p className={`text-center ${eyebrow}`}>הרשמה למשבצת</p>
                <h2 className="mt-1 text-center font-serif text-2xl font-black">{family.label} – {family.peopleCount} נפשות</h2>
                <div className={`my-5 ${goldLine}`} />
                <div className="mb-6 space-y-1 text-center text-sm text-ink-soft">
                    <p>קטגוריה: <b className="text-ink">{slot.categoryLabel}</b> · {slot.portions} מנות</p>
                    <p>מועד מסירה: <b className="text-ink">{formatDateTime(deliveryDeadline)}</b></p>
                    {family.dietaryNotes && (
                        <p className="mt-3 rounded-xl bg-gold-50 px-3 py-2 text-gold-800">הערות אוכל: {family.dietaryNotes}</p>
                    )}
                </div>

                {isLoading && <Loading />}
                {error && <ErrorMessage error={error} />}

                {products && (
                    <form onSubmit={handleSubmit(onSubmit)} className={formFields}>
                        <div>
                            <label htmlFor="productId">מה אביא:</label>
                            <select
                                id="productId"
                                {...register('productId', {
                                    valueAsNumber: true,
                                    validate: (value) => !Number.isNaN(value) || 'יש לבחור מוצר',
                                })}
                            >
                                <option value="">בחרי מוצר</option>
                                {products.map((product) => (
                                    <option key={product.id} value={product.id}>
                                        {product.name}
                                    </option>
                                ))}
                            </select>
                            {errors.productId && <span>{errors.productId.message}</span>}
                        </div>

                        <div>
                            <label htmlFor="note">הערה (לא חובה):</label>
                            <textarea
                                id="note"
                                {...register('note', {
                                    maxLength: { value: 300, message: 'עד 300 תווים' },
                                })}
                            />
                            {errors.note && <span>{errors.note.message}</span>}
                        </div>

                        <div className={formButtons}>
                            <button type="submit" disabled={takeSlot.isPending} className={`${btnGold} flex-1`}>
                                {takeSlot.isPending ? 'שולחת...' : 'אני מביאה'}
                            </button>
                            <button type="button" onClick={onClose} className={btnOutline}>ביטול</button>
                        </div>
                    </form>
                )}
            </div>
        </div>
    );
}

import { useForm } from 'react-hook-form';
import { useShabbatBoard } from '../hooks/useShabbatot';
import { useVolunteers } from '../hooks/useVolunteers';
import { useProducts } from '../hooks/useProducts';
import { useManualAssign } from '../hooks/useAdminAssignments';
import { getErrorMessage } from '../utils/api';
import { btnGold, card, form, formGrid, muted } from '../utils/styles';
import type { ManualAssignFormData } from '../types';

interface ManualAssignFormProps {
    shabbatId: number;
}

export default function ManualAssignForm({ shabbatId }: ManualAssignFormProps) {
    const { data: board } = useShabbatBoard(shabbatId);
    const { data: volunteers } = useVolunteers('ACTIVE', '');
    const manualAssign = useManualAssign();

    const {
        register,
        handleSubmit,
        watch,
        reset,
        formState: { errors },
    } = useForm<ManualAssignFormData>({ defaultValues: { note: '' } });

    const openSlots =
        board?.families.flatMap((family) =>
            family.slots
                .filter((slot) => slot.status === 'OPEN')
                .map((slot) => ({ ...slot, familyName: family.familyName })),
        ) ?? [];

    const selectedSlot = openSlots.find((slot) => slot.id === watch('slotId'));
    const { data: products } = useProducts(selectedSlot?.category);

    const onSubmit = (data: ManualAssignFormData) => {
        manualAssign.mutate(data, {
            onSuccess: () => {
                alert('השיבוץ נוסף');
                reset({ note: '' });
            },
            onError: (err) => alert(getErrorMessage(err, 'השיבוץ נכשל, נסי שוב')),
        });
    };

    if (board && openSlots.length === 0) {
        return <p className={`${card} ${muted}`}>אין משבצות פנויות לשיבוץ ידני</p>;
    }

    return (
        <form onSubmit={handleSubmit(onSubmit)} className={`${form} ${formGrid}`}>
            <h2>שיבוץ ידני של מתנדבת</h2>

            <div>
                <label htmlFor="slotId">משבצת פנויה:</label>
                <select
                    id="slotId"
                    {...register('slotId', {
                        valueAsNumber: true,
                        validate: (value) => !Number.isNaN(value) || 'יש לבחור משבצת',
                    })}
                >
                    <option value="">בחרי משבצת</option>
                    {openSlots.map((slot) => (
                        <option key={slot.id} value={slot.id}>
                            משפחת {slot.familyName} – {slot.categoryLabel} ({slot.portions} מנות)
                        </option>
                    ))}
                </select>
                {errors.slotId && <span>{errors.slotId.message}</span>}
            </div>

            <div>
                <label htmlFor="userId">מתנדבת:</label>
                <select
                    id="userId"
                    {...register('userId', {
                        valueAsNumber: true,
                        validate: (value) => !Number.isNaN(value) || 'יש לבחור מתנדבת',
                    })}
                >
                    <option value="">בחרי מתנדבת</option>
                    {volunteers?.items
                        .filter((user) => user.role === 'VOLUNTEER')
                        .map((user) => (
                            <option key={user.id} value={user.id}>
                                {user.firstName} {user.lastName} ({user.phone})
                            </option>
                        ))}
                </select>
                {errors.userId && <span>{errors.userId.message}</span>}
            </div>

            <div>
                <label htmlFor="productId">מוצר:</label>
                <select
                    id="productId"
                    disabled={!selectedSlot}
                    {...register('productId', {
                        valueAsNumber: true,
                        validate: (value) => !Number.isNaN(value) || 'יש לבחור מוצר',
                    })}
                >
                    <option value="">{selectedSlot ? 'בחרי מוצר' : 'קודם בחרי משבצת'}</option>
                    {selectedSlot &&
                        products?.map((product) => (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        ))}
                </select>
                {errors.productId && <span>{errors.productId.message}</span>}
            </div>

            <div>
                <label htmlFor="assignNote">הערה (לא חובה):</label>
                <textarea id="assignNote" {...register('note', { maxLength: 300 })} />
            </div>

            <div>
                <button type="submit" disabled={manualAssign.isPending} className={btnGold}>
                    {manualAssign.isPending ? 'משבצת...' : 'שיבוץ'}
                </button>
            </div>
        </form>
    );
}
import { useState } from 'react';
import Loading from '../../components/Loading';
import ErrorMessage from '../../components/ErrorMessage';
import ProductForm from '../../components/ProductForm';
import { useAdminProducts, useSaveProduct, useToggleProduct } from '../../hooks/useProducts';
import { getErrorMessage } from '../../utils/api';
import { CATEGORY_LABELS } from '../../utils/format';
import type { Category, Product, ProductFormData } from '../../types';
import { btnGold, btnSmall, card, chip, eyebrow, filterBar, muted, page, pageHeader, pageTitle, table, tableWrap } from '../../utils/styles';

export default function Products() {
    const [category, setCategory] = useState<Category | ''>('');
    const [editingProduct, setEditingProduct] = useState<Product | null>(null);
    const [isAdding, setIsAdding] = useState(false);

    const { data, isLoading, error } = useAdminProducts(category);
    const saveProduct = useSaveProduct();
    const toggleProduct = useToggleProduct();

    const closeForm = () => {
        setEditingProduct(null);
        setIsAdding(false);
    };

    const handleSave = (formData: ProductFormData) => {
        saveProduct.mutate(
            { id: editingProduct?.id, data: formData },
            {
                onSuccess: closeForm,
                onError: (err) => alert(getErrorMessage(err, 'השמירה נכשלה, נסי שוב')),
            },
        );
    };

    const handleToggle = (product: Product) => {
        const question = product.isActive
            ? `להשבית את המוצר ${product.name}?`
            : `להחזיר לפעילות את המוצר ${product.name}?`;
        if (!window.confirm(question)) return;
        toggleProduct.mutate(
            { id: product.id, isActive: product.isActive },
            { onError: (err) => alert(getErrorMessage(err, 'הפעולה נכשלה, נסי שוב')) },
        );
    };

    const showForm = isAdding || editingProduct !== null;

    return (
        <div className={page}>
            <div className={pageHeader}>
                <p className={eyebrow}>מה מבשלים</p>
                <h1 className={`${pageTitle} mt-1`}>ניהול מוצרים</h1>
            </div>

            {showForm ? (
                <ProductForm
                    key={editingProduct?.id ?? 'new'}
                    product={editingProduct ?? undefined}
                    isSaving={saveProduct.isPending}
                    onSubmit={handleSave}
                    onCancel={closeForm}
                />
            ) : (
                <button type="button" onClick={() => setIsAdding(true)} className={btnGold}>+ הוספת מוצר</button>
            )}

            <div className={filterBar}>
                <label htmlFor="productCategory">קטגוריה:</label>
                <select
                    id="productCategory"
                    value={category}
                    onChange={(e) => setCategory(e.target.value as Category | '')}
                >
                    <option value="">הכול</option>
                    {Object.entries(CATEGORY_LABELS).map(([value, label]) => (
                        <option key={value} value={value}>{label}</option>
                    ))}
                </select>
            </div>

            {isLoading && <Loading />}
            {error && <ErrorMessage error={error} />}

            {data && data.length === 0 && <p className={`${card} ${muted} text-center`}>לא נמצאו מוצרים</p>}

            {data && data.length > 0 && (
                <div className={tableWrap}>
                    <table className={table}>
                        <thead>
                            <tr>
                                <th>שם מוצר</th>
                                <th>קטגוריה</th>
                                <th>תיאור</th>
                                <th>סטטוס</th>
                                <th>פעולות</th>
                            </tr>
                        </thead>
                        <tbody>
                            {data.map((product) => (
                                <tr key={product.id}>
                                    <td className="font-bold">{product.name}</td>
                                    <td>{product.categoryLabel}</td>
                                    <td>{product.description ?? '-'}</td>
                                    <td><span className={chip} data-status={product.isActive ? 'ACTIVE' : 'INACTIVE'}>{product.isActive ? 'פעיל' : 'מושבת'}</span></td>
                                    <td>
                                        <button
                                            className={btnSmall}
                                            type="button"
                                            onClick={() => {
                                                setIsAdding(false);
                                                setEditingProduct(product);
                                            }}
                                        >
                                            עריכה
                                        </button>
                                        <button
                                            className={btnSmall}
                                            type="button"
                                            disabled={toggleProduct.isPending}
                                            onClick={() => handleToggle(product)}
                                        >
                                            {product.isActive ? 'השבתה' : 'החזרה לפעילות'}
                                        </button>
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
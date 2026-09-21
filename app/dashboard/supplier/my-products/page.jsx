'use client';
import { useState } from 'react';
import {
  useProducts,
  useSaveProduct,
  useDeleteProduct,
} from '@/src/hooks/supplier/useSupplierProducts';
import { toProductPayload, productToForm, MATERIAL_TITLES } from '@/src/lib/validators/supplier';
import PageHeader from '@/src/components/supplier/PageHeader';
import ProductCard from '@/src/components/supplier/ProductCard';
import ProductFormModal from '@/src/components/supplier/ProductFormModal';
import EmptyState from '@/src/components/supplier/EmptyState';
import DeleteConfirmModal from '@/src/components/admin/DeleteConfirmModal';
import { primaryBtnClass } from '@/src/components/supplier/formStyles';

const EMPTY_FORM = { material: MATERIAL_TITLES[0], description: '', price: '', stockType: 'in', stockNote: '' };

export default function MyProductsPage() {
  const { data: products = [], isLoading, isError, error } = useProducts();
  const saveProduct = useSaveProduct();
  const deleteProduct = useDeleteProduct();

  const [modal, setModal] = useState(null);
  const [productToRemove, setProductToRemove] = useState(null);

  function handleSubmit(values) {
    saveProduct.mutate(toProductPayload(values), {
      onSuccess: () => setModal(null),
      onError: (err) => alert(err.message),
    });
  }

  function confirmRemove() {
    deleteProduct.mutate(productToRemove.id, {
      onSuccess: () => setProductToRemove(null),
      onError: (err) => alert(err.message),
    });
  }

  if (isLoading) {
    return <div className="p-10 text-center text-crewMuted text-sm">Loading products…</div>;
  }

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title="My Products"
        subtitle={`Manage inventory and listings · ${products.length} product${products.length !== 1 ? 's' : ''}`}
        action={
          <button onClick={() => setModal({ mode: 'add' })} className={primaryBtnClass}>
            + Add Product
          </button>
        }
      />

      {isError && <EmptyState message={error?.message || 'Failed to load products.'} />}

      <div className="grid grid-cols-[repeat(auto-fill,minmax(230px,1fr))] gap-4">
        {products.map((p) => (
          <ProductCard
            key={p.id}
            product={p}
            onEdit={(product) => setModal({ mode: 'edit', product })}
            onRemove={() => setProductToRemove(p)}
            isDeleting={deleteProduct.isPending && deleteProduct.variables === p.id}
          />
        ))}
      </div>

      {!isError && products.length === 0 && <EmptyState message="No products yet — add your first one." />}

      <ProductFormModal
        open={modal !== null}
        title={modal?.mode === 'edit' ? 'Edit Product' : 'New Product'}
        defaultValues={modal?.mode === 'edit' ? productToForm(modal.product) : EMPTY_FORM}
        onSubmit={handleSubmit}
        onClose={() => setModal(null)}
        submitLabel={modal?.mode === 'edit' ? 'Save Changes' : 'Add Product'}
        isSubmitting={saveProduct.isPending}
      />

      {productToRemove && (
        <DeleteConfirmModal
          title="Remove this product?"
          message={
            <>
              <span className="font-medium text-slate">{productToRemove.title ?? productToRemove.name ?? 'This product'}</span> will be
              permanently removed. This can&apos;t be undone.
            </>
          }
          confirmLabel="Remove product"
          confirmingLabel="Removing…"
          isDeleting={deleteProduct.isPending}
          onCancel={() => setProductToRemove(null)}
          onConfirm={confirmRemove}
        />
      )}
    </div>
  );
}
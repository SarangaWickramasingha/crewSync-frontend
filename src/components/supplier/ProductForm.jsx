'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, MATERIAL_TITLES } from '@/src/lib/validators/supplier';
import FormField from '@/src/components/supplier/FormField';

const STOCK_OPTIONS = [
  { value: 'in', label: 'In Stock' },
  { value: 'low', label: 'Low Stock' },
  { value: 'out', label: 'Out of Stock' },
];

const inputClass =
  'w-full border border-border rounded-lg px-3 py-2 text-xs text-slate bg-white outline-none ' +
  'focus:border-supplier focus:ring-1 focus:ring-supplier/20 transition-all';

const selectClass = `${inputClass} cursor-pointer`;

export default function ProductForm({ defaultValues, onSubmit, onCancel, submitLabel = 'Add Product', isSubmitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3 text-left w-full">
      <FormField label="Product Title" error={errors.material?.message}>
        <select {...register('material')} className={selectClass}>
          {MATERIAL_TITLES.map((title) => (
            <option key={title} value={title}>{title}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Unit Price" error={errors.price?.message}>
        <input type="text" placeholder="e.g. 1500" {...register('price')} className={inputClass} />
      </FormField>

      <FormField label="Stock Status" error={errors.stockType?.message}>
        <select {...register('stockType')} className={selectClass}>
          {STOCK_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Available Quantity" error={errors.stockNote?.message}>
        <input type="text" placeholder="e.g. 100" {...register('stockNote')} className={inputClass} />
      </FormField>

      <FormField label="Description" error={errors.description?.message} className="col-span-2">
        <textarea rows={2} placeholder="e.g. Durable weather-resistant material" {...register('description')} className={inputClass} />
      </FormField>

      <div className="col-span-2 flex gap-2.5 justify-center w-full pt-2">
        {onCancel && (
          <button
            type="button"
            onClick={onCancel}
            className="flex-1 py-2.5 px-4 rounded-lg border border-border bg-white text-crewSlate-light text-[0.84rem] font-semibold hover:bg-surface transition-colors cursor-pointer text-center"
          >
            Cancel
          </button>
        )}
        <button
          type="submit"
          disabled={isSubmitting}
          className="flex-1 py-2.5 px-4 rounded-lg border-none bg-supplier hover:bg-supplier-dark text-white text-[0.84rem] font-semibold transition-colors cursor-pointer text-center disabled:opacity-60 disabled:cursor-wait"
        >
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}

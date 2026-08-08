'use client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { productSchema, MATERIAL_TITLES } from '@/src/lib/validators/supplier';
import FormField from '@/src/components/supplier/FormField';
import { fieldClass, selectClass, primaryBtnClass, ghostBtnClass } from '@/src/components/supplier/formStyles';

const STOCK_OPTIONS = [
  { value: 'in', label: 'In Stock' },
  { value: 'low', label: 'Low Stock' },
  { value: 'out', label: 'Out of Stock' },
];

export default function ProductForm({ defaultValues, onSubmit, onCancel, submitLabel = 'Save', isSubmitting }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(productSchema),
    defaultValues,
  });

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-2 gap-3">
      <FormField label="Product Title" error={errors.material?.message}>
        <select {...register('material')} className={selectClass}>
          {MATERIAL_TITLES.map((title) => (
            <option key={title} value={title}>{title}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Unit Price" error={errors.price?.message}>
        <input type="text" placeholder="e.g. 1500" {...register('price')} className={fieldClass} />
      </FormField>

      <FormField label="Stock Status" error={errors.stockType?.message}>
        <select {...register('stockType')} className={selectClass}>
          {STOCK_OPTIONS.map((o) => (
            <option key={o.value} value={o.value}>{o.label}</option>
          ))}
        </select>
      </FormField>

      <FormField label="Available Quantity" error={errors.stockNote?.message}>
        <input type="text" placeholder="e.g. 100" {...register('stockNote')} className={fieldClass} />
      </FormField>

      <FormField label="Description" error={errors.description?.message} className="col-span-2">
        <textarea rows={2} placeholder="e.g. Durable weather-resistant material" {...register('description')} className={fieldClass} />
      </FormField>

      <div className="col-span-2 flex justify-end gap-2 pt-1">
        {onCancel && (
          <button type="button" onClick={onCancel} className={ghostBtnClass}>Cancel</button>
        )}
        <button type="submit" disabled={isSubmitting} className={primaryBtnClass}>
          {isSubmitting ? 'Saving…' : submitLabel}
        </button>
      </div>
    </form>
  );
}

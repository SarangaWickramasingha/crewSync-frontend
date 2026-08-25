'use client';
import { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import FormField from '@/src/components/supplier/FormField';
import { fieldClass, selectClass, primaryBtnClass } from '@/src/components/supplier/formStyles';

export default function ProfileFormCard({ title, schema, defaultValues, fields, onSubmit, submitLabel, isSubmitting }) {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    values: defaultValues,
  });

  useEffect(() => {
    if (defaultValues) {
      reset(defaultValues);
    }
  }, [defaultValues, reset]);

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white border border-black/10 rounded-xl p-6 shadow-sm">
      <h3 className="font-syne text-base font-bold text-crewSlate mb-4">{title}</h3>

      <div className="grid grid-cols-2 gap-3">
        {fields.map((f) => (
          <FormField key={f.name} label={f.label} error={errors[f.name]?.message} className={f.full ? 'col-span-2' : ''}>
            {f.type === 'textarea' ? (
              <textarea rows={2} placeholder={f.placeholder} {...register(f.name)} className={`${fieldClass} resize-y`} />
            ) : f.type === 'select' ? (
              <select {...register(f.name)} className={selectClass}>
                {f.options.map((o) => (
                  <option key={o} value={o}>{o}</option>
                ))}
              </select>
            ) : (
              <input type={f.type || 'text'} placeholder={f.placeholder} {...register(f.name)} className={fieldClass} />
            )}
          </FormField>
        ))}
      </div>

      <button type="submit" disabled={isSubmitting} className={`${primaryBtnClass} w-full mt-4`}>
        {isSubmitting ? 'Saving…' : submitLabel}
      </button>
    </form>
  );
}

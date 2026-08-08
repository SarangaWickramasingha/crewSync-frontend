'use client';
import { useState } from 'react';
import { useProfile, useUpdateProfile } from '@/src/hooks/supplier/useSupplierProfile';
import PageHeader from '@/src/components/supplier/PageHeader';
import ProfileFormCard from '@/src/components/supplier/ProfileFormCard';
import EmptyState from '@/src/components/supplier/EmptyState';
import {
  personalInfoSchema,
  businessInfoSchema,
  hardwareStoreSchema,
} from '@/src/lib/validators/supplier';

const DISTRICTS = [
  'Kandy', 'Colombo', 'Gampaha', 'Matale', 'Badulla',
  'Nuwaraeliya', 'Kurunegala', 'Galle', 'Matara', 'Jaffna',
];

const PERSONAL_FIELDS = [
  { name: 'firstName', label: 'First Name' },
  { name: 'lastName', label: 'Last Name' },
  { name: 'contactNumber', label: 'Contact Number', type: 'tel' },
  { name: 'district', label: 'District', type: 'select', options: DISTRICTS },
];

const BUSINESS_FIELDS = [
  { name: 'businessName', label: 'Business Name' },
  { name: 'businessAddress', label: 'Business Address', type: 'textarea', full: true },
];

const HARDWARE_FIELDS = [
  { name: 'storeName', label: 'Store Name' },
  { name: 'brNumber', label: 'BR Number' },
  { name: 'address', label: 'Address', type: 'textarea', full: true },
];

export default function SupplierProfilePage() {
  const { data: profile, isLoading, isError, error } = useProfile();
  const update = useUpdateProfile();

  const [hardwareOverride, setHardwareOverride] = useState(null);
  const hasHardware = hardwareOverride ?? Boolean(profile?.isHardwareShop);

  const save = (payload) =>
    update.mutate(payload, { onError: (err) => alert(err.message) });

  const toggleHardware = (checked) => {
    setHardwareOverride(checked);
    save({ isHardwareShop: checked });
  };

  if (isLoading) {
    return <div className="p-10 text-center text-crewMuted text-sm">Loading profile…</div>;
  }

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title="My Profile"
        subtitle="Update your personal details, business information, and store details"
      />

      {isError && <EmptyState message={error?.message || 'Failed to load profile.'} />}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <div className="flex flex-col gap-4">
          <ProfileFormCard
            title="Personal Information"
            schema={personalInfoSchema}
            defaultValues={{
              firstName: profile?.firstName || '',
              lastName: profile?.lastName || '',
              contactNumber: profile?.contactNumber || '',
              district: profile?.district || DISTRICTS[0],
            }}
            fields={PERSONAL_FIELDS}
            onSubmit={(values) =>
              save({
                firstName: values.firstName,
                lastName: values.lastName,
                contactNumber: values.contactNumber,
                district: values.district,
              })
            }
            submitLabel="Update Personal Info"
            isSubmitting={update.isPending}
          />

          <ProfileFormCard
            title="Business Information"
            schema={businessInfoSchema}
            defaultValues={{
              businessName: profile?.businessName || '',
              businessAddress: profile?.businessAddress || '',
            }}
            fields={BUSINESS_FIELDS}
            onSubmit={(values) =>
              save({
                businessName: values.businessName,
                businessAddress: values.businessAddress,
              })
            }
            submitLabel="Update Business Info"
            isSubmitting={update.isPending}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasHardware}
                onChange={(e) => toggleHardware(e.target.checked)}
                className="mt-1 w-4 h-4 accent-[#1A56A0] cursor-pointer"
              />
              <div>
                <span className="text-sm font-semibold block">I also have a hardware store</span>
                <span className="text-xs text-crewMuted mt-0.5">
                  Property owners will know you carry tools, fittings, electrical and plumbing items.
                </span>
              </div>
            </label>
          </div>

          {hasHardware && (
            <ProfileFormCard
              title="Hardware Store Details"
              schema={hardwareStoreSchema}
              defaultValues={{
                storeName: profile?.storeName || '',
                brNumber: profile?.brNumber || '',
                address: profile?.address || '',
              }}
              fields={HARDWARE_FIELDS}
              onSubmit={(values) =>
                save({
                  storeName: values.storeName,
                  brNumber: values.brNumber,
                  address: values.address,
                })
              }
              submitLabel="Update Hardware Info"
              isSubmitting={update.isPending}
            />
          )}
        </div>
      </div>
    </div>
  );
}

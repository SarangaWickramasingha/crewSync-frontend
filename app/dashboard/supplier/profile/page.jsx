'use client';
import { useState, useEffect } from 'react';
import PageHeader from '@/src/components/supplier/PageHeader';
import ProfileFormCard from '@/src/components/supplier/ProfileFormCard';
import { useSupplierProfile, useUpdateSupplierProfile } from '@/src/hooks/supplier/useSupplierProfile';
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
  { name: 'city', label: 'City' },
  { name: 'businessAddress', label: 'Business Address', type: 'textarea', full: true },
];

const HARDWARE_FIELDS = [
  { name: 'storeName', label: 'Store Name' },
  { name: 'brNumber', label: 'BR Number' },
  { name: 'address', label: 'Address', type: 'textarea', full: true },
];

const EMPTY_PERSONAL = { firstName: '', lastName: '', contactNumber: '', district: '' };
const EMPTY_BUSINESS = { businessName: '', city: '', businessAddress: '' };
const EMPTY_HARDWARE = { storeName: '', brNumber: '', address: '' };

export default function SupplierProfilePage() {
  const { data: profile, isLoading } = useSupplierProfile();
  const updateProfile = useUpdateSupplierProfile();

  const [hasHardware, setHasHardware] = useState(false);
  const [personal, setPersonal] = useState(EMPTY_PERSONAL);
  const [business, setBusiness] = useState(EMPTY_BUSINESS);
  const [hardware, setHardware] = useState(EMPTY_HARDWARE);

  useEffect(() => {
    if (profile) {
      setPersonal(profile.personal ?? EMPTY_PERSONAL);
      setBusiness(profile.business ?? EMPTY_BUSINESS);
      setHasHardware(profile.hasHardware ?? false);
      setHardware(profile.hardware ?? EMPTY_HARDWARE);
    }
  }, [profile]);

  function handlePersonalSubmit(values) {
    updateProfile.mutate({ section: 'personal', data: values });
  }

  function handleBusinessSubmit(values) {
    updateProfile.mutate({ section: 'business', data: values });
  }

  function handleHardwareSubmit(values) {
    updateProfile.mutate({ section: 'hardware', data: { hasHardware, ...values } });
  }

  function handleHardwareToggle(checked) {
    setHasHardware(checked);
    updateProfile.mutate({ section: 'hardware', data: { hasHardware: checked, ...hardware } });
  }

  if (isLoading) {
    return <div className="p-10 text-center text-crewMuted text-sm">Loading profile…</div>;
  }

  return (
    <div className="animate-fadeIn">
      <PageHeader
        title="My Profile"
        subtitle="Update your personal details, business information, and store details"
      />

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 items-start">
        <div className="flex flex-col gap-4">
          <ProfileFormCard
            title="Personal Information"
            schema={personalInfoSchema}
            defaultValues={personal}
            fields={PERSONAL_FIELDS}
            onSubmit={handlePersonalSubmit}
            submitLabel={updateProfile.isPending && updateProfile.variables?.section === 'personal' ? 'Saving…' : 'Update Personal Info'}
            isSubmitting={updateProfile.isPending && updateProfile.variables?.section === 'personal'}
          />

          <ProfileFormCard
            title="Business Information"
            schema={businessInfoSchema}
            defaultValues={business}
            fields={BUSINESS_FIELDS}
            onSubmit={handleBusinessSubmit}
            submitLabel={updateProfile.isPending && updateProfile.variables?.section === 'business' ? 'Saving…' : 'Update Business Info'}
            isSubmitting={updateProfile.isPending && updateProfile.variables?.section === 'business'}
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasHardware}
                onChange={(e) => handleHardwareToggle(e.target.checked)}
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
              defaultValues={hardware}
              fields={HARDWARE_FIELDS}
              onSubmit={handleHardwareSubmit}
              submitLabel={updateProfile.isPending && updateProfile.variables?.section === 'hardware' ? 'Saving…' : 'Update Hardware Info'}
              isSubmitting={updateProfile.isPending && updateProfile.variables?.section === 'hardware'}
            />
          )}
        </div>
      </div>
    </div>
  );
}

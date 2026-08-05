'use client';
import { useState } from 'react';
import PageHeader from '@/src/components/supplier/PageHeader';
import ProfileFormCard from '@/src/components/supplier/ProfileFormCard';
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
  const [hasHardware, setHasHardware] = useState(true);

  // No supplier profile endpoint exists yet — forms validate + report locally.
  const handleSubmit = (section) => {
    alert(`${section} updated!`);
  };

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
            defaultValues={{
              firstName: 'Malshan',
              lastName: 'Perera',
              contactNumber: '+94 77 123 4567',
              district: 'Kandy',
            }}
            fields={PERSONAL_FIELDS}
            onSubmit={() => handleSubmit('Personal Information')}
            submitLabel="Update Personal Info"
          />

          <ProfileFormCard
            title="Business Information"
            schema={businessInfoSchema}
            defaultValues={{
              businessName: 'Malshan Hardware',
              businessAddress: 'No. 45, Peradeniya Road, Kandy',
            }}
            fields={BUSINESS_FIELDS}
            onSubmit={() => handleSubmit('Business Information')}
            submitLabel="Update Business Info"
          />
        </div>

        <div className="flex flex-col gap-4">
          <div className="bg-white border border-black/10 rounded-xl p-4 shadow-sm">
            <label className="flex items-start gap-3 cursor-pointer">
              <input
                type="checkbox"
                checked={hasHardware}
                onChange={(e) => setHasHardware(e.target.checked)}
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
                storeName: 'Malshan Hardware Store',
                brNumber: 'BR-102938',
                address: 'No. 45, Peradeniya Road, Kandy',
              }}
              fields={HARDWARE_FIELDS}
              onSubmit={() => handleSubmit('Hardware Store Information')}
              submitLabel="Update Hardware Info"
            />
          )}
        </div>
      </div>
    </div>
  );
}

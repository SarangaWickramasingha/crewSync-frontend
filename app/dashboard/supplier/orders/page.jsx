'use client';
import { useState } from 'react';
import useOrdersFilters from '@/src/hooks/supplier/useOrdersFilters';
import PageHeader from '@/src/components/supplier/PageHeader';
import OrdersTable from '@/src/components/supplier/OrdersTable';
import OrdersFilterPanel, { OrdersFilterToggle } from '@/src/components/supplier/OrdersFilterBar';

const INITIAL_ORDERS = [
  { id: '#ORD-041', customer: 'Nimal Kumarasinghe', items: 'Cement × 20 bags', amount: 'LKR 57,000', date: 'Jul 4, 2026', status: 'New' },
  { id: '#ORD-040', customer: 'Chamari Perera', items: 'Steel Rod × 50m', amount: 'LKR 44,500', date: 'Jul 2, 2026', status: 'Processing' },
  { id: '#ORD-039', customer: 'Lasith Fernando', items: 'Sand × 2 cubes', amount: 'LKR 24,000', date: 'Jun 28, 2026', status: 'Delivered' },
];

export default function SupplierOrdersPage() {
  const [orders, setOrders] = useState(INITIAL_ORDERS);

  const {
    filters,
    setMonth,
    setItem,
    setStatus,
    selectYear,
    clear,
    open,
    setOpen,
    years,
    items,
    filtered,
    hasActiveFilter,
  } = useOrdersFilters(orders);

  const acceptOrder = (id) =>
    setOrders((prev) => prev.map((o) => (o.id === id ? { ...o, status: 'Processing' } : o)));

  const rejectOrder = (id) =>
    setOrders((prev) => prev.filter((o) => o.id !== id));

  return (
    <div className="font-dmSans max-w-7xl mx-auto animate-fadeIn">
      <PageHeader
        title="Orders"
        subtitle="Manage incoming material orders"
        action={
          <OrdersFilterToggle
            open={open}
            hasActiveFilter={hasActiveFilter}
            onClick={() => setOpen((v) => !v)}
          />
        }
      />

      {open && (
        <OrdersFilterPanel
          filters={filters}
          years={years}
          items={items}
          onSelectYear={selectYear}
          onSetMonth={setMonth}
          onSetItem={setItem}
          onSetStatus={setStatus}
          onClear={clear}
          hasActiveFilter={hasActiveFilter}
        />
      )}

      <OrdersTable
        orders={filtered}
        onAccept={acceptOrder}
        onReject={rejectOrder}
        hasActiveFilter={hasActiveFilter}
      />
    </div>
  );
}

'use client';
import useOrdersFilters from '@/src/hooks/supplier/useOrdersFilters';
import { useOrders, useUpdateOrderStatus } from '@/src/hooks/supplier/useSupplierOrders';
import PageHeader from '@/src/components/supplier/PageHeader';
import OrdersTable from '@/src/components/supplier/OrdersTable';
import OrdersFilterPanel from '@/src/components/supplier/OrdersFilterBar';

export default function SupplierOrdersPage() {
  const { data: orders = [], isLoading } = useOrders();
  const updateStatus = useUpdateOrderStatus();

  const {
    filters,
    appliedFilters,
    setMonth,
    setItem,
    setStatus,
    selectYear,
    applyFilters,
    clear,
    years,
    items,
    filtered,
    hasActiveFilter,
  } = useOrdersFilters(orders);

  function acceptOrder(id) {
    const orderId = orders.find(o => o.id === id)?.orderId;
    if (orderId) updateStatus.mutate({ orderId, status: 'accepted' });
  }

  function rejectOrder(id) {
    const orderId = orders.find(o => o.id === id)?.orderId;
    if (orderId) updateStatus.mutate({ orderId, status: 'rejected' });
  }

  if (isLoading) {
    return <div className="p-10 text-center text-crewMuted text-sm">Loading orders…</div>;
  }

  return (
    <div className="font-dmSans max-w-7xl mx-auto animate-fadeIn">
      <PageHeader
        title="Orders"
        subtitle={`Manage incoming material orders · ${orders.length} order${orders.length !== 1 ? 's' : ''}`}
      />

      <OrdersFilterPanel
        filters={filters}
        appliedFilters={appliedFilters}
        years={years}
        items={items}
        onSelectYear={selectYear}
        onSetMonth={setMonth}
        onSetItem={setItem}
        onSetStatus={setStatus}
        onApply={applyFilters}
        onClear={clear}
        hasActiveFilter={hasActiveFilter}
      />

      <OrdersTable
        orders={filtered}
        onAccept={acceptOrder}
        onReject={rejectOrder}
        hasActiveFilter={hasActiveFilter}
      />
    </div>
  );
}

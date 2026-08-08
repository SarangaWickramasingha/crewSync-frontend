'use client';

import DashHeader from '@/src/components/propertyOwner/DashHeader';
import Card from '@/src/components/propertyOwner/Card';
import { useTasks } from '@/src/components/propertyOwner/TasksContext';

export default function PropertyOwnerNotificationsPage() {
  const {
    notifications,
    markAllNotificationsRead,
    toggleNotificationRead,
    deleteNotification,
  } = useTasks();

  return (
    <div>
      <DashHeader
        title="Notifications"
        subtitle="Stay updated on your project"
        action={
          <button
            onClick={markAllNotificationsRead}
            className="border border-black/10 rounded-md px-3.5 py-1.5 text-sm bg-transparent hover:bg-[#F7F6F2] transition-colors cursor-pointer"
          >
            Mark all read
          </button>
        }
      />

      <Card className="p-0">
        {notifications.length === 0 ? (
          <div className="text-center p-8 text-sm text-[#8A8FA8]">
            No notifications yet.
          </div>
        ) : (
          notifications.map((n, i) => (
            <div
              key={n.id}
              className={`flex items-start justify-between gap-3 px-6 py-3.5 ${
                i !== notifications.length - 1 ? 'border-b border-black/10' : ''
              } hover:bg-[#F7F6F2]/30 transition-colors`}
            >
              <div
                className="flex items-start gap-3 flex-1 cursor-pointer"
                onClick={() => toggleNotificationRead(n.id)}
                title="Click to toggle read status"
              >
                <div
                  className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${
                    n.read ? 'bg-black/10' : 'bg-[#E8820C]'
                  }`}
                />
                <div>
                  <div
                    className="text-sm text-[#1A1D23]"
                    dangerouslySetInnerHTML={{ __html: n.text }}
                  />
                  <div className="text-xs text-[#8A8FA8] mt-0.5">{n.time}</div>
                </div>
              </div>
              
              <button
                onClick={() => deleteNotification(n.id)}
                className="text-[#8A8FA8] hover:text-[#C0392B] text-lg font-bold leading-none px-1 transition-colors cursor-pointer"
                title="Dismiss notification"
              >
                ×
              </button>
            </div>
          ))
        )}
      </Card>
    </div>
  );
}
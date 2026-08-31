'use client';

import { Bell } from 'lucide-react';
import { useNotifications } from '@/src/hooks/useNotifications';

export default function NotificationsPage() {
  const { data, isLoading, isError, error } = useNotifications();
  const notifications = data?.notifications ?? [];

  const unreadCount = notifications.filter((n) => !n.read).length;

  if (isLoading) {
    return <div className="p-10 text-center text-sm text-[#8A8FA8]">Loading notifications…</div>;
  }

  return (
    <div className="font-sans">
      <div className="flex items-center justify-between mb-5 flex-wrap gap-3">
        <div>
          <h2 className="font-syne text-xl font-bold text-[#1A1D23] [letter-spacing:-0.5px]">Notifications</h2>
          <p className="text-xs text-[#8A8FA8] mt-0.5">Stay updated on your account activity</p>
        </div>
        {unreadCount > 0 && (
          <span className="text-xs font-semibold px-3 py-1.5 rounded-full bg-[#dcfce7] text-[#15803d] border border-[#16a34a]/30">
            {unreadCount} unread
          </span>
        )}
      </div>

      {isError && (
        <div className="p-6 bg-white border border-black/10 rounded-xl text-sm text-[#C0392B]">
          {error?.message || 'Could not load notifications.'}
        </div>
      )}

      <div className="bg-white border border-black/10 rounded-xl overflow-hidden">
        {notifications.length === 0 ? (
          <div className="text-center p-8 text-sm text-[#8A8FA8]">No notifications yet.</div>
        ) : (
          notifications.map((n, i) => (
            <div
              key={n.id}
              className={`flex items-start gap-3 px-6 py-3.5 ${
                i !== notifications.length - 1 ? 'border-b border-black/10' : ''
              } ${n.read ? '' : 'bg-[#F7F6F2]/40'}`}
            >
              <div className="w-2 h-2 rounded-full mt-1.5 flex-shrink-0 bg-[#8A8FA8]" />
              <div className="flex-1 min-w-0">
                <div
                  className="text-sm text-[#1A1D23]"
                  dangerouslySetInnerHTML={{ __html: n.text }}
                />
                <div className="text-xs text-[#8A8FA8] mt-0.5">{n.time}</div>
              </div>
            </div>
          ))
        )}
      </div>

      {notifications.length === 0 && (
        <p className="mt-4 text-xs text-[#8A8FA8] flex items-center gap-1.5">
          <Bell size={14} /> Notifications appear here when someone interacts with your account.
        </p>
      )}
    </div>
  );
}

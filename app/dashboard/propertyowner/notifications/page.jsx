import DashHeader from '@/Components/dashboard/propertyOwner/DashHeader';
import Card from '@/Components/dashboard/propertyOwner/Card';

const NOTIFICATIONS = [
  {
    text: <><strong>Sunil Karunaratne</strong> updated roofing task progress to 55%</>,
    time: 'Today, 10:42 AM',
    read: false,
  },
  {
    text: <><strong>Payment released</strong> — LKR 680,000 for cement order to Malshan Hardware</>,
    time: 'Yesterday, 3:15 PM',
    read: false,
  },
  {
    text: <>Phase 2 (Structural Development) marked as <strong>Complete</strong></>,
    time: 'May 1, 2026',
    read: true,
  },
  {
    text: <><strong>Dinesh Wickrama</strong> accepted your carpenter request for Phase 5</>,
    time: 'April 30, 2026',
    read: true,
  },
];

export default function PropertyOwnerNotificationsPage() {
  return (
    <div>
      <DashHeader
        title="Notifications"
        subtitle="Stay updated on your project"
        action={
          <button className="border border-black/10 rounded-md px-3.5 py-1.5 text-sm bg-transparent hover:bg-[#F7F6F2]">
            Mark all read
          </button>
        }
      />

      <Card className="p-0">
        {NOTIFICATIONS.map((n, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 px-6 py-3 ${i !== NOTIFICATIONS.length - 1 ? 'border-b border-black/10' : ''}`}
          >
            <div
              className={`w-2 h-2 rounded-full mt-1.5 flex-shrink-0 ${n.read ? 'bg-black/10' : 'bg-[#E8820C]'}`}
            />
            <div>
              <div className="text-sm">{n.text}</div>
              <div className="text-xs text-[#8A8FA8] mt-0.5">{n.time}</div>
            </div>
          </div>
        ))}
      </Card>
    </div>
  );
}
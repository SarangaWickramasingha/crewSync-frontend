'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

const NAV = {
  PROPERTY_OWNER: [
    {
      section: 'Main',
      items: [
        { icon: '🏠', label: 'Dashboard',      href: '/dashboard' },
        { icon: '📋', label: 'My Projects',    href: '/dashboard/projects' },
        { icon: '🔧', label: 'Find Providers', href: '/dashboard/providers' },
        { icon: '📦', label: 'Suppliers',      href: '/dashboard/suppliers' },
      ],
    },
    {
      section: 'Insights',
      items: [
        { icon: '📊', label: 'Reports', href: '/dashboard/reports' },
        { icon: '👤', label: 'Profile', href: '/dashboard/profile' },
      ],
    },
  ],

  SERVICE_PROVIDER: [
    {
      section: 'Dashboard',
      items: [
        { icon: '📊', label: 'Overview',      href: '/dashboard' },
        { icon: '📋', label: 'Job Requests',  href: '/dashboard/job-requests', badge: '4' },
        { icon: '📅', label: 'Timeline',      href: '/dashboard/timeline' },
        { icon: '💬', label: 'Project Forum', href: '/dashboard/forum', badge: '2' },
        { icon: '👤', label: 'My Profile',    href: '/dashboard/profile' },
        { icon: '💰', label: 'Earnings',      href: '/dashboard/earnings' },
        { icon: '⭐', label: 'Reviews',       href: '/dashboard/reviews' },
      ],
    },
  ],

  MATERIAL_SUPPLIER: [
    {
      section: 'Store',
      items: [
        { icon: '📊', label: 'Overview',    href: '/dashboard' },
        { icon: '📦', label: 'My Products', href: '/dashboard/my-products' },
        { icon: '📋', label: 'Orders',      href: '/dashboard/orders', badge: '3' },
        { icon: '💬', label: 'Messages',    href: '/dashboard/chat' },
      ],
    },
    {
      section: 'Account',
      items: [
        { icon: '👤', label: 'My Profile', href: '/dashboard/profile' },
      ],
    },
  ],
};

const ROLE_META = {
  PROPERTY_OWNER:    { bg: '#FFF3E0', color: '#B85A00', dot: '#E8820C' },
  SERVICE_PROVIDER:  { bg: '#E6F4EC', color: '#1B6E3A', dot: '#1B6E3A' },
  MATERIAL_SUPPLIER: { bg: '#E8F0FB', color: '#1A56A0', dot: '#1A56A0' },
};

export default function Sidebar({ isOpen, onClose }) {
  const { user, role } = useAuth();
  const pathname = usePathname();

  const sections = NAV[role] ?? NAV.PROPERTY_OWNER;
  const meta     = ROLE_META[role] ?? {};
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? '?';

  return (
    <>
      {/* Overlay */}
      {isOpen && (
        <div onClick={onClose} style={styles.overlay} />
      )}

      <aside style={{ ...styles.sidebar, ...(isOpen ? styles.sidebarOpen : {}) }}>

        {/* User card */}
        <div style={styles.userCard}>
          <div style={{ ...styles.userAvatar, background: meta.bg, color: meta.color }}>
            {initials}
          </div>
          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={styles.userName}>{user?.name}</div>
            <div style={{ ...styles.userRole, color: meta.color }}>
              <span style={{ ...styles.dot, background: meta.dot }} />
              {role?.replace('_', ' ')}
            </div>
          </div>
        </div>

        <hr style={styles.divider} />

        {/* Nav */}
        {sections.map(({ section, items }) => (
          <div key={section} style={{ marginBottom: '1.4rem' }}>
            <div style={styles.sectionLabel}>{section}</div>
            {items.map(item => {
              const active = pathname === item.href ||
                (item.href !== '/dashboard' && pathname.startsWith(item.href));
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={onClose}
                  style={{
                    ...styles.item,
                    ...(active ? styles.itemActive : {}),
                  }}
                >
                  <span style={styles.icon}>{item.icon}</span>
                  <span style={{ flex: 1 }}>{item.label}</span>
                  {item.badge && <span style={styles.badge}>{item.badge}</span>}
                </Link>
              );
            })}
          </div>
        ))}
      </aside>
    </>
  );
}

const styles = {
  overlay: {
    position: 'fixed',
    inset: 0,
    background: 'rgba(26,29,35,0.4)',
    zIndex: 199,
  },
  sidebar: {
    background: '#fff',
    borderRight: '1px solid rgba(26,29,35,0.1)',
    padding: '1.5rem 1rem',
    width: '220px',
    minHeight: 'calc(100vh - 60px)',
    flexShrink: 0,
  },
  sidebarOpen: {
    display: 'block',
    position: 'fixed',
    top: '60px',
    left: 0,
    bottom: 0,
    zIndex: 200,
    boxShadow: '4px 0 20px rgba(0,0,0,0.15)',
    overflowY: 'auto',
  },
  userCard: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    paddingBottom: '4px',
  },
  userAvatar: {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontWeight: 700,
    fontSize: '0.8rem',
    flexShrink: 0,
  },
  userName: { fontSize: '0.85rem', fontWeight: 600 },
  userRole: {
    display: 'flex',
    alignItems: 'center',
    gap: '5px',
    fontSize: '0.72rem',
    fontWeight: 500,
    marginTop: '1px',
  },
  dot: {
    width: '6px',
    height: '6px',
    borderRadius: '50%',
    flexShrink: 0,
  },
  divider: {
    border: 'none',
    borderTop: '1px solid rgba(26,29,35,0.1)',
    margin: '1rem 0',
  },
  sectionLabel: {
    fontSize: '0.68rem',
    fontWeight: 600,
    textTransform: 'uppercase',
    letterSpacing: '0.8px',
    color: '#8A8FA8',
    marginBottom: '0.4rem',
    paddingLeft: '8px',
  },
  item: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    padding: '8px 10px',
    borderRadius: '8px',
    fontSize: '0.83rem',
    color: '#4A5068',
    textDecoration: 'none',
    transition: 'all 0.15s',
    width: '100%',
  },
  itemActive: {
    background: '#FFF3E0',
    color: '#B85A00',
    fontWeight: 500,
  },
  icon: {
    fontSize: '1rem',
    width: '18px',
    textAlign: 'center',
    flexShrink: 0,
  },
  badge: {
    marginLeft: 'auto',
    background: '#E8820C',
    color: '#fff',
    fontSize: '0.65rem',
    fontWeight: 700,
    padding: '1px 6px',
    borderRadius: '10px',
  },
};
'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useAuth } from '@/context/AuthContext';

import {
  LayoutDashboard,
  FolderKanban,
  Wrench,
  Package,
  BarChart3,
  User,
  Briefcase,
  CalendarDays,
  MessageSquare,
  Star,
  ShoppingBag,
  ClipboardList,
} from "lucide-react";

const NAV = {
  PROPERTY_OWNER: [
    {
      section: 'Main',
      items: [
        {
          icon: LayoutDashboard,
          label: 'Dashboard',
          href: '/dashboard',
        },
        {
          icon: FolderKanban,
          label: 'My Projects',
          href: '/dashboard/projects',
        },
        {
          icon: Wrench,
          label: 'Find Providers',
          href: '/dashboard/providers',
        },
        {
          icon: Package,
          label: 'Suppliers',
          href: '/dashboard/suppliers',
        },
      ],
    },
    {
      section: 'Insights',
      items: [
        {
          icon: BarChart3,
          label: 'Reports',
          href: '/dashboard/reports',
        },
        {
          icon: User,
          label: 'Profile',
          href: '/dashboard/profile',
        },
      ],
    },
  ],

  SERVICE_PROVIDER: [
    {
      section: "Dashboard",
      items: [
        {
          icon: LayoutDashboard,
          iconColor: "#4F46E5",
          iconBg: "#EEF2FF",
          label: "Overview",
          href: "/dashboard",
        },
        {
          icon: Briefcase,
          iconColor: "#16A34A",
          iconBg: "#ECFDF5",
          label: "Job Requests",
          href: "/dashboard/job-requests",
          badge: "4",
        },
        {
          icon: CalendarDays,
          iconColor: "#D97706",
          iconBg: "#FEF3C7",
          label: "Timeline",
          href: "/dashboard/timeline",
        },
        {
          icon: MessageSquare,
          iconColor: "#DB2777",
          iconBg: "#FCE7F3",
          label: "Project Forum",
          href: "/dashboard/forum",
          badge: "2",
        },
        {
          icon: User,
          iconColor: "#0284C7",
          iconBg: "#E0F2FE",
          label: "My Profile",
          href: "/dashboard/profile",
        },
        {
          icon: Star,
          iconColor: "#DC2626",
          iconBg: "#FEF2F2",
          label: "Rating & Reviews",
          href: "/dashboard/reviews",
        },
      ],
    },
  ],

  MATERIAL_SUPPLIER: [
    {
      section: 'Store',
      items: [
        {
          icon: ShoppingBag,
          label: 'My Products',
          href: '/dashboard/my-products',
        },
        {
          icon: ClipboardList,
          label: 'Orders',
          href: '/dashboard/orders',
          badge: '3',
        },
      ],
    },
    {
      section: 'Account',
      items: [
        {
          icon: User,
          label: 'My Profile',
          href: '/dashboard/profile',
        },
      ],
    },
  ],
};

const ROLE_META = {
  PROPERTY_OWNER: {
    bg: '#FFF3E0',
    color: '#B85A00',
    dot: '#E8820C',
  },
  SERVICE_PROVIDER: {
    bg: '#E6F4EC',
    color: '#1B6E3A',
    dot: '#1B6E3A',
  },
  MATERIAL_SUPPLIER: {
    bg: '#E8F0FB',
    color: '#1A56A0',
    dot: '#1A56A0',
  },
};

export default function Sidebar({ isOpen, onClose }) {
  const { user, role } = useAuth();
  const pathname = usePathname();

  const sections = NAV[role] ?? NAV.PROPERTY_OWNER;
  const meta = ROLE_META[role] ?? {};

  const initials =
    user?.name
      ?.split(' ')
      .map((n) => n[0])
      .join('')
      .slice(0, 2)
      .toUpperCase() ?? '?';

  return (
    <>
      {isOpen && (
        <div onClick={onClose} style={styles.overlay} />
      )}

      <aside
        style={{
          ...styles.sidebar,
          ...(isOpen ? styles.sidebarOpen : {}),
        }}
      >
        {/* User Card */}

        <div style={styles.userCard}>
          <div
            style={{
              ...styles.userAvatar,
              background: meta.bg,
              color: meta.color,
            }}
          >
            {initials}
          </div>

          <div style={{ flex: 1, minWidth: 0 }}>
            <div style={styles.userName}>{user?.name}</div>

            <div
              style={{
                ...styles.userRole,
                color: meta.color,
              }}
            >
              <span
                style={{
                  ...styles.dot,
                  background: meta.dot,
                }}
              />

              {role?.replace('_', ' ')}
            </div>
          </div>
        </div>

        <hr style={styles.divider} />

        {/* Navigation */}

        {sections.map(({ section, items }) => (
          <div key={section} style={{ marginBottom: '1.4rem' }}>
            <div style={styles.sectionLabel}>{section}</div>

            {items.map((item) => {
              const active =
                pathname === item.href ||
                (item.href !== '/dashboard' &&
                  pathname.startsWith(item.href));

              const Icon = item.icon;

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
                  {/* ICON BOX */}
                  <div
                    style={{
                      width: 32,
                      height: 32,
                      borderRadius: 10,
                      background: item.iconBg || "#EEF2FF",
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      flexShrink: 0,
                    }}
                  >
                    <Icon
                      size={16}
                      color={item.iconColor || "#4F46E5"}
                      strokeWidth={2}
                    />
                  </div>

                  <span style={{ flex: 1 }}>{item.label}</span>

                  {item.badge && (
                    <span style={styles.badge}>
                      {item.badge}
                    </span>
                  )}
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
    background: "#fff",
    borderRight: "1px solid #E5E7EB",
    padding: "16px",
    width: "230px",
    minHeight: "calc(100vh - 60px)",
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

  userName: {
    fontSize: '0.85rem',
    fontWeight: 600,
  },

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
    fontSize: "10px",
    fontWeight: 600,
    color: "#6B7280",
    textTransform: "uppercase",
    letterSpacing: "0.12em",
    marginBottom: "6px",
    paddingLeft: "8px",
  },

  item: {
    display: "flex",
    alignItems: "center",
    gap: "12px",
    padding: "8px",
    borderRadius: "12px",
    textDecoration: "none",
    color: "#64748B",
    fontSize: "14px",
    fontWeight: 400,
    lineHeight: "20px",
    transition: "all .2s ease",
  },

  itemActive: {
    background: "#F9FAFB",
    color: "#EA580C",
    fontWeight: 600,
  },

  icon: {
    width: 18,
    height: 18,
    flexShrink: 0,
  },

  badge: {
    marginLeft: "auto",
    background: "#F59E0B",
    color: "#fff",
    fontSize: "10px",
    fontWeight: 700,
    padding: "2px 6px",
    borderRadius: "999px",
  },
};

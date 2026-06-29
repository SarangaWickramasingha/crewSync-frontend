'use client';

import { useState } from 'react';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';

const ROLE_LABELS = {
  PROPERTY_OWNER:    { label: 'Property Owner',    bg: '#FFF3E0', color: '#B85A00' },
  SERVICE_PROVIDER:  { label: 'Service Provider',  bg: '#E6F4EC', color: '#1B6E3A' },
  MATERIAL_SUPPLIER: { label: 'Material Supplier', bg: '#E8F0FB', color: '#1A56A0' },
};

export default function Navbar({ onMenuToggle }) {
  const { user, role, logout } = useAuth();
  const [open, setOpen] = useState(false);

  const meta     = ROLE_LABELS[role] ?? {};
  const initials = user?.name?.split(' ').map(n => n[0]).join('').slice(0, 2).toUpperCase() ?? '?';

  return (
    <nav style={styles.nav}>
      {/* Hamburger */}
      <button style={styles.hamburger} onClick={onMenuToggle}>☰</button>

      {/* Logo */}
      <Link href="/dashboard" style={styles.logo}>
        Crew<span style={{ color: '#fff' }}>Sync</span>
      </Link>

      {/* Right */}
      <div style={styles.right}>
        {/* Role badge */}
        <span style={{ ...styles.roleBadge, background: meta.bg, color: meta.color }}>
          {meta.label}
        </span>

        {/* Avatar */}
        <div style={{ position: 'relative' }}>
          <button style={styles.avatar} onClick={() => setOpen(o => !o)}>
            {initials}
          </button>

          {open && (
            <div style={styles.dropdown}>
              <div style={styles.dropdownHeader}>
                <div style={styles.dropdownName}>{user?.name}</div>
                <div style={styles.dropdownEmail}>{user?.email}</div>
              </div>
              <hr style={{ border: 'none', borderTop: '1px solid rgba(26,29,35,0.1)' }} />
              <Link href="/dashboard/profile" style={styles.dropdownItem} onClick={() => setOpen(false)}>
                👤 My Profile
              </Link>
              <button style={{ ...styles.dropdownItem, color: '#C0392B', width: '100%', textAlign: 'left', background: 'none', border: 'none' }} onClick={logout}>
                🚪 Sign Out
              </button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}

const styles = {
  nav: {
    background: '#1A1D23',
    height: '60px',
    padding: '0 1.5rem',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 0,
    zIndex: 100,
    gap: '12px',
  },
  hamburger: {
    display: 'none',
    background: 'none',
    border: 'none',
    color: '#fff',
    fontSize: '1.2rem',
    cursor: 'pointer',
  },
  logo: {
    color: '#E8820C',
    fontFamily: "'Syne', sans-serif",
    fontSize: '1.4rem',
    fontWeight: 800,
    letterSpacing: '-0.5px',
    textDecoration: 'none',
    flexShrink: 0,
  },
  right: {
    display: 'flex',
    alignItems: 'center',
    gap: '10px',
    marginLeft: 'auto',
  },
  roleBadge: {
    fontSize: '0.72rem',
    fontWeight: 600,
    padding: '3px 10px',
    borderRadius: '20px',
    whiteSpace: 'nowrap',
  },
  avatar: {
    width: '34px',
    height: '34px',
    borderRadius: '50%',
    background: '#E8820C',
    color: '#fff',
    border: 'none',
    fontFamily: "'Syne', sans-serif",
    fontSize: '0.78rem',
    fontWeight: 700,
    cursor: 'pointer',
  },
  dropdown: {
    position: 'absolute',
    top: 'calc(100% + 8px)',
    right: 0,
    minWidth: '200px',
    background: '#fff',
    border: '1px solid rgba(26,29,35,0.1)',
    borderRadius: '12px',
    boxShadow: '0 4px 24px rgba(26,29,35,0.12)',
    overflow: 'hidden',
    zIndex: 200,
  },
  dropdownHeader: { padding: '12px 14px' },
  dropdownName:   { fontSize: '0.88rem', fontWeight: 700 },
  dropdownEmail:  { fontSize: '0.76rem', color: '#8A8FA8', marginTop: '1px' },
  dropdownItem: {
    display: 'block',
    padding: '10px 14px',
    fontSize: '0.85rem',
    color: '#4A5068',
    textDecoration: 'none',
    cursor: 'pointer',
  },
};
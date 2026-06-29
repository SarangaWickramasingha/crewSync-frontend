export default function Footer() {
  return (
    <footer style={styles.footer}>
      <strong style={{ color: '#E8820C' }}>CrewSync</strong> © {new Date().getFullYear()} · Built for Sri Lanka's Construction Sector
    </footer>
  );
}

const styles = {
  footer: {
    background: '#1A1D23',
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
    padding: '2rem 1.5rem',
    fontSize: '0.8rem',
    marginTop: '3rem',
  },
};
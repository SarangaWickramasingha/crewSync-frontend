export const C = {
  blue: '#2563eb', blueLight: '#dbeafe', blueDark: '#1d4ed8',
  slate: '#1A1D23', slateLight: '#4A5068', muted: '#8A8FA8',
  surface: '#F7F6F2', white: '#FFFFFF',
  border: 'rgba(26,29,35,0.1)', radius: '12px', radiusSm: '8px',
};

export const AVATAR_STYLES = [
  { bg: '#dbeafe', color: '#1d4ed8' },
  { bg: '#E6F4EC', color: '#1B6E3A' },
  { bg: '#FFF3E0', color: '#B85A00' },
];

export function initialsOf(name) {
  return name.split(' ').map(w => w[0]).slice(0, 2).join('').toUpperCase();
}

export function fileToDataUrl(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
}

export function getPhotoUrl(url) {
  if (!url) return '';
  if (url.startsWith('data:') || url.startsWith('blob:')) {
    return url;
  }
  if (url.startsWith('http://localhost/') && !url.includes(':8080')) {
    url = url.replace('http://localhost/', 'http://localhost:8080/');
  }
  if (url.startsWith('http://') || url.startsWith('https://')) {
    return url;
  }
  const baseHost = 'http://localhost:8080/CrewSync-backend/backend/uploads';
  const cleanPath = url.startsWith('/') ? url : `/${url}`;
  return `${baseHost}${cleanPath}`;
}
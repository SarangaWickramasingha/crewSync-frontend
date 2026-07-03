// ── API BASE ───────────────────────────────────────────────────────────────────
// Change this one line when deploying to production
export const API_BASE = 'http://localhost/CrewSync-backend/backend/index.php';

// ── AUTH ───────────────────────────────────────────────────────────────────────
export const API_AUTH_LOGIN   = `${API_BASE}/api/auth/login`;
export const API_AUTH_ME      = `${API_BASE}/api/auth/me`;
export const API_AUTH_LOGOUT  = `${API_BASE}/api/auth/logout`;
export const API_AUTH_REGISTER = `${API_BASE}/api/auth/register`;
export const API_AUTH_CHECK_EMAIL = `${API_BASE}/api/auth/check-email`;

// ── PROJECTS ───────────────────────────────────────────────────────────────────
export const API_PROJECTS          = `${API_BASE}/api/projects`;
export const API_PROJECT = (id)    => `${API_BASE}/api/projects/${id}`;
export const API_PROJECT_FINISH = (id) => `${API_BASE}/api/projects/${id}/toggle-finish`;

// ── TASKS ──────────────────────────────────────────────────────────────────────
export const API_TASKS              = `${API_BASE}/api/tasks`;
export const API_TASK = (id)        => `${API_BASE}/api/tasks/${id}`;
export const API_TASK_FINISH = (id) => `${API_BASE}/api/tasks/${id}/toggle-finish`;
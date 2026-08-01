// ── API BASE ───────────────────────────────────────────────────────────────────
// Change this one line when deploying to production
export const API_BASE = 'http://localhost:8080/CrewSync-backend/backend/index.php';


// ── AUTH ───────────────────────────────────────────────────────────────────────
export const API_AUTH_LOGIN = `${API_BASE}/api/auth/login`;
export const API_AUTH_ME = `${API_BASE}/api/auth/me`;
export const API_AUTH_LOGOUT = `${API_BASE}/api/auth/logout`;
export const API_AUTH_REGISTER = `${API_BASE}/api/auth/register`;
export const API_AUTH_CHECK_EMAIL = `${API_BASE}/api/auth/check-email`;

// ── PROJECTS ───────────────────────────────────────────────────────────────────
export const API_PROJECTS = `${API_BASE}/api/projects`;
export const API_PROJECT = (id) => `${API_BASE}/api/projects/${id}`;
export const API_PROJECT_FINISH = (id) => `${API_BASE}/api/projects/${id}/toggle-finish`;
export const API_PROJECT_CREATE = `${API_BASE}/api/projects/create`;


// ── TASKS ──────────────────────────────────────────────────────────────────────
export const API_TASKS = `${API_BASE}/api/tasks`;
export const API_TASK = (id) => `${API_BASE}/api/tasks/${id}`;
export const API_TASK_FINISH = (id) => `${API_BASE}/api/tasks/${id}/toggle-finish`;


// ── COMMENTS ───────────────────────────────────────────────────────────────────
export const API_PROJECT_COMMENTS = (projectId) => `${API_BASE}/api/projects/${projectId}/comments`;

// ── FEEDBACK ──────────────────────────────────────────────────────────────────
export const API_FEEDBACK_SUBMIT = `${API_BASE}/api/feedback/submit`;

// 
export const API_STATS_SUMMARY = `${API_BASE}/api/stats/summary`;



// ── SERVICE PROVIDER ───────────────────────────────────────────────────────────
export const API_PROVIDER_TOGGLE_AVAILABILITY = `${API_BASE}/api/provider/toggle-availability`;
export const API_PROVIDER_AVAILABILITY = `${API_BASE}/api/provider/availability`;
export const API_PROVIDER_DASHBOARD_STATS = `${API_BASE}/api/provider/dashboard-stats`;
export const API_PROVIDER_CURRENT_WORK = `${API_BASE}/api/provider/current-work`;
export const API_PROVIDER_RECENT_REVIEWS = `${API_BASE}/api/provider/recent-reviews`;
export const API_PROVIDER_JOB_REQUESTS = `${API_BASE}/api/provider/job-requests`;
export const API_PROVIDER_JOB_REQUEST_RESPOND = (id) => `${API_BASE}/api/provider/job-requests/${id}/respond`;
export const API_PROVIDER_TIMELINE = `${API_BASE}/api/provider/timeline`;
export const API_PROVIDER_ALL_REVIEWS = `${API_BASE}/api/provider/reviews/all`;
export const API_REVIEW_PHOTOS_UPLOAD = (reviewId) => `${API_BASE}/api/reviews/${reviewId}/photos`;
export const API_REVIEW_PHOTO_DELETE = (photoId) => `${API_BASE}/api/review-photos/${photoId}`;

export const API_PROVIDER_PROFILE = `${API_BASE}/api/provider/profile`;
export const API_PROVIDER_SKILLS = `${API_BASE}/api/provider/skills`;
export const API_PROVIDER_SKILL_DELETE = (skillId) => `${API_BASE}/api/provider/skills/${skillId}`;


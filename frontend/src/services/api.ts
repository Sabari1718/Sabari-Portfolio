// Base URL for our backend API
const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
const BASE_URL = API_URL.replace('/api', '');

// Helper: get auth token from localStorage (client-side only)
function getToken(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('token');
}

// Helper function to handle API calls
async function fetchAPI(endpoint: string, options: RequestInit & { skipContentType?: boolean } = {}) {
  const token = getToken();
  const { skipContentType, ...fetchOptions } = options;

  const headers: Record<string, string> = {};

  if (!skipContentType) {
    headers['Content-Type'] = 'application/json';
  }
  if (token) {
    headers['Authorization'] = `Bearer ${token}`;
  }

  const finalOptions: RequestInit = {
    ...fetchOptions,
    headers: {
      ...headers,
      ...((fetchOptions.headers as Record<string, string>) || {}),
    },
  };

  try {
    const response = await fetch(`${API_URL}${endpoint}`, finalOptions);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error(`API Error on ${endpoint}:`, error);
    return { success: false, message: 'Network error occurred. Please check your connection.' };
  }
}

// Construct a full URL for uploaded files
export function getFileUrl(path: string | null | undefined): string | null {
  if (!path) return null;
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  return `${BASE_URL}${path}`;
}

export const PortfolioAPI = {
  // ── Profile ──────────────────────────────────────────────
  getProfile: () => fetchAPI('/profile', { cache: 'no-store' } as any),

  updateProfile: (data: any) => fetchAPI('/profile', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // ── Navbar ───────────────────────────────────────────────
  getNavbarSettings: () => fetchAPI('/navbar', { cache: 'no-store' } as any),

  updateNavbarSettings: (data: any) => fetchAPI('/navbar', {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  // ── Upload ───────────────────────────────────────────────
  uploadImage: async (file: File) => {
    const token = getToken();
    const headers: Record<string, string> = {};
    if (token) headers['Authorization'] = `Bearer ${token}`;

    const formData = new FormData();
    formData.append('image', file);
    try {
      const response = await fetch(`${API_URL}/upload`, {
        method: 'POST',
        headers,
        body: formData,
      });
      return await response.json();
    } catch (error) {
      console.error('Upload API Error:', error);
      return { success: false, message: 'Upload failed. Please try again.' };
    }
  },

  // ── Projects ─────────────────────────────────────────────
  /** Get all projects — for admin use ?all=true to include hidden ones */
  getProjects: (adminMode = false) =>
    fetchAPI(`/projects${adminMode ? '?all=true' : ''}`, { cache: 'no-store' } as any),

  getProjectById: (id: number) => fetchAPI(`/projects/${id}`, { cache: 'no-store' } as any),

  createProject: (data: any) => fetchAPI('/projects', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  updateProject: (id: number, data: any) => fetchAPI(`/projects/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  deleteProject: (id: number) => fetchAPI(`/projects/${id}`, { method: 'DELETE' }),

  // ── Skills ───────────────────────────────────────────────
  getSkills: () => fetchAPI('/skills', { cache: 'no-store' } as any),

  createSkill: (data: any) => fetchAPI('/skills', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  updateSkill: (id: number, data: any) => fetchAPI(`/skills/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  deleteSkill: (id: number) => fetchAPI(`/skills/${id}`, { method: 'DELETE' }),

  // ── Experience ───────────────────────────────────────────
  getExperience: () => fetchAPI('/experience', { cache: 'no-store' } as any),

  createExperience: (data: any) => fetchAPI('/experience', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  updateExperience: (id: number, data: any) => fetchAPI(`/experience/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  deleteExperience: (id: number) => fetchAPI(`/experience/${id}`, { method: 'DELETE' }),

  // ── Education ────────────────────────────────────────────
  getEducation: () => fetchAPI('/education', { cache: 'no-store' } as any),

  createEducation: (data: any) => fetchAPI('/education', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  updateEducation: (id: number, data: any) => fetchAPI(`/education/${id}`, {
    method: 'PUT',
    body: JSON.stringify(data),
  }),

  deleteEducation: (id: number) => fetchAPI(`/education/${id}`, { method: 'DELETE' }),

  // ── Certifications ───────────────────────────────────────
  getCertifications: () => fetchAPI('/certifications', { cache: 'no-store' } as any),

  // ── Social Links ─────────────────────────────────────────
  getSocialLinks: () => fetchAPI('/social-links', { cache: 'no-store' } as any),

  // ── Contact / Messages ───────────────────────────────────
  submitContact: (data: any) => fetchAPI('/contact', {
    method: 'POST',
    body: JSON.stringify(data),
  }),

  getMessages: () => fetchAPI('/contact', { cache: 'no-store' } as any),

  markMessageAsRead: (id: number) => fetchAPI(`/contact/${id}/read`, { method: 'PUT' }),

  deleteMessage: (id: number) => fetchAPI(`/contact/${id}`, { method: 'DELETE' }),
};

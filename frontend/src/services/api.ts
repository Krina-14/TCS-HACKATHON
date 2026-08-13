// SmartSched AI API Service Layer for Frontend-Backend Integration

const API_BASE_URLS = [
  'http://localhost:5000/api',
  'http://localhost:50001/api',
];

let activeApiBaseUrl = API_BASE_URLS[0];

// Discover working API base URL
export const discoverApiUrl = async () => {
  for (const url of API_BASE_URLS) {
    try {
      const res = await fetch(`${url}/health`, { method: 'GET' });
      if (res.ok) {
        activeApiBaseUrl = url;
        console.log(`✅ Frontend connected to SmartSched AI Backend at ${activeApiBaseUrl}`);
        return activeApiBaseUrl;
      }
    } catch (e) {
      // try next
    }
  }
  return activeApiBaseUrl;
};

// Initial discovery on load
discoverApiUrl();

const getAuthHeaders = () => {
  const token = localStorage.getItem('smartsched_token');
  return {
    'Content-Type': 'application/json',
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};

export const api = {
  // 1. Auth API
  login: async (email: string, password: string, role?: string) => {
    await discoverApiUrl();
    const res = await fetch(`${activeApiBaseUrl}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, role }),
    });
    const data = await res.json();
    if (data.success && data.data?.token) {
      localStorage.setItem('smartsched_token', data.data.token);
      localStorage.setItem('smartsched_user', JSON.stringify(data.data.user));
    }
    return data;
  },

  getMe: async () => {
    const res = await fetch(`${activeApiBaseUrl}/auth/me`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await res.json();
  },

  // 2. Timetable API
  generateTimetable: async (payload: { department: string; semester: number }) => {
    const res = await fetch(`${activeApiBaseUrl}/timetable/generate`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(payload),
    });
    return await res.json();
  },

  getOptions: async () => {
    const res = await fetch(`${activeApiBaseUrl}/timetable/options`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await res.json();
  },

  selectOption: async (optionIndex: number) => {
    const res = await fetch(`${activeApiBaseUrl}/timetable/select`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ optionIndex }),
    });
    return await res.json();
  },

  getActiveTimetable: async (department = 'IT', semester = 5) => {
    const res = await fetch(`${activeApiBaseUrl}/timetable/weekly?department=${department}&semester=${semester}`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await res.json();
  },

  simulateAbsence: async (facultyId: string, slot?: { day: string; period: number }) => {
    const res = await fetch(`${activeApiBaseUrl}/timetable/simulate-absence`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ facultyId, slot }),
    });
    return await res.json();
  },

  // 3. Substitution API
  findSubstitutes: async (params: { absentFacultyId: string; day?: string; period?: number; subjectId?: string }) => {
    const res = await fetch(`${activeApiBaseUrl}/substitutions/find`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(params),
    });
    return await res.json();
  },

  assignSubstitute: async (params: { substituteFacultyId: string; slotId: string; timetableId: string }) => {
    const res = await fetch(`${activeApiBaseUrl}/substitutions/assign`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify(params),
    });
    return await res.json();
  },

  getZeroWasteStats: async () => {
    const res = await fetch(`${activeApiBaseUrl}/substitutions/zero-waste-stats`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await res.json();
  },

  // 4. Analytics & Conflicts
  getDashboardKPIs: async () => {
    const res = await fetch(`${activeApiBaseUrl}/analytics/dashboard`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await res.json();
  },

  getConflicts: async () => {
    const res = await fetch(`${activeApiBaseUrl}/conflicts`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await res.json();
  },

  getNotifications: async () => {
    const res = await fetch(`${activeApiBaseUrl}/notifications`, {
      method: 'GET',
      headers: getAuthHeaders(),
    });
    return await res.json();
  },

  // 5. Natural Language Voice Query API
  sendVoiceQuery: async (query: string) => {
    const res = await fetch(`${activeApiBaseUrl}/voice/query`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ query }),
    });
    return await res.json();
  },
};

export default api;

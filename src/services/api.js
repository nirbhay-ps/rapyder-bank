import axios from "axios";

// OneLenz API — single base URL, no ports (all services behind same domain)
const API_BASE = process.env.REACT_APP_API_URL || "https://dev-api.onelenz.ai";

// Dynamic credentials — set from the logged-in user
let API_CREDS = {
  email: null,
  password: null,
};

// All services (auth, email, meetings, consent) share the same base
const authApi = axios.create({ baseURL: API_BASE });
const emailApi = axios.create({ baseURL: API_BASE });

// ─── Background Token Management ────────────────────────────────────────────
let apiAccessToken = null;
let apiRefreshToken = null;
let isRefreshing = false;
let tokenPromise = null;

/**
 * Authenticate against the real OneLenz API.
 * Returns the access token.
 */
async function fetchApiToken() {
  const { data } = await axios.post(`${API_BASE}/auth/login`, {
    email: API_CREDS.email,
    password: API_CREDS.password,
  });
  apiAccessToken = data.access_token;
  apiRefreshToken = data.refresh_token;
  return apiAccessToken;
}

/**
 * Refresh the access token using the refresh token.
 */
async function refreshApiToken() {
  if (!apiRefreshToken) {
    return fetchApiToken();
  }
  try {
    const { data } = await axios.post(`${API_BASE}/auth/refresh`, {
      refresh_token: apiRefreshToken,
    });
    apiAccessToken = data.access_token;
    if (data.refresh_token) {
      apiRefreshToken = data.refresh_token;
    }
    return apiAccessToken;
  } catch (err) {
    // Refresh token expired — do a full re-login
    return fetchApiToken();
  }
}

/**
 * Set the credentials for the OneLenz API from the logged-in user.
 * Must be called before initializeApiAuth.
 */
export function setApiCredentials(email, password) {
  API_CREDS.email = email;
  API_CREDS.password = password;
  // Persist so page refresh can re-authenticate
  localStorage.setItem("onelenz_api_creds", JSON.stringify({ email, password }));
}

/**
 * Restore credentials from localStorage (for page refresh scenarios).
 */
function restoreApiCredentials() {
  const stored = localStorage.getItem("onelenz_api_creds");
  if (stored) {
    const { email, password } = JSON.parse(stored);
    API_CREDS.email = email;
    API_CREDS.password = password;
    return true;
  }
  return false;
}

/**
 * Call this on app login to eagerly fetch the API token.
 * Returns a promise that resolves when the token is ready.
 */
export async function initializeApiAuth() {
  // If no credentials set yet, try restoring from localStorage
  if (!API_CREDS.email) {
    restoreApiCredentials();
  }
  if (!API_CREDS.email) {
    console.warn("initializeApiAuth called without credentials set");
    return null;
  }
  if (tokenPromise) return tokenPromise;
  tokenPromise = fetchApiToken().finally(() => {
    tokenPromise = null;
  });
  return tokenPromise;
}

/**
 * Ensure we have a valid token. If not yet fetched, fetches one.
 */
function ensureToken() {
  if (apiAccessToken) return Promise.resolve(apiAccessToken);
  return initializeApiAuth();
}

/**
 * Clear API tokens and credentials (call on app logout).
 */
export function clearApiAuth() {
  apiAccessToken = null;
  apiRefreshToken = null;
  tokenPromise = null;
  API_CREDS.email = null;
  API_CREDS.password = null;
  localStorage.removeItem("onelenz_api_creds");
}

// Attach token to every request
const attachToken = (instance) => {
  instance.interceptors.request.use(async (config) => {
    // Skip token for login/refresh calls
    if (
      config.url?.includes("/auth/login") ||
      config.url?.includes("/auth/refresh")
    ) {
      return config;
    }
    const token = await ensureToken();
    config.headers.Authorization = `Bearer ${token}`;
    return config;
  });
  return instance;
};

attachToken(authApi);
attachToken(emailApi);

// ─── Auto-refresh on 401 ────────────────────────────────────────────────────
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

const attachRefreshInterceptor = (instance) => {
  instance.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      // Skip refresh for login/refresh endpoints
      if (
        originalRequest.url?.includes("/auth/login") ||
        originalRequest.url?.includes("/auth/refresh")
      ) {
        return Promise.reject(error);
      }

      if (error.response?.status === 401 && !originalRequest._retry) {
        if (isRefreshing) {
          return new Promise((resolve, reject) => {
            failedQueue.push({ resolve, reject });
          })
            .then((token) => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return instance(originalRequest);
            })
            .catch((err) => Promise.reject(err));
        }

        originalRequest._retry = true;
        isRefreshing = true;

        try {
          const newToken = await refreshApiToken();
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return instance(originalRequest);
        } catch (refreshError) {
          processQueue(refreshError, null);
          return Promise.reject(refreshError);
        } finally {
          isRefreshing = false;
        }
      }

      return Promise.reject(error);
    }
  );
};

attachRefreshInterceptor(authApi);
attachRefreshInterceptor(emailApi);

// ─── Auth Service ────────────────────────────────────────────────────────────

export const authService = {
  login: (email, password) => authApi.post("/auth/login", { email, password }),
  signup: (data) => authApi.post("/auth/signup", data),
  refresh: (refresh_token) => authApi.post("/auth/refresh", { refresh_token }),
  logout: () => authApi.post("/auth/logout"),
  forgotPassword: (email) => authApi.post("/auth/forgot-password", { email }),
  resetPassword: (data) => authApi.post("/auth/reset-password", data),
  changePassword: (data) => authApi.post("/auth/change-password", data),
  health: () => authApi.get("/health"),
};

// ─── Email Connector Service ─────────────────────────────────────────────────

export const emailService = {
  connect: () => emailApi.post("/email/connect"),
  callback: (code, state) => emailApi.post("/email/callback", { code, state }),
  status: () => emailApi.get("/email/status"),
  disconnect: () => emailApi.post("/email/disconnect"),
  sync: () => emailApi.post("/email/sync"),
  health: () => emailApi.get("/health"),
};

// ─── Consent Service ─────────────────────────────────────────────────────────

export const consentService = {
  grant: (consent_type, domain_scope = "ALL") =>
    emailApi.post("/consent/grant", { consent_type, domain_scope }),
  revoke: (consent_type) =>
    emailApi.post("/consent/revoke", { consent_type }),
  status: (consent_type) =>
    emailApi.get(`/consent/status?consent_type=${consent_type}`),
};

// ─── Meetings Service ────────────────────────────────────────────────────────

export const meetingsService = {
  list: (params = {}) => {
    const query = new URLSearchParams();
    if (params.meeting_state) query.set("meeting_state", params.meeting_state);
    if (params.platform) query.set("platform", params.platform);
    if (params.from_date) query.set("from_date", params.from_date);
    if (params.to_date) query.set("to_date", params.to_date);
    if (params.offset !== undefined) query.set("offset", params.offset);
    if (params.limit !== undefined) query.set("limit", params.limit);
    return emailApi.get(`/meeting/meetings/?${query.toString()}`);
  },
  detail: (meetingId) => emailApi.get(`/meeting/meetings/${meetingId}`),
  join: (join_url, bot_display_name) =>
    emailApi.post("/meeting/meetings/join", { join_url, bot_display_name }),
  cancelBot: (meetingId) => emailApi.delete(`/meeting/meetings/${meetingId}/bot`),
  transcript: (meetingId) => emailApi.get(`/meeting/meetings/${meetingId}/transcript`),
  insights: (meetingId) => emailApi.get(`/meeting/meetings/${meetingId}/insights`),
  speakers: (meetingId) => emailApi.get(`/meeting/meetings/${meetingId}/speakers`),
  signals: (meetingId) => emailApi.get(`/meeting/meetings/${meetingId}/signals`),
};

// ─── Signals Service ─────────────────────────────────────────────────────────

const signalsApi = axios.create({ baseURL: API_BASE });
attachToken(signalsApi);
attachRefreshInterceptor(signalsApi);

export const signalsService = {
  /**
   * List signals with filters, sort, and pagination.
   * @param {Object} params - Query parameters
   */
  list: (params = {}) => {
    const query = new URLSearchParams();
    if (params.source) {
      (Array.isArray(params.source) ? params.source : [params.source]).forEach(s => query.append("source", s));
    }
    if (params.status) {
      (Array.isArray(params.status) ? params.status : [params.status]).forEach(s => query.append("status", s));
    }
    if (params.sentiment) {
      (Array.isArray(params.sentiment) ? params.sentiment : [params.sentiment]).forEach(s => query.append("sentiment", s));
    }
    if (params.priority) {
      (Array.isArray(params.priority) ? params.priority : [params.priority]).forEach(s => query.append("priority", s));
    }
    if (params.resolution_tag) {
      (Array.isArray(params.resolution_tag) ? params.resolution_tag : [params.resolution_tag]).forEach(s => query.append("resolution_tag", s));
    }
    if (params.category) {
      (Array.isArray(params.category) ? params.category : [params.category]).forEach(s => query.append("category", s));
    }
    if (params.search) query.set("search", params.search);
    if (params.sort) query.set("sort", params.sort);
    if (params.page) query.set("page", params.page);
    if (params.page_size) query.set("page_size", params.page_size);
    return signalsApi.get(`/signals?${query.toString()}`);
  },

  /**
   * Get full detail for a single signal.
   * @param {number|string} signalId
   */
  detail: (signalId) => signalsApi.get(`/signals/${signalId}`),

  /**
   * Get the action history for a signal.
   * @param {number|string} signalId
   */
  history: (signalId) => signalsApi.get(`/signals/${signalId}/history`),

  /**
   * Execute a lifecycle action on a signal (COMPLETE, IGNORE, MERGE, etc.).
   * @param {number|string} signalId
   * @param {Object} actionPayload - { action, reason?, notes?, target_signal_id? }
   */
  updateStatus: (signalId, actionPayload) =>
    signalsApi.put(`/signals/${signalId}/status`, actionPayload),

  /**
   * Manually correct the account linked to a signal.
   * @param {number|string} signalId
   * @param {string} accountId
   */
  updateAccount: (signalId, accountId) =>
    signalsApi.patch(`/signals/${signalId}/account`, { account_id: accountId }),
};

// ─── Document Intelligence (Loan Underwriting) Service ───────────────────────

const DOC_INTEL_BASE =
  process.env.REACT_APP_DOC_INTEL_API_URL ||
  "https://duzekll8n1.execute-api.us-east-1.amazonaws.com/dev";

const DOC_INTEL_API_KEY =
  process.env.REACT_APP_DOC_INTEL_API_KEY || "";

export const documentIntelligenceService = {
  /**
   * Submit a new loan application.
   * @param {Object} fields - text fields (name, email, phone, dob, employment_status, address, monthly_income, loan_amount, purpose)
   * @param {Object} files  - file fields (id_doc, bank_statement, salary_slip, selfie)
   * @returns {Promise} axios response
   */
  submitApplication: (fields, files) => {
    const formData = new FormData();
    // Append text fields
    Object.entries(fields).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        formData.append(key, value);
      }
    });
    // Append file fields
    Object.entries(files).forEach(([key, file]) => {
      if (file) {
        formData.append(key, file);
      }
    });

    return axios.post(`${DOC_INTEL_BASE}/applications`, formData, {
      headers: {
        "x-api-key": DOC_INTEL_API_KEY,
        "Content-Type": "multipart/form-data",
      },
    });
  },

  /**
   * Get the result/status of a loan application.
   * @param {string} applicationId - e.g. "APP-9D2D8F69"
   * @returns {Promise} axios response
   */
  getApplication: (applicationId) => {
    return axios.get(`${DOC_INTEL_BASE}/applications/${applicationId}`, {
      headers: {
        "x-api-key": DOC_INTEL_API_KEY,
      },
    });
  },
};

// ─── Video Generation (Celebration Engine) Service ───────────────────────────

const VIDEO_GEN_BASE =
  process.env.REACT_APP_VIDEO_GEN_API_URL ||
  "https://6pxbrxcl2yadizn7pdelvy6dcy0bwmtg.lambda-url.us-east-1.on.aws";

export const videoGenerationService = {
  /**
   * Submit a celebration video generation job.
   * @param {Object} params
   * @param {File|null} params.logo       - Logo image file (optional)
   * @param {string} params.prompt        - Trigger phrase or custom prompt
   * @param {string} params.overlay_text  - Text overlay for the video
   * @returns {Promise} axios response with job_id
   */
  generate: ({ logo, prompt, overlay_text }) => {
    const formData = new FormData();
    if (logo) formData.append("logo", logo);
    formData.append("prompt", prompt);
    if (overlay_text) formData.append("overlay_text", overlay_text);

    return axios.post(`${VIDEO_GEN_BASE}/`, formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
  },

  /**
   * Poll the status of a video generation job.
   * @param {string} jobId - The job_id returned from generate()
   * @returns {Promise} axios response with status and video URL
   */
  getStatus: (jobId) => {
    return axios.get(`${VIDEO_GEN_BASE}/`, {
      params: { job_id: jobId },
    });
  },
};

export { authApi, emailApi };

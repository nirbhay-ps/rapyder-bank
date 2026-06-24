/**
 * Persists loan application history per user in localStorage.
 * Key format: onelenz_applications_{userId}
 *
 * Each entry: { applicationId, name, loanAmount, purpose, status, submittedAt }
 */

const STORAGE_PREFIX = "onelenz_applications_";

function getStorageKey() {
  const userStr = localStorage.getItem("onelenz_user");
  if (!userStr) return null;
  try {
    const user = JSON.parse(userStr);
    return `${STORAGE_PREFIX}${user.user_id || user.email || "default"}`;
  } catch {
    return `${STORAGE_PREFIX}default`;
  }
}

/**
 * Get all saved applications for the current user.
 * @returns {Array} list of application records
 */
export function getApplications() {
  const key = getStorageKey();
  if (!key) return [];
  try {
    const data = localStorage.getItem(key);
    return data ? JSON.parse(data) : [];
  } catch {
    return [];
  }
}

/**
 * Save a new application record.
 * @param {Object} record - { applicationId, name, loanAmount, purpose, status, submittedAt }
 */
export function saveApplication(record) {
  const key = getStorageKey();
  if (!key) return;
  const apps = getApplications();
  // Avoid duplicates
  const exists = apps.find((a) => a.applicationId === record.applicationId);
  if (!exists) {
    apps.unshift(record); // newest first
    localStorage.setItem(key, JSON.stringify(apps));
  }
}

/**
 * Update the status of an existing application.
 * @param {string} applicationId
 * @param {string} status
 * @param {Object} extra - optional extra fields to merge (decision, riskScore, etc.)
 */
export function updateApplicationStatus(applicationId, status, extra = {}) {
  const key = getStorageKey();
  if (!key) return;
  const apps = getApplications();
  const idx = apps.findIndex((a) => a.applicationId === applicationId);
  if (idx !== -1) {
    apps[idx] = { ...apps[idx], status, ...extra };
    localStorage.setItem(key, JSON.stringify(apps));
  }
}

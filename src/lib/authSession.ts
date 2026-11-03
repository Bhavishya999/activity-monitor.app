/**
 * Session management for the frontend.
 *
 * Session cookie: HttpOnly, Secure (prod), SameSite=Strict — managed entirely by the
 * browser/backend. JavaScript cannot read or write it.
 *
 * CSRF token: stored in sessionStorage (survives page refresh, clears on tab close, never
 * accessible to cross-origin scripts). Falls back to in-memory when sessionStorage is
 * unavailable (private browsing, blocked storage).
 */

const CSRF_KEY = "gam_csrf";

let _memoryToken: string | null = null;

function readStorage(): string | null {
  try {
    return sessionStorage.getItem(CSRF_KEY);
  } catch {
    return null;
  }
}

function writeStorage(token: string): void {
  try {
    sessionStorage.setItem(CSRF_KEY, token);
  } catch {
    // sessionStorage unavailable — fall back to memory only
  }
}

function removeStorage(): void {
  try {
    sessionStorage.removeItem(CSRF_KEY);
  } catch {
    // no-op
  }
}

export function setCsrfToken(token: string): void {
  _memoryToken = token;
  writeStorage(token);
}

export function getCsrfToken(): string | null {
  // Prefer memory; hydrate from sessionStorage on page refresh
  if (_memoryToken) return _memoryToken;
  const stored = readStorage();
  if (stored) {
    _memoryToken = stored; // re-hydrate into memory
  }
  return stored;
}

export function clearCsrfToken(): void {
  _memoryToken = null;
  removeStorage();
}

/**
 * Full session teardown: CSRF token + any future session-scoped state.
 * Call this on logout or confirmed 401 (session expired).
 */
export function clearSession(): void {
  clearCsrfToken();
}

export type AuthUser = {
  id: number;
  email: string;
  name: string | null;
  role: "SUPER_ADMIN" | "ADMIN" | "MANAGER" | "DEVELOPER";
};

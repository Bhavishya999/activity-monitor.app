// The session itself is an HttpOnly cookie JavaScript cannot read; only the CSRF token is kept (in memory) for mutations.
let csrfToken: string | null = null;

export function setCsrfToken(token: string | null): void {
  csrfToken = token;
}

export function getCsrfToken(): string | null {
  return csrfToken;
}

export type Role = "DEVELOPER" | "ADMIN" | "SUPER_ADMIN";

export type AuthUser = { id: number; email: string; name: string | null; role: Role; employeeId: number | null };
export type MeResponse = { user: AuthUser; csrfToken: string };
export type AppMeta = { sample: boolean; timezone: string };

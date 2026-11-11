/**
 * Browser-local Classroom projects. Never sends student/teacher work to a server.
 * Export/Import supports moving projects between browsers and devices.
 */
export type SavedProject<T> = {
  version: 1;
  id: string;
  name: string;
  updatedAt: string;
  data: T;
};
const STORAGE_KEY = "tashrihul-aflak-classroom-projects-v1";
export function readProjects<T>(): SavedProject<T>[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return [];
    const parsed: unknown = JSON.parse(raw);
    if (!Array.isArray(parsed)) return [];
    return parsed.filter((p): p is SavedProject<T> =>
      !!p && typeof p === "object" && p.version === 1 &&
      typeof p.id === "string" && p.id.length < 150 &&
      typeof p.name === "string" && p.name.length <= 100 &&
      typeof p.updatedAt === "string" && !!p.data && typeof p.data === "object"
    ).slice(0, 100);
  } catch {
    return [];
  }
}
export function writeProjects<T>(items: SavedProject<T>[]): boolean {
  if (typeof window === "undefined") return false;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(items.slice(0, 100)));
    return true;
  } catch {
    return false;
  }
}
export function newProjectId(): string {
  return "classroom-" + Date.now().toString(36) + "-" + Math.random().toString(36).slice(2, 9);
}

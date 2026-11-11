import { nearestProjectedSegment } from "./joinGeometry";

export type ScreenXY = [number, number];
export type DrawnLineCandidate = {
  id: string;
  kind: "mark" | "stroke";
  /** A null denotes a hidden/occluded 3D vertex; never bridge across it. */
  screen: (ScreenXY | null)[];
};
export type LinePick = {
  id: string;
  kind: "mark" | "stroke";
  endpoint: 0 | 1 | null;
  distance: number;
};

/**
 * Select only teacher-drawn paths, never reference celestial geometry.
 * Endpoints have priority over line bodies so a touch-and-hold on a handle
 * starts endpoint editing instead of showing the line-action menu.
 */
export function pickDrawnLine(
  candidates: readonly DrawnLineCandidate[],
  point: ScreenXY,
  radius: number,
  endpointRadius: number,
): LinePick | null {
  let body: LinePick | null = null;
  let endpoint: LinePick | null = null;
  // Newest line (last candidate) wins distance ties.
  for (const candidate of candidates) {
    if (candidate.screen.length < 2) continue;
    const hit = nearestProjectedSegment(candidate.screen, point, radius);
    if (hit && (!body || hit.distance <= body.distance)) {
      body = { kind: candidate.kind, id: candidate.id, endpoint: null, distance: hit.distance };
    }
    for (const [index, vertex] of [
      [0, candidate.screen[0]],
      [1, candidate.screen[candidate.screen.length - 1]],
    ] as const) {
      if (!vertex) continue;
      const distance = Math.hypot(vertex[0] - point[0], vertex[1] - point[1]);
      if (distance <= endpointRadius && (!endpoint || distance <= endpoint.distance)) {
        endpoint = { kind: candidate.kind, id: candidate.id, endpoint: index, distance };
      }
    }
  }
  return endpoint || body;
}

/** A pointer movement beyond this threshold cancels a pending long press. */
export function pressHasMoved(from: ScreenXY, to: ScreenXY, slop = 11): boolean {
  return Math.hypot(from[0] - to[0], from[1] - to[1]) > slop;
}

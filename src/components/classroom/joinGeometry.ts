/** Screen-space snapping for the Classroom Join tool.
 * Finds the nearest point on ANY polyline segment, not just stored endpoints.
 */
export type XY = [number, number];
export type Vec = [number, number, number];
export type SegmentHit = { segmentIndex: number; ratio: number; distance: number };
export function nearestProjectedSegment(
  screen: readonly (XY | null)[],
  target: XY,
  radius: number,
): SegmentHit | null {
  let best: SegmentHit | null = null;
  let closest = radius;
  for (let i = 1; i < screen.length; i++) {
    const a = screen[i - 1], b = screen[i];
    if (!a || !b) continue;
    const dx = b[0] - a[0], dy = b[1] - a[1];
    const length2 = dx * dx + dy * dy;
    const ratio = length2 > 1e-12
      ? Math.max(0, Math.min(1, ((target[0] - a[0]) * dx + (target[1] - a[1]) * dy) / length2))
      : 0;
    const distance = Math.hypot(target[0] - a[0] - dx * ratio, target[1] - a[1] - dy * ratio);
    if (distance <= closest) {
      closest = distance;
      best = { segmentIndex: i - 1, ratio, distance };
    }
  }
  return best;
}
export function interpolate2(a: XY, b: XY, ratio: number): XY {
  return [a[0] + (b[0] - a[0]) * ratio, a[1] + (b[1] - a[1]) * ratio];
}
export function interpolate3(a: Vec, b: Vec, ratio: number): Vec {
  return [a[0] + (b[0] - a[0]) * ratio, a[1] + (b[1] - a[1]) * ratio, a[2] + (b[2] - a[2]) * ratio];
}
/** Projected straight segments are perspective-distorted. Convert an
 * apparent screen fraction to the actual 3D segment fraction. */
export function perspectiveCorrectRatio(screenRatio: number, depthA: number, depthB: number): number {
  if(depthA<=0||depthB<=0)return screenRatio;
  const numerator=screenRatio*depthA;
  const denominator=(1-screenRatio)*depthB+numerator;
  return denominator>1e-12?numerator/denominator:screenRatio;
}
/** Two full diameters of the hollow celestial sphere.
 * Horizontal = east/west (+X), vertical = zenith/nadir (+Y).
 * Both pass precisely through the 3D origin and stay inside radius 1.
 */
export function centerAxisPaths(radius = 0.984): [Vec[], Vec[]] {
  return [
    [[-radius, 0, 0], [radius, 0, 0]],
    [[0, -radius, 0], [0, radius, 0]],
  ];
}

import { describe, expect, it } from "vitest";
import { centerAxisPaths, nearestProjectedSegment, interpolate2, interpolate3 } from "../components/classroom/joinGeometry";

describe("Classroom Join anywhere", () => {
  it("snaps to the interior of a straight line, not only endpoints", () => {
    const hit = nearestProjectedSegment([[0, 0], [200, 0]], [78, 5], 16);
    expect(hit).not.toBeNull();
    expect(hit?.segmentIndex).toBe(0);
    expect(hit?.ratio).toBeCloseTo(0.39, 5);
    expect(interpolate3([0, 0, 0], [2, 0, 0], hit!.ratio)).toEqual([0.78, 0, 0]);
  });
  it("finds a point on the nearest middle segment of a polyline", () => {
    const hit = nearestProjectedSegment([[0, 0], [100, 0], [100, 100]], [107, 75], 16);
    expect(hit?.segmentIndex).toBe(1);
    expect(interpolate2([0.3, 0.3], [0.3, 0.7], hit!.ratio)[1]).toBeCloseTo(0.6);
  });
  it("ignores hidden segments and clicks too far from any line", () => {
    expect(nearestProjectedSegment([null, [100, 0], [150, 0]], [50, 0], 16)).toBeNull();
    expect(nearestProjectedSegment([[0, 0], [100, 0]], [50, 99], 18)).toBeNull();
  });
  it("draws full inside horizontal and vertical 3D diameters crossing the exact center", () => {
    const [h, v] = centerAxisPaths();
    expect(h).toEqual([[-0.984, 0, 0], [0.984, 0, 0]]);
    expect(v).toEqual([[0, -0.984, 0], [0, 0.984, 0]]);
    expect(interpolate3(h[0]!, h[1]!, 0.5)).toEqual([0, 0, 0]);
    expect(interpolate3(v[0]!, v[1]!, 0.5)).toEqual([0, 0, 0]);
    expect(h.flat().every(n => Math.abs(n) <= 1)).toBe(true);
    expect(v.flat().every(n => Math.abs(n) <= 1)).toBe(true);
  });
});

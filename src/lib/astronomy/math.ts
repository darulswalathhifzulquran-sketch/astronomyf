import * as THREE from "three";

/**
 * Observer-local right-handed frame (fixed, never rotated by camera):
 * +X = East, -X = West, +Y = Zenith, -Y = Nadir, -Z = North, +Z = South.
 * All vectors are on (or relative to) the unit celestial sphere.
 */
export const DEG = Math.PI / 180;
export const V = (x: number, y: number, z: number) => new THREE.Vector3(x, y, z);

export const EAST = V(1, 0, 0);
export const WEST = V(-1, 0, 0);
export const ZENITH = V(0, 1, 0);
export const NADIR = V(0, -1, 0);
export const NORTH = V(0, 0, -1);
export const SOUTH = V(0, 0, 1);

/** Mean obliquity of the ecliptic (IAU 1980 simplified), degrees. */
export function meanObliquity(date: Date): number {
  const T = (date.getTime() / 86400000 + 2440587.5 - 2451545.0) / 36525;
  return 23.439291 - 0.0130042 * T;
}

export function basisFromNormal(normal: THREE.Vector3) {
  const n = normal.clone().normalize();
  const ref = Math.abs(n.y) < 0.9 ? V(0, 1, 0) : V(1, 0, 0);
  const u = new THREE.Vector3().crossVectors(ref, n).normalize();
  const w = new THREE.Vector3().crossVectors(n, u).normalize();
  return { u, w, n };
}

/** Small circle: points p with p·n = d (|d|<1). d=0 → great circle. */
export function smallCircle(normal: THREE.Vector3, d = 0, seg = 160): THREE.Vector3[] {
  const { u, w, n } = basisFromNormal(normal);
  const r = Math.sqrt(Math.max(0, 1 - d * d));
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= seg; i++) {
    const t = (i / seg) * Math.PI * 2;
    pts.push(n.clone().multiplyScalar(d).addScaledVector(u, r * Math.cos(t)).addScaledVector(w, r * Math.sin(t)));
  }
  return pts;
}

export const greatCircle = (n: THREE.Vector3, seg = 160) => smallCircle(n, 0, seg);

/** Shortest great-circle arc between unit vectors (spherical interpolation). */
export function slerpArc(a: THREE.Vector3, b: THREE.Vector3, seg = 48): THREE.Vector3[] {
  const A = a.clone().normalize();
  const B = b.clone().normalize();
  const ang = A.angleTo(B);
  if (ang < 1e-6) return [A, A.clone()];
  if (Math.PI - ang < 1e-6) {
    // antiparallel: pick an arbitrary perpendicular through which to pass
    const mid = basisFromNormal(A).u;
    return [...slerpArc(A, mid, seg / 2), ...slerpArc(mid, B, seg / 2).slice(1)];
  }
  const s = Math.sin(ang);
  const pts: THREE.Vector3[] = [];
  for (let i = 0; i <= seg; i++) {
    const t = i / seg;
    pts.push(A.clone().multiplyScalar(Math.sin((1 - t) * ang) / s).addScaledVector(B, Math.sin(t * ang) / s));
  }
  return pts;
}

/** Normal of the great circle through two points, safe for (anti)parallel input. */
export function planeNormal(a: THREE.Vector3, b: THREE.Vector3): THREE.Vector3 {
  const n = new THREE.Vector3().crossVectors(a, b);
  if (n.lengthSq() < 1e-10) return basisFromNormal(a).u;
  return n.normalize();
}

/** Project a point onto a great-circle plane and renormalize to the sphere. */
export function projectToPlane(p: THREE.Vector3, n: THREE.Vector3): THREE.Vector3 {
  const nn = n.clone().normalize();
  const q = p.clone().addScaledVector(nn, -p.dot(nn));
  if (q.lengthSq() < 1e-10) return basisFromNormal(nn).u;
  return q.normalize();
}

/** Local equatorial basis vectors for latitude φ. */
export function localFrame(latDeg: number) {
  const f = latDeg * DEG;
  const P = V(0, Math.sin(f), -Math.cos(f)); // north celestial pole
  const Q = V(0, Math.cos(f), Math.sin(f)); // equator ∩ upper meridian (H = 0)
  return { P, Q, E: EAST.clone() };
}

/** Hour angle H (deg, west-positive) + declination δ → local unit vector. */
export function hourAngleToLocal(haDeg: number, decDeg: number, latDeg: number) {
  const { P, Q, E } = localFrame(latDeg);
  const H = haDeg * DEG;
  const d = decDeg * DEG;
  return Q.multiplyScalar(Math.cos(d) * Math.cos(H))
    .addScaledVector(E, -Math.cos(d) * Math.sin(H))
    .addScaledVector(P, Math.sin(d));
}

export function raDecToLocal(raH: number, decDeg: number, lstH: number, latDeg: number) {
  return hourAngleToLocal((lstH - raH) * 15, decDeg, latDeg);
}

export function eclipticToRaDec(lonDeg: number, latDeg: number, epsDeg: number) {
  const l = lonDeg * DEG, b = latDeg * DEG, e = epsDeg * DEG;
  const x = Math.cos(b) * Math.cos(l);
  const y = Math.cos(b) * Math.sin(l) * Math.cos(e) - Math.sin(b) * Math.sin(e);
  const z = Math.cos(b) * Math.sin(l) * Math.sin(e) + Math.sin(b) * Math.cos(e);
  let ra = Math.atan2(y, x) / DEG / 15;
  if (ra < 0) ra += 24;
  return { ra, dec: Math.asin(Math.max(-1, Math.min(1, z))) / DEG };
}

export function raDecToEcliptic(raH: number, decDeg: number, epsDeg: number) {
  const a = raH * 15 * DEG, d = decDeg * DEG, e = epsDeg * DEG;
  const x = Math.cos(d) * Math.cos(a), y = Math.cos(d) * Math.sin(a), z = Math.sin(d);
  let lon = Math.atan2(y * Math.cos(e) + z * Math.sin(e), x) / DEG;
  if (lon < 0) lon += 360;
  return { lon, lat: Math.asin(z * Math.cos(e) - y * Math.sin(e)) / DEG };
}

/** Altitude (deg) and modern azimuth (deg, from North through East). */
export function localToAltAz(v: THREE.Vector3) {
  const n = v.clone().normalize();
  let az = Math.atan2(n.x, -n.z) / DEG;
  if (az < 0) az += 360;
  return { alt: Math.asin(Math.max(-1, Math.min(1, n.y))) / DEG, az };
}

/** Rising amplitude (deg from East, + toward North). null if circumpolar/never rises. */
export function risingAmplitude(decDeg: number, latDeg: number): number | null {
  const c = Math.cos(latDeg * DEG);
  if (c < 1e-9) return null;
  const s = Math.sin(decDeg * DEG) / c;
  if (Math.abs(s) > 1) return null;
  return Math.asin(s) / DEG;
}

export const angleDeg = (a: THREE.Vector3, b: THREE.Vector3) => a.angleTo(b) / DEG;
export const fmt = (d: number) => `${d.toFixed(2)}°`;

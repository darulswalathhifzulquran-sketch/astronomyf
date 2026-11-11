import * as Astronomy from "astronomy-engine";
import * as THREE from "three";
import {
  eclipticToRaDec, raDecToEcliptic, raDecToLocal, meanObliquity, localFrame,
} from "./math";

/** Demo target: Aldebaran (α Tau), J2000 catalogue values (precession ignored, noted in UI). */
export const TARGET = { name: "Aldebaran", ar: "الدَّبَرَان", ra: 4.59868, dec: 16.50930 };

export interface SkyState {
  lat: number; lon: number; eps: number; lst: number;
  P: THREE.Vector3; S: THREE.Vector3; K: THREE.Vector3; Q: THREE.Vector3;
  T: THREE.Vector3; tEcl: { lon: number; lat: number };
  sun: THREE.Vector3; sunLon: number; sunDec: number; sunRa: number;
  moon: THREE.Vector3 | null;
  eclToLocal: (lonDeg: number, latDeg?: number) => THREE.Vector3;
}

/** Single authoritative computation of all positions for a date + observer. */
export function computeSky(date: Date, lat: number, lon: number): SkyState {
  const eps = meanObliquity(date);
  let lst = Astronomy.SiderealTime(date) + lon / 15;
  lst = ((lst % 24) + 24) % 24;
  const { P, Q } = localFrame(lat);
  const eclToLocal = (l: number, b = 0) => {
    const { ra, dec } = eclipticToRaDec(l, b, eps);
    return raDecToLocal(ra, dec, lst, lat);
  };
  const K = eclToLocal(0, 90);
  const sunLon = Astronomy.SunPosition(date).elon;
  const sunEq = eclipticToRaDec(sunLon, 0, eps);
  const sun = raDecToLocal(sunEq.ra, sunEq.dec, lst, lat);
  let moon: THREE.Vector3 | null = null;
  try {
    const obs = new Astronomy.Observer(lat, lon, 0);
    const m = Astronomy.Equator(Astronomy.Body.Moon, date, obs, true, true);
    moon = raDecToLocal(m.ra, m.dec, lst, lat);
  } catch { moon = null; }
  const T = raDecToLocal(TARGET.ra, TARGET.dec, lst, lat);
  return {
    lat, lon, eps, lst, P, S: P.clone().negate(), K, Q, T,
    tEcl: raDecToEcliptic(TARGET.ra, TARGET.dec, eps),
    sun, sunLon, sunDec: sunEq.dec, sunRa: sunEq.ra, moon, eclToLocal,
  };
}

/**
 * Classroom-only equinoctial reference orientation.
 *
 * Real observation: the ecliptic/equator intersection moves around the local
 * sky with sidereal time. In the traditional teaching diagram the vernal
 * equinoctial point is placed due EAST and the autumnal point due WEST.
 * This corresponds to local sidereal time 18h (vernal hour angle -90°).
 *
 * Rotate the WHOLE equatorial/ecliptic sky around the north celestial pole;
 * never independently move either equinox label. Thus the equator, ecliptic,
 * their poles, solstices, Sun/star positions, diurnal circles and arcs all
 * remain mutually geometrically consistent. Observer horizon, N/E/S/W and
 * meridian remain fixed in the local frame.
 *
 * NOTE: This is a reference teaching frame, not the actual sky at "date".
 * Only Classroom uses it; astronomy-engine observations elsewhere stay real.
 */
export function alignEquinoxesEastWest(source: SkyState): SkyState {
  const equinox = source.eclToLocal(0).clone().normalize();
  const pole = source.P.clone().normalize();
  const east = new THREE.Vector3(1, 0, 0);

  // Signed rotation about the celestial pole from the vernal equinox to East.
  const cross = new THREE.Vector3().crossVectors(equinox, east);
  const phase = Math.atan2(pole.dot(cross), equinox.dot(east));
  const orientation = new THREE.Quaternion().setFromAxisAngle(pole, phase);
  const transform = (p: THREE.Vector3) => p.clone().applyQuaternion(orientation);

  return {
    ...source,
    // At LST 18h, vernal point (RA=0h) rises due East (hour angle=-6h).
    lst: 18,
    K: transform(source.K),
    T: transform(source.T),
    sun: transform(source.sun),
    moon: source.moon ? transform(source.moon) : null,
    eclToLocal: (longitude: number, latitude = 0) =>
      transform(source.eclToLocal(longitude, latitude)),
  };
}

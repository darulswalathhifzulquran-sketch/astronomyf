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

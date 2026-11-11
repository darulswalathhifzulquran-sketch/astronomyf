import { describe, expect, it } from "vitest";
import * as THREE from "three";
import { computeSky, alignEquinoxesEastWest } from "@/lib/astronomy/sky";
import { EAST, WEST, ZENITH, angleDeg, DEG, planeNormal } from "@/lib/astronomy/math";
import { buildLayer } from "@/lib/astronomy/layerGeometry";
import { LAYERS } from "@/data/layers";

const date = new Date("2026-03-20T12:00:00Z");
const near = (value: number, tol = 1e-9) => expect(Math.abs(value)).toBeLessThan(tol);

describe("East/West equinoctial Classroom reference frame", () => {
  for (const lat of [0, 11, 45, -30]) {
    it(`puts vernal = East and autumnal = West at latitude ${lat}°, keeping all circles consistent`, () => {
      const original = computeSky(date, lat, 75.8);
      const sky = alignEquinoxesEastWest(original);
      const spring = sky.eclToLocal(0);
      const autumn = sky.eclToLocal(180);
      const northSolstice = sky.eclToLocal(90);
      const southSolstice = sky.eclToLocal(270);

      expect(spring.distanceTo(EAST)).toBeLessThan(1e-9);
      expect(autumn.distanceTo(WEST)).toBeLessThan(1e-9);
      near(spring.dot(sky.P));
      near(autumn.dot(sky.P));
      near(spring.dot(sky.K));
      near(autumn.dot(sky.K));
      expect(angleDeg(sky.P,sky.K)).toBeCloseTo(sky.eps,8);
      expect(northSolstice.dot(sky.P)).toBeCloseTo(Math.sin(sky.eps*DEG),8);
      expect(southSolstice.dot(sky.P)).toBeCloseTo(-Math.sin(sky.eps*DEG),8);
      near(sky.sun.dot(sky.K), 1e-5);
      expect(sky.T.dot(sky.P)).toBeCloseTo(original.T.dot(original.P), 8);
      expect(sky.sun.dot(sky.P)).toBeCloseTo(original.sun.dot(original.P), 8);
      expect(sky.lst).toBe(18);
      expect(sky.P.distanceTo(original.P)).toBeLessThan(1e-9);
      expect(sky.Q.distanceTo(original.Q)).toBeLessThan(1e-9);
      // All ecliptic latitude parallels remain normal to the same pole.
      expect(sky.eclToLocal(45,15).dot(sky.K)).toBeCloseTo(Math.sin(15*DEG),8);

      // Each equinox is simultaneously on the equator, ecliptic,
      // horizon and prime vertical in the teaching orientation.
      for (const name of ["01_equator", "02_ecliptic", "06_horizon", "08_first_vertical"]) {
        const circle = buildLayer(name,sky).lines[0]!;
        const n = name === "01_equator" ? sky.P :
                  name === "02_ecliptic" ? sky.K :
                  name === "06_horizon" ? ZENITH : new THREE.Vector3(0,0,-1);
        near(spring.dot(n));
        near(autumn.dot(n));
        expect(circle.length).toBeGreaterThan(50);
      }
      // The solstitial colure contains BOTH poles and BOTH solstices.
      const colureNormal = planeNormal(sky.P,sky.K);
      near(colureNormal.dot(sky.P));
      near(colureNormal.dot(sky.K));
      near(colureNormal.dot(northSolstice));
      near(colureNormal.dot(southSolstice));
      expect(buildLayer("03_four_poles", sky).lines[0]!.length).toBeGreaterThan(50);

      // Target circles must continue to pass through the common target.
      near(planeNormal(sky.P,sky.T).dot(sky.T));
      near(planeNormal(sky.K,sky.T).dot(sky.T));
      near(planeNormal(ZENITH,sky.T).dot(sky.T));

      // Historical arc 14 is still the TRUE ε angular distance
      // from summer-solstice point to the equator.
      const tilt = buildLayer("14_obliquity", sky).lines[0]!;
      const from=tilt[0]!,to=tilt[tilt.length-1]!;
      near(from.dot(sky.P));
      expect(to.distanceTo(northSolstice)).toBeLessThan(1e-8);
      expect(angleDeg(from,to)).toBeCloseTo(sky.eps,6);

      // All thirty layer definitions still render or explicitly report review.
      expect(LAYERS).toHaveLength(30);
      for (const item of LAYERS) {
        const data=buildLayer(item.id,sky);
        expect(data.lines).toBeDefined();
        for (const line of data.lines) {
          for (const p of line) {
            expect(Number.isFinite(p.x)&&Number.isFinite(p.y)&&Number.isFinite(p.z)).toBe(true);
          }
        }
      }
    });
  }
});

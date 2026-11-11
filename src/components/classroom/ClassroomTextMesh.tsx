import { useEffect, useMemo } from "react";
import * as THREE from "three";

export type TextAnnotation = {
  id: string;
  value: string;
  position: [number, number, number];
  color: string;
  size: number;
  inside: boolean;
};

/** Real world-space text plane, rasterized locally so Latin and Arabic work offline. */
export function ClassroomTextMesh({ annotation }: { annotation: TextAnnotation }) {
  const { texture, aspect } = useMemo(() => {
    const canvas = document.createElement("canvas");
    const ctx = canvas.getContext("2d");
    const fontSize = 90;
    const label = annotation.value.slice(0, 100);
    if (!ctx) return { texture: null, aspect: 1 };
    ctx.font = "bold " + fontSize + "px Arial, 'Noto Naskh Arabic', sans-serif";
    const measured = ctx.measureText(label).width;
    canvas.width = Math.min(2048, Math.max(160, Math.ceil(measured + 55)));
    canvas.height = 148;
    ctx.font = "bold " + fontSize + "px Arial, 'Noto Naskh Arabic', sans-serif";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.direction = /[\u0600-\u06ff]/.test(label) ? "rtl" : "ltr";
    ctx.fillStyle = annotation.color;
    ctx.fillText(label, canvas.width / 2, canvas.height / 2, canvas.width - 20);
    const map = new THREE.CanvasTexture(canvas);
    map.colorSpace = THREE.SRGBColorSpace;
    map.anisotropy = 4;
    return { texture: map, aspect: canvas.width / canvas.height };
  }, [annotation.value, annotation.color]);
  useEffect(() => () => texture?.dispose(), [texture]);
  const world = useMemo(() => {
    const normal = new THREE.Vector3(...annotation.position).normalize();
    const direction = annotation.inside ? normal.clone().negate() : normal.clone();
    return {
      position: normal.multiplyScalar(annotation.inside ? 0.946 : 1.065),
      quaternion: new THREE.Quaternion().setFromUnitVectors(new THREE.Vector3(0, 0, 1), direction),
    };
  }, [annotation.position, annotation.inside]);
  if (!texture) return null;
  const height = Math.max(0.07, Math.min(0.5, annotation.size));
  return <mesh position={world.position} quaternion={world.quaternion} raycast={() => null}>
    <planeGeometry args={[Math.min(2.4, height * aspect), height]} />
    <meshBasicMaterial map={texture} transparent side={THREE.DoubleSide} depthTest={false} depthWrite={false} />
  </mesh>;
}

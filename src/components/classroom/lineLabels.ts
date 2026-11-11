/** Geometry and validation for optional labels anchored to teacher-drawn lines.
 * Keep this independent of React/Three so drawing/persistence stays testable.
 */
export type Point2D = [number, number];
export type Point3D = [number, number, number];

/** Reject invisible/whitespace-only text; cap storage and texture work. */
export function cleanLineName(name: string): string {
  return name.trim().slice(0, 80);
}
export function isValidStoredLineName(name: unknown): boolean {
  return name === undefined ||
    (typeof name === "string" && name.length <= 80);
}

/** Arc-length midpoint, not the middle array index. Works for straight and
 * irregularly sampled polylines, ensuring labels follow the visible line.
 * 2D scale may be supplied to account for wide vs. tall screens.
 */
function midway(points: readonly (readonly number[])[], scales: readonly number[]): number[] | null {
  if (!points.length) return null;
  if (points.length === 1) return [...points[0]!];
  const lengths: number[] = [];
  let total = 0;
  for (let i=1;i<points.length;i++) {
    const a=points[i-1]!, b=points[i]!;
    let squared=0;
    for(let d=0;d<scales.length;d++){
      const diff=((b[d] ?? 0)-(a[d] ?? 0))*scales[d]!;
      squared+=diff*diff;
    }
    const length=Math.sqrt(squared);
    lengths.push(length);
    total+=length;
  }
  if(total<1e-10)return [...points[0]!];
  let travelled=0;
  const halfway=total/2;
  for(let i=0;i<lengths.length;i++){
    const length=lengths[i]!;
    if(travelled+length>=halfway){
      const a=points[i]!,b=points[i+1]!;
      const ratio=length>0?(halfway-travelled)/length:0;
      return scales.map((_,d)=>(a[d] ?? 0)+((b[d] ?? 0)-(a[d] ?? 0))*ratio);
    }
    travelled+=length;
  }
  return [...points[points.length-1]!];
}
export function lineLabelPoint3D(points: readonly Point3D[]): Point3D | null {
  const p=midway(points,[1,1,1]);
  return p ? [p[0]!,p[1]!,p[2]!] : null;
}
export function lineLabelPoint2D(points: readonly Point2D[],width:number,height:number):Point2D|null{
  const p=midway(points,[Math.max(1,width),Math.max(1,height)]);
  return p ? [p[0]!,p[1]!] : null;
}

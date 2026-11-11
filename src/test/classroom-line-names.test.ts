import { describe, it, expect } from "vitest";
import { cleanLineName, isValidStoredLineName, lineLabelPoint3D, lineLabelPoint2D } from "../components/classroom/lineLabels";

describe("optional names on Classroom lines",()=>{
  it("supports Arabic, Malayalam, English and deliberate no-name finish",()=>{
    expect(cleanLineName("  مُعَدِّلُ النَّهَارِ  ")).toBe("مُعَدِّلُ النَّهَارِ");
    expect(cleanLineName("  വൃത്തം  ")).toBe("വൃത്തം");
    expect(cleanLineName("")).toBe("");
    expect(cleanLineName("   ")).toBe("");
    expect(cleanLineName("a".repeat(100)).length).toBe(80);
    expect(isValidStoredLineName(undefined)).toBe(true); // existing projects
    expect(isValidStoredLineName("")).toBe(true); // unnamed line
    expect(isValidStoredLineName("test")).toBe(true);
    expect(isValidStoredLineName(1)).toBe(false);
    expect(isValidStoredLineName("x".repeat(81))).toBe(false);
  });
  it("anchors the 3D label at half the physical line length",()=>{
    expect(lineLabelPoint3D([[0,0,0],[1,0,0]])).toEqual([0.5,0,0]);
    // Unevenly sampled segment counts must not move the label.
    expect(lineLabelPoint3D([[0,0,0],[0.1,0,0],[0.2,0,0],[2,0,0]])).toEqual([1,0,0]);
    expect(lineLabelPoint3D([[-0.984,0,0],[0.984,0,0]])).toEqual([0,0,0]);
  });
  it("anchors 2D names using real aspect-correct pixel length",()=>{
    expect(lineLabelPoint2D([[0,0],[1,0]],1000,700)).toEqual([0.5,0]);
    expect(lineLabelPoint2D([[0,0],[0.2,0],[0.2,1]],1000,200)).toEqual([0.2,0]);
    expect(lineLabelPoint2D([],400,200)).toBeNull();
  });
});

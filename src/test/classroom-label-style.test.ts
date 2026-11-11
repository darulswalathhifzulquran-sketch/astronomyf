import { describe, expect, it } from "vitest";
import { readFileSync } from "node:fs";
import { resolve } from "node:path";

// Protect labels from reintroducing the narrow Html width that wrapped Arabic
// letters vertically, or reintroducing the old label background/card.
const css = readFileSync(resolve(process.cwd(),"src/components/classroom/ClassroomEnhancements.css"),"utf8");
const app = readFileSync(resolve(process.cwd(),"src/components/classroom/ClassroomApp.tsx"),"utf8");
const classRule = (selector: string) => {
  const begin = css.indexOf(selector+" {");
  expect(begin,selector+" must exist").toBeGreaterThanOrEqual(0);
  const bodyStart = css.indexOf("{",begin);
  const end = css.indexOf("}",bodyStart);
  return css.slice(bodyStart+1,end);
};

describe("Saved Classroom labels render horizontally without boxes",()=>{
  it("draws a clear, single-line and transparent 3D line name",()=>{
    const rule=classRule(".classroom-v2 .classroom-drawn-line-name");
    expect(rule).toMatch(/white-space:\s*nowrap\s*!important/);
    expect(rule).toMatch(/writing-mode:\s*horizontal-tb\s*!important/);
    expect(rule).toMatch(/max-width:\s*none/);
    expect(rule).toMatch(/background:\s*transparent/);
    expect(rule).toMatch(/border:\s*0/);
    expect(rule).toMatch(/box-shadow:\s*none/);
  });
  it("does not allow the 3D Html anchor to squeeze the label",()=>{
    expect(app).toContain('whiteSpace:"nowrap",background:"transparent"');
    expect(app).toContain('width:"max-content",minWidth:"max-content"');
  });
  it("keeps 2D names horizontal and measurement labels box-free",()=>{
    expect(classRule(".classroom-v2 .classroom-ink-name"))
      .toMatch(/writing-mode:\s*horizontal-tb\s*!important/);
    const rule=classRule(".classroom-root.classroom-v2 .classroom-measure-label");
    expect(rule).toMatch(/background:\s*transparent/);
    expect(rule).toMatch(/border:\s*0/);
    expect(rule).toMatch(/white-space:\s*nowrap\s*!important/);
  });
});

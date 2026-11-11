import { describe, expect, it } from "vitest";
import { pickDrawnLine, pressHasMoved, type DrawnLineCandidate } from "../components/classroom/lineInteraction";

const input: DrawnLineCandidate[] = [
  { id: "s1", kind: "stroke", screen: [[0, 50], [300, 50]] },
  { id: "m1", kind: "mark", screen: [[40, 100], [200, 200]] },
];
describe("line touch-hold and double-click targeting", () => {
  it("picks an existing line at its middle, without an endpoint", () => {
    expect(pickDrawnLine(input, [150, 53], 20, 20))
      .toEqual({id:"s1",kind:"stroke",endpoint:null,distance:3});
  });
  it("prioritizes line endpoints over the body for editing", () => {
    const hit = pickDrawnLine(input, [42, 102], 20, 24);
    expect(hit?.id).toBe("m1");
    expect(hit?.endpoint).toBe(0);
    expect(pickDrawnLine(input, [200, 200], 20, 24)?.endpoint).toBe(1);
  });
  it("does not open a menu on empty space, or invisible 3D points", () => {
    expect(pickDrawnLine(input, [400, 300], 20, 24)).toBeNull();
    const hidden: DrawnLineCandidate[] = [{id:"invisible",kind:"mark",screen:[null,null]}];
    expect(pickDrawnLine(hidden, [50, 50], 24, 24)).toBeNull();
  });
  it("ignores a disconnected/occluded segment", () => {
    const partial: DrawnLineCandidate[] = [{id:"a",kind:"mark",screen:[[0,0],null,[100,0]]}];
    expect(pickDrawnLine(partial, [50,0], 12, 12)).toBeNull();
  });
  it("cancels hold on drag but tolerates finger jitter", () => {
    expect(pressHasMoved([100,100],[109,107])).toBe(true);
    expect(pressHasMoved([100,100],[106,105])).toBe(false);
  });
});

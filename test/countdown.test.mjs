import test from "node:test";
import assert from "node:assert/strict";
import vm from "node:vm";
import fs from "node:fs";
const context = vm.createContext({ window: {} });
vm.runInContext(
  fs.readFileSync(new URL("../countdown.js", import.meta.url), "utf8"),
  context,
);
test("rejects impossible dates and accepts leap days", () => {
  for (const date of [
    "02/30/2026",
    "02/29/2025",
    "13/01/2026",
    "0/1/2026",
    "10/22/26",
    "2026-10-22",
  ])
    assert.equal(context.parseEventDate(date), null);
  assert.equal(context.parseEventDate("02/29/2024").getDate(), 29);
});
test("calendar dates stay exact across daylight-saving transitions and past dates", () => {
  for (const [from, to, expected] of [
    ["03/08/2026", "03/09/2026", 1],
    ["11/01/2026", "11/02/2026", 1],
    ["10/22/2026", "10/21/2026", -1],
    ["10/22/2026", "10/22/2026", 0],
  ])
    assert.equal(
      context.calendarDaysBetween(
        context.parseEventDate(from),
        context.parseEventDate(to),
      ),
      expected,
    );
});

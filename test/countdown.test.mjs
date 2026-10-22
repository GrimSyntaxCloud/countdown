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

test("board and accessible result describe future, past and today consistently", () => {
  const today = context.parseEventDate("10/22/2026");
  for (const [date, days, state] of [
    ["10/23/2026", 1, "ON THE HORIZON"],
    ["10/21/2026", -1, "IN THE MEMORY BANK"],
    ["10/22/2026", 0, "TODAY IS THE DAY"],
  ]) {
    const result = context.describeCountdown(
      "Big day",
      context.parseEventDate(date),
      today,
    );
    assert.equal(result.days, days);
    assert.equal(result.state, state);
    assert.match(result.message, /Big day/);
    assert.ok(!result.message.includes("-1 day"));
  }
});

test("accepts padded input and early years without Date's 1900-year offset", () => {
  assert.equal(context.parseEventDate(" 1/2/0001 ").getFullYear(), 1);
  assert.equal(context.parseEventDate("01/01/0000"), null);
  assert.equal(context.parseEventDate("10/22/2026 extra"), null);
  assert.equal(context.parseEventDate("04/31/2026"), null);
});

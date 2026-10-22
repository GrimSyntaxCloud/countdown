"use strict";

var $ = function (id) {
  return document.getElementById(id);
};

// Validate calendar components instead of relying on browser-specific date parsing.
var parseEventDate = function (value) {
  var match = /^(\d{1,2})\/(\d{1,2})\/(\d{4})$/.exec(value.trim());
  if (!match) return null;
  var month = Number(match[1]),
    day = Number(match[2]),
    year = Number(match[3]);
  if (year < 1) return null;
  var date = new Date(0);
  date.setHours(0, 0, 0, 0);
  date.setFullYear(year, month - 1, day);
  return date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day
    ? date
    : null;
};

var calendarDaysBetween = function (from, to) {
  var ordinal = function (date) {
    var utc = new Date(0);
    utc.setUTCFullYear(date.getFullYear(), date.getMonth(), date.getDate());
    utc.setUTCHours(0, 0, 0, 0);
    return utc.getTime();
  };
  return (ordinal(to) - ordinal(from)) / 86400000;
};

// Keep the message and visual board driven by the same calendar-day result.
var describeCountdown = function (event, date, today) {
  var days = calendarDaysBetween(today, date);
  return {
    days: days,
    state:
      days === 0
        ? "TODAY IS THE DAY"
        : days < 0
          ? "IN THE MEMORY BANK"
          : "ON THE HORIZON",
    direction:
      days === 0
        ? "YOUR MOMENT IS HERE."
        : days < 0
          ? "SINCE YOUR MILESTONE."
          : "UNTIL YOUR MILESTONE.",
    message:
      days === 0
        ? "Hooray! Today is " + event + "! (" + date.toDateString() + ")"
        : Math.abs(days) +
          " day(s) " +
          (days < 0 ? "since " : "until ") +
          event +
          " (" +
          date.toDateString() +
          ")",
  };
};

var calculateDays = function () {
  var event = $("event").value.trim();
  var dt = $("date").value.trim();
  var date = parseEventDate(dt);
  $("event").removeAttribute("aria-invalid");
  $("date").removeAttribute("aria-invalid");
  $("error").textContent = "";
  if (!event || !date) {
    var field = !event ? $("event") : $("date");
    $("error").textContent = !event
      ? "Give your event a name first."
      : "Please enter a real date in MM/DD/YYYY format.";
    field.setAttribute("aria-invalid", "true");
    field.focus();
    return;
  }
  var result = describeCountdown(event, date, new Date());
  var value = String(Math.abs(result.days)).padStart(3, "0");
  var digits = $("digits");
  digits.replaceChildren();
  digits.classList.toggle("many", value.length > 4);
  digits.style.setProperty("--count", value.length);
  Array.from(value).forEach(function (digit, index) {
    var flap = document.createElement("span");
    flap.className = "flap";
    flap.style.setProperty("--i", index);
    flap.textContent = digit;
    digits.appendChild(flap);
  });
  $("event-title").textContent = event;
  $("state-label").textContent = result.state;
  $("direction").textContent = result.direction;
  $("day-unit").textContent = Math.abs(result.days) === 1 ? "DAY" : "DAYS";
  $("target-date").textContent = date
    .toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    })
    .toUpperCase();
  $("message").textContent = result.message;
  digits.classList.remove("flip");
  // Force a fresh animation for repeated submissions, without changing the result.
  void digits.offsetWidth;
  digits.classList.add("flip");
};

window.onload = function () {
  $("today-label").textContent =
    "TODAY / " +
    new Date()
      .toLocaleDateString("en-US", { month: "short", day: "2-digit" })
      .toUpperCase();
  $("countdown-form").onsubmit = function (event) {
    event.preventDefault();
    calculateDays();
  };
  var motion = $("motion-toggle");
  var preference = window.matchMedia("(prefers-reduced-motion: reduce)");
  var setMotion = function (off) {
    document.body.classList.toggle("motion-off", off);
    motion.setAttribute("aria-pressed", String(off));
    motion.setAttribute("aria-label", "Disable motion");
    motion.textContent = off ? "Motion off ○" : "Motion on ◉";
  };
  setMotion(preference.matches);
  motion.onclick = function () {
    setMotion(!document.body.classList.contains("motion-off"));
  };
  preference.addEventListener("change", function (event) {
    setMotion(event.matches);
  });
};

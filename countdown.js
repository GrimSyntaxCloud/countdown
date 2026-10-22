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

var calculateDays = function () {
  var event = $("event").value.trim();
  var dt = $("date").value;
  var msg = $("message").firstChild;

  if (event.length == 0 || dt.length == 0) {
    msg.nodeValue = "Please enter both a name and a date";
    return;
  }

  var date = parseEventDate(dt);
  if (!date) {
    msg.nodeValue = "Please enter a real date in MM/DD/YYYY format.";
    return;
  }

  var days = calendarDaysBetween(new Date(), date);

  if (days == 0) {
    msg.nodeValue = "Hooray! Today is ".concat(
      event.toLowerCase(),
      "!\n(",
      date.toDateString(),
      ")",
    );
  }

  if (days < 0) {
    event = event.substring(0, 1).toUpperCase() + event.substring(1);
    msg.nodeValue = event.concat(
      " happened ",
      Math.abs(days),
      " day(s) ago. \n (",
      date.toDateString(),
      ")",
    );
  }

  if (days > 0) {
    msg.nodeValue = days
      .toString()
      .concat(
        " day(s) until ",
        event.toLowerCase(),
        "!\n(",
        date.toDateString(),
        ")",
      );
  }
};

window.onload = function () {
  $("countdown").onclick = calculateDays;
  $("event").focus();
};

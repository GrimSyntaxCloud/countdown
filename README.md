# Event Countdown

A departure-board-inspired calendar countdown for the milestones you look forward to—and the ones you want to remember. Enter a name and date to see the number of days until, or since, your event. Today gets its own celebration state.

[Live demo](https://grimsyntaxcloud.github.io/countdown/) · [Portfolio](https://grimsyntaxcloud.github.io/)

## What it does

- Accepts an event name and a real date in **MM/DD/YYYY** format, including leap days.
- Displays future, past, and same-day results on an amber split-flap board, with an accessible text announcement.
- Counts **calendar days**, not 24-hour periods, so daylight-saving changes do not produce an off-by-one result.
- Supports keyboard submission, inline validation, narrow screens, reduced-motion preferences, and an explicit motion toggle. The short flap animation only runs when you submit a valid date.

Entries remain in the current browser tab. Nothing is stored, synced, or sent to a server, and reloading clears the board. The displayed result is calculated when the form is submitted; it does not tick or automatically refresh at midnight.

## How it works

`index.html` supplies the semantic form and board, `styles.css` provides the responsive layout and native CSS motion, and `countdown.js` validates the date and updates both the visual and screen-reader results. Calendar components are parsed explicitly instead of relying on inconsistent browser text-date parsing. The difference uses UTC calendar ordinals derived from local calendar dates.

This is a static site with no application dependencies, accounts, API keys, backend services, remote fonts, or paid libraries. All visuals are HTML and CSS.

## Run locally

Use Python 3 to serve this directory:

```sh
python3 -m http.server 8080 --bind 127.0.0.1
```

Open http://127.0.0.1:8080/. No package installation is required.

## Verify changes

With Node.js 22 or newer:

```sh
TZ=America/New_York node --test test/*.test.mjs
```

The tests cover impossible dates, leap days, early years, daylight-saving boundaries, and future/past/today descriptions. They do not replace browser checks of form submission, keyboard focus, motion settings, and responsive layout.

GitHub Actions runs the tests on pushes and pull requests. Dependabot checks Actions weekly; there is no application dependency manifest to scan. GitHub Pages publishes the repository root on `master` for free.

## Learning provenance

This began as a JavaScript coursework exercise by Andres Macias. The calendar-day calculation and event workflow remain the foundation. Andres directed the October 2026 redesign in collaboration with an AI coding assistant: a distinct split-flap layout, amber-and-ink palette, restrained motion, accessible interaction, and regression tests. This is a learning and portfolio project, not a reminder or scheduling service.

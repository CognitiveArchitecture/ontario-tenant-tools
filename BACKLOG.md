# Backlog

Pipeline and feature work not yet scheduled.

---

## Pipeline

### SW-001: Service worker update prompt

**Priority:** High
**Context:** 2026-02-04 content audit

The PWA uses `vite-plugin-pwa` with `registerType: 'autoUpdate'` and the service worker calls `skipWaiting()` + `clientsClaim()`. This activates the new service worker immediately, but the page continues serving from the old precache until the user manually reloads. There is no visible signal that new content is available.

**Impact:** After any deploy, returning users see stale content (old resource links, missing sections) until they hard-refresh or clear site data. For a civic tool serving legal resource links, stale content is a correctness issue, not just a UX annoyance.

**Fix:** Switch to a prompt-based update flow:

1. Change `registerType` from `'autoUpdate'` to `'prompt'` in `vite.config.ts`
2. Add an update banner component that listens for the `onNeedRefresh` callback
3. When a new SW is waiting, show a non-intrusive banner: "Updated content available" with a refresh action
4. On user action, call `updateServiceWorker()` to activate the new SW and reload

**References:**

- [vite-plugin-pwa prompt mode](https://vite-pwa-org.netlify.app/guide/prompt-for-update.html)
- Discovered during post-merge audit of `feature/pipeline-infrastructure`

---

## Features

_Empty._

---

## Bugs

_Empty._

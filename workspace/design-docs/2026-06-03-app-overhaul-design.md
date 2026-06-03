# Design Doc: er-map Modernization & Overhaul

- **Date:** 2026-06-03
- **Author:** zphillips (fork-only planning doc — not for upstream)
- **Status:** Draft for review
- **Scope:** `er/` app (the React/Mapbox map UI)

---

## A. Current State (Audit)

### A.1 Stack & versions

| Concern | Current | Latest | Gap |
| --- | --- | --- | --- |
| react / react-dom | 16 | 19.2 | 3 majors |
| Build toolchain | Neutrino 9 / webpack 4 | Vite 8 | full replacement |
| Map library | mapbox-gl 2.1.1 (proprietary, billed) | maplibre-gl 5.24 (BSD-3, free) | swap |
| Language | JS/JSX, `prop-types` (disabled everywhere) | TypeScript 5 | new |
| Tests | none | Vitest + RTL + Playwright | new |
| Node (CI) | 14 (EOL) | 22 LTS | blocks Vite 8 |
| Analytics | `react-ga` Universal Analytics (`UA-…`) | — | **dead since Jul 2023** |
| Error tracking | none | Sentry | new |

App size: ~1,240 LOC, 9 JSX + 2 CSS files. Small enough that a disciplined overhaul is low-risk.

### A.2 Architecture problems

1. **`src/App.jsx` is a 411-line god-component** — config load, map init, GA, data fetch, icon
   drawing, track drawing, event binding, hotkeys, popups, and legend wiring all in one place.
2. **Global mutable state instead of React** — `window.GlobalMap`, module-level `let config`,
   `keymap`. This is the primary reason the code is hard to test.
3. **Direct DOM manipulation inside React** — `document.getElementById().classList.toggle()` in
   `Animal.jsx` and `HelpButton.jsx`; duplicate/invalid reused `id` attributes.
4. **No types** — API responses (subjects, tracks, positions), the config schema, and map
   layer specs are all untyped.
5. **Hardcoding** — Mapbox token (`index.jsx:15`), GA id (`App.jsx:79`), map style URL, color
   palettes (`App.jsx:19–22`), and magic numbers (icon sizes, zoom stops, default coords).
6. **Security smells** — `dangerouslySetInnerHTML` renders `detail_description` HTML from
   config (`Legend.jsx:76`); Mapbox token committed to source (public — rotate regardless).

> Full per-file inventory in **Appendix H.1**.

### A.3 Deploy pipeline (as-is)

```
push to develop → CircleCI (Node 14) → webpack build
   → aws-s3 copy er/build  → s3://ermap-sandbox.pamdas.org
   → aws-s3 copy er/public → s3://ermap-sandbox.pamdas.org/public
   → CloudFront invalidate /index.html
```

Failure characteristics:
- **No test gate** — a broken build ships straight to the live bucket.
- **No versioned releases** — `aws-s3 copy` overwrites in place; rollback = manually rebuild an
  old commit and re-sync. No instant revert.
- Only `develop` deploys; no preview deploys for PRs.

### A.4 Observability (as-is): none

- No error tracking → user-facing JS crashes are invisible.
- No uptime/synthetic checks, no CloudWatch alarms, no dashboards.
- Analytics is dead (Universal Analytics, sunset 2023-07-01).

---

## B. Target State

- **Runtime:** React 19, Vite 8, Node 22, TypeScript 5 (strict). **npm** (drop yarn).
- **Map:** MapLibre GL v5 (BSD-3, no token/billing). Style sourced explicitly (see Decision G.1).
- **Architecture:** no globals; map instance + config provided via React context; typed API
  layer; god-component split into feature modules (see B.1).
- **Styling:** Tailwind + design tokens; reusable UI + map primitives; config-driven theming.
- **Tests:** Playwright e2e regression net (survives refactors) + Vitest/RTL table-driven unit
  tests written against new typed units.
- **Observability:** Sentry (errors, performance, Web Vitals, release health) wired to source maps.
- **Deploy:** test-gated, versioned artifacts, one-command rollback, post-deploy smoke test.

### B.1 Target module layout

```
er/
  e2e/                      # Playwright e2e (separate runner, real browser)
    journeys.spec.ts
    fixtures/               # mocked config + ER API responses
  src/
    main.tsx                # entry (was index.jsx)
    App.tsx                 # composition root only
    config/
      schema.ts             # typed Config + runtime validation (zod)
      ConfigProvider.tsx    # replaces module-level `let config`
    map/
      MapProvider.tsx       # owns the MapLibre instance (replaces window.GlobalMap)
      MapProvider.test.tsx  # unit tests co-located next to source
      useMap.ts
      layers.ts             # typed addSubjectLayer / addTrackLayer
      icons.ts              # imgElFromSrc + sizing (pure, unit-tested)
      icons.test.ts
    api/
      client.ts             # fetch wrapper
      subjects.ts / tracks.ts # typed fetchers
      types.ts              # Subject, Track, Position
    features/
      legend/               # Legend, Animal (+ *.test.tsx beside each)
      popup/                # Popup, SubjectPopupContent, format.ts (+ format.test.ts)
      tips/                 # HelpButton
      controls/             # TrackButton, LocButton, reset/hotkeys
    components/ui/          # primitives (Button, IconButton, Panel…) — Pass 3
    theme/                  # tokens + Tailwind bridge — Pass 3
    hooks/                  # useSubjects, useTracks, useHotkeys
```

**Test layout convention:** Playwright e2e lives in top-level `er/e2e/` (its own runner). Vitest
unit tests are **co-located** next to source as `<name>.test.ts(x)` — tests sit beside the code
they cover.

---

## C. Safety Model (how we avoid breaking prod)

1. **Regression net first.** Playwright journeys are written against the *current* app before any
   upgrade, capturing real behavior. Because they assert through the UI, they survive the rewrite.
2. **App boots after every PR.** Strangler migration: Vite + TS run alongside existing JS
   (`allowJs: true`); we migrate one unit at a time. Never a "broken in between" state.
3. **Small, reviewable PRs.** Each step below is its own PR, verified green against the net.
4. **Every change tested against the net.** The e2e suite runs in CI and gates deploy from Pass 1.5 on.

---

## D. Incremental Plan

### Pass 1 — Foundation up to snuff
Goal: latest runtime + map + a regression net + visibility + safe deploy, so later refactors are fast and safe.

| PR | Title | What | Exit check |
| --- | --- | --- | --- |
| 1.1 | Regression net | Playwright + journeys (D.1) against current app; network mocked via route interception | Suite green on current `develop` |
| 1.2 | Vite + TS tooling | Add Vite 8, `tsconfig` (`allowJs`), Vitest, RTL, ESLint/Prettier; **switch yarn → npm** (`yarn.lock` → `package-lock.json`); app still JS, runs on Vite; remove `react-hot-loader` (→ Fast Refresh); **remove the OpenSSL-legacy workaround from `er/playwright.config.ts`** (grep `REMOVE-AFTER-VITE`) | App boots on Vite; net green; no `--openssl-legacy-provider` remains |
| 1.3 | React 19 upgrade | 16 → 19 (`createRoot`, etc.); fix deprecations | Net green |
| 1.4 | MapLibre swap | mapbox-gl → maplibre-gl 5; replace token/style with config-driven style (Decision G.1) | Net green; map renders |
| 1.5 | Observability | Add Sentry (errors + Web Vitals + source maps); remove dead `react-ga`/UA | Test crash visible in Sentry |
| 1.6 | Deploy safety | Node 14 → 22; gate deploy on unit+e2e; versioned S3 releases + rollback script; post-deploy smoke (E) | Rollback drill succeeds |

> 1.3 and 1.4 are separate PRs on purpose — never upgrade React *and* swap the map in one diff;
> if the net goes red you want to know which one did it.

### Pass 2 — Typed refactor (strangler)
Split the god-component into the B.1 modules, one PR per unit. For each unit:
1. Extract it from `App.jsx` into its own file.
2. Convert to TypeScript; type its props + the data it touches.
3. Write **table-driven** Vitest/RTL tests (style locked — see Appendix H.2).
4. Keep e2e net green.

Suggested order (low-risk → high): `api/types` + fetchers → `config` (schema + provider) →
`map` (provider/layers/icons) → `features/controls` → `features/popup` → `features/legend` →
`features/tips` → delete globals (`window.GlobalMap`, `let config`) and `prop-types`.

Pure functions to extract early (cheap, high-value table tests): species/sex/date formatting
(`SubjectPopupContent.jsx`), `imgElFromSrc` aspect-ratio math (`App.jsx`), color-palette
assignment, name truncation (`Animal.jsx`).

### Pass 3 — Theming & primitives
1. Add Tailwind + design tokens (`tailwind.config` colors/space/radius/font).
2. Bridge tokens → CSS variables so **`config.json` can override theme per deployment**.
3. Replace ID-selector CSS + inline-style objects with Tailwind utilities + primitives.
4. Build reusable **UI primitives** (`Button`, `IconButton`, `Panel`, `Badge`/color-dot, `Image`)
   and **map primitives** (typed source/layer builders, subject marker, track line).
5. De-hardcode remaining values into the typed config (default center/zoom, palettes, style,
   icon sizes), with sane defaults.
6. Sanitize config HTML (`detail_description`) with DOMPurify before `dangerouslySetInnerHTML`.

---

## E. Deploy Pipeline Deep-Dive (detect / mitigate / rollback)

### E.1 Detect
- **Sentry** (Pass 1.5): JS errors with source-mapped stacks, release health, Web Vitals; alert
  to email/Slack on error-rate spikes after a release.
- **Post-deploy smoke test** (Pass 1.6): run a tiny Playwright check against the *live* URL right
  after deploy; non-zero exit = deploy considered failed.
- **(Later, optional)** CloudWatch alarms on CloudFront 4xx/5xx; synthetic uptime ping (Checkly
  or a CircleCI cron job) for "site is down" coverage Sentry can't see.

### E.2 Mitigate / rollback
- **Gate deploy on green CI** — unit + e2e must pass before the S3 sync job runs. Red never ships.
- **Versioned releases** — upload each build to `s3://…/releases/<git-sha>/` instead of
  overwriting root. Promote by copying the chosen release to the served path (or flip a
  CloudFront origin-path / pointer).
- **One-command rollback** — `rollback.sh <sha>` re-promotes a previous release + invalidates
  CloudFront. Document and **drill it** as the exit check for PR 1.6.
- **(Stretch)** Auto-rollback: if the post-deploy smoke test fails, re-promote last-known-good.
- **(Stretch)** PR preview deploys to `s3://…/preview/<branch>/` for review before merge.

### E.3 Pipeline changes summary
- Bump CircleCI image Node 14 → 22; switch `yarn` commands to `npm ci` / `npm run`.
- `npm run build` now Vite (output `dist/`, not `build/`); update S3 source paths.
- Add `test` job (Vitest + Playwright) as a required upstream of the deploy job.
- Add release-versioning + smoke-test steps.

---

## F. Risks & Mitigations

| Risk | Mitigation |
| --- | --- |
| WebGL map in headless CI | MapLibre needs no token and runs in Playwright's Chromium (software WebGL). Mock only the ER API/config; assert on DOM (legend, popups, tips), not the WebGL canvas. (Choosing MapLibre makes this *easier* than Mapbox.) |
| Big upgrade breaks behavior | Net first (1.1); React and map upgrades in separate PRs (1.3 vs 1.4); each verified green. |
| Strangler JS/TS interop | `allowJs: true`; migrate leaf-first; keep `prop-types` until a unit is typed, then drop. |
| XSS via `detail_description` | DOMPurify sanitize in Pass 3 (or pull earlier if config source is untrusted). |
| Committed Mapbox token | MapLibre swap removes the need; rotate/disable the old token regardless. |
| MapLibre style sourcing | Decision G.1 — pick a style before PR 1.4. |

---

## G. Open Decisions (for review)

- **G.1 — MapLibre style source.** MapLibre needs a style JSON. Options: (a) keep using Mapbox-hosted
  styles with a token (defeats the cost goal), (b) a free hosted vector-tile provider
  (MapTiler/Stadia — free tier, API key), (c) self-host tiles + an open style. *Recommend (b) for
  Pass 1, revisit (c) later.* **Needs your pick before PR 1.4.**
- **G.2 — Sentry hosting.** Sentry SaaS (fastest) vs self-hosted. *Recommend SaaS.*
- **G.3 — Synthetic monitoring (E.1).** In Pass 1 or deferred? *Recommend defer; Sentry + smoke first.*
- **G.4 — Preview deploys (E.2).** In scope now or later? *Recommend later (stretch).*

---

## H. Appendix

### H.1 Per-file issue inventory
- `index.jsx` — hardcoded Mapbox token (L15); legacy `ReactDOM.render`.
- `App.jsx` — god-component; `window.GlobalMap`; `let config`; GA UA id (L79); `.map()` for side
  effects (L112); palettes (L19–22); magic numbers; `var` usage; stale-closure click handlers.
- `Legend.jsx` — `dangerouslySetInnerHTML` (L76); duplicated header markup; `prop-types` disabled.
- `Animal.jsx` — `document.getElementById` + `classList.toggle`; duplicate `id` attrs.
- `HelpButton.jsx` — DOM toggling; six inline-style objects.
- `SubjectPopupContent.jsx` — untyped string formatting (extract → table tests).
- `Popup.jsx` — `ReactDOM.render` into detached node (update for React 19 `createRoot`).
- `App.css` / `Legend.css` — ID selectors, hardcoded hex, duplicate `#legend`, Google-font import.

### H.2 Table-test style (locked example, Vitest)
```ts
import { describe, it, expect } from 'vitest';
import { formatSpecies } from '../features/popup/format';

describe('formatSpecies', () => {
  const cases: Array<{ name: string; common: string | null; subtype: string; want: string }> = [
    { name: 'common name wins',      common: 'masai_giraffe', subtype: 'giraffe', want: 'Masai Giraffe' },
    { name: 'falls back to subtype', common: null,            subtype: 'giraffe', want: 'Giraffe' },
    { name: 'underscores → spaces',  common: 'southern_giraffe', subtype: 'x',    want: 'Southern Giraffe' },
  ];
  it.each(cases)('$name', ({ common, subtype, want }) => {
    expect(formatSpecies(common, subtype)).toBe(want);
  });
});
```

### H.3 Playwright journeys (regression net, PR 1.1)
1. App loads → map container + legend toggle render.
2. Open legend → subject list appears (mocked API).
3. Click a subject name → story panel opens.
4. Toggle track button → track state flips.
5. Location button → map recenters (assert flyTo/state, not pixels).
6. Help tips open and close.
7. Reset hotkey (Alt+R) recenters.
All network (config.json + ER `/subjects`, `/tracks`) mocked via Playwright route interception with fixtures.
```

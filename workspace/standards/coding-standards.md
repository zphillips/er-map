# Coding Standards (living doc)

- **Status:** Living — evolves as the repo evolves. Last updated 2026-06-03.
- **Audience:** Claude (and humans) making code changes in this fork.
- **Scope:** the `er/` app. Fork-only; never sent upstream.

> CLAUDE.md points here. Read this before making a code change. Propose additions whenever a
> recurring preference emerges — that's what "living" means.

## How this applies during the overhaul

The repo is mid-migration (legacy JS + new TS coexist via the strangler plan). These standards
apply to **new and modified code**. Do **not** force-migrate untouched legacy files — only bring
a file up to standard when you're already changing it for another reason.

---

## Principles

Higher-level beliefs that guide every change. **Living — add yours over time.**

- **Everything is typed. No `any`.** Types are not optional. Use `unknown` + narrowing when a
  type is genuinely unknown. Enforced in lint (see §2) — `any` is an error, not a warning.
- **DRY — Don't Repeat Yourself.** Factor duplicated logic, markup, constants, and types into a
  single source of truth. Duplication is a bug waiting to diverge.
- **Single source of truth.** Config, design tokens, and types each live in exactly one place;
  derive from them, don't copy.
- **YAGNI.** Build what the current change needs — no speculative abstraction.
- **Fail loud.** Errors surface (thrown / reported to Sentry), never silently swallowed (§8).
- **Boy-scout rule.** Leave a file cleaner than you found it *when you're already in it* — but
  don't go migrate untouched legacy just to migrate it.

---

## 1. How to make a code change (the format)

1. **Plan-first for non-trivial changes.** For anything beyond a trivial edit, summarize the
   approach and get a thumbs-up **before** writing code. Trivial (typo, one-liner, obvious fix) =
   just do it.
2. **Tests ship with every behavioral change.** A behavior change includes a **table-driven**
   test (see §7). No test = not done. Pure logic gets a Vitest table; UI behavior gets RTL or a
   Playwright journey.
3. **Small atomic commits, conventional messages.** One logical change per commit/PR. Messages:
   `feat:`, `fix:`, `refactor:`, `test:`, `chore:`, `docs:`. Keep PRs incremental (see the
   `opening-upstream-prs` skill).
4. **Post-change diff summary + rationale.** After editing, give a tight summary of *what*
   changed and *why*, so review is fast without reading the whole diff.

---

## 2. Language & types

- **TypeScript, strict.** No implicit `any`; avoid explicit `any` (use `unknown` + narrowing).
  Enforced in lint config (PR 1.2): `tsconfig` `"strict": true` + `"noImplicitAny": true`, and
  `@typescript-eslint/no-explicit-any: "error"`. Don't disable these rules to silence a type —
  fix the type.
- Type external data at the boundary: API responses, the config schema, MapLibre layer specs.
- Prefer `type` aliases for data shapes; `interface` for extendable contracts.
- No new `.jsx`/`.js` files — new code is `.tsx`/`.ts`.

## 3. Components & React

- **Function components + hooks only.** No class components.
- One component per file; file name = component name (`PascalCase.tsx`).
- Keep components focused; extract logic into hooks (`useSubjects`, `useHotkeys`) and pure helpers.
- No direct DOM access (`document.getElementById`, `classList.toggle`) — use state/refs.
- Lists need stable `key`s; never reuse `id` attributes across elements.

## 4. State

- **No global mutable state.** No `window.*` singletons, no module-level mutable `let`.
- Shared state via React context/providers (config, map instance) or hooks.
- Updates are immutable (no in-place mutation of state objects/arrays).

## 5. Styling

- **Tailwind + design tokens.** No new inline-style objects; no ID-selector CSS.
- Theme values come from tokens (CSS variables bridged to Tailwind), overridable via config.
- No hardcoded colors/spacing/sizes in components — reference tokens.

## 6. Naming & structure

- Components `PascalCase`; hooks `useX`; utilities/vars `camelCase`; constants `UPPER_SNAKE`.
- Follow the target module layout (see the overhaul design doc, §B.1).
- Import order: external → internal modules → relative → styles.

## 7. Testing

- **Table-driven** unit tests (Vitest + RTL) — one `it.each` table over named cases:
  ```ts
  it.each(cases)('$name', ({ input, want }) => {
    expect(fn(input)).toBe(want);
  });
  ```
- Test behavior and edge cases, not implementation details.
- Core user journeys are covered by Playwright; keep that net green.
- Extract pure functions so they're table-testable.

## 8. Errors & observability

- No silent failures. Don't swallow errors with empty `catch`; log/report meaningfully.
- Report unexpected errors to Sentry; don't `console.error` as the only handling in app code.
- Sanitize any HTML rendered via `dangerouslySetInnerHTML` (DOMPurify).

## 9. Comments & docs

- Match the surrounding code's comment density and idiom.
- Comment the *why*, not the *what*. No dead/commented-out code in commits.
- Document non-obvious config keys and public helpers.

---

## Changelog
- 2026-06-03 — v0.2 add Principles section (typed-everything/no-any, DRY, single source of truth, YAGNI, fail loud, boy-scout); ESLint no-explicit-any enforcement.
- 2026-06-03 — v0.1 initial standards (change-format rules + stack-aligned style).

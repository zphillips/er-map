# PR Playbook (living doc)

How to fill the PR template. The **live form GitHub auto-loads on every PR** is
[`.github/pull_request_template.md`](../../.github/pull_request_template.md) — edit *that* to change
the form; edit *this* to change the guidance. (They're not duplicates: the form is the fields,
this is the how-to.) Last updated 2026-06-03.

## Why the form lives in `.github/`

GitHub injects `.github/pull_request_template.md` into the description box server-side on every
new PR — reliable, no query params, no length limit. (URL `?body=` prefill is unreliable and was
abandoned.) It auto-applies to PRs whose **base** is this repo, i.e. **fork-internal PRs**. PRs to
PADAS use PADAS's template (none), so the PR skill fills the form there instead.

## Filling rules — keep it sharp, not cumbersome

- **Scale to the change.** Trivial PR → one line per core section. Risky PR → full detail.
- Fill every section, but scale it: a trivial PR gets one line each; a risky one expands. If a
  section truly doesn't apply, write `N/A — <reason>` rather than padding.
- Prefer bullets. A reviewer should grasp the PR in ~30 seconds.
- Always answerable: **what changed**, **how we know it's safe**, **how we'd detect breakage**,
  **how we roll back / mitigate**.

## Change type
🆕 net-new behavior (`feat`) · 🔄 behavior change (`feat`/`fix`) · ♻️ same behavior (`refactor`/`docs`/`test`/`chore`)

## Risk severity — blast radius IF THIS GOES WRONG (not change size)

- **S1 Critical:** outage / data-loss / security breach; ~all users
- **S2 High:** core feature broken; many users; no workaround
- **S3 Moderate:** degraded; workaround exists; few users
- **S4 Low:** cosmetic / internal / no user impact

## Section order & guidance

Order: **Change type / Severity (table) → Summary → Decisions & alternatives → Links → Tests →
Incident detection → Incident impact analysis → Rollback & mitigation.**

- **Summary:** one line — what changed and why.
- **Decisions & alternatives:** the approach, what you rejected and why, trade-offs.
- **Tests:** check every type used; if **None**, a justification is required.
- **Incident detection:** name the concrete signal (alert / Sentry / log / dashboard) — or admit the gap.
- **Incident impact analysis:** can current observability measure the blast radius?
- **Rollback & mitigation:** is a plain revert safe; how we fix it fast if not.

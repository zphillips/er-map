# PR Template (living doc)

Single source of truth for PR descriptions. The PR skills fill this; refine it over time.
Last updated 2026-06-03.

## Filling rules — keep it sharp, not cumbersome

- **Scale to the change.** Trivial PR → one line per core section. Risky PR → full detail.
- **Core sections are always filled.** Conditional sections: include only when relevant;
  otherwise write `N/A — <reason>` or omit. Don't pad.
- Prefer bullets over prose. A reviewer should grasp the PR in ~30 seconds.
- The four questions that must always be answerable: **what changed**, **how we know it's
  safe**, **how we'd detect breakage**, **how we roll back / mitigate**.

---

## Title
`<type>: <concise summary>`  — `<type>` matches the change type below (conventional commit).

## Core (always)

**Change type** *(one)*: 🆕 net-new behavior · 🔄 behavior change · ♻️ same behavior (refactor/docs/test/chore)
**Risk severity** *(blast radius if this goes wrong, one)*: **S1** critical (outage/data-loss/security, ~all users) · **S2** high (core feature broken, many users, no workaround) · **S3** moderate (degraded, workaround exists, few users) · **S4** low (cosmetic/internal/no user impact)

### Summary
<what changed and why — 1–3 sentences>

### Tests — how do we know it's safe?
Used *(check all)*: ☐ unit ☐ integration ☐ contract ☐ synthetic/e2e ☐ manual ☐ **none**
- **If `none`:** <why that's acceptable — required>
- **Manual steps** *(if manual checked)*: <exact replayable steps>

### Detection — if this breaks in prod, how will we know?
<the alert / Sentry issue / log / dashboard that fires — or `gap: no signal` if true>

### Rollback & mitigation — if it goes wrong, how do we fix it fast?
- Safe to plain-revert? <yes/no + why>
- Rollout: direct / phased / behind a flag
- If revert isn't enough: <mitigation steps>

### Links
- Design doc / two-pager: <link — typically the fork's `workspace/design-docs/…`>
- Issues / related PRs / dashboards: <links or N/A>

## Decisions & alternatives  *(non-trivial / architectural changes; else `N/A`)*
- Approach chosen & why:
- Alternatives considered & why rejected:
- Trade-offs accepted:
- What could go wrong:

## Impact analysis  *(S1–S2 or user-facing; else `N/A`)*
- Can we measure blast radius with current observability? <what we can see / gaps>

## Conditional  *(include only if relevant)*
- **Breaking changes / backward-compat:** <consumers affected + migration path | N/A>
- **Security & privacy:** <secrets / authz / PII / new attack surface | N/A>
- **Migrations:** <schema or data change + reversible? | N/A>

## Self-review checklist
- [ ] Lint + tests green
- [ ] Docs updated (if behavior changed)
- [ ] No debug / dead / commented-out code
- [ ] Conventional-commit title
- [ ] No personal/workspace files in the diff (upstream PRs)

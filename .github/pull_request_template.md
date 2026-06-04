<!--
PR template — GitHub auto-loads this on every PR into this repo. Scale to the change:
core sections (Change type → Links) are ALWAYS filled; conditional sections get "N/A — <reason>"
or get deleted when irrelevant. A trivial PR is short; a risky one expands. Prefer bullets — a
reviewer should get it in ~30s. Severity = blast radius IF THIS GOES WRONG, not change size.
Filling guidance + severity definitions: workspace/standards/pr-template.md
-->

**Change type** *(pick one)*: 🆕 net-new behavior · 🔄 behavior change · ♻️ same behavior (refactor/docs/test/chore)
**Risk severity** *(pick one)*: S1 critical · S2 high · S3 moderate · S4 low

## Summary
<what changed and why — 1–3 sentences>

## Tests — how do we know it's safe? *(check all used)*
- [ ] Unit
- [ ] Integration
- [ ] Contract
- [ ] Synthetic / e2e
- [ ] Manual
- [ ] None — <required: why that's acceptable>

<!-- Manual steps (if Manual checked): exact replayable steps -->

## Incident detection — if this breaks in prod, how will we know?
<the alert / Sentry issue / log / dashboard that fires — or "gap: no signal">

## Rollback & mitigation — if it goes wrong, how do we fix it fast?
- Safe to plain-revert? <yes/no + why>
- Rollout: direct / phased / behind a flag
- If revert isn't enough: <mitigation>

## Links
- Design doc / two-pager: <link — usually a workspace/design-docs/… doc>
- Issues / related PRs: <links or N/A>

## Decisions & alternatives <!-- non-trivial / architectural; else delete -->
- Approach & why:
- Alternatives considered & why rejected:
- Trade-offs:
- What could go wrong:

## Incident impact analysis <!-- S1–S2 or user-facing; else delete -->
- If this causes an incident, can we measure blast radius with current observability? <what we can see / gaps>

## Conditional <!-- delete any that don't apply -->
- Breaking changes / backward-compat: <consumers + migration path | N/A>
- Security & privacy: <secrets / authz / PII / new attack surface | N/A>
- Migrations: <schema / data + reversible? | N/A>

## Self-review checklist
- [ ] Lint + tests green
- [ ] Docs updated (if behavior changed)
- [ ] No debug / dead code
- [ ] Conventional-commit title
- [ ] No personal/workspace files in the diff (upstream PRs)

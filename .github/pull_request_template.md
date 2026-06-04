<!--
PR template — GitHub auto-loads this on every PR into this repo. Scale to the change:
a trivial PR stays short; a risky one expands. Prefer bullets — a reviewer should get it in ~30s.
Severity = blast radius IF THIS GOES WRONG, not change size.
Filling guidance + severity definitions: workspace/standards/pr-template.md
-->

| Field | Value |
| --- | --- |
| **Change type** | 🆕 net-new behavior · 🔄 behavior change · ♻️ same behavior (refactor/docs/test/chore) |
| **Risk severity** | S1 critical · S2 high · S3 moderate · S4 low |

## Summary
<what changed and why — one line>

## Decisions & alternatives
- Approach & why:
- Alternatives considered & why rejected:
- Trade-offs / what could go wrong:

## Links
- Design doc / two-pager: <link — usually a workspace/design-docs/… doc>
- Issues / related PRs: <links or N/A>

## Tests — how do we know it's safe? *(check all used)*
- [ ] Unit
- [ ] Integration
- [ ] Contract
- [ ] Synthetic / e2e
- [ ] Manual
- [ ] None — <required: why that's acceptable>

## Incident detection — if this breaks in prod, how will we know?
<the alert / Sentry issue / log / dashboard that fires — or "gap: no signal">

## Incident impact analysis — can we measure the blast radius?
<what current observability lets us see / the gaps>

## Rollback & mitigation — if it goes wrong, how do we fix it fast?
- Safe to plain-revert? <yes/no + why>
- Rollout: direct / phased / behind a flag
- If revert isn't enough: <mitigation>

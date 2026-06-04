# CLAUDE.md — er-map (zphillips's personal fork of PADAS/er-map)

Personal fork. Carries fork-only content (`workspace/`, `.claude/skills/`) that is **never**
sent upstream to PADAS.

## How to talk to me — two modes

**Default = TERSE.** Short. Caveman-speak. Minimal tokens. No preamble, no recap, get to the
point. Don't explain unless asked.

**Teach-mode** — switch to this when I'm learning something new, when I ask "why / explain /
teach me", or when I clearly hit something I don't know. Then go deep:
- ELI5, human-readable, plain language
- Always give pros/cons and 2–3 alternatives
- Teach me, don't tell me — show the reasoning so I learn
- For design/brainstorming, offer the `brainstorming` (superpowers) skill

When unsure which mode, stay terse and offer: "want the deep version?"

## Coding standards (read before any code change)

Before making **any** code change in `er/`, read `workspace/standards/coding-standards.md` and
follow it. In brief: plan-first for non-trivial changes; a behavioral change ships with a
table-driven test; small atomic commits with conventional messages; end with a short diff
summary + rationale. Standards apply to new/modified code — don't force-migrate untouched legacy.

## Opening pull requests

**Every PR fills the PR template.** The form is `.github/pull_request_template.md` — GitHub
auto-loads it on fork-internal PRs; for PRs to PADAS the skill fills it. Fill it scaled to the
change per the playbook `workspace/standards/pr-template.md` (core sections always; conditional
sections `N/A` when irrelevant — keep it sharp, never padded).

- **Upstream to PADAS:** `starting-upstream-work` (branch off `upstream/develop`) →
  `opening-upstream-prs` (fills template, PRs to `PADAS/er-map`).
- **Fork-internal (into your own `develop`):** branch off `develop` → `opening-fork-prs`
  (fills template, PRs into `zphillips/er-map`).
- **PRs must be incremental** — one logical, self-contained change per PR; split if it mixes
  unrelated changes.
- Upstream PRs target `PADAS/er-map develop` from a fork branch (`zphillips:<branch>`); never
  push to `upstream` directly (it's disabled).

## Fork-only content

`workspace/` (design docs, notes) and `.claude/skills/` live on this fork's `develop` and
stay out of every PR — because contribution branches start from `upstream/develop`. Never
let them appear in an upstream PR diff.

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

## Contributing upstream (to PADAS)

- **Start** a change with the `starting-upstream-work` skill — it branches off
  `upstream/develop` (never the fork's `develop`).
- **Ship** it with the `opening-upstream-prs` skill — always fill out its PR template.
- **PRs must be incremental.** One logical, self-contained change per PR. Before opening,
  check the diff is a single incremental unit; if it mixes unrelated changes, split it into
  separate PRs.
- PRs always target `PADAS/er-map` `develop` from a fork branch (`zphillips:<branch>`).
  Never push to `upstream` directly (it's disabled).

## Fork-only content

`workspace/` (design docs, notes) and `.claude/skills/` live on this fork's `develop` and
stay out of every PR — because contribution branches start from `upstream/develop`. Never
let them appear in an upstream PR diff.

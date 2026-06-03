# workspace/

Shared working space for this fork of [`PADAS/er-map`](https://github.com/PADAS/er-map):
onboarding context, design docs, and notes. Everyone using this fork can read and
use it — **but none of it is ever sent upstream to PADAS.** (That isolation is enforced by
how contribution branches are made, not by hiding files.)

## What lives where

| Path             | Purpose                                                        |
| ---------------- | ------------------------------------------------------------- |
| `design-docs/`   | Design write-ups for changes being planned                    |
| `notes/`         | Running notes, TODOs, ideas                                   |
| `../.claude/skills/` | Custom Claude skills (must live there so Claude Code loads them) |

## Custom skills (in `.claude/skills/`)

- **`starting-upstream-work`** — start a change for PADAS on a clean branch
- **`opening-upstream-prs`** — push the branch and open the PR to PADAS

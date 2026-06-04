---
name: opening-fork-prs
description: Opens a pull request from the current feature branch into the user's OWN fork (zphillips/er-map develop) — fork-internal review, not upstream to PADAS. Use when the user says things like "open a PR in my fork", "PR this into my develop", "fork-internal PR", or is shipping overhaul/personal work that is not going to PADAS. Fills the canonical PR template. For PRs to PADAS instead, use opening-upstream-prs.
---

# Opening Fork-Internal PRs

**Use this when:** opening a PR into your own fork's `develop` (e.g. the overhaul passes).
**Not this when:** the change is going to `PADAS/er-map` — use `opening-upstream-prs`.

Fork-internal PRs may contain personal files (`workspace/`, `.claude/`) — that's fine, they
stay in the fork.

## Preconditions

1. **`gh` authenticated.** Run `gh auth status`; if logged out, tell the user to run `! gh auth login` and stop.
2. **Not on `develop`.** Run `git branch --show-current`; if it's `develop`, refuse — there's no feature branch to PR.
3. **Tree is clean.** Run `git status --porcelain`; if dirty, help the user commit first.

## Steps

1. **Push the branch to the fork:**
   ```bash
   git push -u origin <current-branch>
   ```

2. **Inspect the change** vs the fork's `develop`:
   ```bash
   git log develop..HEAD --oneline
   git diff develop...HEAD --stat
   ```

3. **Verify the change is incremental** — one logical, self-contained change. If it spans
   unrelated changes, suggest splitting into separate PRs.

4. **Fill the canonical PR template** at `workspace/standards/pr-template.md`, **scaled to the
   change** per its filling rules (core always; conditional sections `N/A` when irrelevant).
   Infer from the diff; ask the user only for what you can't.

5. **Open the PR into the fork:**
   ```bash
   gh pr create --repo zphillips/er-map --base develop \
     --head <current-branch> \
     --title "<type>: <concise title>" --body "<filled template>"
   ```

6. **Report the PR URL** that `gh` returns.

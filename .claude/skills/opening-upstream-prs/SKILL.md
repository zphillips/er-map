---
name: opening-upstream-prs
description: Pushes the current feature branch to the user's fork (origin) and opens a pull request to upstream PADAS/er-map with a filled-out description template. Use at the END of an upstream contribution, when the user says things like "make a PR", "open the PR", "send this to PADAS", or "ship this upstream". This is the SECOND of two paired skills; the companion skill starting-upstream-work creates the branch first.
---

# Opening Upstream PRs

**Use this when:** a change is finished and ready to send to `PADAS/er-map`.
**Not this when:** you're starting a change — use `starting-upstream-work` to create the branch first.

## Preconditions

1. **`gh` authenticated.** Run `gh auth status`; if logged out, tell the user to run `! gh auth login` and stop.
2. **Not on `develop`/`main`.** Run `git branch --show-current`; if it's the default branch, refuse — there's no feature branch to PR. Point them to `starting-upstream-work`.
3. **Tree is clean.** Run `git status --porcelain`; if dirty, help the user commit first.

## Steps

1. **Push to the fork:**
   ```bash
   git push -u origin <current-branch>
   ```

2. **Inspect the change**; ask only for what can't be inferred (issue link, severity):
   ```bash
   git log upstream/develop..HEAD --oneline
   git diff upstream/develop...HEAD --stat
   ```
   If personal files (`workspace/`, `.claude/`) appear in that diff, warn the user — the branch was cut from the wrong base.

3. **Verify the change is incremental.** A PR must be one logical, self-contained change. If the diff spans multiple unrelated changes, stop and suggest splitting into separate PRs.

4. **Fill the canonical PR template.** Read it from the fork's `develop` (it won't be in a clean upstream branch's working tree):
   ```bash
   git show develop:workspace/standards/pr-template.md
   ```
   Fill it **scaled to the change** per its filling rules (core always; conditional sections `N/A` when irrelevant — don't pad). Infer what you can from the diff; ask the user only for what you can't.

5. **Open the PR to upstream:**
   ```bash
   gh pr create --repo PADAS/er-map --base develop \
     --head zphillips:<current-branch> \
     --title "<type>: <concise title>" --body "<filled template>"
   ```

6. **Report the PR URL** that `gh` returns.

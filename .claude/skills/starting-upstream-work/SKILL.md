---
name: starting-upstream-work
description: Creates a clean feature branch off the latest upstream PADAS/er-map code, for a change the user intends to contribute back. Use at the START of any upstream contribution, when the user says things like "start a fix", "I want to contribute X to PADAS", "begin an upstream change", or "new PR for upstream". This is the FIRST of two paired skills; the companion skill opening-upstream-prs ships the finished work.
---

# Starting Upstream Work

**Use this when:** beginning a change destined for `PADAS/er-map`.
**Not this when:** the change is finished and ready to send — use `opening-upstream-prs` instead.

This skill only sets up the branch. It does not edit code.

## Why the branch base matters

A PR's diff is "your branch vs. upstream's base." This fork carries personal content (`workspace/`, `.claude/skills/`) on its `develop`. Branching from the fork's `develop` would drag that content into the PR. Branching from `upstream/develop` keeps every PR clean. This skill always does the latter.

## Steps

1. **Get a branch name.** Ask for a short description if missing. Form a kebab-case name: `fix/<desc>` or `feature/<desc>`.

2. **Refuse on a dirty tree.** Run `git status --porcelain`; if non-empty, stop and tell the user to commit or stash first.

3. **Fetch and branch off upstream:**
   ```bash
   git fetch upstream
   git switch -c <branch-name> upstream/develop
   ```
   Always base on `upstream/develop` — never local `develop`.

4. **Confirm** the new branch name, that it tracks the latest PADAS code, and that `opening-upstream-prs` is the skill to run when the change is ready.

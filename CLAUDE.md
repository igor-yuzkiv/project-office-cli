# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## What this is

`project-office-cli` is an **agent-facing** CLI that is intended to become the controlled interface between AI agents and the Project Office / MVP Task Manager web application. The web app stays the human interface; this CLI is the agent interface. Agents are meant to work inside an explicit project scope and reach the application only through its API — never through direct database, filesystem, or internal-structure access.

This is an early local MVP: `src/index.ts` currently does nothing more than a single test request against the backend. Treat the README's "Direction" section (scoped context building, controlled read commands, submitting notes/proposals/feedback) as the roadmap, not as implemented behavior. Keep the implementation simple until the actual workflow is clear.

Non-negotiables when building: agents reach Task Manager only through this CLI (never direct DB/API/internal access); work stays inside one project scope; the CLI renders, the backend stays pure JSON.

## Project rules

Load and follow these project rules:

- @.claude/rules/review-gate.md

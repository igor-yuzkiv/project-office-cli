# Project Office CLI

Agent-facing CLI for controlled interaction with Project Office workflows.

This project is an early local MVP. Its purpose is to explore and define how AI agents should interact with Project Office data and workflows without direct access to the database, filesystem, or internal application structure.

## Purpose

`project-office-cli` is intended to become a small command-line interface between AI agents and the Project Office / MVP Task Manager application.

The web application remains the main interface for humans.
The CLI is intended to become a controlled interface for agents.

## Direction

The CLI should eventually support agent workflows such as:

* reading project/task data through controlled commands;
* building scoped context for a specific project or task;
* submitting notes, proposals, comments or feedback;

## Core Ideas

* Agents should work inside an explicit project scope.
* Agents should not receive unrestricted filesystem or database access.
* The CLI should communicate with the application through the API or another controlled application layer.
* Human-facing UI and agent-facing commands should stay separate.
* The implementation should stay simple until the actual workflow becomes clear.

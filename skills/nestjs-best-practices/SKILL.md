---
name: nestjs-best-practices
description: Applies clean TypeScript and NestJS architecture patterns for modules, controllers, services, DTO validation, MikroORM entities, and test strategy. Use when creating or refactoring NestJS APIs, reviewing backend code quality, or structuring NestJS projects.
license: MIT
metadata:
  author: Lucas Pereira
  tags: nestjs, typescript, clean-code, solid, mikroorm, class-validator, jest
---

# NestJS Best Practices

## Overview

Practical standards for building and refactoring NestJS APIs with clean TypeScript, modular architecture, and strong test coverage.

## When to Apply

Use this skill when:
- Creating a new NestJS module, controller, or service
- Refactoring NestJS code for readability and maintainability
- Defining DTOs, entities, and response types
- Reviewing TypeScript naming, typing, and function design
- Planning NestJS tests (unit, controller, e2e)

## Quick Workflow

1. Define the module boundary and route ownership
2. Model inputs/outputs and persistence contracts
3. Implement controller + service with single responsibilities
4. Add validation, guards/interceptors/filters when needed
5. Test services, controllers, and e2e flow

## Quick Reference

| File | Description |
|------|-------------|
| [ts-clean-code.md][ts-clean-code] | TypeScript naming, typing, function, class, and error-handling rules |
| [nest-module-architecture.md][nest-module-architecture] | Module design, controller/service layering, DTOs, entities, and core/shared modules |
| [nest-testing-playbook.md][nest-testing-playbook] | Unit, controller, and e2e test strategy with Jest and smoke endpoint guidance |

## Problem -> Skill Mapping

| Problem | Start With |
|---------|------------|
| Inconsistent naming and weak typing | [ts-clean-code.md][ts-clean-code] |
| Module structure is unclear | [nest-module-architecture.md][nest-module-architecture] |
| Controllers contain business rules | [nest-module-architecture.md][nest-module-architecture] |
| Missing validation and DTO boundaries | [nest-module-architecture.md][nest-module-architecture] |
| Low confidence in changes | [nest-testing-playbook.md][nest-testing-playbook] |
| Need test pyramid for a new module | [nest-testing-playbook.md][nest-testing-playbook] |

[ts-clean-code]: references/ts-clean-code.md
[nest-module-architecture]: references/nest-module-architecture.md
[nest-testing-playbook]: references/nest-testing-playbook.md

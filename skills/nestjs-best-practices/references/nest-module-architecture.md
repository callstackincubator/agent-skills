---
title: NestJS Module Architecture
tags: nestjs, modules, controllers, services, dto, mikroorm, class-validator
---

# Skill: NestJS Module Architecture

Design NestJS APIs using clear module boundaries, thin controllers, focused services, and explicit input/output models.

## Quick Structure

```text
src/
  modules/
    users/
      users.module.ts
      users.controller.ts
      services/
        users.service.ts
      models/
        create-user.dto.ts
        user-output.type.ts
      entities/
        user.entity.ts
  core/
    filters/
    guards/
    interceptors/
    middlewares/
  shared/
    utils/
    services/
```

## Module-Level Rules

- Keep one main domain/route per module
- Use one primary controller for the route and optional secondary controllers for sub-routes
- Keep controllers transport-focused:
  - parse request data,
  - call services,
  - map output
- Keep business logic and persistence orchestration in services
- Prefer one service per entity aggregate

## Models and Persistence

- Use `models/` for public module contracts
- Validate input DTOs with `class-validator`
- Prefer simple explicit output types for responses
- Use MikroORM entities for persistence mapping
- Keep entity invariants inside entity/factory logic, not in controllers

## Core and Shared Modules

- **Core module** (cross-cutting Nest artifacts):
  - global exception filters
  - global middlewares
  - guards (authorization)
  - interceptors (cross-cutting request/response behavior)
- **Shared module**:
  - reusable utilities
  - shared business services
  - no domain ownership leakage

## Controller and Service Split

- Controller verbs: `createX`, `listX`, `getXById`, `updateX`, `deleteX`
- Service verbs: `executeCreateX`, `executeListX`, `executeUpdateX`
- Do not embed repository or query details in controller methods
- Do not place HTTP-specific decorators in service classes

## Anti-Patterns to Avoid

- Fat controllers with branching business rules
- Cross-module direct imports that bypass shared/core contracts
- DTO reuse for persistence entities when semantics differ
- Returning ORM entities directly from API response contracts

## Related Skills

- [ts-clean-code.md](./ts-clean-code.md) - Naming, typing, and class design standards
- [nest-testing-playbook.md](./nest-testing-playbook.md) - Test strategy for controllers and services

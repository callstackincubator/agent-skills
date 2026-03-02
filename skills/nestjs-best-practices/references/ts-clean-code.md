---
title: TypeScript Clean Code
tags: typescript, clean-code, naming, solid, ro-ro
---

# Skill: TypeScript Clean Code

Apply clean TypeScript conventions for naming, typing, function design, and class responsibilities.

## Quick Checklist

- Use English in code and docs
- Declare parameter and return types explicitly
- Avoid `any`; create explicit types and interfaces
- Keep functions small, single-purpose, and verb-first
- Prefer immutable data (`readonly`, `as const`)
- Follow PascalCase, camelCase, kebab-case consistently
- Use JSDoc on public classes and public methods

## Naming and Type Rules

- **Classes**: PascalCase (`CreateUserService`)
- **Functions and methods**: camelCase with verbs (`executeCreateUser`)
- **Booleans**: verb prefixes (`isEnabled`, `hasAccess`, `canRetry`)
- **Files and folders**: kebab-case (`create-user.service.ts`)
- **Constants and env vars**: UPPERCASE (`MAX_RETRIES`, `API_URL`)
- **Avoid abbreviations** except standard API/URL and common loop/error/context aliases (`i`, `j`, `err`, `ctx`, `req`, `res`, `next`)

## Function Design

1. Start function names with verbs
2. Keep one abstraction level per function
3. Return early to avoid nested blocks
4. Use higher-order methods (`map`, `filter`, `reduce`) when they improve clarity
5. Prefer default parameters over null/undefined guard branches
6. Use RO-RO (Receive Object, Return Object) when arguments/results grow

## Data and Class Design

- Encapsulate related primitive values in composite types
- Prefer class-level validation or dedicated validators over scattered inline checks
- Follow SOLID and favor composition over inheritance
- Keep classes focused:
  - less than 200 instructions
  - less than 10 public methods
  - less than 10 properties

## Exceptions and Error Handling

- Throw exceptions for truly unexpected states
- Catch errors only to:
  - recover from expected failures,
  - add meaningful context,
  - or map to domain/application errors
- Otherwise, let a global exception handler process them

## Public API Documentation Template

```ts
/**
 * Creates a new user in the system.
 * @param inputCreateUserData Input payload with user profile fields.
 * @returns OutputCreateUserResult with persisted user data.
 * @throws ConflictException When email already exists.
 */
```

## Related Skills

- [nest-module-architecture.md](./nest-module-architecture.md) - Apply these conventions in NestJS layers
- [nest-testing-playbook.md](./nest-testing-playbook.md) - Validate behavior with focused tests

---
title: NestJS Testing Playbook
tags: nestjs, testing, jest, unit-test, e2e, smoke-test
---

# Skill: NestJS Testing Playbook

Build confidence in NestJS modules with unit tests, controller tests, and e2e acceptance tests using Jest.

## Quick Test Matrix

| Layer | Focus | Style |
|------|-------|-------|
| Service unit test | Business logic and edge cases | Arrange-Act-Assert |
| Controller test | Routing + request/response mapping | Arrange-Act-Assert |
| Module e2e | End-to-end behavior and contracts | Given-When-Then |

## Naming and Structure Rules

- Use clear variable names: `inputX`, `mockX`, `actualX`, `expectedX`
- Keep tests single-purpose and deterministic
- Use test doubles for expensive or unstable dependencies
- Write at least one unit test for each public service method
- Write controller tests for each endpoint handler
- Write one e2e suite per API module

## Service Unit Tests

1. Arrange inputs and dependency doubles
2. Act by calling one public method
3. Assert output and dependency interactions
4. Cover happy path and failure path

## Controller Tests

- Validate DTO handling and parameter mapping
- Assert service call contract and transformed output
- Keep controller tests free from persistence behavior assertions

## E2E Tests

- Follow Given-When-Then narrative
- Boot module with realistic configuration
- Verify:
  - status codes,
  - response body contract,
  - key integration behavior

## Smoke Endpoint Guidance

Add a lightweight admin smoke endpoint per controller for operational checks.

Example route shape:

```text
GET /admin/test
```

Expected behavior:
- returns success quickly
- does not mutate data
- verifies minimal module wiring health

## Common Pitfalls

- Over-mocking until tests stop detecting regressions
- Asserting implementation details instead of behavior
- Writing only happy-path tests
- Sharing mutable fixtures across tests

## Related Skills

- [ts-clean-code.md](./ts-clean-code.md) - Keep test code readable and strongly typed
- [nest-module-architecture.md](./nest-module-architecture.md) - Align test scope with module boundaries

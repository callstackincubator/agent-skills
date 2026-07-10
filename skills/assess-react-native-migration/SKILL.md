---
name: assess-react-native-migration
description: Assesses whether and how an existing mobile product should migrate to React Native. Use when auditing one or more product repositories for migration readiness, including products whose iOS, Android, and other clients live in separate directories or repositories; choosing brownfield, greenfield, or a checkpoint-based path; defining a representative trial; or preparing a baseline and ROI decision before implementation. When product scope or material evidence is unavailable, grills the stakeholder with exactly one question per turn instead of sending a questionnaire.
license: MIT
metadata:
  author: Callstack
  tags: react-native, migration, assessment, brownfield, greenfield, ios, android, roi
---

# Assess React Native Migration

Produce a read-only migration decision. Diagnose the product and delivery system; do not execute the migration.

## Establish Product Scope

Run the assessment from a workspace that exposes as many production client codebases as possible. The current checkout is not evidence that it contains the whole product.

Before assessing readiness:

1. Inspect the current repository and every workspace root available to the agent.
2. Infer supported client platforms from product documentation, CI, release configuration, workspace manifests, submodules, and references to sibling repositories.
3. Locate each production client codebase, including separate native iOS and Android repositories, app variants, and any web client relevant to staffing or proposed code sharing.
4. Record a platform inventory with the client, repository or path, evidence of product membership, and access status.

When iOS and Android are both supported, inspect both native codebases before recommending a path. If a codebase remains unavailable, mark its evidence `unknown`, state that the assessment covers only the accessible platforms, and lower confidence accordingly. Do not infer that a platform is unsupported merely because its project is absent from the current repository.

**Scope gate:** every supported production client is listed, and each codebase is accessible, explicitly unavailable, or confirmed not to exist.

## First Response Gate

When the scope gate has not passed, the first response must be exactly:

```markdown
**Question:** Where can I access the production codebase for each client platform this product supports, including iOS and Android if both exist?

**Why it matters:** A migration path based on only one platform can miss native dependencies, product behavior, and delivery constraints that change the decision.
```

After the scope gate passes, grill rather than survey when repository evidence is unavailable.

If the measurable migration driver is unknown, the first response must be exactly:

```markdown
**Question:** What measurable delivery or business problem should a React Native migration solve?

**Why it matters:** This determines whether migration is relevant and which outcomes the assessment must test.
```

If the driver is already known, ask only the next highest-impact unknown using the same two-line shape. End the turn immediately after the question and reason. Do not add a preamble, questionnaire, recommendation, or implementation guidance.

## Rules

- Treat every production app as a source of truth, including undocumented behavior.
- Inspect available code, CI, tests, release configuration, product documents, and runtime evidence before asking questions.
- Compare iOS and Android explicitly where their implementation, behavior, dependencies, delivery, or roadmap differ.
- Base product-wide claims only on evidence from every supported platform, or qualify their platform coverage.
- Label material claims `observed`, `measured`, `reported`, `assumed`, or `unknown`.
- Recommend from evidence, not an aggregate readiness score.
- Default to gathering evidence, not to brownfield, greenfield, or migration itself.
- Own the decision phase. Do not apply implementation skills or select Expo versus bare React Native before Path A is accepted.
- Count only React Native's marginal value over the current native system.
- Measure agents by accepted, verified work, not tokens, generated code, or pull requests.
- Make no universal claims about duration, cost, code sharing, agent productivity, or ROI.

## Select the Evidence Mode

Use repository-backed assessment when source code or delivery artifacts are available:

1. Complete the platform inventory and establish which repositories the assessment can inspect.
2. For each accessible mobile codebase, locate app variants, CI, tests, release configuration, architecture records, and product documentation.
3. Search each native codebase for SDKs, permissions, app extensions, storage, authentication, push, deep links, analytics, experiments, and platform-specific behavior.
4. Cite repository names plus file paths and line numbers so evidence remains attributable when codebases are separate.
5. Ask stakeholders only for missing codebase locations or for product, organizational, and operational facts the repositories cannot establish.

Use interview assessment when the repository is unavailable or material evidence remains missing:

1. Start with the measurable delivery or business problem unless the user already supplied it.
2. Ask exactly one decision-changing question per turn.
3. Explain in one sentence which path, risk, or assumption the answer affects.
4. Challenge vague or contradictory answers with a narrower follow-up instead of accepting them as evidence.
5. Record the answer, update the evidence state, and choose the next highest-impact unknown.
6. Stop grilling when another answer cannot change the recommendation, confidence, or checkpoint.

Before the evidence gate passes, every response must contain only:

```markdown
**Question:** [one question]

**Why it matters:** [one sentence]
```

Do not include a questionnaire, path recommendation, checkpoint, or implementation guidance during these turns. If the user pauses the interview, return the current evidence state and the single highest-impact unknown without pretending the assessment is complete.

**Interview turn gate:** one answer has been requested, its decision impact is explicit, and no second question appears.

## 1. Collect Decision Evidence

State the decision, deadline, current alternative, and measurable driver. A framework preference is not a driver.

Inspect these dimensions:

| Dimension | Minimum evidence |
| --- | --- |
| Product | Supported platforms, app variants, shared versus platform-specific roadmap, critical flows, accessibility, analytics, and edge cases |
| Native surface | SDKs, modules, permissions, background work, app extensions, payments, hardware APIs, custom rendering, and viable React Native paths |
| Continuity | Auth and sessions, secure and persisted storage, push tokens, deep links, subscriptions, installed-user update, legal, security, and offline constraints |
| Verification | Reproducible builds, test accounts, manual and automated QA, device control, native-reference evidence, performance baselines, and independent review |
| Release | Current cadence and recovery, internal distribution, flags, experiments, store rollout, and desired binary plus optional OTA lanes |
| Ownership | Decision authority and owners for artifacts, parity, native boundaries, shared foundations, verification, and releases |
| Agent governance | Approved model and source boundary, protected secrets and test data, least-privilege access, evidence retention, audit trail, and human architecture and release approval |
| Delivery baseline | Duplicate implementation and review, waiting and handoffs, parity gap, two-platform verification, release metrics, defects, rework, and maintenance cost |

For an OTA-dependent plan, require an owner plus runtime compatibility, rollout, observability, rollback or republish, and audit policy. OTA availability alone is not a migration benefit.

Use a small migration core that combines existing product and native knowledge with React Native migration expertise. Ask only for missing facts that could change the decision; expose the rest as assumptions.

**Gate:** every dimension has evidence or an explicit unknown, and every path-blocking unknown is named.

## 2. Choose a Path

Choose one outcome and state why the alternatives lose.

| Outcome | Recommend when |
| --- | --- |
| **Path A: brownfield** | Release or installed-user continuity dominates, native coupling is deep, flows can move independently, or whole-app cutover risk is unacceptable. Include the cost of host boundaries and dual architecture. |
| **Path B: greenfield** | Behavior is recoverable, native dependencies have credible replacements, continuity can be proven, verification is strong, and legacy scope can be controlled until replacement. |
| **Path C: greenfield-first checkpoint with brownfield fallback** | Greenfield offers a simpler target but material uncertainty remains, and completed React Native work can be proven inside the native hosts before scaling. |
| **Defer** | The business case is plausible, but evidence, verification, ownership, budget, or release readiness is missing. Name the smallest readiness work and reopening condition. |
| **Do not migrate** | The native system meets the desired outcomes, duplicated mobile delivery is not material, the roadmap is asymmetric, platform-specific work dominates, or risk-adjusted return is not credible. |

Treat Path C as Callstack's emerging post-2025 operating model, not an industry benchmark. Agent access makes behavioral porting more viable; only a measured checkpoint on this product establishes speed and quality.

After Path A is accepted, hand implementation planning to [react-native-brownfield-migration](../react-native-brownfield-migration/SKILL.md). Do not repeat its Expo, XCFramework, AAR, or host-integration guidance.

**Gate:** one outcome is supported by decisive evidence, rejected alternatives have reasons, and confidence reflects evidence quality.

## 3. Define a Representative Checkpoint

Use a checkpoint for Path C and whenever one uncertainty could invalidate the recommended path. Set a fixed calendar and effort budget supplied by the organization. Select two or three vertical flows:

1. A common flow covering UI, data, analytics, and navigation.
2. An authenticated, stateful flow covering persistence, errors, and session behavior.
3. The boundary most likely to disprove the plan, such as a native SDK, background task, hardware API, offline behavior, app extension, accessibility requirement, or low-end Android constraint.

Tie each flow to native source references, runtime evidence, owners, and parity scenarios. Do not select only easy screens.

Define measurable acceptance criteria against the existing product:

- Behavior, states, validation, errors, analytics, accessibility, and visual output match the native reference.
- Auth, storage, deep links, push, and selected native boundaries work on required devices and OS versions.
- Startup, interaction, memory, and crash behavior meet agreed baselines or tolerances.
- CI, internal distribution, observability, and the intended release lane work reliably enough to continue.
- Every flow has device-level evidence and an independent review with clean context.
- Path C packages and opens at least one representative React Native flow in each required native host.

Run two passes on at least one flow:

1. **Faithful pass:** preserve behavior, analytics, accessibility, states, and edge cases. Record native-shaped architecture retained for parity.
2. **Idiomatic pass:** introduce React component composition, clear state boundaries, typed navigation, reusable primitives, suitable tests, and measured performance. Repeat parity and device checks.

Before scaling, assign owners for `MIGRATION.md`, `SCREENS.tsv`, `STATE_AND_STORAGE.tsv`, `DEPENDENCIES.tsv`, `EVENTS.tsv`, and `PARITY_CHECKS.md`. During assessment, identify missing artifacts rather than creating full inventories unless asked.

End with one decision: continue greenfield, continue Path C, move completed work into Path A, defer, or stop. Do not extend the checkpoint merely because its result is inconvenient.

**Gate:** flows, budget, criteria, evidence, owners, and terminal decisions are explicit.

## 4. Test the Economics

Map one representative change from ready-for-implementation to verified availability on both platforms. Capture two clocks:

1. **Change lead time:** commit to an artifact available to a production cohort; separate binary and OTA delivery.
2. **Cross-platform feature lead time:** ready-for-implementation to verified availability on iOS and Android.

Count potential return from removed duplicate implementation and business-logic review, lower parity coordination, engineer mobility, and measured release or recovery improvements. Keep iOS and Android device verification in the model. Keep web convergence outside the base case unless separately funded and assessed.

Count full investment: checkpoint, dual maintenance, native modules, training, idiomatic second pass, testing and device automation, observability, release infrastructure, platform ownership, cutover, and native-surface retirement.

Do not invent payback inputs. Use ranges when supplied data is uncertain. Revise, defer, or stop when verification and boundary work consume expected savings, native surfaces keep growing, dual maintenance has no retirement bound, agents add rework without verified throughput, parity improves without delivery improvement, or released capacity has no planned use.

**Gate:** marginal benefits and full investment can be compared without treating two-platform verification as removed work.

## Output Contract

Use this contract only after the evidence gate passes or when the user ends the interview.

Return a concise report in this order:

1. **Recommendation:** outcome, confidence, decisive reason, and decision boundary.
2. **Evidence:** platform inventory, coverage limits, and material findings with source status and platform differences.
3. **Assumptions and blockers:** unknowns ordered by decision impact.
4. **Checkpoint:** budget, flows, criteria, owners, evidence, and terminal decisions.
5. **Baseline and ROI:** measured inputs, missing inputs, counted return, full investment, and exclusions.
6. **Next decision:** who decides what, using which evidence, and when.

Keep the conclusion diagnostic. If execution comes up, state only that orchestration, task contracts, prompts, retry rules, and private agents are engagement-specific. Never expose or invent private implementation material.

# Pre-Sales Meeting Review Rubric

## Contents

- [Review principles](#review-principles)
- [Coverage statuses](#coverage-statuses)
- [Areas to evaluate](#areas-to-evaluate)
- [Question and answer review](#question-and-answer-review)
- [Decision rules](#decision-rules)
- [Gap prioritization](#gap-prioritization)
- [Exact output structure](#exact-output-structure)

## Review Principles

1. Evaluate meaning and business usefulness, not whether specific questions were asked word for word.
2. Credit information established through:
   - A direct client answer
   - A Callstack statement clearly confirmed by the client
   - Discussion elsewhere in the meeting
   - Reliable supplied background context
3. Do not mark information missing when the broader context establishes it.
4. Do not invent facts or present assumptions as evidence.
5. When only a summary or partial note is available, say `not evidenced in the available note`; absence does not prove the topic was not discussed.
6. When a complete transcript is available, say `not covered` for a relevant absent topic.
7. Consider the meeting purpose, sales stage, and next milestone. Do not expect an introductory call to resolve every later-stage question.
8. Distinguish blockers from information that can be collected in parallel and useful later-stage details.
9. Remain direct and evidence-based. Do not create a coverage score, use coaching clichés, or add generic praise.

## Coverage Statuses

Use only these statuses:

- **Covered — direct:** Clearly stated and sufficiently detailed.
- **Covered — contextual:** Clearly established elsewhere rather than through a direct answer.
- **Partial:** Useful information exists, but material details remain unclear.
- **Missing:** Relevant to the current or next sales stage but not established.
- **Not applicable yet:** Not reasonably required for this meeting or its next step.

For every `Partial` or `Missing` item, explain which information is absent and why it matters.

## Areas to Evaluate

### 1. Meeting Setup

- Appropriate introductions
- Available time confirmed
- Purpose and expectations aligned
- Client's desired outcome for the call understood
- Callstack introduced in a way relevant to this client

### 2. Client Situation and Discovery

#### Business Context

- Cause of the client's engagement with Callstack
- Goals and current strategy
- Why the issue matters now
- Deadline or material timing
- Consequences of doing nothing
- Desired business and technical outcomes
- Definition of success
- Investment or budget context when relevant

#### Problem

- Actual problem rather than only the requested solution
- Why it is a problem
- Affected users, product, engineering, QA, or leadership
- Previous attempts
- Why previous attempts did not solve it
- Whether the problem is primarily business, delivery, architecture, quality, performance, or team capability

#### Product

- Product and business model
- Target users
- Business-critical user flows
- Relevant product KPIs
- Performance measurement
- Observability setup

#### Technology and Delivery

- Platforms
- Technology stack
- Code sharing and feature overlap
- Architecture constraints
- Development, QA, release, or deployment bottlenecks
- Access or technical inputs still needed

#### Team

- Team size and structure
- Seniority and capabilities
- Ownership of the affected product or system
- Capacity to implement or maintain the proposed solution

### 3. Teaching and Insight

- Accurate summary of the client's situation
- Relevant experience or market insight
- Constructive challenge to client assumptions
- Appropriate problem reframing
- Relevant examples, case studies, or proof points
- Client understanding or response to the insight

### 4. Proposed Solution

- Credible future state
- Direct connection between recommendation and problem
- Practical first step
- Explained delivery approach
- Clear expected outcomes and impact
- Optional paths or later phases when relevant
- Requested and captured client feedback

### 5. Decision Process and Qualification

- Decision-makers and influencers
- Final approver or veto holder
- Evaluation criteria
- Procurement, legal, security, or architecture blockers
- Competing priorities, internal options, or vendors
- Budget availability or path to budget
- Urgency and likelihood of action

### 6. Next Steps

- Concrete next milestone
- Callstack actions
- Client actions
- Owner for each action
- Date or expected timing
- Required documents, data, designs, code access, or stakeholders
- Next meeting or clear reconnection plan
- Agreement on proposal or deliverable contents

## Question and Answer Review

Identify every meaningful client question, concern, request, or objection. For each one, use one answer status:

- Answered fully
- Answered partially
- Deferred with clear follow-up
- Not answered

Explain how Callstack responded and name any required follow-up.

Identify important topics Callstack tried to establish. For each one:

- State whether the client gave a usable answer.
- Summarize what the client established.
- State what remains unclear.

Credit an answer found elsewhere in the material even when it did not immediately follow the question. Do not invent implied questions; include only explicit questions and requests or implications clearly supported by the conversation.

## Decision Rules

Make two independent decisions.

### Sales-Process Decision

- **PROCEED:** Enough information and mutual alignment exist for a clearly defined next sales step.
- **PROCEED WITH CONDITIONS:** Continue the opportunity, but complete named follow-ups.
- **HOLD:** The core problem, value, qualification, or next step is too unclear to advance responsibly.

### Proposal Readiness

- **READY:** Enough reliable information exists for a credible, client-specific proposal.
- **READY WITH ASSUMPTIONS:** A proposal can be prepared, but named assumptions require validation.
- **NOT READY:** Missing information would make scope, solution, outcomes, delivery, or commercials unreliable.
- **NOT APPLICABLE YET:** A proposal is not the appropriate next milestone.

A successful meeting may justify advancing the sales process while remaining `NOT READY` for a proposal.

## Gap Prioritization

List gaps in this order:

1. **Blocking the next milestone**
2. **Can be collected in parallel**
3. **Useful at a later stage**

For each gap provide:

- What is unknown
- Why it matters
- Exact follow-up question or action
- Suggested owner: `Sales`, `Tech`, `Client`, or `Shared`

Write `None.` when a category has no gaps.

## Exact Output Structure

Use exactly these sections and headings.

### 1. Verdict

- **Sales-process decision:** [PROCEED / PROCEED WITH CONDITIONS / HOLD]
- **Proposal readiness:** [READY / READY WITH ASSUMPTIONS / NOT READY / NOT APPLICABLE YET]
- **Recommended next milestone:** [specific action]
- **Confidence:** [High / Medium / Low]
- **Reason:** [maximum three concise sentences]

### 2. Coverage summary

| Area | Status | Evidence | Material missing information |
|---|---|---|---|
| Meeting setup | | | |
| Business context | | | |
| Problem and impact | | | |
| Product | | | |
| Technology and delivery | | | |
| Team | | | |
| Teaching and insight | | | |
| Proposed solution | | | |
| Decision process | | | |
| Next steps | | | |

Use concise evidence references with speaker and timestamp when available.

### 3. Gaps requiring action

Use the three ordered categories from [Gap Prioritization](#gap-prioritization). For each gap include the unknown, importance, exact follow-up, and owner.

### 4. Client questions and Callstack answers

| Client question, concern, or objection | Answer status | How Callstack responded | Required follow-up |
|---|---|---|---|

Include explicit and clearly implied questions. Do not invent questions.

### 5. Callstack questions and client answers

| Topic Callstack tried to establish | Answer status | What the client established | What remains unclear |
|---|---|---|---|

### 6. What went well

Provide no more than five evidence-based observations. Do not use generic praise.

### 7. What could be improved

Provide no more than five specific improvements. For each one state:

- What happened
- Why it reduced the value of the meeting
- What Sales or Tech should do differently next time

Do not treat every unasked checklist item as a mistake.

### 8. One-minute sales handoff

- **Client situation:**
- **Why now:**
- **Impact of doing nothing:**
- **Proposed direction:**
- **Expected client outcomes:**
- **Proposal focal points:**
- **Decision process:**
- **Agreed next steps, owners, and dates:**
- **Outstanding assumptions or blockers:**

### 9. Final conclusion

Write exactly one of these openings and complete the reason:

- **MOVE FORWARD: YES —**
- **MOVE FORWARD: YES, WITH CONDITIONS —**
- **MOVE FORWARD: NO —**

Map `PROCEED` to `YES`, `PROCEED WITH CONDITIONS` to `YES, WITH CONDITIONS`, and `HOLD` to `NO`.

## Related Skills

- [Respond to Inbound MQL](../../respond-to-inbound-mql/SKILL.md) — classify and draft the response that moves a qualified inbound lead toward the meeting.

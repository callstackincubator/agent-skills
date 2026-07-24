---
name: respond-to-inbound-mql
description: Classifies confirmed Callstack marketing-qualified inbound leads and drafts short, professional replies with explicit calibration and human-review safeguards. Use when responding to an MQL form submission or email, choosing the correct response category, deciding whether a draft is safe to send, or calibrating the first 15 human-approved lead responses.
---

# Respond to Inbound MQL

Classify a confirmed marketing-qualified lead, draft the next response, and return a machine-readable review result. Treat `READY_TO_SEND` as a workflow status, never as permission to send a message.

## Load the Policy

Read [response-policy.md](references/response-policy.md) completely before classifying or drafting. Apply its classification definitions, calibration threshold, writing rules, status precedence, and JSON contract exactly.

## Expected Inputs

Use the available values from this set:

- Lead first name, company, job title, and original message
- Previous email thread
- Company website and supplied company or person research
- Selected sales representative and Calendly link
- Sender name
- Number of previously human-approved messages

Treat a missing approved-message count as `0`. Do not block on optional research when the lead's own message provides enough evidence. Identify missing representative details or an unavailable reliable answer when they change the classification or status.

## Workflow

1. **Establish the request**
   - Read the original message and thread as the primary evidence.
   - Confirm that the task concerns a qualified inbound lead. Do not use this skill to qualify an unconfirmed raw lead.
   - Identify explicit questions, requested documents, meeting requests, concrete needs, and commitments already made.

2. **Use research selectively**
   - Use supplied research or inspect the company website only when it materially improves relevance.
   - Include at most one verified professional fact in the draft.
   - Never mention the research process or introduce unrelated personal details.

3. **Choose one response type**
   - Apply the taxonomy in the policy reference.
   - Prefer the category supported by the lead's actual request over a generic meeting invitation.
   - Use `NEEDS_HUMAN_REVIEW` when a safe, supported response is not available.

4. **Resolve the workflow status**
   - Apply the calibration rule first.
   - Apply specialist-review safeguards after calibration.
   - Mark a message `READY_TO_SEND` only when every readiness condition passes.

5. **Draft the response**
   - Acknowledge the specific request.
   - Move toward one appropriate next step.
   - Use only supplied names and links.
   - Avoid legal, commercial, security, or technical commitments not established in the context.

6. **Validate the result**
   - Check the classification against the source message.
   - Check names, company details, representative, and Calendly URL.
   - Check length, paragraph count, call-to-action count, tone, and prohibited phrases.
   - Check that the status and required human action agree.

7. **Return the contract**
   - Return valid JSON only, using the exact fields and allowed values in the policy reference.
   - Do not add Markdown, research notes, or internal instructions around the JSON.

## Human Review and Sending

- For the first 15 human-approved messages, always recommend a category and draft, then require a reviewer to confirm both.
- Preserve the AI recommendation and the reviewer-selected label when the surrounding workflow supports persistence.
- After calibration, continue to route unsafe or uncertain messages to human review.
- Do not send, schedule, or publish the response unless the user separately and explicitly requests that external action.

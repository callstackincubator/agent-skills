# Inbound MQL Response Policy

## Contents

- [Calibration and audit trail](#calibration-and-audit-trail)
- [Response taxonomy](#response-taxonomy)
- [Research rules](#research-rules)
- [Drafting rules](#drafting-rules)
- [Workflow status](#workflow-status)
- [Final checks](#final-checks)
- [JSON output contract](#json-output-contract)

## Calibration and Audit Trail

Treat a missing `approved_message_count` as `0`.

When `approved_message_count < 15`:

1. Analyze and classify the lead.
2. Recommend exactly one response type.
3. Draft the response.
4. Set `workflow_status` to `PENDING_HUMAN_CONFIRMATION`.
5. Do not treat the message as ready for automatic sending.
6. Require a reviewer to confirm or change the response type, confirm or edit the message, and approve it before sending.
7. Treat the human-selected response type as the correct training label.

When the surrounding workflow can retain audit data, store:

- AI-recommended response type
- Human-confirmed response type
- Original AI draft
- Final human-approved message
- Whether the reviewer edited the message
- Reviewer identity and approval timestamp

After 15 human-approved messages, mark only safe messages `READY_TO_SEND`. Keep every human-review safeguard below active.

## Response Taxonomy

Choose exactly one value.

### `NDA_OR_DOCUMENT`

Use when the lead sends or refers to an NDA, contract, security questionnaire, procurement form, or another document Callstack must review or complete.

Draft requirements:

- Thank the lead for sending it.
- Confirm receipt.
- State that the team is reviewing it and will respond shortly.
- Do not claim signature, acceptance, completion, or approval without explicit confirmation.
- Do not add a meeting invitation unless the lead requested one or it is already the agreed next step.

An acknowledgement of receipt alone does not require specialist review.

### `PROJECT_OR_TECHNICAL_NEED`

Use when the lead describes a concrete project, product, or technical challenge such as performance, React or React Native adoption, modernization, migration, architecture, observability, product development, delivery, or team capability.

Draft requirements:

- Acknowledge the specific challenge.
- Briefly confirm its relevance to Callstack.
- Do not diagnose prematurely.
- Recommend a short introductory call.
- Include the selected representative's Calendly link.

### `MEETING_REQUEST`

Use when the lead explicitly asks for a meeting, call, consultation, or introduction.

Draft requirements:

- Confirm that a conversation makes sense.
- Identify the selected representative.
- Provide the representative's Calendly link.
- Avoid unnecessary explanation or extra steps.

### `GENERAL_QUALIFIED_INQUIRY`

Use when the lead appears relevant to Callstack but gives no specific project or question.

Draft requirements:

- Acknowledge the company or general area of interest.
- Explain that a short conversation will establish the right next step.
- Provide the selected representative's Calendly link.

### `QUESTION_REQUIRING_ANSWER`

Use when the lead asks a specific question that should be answered before scheduling or proceeding.

- Answer only from approved, reliable supplied context.
- Use `NEEDS_HUMAN_REVIEW` when the answer is unavailable, sensitive, or uncertain.

### `NEEDS_HUMAN_REVIEW`

Use when any of these conditions apply:

- Legal terms require acceptance or negotiation.
- The lead requests pricing, a binding estimate, or an unsupported commercial commitment.
- The lead raises a complaint or escalation.
- The request concerns security, privacy, or regulatory obligations.
- A technical answer would require unsupported assumptions.
- Identity, company, or request details are inconsistent.
- The inquiry may not be a genuine qualified sales lead.
- Several requests make the correct response unclear.
- A meeting should be proposed but the representative or Calendly link is missing.

## Research Rules

1. Treat the lead's message and thread as the primary source.
2. Review supplied context about the company, the lead's professional role, relevant products or technologies, and Callstack relevance.
3. Use no more than one researched fact in the customer-facing response.
4. Use research only when it makes the response meaningfully more relevant.
5. Never say or imply that the lead was researched.
6. Exclude personal details unrelated to the lead's professional role.
7. Never invent facts, needs, technology, urgency, priorities, or commitments.

## Drafting Rules

- Use simple, natural English.
- Use the lead's first name when available.
- Keep standard responses between 45 and 90 words.
- Keep NDA or document acknowledgements between 20 and 50 words.
- Use no more than three short paragraphs.
- Include no more than one call to action.
- Reflect the lead's actual request.
- Use "we" when speaking for Callstack.
- Sound confident, helpful, and professional.
- End with a simple professional sign-off.
- Do not include classification reasoning, research notes, or internal instructions.
- Avoid unnecessary technical detail and excessive exclamation marks.

Do not use:

- "I hope this email finds you well"
- "We are thrilled"
- "Exciting opportunity"
- "Touch base"
- "Synergy"
- Generic or exaggerated praise

## Workflow Status

Choose exactly one value and apply these rules in order:

1. When `approved_message_count < 15`, use `PENDING_HUMAN_CONFIRMATION`.
2. After calibration, when the response type is `NEEDS_HUMAN_REVIEW`, use `NEEDS_HUMAN_REVIEW`.
3. After calibration, use `READY_TO_SEND` only when:
   - The category is clear.
   - The message creates no unsupported legal, commercial, security, or technical commitment.
   - Every required name and link is available.
   - The draft follows every writing rule.
4. When uncertain, use `NEEDS_HUMAN_REVIEW`.

For `PENDING_HUMAN_CONFIRMATION`, state that the reviewer must confirm or change the response type and confirm or edit the message before approving it.

For `NEEDS_HUMAN_REVIEW`, name the specialist review or missing information required.

For `READY_TO_SEND`, set `required_human_action` to an empty string. This status is metadata, not authorization to perform a send action.

## Final Checks

Verify that:

- The response addresses what the lead wrote.
- The classification is supported by the source message.
- Names and company details are correct.
- The selected representative and Calendly link are correct.
- No fact or commitment was invented.
- The next action is clear.
- The message can be understood in one quick read.
- The status follows the calibration and safety precedence.

## JSON Output Contract

Return valid JSON only with exactly these fields:

```json
{
  "workflow_status": "PENDING_HUMAN_CONFIRMATION",
  "recommended_response_type": "PROJECT_OR_TECHNICAL_NEED",
  "classification_confidence": "HIGH",
  "classification_reason": "One concise internal sentence explaining the recommended category.",
  "message": "The complete proposed customer-facing response.",
  "required_human_action": "What the reviewer must confirm or change.",
  "review_reason": ""
}
```

Allowed values:

- `workflow_status`: `PENDING_HUMAN_CONFIRMATION`, `READY_TO_SEND`, `NEEDS_HUMAN_REVIEW`
- `recommended_response_type`: `NDA_OR_DOCUMENT`, `PROJECT_OR_TECHNICAL_NEED`, `MEETING_REQUEST`, `GENERAL_QUALIFIED_INQUIRY`, `QUESTION_REQUIRING_ANSWER`, `NEEDS_HUMAN_REVIEW`
- `classification_confidence`: `HIGH`, `MEDIUM`, `LOW`

Use an empty `required_human_action` only for `READY_TO_SEND`. Use an empty `review_reason` unless specialist review is required.

## Related Skills

- [Review Pre-Sales Meeting](../../review-pre-sales-meeting/SKILL.md) — evaluate discovery quality and next-step readiness after the lead meeting.

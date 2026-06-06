/**
 * Deterministic mock outputs for Claude AI skills.
 *
 * Keys here MUST stay in sync with DEFAULT_PROMPTS in ../claude.ts so the mock
 * picks the right canned response per skill. The router auto-detects the skill
 * by matching the systemPrompt; if no match is found, GENERIC is returned.
 */

export type SkillKey =
  | 'monthly_ops'
  | 'risk_update'
  | 'mov_pack'
  | 'quarterly_report'
  | 'stakeholder_comms'
  | 'meeting_summary'
  | 'farmer_advisor'
  | 'generic';

export const MOCK_FIXTURES: Record<SkillKey, string> = {
  monthly_ops: `# Monthly Operations Report - {{project_name}}
**Period:** {{period}}  |  **MOA:** {{moa_ref}}  |  **Prepared by:** {{prepared_by}}

## Overall RAG: AMBER
Disbursement is on track and 4 of 6 stage-gate items are green; two compliance items remain open and pull the overall rating to amber pending sign-off.

## Workstream RAG
| Code | Workstream | Budget (R) | YTD Spend (R) | RAG | Key activity |
|---|---|---|---|---|---|
| WS1 | Land prep | 2,400,000 | 1,820,000 | GREEN | 142 ha cleared, soil tests complete |
| WS2 | Farmer onboarding | 1,100,000 | 690,000 | GREEN | 38 farmers signed, 12 awaiting OTA |
| WS3 | Compliance | 800,000 | 420,000 | AMBER | DALRRD permit pending |
| WS4 | Offtake | 600,000 | 110,000 | RED | Offtaker delayed contract review |

## Disbursement
Tranche 2 of R3.2m disbursed on 14 April. Tranche 3 (R2.8m) gated on stage-gate 4 closure, currently 80% complete.

## Stage-gate progress
Gate 3 closed on schedule. Gate 4 evidence pack submitted; awaiting funder review meeting on 19 May.

## Farmer & compliance update
38 active farmer contracts (target 50). Two non-conformance reports raised on PPE compliance; both closed within SLA.

## Top 3 risks
| # | Risk | RAG | Mitigation |
|---|---|---|---|
| R-07 | Offtake contract slipping | RED | Escalation meeting scheduled |
| R-12 | DALRRD permit delay | AMBER | Daily liaison with regional office |
| R-19 | Rainfall variance | AMBER | Drip irrigation accelerated |

## PFMA compliance
- [x] No irregular expenditure this period
- [x] Procurement >R30k 3-quote rule observed
- [x] Section 38(1)(j) declarations on file
- [x] Audit trail intact

## Next month priorities
- Close Gate 4 evidence pack - Owner: PMO Lead - Deadline: 24 May
- Sign offtake MoU - Owner: Director - Deadline: 31 May
- Onboard 12 remaining farmers - Owner: Field Coordinator - Deadline: 15 June

---
*[MOCK MODE] This report was generated from a fixture, not from Claude. Set ANTHROPIC_API_KEY or unset MOCK_MODE for real output.*`,

  risk_update: `# Risk Register Update - {{project_name}}
**Period:** {{period}}

## Executive summary
Three new risks logged this period; two existing risks downgraded after mitigation; one PFMA zero-tolerance risk (irregular expenditure) flagged for permanent monitoring.

## Full register
| Code | Risk | Likelihood | Impact | RAG | Control | Owner | PFMA |
|---|---|---|---|---|---|---|---|
| R-01 | Funder withholds tranche | Low | High | AMBER | Monthly funder calls | Director | YES |
| R-07 | Offtake contract slipping | High | High | RED | Escalation in progress | Commercial | - |
| R-12 | DALRRD permit delay | Med | Med | AMBER | Weekly status check | Compliance | YES |
| R-19 | Rainfall variance | Med | Med | AMBER | Irrigation contingency | Field | - |
| R-22 | Irregular expenditure (procurement) | Low | High | RED-FLAG | 3-quote rule + audit | Finance | ZERO-TOLERANCE |

## Risks changed this period
- R-07 escalated AMBER -> RED on 12 May after offtaker missed second deadline.
- R-15 closed (PPE non-conformance resolved across all sites).

## Escalations required
1. R-07 (Offtake) - escalate to PSC at next meeting.
2. R-22 (Procurement) - quarterly review with Finance Manager confirmed.

---
*[MOCK MODE] Generated from a fixture. Real Claude output requires ANTHROPIC_API_KEY.*`,

  mov_pack: `# Means of Verification (MoV) Evidence Pack - {{project_name}}
**Gate:** {{gate}}  |  **Period:** {{period}}

## MoV summary
All five primary KPIs have verifiable evidence on file. Two financial records reconcile to the rand against bank statements. Recommendation: APPROVE disbursement.

## Gate evidence status
| Gate item | Status | Evidence ref |
|---|---|---|
| Land cleared (140 ha) | VERIFIED | Drone survey 2025-04-22 |
| Farmer contracts (>=35) | VERIFIED | Signed OTAs (38 on file) |
| Stage-gate sign-off | PENDING | Awaiting funder review |

## KPI verification
| KPI | Target | Actual | Verified by |
|---|---|---|---|
| Hectares cleared | 140 | 142 | Independent surveyor |
| Active farmers | 35 | 38 | OTA register |
| YTD spend vs budget | <=85% | 78% | Bank statements |

## Financial verification
| Item | Ledger (R) | Bank (R) | Variance |
|---|---|---|---|
| Tranche 1 | 3,000,000 | 3,000,000 | 0 |
| Tranche 2 | 3,200,000 | 3,200,000 | 0 |

## NCR log
2 NCRs raised, both closed within 14 days.

## PFMA compliance evidence
3-quote rule observed on all procurement >R30k. Section 38 declarations current.

## Numbered evidence artefacts
1. Drone survey report (2025-04-22)
2. Signed OTA register (38 farmers)
3. Bank reconciliation pack Q1
4. PPE NCR closure certificates
5. DALRRD correspondence file

## Recommendation
APPROVE disbursement of Tranche 3 (R2.8m). All material verification complete.

## Next gate
Gate 5 will require offtake MoU signed and 50 farmer onboarding milestone.

---
*[MOCK MODE] Fixture output. Provide ANTHROPIC_API_KEY for live generation.*`,

  quarterly_report: `# Quarterly PSC Report - {{project_name}}
**Quarter:** {{quarter}}  |  **PSC date:** {{psc_date}}

## Executive summary
The project closed Q1 on budget and ahead of farmer-onboarding targets. Two stage-gates passed; offtake remains the principal commercial risk. Compliance position is strong with no irregular expenditure. Forward focus is offtake closure and Gate 5 evidence assembly. Recommendation to PSC: continue investment, escalate R-07.

## MOA KPI scorecard
| KPI | Target | Q1 Actual | Status |
|---|---|---|---|
| Hectares under cultivation | 140 | 142 | GREEN |
| Active farmer contracts | 35 | 38 | GREEN |
| Disbursement utilisation | 60% | 64% | GREEN |
| Offtake agreements signed | 1 | 0 | RED |

## Workstream progress
**WS1 Land prep:** 142 ha cleared and soil-tested; ahead of plan.
**WS2 Farmer onboarding:** 38 OTAs signed; pipeline of 12 awaiting due-diligence.
**WS3 Compliance:** DALRRD permit application in flight; weekly liaison.
**WS4 Offtake:** Slipped; commercial team working on alternate offtaker.

## Financial report
Budget R12.5m | YTD actual R7.2m (58%) | Variance favourable R0.3m.

## Stage-gate status
Gates 1-3 closed. Gate 4 evidence under funder review.

## Top 5 risks
R-07, R-22, R-12, R-19, R-31.

## PFMA compliance statement
*Signed: Project Manager / Finance Manager*  -  No irregular, fruitless or wasteful expenditure recorded for the quarter.

## Stakeholder engagement
Funder, DALRRD, traditional authority and farmer cooperative all engaged in the period.

## Next quarter plan
Close offtake MoU, achieve 50-farmer milestone, complete Gate 5.

## Declaration
The Project Manager and Finance Manager confirm the above is materially accurate to the best of their knowledge.

---
*[MOCK MODE] Fixture output. Real PSC reports require ANTHROPIC_API_KEY.*`,

  stakeholder_comms: `**Subject:** Project update - {{period}}

Dear {{recipient_name}},

I am writing to provide our scheduled update on {{project_name}}.

**Headline:** the project is progressing well and on track for its Q2 milestones, with two stage-gates closed and farmer onboarding running ahead of plan.

**Key points this period:**
- 142 hectares cleared and verified by independent survey
- 38 farmer contracts signed (target was 35)
- Tranche 2 disbursement received and fully reconciled
- One commercial risk under active management (offtake contract)

**What we need from you:** confirmation of attendance at the PSC meeting on 19 May, and any feedback on the draft offtake terms shared last week.

**Attachments:**
1. Monthly Ops Report ({{period}})
2. Updated risk register
3. Offtake terms draft v3

Please reply to this email or call my office if anything is unclear.

Kind regards,
{{prepared_by}}
{{role}} - {{project_name}}

---
*[MOCK MODE] Stubbed stakeholder comms. Set ANTHROPIC_API_KEY for tailored output.*`,

  meeting_summary: `# Meeting summary - {{meeting_title}}
**Date:** {{date}}  |  **Attendees:** {{attendees}}

## Decisions
1. Approve Tranche 3 disbursement subject to Gate 4 closure.
2. Escalate R-07 (offtake) to PSC.
3. Bring forward Gate 5 evidence assembly by two weeks.

## Action items
| # | Action | Owner | Due |
|---|---|---|---|
| A1 | Submit Gate 4 evidence pack | PMO Lead | 24 May |
| A2 | Schedule offtake escalation call | Commercial | 16 May |
| A3 | Update risk register with R-07 status | Risk Officer | 17 May |

## Open questions
- Confirm DALRRD timeline for permit issue.
- Confirm offtaker willingness to sign revised terms.

## Next meeting
{{next_meeting_date}}

---
*[MOCK MODE] Fixture summary - replace by enabling Anthropic.*`,

  farmer_advisor: `# Farmer advisory note
**For:** {{farmer_name}}  |  **Site:** {{site}}  |  **Date:** {{date}}

**Question received:** {{question}}

**Answer in plain language:**
Based on what you described, the most likely cause is uneven irrigation across the rows nearest the access road. Three things to try this week:

1. Walk the irrigation lines and check for blocked drippers - replace any that are not flowing.
2. Reduce nitrogen by 10% on the affected rows for the next two waterings.
3. Take a soil sample from row 3 and row 12 and bring it to the field office on Friday.

If the leaves do not improve in 7 days, please log a help request and the field officer will visit on the next site round.

Stay well,
3Wi Field Support

---
*[MOCK MODE] Stubbed farmer advisor reply. Real Claude output requires API key.*`,

  generic: `[MOCK MODE] AI response stub.

This is a placeholder reply because MOCK_MODE is enabled or no ANTHROPIC_API_KEY is set. The real Claude integration will generate a tailored, streaming response of roughly 400-1200 words with:

- Markdown headings and tables sized to the prompt
- Tenant-specific tone and terminology
- Numbered evidence references where applicable

To switch to live mode:
1. Get a key at https://console.anthropic.com (free signup includes ~$5 credit)
2. Put it in your .env as ANTHROPIC_API_KEY=sk-ant-...
3. Restart the API server

The fixture will still be returned for any skill the router cannot classify.`,
};

/** Choose a fixture by sniffing the system prompt. */
export function pickFixture(systemPrompt: string): string {
  const p = systemPrompt.toLowerCase();
  if (p.includes('monthly operations report')) return MOCK_FIXTURES.monthly_ops;
  if (p.includes('risk register') || p.includes('risk officer')) return MOCK_FIXTURES.risk_update;
  if (p.includes('means of verification') || p.includes('mov')) return MOCK_FIXTURES.mov_pack;
  if (p.includes('quarterly psc') || p.includes('quarterly report')) return MOCK_FIXTURES.quarterly_report;
  if (p.includes('stakeholder') || p.includes('communication lead')) return MOCK_FIXTURES.stakeholder_comms;
  if (p.includes('meeting') && (p.includes('summar') || p.includes('minutes'))) return MOCK_FIXTURES.meeting_summary;
  if (p.includes('farmer') && (p.includes('advisor') || p.includes('advice'))) return MOCK_FIXTURES.farmer_advisor;
  return MOCK_FIXTURES.generic;
}

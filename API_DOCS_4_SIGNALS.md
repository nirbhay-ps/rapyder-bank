# OneLenz API Documentation — Part 4: Signals Service

Base URL: `http://<host>:8002`  
All endpoints require: `Authorization: Bearer <access_token>`

---

## Health

### GET /health

**Response 200**
```json
{ "status": "ok", "service": "signals-service" }
```

---

## Signals — `/signals`

### GET /signals
List signals grouped by account, with filters, sort, and aggregate stats.

**Query params**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `source` | string[] | — | `EMAIL` \| `MEETING` \| `CRM` \| `CHANNEL` (multi-value) |
| `status` | string[] | — | See status values below (multi-value) |
| `sentiment` | string[] | — | `POSITIVE` \| `NEUTRAL` \| `NEGATIVE` \| `URGENT` |
| `priority` | string[] | — | `HIGH` \| `MEDIUM` \| `LOW` |
| `resolution_tag` | string[] | — | `VERIFIED` \| `MATCHED` \| `INFERRED` \| `UNRESOLVED` |
| `category` | string[] | — | See category values below |
| `search` | string | — | Full-text search (min 3 chars) |
| `sort` | string | `impact` | `impact` \| `newest` \| `oldest` \| `account_name` |
| `page` | int | 1 | Page number |
| `page_size` | int | 50 | Results per page (max 100) |

**Signal status values**: `NEW`, `VIEWED`, `ACTIONED`, `RESOLVED`, `IGNORED`, `RESOLUTION_SUGGESTED`, `MERGE_SUGGESTED`, `MISSED`, `ESCALATED`

**Signal category values**: `Competitive Mentions`, `Budget or Pricing Related`, `Timeline Movements`, `Stakeholder Change`, `Technical Objections`, `Risk Indicators`, `Purchase Intent`, `Expansion Signals`, `Champion Signals`, `Legal and Compliance`, `Relationship Signals`, `Meeting Action Items`

**Response 200**
```json
{
  "stats": {
    "total": 48,
    "unactioned": 21,
    "missed": 3,
    "by_source": { "EMAIL": 30, "MEETING": 18 },
    "by_status": { "NEW": 15, "VIEWED": 6, "ACTIONED": 12, "RESOLVED": 12, "IGNORED": 3 }
  },
  "accounts": [
    {
      "account_id": "eam-uuid-001",
      "account_name": "Prospect Corp",
      "account_type_tag": "Prospect",
      "signal_count": 5,
      "unactioned_count": 3,
      "highest_priority": "HIGH",
      "signals": [
        {
          "signal_id": 201,
          "subject": "Prospect mentioned competitor pricing in email",
          "source_tag": "EMAIL",
          "status": "NEW",
          "category_tags": ["Competitive Mentions", "Budget or Pricing Related"],
          "priority": "HIGH",
          "sentiment": "NEGATIVE",
          "confidence_score": 87,
          "resolution_tag": "INFERRED",
          "owner_user_id": "c0e3ae3f-9de4-40fe-868c-2b5e76216e08",
          "surfaced_at": "2025-05-31T08:22:00Z"
        }
      ]
    }
  ],
  "page": 1,
  "page_size": 50,
  "total_accounts": 12
}
```

---

### GET /signals/{signal_id}
Get full drawer detail for a single signal.

**Response 200**
```json
{
  "signal_id": 201,
  "subject": "Prospect mentioned competitor pricing in email",
  "body": "Hi Jane, we've been evaluating your solution but CompetitorX is offering a 20% discount...",
  "source_tag": "EMAIL",
  "status": "NEW",
  "category_tags": ["Competitive Mentions", "Budget or Pricing Related"],
  "priority": "HIGH",
  "sentiment": "NEGATIVE",
  "confidence_score": 87,
  "confidence_breakdown": { "w1": 20, "w2": 18, "w3": 17, "w4": 17, "w5": 15, "total": 87 },
  "resolution_tag": "INFERRED",
  "resolution_method": null,
  "account": {
    "account_id": "eam-uuid-001",
    "account_name": "Prospect Corp",
    "account_type_tag": "Prospect"
  },
  "deal": {},
  "owner_user_id": "c0e3ae3f-9de4-40fe-868c-2b5e76216e08",
  "surfaced_at": "2025-05-31T08:22:00Z",
  "first_action_at": null,
  "completed_at": null,
  "completion_reason": null,
  "completion_notes": null,
  "extracted_entities": [
    { "type": "COMPETITOR", "value": "CompetitorX" },
    { "type": "DISCOUNT", "value": "20%" }
  ],
  "suggested_action": "Schedule a pricing call to address the competitive concern.",
  "participants": [
    {
      "name": "Bob Smith",
      "email": "bob@prospect.com",
      "title": "VP Sales",
      "company": "Prospect Corp",
      "matched_contact": { "contact_id": 55, "linked_account_id": 12 }
    }
  ],
  "resolution_suggested": false,
  "resolution_suggestion_reason": null
}
```

**Errors**
| Code | HTTP | Meaning |
|------|------|---------|
| `SIGNAL_NOT_FOUND` | 404 | Signal doesn't exist or belongs to another entity |

---

### GET /signals/{signal_id}/history
Get the full action history (status change timeline) for a signal.

**Response 200**
```json
{
  "signal_id": 201,
  "history": [
    {
      "log_id": 1,
      "from_status": null,
      "to_status": "NEW",
      "change_source": "SYSTEM",
      "changed_by": null,
      "changed_by_name": null,
      "reason": null,
      "changed_at": "2025-05-31T08:22:00Z"
    },
    {
      "log_id": 2,
      "from_status": "NEW",
      "to_status": "VIEWED",
      "change_source": "USER",
      "changed_by": "c0e3ae3f-9de4-40fe-868c-2b5e76216e08",
      "changed_by_name": "Jane Doe",
      "reason": null,
      "changed_at": "2025-05-31T09:05:00Z"
    }
  ],
  "merged_signals": []
}
```

`merged_signals` is populated when this signal was the survivor (SOLD) in an auto-merge:
```json
{
  "merged_signals": [
    {
      "snew_signal_id": 205,
      "snew_subject": "Follow-up on pricing concern",
      "snew_body": "Just checking in on the pricing discussion...",
      "snew_source": "EMAIL",
      "snew_created_on": "2025-06-01T07:00:00Z",
      "correlation_score": 91,
      "resolution_type": "RESOLVED_AND_MERGED",
      "merged_at": "2025-06-01T07:05:00Z"
    }
  ]
}
```

---

### PUT /signals/{signal_id}/status
Execute a lifecycle action on a signal. Uses a discriminated union on the `action` field.

**Action: COMPLETE**
```json
{
  "action": "COMPLETE",
  "reason": "DEAL_WON",
  "notes": "Closed the deal after addressing pricing concern."
}
```
`reason` values: `DEAL_WON` | `ISSUE_RESOLVED` | `ACTION_COMPLETED` | `OTHER`

**Action: IGNORE**
```json
{
  "action": "IGNORE",
  "reason": "NOT_RELEVANT"
}
```
`reason` values: `NOT_RELEVANT` | `ALREADY_HANDLED` | `WRONG_ACCOUNT` | `OTHER`

**Action: MERGE** (merge this signal into another)
```json
{
  "action": "MERGE",
  "target_signal_id": 198,
  "reason": "DUPLICATE"
}
```
`reason` values: `DUPLICATE` | `SAME_ACCOUNT_ISSUE` | `OTHER`

**Action: CONFIRM_COMPLETE** (confirm a system-suggested completion)
```json
{ "action": "CONFIRM_COMPLETE" }
```

**Action: CONFIRM_MERGE** (confirm a system-suggested merge)
```json
{ "action": "CONFIRM_MERGE" }
```

**Action: DISMISS** (dismiss a suggestion without acting)
```json
{ "action": "DISMISS" }
```

**Response 200** — returns the updated signal drawer + the new status log entry:
```json
{
  "signal": { "...same shape as GET /signals/{signal_id}..." },
  "status_log": {
    "log_id": 3,
    "from_status": "VIEWED",
    "to_status": "RESOLVED",
    "change_source": "USER",
    "changed_by": "c0e3ae3f-9de4-40fe-868c-2b5e76216e08",
    "changed_by_name": "Jane Doe",
    "reason": "DEAL_WON",
    "changed_at": "2025-06-01T10:00:00Z"
  }
}
```

**Errors**
| Code | HTTP | Meaning |
|------|------|---------|
| `SIGNAL_NOT_FOUND` | 404 | Signal not found |
| `INVALID_TRANSITION` | 422 | Action not allowed from current status |

---

### PATCH /signals/{signal_id}/account
Manually correct the account linked to a signal.

**Request**
```json
{ "account_id": "eam-uuid-002" }
```

**Response 200** — returns the updated signal drawer (same shape as `GET /signals/{signal_id}`).

---

### PATCH /signals/{signal_id}/status *(deprecated)*
Use `PUT /signals/{signal_id}/status` instead.

**Request**
```json
{
  "status": "ACTIONED",
  "reason": "Sent follow-up email",
  "notes": null
}
```
`status` values: `VIEWED` | `ACTIONED` | `RESOLVED` | `IGNORED` | `DISMISS_SUGGESTION`

**Response 200** — returns the updated signal drawer.

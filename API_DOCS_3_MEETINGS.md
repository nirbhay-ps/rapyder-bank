# OneLenz API Documentation — Part 3: Meetings (Email Connector)

Base URL: `http://<host>:8001`  
All user-facing endpoints require: `Authorization: Bearer <access_token>`  
Internal endpoints (bot/enrichment callbacks) require no auth but are not exposed publicly.

---

## Meetings — `/meeting/meetings`

### GET /meeting/meetings/
List meetings visible to the calling user, with optional filters and pagination.

**Query params**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `meeting_state` | string | — | `UPCOMING` \| `LIVE` \| `PAST` \| `CANCELLED` |
| `platform` | string | — | `teams` \| `zoom` \| `meet` |
| `from_date` | ISO datetime | — | Filter start range |
| `to_date` | ISO datetime | — | Filter end range |
| `offset` | int | 0 | Pagination offset |
| `limit` | int | 20 | Page size (max 100) |

**Response 200**
```json
{
  "meetings": [
    {
      "meeting_id": 42,
      "external_meeting_id": "AAMkAGI2...",
      "title": "Q2 Pipeline Review",
      "platform": "teams",
      "meeting_state": "PAST",
      "start_at": "2025-05-30T14:00:00Z",
      "end_at": "2025-05-30T15:00:00Z",
      "organiser_email": "jane@acme.com",
      "join_url": "https://teams.microsoft.com/l/meetup-join/...",
      "bot_outcome": "COMPLETED",
      "signal_relevance_band": "STRONG",
      "signal_count": 3,
      "attendee_count": 5,
      "has_transcript": true,
      "enrichment_status": "DONE"
    }
  ],
  "total": 87,
  "offset": 0,
  "limit": 20
}
```

`meeting_state` values: `UPCOMING` | `LIVE` | `PAST` | `CANCELLED`  
`bot_outcome` values: `NONE` | `RUNNING` | `COMPLETED` | `FAILED`  
`signal_relevance_band` values: `NONE` | `WEAK` | `MODERATE` | `STRONG`

---

### GET /meeting/meetings/{meeting_id}
Get full detail for a single meeting. Returns 404 if the meeting doesn't exist or isn't visible to the caller.

**Path param**: `meeting_id` (integer)

**Response 200**
```json
{
  "meeting_id": 42,
  "external_meeting_id": "AAMkAGI2...",
  "title": "Q2 Pipeline Review",
  "platform": "teams",
  "meeting_state": "PAST",
  "start_at": "2025-05-30T14:00:00Z",
  "end_at": "2025-05-30T15:00:00Z",
  "organiser_email": "jane@acme.com",
  "join_url": "https://teams.microsoft.com/l/meetup-join/...",
  "attendees": [
    { "email": "bob@prospect.com", "display_name": "Bob Smith", "duration_seconds": 3540 },
    { "email": "jane@acme.com", "display_name": "Jane Doe", "duration_seconds": 3600 }
  ],
  "bot_outcome": "COMPLETED",
  "bot_sessions": [
    {
      "session_id": 11,
      "status": "COMPLETED",
      "scheduled_at": "2025-05-30T13:58:00Z",
      "joined_at": "2025-05-30T14:01:00Z",
      "ended_at": "2025-05-30T15:02:00Z",
      "completion_reason": "MEETING_ENDED",
      "error_detail": null
    }
  ],
  "signal_relevance_band": "STRONG",
  "signal_relevance_score": 82,
  "signal_count": 3,
  "has_transcript": true,
  "enrichment_status": "DONE"
}
```

**Errors**
| Code | HTTP | Meaning |
|------|------|---------|
| `MEETING_NOT_FOUND` | 404 | Not found or not visible to caller |

---

### POST /meeting/meetings/join
Manually send a bot to a meeting URL. Requires `MEETING_RECORDING` consent.

**Request**
```json
{
  "join_url": "https://teams.microsoft.com/l/meetup-join/...",
  "bot_display_name": "OneLenz Notetaker"
}
```
- `bot_display_name` is optional (defaults to `"OneLenz Notetaker"`).

**Response 201**
```json
{
  "meeting": {
    "meeting_id": 99,
    "external_meeting_id": "manual-uuid-here",
    "title": null,
    "platform": "teams",
    "meeting_state": "LIVE",
    "start_at": "2025-06-01T11:00:00Z",
    "end_at": null,
    "organiser_email": null,
    "join_url": "https://teams.microsoft.com/l/meetup-join/...",
    "bot_outcome": "RUNNING",
    "signal_relevance_band": null,
    "signal_count": 0,
    "attendee_count": 0,
    "has_transcript": false,
    "enrichment_status": null
  },
  "bot_session": {
    "session_id": 15,
    "status": "SCHEDULED",
    "scheduled_at": "2025-06-01T11:00:05Z",
    "joined_at": null,
    "ended_at": null,
    "completion_reason": null,
    "error_detail": null
  }
}
```

**Errors**
| Code | HTTP | Meaning |
|------|------|---------|
| `MEETING_CONSENT_REQUIRED` | 403 | `MEETING_RECORDING` consent not granted |
| `BOT_LIMIT_EXCEEDED` | 429 | Concurrent bot limit reached |

---

### DELETE /meeting/meetings/{meeting_id}/bot
Cancel the active bot session for a meeting.

**Response 200**
```json
{
  "session_id": 15,
  "status": "CANCELLED",
  "ended_at": "2025-06-01T11:12:00Z"
}
```

---

### GET /meeting/meetings/{meeting_id}/transcript
Fetch the meeting transcript. Returns a status indicator if not yet ready.

**Response 200 — not ready**
```json
{ "status": "PROCESSING" }
```

**Response 200 — ready**
```json
{
  "status": "READY",
  "language": "en",
  "duration_seconds": 3612,
  "segments": [
    { "speaker": "Speaker 1", "start": 0.0, "end": 4.2, "text": "Thanks everyone for joining." },
    { "speaker": "Speaker 2", "start": 4.5, "end": 9.1, "text": "Happy to be here." }
  ]
}
```

Possible `status` values: `NOT_STARTED` | `PROCESSING` | `READY` | `FAILED`

---

### GET /meeting/meetings/{meeting_id}/insights
Fetch LLM-generated meeting insights.

**Response 200 — ready**
```json
{
  "status": "READY",
  "summary": "The team reviewed Q2 pipeline. Key risks identified around deal X.",
  "action_items": ["Follow up with Bob on pricing", "Send proposal by Friday"],
  "topics": ["Pipeline Review", "Pricing", "Competitive Landscape"],
  "signal_relevance_band": "STRONG",
  "signal_relevance_score": 82
}
```

---

### GET /meeting/meetings/{meeting_id}/speakers
Fetch speaker analytics (pitch, pace, talk-time).

**Response 200 — ready**
```json
{
  "status": "READY",
  "speaker_count": 2,
  "speakers": [
    {
      "label": "Speaker 1",
      "name": "Jane Doe",
      "email": "jane@acme.com",
      "talk_time_seconds": 1820,
      "avg_pitch_hz": 195.4,
      "avg_pace_wpm": 142
    },
    {
      "label": "Speaker 2",
      "name": "Bob Smith",
      "email": "bob@prospect.com",
      "talk_time_seconds": 1540,
      "avg_pitch_hz": 148.2,
      "avg_pace_wpm": 128
    }
  ]
}
```

---

### GET /meeting/meetings/{meeting_id}/signals
List signals extracted from this meeting.

**Response 200**
```json
{
  "signals": [
    {
      "signal_id": 201,
      "subject": "Prospect mentioned competitor pricing",
      "source_tag": "MEETING",
      "status": "NEW",
      "category_tags": ["Competitive Mentions", "Budget or Pricing Related"],
      "priority": "HIGH",
      "sentiment": "NEGATIVE",
      "surfaced_at": "2025-05-30T15:10:00Z"
    }
  ]
}
```

---

## Internal Callbacks (no user auth — service-to-service only)

### POST /internal/bots/{session_id}/events
Called by the meeting-bot-runner to report status changes.

**Request**
```json
{
  "status": "COMPLETED",
  "recordingS3Uri": "s3://onelenz-recordings/entity-id/session-11.mp4",
  "completionReason": "MEETING_ENDED",
  "error": null,
  "timestamp": "2025-05-30T15:02:00Z"
}
```

**Response 200**
```json
{ "received": true }
```

---

### POST /internal/enrichment/{meeting_id}/events
Called by the meeting-enrichment service when processing completes.

**Request**
```json
{
  "status": "COMPLETED",
  "meetingId": 42,
  "sessionId": 11,
  "transcriptS3Uri": "s3://onelenz-transcripts/42/transcript.json",
  "pitchPaceS3Uri": "s3://onelenz-transcripts/42/pitch_pace.json",
  "language": "en",
  "durationSeconds": 3612,
  "speakerCount": 2,
  "qualityScore": 91,
  "processingSeconds": 48,
  "speakerMap": { "SPEAKER_00": "jane@acme.com", "SPEAKER_01": "bob@prospect.com" },
  "error": null
}
```

**Response 200**
```json
{ "received": true }
```

---

### POST /internal/calendar/webhook
Microsoft Graph calendar webhook handler (validation + future notifications).

**Query param**: `validationToken` (string, optional — for MS Graph subscription validation)

**Response 202** — empty body (or plain-text echo of `validationToken` during validation).

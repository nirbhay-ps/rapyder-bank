# OneLenz API Documentation — Part 2: Email Connector (OAuth & Consent)

Base URL: `http://<host>:8001`  
All protected endpoints require: `Authorization: Bearer <access_token>`

---

## Health

### GET /health

**Response 200**
```json
{ "status": "ok", "service": "email-connector" }
```

---

## Email / MS365 OAuth — `/email`

### POST /email/connect
Initiate the Microsoft 365 OAuth flow. Returns the authorization URL to redirect the user to.

**Request** — no body.  
Header: `Authorization: Bearer <access_token>`

**Response 200**
```json
{
  "auth_url": "https://login.microsoftonline.com/common/oauth2/v2.0/authorize?client_id=...&state=abc123&...",
  "state": "abc123"
}
```

---

### POST /email/callback
Exchange the authorization code returned by Microsoft for tokens. Called after the user completes the OAuth consent screen.

**Request**
```json
{
  "code": "M.R3_BAY.c0e3ae3f...",
  "state": "abc123"
}
```

**Response 200**
```json
{
  "status": "CONNECTED",
  "message": "Email integration connected successfully"
}
```

**Errors**
| Code | HTTP | Meaning |
|------|------|---------|
| `MS365_STATE_EXPIRED` | 400 | State param missing, expired, or tampered (10-min TTL) |
| `MS365_OAUTH_FAILED` | 502 | Microsoft rejected the code or profile fetch failed |
| `MS365_OAUTH_DECLINED` | 400 | Microsoft returned no access token |

---

### GET /email/status
Get the current MS365 integration status and sync statistics.

**Response 200**
```json
{
  "status": "CONNECTED",
  "provider": "o365",
  "user_email": "jane@acme.com",
  "total_emails_synced": 312,
  "last_sync_at": "2025-06-01T10:45:00Z",
  "sync_frequency": "every_15min",
  "initial_sync_complete": true,
  "connected_at": "2025-06-01T09:00:00Z"
}
```

When no integration exists:
```json
{ "status": "NOT_CONNECTED" }
```

Possible `status` values: `NOT_CONNECTED`, `CONNECTED`, `AUTH_FAILED`, `DISCONNECTED`  
All fields except `status` are `null` when `status` is `NOT_CONNECTED`.

---

### POST /email/disconnect
Disconnect the MS365 integration. Tokens are revoked; synced data is retained.

**Request** — no body.

**Response 200**
```json
{ "message": "Disconnected. Synced data has been retained." }
```

---

### POST /email/sync
Trigger a manual incremental email sync outside the 15-minute schedule.  
Admin-only.

**Request** — no body.

**Response 202**
```json
{ "message": "Sync triggered", "config_id": 3 }
```

**Errors**
| Code | HTTP | Meaning |
|------|------|---------|
| `MS365_NOT_CONNECTED` | 400 | No active CONNECTED integration found |
| `MS365_CONSENT_REQUIRED` | 403 | `EMAIL_SCAN` consent not granted |
| `UNAUTHORIZED` | 401 | Caller does not have ADMIN role |

---

## Consent — `/consent`

### POST /consent/grant
Grant a consent type for the entity (e.g., allow meeting recording).

**Request**
```json
{
  "consent_type": "MEETING_RECORDING",
  "domain_scope": "ALL"
}
```
- `consent_type`: e.g. `MEETING_RECORDING`, `EMAIL_SYNC`
- `domain_scope`: defaults to `"ALL"`

**Response 201**
```json
{
  "consent_id": 7,
  "consent_type": "MEETING_RECORDING",
  "is_granted": true,
  "granted_at": "2025-06-01T09:05:00Z"
}
```

---

### POST /consent/revoke
Revoke a previously granted consent.

**Request**
```json
{ "consent_type": "MEETING_RECORDING" }
```

**Response 200**
```json
{ "message": "Consent revoked" }
```

---

### GET /consent/status?consent_type=MEETING_RECORDING
Get the current consent status for a given type.

**Query params**
| Param | Required | Description |
|-------|----------|-------------|
| `consent_type` | yes | e.g. `MEETING_RECORDING` |

**Response 200**
```json
{
  "consent_type": "MEETING_RECORDING",
  "is_granted": true,
  "granted_at": "2025-06-01T09:05:00Z",
  "revoked_at": null
}
```

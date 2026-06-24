# OneLenz API Documentation — Part 1: Auth Service

Base URL: `http://<host>:8000`  
All protected endpoints require: `Authorization: Bearer <access_token>`  
Error shape (all services):
```json
{ "error": { "code": "ERROR_CODE", "message": "Human-readable message" } }
```

---

## Health

### GET /health
No auth required.

**Response 200**
```json
{ "status": "ok", "service": "auth-service" }
```

---

## Auth — `/auth`

### POST /auth/signup
Register a new user. Auto-creates an entity (tenant) and returns tokens.

**Request**
```json
{
  "email": "jane@acme.com",
  "password": "Str0ng!Pass",
  "first_name": "Jane",
  "last_name": "Doe",
  "company_name": "Acme Corp",
  "mobile": "+14155550100"
}
```
- `company_name` and `mobile` are optional.
- Password: 8–255 chars.

**Response 201**
```json
{
  "user_id": "c0e3ae3f-9de4-40fe-868c-2b5e76216e08",
  "entity_id": "f451c4c9-6450-4545-acd6-062319803789",
  "email": "jane@acme.com",
  "display_name": "Jane Doe",
  "access_token": "eyJhbGciOiJSUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4...",
  "token_type": "Bearer",
  "access_token_expires_at": "2025-06-01T10:15:00Z",
  "refresh_token_expires_at": "2025-06-15T09:15:00Z"
}
```

**Errors**
| Code | HTTP | Meaning |
|------|------|---------|
| `EMAIL_ALREADY_EXISTS` | 409 | Email already registered |
| `VALIDATION_ERROR` | 400 | Missing/invalid fields |

---

### POST /auth/login
Authenticate with email + password.

**Request**
```json
{
  "email": "jane@acme.com",
  "password": "Str0ng!Pass"
}
```

**Response 200** — same shape as `/auth/signup` response.

**Errors**
| Code | HTTP | Meaning |
|------|------|---------|
| `INVALID_CREDENTIALS` | 401 | Wrong email or password |
| `ACCOUNT_INACTIVE` | 403 | Account disabled |

---

### POST /auth/refresh
Exchange a valid refresh token for a new access + refresh token pair.

**Request**
```json
{
  "refresh_token": "dGhpcyBpcyBhIHJlZnJlc2ggdG9rZW4..."
}
```

**Response 200** — same shape as `/auth/signup` response.

**Errors**
| Code | HTTP | Meaning |
|------|------|---------|
| `INVALID_REFRESH_TOKEN` | 401 | Token invalid or expired |
| `SESSION_NOT_FOUND` | 401 | Session was logged out |

---

### POST /auth/logout
Invalidate the current session. Accepts an expired access token.  
Header: `Authorization: Bearer <access_token>` (expired OK)

**Request** — no body.

**Response 200**
```json
{ "message": "Logged out successfully" }
```

---

### POST /auth/forgot-password
Send a 6-digit OTP to the registered email address.

**Request**
```json
{ "email": "jane@acme.com" }
```

**Response 200**
```json
{ "message": "OTP sent to jane@acme.com" }
```

> Always returns 200 even if the email is not registered (prevents enumeration).

---

### POST /auth/reset-password
Verify OTP and set a new password.

**Request**
```json
{
  "email": "jane@acme.com",
  "otp": "482910",
  "new_password": "NewStr0ng!Pass"
}
```

**Response 200**
```json
{ "message": "Password reset successfully" }
```

**Errors**
| Code | HTTP | Meaning |
|------|------|---------|
| `INVALID_OTP` | 400 | OTP wrong or expired |
| `OTP_EXPIRED` | 400 | OTP TTL exceeded |

---

### POST /auth/change-password
Change password for the currently authenticated user.  
Header: `Authorization: Bearer <access_token>`

**Request**
```json
{
  "current_password": "Str0ng!Pass",
  "new_password": "NewStr0ng!Pass"
}
```

**Response 200**
```json
{ "message": "Password changed successfully" }
```

**Errors**
| Code | HTTP | Meaning |
|------|------|---------|
| `INVALID_CREDENTIALS` | 401 | Current password wrong |
| `UNAUTHORIZED` | 401 | Missing/invalid token |

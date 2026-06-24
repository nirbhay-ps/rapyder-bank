# OneLenz API Documentation — Part 5: Content Engine

Base URL: `http://<host>:8003`  
User-facing endpoints require: `Authorization: Bearer <access_token>`  
Role requirements: `SUB_ADMIN` / `ADMIN` for write operations; `SELLER` can read.  
Internal endpoint uses `X-Service-Key` header instead of JWT.

---

## Health

### GET /health

**Response 200**
```json
{ "status": "ok", "service": "content-engine" }
```

---

## Assets — `/assets`

### POST /assets/upload
Upload one or more files as knowledge-hub assets. Triggers async ingestion (chunking + embedding).  
Role: `SUB_ADMIN` or `ADMIN`  
Content-Type: `multipart/form-data`

**Form fields**
| Field | Type | Required | Description |
|-------|------|----------|-------------|
| `files` | file[] | yes | One or more files (PDF, DOCX, TXT, etc.) |
| `category_id` | string | no | Optional category UUID |

**Response 202**
```json
{
  "assets": [
    {
      "asset_id": "a1b2c3d4-0000-0000-0000-000000000001",
      "file_name": "product-overview.pdf",
      "category_id": "cat-uuid-001",
      "source_type": "FILE",
      "file_type": "pdf",
      "status": "PENDING",
      "chunk_count": null,
      "page_count": null,
      "credits_consumed": null,
      "primary_service_line": null,
      "related_service_lines": [],
      "created_on": "2025-06-01T10:00:00Z"
    }
  ]
}
```

`status` values: `PENDING` | `PROCESSING` | `READY` | `FAILED`

---

### POST /assets/url
Submit a website URL for scraping and ingestion.  
Role: `SUB_ADMIN` or `ADMIN`

**Request**
```json
{
  "url": "https://acme.com/solutions",
  "category_id": "cat-uuid-001"
}
```

**Response 202**
```json
{
  "asset_id": "a1b2c3d4-0000-0000-0000-000000000002",
  "url": "https://acme.com/solutions",
  "source_type": "URL",
  "status": "PENDING"
}
```

---

### GET /assets
List assets with optional filters and pagination.  
Role: `SUB_ADMIN`, `ADMIN`, or `SELLER`

**Query params**
| Param | Type | Default | Description |
|-------|------|---------|-------------|
| `category_id` | string | — | Filter by category UUID |
| `status` | string[] | — | Filter by status (multi-value) |
| `page` | int | 1 | Page number |
| `page_size` | int | 20 | Results per page (max 100) |

**Response 200**
```json
{
  "items": [
    {
      "asset_id": "a1b2c3d4-0000-0000-0000-000000000001",
      "file_name": "product-overview.pdf",
      "category_id": "cat-uuid-001",
      "source_type": "FILE",
      "file_type": "pdf",
      "status": "READY",
      "chunk_count": 24,
      "page_count": 8,
      "credits_consumed": 0.48,
      "primary_service_line": "Cloud Infrastructure",
      "related_service_lines": ["DevOps", "Security"],
      "created_on": "2025-06-01T10:00:00Z"
    }
  ],
  "total": 34,
  "page": 1,
  "page_size": 20
}
```

---

### GET /assets/{asset_id}
Get full detail for a single asset.  
Role: `SUB_ADMIN`, `ADMIN`, or `SELLER`

**Response 200**
```json
{
  "asset_id": "a1b2c3d4-0000-0000-0000-000000000001",
  "file_name": "product-overview.pdf",
  "category_id": "cat-uuid-001",
  "source_type": "FILE",
  "status": "READY",
  "file_size_bytes": 204800,
  "page_count": 8,
  "chunk_count": 24,
  "credits_consumed": 0.48,
  "primary_service_line": "Cloud Infrastructure",
  "related_service_lines": ["DevOps", "Security"],
  "error_message": null,
  "created_on": "2025-06-01T10:00:00Z",
  "modified_on": "2025-06-01T10:05:00Z"
}
```

**Errors**
| Code | HTTP | Meaning |
|------|------|---------|
| `ASSET_NOT_FOUND` | 404 | Asset doesn't exist or belongs to another entity |

---

### PATCH /assets/{asset_id}
Update asset metadata (category or display name).  
Role: `SUB_ADMIN` or `ADMIN`

**Request**
```json
{
  "category_id": "cat-uuid-002",
  "file_name": "product-overview-v2.pdf"
}
```
All fields optional.

**Response 200** — returns updated `AssetDetailResponse` (same shape as `GET /assets/{asset_id}`).

---

### PUT /assets/{asset_id}/replace
Replace an existing asset's file. Re-triggers ingestion.  
Role: `SUB_ADMIN` or `ADMIN`  
Content-Type: `multipart/form-data`

**Form fields**
| Field | Type | Required |
|-------|------|----------|
| `file` | file | yes |

**Response 202** — returns updated `AssetDetailResponse` with `status: "PENDING"`.

---

### POST /assets/{asset_id}/retry
Retry ingestion for a failed asset.  
Role: `SUB_ADMIN` or `ADMIN`

**Request** — no body.

**Response 202**
```json
{
  "asset_id": "a1b2c3d4-0000-0000-0000-000000000001",
  "file_name": "product-overview.pdf",
  "source_type": "FILE",
  "status": "PENDING",
  "...": "..."
}
```

---

### POST /assets/{asset_id}/rescrape
Re-scrape a website (URL-type) asset.  
Role: `SUB_ADMIN` or `ADMIN`

**Request** — no body.

**Response 202** — same shape as retry response above, with `status: "PENDING"`.

---

### DELETE /assets/{asset_id}
Delete an asset and all its chunks.  
Role: `SUB_ADMIN` or `ADMIN`

**Response 204** — no body.

---

### GET /stats
Get aggregated asset statistics for the entity.  
Role: `SUB_ADMIN`, `ADMIN`, or `SELLER`

**Response 200**
```json
{
  "total_assets": 34,
  "total_chunks": 812,
  "total_storage_bytes": 10485760,
  "by_category": [
    { "category_id": "cat-uuid-001", "asset_count": 20, "chunk_count": 480 },
    { "category_id": "cat-uuid-002", "asset_count": 14, "chunk_count": 332 }
  ],
  "by_status": [
    { "status": "READY", "count": 30 },
    { "status": "PENDING", "count": 2 },
    { "status": "FAILED", "count": 2 }
  ]
}
```

---

## Internal — `/content/internal`

### POST /content/internal/auto-scrape
Called by auth-service on new subscriber signup to automatically scrape the company website.  
Auth: `X-Service-Key: <internal_service_key>` header (no JWT).

**Request**
```json
{
  "entity_id": "f451c4c9-6450-4545-acd6-062319803789",
  "website_url": "https://acme.com"
}
```

**Response 200**
```json
{
  "asset_id": "a1b2c3d4-0000-0000-0000-000000000003",
  "status": "PENDING"
}
```

**Errors**
| Code | HTTP | Meaning |
|------|------|---------|
| `UNAUTHORIZED` | 401 | Missing or invalid `X-Service-Key` |

---

## Common Error Responses (all services)

```json
{ "error": { "code": "FORBIDDEN", "message": "You do not have permission to perform this action." } }
{ "error": { "code": "UNAUTHORIZED", "message": "Authentication required." } }
{ "error": { "code": "VALIDATION_ERROR", "message": "field_name: field required" } }
{ "error": { "code": "INTERNAL_ERROR", "message": "An unexpected error occurred." } }
```

---

## Service Port Reference

| Service | Default Port |
|---------|-------------|
| auth-service | 8000 |
| email-connector | 8001 |
| signals-service | 8002 |
| content-engine | 8003 |

> Ports are illustrative. In production (EKS), services are accessed via the ingress at a single domain with path-based routing.

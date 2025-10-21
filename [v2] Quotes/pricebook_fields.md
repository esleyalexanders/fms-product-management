# Pricebook Item — Field definitions, behavior, API & notes

This document explains every field used in the Pricebook Create/Edit UI, how it behaves in the client, the recommended data model mapping, validation rules, example API payloads, edge cases and next steps for backend integration.

Date: 2025-10-21

---

## Overview

The Pricebook item supports both services and products. Each entry represents a canonical item franchisees use when building quotes and invoices. The UI supports drafts, publishing (versioning), and optionally notifying franchisees.

The client pages: `admin/pricebook-create.html` and `admin/pricebook-edit.html` (under `admin/`) are styled to match `add-product.html` and contain fields described below.

---

## Field-by-field explanation (Create/Edit UI)

For each field below: Name, purpose, how it works in the UI, validation, and recommended server-side type.

### Code
- Purpose: Unique short identifier for the item (used to reference programmatically).
- UI: Single-line text input, often required and displayed (read-only in edit view after initial creation).
- Behavior: Must be unique within the pricebook namespace. Used in logs and SKU lookups.
- Validation: Required, alpha-numeric + `-/_` allowed, max length ~64. Server must check uniqueness and return 409 on conflict.
- Server type: string (indexed, unique)

### Type (Service | Product)
- Purpose: Determines which additional fields are visible and how accounting/royalty logic treats the item.
- UI: Select toggle (Service or Product). Default: Service.
- Behavior: Show/hide fields: service fields (duration, unit, checklist) vs product fields (SKU, cost, inventory toggles).
- Validation: Required; enum `['service','product']`.
- Server type: enum/string

### Name
- Purpose: Human-friendly title displayed in quotes, invoices and preview cards.
- UI: Single-line input.
- Behavior: Shown in preview; used for search and as default quote line title. Editable at any time (but versioned when published).
- Validation: Required; trim; max length ~200.
- Server type: string

### Description
- Purpose: Long description of what's included and instructions or terms.
- UI: Textarea with optional rich text toolbar in the admin UI.
- Behavior: Stored as HTML or sanitized Markdown (pick one). Shown in quote PDF and client preview.
- Validation: Optional; sanitize on server to remove dangerous HTML.
- Server type: string (HTML/Markdown)

### SKU (product only)
- Purpose: Stock keeping unit for product items; used for inventory and vendor reference.
- UI: Text input visible only when `Type=Product`.
- Behavior: Optional for services; for products used by inventory and POS.
- Validation: Optional but recommended for products. Unique per vendor or franchise if required.
- Server type: string

### Cost (product only)
- Purpose: Internal cost to compute margins and support franchise accounting/royalty calculations.
- UI: Number input with currency symbol.
- Behavior: Not shown to customers; used in financial reports.
- Validation: number >= 0.00
- Server type: decimal (precise monetary type)

### Unit
- Purpose: Unit of measure for pricing (each, hour, sqft, etc.).
- UI: Select control.
- Behavior: Affects how quantities are displayed and how calculators interpret the line (e.g., per-hour jobs vs per-unit products).
- Validation: enum; server should accept standardized unit codes.
- Server type: string

### Default Duration (service only)
- Purpose: Default expected duration in minutes (for scheduling and estimated labor cost).
- UI: Number input (minutes).
- Behavior: Pre-fills scheduling estimates; editable per-job in the quote builder.
- Validation: integer >= 0
- Server type: integer (minutes)

### Base price
- Purpose: The default price exposed to customers when building quotes.
- UI: Currency number input.
- Behavior: Used to calculate line totals. Franchisees may be able to override based on policy.
- Validation: decimal >= 0.00
- Server type: decimal

### Tax category (Australia — GST treatment)
- Purpose: Determines how GST is treated for the item when invoicing in Australia.
- UI: Select control with Australia-specific options (`taxable_gst`, `gst_free`, `input_taxed`).
- Behavior: The invoicing system uses this category to resolve the numeric GST rate (typically 10% for taxable supplies) and to determine accounting/reporting treatment:
  - `taxable_gst` — Taxable supply: GST is charged to the customer (standard 10% in Australia). Use for most goods and services that are subject to GST.
  - `gst_free` — GST-free supply: GST is charged at 0% (e.g., many basic foods, certain health services, exports). These supplies are still treated as taxable supplies for GST reporting but at 0%.
  - `input_taxed` — Input‑taxed supply: No GST is charged on the sale (e.g., residential rent, some financial supplies). Input-taxed supplies generally mean the supplier cannot claim input tax credits on related purchases — different accounting treatment from GST-free.
- Validation: Must match configured tax categories. For Australia, default to `taxable_gst` if business rule requires.
- Server type: string (reference to tax code / tax treatment)

Notes:
- The tax category on the pricebook item is a key for tax-rate lookup at invoice time: lookup(tax_category, customer_jurisdiction, invoice_date) -> numeric rate and reporting behavior.
- Distinguish `gst_free` (zero-rate for invoicing but remains part of GST reporting) from `input_taxed` (not subject to GST and different input-credit rules). If your accounting requires both distinctions, store `tax_treatment` as the canonical value (`taxable_gst`|`gst_free`|`input_taxed`).
- Deposits / prepayments: Australian GST rules vary about whether GST is accounted for on receipt of deposit or on supply. Add an optional field `taxable_on_deposit: true|false` to PricebookItem or treat deposit policy at the pricebook or franchise level.

### Tags
- Purpose: Freeform categorization to aid search, filtering, and reporting.
- UI: Comma-separated input (or tokenized tag UI).
- Behavior: Used in search and lists.
- Validation: Each tag max length ~64; total tags limited to e.g., 20.
- Server type: array[string]

### Images / Media
- Purpose: Visuals to help franchisees sell and technicians identify the item.
- UI: Upload control with thumbnails preview. Accept images (png/jpg), videos and 3D models (optional).
- Behavior: Client previews images locally before upload. Files should be uploaded to a CDN or object store; server returns URLs.
- Validation: File types, per-file size limit (e.g., 5–25MB), max file count (e.g., 6).
- Server handling: multipart/form-data upload endpoint; store metadata in `media` array.
- Server type: array[ { url, mime_type, width, height, alt_text, focal_point } ]

### Flags (Visible, RequiresDeposit, TrackInventory, etc.)
- Visible
  - Purpose: Whether the item appears in franchisee pricebook listings and quote builder.
  - UI: Checkbox.
  - Behavior: Hidden items can still be used internally but not suggested.
- RequiresDeposit
  - Purpose: Indicates a deposit requirement on acceptance of the quote.
  - UI: Checkbox.
  - Behavior: Triggers invoice/deposit workflows in the billing subsystem.
- TrackInventory (product only)
  - Purpose: If true, product sales decrement inventory and trigger reorder alerts.
  - UI: Checkbox visible for products.

### Status & Version (metadata)
- Status: Draft | Published | Deprecated
  - Draft: editable only by the admin who created the draft (or franchise admin role).
  - Published: visible to franchisees.
  - Deprecated: removed from new quote searches but preserved for historic jobs/invoices.
- Version: semantic label (draft-1.0, v1.0, v1.1...).
- Behavior: Publishing creates a new version and appends an audit record.

---

## Client behaviors & interactions

- Draft save
  - Save as draft stores the item either in server (recommended) or locally in localStorage for quick demos. Drafts are editable and do not affect published items until published.
- Publish
  - Publishing performs server-side validation; on success, server creates a new immutable version record and marks the item as Published. Optionally send notifications to franchisees.
- Type toggle
  - Switching type from Service->Product or vice versa should warn if fields will be hidden, and on server-side you must preserve historical fields (allow nullable product fields when type=service).
- Image preview
  - Images selected are previewed client-side using FileReader; actual upload should occur on form submit or using separate direct-to-storage upload.

---

## Data model (recommended minimal schema)

```
PricebookItem {
  id: uuid,
  code: string,          // unique
  type: 'service'|'product',
  name: string,
  description: string,  // sanitized HTML/markdown
  sku?: string,
  cost?: decimal,       // internal
  unit: string,
  duration_minutes?: int,
  base_price: decimal,
  tax_category: string,
  tags: [string],
  media: [ { url, mime_type, alt_text, width?, height? } ],
  flags: { visible: bool, requires_deposit: bool, track_inventory?: bool },
  status: 'draft'|'published'|'deprecated',
  version_label: string,
  created_by: user_id,
  updated_by: user_id,
  created_at: timestamp,
  updated_at: timestamp
}

PricebookVersion {
  id: uuid,
  pricebook_item_id: uuid,
  version_label: string,
  snapshot: <full PricebookItem data at time>,
  created_by: user_id,
  created_at: timestamp,
  notes?: string
}
```

Notes:
- Keep `snapshot` as a JSON blob to allow full rollback. Do not delete historical versions.
- Store media metadata separately and reference by URL in the snapshot.

---

## Validation rules (client + server)

Client-side
- Required fields: `code` (create), `name`, `base_price`.
- Numeric ranges: `base_price >= 0`, `cost >= 0`, `duration_minutes >= 0`.
- File limits: max files 6, per-file <= 10MB, allowed mime types.

Server-side (must enforce)
- Unique code check (atomic): return 409 on conflict.
- Sanitize `description` to remove XSS.
- Validate `type` enum and required fields depending on type.
- Validate tax category belongs to configured tax codes.
- Validate media URLs (if uploaded separately) and deny dangerous mime types.

---

## Example API payloads

Create (JSON — no media):

```json
POST /api/pricebook/items
Content-Type: application/json

{
  "code": "CLEAN-001",
  "type": "service",
  "name": "Standard Home Cleaning",
  "description": "<p>Includes interior cleaning for homes up to 2,000 sq ft.</p>",
  "unit": "each",
  "duration_minutes": 60,
  "base_price": 79.00,
  "tax_category": "standard",
  "tags": ["cleaning","home"],
  "flags": {"visible": true, "requires_deposit": false},
  "status": "draft"
}
```

Create with media (recommended pattern — multipart or direct-to-storage uploads):

Option A: multipart/form-data (server handles files)
```
POST /api/pricebook/items
Content-Type: multipart/form-data

- fields: code, type, name, ... (as above)
- files: media[] (image files)
```

Option B: direct-to-storage (recommended for large files)
1. Client requests upload URL(s) from server.
2. Client uploads files directly to the object store (S3/Blob) and receives URLs.
3. Client POSTs JSON create payload with `media: [{url:"https://cdn...", mime_type:"image/jpeg"}, ...]`.

Update / Publish
```
PUT /api/pricebook/items/{id}
Content-Type: application/json

{
  "name": "Standard Home Cleaning",
  "base_price": 79.00,
  "status": "published",
  "publish_note": "Price update for fall campaign"
}
```

Publish should trigger server version creation (PricebookVersion) and return the new version label.

Response example for successful publish:
```json
200 OK
{
  "id":"...",
  "version_label":"v1.2",
  "status":"published",
  "published_at":"2025-10-21T12:34:56Z"
}
```

---

## Edge cases & recommendations

- Converting type between `service` and `product`:
  - Keep historical versions intact. When changing type, add a migration note in version history and keep product-only fields nullable.
- Local overrides by franchisees:
  - Allow local pricing overrides but record reasons and an audit trail. Consider a separate `FranchisePriceOverride` table rather than mutating the canonical item.
- Inventory vs quote consistency:
  - Reserve stock at order time or at invoice time depending on your business rules. Indicate in the quote if stock is low/backordered.
- Payment deposit flow:
  - If `requires_deposit` is true, Quote approval should trigger a required deposit line item with payment capture integration.
- Royalties & reporting:
  - Tag each item as `revenue_type: 'service'|'product'` so royalty rules can treat them differently.

---

## Acceptance criteria (sample)

- Admin can create an item with required fields and save as draft.
- Admin can publish an item which creates a version record.
- Franchisee can view published items in Pricebook browse and use them in quotes.
- Product items optionally decrement stock when sold (if trackInventory=true).
- API returns appropriate validation errors and supports direct media URLs.

---

## Next steps / recommended implementation tasks

1. Backend endpoints (CRUD) for Pricebook items with versioning and media metadata.
2. Direct-to-storage uploads (pre-signed URLs) for media files.
3. Server-side validation and sanitized description storage.
4. RBAC — only admin roles can publish/deprecate; franchisees can request overrides.
5. Automated tests: create/publish/rollback + file upload + tax calculation.
6. Update Quote Builder to display `unit`, `duration`, and to handle product packing/inventory.

---

If you want, I can:
- Create an OpenAPI skeleton for the endpoints and include example request/response schemas.
- Wire the forms to fetch calls that POST to these endpoints (client demo wiring).
- Convert this doc into GitHub Issues (one per endpoint / task) to track implementation.

Which of those should I do next?
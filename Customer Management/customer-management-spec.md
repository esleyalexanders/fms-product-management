# Customer Management — Business Requirements

## Purpose

Provide a single, maintainable Customer Management feature that allows admins to create, read, update and delete (CRUD) customer records. When creating quotes, users must be able to search and select an existing customer (or create a new one inline). This spec defines the business requirements, data model, UI screens, flows, validation rules, acceptance criteria, and implementation notes for the feature.

> Location: `Customer Management/customer-management-spec.md`

## Key goals / value

- Let admins capture and maintain customer contact and address details.
- Let quote creators reuse existing customer records to speed up quoting and reduce errors.
- Keep data consistent, searchable, and easily exported.

## Actors

- Franchisee Admin (primary): creates, edits, deletes, and selects customers when creating quotes.
- Staff: may view customers assigned to jobs (read-only) depending on role.
- System: persists data (localStorage initially) and supplies customers to the Quote Create flow.

## Contract (short)

- Inputs: customer fields (name, contact info, address, notes) entered via forms.
- Outputs: a stable customer ID reference used by quotes (e.g., customerId attached to quote records).
- Error modes: validation failures (missing required fields), uniqueness conflicts, persistence failures.
- Success criteria: UI allows full CRUD, customers are searchable, and quote-creation UI can pick a customer by id.

## Data model (canonical customer object)

All implementations must be able to map to this shape. IDs are stable strings (UUID or timestamp-based).

Example schema (JSON-like):

- id: string (stable identifier)
- firstName: string
- lastName: string
- company: string (optional)
- email: string (optional)
- phone: string (optional)
- address: {
    street: string,
    city: string,
    state: string,
    postalCode: string,
    country: string
  } (address fields optional but encouraged)
- preferredContactMethod: enum ["email","phone","whatsapp","none"] (optional)
- notes: string (optional)
- createdAt: ISO timestamp
- updatedAt: ISO timestamp
- deleted: boolean (soft-delete, default false)

Persistence (initial): localStorage key `fms_customers` storing an array of customer objects.

## Business Rules

1. When creating a quote, users must be able to pick an existing customer by searching name, company, email, or phone.
2. Inline-create: If a quote creator cannot find a customer, they must be able to create a minimal customer record from the quote form without leaving the flow.
3. Soft-delete: Deleting a customer marks `deleted: true` (not remove from storage) to preserve historical references on quotes and invoices.
4. Uniqueness: Email or phone uniqueness is recommended but not strictly required; the UI should warn of duplicate emails/phones on create.
5. Required fields: At minimum either (firstName or company) and at least one contact method (email or phone) are recommended for a valid record, but the system should allow less strict creation with a warning.
6. Auditing: Maintain `createdAt` and `updatedAt` timestamps for every modification.

## UI Screens & Flows

1. Customers List (admin page)
   - Purpose: browse, search, filter, sort customers; access create/edit/delete.
   - Columns: Name (Company), Email, Phone, City/State, Tags/Notes preview, Actions (Edit/Delete).
   - Features: search box (name/company/email/phone), pagination (or infinite scroll), bulk import/export, quick-create button.

2. Customer Create / Edit Form (modal or page)
   - Fields: firstName, lastName, company, email, phone, address fields, preferred contact method, notes.
   - Buttons: Save (primary), Save & Use (when invoked from quote flow), Cancel.
   - Validations: inline field validation, show warnings about duplicates, require at least (firstName | company) OR at least one contact method (configurable).

3. Customer Delete
   - Soft-delete with confirmation modal. Show warning: "This will remove the customer from lists but will remain on historical quotes and invoices." Optionally allow permanent delete in admin settings.

4. Quote Create/Quote Edit Integration
   - Customer picker component in the quote form. Behavior:
     - Search-as-you-type (autocomplete) that searches name/company/email/phone.
     - Display top 5 matches with small details (name, company, email, phone).
     - Select a customer to populate the quote's customer section (store customerId on the quote).
     - Option: "Create new customer" control inside the picker that opens the create modal with `Save & Use` behavior.
     - If a selected customer is later soft-deleted, the quote still references the customerId and UI should display "Deleted customer: <name>" but allow editing customer details or replacing.

5. Customer Details (side panel / modal)
   - Read-only view showing full customer record and recent activity (quotes/invoices linked). Include Edit button.

## Search & Filtering

- Search fields: name, company, email, phone, city, postal code.
- Filters: hasEmail, hasPhone, createdAt range, tag(s) (optional extension).
- Sorting: name ascending, createdAt descending, lastUpdated.
- Performance: for localStorage size expected (<10k customers) in-browser search is acceptable. For larger scale, propose server-side or indexed DB.

## Validation Rules

- Email: basic RFC 5322-like pattern check (non-strict) and lowercase storage.
- Phone: normalize to digits + optional leading +; store both original and normalized for search.
- Name/company length limits (e.g., 2–200 characters for names, company up to 200).
- Address fields optional but if postalCode provided, must be non-empty string.
- When saving, set createdAt/updatedAt appropriately.

## Error Handling

- Persistence failures (localStorage quota) should show clear error and provide option to export current data.
- Validation errors: prevent save, highlight fields with messages.
- Duplicate warnings should be non-blocking but visible.

## Acceptance Criteria (measurable)

1. Admin can create a customer via `Customers List` or inline from `Quote Create`.
2. Admin can edit and save changes to a customer; changes update `updatedAt`.
3. Admin can soft-delete a customer with confirmation; deleted customers no longer appear in default lists but remain linked to existing quotes.
4. Quote Create flow can search and select a customer; selected customer's `id` is saved to the quote record.
5. Inline-create from Quote Create: user can create a customer and immediately have it selected in the quote.
6. Search returns relevant matches within 200ms on a test dataset of 1000 customers in-browser (approximate target for responsiveness).
7. Unit-level tests exist for basic CRUD operations (create, read, update, delete/soft-delete) on the chosen persistence layer.

## Edge Cases

- Partial records (no contact) created; the system should warn but allow creation.
- Duplicate customers (same email/phone): warn and show matches in picker.
- Simultaneous edits: last-write-wins for localStorage; show updatedAt to help users.
- Deleting a customer assigned to an open quote: allow delete but flag the quote owner to choose a replacement when needed.
- Malformed phone or email input: reject with clear error.

## Storage & APIs (implementation notes)

Initial (simple) implementation:
- localStorage key: `fms_customers` = JSON.stringify(arrayOfCustomers)
- Helper API (suggested simple functions in a JS module):
  - getCustomers({ includeDeleted=false, q, limit, offset }) -> array
  - getCustomerById(id)
  - createCustomer(customerData) -> customer
  - updateCustomer(id, patch) -> customer
  - softDeleteCustomer(id) -> boolean
  - permanentlyDeleteCustomer(id) -> boolean (admin-only op)

Quote integration contract:
- Quote objects will reference `customerId` (string).
- When loading a quote, the UI should call getCustomerById(customerId) and display the cached snapshot (fallback to a minimal placeholder if not found).

Data export/import:
- CSV/JSON export of customers for backup. Import should allow mapping fields and warn about duplicates.

Security & Role Considerations:
- Only users with Admin role may create/edit/delete customers.
- Staff may have read-only access to customers assigned to their jobs (if role system exists).

## Testing notes

- Unit tests for helper API functions (create, read, update, delete).
- UI tests for: create form validation, inline-create-from-quote, search-and-select behavior, soft-delete behavior.
- Manual smoke test: create customer -> create quote -> select customer -> verify quote references customerId.

## Non-functional requirements

- Responsiveness: forms and picker must be usable on desktop and tablet screen sizes.
- Performance: client-side search must be responsive for up to ~5k customers; for larger scales plan migration to indexedDB or server API.
- Reliability: soft-delete preserves historical data for quotes and invoices.

## Implementation suggestions & small starter plan (low-risk)

1. UI components
   - `CustomerListPage` — list, search, create button.
   - `CustomerForm` — reusable for create/edit; support `saveAndUse` flag for inline create.
   - `CustomerPicker` — autocomplete component used in `quote-create.html`.

2. Persistence
   - Create a `customers.js` module with the helper API above that reads/writes `fms_customers`.
   - Provide small utilities: `generateId()`, `nowISO()`.

3. Tests
   - Add simple unit tests for `customers.js` (if no test framework exists yet, provide a tiny test runner script or manual test checklist).

4. Migration path
   - If volume grows, migrate storage to `indexedDB` and/or provide a server API.

## Next steps (short-term deliverables)

- Implement `customers.js` helper with localStorage persistence and unit tests (happy path + soft-delete + search).
- Add `CustomerList` page and wire `CustomerForm` modal.
- Add `CustomerPicker` to `quote-create.html` (inline create support).

## Acceptance checklist (to mark feature done)

- [ ] `fms_customers` persistent storage implemented and unit-tested.
- [ ] Admin UI to create/edit/delete customers implemented.
- [ ] Customer picker integrated into quote creation and inline-create path works.
- [ ] Basic manual test documented and executed: create customer -> create quote -> select customer -> verify link.

---

If you'd like, I can also:
- Implement the `customers.js` localStorage helper and unit tests next.
- Wire a basic `Customer List` page and the `Customer Picker` component inside `quote-create.html`.

Tell me which of the follow-ups you want me to implement next and I'll add them to the todo list and start. (I can begin with the helper module and tests if you want.)

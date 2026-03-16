flowchart TD
  %% Pricebook & Line Items process for Franchisor Admin
  subgraph Admin[Franchisor Admin]
    A1[Start: Open Pricebook UI] --> A2[Create New Pricebook Item - code, name, unit, price, tax, description, images]
    A2 --> A3[Validate Fields - required/format/ranges]
    A3 --> A4{Validation OK?}
    A4 -->|No| A5[Show validation errors - Edit]
    A5 --> A3
    A4 -->|Yes| A6[Save as Draft]
    A6 --> A7{Publish now or Save Draft?}
    A7 -->|Save Draft| A8[Draft stored - version 1.0 draft]
    A7 -->|Publish| B1[Publish Item - Generate Version v1]
    
    A9[Edit Existing Item] --> A10[Create New Draft Version]
    A10 --> A3
  end

  subgraph System[Platform Services]
    B1 --> B2[Store Item in Pricebook DB]
    B2 --> B3[Create Audit Record / Version History]
    B3 --> B4[Optional: Notify Franchisees of New Item]
    B4 --> C1[Item searchable & available for Quote Creation]
    
    B1 --> V1{Deprecate / Unpublish Item?}
    V1 -->|Yes| B5[Mark as Deprecated; keep historical versions available]
    V1 -->|No| B2
    
    B3 --> AR1[Allow rollback to previous version on approval]
    AR1 --> B2
  end

  subgraph Franchisee[Franchisee Actions]
    C1 --> F1[Search Pricebook]
    F1 --> F2[Use item in Quote Builder]
    F2 --> F3{Request Pricing Override?}
    F3 -->|Yes| F4{Override allowed?}
    F3 -->|No| F2
    F4 -->|Yes - local override policy| F5[Create quote using override & record override reason]
    F4 -->|No| F6[Open Change Request to Franchisor Admin]
    F6 --> A9
  end

  style Admin fill:#eef6ff,stroke:#2b6cb0
  style System fill:#f7fff0,stroke:#2f855a
  style Franchisee fill:#fff7ed,stroke:#dd6b20
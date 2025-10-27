sequenceDiagram
    actor Staff as Franchisee Staff
    participant QS as Quote System
    participant CRM as Customer Management
    participant PB as Pricebook
    participant WF as Workflow Engine
    actor Mgr as Franchisee Manager
    participant Portal as Customer Portal
    actor Cust as Customer
    
    Note over Staff,Cust: Initial Quote Request
    Staff->>QS: Initiate New Quote
    QS->>Staff: Display Customer Search
    
    alt Existing Customer
        Staff->>CRM: Search Customer
        CRM->>Staff: Return Customer Profile
        CRM->>Staff: Show Previous Quotes
        opt Clone Previous Quote
            Staff->>QS: Select Quote to Clone
            QS->>QS: Duplicate Quote Data
        end
    else New Customer
        Staff->>CRM: Create New Customer
        CRM->>CRM: Generate Customer ID
        CRM->>Staff: Return Customer Record
    end
    
    Note over Staff,PB: Service Selection
    Staff->>PB: Browse Services Catalog
    PB->>Staff: Display Available Services
    
    loop Add Line Items
        Staff->>QS: Select Service/Product
        Staff->>QS: Enter Quantity/Frequency
        QS->>PB: Get Item Price
        PB->>QS: Return Price Data
        QS->>QS: Calculate Line Total
    end
    
    Note over QS,PB: Pricing & Discounts
    QS->>PB: Check Discount Rules
    PB->>QS: Return Applicable Discounts
    QS->>QS: Apply Auto-Discounts
    QS->>QS: Calculate Subtotal
    QS->>QS: Add Taxes/Fees
    QS->>QS: Calculate Total Amount
    QS->>Staff: Display Quote Summary
    
    opt Manual Adjustment
        Staff->>QS: Override Price/Discount
        QS->>Staff: Request Reason
        Staff->>QS: Enter Justification
        
        alt High Value or Large Discount
            QS->>WF: Trigger Approval Workflow
            WF->>Mgr: Send Approval Request
            Mgr->>WF: Review Quote Details
            
            alt Approved
                Mgr->>WF: Approve Quote
                WF->>QS: Add Approval Stamp
                QS->>Staff: Quote Approved
            else Rejected
                Mgr->>WF: Reject with Comments
                WF->>Staff: Return for Revision
                Staff->>QS: Revise Quote
            end
        end
    end
    
    Note over Staff,QS: Quote Finalization
    Staff->>QS: Add Notes/Terms
    Staff->>QS: Set Validity Period
    QS->>QS: Generate Quote Preview
    Staff->>QS: Review & Finalize
    
    QS->>CRM: Save Quote
    CRM->>CRM: Link to Customer Record
    CRM->>QS: Confirm Saved
    
    Note over Staff,Cust: Quote Delivery
    Staff->>QS: Select Delivery Method
    
    alt Email Delivery
        QS->>Cust: Send Quote Email (PDF)
        QS->>CRM: Log Email Sent
    else SMS with Portal Link
        QS->>Cust: Send SMS with Link
        QS->>CRM: Log SMS Sent
    else Manual/Print
        QS->>Staff: Generate PDF
        Staff->>Cust: Deliver Manually
        Staff->>CRM: Mark as Delivered
    end
    
    QS->>CRM: Create Follow-up Task
    CRM->>Staff: Schedule Reminder
    
    Note over Portal,Cust: Customer Response
    alt Customer Portal Access
        Cust->>Portal: Access Quote
        Portal->>CRM: Authenticate Customer
        CRM->>Portal: Return Quote Details
        Portal->>Cust: Display Quote
        
        alt Accept Quote
            Cust->>Portal: Accept Quote
            Portal->>QS: Convert to Job
            QS->>QS: Create Booking/Job
            QS->>Cust: Send Confirmation
            QS->>Staff: Notify Job Created
            QS->>CRM: Update Status: Accepted
        else Request Changes
            Cust->>Portal: Request Revision
            Portal->>Staff: Send Notification
            Staff->>QS: Create Quote Revision
        else Decline Quote
            Cust->>Portal: Decline Quote
            Portal->>CRM: Update Status: Declined
            Portal->>Cust: Request Feedback
            Cust->>Portal: Submit Feedback
            Portal->>CRM: Save Feedback
        end
        
    else Manual Follow-up
        Staff->>Cust: Follow-up Call/Email
        Cust->>Staff: Provide Response
        Staff->>CRM: Log Interaction
        
        alt Customer Accepts
            Staff->>QS: Convert to Job
            QS->>CRM: Update Status: Accepted
        else Customer Declines
            Staff->>CRM: Update Status: Declined
            Staff->>Cust: Request Feedback
        end
    end
    
    Note over Staff,CRM: Close Quote Process
    QS->>CRM: Archive Quote
    CRM->>CRM: Update Customer History
    CRM->>Staff: Confirm Completion
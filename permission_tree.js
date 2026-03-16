// ================= ROOT MODULES (Level 1) =================
// Format: XX00000000 (Module level)
USER_MANAGEMENT("1A00000000", "User Management", null, 1),
    ROLE_MANAGEMENT("1B00000000", "Role Management", null, 1),
    UNIT_MANAGEMENT("1C00000000", "Unit Management", null, 1),
    DASHBOARD_MANAGEMENT("1D00000000", "Dashboard Management", null, 1),
    QUOTE_MANAGEMENT("1E00000000", "Quote Management", null, 1),
    PAYMENT_CONFIG_MANAGEMENT("1F00000000", "Payment Configuration Management", null, 1),
    INVOICE_MANAGEMENT("1G00000000", "Invoice Management", null, 1),
    CUSTOMER_MANAGEMENT("1H00000000", "Customer Management", null, 1),
    TEAM_MANAGEMENT("1I00000000", "Team Management", null, 1),
    PRICEBOOK_MANAGEMENT("1J00000000", "Pricebook Management", null, 1),
    SESSION_MANAGEMENT("1K00000000", "Session Management", null, 1),
    RECURRENCE_SESSION_MANAGEMENT("1L00000000", "Recurrence Session Management", null, 1),
    JOB_MANAGEMENT("1M00000000", "Job Management", null, 1),
    SCHEDULE_MANAGEMENT("1N00000000", "Schedule Management", null, 1),
    TIMESHEET_MANAGEMENT("1O00000000", "Timesheet Management", null, 1),

    // ================= USER MANAGEMENT (Level 2) =================
    // Format: 1AXX000000 (Sub-Module level)
    USER_VIEW("1A01000000", "View Users", "1A00000000", 2),
    USER_CREATE("1A02000000", "Create User", "1A00000000", 2),
    USER_UPDATE("1A03000000", "Update User", "1A00000000", 2),
    USER_DELETE("1A04000000", "Delete User", "1A00000000", 2),
    USER_PROFILE_VIEW("1A05000000", "Viesw User Profile", "1A00000000", 2),
    USER_PROFILE_UPDATE("1A06000000", "Update User Profile", "1A00000000", 2),
    USER_PROFILE_CHANGE_PASS("1A07000000", "Change password", "1A00000000", 2),
    USER_PROFILE_SET_PASS("1A08000000", "Set password", "1A00000000", 2),
    USER_PROFILE_ENABLE_MFA("1A09000000", "Enable MFA", "1A00000000", 2),
    USER_PROFILE_DISABLE_MFA("1A10000000", "Disable MFA", "1A00000000", 2),

    // ================= ROLE MANAGEMENT (Level 2) =================
    // Format: 1BXX000000 (Sub-Module level)
    ROLE_VIEW("1B01000000", "View Roles", "1B00000000", 2),
    ROLE_CREATE("1B02000000", "Create Role", "1B00000000", 2),
    ROLE_UPDATE("1B03000000", "Update Role", "1B00000000", 2),
    ROLE_DELETE("1B04000000", "Delete Role", "1B00000000", 2),
    ROLE_MEMBER_VIEW("1B05000000", "View Role Member", "1B00000000", 2),
    ROLE_MEMBER_CREATE("1B06000000", "Add Role Member", "1B00000000", 2),
    ROLE_MEMBER_UPDATE("1B07000000", "Update Role Member", "1B00000000", 2),
    ROLE_MEMBER_DELETE("1B08000000", "Delete Role Member", "1B00000000", 2),
    ROLE_PERMISSIONS_VIEW("1B09000000", "View Permission", "1B00000000", 2),
    ROLE_PERMISSIONS_ASSIGN("1B10000000", "Assign Permissions to Role", "1B00000000", 2),
    ROLE_PERMISSIONS_DELETE("1B11000000", "Delete Permissions", "1B00000000", 2),

    // ================= UNIT MANAGEMENT (Level 2) =================
    // Format: 1CXX000000 (Sub-Module level)
    // Unit Management sẽ không hiển thị trong Permission Tree của franchisee site
    UNIT_VIEW("1C01000000", "View Tenants", "1C00000000", 2),
    UNIT_CREATE("1C02000000", "Create Tenant", "1C00000000", 2),
    UNIT_UPDATE("1C03000000", "Update Tenant", "1C00000000", 2),
    UNIT_DELETE("1C04000000", "Delete Tenant", "1C00000000", 2),

    // ================= DASHBOARD MANAGEMENT (Level 2) =================
    // Format: 1DXX000000 (Sub-Module level)
    DASHBOARD_VIEW("1D01000000", "View Dashboard", "1D00000000", 2),

    // ================= QUOTE MANAGEMENT (Level 2) =================
    // Format: 1EXX000000 (Sub-Module level)
    QUOTE_VIEW("1E01000000", "View Quotes", "1E00000000", 2),
    QUOTE_CREATE("1E02000000", "Create Quote", "1E00000000", 2),
    QUOTE_UPDATE("1E03000000", "Edit Quote", "1E00000000", 2),
    QUOTE_DELETE("1E04000000", "Delete Quote", "1E00000000", 2),
    QUOTE_SEND("1E05000000", "Send Quote", "1E00000000", 2),
    QUOTE_APPROVE("1E06000000", "Approve Quote", "1E00000000", 2),
    QUOTE_CONVERT_TO_JOB("1E07000000", "Convert Quote To Job", "1E00000000", 2),
    QUOTE_CLONE("1E08000000", "Clone Quote", "1E00000000", 2),
    QUOTE_EXPORT("1E09000000", "Export Quote", "1E00000000", 2),
    QUOTE_ARCHIVE("1E10000000", "Archive Quote", "1E00000000", 2),
    QUOTE_MODIFY_PRICE("1E11000000", "Modify Quote Item Price", "1E00000000", 2),


    // ================= PAYMENT CONFIGURATION (Level 2) =================
    // Format: 1FXX000000 (Sub-Module level)
    PAYMENT_CONFIG_VIEW("1F01000000", "View Payment Configuration", "1F00000000", 2),
    PAYMENT_CONFIG_UPDATE("1F02000000", "Update Payment Configuration", "1F00000000", 2),


    // ================= INVOICE MANAGEMENT (Level 2) =================
    // Format: 1GXX000000 (Sub-Module level)
    INVOICE_VIEW("1G01000000", "View Invoices", "1G00000000", 2),
    INVOICE_CREATE("1G02000000", "Generate Invoice", "1G00000000", 2),
    INVOICE_PAYMENT_REQUEST_ASSIGN("1G03000000", "Assign Payment Requests", "1G00000000", 2),
    INVOICE_PAYMENT_RECORD("1G04000000", "Record Payment", "1G00000000", 2),
    INVOICE_PAYMENT_CANCEL("1G05000000", "Cancel Payment", "1G00000000", 2),
    INVOICE_PAYMENT_HISTORY_VIEW("1G06000000", "View Payment History", "1G00000000", 2),

    // ================= CUSTOMER MANAGEMENT (Level 2) =================
    // Format: 1HXX000000 (Sub-Module level)
    CUSTOMER_VIEW("1H01000000", "View Customers", "1H00000000", 2),
    CUSTOMER_CREATE("1H02000000", "Create Customer", "1H00000000", 2),
    CUSTOMER_UPDATE("1H03000000", "Update Customer", "1H00000000", 2),
    CUSTOMER_DELETE("1H04000000", "Delete Customer", "1H00000000", 2),
    CUSTOMER_ARCHIVE("1H05000000", "Archive Customer", "1H00000000", 2),
    CUSTOMER_IMPORT("1H06000000", "Import Customers", "1H00000000", 2),
    CUSTOMER_EXPORT("1H07000000", "Export Customers", "1H00000000", 2),

    // ================= TEAM MANAGEMENT (Level 2) =================
    // Format: 1IXX000000 (Sub-Module level)
    TEAM_VIEW("1I01000000", "View Team", "1I00000000", 2),
    TEAM_CREATE("1I02000000", "Create Team Member", "1I00000000", 2),
    TEAM_UPDATE("1I03000000", "Update Team Member", "1I00000000", 2),
    TEAM_DEACTIVATE("1I04000000", "Deactivate/Reactivate Team Member", "1I00000000", 2),
    TEAM_EXPORT("1I05000000", "Export Team List", "1I00000000", 2),
    TEAM_PAY_RATE_VIEW("1I06000000", "View Pay Rate", "1I00000000", 2),
    TEAM_PAY_RATE_UPDATE("1I07000000", "Update Pay Rate", "1I00000000", 2),

    // ================= PRICEBOOK MANAGEMENT (Level 2) =================
    // Format: 1JXX000000 (Sub-Module level)
    PRICEBOOK_VIEW("1J01000000", "View Pricebook", "1J00000000", 2),
    PRICEBOOK_CREATE("1J02000000", "Create Pricebook Item", "1J00000000", 2),
    PRICEBOOK_UPDATE("1J03000000", "Update Pricebook Item", "1J00000000", 2),
    PRICEBOOK_DELETE("1J04000000", "Delete Pricebook Item", "1J00000000", 2),
    PRICEBOOK_TOGGLE_PUBLISH("1J05000000", "Publish/Unpublish Item", "1J00000000", 2),
    PRICEBOOK_IMPORT("1J06000000", "Import Pricebook", "1J00000000", 2),

    // ================= SESSION MANAGEMENT (Level 2) =================
    // Format: 1KXX000000 (Sub-Module level)
    SESSION_VIEW("1K01000000", "View Sessions", "1K00000000", 2),
    SESSION_CREATE("1K02000000", "Create Session", "1K00000000", 2),
    SESSION_UPDATE("1K03000000", "Update Session", "1K00000000", 2),
    SESSION_DELETE("1K04000000", "Delete Session", "1K00000000", 2),
    SESSION_GENERATE("1K05000000", "Regenerate Recurrence Sessions", "1K00000000", 2),

    // ================= RECURRENCE SESSION MANAGEMENT (Level 2) =================
    // Format: 1LXX000000 (Sub-Module level)
    RECURRENCE_SESSION_VIEW("1L01000000", "View Recurrence Sessions", "1L00000000", 2),
    RECURRENCE_SESSION_UPDATE("1L02000000", "Update Recurrence Session", "1L00000000", 2),
    RECURRENCE_SESSION_CANCEL("1L03000000", "Cancel Recurrence Session", "1L00000000", 2),
    RECURRENCE_SESSION_STAFF_OVERRIDE("1L04000000", "Override Staff Assignment", "1L00000000", 2),
    RECURRENCE_SESSION_ENROLL("1L05000000", "Enroll Attendee", "1L00000000", 2),
    RECURRENCE_SESSION_TRANSFER_ATTENDEE("1L06000000", "Transfer Attendee", "1L00000000", 2),
    RECURRENCE_SESSION_REMOVE_ATTENDEE("1L07000000", "Remove Attendee", "1L00000000", 2),

    // Session Slots (within Recurrence Sessions)
    SESSION_SLOT_VIEW("1L08000000", "View Session Slots", "1L00000000", 2),
    SESSION_SLOT_GENERATE("1L09000000", "Generate Session Slots", "1L00000000", 2),
    SESSION_SLOT_UPDATE("1L10000000", "Update Session Slot", "1L00000000", 2),
    SESSION_SLOT_CANCEL("1L11000000", "Cancel Session Slot", "1L00000000", 2),
    SESSION_SLOT_STAFF_OVERRIDE("1L12000000", "Override Session Slot Staff", "1L00000000", 2),
    SESSION_SLOT_TRANSFER_ATTENDEE("1L13000000", "Transfer Session Slot Attendee", "1L00000000", 2),
    SESSION_SLOT_REMOVE_ATTENDEE("1L14000000", "Remove Session Slot Attendee", "1L00000000", 2),

    // ================= JOB MANAGEMENT (Level 2) =================
    // Format: 1MXX000000 (Sub-Module level)
    JOB_VIEW("1M01000000", "View Jobs", "1M00000000", 2),
    JOB_CREATE("1M02000000", "Create Job", "1M00000000", 2),
    JOB_UPDATE("1M03000000", "Update Job", "1M00000000", 2),
    JOB_DEACTIVATE("1M04000000", "Deactivate Job", "1M00000000", 2),
    JOB_LINK_SESSION("1M05000000", "Link Session to Job", "1M00000000", 2),
    JOB_UNLINK_SESSION("1M06000000", "Unlink Session from Job", "1M00000000", 2),

    // ================= SCHEDULE MANAGEMENT (Level 2) =================
    // Format: 1NXX000000 (Sub-Module level)
    SCHEDULE_CALENDAR_VIEW("1N01000000", "View Schedule Calendar", "1N00000000", 2),
    SCHEDULE_CALENDAR_UPDATE("1N02000000", "Update Schedule Calendar", "1N00000000", 2),
    MY_CALENDAR_VIEW("1N03000000", "View My Calendar", "1N00000000", 2),

    // ================= TIMESHEET MANAGEMENT (Level 2) =================
    // Format: 1OXX000000 (Sub-Module level)
    TIMESHEET_MY_VIEW("1O01000000", "View My Timesheet", "1O00000000", 2),
    TIMESHEET_MANAGER_VIEW("1O02000000", "View All Timesheets", "1O00000000", 2),
    TIMESHEET_OVERVIEW_VIEW("1O03000000", "View Timesheet Overview", "1O00000000", 2),
    TIMESHEET_APPROVE_DECLINE("1O04000000", "Approve/Decline Timesheets", "1O00000000", 2),
    TIMESHEET_EXPORT("1O05000000", "Export Timesheets", "1O00000000", 2);

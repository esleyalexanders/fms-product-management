# Email Templates - Customer Communications

This folder contains HTML email templates for customer-facing communications from Sunshine Tutoring.

## 📧 Available Templates

### Must-Have Templates

1. **email_quote_sent.html** - Quote sent to customer
   - Sent when: Quote status changes to "Sent"
   - Includes: Quote details, portal link, valid until date
   - Attachment: Quote PDF

2. **email_invoice_sent.html** - Invoice created and sent
   - Sent when: Invoice is created and sent to customer
   - Includes: Invoice details, payment methods, due date, payment link
   - Attachment: Invoice PDF

3. **email_payment_received.html** - Payment receipt
   - Sent when: Payment is recorded (full or partial)
   - Includes: Payment confirmation, transaction details, receipt
   - Attachment: Receipt PDF

4. **email_payment_reminder.html** - Payment reminder (before due date)
   - Sent when: X days before due date (configurable: 7, 3, 1 day)
   - Includes: Invoice details, due date, payment link
   - Purpose: Friendly reminder before payment becomes overdue

5. **email_payment_overdue.html** - Overdue payment notice
   - Sent when: Invoice becomes overdue (immediate, then recurring)
   - Includes: Overdue amount, days overdue, late fees (if applicable), payment link
   - Purpose: Urgent notice for overdue payments

## 🎨 Design Features

- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Email Client Compatible**: Uses table-based layout for maximum compatibility
- **Inline CSS**: All styles are inline for email client support
- **Professional Branding**: Consistent Sunshine Tutoring branding
- **Clear Call-to-Actions**: Prominent buttons for key actions
- **Accessible**: Proper HTML structure and semantic markup

## 🔧 Template Variables

All templates use placeholder variables in the format `{{variable_name}}` that should be replaced with actual data when sending emails.

### Common Variables

- `{{customer_name}}` - Customer's full name
- `{{customer_email}}` - Customer's email address
- `{{current_year}}` - Current year (e.g., 2024)

### Quote-Specific Variables

- `{{quote_id}}` - Quote number (e.g., Q-2024-001)
- `{{quote_date}}` - Quote creation date
- `{{valid_until_date}}` - Quote expiration date
- `{{total_amount}}` - Total quote amount (formatted currency)
- `{{quote_portal_link}}` - Link to view quote online

### Invoice-Specific Variables

- `{{invoice_id}}` - Invoice number (e.g., INV-2024-001)
- `{{invoice_date}}` - Invoice creation date
- `{{due_date}}` - Payment due date
- `{{amount_due}}` - Amount due (formatted currency)
- `{{payment_link}}` - Link to pay invoice online
- `{{quote_reference}}` - Related quote ID (optional)
- `{{payment_methods}}` - Array of accepted payment methods

### Payment-Specific Variables

- `{{payment_date}}` - Date payment was received
- `{{payment_method}}` - Payment method used
- `{{amount_paid}}` - Amount paid (formatted currency)
- `{{transaction_reference}}` - Transaction ID/reference (optional)
- `{{remaining_balance}}` - Remaining balance if partial payment
- `{{is_full_payment}}` - Boolean: true if full payment
- `{{is_partial_payment}}` - Boolean: true if partial payment

### Reminder/Overdue Variables

- `{{days_until_due}}` - Number of days until due date
- `{{days_overdue}}` - Number of days overdue
- `{{late_fee}}` - Late fee amount (if applicable)

## 📝 Usage Example

```javascript
// Example: Send quote email
const template = loadTemplate('email_quote_sent.html');
const html = template
    .replace(/\{\{customer_name\}\}/g, 'John Doe')
    .replace(/\{\{customer_email\}\}/g, 'john@example.com')
    .replace(/\{\{quote_id\}\}/g, 'Q-2024-001')
    .replace(/\{\{quote_date\}\}/g, 'Nov 10, 2024')
    .replace(/\{\{valid_until_date\}\}/g, 'Dec 10, 2024')
    .replace(/\{\{total_amount\}\}/g, '$825.00')
    .replace(/\{\{quote_portal_link\}\}/g, 'https://portal.example.com/quote/Q-2024-001')
    .replace(/\{\{current_year\}\}/g, '2024');

sendEmail({
    to: 'john@example.com',
    subject: 'Your Quote from Sunshine Tutoring - Q-2024-001',
    html: html,
    attachments: ['quote_Q-2024-001.pdf']
});
```

## 🎯 Email Client Compatibility

These templates are designed to work with:
- ✅ Gmail (Web, iOS, Android)
- ✅ Outlook (Desktop, Web, Mobile)
- ✅ Apple Mail (macOS, iOS)
- ✅ Yahoo Mail
- ✅ Thunderbird
- ✅ Most modern email clients

## 📱 Mobile Responsive

Templates are optimized for mobile viewing:
- Maximum width: 600px
- Touch-friendly buttons (minimum 44px height)
- Readable font sizes (minimum 14px)
- Proper spacing for mobile screens

## 🔒 Security Considerations

- All links should use HTTPS
- Payment links should include secure tokens
- Portal links should expire after a set period
- Never include sensitive information in email body

## 🎨 Customization

To customize templates:
1. Update company name/branding in header section
2. Modify color scheme (update gradient colors)
3. Adjust contact information in footer
4. Update ABN/legal information as needed

## 📋 Template Structure

Each template follows this structure:
1. **Header** - Company branding with gradient background
2. **Greeting** - Personalized customer name
3. **Main Message** - Context and information
4. **Details Box** - Highlighted information box
5. **Call-to-Action** - Prominent button for key action
6. **Additional Info** - Helpful information or notices
7. **Closing** - Professional sign-off
8. **Footer** - Contact information and legal disclaimers

## 🚀 Next Steps

1. Integrate templates with email sending service (SendGrid, Mailgun, AWS SES, etc.)
2. Set up template variable replacement system
3. Configure email sending triggers in application
4. Test templates across different email clients
5. Set up email tracking and analytics

## 📞 Support

For questions or issues with email templates, contact the development team.

---

**Last Updated:** November 2024  
**Version:** 1.0  
**Status:** Production Ready





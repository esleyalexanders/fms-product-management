/**
 * Data Seed Script
 * Populates localStorage with sample data for Quotes, Invoices, and Sessions.
 * Combines previously hardcoded Home Page data with System sample data.
 */

(function seedData() {
    console.log('Checking if data seeding is required...');

    // --- 1. Quotes Data ---
    if (!localStorage.getItem('quotes') || !localStorage.getItem('quotes_v2_seeded')) {
        console.log('Seeding Quotes...');

        const today = new Date();
        const yesterday = new Date(today); yesterday.setDate(today.getDate() - 1);
        const twoDaysAgo = new Date(today); twoDaysAgo.setDate(today.getDate() - 2);

        const quotes = [
            // Home Page Preserved Items
            {
                id: 'Q-2024-045',
                customerName: 'John Doe',
                serviceName: 'Math Tutoring Package',
                totalAmount: 1200.00,
                status: 'sent',
                dateCreated: twoDaysAgo.toISOString().split('T')[0],
                validUntil: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            },
            {
                id: 'Q-2024-046',
                customerName: 'Mike Johnson',
                serviceName: 'Physics Tutoring',
                totalAmount: 2400.00,
                status: 'sent',
                dateCreated: yesterday.toISOString().split('T')[0],
                validUntil: new Date(today.getTime() + 14 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]
            },
            // System Sample Data (from quote_list_simple.html)
            { id: 'Q-2024-001', customerName: 'Michael Chen', totalAmount: 750.00, status: 'draft', dateCreated: '2025-11-05' },
            { id: 'Q-2024-002', customerName: 'Lisa Anderson', totalAmount: 1250.00, status: 'draft', dateCreated: '2025-11-04' },
            { id: 'Q-2024-003', customerName: 'Sarah Johnson', totalAmount: 412.50, status: 'sent', dateCreated: '2025-11-03' },
            { id: 'Q-2024-007', customerName: 'Sarah Johnson', totalAmount: 3250.00, status: 'accepted', dateCreated: '2025-10-29' }
        ];

        localStorage.setItem('quotes', JSON.stringify(quotes));
        localStorage.setItem('quotes_v2_seeded', 'true');
    }

    // --- 2. Invoices Data ---
    if (!localStorage.getItem('invoices') || !localStorage.getItem('invoices_v2_seeded')) {
        console.log('Seeding Invoices...');

        const today = new Date();
        const dueIn3Days = new Date(today); dueIn3Days.setDate(today.getDate() + 3);
        const overdue5Days = new Date(today); overdue5Days.setDate(today.getDate() - 5);

        const invoices = [
            // Home Page Preserved Items
            {
                id: 'INV-2024-089',
                customerName: 'Sarah Williams',
                serviceName: 'English Classes',
                totalAmount: 850.00,
                status: 'unpaid',
                dueDate: dueIn3Days.toISOString().split('T')[0]
            },
            {
                id: 'INV-2024-082',
                customerName: 'Emma Thompson',
                serviceName: 'Group Classes',
                totalAmount: 1500.00,
                status: 'overdue',
                dueDate: overdue5Days.toISOString().split('T')[0]
            },
            // System Sample Data (from invoice_list_simple.html)
            { id: 'INV-2024-001', customerName: 'Alice Anderson', totalAmount: 341.00, status: 'unpaid', dueDate: '2024-12-01' },
            { id: 'INV-2024-002', customerName: 'Bob Brown', totalAmount: 500.00, status: 'unpaid', dueDate: '2024-11-16' },
            { id: 'INV-2024-003', customerName: 'Carol Chen', totalAmount: 750.00, status: 'overdue', dueDate: '2024-10-30' },
            { id: 'INV-2024-004', customerName: 'David Davis', totalAmount: 299.00, status: 'paid', dueDate: '2024-12-05' }
        ];

        localStorage.setItem('invoices', JSON.stringify(invoices));
        localStorage.setItem('invoices_v2_seeded', 'true');
    }

    // --- 3. Sessions Data ---
    if (!localStorage.getItem('sessions') || !localStorage.getItem('sessions_v2_seeded')) {
        console.log('Seeding Sessions...');

        const today = new Date();
        const tomorrow = new Date(today); tomorrow.setDate(today.getDate() + 1);

        // Helper to format date string YYYY-MM-DD
        const dateStr = (d) => d.toISOString().split('T')[0];

        const sessions = [
            // Today's Sessions (Home Page Preserved)
            {
                id: 'SES-001',
                title: 'Math Tutoring - Grade 5',
                customerName: 'Sarah Williams',
                type: 'individual', // Maps to purple/book-reader
                date: dateStr(today),
                startTime: '14:00',
                endTime: '15:00',
                status: 'scheduled'
            },
            {
                id: 'SES-002',
                title: 'English Class - Intermediate',
                customerName: 'Group Session',
                type: 'group', // Maps to blue/users
                date: dateStr(today),
                startTime: '16:00',
                endTime: '17:30',
                status: 'scheduled'
            },
            // Tomorrow's Sessions
            {
                id: 'SES-003',
                title: 'Physics - Advanced',
                customerName: 'Mike Johnson',
                type: 'science', // Maps to amber/calculator
                date: dateStr(tomorrow),
                startTime: '10:00',
                endTime: '11:00',
                status: 'scheduled'
            },
            {
                id: 'SES-004',
                title: 'Spanish Conversation',
                customerName: 'Emma Thompson',
                type: 'language', // Maps to green/language
                date: dateStr(tomorrow),
                startTime: '15:00',
                endTime: '16:00',
                status: 'scheduled'
            },
            // Some extra sessions for "Week" stats
            {
                id: 'SES-005',
                title: 'Chem Lab',
                customerName: 'Class 3B',
                type: 'science',
                date: dateStr(new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000)), // Day after tomorrow
                startTime: '09:00',
                endTime: '10:30',
                status: 'scheduled'
            }
        ];

        localStorage.setItem('sessions', JSON.stringify(sessions));
        localStorage.setItem('sessions_v2_seeded', 'true');
    }

    // Dispatch event so other components know data is ready
    window.dispatchEvent(new CustomEvent('dataSeeded'));
})();

/**
 * Seed Data Script for Timesheet Manager
 * Call window.seedFmsData() to populate data.
 */
window.seedFmsData = function () {
    console.log("Seeding data...");

    // 1. Seed Staff
    const staff = [
        { id: 'STAFF-001', firstName: 'Daniel', lastName: 'Davis', role: 'Instructor', status: 'active', hourlyRate: 50 },
        { id: 'STAFF-002', firstName: 'Sarah', lastName: 'Johnson', role: 'Instructor', status: 'active', hourlyRate: 55 },
        { id: 'STAFF-003', firstName: 'Michael', lastName: 'Chen', role: 'Instructor', status: 'active', hourlyRate: 45 },
        { id: 'STAFF-004', firstName: 'Emily', lastName: 'Rodriguez', role: 'Instructor', status: 'active', hourlyRate: 60 },
        { id: 'STAFF-005', firstName: 'James', lastName: 'Wilson', role: 'Instructor', status: 'active', hourlyRate: 50 }
    ];
    localStorage.setItem('fms_staff', JSON.stringify(staff));
    console.log("Seeded fms_staff");

    // 2. Seed Sessions (Current Month)
    const now = new Date();
    const year = now.getFullYear();
    const month = String(now.getMonth() + 1).padStart(2, '0');

    // Create dates in current month
    const d1 = `${year}-${month}-02`;
    const d2 = `${year}-${month}-03`;
    const d3 = `${year}-${month}-05`;
    const d4 = `${year}-${month}-10`;

    const sessions = [
        {
            id: 'SES-1001',
            title: 'Intro to Python',
            learningServiceName: 'Intro to Python',
            type: 'Class',
            date: d1,
            startTime: '09:00',
            endTime: '11:00',
            duration: 120,
            assignedStaff: [{ id: 'STAFF-001', name: 'Daniel Davis' }],
            status: 'completed'
        },
        {
            id: 'SES-1002',
            title: 'Advanced AI',
            learningServiceName: 'Advanced AI',
            type: 'Class',
            date: d1,
            startTime: '13:00',
            endTime: '16:00',
            duration: 180,
            assignedStaff: [{ id: 'STAFF-002', name: 'Sarah Johnson' }],
            status: 'completed'
        },
        {
            id: 'SES-1003',
            title: 'Web Dev Bootcamp',
            learningServiceName: 'Web Dev Bootcamp',
            type: 'Workshop',
            date: d2,
            startTime: '10:00',
            endTime: '15:00',
            duration: 300,
            assignedStaff: [
                { id: 'STAFF-001', name: 'Daniel Davis' },
                { id: 'STAFF-003', name: 'Michael Chen' }
            ],
            status: 'scheduled'
        },
        {
            id: 'SES-1004',
            title: 'Data Science 101',
            learningServiceName: 'Data Science 101',
            type: 'Class',
            date: d3,
            startTime: '09:00',
            endTime: '10:30',
            duration: 90,
            assignedStaff: [{ id: 'STAFF-004', name: 'Emily Rodriguez' }],
            status: 'completed'
        },
        {
            id: 'SES-1005',
            title: 'React Fundamentals',
            learningServiceName: 'React Fundamentals',
            type: 'Class',
            date: d4,
            startTime: '14:00',
            endTime: '16:00',
            duration: 120,
            assignedStaff: [{ id: 'STAFF-005', name: 'James Wilson' }],
            status: 'scheduled'
        }
    ];

    localStorage.setItem('fms_sessions', JSON.stringify(sessions));
    console.log("Seeded fms_sessions");

    // 3. Seed Time Entries (Mixed Statuses)
    // NOTE: This relies on payroll_store.js being loaded to use helpers if we wanted to be strictly robust,
    // but here we will write raw JSON to fms_time_entries to ensure we get exactly what we want.

    const timeEntries = [
        // 1. Approved Entry (SES-1001 / Daniel)
        {
            id: 'te_seed_001',
            sessionId: 'SES-1001',
            staffId: 'STAFF-001',
            scheduledStart: `${d1}T09:00:00`,
            scheduledEnd: `${d1}T11:00:00`,
            actualStart: `${d1}T09:00:00`,
            actualEnd: `${d1}T11:00:00`,
            breakMinutes: 0,
            workedMinutes: 120,
            paidMinutes: 120,
            managerApprovedMinutes: 120,
            status: 'approved',
            exceptions: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        // 2. Declined Entry (SES-1002 / Sarah)
        {
            id: 'te_seed_002',
            sessionId: 'SES-1002',
            staffId: 'STAFF-002',
            scheduledStart: `${d1}T13:00:00`,
            scheduledEnd: `${d1}T16:00:00`,
            actualStart: `${d1}T13:00:00`,
            actualEnd: `${d1}T16:30:00`, // Overtime?
            breakMinutes: 0,
            workedMinutes: 210,
            paidMinutes: 0,
            managerApprovedMinutes: 0,
            managerNote: 'Please verify end time.',
            status: 'declined',
            exceptions: ['missing_scheduled_time'], // Just simulating check
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        // 3. Draft/Needs Action (SES-1003 / Daniel)
        {
            id: 'te_seed_003',
            sessionId: 'SES-1003',
            staffId: 'STAFF-001',
            scheduledStart: `${d2}T10:00:00`,
            scheduledEnd: `${d2}T15:00:00`,
            actualStart: `${d2}T10:00:00`,
            actualEnd: `${d2}T15:00:00`,
            breakMinutes: 30,
            workedMinutes: 270,
            paidMinutes: 0,
            managerApprovedMinutes: null,
            status: 'draft',
            exceptions: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        // 4. Submitted (SES-1003 / Michael)
        {
            id: 'te_seed_004',
            sessionId: 'SES-1003',
            staffId: 'STAFF-003',
            scheduledStart: `${d2}T10:00:00`,
            scheduledEnd: `${d2}T15:00:00`,
            actualStart: `${d2}T10:00:00`,
            actualEnd: `${d2}T15:00:00`,
            breakMinutes: 0,
            workedMinutes: 300,
            paidMinutes: 300,
            managerApprovedMinutes: null,
            status: 'submitted',
            exceptions: [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        // 5. Exception (Missing End Time) (SES-1004 / Emily)
        {
            id: 'te_seed_005',
            sessionId: 'SES-1004',
            staffId: 'STAFF-004',
            scheduledStart: `${d3}T09:00:00`,
            scheduledEnd: `${d3}T10:30:00`,
            actualStart: `${d3}T09:00:00`,
            actualEnd: '',
            breakMinutes: 0,
            workedMinutes: 0,
            paidMinutes: 0,
            managerApprovedMinutes: null,
            status: 'draft',
            exceptions: ['missing_end'],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];

    localStorage.setItem('fms_time_entries', JSON.stringify(timeEntries));
    console.log("Seeded fms_time_entries with mixed statuses");

    alert("Data seeded with mixed statuses! Please refresh the page.");
};

// Assignment Calendar Script
// Manager calendar with CRUD functionality for jobs and class sessions

// State
// Set to December 9th, 2025 for demo purposes
let currentDate = new Date(2025, 11, 9); // December 9th, 2025 (month is 0-indexed)
let currentView = 'month';
let allEvents = []; // Combined jobs and sessions
let filteredEvents = [];
let selectedEvent = null;
let editingEvent = null;
let dragState = null;
let classSelectedStaff = []; // Staff selected for class creation
let selectedPricebookItem = null; // Selected pricebook item for class creation
let sessionSelectedStaff = []; // Staff selected for session editing

// Filters
let filters = {
    jobs: true,
    sessions: true,
    scheduled: true,
    inProgress: true,
    completed: true
};

// Staff filter for multi-select
let staffFilter = []; // Array of staff names

// Sample staff for assignment
const sampleStaff = [
    { id: 'STAFF-001', name: 'Daniel Davis', email: 'daniel.davis@example.com', role: 'Instructor', department: 'Math' },
    { id: 'STAFF-002', name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'Instructor', department: 'Science' },
    { id: 'STAFF-003', name: 'Michael Chen', email: 'michael.chen@example.com', role: 'Instructor', department: 'Math' },
    { id: 'STAFF-004', name: 'Emily Rodriguez', email: 'emily.r@example.com', role: 'Instructor', department: 'Yoga' },
    { id: 'STAFF-005', name: 'James Wilson', email: 'james.w@example.com', role: 'Instructor', department: 'Guitar' }
];

// Sample customers for enrollment booking
const sampleCustomers = [
    {
        id: 'CUST-001',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+61 400 123 456',
        quotes: [
            { id: 'Q-2025-001', pricebookItemId: 'PB-YOGA-AEROBIC', quantity: 5, total: 100.00, status: 'approved', paymentStatus: 'paid', amountPaid: 100.00 },
            { id: 'Q-2025-002', pricebookItemId: 'PB-YOGA-AEROBIC', quantity: 3, total: 60.00, status: 'approved', paymentStatus: 'partial', amountPaid: 30.00 },
            { id: 'Q-2025-010', pricebookItemId: 'PB-YOGA-CLASS', quantity: 4, total: 200.00, status: 'approved', paymentStatus: 'paid', amountPaid: 200.00 }
        ]
    },
    {
        id: 'CUST-002',
        name: 'Michael Chen',
        email: 'm.chen@email.com',
        phone: '+61 400 234 567',
        quotes: [
            { id: 'Q-2025-003', pricebookItemId: 'PB-MATH-TUTORING', quantity: 10, total: 500.00, status: 'approved', paymentStatus: 'paid', amountPaid: 500.00 },
            { id: 'Q-2025-011', pricebookItemId: 'PB-ALGEBRA-II', quantity: 6, total: 1080.00, status: 'approved', paymentStatus: 'partial', amountPaid: 540.00 }
        ]
    },
    {
        id: 'CUST-003',
        name: 'Emma Williams',
        email: 'emma.w@email.com',
        phone: '+61 400 345 678',
        quotes: [
            { id: 'Q-2025-004', pricebookItemId: 'PB-YOGA-CLASS', quantity: 8, total: 400.00, status: 'approved', paymentStatus: 'paid', amountPaid: 400.00 }
        ]
    },
    {
        id: 'CUST-004',
        name: 'David Brown',
        email: 'david.b@email.com',
        phone: '+61 400 456 789',
        quotes: [
            { id: 'Q-2025-005', pricebookItemId: 'PB-MATH-TUTORING', quantity: 12, total: 600.00, status: 'approved', paymentStatus: 'paid', amountPaid: 600.00 }
        ]
    }
];

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    initializeCalendar();
    setupEventListeners();
});

function initializeCalendar() {
    // Initialize sample data if needed
    initializeSampleData();

    // Load events
    loadEvents();

    // Initialize staff filter
    initializeStaffFilter();

    // Render initial view
    switchView('month');

    // Update current time indicator in week/day view
    updateCurrentTimeIndicator();
    setInterval(updateCurrentTimeIndicator, 60000); // Update every minute
}

function setupEventListeners() {
    // Search
    document.getElementById('searchInput').addEventListener('input', function (e) {
        applyFilters();
    });

    // Click outside to close modals
    document.addEventListener('click', function (e) {
        if (!e.target.closest('#eventModal') && !e.target.closest('[onclick*="show"]')) {
            closeEventPopover();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeEventModal();
            closeEventPopover();
        } else if (e.key === 'c' && !e.target.matches('input, textarea')) {
            showCreateEventModal();
        } else if (e.key === 't' && !e.target.matches('input, textarea')) {
            navigateCalendar('today');
        }
    });
}

// ==================== Data Loading ====================

function loadEvents() {
    allEvents = [];

    // Load jobs
    try {
        const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        jobs.forEach(job => {
            const eventDate = job.scheduleDate || job.date;
            if (eventDate) {
                let timeStr = job.scheduleTime || job.time || '00:00';
                timeStr = normalizeTime(timeStr);

                allEvents.push({
                    id: job.id,
                    type: 'job',
                    title: job.title || job.customerName || job.id,
                    description: job.description || '',
                    date: eventDate,
                    time: timeStr,
                    endTime: job.endTime ? normalizeTime(job.endTime) : null,
                    duration: job.duration || '',
                    customer: job.customerName || job.customer || '',
                    address: job.address || '',
                    status: job.status || 'scheduled',
                    priority: job.priority || 'normal',
                    notes: job.notes || '',
                    assignedTo: job.assignedTo || '',
                    assignedStaff: job.assignedStaff || [],
                    data: job
                });
            }
        });
    } catch (error) {
        console.error('Error loading jobs:', error);
    }

    // Load class sessions
    try {
        const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        const classes = JSON.parse(localStorage.getItem('classes_v2') || '[]');

        // Set today to December 9th, 2025 for preview calculation
        const today = new Date(2025, 11, 9); // December 9th, 2025 (month is 0-indexed)
        today.setHours(0, 0, 0, 0);
        const oneWeekFromNow = new Date(today);
        oneWeekFromNow.setDate(oneWeekFromNow.getDate() + 7); // December 16th

        sessions.forEach(session => {
            const classData = classes.find(c => c.id === session.classId);
            const eventDate = session.date;
            if (eventDate) {
                // Check if session is on or after 1 week from today - mark as preview
                // Sessions on Dec 16 or later should be previews (future sessions not yet created)
                const sessionDate = new Date(eventDate);
                sessionDate.setHours(0, 0, 0, 0);
                // Mark as preview if session date is 6+ days in the future (Dec 15+)
                // This makes Dec 15 and 16 previews since they're future sessions not yet created
                const sixDaysFromNow = new Date(today);
                sixDaysFromNow.setDate(sixDaysFromNow.getDate() + 6); // Dec 15
                const isBeyondOneWeek = sessionDate >= sixDaysFromNow;

                allEvents.push({
                    id: session.id,
                    type: 'session',
                    title: classData ? classData.name : 'Class Session',
                    description: classData ? classData.description : '',
                    date: eventDate,
                    time: session.startTime || '00:00',
                    endTime: session.endTime || null,
                    duration: session.duration ? `${session.duration} min` : '',
                    classId: session.classId,
                    className: classData ? classData.name : '',
                    status: isBeyondOneWeek ? 'preview' : (session.status || 'scheduled'),
                    capacity: session.maxCapacity || classData?.maxCapacity || 0,
                    confirmedSlots: session.confirmedSlots || 0,
                    notes: session.notes || '',
                    assignedStaff: session.assignedStaff || [],
                    isPreview: isBeyondOneWeek,
                    data: session
                });
            }
        });
    } catch (error) {
        console.error('Error loading sessions:', error);
    }

    // Generate PREVIEW events for future class sessions (beyond 1 week)
    // These are classes that will have sessions but aren't created yet
    try {
        const classes = JSON.parse(localStorage.getItem('classes_v2') || '[]');
        const existingSessionIds = new Set(allEvents.filter(e => e.type === 'session').map(e => e.id));

        // Set today to December 9th, 2025 for preview calculation
        const today = new Date(2025, 11, 9); // December 9th, 2025 (month is 0-indexed)
        today.setHours(0, 0, 0, 0);

        // Preview window: from 6 days from now to 8 weeks ahead (adjust as needed)
        // Sessions 6+ days in the future (Dec 15+) should be previews
        // Start generating previews from Dec 15 (6 days from today)
        const previewStartDate = new Date(today);
        previewStartDate.setDate(previewStartDate.getDate() + 6); // Dec 15 (6 days from today)

        const previewEndDate = new Date(today);
        previewEndDate.setDate(previewEndDate.getDate() + 56); // Preview up to 8 weeks ahead

        classes.forEach(cls => {
            if (!cls.schedule || cls.status === 'archived') return;

            const { frequency, daysOfWeek, startTime, endTime } = cls.schedule;
            if (!daysOfWeek || daysOfWeek.length === 0) return;

            // Generate preview sessions for each day in the preview window
            const dayMap = {
                'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
                'Thursday': 4, 'Friday': 5, 'Saturday': 6
            };

            const scheduledDays = daysOfWeek.map(d => dayMap[d]).filter(d => d !== undefined);

            // Loop through preview dates
            let currentDate = new Date(previewStartDate);
            while (currentDate <= previewEndDate) {
                if (scheduledDays.includes(currentDate.getDay())) {
                    const dateStr = currentDate.toISOString().split('T')[0];
                    const previewEventId = `PREVIEW-${cls.id}-${dateStr}`;

                    // Skip if a real session already exists for this date/class
                    const hasRealSession = allEvents.some(e =>
                        e.type === 'session' &&
                        e.classId === cls.id &&
                        e.date === dateStr
                    );

                    if (!hasRealSession) {
                        allEvents.push({
                            id: previewEventId,
                            type: 'session',
                            title: cls.name,
                            description: cls.description || '',
                            date: dateStr,
                            time: startTime || '09:00',
                            endTime: endTime || null,
                            duration: cls.schedule.duration ? `${cls.schedule.duration} min` : '',
                            classId: cls.id,
                            className: cls.name,
                            status: 'preview',
                            capacity: cls.maxCapacity || 0,
                            confirmedSlots: 0,
                            notes: '',
                            assignedStaff: cls.defaultStaff || [],
                            isPreview: true,
                            data: null
                        });
                    }
                }
                currentDate.setDate(currentDate.getDate() + 1);
            }
        });
    } catch (error) {
        console.error('Error generating preview sessions:', error);
    }

    // Sort events by date and time
    allEvents.sort((a, b) => {
        const dateA = new Date(`${a.date}T${a.time}`);
        const dateB = new Date(`${b.date}T${b.time}`);
        return dateA - dateB;
    });

    applyFilters();
}

function initializeSampleData() {
    // Initialize classes if empty
    try {
        const existingClasses = localStorage.getItem('classes_v2');
        if (!existingClasses || JSON.parse(existingClasses).length === 0) {
            const sampleClasses = getSampleClasses();
            localStorage.setItem('classes_v2', JSON.stringify(sampleClasses));
        }
    } catch (error) {
        console.error('Error initializing classes:', error);
    }

    // Initialize jobs if empty
    try {
        const existingJobs = localStorage.getItem('jobs');
        if (!existingJobs || JSON.parse(existingJobs).length === 0) {
            const sampleJobs = getSampleJobs();
            localStorage.setItem('jobs', JSON.stringify(sampleJobs));
        }
    } catch (error) {
        console.error('Error initializing jobs:', error);
    }

    // Initialize class sessions if empty
    try {
        const existingSessions = localStorage.getItem('class_sessions_v2');
        if (!existingSessions || JSON.parse(existingSessions).length === 0) {
            const sampleSessions = getSampleSessions();
            localStorage.setItem('class_sessions_v2', JSON.stringify(sampleSessions));
        }
    } catch (error) {
        console.error('Error initializing sessions:', error);
    }
}

function getSampleJobs() {
    return [
        {
            id: 'JOB-2025-001',
            quoteId: 'Q-2025-001',
            customerName: 'Sarah Johnson',
            customerEmail: 'sarah.j@email.com',
            scheduleDate: '2025-12-05',
            scheduleTime: '10:00',
            assignedTo: 'STAFF-001',
            assignedStaff: ['Daniel Davis'],
            status: 'scheduled',
            total: 825.00,
            description: 'Math and Science tutoring session',
            address: '123 Main St, Melbourne VIC 3000',
            priority: 'normal',
            duration: '2 hours'
        },
        {
            id: 'JOB-2025-002',
            quoteId: 'Q-2025-002',
            customerName: 'Michael Chen',
            customerEmail: 'm.chen@email.com',
            scheduleDate: '2025-12-10',
            scheduleTime: '14:00',
            assignedTo: 'STAFF-002',
            assignedStaff: ['Sarah Johnson'],
            status: 'scheduled',
            total: 450.00,
            description: 'English Literature tutoring',
            address: '456 Oak Ave, Melbourne VIC 3000',
            priority: 'normal',
            duration: '1.5 hours'
        }
    ];
}

function getSampleClasses() {
    return [
        {
            id: 'CLASS-2025-001',
            name: 'Advanced Math Tutoring',
            description: 'Comprehensive math tutoring for advanced students',
            skillLevel: 'Advanced',
            maxCapacity: 15,
            status: 'active',
            schedule: {
                frequency: 'weekly',
                daysOfWeek: ['Monday', 'Wednesday'],
                startTime: '14:00',
                endTime: '15:30',
                duration: 90
            },
            defaultStaff: [
                { id: 'STAFF-001', name: 'Daniel Davis', email: 'daniel.davis@example.com', role: 'Instructor', department: 'Math' }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'CLASS-2025-002',
            name: 'Yoga for Beginners',
            description: 'Gentle yoga class for beginners',
            skillLevel: 'Beginner',
            maxCapacity: 20,
            status: 'active',
            schedule: {
                frequency: 'weekly',
                daysOfWeek: ['Tuesday', 'Thursday'],
                startTime: '18:00',
                endTime: '19:00',
                duration: 60
            },
            defaultStaff: [
                { id: 'STAFF-004', name: 'Emily Rodriguez', email: 'emily.r@example.com', role: 'Instructor', department: 'Yoga' }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'CLASS-2025-003',
            name: 'Science Lab Session',
            description: 'Hands-on science experiments',
            skillLevel: 'Intermediate',
            maxCapacity: 12,
            status: 'active',
            schedule: {
                frequency: 'weekly',
                daysOfWeek: ['Friday'],
                startTime: '15:00',
                endTime: '16:30',
                duration: 90
            },
            defaultStaff: [
                { id: 'STAFF-002', name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'Instructor', department: 'Science' }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        },
        {
            id: 'CLASS-2025-004',
            name: 'Guitar Lessons',
            description: 'Learn to play guitar from basics',
            skillLevel: 'All levels',
            maxCapacity: 10,
            status: 'active',
            schedule: {
                frequency: 'weekly',
                daysOfWeek: ['Saturday'],
                startTime: '10:00',
                endTime: '11:30',
                duration: 90
            },
            defaultStaff: [
                { id: 'STAFF-005', name: 'James Wilson', email: 'james.w@example.com', role: 'Instructor', department: 'Guitar' }
            ],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        }
    ];
}

function getSampleSessions() {
    const classes = JSON.parse(localStorage.getItem('classes_v2') || '[]');
    const sessions = [];

    // If no classes exist, create sessions with sample class IDs
    if (classes.length === 0) {
        // Create sample sessions with different staff assignments for testing
        return [
            {
                id: 'SESSION-2025-001',
                classId: 'CLASS-2025-001',
                date: '2025-12-02',
                startTime: '14:00',
                endTime: '15:30',
                duration: 90,
                status: 'scheduled',
                maxCapacity: 15,
                confirmedSlots: 8,
                assignedStaff: [
                    { id: 'STAFF-001', name: 'Daniel Davis', email: 'daniel.davis@example.com', role: 'Instructor', department: 'Math' }
                ],
                bookings: [],
                notes: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'SESSION-2025-002',
                classId: 'CLASS-2025-001',
                date: '2025-12-04',
                startTime: '14:00',
                endTime: '15:30',
                duration: 90,
                status: 'scheduled',
                maxCapacity: 15,
                confirmedSlots: 10,
                assignedStaff: [
                    { id: 'STAFF-001', name: 'Daniel Davis', email: 'daniel.davis@example.com', role: 'Instructor', department: 'Math' },
                    { id: 'STAFF-003', name: 'Michael Chen', email: 'michael.chen@example.com', role: 'Instructor', department: 'Math' }
                ],
                bookings: [],
                notes: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'SESSION-2025-003',
                classId: 'CLASS-2025-002',
                date: '2025-12-03',
                startTime: '18:00',
                endTime: '19:00',
                duration: 60,
                status: 'scheduled',
                maxCapacity: 20,
                confirmedSlots: 15,
                assignedStaff: [
                    { id: 'STAFF-004', name: 'Emily Rodriguez', email: 'emily.r@example.com', role: 'Instructor', department: 'Yoga' }
                ],
                bookings: [],
                notes: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'SESSION-2025-004',
                classId: 'CLASS-2025-002',
                date: '2025-12-05',
                startTime: '18:00',
                endTime: '19:00',
                duration: 60,
                status: 'scheduled',
                maxCapacity: 20,
                confirmedSlots: 12,
                assignedStaff: [
                    { id: 'STAFF-004', name: 'Emily Rodriguez', email: 'emily.r@example.com', role: 'Instructor', department: 'Yoga' }
                ],
                bookings: [],
                notes: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'SESSION-2025-005',
                classId: 'CLASS-2025-003',
                date: '2025-12-06',
                startTime: '15:00',
                endTime: '16:30',
                duration: 90,
                status: 'scheduled',
                maxCapacity: 12,
                confirmedSlots: 9,
                assignedStaff: [
                    { id: 'STAFF-002', name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'Instructor', department: 'Science' }
                ],
                bookings: [
                    {
                        id: 'BOOKING-SCI-001',
                        customerId: 'CUST-002',
                        customerName: 'Michael Chen',
                        customerEmail: 'm.chen@email.com',
                        quoteId: 'Q-2025-003',
                        sessionId: 'SESSION-2025-005',
                        classId: 'CLASS-2025-003',
                        attendeeName: 'Ryan Chen',
                        studentName: 'Ryan Chen',
                        notes: '',
                        status: 'confirmed',
                        bookedAt: '2025-12-01T08:00:00Z',
                        updatedAt: '2025-12-01T08:00:00Z'
                    },
                    {
                        id: 'BOOKING-SCI-002',
                        customerId: 'CUST-004',
                        customerName: 'David Brown',
                        customerEmail: 'david.b@email.com',
                        quoteId: 'Q-2025-005',
                        sessionId: 'SESSION-2025-005',
                        classId: 'CLASS-2025-003',
                        attendeeName: 'Charlotte Brown',
                        studentName: 'Charlotte Brown',
                        notes: 'Excited about experiments',
                        status: 'confirmed',
                        bookedAt: '2025-12-02T10:00:00Z',
                        updatedAt: '2025-12-02T10:00:00Z'
                    },
                    {
                        id: 'BOOKING-SCI-003',
                        customerId: 'CUST-001',
                        customerName: 'Sarah Johnson',
                        customerEmail: 'sarah.j@email.com',
                        quoteId: 'Q-2025-001',
                        sessionId: 'SESSION-2025-005',
                        classId: 'CLASS-2025-003',
                        attendeeName: 'Grace Johnson',
                        studentName: 'Grace Johnson',
                        notes: '',
                        status: 'confirmed',
                        bookedAt: '2025-12-03T12:00:00Z',
                        updatedAt: '2025-12-03T12:00:00Z'
                    },
                    {
                        id: 'BOOKING-SCI-004',
                        customerId: 'CUST-003',
                        customerName: 'Emma Williams',
                        customerEmail: 'emma.w@email.com',
                        quoteId: 'Q-2025-004',
                        sessionId: 'SESSION-2025-005',
                        classId: 'CLASS-2025-003',
                        attendeeName: 'Mason Williams',
                        studentName: 'Mason Williams',
                        notes: '',
                        status: 'confirmed',
                        bookedAt: '2025-12-04T09:30:00Z',
                        updatedAt: '2025-12-04T09:30:00Z'
                    },
                    {
                        id: 'BOOKING-SCI-005',
                        customerId: 'CUST-002',
                        customerName: 'Michael Chen',
                        customerEmail: 'm.chen@email.com',
                        quoteId: 'Q-2025-011',
                        sessionId: 'SESSION-2025-005',
                        classId: 'CLASS-2025-003',
                        attendeeName: 'Zoe Chen',
                        studentName: 'Zoe Chen',
                        notes: '',
                        status: 'confirmed',
                        bookedAt: '2025-12-05T11:00:00Z',
                        updatedAt: '2025-12-05T11:00:00Z'
                    },
                    {
                        id: 'BOOKING-SCI-006',
                        customerId: 'CUST-004',
                        customerName: 'David Brown',
                        customerEmail: 'david.b@email.com',
                        quoteId: 'Q-2025-005',
                        sessionId: 'SESSION-2025-005',
                        classId: 'CLASS-2025-003',
                        attendeeName: 'Harper Brown',
                        studentName: 'Harper Brown',
                        notes: '',
                        status: 'confirmed',
                        bookedAt: '2025-12-06T14:00:00Z',
                        updatedAt: '2025-12-06T14:00:00Z'
                    },
                    {
                        id: 'BOOKING-SCI-007',
                        customerId: 'CUST-001',
                        customerName: 'Sarah Johnson',
                        customerEmail: 'sarah.j@email.com',
                        quoteId: 'Q-2025-002',
                        sessionId: 'SESSION-2025-005',
                        classId: 'CLASS-2025-003',
                        attendeeName: 'Aiden Johnson',
                        studentName: 'Aiden Johnson',
                        notes: '',
                        status: 'confirmed',
                        bookedAt: '2025-12-07T10:30:00Z',
                        updatedAt: '2025-12-07T10:30:00Z'
                    },
                    {
                        id: 'BOOKING-SCI-008',
                        customerId: 'CUST-003',
                        customerName: 'Emma Williams',
                        customerEmail: 'emma.w@email.com',
                        quoteId: 'Q-2025-004',
                        sessionId: 'SESSION-2025-005',
                        classId: 'CLASS-2025-003',
                        attendeeName: 'Ella Williams',
                        studentName: 'Ella Williams',
                        notes: '',
                        status: 'confirmed',
                        bookedAt: '2025-12-08T13:00:00Z',
                        updatedAt: '2025-12-08T13:00:00Z'
                    },
                    {
                        id: 'BOOKING-SCI-009',
                        customerId: 'CUST-002',
                        customerName: 'Michael Chen',
                        customerEmail: 'm.chen@email.com',
                        quoteId: 'Q-2025-003',
                        sessionId: 'SESSION-2025-005',
                        classId: 'CLASS-2025-003',
                        attendeeName: 'Lily Chen',
                        studentName: 'Lily Chen',
                        notes: 'New student',
                        status: 'confirmed',
                        bookedAt: '2025-12-08T15:00:00Z',
                        updatedAt: '2025-12-08T15:00:00Z'
                    }
                ],
                notes: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'SESSION-2025-006',
                classId: 'CLASS-2025-004',
                date: '2025-12-07',
                startTime: '10:00',
                endTime: '11:30',
                duration: 90,
                status: 'scheduled',
                maxCapacity: 10,
                confirmedSlots: 7,
                assignedStaff: [
                    { id: 'STAFF-005', name: 'James Wilson', email: 'james.w@example.com', role: 'Instructor', department: 'Guitar' }
                ],
                bookings: [
                    {
                        id: 'BOOKING-GUITAR-001',
                        customerId: 'CUST-001',
                        customerName: 'Sarah Johnson',
                        customerEmail: 'sarah.j@email.com',
                        quoteId: 'Q-2025-001',
                        sessionId: 'SESSION-2025-006',
                        classId: 'CLASS-2025-004',
                        attendeeName: 'Jackson Johnson',
                        studentName: 'Jackson Johnson',
                        notes: '',
                        status: 'confirmed',
                        bookedAt: '2025-12-01T09:00:00Z',
                        updatedAt: '2025-12-01T09:00:00Z'
                    },
                    {
                        id: 'BOOKING-GUITAR-002',
                        customerId: 'CUST-003',
                        customerName: 'Emma Williams',
                        customerEmail: 'emma.w@email.com',
                        quoteId: 'Q-2025-004',
                        sessionId: 'SESSION-2025-006',
                        classId: 'CLASS-2025-004',
                        attendeeName: 'Scarlett Williams',
                        studentName: 'Scarlett Williams',
                        notes: 'Has own guitar',
                        status: 'confirmed',
                        bookedAt: '2025-12-02T10:00:00Z',
                        updatedAt: '2025-12-02T10:00:00Z'
                    },
                    {
                        id: 'BOOKING-GUITAR-003',
                        customerId: 'CUST-002',
                        customerName: 'Michael Chen',
                        customerEmail: 'm.chen@email.com',
                        quoteId: 'Q-2025-003',
                        sessionId: 'SESSION-2025-006',
                        classId: 'CLASS-2025-004',
                        attendeeName: 'Chloe Chen',
                        studentName: 'Chloe Chen',
                        notes: '',
                        status: 'confirmed',
                        bookedAt: '2025-12-03T11:00:00Z',
                        updatedAt: '2025-12-03T11:00:00Z'
                    },
                    {
                        id: 'BOOKING-GUITAR-004',
                        customerId: 'CUST-004',
                        customerName: 'David Brown',
                        customerEmail: 'david.b@email.com',
                        quoteId: 'Q-2025-005',
                        sessionId: 'SESSION-2025-006',
                        classId: 'CLASS-2025-004',
                        attendeeName: 'Benjamin Brown',
                        studentName: 'Benjamin Brown',
                        notes: '',
                        status: 'confirmed',
                        bookedAt: '2025-12-04T08:30:00Z',
                        updatedAt: '2025-12-04T08:30:00Z'
                    },
                    {
                        id: 'BOOKING-GUITAR-005',
                        customerId: 'CUST-001',
                        customerName: 'Sarah Johnson',
                        customerEmail: 'sarah.j@email.com',
                        quoteId: 'Q-2025-002',
                        sessionId: 'SESSION-2025-006',
                        classId: 'CLASS-2025-004',
                        attendeeName: 'Amelia Johnson',
                        studentName: 'Amelia Johnson',
                        notes: '',
                        status: 'confirmed',
                        bookedAt: '2025-12-05T12:00:00Z',
                        updatedAt: '2025-12-05T12:00:00Z'
                    },
                    {
                        id: 'BOOKING-GUITAR-006',
                        customerId: 'CUST-003',
                        customerName: 'Emma Williams',
                        customerEmail: 'emma.w@email.com',
                        quoteId: 'Q-2025-004',
                        sessionId: 'SESSION-2025-006',
                        classId: 'CLASS-2025-004',
                        attendeeName: 'Henry Williams',
                        studentName: 'Henry Williams',
                        notes: '',
                        status: 'confirmed',
                        bookedAt: '2025-12-06T09:45:00Z',
                        updatedAt: '2025-12-06T09:45:00Z'
                    },
                    {
                        id: 'BOOKING-GUITAR-007',
                        customerId: 'CUST-002',
                        customerName: 'Michael Chen',
                        customerEmail: 'm.chen@email.com',
                        quoteId: 'Q-2025-011',
                        sessionId: 'SESSION-2025-006',
                        classId: 'CLASS-2025-004',
                        attendeeName: 'Victoria Chen',
                        studentName: 'Victoria Chen',
                        notes: 'Intermediate level',
                        status: 'confirmed',
                        bookedAt: '2025-12-07T14:00:00Z',
                        updatedAt: '2025-12-07T14:00:00Z'
                    }
                ],
                notes: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'SESSION-2025-007',
                classId: 'CLASS-2025-001',
                date: '2025-12-09',
                startTime: '14:00',
                endTime: '15:30',
                duration: 90,
                status: 'scheduled',
                maxCapacity: 15,
                confirmedSlots: 11,
                assignedStaff: [
                    { id: 'STAFF-001', name: 'Daniel Davis', email: 'daniel.davis@example.com', role: 'Instructor', department: 'Math' }
                ],
                bookings: [
                    {
                        id: 'BOOKING-001',
                        customerId: 'CUST-001',
                        customerName: 'Sarah Johnson',
                        customerEmail: 'sarah.j@email.com',
                        quoteId: 'Q-2025-001',
                        sessionId: 'SESSION-2025-007',
                        classId: 'CLASS-2025-001',
                        attendeeName: 'Emma Johnson',
                        studentName: 'Emma Johnson',
                        notes: 'First time attendee',
                        status: 'confirmed',
                        bookedAt: '2025-12-01T10:00:00Z',
                        updatedAt: '2025-12-01T10:00:00Z'
                    },
                    {
                        id: 'BOOKING-002',
                        customerId: 'CUST-001',
                        customerName: 'Sarah Johnson',
                        customerEmail: 'sarah.j@email.com',
                        quoteId: 'Q-2025-001',
                        sessionId: 'SESSION-2025-007',
                        classId: 'CLASS-2025-001',
                        attendeeName: 'Lucas Johnson',
                        studentName: 'Lucas Johnson',
                        notes: '',
                        status: 'confirmed',
                        bookedAt: '2025-12-01T10:05:00Z',
                        updatedAt: '2025-12-01T10:05:00Z'
                    },
                    {
                        id: 'BOOKING-003',
                        customerId: 'CUST-003',
                        customerName: 'Emma Williams',
                        customerEmail: 'emma.w@email.com',
                        quoteId: 'Q-2025-004',
                        sessionId: 'SESSION-2025-007',
                        classId: 'CLASS-2025-001',
                        attendeeName: 'Olivia Williams',
                        studentName: 'Olivia Williams',
                        notes: 'Needs extra attention',
                        status: 'confirmed',
                        bookedAt: '2025-12-02T14:30:00Z',
                        updatedAt: '2025-12-02T14:30:00Z'
                    },
                    {
                        id: 'BOOKING-004',
                        customerId: 'CUST-002',
                        customerName: 'Michael Chen',
                        customerEmail: 'm.chen@email.com',
                        quoteId: 'Q-2025-003',
                        sessionId: 'SESSION-2025-007',
                        classId: 'CLASS-2025-001',
                        attendeeName: 'Alex Chen',
                        studentName: 'Alex Chen',
                        notes: '',
                        status: 'confirmed',
                        bookedAt: '2025-12-03T09:15:00Z',
                        updatedAt: '2025-12-03T09:15:00Z'
                    },
                    {
                        id: 'BOOKING-005',
                        customerId: 'CUST-004',
                        customerName: 'David Brown',
                        customerEmail: 'david.b@email.com',
                        quoteId: 'Q-2025-005',
                        sessionId: 'SESSION-2025-007',
                        classId: 'CLASS-2025-001',
                        attendeeName: 'Sophia Brown',
                        studentName: 'Sophia Brown',
                        notes: 'Advanced student',
                        status: 'confirmed',
                        bookedAt: '2025-12-04T11:20:00Z',
                        updatedAt: '2025-12-04T11:20:00Z'
                    },
                    {
                        id: 'BOOKING-006',
                        customerId: 'CUST-001',
                        customerName: 'Sarah Johnson',
                        customerEmail: 'sarah.j@email.com',
                        quoteId: 'Q-2025-002',
                        sessionId: 'SESSION-2025-007',
                        classId: 'CLASS-2025-001',
                        attendeeName: 'Mia Johnson',
                        studentName: 'Mia Johnson',
                        notes: '',
                        status: 'confirmed',
                        bookedAt: '2025-12-05T08:45:00Z',
                        updatedAt: '2025-12-05T08:45:00Z'
                    },
                    {
                        id: 'BOOKING-007',
                        customerId: 'CUST-003',
                        customerName: 'Emma Williams',
                        customerEmail: 'emma.w@email.com',
                        quoteId: 'Q-2025-004',
                        sessionId: 'SESSION-2025-007',
                        classId: 'CLASS-2025-001',
                        attendeeName: 'Noah Williams',
                        studentName: 'Noah Williams',
                        notes: '',
                        status: 'confirmed',
                        bookedAt: '2025-12-05T15:30:00Z',
                        updatedAt: '2025-12-05T15:30:00Z'
                    },
                    {
                        id: 'BOOKING-008',
                        customerId: 'CUST-002',
                        customerName: 'Michael Chen',
                        customerEmail: 'm.chen@email.com',
                        quoteId: 'Q-2025-003',
                        sessionId: 'SESSION-2025-007',
                        classId: 'CLASS-2025-001',
                        attendeeName: 'Ava Chen',
                        studentName: 'Ava Chen',
                        notes: 'Beginner level',
                        status: 'confirmed',
                        bookedAt: '2025-12-06T10:00:00Z',
                        updatedAt: '2025-12-06T10:00:00Z'
                    },
                    {
                        id: 'BOOKING-009',
                        customerId: 'CUST-004',
                        customerName: 'David Brown',
                        customerEmail: 'david.b@email.com',
                        quoteId: 'Q-2025-005',
                        sessionId: 'SESSION-2025-007',
                        classId: 'CLASS-2025-001',
                        attendeeName: 'Ethan Brown',
                        studentName: 'Ethan Brown',
                        notes: '',
                        status: 'confirmed',
                        bookedAt: '2025-12-07T13:20:00Z',
                        updatedAt: '2025-12-07T13:20:00Z'
                    },
                    {
                        id: 'BOOKING-010',
                        customerId: 'CUST-001',
                        customerName: 'Sarah Johnson',
                        customerEmail: 'sarah.j@email.com',
                        quoteId: 'Q-2025-001',
                        sessionId: 'SESSION-2025-007',
                        classId: 'CLASS-2025-001',
                        attendeeName: 'Isabella Johnson',
                        studentName: 'Isabella Johnson',
                        notes: '',
                        status: 'confirmed',
                        bookedAt: '2025-12-08T09:30:00Z',
                        updatedAt: '2025-12-08T09:30:00Z'
                    },
                    {
                        id: 'BOOKING-011',
                        customerId: 'CUST-003',
                        customerName: 'Emma Williams',
                        customerEmail: 'emma.w@email.com',
                        quoteId: 'Q-2025-004',
                        sessionId: 'SESSION-2025-007',
                        classId: 'CLASS-2025-001',
                        attendeeName: 'Liam Williams',
                        studentName: 'Liam Williams',
                        notes: 'Returning student',
                        status: 'confirmed',
                        bookedAt: '2025-12-08T16:00:00Z',
                        updatedAt: '2025-12-08T16:00:00Z'
                    }
                ],
                notes: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            },
            {
                id: 'SESSION-2025-008',
                classId: 'CLASS-2025-002',
                date: '2025-12-10',
                startTime: '18:00',
                endTime: '19:00',
                duration: 60,
                status: 'scheduled',
                maxCapacity: 20,
                confirmedSlots: 18,
                assignedStaff: [
                    { id: 'STAFF-004', name: 'Emily Rodriguez', email: 'emily.r@example.com', role: 'Instructor', department: 'Yoga' }
                ],
                bookings: [],
                notes: '',
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            }
        ];
    }

    // Generate sessions from existing classes
    classes.forEach(cls => {
        if (cls.schedule && cls.defaultStaff) {
            const daysOfWeek = cls.schedule.daysOfWeek || [];
            const startTime = cls.schedule.startTime || '14:00';
            const endTime = cls.schedule.endTime || '15:00';

            daysOfWeek.forEach(dayName => {
                const dayIndex = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'].indexOf(dayName);
                if (dayIndex === -1) return;

                for (let week = 0; week < 4; week++) {
                    const date = new Date(2025, 11, 1);
                    const firstDayOfWeek = date.getDay();
                    let targetDate = 1 + (dayIndex - firstDayOfWeek + 7) % 7 + (week * 7);

                    if (targetDate <= 31) {
                        const dateStr = `2025-12-${String(targetDate).padStart(2, '0')}`;
                        sessions.push({
                            id: `SESSION-2025-${cls.id}-${targetDate}`,
                            classId: cls.id,
                            date: dateStr,
                            startTime: startTime,
                            endTime: endTime,
                            duration: cls.schedule.duration || 60,
                            status: 'scheduled',
                            maxCapacity: cls.maxCapacity || 20,
                            confirmedSlots: Math.floor(Math.random() * (cls.maxCapacity || 20)),
                            assignedStaff: cls.defaultStaff || [],
                            bookings: [],
                            notes: '',
                            createdAt: new Date().toISOString(),
                            updatedAt: new Date().toISOString()
                        });
                    }
                }
            });
        }
    });

    return sessions;
}

// ==================== Filtering ====================

function applyFilters() {
    let filtered = [...allEvents];

    // Type filters
    if (!filters.jobs) {
        filtered = filtered.filter(e => e.type !== 'job');
    }
    if (!filters.sessions) {
        filtered = filtered.filter(e => e.type !== 'session');
    }

    // Status filters
    const statusFilters = [];
    if (filters.scheduled) statusFilters.push('scheduled');
    if (filters.inProgress) statusFilters.push('in_progress');
    if (filters.completed) statusFilters.push('completed');
    // Always include preview sessions (future sessions not yet created)
    statusFilters.push('preview');

    if (statusFilters.length > 0) {
        filtered = filtered.filter(e => statusFilters.includes(e.status) || e.isPreview);
    }

    // Staff filter
    if (staffFilter.length > 0) {
        filtered = filtered.filter(event => {
            // Check assignedStaff array
            const assignedStaff = event.assignedStaff || [];
            let staffNames = [];
            
            if (Array.isArray(assignedStaff)) {
                // If assignedStaff is array of objects, extract names
                staffNames = assignedStaff.map(s => {
                    if (typeof s === 'string') return s;
                    return s.name || s;
                });
            } else if (typeof assignedStaff === 'string') {
                staffNames = [assignedStaff];
            }
            
            // Also check assignedTo field (for backward compatibility)
            if (event.assignedTo) {
                const assignedToStaff = sampleStaff.find(s => s.id === event.assignedTo);
                if (assignedToStaff && !staffNames.includes(assignedToStaff.name)) {
                    staffNames.push(assignedToStaff.name);
                }
            }
            
            // Check if any staff name matches the filter
            return staffNames.some(name => staffFilter.includes(name));
        });
    }

    // Search filter
    const searchQuery = document.getElementById('searchInput').value.toLowerCase();
    if (searchQuery) {
        filtered = filtered.filter(event => {
            return event.title.toLowerCase().includes(searchQuery) ||
                event.description.toLowerCase().includes(searchQuery) ||
                (event.customer && event.customer.toLowerCase().includes(searchQuery)) ||
                (event.className && event.className.toLowerCase().includes(searchQuery));
        });
    }

    filteredEvents = filtered;
    updateEventCount();
    renderCurrentView();
}

function toggleFilters() {
    const panel = document.getElementById('filtersPanel');
    panel.classList.toggle('hidden');
}

// ==================== View Switching ====================

function switchView(view) {
    currentView = view;

    // Update button states
    ['Month', 'Week', 'Day'].forEach(v => {
        const btn = document.getElementById(`view${v}`);
        if (v.toLowerCase() === view) {
            btn.classList.add('bg-blue-600', 'text-white');
            btn.classList.remove('text-gray-700', 'hover:bg-gray-50');
        } else {
            btn.classList.remove('bg-blue-600', 'text-white');
            btn.classList.add('text-gray-700', 'hover:bg-gray-50');
        }
    });

    // Hide all views
    document.getElementById('monthView').classList.add('hidden');
    document.getElementById('weekView').classList.add('hidden');
    document.getElementById('dayView').classList.add('hidden');

    // Show selected view
    document.getElementById(`${view}View`).classList.remove('hidden');

    // Render view
    renderCurrentView();
    updateDateRange();
}

function renderCurrentView() {
    if (currentView === 'month') {
        renderMonthView();
    } else if (currentView === 'week') {
        renderWeekView();
    } else if (currentView === 'day') {
        renderDayView();
    }
}

// ==================== Navigation ====================

function navigateCalendar(direction) {
    if (direction === 'today') {
        // Set to December 9th, 2025 for demo purposes
        currentDate = new Date(2025, 11, 9); // December 9th, 2025 (month is 0-indexed)
    } else if (direction === 'prev') {
        if (currentView === 'month') {
            currentDate.setMonth(currentDate.getMonth() - 1);
        } else if (currentView === 'week') {
            currentDate.setDate(currentDate.getDate() - 7);
        } else if (currentView === 'day') {
            currentDate.setDate(currentDate.getDate() - 1);
        }
    } else if (direction === 'next') {
        if (currentView === 'month') {
            currentDate.setMonth(currentDate.getMonth() + 1);
        } else if (currentView === 'week') {
            currentDate.setDate(currentDate.getDate() + 7);
        } else if (currentView === 'day') {
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    renderCurrentView();
    updateDateRange();
}

function updateDateRange() {
    let rangeText = '';

    if (currentView === 'month') {
        const monthName = currentDate.toLocaleDateString('en-AU', { month: 'long', year: 'numeric' });
        rangeText = monthName;
    } else if (currentView === 'week') {
        const weekStart = getWeekStart(currentDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekEnd.getDate() + 6);
        rangeText = `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
    } else if (currentView === 'day') {
        rangeText = formatDate(currentDate);
    }

    document.getElementById('dateRange').textContent = rangeText;
}

function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
}

// ==================== Month View ====================

function renderMonthView() {
    const container = document.getElementById('monthCalendar');
    container.innerHTML = '';

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();

    let dayCount = 0;

    // Previous month days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const day = daysInPrevMonth - i;
        const date = new Date(year, month - 1, day);
        const dateStr = formatDateString(date);
        container.appendChild(createDayCell(date, dateStr, true));
        dayCount++;
    }

    // Current month days
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dateStr = formatDateString(date);
        container.appendChild(createDayCell(date, dateStr, false));
        dayCount++;
    }

    // Next month days
    const remainingDays = 42 - dayCount;
    for (let day = 1; day <= remainingDays; day++) {
        const date = new Date(year, month + 1, day);
        const dateStr = formatDateString(date);
        container.appendChild(createDayCell(date, dateStr, true));
    }
}

function createDayCell(date, dateStr, isOtherMonth) {
    const cell = document.createElement('div');
    cell.className = `calendar-day p-2 ${isOtherMonth ? 'other-month' : ''}`;
    cell.dataset.date = dateStr;

    const today = new Date();
    if (!isOtherMonth && dateStr === formatDateString(today)) {
        cell.classList.add('today');
    }

    // Day number
    const dayNum = document.createElement('div');
    dayNum.className = 'text-sm font-semibold text-gray-900 mb-1';
    dayNum.textContent = date.getDate();
    cell.appendChild(dayNum);

    // Events for this day
    const dayEvents = filteredEvents.filter(e => e.date === dateStr);
    const eventsContainer = document.createElement('div');
    eventsContainer.className = 'space-y-1';

    dayEvents.slice(0, 3).forEach(event => {
        const eventEl = document.createElement('div');
        const typeClass = event.type === 'job' ? 'event-job' : 'event-session';
        const previewClass = event.isPreview ? 'event-preview' : '';
        eventEl.className = `calendar-event ${typeClass} ${previewClass}`;
        eventEl.textContent = `${event.time.substring(0, 5)} ${event.title.substring(0, 15)}${event.title.length > 15 ? '...' : ''}`;

        // Only add interactions for non-preview events
        if (!event.isPreview) {
            eventEl.onclick = (e) => {
                e.stopPropagation();
                showEditEventModal(event);
            };
            // Add hover tooltip
            eventEl.onmouseenter = (e) => showEventTooltip(event, e);
            eventEl.onmouseleave = () => hideEventTooltip();
        } else {
            eventEl.onclick = (e) => {
                e.stopPropagation();
                showNotification('This is a preview. Session will be created 1 week before.', 'info');
            };
            // Add hover tooltip for preview events too
            eventEl.onmouseenter = (e) => showEventTooltip(event, e);
            eventEl.onmouseleave = () => hideEventTooltip();
        }
        eventsContainer.appendChild(eventEl);
    });

    if (dayEvents.length > 3) {
        const moreEl = document.createElement('div');
        moreEl.className = 'text-xs text-gray-500 mt-1 cursor-pointer';
        moreEl.textContent = `+${dayEvents.length - 3} more`;
        moreEl.onclick = () => {
            currentDate = date;
            switchView('day');
        };
        eventsContainer.appendChild(moreEl);
    }

    // Click to create event
    cell.onclick = (e) => {
        if (e.target === cell || e.target === dayNum) {
            showCreateEventModal(dateStr);
        }
    };

    cell.appendChild(eventsContainer);
    return cell;
}

// ==================== Week View ====================

function renderWeekView() {
    const weekStart = getWeekStart(currentDate);

    // Render day headers
    const weekDaysContainer = document.getElementById('weekDays');
    weekDaysContainer.innerHTML = '';

    for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        const header = document.createElement('div');
        header.className = 'p-3 text-center text-sm font-semibold text-gray-700 bg-gray-50 border-r border-gray-200';
        header.innerHTML = `
            <div>${day.toLocaleDateString('en-AU', { weekday: 'short' })}</div>
            <div class="text-lg font-bold">${day.getDate()}</div>
        `;
        weekDaysContainer.appendChild(header);
    }

    // Render time slots
    const calendarContainer = document.getElementById('weekCalendar');
    calendarContainer.innerHTML = '';

    // Time column
    const timeColumn = document.createElement('div');
    timeColumn.className = 'border-r border-gray-200';

    for (let hour = 0; hour < 24; hour++) {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'week-hour p-2 border-b border-gray-200';
        timeSlot.innerHTML = `<div class="text-xs text-gray-500">${formatHour(hour)}</div>`;
        timeColumn.appendChild(timeSlot);
    }

    calendarContainer.appendChild(timeColumn);

    // Day columns
    for (let i = 0; i < 7; i++) {
        const day = new Date(weekStart);
        day.setDate(day.getDate() + i);
        const dateStr = formatDateString(day);

        const dayColumn = document.createElement('div');
        dayColumn.className = 'border-r border-gray-200 relative';
        dayColumn.dataset.date = dateStr;

        for (let hour = 0; hour < 24; hour++) {
            const timeSlot = document.createElement('div');
            timeSlot.className = 'week-hour border-b border-gray-200';
            timeSlot.dataset.date = dateStr;
            timeSlot.dataset.hour = hour;
            timeSlot.onclick = (e) => {
                if (e.target === timeSlot) {
                    showCreateEventModal(dateStr, `${String(hour).padStart(2, '0')}:00`);
                }
            };
            dayColumn.appendChild(timeSlot);
        }

        // Add events for this day
        const dayEvents = filteredEvents.filter(e => e.date === dateStr);
        dayEvents.forEach(event => {
            const eventEl = createWeekEvent(event);
            dayColumn.appendChild(eventEl);
        });

        calendarContainer.appendChild(dayColumn);
    }

    updateCurrentTimeIndicator();
}

function createWeekEvent(event) {
    const eventEl = document.createElement('div');
    const typeClass = event.type === 'job' ? 'event-job' : 'event-session';
    const previewClass = event.isPreview ? 'event-preview' : '';
    eventEl.className = `week-event ${typeClass} ${previewClass}`;
    eventEl.dataset.eventId = event.id;

    const startTime = parseTime(event.time);
    const endTime = event.endTime ? parseTime(event.endTime) : startTime + 1;
    const startHour = Math.floor(startTime);
    const startMin = (startTime - startHour) * 60;
    const duration = (endTime - startTime) * 60;

    eventEl.style.top = `${(startHour * 60 + startMin) * 1}px`;
    eventEl.style.height = `${Math.max(duration * 1, 30)}px`;

    // Add preview label for preview events
    const previewLabel = event.isPreview ? '<span class="text-xs opacity-50 ml-1">(preview)</span>' : '';

    eventEl.innerHTML = `
        <div class="font-medium text-xs">${event.title}${previewLabel}</div>
        <div class="text-xs opacity-75">${event.time}${event.endTime ? ` - ${event.endTime}` : ''}</div>
    `;

    // Only add interactions for non-preview events
    if (!event.isPreview) {
        eventEl.onclick = (e) => {
            e.stopPropagation();
            showEditEventModal(event);
        };
        // Add hover tooltip
        eventEl.onmouseenter = (e) => showEventTooltip(event, e);
        eventEl.onmouseleave = () => hideEventTooltip();

        // Drag and drop
        makeEventDraggable(eventEl, event);
    } else {
        // For preview events, show a tooltip on click
        eventEl.onclick = (e) => {
            e.stopPropagation();
            showNotification('This is a preview. Session will be created 1 week before.', 'info');
        };
    }

    return eventEl;
}

// ==================== Day View ====================

function renderDayView() {
    const dateStr = formatDateString(currentDate);
    document.getElementById('dayViewDate').textContent = formatDate(currentDate);

    // Render time slots
    const timeSlotsContainer = document.getElementById('dayTimeSlots');
    timeSlotsContainer.innerHTML = '';

    for (let hour = 0; hour < 24; hour++) {
        const timeSlot = document.createElement('div');
        timeSlot.className = 'day-hour p-3 border-b border-gray-200';
        timeSlot.dataset.hour = hour;
        timeSlot.onclick = () => {
            showCreateEventModal(dateStr, `${String(hour).padStart(2, '0')}:00`);
        };
        timeSlot.innerHTML = `<div class="text-sm font-medium text-gray-700">${formatHour(hour)}</div>`;
        timeSlotsContainer.appendChild(timeSlot);
    }

    // Render events
    const eventsContainer = document.getElementById('dayEvents');
    eventsContainer.innerHTML = '';

    const dayEvents = filteredEvents.filter(e => e.date === dateStr);

    if (dayEvents.length === 0) {
        eventsContainer.innerHTML = `
            <div class="text-center py-12 text-gray-500">
                <svg class="mx-auto mb-3 text-gray-400 w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p class="text-sm font-medium text-gray-700">No events scheduled</p>
                <p class="text-xs text-gray-500 mt-1">Click a time slot to create an event</p>
            </div>
        `;
        return;
    }

    dayEvents.forEach(event => {
        const eventCard = document.createElement('div');
        const isPreview = event.isPreview || event.status === 'preview';
        let cardClass = `border rounded-lg p-4 transition-all`;
        
        if (isPreview) {
            cardClass += ` border-amber-300 bg-amber-50 cursor-not-allowed`;
        } else {
            cardClass += ` cursor-pointer hover:shadow-md ${event.type === 'job' ? 'border-blue-200 bg-blue-50' : 'border-green-200 bg-green-50'}`;
        }
        
        eventCard.className = cardClass;
        
        if (!isPreview) {
            eventCard.onclick = () => showEditEventModal(event);
            // Add hover tooltip
            eventCard.onmouseenter = (e) => showEventTooltip(event, e);
            eventCard.onmouseleave = () => hideEventTooltip();
        } else {
            eventCard.onclick = () => showNotification('This is a preview. Session will be created 1 week before.', 'info');
            // Add hover tooltip for preview events too
            eventCard.onmouseenter = (e) => showEventTooltip(event, e);
            eventCard.onmouseleave = () => hideEventTooltip();
        }

        const previewBadge = isPreview ? '<span class="px-2 py-1 text-xs rounded bg-amber-100 text-amber-800 border border-amber-300">⏳ Preview</span>' : '';
        const typeBadge = `<span class="px-2 py-1 text-xs rounded ${event.type === 'job' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}">
            ${event.type === 'job' ? 'Job' : 'Class Session'}
        </span>`;

        eventCard.innerHTML = `
            <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                    <h3 class="font-semibold ${isPreview ? 'text-amber-900' : 'text-gray-900'}">${event.title}</h3>
                    <div class="flex items-center gap-2 mt-1">
                        ${previewBadge}
                        ${typeBadge}
                        <span class="text-xs ${isPreview ? 'text-amber-700' : 'text-gray-500'}">${event.time}${event.endTime ? ` - ${event.endTime}` : ''}</span>
                    </div>
                </div>
            </div>
            ${event.description ? `<p class="text-sm ${isPreview ? 'text-amber-800' : 'text-gray-600'} mt-2">${event.description}</p>` : ''}
            ${event.customer ? `<p class="text-sm ${isPreview ? 'text-amber-800' : 'text-gray-600'} mt-1"><span class="font-medium">Customer:</span> ${event.customer}</p>` : ''}
            ${event.className ? `<p class="text-sm ${isPreview ? 'text-amber-800' : 'text-gray-600'} mt-1"><span class="font-medium">Class:</span> ${event.className}</p>` : ''}
            ${event.address ? `<p class="text-sm ${isPreview ? 'text-amber-800' : 'text-gray-600'} mt-1"><span class="font-medium">Address:</span> ${event.address}</p>` : ''}
            ${event.duration ? `<p class="text-sm ${isPreview ? 'text-amber-800' : 'text-gray-600'} mt-1"><span class="font-medium">Duration:</span> ${event.duration}</p>` : ''}
            ${isPreview ? '<p class="text-xs text-amber-700 mt-2 italic">This session will be created 1 week before the date.</p>' : ''}
        `;

        eventsContainer.appendChild(eventCard);
    });
}

// ==================== Event Popover ====================

function showEventPopover(event, element) {
    closeEventPopover();

    const popover = document.getElementById('eventPopover');
    const rect = element.getBoundingClientRect();

    popover.style.left = `${rect.left}px`;
    popover.style.top = `${rect.bottom + 8}px`;
    popover.classList.remove('hidden');

    popover.innerHTML = `
        <div class="space-y-2">
            <div class="flex items-center gap-2">
                <span class="px-2 py-1 text-xs rounded ${event.type === 'job' ? 'bg-blue-100 text-blue-700' : 'bg-green-100 text-green-700'}">
                    ${event.type === 'job' ? 'Job' : 'Class Session'}
                </span>
                <span class="text-xs text-gray-500">${event.status}</span>
            </div>
            <h4 class="font-semibold text-gray-900">${event.title}</h4>
            <p class="text-sm text-gray-600">${formatDate(new Date(event.date))} at ${event.time}${event.endTime ? ` - ${event.endTime}` : ''}</p>
            ${event.description ? `<p class="text-sm text-gray-700">${event.description}</p>` : ''}
            <div class="flex gap-2 pt-2 border-t border-gray-200">
                <button onclick="showEditEventModal(${JSON.stringify(event).replace(/"/g, '&quot;')})" class="flex-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded">
                    Edit
                </button>
                <button onclick="deleteEvent('${event.id}', '${event.type}')" class="flex-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded">
                    Delete
                </button>
            </div>
        </div>
    `;

    selectedEvent = event;
}

function closeEventPopover() {
    document.getElementById('eventPopover').classList.add('hidden');
    selectedEvent = null;
}

// ==================== Event Tooltip ====================

function showEventTooltip(event, mouseEvent) {
    const tooltip = document.getElementById('eventTooltip');
    if (!tooltip) return;

    // Build tooltip content
    let content = `
        <div class="space-y-2">
            <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 text-xs rounded ${event.type === 'job' ? 'bg-blue-500' : 'bg-green-500'}">
                    ${event.type === 'job' ? 'Job' : 'Class Session'}
                </span>
                ${event.isPreview ? '<span class="px-2 py-0.5 text-xs rounded bg-amber-500">⏳ Preview</span>' : ''}
                <span class="text-xs text-gray-300">${event.status || 'scheduled'}</span>
            </div>
            <div class="font-semibold text-sm">${event.title}</div>
            <div class="text-xs text-gray-300 space-y-1">
                <div class="flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <span>${formatDate(new Date(event.date))}</span>
                </div>
                <div class="flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                    </svg>
                    <span>${event.time}${event.endTime ? ` - ${event.endTime}` : ''}</span>
                </div>
    `;

    // Add job-specific info
    if (event.type === 'job') {
        if (event.customer) {
            content += `
                <div class="flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <span>${event.customer}</span>
                </div>
            `;
        }
        if (event.address) {
            content += `
                <div class="flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"></path>
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"></path>
                    </svg>
                    <span class="truncate">${event.address}</span>
                </div>
            `;
        }
    }

    // Add session-specific info
    if (event.type === 'session' && event.className) {
        content += `
            <div class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                <span>${event.className}</span>
            </div>
        `;
        
        // Add slot booking information
        const confirmedSlots = event.confirmedSlots || 0;
        const maxCapacity = event.capacity || 0;
        if (maxCapacity > 0) {
            const slotsText = `${confirmedSlots}/${maxCapacity} slots`;
            const isFull = confirmedSlots >= maxCapacity;
            const isNearFull = confirmedSlots >= maxCapacity * 0.8;
            const slotColor = isFull ? 'text-red-300' : isNearFull ? 'text-yellow-300' : 'text-green-300';
            
            content += `
                <div class="flex items-center gap-1">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <span class="${slotColor} font-medium">${slotsText}</span>
                </div>
            `;
        }
    }

    // Add staff info
    if (event.assignedStaff && event.assignedStaff.length > 0) {
        const staffNames = event.assignedStaff.map(s => typeof s === 'string' ? s : s.name).join(', ');
        content += `
            <div class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                </svg>
                <span class="truncate">${staffNames}</span>
            </div>
        `;
    }

    // Add description if available
    if (event.description) {
        const shortDesc = event.description.length > 100 ? event.description.substring(0, 100) + '...' : event.description;
        content += `
            <div class="pt-1 border-t border-gray-700 text-xs text-gray-300">
                ${shortDesc}
            </div>
        `;
    }

    content += `</div></div>`;
    tooltip.innerHTML = content;

    // Position tooltip near cursor
    const x = mouseEvent.clientX + 10;
    const y = mouseEvent.clientY + 10;
    
    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;

    // Adjust if tooltip goes off screen
    setTimeout(() => {
        const rect = tooltip.getBoundingClientRect();
        if (rect.right > window.innerWidth) {
            tooltip.style.left = `${mouseEvent.clientX - rect.width - 10}px`;
        }
        if (rect.bottom > window.innerHeight) {
            tooltip.style.top = `${mouseEvent.clientY - rect.height - 10}px`;
        }
    }, 0);

    tooltip.classList.remove('hidden');
}

function hideEventTooltip() {
    const tooltip = document.getElementById('eventTooltip');
    if (tooltip) {
        tooltip.classList.add('hidden');
    }
}

// ==================== Create/Edit Modal ====================

function showCreateEventModal(date = null, time = null) {
    editingEvent = null;
    // Reset class form state
    classSelectedStaff = [];
    selectedPricebookItem = null;
    document.getElementById('modalTitle').textContent = 'Create Event';

    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <div class="space-y-4">
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                <select id="eventType" onchange="handleEventTypeChange()" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="job" disabled class="text-gray-400">Job (Upcoming)</option>
                    <option value="session">Class Session</option>
                    <option value="class">Class</option>
                </select>
            </div>
            
            <div id="titleField">
                <label class="block text-sm font-medium text-gray-700 mb-2">Title <span class="text-red-500">*</span></label>
                <input type="text" id="eventTitle" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Event title">
            </div>
            
            <div id="sessionTitleField" class="hidden">
                <label class="block text-sm font-medium text-gray-700 mb-2">Session Title</label>
                <input type="text" id="sessionTitle" readonly class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-600 cursor-not-allowed" placeholder="Will be set from class name">
                <p class="text-xs text-gray-500 mt-1">Auto-generated from selected class</p>
            </div>
            
            <div class="grid grid-cols-2 gap-3" id="dateTimeFields">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Date <span class="text-red-500">*</span></label>
                    <input type="date" id="eventDate" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value="${date || formatDateString(new Date())}">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Time <span class="text-red-500">*</span></label>
                    <input type="time" id="eventTime" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value="${time || '09:00'}">
                </div>
            </div>
            
            <div id="jobFields">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Customer</label>
                    <input type="text" id="eventCustomer" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Customer name">
                </div>
                <div class="mt-3">
                    <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input type="text" id="eventAddress" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Address">
                </div>
            </div>
            
            <div id="sessionFields" class="hidden">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Class <span class="text-red-500">*</span></label>
                    <select id="eventClassId" onchange="handleClassSelectionForSession()" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="">Select a class</option>
                    </select>
                    <p class="text-xs text-gray-500 mt-1">All details will be populated from the selected class</p>
                </div>
            </div>
            
            <div id="classFields" class="hidden space-y-6">
                <!-- Section 1: Basic Information -->
                <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div class="flex items-center gap-2 mb-4">
                        <div class="w-6 h-6 bg-emerald-100 rounded-lg flex items-center justify-center">
                            <svg class="w-4 h-4 text-emerald-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900">Basic Information</h3>
                    </div>

                    <div class="space-y-4">
                        <!-- Row 1: Class Name and Skill Level side by side -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="md:col-span-2">
                                <label for="className" class="block text-sm font-medium text-gray-700 mb-2">
                                    Class Name <span class="text-red-500">*</span>
                                </label>
                                <input type="text" id="className" name="className" required
                                    placeholder="e.g., Advanced Yoga Class"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label for="classSkillLevel" class="block text-sm font-medium text-gray-700 mb-2">
                                    Skill Level
                                </label>
                                <select id="classSkillLevel" name="skillLevel"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="">Select level</option>
                                    <option value="Beginner">Beginner</option>
                                    <option value="Intermediate">Intermediate</option>
                                    <option value="Advanced">Advanced</option>
                                    <option value="All levels">All levels</option>
                                </select>
                            </div>
                        </div>

                        <!-- Row 2: Description full width -->
                        <div>
                            <label for="classDescription" class="block text-sm font-medium text-gray-700 mb-2">
                                Description
                            </label>
                            <textarea id="classDescription" name="description" rows="2"
                                placeholder="Describe the class, its goals, and target audience..."
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"></textarea>
                        </div>
                    </div>
                </div>

                <!-- Section 2: Price Book Item Selection -->
                <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div class="flex items-center gap-2 mb-4">
                        <div class="w-6 h-6 bg-blue-100 rounded-lg flex items-center justify-center">
                            <svg class="w-4 h-4 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900">Price Book Item</h3>
                        <span class="text-red-500">*</span>
                    </div>

                    <div id="classPricebookContainer">
                        <button type="button" id="selectClassPricebookBtn" onclick="showClassPricebookModal()"
                            class="w-full px-4 py-3 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
                            <div class="flex items-center gap-3">
                                <svg class="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                </svg>
                                <div>
                                    <p class="font-medium text-gray-700">Select Price Book Item</p>
                                    <p class="text-sm text-gray-500">Link this class to a purchasable service</p>
                                </div>
                            </div>
                        </button>
                    </div>
                    <input type="hidden" id="classPricebookItemId" value="">
                    <p class="text-xs text-gray-500 mt-2">This pricebook item determines which quotes customers can use to book slots in this class</p>
                </div>

                <!-- Section 3: Schedule Configuration -->
                <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div class="flex items-center gap-2 mb-4">
                        <div class="w-6 h-6 bg-purple-100 rounded-lg flex items-center justify-center">
                            <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900">Schedule Configuration</h3>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <label for="classFrequency" class="block text-sm font-medium text-gray-700 mb-2">
                                Frequency
                            </label>
                            <select id="classFrequency" name="frequency" onchange="handleClassFrequencyChange()"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                <option value="weekly" selected>Weekly</option>
                                <option value="daily">Daily</option>
                                <option value="monthly">Monthly</option>
                                <option value="custom">Custom Interval</option>
                            </select>
                        </div>

                        <!-- Days of Week (for weekly) -->
                        <div id="classDaysOfWeekSection">
                            <label class="block text-sm font-medium text-gray-700 mb-2">
                                Days of Week
                            </label>
                            <div class="flex flex-wrap gap-2">
                                <button type="button" class="day-selector px-4 py-2 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors" data-day="Monday">Mon</button>
                                <button type="button" class="day-selector px-4 py-2 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors" data-day="Tuesday">Tue</button>
                                <button type="button" class="day-selector px-4 py-2 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors" data-day="Wednesday">Wed</button>
                                <button type="button" class="day-selector px-4 py-2 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors" data-day="Thursday">Thu</button>
                                <button type="button" class="day-selector px-4 py-2 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors" data-day="Friday">Fri</button>
                                <button type="button" class="day-selector px-4 py-2 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors" data-day="Saturday">Sat</button>
                                <button type="button" class="day-selector px-4 py-2 border border-gray-300 rounded-lg font-medium text-sm hover:bg-gray-50 transition-colors" data-day="Sunday">Sun</button>
                            </div>
                        </div>

                        <!-- Custom Interval (for custom frequency) -->
                        <div id="classCustomIntervalSection" class="hidden grid grid-cols-2 gap-4">
                            <div>
                                <label for="classCustomInterval" class="block text-sm font-medium text-gray-700 mb-2">
                                    Interval
                                </label>
                                <input type="number" id="classCustomInterval" name="customInterval" min="1" value="2"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                            <div>
                                <label for="classCustomIntervalUnit" class="block text-sm font-medium text-gray-700 mb-2">
                                    Unit
                                </label>
                                <select id="classCustomIntervalUnit" name="customIntervalUnit"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                    <option value="days">Days</option>
                                    <option value="weeks" selected>Weeks</option>
                                    <option value="months">Months</option>
                                </select>
                            </div>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label for="classStartTime" class="block text-sm font-medium text-gray-700 mb-2">
                                    Start Time
                                </label>
                                <input type="time" id="classStartTime" name="startTime" onchange="calculateClassDuration()"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>

                            <div>
                                <label for="classEndTime" class="block text-sm font-medium text-gray-700 mb-2">
                                    End Time
                                </label>
                                <input type="time" id="classEndTime" name="endTime" onchange="calculateClassDuration()"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            </div>
                        </div>

                        <div>
                            <label for="classDuration" class="block text-sm font-medium text-gray-700 mb-2">
                                Duration (minutes)
                            </label>
                            <input type="number" id="classDuration" name="duration" min="1" readonly
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg bg-gray-50 text-sm" />
                            <p class="text-xs text-gray-500 mt-1">Auto-calculated from start and end time</p>
                        </div>

                        <div class="grid grid-cols-2 gap-4">
                            <div>
                                <label for="classStartDate" class="block text-sm font-medium text-gray-700 mb-2">
                                    Start Date (Optional)
                                </label>
                                <input type="date" id="classStartDate" name="startDate"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                <p class="text-xs text-gray-500 mt-1">When sessions should start being generated</p>
                            </div>

                            <div>
                                <label for="classEndDate" class="block text-sm font-medium text-gray-700 mb-2">
                                    End Date (Optional)
                                </label>
                                <input type="date" id="classEndDate" name="endDate"
                                    class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                                <p class="text-xs text-gray-500 mt-1">Leave empty for ongoing classes</p>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section 4: Default Staff Assignment -->
                <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div class="flex items-center gap-2 mb-4">
                        <div class="w-6 h-6 bg-orange-100 rounded-lg flex items-center justify-center">
                            <svg class="w-4 h-4 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900">Default Staff Assignment</h3>
                    </div>

                    <!-- Unified Assignment Search -->
                    <div id="classUnifiedAssignmentMode">
                        <div class="mb-3">
                            <div class="relative">
                                <svg class="absolute left-3 top-3 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                                <input type="text" id="classAssignmentSearchInput"
                                    placeholder="Search staff or teams by name, skills, or role..."
                                    class="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    autocomplete="off" />
                                <div id="classAssignmentAutocomplete"
                                    class="hidden absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                                    <!-- Unified search results -->
                                </div>
                            </div>
                        </div>

                        <!-- Selected Assignments List -->
                        <div id="classSelectedAssignmentsContainer" class="mb-3">
                            <p class="text-xs font-semibold text-gray-700 mb-2">Selected Assignments (<span id="classSelectedAssignmentsCount">0</span>)</p>
                            <div id="classSelectedAssignmentsList" class="space-y-2">
                                <!-- Selected assignments will appear here -->
                            </div>
                            <p class="text-xs text-red-500 mt-2 hidden" id="classStaffError">At least one staff member is required</p>
                        </div>

                        <!-- Recommended Assignments Section -->
                        <div id="classRecommendedAssignmentsSection" class="mb-3">
                            <div class="flex items-center justify-between mb-2">
                                <p class="text-xs font-medium text-gray-700">Recommended Assignments</p>
                                <button id="classRefreshAssignmentRecommendations"
                                    class="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                    </svg>
                                    Refresh
                                </button>
                            </div>
                            <div id="classRecommendedAssignmentsList" class="space-y-2">
                                <!-- Recommended assignments will be populated here -->
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Section 5: Capacity Settings -->
                <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div class="flex items-center gap-2 mb-4">
                        <div class="w-6 h-6 bg-indigo-100 rounded-lg flex items-center justify-center">
                            <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                            </svg>
                        </div>
                        <h3 class="text-lg font-semibold text-gray-900">Capacity Settings</h3>
                    </div>

                    <div class="space-y-4">
                        <div>
                            <label for="classMaxCapacity" class="block text-sm font-medium text-gray-700 mb-2">
                                Max Capacity <span class="text-red-500">*</span>
                            </label>
                            <input type="number" id="classMaxCapacity" name="maxCapacity" required min="1" value="10"
                                class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" />
                            <p class="text-xs text-gray-500 mt-1">Maximum number of students per session</p>
                        </div>
                    </div>
                </div>
            </div>
            
            <div id="descriptionField">
                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea id="eventDescription" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Event description"></textarea>
            </div>
            
            <div id="staffField">
                <label class="block text-sm font-medium text-gray-700 mb-2">Default Staff Assignment</label>
                
                <!-- Search Input -->
                <div class="relative mb-3">
                    <svg class="absolute left-3 top-2.5 text-gray-400 w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                    </svg>
                    <input type="text" id="staffSearchInput" placeholder="Search staff by name or role..." 
                        oninput="filterStaffSearch()" onfocus="showStaffDropdown()"
                        class="w-full pl-9 pr-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" autocomplete="off" />
                    <div id="staffSearchDropdown" class="hidden absolute z-20 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-48 overflow-y-auto">
                        <!-- Search results will appear here -->
                    </div>
                </div>
                
                <!-- Selected Staff -->
                <div class="mb-2">
                    <p class="text-xs font-medium text-gray-600 mb-2">Selected (<span id="selectedStaffCount">0</span>)</p>
                    <div id="selectedStaffList" class="flex flex-wrap gap-2">
                        <!-- Selected staff chips will appear here -->
                        <p id="noStaffSelected" class="text-xs text-gray-400 italic">No staff selected</p>
                    </div>
                </div>
                
                <!-- Recommended Staff -->
                <div class="border-t border-gray-200 pt-2 mt-2">
                    <p class="text-xs font-medium text-gray-600 mb-2">Recommended</p>
                    <div id="recommendedStaffList" class="flex flex-wrap gap-2">
                        <!-- Recommended staff will appear here -->
                    </div>
                </div>
            </div>
            
            <div id="statusField">
                <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                <select id="eventStatus" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="scheduled">Scheduled</option>
                    <option value="in_progress">In Progress</option>
                    <option value="completed">Completed</option>
                    <option value="cancelled">Cancelled</option>
                </select>
            </div>
            
            <div class="flex gap-2 pt-4 border-t border-gray-200">
                <button onclick="saveEvent()" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                    Save
                </button>
                <button onclick="closeEventModal()" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Cancel
                </button>
            </div>
        </div>
    `;

    // Load classes for session selection
    loadClassesForSelection();

    // Load staff for selection
    loadStaffForSelection();

    // Initialize day selector click handlers
    initializeDaySelectors();

    // Initialize class staff assignment if class type is selected
    setTimeout(() => {
        const eventType = document.getElementById('eventType')?.value;
        if (eventType === 'class') {
            initializeClassStaffAssignment();
            // Set default times
            const startTime = document.getElementById('classStartTime');
            const endTime = document.getElementById('classEndTime');
            if (startTime && !startTime.value) startTime.value = '14:00';
            if (endTime && !endTime.value) endTime.value = '15:30';
            calculateClassDuration();
        }
    }, 100);

    // Initial field visibility
    handleEventTypeChange();

    document.getElementById('eventModal').classList.remove('hidden');
}

function handleEventTypeChange() {
    const eventType = document.getElementById('eventType')?.value;
    if (!eventType) return;
    
    const titleField = document.getElementById('titleField');
    const dateTimeFields = document.getElementById('dateTimeFields');
    const descriptionField = document.getElementById('descriptionField');
    const staffField = document.getElementById('staffField');
    const statusField = document.getElementById('statusField');

    // Hide all type-specific fields
    document.getElementById('jobFields')?.classList.add('hidden');
    document.getElementById('sessionFields')?.classList.add('hidden');
    document.getElementById('classFields')?.classList.add('hidden');

    // Show/hide common fields based on type
    if (eventType === 'class') {
        // For class creation, hide title/datetime/description/staff/status (they're in classFields)
        titleField?.classList.add('hidden');
        dateTimeFields?.classList.add('hidden');
        descriptionField?.classList.add('hidden');
        staffField?.classList.add('hidden');
        statusField?.classList.add('hidden');
        document.getElementById('classFields')?.classList.remove('hidden');
        
        // Initialize class-specific features
        setTimeout(() => {
            initializeClassStaffAssignment();
            handleClassFrequencyChange();
            const startTime = document.getElementById('classStartTime');
            const endTime = document.getElementById('classEndTime');
            if (startTime && !startTime.value) startTime.value = '14:00';
            if (endTime && !endTime.value) endTime.value = '15:30';
            calculateClassDuration();
        }, 50);
    } else if (eventType === 'session') {
        // For sessions, show read-only title (auto-generated from class)
        titleField?.classList.remove('hidden');
        // Make title field read-only for sessions
        const titleInput = document.getElementById('eventTitle');
        if (titleInput) {
            titleInput.readOnly = true;
            titleInput.classList.add('bg-gray-50', 'cursor-not-allowed');
            titleInput.classList.remove('focus:ring-2', 'focus:ring-blue-500');
            titleInput.required = false;
            // Update label
            const titleLabel = titleInput.previousElementSibling;
            if (titleLabel && titleLabel.tagName === 'LABEL') {
                titleLabel.innerHTML = titleLabel.innerHTML.replace('*', '').replace('Title', 'Session Title');
                const helpText = document.createElement('p');
                helpText.className = 'text-xs text-gray-500 mt-1';
                helpText.textContent = 'Auto-generated from selected class';
                if (!titleInput.nextElementSibling || !titleInput.nextElementSibling.classList.contains('text-xs')) {
                    titleInput.parentElement.appendChild(helpText);
                }
            }
        }
        dateTimeFields?.classList.remove('hidden');
        descriptionField?.classList.remove('hidden');
        staffField?.classList.remove('hidden');
        statusField?.classList.remove('hidden');
        document.getElementById('sessionFields')?.classList.remove('hidden');
    } else {
        // For jobs, show editable title
        titleField?.classList.remove('hidden');
        const titleInput = document.getElementById('eventTitle');
        if (titleInput) {
            titleInput.readOnly = false;
            titleInput.classList.remove('bg-gray-50', 'cursor-not-allowed');
            titleInput.classList.add('focus:ring-2', 'focus:ring-blue-500');
            titleInput.required = true;
        }
        dateTimeFields?.classList.remove('hidden');
        descriptionField?.classList.remove('hidden');
        staffField?.classList.remove('hidden');
        statusField?.classList.remove('hidden');
        document.getElementById('jobFields')?.classList.remove('hidden');
    }
}

function initializeDaySelectors() {
    document.querySelectorAll('.day-selector').forEach(btn => {
        btn.onclick = function (e) {
            e.preventDefault();
            // Toggle selection styles
            this.classList.toggle('bg-blue-600');
            this.classList.toggle('text-white');
            this.classList.toggle('border-blue-600');
            this.classList.toggle('selected');
        };
    });
}

function showEditEventModal(event) {
    editingEvent = event;
    document.getElementById('modalTitle').textContent = 'Edit Event';

    const modalContent = document.getElementById('modalContent');
    
    // For class sessions, show tabbed interface
    if (event.type === 'session') {
        modalContent.innerHTML = `
            <div class="space-y-4">
                <!-- Tab Navigation -->
                <div class="border-b border-gray-200">
                    <nav class="flex space-x-4" aria-label="Tabs">
                        <button id="sessionOverviewTab"
                            class="session-tab-button active py-2 px-1 border-b-2 border-blue-500 font-medium text-sm text-blue-600 transition-colors"
                            onclick="switchSessionTab('overview', event)">
                            Overview
                        </button>
                        <button id="sessionStaffTab"
                            class="session-tab-button py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors"
                            onclick="switchSessionTab('staff', event)">
                            Staff Assignment
                        </button>
                        <button id="sessionEnrollmentTab"
                            class="session-tab-button py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors"
                            onclick="switchSessionTab('enrollment', event)">
                            Enrollment
                        </button>
                    </nav>
                </div>

                <!-- Overview Tab Content -->
                <div id="sessionOverviewContent" class="session-tab-content">
                    <div class="space-y-6">
                        <!-- Basic Information Section -->
                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h3 class="text-sm font-semibold text-gray-900 mb-4">Basic Information</h3>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                                    <select id="eventType" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" disabled>
                                        <option value="session" selected>Class Session</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Session Title</label>
                                    <input type="text" id="eventTitle" readonly class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-600 cursor-not-allowed" value="${event.title}">
                                    <p class="text-xs text-gray-500 mt-1">Auto-generated from class name</p>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Class</label>
                                    <select id="eventClassId" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" disabled>
                                        <option value="">Select a class</option>
                                    </select>
                                </div>
                                
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                    <textarea id="eventDescription" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Add notes or description for this session...">${event.description || ''}</textarea>
                                </div>
                            </div>
                        </div>

                        <!-- Date & Time Section -->
                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h3 class="text-sm font-semibold text-gray-900 mb-4">Date & Time</h3>
                            <div class="space-y-4">
                                <!-- Date Selection -->
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Session Date <span class="text-red-500">*</span></label>
                                    <div class="relative">
                                        <input type="date" id="eventDate" required onchange="updateSessionDateTime()"
                                            class="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                                            value="${event.date}">
                                        <div class="absolute right-3 top-3 pointer-events-none">
                                            <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                            </svg>
                                        </div>
                                    </div>
                                    <p class="text-xs text-gray-600 mt-1.5 font-medium" id="sessionDateDisplay">${formatDate(new Date(event.date))}</p>
                                </div>

                                <!-- Time Selection -->
                                <div class="grid grid-cols-2 gap-4">
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">Start Time <span class="text-red-500">*</span></label>
                                        <div class="relative">
                                            <input type="time" id="eventTime" required onchange="updateSessionDateTime()"
                                                class="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                                                value="${event.time}">
                                            <div class="absolute right-3 top-3 pointer-events-none">
                                                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <p class="text-xs text-gray-600 mt-1.5 font-medium" id="sessionStartTimeDisplay">${formatTime(event.time)}</p>
                                    </div>
                                    <div>
                                        <label class="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                                        <div class="relative">
                                            <input type="time" id="eventEndTime" onchange="updateSessionDateTime()"
                                                class="w-full px-3 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors" 
                                                value="${event.endTime || ''}">
                                            <div class="absolute right-3 top-3 pointer-events-none">
                                                <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                                                </svg>
                                            </div>
                                        </div>
                                        <p class="text-xs text-gray-600 mt-1.5 font-medium" id="sessionEndTimeDisplay">${event.endTime ? formatTime(event.endTime) : 'Not set'}</p>
                                    </div>
                                </div>

                                <!-- Duration Display -->
                                <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                    <div class="flex items-center justify-between">
                                        <div>
                                            <p class="text-xs text-blue-600 font-medium mb-1">Session Duration</p>
                                            <p class="text-lg font-bold text-blue-700" id="sessionDurationDisplay">${event.duration || 'Calculating...'}</p>
                                        </div>
                                        <div class="text-right">
                                            <p class="text-xs text-blue-600 font-medium mb-1">Time Range</p>
                                            <p class="text-sm font-semibold text-blue-700" id="sessionTimeRange">${event.time}${event.endTime ? ` - ${event.endTime}` : ''}</p>
                                        </div>
                                    </div>
                                </div>

                                <!-- Quick Time Presets -->
                                <div>
                                    <label class="block text-xs font-medium text-gray-600 mb-2">Quick Time Presets</label>
                                    <div class="flex flex-wrap gap-2">
                                        <button type="button" onclick="setSessionTime('09:00', '10:00')" class="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">9:00 AM - 10:00 AM</button>
                                        <button type="button" onclick="setSessionTime('10:00', '11:00')" class="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">10:00 AM - 11:00 AM</button>
                                        <button type="button" onclick="setSessionTime('14:00', '15:30')" class="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">2:00 PM - 3:30 PM</button>
                                        <button type="button" onclick="setSessionTime('15:00', '16:30')" class="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">3:00 PM - 4:30 PM</button>
                                        <button type="button" onclick="setSessionTime('18:00', '19:00')" class="px-3 py-1.5 text-xs border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors">6:00 PM - 7:00 PM</button>
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Status & Settings Section -->
                        <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                            <h3 class="text-sm font-semibold text-gray-900 mb-4">Status & Settings</h3>
                            <div class="space-y-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                                    <select id="eventStatus" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                                        <option value="scheduled" ${event.status === 'scheduled' ? 'selected' : ''}>Scheduled</option>
                                        <option value="in_progress" ${event.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                                        <option value="completed" ${event.status === 'completed' ? 'selected' : ''}>Completed</option>
                                        <option value="cancelled" ${event.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                                    </select>
                                </div>
                                
                                ${event.capacity ? `
                                <div class="bg-gray-100 rounded-lg p-3">
                                    <div class="flex items-center justify-between">
                                        <span class="text-sm font-medium text-gray-700">Capacity</span>
                                        <span class="text-sm font-bold text-gray-900">${event.confirmedSlots || 0} / ${event.capacity}</span>
                                    </div>
                                    <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
                                        <div class="bg-blue-600 h-2 rounded-full" style="width: ${((event.confirmedSlots || 0) / event.capacity * 100)}%"></div>
                                    </div>
                                </div>
                                ` : ''}
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Staff Assignment Tab Content -->
                <div id="sessionStaffContent" class="session-tab-content hidden">
                    <div class="space-y-4">
                        <div class="bg-white rounded-lg shadow-sm p-4">
                            <div class="flex items-center gap-2 mb-4">
                                <div class="w-8 h-8 bg-orange-100 rounded-lg flex items-center justify-center">
                                    <svg class="w-5 h-5 text-orange-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                    </svg>
                                </div>
                                <h2 class="text-lg font-semibold text-gray-900">Staff Assignment</h2>
                            </div>

                            <!-- Unified Assignment Search -->
                            <div id="sessionUnifiedAssignmentMode">
                                <div class="mb-3">
                                    <div class="relative">
                                        <svg class="absolute left-3 top-3 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                        </svg>
                                        <input type="text" id="sessionAssignmentSearchInput"
                                            placeholder="Search staff or teams by name, skills, or role..."
                                            class="w-full pl-10 pr-10 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                            autocomplete="off" />
                                        <div id="sessionAssignmentAutocomplete"
                                            class="hidden absolute z-10 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-y-auto custom-scrollbar">
                                            <!-- Unified search results -->
                                        </div>
                                    </div>
                                </div>

                                <!-- Selected Assignments List -->
                                <div id="sessionSelectedAssignmentsContainer" class="mb-3">
                                    <p class="text-xs font-semibold text-gray-700 mb-2">Selected Assignments (<span id="sessionSelectedAssignmentsCount">0</span>)</p>
                                    <div id="sessionSelectedAssignmentsList" class="space-y-2">
                                        <!-- Selected assignments will appear here -->
                                    </div>
                                </div>

                                <!-- Recommended Assignments Section -->
                                <div id="sessionRecommendedAssignmentsSection" class="mb-3">
                                    <div class="flex items-center justify-between mb-2">
                                        <p class="text-xs font-medium text-gray-700">Recommended Assignments</p>
                                        <button id="sessionRefreshAssignmentRecommendations"
                                            class="text-xs text-blue-600 hover:text-blue-700 flex items-center gap-1">
                                            <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"></path>
                                            </svg>
                                            Refresh
                                        </button>
                                    </div>
                                    <div id="sessionRecommendedAssignmentsList" class="space-y-2">
                                        <!-- Recommended assignments will be populated here -->
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Enrollment Tab Content -->
                <div id="sessionEnrollmentContent" class="session-tab-content hidden">
                    <div class="space-y-4">
                        <!-- Enrollment Stats -->
                        <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <div class="bg-white rounded-lg shadow-sm p-4">
                                <div class="text-xs text-gray-500 mb-1">Total Bookings</div>
                                <div class="text-2xl font-bold text-gray-900" id="sessionTotalBookings">0</div>
                            </div>
                            <div class="bg-white rounded-lg shadow-sm p-4">
                                <div class="text-xs text-gray-500 mb-1">Confirmed</div>
                                <div class="text-2xl font-bold text-emerald-600" id="sessionConfirmedBookings">0</div>
                            </div>
                            <div class="bg-white rounded-lg shadow-sm p-4">
                                <div class="text-xs text-gray-500 mb-1">Capacity</div>
                                <div class="text-2xl font-bold text-blue-600" id="sessionCapacityDisplay">0/${event.capacity || 0}</div>
                            </div>
                        </div>

                        <!-- Slot Bookings Section -->
                        <div class="bg-white rounded-lg shadow-sm p-4">
                            <div class="flex items-center justify-between mb-6">
                                <div>
                                    <h2 class="text-lg font-semibold text-gray-900">Enrollments</h2>
                                    <p class="text-sm text-gray-500 mt-1">Manage attendee enrollments for this session</p>
                                </div>
                                <button onclick="openSessionBookCustomerModal(event)"
                                    class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors text-sm font-medium flex items-center gap-2">
                                    <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                                    </svg>
                                    Add Attendee
                                </button>
                            </div>

                            <!-- Search Existing Bookings -->
                            <div class="mb-6">
                                <label class="block text-sm font-medium text-gray-700 mb-2">Search Enrolled Attendees</label>
                                <div class="relative">
                                    <input type="text" id="sessionSearchBookedCustomers"
                                        placeholder="Search by attendee name, email, or quote ID..."
                                        class="w-full pl-10 pr-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                                        autocomplete="off" oninput="searchSessionBookedCustomers(this.value, event)" />
                                    <svg class="absolute left-3 top-3 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                    </svg>
                                </div>
                            </div>

                            <!-- Enrolled Attendees List -->
                            <div>
                                <div class="flex items-center justify-between mb-3">
                                    <h3 class="text-lg font-semibold text-gray-900">Enrolled Attendees</h3>
                                    <span class="text-sm text-gray-500" id="sessionBookingsCount">0 bookings</span>
                                </div>
                                <div id="sessionBookingsList" class="space-y-3">
                                    <!-- Bookings will be rendered here -->
                                </div>

                                <div id="sessionEmptyBookingsState" class="text-center py-12 text-gray-500">
                                    <svg class="mx-auto mb-3 text-gray-400 w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                    </svg>
                                    <p class="text-sm font-medium text-gray-700 mb-1">No enrollments yet</p>
                                    <p class="text-xs text-gray-500">Click "Add Attendee" to enroll attendees</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Action Buttons -->
                <div class="flex gap-2 pt-4 border-t border-gray-200">
                    <button onclick="saveEvent()" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                        Save Changes
                    </button>
                    <button onclick="closeEventModal()" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        // Initialize session-specific features
        setTimeout(() => {
            loadClassesForSelection(event.classId);
            initializeSessionStaffAssignment(event);
            loadSessionEnrollments(event);
            updateSessionDateTime(); // Initialize date/time displays and calculations
        }, 100);
    } else {
        // For jobs, use simple form
        modalContent.innerHTML = `
            <div class="space-y-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                    <select id="eventType" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" disabled>
                        <option value="job" selected>Job</option>
                    </select>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Title <span class="text-red-500">*</span></label>
                    <input type="text" id="eventTitle" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value="${event.title}">
                </div>
                
                <div class="grid grid-cols-2 gap-3">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Date <span class="text-red-500">*</span></label>
                        <input type="date" id="eventDate" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value="${event.date}">
                    </div>
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Time <span class="text-red-500">*</span></label>
                        <input type="time" id="eventTime" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value="${event.time}">
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Customer</label>
                    <input type="text" id="eventCustomer" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value="${event.customer || ''}">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Address</label>
                    <input type="text" id="eventAddress" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value="${event.address || ''}">
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                    <textarea id="eventDescription" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">${event.description || ''}</textarea>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Assigned Staff</label>
                    <div id="staffSelection" class="space-y-2 max-h-40 overflow-y-auto border border-gray-200 rounded-lg p-2">
                        <!-- Staff checkboxes will be rendered here -->
                    </div>
                </div>
                
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-2">Status</label>
                    <select id="eventStatus" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                        <option value="scheduled" ${event.status === 'scheduled' ? 'selected' : ''}>Scheduled</option>
                        <option value="in_progress" ${event.status === 'in_progress' ? 'selected' : ''}>In Progress</option>
                        <option value="completed" ${event.status === 'completed' ? 'selected' : ''}>Completed</option>
                        <option value="cancelled" ${event.status === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                    </select>
                </div>
                
                <div class="flex gap-2 pt-4 border-t border-gray-200">
                    <button onclick="saveEvent()" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                        Save Changes
                    </button>
                    <button onclick="closeEventModal()" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                        Cancel
                    </button>
                </div>
            </div>
        `;

        // Load staff for jobs
        loadStaffForSelection(event.assignedStaff || []);
    }

    document.getElementById('eventModal').classList.remove('hidden');
}

function closeEventModal() {
    document.getElementById('eventModal').classList.add('hidden');
    editingEvent = null;
    closeEventPopover();
}

// ==================== Save/Delete Events ====================

function saveEvent() {
    const eventType = document.getElementById('eventType').value;

    // Handle class creation separately
    if (eventType === 'class') {
        const className = document.getElementById('className')?.value.trim();
        if (!className) {
            showNotification('Please enter a class name', 'error');
            return;
        }

        const pricebookItemId = document.getElementById('classPricebookItemId')?.value;
        if (!pricebookItemId) {
            showNotification('Please select a price book item', 'error');
            return;
        }

        if (classSelectedStaff.length === 0) {
            showNotification('Please select at least one staff member', 'error');
            const errorEl = document.getElementById('classStaffError');
            if (errorEl) errorEl.classList.remove('hidden');
            return;
        }

        // Get selected days
        const selectedDays = [];
        document.querySelectorAll('#classFields .day-selector.bg-blue-600, #classFields .day-selector.selected').forEach(btn => {
            selectedDays.push(btn.dataset.day);
        });

        const frequency = document.getElementById('classFrequency')?.value || 'weekly';
        const schedule = {
            frequency: frequency,
            daysOfWeek: frequency === 'weekly' || frequency === 'daily' || frequency === 'monthly' ? selectedDays : [],
            startTime: document.getElementById('classStartTime')?.value || '14:00',
            endTime: document.getElementById('classEndTime')?.value || '15:30',
            duration: parseInt(document.getElementById('classDuration')?.value) || 90
        };

        if (frequency === 'custom') {
            schedule.customInterval = parseInt(document.getElementById('classCustomInterval')?.value) || 2;
            schedule.customIntervalUnit = document.getElementById('classCustomIntervalUnit')?.value || 'weeks';
        }

        const startDate = document.getElementById('classStartDate')?.value;
        const endDate = document.getElementById('classEndDate')?.value;
        if (startDate) schedule.startDate = startDate;
        if (endDate) schedule.endDate = endDate;

        createClass({
            name: className,
            description: document.getElementById('classDescription')?.value.trim() || '',
            skillLevel: document.getElementById('classSkillLevel')?.value || '',
            maxCapacity: parseInt(document.getElementById('classMaxCapacity')?.value) || 10,
            pricebookItemId: pricebookItemId,
            status: 'active',
            schedule: schedule,
            defaultStaff: classSelectedStaff.map(s => s.id)
        });

        // Reset class form state
        classSelectedStaff = [];
        closeEventModal();
        loadEvents();
        showNotification('Class created successfully', 'success');
        return;
    }

    // Existing job/session logic
    let title = document.getElementById('eventTitle').value.trim();
    const date = document.getElementById('eventDate').value;
    const time = document.getElementById('eventTime').value;
    const description = document.getElementById('eventDescription').value.trim();
    const status = document.getElementById('eventStatus').value;

    // For sessions, title is auto-generated from class, so get it from class if not set
    if (eventType === 'session') {
        const classId = document.getElementById('eventClassId')?.value;
        if (!classId) {
            showNotification('Please select a class for the session', 'error');
            return;
        }
        // Get title from class if not set
        if (!title) {
            const classes = JSON.parse(localStorage.getItem('classes_v2') || '[]');
            const classData = classes.find(c => c.id === classId);
            if (classData) {
                title = classData.name;
            }
        }
    }

    if (!title || !date || !time) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    // Get selected staff
    const selectedStaff = [];
    document.querySelectorAll('#staffSelection input[type="checkbox"]:checked').forEach(cb => {
        const staffId = cb.value;
        const staff = sampleStaff.find(s => s.id === staffId);
        if (staff) selectedStaff.push(staff);
    });

    if (editingEvent) {
        // Update existing event
        if (eventType === 'job') {
            updateJob(editingEvent.id, {
                title: title,
                customerName: document.getElementById('eventCustomer').value.trim(),
                scheduleDate: date,
                scheduleTime: time,
                description: description,
                status: status,
                address: document.getElementById('eventAddress').value.trim(),
                assignedStaff: selectedStaff.map(s => s.name)
            });
        } else {
            // Use session staff if available (from tab), otherwise use selectedStaff
            const staffToAssign = sessionSelectedStaff.length > 0 ? sessionSelectedStaff : selectedStaff;
            const endTimeInput = document.getElementById('eventEndTime');
            const endTime = endTimeInput?.value || null;
            
            updateSession(editingEvent.id, {
                classId: document.getElementById('eventClassId').value,
                date: date,
                startTime: time,
                endTime: endTime,
                description: description,
                status: status,
                assignedStaff: staffToAssign
            });
        }
    } else {
        // Create new event
        if (eventType === 'job') {
            createJob({
                title: title,
                customerName: document.getElementById('eventCustomer').value.trim(),
                scheduleDate: date,
                scheduleTime: time,
                description: description,
                status: status,
                address: document.getElementById('eventAddress').value.trim(),
                assignedStaff: selectedStaff.map(s => s.name)
            });
        } else {
            // For session, get endTime from input or class schedule
            const classId = document.getElementById('eventClassId').value;
            const classes = JSON.parse(localStorage.getItem('classes_v2') || '[]');
            const classData = classes.find(c => c.id === classId);
            const endTimeInput = document.getElementById('eventEndTime');
            const endTime = endTimeInput?.value || classData?.schedule?.endTime || null;

            // Use session staff if available (from tab), otherwise use selectedStaff
            const staffToAssign = sessionSelectedStaff.length > 0 ? sessionSelectedStaff : selectedStaff;

            createSession({
                classId: classId,
                date: date,
                startTime: time,
                endTime: endTime,
                description: description,
                status: status,
                assignedStaff: staffToAssign
            });
        }
    }

    closeEventModal();
    loadEvents();
    showNotification(editingEvent ? 'Event updated successfully' : 'Event created successfully', 'success');
}

function calculateDuration(startTime, endTime) {
    if (!startTime || !endTime) return 60;

    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);

    const startMinutes = startHour * 60 + startMin;
    const endMinutes = endHour * 60 + endMin;

    return endMinutes - startMinutes;
}

function deleteEvent(eventId, eventType) {
    if (!confirm('Are you sure you want to delete this event?')) {
        return;
    }

    if (eventType === 'job') {
        const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
        const filtered = jobs.filter(j => j.id !== eventId);
        localStorage.setItem('jobs', JSON.stringify(filtered));
    } else {
        const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        const filtered = sessions.filter(s => s.id !== eventId);
        localStorage.setItem('class_sessions_v2', JSON.stringify(filtered));
    }

    closeEventPopover();
    loadEvents();
    showNotification('Event deleted successfully', 'success');
}

function createClass(data) {
    const classes = JSON.parse(localStorage.getItem('classes_v2') || '[]');
    const newClass = {
        id: `CLASS-${new Date().getFullYear()}-${String(classes.length + 1).padStart(3, '0')}`,
        name: data.name,
        description: data.description || '',
        skillLevel: data.skillLevel || '',
        maxCapacity: data.maxCapacity || 10,
        pricebookItemId: data.pricebookItemId || '',
        status: data.status || 'active',
        schedule: data.schedule || {},
        defaultStaff: data.defaultStaff || [],
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    classes.push(newClass);
    localStorage.setItem('classes_v2', JSON.stringify(classes));
}

function createJob(data) {
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const newJob = {
        id: `JOB-${new Date().getFullYear()}-${String(jobs.length + 1).padStart(3, '0')}`,
        quoteId: '',
        customerName: data.customerName,
        customerEmail: '',
        scheduleDate: data.scheduleDate,
        scheduleTime: data.scheduleTime,
        assignedStaff: data.assignedStaff,
        status: data.status,
        total: 0,
        description: data.description,
        address: data.address,
        priority: 'normal',
        duration: ''
    };
    jobs.push(newJob);
    localStorage.setItem('jobs', JSON.stringify(jobs));
}

function updateJob(jobId, data) {
    const jobs = JSON.parse(localStorage.getItem('jobs') || '[]');
    const index = jobs.findIndex(j => j.id === jobId);
    if (index > -1) {
        jobs[index] = { ...jobs[index], ...data };
        localStorage.setItem('jobs', JSON.stringify(jobs));
    }
}

function createSession(data) {
    const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
    const classes = JSON.parse(localStorage.getItem('classes_v2') || '[]');
    const classData = classes.find(c => c.id === data.classId);

    const newSession = {
        id: `SESSION-${new Date().getFullYear()}-${String(sessions.length + 1).padStart(3, '0')}`,
        classId: data.classId,
        date: data.date,
        startTime: data.startTime,
        endTime: data.endTime || null,
        duration: classData?.schedule?.duration || 60,
        status: data.status,
        maxCapacity: classData?.maxCapacity || 20,
        confirmedSlots: 0,
        assignedStaff: data.assignedStaff,
        bookings: [],
        notes: data.description || '',
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
    };
    sessions.push(newSession);
    localStorage.setItem('class_sessions_v2', JSON.stringify(sessions));
}

function updateSession(sessionId, data) {
    const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
    const index = sessions.findIndex(s => s.id === sessionId);
    if (index > -1) {
        sessions[index] = { ...sessions[index], ...data, updatedAt: new Date().toISOString() };
        localStorage.setItem('class_sessions_v2', JSON.stringify(sessions));
    }
}

// ==================== Helper Functions ====================

function loadClassesForSelection(selectedId = null) {
    const classes = JSON.parse(localStorage.getItem('classes_v2') || '[]');
    const select = document.getElementById('eventClassId');
    if (!select) return;

    select.innerHTML = '<option value="">Select a class</option>';
    classes.forEach(cls => {
        const option = document.createElement('option');
        option.value = cls.id;
        option.textContent = cls.name;
        if (selectedId === cls.id) option.selected = true;
        select.appendChild(option);
    });
}

// Handle class selection for session creation - populate all fields from class
function handleClassSelectionForSession() {
    const classId = document.getElementById('eventClassId')?.value;
    if (!classId) {
        // Clear fields if no class selected
        clearSessionFields();
        return;
    }

    const classes = JSON.parse(localStorage.getItem('classes_v2') || '[]');
    const selectedClass = classes.find(c => c.id === classId);
    if (!selectedClass) return;

    // Populate title from class name
    const titleField = document.getElementById('eventTitle');
    if (titleField) {
        titleField.value = selectedClass.name;
    }

    // Populate description from class description
    const descriptionField = document.getElementById('eventDescription');
    if (descriptionField) {
        descriptionField.value = selectedClass.description || '';
    }

    // Populate time from class schedule
    const timeField = document.getElementById('eventTime');
    if (timeField && selectedClass.schedule?.startTime) {
        timeField.value = selectedClass.schedule.startTime;
    }

    // Populate staff from class default staff
    if (selectedClass.defaultStaff && selectedClass.defaultStaff.length > 0) {
        // Convert staff IDs to staff objects
        const staffToSelect = selectedClass.defaultStaff.map(staffId => {
            if (typeof staffId === 'string') {
                return sampleStaff.find(s => s.id === staffId) || { id: staffId, name: staffId, role: 'Staff' };
            }
            return staffId;
        }).filter(s => s);

        loadStaffForSelection(staffToSelect);
    } else {
        loadStaffForSelection([]);
    }

    showNotification('Class details loaded. You can adjust the date and time as needed.', 'success');
}

// Clear session fields when class is deselected
function clearSessionFields() {
    const titleField = document.getElementById('eventTitle');
    const descriptionField = document.getElementById('eventDescription');
    
    if (titleField) titleField.value = '';
    if (descriptionField) descriptionField.value = '';
    
    loadStaffForSelection([]);
}

// Selected staff array for the modal
let selectedModalStaff = [];

function loadStaffForSelection(selectedStaff = []) {
    selectedModalStaff = selectedStaff.map(s => {
        if (typeof s === 'string') {
            return sampleStaff.find(staff => staff.name === s) || { id: s, name: s, role: 'Staff' };
        }
        return s;
    });

    updateSelectedStaffDisplay();
    loadRecommendedStaff();

    // Close dropdown when clicking outside
    document.addEventListener('click', function (e) {
        const dropdown = document.getElementById('staffSearchDropdown');
        const input = document.getElementById('staffSearchInput');
        if (dropdown && input && !dropdown.contains(e.target) && !input.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
}

function showStaffDropdown() {
    const dropdown = document.getElementById('staffSearchDropdown');
    if (dropdown) {
        renderStaffSearchResults(sampleStaff);
        dropdown.classList.remove('hidden');
    }
}

function filterStaffSearch() {
    const input = document.getElementById('staffSearchInput');
    const searchTerm = input?.value.toLowerCase() || '';

    const filtered = sampleStaff.filter(staff =>
        staff.name.toLowerCase().includes(searchTerm) ||
        staff.role.toLowerCase().includes(searchTerm) ||
        (staff.department && staff.department.toLowerCase().includes(searchTerm))
    );

    renderStaffSearchResults(filtered);
}

function renderStaffSearchResults(staffList) {
    const dropdown = document.getElementById('staffSearchDropdown');
    if (!dropdown) return;

    const availableStaff = staffList.filter(s => !selectedModalStaff.some(sel => sel.id === s.id));

    if (availableStaff.length === 0) {
        dropdown.innerHTML = '<p class="p-3 text-sm text-gray-500 text-center">No staff found</p>';
    } else {
        dropdown.innerHTML = availableStaff.map(staff => `
            <div onclick="selectStaffFromSearch('${staff.id}')" 
                 class="px-3 py-2 hover:bg-blue-50 cursor-pointer flex items-center justify-between">
                <div class="flex items-center gap-2">
                    <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-sm font-medium">
                        ${staff.name.split(' ').map(n => n[0]).join('')}
                    </div>
                    <div>
                        <p class="text-sm font-medium text-gray-900">${staff.name}</p>
                        <p class="text-xs text-gray-500">${staff.role}${staff.department ? ' • ' + staff.department : ''}</p>
                    </div>
                </div>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
            </div>
        `).join('');
    }

    dropdown.classList.remove('hidden');
}

function selectStaffFromSearch(staffId) {
    const staff = sampleStaff.find(s => s.id === staffId);
    if (staff && !selectedModalStaff.some(s => s.id === staffId)) {
        selectedModalStaff.push(staff);
        updateSelectedStaffDisplay();

        // Clear search and close dropdown
        const input = document.getElementById('staffSearchInput');
        if (input) input.value = '';

        const dropdown = document.getElementById('staffSearchDropdown');
        if (dropdown) dropdown.classList.add('hidden');
    }
}

function removeSelectedStaff(staffId) {
    selectedModalStaff = selectedModalStaff.filter(s => s.id !== staffId);
    updateSelectedStaffDisplay();
}

function updateSelectedStaffDisplay() {
    const container = document.getElementById('selectedStaffList');
    const countEl = document.getElementById('selectedStaffCount');
    const noStaffEl = document.getElementById('noStaffSelected');

    if (countEl) countEl.textContent = selectedModalStaff.length;

    if (!container) return;

    if (selectedModalStaff.length === 0) {
        container.innerHTML = '<p id="noStaffSelected" class="text-xs text-gray-400 italic">No staff selected</p>';
    } else {
        container.innerHTML = selectedModalStaff.map(staff => `
            <div class="inline-flex items-center gap-1 px-2 py-1 bg-blue-100 text-blue-800 rounded-full text-xs">
                <span class="font-medium">${staff.name}</span>
                <button type="button" onclick="removeSelectedStaff('${staff.id}')" class="hover:text-blue-600">
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `).join('');
    }
}

function loadRecommendedStaff() {
    const container = document.getElementById('recommendedStaffList');
    if (!container) return;

    // Get 3 random staff not already selected
    const available = sampleStaff.filter(s => !selectedModalStaff.some(sel => sel.id === s.id));
    const recommended = available.slice(0, 3);

    container.innerHTML = recommended.map(staff => `
        <button type="button" onclick="selectStaffFromSearch('${staff.id}')" 
                class="inline-flex items-center gap-1 px-2 py-1 border border-gray-300 text-gray-700 rounded-full text-xs hover:border-blue-500 hover:bg-blue-50">
            <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            <span>${staff.name}</span>
        </button>
    `).join('');
}

// Get selected staff IDs for saving
function getSelectedStaffIds() {
    return selectedModalStaff.map(s => s.id);
}


function makeEventDraggable(element, event) {
    // Simple drag implementation - can be enhanced with a library
    element.draggable = true;
    element.addEventListener('dragstart', (e) => {
        dragState = { event, element };
        element.classList.add('dragging');
        e.dataTransfer.effectAllowed = 'move';
    });

    element.addEventListener('dragend', () => {
        element.classList.remove('dragging');
        dragState = null;
    });
}

function updateCurrentTimeIndicator() {
    if (currentView !== 'week' && currentView !== 'day') return;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentTime = currentHour * 60 + currentMin;

    // Remove existing indicator
    document.querySelectorAll('.current-time-line').forEach(el => el.remove());

    // Add indicator if viewing today
    const todayStr = formatDateString(now);
    if (currentView === 'week') {
        const weekStart = getWeekStart(currentDate);
        for (let i = 0; i < 7; i++) {
            const day = new Date(weekStart);
            day.setDate(day.getDate() + i);
            if (formatDateString(day) === todayStr) {
                const dayColumn = document.querySelector(`[data-date="${todayStr}"]`)?.parentElement;
                if (dayColumn) {
                    const line = document.createElement('div');
                    line.className = 'current-time-line';
                    line.style.top = `${currentTime * 1}px`;
                    dayColumn.appendChild(line);
                }
            }
        }
    } else if (currentView === 'day') {
        if (formatDateString(currentDate) === todayStr) {
            const timeSlots = document.getElementById('dayTimeSlots');
            if (timeSlots) {
                const line = document.createElement('div');
                line.className = 'current-time-line';
                line.style.top = `${currentTime * 1.33}px`;
                timeSlots.appendChild(line);
            }
        }
    }
}

function updateEventCount() {
    document.getElementById('eventCount').textContent = filteredEvents.length;
}

function formatDate(date) {
    return date.toLocaleDateString('en-AU', {
        day: 'numeric',
        month: 'short',
        year: 'numeric'
    });
}

function formatDateString(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
}

function formatHour(hour) {
    return `${String(hour).padStart(2, '0')}:00`;
}

function parseTime(timeStr) {
    let normalized = normalizeTime(timeStr);
    const [hours, minutes] = normalized.split(':').map(Number);
    return hours + (minutes || 0) / 60;
}

function normalizeTime(timeStr) {
    if (!timeStr) return '00:00';
    if (/^\d{1,2}:\d{2}$/.test(timeStr.trim())) {
        const [hours, minutes] = timeStr.split(':').map(Number);
        return `${String(hours).padStart(2, '0')}:${String(minutes).padStart(2, '0')}`;
    }
    const match = timeStr.trim().match(/(\d{1,2}):(\d{2})\s*(AM|PM)/i);
    if (match) {
        let hours = parseInt(match[1]);
        const minutes = match[2];
        const period = match[3].toUpperCase();
        if (period === 'PM' && hours !== 12) hours += 12;
        else if (period === 'AM' && hours === 12) hours = 0;
        return `${String(hours).padStart(2, '0')}:${minutes}`;
    }
    return '00:00';
}

function showNotification(message, type = 'info') {
    const container = document.createElement('div');
    container.className = `fixed top-20 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${type === 'success' ? 'bg-green-500' :
        type === 'error' ? 'bg-red-500' :
            type === 'warning' ? 'bg-yellow-500' :
                'bg-blue-500'
        }`;
    container.textContent = message;

    document.body.appendChild(container);

    setTimeout(() => {
        container.style.opacity = '0';
        container.style.transition = 'opacity 0.3s';
        setTimeout(() => {
            if (document.body.contains(container)) {
                document.body.removeChild(container);
            }
        }, 300);
    }, 3000);
}

// Update filter checkboxes
document.addEventListener('DOMContentLoaded', function () {
    document.getElementById('filterJobs').addEventListener('change', function () {
        filters.jobs = this.checked;
        applyFilters();
    });
    document.getElementById('filterSessions').addEventListener('change', function () {
        filters.sessions = this.checked;
        applyFilters();
    });
    document.getElementById('filterScheduled').addEventListener('change', function () {
        filters.scheduled = this.checked;
        applyFilters();
    });
    document.getElementById('filterInProgress').addEventListener('change', function () {
        filters.inProgress = this.checked;
        applyFilters();
    });
    document.getElementById('filterCompleted').addEventListener('change', function () {
        filters.completed = this.checked;
        applyFilters();
    });
});

// Sample pricebook items for class linking
const samplePricebookItems = [
    { id: 'PB-001', name: 'Yoga Class Drop-in', price: 25.00, unit: 'per session', category: 'Fitness' },
    { id: 'PB-002', name: 'Yoga Monthly Membership', price: 150.00, unit: 'per month', category: 'Fitness' },
    { id: 'PB-003', name: 'Private Tutoring - 1 Hour', price: 75.00, unit: 'per hour', category: 'Education' },
    { id: 'PB-004', name: 'Group Tutoring Session', price: 35.00, unit: 'per session', category: 'Education' },
    { id: 'PB-005', name: 'Music Lesson - Beginner', price: 45.00, unit: 'per lesson', category: 'Music' },
    { id: 'PB-006', name: 'Music Lesson - Advanced', price: 65.00, unit: 'per lesson', category: 'Music' },
    { id: 'PB-007', name: 'Dance Class Drop-in', price: 20.00, unit: 'per class', category: 'Fitness' },
    { id: 'PB-008', name: 'Workshop - Full Day', price: 120.00, unit: 'per day', category: 'General' }
];

// Show pricebook modal for class creation
function showClassPricebookModal() {
    const modal = document.getElementById('classPricebookModal');
    if (!modal) return;

    // Render pricebook items
    filterClassPricebookItems();
    modal.classList.remove('hidden');
}

// Close pricebook modal
function closeClassPricebookModal() {
    const modal = document.getElementById('classPricebookModal');
    if (modal) {
        modal.classList.add('hidden');
        const searchInput = document.getElementById('classPricebookSearch');
        if (searchInput) searchInput.value = '';
    }
}

// Filter pricebook items based on search
function filterClassPricebookItems() {
    const searchInput = document.getElementById('classPricebookSearch');
    const searchTerm = searchInput?.value.toLowerCase() || '';
    const container = document.getElementById('classPricebookItemsList');
    if (!container) return;

    const filtered = samplePricebookItems.filter(item =>
        item.name.toLowerCase().includes(searchTerm) ||
        (item.category && item.category.toLowerCase().includes(searchTerm)) ||
        (item.tag && item.tag.toLowerCase().includes(searchTerm))
    );

    if (filtered.length === 0) {
        container.innerHTML = '<p class="p-3 text-sm text-gray-500 text-center">No pricebook items found</p>';
    } else {
        container.innerHTML = filtered.map(item => `
            <div onclick="selectClassPricebookItem('${item.id}')" 
                 class="p-3 border border-gray-200 rounded-lg hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-colors ${selectedPricebookItem?.id === item.id ? 'border-blue-500 bg-blue-50' : ''}">
                <div class="flex justify-between items-start">
                    <div class="flex-1">
                        <p class="font-medium text-gray-900">${item.name}</p>
                        <p class="text-xs text-gray-500 mt-1">${item.description || ''}</p>
                        ${item.tag ? `<span class="inline-block mt-1 px-2 py-0.5 text-xs bg-gray-100 text-gray-600 rounded">${item.tag}</span>` : ''}
                    </div>
                    <span class="text-sm font-semibold text-blue-600 ml-3">$${item.price.toFixed(2)}</span>
                </div>
            </div>
        `).join('');
    }
}

// Select a pricebook item
function selectClassPricebookItem(itemId) {
    const item = samplePricebookItems.find(p => p.id === itemId);
    if (!item) return;

    selectedPricebookItem = item;
    const pricebookIdInput = document.getElementById('classPricebookItemId');
    if (pricebookIdInput) pricebookIdInput.value = item.id;

    // Update the container to show selected item
    const container = document.getElementById('classPricebookContainer');
    if (container) {
        container.innerHTML = `
            <div class="flex items-center justify-between p-3 border border-blue-500 bg-blue-50 rounded-lg">
                <div class="flex-1">
                    <p class="font-medium text-gray-900">${item.name}</p>
                    ${item.description ? `<p class="text-xs text-gray-500 mt-1">${item.description}</p>` : ''}
                    ${item.tag ? `<span class="inline-block mt-1 px-2 py-0.5 text-xs bg-blue-100 text-blue-700 rounded">${item.tag}</span>` : ''}
                </div>
                <div class="flex items-center gap-3 ml-3">
                    <span class="text-sm font-semibold text-blue-600">$${item.price.toFixed(2)}</span>
                    <button type="button" onclick="removePricebookSelection()" class="text-gray-400 hover:text-red-500">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                        </svg>
                    </button>
                </div>
            </div>
        `;
    }

    closeClassPricebookModal();
}

// Remove pricebook selection
function removePricebookSelection() {
    selectedPricebookItem = null;
    document.getElementById('classPricebookItemId').value = '';

    const container = document.getElementById('classPricebookContainer');
    if (container) {
        container.innerHTML = `
            <button type="button" id="selectClassPricebookBtn" onclick="showClassPricebookModal()" class="w-full px-3 py-2 border-2 border-dashed border-gray-300 rounded-lg hover:border-blue-500 hover:bg-blue-50 transition-colors text-left">
                <div class="flex items-center gap-2">
                    <svg class="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                    </svg>
                    <div>
                        <p class="text-sm font-medium text-gray-700">Select Price Book Item</p>
                        <p class="text-xs text-gray-500">Link to a purchasable service</p>
                    </div>
                </div>
            </button>
        `;
    }
}

// ==================== Class Form Helper Functions ====================

function handleClassFrequencyChange() {
    const frequency = document.getElementById('classFrequency')?.value;
    const daysSection = document.getElementById('classDaysOfWeekSection');
    const customSection = document.getElementById('classCustomIntervalSection');

    if (!frequency || !daysSection || !customSection) return;

    if (frequency === 'weekly' || frequency === 'daily' || frequency === 'monthly') {
        daysSection.classList.remove('hidden');
        customSection.classList.add('hidden');
    } else if (frequency === 'custom') {
        daysSection.classList.add('hidden');
        customSection.classList.remove('hidden');
    } else {
        daysSection.classList.add('hidden');
        customSection.classList.add('hidden');
    }
}

function calculateClassDuration() {
    const startTime = document.getElementById('classStartTime')?.value;
    const endTime = document.getElementById('classEndTime')?.value;
    const durationInput = document.getElementById('classDuration');

    if (!durationInput) return;

    if (startTime && endTime) {
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);
        
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        
        if (endMinutes < startMinutes) {
            durationInput.value = '';
            showNotification('End time must be after start time', 'error');
            return;
        }
        
        const duration = endMinutes - startMinutes;
        durationInput.value = duration > 0 ? duration : '';
    } else {
        durationInput.value = '';
    }
}

// Class staff assignment state (already declared at top level)

function initializeClassStaffAssignment() {
    const searchInput = document.getElementById('classAssignmentSearchInput');
    const autocompleteDiv = document.getElementById('classAssignmentAutocomplete');

    if (!searchInput || !autocompleteDiv) return;

    searchInput.addEventListener('input', function() {
        const query = this.value.toLowerCase().trim();
        if (!query) {
            autocompleteDiv.classList.add('hidden');
            return;
        }
        
        const filtered = sampleStaff.filter(staff =>
            staff.name.toLowerCase().includes(query) ||
            staff.role.toLowerCase().includes(query) ||
            (staff.department && staff.department.toLowerCase().includes(query))
        );
        
        renderClassStaffAutocomplete(filtered);
    });

    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !autocompleteDiv.contains(e.target)) {
            autocompleteDiv.classList.add('hidden');
        }
    });

    updateClassSelectedStaffDisplay();
    loadClassRecommendedStaff();
}

function renderClassStaffAutocomplete(staffList) {
    const dropdown = document.getElementById('classAssignmentAutocomplete');
    if (!dropdown) return;

    const availableStaff = staffList.filter(s => !classSelectedStaff.some(sel => sel.id === s.id));

    if (availableStaff.length === 0) {
        dropdown.innerHTML = '<p class="p-3 text-sm text-gray-500 text-center">No staff found</p>';
    } else {
        dropdown.innerHTML = availableStaff.map(staff => `
            <button type="button" onclick="selectClassStaff('${staff.id}')" 
                    class="w-full flex items-center gap-3 p-3 hover:bg-blue-50 text-left border-b border-gray-100 last:border-b-0 transition-colors">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-medium">
                    ${staff.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div class="flex-1">
                    <div class="font-medium text-sm text-gray-900">${staff.name}</div>
                    <div class="text-xs text-gray-500">${staff.role}${staff.department ? ' • ' + staff.department : ''}</div>
                </div>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
            </button>
        `).join('');
    }

    dropdown.classList.remove('hidden');
}

function selectClassStaff(staffId) {
    const staff = sampleStaff.find(s => s.id === staffId);
    if (staff && !classSelectedStaff.some(s => s.id === staffId)) {
        classSelectedStaff.push(staff);
        updateClassSelectedStaffDisplay();
        
        const input = document.getElementById('classAssignmentSearchInput');
        const dropdown = document.getElementById('classAssignmentAutocomplete');
        if (input) input.value = '';
        if (dropdown) dropdown.classList.add('hidden');
    }
}

function removeClassStaff(staffId) {
    classSelectedStaff = classSelectedStaff.filter(s => s.id !== staffId);
    updateClassSelectedStaffDisplay();
}

function updateClassSelectedStaffDisplay() {
    const container = document.getElementById('classSelectedAssignmentsList');
    const countEl = document.getElementById('classSelectedAssignmentsCount');
    const errorEl = document.getElementById('classStaffError');

    if (countEl) countEl.textContent = classSelectedStaff.length;
    if (errorEl) errorEl.classList.add('hidden');

    if (!container) return;

    if (classSelectedStaff.length === 0) {
        container.innerHTML = '<p class="text-xs text-gray-400 italic">No staff selected</p>';
    } else {
        container.innerHTML = classSelectedStaff.map(staff => `
            <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm">
                <div class="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 text-xs font-medium">
                    ${staff.name.split(' ').map(n => n[0]).join('')}
                </div>
                <span class="font-medium">${staff.name}</span>
                <button type="button" onclick="removeClassStaff('${staff.id}')" class="text-blue-600 hover:text-blue-800">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `).join('');
    }
}

function loadClassRecommendedStaff() {
    const container = document.getElementById('classRecommendedAssignmentsList');
    if (!container) return;

    const available = sampleStaff.filter(s => !classSelectedStaff.some(sel => sel.id === s.id));
    const recommended = available.slice(0, 3);

    container.innerHTML = recommended.map(staff => `
        <button type="button" onclick="selectClassStaff('${staff.id}')" 
                class="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <div class="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-xs">
                ${staff.name.split(' ').map(n => n[0]).join('')}
            </div>
            <span>${staff.name}</span>
            <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
        </button>
    `).join('');
}

// ==================== Session Tab Management ====================

function switchSessionTab(tabName, e) {
    if (e) e.preventDefault();
    
    // Hide all tab contents
    document.querySelectorAll('.session-tab-content').forEach(content => {
        content.classList.add('hidden');
    });
    
    // Remove active class from all tabs
    document.querySelectorAll('.session-tab-button').forEach(btn => {
        btn.classList.remove('active', 'border-blue-500', 'text-blue-600');
        btn.classList.add('border-transparent', 'text-gray-500');
    });
    
    // Show selected tab content
    const content = document.getElementById(`session${tabName.charAt(0).toUpperCase() + tabName.slice(1)}Content`);
    if (content) content.classList.remove('hidden');
    
    // Activate selected tab button
    const button = document.getElementById(`session${tabName.charAt(0).toUpperCase() + tabName.slice(1)}Tab`);
    if (button) {
        button.classList.add('active', 'border-blue-500', 'text-blue-600');
        button.classList.remove('border-transparent', 'text-gray-500');
    }
}

// ==================== Session Staff Assignment ====================

function initializeSessionStaffAssignment(event) {
    sessionSelectedStaff = [];
    if (event.assignedStaff && Array.isArray(event.assignedStaff)) {
        event.assignedStaff.forEach(staff => {
            if (typeof staff === 'string') {
                const staffObj = sampleStaff.find(s => s.id === staff || s.name === staff);
                if (staffObj) sessionSelectedStaff.push(staffObj);
            } else {
                sessionSelectedStaff.push(staff);
            }
        });
    }
    
    updateSessionSelectedStaffDisplay();
    loadSessionRecommendedStaff();
    
    const searchInput = document.getElementById('sessionAssignmentSearchInput');
    const autocompleteDiv = document.getElementById('sessionAssignmentAutocomplete');
    
    if (searchInput && autocompleteDiv) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase().trim();
            if (!query) {
                autocompleteDiv.classList.add('hidden');
                return;
            }
            
            const filtered = sampleStaff.filter(staff =>
                staff.name.toLowerCase().includes(query) ||
                staff.role.toLowerCase().includes(query) ||
                (staff.department && staff.department.toLowerCase().includes(query))
            );
            
            renderSessionStaffAutocomplete(filtered);
        });
        
        document.addEventListener('click', function(e) {
            if (!searchInput.contains(e.target) && !autocompleteDiv.contains(e.target)) {
                autocompleteDiv.classList.add('hidden');
            }
        });
    }
}

function renderSessionStaffAutocomplete(staffList) {
    const dropdown = document.getElementById('sessionAssignmentAutocomplete');
    if (!dropdown) return;

    const availableStaff = staffList.filter(s => !sessionSelectedStaff.some(sel => sel.id === s.id));

    if (availableStaff.length === 0) {
        dropdown.innerHTML = '<p class="p-3 text-sm text-gray-500 text-center">No staff found</p>';
    } else {
        dropdown.innerHTML = availableStaff.map(staff => `
            <button type="button" onclick="selectSessionStaff('${staff.id}')" 
                    class="w-full flex items-center gap-3 p-3 hover:bg-blue-50 text-left border-b border-gray-100 last:border-b-0 transition-colors">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-medium">
                    ${staff.name.split(' ').map(n => n[0]).join('')}
                </div>
                <div class="flex-1">
                    <div class="font-medium text-sm text-gray-900">${staff.name}</div>
                    <div class="text-xs text-gray-500">${staff.role}${staff.department ? ' • ' + staff.department : ''}</div>
                </div>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
            </button>
        `).join('');
    }

    dropdown.classList.remove('hidden');
}

function selectSessionStaff(staffId) {
    const staff = sampleStaff.find(s => s.id === staffId);
    if (staff && !sessionSelectedStaff.some(s => s.id === staffId)) {
        sessionSelectedStaff.push(staff);
        updateSessionSelectedStaffDisplay();
        
        const input = document.getElementById('sessionAssignmentSearchInput');
        const dropdown = document.getElementById('sessionAssignmentAutocomplete');
        if (input) input.value = '';
        if (dropdown) dropdown.classList.add('hidden');
    }
}

function removeSessionStaff(staffId) {
    sessionSelectedStaff = sessionSelectedStaff.filter(s => s.id !== staffId);
    updateSessionSelectedStaffDisplay();
}

function updateSessionSelectedStaffDisplay() {
    const container = document.getElementById('sessionSelectedAssignmentsList');
    const countEl = document.getElementById('sessionSelectedAssignmentsCount');

    if (countEl) countEl.textContent = sessionSelectedStaff.length;

    if (!container) return;

    if (sessionSelectedStaff.length === 0) {
        container.innerHTML = '<p class="text-xs text-gray-400 italic">No staff selected</p>';
    } else {
        container.innerHTML = sessionSelectedStaff.map(staff => `
            <div class="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-100 text-blue-800 rounded-lg text-sm">
                <div class="w-6 h-6 bg-blue-200 rounded-full flex items-center justify-center text-blue-700 text-xs font-medium">
                    ${staff.name.split(' ').map(n => n[0]).join('')}
                </div>
                <span class="font-medium">${staff.name}</span>
                <button type="button" onclick="removeSessionStaff('${staff.id}')" class="text-blue-600 hover:text-blue-800">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `).join('');
    }
}

function loadSessionRecommendedStaff() {
    const container = document.getElementById('sessionRecommendedAssignmentsList');
    if (!container) return;

    const available = sampleStaff.filter(s => !sessionSelectedStaff.some(sel => sel.id === s.id));
    const recommended = available.slice(0, 3);

    container.innerHTML = recommended.map(staff => `
        <button type="button" onclick="selectSessionStaff('${staff.id}')" 
                class="inline-flex items-center gap-2 px-3 py-1.5 border border-gray-300 text-gray-700 rounded-lg text-sm hover:border-blue-500 hover:bg-blue-50 transition-colors">
            <div class="w-5 h-5 bg-gray-100 rounded-full flex items-center justify-center text-gray-600 text-xs">
                ${staff.name.split(' ').map(n => n[0]).join('')}
            </div>
            <span>${staff.name}</span>
            <svg class="w-3 h-3 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
        </button>
    `).join('');
}

// ==================== Session Enrollment Management ====================

function loadSessionEnrollments(event) {
    // Load bookings for this session
    const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
    const session = sessions.find(s => s.id === event.id);
    
    const bookings = session?.bookings || [];
    const confirmedCount = bookings.filter(b => b.status === 'confirmed').length;
    const totalBookings = bookings.length;
    const capacity = event.capacity || 0;
    
    // Update stats
    const totalEl = document.getElementById('sessionTotalBookings');
    const confirmedEl = document.getElementById('sessionConfirmedBookings');
    const capacityEl = document.getElementById('sessionCapacityDisplay');
    
    if (totalEl) totalEl.textContent = totalBookings;
    if (confirmedEl) confirmedEl.textContent = confirmedCount;
    if (capacityEl) capacityEl.textContent = `${totalBookings}/${capacity}`;
    
    // Update count
    const countEl = document.getElementById('sessionBookingsCount');
    if (countEl) countEl.textContent = `${totalBookings} booking${totalBookings !== 1 ? 's' : ''}`;
    
    // Render bookings
    renderSessionBookings(bookings);
}

function renderSessionBookings(bookings) {
    const container = document.getElementById('sessionBookingsList');
    const emptyState = document.getElementById('sessionEmptyBookingsState');
    
    if (!container) return;
    
    if (bookings.length === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
        container.innerHTML = '';
    } else {
        if (emptyState) emptyState.classList.add('hidden');
        container.innerHTML = bookings.map((booking, index) => {
            // Find booking index in actual session data
            const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
            const session = sessions.find(s => s.id === editingEvent?.id);
            const actualIndex = session?.bookings?.findIndex(b => b.id === booking.id) ?? index;
            
            return `
            <div class="border border-gray-200 rounded-lg p-4 hover:bg-gray-50 transition-colors">
                <div class="flex items-start justify-between">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-2">
                            <h4 class="font-semibold text-gray-900">${booking.attendeeName || booking.studentName || 'Unnamed Attendee'}</h4>
                            <span class="px-2 py-0.5 text-xs rounded ${booking.status === 'confirmed' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">
                                ${booking.status || 'pending'}
                            </span>
                        </div>
                        ${booking.customerName ? `<p class="text-sm text-gray-600">Customer: ${booking.customerName}</p>` : ''}
                        ${booking.customerEmail ? `<p class="text-xs text-gray-500">${booking.customerEmail}</p>` : ''}
                        ${booking.quoteId ? `<p class="text-xs text-gray-500 mt-1">Quote: ${booking.quoteId}</p>` : ''}
                        ${booking.notes ? `<p class="text-sm text-gray-600 mt-2 italic">${booking.notes}</p>` : ''}
                        ${booking.bookedAt ? `<p class="text-xs text-gray-400 mt-2">Booked: ${formatDate(new Date(booking.bookedAt))}</p>` : ''}
                    </div>
                    <div class="flex gap-2">
                        <button onclick="editSessionBooking(${actualIndex})" class="text-blue-600 hover:text-blue-800 text-sm font-medium">
                            Edit
                        </button>
                        <button onclick="removeSessionBooking(${actualIndex})" class="text-red-600 hover:text-red-800 text-sm font-medium">
                            Remove
                        </button>
                    </div>
                </div>
            </div>
        `;
        }).join('');
    }
}

function searchSessionBookedCustomers(query, event) {
    const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
    const session = sessions.find(s => s.id === event.id);
    const bookings = session?.bookings || [];
    
    if (!query.trim()) {
        renderSessionBookings(bookings);
        return;
    }
    
    const searchTerm = query.toLowerCase();
    const filtered = bookings.filter(b =>
        (b.attendeeName && b.attendeeName.toLowerCase().includes(searchTerm)) ||
        (b.customerName && b.customerName.toLowerCase().includes(searchTerm)) ||
        (b.customerEmail && b.customerEmail.toLowerCase().includes(searchTerm)) ||
        (b.quoteId && b.quoteId.toLowerCase().includes(searchTerm))
    );
    
    renderSessionBookings(filtered);
}

// ==================== Session Enrollment Booking ====================

let currentSessionBookingState = null;

function openSessionBookCustomerModal(event) {
    const modal = document.getElementById('sessionBookCustomerModal');
    if (!modal) return;

    // Reset form
    clearSessionSlotBooking();
    const searchInput = document.getElementById('sessionCustomerSearchInput');
    if (searchInput) searchInput.value = '';
    const autocomplete = document.getElementById('sessionCustomerAutocomplete');
    if (autocomplete) autocomplete.classList.add('hidden');

    // Get class data to check pricebook item
    const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
    const session = sessions.find(s => s.id === event.id);
    if (!session) return;

    const classes = JSON.parse(localStorage.getItem('classes_v2') || '[]');
    const classData = classes.find(c => c.id === session.classId);
    const pricebookItemId = classData?.pricebookItemId;

    const hint = document.getElementById('sessionCustomerSearchHint');
    if (pricebookItemId) {
        if (searchInput) searchInput.disabled = false;
        if (hint) hint.innerHTML = '<span class="text-emerald-600">✓</span> Ready to search for customers';
    } else {
        if (searchInput) searchInput.disabled = true;
        if (hint) hint.innerHTML = '<span class="text-amber-600">⚠️</span> Please ensure a pricebook item is linked to this class to search for customers';
    }

    // Store current session for booking
    currentSessionBookingState = { session: session, classData: classData };

    modal.classList.remove('hidden');
}

function closeSessionBookCustomerModal() {
    const modal = document.getElementById('sessionBookCustomerModal');
    if (modal) {
        modal.classList.add('hidden');
        clearSessionSlotBooking();
    }
}

function clearSessionSlotBooking() {
    currentSessionBookingState = null;
    const form = document.getElementById('sessionSlotBookingForm');
    if (form) form.classList.add('hidden');
    
    const searchInput = document.getElementById('sessionCustomerSearchInput');
    if (searchInput) searchInput.value = '';
    
    const attendeeName = document.getElementById('sessionAttendeeName');
    const attendeeNotes = document.getElementById('sessionAttendeeNotes');
    if (attendeeName) attendeeName.value = '';
    if (attendeeNotes) attendeeNotes.value = '';
}

function searchSessionCustomersForBooking(query) {
    const resultsContainer = document.getElementById('sessionCustomerAutocomplete');
    if (!resultsContainer || !currentSessionBookingState) return;

    const { classData } = currentSessionBookingState;
    const pricebookItemId = classData?.pricebookItemId;

    // Check if pricebook item is selected
    if (!pricebookItemId) {
        if (query && query.length >= 2) {
            resultsContainer.innerHTML = '<div class="p-3 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded">⚠️ Please ensure a pricebook item is linked to this class</div>';
            resultsContainer.classList.remove('hidden');
        } else {
            resultsContainer.classList.add('hidden');
        }
        return;
    }

    if (!query || query.trim().length < 2) {
        resultsContainer.classList.add('hidden');
        return;
    }

    query = query.trim().toLowerCase();

    // Filter customers
    const matchingEntries = [];
    
    sampleCustomers.forEach(customer => {
        const matchesSearch = customer.name.toLowerCase().includes(query) ||
            customer.email.toLowerCase().includes(query);

        if (!matchesSearch || !customer.quotes) return;

        const matchingQuotes = customer.quotes.filter(quote => {
            if (quote.pricebookItemId !== pricebookItemId || quote.status !== 'approved') {
                return false;
            }
            return true;
        });

        matchingQuotes.forEach(quote => {
            matchingEntries.push({ customer, quote });
        });
    });

    if (matchingEntries.length === 0) {
        resultsContainer.innerHTML = '<div class="p-3 text-sm text-gray-500">No available quotes found</div>';
        resultsContainer.classList.remove('hidden');
        return;
    }

    // Group by customer
    const groupedByCustomer = matchingEntries.reduce((map, entry) => {
        if (!map.has(entry.customer.id)) {
            map.set(entry.customer.id, { customer: entry.customer, quotes: [] });
        }
        map.get(entry.customer.id).quotes.push(entry.quote);
        return map;
    }, new Map());

    resultsContainer.innerHTML = Array.from(groupedByCustomer.values()).map(group => `
        <div class="p-3 border-b border-gray-200 last:border-b-0 hover:bg-gray-50">
            <div class="flex items-center justify-between mb-2">
                <div>
                    <p class="font-semibold text-gray-900 text-sm">${group.customer.name}</p>
                    <p class="text-xs text-gray-600 mt-0.5">${group.customer.email}</p>
                </div>
                <span class="text-xs text-gray-500">${group.quotes.length} quote${group.quotes.length > 1 ? 's' : ''}</span>
            </div>
            <div class="space-y-1">
                ${group.quotes.map(quote => `
                    <button 
                        type="button"
                        onclick="selectSessionCustomerForBooking('${group.customer.id}', '${quote.id}')"
                        class="w-full text-left px-3 py-2 border border-gray-200 rounded-lg bg-white hover:bg-emerald-50 hover:border-emerald-200 transition-colors flex items-center justify-between text-xs"
                    >
                        <div>
                            <p class="font-medium text-gray-900">${quote.id}</p>
                            <p class="text-[11px] text-gray-500">Total: $${quote.total.toFixed(2)}</p>
                        </div>
                    </button>
                `).join('')}
            </div>
        </div>
    `).join('');

    resultsContainer.classList.remove('hidden');
}

function selectSessionCustomerForBooking(customerId, quoteId) {
    if (!currentSessionBookingState) return;

    // Find customer and quote
    const customer = sampleCustomers.find(c => c.id === customerId);
    if (!customer) {
        showNotification('Customer not found', 'error');
        return;
    }

    const quote = customer.quotes.find(q => q.id === quoteId);
    if (!quote) {
        showNotification('Quote not found', 'error');
        return;
    }

    const { session, classData } = currentSessionBookingState;

    // Calculate inventory for this specific session
    const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
    const currentSession = sessions.find(s => s.id === session.id);
    const bookedSlots = currentSession?.bookings?.filter(b => b.status === 'confirmed').length || 0;
    const capacity = currentSession?.maxCapacity || classData?.maxCapacity || 20;
    const available = Math.max(0, capacity - bookedSlots);
    
    // Calculate total purchased from quote
    const totalPurchased = quote.quantity || 1;

    // Store booking state
    currentSessionBookingState = {
        ...currentSessionBookingState,
        customer: customer,
        quote: quote,
        inventory: {
            total: totalPurchased,
            booked: bookedSlots,
            available: available
        }
    };

    // Hide autocomplete and show booking form
    document.getElementById('sessionCustomerAutocomplete').classList.add('hidden');
    document.getElementById('sessionCustomerSearchInput').value = '';
    showSessionSlotBookingForm();
}

function showSessionSlotBookingForm() {
    const form = document.getElementById('sessionSlotBookingForm');
    if (!form || !currentSessionBookingState) return;

    const { customer, quote, inventory } = currentSessionBookingState;

    // Update customer info
    document.getElementById('sessionSlotBookCustomerName').textContent = customer.name;
    document.getElementById('sessionSlotBookCustomerEmail').textContent = customer.email;

    // Update inventory
    document.getElementById('sessionInventoryTotal').textContent = inventory.total;
    document.getElementById('sessionInventoryBooked').textContent = inventory.booked;
    document.getElementById('sessionInventoryAvailable').textContent = inventory.available;

    // Update quote display
    const quoteDisplay = document.getElementById('sessionSlotBookQuoteDisplay');
    if (quoteDisplay) {
        quoteDisplay.innerHTML = `
            <div class="flex items-center justify-between">
                <div>
                    <p class="font-medium text-gray-900">${quote.id}</p>
                    <p class="text-xs text-gray-500">Total: $${quote.total.toFixed(2)}</p>
                </div>
                <span class="px-2 py-1 text-xs rounded ${quote.status === 'approved' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'}">${quote.status}</span>
            </div>
        `;
    }

    // Check payment status
    const paymentWarning = document.getElementById('sessionPaymentWarning');
    if (paymentWarning && quote.paymentStatus !== 'paid') {
        paymentWarning.classList.remove('hidden');
        document.getElementById('sessionPaymentWarningText').textContent = 
            quote.paymentStatus === 'partial' ? 'This quote is partially paid.' : 'This quote is not fully paid.';
    } else if (paymentWarning) {
        paymentWarning.classList.add('hidden');
    }

    form.classList.remove('hidden');
    updateSessionAttendeeState();
}

function updateSessionAttendeeState() {
    const attendeeName = document.getElementById('sessionAttendeeName')?.value.trim();
    const confirmBtn = document.getElementById('sessionConfirmBookingBtn');
    const confirmBtnText = document.getElementById('sessionConfirmBookingBtnText');

    if (confirmBtn) {
        if (attendeeName) {
            confirmBtn.disabled = false;
            if (confirmBtnText) confirmBtnText.textContent = 'Book Slot';
        } else {
            confirmBtn.disabled = true;
            if (confirmBtnText) confirmBtnText.textContent = 'Enter attendee name';
        }
    }
}

function confirmSessionSlotBooking() {
    if (!currentSessionBookingState) {
        showNotification('Please select a customer first', 'warning');
        return;
    }

    const { session, customer, quote, inventory } = currentSessionBookingState;

    // Get attendee info
    const attendeeName = document.getElementById('sessionAttendeeName')?.value.trim();
    const attendeeNotes = document.getElementById('sessionAttendeeNotes')?.value.trim() || '';

    if (!attendeeName) {
        showNotification('Please enter an attendee name', 'error');
        return;
    }

    // Check capacity
    if (inventory.available <= 0) {
        showNotification('This session is at full capacity', 'error');
        return;
    }

    try {
        const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        const sessionIndex = sessions.findIndex(s => s.id === session.id);
        if (sessionIndex === -1) {
            showNotification('Session not found', 'error');
            return;
        }

        const currentSession = sessions[sessionIndex];
        const now = new Date().toISOString();

        // Create booking
        const bookingId = `BOOKING-${session.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newBooking = {
            id: bookingId,
            customerId: customer.id,
            customerName: customer.name,
            customerEmail: customer.email,
            quoteId: quote.id,
            sessionId: session.id,
            classId: session.classId,
            attendeeName: attendeeName,
            notes: attendeeNotes,
            status: 'confirmed',
            bookedAt: now,
            updatedAt: now
        };

        // Add booking to session
        if (!currentSession.bookings) {
            currentSession.bookings = [];
        }
        currentSession.bookings.push(newBooking);
        currentSession.confirmedSlots = (currentSession.confirmedSlots || 0) + 1;
        currentSession.updatedAt = now;

        sessions[sessionIndex] = currentSession;
        localStorage.setItem('class_sessions_v2', JSON.stringify(sessions));

        // Success
        showNotification(`Successfully enrolled ${attendeeName} for this session`, 'success');

        // Close modal and refresh
        clearSessionSlotBooking();
        closeSessionBookCustomerModal();
        
        // Reload enrollments if we're still in the edit modal
        if (editingEvent && editingEvent.id === session.id) {
            loadSessionEnrollments(editingEvent);
            loadEvents(); // Refresh calendar
        }
    } catch (error) {
        console.error('Error saving booking:', error);
        showNotification('Error saving booking', 'error');
    }
}

function editSessionBooking(index) {
    showNotification('Edit booking functionality will be implemented.', 'info');
}

function removeSessionBooking(index) {
    if (!confirm('Are you sure you want to remove this booking?')) return;
    
    const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
    const session = sessions.find(s => s.id === editingEvent.id);
    
    if (session && session.bookings) {
        session.bookings.splice(index, 1);
        session.confirmedSlots = session.bookings.filter(b => b.status === 'confirmed').length;
        localStorage.setItem('class_sessions_v2', JSON.stringify(sessions));
        
        loadSessionEnrollments(editingEvent);
        showNotification('Booking removed successfully', 'success');
    }
}

// ==================== Session Date/Time Management ====================

function updateSessionDateTime() {
    const dateInput = document.getElementById('eventDate');
    const startTimeInput = document.getElementById('eventTime');
    const endTimeInput = document.getElementById('eventEndTime');
    
    if (!dateInput || !startTimeInput) return;
    
    // Update date display
    const dateDisplay = document.getElementById('sessionDateDisplay');
    if (dateDisplay && dateInput.value) {
        const date = new Date(dateInput.value);
        dateDisplay.textContent = formatDate(date);
    }
    
    // Update time displays
    const startTimeDisplay = document.getElementById('sessionStartTimeDisplay');
    if (startTimeDisplay && startTimeInput.value) {
        startTimeDisplay.textContent = formatTime(startTimeInput.value);
    }
    
    const endTimeDisplay = document.getElementById('sessionEndTimeDisplay');
    if (endTimeDisplay) {
        if (endTimeInput && endTimeInput.value) {
            endTimeDisplay.textContent = formatTime(endTimeInput.value);
        } else {
            endTimeDisplay.textContent = 'Not set';
        }
    }
    
    // Calculate and display duration
    calculateSessionDuration();
    
    // Update time range display
    const timeRangeDisplay = document.getElementById('sessionTimeRange');
    if (timeRangeDisplay) {
        const start = startTimeInput.value || '00:00';
        const end = (endTimeInput && endTimeInput.value) ? endTimeInput.value : '';
        timeRangeDisplay.textContent = `${formatTime(start)}${end ? ` - ${formatTime(end)}` : ''}`;
    }
}

function calculateSessionDuration() {
    const startTimeInput = document.getElementById('eventTime');
    const endTimeInput = document.getElementById('eventEndTime');
    const durationDisplay = document.getElementById('sessionDurationDisplay');
    
    if (!startTimeInput || !durationDisplay) return;
    
    if (endTimeInput && endTimeInput.value && startTimeInput.value) {
        const [startHour, startMin] = startTimeInput.value.split(':').map(Number);
        const [endHour, endMin] = endTimeInput.value.split(':').map(Number);
        
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        
        if (endMinutes < startMinutes) {
            durationDisplay.textContent = 'Invalid (end before start)';
            durationDisplay.classList.add('text-red-600');
            return;
        }
        
        const durationMinutes = endMinutes - startMinutes;
        const hours = Math.floor(durationMinutes / 60);
        const minutes = durationMinutes % 60;
        
        let durationText = '';
        if (hours > 0) {
            durationText = `${hours} hour${hours !== 1 ? 's' : ''}`;
        }
        if (minutes > 0) {
            if (durationText) durationText += ' ';
            durationText += `${minutes} minute${minutes !== 1 ? 's' : ''}`;
        }
        
        durationDisplay.textContent = durationText || '0 minutes';
        durationDisplay.classList.remove('text-red-600');
    } else {
        durationDisplay.textContent = 'Set end time to calculate';
        durationDisplay.classList.remove('text-red-600');
    }
}

function formatTime(timeStr) {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function setSessionTime(startTime, endTime) {
    const startTimeInput = document.getElementById('eventTime');
    const endTimeInput = document.getElementById('eventEndTime');
    
    if (startTimeInput) {
        startTimeInput.value = startTime;
    }
    if (endTimeInput) {
        endTimeInput.value = endTime;
    }
    
    updateSessionDateTime();
}

// ==================== Staff Filter Functionality ====================

function initializeStaffFilter() {
    const searchInput = document.getElementById('staffSearchInput');
    const dropdown = document.getElementById('staffAutocompleteDropdown');
    
    if (!searchInput || !dropdown) return;
    
    // Search functionality with autocomplete
    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.toLowerCase().trim();
        
        if (!query) {
            dropdown.classList.add('hidden');
            return;
        }
        
        showStaffAutocomplete(query);
    });
    
    // Close dropdown when clicking outside
    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });
    
    // Clear search when pressing Escape
    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            dropdown.classList.add('hidden');
        }
    });
    
    // Initialize empty state
    updateSelectedStaffTags();
}

function showStaffAutocomplete(query) {
    const dropdown = document.getElementById('staffAutocompleteDropdown');
    if (!dropdown) return;
    
    // Filter staff that aren't already selected and match the query
    const availableForSelection = sampleStaff.filter(staff => {
        const staffName = staff.name;
        return !staffFilter.includes(staffName) &&
            (staffName.toLowerCase().includes(query) || 
             staff.role.toLowerCase().includes(query) ||
             (staff.department && staff.department.toLowerCase().includes(query)));
    });
    
    if (availableForSelection.length === 0) {
        dropdown.innerHTML = '<div class="p-3 text-sm text-gray-500 text-center">No staff found</div>';
        dropdown.classList.remove('hidden');
        return;
    }
    
    dropdown.innerHTML = availableForSelection.map(staff => `
        <button 
            onclick="selectStaffForFilter('${staff.id}')" 
            class="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left border-b border-gray-100 last:border-b-0 transition-colors"
        >
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-medium">
                ${staff.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div class="flex-1">
                <div class="font-medium text-sm text-gray-900">${staff.name}</div>
                <div class="text-xs text-gray-500">${staff.role}${staff.department ? ' • ' + staff.department : ''}</div>
            </div>
            <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
        </button>
    `).join('');
    
    dropdown.classList.remove('hidden');
}

function selectStaffForFilter(staffId) {
    const staff = sampleStaff.find(s => s.id === staffId);
    if (!staff || staffFilter.includes(staff.name)) return;
    
    // Add staff to filter
    staffFilter.push(staff.name);
    
    // Clear search input and hide dropdown
    const searchInput = document.getElementById('staffSearchInput');
    const dropdown = document.getElementById('staffAutocompleteDropdown');
    if (searchInput) searchInput.value = '';
    if (dropdown) dropdown.classList.add('hidden');
    
    // Update UI and refresh calendar
    updateSelectedStaffTags();
    applyFilters();
}

function removeStaffFromFilter(staffName) {
    staffFilter = staffFilter.filter(name => name !== staffName);
    updateSelectedStaffTags();
    applyFilters();
}

function clearAllStaffFilters() {
    staffFilter = [];
    updateSelectedStaffTags();
    applyFilters();
}

function updateSelectedStaffTags() {
    const container = document.getElementById('selectedStaffTags');
    if (!container) return;
    
    if (staffFilter.length === 0) {
        container.innerHTML = '<span class="text-xs text-gray-500 py-1">All staff shown</span>';
        return;
    }
    
    // Color map for staff tags
    const colorMap = {
        'Daniel Davis': 'bg-blue-100 text-blue-800',
        'Sarah Johnson': 'bg-green-100 text-green-800',
        'Michael Chen': 'bg-purple-100 text-purple-800',
        'Emily Rodriguez': 'bg-pink-100 text-pink-800',
        'James Wilson': 'bg-orange-100 text-orange-800'
    };
    
    const tags = staffFilter.map(staffName => {
        const staff = sampleStaff.find(s => s.name === staffName);
        const colorClass = colorMap[staffName] || 'bg-gray-100 text-gray-800';
        const initials = staff ? staff.name.split(' ').map(n => n[0]).join('') : staffName.split(' ').map(n => n[0]).join('');
        
        return `
            <span class="inline-flex items-center gap-1 px-2 py-1 ${colorClass} rounded-full text-xs font-medium">
                ${initials}
                ${staffName}
                <button 
                    onclick="removeStaffFromFilter('${staffName}')" 
                    class="ml-1 hover:bg-black hover:bg-opacity-10 rounded-full p-0.5 transition-colors"
                    title="Remove ${staffName}"
                >
                    <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </span>
        `;
    }).join('');
    
    const clearAllButton = staffFilter.length > 1 ? `
        <button 
            onclick="clearAllStaffFilters()" 
            class="inline-flex items-center gap-1 px-2 py-1 bg-gray-100 text-gray-600 hover:bg-gray-200 rounded-full text-xs font-medium transition-colors"
            title="Clear all staff filters"
        >
            Clear all
        </button>
    ` : '';
    
    container.innerHTML = tags + clearAllButton;
}


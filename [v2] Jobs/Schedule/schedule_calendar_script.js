// Schedule Calendar Script
// Manager calendar with CRUD functionality for learning service sessions

// State
let currentDate = new Date();
let currentView = 'month';
let allEvents = []; // All sessions (converted to events format)
let filteredEvents = [];
let selectedEvent = null;
let editingEvent = null;
let dragState = null;
let sessionSelectedStaff = []; // Staff selected for session editing
let currentSessionBookingState = null; // State for session enrollment booking
let tempCreateDate = null; // Temporary date storage for creation
let tempCreateTime = null; // Temporary time storage for creation

// Filters
let filters = {
    classSessions: true,
    groupSessions: true,
    oneToOne: true,
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
    // Seed data if empty
    seedData();

    // Load events
    loadEvents();
    // ... (rest of function)

    // Populate service filter
    populateServiceFilter();

    // Initialize staff filter
    initializeStaffFilter();

    // Render initial view
    switchView('month');

    // Update current time indicator in week/day view
    updateCurrentTimeIndicator();
    setInterval(updateCurrentTimeIndicator, 60000); // Update every minute
}

function seedData() {
    if (!localStorage.getItem('fms_learning_services')) {
        const services = [
            {
                id: 'ls_001',
                name: 'Algebra Basics',
                description: 'Introduction to Algebra concepts.',
                type: 'Class',
                maxCapacity: 15,
                status: 'active',
                defaultAssignments: [{ id: 'STAFF-001', name: 'Daniel Davis' }],
                schedule: {
                    frequency: 'weekly',
                    daysOfWeek: ['Monday', 'Wednesday', 'Friday'],
                    startTime: '09:00',
                    endTime: '10:30',
                    duration: 90
                }
            },
            {
                id: 'ls_002',
                name: 'Chemistry Lab',
                description: 'Hands-on chemistry experiments.',
                type: 'Group',
                maxCapacity: 8,
                status: 'active',
                defaultAssignments: [{ id: 'STAFF-002', name: 'Sarah Johnson' }],
                schedule: {
                    frequency: 'weekly',
                    daysOfWeek: ['Tuesday', 'Thursday'],
                    startTime: '14:00',
                    endTime: '16:00',
                    duration: 120
                }
            },
            {
                id: 'ls_003',
                name: 'Private Math Tutoring',
                description: 'One-on-one math check-in.',
                type: 'One-to-One',
                maxCapacity: 1,
                status: 'active',
                defaultAssignments: [{ id: 'STAFF-003', name: 'Michael Chen' }],
                schedule: {
                    frequency: 'custom',
                    daysOfWeek: [],
                    startTime: '11:00',
                    endTime: '12:00',
                    duration: 60
                }
            }
        ];
        localStorage.setItem('fms_learning_services', JSON.stringify(services));
    }

    if (!localStorage.getItem('fms_sessions')) {
        // Generate sessions for the current week (Dec 15, 2025)
        const sessions = [
            {
                id: 'sess_001',
                learningServiceId: 'ls_001',
                type: 'Class',
                date: '2025-12-15', // Monday
                startTime: '09:00',
                endTime: '10:30',
                duration: 90,
                status: 'scheduled',
                enrolledCount: 12,
                maxCapacity: 15,
                assignedStaff: ['Daniel Davis']
            },
            {
                id: 'sess_002',
                learningServiceId: 'ls_002',
                type: 'Group',
                date: '2025-12-16', // Tuesday
                startTime: '14:00',
                endTime: '16:00',
                duration: 120,
                status: 'scheduled',
                enrolledCount: 5,
                maxCapacity: 8,
                assignedStaff: ['Sarah Johnson']
            },
            {
                id: 'sess_003',
                learningServiceId: 'ls_001',
                type: 'Class',
                date: '2025-12-17', // Wednesday
                startTime: '09:00',
                endTime: '10:30',
                duration: 90,
                status: 'scheduled',
                enrolledCount: 10,
                maxCapacity: 15,
                assignedStaff: ['Daniel Davis']
            },
            {
                id: 'sess_004',
                learningServiceId: 'ls_002',
                type: 'Group',
                date: '2025-12-18', // Thursday
                startTime: '14:00',
                endTime: '16:00',
                duration: 120,
                status: 'scheduled',
                enrolledCount: 6,
                maxCapacity: 8,
                assignedStaff: ['Sarah Johnson']
            },
            {
                id: 'sess_005',
                learningServiceId: 'ls_003',
                type: 'One-to-One',
                date: '2025-12-19', // Friday
                startTime: '11:00',
                endTime: '12:00',
                duration: 60,
                status: 'scheduled',
                enrolledCount: 1,
                maxCapacity: 1,
                assignedStaff: ['Michael Chen']
            }
        ];
        localStorage.setItem('fms_sessions', JSON.stringify(sessions));
    }
}

function setupEventListeners() {
    // Search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', function (e) {
            applyFilters();
        });
    }

    // Click outside to close modals
    document.addEventListener('click', function (e) {
        if (!e.target.closest('#eventModal') && !e.target.closest('[onclick*="show"]')) {
            closeEventPopover();
        }
    });

    // Keyboard shortcuts
    document.addEventListener('keydown', function (e) {
        if (e.key === 'Escape') {
            closeCreateTypeModal();
            closeEventModal();
            closeEventPopover();
        } else if (e.key === 'c' && !e.target.matches('input, textarea')) {
            showCreateTypeSelectionModal(formatDateString(currentDate), '09:00');
        } else if (e.key === 't' && !e.target.matches('input, textarea')) {
            navigateDate('today');
        }
    });
}

// ==================== Create Type Selection Modal ====================

function showCreateTypeSelectionModal(date, time) {
    tempCreateDate = date;
    tempCreateTime = time;

    const modal = document.getElementById('createTypeModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeCreateTypeModal() {
    const modal = document.getElementById('createTypeModal');
    if (modal) {
        modal.classList.add('hidden');
    }

    // Don't clear temps immediately in case we're switching to another modal
}

function handleCreateTypeSelection(type) {
    closeCreateTypeModal();

    if (type === 'service') {
        // Initialize and open the service creation modal
        if (typeof initServiceCreation === 'function') {
            initServiceCreation();
        }
        if (typeof openServiceCreationModal === 'function') {
            openServiceCreationModal();
        } else {
            console.error('Service creation modal script not loaded');
        }
    } else if (type === 'session') {
        // Open the existing session creation modal with pre-filled date/time
        showCreateEventModal(tempCreateDate, tempCreateTime);
    }
}

// ==================== Data Loading ====================

function loadEvents() {
    allEvents = [];

    // Load sessions
    try {
        const sessions = JSON.parse(localStorage.getItem('fms_sessions') || '[]');
        const learningServices = JSON.parse(localStorage.getItem('fms_learning_services') || '[]');

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const sixDaysFromNow = new Date(today);
        sixDaysFromNow.setDate(sixDaysFromNow.getDate() + 6);

        sessions.forEach(session => {
            const learningService = learningServices.find(ls => ls.id === session.learningServiceId);
            const eventDate = session.date;
            if (eventDate) {
                const sessionDate = new Date(eventDate);
                sessionDate.setHours(0, 0, 0, 0);
                const isBeyondOneWeek = sessionDate >= sixDaysFromNow;

                const sessionType = learningService?.type || session.type || 'Class';

                allEvents.push({
                    id: session.id,
                    type: 'session',
                    sessionType: sessionType,
                    title: learningService ? learningService.name : 'Learning Service Session',
                    description: learningService ? learningService.description : '',
                    date: eventDate,
                    time: session.startTime || '00:00',
                    endTime: session.endTime || null,
                    duration: session.duration ? `${session.duration} min` : '',
                    learningServiceId: session.learningServiceId,
                    learningServiceName: learningService ? learningService.name : '',
                    status: isBeyondOneWeek ? 'preview' : (session.status || 'scheduled'),
                    capacity: session.maxCapacity || learningService?.maxCapacity || 0,
                    enrolledCount: session.enrolledCount || session.sessionEnrollments?.length || 0,
                    notes: session.notes || '',
                    assignedStaff: session.assignedStaff || learningService?.defaultAssignments?.map(a => a.name) || [],
                    isPreview: isBeyondOneWeek,
                    data: session
                });
            }
        });
    } catch (error) {
        console.error('Error loading sessions:', error);
    }

    // Generate PREVIEW events for future learning service sessions (beyond 1 week)
    try {
        const learningServices = JSON.parse(localStorage.getItem('fms_learning_services') || '[]');
        const existingSessionIds = new Set(allEvents.filter(e => e.type === 'session').map(e => e.id));

        const today = new Date();
        today.setHours(0, 0, 0, 0);
        const previewStartDate = new Date(today);
        previewStartDate.setDate(previewStartDate.getDate() + 6);
        const previewEndDate = new Date(today);
        previewEndDate.setDate(previewEndDate.getDate() + 56);

        learningServices.forEach(ls => {
            if (!ls.schedule || ls.status === 'archived') return;

            const { frequency, daysOfWeek, startTime, endTime } = ls.schedule;
            if (!daysOfWeek || daysOfWeek.length === 0) return;

            const dayMap = {
                'Sunday': 0, 'Monday': 1, 'Tuesday': 2, 'Wednesday': 3,
                'Thursday': 4, 'Friday': 5, 'Saturday': 6
            };

            const scheduledDays = daysOfWeek.map(d => dayMap[d]).filter(d => d !== undefined);

            let currentDate = new Date(previewStartDate);
            while (currentDate <= previewEndDate) {
                if (scheduledDays.includes(currentDate.getDay())) {
                    const dateStr = currentDate.toISOString().split('T')[0];
                    const previewEventId = `PREVIEW-${ls.id}-${dateStr}`;

                    const hasRealSession = allEvents.some(e =>
                        e.type === 'session' &&
                        e.learningServiceId === ls.id &&
                        e.date === dateStr
                    );

                    if (!hasRealSession) {
                        const sessionType = ls.type || 'Class';

                        allEvents.push({
                            id: previewEventId,
                            type: 'session',
                            sessionType: sessionType,
                            title: ls.name,
                            description: ls.description || '',
                            date: dateStr,
                            time: startTime || '09:00',
                            endTime: endTime || null,
                            duration: ls.schedule.duration ? `${ls.schedule.duration} min` : '',
                            learningServiceId: ls.id,
                            learningServiceName: ls.name,
                            status: 'preview',
                            capacity: ls.maxCapacity || 0,
                            enrolledCount: 0,
                            notes: '',
                            assignedStaff: ls.defaultAssignments?.map(a => a.name) || [],
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

// Extract learning services from sessions
function extractLearningServicesFromSessions(sessions) {
    const servicesMap = new Map();
    sessions.forEach(session => {
        if (session.learningServiceId && !servicesMap.has(session.learningServiceId)) {
            servicesMap.set(session.learningServiceId, {
                id: session.learningServiceId,
                name: session.learningServiceName || 'Unknown Service',
                type: session.type || 'Group'
            });
        }
    });
    return Array.from(servicesMap.values());
}

// Get sample sessions for testing
function getSampleSessions() {
    const today = new Date();
    const sessions = [];

    // Generate sessions for the next 60 days
    for (let i = 0; i < 60; i++) {
        const date = new Date(today);
        date.setDate(today.getDate() + i);

        // Skip weekends for some variety
        if (date.getDay() === 0 || date.getDay() === 6) continue;

        const dayOfWeek = date.getDay();
        const dateStr = date.toISOString().split('T')[0];

        // Create different types of sessions
        if (i % 3 === 0) {
            // Class sessions (Mon, Wed, Fri)
            if ([1, 3, 5].includes(dayOfWeek)) {
                sessions.push({
                    id: `SESSION-${dateStr}-001`,
                    learningServiceId: 'LS-CLASS-001',
                    learningServiceName: 'AP Calculus Class',
                    type: 'Class',
                    date: dateStr,
                    startTime: '14:00',
                    endTime: '15:30',
                    duration: 90,
                    status: i < 7 ? 'scheduled' : (i < 14 ? 'in_progress' : 'completed'),
                    enrolledCount: Math.floor(Math.random() * 15) + 5,
                    maxCapacity: 20,
                    assignedStaff: ['John Smith']
                });
            }
        } else if (i % 3 === 1) {
            // Group sessions (Tue, Thu)
            if ([2, 4].includes(dayOfWeek)) {
                sessions.push({
                    id: `SESSION-${dateStr}-002`,
                    learningServiceId: 'LS-GROUP-001',
                    learningServiceName: 'Math Tutoring Group',
                    type: 'Group',
                    date: dateStr,
                    startTime: '16:00',
                    endTime: '17:00',
                    duration: 60,
                    status: 'scheduled',
                    enrolledCount: Math.floor(Math.random() * 8) + 2,
                    maxCapacity: 10,
                    assignedStaff: ['Sarah Johnson']
                });
            }
        } else {
            // One-to-One sessions (any day)
            sessions.push({
                id: `SESSION-${dateStr}-003`,
                learningServiceId: 'LS-OTO-001',
                learningServiceName: 'Personalized SAT Prep',
                type: 'One-to-One',
                date: dateStr,
                startTime: '10:00',
                endTime: '11:00',
                duration: 60,
                status: 'scheduled',
                enrolledCount: 1,
                maxCapacity: 1,
                assignedStaff: ['Michael Chen']
            });
        }
    }

    return sessions;
}

// Populate service filter dropdown
function populateServiceFilter() {
    const select = document.getElementById('serviceFilter');
    select.innerHTML = '<option value="">All Services</option>';

    allLearningServices.forEach(service => {
        const option = document.createElement('option');
        option.value = service.id;
        option.textContent = service.name;
        select.appendChild(option);
    });
}

// ==================== Filtering ====================

function applyFilters() {
    let filtered = [...allEvents];

    // Get filter states from checkboxes
    const filterClassSessions = document.getElementById('filterClassSessions');
    const filterGroupSessions = document.getElementById('filterGroupSessions');
    const filterOneToOne = document.getElementById('filterOneToOne');
    const filterScheduled = document.getElementById('filterScheduled');
    const filterInProgress = document.getElementById('filterInProgress');
    const filterCompleted = document.getElementById('filterCompleted');

    if (filterClassSessions) filters.classSessions = filterClassSessions.checked;
    if (filterGroupSessions) filters.groupSessions = filterGroupSessions.checked;
    if (filterOneToOne) filters.oneToOne = filterOneToOne.checked;
    if (filterScheduled) filters.scheduled = filterScheduled.checked;
    if (filterInProgress) filters.inProgress = filterInProgress.checked;
    if (filterCompleted) filters.completed = filterCompleted.checked;

    // Type filters
    filtered = filtered.filter(e => {
        if (e.type === 'session') {
            const sessionType = e.sessionType || 'Class';
            if (sessionType === 'Class') {
                return filters.classSessions;
            } else if (sessionType === 'Group') {
                return filters.groupSessions;
            } else if (sessionType === 'One-to-One') {
                return filters.oneToOne;
            }
            return true;
        }
        return true;
    });

    // Status filters
    const statusFilters = [];
    if (filters.scheduled) statusFilters.push('scheduled');
    if (filters.inProgress) statusFilters.push('in_progress');
    if (filters.completed) statusFilters.push('completed');
    statusFilters.push('preview');

    if (statusFilters.length > 0) {
        filtered = filtered.filter(e => statusFilters.includes(e.status) || e.isPreview);
    }

    // Staff filter
    if (staffFilter.length > 0) {
        filtered = filtered.filter(event => {
            const assignedStaff = event.assignedStaff || [];
            let staffNames = [];

            if (Array.isArray(assignedStaff)) {
                staffNames = assignedStaff.map(s => {
                    if (typeof s === 'string') return s;
                    return s.name || s;
                });
            } else if (typeof assignedStaff === 'string') {
                staffNames = [assignedStaff];
            }

            return staffNames.some(name => staffFilter.includes(name));
        });
    }

    // Search filter
    const searchInput = document.getElementById('searchInput');
    const searchQuery = searchInput ? searchInput.value.toLowerCase() : '';
    if (searchQuery) {
        filtered = filtered.filter(event => {
            return event.title.toLowerCase().includes(searchQuery) ||
                event.description.toLowerCase().includes(searchQuery) ||
                (event.learningServiceName && event.learningServiceName.toLowerCase().includes(searchQuery));
        });
    }

    // Service filter
    const serviceFilter = document.getElementById('serviceFilter');
    if (serviceFilter && serviceFilter.value) {
        filtered = filtered.filter(e => e.learningServiceId === serviceFilter.value);
    }

    filteredEvents = filtered;
    updateEventCount();
    renderCurrentView();
}

function toggleFilters() {
    const panel = document.getElementById('filtersPanel');
    if (panel) {
        panel.classList.toggle('hidden');
    }
}

// Toggle type filter (for inline filter buttons - kept for compatibility)
function toggleFilter(filterType, value) {
    // This function is kept for the inline filter buttons in the HTML
    // The actual filtering is handled by the checkboxes in the filters panel
    applyFilters();
}

// Clear all filters
function clearFilters() {
    // Reset checkbox filters
    const filterClassSessions = document.getElementById('filterClassSessions');
    const filterGroupSessions = document.getElementById('filterGroupSessions');
    const filterOneToOne = document.getElementById('filterOneToOne');
    const filterScheduled = document.getElementById('filterScheduled');
    const filterInProgress = document.getElementById('filterInProgress');
    const filterCompleted = document.getElementById('filterCompleted');
    const filterCancelled = document.getElementById('filterCancelled');

    if (filterClassSessions) filterClassSessions.checked = true;
    if (filterGroupSessions) filterGroupSessions.checked = true;
    if (filterOneToOne) filterOneToOne.checked = true;
    if (filterScheduled) filterScheduled.checked = true;
    if (filterInProgress) filterInProgress.checked = true;
    if (filterCompleted) filterCompleted.checked = true;
    if (filterCancelled) filterCancelled.checked = true;

    // Clear service filter
    const serviceFilter = document.getElementById('serviceFilter');
    if (serviceFilter) serviceFilter.value = '';

    // Clear search
    const searchInput = document.getElementById('searchInput');
    if (searchInput) searchInput.value = '';

    // Clear staff filter
    clearAllStaffFilters();

    applyFilters();
}

// ==================== View Switching ====================

function switchView(view) {
    currentView = view;

    // Update button states
    const viewMonthBtn = document.getElementById('viewMonthBtn');
    const viewWeekBtn = document.getElementById('viewWeekBtn');
    const viewDayBtn = document.getElementById('viewDayBtn');

    if (viewMonthBtn && viewWeekBtn && viewDayBtn) {
        [viewMonthBtn, viewWeekBtn, viewDayBtn].forEach(btn => {
            btn.classList.remove('bg-indigo-600', 'text-white');
            btn.classList.add('text-gray-700', 'hover:bg-gray-50');
        });

        if (view === 'month' && viewMonthBtn) {
            viewMonthBtn.classList.add('bg-indigo-600', 'text-white');
            viewMonthBtn.classList.remove('text-gray-700', 'hover:bg-gray-50');
        } else if (view === 'week' && viewWeekBtn) {
            viewWeekBtn.classList.add('bg-indigo-600', 'text-white');
            viewWeekBtn.classList.remove('text-gray-700', 'hover:bg-gray-50');
        } else if (view === 'day' && viewDayBtn) {
            viewDayBtn.classList.add('bg-indigo-600', 'text-white');
            viewDayBtn.classList.remove('text-gray-700', 'hover:bg-gray-50');
        }
    }

    // Hide all views
    const monthView = document.getElementById('monthView');
    const weekView = document.getElementById('weekView');
    const dayView = document.getElementById('dayView');

    if (monthView) monthView.classList.add('hidden');
    if (weekView) weekView.classList.add('hidden');
    if (dayView) dayView.classList.add('hidden');

    // Show selected view
    if (view === 'month' && monthView) monthView.classList.remove('hidden');
    else if (view === 'week' && weekView) weekView.classList.remove('hidden');
    else if (view === 'day' && dayView) dayView.classList.remove('hidden');

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

function navigateDate(direction) {
    if (direction === 'today') {
        currentDate = new Date();
    } else if (direction === 'prev') {
        if (currentView === 'month') {
            currentDate.setMonth(currentDate.getMonth() - 1);
        } else if (currentView === 'week') {
            currentDate.setDate(currentDate.getDate() - 7);
        } else {
            currentDate.setDate(currentDate.getDate() - 1);
        }
    } else if (direction === 'next') {
        if (currentView === 'month') {
            currentDate.setMonth(currentDate.getMonth() + 1);
        } else if (currentView === 'week') {
            currentDate.setDate(currentDate.getDate() + 7);
        } else {
            currentDate.setDate(currentDate.getDate() + 1);
        }
    }

    renderCurrentView();
    updateDateRange();
}

function updateDateRange() {
    const dateDisplay = document.getElementById('currentDateDisplay');
    if (!dateDisplay) return;

    if (currentView === 'week') {
        const weekStart = getWeekStart(currentDate);
        const weekEnd = new Date(weekStart);
        weekEnd.setDate(weekStart.getDate() + 6);
        dateDisplay.textContent = `${formatDate(weekStart)} - ${formatDate(weekEnd)}`;
    } else if (currentView === 'day') {
        dateDisplay.textContent = formatDate(currentDate);
    } else {
        dateDisplay.textContent = currentDate.toLocaleDateString('en-US', { year: 'numeric', month: 'long' });
    }
}

// Render month view
function renderMonthView() {
    const grid = document.getElementById('monthCalendarGrid');
    grid.innerHTML = '';

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();

    // Get first day of month and number of days
    const firstDay = new Date(year, month, 1);
    const lastDay = new Date(year, month + 1, 0);
    const daysInMonth = lastDay.getDate();
    const startingDayOfWeek = firstDay.getDay();

    // Get previous month's days for padding
    const prevMonth = new Date(year, month, 0);
    const daysInPrevMonth = prevMonth.getDate();

    // Render previous month's trailing days
    for (let i = startingDayOfWeek - 1; i >= 0; i--) {
        const date = new Date(year, month - 1, daysInPrevMonth - i);
        const dayElement = createDayElement(date, true);
        grid.appendChild(dayElement);
    }

    // Render current month's days
    for (let day = 1; day <= daysInMonth; day++) {
        const date = new Date(year, month, day);
        const dayElement = createDayElement(date, false);
        grid.appendChild(dayElement);
    }

    // Render next month's leading days
    const totalCells = grid.children.length;
    const remainingCells = 42 - totalCells; // 6 rows * 7 days
    for (let day = 1; day <= remainingCells; day++) {
        const date = new Date(year, month + 1, day);
        const dayElement = createDayElement(date, true);
        grid.appendChild(dayElement);
    }
}

// Create day element for month view
function createDayElement(date, isOtherMonth) {
    const dayDiv = document.createElement('div');
    dayDiv.className = `calendar-day ${isOtherMonth ? 'other-month' : ''}`;

    const today = new Date();
    if (!isOtherMonth && date.toDateString() === today.toDateString()) {
        dayDiv.classList.add('today');
    }

    const dateStr = formatDateString(date);
    const dayNumber = date.getDate();

    dayDiv.innerHTML = `
        <div class="calendar-day-number">${dayNumber}</div>
        <div class="calendar-events-container">
            ${renderDayEvents(dateStr)}
        </div>
    `;

    // Click handler for empty spots (not on events)
    dayDiv.onclick = (e) => {
        // If clicking on an event, don't trigger create modal
        if (e.target.closest('.calendar-event')) {
            return;
        }
        // If clicking on empty space, open create type selection modal with this date
        const dateStr = formatDateString(date);
        showCreateTypeSelectionModal(dateStr, '09:00');
    };

    // Double-click to switch to day view
    dayDiv.ondblclick = () => {
        currentDate = new Date(date);
        switchView('day');
    };

    return dayDiv;
}

// Render events for a specific date
function renderDayEvents(dateStr) {
    const dayEvents = filteredEvents.filter(e => e.date === dateStr);

    if (dayEvents.length === 0) {
        return '';
    }

    // Sort by start time
    dayEvents.sort((a, b) => a.time.localeCompare(b.time));

    // Show max 3 events, with "+X more" if needed
    const maxVisible = 3;
    const visibleEvents = dayEvents.slice(0, maxVisible);
    const remainingCount = dayEvents.length - maxVisible;

    let html = visibleEvents.map(event => {
        const sessionType = event.sessionType || 'Class';
        const typeClass = `event-type-${sessionType.toLowerCase().replace('-', '')}`;
        const previewClass = event.isPreview ? 'event-preview' : '';
        const timeStr = formatTime(event.time);
        return `
            <div class="calendar-event ${typeClass} ${previewClass}" 
                 onclick="event.stopPropagation(); viewEvent('${event.id}', event)"
                 onmouseenter="showEventTooltip(${JSON.stringify(event).replace(/"/g, '&quot;')}, event)"
                 onmouseleave="hideEventTooltip()">
                <span class="font-medium">${timeStr}</span>
                <span>${event.title}</span>
            </div>
        `;
    }).join('');

    if (remainingCount > 0) {
        html += `<div class="text-xs text-gray-500 mt-1 px-2">+${remainingCount} more</div>`;
    }

    return html;
}

// ==================== Week View ====================

function renderWeekView() {
    const weekDays = document.getElementById('weekDays');
    const grid = document.getElementById('weekCalendarGrid');

    if (!grid) return;

    grid.innerHTML = '';

    const weekStart = getWeekStart(currentDate);
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Render week day headers
    if (weekDays) {
        weekDays.innerHTML = '';
        for (let i = 0; i < 7; i++) {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + i);
            const dayDiv = document.createElement('div');
            dayDiv.className = 'p-3 text-center text-sm font-semibold text-gray-700 bg-gray-50';
            dayDiv.setAttribute('data-date', formatDateString(date));
            dayDiv.innerHTML = `
                <div>${dayNames[i]}</div>
                <div class="text-xs font-normal text-gray-600">${date.getDate()}</div>
            `;
            weekDays.appendChild(dayDiv);
        }
    }

    const hours = Array.from({ length: 24 }, (_, i) => i);

    hours.forEach(hour => {
        // Time column
        const timeCell = document.createElement('div');
        timeCell.className = 'week-hour border-r border-gray-200';
        timeCell.innerHTML = `<div class="p-2 text-xs text-gray-500">${formatHour(hour)}</div>`;
        grid.appendChild(timeCell);

        // Day columns
        for (let dayOffset = 0; dayOffset < 7; dayOffset++) {
            const date = new Date(weekStart);
            date.setDate(weekStart.getDate() + dayOffset);
            const dateStr = formatDateString(date);

            const dayCell = document.createElement('div');
            dayCell.className = 'week-hour';
            dayCell.setAttribute('data-date', dateStr);
            dayCell.setAttribute('data-hour', hour);
            dayCell.innerHTML = renderWeekHourEvents(dateStr, hour);

            // Add click handler for empty spots
            dayCell.onclick = (e) => {
                // If clicking on an event, don't trigger create modal
                if (e.target.closest('.week-event')) {
                    return;
                }
                // If clicking on empty space, open create type selection modal with this date and time
                const timeStr = `${hour.toString().padStart(2, '0')}:00`;
                showCreateTypeSelectionModal(dateStr, timeStr);
            };

            grid.appendChild(dayCell);
        }
    });
}

// Get week start (Sunday)
function getWeekStart(date) {
    const d = new Date(date);
    const day = d.getDay();
    const diff = d.getDate() - day;
    return new Date(d.setDate(diff));
}

// Render events for a specific hour in week view
function renderWeekHourEvents(dateStr, hour) {
    const hourEvents = filteredEvents.filter(e => {
        if (e.date !== dateStr) return false;
        const eventHour = parseInt(e.time.split(':')[0]);
        return eventHour === hour;
    });

    if (hourEvents.length === 0) {
        return '';
    }

    return hourEvents.map(event => {
        const sessionType = event.sessionType || 'Class';
        const typeClass = `event-type-${sessionType.toLowerCase().replace('-', '')}`;
        const previewClass = event.isPreview ? 'event-preview' : '';
        const duration = event.duration ? parseInt(event.duration) : 60;
        const height = Math.max(40, (duration / 60) * 60);

        return `
            <div class="week-event ${typeClass} ${previewClass}" 
                 onclick="event.stopPropagation(); viewEvent('${event.id}', event)"
                 onmouseenter="showEventTooltip(${JSON.stringify(event).replace(/"/g, '&quot;')}, event)"
                 onmouseleave="hideEventTooltip()"
                 style="top: 4px; height: ${height}px;">
                <div class="font-medium text-xs">${event.title}</div>
                <div class="text-xs opacity-75">${formatTime(event.time)}${event.endTime ? ` - ${formatTime(event.endTime)}` : ''}</div>
                <div class="text-xs opacity-75">${event.enrolledCount}/${event.capacity}</div>
            </div>
        `;
    }).join('');
}

// Render day view
function renderDayView() {
    const dayViewDate = document.getElementById('dayViewDate');
    const dayTimeSlots = document.getElementById('dayTimeSlots');
    const dayEvents = document.getElementById('dayEvents');

    if (!dayViewDate || !dayTimeSlots || !dayEvents) return;

    const dateStr = formatDateString(currentDate);
    dayViewDate.textContent = formatDate(currentDate);

    const dayEventsList = filteredEvents.filter(e => e.date === dateStr);
    dayEventsList.sort((a, b) => a.time.localeCompare(b.time));

    // Render time slots
    dayTimeSlots.innerHTML = '';
    for (let hour = 0; hour < 24; hour++) {
        const slot = document.createElement('div');
        slot.className = 'day-hour';
        slot.setAttribute('data-hour', hour);
        slot.innerHTML = `<div class="p-2 text-xs text-gray-500">${formatHour(hour)}</div>`;

        // Add click handler for empty time slots
        slot.onclick = () => {
            const timeStr = `${hour.toString().padStart(2, '0')}:00`;
            showCreateEventModal(dateStr, timeStr);
        };

        dayTimeSlots.appendChild(slot);
    }

    // Render events
    if (dayEventsList.length === 0) {
        dayEvents.innerHTML = `
            <div class="text-center py-12 text-gray-500 cursor-pointer" onclick="showCreateEventModal('${dateStr}', '09:00')">
                <svg class="mx-auto mb-3 text-gray-300 w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                </svg>
                <p class="text-sm font-medium text-gray-700 mb-1">No sessions scheduled</p>
                <p class="text-xs text-gray-500">Click here or "Create" to add a new session</p>
            </div>
        `;
        return;
    }

    dayEvents.innerHTML = dayEventsList.map(event => renderDayViewEvent(event)).join('');
}

// Render single event in day view
function renderDayViewEvent(event) {
    const sessionType = event.sessionType || 'Class';
    const typeClass = `event-type-${sessionType.toLowerCase().replace('-', '')}`;
    const statusClass = `status-${event.status}`;
    const fillRate = event.capacity > 0 ? Math.round((event.enrolledCount / event.capacity) * 100) : 0;
    const previewClass = event.isPreview ? 'event-preview' : '';

    return `
        <div class="day-event ${typeClass} ${previewClass}" 
             onclick="event.stopPropagation(); viewEvent('${event.id}', event)"
             onmouseenter="showEventTooltip(${JSON.stringify(event).replace(/"/g, '&quot;')}, event)"
             onmouseleave="hideEventTooltip()">
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-2">
                        <h4 class="font-semibold text-gray-900">${event.title}</h4>
                        <span class="px-2 py-0.5 text-xs font-medium rounded-full ${typeClass}">${sessionType}</span>
                        <span class="px-2 py-0.5 text-xs font-medium rounded-full ${statusClass}">${event.status.replace('_', ' ')}</span>
                        ${event.isPreview ? '<span class="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">Preview</span>' : ''}
                    </div>
                    <div class="text-sm text-gray-600 mb-2">
                        <div class="flex items-center gap-4">
                            <span>🕐 ${formatTime(event.time)}${event.endTime ? ` - ${formatTime(event.endTime)}` : ''}</span>
                            <span>👥 ${event.enrolledCount}/${event.capacity} enrolled</span>
                            <span>${event.assignedStaff?.join(', ') || 'No staff assigned'}</span>
                        </div>
                    </div>
                    ${event.capacity > 0 ? `
                    <div class="w-full bg-gray-200 rounded-full h-2 mb-2">
                        <div class="bg-indigo-600 h-2 rounded-full" style="width: ${fillRate}%"></div>
                    </div>
                    <p class="text-xs text-gray-500">${fillRate}% capacity</p>
                    ` : ''}
                </div>
            </div>
        </div>
    `;
}

// View event details
function viewEvent(eventId, event) {
    if (event) {
        event.stopPropagation();
    }
    const foundEvent = allEvents.find(e => e.id === eventId);
    if (foundEvent && foundEvent.isPreview) {
        showNotification('This is a preview session. It will be created 1 week before the date.', 'info');
        return;
    }
    if (foundEvent && foundEvent.type === 'session') {
        showEditEventModal(foundEvent);
    }
}

// Create new event (Learning Service or Session)
function showCreateEventModal(date = null, time = null) {
    editingEvent = null;
    document.getElementById('modalTitle').textContent = 'Create Event';

    // Load learning services for dropdown
    const learningServices = JSON.parse(localStorage.getItem('fms_learning_services') || '[]');

    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <div class="space-y-4">
            ${date ? `
            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                <div class="flex items-center gap-2">
                    <svg class="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                    </svg>
                    <div>
                        <p class="text-sm font-medium text-blue-900">Selected Date: ${formatDate(new Date(date))}</p>
                        ${time ? `<p class="text-xs text-blue-700">Time: ${formatTime(time)}</p>` : ''}
                    </div>
                </div>
            </div>
            ` : ''}
            
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-2">Event Type</label>
                <select id="eventType" onchange="handleEventTypeChange()" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="session">Session</option>
                    <option value="learningService">Learning Service</option>
                </select>
            </div>
            
            <!-- Session Creation Form -->
            <div id="createSessionFields">
                <div class="space-y-4">
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Learning Service <span class="text-red-500">*</span></label>
                        <select id="createSessionLearningServiceId" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500">
                            <option value="">Select a Learning Service</option>
                            ${learningServices.map(ls => `
                                <option value="${ls.id}" data-type="${ls.type}">${ls.name} (${ls.type})</option>
                            `).join('')}
                        </select>
                    </div>
                    
                    <div class="grid grid-cols-2 gap-3">
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Date <span class="text-red-500">*</span></label>
                            <input type="date" id="createSessionDate" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value="${date || formatDateString(new Date())}">
                        </div>
                        <div>
                            <label class="block text-sm font-medium text-gray-700 mb-2">Time <span class="text-red-500">*</span></label>
                            <input type="time" id="createSessionTime" required class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" value="${time || '09:00'}">
                        </div>
                    </div>
                    
                    <div>
                        <label class="block text-sm font-medium text-gray-700 mb-2">Notes (optional)</label>
                        <textarea id="createSessionNotes" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Add notes for this session..."></textarea>
                    </div>
                </div>
            </div>
            
            <!-- Learning Service Creation (redirect) -->
            <div id="createLearningServiceFields" class="hidden">
                <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
                    <p class="text-sm text-purple-800 mb-3">Create a new Learning Service (Class, Group, or One-to-One).</p>
                    <button onclick="window.location.href='learning_service_create.html'" class="w-full px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium">
                        Go to Create Learning Service
                    </button>
                </div>
            </div>
            
            <div class="flex gap-2 pt-4 border-t border-gray-200">
                <button onclick="createSessionFromModal()" class="flex-1 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium">
                    Create Session
                </button>
                <button onclick="closeEventModal()" class="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50">
                    Cancel
                </button>
            </div>
        </div>
    `;

    const modal = document.getElementById('eventModal');
    if (modal) modal.classList.remove('hidden');
}

function handleEventTypeChange() {
    const eventType = document.getElementById('eventType')?.value;
    const sessionFields = document.getElementById('createSessionFields');
    const learningServiceFields = document.getElementById('createLearningServiceFields');
    const createButton = document.querySelector('#eventModal button[onclick*="createSessionFromModal"]');

    if (eventType === 'learningService') {
        if (sessionFields) sessionFields.classList.add('hidden');
        if (learningServiceFields) learningServiceFields.classList.remove('hidden');
        if (createButton) createButton.style.display = 'none';
    } else {
        if (sessionFields) sessionFields.classList.remove('hidden');
        if (learningServiceFields) learningServiceFields.classList.add('hidden');
        if (createButton) createButton.style.display = 'block';
    }
}

function createSessionFromModal() {
    const learningServiceId = document.getElementById('createSessionLearningServiceId')?.value;
    const date = document.getElementById('createSessionDate')?.value;
    const time = document.getElementById('createSessionTime')?.value;
    const notes = document.getElementById('createSessionNotes')?.value || '';

    if (!learningServiceId || !date || !time) {
        showNotification('Please fill in all required fields', 'error');
        return;
    }

    try {
        // Load learning service
        const learningServices = JSON.parse(localStorage.getItem('fms_learning_services') || '[]');
        const learningService = learningServices.find(ls => ls.id === learningServiceId);

        if (!learningService) {
            showNotification('Learning Service not found', 'error');
            return;
        }

        // Calculate end time from learning service schedule
        const startTime = time;
        let endTime = learningService.schedule?.endTime;
        let duration = learningService.schedule?.duration || 60;

        if (!endTime && startTime) {
            // Calculate end time from duration
            const [hours, minutes] = startTime.split(':').map(Number);
            const startMinutes = hours * 60 + minutes;
            const endMinutes = startMinutes + duration;
            const endHours = Math.floor(endMinutes / 60);
            const endMins = endMinutes % 60;
            endTime = `${String(endHours).padStart(2, '0')}:${String(endMins).padStart(2, '0')}`;
        }

        // Create session
        const sessions = JSON.parse(localStorage.getItem('fms_sessions') || '[]');
        const sessionId = `SESSION-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

        const newSession = {
            id: sessionId,
            learningServiceId: learningServiceId,
            learningServiceName: learningService.name,
            title: `${learningService.name} Session`,
            type: 'session',
            sessionType: learningService.type,
            date: date,
            startTime: startTime,
            endTime: endTime,
            duration: duration,
            status: 'scheduled',
            notes: notes,
            maxCapacity: learningService.maxCapacity || (learningService.type === 'One-to-One' ? 1 : 20),
            enrolledCount: 0,
            sessionEnrollments: [],
            assignedStaff: learningService.defaultAssignments?.map(a => ({
                id: a.id,
                name: a.name,
                type: a.type
            })) || [],
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };

        sessions.push(newSession);
        localStorage.setItem('fms_sessions', JSON.stringify(sessions));

        showNotification('Session created successfully', 'success');
        closeEventModal();
        loadEvents();
    } catch (error) {
        console.error('Error creating session:', error);
        showNotification('Error creating session', 'error');
    }
}

// ==================== Event Popover ====================

function showEventPopover(event, element) {
    closeEventPopover();

    const popover = document.getElementById('eventPopover');
    if (!popover) return;

    const rect = element.getBoundingClientRect();

    popover.style.left = `${rect.left}px`;
    popover.style.top = `${rect.bottom + 8}px`;
    popover.classList.remove('hidden');

    const sessionType = event.sessionType || 'Class';
    let sessionTypeLabel = 'Class Session';
    let typeBadgeClass = 'bg-purple-100 text-purple-700';
    if (sessionType === 'Group') {
        sessionTypeLabel = 'Group Session';
        typeBadgeClass = 'bg-amber-100 text-amber-700';
    } else if (sessionType === 'One-to-One') {
        sessionTypeLabel = 'One-to-One';
        typeBadgeClass = 'bg-cyan-100 text-cyan-700';
    }

    popover.innerHTML = `
        <div class="space-y-2">
            <div class="flex items-center gap-2">
                <span class="px-2 py-1 text-xs rounded ${typeBadgeClass}">
                    ${sessionTypeLabel}
                </span>
                ${event.isPreview ? '<span class="px-2 py-1 text-xs rounded bg-amber-100 text-amber-700">Preview</span>' : ''}
                <span class="text-xs text-gray-500">${event.status}</span>
            </div>
            <h4 class="font-semibold text-gray-900">${event.title}</h4>
            <p class="text-sm text-gray-600">${formatDate(new Date(event.date))} at ${event.time}${event.endTime ? ` - ${event.endTime}` : ''}</p>
            ${event.description ? `<p class="text-sm text-gray-700">${event.description}</p>` : ''}
            <div class="flex gap-2 pt-2 border-t border-gray-200">
                <button onclick="viewEvent('${event.id}')" class="flex-1 px-3 py-1.5 text-xs font-medium text-blue-600 hover:bg-blue-50 rounded">
                    View
                </button>
                ${!event.isPreview ? `<button onclick="deleteEvent('${event.id}', '${event.type}')" class="flex-1 px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded">
                    Delete
                </button>` : ''}
            </div>
        </div>
    `;

    selectedEvent = event;
}

function closeEventPopover() {
    const popover = document.getElementById('eventPopover');
    if (popover) {
        popover.classList.add('hidden');
    }
    selectedEvent = null;
}

// ==================== Event Tooltip ====================

function showEventTooltip(event, mouseEvent) {
    const tooltip = document.getElementById('eventTooltip');
    if (!tooltip) return;

    const sessionType = event.sessionType || 'Class';
    let sessionTypeLabel = 'Class Session';
    let typeBadgeClass = 'bg-purple-500';
    if (sessionType === 'Group') {
        sessionTypeLabel = 'Group Session';
        typeBadgeClass = 'bg-amber-500';
    } else if (sessionType === 'One-to-One') {
        sessionTypeLabel = 'One-to-One';
        typeBadgeClass = 'bg-cyan-500';
    }

    let content = `
        <div class="space-y-2">
            <div class="flex items-center gap-2">
                <span class="px-2 py-0.5 text-xs rounded ${typeBadgeClass}">
                    ${sessionTypeLabel}
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

    if (event.learningServiceName) {
        content += `
            <div class="flex items-center gap-1">
                <svg class="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                </svg>
                <span>${event.learningServiceName}</span>
            </div>
        `;
    }

    if (event.capacity > 0) {
        const slotsText = `${event.enrolledCount}/${event.capacity} slots`;
        const isFull = event.enrolledCount >= event.capacity;
        const isNearFull = event.enrolledCount >= event.capacity * 0.8;
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

    content += `</div></div>`;
    tooltip.innerHTML = content;

    const x = mouseEvent.clientX + 10;
    const y = mouseEvent.clientY + 10;

    tooltip.style.left = `${x}px`;
    tooltip.style.top = `${y}px`;

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
    document.getElementById('modalTitle').textContent = 'Create Session';

    // Load learning services for dropdown
    const learningServices = JSON.parse(localStorage.getItem('fms_learning_services') || '[]');
    const activeServices = learningServices.filter(ls => ls.status !== 'archived');

    // Default values
    const defaultDate = date || formatDateString(new Date());
    const defaultTime = time || '09:00';

    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <form onsubmit="event.preventDefault(); createSessionFromModal();" class="space-y-4">
            <!-- Learning Service Selection -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Learning Service <span class="text-red-500">*</span></label>
                <select id="createSessionLearningServiceId" required class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                    <option value="">Select a service...</option>
                    ${activeServices.map(ls => `<option value="${ls.id}">${ls.name} (${ls.type})</option>`).join('')}
                </select>
            </div>

            <!-- Date & Time -->
            <div class="grid grid-cols-2 gap-4">
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Date <span class="text-red-500">*</span></label>
                    <input type="date" id="createSessionDate" required value="${defaultDate}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
                <div>
                    <label class="block text-sm font-medium text-gray-700 mb-1">Time <span class="text-red-500">*</span></label>
                    <input type="time" id="createSessionTime" required value="${defaultTime}" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500">
                </div>
            </div>

            <!-- Notes -->
            <div>
                <label class="block text-sm font-medium text-gray-700 mb-1">Notes</label>
                <textarea id="createSessionNotes" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Optional session notes..."></textarea>
            </div>

            <!-- Actions -->
            <div class="flex justify-end gap-3 pt-4 border-t border-gray-200">
                <button type="button" onclick="closeEventModal()" class="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-lg font-medium transition-colors">Cancel</button>
                <button type="submit" class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium transition-colors">
                    Create Session
                </button>
            </div>
        </form>
    `;

    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.classList.remove('hidden');
    }
}

function closeEventModal() {
    const modal = document.getElementById('eventModal');
    if (modal) {
        modal.classList.add('hidden');
    }
    editingEvent = null;
    sessionSelectedStaff = [];
    currentSessionBookingState = null;
}

function saveEvent() {
    if (!editingEvent) {
        showNotification('No event selected', 'error');
        return;
    }

    try {
        const sessions = JSON.parse(localStorage.getItem('fms_sessions') || '[]');
        const sessionIndex = sessions.findIndex(s => s.id === editingEvent.id);

        if (sessionIndex === -1) {
            showNotification('Session not found', 'error');
            return;
        }

        const session = sessions[sessionIndex];

        // Update basic info
        const description = document.getElementById('eventDescription')?.value || '';
        const date = document.getElementById('eventDate')?.value || '';
        const time = document.getElementById('eventTime')?.value || '';
        const endTime = document.getElementById('eventEndTime')?.value || '';
        const status = document.getElementById('eventStatus')?.value || 'scheduled';

        // Calculate duration
        let duration = null;
        if (time && endTime) {
            const [startHour, startMin] = time.split(':').map(Number);
            const [endHour, endMin] = endTime.split(':').map(Number);
            const startMinutes = startHour * 60 + startMin;
            const endMinutes = endHour * 60 + endMin;
            duration = endMinutes - startMinutes;
        }

        // Update session
        session.notes = description;
        session.date = date;
        session.startTime = time;
        session.endTime = endTime;
        session.duration = duration;
        session.status = status;
        session.assignedStaff = sessionSelectedStaff;
        session.updatedAt = new Date().toISOString();

        sessions[sessionIndex] = session;
        localStorage.setItem('fms_sessions', JSON.stringify(sessions));

        showNotification('Session updated successfully', 'success');
        closeEventModal();
        loadEvents();
    } catch (error) {
        console.error('Error saving session:', error);
        showNotification('Error saving session', 'error');
    }
}

function showEditEventModal(event) {
    editingEvent = event;
    document.getElementById('modalTitle').textContent = 'Manage Session';

    const modalContent = document.getElementById('modalContent');

    // Load session data from localStorage
    const sessions = JSON.parse(localStorage.getItem('fms_sessions') || '[]');
    const session = sessions.find(s => s.id === event.id);
    if (!session) {
        showNotification('Session not found', 'error');
        return;
    }

    // Load learning service data
    const learningServices = JSON.parse(localStorage.getItem('fms_learning_services') || '[]');
    const learningService = learningServices.find(ls => ls.id === session.learningServiceId);

    modalContent.innerHTML = `
        <div class="space-y-4">
            <!-- Tab Navigation -->
            <div class="border-b border-gray-200">
                <nav class="flex space-x-4" aria-label="Tabs">
                    <button id="sessionOverviewTab"
                        class="session-tab-button active py-2 px-1 border-b-2 border-blue-500 font-medium text-sm text-blue-600 transition-colors"
                        onclick="switchSessionTab('overview', editingEvent)">
                        Overview
                    </button>
                    <button id="sessionStaffTab"
                        class="session-tab-button py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors"
                        onclick="switchSessionTab('staff', editingEvent)">
                        Staff Assignment
                    </button>
                    <button id="sessionEnrollmentTab"
                        class="session-tab-button py-2 px-1 border-b-2 border-transparent font-medium text-sm text-gray-500 hover:text-gray-700 hover:border-gray-300 transition-colors"
                        onclick="switchSessionTab('enrollment', editingEvent)">
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
                                <label class="block text-sm font-medium text-gray-700 mb-2">Session Title</label>
                                <input type="text" id="eventTitle" readonly class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-600 cursor-not-allowed" value="${event.title || session.title || ''}">
                                <p class="text-xs text-gray-500 mt-1">Auto-generated from learning service name</p>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Learning Service</label>
                                <div class="flex items-center gap-2">
                                    <input type="text" readonly class="flex-1 px-3 py-2 border border-gray-300 rounded-lg text-sm bg-gray-50 text-gray-600 cursor-not-allowed" value="${event.learningServiceName || learningService?.name || ''}">
                                    ${learningService ? `<a href="learning_service_detail.html?id=${learningService.id}" target="_blank" class="px-3 py-2 text-sm text-blue-600 hover:text-blue-700">View</a>` : ''}
                                </div>
                            </div>
                            
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Description</label>
                                <textarea id="eventDescription" rows="3" class="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" placeholder="Add notes or description for this session...">${event.description || session.notes || ''}</textarea>
                            </div>
                        </div>
                    </div>

                    <!-- Date & Time Section -->
                    <div class="bg-gray-50 rounded-lg p-4 border border-gray-200">
                        <h3 class="text-sm font-semibold text-gray-900 mb-4">Date & Time</h3>
                        <div class="space-y-4">
                            <div>
                                <label class="block text-sm font-medium text-gray-700 mb-2">Session Date <span class="text-red-500">*</span></label>
                                <input type="date" id="eventDate" required onchange="updateSessionDateTime()"
                                    class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                    value="${event.date || session.date || ''}">
                            </div>

                            <div class="grid grid-cols-2 gap-4">
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">Start Time <span class="text-red-500">*</span></label>
                                    <input type="time" id="eventTime" required onchange="updateSessionDateTime()"
                                        class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        value="${event.time || session.startTime || ''}">
                                </div>
                                <div>
                                    <label class="block text-sm font-medium text-gray-700 mb-2">End Time</label>
                                    <input type="time" id="eventEndTime" onchange="updateSessionDateTime()"
                                        class="w-full px-3 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-blue-500" 
                                        value="${event.endTime || session.endTime || ''}">
                                </div>
                            </div>

                            <div class="bg-blue-50 border border-blue-200 rounded-lg p-3">
                                <div class="flex items-center justify-between">
                                    <div>
                                        <p class="text-xs text-blue-600 font-medium mb-1">Session Duration</p>
                                        <p class="text-lg font-bold text-blue-700" id="sessionDurationDisplay">${event.duration || session.duration || 'Calculating...'} min</p>
                                    </div>
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
                                    <option value="scheduled" ${(event.status || session.status) === 'scheduled' ? 'selected' : ''}>Scheduled</option>
                                    <option value="in_progress" ${(event.status || session.status) === 'in_progress' ? 'selected' : ''}>In Progress</option>
                                    <option value="completed" ${(event.status || session.status) === 'completed' ? 'selected' : ''}>Completed</option>
                                    <option value="cancelled" ${(event.status || session.status) === 'cancelled' ? 'selected' : ''}>Cancelled</option>
                                </select>
                            </div>
                            
                            ${session.maxCapacity ? `
                            <div class="bg-gray-100 rounded-lg p-3">
                                <div class="flex items-center justify-between">
                                    <span class="text-sm font-medium text-gray-700">Capacity</span>
                                    <span class="text-sm font-bold text-gray-900">${session.enrolledCount || 0} / ${session.maxCapacity}</span>
                                </div>
                                <div class="mt-2 w-full bg-gray-200 rounded-full h-2">
                                    <div class="bg-blue-600 h-2 rounded-full" style="width: ${((session.enrolledCount || 0) / session.maxCapacity * 100)}%"></div>
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
                            <div class="w-8 h-8 bg-[#FDF4EC] rounded-lg flex items-center justify-center">
                                <svg class="w-5 h-5 text-[#F28A3F]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                            </div>
                            <h2 class="text-lg font-semibold text-[#2D3748]">Staff Assignment</h2>
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
                            <div class="text-xs text-gray-500 mb-1">Total Attendees</div>
                            <div class="text-2xl font-bold text-gray-900" id="sessionTotalBookings">0</div>
                        </div>
                        <div class="bg-white rounded-lg shadow-sm p-4">
                            <div class="text-xs text-gray-500 mb-1">Confirmed</div>
                            <div class="text-2xl font-bold text-emerald-600" id="sessionConfirmedBookings">0</div>
                        </div>
                        <div class="bg-white rounded-lg shadow-sm p-4">
                            <div class="text-xs text-gray-500 mb-1">Capacity</div>
                            <div class="text-2xl font-bold text-blue-600" id="sessionCapacityDisplay">0/${session.maxCapacity || 0}</div>
                        </div>
                    </div>

                    <!-- Slot Bookings Section -->
                    <div class="bg-white rounded-lg shadow-sm p-4">
                        <div class="flex items-center justify-between mb-6">
                            <div>
                                <h2 class="text-lg font-semibold text-gray-900">Enrollments</h2>
                                <p class="text-sm text-gray-500 mt-1">Manage attendee enrollments for this session</p>
                            </div>
                            <button onclick="openSessionBookCustomerModal(editingEvent)"
                                class="px-4 py-2 bg-[#5C40E6] text-white rounded-lg hover:opacity-90 transition-colors text-sm font-medium flex items-center gap-2">
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
                                    autocomplete="off" oninput="searchSessionBookedCustomers(this.value, editingEvent)" />
                                <svg class="absolute left-3 top-3 text-gray-400 w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                                </svg>
                            </div>
                        </div>

                        <!-- Enrolled Attendees List -->
                        <div>
                            <div class="flex items-center justify-between mb-3">
                                <h3 class="text-lg font-semibold text-gray-900">Enrolled Attendees</h3>
                                <span class="text-sm text-gray-500" id="sessionBookingsCount">0 attendees</span>
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
        loadSessionEnrollments(editingEvent);
        initializeSessionStaffAssignment(editingEvent);
        updateSessionDateTime();
    }, 100);

    const modal = document.getElementById('eventModal');
    if (modal) modal.classList.remove('hidden');
}

function deleteEvent(eventId, eventType) {
    if (!confirm('Are you sure you want to delete this session?')) return;

    try {
        const sessions = JSON.parse(localStorage.getItem('fms_sessions') || '[]');
        const filtered = sessions.filter(s => s.id !== eventId);
        localStorage.setItem('fms_sessions', JSON.stringify(filtered));

        showNotification('Session deleted successfully', 'success');
        closeEventPopover();
        loadEvents();
    } catch (error) {
        console.error('Error deleting session:', error);
        showNotification('Error deleting session', 'error');
    }
}

// ==================== Staff Filtering ====================

function initializeStaffFilter() {
    const searchInput = document.getElementById('staffSearchInput');
    const dropdown = document.getElementById('staffAutocompleteDropdown');

    if (!searchInput || !dropdown) return;

    searchInput.addEventListener('input', (e) => {
        const query = e.target.value.trim().toLowerCase();
        if (!query) {
            dropdown.classList.add('hidden');
            return;
        }

        showStaffAutocomplete(query);
    });

    document.addEventListener('click', (e) => {
        if (!searchInput.contains(e.target) && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });

    searchInput.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') {
            searchInput.value = '';
            dropdown.classList.add('hidden');
        }
    });

    updateSelectedStaffTags();
}

function showStaffAutocomplete(query) {
    const dropdown = document.getElementById('staffAutocompleteDropdown');
    if (!dropdown) return;

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

    staffFilter.push(staff.name);

    const searchInput = document.getElementById('staffSearchInput');
    const dropdown = document.getElementById('staffAutocompleteDropdown');
    if (searchInput) searchInput.value = '';
    if (dropdown) dropdown.classList.add('hidden');

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

// ==================== Current Time Indicator ====================

function updateCurrentTimeIndicator() {
    if (currentView !== 'week' && currentView !== 'day') return;

    const now = new Date();
    const currentHour = now.getHours();
    const currentMin = now.getMinutes();
    const currentTime = currentHour * 60 + currentMin;

    document.querySelectorAll('.current-time-line').forEach(el => el.remove());

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
    const eventCount = document.getElementById('eventCount');
    if (eventCount) {
        eventCount.textContent = filteredEvents.length;
    }
}

// ==================== Session Tab Management ====================

function switchSessionTab(tabName, event) {
    // Update tab buttons
    const tabs = ['overview', 'staff', 'enrollment'];
    tabs.forEach(tab => {
        const tabButton = document.getElementById(`session${tab.charAt(0).toUpperCase() + tab.slice(1)}Tab`);
        const tabContent = document.getElementById(`session${tab.charAt(0).toUpperCase() + tab.slice(1)}Content`);

        if (tabButton && tabContent) {
            if (tab === tabName) {
                tabButton.classList.add('active', 'border-blue-500', 'text-blue-600');
                tabButton.classList.remove('border-transparent', 'text-gray-500');
                tabContent.classList.remove('hidden');
            } else {
                tabButton.classList.remove('active', 'border-blue-500', 'text-blue-600');
                tabButton.classList.add('border-transparent', 'text-gray-500');
                tabContent.classList.add('hidden');
            }
        }
    });
}

function updateSessionDateTime() {
    const dateInput = document.getElementById('eventDate');
    const timeInput = document.getElementById('eventTime');
    const endTimeInput = document.getElementById('eventEndTime');
    const durationDisplay = document.getElementById('sessionDurationDisplay');

    if (!dateInput || !timeInput || !durationDisplay) return;

    const startTime = timeInput.value;
    const endTime = endTimeInput?.value;

    if (startTime && endTime) {
        const [startHour, startMin] = startTime.split(':').map(Number);
        const [endHour, endMin] = endTime.split(':').map(Number);
        const startMinutes = startHour * 60 + startMin;
        const endMinutes = endHour * 60 + endMin;
        const duration = endMinutes - startMinutes;

        if (duration > 0) {
            durationDisplay.textContent = `${duration} min`;
        } else {
            durationDisplay.textContent = 'Invalid time range';
        }
    } else if (startTime) {
        durationDisplay.textContent = 'Set end time to calculate duration';
    } else {
        durationDisplay.textContent = 'Calculating...';
    }
}

function loadSessionEnrollments(event) {
    const sessions = JSON.parse(localStorage.getItem('fms_sessions') || '[]');
    const session = sessions.find(s => s.id === event.id);

    const enrollments = session?.sessionEnrollments || [];
    const confirmedCount = enrollments.filter(e => e.status === 'confirmed').length;
    const totalEnrollments = enrollments.length;
    const capacity = session?.maxCapacity || event.capacity || 0;

    // Update stats
    const totalEl = document.getElementById('sessionTotalBookings');
    const confirmedEl = document.getElementById('sessionConfirmedBookings');
    const capacityEl = document.getElementById('sessionCapacityDisplay');

    if (totalEl) totalEl.textContent = totalEnrollments;
    if (confirmedEl) confirmedEl.textContent = confirmedCount;
    if (capacityEl) capacityEl.textContent = `${totalEnrollments}/${capacity}`;

    // Update count
    const countEl = document.getElementById('sessionBookingsCount');
    if (countEl) countEl.textContent = `${totalEnrollments} attendee${totalEnrollments !== 1 ? 's' : ''}`;

    // Render enrollments
    renderSessionBookings(enrollments);
}

function renderSessionBookings(enrollments) {
    const container = document.getElementById('sessionBookingsList');
    const emptyState = document.getElementById('sessionEmptyBookingsState');

    if (!container) return;

    if (enrollments.length === 0) {
        if (emptyState) emptyState.classList.remove('hidden');
        container.innerHTML = '';
    } else {
        if (emptyState) emptyState.classList.add('hidden');
        container.innerHTML = enrollments.map((enrollment) => {
            const status = enrollment.status === 'confirmed'
                ? { class: 'bg-emerald-100 text-emerald-700', text: 'Confirmed' }
                : { class: 'bg-gray-100 text-gray-600', text: enrollment.status || 'Pending' };

            return `
                <div class="border border-gray-200 rounded-lg p-3 hover:border-emerald-300 transition-colors">
                    <div class="flex items-start justify-between mb-2">
                        <div class="flex-1">
                            <div class="flex items-center gap-2 mb-1">
                                <h4 class="font-semibold text-gray-900">${enrollment.attendeeName || enrollment.customerName || 'Unnamed Attendee'}</h4>
                                <span class="px-2 py-0.5 text-xs rounded ${status.class}">${status.text}</span>
                                ${enrollment.isTemporary ? '<span class="px-2 py-0.5 text-xs rounded bg-amber-100 text-amber-700">Temporary</span>' : ''}
                            </div>
                            <div class="text-xs text-gray-500 space-y-0.5">
                                <div class="flex items-center gap-3">
                                    <span>Customer: ${enrollment.customerName || '-'}</span>
                                    <span>Quote: ${enrollment.quoteId || '-'}</span>
                                </div>
                                ${enrollment.bookedAt ? `<div class="text-gray-500">Enrolled: ${formatDate(new Date(enrollment.bookedAt))}</div>` : ''}
                                ${enrollment.isTemporary && enrollment.originalServiceName ? `<div class="text-amber-600">From: ${enrollment.originalServiceName}</div>` : ''}
                                ${enrollment.notes ? `<p class="text-gray-600 italic mt-1">"${enrollment.notes}"</p>` : ''}
                            </div>
                        </div>
                    </div>
                    <div class="flex gap-2 pt-2 border-t border-gray-100">
                        <button
                            onclick="viewSessionCustomer('${enrollment.customerId}')"
                            class="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50"
                        >
                            View Customer
                        </button>
                        <button
                            onclick="removeSessionEnrollment('${enrollment.id}')"
                            class="flex-1 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                        >
                            Remove
                        </button>
                    </div>
                </div>
            `;
        }).join('');
    }
}

function searchSessionBookedCustomers(query, event) {
    const sessions = JSON.parse(localStorage.getItem('fms_sessions') || '[]');
    const session = sessions.find(s => s.id === event.id);
    const enrollments = session?.sessionEnrollments || [];

    if (!query.trim()) {
        renderSessionBookings(enrollments);
        return;
    }

    const searchTerm = query.toLowerCase();
    const filtered = enrollments.filter(e =>
        (e.attendeeName && e.attendeeName.toLowerCase().includes(searchTerm)) ||
        (e.customerName && e.customerName.toLowerCase().includes(searchTerm)) ||
        (e.customerEmail && e.customerEmail.toLowerCase().includes(searchTerm)) ||
        (e.quoteId && e.quoteId.toLowerCase().includes(searchTerm))
    );

    renderSessionBookings(filtered);
}

function initializeSessionStaffAssignment(event) {
    const sessions = JSON.parse(localStorage.getItem('fms_sessions') || '[]');
    const session = sessions.find(s => s.id === event.id);

    // Load assigned staff
    sessionSelectedStaff = session?.assignedStaff || [];
    renderSessionSelectedStaff();

    // Setup search
    const searchInput = document.getElementById('sessionAssignmentSearchInput');
    const autocomplete = document.getElementById('sessionAssignmentAutocomplete');

    if (searchInput) {
        searchInput.addEventListener('input', (e) => {
            const query = e.target.value.trim().toLowerCase();
            if (!query) {
                if (autocomplete) autocomplete.classList.add('hidden');
                return;
            }
            searchSessionAssignments(query);
        });
    }
}

function searchSessionAssignments(query) {
    const autocomplete = document.getElementById('sessionAssignmentAutocomplete');
    if (!autocomplete) return;

    const filtered = sampleStaff.filter(staff => {
        const name = staff.name.toLowerCase();
        const role = staff.role.toLowerCase();
        const department = staff.department?.toLowerCase() || '';
        const searchTerm = query.toLowerCase();

        return (name.includes(searchTerm) || role.includes(searchTerm) || department.includes(searchTerm)) &&
            !sessionSelectedStaff.some(s => s.id === staff.id);
    });

    if (filtered.length === 0) {
        autocomplete.innerHTML = '<div class="p-3 text-sm text-gray-500">No staff found</div>';
        autocomplete.classList.remove('hidden');
        return;
    }

    autocomplete.innerHTML = filtered.map(staff => `
        <button 
            onclick="addSessionStaff('${staff.id}')" 
            class="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left border-b border-gray-100 last:border-b-0"
        >
            <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-medium">
                ${staff.name.split(' ').map(n => n[0]).join('')}
            </div>
            <div class="flex-1">
                <div class="font-medium text-sm text-gray-900">${staff.name}</div>
                <div class="text-xs text-gray-500">${staff.role}${staff.department ? ' • ' + staff.department : ''}</div>
            </div>
        </button>
    `).join('');

    autocomplete.classList.remove('hidden');
}

function addSessionStaff(staffId) {
    const staff = sampleStaff.find(s => s.id === staffId);
    if (!staff || sessionSelectedStaff.some(s => s.id === staffId)) return;

    sessionSelectedStaff.push({ id: staff.id, name: staff.name, type: 'staff' });
    renderSessionSelectedStaff();

    const searchInput = document.getElementById('sessionAssignmentSearchInput');
    const autocomplete = document.getElementById('sessionAssignmentAutocomplete');
    if (searchInput) searchInput.value = '';
    if (autocomplete) autocomplete.classList.add('hidden');
}

function removeSessionStaff(staffId) {
    sessionSelectedStaff = sessionSelectedStaff.filter(s => s.id !== staffId);
    renderSessionSelectedStaff();
}

function renderSessionSelectedStaff() {
    const container = document.getElementById('sessionSelectedAssignmentsList');
    const countEl = document.getElementById('sessionSelectedAssignmentsCount');

    if (countEl) countEl.textContent = sessionSelectedStaff.length;

    if (!container) return;

    if (sessionSelectedStaff.length === 0) {
        container.innerHTML = '<p class="text-xs text-gray-500">No staff assigned</p>';
        return;
    }

    container.innerHTML = sessionSelectedStaff.map(staff => `
        <div class="flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200">
            <div class="flex items-center gap-2">
                <div class="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 text-xs font-medium">
                    ${(staff.name || 'Unknown').split(' ').map(n => n[0]).join('')}
                </div>
                <div>
                    <div class="text-sm font-medium text-gray-900">${staff.name || 'Unknown Staff'}</div>
                    <div class="text-xs text-gray-500">Staff</div>
                </div>
            </div>
            <button onclick="removeSessionStaff('${staff.id}')" class="text-red-600 hover:text-red-700">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        </div>
    `).join('');
}

function viewSessionCustomer(customerId) {
    window.open(`customer_detail.html?id=${customerId}`, '_blank');
}

function removeSessionEnrollment(enrollmentId) {
    if (!confirm('Are you sure you want to remove this attendee from the session?')) return;

    if (!editingEvent) return;

    try {
        const sessions = JSON.parse(localStorage.getItem('fms_sessions') || '[]');
        const sessionIndex = sessions.findIndex(s => s.id === editingEvent.id);
        if (sessionIndex === -1) {
            showNotification('Session not found', 'error');
            return;
        }

        const session = sessions[sessionIndex];
        if (!session.sessionEnrollments) {
            session.sessionEnrollments = [];
        }

        session.sessionEnrollments = session.sessionEnrollments.filter(e => e.id !== enrollmentId);
        session.enrolledCount = session.sessionEnrollments.length;
        session.updatedAt = new Date().toISOString();

        sessions[sessionIndex] = session;
        localStorage.setItem('fms_sessions', JSON.stringify(sessions));

        showNotification('Attendee removed successfully', 'success');
        loadSessionEnrollments(editingEvent);
        loadEvents();
    } catch (error) {
        console.error('Error removing enrollment:', error);
        showNotification('Error removing attendee', 'error');
    }
}

// ==================== Session Enrollment Booking ====================

function openSessionBookCustomerModal(event) {
    // Use editingEvent if available (from modal), otherwise use the passed event
    const targetEvent = editingEvent || event;

    if (!targetEvent || targetEvent.isPreview) {
        showNotification('Cannot enroll attendees in preview sessions', 'warning');
        return;
    }

    const modal = document.getElementById('sessionBookCustomerModal');
    if (!modal) return;

    // Load session data from localStorage
    const sessions = JSON.parse(localStorage.getItem('fms_sessions') || '[]');
    const session = sessions.find(s => s.id === targetEvent.id);

    if (!session) {
        showNotification('Session not found', 'error');
        return;
    }

    // Load learning service data
    const learningServices = JSON.parse(localStorage.getItem('fms_learning_services') || '[]');
    const learningService = learningServices.find(ls => ls.id === session.learningServiceId);

    if (!learningService || !learningService.pricebookItemId) {
        showNotification('This learning service is not linked to a pricebook item', 'warning');
        return;
    }

    currentSessionBookingState = {
        session: session,
        learningService: learningService
    };

    clearSessionSlotBooking();
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

    const { learningService } = currentSessionBookingState;
    const pricebookItemId = learningService?.pricebookItemId;

    if (!pricebookItemId) {
        if (query && query.length >= 2) {
            resultsContainer.innerHTML = '<div class="p-3 text-sm text-amber-600 bg-amber-50 border border-amber-200 rounded">⚠️ Please ensure a pricebook item is linked to this learning service</div>';
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

    const { session } = currentSessionBookingState;

    const sessions = JSON.parse(localStorage.getItem('fms_sessions') || '[]');
    const currentSession = sessions.find(s => s.id === session.id);
    const bookedSlots = currentSession?.sessionEnrollments?.filter(b => b.status === 'confirmed').length || 0;
    const capacity = currentSession?.maxCapacity || session.capacity || 20;
    const available = Math.max(0, capacity - bookedSlots);

    const totalPurchased = quote.quantity || 1;

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

    document.getElementById('sessionCustomerAutocomplete').classList.add('hidden');
    const searchInput = document.getElementById('sessionCustomerSearchInput');
    if (searchInput) searchInput.value = '';
    showSessionSlotBookingForm();
}

function showSessionSlotBookingForm() {
    const form = document.getElementById('sessionSlotBookingForm');
    if (!form || !currentSessionBookingState) return;

    const { customer, quote, inventory } = currentSessionBookingState;

    const customerNameEl = document.getElementById('sessionSlotBookCustomerName');
    const customerEmailEl = document.getElementById('sessionSlotBookCustomerEmail');
    if (customerNameEl) customerNameEl.textContent = customer.name;
    if (customerEmailEl) customerEmailEl.textContent = customer.email;

    const inventoryTotalEl = document.getElementById('sessionInventoryTotal');
    const inventoryBookedEl = document.getElementById('sessionInventoryBooked');
    const inventoryAvailableEl = document.getElementById('sessionInventoryAvailable');
    if (inventoryTotalEl) inventoryTotalEl.textContent = inventory.total;
    if (inventoryBookedEl) inventoryBookedEl.textContent = inventory.booked;
    if (inventoryAvailableEl) inventoryAvailableEl.textContent = inventory.available;

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

    const paymentWarning = document.getElementById('sessionPaymentWarning');
    if (paymentWarning && quote.paymentStatus !== 'paid') {
        paymentWarning.classList.remove('hidden');
        const warningText = document.getElementById('sessionPaymentWarningText');
        if (warningText) {
            warningText.textContent =
                quote.paymentStatus === 'partial' ? 'This quote is partially paid.' : 'This quote is not fully paid.';
        }
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

    const attendeeName = document.getElementById('sessionAttendeeName')?.value.trim();
    const attendeeNotes = document.getElementById('sessionAttendeeNotes')?.value.trim() || '';

    if (!attendeeName) {
        showNotification('Please enter an attendee name', 'error');
        return;
    }

    if (inventory.available <= 0) {
        showNotification('This session is at full capacity', 'error');
        return;
    }

    try {
        const sessions = JSON.parse(localStorage.getItem('fms_sessions') || '[]');
        const sessionIndex = sessions.findIndex(s => s.id === session.id);
        if (sessionIndex === -1) {
            showNotification('Session not found', 'error');
            return;
        }

        const currentSession = sessions[sessionIndex];
        const now = new Date().toISOString();

        const bookingId = `ENROLL-${session.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        const newEnrollment = {
            id: bookingId,
            customerId: customer.id,
            customerName: customer.name,
            customerEmail: customer.email,
            quoteId: quote.id,
            attendeeName: attendeeName,
            notes: attendeeNotes,
            status: 'confirmed',
            enrolledAt: now,
            bookedAt: now
        };

        if (!currentSession.sessionEnrollments) {
            currentSession.sessionEnrollments = [];
        }
        currentSession.sessionEnrollments.push(newEnrollment);
        currentSession.enrolledCount = (currentSession.enrolledCount || 0) + 1;
        currentSession.updatedAt = now;

        // Update the enrollment list in the modal if it's open
        if (editingEvent && editingEvent.id === session.id) {
            loadSessionEnrollments(editingEvent);
        }

        sessions[sessionIndex] = currentSession;
        localStorage.setItem('fms_sessions', JSON.stringify(sessions));

        showNotification(`Successfully enrolled ${attendeeName} for this session`, 'success');

        // Update the enrollment list in the modal if it's open
        if (editingEvent && editingEvent.id === session.id) {
            loadSessionEnrollments(editingEvent);
        }

        clearSessionSlotBooking();
        closeSessionBookCustomerModal();
        loadEvents(); // Refresh calendar

        loadEvents();
    } catch (error) {
        console.error('Error saving enrollment:', error);
        showNotification('Error saving enrollment', 'error');
    }
}

// ==================== Helper Functions ====================

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

function formatTime(timeStr) {
    if (!timeStr) return '';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function formatHour(hour) {
    return `${String(hour).padStart(2, '0')}:00`;
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

// Populate service filter dropdown
function populateServiceFilter() {
    const select = document.getElementById('serviceFilter');
    if (!select) return;

    select.innerHTML = '<option value="">All Services</option>';

    const learningServices = JSON.parse(localStorage.getItem('fms_learning_services') || '[]');
    learningServices.forEach(service => {
        const option = document.createElement('option');
        option.value = service.id;
        option.textContent = service.name;
        select.appendChild(option);
    });
}


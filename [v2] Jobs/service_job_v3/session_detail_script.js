// ===== GLOBAL STATE =====
let currentSession = null;
let currentLearningService = null;
let isEditMode = false;
let selectedCustomer = null;
let selectedQuote = null;
let overrideAssignments = [];
let allStaff = [];
let allTeams = [];
let allBookings = [];

// Sample staff data
const sampleStaff = [
    { id: 'staff1', name: 'John Smith', role: 'Senior Tutor', skills: ['Math', 'Calculus'], hourlyRate: 45.00 },
    { id: 'staff2', name: 'Emily Davis', role: 'Math Specialist', skills: ['Math', 'Algebra'], hourlyRate: 40.00 },
    { id: 'staff3', name: 'Michael Brown', role: 'Tutor', skills: ['English', 'Writing'], hourlyRate: 35.00 },
    { id: 'staff4', name: 'Sarah Wilson', role: 'Science Tutor', skills: ['Science', 'Chemistry'], hourlyRate: 38.00 },
    { id: 'staff5', name: 'David Lee', role: 'One-to-One Specialist', skills: ['Math', 'Physics'], hourlyRate: 50.00 }
];

// Sample teams data
const sampleTeams = [
    { id: 'team1', name: 'Math Team', members: ['staff1', 'staff2'], skills: ['Math', 'Calculus', 'Algebra'] },
    { id: 'team2', name: 'Science Team', members: ['staff4'], skills: ['Science', 'Chemistry'] }
];

// Sample customers (matching learning_service_detail_script.js)
const sampleCustomers = [
    {
        id: 'CUST-001',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+61 400 123 456',
        quotes: [
            { id: 'Q-2025-001', pricebookItemId: 'pb1', slots: 5, total: 100.00, status: 'approved', paymentStatus: 'paid', amountPaid: 100.00 },
            { id: 'Q-2025-002', pricebookItemId: 'pb1', slots: 3, total: 60.00, status: 'approved', paymentStatus: 'partial', amountPaid: 30.00 }
        ]
    },
    {
        id: 'CUST-002',
        name: 'Michael Chen',
        email: 'm.chen@email.com',
        phone: '+61 400 234 567',
        quotes: [
            { id: 'Q-2025-003', pricebookItemId: 'pb3', slots: 10, total: 500.00, status: 'approved', paymentStatus: 'paid', amountPaid: 500.00 }
        ]
    },
    {
        id: 'CUST-003',
        name: 'Emma Wilson',
        email: 'emma.w@email.com',
        phone: '+61 400 345 678',
        quotes: [
            { id: 'Q-2025-004', pricebookItemId: 'pb1', slots: 2, total: 40.00, status: 'approved', paymentStatus: 'unpaid', amountPaid: 0 }
        ]
    }
];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    loadSessionData();
    initializeData();
});

function initializeData() {
    allStaff = sampleStaff;
    allTeams = sampleTeams;
}

// ===== DATA LOADING =====
function loadSessionData() {
    const urlParams = new URLSearchParams(window.location.search);
    const sessionId = urlParams.get('id');

    if (!sessionId) {
        alert('Session ID not found. Redirecting to session list.');
        window.location.href = 'session_list.html';
        return;
    }

    // Load sessions from localStorage
    const storedSessions = localStorage.getItem('fms_sessions');
    let sessions = storedSessions ? JSON.parse(storedSessions) : [];

    // If no sessions in storage, use sample data
    if (sessions.length === 0) {
        sessions = getSampleSessions();
    }

    currentSession = sessions.find(s => s.id === sessionId);

    if (!currentSession) {
        alert('Session not found. Redirecting to session list.');
        window.location.href = 'session_list.html';
        return;
    }

    // Load learning service data
    loadLearningServiceData(currentSession.learningServiceId);

    // Load bookings for this session
    loadBookings();

    // Render the session details
    renderSessionDetails();
}

function loadLearningServiceData(serviceId) {
    const stored = localStorage.getItem('fms_learning_services');
    let services = stored ? JSON.parse(stored) : [];

    // If no services in storage, use sample data
    if (services.length === 0) {
        services = getSampleLearningServices();
    }

    currentLearningService = services.find(s => s.id === serviceId);

    if (!currentLearningService) {
        console.warn('Learning Service not found for session');
    }
}

function loadBookings() {
    // Load bookings from localStorage or use sample data
    const stored = localStorage.getItem('fms_session_bookings');
    if (stored) {
        const allBookingsData = JSON.parse(stored);
        allBookings = allBookingsData.filter(b => b.sessionId === currentSession.id);
    } else {
        // Sample bookings for this session
        allBookings = [
            {
                id: 'booking_001',
                sessionId: currentSession.id,
                customerId: 'CUST-001',
                customerName: 'Sarah Johnson',
                attendeeName: 'Sarah Johnson',
                quoteId: 'Q-2025-001',
                status: 'confirmed',
                bookedAt: '2024-12-01T10:00:00Z',
                paymentStatus: 'paid'
            },
            {
                id: 'booking_002',
                sessionId: currentSession.id,
                customerId: 'CUST-002',
                customerName: 'Michael Chen',
                attendeeName: 'Michael Chen',
                quoteId: 'Q-2025-003',
                status: 'confirmed',
                bookedAt: '2024-12-01T11:00:00Z',
                paymentStatus: 'paid'
            }
        ];
    }
}

function getSampleSessions() {
    const today = new Date();
    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    return [
        {
            id: 'session_001',
            learningServiceId: 'ls_001',
            learningServiceName: 'AP Calculus AB',
            learningServiceType: 'Class',
            date: formatDateForInput(tomorrow),
            startTime: '15:00',
            endTime: '16:30',
            duration: 90,
            status: 'scheduled',
            maxCapacity: 20,
            minCapacity: null,
            enrolled: 2,
            staff: [
                { id: 'staff1', name: 'John Smith', role: 'Senior Tutor' },
                { id: 'staff2', name: 'Emily Davis', role: 'Math Specialist' }
            ],
            overrideStaff: null,
            notes: 'First session of the week',
            createdAt: '2024-12-01T10:00:00Z'
        }
    ];
}

function getSampleLearningServices() {
    return [
        {
            id: 'ls_001',
            name: 'AP Calculus AB',
            type: 'Class',
            description: 'Advanced Placement Calculus AB course',
            pricebookItemId: 'pb1',
            schedule: {
                frequency: 'weekly',
                daysOfWeek: ['Monday', 'Wednesday'],
                startTime: '15:00',
                endTime: '16:30',
                duration: 90
            },
            maxCapacity: 20,
            minCapacity: null,
            curriculum: 'AP Calculus AB Curriculum',
            cohortStartDate: '2025-01-15',
            cohortEndDate: '2025-05-30',
            cohortSize: 20,
            defaultAssignments: [
                { id: 'staff1', type: 'staff', name: 'John Smith', role: 'Senior Tutor', hourlyRate: 45.00, assignedRate: 45.00 },
                { id: 'staff2', type: 'staff', name: 'Emily Davis', role: 'Math Specialist', hourlyRate: 40.00, assignedRate: 40.00 }
            ]
        }
    ];
}

// ===== RENDERING =====
function renderSessionDetails() {
    if (!currentSession) return;

    // Header
    document.getElementById('sessionTitle').textContent = currentSession.learningServiceName || 'Session Details';
    document.getElementById('sessionIdBadge').textContent = currentSession.id.toUpperCase().replace('_', '-');
    document.getElementById('sessionDateTime').textContent = formatDateTime(currentSession.date, currentSession.startTime);
    document.getElementById('learningServiceLink').textContent = currentSession.learningServiceName || '-';
    document.getElementById('learningServiceLink').href = `learning_service_detail.html?id=${currentSession.learningServiceId}`;

    // Type badge
    updateTypeBadge(currentSession.learningServiceType);

    // Status badge
    updateStatusBadge(currentSession.status);

    // Session Information
    document.getElementById('viewDate').textContent = formatDate(currentSession.date);
    document.getElementById('viewTime').textContent = `${formatTime(currentSession.startTime)} - ${formatTime(currentSession.endTime)}`;
    document.getElementById('viewDuration').textContent = `${currentSession.duration} minutes`;
    document.getElementById('viewStatus').textContent = currentSession.status.charAt(0).toUpperCase() + currentSession.status.slice(1);
    document.getElementById('viewLearningService').textContent = currentSession.learningServiceName || '-';
    document.getElementById('viewLearningService').href = `learning_service_detail.html?id=${currentSession.learningServiceId}`;

    // Edit mode fields
    document.getElementById('editDate').value = currentSession.date;
    document.getElementById('editStartTime').value = currentSession.startTime;
    document.getElementById('editEndTime').value = currentSession.endTime;
    document.getElementById('editStatus').value = currentSession.status;
    document.getElementById('editNotes').value = currentSession.notes || '';

    // Type-specific information
    renderTypeSpecificInfo();

    // Staff assignment
    renderStaffAssignment();

    // Enrollment
    renderEnrollment();

    // Attendees
    renderAttendees();

    // Sidebar
    renderSidebar();
}

function updateTypeBadge(type) {
    const badge = document.getElementById('sessionTypeBadge');
    const badges = {
        'Class': { text: '📚 Class', class: 'type-badge-class' },
        'Group': { text: '👥 Group', class: 'type-badge-group' },
        'One-to-One': { text: '👤 One-to-One', class: 'type-badge-one-to-one' }
    };

    const badgeInfo = badges[type] || badges['Class'];
    badge.textContent = badgeInfo.text;
    badge.className = `px-2 py-1 text-xs font-medium rounded-full ${badgeInfo.class}`;
}

function updateStatusBadge(status) {
    const badge = document.getElementById('sessionStatusBadge');
    const statuses = {
        'scheduled': { text: 'Scheduled', class: 'status-scheduled' },
        'in_progress': { text: 'In Progress', class: 'status-in_progress' },
        'completed': { text: 'Completed', class: 'status-completed' },
        'cancelled': { text: 'Cancelled', class: 'status-cancelled' }
    };

    const statusInfo = statuses[status] || statuses['scheduled'];
    badge.textContent = statusInfo.text;
    badge.className = `px-2 py-1 text-xs font-medium rounded-full ${statusInfo.class}`;
}

function renderTypeSpecificInfo() {
    if (!currentLearningService) return;

    const type = currentLearningService.type;

    // Hide all type details
    document.getElementById('classTypeDetails').classList.add('hidden');
    document.getElementById('groupTypeDetails').classList.add('hidden');
    document.getElementById('oneToOneTypeDetails').classList.add('hidden');

    if (type === 'Class') {
        document.getElementById('classTypeDetails').classList.remove('hidden');
        document.getElementById('classCurriculum').textContent = currentLearningService.curriculum || '-';
        document.getElementById('classCohort').textContent = `${formatDate(currentLearningService.cohortStartDate)} - ${formatDate(currentLearningService.cohortEndDate)}`;
    } else if (type === 'Group') {
        document.getElementById('groupTypeDetails').classList.remove('hidden');
        document.getElementById('groupMinCapacity').textContent = currentLearningService.minCapacity || '-';
    } else if (type === 'One-to-One') {
        document.getElementById('oneToOneTypeDetails').classList.remove('hidden');
        document.getElementById('oneToOneFocus').textContent = currentLearningService.focusArea || '-';
        document.getElementById('oneToOnePersonalization').textContent = currentLearningService.personalizationLevel || '-';
    }
}

function renderStaffAssignment() {
    const defaultStaffList = document.getElementById('defaultStaffList');
    const overrideStaffList = document.getElementById('overrideStaffList');
    const defaultSection = document.getElementById('defaultStaffSection');
    const overrideSection = document.getElementById('overrideStaffSection');

    defaultStaffList.innerHTML = '';
    overrideStaffList.innerHTML = '';

    // Check if override exists
    if (currentSession.overrideStaff && currentSession.overrideStaff.length > 0) {
        // Show override staff
        overrideSection.classList.remove('hidden');
        defaultSection.classList.add('hidden');

        currentSession.overrideStaff.forEach(assignment => {
            const staff = allStaff.find(s => s.id === assignment.id);
            if (staff) {
                const badge = createStaffBadge(staff, assignment);
                overrideStaffList.appendChild(badge);
            }
        });
    } else {
        // Show default staff from learning service
        overrideSection.classList.add('hidden');
        defaultSection.classList.remove('hidden');

        if (currentLearningService && currentLearningService.defaultAssignments) {
            currentLearningService.defaultAssignments.forEach(assignment => {
                if (assignment.type === 'staff') {
                    const staff = allStaff.find(s => s.id === assignment.id);
                    if (staff) {
                        const badge = createStaffBadge(staff, assignment);
                        defaultStaffList.appendChild(badge);
                    }
                } else if (assignment.type === 'team') {
                    const team = allTeams.find(t => t.id === assignment.id);
                    if (team) {
                        const badge = createTeamBadge(team);
                        defaultStaffList.appendChild(badge);
                    }
                }
            });
        }
    }
}

function createStaffBadge(staff, assignment = null) {
    const badge = document.createElement('div');
    badge.className = 'inline-flex items-center gap-2 px-3 py-1.5 bg-indigo-50 border border-indigo-200 rounded-lg text-sm';
    badge.innerHTML = `
        <svg class="w-4 h-4 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
        </svg>
        <span class="font-medium text-indigo-900">${staff.name}</span>
        <span class="text-indigo-600">${staff.role}</span>
    `;
    return badge;
}

function createTeamBadge(team) {
    const badge = document.createElement('div');
    badge.className = 'inline-flex items-center gap-2 px-3 py-1.5 bg-purple-50 border border-purple-200 rounded-lg text-sm';
    badge.innerHTML = `
        <svg class="w-4 h-4 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
        </svg>
        <span class="font-medium text-purple-900">${team.name}</span>
        <span class="text-purple-600">Team</span>
    `;
    return badge;
}

function renderEnrollment() {
    const enrolled = allBookings.filter(b => b.status === 'confirmed').length;
    const confirmed = allBookings.filter(b => b.status === 'confirmed').length;
    const maxCapacity = currentSession.maxCapacity || 0;
    const available = maxCapacity - enrolled;

    document.getElementById('enrolledCount').textContent = enrolled;
    document.getElementById('confirmedCount').textContent = confirmed;
    document.getElementById('availableCount').textContent = available;

    // Capacity display
    if (currentSession.learningServiceType === 'One-to-One') {
        document.getElementById('capacityDisplay').textContent = '1:1 Ratio';
        document.getElementById('capacityInfo').textContent = 'One-to-One session (1 attendee only)';
    } else {
        document.getElementById('capacityDisplay').textContent = `${enrolled} / ${maxCapacity}`;
        document.getElementById('capacityInfo').textContent = `${available} slots available`;
    }

    // Progress bar
    const percentage = maxCapacity > 0 ? (enrolled / maxCapacity) * 100 : 0;
    document.getElementById('progressFill').style.width = `${percentage}%`;

    // Update button state
    const bookBtn = document.getElementById('bookCustomerBtn');
    if (currentSession.learningServiceType === 'One-to-One' && enrolled >= 1) {
        bookBtn.disabled = true;
        bookBtn.textContent = 'Session Fully Booked';
    } else if (available <= 0) {
        bookBtn.disabled = true;
        bookBtn.textContent = 'No Slots Available';
    } else {
        bookBtn.disabled = false;
        bookBtn.innerHTML = `
            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
            </svg>
            Book Customer
        `;
    }
}

function renderAttendees() {
    const attendeesList = document.getElementById('attendeesList');
    const emptyState = document.getElementById('emptyAttendeesState');

    attendeesList.innerHTML = '';

    if (allBookings.length === 0) {
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    allBookings.forEach(booking => {
        const customer = sampleCustomers.find(c => c.id === booking.customerId);
        const quote = customer?.quotes.find(q => q.id === booking.quoteId);
        const isTemporary = booking.isTemporary || false;

        const statusConfig = {
            confirmed: { text: 'Confirmed', class: 'bg-green-100 text-green-700' },
            cancelled: { text: 'Cancelled', class: 'bg-gray-100 text-gray-700' }
        };
        const status = statusConfig[booking.status] || statusConfig.confirmed;

        const attendeeCard = document.createElement('div');
        attendeeCard.className = 'border border-gray-200 rounded-lg p-3 hover:border-emerald-300 transition-colors';
        attendeeCard.innerHTML = `
            <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                        <h4 class="font-semibold text-gray-900">${booking.attendeeName || booking.customerName}</h4>
                        <span class="px-2 py-0.5 text-xs rounded ${status.class}">${status.text}</span>
                        ${isTemporary ? '<span class="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">Temporary</span>' : ''}
                        ${getPaymentStatusBadge(quote?.paymentStatus)}
                    </div>
                    <div class="text-xs text-gray-500 space-y-0.5">
                        <div class="flex items-center gap-3">
                            <span>Customer: ${booking.customerName}</span>
                            <span>Quote: ${booking.quoteId || '-'}</span>
                        </div>
                        <div class="text-gray-500">Enrolled: ${formatDateTime(booking.bookedAt)}</div>
                        ${isTemporary && booking.originalServiceName ? `<div class="text-amber-600">From: ${booking.originalServiceName}</div>` : ''}
                    </div>
                </div>
            </div>
            <div class="flex gap-2 pt-2 border-t border-gray-100">
                <button onclick="viewCustomer('${booking.customerId}')" 
                    class="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    View Customer
                </button>
                <button onclick="openTransferToSessionModal('${booking.id}')" 
                    class="flex-1 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                    </svg>
                    Transfer
                </button>
                <button onclick="cancelBooking('${booking.id}')" 
                    class="flex-1 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50">
                    Remove
                </button>
            </div>
        `;
        attendeesList.appendChild(attendeeCard);
    });
}

function getPaymentStatusBadge(paymentStatus) {
    if (!paymentStatus) return '';

    const badges = {
        'paid': '<span class="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">Paid</span>',
        'partial': '<span class="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">Partial</span>',
        'unpaid': '<span class="px-2 py-0.5 text-xs font-medium rounded-full bg-red-100 text-red-700">Unpaid</span>'
    };

    return badges[paymentStatus] || '';
}

function renderSidebar() {
    if (!currentLearningService) return;

    document.getElementById('sidebarServiceName').textContent = currentLearningService.name || '-';

    // Type badge
    const sidebarBadge = document.getElementById('sidebarTypeBadge');
    const badges = {
        'Class': { text: '📚 Class', class: 'type-badge-class' },
        'Group': { text: '👥 Group', class: 'type-badge-group' },
        'One-to-One': { text: '👤 One-to-One', class: 'type-badge-one-to-one' }
    };
    const badgeInfo = badges[currentLearningService.type] || badges['Class'];
    sidebarBadge.textContent = badgeInfo.text;
    sidebarBadge.className = `px-2 py-0.5 text-xs font-medium rounded-full ${badgeInfo.class}`;

    // Schedule
    const schedule = currentLearningService.schedule;
    if (schedule) {
        const days = schedule.daysOfWeek?.join(', ') || '-';
        const time = `${schedule.startTime} - ${schedule.endTime}`;
        document.getElementById('sidebarSchedule').textContent = `${days} at ${time}`;
    } else {
        document.getElementById('sidebarSchedule').textContent = '-';
    }

    // Capacity
    if (currentLearningService.type === 'One-to-One') {
        document.getElementById('sidebarCapacity').textContent = '1:1 Ratio';
    } else {
        document.getElementById('sidebarCapacity').textContent = `${currentLearningService.maxCapacity || '-'} max`;
    }

    // Staff
    const staffCount = currentLearningService.defaultAssignments?.length || 0;
    document.getElementById('sidebarStaff').textContent = `${staffCount} assigned`;
}

// ===== VIEW/EDIT MODE =====
function enterEditMode() {
    isEditMode = true;
    document.body.classList.add('edit-mode');
}

function cancelEdit() {
    isEditMode = false;
    document.body.classList.remove('edit-mode');
    renderSessionDetails(); // Reset to original values
}

function saveChanges() {
    if (!currentSession) return;

    // Collect edited values
    currentSession.date = document.getElementById('editDate').value;
    currentSession.startTime = document.getElementById('editStartTime').value;
    currentSession.endTime = document.getElementById('editEndTime').value;
    currentSession.status = document.getElementById('editStatus').value;
    currentSession.notes = document.getElementById('editNotes').value;

    // Calculate duration
    if (currentSession.startTime && currentSession.endTime) {
        currentSession.duration = calculateDuration(currentSession.startTime, currentSession.endTime);
    }

    // Save to localStorage
    const stored = localStorage.getItem('fms_sessions');
    let sessions = stored ? JSON.parse(stored) : [];
    const index = sessions.findIndex(s => s.id === currentSession.id);
    if (index >= 0) {
        sessions[index] = currentSession;
    } else {
        sessions.push(currentSession);
    }
    localStorage.setItem('fms_sessions', JSON.stringify(sessions));

    // Exit edit mode
    cancelEdit();
    renderSessionDetails();

    alert('Session updated successfully!');
}

function calculateDuration(startTime, endTime) {
    const start = new Date(`2000-01-01T${startTime}`);
    const end = new Date(`2000-01-01T${endTime}`);
    return Math.round((end - start) / 60000); // minutes
}

// ===== STAFF OVERRIDE =====
function openStaffOverrideModal() {
    overrideAssignments = currentSession.overrideStaff ? [...currentSession.overrideStaff] : [];
    renderOverrideAssignments();
    document.getElementById('staffOverrideModal').classList.remove('hidden');
}

function closeStaffOverrideModal() {
    document.getElementById('staffOverrideModal').classList.add('hidden');
    overrideAssignments = [];
}

function searchOverrideAssignments(query) {
    const autocomplete = document.getElementById('overrideAssignmentAutocomplete');
    if (!query || query.length < 2) {
        autocomplete.classList.add('hidden');
        return;
    }

    const lowerQuery = query.toLowerCase();
    const results = [];

    // Search staff
    allStaff.forEach(staff => {
        if (staff.name.toLowerCase().includes(lowerQuery) ||
            staff.role.toLowerCase().includes(lowerQuery) ||
            staff.skills.some(s => s.toLowerCase().includes(lowerQuery))) {
            results.push({ ...staff, type: 'staff' });
        }
    });

    // Search teams
    allTeams.forEach(team => {
        if (team.name.toLowerCase().includes(lowerQuery) ||
            team.skills.some(s => s.toLowerCase().includes(lowerQuery))) {
            results.push({ ...team, type: 'team' });
        }
    });

    renderOverrideAutocomplete(results);
}

function renderOverrideAutocomplete(results) {
    const autocomplete = document.getElementById('overrideAssignmentAutocomplete');
    autocomplete.innerHTML = '';

    if (results.length === 0) {
        autocomplete.innerHTML = '<div class="p-3 text-sm text-gray-500">No results found</div>';
        autocomplete.classList.remove('hidden');
        return;
    }

    results.forEach(item => {
        const div = document.createElement('div');
        div.className = 'p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0';
        div.onclick = () => addOverrideAssignment(item.id, item.type);

        if (item.type === 'staff') {
            div.innerHTML = `
                <div class="flex items-center gap-3">
                    <svg class="w-5 h-5 text-indigo-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    <div class="flex-1">
                        <p class="font-medium text-gray-900">${item.name}</p>
                        <p class="text-xs text-gray-500">${item.role}</p>
                    </div>
                </div>
            `;
        } else {
            div.innerHTML = `
                <div class="flex items-center gap-3">
                    <svg class="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                    </svg>
                    <div class="flex-1">
                        <p class="font-medium text-gray-900">${item.name}</p>
                        <p class="text-xs text-gray-500">Team</p>
                    </div>
                </div>
            `;
        }

        autocomplete.appendChild(div);
    });

    autocomplete.classList.remove('hidden');
}

function addOverrideAssignment(id, type) {
    if (overrideAssignments.find(a => a.id === id && a.type === type)) {
        return; // Already added
    }

    overrideAssignments.push({ id, type });
    renderOverrideAssignments();
    document.getElementById('overrideAssignmentAutocomplete').classList.add('hidden');
    document.getElementById('overrideAssignmentSearch').value = '';
}

function removeOverrideAssignment(id, type) {
    overrideAssignments = overrideAssignments.filter(a => !(a.id === id && a.type === type));
    renderOverrideAssignments();
}

function renderOverrideAssignments() {
    const list = document.getElementById('overrideSelectedList');
    const count = document.getElementById('overrideSelectedCount');

    list.innerHTML = '';
    count.textContent = overrideAssignments.length;

    overrideAssignments.forEach(assignment => {
        const item = assignment.type === 'staff'
            ? allStaff.find(s => s.id === assignment.id)
            : allTeams.find(t => t.id === assignment.id);

        if (!item) return;

        const div = document.createElement('div');
        div.className = 'flex items-center justify-between p-2 bg-gray-50 rounded-lg border border-gray-200';
        div.innerHTML = `
            <div class="flex items-center gap-2">
                ${assignment.type === 'staff' ? createStaffBadge(item).innerHTML : createTeamBadge(item).innerHTML}
            </div>
            <button onclick="removeOverrideAssignment('${assignment.id}', '${assignment.type}')" 
                class="text-red-500 hover:text-red-700">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                </svg>
            </button>
        `;
        list.appendChild(div);
    });
}

function confirmStaffOverride() {
    currentSession.overrideStaff = overrideAssignments;

    // Save to localStorage
    const stored = localStorage.getItem('fms_sessions');
    let sessions = stored ? JSON.parse(stored) : [];
    const index = sessions.findIndex(s => s.id === currentSession.id);
    if (index >= 0) {
        sessions[index] = currentSession;
    } else {
        sessions.push(currentSession);
    }
    localStorage.setItem('fms_sessions', JSON.stringify(sessions));

    closeStaffOverrideModal();
    renderStaffAssignment();
    alert('Staff assignment overridden successfully!');
}

// ===== ATTENDEE MANAGEMENT =====
function openBookCustomerModal() {
    // Check if One-to-One and already has attendee
    if (currentSession.learningServiceType === 'One-to-One' && allBookings.length >= 1) {
        alert('One-to-One sessions can only have 1 attendee. This session is already fully enrolled.');
        return;
    }

    selectedCustomer = null;
    selectedQuote = null;
    document.getElementById('customerSearchInput').value = '';
    document.getElementById('slotBookingForm').classList.add('hidden');
    document.getElementById('customerAutocomplete').classList.add('hidden');
    document.getElementById('bookCustomerModal').classList.remove('hidden');
}

function closeBookCustomerModal() {
    document.getElementById('bookCustomerModal').classList.add('hidden');
    selectedCustomer = null;
    selectedQuote = null;
}

function searchCustomersForBooking(query) {
    const autocomplete = document.getElementById('customerAutocomplete');
    if (!query || query.length < 2) {
        autocomplete.classList.add('hidden');
        return;
    }

    const lowerQuery = query.toLowerCase();
    const matching = sampleCustomers.filter(customer => {
        if (customer.name.toLowerCase().includes(lowerQuery) ||
            customer.email.toLowerCase().includes(lowerQuery)) {
            // Check if customer has quotes for this learning service's price book item
            return customer.quotes.some(q =>
                q.pricebookItemId === currentLearningService?.pricebookItemId &&
                q.status === 'approved'
            );
        }
        return false;
    });

    renderCustomerAutocomplete(matching);
}

function renderCustomerAutocomplete(customers) {
    const autocomplete = document.getElementById('customerAutocomplete');
    autocomplete.innerHTML = '';

    if (customers.length === 0) {
        autocomplete.innerHTML = '<div class="p-3 text-sm text-gray-500">No customers found with matching quotes</div>';
        autocomplete.classList.remove('hidden');
        return;
    }

    customers.forEach(customer => {
        const quotes = customer.quotes.filter(q =>
            q.pricebookItemId === currentLearningService?.pricebookItemId &&
            q.status === 'approved'
        );

        if (quotes.length === 0) return;

        const div = document.createElement('div');
        div.className = 'p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0';
        div.onclick = () => selectCustomerQuote(customer.id, quotes[0].id);

        div.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <p class="font-medium text-gray-900">${customer.name}</p>
                    <p class="text-xs text-gray-500">${customer.email}</p>
                    <div class="mt-1 space-y-1">
                        ${quotes.map(q => `
                            <div class="text-xs text-gray-600">
                                Quote ${q.id}: ${q.slots} slots - 
                                <span class="${q.paymentStatus === 'paid' ? 'text-emerald-600' : q.paymentStatus === 'partial' ? 'text-amber-600' : 'text-red-600'}">
                                    ${q.paymentStatus}
                                </span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;

        autocomplete.appendChild(div);
    });

    autocomplete.classList.remove('hidden');
}

function selectCustomerQuote(customerId, quoteId) {
    const customer = sampleCustomers.find(c => c.id === customerId);
    const quote = customer?.quotes.find(q => q.id === quoteId);

    if (!customer || !quote) return;

    selectedCustomer = customer;
    selectedQuote = quote;

    // Calculate inventory
    const inventory = calculateSlotInventory(customerId, quoteId);

    // Populate form
    document.getElementById('slotBookCustomerName').textContent = customer.name;
    document.getElementById('slotBookCustomerEmail').textContent = customer.email;
    document.getElementById('inventoryTotal').textContent = inventory.total;
    document.getElementById('inventoryBooked').textContent = inventory.booked;
    document.getElementById('inventoryAvailable').textContent = inventory.available;

    // Quote display
    document.getElementById('slotBookQuoteDisplay').innerHTML = `
        <div class="flex items-center justify-between">
            <div>
                <p class="font-medium text-gray-900">${quote.id}</p>
                <p class="text-xs text-gray-500">${quote.slots} slots • $${quote.total.toFixed(2)}</p>
            </div>
            <span class="px-2 py-0.5 text-xs font-medium rounded-full ${quote.paymentStatus === 'paid' ? 'bg-emerald-100 text-emerald-700' : quote.paymentStatus === 'partial' ? 'bg-amber-100 text-amber-700' : 'bg-red-100 text-red-700'}">
                ${quote.paymentStatus}
            </span>
        </div>
    `;

    // Payment warning
    const warning = document.getElementById('paymentWarning');
    const warningText = document.getElementById('paymentWarningText');
    if (quote.paymentStatus !== 'paid') {
        warning.classList.remove('hidden');
        if (quote.paymentStatus === 'unpaid') {
            warningText.textContent = 'This quote is not paid. Proceed with caution.';
        } else {
            warningText.textContent = `This quote is only partially paid ($${quote.amountPaid.toFixed(2)} of $${quote.total.toFixed(2)}).`;
        }
    } else {
        warning.classList.add('hidden');
    }

    // Show form
    document.getElementById('slotBookingForm').classList.remove('hidden');
    document.getElementById('customerAutocomplete').classList.add('hidden');

    // Update button state
    updateBookingButtonState();
}

function calculateSlotInventory(customerId, quoteId) {
    const quote = sampleCustomers.find(c => c.id === customerId)?.quotes.find(q => q.id === quoteId);
    if (!quote) return { total: 0, booked: 0, available: 0 };

    // Get all bookings for this customer and quote across all sessions
    const stored = localStorage.getItem('fms_session_bookings');
    let allBookingsData = stored ? JSON.parse(stored) : [];
    const bookingsForQuote = allBookingsData.filter(b => b.customerId === customerId && b.quoteId === quoteId);

    const total = quote.slots;
    const booked = bookingsForQuote.length;
    const available = Math.max(0, total - booked);

    return { total, booked, available };
}

function updateBookingButtonState() {
    const btn = document.getElementById('confirmBookingBtn');
    if (!selectedCustomer || !selectedQuote) {
        btn.disabled = true;
        return;
    }

    const inventory = calculateSlotInventory(selectedCustomer.id, selectedQuote.id);
    const enrolled = allBookings.length;
    const maxCapacity = currentSession.maxCapacity || 0;

    // Check One-to-One limit
    if (currentSession.learningServiceType === 'One-to-One' && enrolled >= 1) {
        btn.disabled = true;
        return;
    }

    // Check session capacity
    if (enrolled >= maxCapacity) {
        btn.disabled = true;
        return;
    }

    // Check available slots
    if (inventory.available <= 0) {
        btn.disabled = true;
        return;
    }

    btn.disabled = false;
}

function clearSlotBooking() {
    selectedCustomer = null;
    selectedQuote = null;
    document.getElementById('slotBookingForm').classList.add('hidden');
    document.getElementById('customerSearchInput').value = '';
}

function confirmBooking() {
    if (!selectedCustomer || !selectedQuote) return;

    // Validate One-to-One limit
    if (currentSession.learningServiceType === 'One-to-One' && allBookings.length >= 1) {
        alert('One-to-One sessions can only have 1 attendee. Please remove the existing attendee first.');
        return;
    }

    // Validate capacity
    const enrolled = allBookings.length;
    const maxCapacity = currentSession.maxCapacity || 0;
    if (enrolled >= maxCapacity) {
        alert('Session is at full capacity.');
        return;
    }

    // Validate inventory
    const inventory = calculateSlotInventory(selectedCustomer.id, selectedQuote.id);
    if (inventory.available <= 0) {
        alert('Customer has no available slots for this quote.');
        return;
    }

    // Create attendee enrollment
    const booking = {
        id: `booking_${Date.now()}`,
        sessionId: currentSession.id,
        customerId: selectedCustomer.id,
        customerName: selectedCustomer.name,
        attendeeName: selectedCustomer.name, // Can be different
        quoteId: selectedQuote.id,
        status: 'confirmed',
        bookedAt: new Date().toISOString(),
        paymentStatus: selectedQuote.paymentStatus
    };

    // Save attendee enrollment
    const stored = localStorage.getItem('fms_session_bookings');
    let allBookingsData = stored ? JSON.parse(stored) : [];
    allBookingsData.push(booking);
    localStorage.setItem('fms_session_bookings', JSON.stringify(allBookingsData));

    // Update session enrolled count
    currentSession.enrolled = allBookingsData.filter(b => b.sessionId === currentSession.id && b.status === 'confirmed').length;
    const sessionsStored = localStorage.getItem('fms_sessions');
    let sessions = sessionsStored ? JSON.parse(sessionsStored) : [];
    const sessionIndex = sessions.findIndex(s => s.id === currentSession.id);
    if (sessionIndex >= 0) {
        sessions[sessionIndex] = currentSession;
        localStorage.setItem('fms_sessions', JSON.stringify(sessions));
    }

    // Reload attendees and re-render
    loadBookings();
    renderEnrollment();
    renderAttendees();

    closeBookCustomerModal();
    alert('Attendee added successfully!');
}

function searchAttendees(query) {
    const lowerQuery = query.toLowerCase();
    const filtered = allBookings.filter(b =>
        (b.customerName && b.customerName.toLowerCase().includes(lowerQuery)) ||
        (b.attendeeName && b.attendeeName.toLowerCase().includes(lowerQuery)) ||
        b.quoteId.toLowerCase().includes(lowerQuery)
    );

    // Re-render with filtered results
    const attendeesList = document.getElementById('attendeesList');
    attendeesList.innerHTML = '';

    if (filtered.length === 0) {
        document.getElementById('emptyAttendeesState').classList.remove('hidden');
        return;
    }

    document.getElementById('emptyAttendeesState').classList.add('hidden');

    filtered.forEach(booking => {
        const customer = sampleCustomers.find(c => c.id === booking.customerId);
        const quote = customer?.quotes.find(q => q.id === booking.quoteId);
        const isTemporary = booking.isTemporary || false;

        const statusConfig = {
            confirmed: { text: 'Confirmed', class: 'bg-green-100 text-green-700' },
            cancelled: { text: 'Cancelled', class: 'bg-gray-100 text-gray-700' }
        };
        const status = statusConfig[booking.status] || statusConfig.confirmed;

        const attendeeCard = document.createElement('div');
        attendeeCard.className = 'border border-gray-200 rounded-lg p-3 hover:border-emerald-300 transition-colors';
        attendeeCard.innerHTML = `
            <div class="flex items-start justify-between mb-2">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                        <h4 class="font-semibold text-gray-900">${booking.attendeeName || booking.customerName}</h4>
                        <span class="px-2 py-0.5 text-xs rounded ${status.class}">${status.text}</span>
                        ${isTemporary ? '<span class="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">Temporary</span>' : ''}
                        ${getPaymentStatusBadge(quote?.paymentStatus)}
                    </div>
                    <div class="text-xs text-gray-500 space-y-0.5">
                        <div class="flex items-center gap-3">
                            <span>Customer: ${booking.customerName}</span>
                            <span>Quote: ${booking.quoteId || '-'}</span>
                        </div>
                        <div class="text-gray-500">Enrolled: ${formatDateTime(booking.bookedAt)}</div>
                        ${isTemporary && booking.originalServiceName ? `<div class="text-amber-600">From: ${booking.originalServiceName}</div>` : ''}
                    </div>
                </div>
            </div>
            <div class="flex gap-2 pt-2 border-t border-gray-100">
                <button onclick="viewCustomer('${booking.customerId}')" 
                    class="flex-1 px-3 py-1.5 text-xs font-medium text-gray-700 border border-gray-300 rounded-lg hover:bg-gray-50 flex items-center justify-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                    </svg>
                    View Customer
                </button>
                <button onclick="openTransferToSessionModal('${booking.id}')" 
                    class="flex-1 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-1">
                    <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                    </svg>
                    Transfer
                </button>
                <button onclick="cancelBooking('${booking.id}')" 
                    class="flex-1 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50">
                    Remove
                </button>
            </div>
        `;
        attendeesList.appendChild(attendeeCard);
    });
}

function cancelBooking(bookingId) {
    if (!confirm('Are you sure you want to remove this attendee?')) return;

    // Remove booking
    const stored = localStorage.getItem('fms_session_bookings');
    let allBookingsData = stored ? JSON.parse(stored) : [];
    allBookingsData = allBookingsData.filter(b => b.id !== bookingId);
    localStorage.setItem('fms_session_bookings', JSON.stringify(allBookingsData));

    // Update session enrolled count
    currentSession.enrolled = allBookingsData.filter(b => b.sessionId === currentSession.id && b.status === 'confirmed').length;
    const sessionsStored = localStorage.getItem('fms_sessions');
    let sessions = sessionsStored ? JSON.parse(sessionsStored) : [];
    const sessionIndex = sessions.findIndex(s => s.id === currentSession.id);
    if (sessionIndex >= 0) {
        sessions[sessionIndex] = currentSession;
        localStorage.setItem('fms_sessions', JSON.stringify(sessions));
    }

    // Reload and re-render
    loadBookings();
    renderEnrollment();
    renderAttendees();

    alert('Attendee removed successfully!');
}

function viewCustomer(customerId) {
    window.location.href = `../../Customer Management/customer-detail.html?id=${customerId}`;
}

// ===== NAVIGATION =====
function goBack() {
    window.location.href = 'session_list.html';
}

function viewLearningService(event) {
    if (event) event.preventDefault();
    if (currentSession && currentSession.learningServiceId) {
        window.location.href = `learning_service_detail.html?id=${currentSession.learningServiceId}`;
    }
}

function viewAllSessions() {
    if (currentSession && currentSession.learningServiceId) {
        window.location.href = `session_list.html?serviceId=${currentSession.learningServiceId}`;
    } else {
        window.location.href = 'session_list.html';
    }
}

function cancelSession() {
    if (!confirm('Are you sure you want to cancel this session? All attendees will be removed.')) return;

    currentSession.status = 'cancelled';

    // Save to localStorage
    const stored = localStorage.getItem('fms_sessions');
    let sessions = stored ? JSON.parse(stored) : [];
    const index = sessions.findIndex(s => s.id === currentSession.id);
    if (index >= 0) {
        sessions[index] = currentSession;
    } else {
        sessions.push(currentSession);
    }
    localStorage.setItem('fms_sessions', JSON.stringify(sessions));

    // Cancel all bookings
    const bookingsStored = localStorage.getItem('fms_session_bookings');
    let allBookingsData = bookingsStored ? JSON.parse(bookingsStored) : [];
    allBookingsData = allBookingsData.map(b => {
        if (b.sessionId === currentSession.id) {
            b.status = 'cancelled';
        }
        return b;
    });
    localStorage.setItem('fms_session_bookings', JSON.stringify(allBookingsData));

    renderSessionDetails();
    alert('Session cancelled successfully!');
}

// ===== HELPER FUNCTIONS =====
function formatDate(dateStr) {
    if (!dateStr) return '-';
    const date = new Date(dateStr + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

function formatTime(timeStr) {
    if (!timeStr) return '-';
    const [hours, minutes] = timeStr.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function formatDateTime(dateStr, timeStr = null) {
    if (!dateStr) return '-';
    const date = new Date(dateStr + (timeStr ? `T${timeStr}` : 'T00:00:00'));
    if (timeStr) {
        return date.toLocaleString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' });
    }
    return date.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
}

function formatDateForInput(date) {
    if (date instanceof Date) {
        return date.toISOString().split('T')[0];
    }
    return date;
}

// ===== TRANSFER TO SESSION =====
let attendeeToTransfer = null;
let selectedTargetLearningService = null;
let selectedTargetSession = null;
let allSessions = [];
let allLearningServices = [];

function openTransferToSessionModal(bookingId) {
    attendeeToTransfer = allBookings.find(b => b.id === bookingId);
    if (!attendeeToTransfer) return;

    const customer = sampleCustomers.find(c => c.id === attendeeToTransfer.customerId);
    const attendeeName = attendeeToTransfer.attendeeName || attendeeToTransfer.customerName;
    const initials = attendeeName.split(' ').map(n => n[0]).join('').toUpperCase().substring(0, 2);

    document.getElementById('transferSessionAttendeeInitials').textContent = initials;
    document.getElementById('transferSessionAttendeeName').textContent = attendeeName;
    document.getElementById('transferSessionAttendeeCustomer').textContent = `Customer: ${customer?.name || '-'}`;
    document.getElementById('transferSessionAttendeeService').textContent = `Current Service: ${currentSession.learningServiceName || '-'}`;

    // Load all learning services and sessions
    loadAllLearningServices();
    loadAllSessions();

    // Clear previous selections
    selectedTargetLearningService = null;
    selectedTargetSession = null;
    document.getElementById('transferLearningServiceSearch').value = '';
    document.getElementById('transferSessionSearch').value = '';
    document.getElementById('transferSessionReason').value = '';
    document.getElementById('transferSelectedLearningService').classList.add('hidden');
    document.getElementById('transferSelectedSession').classList.add('hidden');
    document.getElementById('transferSessionSelectionSection').classList.add('hidden');
    document.getElementById('transferLearningServiceAutocomplete').classList.add('hidden');
    document.getElementById('transferSessionAutocomplete').classList.add('hidden');
    document.getElementById('confirmTransferToSessionBtn').disabled = true;

    document.getElementById('transferToSessionModal').classList.remove('hidden');

    // Show recommended learning services immediately
    showRecommendedLearningServices();
}

function closeTransferToSessionModal() {
    document.getElementById('transferToSessionModal').classList.add('hidden');
    attendeeToTransfer = null;
    selectedTargetLearningService = null;
    selectedTargetSession = null;
}

function loadAllLearningServices() {
    const stored = localStorage.getItem('fms_learning_services');
    allLearningServices = stored ? JSON.parse(stored) : [];

    // If no services in storage, use sample data
    if (allLearningServices.length === 0) {
        allLearningServices = getSampleLearningServices();
    }
}

function loadAllSessions() {
    const stored = localStorage.getItem('fms_sessions');
    allSessions = stored ? JSON.parse(stored) : [];

    // If no sessions in storage, use sample data
    if (allSessions.length === 0) {
        // Get sample sessions from session_list_script.js pattern
        const today = new Date();
        const tomorrow = new Date(today);
        tomorrow.setDate(tomorrow.getDate() + 1);
        const nextWeek = new Date(today);
        nextWeek.setDate(nextWeek.getDate() + 7);

        allSessions = [
            {
                id: 'session_001',
                learningServiceId: 'ls_001',
                learningServiceName: 'AP Calculus AB',
                learningServiceType: 'Class',
                date: formatDateForInput(tomorrow),
                startTime: '15:00',
                endTime: '16:30',
                duration: 90,
                status: 'scheduled',
                maxCapacity: 20,
                enrolled: 17
            },
            {
                id: 'session_002',
                learningServiceId: 'ls_002',
                learningServiceName: 'SAT Math Prep Group',
                learningServiceType: 'Group',
                date: formatDateForInput(nextWeek),
                startTime: '17:00',
                endTime: '18:30',
                duration: 90,
                status: 'scheduled',
                maxCapacity: 6,
                enrolled: 4
            }
        ];
    }
}

// Step 1: Learning Service Selection
function showRecommendedLearningServices() {
    // Show all available learning services as recommendations (excluding current one)
    const recommended = allLearningServices.filter(service => {
        return service.id !== currentSession.learningServiceId;
    });

    if (recommended.length > 0) {
        renderLearningServiceAutocomplete(recommended);
    }
}

function searchLearningServicesForTransfer(query) {
    const autocomplete = document.getElementById('transferLearningServiceAutocomplete');

    // If query is empty, show recommendations
    if (!query || query.trim().length === 0) {
        showRecommendedLearningServices();
        return;
    }

    // Allow search with just 1 character for better UX
    if (query.length < 1) {
        autocomplete.classList.add('hidden');
        return;
    }

    const lowerQuery = query.toLowerCase();
    const matching = allLearningServices.filter(service => {
        // Exclude current learning service
        if (service.id === currentSession.learningServiceId) return false;

        return service.name.toLowerCase().includes(lowerQuery) ||
            service.type.toLowerCase().includes(lowerQuery);
    });

    renderLearningServiceAutocomplete(matching);
}

function renderLearningServiceAutocomplete(services) {
    const autocomplete = document.getElementById('transferLearningServiceAutocomplete');
    autocomplete.innerHTML = '';

    if (services.length === 0) {
        autocomplete.innerHTML = '<div class="p-3 text-sm text-gray-500">No learning services found</div>';
        autocomplete.classList.remove('hidden');
        return;
    }

    services.forEach(service => {
        const div = document.createElement('div');
        div.className = 'p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0';
        div.onclick = () => selectTargetLearningService(service);

        const typeStyles = {
            'Class': { icon: '📚', color: 'bg-purple-100 text-purple-700' },
            'Group': { icon: '👥', color: 'bg-amber-100 text-amber-700' },
            'One-to-One': { icon: '👤', color: 'bg-cyan-100 text-cyan-700' }
        };
        const style = typeStyles[service.type] || typeStyles['Class'];

        div.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="text-sm">${style.icon}</span>
                        <p class="font-medium text-gray-900">${service.name}</p>
                        <span class="px-2 py-0.5 text-xs font-medium rounded-full ${style.color}">${service.type}</span>
                    </div>
                    <p class="text-xs text-gray-500">Capacity: ${service.maxCapacity || '-'}</p>
                </div>
            </div>
        `;

        autocomplete.appendChild(div);
    });

    autocomplete.classList.remove('hidden');
}

function selectTargetLearningService(service) {
    selectedTargetLearningService = service;

    // Update display
    document.getElementById('transferLearningServiceName').textContent = service.name;
    document.getElementById('transferLearningServiceType').textContent = service.type;
    document.getElementById('transferSelectedLearningService').classList.remove('hidden');
    document.getElementById('transferLearningServiceAutocomplete').classList.add('hidden');
    document.getElementById('transferLearningServiceSearch').value = service.name;

    // Show step 2 (session selection)
    document.getElementById('transferSessionSelectionSection').classList.remove('hidden');

    // Clear any previous session selection
    selectedTargetSession = null;
    document.getElementById('transferSessionSearch').value = '';
    document.getElementById('transferSelectedSession').classList.add('hidden');

    updateTransferToSessionButtonState();
}

function clearTransferLearningServiceSelection() {
    selectedTargetLearningService = null;
    selectedTargetSession = null;
    document.getElementById('transferSelectedLearningService').classList.add('hidden');
    document.getElementById('transferSessionSelectionSection').classList.add('hidden');
    document.getElementById('transferSelectedSession').classList.add('hidden');
    document.getElementById('transferLearningServiceSearch').value = '';
    document.getElementById('transferSessionSearch').value = '';
    updateTransferToSessionButtonState();
}

// Step 2: Session Selection (filtered by selected learning service)
function searchSessionsForTransfer(query) {
    const autocomplete = document.getElementById('transferSessionAutocomplete');

    // Must have a learning service selected first
    if (!selectedTargetLearningService) {
        autocomplete.classList.add('hidden');
        return;
    }

    if (!query || query.length < 1) {
        // Show all sessions for the selected learning service
        const sessionsForService = allSessions.filter(session => {
            return session.learningServiceId === selectedTargetLearningService.id &&
                session.id !== currentSession.id;
        });
        renderSessionAutocomplete(sessionsForService);
        return;
    }

    const lowerQuery = query.toLowerCase();
    const matching = allSessions.filter(session => {
        // Must be from selected learning service and not current session
        if (session.learningServiceId !== selectedTargetLearningService.id) return false;
        if (session.id === currentSession.id) return false;

        // Filter by date or time
        const dateStr = formatDate(session.date);
        const timeStr = `${formatTime(session.startTime)} - ${formatTime(session.endTime)}`;
        return dateStr.toLowerCase().includes(lowerQuery) ||
            timeStr.toLowerCase().includes(lowerQuery);
    });

    renderSessionAutocomplete(matching);
}

function getSessionTemporalStatus(sessionDate, sessionStartTime) {
    const now = new Date();
    const sessionDateTime = new Date(sessionDate + 'T' + sessionStartTime);

    // Calculate time difference in hours
    const diffMs = sessionDateTime - now;
    const diffHours = diffMs / (1000 * 60 * 60);

    if (diffHours < -2) {
        // More than 2 hours in the past
        return { status: 'past', label: 'Past', color: 'bg-gray-100 text-gray-600', icon: '⏮️' };
    } else if (diffHours >= -2 && diffHours <= 2) {
        // Within 2 hours (present)
        return { status: 'present', label: 'Now', color: 'bg-green-100 text-green-700', icon: '▶️' };
    } else {
        // Future
        return { status: 'future', label: 'Future', color: 'bg-blue-100 text-blue-700', icon: '⏭️' };
    }
}

function renderSessionAutocomplete(sessions) {
    const autocomplete = document.getElementById('transferSessionAutocomplete');
    autocomplete.innerHTML = '';

    if (sessions.length === 0) {
        autocomplete.innerHTML = '<div class="p-3 text-sm text-gray-500">No sessions found for this learning service</div>';
        autocomplete.classList.remove('hidden');
        return;
    }

    // Sort sessions by date and time
    sessions.sort((a, b) => {
        const dateA = new Date(a.date + 'T' + a.startTime);
        const dateB = new Date(b.date + 'T' + b.startTime);
        return dateA - dateB;
    });

    sessions.forEach(session => {
        const div = document.createElement('div');
        div.className = 'p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0';
        div.onclick = () => selectTargetSession(session);

        const enrollment = `${session.enrolled || 0}/${session.maxCapacity || 0}`;
        const temporal = getSessionTemporalStatus(session.date, session.startTime);

        div.innerHTML = `
            <div class="flex items-start justify-between">
                <div class="flex-1">
                    <div class="flex items-center gap-2 mb-1">
                        <p class="font-medium text-gray-900">${formatDate(session.date)}</p>
                        <span class="px-2 py-0.5 text-xs font-medium rounded-full ${temporal.color}">
                            ${temporal.icon} ${temporal.label}
                        </span>
                    </div>
                    <p class="text-xs text-gray-600">${formatTime(session.startTime)} - ${formatTime(session.endTime)}</p>
                    <p class="text-xs text-gray-500 mt-1">Enrollment: ${enrollment}</p>
                </div>
            </div>
        `;

        autocomplete.appendChild(div);
    });

    autocomplete.classList.remove('hidden');
}

function selectTargetSession(session) {
    selectedTargetSession = session;

    const temporal = getSessionTemporalStatus(session.date, session.startTime);

    document.getElementById('transferSessionName').textContent = selectedTargetLearningService.name;
    document.getElementById('transferSessionDate').textContent = `${formatDate(session.date)} (${temporal.label})`;
    document.getElementById('transferSessionTime').textContent = `${formatTime(session.startTime)} - ${formatTime(session.endTime)}`;

    document.getElementById('transferSelectedSession').classList.remove('hidden');
    document.getElementById('transferSessionAutocomplete').classList.add('hidden');
    document.getElementById('transferSessionSearch').value = `${formatDate(session.date)} - ${formatTime(session.startTime)}`;

    updateTransferToSessionButtonState();
}

function clearTransferSessionSelection() {
    selectedTargetSession = null;
    document.getElementById('transferSelectedSession').classList.add('hidden');
    document.getElementById('transferSessionSearch').value = '';
    updateTransferToSessionButtonState();
}

function updateTransferToSessionButtonState() {
    const btn = document.getElementById('confirmTransferToSessionBtn');
    btn.disabled = !selectedTargetLearningService || !selectedTargetSession;
}

function confirmTransferToSession() {
    if (!attendeeToTransfer || !selectedTargetSession) return;

    // Check if target session has capacity
    const targetSessionBookings = allBookings.filter(b => b.sessionId === selectedTargetSession.id && b.status === 'confirmed');
    if (selectedTargetSession.maxCapacity && targetSessionBookings.length >= selectedTargetSession.maxCapacity) {
        alert('Target session is at full capacity.');
        return;
    }

    // Check One-to-One limit
    if (selectedTargetSession.learningServiceType === 'One-to-One' && targetSessionBookings.length >= 1) {
        alert('One-to-One sessions can only have 1 attendee.');
        return;
    }

    // Create temporary attendee in target session
    const temporaryBooking = {
        id: `booking_temp_${Date.now()}`,
        sessionId: selectedTargetSession.id,
        customerId: attendeeToTransfer.customerId,
        customerName: attendeeToTransfer.customerName,
        attendeeName: attendeeToTransfer.attendeeName || attendeeToTransfer.customerName,
        quoteId: attendeeToTransfer.quoteId,
        status: 'confirmed',
        bookedAt: new Date().toISOString(),
        paymentStatus: attendeeToTransfer.paymentStatus,
        isTemporary: true,
        originalServiceId: currentSession.learningServiceId,
        originalServiceName: currentSession.learningServiceName,
        originalSessionId: currentSession.id,
        transferReason: document.getElementById('transferSessionReason').value || ''
    };

    // Save to localStorage
    const stored = localStorage.getItem('fms_session_bookings');
    let allBookingsData = stored ? JSON.parse(stored) : [];
    allBookingsData.push(temporaryBooking);
    localStorage.setItem('fms_session_bookings', JSON.stringify(allBookingsData));

    // Update target session enrolled count
    const sessionsStored = localStorage.getItem('fms_sessions');
    let sessions = sessionsStored ? JSON.parse(sessionsStored) : [];
    const targetIndex = sessions.findIndex(s => s.id === selectedTargetSession.id);
    if (targetIndex >= 0) {
        const targetBookings = allBookingsData.filter(b => b.sessionId === selectedTargetSession.id && b.status === 'confirmed');
        sessions[targetIndex].enrolled = targetBookings.length;
        localStorage.setItem('fms_sessions', JSON.stringify(sessions));
    }

    closeTransferToSessionModal();
    alert(`Attendee transferred to ${selectedTargetLearningService.name} session on ${formatDate(selectedTargetSession.date)}. They are marked as temporary.`);
}

// Event listeners
document.addEventListener('click', function (e) {
    // Close autocomplete when clicking outside
    if (!e.target.closest('#overrideAssignmentSearch') && !e.target.closest('#overrideAssignmentAutocomplete')) {
        document.getElementById('overrideAssignmentAutocomplete').classList.add('hidden');
    }
    if (!e.target.closest('#customerSearchInput') && !e.target.closest('#customerAutocomplete')) {
        document.getElementById('customerAutocomplete').classList.add('hidden');
    }
    if (!e.target.closest('#transferLearningServiceSearch') && !e.target.closest('#transferLearningServiceAutocomplete')) {
        document.getElementById('transferLearningServiceAutocomplete')?.classList.add('hidden');
    }
    if (!e.target.closest('#transferSessionSearch') && !e.target.closest('#transferSessionAutocomplete')) {
        document.getElementById('transferSessionAutocomplete').classList.add('hidden');
    }
});

// Override assignment search
document.getElementById('overrideAssignmentSearch')?.addEventListener('input', function (e) {
    searchOverrideAssignments(e.target.value);
});


// Class Detail Script
// Handles display and interactions for class detail view

// Current class data
let currentClass = null;
let classIdFromUrl = null; // Store class ID from URL

// Initialize page
document.addEventListener('DOMContentLoaded', function () {
    loadClassData();
});

function loadClassData() {
    const urlParams = new URLSearchParams(window.location.search);
    const classId = urlParams.get('id');

    // Store class ID from URL for use in getClassId()
    classIdFromUrl = classId;

    if (!classId) {
        // Hide content and show error message
        hidePageContent();
        showPageError('Class ID is required. Redirecting to class list...');
        setTimeout(() => {
            window.location.href = 'class_list.html';
        }, 2000);
        return;
    }

    // Load from localStorage
    try {
        // Initialize sample data if needed (same as class_list)
        const stored = localStorage.getItem('classes_v2');
        let classes = [];
        if (stored) {
            classes = JSON.parse(stored);
        } else {
            // If no data, try to initialize with sample data
            // This matches the pattern from class_list_script.js
            classes = [];
        }

        currentClass = classes.find(c => c.id === classId);

        if (!currentClass) {
            hidePageContent();
            showPageError('Class not found. Redirecting to class list...');
            setTimeout(() => {
                window.location.href = 'class_list.html';
            }, 2000);
            return;
        }

        // Initialize sample bookings if needed
        initializeSampleBookings();

        // Show content and render
        showPageContent();
        renderClassDetails();
        loadSessions();
        loadEnrollmentData();
    } catch (error) {
        console.error('Error loading class:', error);
        hidePageContent();
        showPageError('Error loading class data');
    }
}

function hidePageContent() {
    const mainContent = document.querySelector('.max-w-7xl');
    if (mainContent) {
        mainContent.style.display = 'none';
    }
}

function showPageContent() {
    const mainContent = document.querySelector('.max-w-7xl');
    if (mainContent) {
        mainContent.style.display = 'block';
    }
    const errorDiv = document.getElementById('pageError');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function showPageError(message) {
    // Remove existing error if any
    const existingError = document.getElementById('pageError');
    if (existingError) {
        existingError.remove();
    }

    // Create error message
    const errorDiv = document.createElement('div');
    errorDiv.id = 'pageError';
    errorDiv.className = 'fixed inset-0 flex items-center justify-center bg-gray-50 z-50';
    errorDiv.innerHTML = `
        <div class="bg-white rounded-lg shadow-lg p-6 max-w-md text-center">
            <div class="text-red-500 mb-4">
                <svg class="w-16 h-16 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                </svg>
            </div>
            <h2 class="text-xl font-semibold text-gray-900 mb-2">Error</h2>
            <p class="text-gray-600 mb-4">${message}</p>
            <button 
                onclick="window.location.href='class_list.html'"
                class="px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700"
            >
                Go to Class List
            </button>
        </div>
    `;
    document.body.appendChild(errorDiv);
}

function renderClassDetails() {
    // Update header
    document.getElementById('classNameHeader').textContent = currentClass.name || 'Class Details';
    document.getElementById('classIdBadge').textContent = currentClass.id;
    updateStatusBadge();

    // Basic Information - Now populate input fields
    document.getElementById('className').value = currentClass.name || '';
    document.getElementById('description').value = currentClass.description || '';
    document.getElementById('skillLevel').value = currentClass.skillLevel || '';
    document.getElementById('status').value = currentClass.status || 'active';

    // Price Book Item - Update container to show selected item
    if (currentClass.pricebookItem) {
        updatePricebookDisplay(currentClass.pricebookItem);
    }

    // Schedule - Populate form fields
    if (currentClass.schedule) {
        const schedule = currentClass.schedule;
        document.getElementById('frequency').value = schedule.frequency || 'weekly';

        // Set selected days
        if (schedule.daysOfWeek && schedule.daysOfWeek.length > 0) {
            // Clear all day selections first
            document.querySelectorAll('.day-selector').forEach(btn => {
                btn.classList.remove('selected', 'bg-emerald-500', 'text-white');
                btn.classList.add('border-gray-300');
            });
            // Select the days from schedule
            schedule.daysOfWeek.forEach(day => {
                const btn = document.querySelector(`.day-selector[data-day="${day}"]`);
                if (btn) {
                    btn.classList.add('selected', 'bg-emerald-500', 'text-white');
                    btn.classList.remove('border-gray-300');
                }
            });
        }

        document.getElementById('startTime').value = schedule.startTime || '';
        document.getElementById('endTime').value = schedule.endTime || '';
        document.getElementById('duration').value = schedule.duration || '';
        document.getElementById('startDate').value = schedule.startDate || '';
        document.getElementById('endDate').value = schedule.endDate || '';
    }

    // Default Staff - Handled by unified assignment logic in loadStaffList


    // Capacity - Populate input field
    document.getElementById('maxCapacity').value = currentClass.maxCapacity || '';

    // Update summary
    updateSummary();
}

function updateStatusBadge() {
    const badge = document.getElementById('classStatusBadge');
    const status = currentClass.status || 'active';

    const statusConfig = {
        active: { text: 'Active', class: 'bg-green-100 text-green-700' },
        paused: { text: 'Paused', class: 'bg-yellow-100 text-yellow-700' },
        archived: { text: 'Archived', class: 'bg-gray-100 text-gray-700' }
    };

    const config = statusConfig[status] || statusConfig.active;
    badge.textContent = config.text;
    badge.className = `px-2 py-1 text-xs rounded ${config.class}`;
}

function updateStatusDisplay() {
    const status = currentClass.status || 'active';
    const statusEl = document.getElementById('displayStatus');

    const statusConfig = {
        active: { text: 'Active', class: 'bg-green-100 text-green-700' },
        paused: { text: 'Paused', class: 'bg-yellow-100 text-yellow-700' },
        archived: { text: 'Archived', class: 'bg-gray-100 text-gray-700' }
    };

    const config = statusConfig[status] || statusConfig.active;
    statusEl.textContent = config.text;
    statusEl.className = `inline-block px-2 py-1 text-xs rounded ${config.class}`;
}

function updatePricebookDisplay(pricebookItem) {
    const container = document.getElementById('pricebookItemContainer');
    if (!pricebookItem) return;

    container.innerHTML = `
        <div class="p-4 bg-emerald-50 border border-emerald-200 rounded-lg relative">
            <button onclick="showPricebookModal()" class="absolute top-2 right-2 p-2 text-emerald-700 hover:bg-emerald-100 rounded">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z"></path>
                </svg>
            </button>
            <div class="flex items-start justify-between pr-8">
                <div class="flex-1">
                    <h4 class="font-semibold text-emerald-900">${pricebookItem.name}</h4>
                    <p class="text-sm text-emerald-700 mt-1">${pricebookItem.description || ''}</p>
                    <div class="flex items-center gap-2 mt-2">
                        <span class="px-2 py-1 text-xs bg-emerald-200 text-emerald-800 rounded">${pricebookItem.tag || 'General'}</span>
                        <span class="text-sm font-semibold text-emerald-900">$${pricebookItem.price?.toFixed(2) || '0.00'}</span>
                    </div>
                </div>
            </div>
        </div>
    `;
}



function formatDate(dateString) {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return date.toLocaleDateString('en-AU', { day: 'numeric', month: 'short', year: 'numeric' });
}

function updateSummary() {
    // Pricebook
    const pricebookEl = document.getElementById('summaryPricebookItem');
    if (currentClass.pricebookItem) {
        pricebookEl.textContent = currentClass.pricebookItem.name;
    } else {
        pricebookEl.textContent = '-';
    }

    // Capacity
    document.getElementById('summaryCapacity').textContent = currentClass.maxCapacity || '-';

    // Staff
    const staffCount = currentClass.defaultStaff?.length || 0;
    document.getElementById('summaryStaff').textContent = `${staffCount} staff`;

    // Sessions (will be updated when sessions load)
    // Enrollment (will be updated when enrollment loads)
}

// ==================== Tab Switching ====================

function switchTab(tabName, event) {
    // Prevent default if event is provided
    if (event) {
        event.preventDefault();
    }

    // Hide all tab contents with fade effect
    document.querySelectorAll('.tab-content').forEach(content => {
        content.style.opacity = '0';
        setTimeout(() => {
            content.classList.add('hidden');
        }, 150);
    });

    // Remove active class from all tab buttons
    document.querySelectorAll('.tab-button').forEach(button => {
        button.classList.remove('active', 'border-emerald-500', 'text-emerald-600');
        button.classList.add('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
    });

    // Show selected tab content with fade effect
    setTimeout(() => {
        const selectedContent = document.getElementById(tabName + 'Content');
        if (selectedContent) {
            selectedContent.classList.remove('hidden');
            selectedContent.style.opacity = '0';
            setTimeout(() => {
                selectedContent.style.opacity = '1';
                selectedContent.style.transition = 'opacity 0.3s ease-in-out';
            }, 10);
        }

        // Add active class to selected tab button
        const selectedButton = document.getElementById(tabName + 'Tab');
        if (selectedButton) {
            selectedButton.classList.add('active', 'border-emerald-500', 'text-emerald-600');
            selectedButton.classList.remove('border-transparent', 'text-gray-500', 'hover:text-gray-700', 'hover:border-gray-300');
        }

        // Load data for specific tabs
        if (tabName === 'sessions') {
            loadSessions();
        } else if (tabName === 'enrollment') {
            loadEnrollmentData();
        } else if (tabName === 'staff') {
            loadStaffList();
        }
    }, 150);
}

// ==================== Sessions Management ====================

function loadSessions() {
    try {
        const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        const classSessions = sessions.filter(s => s.classId === currentClass.id);

        renderSessionsList(classSessions);
        updateSessionsSummary(classSessions);
    } catch (error) {
        console.error('Error loading sessions:', error);
    }
}

function renderSessionsList(sessions) {
    const container = document.getElementById('sessionsListContainer');
    const emptyState = document.getElementById('emptySessionsState');

    if (sessions.length === 0) {
        container.classList.add('hidden');
        emptyState.classList.remove('hidden');
        return;
    }

    container.classList.remove('hidden');
    emptyState.classList.add('hidden');

    // Sort by date
    sessions.sort((a, b) => new Date(a.date) - new Date(b.date));

    container.innerHTML = sessions.map(session => {
        const date = formatDate(session.date);
        const time = session.startTime && session.endTime
            ? `${session.startTime} - ${session.endTime}`
            : session.startTime || '-';

        const confirmedSlots = session.confirmedSlots || 0;
        const capacity = currentClass.maxCapacity || 0;
        const enrollmentPercent = capacity > 0 ? Math.round((confirmedSlots / capacity) * 100) : 0;

        const statusConfig = {
            scheduled: { text: 'Scheduled', class: 'bg-blue-100 text-blue-700' },
            in_progress: { text: 'In Progress', class: 'bg-green-100 text-green-700' },
            completed: { text: 'Completed', class: 'bg-gray-100 text-gray-700' },
            cancelled: { text: 'Cancelled', class: 'bg-red-100 text-red-700' }
        };

        const status = statusConfig[session.status] || statusConfig.scheduled;

        return `
            <div class="border border-gray-200 rounded-lg p-4 hover:border-emerald-300 hover:shadow-md transition-all">
                <div class="flex items-start justify-between mb-3">
                    <div class="flex-1">
                        <div class="flex items-center gap-3 mb-2">
                            <h3 class="text-lg font-semibold text-gray-900">${session.id || 'SESSION'}</h3>
                            <span class="px-2 py-1 text-xs rounded ${status.class}">${status.text}</span>
                        </div>
                        <div class="flex items-center gap-4 text-sm text-gray-500">
                            <div class="flex items-center gap-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                                </svg>
                                <span>${date} at ${time}</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                                </svg>
                                <span>${confirmedSlots}/${capacity} slots</span>
                            </div>
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-2xl font-bold text-gray-900">${enrollmentPercent}%</div>
                        <div class="text-xs text-gray-500 mt-1">Enrollment</div>
                    </div>
                </div>
                
                <div class="flex items-center justify-between pt-3 border-t border-gray-100">
                    <div class="flex items-center gap-2">
                        <span class="text-xs text-gray-600">Staff:</span>
                        <div class="flex -space-x-2">
                            ${(session.assignedStaff || []).slice(0, 3).map((staff, idx) => {
            const colors = ['bg-blue-500', 'bg-purple-500', 'bg-green-500'];
            const initials = staff.name.split(' ').map(n => n[0]).join('');
            return `
                                    <div class="w-7 h-7 ${colors[idx % 3]} rounded-full border-2 border-white flex items-center justify-center text-white text-xs font-bold" title="${staff.name}">
                                        ${initials}
                                    </div>
                                `;
        }).join('')}
                            ${(session.assignedStaff || []).length === 0 ? '<span class="text-xs text-gray-400">Unassigned</span>' : ''}
                        </div>
                    </div>
                    <div class="flex gap-2">
                        <button 
                            onclick="window.location.href='session_detail.html?id=${session.id}'"
                            class="px-3 py-1.5 text-xs font-medium text-emerald-600 hover:bg-emerald-50 rounded-lg transition-colors"
                        >
                            View Details
                        </button>
                    </div>
                </div>
            </div>
        `;
    }).join('');
}

function updateSessionsSummary(sessions) {
    document.getElementById('summarySessions').textContent = sessions.length;

    // Calculate average enrollment
    if (sessions.length > 0) {
        const capacity = currentClass.maxCapacity || 0;
        const totalEnrollment = sessions.reduce((sum, s) => sum + (s.confirmedSlots || 0), 0);
        const avgEnrollment = capacity > 0 ? Math.round((totalEnrollment / sessions.length / capacity) * 100) : 0;
        document.getElementById('summaryEnrollment').textContent = `${avgEnrollment}%`;
    } else {
        document.getElementById('summaryEnrollment').textContent = '-';
    }
}

// ==================== Enrollment Management ====================
// (loadEnrollmentData function is defined in Booking Management section above)

// ==================== Booking Management ====================

// Initialize sample bookings for sessions
function initializeSampleBookings() {
    try {
        let allSessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        let classSessions = allSessions.filter(s => s.classId === currentClass.id);

        // If no sessions exist for this class, create some sample sessions
        if (classSessions.length === 0) {
            const today = new Date();
            const schedule = currentClass.schedule || {};
            const daysOfWeek = schedule.daysOfWeek || ['Monday', 'Wednesday', 'Friday'];
            const startTime = schedule.startTime || '14:00';
            const endTime = schedule.endTime || '15:00';
            const duration = schedule.duration || 60;
            const maxCapacity = currentClass.maxCapacity || 20;

            // Create 3 sample sessions for the next 2 weeks
            for (let i = 0; i < 3; i++) {
                const sessionDate = new Date(today);
                sessionDate.setDate(today.getDate() + (i * 7)); // One week apart

                const sessionId = `SESSION-${currentClass.id}-${sessionDate.toISOString().split('T')[0]}`;
                const newSession = {
                    id: sessionId,
                    classId: currentClass.id,
                    date: sessionDate.toISOString().split('T')[0],
                    startTime: startTime,
                    endTime: endTime,
                    duration: duration,
                    status: 'scheduled',
                    maxCapacity: maxCapacity,
                    confirmedSlots: 0,
                    assignedStaff: currentClass.defaultStaff || [],
                    bookings: [],
                    notes: '',
                    createdAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };

                allSessions.push(newSession);
                classSessions.push(newSession);
            }

            localStorage.setItem('class_sessions_v2', JSON.stringify(allSessions));
        }

        // If no sessions have bookings, add sample bookings
        const hasBookings = classSessions.some(s => s.bookings && s.bookings.length > 0);

        if (!hasBookings && classSessions.length > 0) {
            // Add sample bookings to first few sessions
            const sessionsToUpdate = classSessions.slice(0, Math.min(3, classSessions.length));

            sessionsToUpdate.forEach((session, index) => {
                if (!session.bookings) {
                    session.bookings = [];
                }

                // Add different bookings based on index
                if (index === 0) {
                    // First session: Sarah Johnson (confirmed)
                    session.bookings.push({
                        id: `BOOKING-${session.id}-001`,
                        customerId: 'CUST-001',
                        customerName: 'Sarah Johnson',
                        customerEmail: 'sarah.j@email.com',
                        quoteId: 'Q-2025-001',
                        slotsUsed: 2,
                        status: 'confirmed',
                        bookedAt: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString() // 5 days ago
                    });
                    session.confirmedSlots = (session.confirmedSlots || 0) + 2;
                } else if (index === 1) {
                    // Second session: Michael Chen (confirmed) and Emma Wilson (confirmed)
                    session.bookings.push({
                        id: `BOOKING-${session.id}-002`,
                        customerId: 'CUST-002',
                        customerName: 'Michael Chen',
                        customerEmail: 'm.chen@email.com',
                        quoteId: 'Q-2025-003',
                        slotsUsed: 1,
                        status: 'confirmed',
                        bookedAt: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
                    });
                    session.bookings.push({
                        id: `BOOKING-${session.id}-003`,
                        customerId: 'CUST-003',
                        customerName: 'Emma Wilson',
                        customerEmail: 'emma.w@email.com',
                        quoteId: 'Q-2025-004',
                        slotsUsed: 1,
                        status: 'confirmed',
                        bookedAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
                    });
                    session.confirmedSlots = (session.confirmedSlots || 0) + 2;
                } else if (index === 2) {
                    // Third session: Sarah Johnson again (confirmed)
                    session.bookings.push({
                        id: `BOOKING-${session.id}-004`,
                        customerId: 'CUST-001',
                        customerName: 'Sarah Johnson',
                        customerEmail: 'sarah.j@email.com',
                        quoteId: 'Q-2025-002',
                        slotsUsed: 1,
                        status: 'confirmed',
                        bookedAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString() // 2 days ago
                    });
                    session.confirmedSlots = (session.confirmedSlots || 0) + 1;
                }

                session.updatedAt = new Date().toISOString();

                // Update session in localStorage
                const sessionIndex = allSessions.findIndex(s => s.id === session.id);
                if (sessionIndex > -1) {
                    allSessions[sessionIndex] = session;
                } else {
                    allSessions.push(session);
                }
            });

            localStorage.setItem('class_sessions_v2', JSON.stringify(allSessions));
        }
    } catch (error) {
        console.error('Error initializing sample bookings:', error);
    }
}

// Sample customers (in real app, from API/localStorage)
const sampleCustomers = [
    {
        id: 'CUST-001',
        name: 'Sarah Johnson',
        email: 'sarah.j@email.com',
        phone: '+61 400 123 456',
        quotes: [
            { id: 'Q-2025-001', pricebookItemId: 'PB-YOGA-AEROBIC', slots: 5, total: 100.00, status: 'approved', paymentStatus: 'paid', amountPaid: 100.00 },
            { id: 'Q-2025-002', pricebookItemId: 'PB-YOGA-AEROBIC', slots: 3, total: 60.00, status: 'approved', paymentStatus: 'partial', amountPaid: 30.00 },
            { id: 'Q-2025-010', pricebookItemId: 'PB-YOGA-CLASS', slots: 4, total: 200.00, status: 'approved', paymentStatus: 'paid', amountPaid: 200.00 }
        ]
    },
    {
        id: 'CUST-002',
        name: 'Michael Chen',
        email: 'm.chen@email.com',
        phone: '+61 400 234 567',
        quotes: [
            { id: 'Q-2025-003', pricebookItemId: 'PB-MATH-TUTORING', slots: 10, total: 500.00, status: 'approved', paymentStatus: 'paid', amountPaid: 500.00 },
            { id: 'Q-2025-011', pricebookItemId: 'PB-ALGEBRA-II', slots: 6, total: 1080.00, status: 'approved', paymentStatus: 'partial', amountPaid: 540.00 }
        ]
    },
    {
        id: 'CUST-003',
        name: 'Emma Wilson',
        email: 'emma.w@email.com',
        phone: '+61 400 345 678',
        quotes: [
            { id: 'Q-2025-004', pricebookItemId: 'PB-YOGA-AEROBIC', slots: 2, total: 40.00, status: 'approved', paymentStatus: 'unpaid', amountPaid: 0 },
            { id: 'Q-2025-012', pricebookItemId: 'PB-YOGA-CLASS', slots: 3, total: 150.00, status: 'approved', paymentStatus: 'paid', amountPaid: 150.00 }
        ]
    },
    {
        id: 'CUST-004',
        name: 'David Thompson',
        email: 'david.t@email.com',
        phone: '+61 400 456 789',
        quotes: [
            { id: 'Q-2025-005', pricebookItemId: 'PB-MATH-TUTORING', slots: 8, total: 960.00, status: 'approved', paymentStatus: 'paid', amountPaid: 960.00 },
            { id: 'Q-2025-013', pricebookItemId: 'PB-PHYSICS-WORKSHOP', slots: 5, total: 1000.00, status: 'approved', paymentStatus: 'partial', amountPaid: 500.00 }
        ]
    },
    {
        id: 'CUST-005',
        name: 'Lisa Anderson',
        email: 'lisa.a@email.com',
        phone: '+61 400 567 890',
        quotes: [
            { id: 'Q-2025-006', pricebookItemId: 'PB-YOGA-CLASS', slots: 6, total: 300.00, status: 'approved', paymentStatus: 'paid', amountPaid: 300.00 },
            { id: 'Q-2025-014', pricebookItemId: 'PB-WELLNESS-PASS', slots: 10, total: 350.00, status: 'approved', paymentStatus: 'paid', amountPaid: 350.00 }
        ]
    },
    {
        id: 'CUST-006',
        name: 'James Martinez',
        email: 'james.m@email.com',
        phone: '+61 400 678 901',
        quotes: [
            { id: 'Q-2025-007', pricebookItemId: 'PB-GUITAR-SESSION', slots: 4, total: 180.00, status: 'approved', paymentStatus: 'paid', amountPaid: 180.00 },
            { id: 'Q-2025-015', pricebookItemId: 'PB-GUITAR-SESSION', slots: 2, total: 90.00, status: 'approved', paymentStatus: 'unpaid', amountPaid: 0 }
        ]
    },
    {
        id: 'CUST-007',
        name: 'Miss A',
        email: 'missa@email.com',
        phone: '+61 400 789 012',
        quotes: [
            { id: 'Q-2025-008', pricebookItemId: 'PB-YOGA-CLASS', slots: 2, total: 100.00, status: 'approved', paymentStatus: 'paid', amountPaid: 100.00 },
            { id: 'Q-2025-016', pricebookItemId: 'PB-MATH-TUTORING', slots: 5, total: 600.00, status: 'approved', paymentStatus: 'partial', amountPaid: 300.00 },
            { id: 'Q-2025-017', pricebookItemId: 'PB-SCIENCE-LAB', slots: 3, total: 240.00, status: 'approved', paymentStatus: 'paid', amountPaid: 240.00 }
        ]
    },
    {
        id: 'CUST-008',
        name: 'Robert Kim',
        email: 'robert.k@email.com',
        phone: '+61 400 890 123',
        quotes: [
            { id: 'Q-2025-009', pricebookItemId: 'PB-ALGEBRA-II', slots: 8, total: 1440.00, status: 'approved', paymentStatus: 'paid', amountPaid: 1440.00 },
            { id: 'Q-2025-018', pricebookItemId: 'PB-PHYSICS-WORKSHOP', slots: 4, total: 800.00, status: 'approved', paymentStatus: 'paid', amountPaid: 800.00 }
        ]
    },
    {
        id: 'CUST-009',
        name: 'Maria Garcia',
        email: 'maria.g@email.com',
        phone: '+61 400 901 234',
        quotes: [
            { id: 'Q-2025-019', pricebookItemId: 'PB-YOGA-CLASS', slots: 5, total: 250.00, status: 'approved', paymentStatus: 'paid', amountPaid: 250.00 },
            { id: 'Q-2025-020', pricebookItemId: 'PB-WELLNESS-PASS', slots: 8, total: 280.00, status: 'approved', paymentStatus: 'unpaid', amountPaid: 0 }
        ]
    },
    {
        id: 'CUST-010',
        name: 'Thomas Brown',
        email: 'thomas.b@email.com',
        phone: '+61 400 012 345',
        quotes: [
            { id: 'Q-2025-021', pricebookItemId: 'PB-MATH-TUTORING', slots: 12, total: 1440.00, status: 'approved', paymentStatus: 'partial', amountPaid: 720.00 },
            { id: 'Q-2025-022', pricebookItemId: 'PB-SCIENCE-LAB', slots: 6, total: 480.00, status: 'approved', paymentStatus: 'paid', amountPaid: 480.00 }
        ]
    },
    {
        id: 'CUST-011',
        name: 'Jennifer Lee',
        email: 'jennifer.l@email.com',
        phone: '+61 400 123 456',
        quotes: [
            { id: 'Q-2025-023', pricebookItemId: 'PB-GUITAR-SESSION', slots: 6, total: 270.00, status: 'approved', paymentStatus: 'paid', amountPaid: 270.00 },
            { id: 'Q-2025-024', pricebookItemId: 'PB-YOGA-CLASS', slots: 4, total: 200.00, status: 'approved', paymentStatus: 'paid', amountPaid: 200.00 }
        ]
    },
    {
        id: 'CUST-012',
        name: 'Christopher White',
        email: 'chris.w@email.com',
        phone: '+61 400 234 567',
        quotes: [
            { id: 'Q-2025-025', pricebookItemId: 'PB-PHYSICS-WORKSHOP', slots: 7, total: 1400.00, status: 'approved', paymentStatus: 'paid', amountPaid: 1400.00 },
            { id: 'Q-2025-026', pricebookItemId: 'PB-ALGEBRA-II', slots: 4, total: 720.00, status: 'approved', paymentStatus: 'unpaid', amountPaid: 0 }
        ]
    }
];

// Store current quick book customer
let currentQuickBookCustomer = null;

// Search customers for booking
function searchCustomersForBooking(query) {
    const resultsContainer = document.getElementById('customerAutocomplete');
    const pricebookItemId = currentClass?.pricebookItemId;

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
    const matchingEntries = sampleCustomers.reduce((entries, customer) => {
        const matchesSearch = customer.name.toLowerCase().includes(query) ||
            customer.email.toLowerCase().includes(query);

        if (!matchesSearch || !customer.quotes) return entries;

        // Get quotes matching the pricebook item with available slots
        const matchingQuotes = customer.quotes.filter(quote => {
            if (quote.pricebookItemId !== pricebookItemId || quote.status !== 'approved') {
                return false;
            }

            // Calculate available slots for this quote
            const inventory = calculateSlotInventory(customer.id, quote.id);
            return inventory.available > 0; // Only show quotes with available slots
        });

        matchingQuotes.forEach(quote => {
            const inventory = calculateSlotInventory(customer.id, quote.id);
            entries.push({ customer, quote, inventory });
        });

        return entries;
    }, []);

    if (matchingEntries.length === 0) {
        resultsContainer.innerHTML = `
            <div class="p-3 text-sm text-gray-500">
                No available quotes found
            </div>
        `;
        resultsContainer.classList.remove('hidden');
        return;
    }

    // Group by customer
    const groupedByCustomer = matchingEntries.reduce((map, entry) => {
        if (!map.has(entry.customer.id)) {
            map.set(entry.customer.id, { customer: entry.customer, quotes: [] });
        }
        map.get(entry.customer.id).quotes.push({ quote: entry.quote, inventory: entry.inventory });
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
                ${group.quotes.map(item => `
                    <button 
                        type="button"
                        onclick="selectCustomerForBooking('${group.customer.id}', '${item.quote.id}')"
                        class="w-full text-left px-3 py-2 border border-gray-200 rounded-lg bg-white hover:bg-emerald-50 hover:border-emerald-200 transition-colors flex items-center justify-between text-xs"
                    >
                        <div>
                            <p class="font-medium text-gray-900">${item.quote.id}</p>
                            <p class="text-[11px] text-gray-500">Total: $${item.quote.total.toFixed(2)}</p>
                        </div>
                        <div class="text-right text-[11px]">
                            <p class="text-emerald-600">${item.inventory.available} available</p>
                            <p class="text-gray-400">${item.inventory.booked} booked</p>
                        </div>
                    </button>
                `).join('')}
            </div>
        </div>
    `).join('');

    resultsContainer.classList.remove('hidden');
}

// Select customer for booking
function selectCustomerForBooking(customerId, quoteId) {
    const customer = sampleCustomers.find(c => c.id === customerId);
    if (!customer) return;

    const pricebookItemId = currentClass?.pricebookItemId;
    const matchingQuotes = customer.quotes.filter(quote =>
        quote.pricebookItemId === pricebookItemId &&
        quote.status === 'approved'
    );
    const selectedQuote = matchingQuotes.find(q => q.id === quoteId);

    if (!selectedQuote) {
        showNotification('Quote not found', 'error');
        return;
    }

    // Calculate slot inventory for this customer/quote
    const inventory = calculateSlotInventory(customer.id, quoteId);

    // Store current booking state
    currentSlotBookingState = {
        customer: customer,
        quote: selectedQuote,
        inventory: inventory,
        slotEntries: [],
        selectedSessionId: null
    };

    // Hide autocomplete and clear search
    document.getElementById('customerAutocomplete').classList.add('hidden');
    document.getElementById('customerSearchInput').value = '';

    // Show slot booking form
    showSlotBookingForm();
}

// Current slot booking state
let currentSlotBookingState = null;

// Calculate slot inventory for a customer and quote
function calculateSlotInventory(customerId, quoteId) {
    try {
        const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        const classSessions = sessions.filter(s => s.classId === currentClass.id);

        // Find the customer and quote
        const customer = sampleCustomers.find(c => c.id === customerId);
        const quote = customer?.quotes.find(q => q.id === quoteId);

        if (!quote) {
            return { totalPurchased: 0, booked: 0, available: 0, bookedSlots: [] };
        }

        // Count booked slots from this quote across all sessions
        let bookedSlots = [];
        classSessions.forEach(session => {
            (session.bookings || []).forEach(booking => {
                if (booking.quoteId === quoteId) {
                    // Check if booking uses new slot structure or old slotsUsed
                    if (booking.slots && Array.isArray(booking.slots)) {
                        booking.slots.forEach(slot => {
                            bookedSlots.push({
                                ...slot,
                                sessionId: session.id,
                                sessionDate: session.date,
                                customerName: booking.customerName
                            });
                        });
                    } else {
                        // Legacy booking - create pseudo-slots
                        for (let i = 0; i < (booking.slotsUsed || 1); i++) {
                            bookedSlots.push({
                                slotId: `${booking.id}-SLOT-${i + 1}`,
                                studentName: booking.customerName,
                                sessionId: session.id,
                                sessionDate: session.date,
                                customerName: booking.customerName,
                                status: 'booked'
                            });
                        }
                    }
                }
            });
        });

        const totalPurchased = quote.slots || 0;
        const bookedCount = bookedSlots.length;

        return {
            totalPurchased: totalPurchased,
            booked: bookedCount,
            available: Math.max(0, totalPurchased - bookedCount),
            bookedSlots: bookedSlots
        };
    } catch (error) {
        console.error('Error calculating slot inventory:', error);
        return { totalPurchased: 0, booked: 0, available: 0, bookedSlots: [] };
    }
}

// Get payment status info
function getPaymentStatusInfo(status) {
    const statusMap = {
        paid: { label: 'Paid', icon: '✅', color: 'green' },
        partial: { label: 'Partial', icon: '⚠️', color: 'yellow' },
        unpaid: { label: 'Unpaid', icon: '❌', color: 'red' }
    };
    return statusMap[status] || statusMap.unpaid;
}

// Show slot booking form
function showSlotBookingForm() {
    if (!currentSlotBookingState) return;

    const { customer, quote, inventory } = currentSlotBookingState;

    // Update customer info
    document.getElementById('slotBookCustomerName').textContent = customer.name;
    document.getElementById('slotBookCustomerEmail').textContent = customer.email;

    // Update inventory display
    document.getElementById('inventoryTotal').textContent = inventory.totalPurchased;
    document.getElementById('inventoryBooked').textContent = inventory.booked;
    document.getElementById('inventoryAvailable').textContent = inventory.available;

    // Update quote display
    const paymentStatus = quote.paymentStatus || 'unpaid';
    const paymentInfo = getPaymentStatusInfo(paymentStatus);
    document.getElementById('slotBookQuoteDisplay').innerHTML = `
        <div class="flex items-center justify-between">
            <span class="font-semibold text-emerald-900">${quote.id}</span>
            <span class="text-gray-600">$${quote.total.toFixed(2)}</span>
        </div>
        <div class="flex items-center gap-2 mt-1">
            <span class="text-xs ${paymentInfo.color === 'green' ? 'text-green-600' : paymentInfo.color === 'yellow' ? 'text-amber-600' : 'text-red-600'}">${paymentInfo.icon} ${paymentInfo.label}</span>
        </div>
    `;

    // Show/hide payment warning
    const paymentWarning = document.getElementById('paymentWarning');
    if (paymentStatus !== 'paid') {
        paymentWarning.classList.remove('hidden');
        document.getElementById('paymentWarningText').textContent =
            paymentStatus === 'partial' ? 'This quote is only partially paid.' : 'This quote has not been paid yet.';
    } else {
        paymentWarning.classList.add('hidden');
    }

    // Update session count display
    updateSessionCountDisplay();

    // Pre-fill attendee name with customer name
    const attendeeNameInput = document.getElementById('attendeeName');
    const attendeeNotesInput = document.getElementById('attendeeNotes');
    if (attendeeNameInput) attendeeNameInput.value = customer.name || '';
    if (attendeeNotesInput) attendeeNotesInput.value = '';

    // Update confirm button
    updateConfirmBookingButton();

    // Show form
    document.getElementById('slotBookingForm').classList.remove('hidden');
}

// Update session count display
function updateSessionCountDisplay() {
    try {
        const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        const classSessions = sessions.filter(s =>
            s.classId === currentClass.id &&
            s.status !== 'cancelled' &&
            s.status !== 'completed'
        );

        const sessionCount = classSessions.length;
        const display = document.getElementById('sessionCountDisplay');
        if (display) {
            display.textContent = `${sessionCount} session${sessionCount !== 1 ? 's' : ''}`;
        }

        // Store sessions in state for booking
        currentSlotBookingState.allSessions = classSessions;
    } catch (error) {
        console.error('Error updating session count:', error);
    }
}

// Add a new slot entry
function addSlotEntry() {
    if (!currentSlotBookingState) return;

    const { inventory, slotEntries } = currentSlotBookingState;

    // Check if we can add more slots
    if (slotEntries.length >= inventory.available) {
        showNotification(`Maximum ${inventory.available} slots available from this quote`, 'warning');
        return;
    }

    const slotIndex = slotEntries.length;
    const slotId = `slot-entry-${Date.now()}-${slotIndex}`;

    // Add to state
    currentSlotBookingState.slotEntries.push({
        id: slotId,
        studentName: '',
        notes: ''
    });

    // Hide "no slots" message
    document.getElementById('noSlotsMessage').classList.add('hidden');

    // Create slot entry UI
    const container = document.getElementById('slotEntriesContainer');
    const slotHtml = `
        <div id="${slotId}" class="border border-gray-200 rounded-lg p-3 bg-white">
            <div class="flex items-start justify-between mb-2">
                <span class="text-xs font-semibold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded">Attendee ${slotIndex + 1}</span>
                <button type="button" onclick="removeSlotEntry('${slotId}')" 
                    class="text-gray-400 hover:text-red-500 transition-colors">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
            <div class="space-y-2">
                <div>
                    <label class="text-xs text-gray-500">Attendee Name <span class="text-red-500">*</span></label>
                    <input type="text" 
                        id="${slotId}-name"
                        placeholder="Enter attendee name"
                        class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        oninput="updateSlotEntry('${slotId}', 'studentName', this.value)"
                    />
                </div>
                <div>
                    <label class="text-xs text-gray-500">Notes <span class="text-gray-400">(optional)</span></label>
                    <input type="text" 
                        id="${slotId}-notes"
                        placeholder="Special notes for this attendee"
                        class="w-full px-2 py-1.5 text-sm border border-gray-300 rounded focus:outline-none focus:ring-1 focus:ring-emerald-500"
                        oninput="updateSlotEntry('${slotId}', 'notes', this.value)"
                    />
                </div>
            </div>
        </div>
    `;
    container.insertAdjacentHTML('beforeend', slotHtml);

    updateAddSlotButtonState();
    updateConfirmBookingButton();
}

// Update a slot entry
function updateSlotEntry(slotId, field, value) {
    if (!currentSlotBookingState) return;

    const entry = currentSlotBookingState.slotEntries.find(e => e.id === slotId);
    if (entry) {
        entry[field] = value;
        updateConfirmBookingButton();
    }
}

// Remove a slot entry
function removeSlotEntry(slotId) {
    if (!currentSlotBookingState) return;

    // Remove from state
    currentSlotBookingState.slotEntries = currentSlotBookingState.slotEntries.filter(e => e.id !== slotId);

    // Remove from UI
    const element = document.getElementById(slotId);
    if (element) {
        element.remove();
    }

    // Re-number remaining slots
    const container = document.getElementById('slotEntriesContainer');
    const slotElements = container.querySelectorAll('[id^="slot-entry-"]');
    slotElements.forEach((el, index) => {
        const badge = el.querySelector('.text-emerald-700');
        if (badge) {
            badge.textContent = `Attendee ${index + 1}`;
        }
    });

    // Show "no slots" message if empty
    if (currentSlotBookingState.slotEntries.length === 0) {
        document.getElementById('noSlotsMessage').classList.remove('hidden');
    }

    updateAddSlotButtonState();
    updateConfirmBookingButton();
}

// Update add slot button state
function updateAddSlotButtonState() {
    if (!currentSlotBookingState) return;

    const btn = document.getElementById('addSlotBtn');
    const { inventory, slotEntries } = currentSlotBookingState;

    if (slotEntries.length >= inventory.available) {
        btn.disabled = true;
        btn.classList.add('opacity-50', 'cursor-not-allowed');
    } else {
        btn.disabled = false;
        btn.classList.remove('opacity-50', 'cursor-not-allowed');
    }
}

// Update confirm booking button
function updateConfirmBookingButton() {
    if (!currentSlotBookingState) return;

    const btn = document.getElementById('confirmBookingBtn');
    const btnText = document.getElementById('confirmBookingBtnText');
    const attendeeName = document.getElementById('attendeeName')?.value?.trim() || '';
    const { allSessions = [] } = currentSlotBookingState;

    const sessionCount = allSessions.length;

    // Simple button text
    btnText.textContent = 'Book Slot';

    // Enable button only if we have an attendee name and sessions
    if (attendeeName && sessionCount > 0) {
        btn.disabled = false;
    } else {
        btn.disabled = true;
    }
}

// Update attendee state when input changes
function updateAttendeeState() {
    updateConfirmBookingButton();
}

// Clear slot booking form
function clearSlotBooking() {
    currentSlotBookingState = null;
    document.getElementById('slotBookingForm').classList.add('hidden');
    document.getElementById('customerSearchInput').value = '';

    // Clear attendee inputs
    const attendeeNameInput = document.getElementById('attendeeName');
    const attendeeNotesInput = document.getElementById('attendeeNotes');
    if (attendeeNameInput) attendeeNameInput.value = '';
    if (attendeeNotesInput) attendeeNotesInput.value = '';
}

// Confirm and save slot booking (for all sessions)
function confirmSlotBooking() {
    if (!currentSlotBookingState) {
        showNotification('Please select a customer first', 'warning');
        return;
    }

    const { customer, quote, allSessions = [] } = currentSlotBookingState;

    // Get attendee from single input
    const attendeeName = document.getElementById('attendeeName')?.value?.trim() || '';
    const attendeeNotes = document.getElementById('attendeeNotes')?.value?.trim() || '';

    // Validate
    if (!attendeeName) {
        showNotification('Please enter an attendee name', 'error');
        return;
    }

    // Create single slot entry
    const validSlots = [{ studentName: attendeeName, notes: attendeeNotes }];

    if (allSessions.length === 0) {
        showNotification('No sessions available for this class', 'error');
        return;
    }

    try {
        const allSessionsData = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        const now = new Date().toISOString();
        let totalBooked = 0;
        const capacity = currentClass.maxCapacity || 20;

        // Book slots for each session
        allSessions.forEach(session => {
            const sessionIndex = allSessionsData.findIndex(s => s.id === session.id);
            if (sessionIndex === -1) return;

            const currentSession = allSessionsData[sessionIndex];
            const currentFilled = currentSession.confirmedSlots || 0;

            // Check capacity for this session
            if (currentFilled + validSlots.length > capacity) {
                showNotification(`Session on ${formatDate(session.date)} is full. Skipping.`, 'warning');
                return;
            }

            // Create booking with individual slots
            const bookingId = `BOOKING-${session.id}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

            const newBooking = {
                id: bookingId,
                customerId: customer.id,
                customerName: customer.name,
                customerEmail: customer.email,
                quoteId: quote.id,
                sessionId: session.id,
                classId: currentClass.id,
                slots: validSlots.map((entry, index) => ({
                    slotId: `${bookingId}-SLOT-${index + 1}`,
                    studentName: entry.studentName.trim(),
                    notes: entry.notes?.trim() || '',
                    status: 'booked',
                    bookedAt: now,
                    sessionId: session.id
                })),
                status: 'confirmed',
                bookedAt: now,
                updatedAt: now
            };

            // Add booking to session
            if (!currentSession.bookings) {
                currentSession.bookings = [];
            }
            currentSession.bookings.push(newBooking);
            currentSession.confirmedSlots = (currentSession.confirmedSlots || 0) + validSlots.length;
            currentSession.updatedAt = now;

            allSessionsData[sessionIndex] = currentSession;
            totalBooked++;
        });

        // Save all sessions
        localStorage.setItem('class_sessions_v2', JSON.stringify(allSessionsData));

        // Success
        showNotification(`Successfully booked ${validSlots.length} slot${validSlots.length > 1 ? 's' : ''} for ${customer.name} across ${totalBooked} session${totalBooked > 1 ? 's' : ''}`, 'success');

        // Close modal and refresh
        clearSlotBooking();
        closeBookCustomerModal();
        loadEnrollmentData();
        loadSessions();

    } catch (error) {
        console.error('Error saving booking:', error);
        showNotification('Error saving booking', 'error');
    }
}

// Legacy functions for backwards compatibility
function clearQuickBook() {
    clearSlotBooking();
}

function showQuickBookForm() {
    showSlotBookingForm();
}

function updateQuickBookSlots() {
    // Legacy - no longer used
}

function bookQuickCustomer() {
    confirmSlotBooking();
}


// Open book customer modal
function openBookCustomerModal() {
    const modal = document.getElementById('bookCustomerModal');
    if (!modal) return;

    // Reset form
    clearQuickBook();
    document.getElementById('customerSearchInput').value = '';
    document.getElementById('customerAutocomplete').classList.add('hidden');

    // Check if pricebook item is linked
    const pricebookItemId = currentClass?.pricebookItemId;
    const searchInput = document.getElementById('customerSearchInput');
    const hint = document.getElementById('customerSearchHint');

    if (pricebookItemId) {
        if (searchInput) searchInput.disabled = false;
        if (hint) hint.innerHTML = '<span class="text-emerald-600">✓</span> Ready to search for customers';
    } else {
        if (searchInput) searchInput.disabled = true;
        if (hint) hint.innerHTML = '<span class="text-amber-600">⚠️</span> Please ensure a pricebook item is linked to this class to search for customers';
    }

    modal.classList.remove('hidden');
}

// Close book customer modal
function closeBookCustomerModal() {
    const modal = document.getElementById('bookCustomerModal');
    if (modal) {
        modal.classList.add('hidden');
        clearQuickBook();
    }
}

// Close modal on ESC key
document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('bookCustomerModal');
        if (modal && !modal.classList.contains('hidden')) {
            closeBookCustomerModal();
        }
    }
});

// Store all bookings for filtering
let allBookingsData = [];

// Render bookings list with individual slots
function renderBookingsList(filterQuery = '') {
    const container = document.getElementById('bookingsList');
    const emptyState = document.getElementById('emptyBookingsState');
    const countEl = document.getElementById('bookingsCount');

    try {
        const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        const classSessions = sessions.filter(s => s.classId === currentClass.id);

        // Collect all bookings with slot expansion
        allBookingsData = [];
        let totalSlotCount = 0;

        classSessions.forEach(session => {
            (session.bookings || []).forEach(booking => {
                // Check if booking uses new slot array structure
                if (booking.slots && Array.isArray(booking.slots) && booking.slots.length > 0) {
                    // Expand each slot as a separate entry for display
                    booking.slots.forEach(slot => {
                        allBookingsData.push({
                            ...booking,
                            slotData: slot,
                            studentName: slot.studentName,
                            slotId: slot.slotId,
                            slotNotes: slot.notes,
                            sessionId: session.id,
                            sessionDate: session.date,
                            sessionTime: session.startTime,
                            isSlotBooking: true
                        });
                        totalSlotCount++;
                    });
                } else {
                    // Legacy booking format
                    allBookingsData.push({
                        ...booking,
                        sessionId: session.id,
                        sessionDate: session.date,
                        sessionTime: session.startTime,
                        isSlotBooking: false
                    });
                    totalSlotCount += (booking.slotsUsed || 1);
                }
            });
        });

        // Filter bookings if search query provided
        let filteredBookings = allBookingsData;
        if (filterQuery && filterQuery.trim()) {
            const query = filterQuery.toLowerCase().trim();
            filteredBookings = allBookingsData.filter(booking =>
                booking.customerName?.toLowerCase().includes(query) ||
                booking.customerEmail?.toLowerCase().includes(query) ||
                booking.quoteId?.toLowerCase().includes(query) ||
                booking.studentName?.toLowerCase().includes(query)
            );
        }

        // Update count
        if (countEl) {
            countEl.textContent = `${filteredBookings.length} slot${filteredBookings.length !== 1 ? 's' : ''} booked`;
        }

        if (filteredBookings.length === 0) {
            container.classList.add('hidden');
            emptyState.classList.remove('hidden');
            if (filterQuery && filterQuery.trim()) {
                emptyState.innerHTML = `
                    <div class="text-center py-12 text-gray-500">
                        <svg class="mx-auto mb-3 text-gray-400 w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"></path>
                        </svg>
                        <p class="text-sm font-medium text-gray-700 mb-1">No bookings found</p>
                        <p class="text-xs text-gray-500">Try a different search term</p>
                    </div>
                `;
            } else {
                emptyState.innerHTML = `
                    <div class="text-center py-12 text-gray-500">
                        <svg class="mx-auto mb-3 text-gray-400 w-12 h-12" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z"></path>
                        </svg>
                        <p class="text-sm font-medium text-gray-700 mb-1">No bookings yet</p>
                        <p class="text-xs text-gray-500">Click "Book Customer" to add new bookings</p>
                    </div>
                `;
            }
            return;
        }

        container.classList.remove('hidden');
        emptyState.classList.add('hidden');

        container.innerHTML = filteredBookings.map(booking => {
            const statusConfig = {
                confirmed: { text: 'Confirmed', class: 'bg-green-100 text-green-700' },
                cancelled: { text: 'Cancelled', class: 'bg-gray-100 text-gray-700' }
            };
            const status = statusConfig[booking.status] || statusConfig.confirmed;

            if (booking.isSlotBooking) {
                // New slot-level display - focus on attendee only
                return `
                    <div class="border border-gray-200 rounded-lg p-3 hover:border-emerald-300 transition-colors">
                        <div class="flex items-start justify-between mb-2">
                            <div class="flex-1">
                                <div class="flex items-center gap-2 mb-1">
                                    <h4 class="font-semibold text-gray-900">${booking.studentName}</h4>
                                    <span class="px-2 py-0.5 text-xs rounded ${status.class}">${status.text}</span>
                                </div>
                                <div class="text-xs text-gray-500 space-y-0.5">
                                    <div class="flex items-center gap-3">
                                        <span>Customer: ${booking.customerName}</span>
                                        <span>Quote: ${booking.quoteId || '-'}</span>
                                    </div>
                                    ${booking.sessionDate ? `<div class="text-gray-500">Session: ${formatDate(new Date(booking.sessionDate))} at ${booking.sessionTime || ''}</div>` : ''}
                                    ${booking.slotNotes ? `<p class="text-gray-600 italic mt-1">"${booking.slotNotes}"</p>` : ''}
                                </div>
                            </div>
                        </div>
                        <div class="flex gap-2 pt-2 border-t border-gray-100">
                            <button 
                                onclick="openTransferSlotModal('${booking.slotId}', '${booking.id}', '${booking.sessionId}')"
                                class="flex-1 px-3 py-1.5 text-xs font-medium text-blue-600 border border-blue-300 rounded-lg hover:bg-blue-50 flex items-center justify-center gap-1"
                            >
                                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7h12m0 0l-4-4m4 4l-4 4m0 6H4m0 0l4 4m-4-4l4-4"></path>
                                </svg>
                                Transfer
                            </button>
                            <button 
                                onclick="cancelSlot('${booking.slotId}', '${booking.id}', '${booking.sessionId}')"
                                class="flex-1 px-3 py-1.5 text-xs font-medium text-red-600 border border-red-300 rounded-lg hover:bg-red-50"
                            >
                                Remove
                            </button>
                        </div>
                    </div>
                `;
            } else {
                // Hide legacy bookings - only show slot-level bookings
                return '';
            }
        }).filter(html => html).join('');
    } catch (error) {
        console.error('Error rendering bookings:', error);
        container.classList.add('hidden');
        emptyState.classList.remove('hidden');
    }
}

// Search booked customers
function searchBookedCustomers(query) {
    renderBookingsList(query);
}

// Cancel individual slot
function cancelSlot(slotId, bookingId, sessionId) {
    if (!confirm('Are you sure you want to cancel this slot?')) {
        return;
    }

    try {
        const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        const session = sessions.find(s => s.id === sessionId);

        if (session && session.bookings) {
            const booking = session.bookings.find(b => b.id === bookingId);

            if (booking && booking.slots) {
                // Remove the slot from the booking
                booking.slots = booking.slots.filter(s => s.slotId !== slotId);

                // If no slots left, remove the entire booking
                if (booking.slots.length === 0) {
                    session.bookings = session.bookings.filter(b => b.id !== bookingId);
                }

                // Update confirmed slots count
                let totalSlots = 0;
                session.bookings.forEach(b => {
                    if (b.status === 'confirmed') {
                        totalSlots += (b.slots && Array.isArray(b.slots)) ? b.slots.length : (b.slotsUsed || 1);
                    }
                });
                session.confirmedSlots = totalSlots;
                session.updatedAt = new Date().toISOString();

                const index = sessions.findIndex(s => s.id === sessionId);
                if (index > -1) {
                    sessions[index] = session;
                    localStorage.setItem('class_sessions_v2', JSON.stringify(sessions));
                }

                renderBookingsList();
                loadEnrollmentData();
                loadSessions();
                showNotification('Slot cancelled successfully', 'success');
            }
        }
    } catch (error) {
        console.error('Error cancelling slot:', error);
        showNotification('Error cancelling slot', 'error');
    }
}

// Cancel entire booking (legacy)
function cancelBooking(bookingId, sessionId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }

    try {
        const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        const session = sessions.find(s => s.id === sessionId);

        if (session && session.bookings) {
            const booking = session.bookings.find(b => b.id === bookingId);
            const slotsRemoved = booking ?
                (booking.slots && Array.isArray(booking.slots) ? booking.slots.length : (booking.slotsUsed || 1)) : 0;

            session.bookings = session.bookings.filter(b => b.id !== bookingId);

            // Update session stats
            session.confirmedSlots = Math.max(0, (session.confirmedSlots || 0) - slotsRemoved);
            session.updatedAt = new Date().toISOString();

            const index = sessions.findIndex(s => s.id === sessionId);
            if (index > -1) {
                sessions[index] = session;
                localStorage.setItem('class_sessions_v2', JSON.stringify(sessions));
            }

            renderBookingsList();
            loadEnrollmentData();
            loadSessions();
            showNotification('Booking cancelled successfully', 'success');
        }
    } catch (error) {
        console.error('Error cancelling booking:', error);
        showNotification('Error cancelling booking', 'error');
    }
}

// Current transfer state
let currentTransferState = null;

// Open transfer slot modal
function openTransferSlotModal(slotId, bookingId, sessionId) {
    try {
        const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        const session = sessions.find(s => s.id === sessionId);
        const booking = session?.bookings?.find(b => b.id === bookingId);
        const slot = booking?.slots?.find(s => s.slotId === slotId);

        if (!slot) {
            showNotification('Slot not found', 'error');
            return;
        }

        currentTransferState = {
            slotId,
            bookingId,
            fromSessionId: sessionId,
            slot,
            booking,
            session
        };

        // Update modal display
        document.getElementById('transferSlotStudent').textContent = slot.studentName;
        document.getElementById('transferSlotCustomer').textContent = booking.customerName;
        document.getElementById('transferSlotFromSession').textContent = `${formatDate(session.date)} at ${session.startTime}`;
        document.getElementById('transferSlotQuote').textContent = booking.quoteId;

        // Populate available classes for transfer
        const classes = JSON.parse(localStorage.getItem('classes_v2') || '[]');
        const activeClasses = classes.filter(c => c.status === 'active');

        const classSelect = document.getElementById('transferTargetClass');
        classSelect.innerHTML = '<option value="">Select a class...</option>';

        // Add current class first (default)
        const currentClassOption = document.createElement('option');
        currentClassOption.value = currentClass.id;
        currentClassOption.textContent = `${currentClass.name} (Current)`;
        currentClassOption.selected = true;
        classSelect.appendChild(currentClassOption);

        // Add other classes
        activeClasses.forEach(cls => {
            if (cls.id !== currentClass.id) {
                const option = document.createElement('option');
                option.value = cls.id;
                option.textContent = cls.name;
                classSelect.appendChild(option);
            }
        });

        // Load sessions for current class by default
        loadTransferClassSessions();

        // Clear reason
        document.getElementById('transferReason').value = '';

        // Show modal
        document.getElementById('transferSlotModal').classList.remove('hidden');
    } catch (error) {
        console.error('Error opening transfer modal:', error);
        showNotification('Error opening transfer modal', 'error');
    }
}

// Load sessions for selected class in transfer modal
function loadTransferClassSessions() {
    const classSelect = document.getElementById('transferTargetClass');
    const targetSelect = document.getElementById('transferTargetSession');
    const selectedClassId = classSelect.value;

    if (!selectedClassId) {
        targetSelect.innerHTML = '<option value="">First select a class...</option>';
        return;
    }

    try {
        const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        const classes = JSON.parse(localStorage.getItem('classes_v2') || '[]');
        const selectedClass = classes.find(c => c.id === selectedClassId);

        if (!selectedClass) {
            targetSelect.innerHTML = '<option value="">Class not found</option>';
            return;
        }

        // Get sessions for selected class (exclude current session if same class)
        const classSessions = sessions.filter(s =>
            s.classId === selectedClassId &&
            s.status !== 'cancelled' &&
            s.status !== 'completed' &&
            (selectedClassId !== currentClass.id || s.id !== currentTransferState.session.id)
        );

        classSessions.sort((a, b) => new Date(a.date) - new Date(b.date));

        if (classSessions.length === 0) {
            targetSelect.innerHTML = '<option value="">No available sessions</option>';
            return;
        }

        targetSelect.innerHTML = '<option value="">Select destination session...</option>';
        classSessions.forEach(s => {
            const capacity = selectedClass.maxCapacity || 20;
            const filled = s.confirmedSlots || 0;
            const available = capacity - filled;

            const option = document.createElement('option');
            option.value = s.id;
            option.textContent = `${formatDate(s.date)} at ${s.startTime || 'TBD'} (${available} slots available)`;
            option.disabled = available <= 0;
            targetSelect.appendChild(option);
        });
    } catch (error) {
        console.error('Error loading transfer sessions:', error);
        targetSelect.innerHTML = '<option value="">Error loading sessions</option>';
    }
}

// Update transfer session count info
function updateTransferSessionCount() {
    const targetSelect = document.getElementById('transferTargetSession');
    const infoEl = document.getElementById('transferSessionCountInfo');
    const targetClassId = document.getElementById('transferTargetClass').value;

    if (!targetSelect.value || !targetClassId) {
        infoEl.classList.add('hidden');
        return;
    }

    try {
        const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        const selectedSessionId = targetSelect.value;

        // Get all sessions for the target class
        const classSessions = sessions.filter(s =>
            s.classId === targetClassId &&
            s.status !== 'cancelled' &&
            s.status !== 'completed'
        ).sort((a, b) => new Date(a.date) - new Date(b.date));

        // Find the starting session index
        const startIndex = classSessions.findIndex(s => s.id === selectedSessionId);
        if (startIndex === -1) {
            infoEl.classList.add('hidden');
            return;
        }

        // Count remaining sessions from starting point
        const remainingSessions = classSessions.slice(startIndex);
        const count = remainingSessions.length;

        infoEl.textContent = `Attendee will be enrolled in ${count} session${count !== 1 ? 's' : ''} (from this session to the last)`;
        infoEl.classList.remove('hidden');
    } catch (error) {
        console.error('Error calculating session count:', error);
        infoEl.classList.add('hidden');
    }
}

// Close transfer slot modal
function closeTransferSlotModal() {
    document.getElementById('transferSlotModal').classList.add('hidden');
    currentTransferState = null;
}

// Confirm transfer slot
function confirmTransferSlot() {
    if (!currentTransferState) {
        showNotification('No slot selected for transfer', 'error');
        return;
    }

    const toSessionId = document.getElementById('transferTargetSession').value;
    const targetClassId = document.getElementById('transferTargetClass').value;

    if (!toSessionId) {
        showNotification('Please select a starting session', 'error');
        return;
    }

    const reason = document.getElementById('transferReason').value.trim();

    try {
        const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        const { slotId, bookingId, fromSessionId, slot, booking } = currentTransferState;

        const fromSession = sessions.find(s => s.id === fromSessionId);
        if (!fromSession) {
            showNotification('Source session not found', 'error');
            return;
        }

        // Get all target sessions from the starting session onwards
        const targetClassSessions = sessions.filter(s =>
            s.classId === targetClassId &&
            s.status !== 'cancelled' &&
            s.status !== 'completed'
        ).sort((a, b) => new Date(a.date) - new Date(b.date));

        const startIndex = targetClassSessions.findIndex(s => s.id === toSessionId);
        if (startIndex === -1) {
            showNotification('Starting session not found', 'error');
            return;
        }

        const sessionsToEnroll = targetClassSessions.slice(startIndex);
        const capacity = currentClass.maxCapacity || 20;

        // Check if any session is full
        for (const session of sessionsToEnroll) {
            const filled = session.confirmedSlots || 0;
            if (filled >= capacity) {
                showNotification(`Session on ${formatDate(session.date)} is full. Cannot transfer.`, 'error');
                return;
            }
        }

        const fromBooking = fromSession.bookings.find(b => b.id === bookingId);
        if (!fromBooking) {
            showNotification('Booking not found', 'error');
            return;
        }

        // Remove slot from source booking
        const slotIndex = fromBooking.slots.findIndex(s => s.slotId === slotId);
        if (slotIndex === -1) {
            showNotification('Slot not found in booking', 'error');
            return;
        }

        const [transferredSlot] = fromBooking.slots.splice(slotIndex, 1);

        // Add transfer history
        transferredSlot.transferHistory = transferredSlot.transferHistory || [];
        transferredSlot.transferHistory.push({
            fromSessionId,
            toClassId: targetClassId,
            toStartSessionId: toSessionId,
            sessionsEnrolled: sessionsToEnroll.length,
            transferredAt: new Date().toISOString(),
            reason
        });

        // If source booking is empty, remove it
        if (fromBooking.slots.length === 0) {
            fromSession.bookings = fromSession.bookings.filter(b => b.id !== bookingId);
        }

        // Update source session
        fromSession.confirmedSlots = Math.max(0, (fromSession.confirmedSlots || 0) - 1);
        fromSession.updatedAt = new Date().toISOString();

        // Enroll in ALL target sessions from starting point
        let enrolledCount = 0;
        for (const toSession of sessionsToEnroll) {
            const sessionIndex = sessions.findIndex(s => s.id === toSession.id);
            if (sessionIndex === -1) continue;

            // Clone slot for this session
            const newSlot = {
                ...transferredSlot,
                slotId: `${transferredSlot.slotId}-${toSession.id}`,
                sessionId: toSession.id
            };

            // Find or create booking in target session
            let toBooking = sessions[sessionIndex].bookings?.find(b =>
                b.customerId === booking.customerId &&
                b.quoteId === booking.quoteId
            );

            if (toBooking) {
                toBooking.slots.push(newSlot);
                toBooking.updatedAt = new Date().toISOString();
            } else {
                const newBookingId = `BOOKING-${toSession.id}-${Date.now()}`;
                toBooking = {
                    id: newBookingId,
                    customerId: booking.customerId,
                    customerName: booking.customerName,
                    customerEmail: booking.customerEmail,
                    quoteId: booking.quoteId,
                    sessionId: toSession.id,
                    classId: targetClassId,
                    slots: [newSlot],
                    status: 'confirmed',
                    bookedAt: new Date().toISOString(),
                    updatedAt: new Date().toISOString()
                };
                if (!sessions[sessionIndex].bookings) {
                    sessions[sessionIndex].bookings = [];
                }
                sessions[sessionIndex].bookings.push(toBooking);
            }

            // Update slot count
            sessions[sessionIndex].confirmedSlots = (sessions[sessionIndex].confirmedSlots || 0) + 1;
            sessions[sessionIndex].updatedAt = new Date().toISOString();
            enrolledCount++;
        }

        // Save source session update
        const fromIndex = sessions.findIndex(s => s.id === fromSessionId);
        if (fromIndex > -1) sessions[fromIndex] = fromSession;

        localStorage.setItem('class_sessions_v2', JSON.stringify(sessions));

        // Success
        showNotification(`Slot transferred to ${enrolledCount} session${enrolledCount !== 1 ? 's' : ''}`, 'success');
        closeTransferSlotModal();
        renderBookingsList();
        loadEnrollmentData();
        loadSessions();

    } catch (error) {
        console.error('Error transferring slot:', error);
        showNotification('Error transferring slot', 'error');
    }
}


// Update enrollment tab when switching to it (replaces old loadEnrollmentData)
function loadEnrollmentData() {
    try {
        const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        const classSessions = sessions.filter(s => s.classId === currentClass.id);

        // Aggregate enrollment data
        let totalBookings = 0;
        let confirmedBookings = 0;
        let totalSlots = 0;
        let totalFilled = 0;

        classSessions.forEach(session => {
            const bookings = session.bookings || [];
            totalBookings += bookings.length;
            confirmedBookings += bookings.filter(b => b.status === 'confirmed').length;
            totalSlots += (session.confirmedSlots || 0);
            totalFilled += (currentClass.maxCapacity || 0) * classSessions.length;
        });

        // Update stats
        document.getElementById('totalBookings').textContent = totalBookings;
        document.getElementById('confirmedBookings').textContent = confirmedBookings;

        const avgEnrollment = totalFilled > 0 ? Math.round((totalSlots / totalFilled) * 100) : 0;
        document.getElementById('avgEnrollment').textContent = `${avgEnrollment}%`;

        // Render bookings list
        renderBookingsList();

        // Enable/disable search based on pricebook item
        const searchInput = document.getElementById('customerSearchInput');
        const hint = document.getElementById('customerSearchHint');
        if (currentClass?.pricebookItemId) {
            if (searchInput) searchInput.disabled = false;
            if (hint) hint.innerHTML = '<span class="text-emerald-600">✓</span> Ready to search for customers';
        } else {
            if (searchInput) searchInput.disabled = true;
            if (hint) hint.innerHTML = '<span class="text-amber-600">⚠️</span> Please ensure a pricebook item is linked to this class to search for customers';
        }
    } catch (error) {
        console.error('Error loading enrollment data:', error);
    }
}

// ==================== Actions ====================

function generateSessions() {
    if (confirm('Generate sessions for the next 4 weeks based on the class schedule?')) {
        showNotification('Session generation feature coming soon', 'info');
        // TODO: Implement session generation
    }
}

function handleArchive() {
    if (confirm('Are you sure you want to archive this class? This will pause all future session generation.')) {
        currentClass.status = 'archived';
        currentClass.updatedAt = new Date().toISOString();

        try {
            const classes = JSON.parse(localStorage.getItem('classes_v2') || '[]');
            const index = classes.findIndex(c => c.id === currentClass.id);
            if (index > -1) {
                classes[index] = currentClass;
                localStorage.setItem('classes_v2', JSON.stringify(classes));

                showNotification('Class archived successfully', 'success');
                setTimeout(() => {
                    window.location.reload();
                }, 1500);
            }
        } catch (error) {
            console.error('Error archiving class:', error);
            showNotification('Error archiving class', 'error');
        }
    }
}

function getClassId() {
    // Return class ID from currentClass if available, otherwise from URL
    return currentClass?.id || classIdFromUrl || '';
}

// Helper function to get class ID from URL
function getClassIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || '';
}

// Edit class handler
function editClass() {
    const id = getClassId() || getClassIdFromUrl();
    if (!id) {
        showNotification('Class ID is required', 'error');
        return;
    }
    window.location.href = `class_edit.html?id=${id}`;
}

// View all sessions handler
function viewAllSessions() {
    const id = getClassId() || getClassIdFromUrl();
    if (!id) {
        showNotification('Class ID is required', 'error');
        return;
    }
    window.location.href = `session_list.html?classId=${id}`;
}

// Create session handler
function createSession() {
    const id = getClassId() || getClassIdFromUrl();
    if (!id) {
        showNotification('Class ID is required', 'error');
        return;
    }
    window.location.href = `session_create.html?classId=${id}`;
}

// ==================== Notifications ====================

function showNotification(message, type = 'info') {
    const container = document.createElement('div');
    container.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${type === 'success' ? 'bg-green-500' :
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


// ==================== Staff Management ====================


// Sample staff data (in real app, fetch from API/localStorage)
const sampleStaff = [
    { id: 'STAFF-001', name: 'Daniel Davis', email: 'daniel.davis@example.com', role: 'Instructor', department: 'Math' },
    { id: 'STAFF-002', name: 'Sarah Johnson', email: 'sarah.j@example.com', role: 'Instructor', department: 'Science' },
    { id: 'STAFF-003', name: 'Michael Chen', email: 'michael.chen@example.com', role: 'Instructor', department: 'Math' },
    { id: 'STAFF-004', name: 'Emily Rodriguez', email: 'emily.r@example.com', role: 'Instructor', department: 'Yoga' },
    { id: 'STAFF-005', name: 'James Wilson', email: 'james.w@example.com', role: 'Instructor', department: 'Guitar' },
    { id: 'STAFF-006', name: 'Lisa Anderson', email: 'lisa.a@example.com', role: 'Instructor', department: 'Science' },
    { id: 'STAFF-007', name: 'Robert Taylor', email: 'robert.t@example.com', role: 'Instructor', department: 'Math' },
    { id: 'STAFF-008', name: 'Jennifer White', email: 'jennifer.w@example.com', role: 'Instructor', department: 'Yoga' },
    { id: 'STAFF-009', name: 'David Kim', email: 'david.k@example.com', role: 'Instructor', department: 'Computer Science' },
    { id: 'STAFF-010', name: 'Amanda Martinez', email: 'amanda.m@example.com', role: 'Instructor', department: 'English' }
];

// Selected staff state
// Available teams for assignment
const availableTeams = [
    {
        id: 'team-1',
        name: 'Math & Science Team',
        type: 'team',
        avatar: 'MST',
        color: 'indigo',
        skills: ['Math', 'Science', 'Physics', 'Chemistry'],
        members: [
            { id: 'STAFF-001', name: 'Daniel Davis', role: 'Instructor', avatar: 'DD' },
            { id: 'STAFF-002', name: 'Sarah Johnson', role: 'Instructor', avatar: 'SJ' }
        ]
    },
    {
        id: 'team-2',
        name: 'Yoga & Wellness Team',
        type: 'team',
        avatar: 'YWT',
        color: 'pink',
        skills: ['Yoga', 'Wellness', 'Meditation'],
        members: [
            { id: 'STAFF-004', name: 'Emily Rodriguez', role: 'Instructor', avatar: 'ER' },
            { id: 'STAFF-008', name: 'Jennifer White', role: 'Instructor', avatar: 'JW' }
        ]
    }
];

// Convert sampleStaff to match unified assignment format
function getAssignableEntities() {
    const individuals = sampleStaff.map(staff => {
        const initials = staff.name.split(' ').map(n => n[0]).join('');
        return {
            ...staff,
            type: 'individual',
            rate: 0,
            displayName: `${staff.name} (User)`,
            avatar: initials,
            color: getColorForStaff(staff.id),
            skills: [staff.department],
            role: staff.role
        };
    });

    const teams = availableTeams.map(team => ({
        ...team,
        rate: 0,
        displayName: `${team.name} (Team)`
    }));

    return [...individuals, ...teams];
}

function getColorForStaff(staffId) {
    const colors = ['blue', 'purple', 'green', 'orange', 'red', 'pink', 'indigo', 'gray'];
    const index = parseInt(staffId.replace('STAFF-', '')) % colors.length;
    return colors[index];
}

// Selected assignments tracking (unified system)
let selectedAssignments = [];
let unifiedAssignmentInitialized = false;

// Load staff list when tab is opened
function loadStaffList() {
    if (!unifiedAssignmentInitialized) {
        initializeUnifiedAssignment();
        unifiedAssignmentInitialized = true;
    }

    // Initialize selected assignments from current class data
    selectedAssignments = [];
    if (currentClass && currentClass.defaultStaff) {
        const allEntities = getAssignableEntities();

        currentClass.defaultStaff.forEach(s => {
            const entity = allEntities.find(e => e.id === s.id);
            if (entity) {
                selectedAssignments.push(entity);
            }
        });
    }

    renderSelectedAssignments();
    loadRecommendedAssignments();
    updateStaffSummary();
}

// Render the staff list with checkboxes
function initializeUnifiedAssignment() {
    const searchInput = document.getElementById('assignmentSearchInput');
    const autocompleteDiv = document.getElementById('assignmentAutocomplete');
    const refreshBtn = document.getElementById('refreshAssignmentRecommendations');

    if (searchInput) {
        // Remove existing listeners to avoid duplicates (clone node trick)
        const newSearchInput = searchInput.cloneNode(true);
        searchInput.parentNode.replaceChild(newSearchInput, searchInput);
        newSearchInput.addEventListener('input', handleAssignmentSearch);

        // Close autocomplete when clicking outside
        document.addEventListener('click', function (e) {
            if (!newSearchInput.contains(e.target) && autocompleteDiv && !autocompleteDiv.contains(e.target)) {
                autocompleteDiv.classList.add('hidden');
            }
        });
    }

    if (refreshBtn) {
        const newRefreshBtn = refreshBtn.cloneNode(true);
        refreshBtn.parentNode.replaceChild(newRefreshBtn, refreshBtn);
        newRefreshBtn.addEventListener('click', function (e) {
            e.preventDefault();
            loadRecommendedAssignments();
        });
    }
}

function handleAssignmentSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    const autocomplete = document.getElementById('assignmentAutocomplete');

    if (!query) {
        autocomplete.classList.add('hidden');
        return;
    }

    const entities = getAssignableEntities();
    const filtered = entities.filter(entity =>
        entity.name.toLowerCase().includes(query) ||
        entity.role?.toLowerCase().includes(query) ||
        entity.skills?.some(skill => skill.toLowerCase().includes(query)) ||
        entity.displayName.toLowerCase().includes(query) ||
        entity.department?.toLowerCase().includes(query)
    );

    if (filtered.length === 0) {
        autocomplete.innerHTML = '<div class="p-3 text-sm text-gray-500">No matches found</div>';
        autocomplete.classList.remove('hidden');
        return;
    }

    autocomplete.innerHTML = filtered.map(entity => {
        const colorMap = {
            'blue': 'bg-blue-100 text-blue-600',
            'purple': 'bg-purple-100 text-purple-600',
            'green': 'bg-green-100 text-green-600',
            'orange': 'bg-orange-100 text-orange-600',
            'red': 'bg-red-100 text-red-600',
            'pink': 'bg-pink-100 text-pink-600',
            'indigo': 'bg-indigo-100 text-indigo-600',
            'gray': 'bg-gray-100 text-gray-600'
        };
        const colorClass = colorMap[entity.color] || colorMap['blue'];

        return `
            <button onclick="selectAssignment('${entity.id}', '${entity.type}')" class="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left">
                <div class="w-10 h-10 ${colorClass} rounded-full flex items-center justify-center font-semibold text-sm">
                    ${entity.avatar}
                </div>
                <div class="flex-1">
                    <p class="font-semibold text-gray-900 text-sm">${entity.displayName}</p>
                    <p class="text-xs text-gray-600">${entity.role || 'Team'}</p>
                    ${entity.skills ? `<p class="text-xs text-gray-500">${entity.skills.join(', ')}</p>` : ''}
                </div>
            </button>
        `;
    }).join('');

    autocomplete.classList.remove('hidden');
}

function selectAssignment(entityId, entityType) {
    const entities = getAssignableEntities();
    const entity = entities.find(e => e.id === entityId);

    if (!entity) return;

    // Check if already selected
    if (selectedAssignments.find(s => s.id === entityId)) {
        return;
    }

    selectedAssignments.push(entity);
    renderSelectedAssignments();
    loadRecommendedAssignments();
    updateStaffSummary();

    // Clear search
    const searchInput = document.getElementById('assignmentSearchInput');
    const autocomplete = document.getElementById('assignmentAutocomplete');
    if (searchInput) searchInput.value = '';
    if (autocomplete) autocomplete.classList.add('hidden');
}

function removeAssignment(entityId) {
    selectedAssignments = selectedAssignments.filter(s => s.id !== entityId);
    renderSelectedAssignments();
    loadRecommendedAssignments();
    updateStaffSummary();
}

function updateAssignmentRate(entityId, newRate) {
    const assignment = selectedAssignments.find(s => s.id === entityId);
    if (assignment) {
        assignment.rate = parseFloat(newRate) || 0;
        updateStaffSummary();
    }
}

function renderSelectedAssignments() {
    const container = document.getElementById('selectedAssignmentsList');
    const countEl = document.getElementById('selectedAssignmentsCount');

    if (!container || !countEl) return;

    countEl.textContent = selectedAssignments.length;

    if (selectedAssignments.length === 0) {
        container.innerHTML = '<p class="text-xs text-gray-500 italic">No assignments selected yet</p>';
        return;
    }

    container.innerHTML = selectedAssignments.map(entity => {
        const colorMap = {
            'blue': 'bg-blue-100 text-blue-600',
            'purple': 'bg-purple-100 text-purple-600',
            'green': 'bg-green-100 text-green-600',
            'orange': 'bg-orange-100 text-orange-600',
            'red': 'bg-red-100 text-red-600',
            'pink': 'bg-pink-100 text-pink-600',
            'indigo': 'bg-indigo-100 text-indigo-600',
            'gray': 'bg-gray-100 text-gray-600'
        };
        const colorClass = colorMap[entity.color] || colorMap['blue'];

        let html = `
            <div class="flex items-center gap-3 p-2 bg-emerald-50 border border-emerald-200 rounded-lg">
                <div class="w-8 h-8 ${colorClass} rounded-full flex items-center justify-center font-semibold text-xs">
                    ${entity.avatar}
                </div>
                <div class="flex-1">
                    <p class="font-semibold text-gray-900 text-sm">${entity.displayName}</p>
                    <p class="text-xs text-gray-600">${entity.role || 'Team'}</p>
                </div>
                <div class="flex items-center gap-1 mr-2 bg-white px-2 py-1 rounded border border-gray-200">
                    <span class="text-xs text-gray-500 font-medium">$</span>
                    <input 
                        type="number" 
                        min="0" 
                        step="0.01"
                        value="${entity.rate || 0}"
                        onchange="updateAssignmentRate('${entity.id}', this.value)"
                        onclick="event.stopPropagation()"
                        class="w-16 text-xs border-0 border-b border-gray-300 focus:border-emerald-500 focus:ring-0 px-0 py-0.5 text-right bg-transparent"
                        placeholder="0.00"
                    />
                    <span class="text-xs text-gray-500">/hr</span>
                </div>
                <button onclick="removeAssignment('${entity.id}')" class="p-1 hover:bg-red-100 rounded text-gray-400 hover:text-red-600">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;

        // Add team members display if it's a team
        if (entity.type === 'team' && entity.members) {
            html += `
                <div class="ml-11 mt-2 p-3 bg-gray-50 border border-gray-200 rounded-lg">
                    <p class="text-xs font-medium text-gray-700 mb-2">Team Members:</p>
                    <div class="space-y-1">
                        ${entity.members.map(member => `
                            <div class="flex items-center gap-2 text-xs">
                                <div class="w-6 h-6 bg-gray-300 rounded-full flex items-center justify-center font-semibold text-gray-600">
                                    ${member.avatar}
                                </div>
                                <span class="text-gray-700">${member.name}</span>
                                <span class="text-gray-500">• ${member.role}</span>
                            </div>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        return html;
    }).join('');
}

function loadRecommendedAssignments() {
    const container = document.getElementById('recommendedAssignmentsList');
    if (!container) return;

    const entities = getAssignableEntities();
    // Get entities not already selected (only individuals for classes)
    const recommended = entities
        .filter(e => e.type === 'individual' && !selectedAssignments.find(sel => sel.id === e.id))
        .slice(0, 3);

    if (recommended.length === 0) {
        container.innerHTML = '<p class="text-xs text-gray-500 italic">All available assignments selected</p>';
        return;
    }

    container.innerHTML = recommended.map(entity => {
        const colorMap = {
            'blue': 'bg-blue-100 text-blue-600',
            'purple': 'bg-purple-100 text-purple-600',
            'green': 'bg-green-100 text-green-600',
            'orange': 'bg-orange-100 text-orange-600',
            'red': 'bg-red-100 text-red-600',
            'pink': 'bg-pink-100 text-pink-600',
            'indigo': 'bg-indigo-100 text-indigo-600',
            'gray': 'bg-gray-100 text-gray-600'
        };
        const colorClass = colorMap[entity.color] || colorMap['blue'];

        return `
            <button onclick="selectAssignment('${entity.id}', '${entity.type}')" class="w-full flex items-center gap-3 p-2 border border-gray-200 rounded-lg hover:border-emerald-300 hover:bg-emerald-50 transition-colors text-left">
                <div class="w-8 h-8 ${colorClass} rounded-full flex items-center justify-center font-semibold text-xs">
                    ${entity.avatar}
                </div>
                <div class="flex-1">
                    <p class="font-semibold text-gray-900 text-sm">${entity.displayName}</p>
                    <p class="text-xs text-gray-600">${entity.role || 'Team'}</p>
                </div>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
            </button>
        `;
    }).join('');
}

// Update staff summary in the right column
function updateStaffSummary() {
    const countEl = document.getElementById('summaryStaffCount');
    const listEl = document.getElementById('summaryStaffList');

    if (countEl) {
        countEl.textContent = `${selectedAssignments.length} selected`;
    }

    if (listEl) {
        if (selectedAssignments.length === 0) {
            listEl.innerHTML = '<p class="text-sm text-gray-400">No staff selected</p>';
        } else {
            listEl.innerHTML = selectedAssignments.map(staff => {
                const colorMap = {
                    'blue': 'bg-blue-100 text-blue-800',
                    'purple': 'bg-purple-100 text-purple-800',
                    'green': 'bg-green-100 text-green-800',
                    'orange': 'bg-orange-100 text-orange-800',
                    'red': 'bg-red-100 text-red-800',
                    'pink': 'bg-pink-100 text-pink-800',
                    'indigo': 'bg-indigo-100 text-indigo-800',
                    'gray': 'bg-gray-100 text-gray-800'
                };
                const colorClass = colorMap[staff.color] || colorMap['blue'];
                // For summary, we use a simpler display
                const initials = staff.avatar || '??';

                return `
                    <div class="flex items-center gap-2 p-2 border border-gray-200 rounded-lg">
                        <div class="w-8 h-8 ${colorClass} rounded-full flex items-center justify-center">
                            <span class="text-xs font-semibold">${initials}</span>
                        </div>
                        <div class="flex-1">
                            <p class="text-sm font-medium text-gray-900">${staff.displayName}</p>
                            <p class="text-xs text-gray-500">${staff.role || 'Team'}</p>
                        </div>
                    </div>
                `;
            }).join('');
        }
    }
}

// Save staff assignment changes
function saveStaffAssignment() {
    if (!currentClass) {
        showNotification('No class loaded', 'error');
        return;
    }

    if (selectedAssignments.length === 0) {
        showNotification('Please select at least one staff member or team', 'error');
        return;
    }

    try {
        const classes = JSON.parse(localStorage.getItem('classes_v2') || '[]');
        const index = classes.findIndex(c => c.id === currentClass.id);

        if (index > -1) {
            // Map to minimal object to save space/maintain consistency
            classes[index].defaultStaff = selectedAssignments.map(s => ({
                id: s.id,
                name: s.name,
                type: s.type || 'individual',
                rate: parseFloat(s.rate) || 0,
                displayName: s.displayName
            }));
            classes[index].updatedAt = new Date().toISOString();

            localStorage.setItem('classes_v2', JSON.stringify(classes));

            // Update current class reference
            currentClass = classes[index];

            showNotification('Staff assignment updated successfully!', 'success');
        }
    } catch (error) {
        console.error('Error saving staff assignment:', error);
        showNotification('Error saving staff assignment', 'error');
    }
}


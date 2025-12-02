// Class Detail Script
// Handles display and interactions for class detail view

// Current class data
let currentClass = null;
let classIdFromUrl = null; // Store class ID from URL

// Initialize page
document.addEventListener('DOMContentLoaded', function() {
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
    
    // Basic Information
    document.getElementById('displayClassName').textContent = currentClass.name || '-';
    document.getElementById('displayDescription').textContent = currentClass.description || 'No description';
    document.getElementById('displaySkillLevel').textContent = currentClass.skillLevel || '-';
    updateStatusDisplay();
    
    // Price Book Item
    if (currentClass.pricebookItem) {
        document.getElementById('displayPricebookName').textContent = currentClass.pricebookItem.name;
        document.getElementById('displayPricebookDescription').textContent = currentClass.pricebookItem.description || '';
        document.getElementById('displayPricebookTag').textContent = currentClass.pricebookItem.tag || 'General';
        document.getElementById('displayPricebookPrice').textContent = `$${currentClass.pricebookItem.price?.toFixed(2) || '0.00'}`;
    }
    
    // Schedule
    if (currentClass.schedule) {
        const schedule = currentClass.schedule;
        document.getElementById('displayFrequency').textContent = schedule.frequency ? schedule.frequency.charAt(0).toUpperCase() + schedule.frequency.slice(1) : '-';
        
        // Days of week
        if (schedule.daysOfWeek && schedule.daysOfWeek.length > 0) {
            const daysContainer = document.getElementById('displayDays');
            daysContainer.innerHTML = schedule.daysOfWeek.map(day => {
                const shortDay = day.substring(0, 3);
                return `<span class="px-2 py-1 bg-emerald-100 text-emerald-700 rounded text-xs font-medium">${shortDay}</span>`;
            }).join('');
        } else {
            document.getElementById('displayDaysSection').classList.add('hidden');
        }
        
        document.getElementById('displayStartTime').textContent = schedule.startTime || '-';
        document.getElementById('displayEndTime').textContent = schedule.endTime || '-';
        document.getElementById('displayDuration').textContent = schedule.duration ? `${schedule.duration} minutes` : '-';
        document.getElementById('displayStartDate').textContent = schedule.startDate ? formatDate(schedule.startDate) : 'Not set';
        document.getElementById('displayEndDate').textContent = schedule.endDate ? formatDate(schedule.endDate) : 'Ongoing';
    }
    
    // Default Staff
    if (currentClass.defaultStaff && currentClass.defaultStaff.length > 0) {
        const staffContainer = document.getElementById('displayStaffList');
        staffContainer.innerHTML = currentClass.defaultStaff.map(staff => {
            const initials = staff.name.split(' ').map(n => n[0]).join('');
            return `
                <div class="flex items-center gap-3 p-2 border border-gray-200 rounded-lg">
                    <div class="w-8 h-8 bg-emerald-100 rounded-full flex items-center justify-center">
                        <span class="text-xs font-semibold text-emerald-700">${initials}</span>
                    </div>
                    <div class="flex-1">
                        <p class="text-sm font-medium text-gray-900">${staff.name}</p>
                    </div>
                </div>
            `;
        }).join('');
    } else {
        document.getElementById('displayStaffList').innerHTML = '<p class="text-sm text-gray-400">No staff assigned</p>';
    }
    
    // Capacity
    document.getElementById('displayMaxCapacity').textContent = currentClass.maxCapacity || '-';
    
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
            { id: 'Q-2025-002', pricebookItemId: 'PB-YOGA-AEROBIC', slots: 3, total: 60.00, status: 'approved', paymentStatus: 'partial', amountPaid: 30.00 }
        ]
    },
    { 
        id: 'CUST-002', 
        name: 'Michael Chen', 
        email: 'm.chen@email.com', 
        phone: '+61 400 234 567',
        quotes: [
            { id: 'Q-2025-003', pricebookItemId: 'PB-MATH-TUTORING', slots: 10, total: 500.00, status: 'approved', paymentStatus: 'paid', amountPaid: 500.00 }
        ]
    },
    { 
        id: 'CUST-003', 
        name: 'Emma Wilson', 
        email: 'emma.w@email.com', 
        phone: '+61 400 345 678',
        quotes: [
            { id: 'Q-2025-004', pricebookItemId: 'PB-YOGA-AEROBIC', slots: 2, total: 40.00, status: 'approved', paymentStatus: 'unpaid', amountPaid: 0 }
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
    
    // Get all bookings from all sessions of this class
    const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
    const classSessions = sessions.filter(s => s.classId === currentClass.id);
    const bookedQuoteIds = [];
    classSessions.forEach(session => {
        (session.bookings || []).forEach(booking => {
            if (booking.quoteId) bookedQuoteIds.push(booking.quoteId);
        });
    });
    
    // Filter customers
    const matchingEntries = sampleCustomers.reduce((entries, customer) => {
        const matchesSearch = customer.name.toLowerCase().includes(query) || 
                             customer.email.toLowerCase().includes(query);
        
        if (!matchesSearch || !customer.quotes) return entries;
        
        // Get quotes matching the pricebook item
        const matchingQuotes = customer.quotes.filter(quote => 
            quote.pricebookItemId === pricebookItemId && 
            quote.status === 'approved' &&
            !bookedQuoteIds.includes(quote.id) // Exclude already booked quotes
        );
        
        matchingQuotes.forEach(quote => {
            entries.push({ customer, quote });
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
                        onclick="selectCustomerForBooking('${group.customer.id}', '${quote.id}')"
                        class="w-full text-left px-3 py-2 border border-gray-200 rounded-lg bg-white hover:bg-emerald-50 hover:border-emerald-200 transition-colors flex items-center justify-between text-xs"
                    >
                        <div>
                            <p class="font-medium text-gray-900">${quote.id}</p>
                            <p class="text-[11px] text-gray-500">Total: $${quote.total.toFixed(2)}</p>
                        </div>
                        <div class="text-right text-[11px] text-emerald-600">
                            <p>${quote.slots} slot${quote.slots === 1 ? '' : 's'}</p>
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
    
    const paymentStatus = selectedQuote.paymentStatus || 'unpaid';
    const amountPaid = selectedQuote.amountPaid || 0;
    
    // Store current quick book customer
    currentQuickBookCustomer = {
        ...customer,
        matchingQuotes: matchingQuotes,
        selectedQuoteId: quoteId,
        paymentStatus,
        amountPaid,
        quoteTotal: selectedQuote.total || 0,
        slots: 1
    };
    
    // Hide autocomplete and clear search
    document.getElementById('customerAutocomplete').classList.add('hidden');
    document.getElementById('customerSearchInput').value = '';
    
    // Show quick book form
    showQuickBookForm();
}

// Show quick book form
function showQuickBookForm() {
    if (!currentQuickBookCustomer) return;
    
    const form = document.getElementById('quickBookForm');
    const customerName = document.getElementById('quickBookCustomerName');
    const customerEmail = document.getElementById('quickBookCustomerEmail');
    const quoteDisplay = document.getElementById('quickBookQuoteDisplay');
    const slotsInput = document.getElementById('quickBookSlots');
    const paymentStatusDisplay = document.getElementById('quickBookPaymentStatus');
    
    customerName.textContent = currentQuickBookCustomer.name;
    customerEmail.textContent = currentQuickBookCustomer.email;
    
    const selectedQuote = currentQuickBookCustomer.matchingQuotes.find(q => q.id === currentQuickBookCustomer.selectedQuoteId);
    quoteDisplay.innerHTML = `
        <div class="flex items-center justify-between text-sm font-semibold text-emerald-900">
            <span>${currentQuickBookCustomer.selectedQuoteId}</span>
            <span>$${currentQuickBookCustomer.quoteTotal.toFixed(2)}</span>
        </div>
        ${selectedQuote ? `
            <div class="flex items-center gap-2 text-xs text-emerald-700 mt-2">
                <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
                </svg>
                <span>${selectedQuote.slots} slot${selectedQuote.slots === 1 ? '' : 's'} available</span>
            </div>
        ` : ''}
    `;
    
    const maxSlots = selectedQuote?.slots || 1;
    slotsInput.max = maxSlots;
    slotsInput.value = Math.min(currentQuickBookCustomer.slots || 1, maxSlots);
    
    const paymentInfo = getPaymentStatusInfo(currentQuickBookCustomer.paymentStatus);
    paymentStatusDisplay.innerHTML = `
        <div class="flex items-center gap-2 text-sm font-semibold text-${paymentInfo.color}-800">
            <span>${paymentInfo.icon}</span>
            <span>${paymentInfo.label}</span>
        </div>
        <p class="text-xs text-gray-600 mt-1">Paid $${currentQuickBookCustomer.amountPaid.toFixed(2)} of $${currentQuickBookCustomer.quoteTotal.toFixed(2)}</p>
    `;
    
    form.classList.remove('hidden');
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

// Clear quick book form
function clearQuickBook() {
    currentQuickBookCustomer = null;
    document.getElementById('quickBookForm').classList.add('hidden');
    document.getElementById('customerSearchInput').value = '';
    const slotsInput = document.getElementById('quickBookSlots');
    if (slotsInput) {
        slotsInput.value = 1;
    }
    const notesInput = document.getElementById('quickBookNotes');
    if (notesInput) {
        notesInput.value = '';
    }
}

// Update quick book slots
function updateQuickBookSlots() {
    if (!currentQuickBookCustomer) return;
    
    const slotsInput = document.getElementById('quickBookSlots');
    const slots = parseInt(slotsInput.value) || 1;
    const selectedQuote = currentQuickBookCustomer.matchingQuotes.find(q => q.id === currentQuickBookCustomer.selectedQuoteId);
    
    if (selectedQuote && slots > selectedQuote.slots) {
        showNotification(`Maximum ${selectedQuote.slots} slots available from this quote`, 'warning');
        slotsInput.value = selectedQuote.slots;
        currentQuickBookCustomer.slots = selectedQuote.slots;
    } else {
        currentQuickBookCustomer.slots = slots;
    }
}

// Book quick customer
function bookQuickCustomer() {
    if (!currentQuickBookCustomer) {
        showNotification('Please select a customer first', 'warning');
        return;
    }
    
    const slotsInput = document.getElementById('quickBookSlots');
    const slots = parseInt(slotsInput.value) || 1;
    const notesInput = document.getElementById('quickBookNotes');
    const bookingNote = notesInput ? notesInput.value.trim() : '';
    
    if (slots < 1) {
        showNotification('Please enter a valid number of slots', 'error');
        return;
    }
    
    const selectedQuote = currentQuickBookCustomer.matchingQuotes.find(q => q.id === currentQuickBookCustomer.selectedQuoteId);
    if (slots > (selectedQuote?.slots || 0)) {
        showNotification(`Maximum ${selectedQuote.slots} slots available from this quote`, 'error');
        return;
    }
    
    // Find the next available session or create a booking record
    // For now, we'll create a booking that can be assigned to a session later
    // In a real system, you'd select which session to book into
    
    showNotification('Booking feature: Select a session to book this customer into', 'info');
    
    // TODO: Implement actual booking logic - assign to a specific session
    // For now, just clear the form and close modal
    clearQuickBook();
    closeBookCustomerModal();
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
document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
        const modal = document.getElementById('bookCustomerModal');
        if (modal && !modal.classList.contains('hidden')) {
            closeBookCustomerModal();
        }
    }
});

// Store all bookings for filtering
let allBookingsData = [];

// Render bookings list
function renderBookingsList(filterQuery = '') {
    const container = document.getElementById('bookingsList');
    const emptyState = document.getElementById('emptyBookingsState');
    const countEl = document.getElementById('bookingsCount');
    
    try {
        const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        const classSessions = sessions.filter(s => s.classId === currentClass.id);
        
        // Collect all bookings
        allBookingsData = [];
        classSessions.forEach(session => {
            (session.bookings || []).forEach(booking => {
                allBookingsData.push({
                    ...booking,
                    sessionId: session.id,
                    sessionDate: session.date,
                    sessionTime: session.startTime
                });
            });
        });
        
        // Filter bookings if search query provided
        let filteredBookings = allBookingsData;
        if (filterQuery && filterQuery.trim()) {
            const query = filterQuery.toLowerCase().trim();
            filteredBookings = allBookingsData.filter(booking => 
                booking.customerName?.toLowerCase().includes(query) ||
                booking.customerEmail?.toLowerCase().includes(query) ||
                booking.quoteId?.toLowerCase().includes(query)
            );
        }
        
        // Update count
        if (countEl) {
            countEl.textContent = `${filteredBookings.length} booking${filteredBookings.length !== 1 ? 's' : ''}`;
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
            
            return `
                <div class="flex items-center justify-between p-3 border border-gray-200 rounded-lg hover:border-emerald-300 transition-colors">
                    <div class="flex-1">
                        <div class="flex items-center gap-2 mb-1">
                            <h4 class="font-semibold text-gray-900">${booking.customerName}</h4>
                            <span class="px-2 py-1 text-xs rounded ${status.class}">${status.text}</span>
                        </div>
                        <div class="flex items-center gap-4 text-xs text-gray-500">
                            <span>Quote: ${booking.quoteId || '-'}</span>
                            <span>Slots: ${booking.slotsUsed || 1}</span>
                            ${booking.sessionDate ? `<span>Session: ${formatDate(new Date(booking.sessionDate))}</span>` : ''}
                        </div>
                    </div>
                    <button 
                        onclick="cancelBooking('${booking.id}', '${booking.sessionId}')"
                        class="px-3 py-1.5 text-xs font-medium text-red-600 hover:bg-red-50 rounded-lg"
                    >
                        Cancel
                    </button>
                </div>
            `;
        }).join('');
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

// Cancel booking
function cancelBooking(bookingId, sessionId) {
    if (!confirm('Are you sure you want to cancel this booking?')) {
        return;
    }
    
    try {
        const sessions = JSON.parse(localStorage.getItem('class_sessions_v2') || '[]');
        const session = sessions.find(s => s.id === sessionId);
        
        if (session && session.bookings) {
            session.bookings = session.bookings.filter(b => b.id !== bookingId);
            
            // Update session stats
            if (session.bookings) {
                const confirmed = session.bookings.filter(b => b.status === 'confirmed').length;
                session.confirmedSlots = confirmed;
            }
            
            session.updatedAt = new Date().toISOString();
            
            const index = sessions.findIndex(s => s.id === sessionId);
            if (index > -1) {
                sessions[index] = session;
                localStorage.setItem('class_sessions_v2', JSON.stringify(sessions));
            }
            
            renderBookingsList();
            loadEnrollmentData();
            showNotification('Booking cancelled successfully', 'success');
        }
    } catch (error) {
        console.error('Error cancelling booking:', error);
        showNotification('Error cancelling booking', 'error');
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
    container.className = `fixed top-4 right-4 z-50 px-6 py-3 rounded-lg shadow-lg text-white ${
        type === 'success' ? 'bg-green-500' :
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



/**
 * Learning Service List Script
 * Handles display, filtering, and management of Learning Services
 */

// ===== STATE MANAGEMENT =====
let allServices = [];
let filteredServices = [];

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function () {
    loadServices();
    renderServices();
    updateStats();
});

// ===== DATA LOADING =====
function loadServices() {
    const storageKey = 'fms_learning_services';
    const stored = localStorage.getItem(storageKey);
    let services = [];

    if (stored) {
        services = JSON.parse(stored);

        // Refresh sample data to match latest structure
        const samples = getSampleServices();
        samples.forEach(sample => {
            const index = services.findIndex(s => s.id === sample.id);
            if (index >= 0) {
                // Update existing sample
                services[index] = sample;
            } else {
                // Add missing sample (optional, but good for consistency)
                services.push(sample);
            }
        });

        allServices = services;
        localStorage.setItem(storageKey, JSON.stringify(allServices));
    } else {
        // Load sample data for demo
        allServices = getSampleServices();
        localStorage.setItem(storageKey, JSON.stringify(allServices));
    }

    filteredServices = [...allServices];
}

function getSampleServices() {
    return [
        {
            id: 'ls_sample_001',
            name: 'AP Calculus AB',
            type: 'Class',
            description: 'Advanced Placement Calculus course covering limits, derivatives, and integrals',
            skillLevel: 'Advanced',
            status: 'active',
            pricebookItemId: 'pb1',
            pricebookItemName: 'AP Course - Semester',
            schedule: {
                frequency: 'weekly',
                daysOfWeek: ['Monday', 'Wednesday', 'Friday'],
                startTime: '15:00',
                endTime: '16:30',
                duration: 90,
                config: {
                    weeklySlots: {
                        selectedDays: ['monday', 'wednesday', 'friday'],
                        monday: [{ id: 's1', startTime: '15:00', endTime: '16:30', duration: 90 }],
                        wednesday: [{ id: 's2', startTime: '15:00', endTime: '16:30', duration: 90 }],
                        friday: [{ id: 's3', startTime: '15:00', endTime: '16:30', duration: 90 }]
                    }
                }
            },
            staff: [
                { id: 'staff1', name: 'John Smith', role: 'Senior Tutor', assignedRate: 50.00 }
            ],
            maxCapacity: 20,
            curriculum: 'College Board AP Calculus AB',
            cohortStartDate: '2025-01-15',
            cohortEndDate: '2025-05-30',
            cohortSize: 20,
            sessionsCount: 45,
            avgEnrollment: 85,
            totalEnrolled: 8,
            createdAt: '2024-11-01T10:00:00Z',
            enrollments: [
                { id: 'enr_001', attendeeName: 'Alice Johnson', attendeeEmail: 'alice@example.com', customerId: 'CUST-001', customerName: 'Sarah Johnson', status: 'confirmed', paymentStatus: 'paid', enrolledAt: '2025-01-10T09:00:00Z', quoteId: 'Q-2025-001' },
                { id: 'enr_002', attendeeName: 'Bob Chen', attendeeEmail: 'bob@example.com', customerId: 'CUST-002', customerName: 'Michael Chen', status: 'confirmed', paymentStatus: 'paid', enrolledAt: '2025-01-11T14:30:00Z', quoteId: 'Q-2025-011' },
                { id: 'enr_003', attendeeName: 'Charlie Wilson', attendeeEmail: 'charlie@example.com', customerId: 'CUST-003', customerName: 'Emma Wilson', status: 'confirmed', paymentStatus: 'unpaid', enrolledAt: '2025-01-12T10:15:00Z', quoteId: 'Q-2025-004' },
                { id: 'enr_004', attendeeName: 'Diana Thompson', attendeeEmail: 'diana@example.com', customerId: 'CUST-004', customerName: 'David Thompson', status: 'confirmed', paymentStatus: 'partial', enrolledAt: '2025-01-13T16:45:00Z', quoteId: 'Q-2025-013' },
                { id: 'enr_005', attendeeName: 'Evan Anderson', attendeeEmail: 'evan@example.com', customerId: 'CUST-005', customerName: 'Lisa Anderson', status: 'confirmed', paymentStatus: 'paid', enrolledAt: '2025-01-14T11:20:00Z', quoteId: 'Q-2025-014' },
                { id: 'enr_006', attendeeName: 'Fiona Martinez', attendeeEmail: 'fiona@example.com', customerId: 'CUST-006', customerName: 'James Martinez', status: 'confirmed', paymentStatus: 'paid', enrolledAt: '2025-01-15T08:50:00Z', quoteId: 'Q-2025-007' },
                { id: 'enr_007', attendeeName: 'George MissA', attendeeEmail: 'george@example.com', customerId: 'CUST-007', customerName: 'Miss A', status: 'confirmed', paymentStatus: 'partial', enrolledAt: '2025-01-16T13:10:00Z', quoteId: 'Q-2025-016' },
                { id: 'enr_008', attendeeName: 'Hannah Kim', attendeeEmail: 'hannah@example.com', customerId: 'CUST-008', customerName: 'Robert Kim', status: 'confirmed', paymentStatus: 'paid', enrolledAt: '2025-01-17T15:00:00Z', quoteId: 'Q-2025-009' }
            ]
        },
        {
            id: 'ls_sample_002',
            name: 'SAT Math Prep Group',
            type: 'Group',
            description: 'Small group SAT Math preparation with focus on problem-solving strategies',
            skillLevel: 'Intermediate',
            status: 'active',
            pricebookItemId: 'pb2',
            pricebookItemName: 'SAT Prep - Group Session',
            schedule: {
                frequency: 'weekly',
                daysOfWeek: ['Tuesday', 'Thursday'],
                startTime: '17:00',
                endTime: '18:30',
                duration: 90,
                config: {
                    weeklySlots: {
                        selectedDays: ['tuesday', 'thursday'],
                        tuesday: [{ id: 's4', startTime: '17:00', endTime: '18:30', duration: 90 }],
                        thursday: [{ id: 's5', startTime: '17:00', endTime: '18:30', duration: 90 }]
                    }
                }
            },
            staff: [
                { id: 'staff2', name: 'Emily Davis', role: 'Math Specialist', assignedRate: 45.00 }
            ],
            maxCapacity: 6,
            minCapacity: 2,
            sessionsCount: 24,
            avgEnrollment: 72,
            totalEnrolled: 4,
            createdAt: '2024-11-05T14:00:00Z',
            enrollments: [
                { id: 'enr_009', attendeeName: 'Ian Garcia', attendeeEmail: 'ian@example.com', customerId: 'CUST-009', customerName: 'Maria Garcia', status: 'confirmed', paymentStatus: 'paid', enrolledAt: '2025-02-01T10:00:00Z', quoteId: 'Q-2025-019' },
                { id: 'enr_010', attendeeName: 'Jack Brown', attendeeEmail: 'jack@example.com', customerId: 'CUST-010', customerName: 'Thomas Brown', status: 'confirmed', paymentStatus: 'paid', enrolledAt: '2025-02-02T11:30:00Z', quoteId: 'Q-2025-022' },
                { id: 'enr_011', attendeeName: 'Kelly Lee', attendeeEmail: 'kelly@example.com', customerId: 'CUST-011', customerName: 'Jennifer Lee', status: 'confirmed', paymentStatus: 'paid', enrolledAt: '2025-02-03T09:45:00Z', quoteId: 'Q-2025-024' },
                { id: 'enr_012', attendeeName: 'Liam White', attendeeEmail: 'liam@example.com', customerId: 'CUST-012', customerName: 'Christopher White', status: 'confirmed', paymentStatus: 'paid', enrolledAt: '2025-02-04T14:15:00Z', quoteId: 'Q-2025-026' } // Actually pb1, but using for demo
            ]
        },
        {
            id: 'ls_sample_003',
            name: 'Private Math Tutoring',
            type: 'One-to-One',
            description: 'Personalized one-on-one math tutoring tailored to student needs',
            skillLevel: 'All levels',
            status: 'active',
            pricebookItemId: 'pb3',
            pricebookItemName: 'Private Tutoring - 1 Hour',
            schedule: {
                frequency: 'weekly',
                daysOfWeek: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday'],
                startTime: '14:00',
                endTime: '15:00',
                duration: 60,
                config: {
                    weeklySlots: {
                        selectedDays: ['monday', 'tuesday', 'wednesday', 'thursday', 'friday'],
                        monday: [{ id: 's6', startTime: '14:00', endTime: '15:00', duration: 60 }],
                        tuesday: [{ id: 's7', startTime: '14:00', endTime: '15:00', duration: 60 }],
                        wednesday: [{ id: 's8', startTime: '14:00', endTime: '15:00', duration: 60 }],
                        thursday: [{ id: 's9', startTime: '14:00', endTime: '15:00', duration: 60 }],
                        friday: [{ id: 's10', startTime: '14:00', endTime: '15:00', duration: 60 }]
                    }
                }
            },
            staff: [
                { id: 'staff1', name: 'John Smith', role: 'Senior Tutor', assignedRate: 75.00 }
            ],
            maxCapacity: 1,
            focusArea: 'Remediation',
            personalizationLevel: 'High',
            sessionsCount: 120,
            avgEnrollment: 100,
            totalEnrolled: 1,
            createdAt: '2024-10-15T09:00:00Z',
            enrollments: [
                { id: 'enr_013', attendeeName: 'Sarah Johnson Jr', attendeeEmail: 'sarah.jr@example.com', customerId: 'CUST-002', customerName: 'Michael Chen', status: 'confirmed', paymentStatus: 'paid', enrolledAt: '2024-11-01T08:00:00Z', quoteId: 'Q-2025-003' }
            ]
        },
        {
            id: 'ls_sample_004',
            name: 'Chemistry 101',
            type: 'Class',
            description: 'Introduction to Chemistry for high school students',
            skillLevel: 'Beginner',
            status: 'active',
            pricebookItemId: 'pb4',
            pricebookItemName: 'Science Course - Semester',
            schedule: {
                frequency: 'weekly',
                daysOfWeek: ['Monday', 'Wednesday'],
                startTime: '10:00',
                endTime: '11:30',
                duration: 90,
                config: {
                    weeklySlots: {
                        selectedDays: ['monday', 'wednesday'],
                        monday: [{ id: 's11', startTime: '10:00', endTime: '11:30', duration: 90 }],
                        wednesday: [{ id: 's12', startTime: '10:00', endTime: '11:30', duration: 90 }]
                    }
                }
            },
            staff: [
                { id: 'staff3', name: 'Michael Chen', role: 'Science Teacher', assignedRate: 42.00 }
            ],
            maxCapacity: 15,
            curriculum: 'High School Chemistry Fundamentals',
            cohortStartDate: '2025-01-20',
            cohortEndDate: '2025-06-15',
            cohortSize: 15,
            sessionsCount: 32,
            avgEnrollment: 90,
            totalEnrolled: 3,
            createdAt: '2024-11-10T11:00:00Z',
            enrollments: [
                { id: 'enr_014', attendeeName: 'Mike Martinez', attendeeEmail: 'mike@example.com', customerId: 'CUST-006', customerName: 'James Martinez', status: 'confirmed', paymentStatus: 'paid', enrolledAt: '2025-01-05T16:00:00Z', quoteId: 'Q-2025-007' },
                { id: 'enr_015', attendeeName: 'Nancy Lee', attendeeEmail: 'nancy@example.com', customerId: 'CUST-011', customerName: 'Jennifer Lee', status: 'confirmed', paymentStatus: 'paid', enrolledAt: '2025-01-06T09:30:00Z', quoteId: 'Q-2025-023' },
                { id: 'enr_016', attendeeName: 'Oscar White', attendeeEmail: 'oscar@example.com', customerId: 'CUST-012', customerName: 'Christopher White', status: 'confirmed', paymentStatus: 'unpaid', enrolledAt: '2025-01-07T14:45:00Z', quoteId: 'Q-2025-026' } // Using non-pb4 quote for demo variety
            ]
        },
        {
            id: 'ls_sample_005',
            name: 'Monthly Writing Workshop',
            type: 'Group',
            description: 'Intensive monthly workshop for improving essay writing skills',
            skillLevel: 'Intermediate',
            status: 'paused',
            pricebookItemId: 'pb5',
            pricebookItemName: 'Writing Workshop',
            schedule: {
                frequency: 'monthly',
                daysOfWeek: ['Saturday'],
                startTime: '10:00',
                endTime: '13:00',
                duration: 180,
                config: {
                    monthlySlots: {
                        type: 'day_of_week',
                        week: 'first',
                        dayOfWeek: 'saturday',
                        slots: [{ id: 's13', startTime: '10:00', endTime: '13:00', duration: 180 }]
                    }
                }
            },
            staff: [
                { id: 'staff4', name: 'Sarah Wilson', role: 'English Tutor', assignedRate: 40.00 }
            ],
            maxCapacity: 8,
            minCapacity: 3,
            sessionsCount: 6,
            avgEnrollment: 65,
            totalEnrolled: 0,
            createdAt: '2024-09-01T08:00:00Z',
            enrollments: []
        },
        {
            id: 'ls_sample_006',
            name: 'ACT Prep - Private',
            type: 'One-to-One',
            description: 'Intensive one-on-one ACT preparation with focus on weak areas',
            skillLevel: 'All levels',
            status: 'active',
            pricebookItemId: 'pb6',
            pricebookItemName: 'ACT Prep - Private',
            schedule: {
                frequency: 'weekly',
                daysOfWeek: ['Tuesday', 'Thursday', 'Saturday'],
                startTime: '16:00',
                endTime: '17:30',
                duration: 90,
                config: {
                    weeklySlots: {
                        selectedDays: ['tuesday', 'thursday', 'saturday'],
                        tuesday: [{ id: 's14', startTime: '16:00', endTime: '17:30', duration: 90 }],
                        thursday: [{ id: 's15', startTime: '16:00', endTime: '17:30', duration: 90 }],
                        saturday: [{ id: 's16', startTime: '09:00', endTime: '10:30', duration: 90 }] // Varies on saturday
                    }
                }
            },
            staff: [
                { id: 'staff5', name: 'David Brown', role: 'Test Prep Coach', assignedRate: 65.00 }
            ],
            maxCapacity: 1,
            focusArea: 'Test Preparation',
            personalizationLevel: 'Very High',
            sessionsCount: 48,
            avgEnrollment: 100,
            totalEnrolled: 1,
            createdAt: '2024-10-20T15:00:00Z',
            enrollments: [
                { id: 'enr_017', attendeeName: 'Paul Thompson', attendeeEmail: 'paul@example.com', customerId: 'CUST-004', customerName: 'David Thompson', status: 'confirmed', paymentStatus: 'paid', enrolledAt: '2024-12-01T10:00:00Z', quoteId: 'Q-2025-005' }
            ]
        }
    ];
}

// ===== RENDERING =====
function renderServices() {
    const container = document.getElementById('servicesList');
    const listHeader = document.getElementById('listHeader');
    const emptyState = document.getElementById('emptyState');
    const resultsCount = document.getElementById('resultsCount');

    if (!container) return;

    if (filteredServices.length === 0) {
        container.classList.add('hidden');
        if (listHeader) listHeader.classList.add('hidden');
        if (emptyState) emptyState.classList.remove('hidden');
        if (resultsCount) resultsCount.textContent = 'No learning services found';
        return;
    }

    if (emptyState) emptyState.classList.add('hidden');
    container.classList.remove('hidden');
    if (listHeader) listHeader.classList.remove('hidden');
    if (resultsCount) resultsCount.textContent = `Showing ${filteredServices.length} learning service${filteredServices.length !== 1 ? 's' : ''}`;

    container.innerHTML = filteredServices.map(service => createServiceCard(service)).join('');
}

function createServiceCard(service) {
    const typeStyles = getTypeStyles(service.type);
    const statusBadge = getStatusBadge(service.status);
    const scheduleText = formatSchedule(service.schedule);
    const staffNames = service.staff?.map(s => s.name).join(', ') || 'No staff assigned';
    const capacityText = service.type === 'One-to-One' ? '1:1 Ratio' : `Max ${service.maxCapacity} students`;

    return `
        <div class="service-card rounded-lg border ${typeStyles.borderClass} ${typeStyles.bgClass} p-4 cursor-pointer hover:shadow-md transition-all" 
             onclick="viewServiceDetail('${service.id}')">
            <div class="grid grid-cols-12 gap-4 items-center">
                <!-- Column 1: Main Info (5 cols) -->
                <div class="col-span-12 lg:col-span-5 min-w-0">
                    <div class="flex items-center gap-2 mb-1">
                        <span class="px-2 py-0.5 text-xs font-medium rounded-full ${typeStyles.badgeClass}">
                            ${typeStyles.icon} ${service.type}
                        </span>
                        ${statusBadge}
                    </div>
                    <h3 class="text-base font-semibold text-gray-900 truncate">${service.name}</h3>
                    <p class="text-sm text-gray-500 truncate">${service.description || 'No description'}</p>
                </div>

                <!-- Column 2: Schedule & Staff (3 cols) -->
                <div class="hidden lg:block col-span-3">
                    <div class="flex items-center gap-2 text-sm text-gray-600 mb-1">
                        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"></path>
                        </svg>
                        <span class="truncate">${scheduleText}</span>
                    </div>
                    <div class="flex items-center gap-2 text-sm text-gray-600">
                        <svg class="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                        </svg>
                        <span class="truncate">${staffNames}</span>
                    </div>
                </div>

                <!-- Column 3: Sessions (1 col) -->
                <div class="hidden sm:block col-span-1 text-center">
                    <p class="text-lg font-semibold text-gray-900">${service.sessionsCount || 0}</p>
                    <p class="text-xs text-gray-500">Sessions</p>
                </div>

                <!-- Column 4: Capacity (1 col) -->
                <div class="hidden sm:block col-span-1 text-center">
                    <p class="text-sm font-medium text-gray-700">${capacityText}</p>
                    <p class="text-xs text-gray-500">Capacity</p>
                </div>

                <!-- Column 5: Avg Fill (1 col) -->
                <div class="hidden sm:block col-span-1 text-center">
                    <p class="text-lg font-semibold ${service.avgEnrollment >= 70 ? 'text-emerald-600' : 'text-amber-600'}">${service.avgEnrollment || 0}%</p>
                    <p class="text-xs text-gray-500">Avg Fill</p>
                </div>

                <!-- Column 6: Actions (1 col) -->
                <div class="hidden lg:flex col-span-1 justify-center items-center gap-1">
                    <button onclick="event.stopPropagation(); generateSessions('${service.id}')" 
                            class="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
                            title="Generate Sessions">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z"></path>
                        </svg>
                    </button>
                    <button onclick="event.stopPropagation(); viewServiceDetail('${service.id}')" 
                            class="p-2 text-gray-400 hover:text-indigo-600 hover:bg-indigo-50 rounded-lg transition-colors" 
                            title="View Details">
                        <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"></path>
                        </svg>
                    </button>
                </div>
            </div>
        </div>
    `;
}

// ===== HELPER FUNCTIONS =====
function getTypeStyles(type) {
    const styles = {
        'Class': {
            badgeClass: 'type-badge-class',
            borderClass: 'border-l-4 border-purple-500',
            bgClass: 'bg-purple-50/50',
            icon: '📚'
        },
        'Group': {
            badgeClass: 'type-badge-group',
            borderClass: 'border-l-4 border-amber-500',
            bgClass: 'bg-amber-50/50',
            icon: '👥'
        },
        'One-to-One': {
            badgeClass: 'type-badge-one-to-one',
            borderClass: 'border-l-4 border-cyan-500',
            bgClass: 'bg-cyan-50/50',
            icon: '👤'
        }
    };
    return styles[type] || styles['Class'];
}

function getStatusBadge(status) {
    const badges = {
        'active': '<span class="px-2 py-0.5 text-xs font-medium rounded-full bg-emerald-100 text-emerald-700">Active</span>',
        'paused': '<span class="px-2 py-0.5 text-xs font-medium rounded-full bg-amber-100 text-amber-700">Paused</span>',
        'archived': '<span class="px-2 py-0.5 text-xs font-medium rounded-full bg-gray-100 text-gray-600">Archived</span>'
    };
    return badges[status] || badges['active'];
}

function formatSchedule(schedule) {
    if (!schedule) return 'No schedule';

    // Handle new complex schedule format
    if (schedule.config) {
        if (schedule.frequency === 'daily') {
            const slotCount = schedule.config.dailySlots ? schedule.config.dailySlots.length : 0;
            return `Daily (${slotCount} slot${slotCount !== 1 ? 's' : ''})`;
        } else if (schedule.frequency === 'weekly') {
            const days = schedule.config.weeklySlots ? Object.keys(schedule.config.weeklySlots) : [];
            const dayStr = days.filter(k => k !== 'selectedDays').map(d => d.charAt(0).toUpperCase() + d.slice(1, 3)).join(', ');
            return dayStr ? `${dayStr} (Varied)` : 'Weekly (Configuring)';
        } else if (schedule.frequency === 'monthly') {
            const config = schedule.config.monthlySlots;
            if (config.type === 'date') return `Monthly (Day ${config.date})`;
            return `Monthly (${config.week} ${config.dayOfWeek})`;
        }
    }

    // Fallback to legacy format
    const days = schedule.daysOfWeek?.map(d => d.substring(0, 3)).join(', ') || '';
    const time = schedule.startTime ? `${schedule.startTime} - ${schedule.endTime}` : '';

    return `${days} ${time}`.trim() || 'No schedule';
}

// ===== STATS UPDATE =====
function updateStats() {
    const total = allServices.length;
    const active = allServices.filter(s => s.status === 'active').length;
    const paused = allServices.filter(s => s.status === 'paused').length;
    const totalSessions = allServices.reduce((sum, s) => sum + (s.sessionsCount || 0), 0);

    const classCount = allServices.filter(s => s.type === 'Class').length;
    const groupCount = allServices.filter(s => s.type === 'Group').length;
    const oneToOneCount = allServices.filter(s => s.type === 'One-to-One').length;

    document.getElementById('totalServices').textContent = total;
    document.getElementById('activeServices').textContent = active;
    document.getElementById('pausedServices').textContent = paused;
    document.getElementById('totalSessions').textContent = totalSessions;
    document.getElementById('classCount').textContent = classCount;
    document.getElementById('groupCount').textContent = groupCount;
    document.getElementById('oneToOneCount').textContent = oneToOneCount;
}

// ===== FILTERING =====
function handleSearch(query) {
    applyFilters();
}

function handleFilterChange() {
    applyFilters();
}

function applyFilters() {
    const searchQuery = document.getElementById('searchInput').value.toLowerCase().trim();
    const typeFilter = document.getElementById('typeFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;
    const sortBy = document.getElementById('sortBy').value;

    filteredServices = allServices.filter(service => {
        // Search filter
        if (searchQuery) {
            const matchesSearch = service.name.toLowerCase().includes(searchQuery) ||
                (service.description || '').toLowerCase().includes(searchQuery);
            if (!matchesSearch) return false;
        }

        // Type filter
        if (typeFilter && service.type !== typeFilter) return false;

        // Status filter
        if (statusFilter && service.status !== statusFilter) return false;

        return true;
    });

    // Sort
    filteredServices.sort((a, b) => {
        switch (sortBy) {
            case 'name':
                return a.name.localeCompare(b.name);
            case 'createdAt':
                return new Date(b.createdAt) - new Date(a.createdAt);
            case 'type':
                return a.type.localeCompare(b.type);
            case 'status':
                return a.status.localeCompare(b.status);
            default:
                return 0;
        }
    });

    updateActiveFiltersDisplay();
    renderServices();
}

function filterByType(type) {
    document.getElementById('typeFilter').value = type;
    applyFilters();
}

function clearFilters() {
    document.getElementById('searchInput').value = '';
    document.getElementById('typeFilter').value = '';
    document.getElementById('statusFilter').value = '';
    document.getElementById('sortBy').value = 'name';
    filteredServices = [...allServices];
    updateActiveFiltersDisplay();
    renderServices();
}

function updateActiveFiltersDisplay() {
    const container = document.getElementById('activeFiltersDisplay');
    const tagsContainer = document.getElementById('activeFilterTags');
    const searchQuery = document.getElementById('searchInput').value;
    const typeFilter = document.getElementById('typeFilter').value;
    const statusFilter = document.getElementById('statusFilter').value;

    const tags = [];

    if (searchQuery) {
        tags.push(`<span class="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full flex items-center gap-1">
            Search: "${searchQuery}"
            <button onclick="document.getElementById('searchInput').value=''; applyFilters();" class="hover:text-red-500">×</button>
        </span>`);
    }

    if (typeFilter) {
        tags.push(`<span class="px-2 py-1 bg-indigo-100 text-indigo-700 text-xs rounded-full flex items-center gap-1">
            Type: ${typeFilter}
            <button onclick="document.getElementById('typeFilter').value=''; applyFilters();" class="hover:text-red-500">×</button>
        </span>`);
    }

    if (statusFilter) {
        tags.push(`<span class="px-2 py-1 bg-emerald-100 text-emerald-700 text-xs rounded-full flex items-center gap-1">
            Status: ${statusFilter}
            <button onclick="document.getElementById('statusFilter').value=''; applyFilters();" class="hover:text-red-500">×</button>
        </span>`);
    }

    if (tags.length > 0) {
        container.classList.remove('hidden');
        tagsContainer.innerHTML = tags.join('');
    } else {
        container.classList.add('hidden');
    }
}

// ===== ACTIONS =====
function viewServiceDetail(id) {
    window.location.href = `learning_service_detail.html?id=${id}`;
}

function generateSessions(id) {
    const service = allServices.find(s => s.id === id);
    if (service) {
        alert(`Generate Sessions for: ${service.name}\n\nThis would open a dialog to select date range and generate sessions.`);
    }
}

function showQuickActions(id) {
    const service = allServices.find(s => s.id === id);
    if (service) {
        const action = prompt(`Quick Actions for "${service.name}":\n\n1. View Details\n2. Generate Sessions\n3. ${service.status === 'active' ? 'Pause' : 'Activate'}\n4. Archive\n\nEnter number:`);

        switch (action) {
            case '1':
                viewServiceDetail(id);
                break;
            case '2':
                generateSessions(id);
                break;
            case '3':
                toggleStatus(id);
                break;
            case '4':
                archiveService(id);
                break;
        }
    }
}

function toggleStatus(id) {
    const service = allServices.find(s => s.id === id);
    if (service) {
        service.status = service.status === 'active' ? 'paused' : 'active';
        service.updatedAt = new Date().toISOString();
        saveServices();
        applyFilters();
        updateStats();
    }
}

function archiveService(id) {
    const service = allServices.find(s => s.id === id);
    if (service && confirm(`Are you sure you want to archive "${service.name}"?`)) {
        service.status = 'archived';
        service.updatedAt = new Date().toISOString();
        saveServices();
        applyFilters();
        updateStats();
    }
}

function saveServices() {
    localStorage.setItem('fms_learning_services', JSON.stringify(allServices));
}


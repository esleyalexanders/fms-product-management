/**
 * Job List Simple Script
 * Matches the UX/UI pattern of invoice_list_simple.html
 */

// Mock job data
const jobs = [
    {
        id: 'JOB-2024-001',
        customerName: 'Alice Johnson',
        customerEmail: 'alice.j@email.com',
        serviceName: 'Advanced Math - Semester 1',
        sessionsName: 'Math Cohort A - Fall 2024',
        serviceType: 'subscription',
        schedulePattern: 'Every Mon 5:00 PM',
        nextSession: '2024-12-02',
        status: 'active',
        paymentStatus: 'good',
        staff: 'Dr. Smith',
        enrollmentDate: '2024-11-01'
    },
    {
        id: 'JOB-2024-002',
        customerName: 'Bob Brown',
        customerEmail: 'bob.b@email.com',
        serviceName: 'Physics 101 - Cohort A',
        sessionsName: 'Physics Afternoon Sessions',
        serviceType: 'subscription',
        schedulePattern: 'Every Tue, Thu 3:00 PM',
        nextSession: null,
        status: 'inactive',
        paymentStatus: 'overdue',
        overdueAmount: 150.00,
        staff: 'Prof. X',
        enrollmentDate: '2024-11-02',
        autoDeactivated: true,
        deactivationReason: 'Overdue payment exceeds $100'
    },
    {
        id: 'JOB-2024-003',
        customerName: 'Charlie Davis',
        customerEmail: 'charlie.d@email.com',
        serviceName: 'Piano Basics',
        sessionsName: 'Piano Beginner Course - Nov 2024',
        serviceType: 'one-off',
        schedulePattern: 'Wed 10:00 AM (4 Sessions)',
        nextSession: '2024-12-04',
        status: 'active',
        paymentStatus: 'good',
        staff: 'Ms. Melody',
        enrollmentDate: '2024-11-03'
    },
    {
        id: 'JOB-2024-004',
        customerName: 'Diana Prince',
        customerEmail: 'diana.p@email.com',
        serviceName: 'Chemistry Lab',
        sessionsName: null,
        serviceType: 'subscription',
        schedulePattern: 'Fridays 2:00 PM',
        nextSession: null,
        status: 'incomplete',
        paymentStatus: 'good',
        staff: null,
        enrollmentDate: '2024-11-04',
        incompleteReason: 'not_linked', // Not linked to any learning service yet
        linkedService: null
    },
    {
        id: 'JOB-2024-009',
        customerName: 'Ivy Irwin',
        customerEmail: 'ivy.i@email.com',
        serviceName: 'Biology 201',
        sessionsName: 'Biology Advanced - Winter Term',
        serviceType: 'subscription',
        schedulePattern: 'Every Wed 1:00 PM',
        nextSession: null,
        status: 'incomplete',
        paymentStatus: 'good',
        staff: 'Dr. Watson',
        enrollmentDate: '2024-11-07',
        incompleteReason: 'no_future_sessions', // Linked to service but no future sessions scheduled
        linkedService: 'LS-2024-015'
    },
    {
        id: 'JOB-2024-005',
        customerName: 'Evan Wright',
        customerEmail: 'evan.w@email.com',
        serviceName: 'Creative Writing',
        sessionsName: 'Writing Workshop - Fall',
        serviceType: 'subscription',
        schedulePattern: 'Every Sat 11:00 AM',
        nextSession: null,
        status: 'inactive',
        paymentStatus: 'good',
        staff: 'Mr. Poe',
        enrollmentDate: '2024-10-15'
    },
    {
        id: 'JOB-2024-006',
        customerName: 'Frank Castle',
        customerEmail: 'frank.c@email.com',
        serviceName: 'Self Defense 101',
        sessionsName: 'Combat Training - Evening',
        serviceType: 'subscription',
        schedulePattern: 'Mon, Wed 6:00 PM',
        nextSession: '2024-12-02',
        status: 'active',
        paymentStatus: 'overdue',
        overdueAmount: 75.00,
        staff: 'Coach T',
        enrollmentDate: '2024-11-01'
    },
    {
        id: 'JOB-2024-007',
        customerName: 'Grace Green',
        customerEmail: 'grace.g@email.com',
        serviceName: 'Spanish Conversation',
        sessionsName: 'Spanish Intermediate - Thu PM',
        serviceType: 'subscription',
        schedulePattern: 'Every Thu 4:00 PM',
        nextSession: '2024-12-05',
        status: 'active',
        paymentStatus: 'good',
        staff: 'Ms. Garcia',
        enrollmentDate: '2024-11-05'
    },
    {
        id: 'JOB-2024-008',
        customerName: 'Henry Hill',
        customerEmail: 'henry.h@email.com',
        serviceName: 'Guitar Lessons',
        sessionsName: 'Guitar Intensive - Weekend',
        serviceType: 'one-off',
        schedulePattern: 'Sat 2:00 PM (6 Sessions)',
        nextSession: '2024-12-07',
        status: 'active',
        paymentStatus: 'good',
        staff: 'Mr. Rock',
        enrollmentDate: '2024-11-06'
    },
    {
        id: 'JOB-2024-010',
        customerName: 'Jane Martinez',
        customerEmail: 'jane.m@email.com',
        serviceName: 'English Literature - Advanced',
        sessionsName: null,
        serviceType: 'subscription',
        schedulePattern: 'Not yet scheduled',
        nextSession: null,
        status: 'incomplete',
        paymentStatus: 'not_setup',
        staff: null,
        enrollmentDate: '2024-11-08',
        incompleteReason: 'not_linked', // Not linked to any sessions yet
        linkedService: null,
        paymentSetup: false // Payment method not configured
    }
];

let currentPage = 1;
const itemsPerPage = 10;
let filteredJobs = [...jobs];
let currentStatusFilter = 'all';
let currentServiceTypeFilter = 'all';

// Initialize page
function initializePage() {
    updateKPIs();
    updateTabCounts();
    renderJobs();
}

// Update KPI cards
function updateKPIs() {
    const total = jobs.length;
    const active = jobs.filter(j => j.status === 'active').length;
    const incomplete = jobs.filter(j => j.status === 'incomplete').length;
    const overdue = jobs.filter(j => j.paymentStatus === 'overdue');
    const overdueTotal = overdue.reduce((sum, j) => sum + (j.overdueAmount || 0), 0);
    const subscriptions = jobs.filter(j => j.serviceType === 'subscription' && j.status === 'active').length;

    document.getElementById('totalJobs').textContent = total;
    document.getElementById('activeJobsCount').textContent = active;
    document.getElementById('actionNeeded').textContent = incomplete;
    document.getElementById('incompleteCount').textContent = incomplete;
    document.getElementById('overdueAmount').textContent = `$${overdueTotal.toFixed(2)}`;
    document.getElementById('overdueJobsCount').textContent = overdue.length;
    document.getElementById('subscriptionCount').textContent = subscriptions;
}

// Update tab counts
function updateTabCounts() {
    document.getElementById('allCount').textContent = jobs.length;
    document.getElementById('activeTabCount').textContent = jobs.filter(j => j.status === 'active').length;
    document.getElementById('incompleteTabCount').textContent = jobs.filter(j => j.status === 'incomplete').length;
    document.getElementById('inactiveCount').textContent = jobs.filter(j => j.status === 'inactive').length;
    document.getElementById('overdueTabCount').textContent = jobs.filter(j => j.paymentStatus === 'overdue').length;
}

// Get status badge HTML
function getStatusBadge(status) {
    const badges = {
        active: '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-green-100 text-green-700">Active</span>',
        incomplete: '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-yellow-100 text-yellow-700">Incomplete</span>',
        inactive: '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-700">Inactive</span>',
        overdue: '<span class="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-100 text-red-700">Payment Issue</span>'
    };
    return badges[status] || '';
}

// Get service type badge
function getServiceTypeBadge(type) {
    const badges = {
        subscription: '<span class="text-xs px-2 py-1 bg-blue-50 text-blue-700 rounded">Subscription</span>',
        'one-off': '<span class="text-xs px-2 py-1 bg-purple-50 text-purple-700 rounded">One-off</span>'
    };
    return badges[type] || '';
}

// Render jobs
function renderJobs() {
    const container = document.getElementById('jobsContainer');
    const emptyState = document.getElementById('emptyState');

    if (filteredJobs.length === 0) {
        container.innerHTML = '';
        emptyState.classList.remove('hidden');
        return;
    }

    emptyState.classList.add('hidden');

    const startIndex = (currentPage - 1) * itemsPerPage;
    const endIndex = Math.min(startIndex + itemsPerPage, filteredJobs.length);
    const pageJobs = filteredJobs.slice(startIndex, endIndex);

    container.innerHTML = pageJobs.map(job => {
        const displayStatus = job.paymentStatus === 'overdue' ? 'overdue' : job.status;
        const overdueWarning = job.paymentStatus === 'overdue' ?
            `<div class="text-red-600 font-medium mt-1">⚠️ Payment Overdue: $${job.overdueAmount.toFixed(2)}</div>` : '';

        let incompleteWarning = '';
        if (job.status === 'incomplete' && job.incompleteReason) {
            if (job.incompleteReason === 'not_linked') {
                incompleteWarning = '<div class="text-amber-600 font-medium mt-1">⚠️ Not linked to Sessions yet</div>';
            } else if (job.incompleteReason === 'no_future_sessions') {
                incompleteWarning = `<div class="text-amber-600 font-medium mt-1">⚠️ Linked to ${job.linkedService} but no future sessions</div>`;
            }
        }

        // Auto-deactivation warning
        let deactivationWarning = '';
        if (job.autoDeactivated && job.deactivationReason) {
            deactivationWarning = `<div class="text-red-600 font-medium mt-1">🚫 Auto-deactivated: ${job.deactivationReason}</div>`;
        }

        return `
        <div class="job-card" onclick="viewJob('${job.id}')">
            <div class="flex items-start justify-between gap-4">
                <!-- Left: Job Info -->
                <div class="flex-1 min-w-0">
                    <div class="flex items-center gap-3 mb-2">
                        <h3 class="text-lg font-semibold text-gray-900">${job.id}</h3>
                        ${getStatusBadge(displayStatus)}
                        ${getServiceTypeBadge(job.serviceType)}
                    </div>
                    <div class="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"></path>
                            </svg>
                            <span class="font-medium">${job.customerName}</span>
                        </div>
                        <span class="text-gray-400">•</span>
                        <div class="flex items-center gap-1">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"></path>
                            </svg>
                            <span>${job.serviceName}</span>
                        </div>
                    </div>
                    ${job.sessionsName ? `<div class="text-sm text-indigo-600 font-medium mb-2">📚 Sessions: ${job.sessionsName}</div>` : ''}
                    <div class="flex items-center gap-2 text-xs text-gray-500">
                        <div class="flex items-center gap-1 text-blue-600 font-medium">
                            <i class="fas fa-clock"></i>
                            <span>${job.schedulePattern}</span>
                        </div>
                        ${job.staff ? `<span class="text-gray-400">•</span><span>Staff: ${job.staff}</span>` : '<span class="text-amber-600">• No staff assigned</span>'}
                    </div>
                </div>

                <!-- Right: Next Session & Actions -->
                <div class="text-right">
                    <div class="text-sm font-medium text-gray-900 mb-1">
                        ${job.nextSession ? `Next: ${new Date(job.nextSession).toLocaleDateString()}` : 'No sessions scheduled'}
                    </div>
                    <div class="text-xs text-gray-500">
                        Enrolled: ${new Date(job.enrollmentDate).toLocaleDateString()}
                        ${overdueWarning}
                        ${incompleteWarning}
                        ${deactivationWarning}
                    </div>
                </div>
            </div>
        </div>
    `;
    }).join('');

    updatePagination();
}

// Update pagination
function updatePagination() {
    const total = filteredJobs.length;
    const start = (currentPage - 1) * itemsPerPage + 1;
    const end = Math.min(start + itemsPerPage - 1, total);

    document.getElementById('showingFrom').textContent = start;
    document.getElementById('showingTo').textContent = end;
    document.getElementById('totalJobsCount').textContent = total;

    document.getElementById('prevBtn').disabled = currentPage === 1;
    document.getElementById('nextBtn').disabled = end >= total;
}

// Filter by status
function filterByStatus(status) {
    currentStatusFilter = status;

    // Update active tab
    document.querySelectorAll('.tab-button').forEach(btn => {
        btn.classList.remove('active');
        if (btn.dataset.status === status) {
            btn.classList.add('active');
        }
    });

    applyFilters();
}

// Filter by service type
function filterByServiceType(type) {
    currentServiceTypeFilter = type;

    // Update active button
    document.querySelectorAll('.service-type-btn').forEach(btn => {
        btn.classList.remove('bg-blue-50', 'border-blue-300', 'text-blue-700');
        btn.classList.add('border-gray-300');
    });

    if (type === 'all') {
        document.getElementById('filterAllTypes').classList.add('bg-blue-50', 'border-blue-300', 'text-blue-700');
    } else if (type === 'subscription') {
        document.getElementById('filterSubscription').classList.add('bg-blue-50', 'border-blue-300', 'text-blue-700');
    } else if (type === 'one-off') {
        document.getElementById('filterOneOff').classList.add('bg-blue-50', 'border-blue-300', 'text-blue-700');
    }

    applyFilters();
}

// Apply combined filters
function applyFilters() {
    // Start with all jobs
    let filtered = [...jobs];

    // Apply status filter
    if (currentStatusFilter !== 'all') {
        if (currentStatusFilter === 'overdue') {
            filtered = filtered.filter(j => j.paymentStatus === 'overdue');
        } else {
            filtered = filtered.filter(j => j.status === currentStatusFilter);
        }
    }

    // Apply service type filter
    if (currentServiceTypeFilter !== 'all') {
        filtered = filtered.filter(j => j.serviceType === currentServiceTypeFilter);
    }

    filteredJobs = filtered;
    currentPage = 1;
    renderJobs();
}

// Change page
function changePage(direction) {
    const maxPage = Math.ceil(filteredJobs.length / itemsPerPage);
    currentPage += direction;

    if (currentPage < 1) currentPage = 1;
    if (currentPage > maxPage) currentPage = maxPage;

    renderJobs();
}

// View job
function viewJob(jobId) {
    // Navigate to job detail page
    window.location.href = `job_detail_simple.html?id=${jobId}`;
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializePage);

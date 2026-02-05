/**
 * Job Detail Simple Script
 * Displays detailed information for a single job
 */

// Mock job data - in production, this would be fetched from the server
const jobData = {
    id: 'JOB-2024-001',
    customerName: 'Alice Johnson',
    customerEmail: 'alice.j@email.com',
    customerId: 'CUST-001',
    serviceName: 'Advanced Math - Semester 1',
    sessionsName: 'Math Cohort A - Fall 2024',
    sessionsId: 'LS-2024-001',
    serviceType: 'subscription',
    schedulePattern: 'Every Mon 5:00 PM',
    nextSession: '2024-12-02',
    status: 'active', // 'active', 'inactive', 'incomplete'
    paymentStatus: 'good', // 'good', 'overdue'
    overdueAmount: 0,
    staff: 'Dr. Smith',
    staffId: 'STAFF-001',
    enrollmentDate: '2024-11-01',
    quoteId: 'Q-2024-001',
    invoiceId: 'INV-2024-001',
    invoiceStatus: 'paid',
    invoicePaidDate: '2024-11-15',
    incompleteReason: null, // 'not_linked', 'no_future_sessions', null
    linkedService: 'LS-2024-001',
    autoDeactivated: false,
    deactivationReason: null,
    activityLog: [
        {
            date: '2024-11-20',
            time: '10:30 AM',
            action: 'Session completed',
            description: 'Session on Nov 20, 2024 marked as completed',
            icon: 'check-circle',
            color: 'green'
        },
        {
            date: '2024-11-15',
            time: '2:15 PM',
            action: 'Payment received',
            description: 'Invoice INV-2024-001 paid via Stripe',
            icon: 'credit-card',
            color: 'blue'
        },
        {
            date: '2024-11-10',
            time: '9:00 AM',
            action: 'Invoice generated',
            description: 'Monthly invoice INV-2024-001 created',
            icon: 'file-invoice',
            color: 'purple'
        },
        {
            date: '2024-11-01',
            time: '3:45 PM',
            action: 'Job created',
            description: 'Job created from Quote Q-2024-001',
            icon: 'briefcase',
            color: 'gray'
        }
    ]
};

// Alternative job data examples for testing different states
const jobDataExamples = {
    incomplete_not_linked: {
        ...jobData,
        id: 'JOB-2024-004',
        customerName: 'Diana Prince',
        customerEmail: 'diana.p@email.com',
        customerId: 'CUST-004',
        serviceName: 'Chemistry Lab',
        sessionsName: null,
        sessionsId: null,
        status: 'incomplete',
        incompleteReason: 'not_linked',
        linkedService: null,
        nextSession: null,
        schedulePattern: 'Not yet scheduled',
        staff: null,
        staffId: null,
        quoteId: 'Q-2024-004',
        invoiceId: 'INV-2024-004',
        invoiceStatus: 'unpaid',
        activityLog: [
            {
                date: '2024-11-04',
                time: '3:45 PM',
                action: 'Job created',
                description: 'Job created from Quote Q-2024-004',
                icon: 'briefcase',
                color: 'gray'
            }
        ]
    },
    incomplete_no_sessions: {
        ...jobData,
        id: 'JOB-2024-009',
        customerName: 'Ivy Irwin',
        customerEmail: 'ivy.i@email.com',
        customerId: 'CUST-009',
        serviceName: 'Biology 201',
        sessionsName: 'Biology Advanced - Winter Term',
        sessionsId: 'LS-2024-015',
        status: 'incomplete',
        incompleteReason: 'no_future_sessions',
        linkedService: 'LS-2024-015',
        nextSession: null,
        schedulePattern: 'Every Wed 1:00 PM',
        activityLog: [
            {
                date: '2024-11-07',
                time: '10:00 AM',
                action: 'Linked to sessions',
                description: 'Job linked to LS-2024-015',
                icon: 'briefcase',
                color: 'blue'
            },
            {
                date: '2024-11-07',
                time: '9:30 AM',
                action: 'Job created',
                description: 'Job created from Quote Q-2024-009',
                icon: 'briefcase',
                color: 'gray'
            }
        ]
    },
    overdue_payment: {
        ...jobData,
        id: 'JOB-2024-002',
        customerName: 'Bob Brown',
        customerEmail: 'bob.b@email.com',
        customerId: 'CUST-002',
        serviceName: 'Physics 101 - Cohort A',
        status: 'inactive',
        paymentStatus: 'overdue',
        overdueAmount: 150.00,
        autoDeactivated: true,
        deactivationReason: 'Overdue payment exceeds $100',
        activityLog: [
            {
                date: '2024-11-20',
                time: '12:00 PM',
                action: 'Job auto-deactivated',
                description: 'Automatically deactivated due to overdue payment',
                icon: 'briefcase',
                color: 'red'
            },
            {
                date: '2024-11-15',
                time: '9:00 AM',
                action: 'Payment overdue',
                description: 'Invoice INV-2024-002 is now overdue',
                icon: 'credit-card',
                color: 'red'
            },
            {
                date: '2024-11-02',
                time: '3:45 PM',
                action: 'Job created',
                description: 'Job created from Quote Q-2024-002',
                icon: 'briefcase',
                color: 'gray'
            }
        ]
    },
    no_payment_setup: {
        ...jobData,
        id: 'JOB-2024-010',
        customerName: 'Jane Martinez',
        customerEmail: 'jane.m@email.com',
        customerId: 'CUST-010',
        serviceName: 'English Literature - Advanced',
        sessionsName: null,
        sessionsId: null,
        serviceType: 'subscription',
        schedulePattern: 'Not yet scheduled',
        nextSession: null,
        status: 'incomplete',
        paymentStatus: 'not_setup',
        overdueAmount: 0,
        staff: null,
        staffId: null,
        enrollmentDate: '2024-11-08',
        quoteId: 'Q-2024-010',
        invoiceId: null,
        invoiceStatus: null,
        invoicePaidDate: null,
        incompleteReason: 'not_linked',
        linkedService: null,
        autoDeactivated: false,
        deactivationReason: null,
        paymentSetup: false,
        activityLog: [
            {
                date: '2024-11-08',
                time: '2:30 PM',
                action: 'Job created',
                description: 'Job created from Quote Q-2024-010 - awaiting sessions and payment setup',
                icon: 'briefcase',
                color: 'yellow'
            }
        ]
    }
};

// Initialize page
function initializePage() {
    // Get job ID from URL
    const jobId = getJobIdFromUrl();

    // In production, fetch job data from server
    // For now, use mock data
    const job = getJobData(jobId);

    if (!job) {
        alert('Job not found');
        window.location.href = 'job_list_simple.html';
        return;
    }

    populateJobDetails(job);
    renderActivityLog(job.activityLog);
}

// Get job ID from URL
function getJobIdFromUrl() {
    const urlParams = new URLSearchParams(window.location.search);
    return urlParams.get('id') || 'JOB-2024-001';
}

// Get job data (mock - in production, fetch from server)
function getJobData(jobId) {
    // For demo purposes, return different job states based on ID
    if (jobId === 'JOB-2024-004') {
        return jobDataExamples.incomplete_not_linked;
    } else if (jobId === 'JOB-2024-009') {
        return jobDataExamples.incomplete_no_sessions;
    } else if (jobId === 'JOB-2024-002') {
        return jobDataExamples.overdue_payment;
    } else if (jobId === 'JOB-2024-010') {
        return jobDataExamples.no_payment_setup;
    }
    return jobData;
}

// Populate job details
function populateJobDetails(job) {
    // Header
    document.getElementById('jobNumber').textContent = job.id;

    // Status badge
    const statusBadge = document.getElementById('statusBadge');
    const statusConfig = {
        active: { text: 'Active', class: 'bg-green-100 text-green-700' },
        inactive: { text: 'Inactive', class: 'bg-gray-100 text-gray-700' },
        incomplete: { text: 'Incomplete', class: 'bg-yellow-100 text-yellow-700' }
    };
    const status = statusConfig[job.status] || statusConfig.active;
    statusBadge.textContent = status.text;
    statusBadge.className = `px-3 py-1.5 text-sm font-medium rounded-full ${status.class}`;

    // Service type badge
    const serviceTypeBadge = document.getElementById('serviceTypeBadge');
    const typeConfig = {
        subscription: { text: 'Subscription', class: 'bg-purple-100 text-purple-700' },
        'one-off': { text: 'One-off', class: 'bg-blue-100 text-blue-700' }
    };
    const type = typeConfig[job.serviceType] || typeConfig.subscription;
    serviceTypeBadge.textContent = type.text;
    serviceTypeBadge.className = `px-3 py-1.5 text-sm font-medium rounded-full ${type.class}`;

    // Customer information
    document.getElementById('customerName').textContent = job.customerName;
    document.getElementById('customerEmail').textContent = job.customerEmail;

    // Service details
    document.getElementById('serviceName').textContent = job.serviceName;
    document.getElementById('enrollmentDate').textContent = new Date(job.enrollmentDate).toLocaleDateString();
    document.getElementById('assignedStaff').textContent = job.staff || 'Not assigned';
    document.getElementById('serviceTypeDisplay').textContent = type.text;

    // Sessions information
    const sessionsInfo = document.getElementById('sessionsInfo');
    const incompleteWarning = document.getElementById('incompleteWarning');

    if (job.sessionsName) {
        document.getElementById('sessionsName').textContent = job.sessionsName;
        document.getElementById('schedulePattern').innerHTML = `<i class="fas fa-clock mr-1"></i>${job.schedulePattern}`;
        sessionsInfo.classList.remove('hidden');

        // Check for incomplete status
        if (job.status === 'incomplete' && job.incompleteReason === 'no_future_sessions') {
            incompleteWarning.classList.remove('hidden');
            document.getElementById('incompleteTitle').textContent = 'No Future Sessions';
            document.getElementById('incompleteMessage').textContent = `Linked to ${job.linkedService} but no future sessions scheduled`;
            document.getElementById('linkSessionsBtn').textContent = 'Schedule Sessions';
        }
    } else {
        sessionsInfo.classList.add('hidden');

        if (job.status === 'incomplete' && job.incompleteReason === 'not_linked') {
            incompleteWarning.classList.remove('hidden');
            document.getElementById('incompleteTitle').textContent = 'Not Linked to Sessions';
            document.getElementById('incompleteMessage').textContent = 'This job is not yet linked to any sessions';
            document.getElementById('linkSessionsBtn').textContent = 'Link to Sessions';
        }
    }

    // Schedule & Next Session
    document.getElementById('schedulePatternDisplay').innerHTML = `<i class="fas fa-clock mr-1"></i>${job.schedulePattern}`;

    const nextSessionEl = document.getElementById('nextSession');
    const noSessionsWarning = document.getElementById('noSessionsWarning');

    if (job.nextSession) {
        nextSessionEl.textContent = new Date(job.nextSession).toLocaleDateString();
        nextSessionEl.classList.remove('text-gray-500');
        nextSessionEl.classList.add('text-green-600', 'font-bold');
        noSessionsWarning.classList.add('hidden');
    } else {
        nextSessionEl.textContent = 'No sessions scheduled';
        nextSessionEl.classList.remove('text-green-600', 'font-bold');
        nextSessionEl.classList.add('text-gray-500');
        noSessionsWarning.classList.remove('hidden');
    }

    // Related documents
    document.getElementById('relatedQuote').textContent = job.quoteId;

    if (job.invoiceId) {
        document.getElementById('relatedInvoice').textContent = job.invoiceId;

        if (job.invoiceStatus === 'paid' && job.invoicePaidDate) {
            document.getElementById('invoiceStatus').textContent = `Paid on ${new Date(job.invoicePaidDate).toLocaleDateString()}`;
        } else if (job.invoiceStatus === 'unpaid') {
            document.getElementById('invoiceStatus').textContent = 'Unpaid';
        }
    } else {
        document.getElementById('relatedInvoice').textContent = 'Not created yet';
        document.getElementById('invoiceStatus').textContent = 'Invoice pending';
    }

    // Payment status
    const paymentStatusCard = document.getElementById('paymentStatusCard');
    const overdueWarning = document.getElementById('overdueWarning');
    const autoDeactivationWarning = document.getElementById('autoDeactivationWarning');

    if (job.paymentStatus === 'overdue') {
        paymentStatusCard.classList.add('hidden');
        overdueWarning.classList.remove('hidden');
        document.getElementById('overdueAmount').textContent = `$${job.overdueAmount.toFixed(2)}`;
        document.getElementById('overdueMessage').textContent = 'Payment is overdue';

        if (job.autoDeactivated && job.deactivationReason) {
            autoDeactivationWarning.classList.remove('hidden');
            document.getElementById('deactivationReason').textContent = job.deactivationReason;
        }
    } else if (job.paymentStatus === 'not_setup') {
        // Payment not configured yet
        paymentStatusCard.classList.remove('hidden');
        paymentStatusCard.className = 'p-4 bg-yellow-50 rounded-lg border border-yellow-200 mb-4';
        document.getElementById('paymentStatus').textContent = 'Payment Not Setup';
        document.getElementById('paymentStatus').className = 'text-xl font-bold text-yellow-700';
        document.getElementById('paymentDetails').textContent = 'Payment method not configured yet';
        overdueWarning.classList.add('hidden');
        autoDeactivationWarning.classList.add('hidden');
    } else {
        paymentStatusCard.classList.remove('hidden');
        paymentStatusCard.className = 'p-4 bg-green-50 rounded-lg border border-green-200 mb-4';
        overdueWarning.classList.add('hidden');
        autoDeactivationWarning.classList.add('hidden');
        document.getElementById('paymentStatus').textContent = 'Good Standing';
        document.getElementById('paymentStatus').className = 'text-xl font-bold text-green-700';
        document.getElementById('paymentDetails').textContent = 'All payments up to date';
    }

    // Hide deactivate button for inactive jobs
    const deactivateBtn = document.getElementById('deactivateJobBtn');
    if (job.status === 'inactive') {
        deactivateBtn.style.display = 'none';
    } else {
        deactivateBtn.style.display = 'flex';
    }
}

// Render activity log
function renderActivityLog(activities) {
    const container = document.getElementById('activityLog');

    if (!activities || activities.length === 0) {
        container.innerHTML = '<div class="text-sm text-gray-500 text-center py-4">No recent activity</div>';
        return;
    }

    const iconMap = {
        'check-circle': 'M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z',
        'credit-card': 'M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z',
        'file-invoice': 'M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        'briefcase': 'M21 13.255A23.931 23.931 0 0112 15c-3.183 0-6.22-.62-9-1.745M16 6V4a2 2 0 00-2-2h-4a2 2 0 00-2 2v2m4 6h.01M5 20h14a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z'
    };

    const colorMap = {
        green: 'bg-green-100 text-green-600',
        blue: 'bg-blue-100 text-blue-600',
        purple: 'bg-purple-100 text-purple-600',
        gray: 'bg-gray-100 text-gray-600',
        red: 'bg-red-100 text-red-600',
        yellow: 'bg-yellow-100 text-yellow-600'
    };

    container.innerHTML = activities.map(activity => {
        const iconPath = iconMap[activity.icon] || iconMap['briefcase'];
        const colorClass = colorMap[activity.color] || colorMap['gray'];

        return `
            <div class="flex gap-3">
                <div class="flex-shrink-0">
                    <div class="w-8 h-8 rounded-full ${colorClass} flex items-center justify-center">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="${iconPath}"></path>
                        </svg>
                    </div>
                </div>
                <div class="flex-1 min-w-0">
                    <div class="text-sm font-medium text-gray-900">${activity.action}</div>
                    <div class="text-xs text-gray-500 mt-0.5">${activity.description}</div>
                    <div class="text-xs text-gray-400 mt-1">${new Date(activity.date).toLocaleDateString()} at ${activity.time}</div>
                </div>
            </div>
        `;
    }).join('');
}

// Navigation functions
function viewCustomer() {
    const job = getJobData(getJobIdFromUrl());
    window.location.href = `../Customer Management/customer-detail.html?id=${job.customerId}`;
}

function viewSessions() {
    const job = getJobData(getJobIdFromUrl());
    if (job.sessionsId) {
        window.location.href = `service_job_v3/session_detail.html?id=${job.sessionsId}`;
    } else {
        alert('No sessions linked to this job');
    }
}

function viewSchedule() {
    window.location.href = 'service_job_v3/schedule_calendar.html';
}

function viewQuote() {
    const job = getJobData(getJobIdFromUrl());
    window.location.href = `../[v2] Quotes/quote_simple/quote_edit_simple.html?id=${job.quoteId}`;
}

function viewInvoice() {
    const job = getJobData(getJobIdFromUrl());
    window.location.href = `../[v2] Quotes/quote_simple/invoice_detail_simple.html?id=${job.invoiceId}`;
}

function viewInvoiceHistory() {
    const job = getJobData(getJobIdFromUrl());
    window.location.href = `../[v2] Quotes/quote_simple/invoice_list_simple.html?customer=${job.customerId}`;
}

// Action functions
function contactCustomer() {
    const job = getJobData(getJobIdFromUrl());
    window.location.href = `mailto:${job.customerEmail}?subject=Regarding ${job.serviceName}`;
}

function rescheduleSession() {
    alert('Reschedule session functionality - would open a modal to select new date/time');
}

function sendPaymentReminder() {
    const job = getJobData(getJobIdFromUrl());
    alert(`Payment reminder sent to ${job.customerEmail}`);
}

// Edit job
document.getElementById('editJobBtn').addEventListener('click', () => {
    const jobId = getJobIdFromUrl();
    alert(`Edit job functionality - would navigate to edit page for ${jobId}`);
    // In production: window.location.href = `job_edit_simple.html?id=${jobId}`;
});

// Link sessions button
document.addEventListener('click', (e) => {
    if (e.target && e.target.id === 'linkSessionsBtn') {
        const job = getJobData(getJobIdFromUrl());
        if (job.incompleteReason === 'not_linked') {
            alert('Link to Sessions functionality - would open a modal to select/create sessions');
        } else if (job.incompleteReason === 'no_future_sessions') {
            alert('Schedule Sessions functionality - would navigate to sessions page to add sessions');
        }
    }
});

// Deactivate job
document.getElementById('deactivateJobBtn').addEventListener('click', () => {
    document.getElementById('deactivateModal').classList.remove('hidden');
});

function closeDeactivateModal() {
    document.getElementById('deactivateModal').classList.add('hidden');
}

function confirmDeactivate() {
    const reason = document.getElementById('deactivationReasonSelect').value;
    const notes = document.getElementById('deactivationNotes').value;

    if (!reason) {
        alert('Please select a reason for deactivation');
        return;
    }

    console.log('Deactivating job:', {
        jobId: getJobIdFromUrl(),
        reason: reason,
        notes: notes,
        timestamp: new Date().toISOString()
    });

    alert('Job deactivated successfully!');
    closeDeactivateModal();

    // In production: update job status and reload page
    window.location.reload();
}

// Initialize on page load
document.addEventListener('DOMContentLoaded', initializePage);

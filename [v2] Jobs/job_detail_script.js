// ============================================================================
// JOB DETAIL SCRIPT
// ============================================================================

// Load job data from URL parameter and localStorage
function loadJobData() {
    const urlParams = new URLSearchParams(window.location.search);
    const jobId = urlParams.get('id');
    
    if (jobId) {
        // Try to load from localStorage first
        const savedJob = localStorage.getItem('job_' + jobId);
        if (savedJob) {
            return JSON.parse(savedJob);
        }
        
        // Try to load from currentJob if it matches
        const currentJob = localStorage.getItem('currentJob');
        if (currentJob) {
            const parsedJob = JSON.parse(currentJob);
            if (parsedJob.id === jobId) {
                return parsedJob;
            }
        }
    }
    
    // Return default sample data if no job found
    return null;
}

// Sample job data (fallback)
const defaultJobData = {
    id: 'JOB-2024-001',
    quoteId: 'Q-2024-001',
    customer: {
        name: 'Sarah Johnson',
        email: 'sarah.johnson@email.com',
        phone: '(555) 123-4567'
    },
    name: 'Tutoring Services - Complete Package',
    priority: 'high',
    scheduledDate: '2024-11-15',
    scheduledTime: '10:00',
    notes: 'Please arrive 10 minutes early to set up materials. Customer prefers morning sessions.',
    status: 'scheduled',
    items: [
        {
            id: 'item-1',
            name: 'Math Tutoring Session',
            description: '2 hours of advanced mathematics tutoring',
            quantity: 1,
            customPrice: 300,
            discount: 0,
            discountType: 'fixed',
            taxCategory: 'taxable_gst',
            category: 'Tutoring'
        },
        {
            id: 'item-2',
            name: 'Science Tutoring Session',
            description: '2 hours of science tutoring',
            quantity: 1,
            customPrice: 300,
            discount: 0,
            discountType: 'fixed',
            taxCategory: 'taxable_gst',
            category: 'Tutoring'
        },
        {
            id: 'item-3',
            name: 'English Tutoring Session',
            description: '2 hours of English and literature',
            quantity: 1,
            customPrice: 150,
            discount: 0,
            discountType: 'fixed',
            taxCategory: 'taxable_gst',
            category: 'Tutoring'
        }
    ],
    assignedStaff: [
        {
            id: 'staff-1',
            name: 'John Smith',
            role: 'Math Tutor',
            avatar: 'JS',
            color: 'blue'
        },
        {
            id: 'staff-2',
            name: 'Emily Davis',
            role: 'Science Tutor',
            avatar: 'ED',
            color: 'purple'
        }
    ],
    classMode: {
        enabled: true,
        name: 'Tuesday Yoga + Guitar Combo',
        capacity: 10,
        waitlistEnabled: true,
        pricebookItems: [
            { id: 'PB-YOGA-CLASS', name: 'Yoga Class - Group (per seat)' },
            { id: 'PB-GUITAR-SESSION', name: 'Guitar Workshop - Group (per seat)' }
        ],
        serviceMix: ['Yoga', 'Guitar']
    },
    participants: [
        {
            id: 'participant-1',
            name: 'Customer A',
            quoteId: 'Q-2024-010',
            services: ['Yoga'],
            status: 'confirmed'
        },
        {
            id: 'participant-2',
            name: 'Customer B',
            quoteId: 'Q-2024-011',
            services: ['Yoga'],
            status: 'pending_payment'
        },
        {
            id: 'participant-3',
            name: 'Customer C',
            quoteId: 'Q-2024-012',
            services: ['Yoga', 'Guitar'],
            status: 'confirmed'
        },
        {
            id: 'participant-4',
            name: 'Customer D',
            quoteId: 'Q-2024-013',
            services: ['Guitar'],
            status: 'waitlisted'
        }
    ],
    comments: [
        {
            id: 'comment-1',
            author: 'John Smith',
            avatar: 'JS',
            message: 'I\'ve reviewed the materials and everything looks good. Ready for the session!',
            timestamp: '2024-11-06T09:30:00',
            isCurrentUser: false
        },
        {
            id: 'comment-2',
            author: 'You',
            avatar: 'ME',
            message: 'Great! Please make sure to bring extra practice worksheets.',
            timestamp: '2024-11-06T09:45:00',
            isCurrentUser: true
        }
    ]
};

// Initialize job data
let jobData = loadJobData() || defaultJobData;
if (!jobData.classMode) {
    jobData.classMode = { enabled: false, pricebookItems: [], capacity: null, waitlistEnabled: false };
}
if (!Array.isArray(jobData.participants)) {
    jobData.participants = [];
}

// Related jobs from the same quote
const relatedJobs = [
    {
        id: 'JOB-2024-001',
        name: 'Tutoring Services',
        status: 'scheduled',
        total: 825.00,
        isCurrent: true
    },
    {
        id: 'JOB-2024-002',
        name: 'Materials Services',
        status: 'scheduled',
        total: 165.00,
        isCurrent: false
    },
    {
        id: 'JOB-2024-003',
        name: 'Assessment Services',
        status: 'pending',
        total: 110.00,
        isCurrent: false
    }
];

// Available staff for assignment
const availableStaff = [
    { id: 'staff-1', name: 'John Smith', role: 'Math Tutor', avatar: 'JS', color: 'blue', assigned: true, skills: ['Math', 'Algebra', 'Calculus'] },
    { id: 'staff-2', name: 'Emily Davis', role: 'Science Tutor', avatar: 'ED', color: 'purple', assigned: true, skills: ['Physics', 'Chemistry', 'Biology'] },
    { id: 'staff-3', name: 'Michael Brown', role: 'English Tutor', avatar: 'MB', color: 'green', assigned: false, skills: ['English', 'Literature', 'Writing'] },
    { id: 'staff-4', name: 'Sarah Wilson', role: 'General Tutor', avatar: 'SW', color: 'orange', assigned: false, skills: ['Math', 'English', 'General'] },
    { id: 'staff-5', name: 'David Lee', role: 'Math Tutor', avatar: 'DL', color: 'red', assigned: false, skills: ['Math', 'Statistics', 'Geometry'] }
];

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
            { id: 'staff-1', name: 'John Smith', role: 'Math Tutor', avatar: 'JS' },
            { id: 'staff-2', name: 'Emily Davis', role: 'Science Tutor', avatar: 'ED' },
            { id: 'staff-5', name: 'David Lee', role: 'Math Tutor', avatar: 'DL' }
        ]
    },
    { 
        id: 'team-2', 
        name: 'English & Literature Team', 
        type: 'team',
        avatar: 'ELT', 
        color: 'pink',
        skills: ['English', 'Literature', 'Writing', 'Grammar'],
        members: [
            { id: 'staff-3', name: 'Michael Brown', role: 'English Tutor', avatar: 'MB' },
            { id: 'staff-4', name: 'Sarah Wilson', role: 'General Tutor', avatar: 'SW' }
        ]
    },
    { 
        id: 'team-3', 
        name: 'All Subjects Team', 
        type: 'team',
        avatar: 'AST', 
        color: 'gray',
        skills: ['Math', 'Science', 'English', 'General'],
        members: [
            { id: 'staff-1', name: 'John Smith', role: 'Math Tutor', avatar: 'JS' },
            { id: 'staff-2', name: 'Emily Davis', role: 'Science Tutor', avatar: 'ED' },
            { id: 'staff-3', name: 'Michael Brown', role: 'English Tutor', avatar: 'MB' },
            { id: 'staff-4', name: 'Sarah Wilson', role: 'General Tutor', avatar: 'SW' },
            { id: 'staff-5', name: 'David Lee', role: 'Math Tutor', avatar: 'DL' }
        ]
    }
];

// Combined assignable entities (staff + teams)
function getAssignableEntities() {
    const individuals = availableStaff.map(staff => ({
        ...staff,
        type: 'individual',
        displayName: `${staff.name} (User)`
    }));
    
    const teams = availableTeams.map(team => ({
        ...team,
        displayName: `${team.name} (Team)`
    }));
    
    return [...individuals, ...teams];
}

// Selected assignments tracking
let selectedAssignments = [];

// ============================================================================
// TAX & CALCULATION HELPERS
// ============================================================================

function getTaxRate(taxCategory) {
    const taxRates = {
        'taxable_gst': 0.10,
        'gst_free': 0.00,
        'input_taxed': 0.00
    };
    return taxRates[taxCategory] || 0.10;
}

function calculateLineItemTax(item) {
    const taxRate = getTaxRate(item.taxCategory);
    const lineTotal = item.customPrice * item.quantity;
    const discountAmount = item.discountType === 'percentage' 
        ? lineTotal * (item.discount / 100)
        : item.discount;
    const lineAfterDiscount = lineTotal - discountAmount;
    return lineAfterDiscount * taxRate;
}

function calculateLineTotal(item) {
    const lineTotal = item.customPrice * item.quantity;
    const discountAmount = item.discountType === 'percentage' 
        ? lineTotal * (item.discount / 100)
        : item.discount;
    return lineTotal - discountAmount;
}

// ============================================================================
// INITIALIZATION
// ============================================================================

document.addEventListener('DOMContentLoaded', function() {
    loadJobDetails();
    renderJobItems();
    renderComments();
    renderRelatedJobs();
    attachEventListeners();
});

function loadJobDetails() {
    // Update header
    document.getElementById('jobIdDisplay').textContent = jobData.id;
    document.getElementById('quoteIdDisplay').textContent = jobData.quoteId;
    document.getElementById('customerDisplay').textContent = jobData.customer.name;
    
    // Calculate totals
    const subtotal = jobData.items.reduce((sum, item) => sum + calculateLineTotal(item), 0);
    const tax = jobData.items.reduce((sum, item) => sum + calculateLineItemTax(item), 0);
    const total = subtotal + tax;
    
    document.getElementById('jobTotalDisplay').textContent = `$${total.toFixed(2)}`;
    
    // Update status badge
    updateStatusBadge(jobData.status);
    
    // Load job details into form fields
    document.getElementById('jobName').value = jobData.name || '';
    
    // Set priority radio button
    const priorityRadio = document.querySelector(`input[name="priority"][value="${jobData.priority}"]`);
    if (priorityRadio) {
        priorityRadio.checked = true;
        updatePriorityBorders();
    }
    
    // Set schedule date
    if (jobData.scheduledDate) {
        document.getElementById('scheduleDate').value = jobData.scheduledDate;
    }
    
    // Set schedule time - using custom time
    if (jobData.scheduledTime) {
        document.getElementById('scheduleTimeSelect').value = 'custom';
        document.getElementById('customTimeContainer').classList.remove('hidden');
        document.getElementById('scheduleTime').value = jobData.scheduledTime;
    }
    
    // Set duration (calculate from items or use default)
    document.getElementById('durationHours').value = 6;
    document.getElementById('durationMinutes').value = 0;
    
    // Load assigned staff into selected staff
    if (jobData.assignedStaff && jobData.assignedStaff.length > 0) {
        selectedStaff = [...jobData.assignedStaff];
        renderSelectedStaff();
    }

    initializeClassJobSection();
}

function updatePriorityBorders() {
    const priorityInputs = document.querySelectorAll('input[name="priority"]');
    priorityInputs.forEach(input => {
        const label = input.closest('label');
        if (input.checked) {
            label.classList.remove('border-gray-200');
            if (input.value === 'high') {
                label.classList.add('border-red-500');
            } else if (input.value === 'medium') {
                label.classList.add('border-blue-500');
            } else if (input.value === 'low') {
                label.classList.add('border-green-500');
            }
        } else {
            label.classList.remove('border-red-500', 'border-blue-500', 'border-green-500');
            label.classList.add('border-gray-200');
        }
    });
}

function updateStatusBadge(status) {
    const statusBadge = document.getElementById('statusBadge');
    const statusMap = {
        'created': { icon: '📝', text: 'Created', class: 'bg-blue-100 text-blue-700 border-blue-200' },
        'scheduled': { icon: '📋', text: 'Scheduled', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
        'completed': { icon: '✅', text: 'Completed', class: 'bg-green-100 text-green-700 border-green-200' },
        'cancelled': { icon: '❌', text: 'Cancelled', class: 'bg-red-100 text-red-700 border-red-200' },
        'on_hold': { icon: '⏸️', text: 'On Hold', class: 'bg-gray-100 text-gray-700 border-gray-200' }
    };
    
    const statusInfo = statusMap[status] || statusMap['created'];
    statusBadge.className = `inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-medium border ${statusInfo.class}`;
    statusBadge.textContent = `${statusInfo.icon} ${statusInfo.text}`;
}

// ============================================================================
// RENDER FUNCTIONS
// ============================================================================

function renderJobItems() {
    const container = document.getElementById('jobItemsContainer');
    
    container.innerHTML = jobData.items.map(item => {
        const lineTotal = calculateLineTotal(item);
        const discountAmount = item.discountType === 'percentage' 
            ? (item.customPrice * item.quantity) * (item.discount / 100)
            : item.discount;
        
        let taxBadge = '';
        if (item.taxCategory) {
            const taxLabels = {
                'taxable_gst': '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-blue-50 text-blue-700">📋 GST (10%)</span>',
                'gst_free': '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-50 text-gray-600">GST-Free</span>',
                'input_taxed': '<span class="inline-flex items-center px-1.5 py-0.5 rounded text-xs bg-gray-50 text-gray-600">Input-Taxed</span>'
            };
            taxBadge = taxLabels[item.taxCategory] || '';
        }
        
        return `
            <div class="bg-gray-50 border border-gray-200 rounded-lg p-4">
                <div class="flex items-start justify-between mb-2">
                    <div class="flex-1">
                        <h4 class="font-semibold text-gray-900 text-sm">${item.name}</h4>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="text-xs px-1.5 py-0.5 bg-gray-200 text-gray-700 rounded">${item.category}</span>
                            ${taxBadge}
                        </div>
                    </div>
                    <div class="text-right">
                        <div class="text-lg font-bold text-gray-900">$${lineTotal.toFixed(2)}</div>
                        ${item.discount > 0 ? `<div class="text-xs text-green-600">-$${discountAmount.toFixed(2)} off</div>` : ''}
                    </div>
                </div>
                <p class="text-xs text-gray-600 mb-2">${item.description}</p>
                <div class="flex items-center gap-3 text-xs text-gray-500">
                    <span>Qty: ${item.quantity}</span>
                    <span>•</span>
                    <span>$${item.customPrice.toFixed(2)} each</span>
                </div>
            </div>
        `;
    }).join('');
    
    // Update financial summary
    updateFinancialSummary();
}

function initializeClassJobSection() {
    const card = document.getElementById('classSummaryCard');
    if (!card) return;

    if (!jobData.classMode || !jobData.classMode.enabled) {
        card.classList.add('hidden');
        return;
    }

    card.classList.remove('hidden');

    const classTitleEl = document.getElementById('classSummaryTitle');
    if (classTitleEl) {
        classTitleEl.textContent = jobData.classMode.name || 'Group Session';
    }

    const waitlistBadge = document.getElementById('classWaitlistBadge');
    if (waitlistBadge) {
        const waitlistEnabled = Boolean(jobData.classMode.waitlistEnabled);
        waitlistBadge.textContent = waitlistEnabled ? 'Waitlist Enabled' : 'Waitlist Disabled';
        waitlistBadge.className = `px-3 py-1 text-xs font-semibold rounded-full border ${
            waitlistEnabled
                ? 'bg-indigo-50 text-indigo-700 border-indigo-200'
                : 'bg-gray-100 text-gray-700 border-gray-200'
        }`;
    }

    updateClassOccupancy();
    renderClassPricebookBadges();
    renderClassParticipantRows();
}

function updateClassOccupancy() {
    const capacityLabel = document.getElementById('classCapacityLabel');
    const percentLabel = document.getElementById('classOccupancyPercent');
    const bar = document.getElementById('classOccupancyBar');

    if (!capacityLabel || !percentLabel || !bar) return;

    const capacity = jobData.classMode?.capacity || 0;
    const attendees = jobData.participants ? jobData.participants.length : 0;
    capacityLabel.textContent = capacity ? `${attendees} / ${capacity} seats` : `${attendees} seats`;

    const percent = capacity ? Math.min(100, Math.round((attendees / capacity) * 100)) : 100;
    percentLabel.textContent = `${percent}% full`;
    bar.style.width = `${percent}%`;
    bar.classList.toggle('bg-red-500', capacity && attendees > capacity);
}

function renderClassPricebookBadges() {
    const container = document.getElementById('classPricebookBadges');
    if (!container) return;

    const items = jobData.classMode?.pricebookItems || [];
    if (items.length === 0) {
        container.innerHTML = '<span class="text-xs text-gray-500">No pricebook items linked</span>';
        return;
    }

    container.innerHTML = items.map(item => `
        <span class="inline-flex items-center px-3 py-1 rounded-full text-xs bg-white border border-gray-200 text-gray-700">
            ${item.name || item.id}
        </span>
    `).join('');
}

function renderClassParticipantRows() {
    const container = document.getElementById('classParticipantRows');
    const counter = document.getElementById('classParticipantCounter');
    if (!container) return;

    const participants = jobData.participants || [];
    if (counter) {
        counter.textContent = `${participants.length} ${participants.length === 1 ? 'person' : 'people'}`;
    }

    if (participants.length === 0) {
        container.innerHTML = `
            <div class="border border-dashed border-gray-300 rounded-lg p-4 text-sm text-gray-500 text-center">
                No participants added yet.
            </div>
        `;
        return;
    }

    container.innerHTML = participants.map(participant => {
        const statusMeta = getParticipantStatusMeta(participant.status);
        const services = participant.services && participant.services.length
            ? participant.services.join(', ')
            : 'General';
        const quoteInfo = participant.quoteId ? `Quote ${participant.quoteId}` : 'No quote linked';

        return `
            <div class="border border-gray-200 rounded-lg p-4 bg-gray-50 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
                <div>
                    <p class="text-sm font-semibold text-gray-900">${participant.name}</p>
                    <p class="text-xs text-gray-600">${quoteInfo} • ${services}</p>
                </div>
                <span class="${statusMeta.className}">${statusMeta.label}</span>
            </div>
        `;
    }).join('');
}

function getParticipantStatusMeta(status) {
    const map = {
        confirmed: {
            label: 'Confirmed',
            className: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-green-100 text-green-700 border border-green-200'
        },
        pending_payment: {
            label: 'Pending Payment',
            className: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-amber-100 text-amber-700 border border-amber-200'
        },
        waitlisted: {
            label: 'Waitlisted',
            className: 'inline-flex items-center px-3 py-1 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 border border-gray-200'
        }
    };

    return map[status] || map.pending_payment;
}

function updateFinancialSummary() {
    const subtotal = jobData.items.reduce((sum, item) => sum + calculateLineTotal(item), 0);
    const tax = jobData.items.reduce((sum, item) => sum + calculateLineItemTax(item), 0);
    const total = subtotal + tax;
    
    document.getElementById('subtotalAmount').textContent = `$${subtotal.toFixed(2)}`;
    document.getElementById('taxAmount').textContent = `$${tax.toFixed(2)}`;
    document.getElementById('totalAmount').textContent = `$${total.toFixed(2)}`;
    
    // Tax breakdown
    const taxBreakdown = { taxable_gst: 0, gst_free: 0, input_taxed: 0 };
    jobData.items.forEach(item => {
        const taxAmount = calculateLineItemTax(item);
        if (item.taxCategory && taxBreakdown.hasOwnProperty(item.taxCategory)) {
            taxBreakdown[item.taxCategory] += taxAmount;
        } else {
            taxBreakdown.taxable_gst += taxAmount;
        }
    });
    
    let taxBreakdownHTML = '';
    if (taxBreakdown.taxable_gst > 0) {
        taxBreakdownHTML += `<div class="flex justify-between"><span>GST (10%):</span><span>$${taxBreakdown.taxable_gst.toFixed(2)}</span></div>`;
    }
    if (taxBreakdown.gst_free > 0) {
        taxBreakdownHTML += `<div class="flex justify-between text-gray-500"><span>GST-Free:</span><span>$0.00</span></div>`;
    }
    if (taxBreakdown.input_taxed > 0) {
        taxBreakdownHTML += `<div class="flex justify-between text-gray-500"><span>Input-Taxed:</span><span>$0.00</span></div>`;
    }
    
    document.getElementById('taxBreakdown').innerHTML = taxBreakdownHTML || '<div class="text-gray-400">No taxable items</div>';
}


function renderComments() {
    const container = document.getElementById('commentsContainer');
    
    if (jobData.comments.length === 0) {
        container.innerHTML = `
            <div class="text-center py-8 text-gray-500">
                <svg class="w-12 h-12 text-gray-300 mx-auto mb-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z"></path>
                </svg>
                <p class="text-sm font-medium">No comments yet</p>
                <p class="text-xs mt-1">Start the conversation with your team</p>
            </div>
        `;
        return;
    }
    
    container.innerHTML = jobData.comments.map(comment => {
        const bubbleClass = comment.isCurrentUser ? 'user' : 'staff';
        const colorClass = comment.isCurrentUser ? 'bg-blue-100 text-blue-600' : 'bg-gray-200 text-gray-600';
        
        return `
            <div class="flex gap-3 ${comment.isCurrentUser ? 'flex-row-reverse' : ''}">
                <div class="flex-shrink-0">
                    <div class="w-8 h-8 ${colorClass} rounded-full flex items-center justify-center text-xs font-semibold">
                        ${comment.avatar}
                    </div>
                </div>
                <div class="flex-1">
                    <div class="comment-bubble ${bubbleClass}">
                        <p class="text-xs font-semibold ${comment.isCurrentUser ? 'text-blue-900' : 'text-gray-900'} mb-1">
                            ${comment.author}
                        </p>
                        <p class="text-sm ${comment.isCurrentUser ? 'text-blue-800' : 'text-gray-700'}">
                            ${comment.message}
                        </p>
                        <p class="text-xs ${comment.isCurrentUser ? 'text-blue-600' : 'text-gray-500'} mt-1">
                            ${formatTimestamp(comment.timestamp)}
                        </p>
                    </div>
                </div>
            </div>
        `;
    }).join('');
    
    // Scroll to bottom
    container.scrollTop = container.scrollHeight;
}

function renderRelatedJobs() {
    const container = document.getElementById('relatedJobsContainer');
    
    container.innerHTML = relatedJobs.map(job => {
        if (job.isCurrent) {
            return `
                <div class="p-3 bg-emerald-50 border-2 border-emerald-300 rounded-lg">
                    <div class="flex items-center justify-between mb-1">
                        <p class="font-semibold text-emerald-900 text-sm">${job.name}</p>
                        <span class="text-xs px-2 py-0.5 bg-emerald-200 text-emerald-800 rounded font-medium">Current</span>
                    </div>
                    <div class="flex items-center justify-between text-xs">
                        <span class="text-emerald-700">${job.id}</span>
                        <span class="font-semibold text-emerald-900">$${job.total.toFixed(2)}</span>
                    </div>
                </div>
            `;
        }
        
        const statusMap = {
            'scheduled': { icon: '📋', class: 'bg-yellow-100 text-yellow-700' },
            'pending': { icon: '⏳', class: 'bg-gray-100 text-gray-700' },
            'in_progress': { icon: '🔄', class: 'bg-blue-100 text-blue-700' },
            'completed': { icon: '✅', class: 'bg-green-100 text-green-700' }
        };
        const status = statusMap[job.status] || statusMap['pending'];
        
        return `
            <button onclick="navigateToJob('${job.id}')" class="w-full p-3 bg-white border border-gray-200 rounded-lg hover:border-blue-300 hover:shadow-sm transition-all text-left">
                <div class="flex items-center justify-between mb-1">
                    <p class="font-semibold text-gray-900 text-sm">${job.name}</p>
                    <span class="text-xs px-2 py-0.5 ${status.class} rounded">${status.icon}</span>
                </div>
                <div class="flex items-center justify-between text-xs">
                    <span class="text-gray-600">${job.id}</span>
                    <span class="font-semibold text-gray-900">$${job.total.toFixed(2)}</span>
                </div>
            </button>
        `;
    }).join('');
}

// ============================================================================
// EVENT HANDLERS
// ============================================================================

function attachEventListeners() {
    document.getElementById('addCommentBtn').addEventListener('click', addComment);
    document.getElementById('commentInput').addEventListener('keydown', function(e) {
        if (e.key === 'Enter' && (e.ctrlKey || e.metaKey)) {
            addComment();
        }
    });
    
    // Priority radio buttons - update border colors
    const priorityInputs = document.querySelectorAll('input[name="priority"]');
    priorityInputs.forEach(input => {
        input.addEventListener('change', updatePriorityBorders);
    });
    
    // Staff search functionality
    const staffSearchInput = document.getElementById('staffSearchInput');
    const refreshRecommendationsBtn = document.getElementById('refreshRecommendations');
    
    if (staffSearchInput) {
        staffSearchInput.addEventListener('input', handleStaffSearch);
    }
    
    if (refreshRecommendationsBtn) {
        refreshRecommendationsBtn.addEventListener('click', () => loadRecommendedStaff(true));
    }
    
    // Schedule change detection - refresh recommendations when date/time changes
    const scheduleDateInput = document.getElementById('scheduleDate');
    const scheduleTimeSelect = document.getElementById('scheduleTimeSelect');
    const scheduleTimeInput = document.getElementById('scheduleTime');
    
    if (scheduleDateInput) {
        scheduleDateInput.addEventListener('change', handleScheduleChange);
    }
    
    if (scheduleTimeSelect) {
        scheduleTimeSelect.addEventListener('change', handleScheduleChange);
    }
    
    if (scheduleTimeInput) {
        scheduleTimeInput.addEventListener('change', handleScheduleChange);
    }
    
    // Action buttons
    document.getElementById('saveJobBtn').addEventListener('click', saveJobChanges);
    document.getElementById('cancelJobBtn').addEventListener('click', cancelJob);
    
    // Load recommended staff
    loadRecommendedStaff();
}

// Staff search and assignment functions
let selectedStaff = [];

function handleStaffSearch(e) {
    const query = e.target.value.toLowerCase().trim();
    const autocomplete = document.getElementById('staffAutocomplete');
    
    if (!query) {
        autocomplete.classList.add('hidden');
        return;
    }
    
    const filtered = availableStaff.filter(staff => 
        staff.name.toLowerCase().includes(query) || 
        staff.role.toLowerCase().includes(query)
    );
    
    if (filtered.length === 0) {
        autocomplete.innerHTML = '<div class="p-3 text-sm text-gray-500">No staff found</div>';
        autocomplete.classList.remove('hidden');
        return;
    }
    
    autocomplete.innerHTML = filtered.map(staff => {
        const colorMap = {
            'blue': 'bg-blue-100 text-blue-600',
            'purple': 'bg-purple-100 text-purple-600',
            'green': 'bg-green-100 text-green-600',
            'orange': 'bg-orange-100 text-orange-600',
            'red': 'bg-red-100 text-red-600'
        };
        const colorClass = colorMap[staff.color] || colorMap['blue'];
        
        return `
            <button onclick="selectStaff('${staff.id}')" class="w-full flex items-center gap-3 p-3 hover:bg-gray-50 text-left">
                <div class="w-10 h-10 ${colorClass} rounded-full flex items-center justify-center font-semibold text-sm">
                    ${staff.avatar}
                </div>
                <div class="flex-1">
                    <p class="font-semibold text-gray-900 text-sm">${staff.name}</p>
                    <p class="text-xs text-gray-600">${staff.role}</p>
                </div>
            </button>
        `;
    }).join('');
    
    autocomplete.classList.remove('hidden');
}

function selectStaff(staffId) {
    const staff = availableStaff.find(s => s.id === staffId);
    if (!staff) return;
    
    // Check if already selected
    if (selectedStaff.find(s => s.id === staffId)) {
        showToast('Staff already selected', 'error');
        return;
    }
    
    selectedStaff.push(staff);
    renderSelectedStaff();
    
    // Clear search
    document.getElementById('staffSearchInput').value = '';
    document.getElementById('staffAutocomplete').classList.add('hidden');
    
    showToast(`${staff.name} added`, 'success');
}

function removeSelectedStaff(staffId) {
    selectedStaff = selectedStaff.filter(s => s.id !== staffId);
    renderSelectedStaff();
    showToast('Staff removed', 'success');
}

function renderSelectedStaff() {
    const container = document.getElementById('selectedStaffList');
    const countEl = document.getElementById('selectedStaffCount');
    
    countEl.textContent = selectedStaff.length;
    
    if (selectedStaff.length === 0) {
        container.innerHTML = '<p class="text-xs text-gray-500 italic">No staff selected yet</p>';
        return;
    }
    
    container.innerHTML = selectedStaff.map(staff => {
        const colorMap = {
            'blue': 'bg-blue-100 text-blue-600',
            'purple': 'bg-purple-100 text-purple-600',
            'green': 'bg-green-100 text-green-600',
            'orange': 'bg-orange-100 text-orange-600',
            'red': 'bg-red-100 text-red-600'
        };
        const colorClass = colorMap[staff.color] || colorMap['blue'];
        
        return `
            <div class="flex items-center gap-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <div class="w-8 h-8 ${colorClass} rounded-full flex items-center justify-center font-semibold text-xs">
                    ${staff.avatar}
                </div>
                <div class="flex-1">
                    <p class="font-semibold text-gray-900 text-sm">${staff.name}</p>
                    <p class="text-xs text-gray-600">${staff.role}</p>
                </div>
                <button onclick="removeSelectedStaff('${staff.id}')" class="p-1 hover:bg-red-100 rounded">
                    <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
    }).join('');
}

let scheduleChanged = false;
let originalSchedule = {
    date: jobData.scheduledDate,
    time: jobData.scheduledTime
};

function handleScheduleChange() {
    const currentDate = document.getElementById('scheduleDate').value;
    const currentTimeSelect = document.getElementById('scheduleTimeSelect').value;
    const currentTime = currentTimeSelect === 'custom' ? document.getElementById('scheduleTime').value : currentTimeSelect;
    
    // Check if schedule has changed from original
    if (currentDate !== originalSchedule.date || currentTime !== originalSchedule.time) {
        scheduleChanged = true;
        
        // Show warning if staff are already selected
        if (selectedStaff.length > 0) {
            showScheduleChangeWarning();
        }
        
        // Refresh recommended staff based on new schedule
        loadRecommendedStaff(true);
    } else {
        scheduleChanged = false;
        hideScheduleChangeWarning();
    }
}

function showScheduleChangeWarning() {
    // Check if warning already exists
    let warningDiv = document.getElementById('scheduleChangeWarning');
    
    if (!warningDiv) {
        // Create warning message
        warningDiv = document.createElement('div');
        warningDiv.id = 'scheduleChangeWarning';
        warningDiv.className = 'mb-3 p-3 bg-yellow-50 border border-yellow-200 rounded-lg animate-slide-in';
        warningDiv.innerHTML = `
            <div class="flex items-start gap-2">
                <svg class="w-5 h-5 text-yellow-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"></path>
                </svg>
                <div class="flex-1">
                    <p class="text-sm font-semibold text-yellow-800">Schedule Changed</p>
                    <p class="text-xs text-yellow-700 mt-1">Selected staff may no longer be the best fit. Recommendations updated based on new schedule and availability.</p>
                </div>
                <button onclick="hideScheduleChangeWarning()" class="text-yellow-600 hover:text-yellow-800">
                    <svg class="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12"></path>
                    </svg>
                </button>
            </div>
        `;
        
        // Insert before selected staff container
        const selectedContainer = document.getElementById('selectedStaffContainer');
        selectedContainer.parentNode.insertBefore(warningDiv, selectedContainer);
    }
}

function hideScheduleChangeWarning() {
    const warningDiv = document.getElementById('scheduleChangeWarning');
    if (warningDiv) {
        warningDiv.remove();
    }
}

function loadRecommendedStaff(manualRefresh = false) {
    const container = document.getElementById('recommendedStaffList');
    
    // Get current schedule info
    const scheduleDate = document.getElementById('scheduleDate').value;
    const scheduleTime = document.getElementById('scheduleTimeSelect').value;
    
    // Simulate filtering based on schedule (distance + availability)
    // In a real app, this would call an API with date/time to get available staff
    let recommended = [...availableStaff]
        .filter(s => !selectedStaff.find(sel => sel.id === s.id));
    
    // If schedule is set, sort by availability (simulating distance + availability calculation)
    if (scheduleDate) {
        recommended = recommended.sort((a, b) => {
            // Prioritize by availability (high > medium > low)
            const availabilityScore = { 'high': 3, 'medium': 2, 'low': 1 };
            return (availabilityScore[b.availability] || 0) - (availabilityScore[a.availability] || 0);
        });
    }
    
    // Take top 3
    recommended = recommended.slice(0, 3);
    
    if (recommended.length === 0) {
        container.innerHTML = '<p class="text-xs text-gray-500 italic">All staff selected</p>';
        return;
    }
    
    container.innerHTML = recommended.map(staff => {
        const colorMap = {
            'blue': 'bg-blue-100 text-blue-600',
            'purple': 'bg-purple-100 text-purple-600',
            'green': 'bg-green-100 text-green-600',
            'orange': 'bg-orange-100 text-orange-600',
            'red': 'bg-red-100 text-red-600'
        };
        const colorClass = colorMap[staff.color] || colorMap['blue'];
        
        // Show availability badge
        const availabilityBadge = {
            'high': '<span class="px-1.5 py-0.5 bg-green-100 text-green-700 text-xs rounded">Available</span>',
            'medium': '<span class="px-1.5 py-0.5 bg-yellow-100 text-yellow-700 text-xs rounded">Limited</span>',
            'low': '<span class="px-1.5 py-0.5 bg-red-100 text-red-700 text-xs rounded">Busy</span>'
        };
        
        return `
            <button onclick="selectStaff('${staff.id}')" class="w-full flex items-center gap-3 p-2 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left">
                <div class="w-8 h-8 ${colorClass} rounded-full flex items-center justify-center font-semibold text-xs">
                    ${staff.avatar}
                </div>
                <div class="flex-1">
                    <p class="font-semibold text-gray-900 text-sm">${staff.name}</p>
                    <p class="text-xs text-gray-600">${staff.role}</p>
                    ${availabilityBadge[staff.availability] || ''}
                </div>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
            </button>
        `;
    }).join('');
    
    // Show toast if manually refreshed
    if (manualRefresh) {
        showToast('Recommendations refreshed based on current schedule', 'success');
    }
}

function addComment() {
    const input = document.getElementById('commentInput');
    const message = input.value.trim();
    
    if (!message) {
        showToast('Please enter a comment', 'error');
        return;
    }
    
    const newComment = {
        id: `comment-${Date.now()}`,
        author: 'You',
        avatar: 'ME',
        message: message,
        timestamp: new Date().toISOString(),
        isCurrentUser: true
    };
    
    jobData.comments.push(newComment);
    input.value = '';
    renderComments();
    showToast('Comment posted', 'success');
}

function navigateToJob(jobId) {
    showToast(`Navigating to job ${jobId}...`, 'success');
    // In a real app, this would navigate to the job detail page
    // window.location.href = `job_detail.html?id=${jobId}`;
}

function saveJobChanges() {
    // Gather form data
    const jobName = document.getElementById('jobName').value;
    const priority = document.querySelector('input[name="priority"]:checked')?.value;
    const scheduleDate = document.getElementById('scheduleDate').value;
    const scheduleTimeSelect = document.getElementById('scheduleTimeSelect').value;
    const scheduleTime = scheduleTimeSelect === 'custom' ? document.getElementById('scheduleTime').value : scheduleTimeSelect;
    const durationHours = document.getElementById('durationHours').value;
    const durationMinutes = document.getElementById('durationMinutes').value;
    let status = document.getElementById('statusSelect').value;
    
    // Auto-update status to "scheduled" if user selects it and has schedule/assignment info
    if (status === 'scheduled') {
        // Validate required fields for scheduled status
        if (!scheduleDate) {
            showToast('Please select a schedule date to mark as Scheduled', 'error');
            return;
        }
        
        if (selectedStaff.length === 0) {
            showToast('Please assign at least one staff member to mark as Scheduled', 'error');
            return;
        }
    }
    
    // Require comment for "On Hold" status
    if (status === 'on_hold') {
        const reason = prompt('Please provide a reason for putting this job on hold:');
        if (!reason || reason.trim() === '') {
            showToast('A reason is required to put the job on hold', 'error');
            return;
        }
        
        // Add comment to job
        const onHoldComment = {
            id: Date.now(),
            author: 'Current User',
            message: `Job put on hold. Reason: ${reason.trim()}`,
            timestamp: new Date().toISOString(),
            isCurrentUser: true
        };
        jobData.comments.push(onHoldComment);
        renderComments();
    }
    
    // Update job data
    jobData.name = jobName || jobData.name;
    jobData.priority = priority;
    jobData.scheduledDate = scheduleDate;
    jobData.scheduledTime = scheduleTime;
    jobData.assignedStaff = [...selectedStaff];
    jobData.status = status;
    
    // Update status badge
    updateStatusBadge(status);
    
    // Update the status select dropdown to reflect saved status
    document.getElementById('statusSelect').value = status;
    
    // In a real app, this would send data to the server
    console.log('Saving job changes:', jobData);
    
    showToast(`Job saved successfully! Status: ${status.charAt(0).toUpperCase() + status.slice(1)}`, 'success');
}

function cancelJob() {
    if (confirm('Are you sure you want to cancel this job? This action cannot be undone.')) {
        // Require cancellation reason
        const reason = prompt('Please provide a reason for cancelling this job:');
        if (!reason || reason.trim() === '') {
            showToast('A reason is required to cancel the job', 'error');
            return;
        }
        
        // Add cancellation comment
        const cancelComment = {
            id: Date.now(),
            author: 'Current User',
            message: `Job cancelled. Reason: ${reason.trim()}`,
            timestamp: new Date().toISOString(),
            isCurrentUser: true
        };
        jobData.comments.push(cancelComment);
        renderComments();
        
        // Update job status to cancelled
        jobData.status = 'cancelled';
        updateStatusBadge('cancelled');
        
        // Update the status select dropdown
        document.getElementById('statusSelect').value = 'cancelled';
        
        // In a real app, this would send the cancellation to the server
        console.log('Job cancelled:', jobData.id);
        
        showToast('Job has been cancelled', 'success');
        
        // Optionally redirect after a delay
        // setTimeout(() => {
        //     window.location.href = 'job_list.html';
        // }, 2000);
    }
}

// ============================================================================
// UNIFIED ASSIGNMENT FUNCTIONS
// ============================================================================

function initializeUnifiedAssignment() {
    const searchInput = document.getElementById('assignmentSearchInput');
    const autocompleteDiv = document.getElementById('assignmentAutocomplete');
    
    if (!searchInput || !autocompleteDiv) return;
    
    // Search input handler
    searchInput.addEventListener('input', handleAssignmentSearch);
    
    // Close autocomplete when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target) && !autocompleteDiv.contains(e.target)) {
            autocompleteDiv.classList.add('hidden');
        }
    });
    
    // Initialize display
    renderSelectedAssignments();
    loadRecommendedAssignments();
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
        entity.displayName.toLowerCase().includes(query)
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
        showToast('Already selected', 'error');
        return;
    }
    
    selectedAssignments.push(entity);
    renderSelectedAssignments();
    
    // Clear search
    document.getElementById('assignmentSearchInput').value = '';
    document.getElementById('assignmentAutocomplete').classList.add('hidden');
    
    showToast(`${entity.displayName} added to assignment`, 'success');
}

function removeAssignment(entityId) {
    selectedAssignments = selectedAssignments.filter(s => s.id !== entityId);
    renderSelectedAssignments();
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
            <div class="flex items-center gap-3 p-2 bg-blue-50 border border-blue-200 rounded-lg">
                <div class="w-8 h-8 ${colorClass} rounded-full flex items-center justify-center font-semibold text-xs">
                    ${entity.avatar}
                </div>
                <div class="flex-1">
                    <p class="font-semibold text-gray-900 text-sm">${entity.displayName}</p>
                    <p class="text-xs text-gray-600">${entity.role || 'Team'}</p>
                </div>
                <button onclick="removeAssignment('${entity.id}')" class="p-1 hover:bg-red-100 rounded">
                    <svg class="w-4 h-4 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
    // Get entities not already selected
    const recommended = entities.filter(e => !selectedAssignments.find(sel => sel.id === e.id)).slice(0, 3);
    
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
            <button onclick="selectAssignment('${entity.id}', '${entity.type}')" class="w-full flex items-center gap-3 p-2 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left">
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

// ============================================================================
// DURATION CALCULATION
// ============================================================================

function calculateDuration() {
    const startTimeInput = document.getElementById('startTime');
    const endTimeInput = document.getElementById('endTime');
    const durationDisplay = document.getElementById('calculatedDuration');
    
    if (!startTimeInput || !endTimeInput || !durationDisplay) return;
    
    const startTime = startTimeInput.value;
    const endTime = endTimeInput.value;
    
    if (!startTime || !endTime) {
        durationDisplay.textContent = '--';
        return;
    }
    
    // Parse times
    const [startHour, startMin] = startTime.split(':').map(Number);
    const [endHour, endMin] = endTime.split(':').map(Number);
    
    // Convert to minutes
    const startMinutes = startHour * 60 + startMin;
    let endMinutes = endHour * 60 + endMin;
    
    // Handle overnight shifts (end time next day)
    if (endMinutes <= startMinutes) {
        endMinutes += 24 * 60; // Add 24 hours
    }
    
    // Calculate duration in minutes
    const durationMinutes = endMinutes - startMinutes;
    
    // Convert back to hours and minutes
    const hours = Math.floor(durationMinutes / 60);
    const minutes = durationMinutes % 60;
    
    // Format display
    if (hours === 0) {
        durationDisplay.textContent = `${minutes} minutes`;
    } else if (minutes === 0) {
        durationDisplay.textContent = `${hours} hour${hours > 1 ? 's' : ''}`;
    } else {
        durationDisplay.textContent = `${hours} hour${hours > 1 ? 's' : ''} ${minutes} minutes`;
    }
}

// ============================================================================
// UTILITY FUNCTIONS
// ============================================================================

function formatDate(dateString) {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

function formatTime(timeString) {
    const [hours, minutes] = timeString.split(':');
    const hour = parseInt(hours);
    const ampm = hour >= 12 ? 'PM' : 'AM';
    const displayHour = hour % 12 || 12;
    return `${displayHour}:${minutes} ${ampm}`;
}

function formatTimestamp(timestamp) {
    const date = new Date(timestamp);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    
    if (diffMins < 1) return 'Just now';
    if (diffMins < 60) return `${diffMins} minute${diffMins > 1 ? 's' : ''} ago`;
    
    const diffHours = Math.floor(diffMins / 60);
    if (diffHours < 24) return `${diffHours} hour${diffHours > 1 ? 's' : ''} ago`;
    
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }) + ' at ' + 
           date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
}

function showToast(message, type = 'success') {
    const bgColor = type === 'success' ? 'bg-green-600' : 'bg-red-600';
    const toast = document.createElement('div');
    toast.className = `fixed top-4 right-4 ${bgColor} text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-slide-in`;
    toast.innerHTML = `
        <div class="flex items-center gap-2">
            <svg class="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7"></path>
            </svg>
            <span>${message}</span>
        </div>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.opacity = '0';
        toast.style.transform = 'translateY(-10px)';
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}

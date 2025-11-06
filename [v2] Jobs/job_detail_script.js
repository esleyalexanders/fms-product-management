// ============================================================================
// JOB DETAIL SCRIPT
// ============================================================================

// Sample job data
const jobData = {
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
    { id: 'staff-1', name: 'John Smith', role: 'Math Tutor', avatar: 'JS', color: 'blue', assigned: true },
    { id: 'staff-2', name: 'Emily Davis', role: 'Science Tutor', avatar: 'ED', color: 'purple', assigned: true },
    { id: 'staff-3', name: 'Michael Brown', role: 'English Tutor', avatar: 'MB', color: 'green', assigned: false },
    { id: 'staff-4', name: 'Sarah Wilson', role: 'General Tutor', avatar: 'SW', color: 'orange', assigned: false },
    { id: 'staff-5', name: 'David Lee', role: 'Math Tutor', avatar: 'DL', color: 'red', assigned: false }
];

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
        'scheduled': { icon: '📋', text: 'Scheduled', class: 'bg-yellow-100 text-yellow-700 border-yellow-200' },
        'in_progress': { icon: '🔄', text: 'In Progress', class: 'bg-blue-100 text-blue-700 border-blue-200' },
        'completed': { icon: '✅', text: 'Completed', class: 'bg-green-100 text-green-700 border-green-200' },
        'cancelled': { icon: '❌', text: 'Cancelled', class: 'bg-red-100 text-red-700 border-red-200' },
        'on_hold': { icon: '⏸️', text: 'On Hold', class: 'bg-gray-100 text-gray-700 border-gray-200' }
    };
    const statusInfo = statusMap[status] || statusMap['scheduled'];
    statusBadge.className = `px-3 py-1.5 text-xs font-semibold rounded-full ${statusInfo.class} border`;
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
        refreshRecommendationsBtn.addEventListener('click', loadRecommendedStaff);
    }
    
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

function loadRecommendedStaff() {
    const container = document.getElementById('recommendedStaffList');
    
    // Get staff not already selected
    const recommended = availableStaff.filter(s => !selectedStaff.find(sel => sel.id === s.id)).slice(0, 3);
    
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
        
        return `
            <button onclick="selectStaff('${staff.id}')" class="w-full flex items-center gap-3 p-2 border border-gray-200 rounded-lg hover:border-blue-300 hover:bg-blue-50 transition-colors text-left">
                <div class="w-8 h-8 ${colorClass} rounded-full flex items-center justify-center font-semibold text-xs">
                    ${staff.avatar}
                </div>
                <div class="flex-1">
                    <p class="font-semibold text-gray-900 text-sm">${staff.name}</p>
                    <p class="text-xs text-gray-600">${staff.role}</p>
                </div>
                <svg class="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4"></path>
                </svg>
            </button>
        `;
    }).join('');
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
    window.location.href = `job_detail.html?id=${jobId}`;
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
